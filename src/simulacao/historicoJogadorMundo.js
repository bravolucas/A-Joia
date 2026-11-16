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

/**
 * Títulos coletivos só são creditados a atletas que disputaram partidas da
 * competição pelo clube campeão na temporada correspondente.
 *
 * Tupla: [temporada, ano, tipo, competicao, clube].
 * Os campeões vêm do calendário oficial do mundo, não de sorteios do atleta.
 */
export const LIMITE_TITULOS_JOGADOR = 120;

export function creditarTitulosAtleta(jogador, campeoes = [], temporada) {
  if (!Number.isSafeInteger(temporada) || temporada < 1 ||
      !Array.isArray(campeoes) || !campeoes.length) return jogador;
  const historico = jogador?.historicoTemporadas?.find(
    r => Array.isArray(r) && r[0] === temporada
  );
  const clubeTemporada = historico?.[2] ?? jogador?.clubeTemporada;
  if (!clubeTemporada) return jogador;
  const disputadas = new Set((jogador.porCompeticao || [])
    .filter(c => c && c.jogos > 0 && c.nome)
    .map(c => c.nome));
  if (!disputadas.size) return jogador;

  const atuais = Array.isArray(jogador.titulosConquistados)
    ? jogador.titulosConquistados : [];
  const chaves = new Set(atuais.filter(Array.isArray)
    .map(r => [r[0], r[2], r[3], r[4]].join('|')));
  const novos = [];
  for (const titulo of campeoes) {
    if (!titulo || titulo.clube !== clubeTemporada || !titulo.nome ||
        !disputadas.has(titulo.nome)) continue;
    const chave = [temporada, titulo.tipo, titulo.nome, titulo.clube].join('|');
    if (chaves.has(chave)) continue;
    chaves.add(chave);
    novos.push([temporada, Number.isInteger(titulo.ano) ? titulo.ano : historico?.[1] ?? null,
      titulo.tipo ?? 'titulo', titulo.nome, titulo.clube]);
  }
  if (!novos.length) return jogador;
  return {
    ...jogador,
    titulosConquistados: [...atuais, ...novos].slice(-LIMITE_TITULOS_JOGADOR),
    carreira: {...jogador.carreira, titulos:(jogador.carreira?.titulos || 0) + novos.length},
  };
}

export function lerTitulosAtleta(jogador) {
  if (!Array.isArray(jogador?.titulosConquistados)) return [];
  return jogador.titulosConquistados
    .filter(r => Array.isArray(r) && r.length >= 5)
    .map(([temporada, ano, tipo, nome, clube]) => ({
      temporada, ano, tipo, nome, clube,
    }));
}
