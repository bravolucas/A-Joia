/**
 * Motor único de partidas para copas: gols por Poisson a partir de ataque e
 * defesa (força), com mando de campo, como nas ligas. As probabilidades
 * exibidas ao usuário saem do mesmo modelo usado para sortear o placar.
 */
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

/** Gols esperados por time num jogo neutro com forças iguais. */
export const MEDIA_GOLS = 1.24;
/** Gols por ponto de diferença de força. */
export const INCLINACAO_FORCA = 0.038;
/** Vantagem de jogar em casa, em gols esperados (mandante ganha, visitante perde). */
export const VANTAGEM_MANDO = 0.11;

/**
 * Gols esperados de A e B. `mando`: 1 = A em casa, -1 = B em casa, 0 = neutro.
 * `ajuste`: pontos de força extras para A (estratégia, perfil do rival).
 * `abertura`: multiplica os gols dos dois lados (jogo aberto > 1, travado < 1).
 * `final`: decisão reduz a distância entre favorito e azarão.
 */
export function golsEsperados(forcaA, forcaB, {mando = 0, ajuste = 0, abertura = 1, final = false} = {}) {
  const diff = (Number(forcaA) - Number(forcaB) + ajuste) * (final ? 0.8 : 1);
  const a = (MEDIA_GOLS + diff * INCLINACAO_FORCA + mando * VANTAGEM_MANDO) * abertura;
  const b = (MEDIA_GOLS - diff * INCLINACAO_FORCA - mando * VANTAGEM_MANDO) * abertura;
  return {a: limitar(a, 0.12, 4.2), b: limitar(b, 0.12, 4.2)};
}

function pmf(lambda, max) {
  const lista = [Math.exp(-lambda)];
  for (let k = 1; k <= max; k++) lista.push(lista[k - 1] * lambda / k);
  return lista;
}

/** Vitória, empate e derrota de A a partir dos gols esperados. */
export function probabilidadesPlacar({a, b}) {
  const max = 14, pa = pmf(a, max), pb = pmf(b, max);
  let vitoria = 0, empate = 0, derrota = 0;
  for (let i = 0; i <= max; i++) for (let j = 0; j <= max; j++) {
    const p = pa[i] * pb[j];
    if (i > j) vitoria += p; else if (i === j) empate += p; else derrota += p;
  }
  const total = vitoria + empate + derrota;
  return {vitoria: vitoria / total, empate: empate / total, derrota: derrota / total};
}

export function sortearPoisson(lambda, rng) {
  const limite = Math.exp(-Math.max(0, lambda));
  let p = 1, n = 0;
  do { n++; p *= rng(); } while (p > limite && n < 15);
  return n - 1;
}

/** Placar sorteado: { golsA, golsB }. */
export function sortearPlacar(esperados, rng) {
  return {golsA: sortearPoisson(esperados.a, rng), golsB: sortearPoisson(esperados.b, rng)};
}

/** 30 minutos extras: um terço dos gols esperados, com o desgaste do jogo. */
export function sortearProrrogacao(esperados, rng) {
  return sortearPlacar({a: esperados.a / 3 * 0.9, b: esperados.b / 3 * 0.9}, rng);
}

const CONMEBOL = /libertadores|sul-americana|sudamericana|copa do brasil|copa am[eé]rica|recopa/i;
/**
 * Prorrogação antes dos pênaltis, conforme o regulamento:
 * - Libertadores, Sul-Americana e Copa do Brasil: só na final em jogo único.
 * - Estaduais: não há.
 * - Copa América: só na final.
 * - Coupe de France: apenas na final.
 * - UEFA, copas nacionais europeias, Mundial e Copa do Mundo: sempre.
 */
export function temProrrogacao({nome = '', tipo = '', final = false, idaVolta = false} = {}) {
  if (tipo === 'estadual') return false;
  if (CONMEBOL.test(nome)) return final && !idaVolta;
  if (/coupe de france|copa da fran/i.test(nome)) return final;
  return true;
}
