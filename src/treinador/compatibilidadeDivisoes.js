/**
 * Compatibilidade com carreiras iniciadas antes da atualização da Série B 2026.
 *
 * Os quatro clubes removidos do cadastro inicial continuam existindo no save.
 * Quando o treinador controla um deles, a partida atual já substitui um clube
 * da divisão para manter o calendário com 20. O universo precisa replicar a
 * mesma troca e guardar o clube substituído fora da pirâmide nacional, evitando
 * 21 equipes após a passagem do ano.
 *
 * "fora-piramide" não simula uma Série C fictícia e não apaga o histórico do
 * participante excluído; registra apenas que ele não integra A ou B do save.
 */
export const LIGA_FORA_PIRAMIDE = 'fora-piramide';

export function reconciliarClubeLegadoTecnico({
  clubes = [], ligasMundo = {}, ligaTreinador, clubeTreinador,
  elencoTreinador = 50, nomesCalendario = [],
} = {}) {
  const ehBrasil = ligaTreinador === 'serieB' || ligaTreinador === 'brasileirao';
  const cadastrado = clubes.find(clube => clube.nome === clubeTreinador);
  // Após cadastrar a Série C, Guarani/Paysandu/Amazonas/Confiança passaram a
  // existir na base. Um save antigo que os mantinha na Série B ainda requer
  // reconciliação se não houver uma movimentação explícita em ligasMundo.
  const clubeLegado = !!(clubeTreinador && ehBrasil &&
    (!cadastrado || cadastrado.liga !== ligaTreinador));
  const participantes = new Set(nomesCalendario);
  const ligas = { ...ligasMundo };
  let afastado = null;

  if (clubeLegado && ehBrasil && participantes.size === 20 && participantes.has(clubeTreinador)) {
    const ausentes = clubes.filter(clube =>
      (ligas[clube.nome] || clube.liga) === ligaTreinador &&
      !participantes.has(clube.nome));
    // Sem uma substituição inequívoca, não adivinhar o clube a ser afastado.
    if (ausentes.length === 1) {
      afastado = ausentes[0].nome;
      // Quando o usuário já existe na Série C do cadastro novo, a troca
      // preserva o tamanho das três divisões. Para clubes inexistentes na
      // base continua valendo a quarentena do save legado.
      ligas[afastado] = cadastrado?.liga === 'serieC' ? 'serieC' : LIGA_FORA_PIRAMIDE;
      ligas[clubeTreinador] = ligaTreinador;
    }
  }

  const clubesAtivos = clubes
    .filter(clube => ligas[clube.nome] !== LIGA_FORA_PIRAMIDE);
  if (clubeLegado && ehBrasil && !cadastrado) clubesAtivos.push({
    nome: clubeTreinador, liga: ligaTreinador, elenco: elencoTreinador,
    forca: elencoTreinador,
  });
  return { clubes: clubesAtivos, ligasMundo: ligas, afastado };
}
