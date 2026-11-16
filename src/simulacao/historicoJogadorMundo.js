/**
 * Histórico sazonal dos jogadores do mundo.
 *
 * O save utiliza tuplas compactas para evitar multiplicar propriedades e
 * strings repetidas em milhares de atletas ao longo de décadas.
 *
 * Ordem: [temporada, ano, clube, liga, idadeInicial, ovrInicial, ovrFinal,
 *         jogos, gols, assistencias, nota].
 * Dados acumulados continuam em jogador.carreira; a função de leitura
 * transforma as tuplas em registros legíveis para a interface.
 */
export const LIMITE_HISTORICO_TEMPORADAS = 30;

const inteiro = valor => Number.isFinite(valor) ? Math.round(valor) : 0;
const notaSegura = valor => Number.isFinite(valor) ? valor : 0;

export function registrarHistoricoTemporada(jogador, {
  temporada, ano = null, clube, liga = null, idadeInicial, ovrInicial,
} = {}) {
  const anteriores = Array.isArray(jogador?.historicoTemporadas)
    ? jogador.historicoTemporadas : [];
  if (!Number.isSafeInteger(temporada) || temporada < 1 || !clube) return anteriores;

  const registro = [
    temporada, Number.isInteger(ano) ? ano : null,
    clube, liga, inteiro(idadeInicial), inteiro(ovrInicial),
    inteiro(jogador.ovr), inteiro(jogador.jogos), inteiro(jogador.gols),
    inteiro(jogador.assist), notaSegura(jogador.nota),
  ];
  // Uma temporada só pode aparecer uma vez por atleta, inclusive na
  // retomada de save ou em eventual reprocessamento do mesmo ciclo.
  return [...anteriores.filter(r => Array.isArray(r) && r[0] !== temporada), registro]
    .slice(-LIMITE_HISTORICO_TEMPORADAS);
}

export function lerHistoricoTemporadas(jogador) {
  if (!Array.isArray(jogador?.historicoTemporadas)) return [];
  return jogador.historicoTemporadas
    .filter(r => Array.isArray(r) && r.length >= 11)
    .map(([temporada, ano, clube, liga, idadeInicial, ovrInicial,
      ovrFinal, jogos, gols, assistencias, nota]) => ({
      temporada, ano, clube, liga, idadeInicial, ovrInicial,
      ovrFinal, jogos, gols, assistencias, nota,
    }));
}

/**
 * Premiações individuais vinculadas ao ID do atleta (não ao nome).
 * Cada tupla: [temporada, ano, tipo, clube]. Permite que o jogador receba
 * outros prêmios no futuro sem alterar o formato das temporadas anteriores.
 */
export function registrarPremioIndividual(jogador, {
  temporada, ano = null, tipo = 'bola-de-ouro', clube = null,
} = {}) {
  const anteriores = Array.isArray(jogador?.premiacoesIndividuais)
    ? jogador.premiacoesIndividuais : [];
  if (!Number.isSafeInteger(temporada) || temporada < 1 || !tipo) return anteriores;
  const registro = [temporada, Number.isInteger(ano) ? ano : null, tipo, clube];
  return [...anteriores.filter(r =>
    Array.isArray(r) && !(r[0] === temporada && r[2] === tipo)), registro]
    .slice(-LIMITE_HISTORICO_TEMPORADAS);
}

export function lerPremiosIndividuais(jogador) {
  if (!Array.isArray(jogador?.premiacoesIndividuais)) return [];
  return jogador.premiacoesIndividuais
    .filter(r => Array.isArray(r) && r.length >= 4)
    .map(([temporada, ano, tipo, clube]) => ({temporada, ano, tipo, clube}));
}

/** Recupera negociações do histórico já gravado no cadastro unificado. */
export function lerMovimentacoesJogador(jogador) {
  if (!Array.isArray(jogador?.movimentos)) return [];
  return jogador.movimentos
    .filter(m => m && ['transferencia', 'compra', 'venda', 'fim-contrato'].includes(m.tipo))
    .map(m => ({
      temporada: Number.isInteger(m.temporada) ? m.temporada : null,
      ano: Number.isInteger(m.ano) ? m.ano : null,
      tipo: m.tipo,
      de: m.de ?? null,
      para: m.para ?? null,
      valor: m.valor ?? null,
    }));
}
