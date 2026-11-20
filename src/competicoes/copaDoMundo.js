/**
 * Copa do Mundo no formato atual (2026 em diante): 48 seleções, 12 grupos de
 * quatro, os dois primeiros e os oito melhores terceiros vão aos 16 avos.
 * As vagas seguem as cotas das confederações; as eliminatórias são simuladas
 * pela força (com sorte), e a repescagem intercontinental decide as duas últimas.
 */
import {SELECOES_TECNICO} from '../treinador/selecoesTecnico.js';
import {jogoEliminatorio} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';

/** Vagas diretas por confederação (inclui os países-sede). */
export const COTAS_COPA_48 = {UEFA: 16, CAF: 9, AFC: 8, CONMEBOL: 6, CONCACAF: 6, OFC: 1};
/** Repescagem intercontinental: duas vagas, uma seleção de cada confederação (a UEFA não participa). */
const REPESCAGEM = ['CAF', 'AFC', 'CONMEBOL', 'CONCACAF', 'CONCACAF', 'OFC'];

export {SEDES_COPA, sedesDaCopa} from './sorteio.js';
import {sedesDaCopa} from './sorteio.js';

const limitar = (v, a, b) => Math.max(a, Math.min(b, v));
const forca = n => Number(n.elenco ?? n.forca ?? 60);

/**
 * Classificadas para a Copa de `ano`. `garantidas`: seleções com vaga já
 * conquistada (ex.: a do técnico); `fora`: seleções eliminadas pelo técnico.
 */
export function classificadosCopaDoMundo(ano, {semente = 'mundo', garantidas = [], fora = [], selecoes = SELECOES_TECNICO} = {}) {
  const rng = geradorTecnico(`${semente}|${ano}|eliminatorias-copa`);
  const sedes = new Set(sedesDaCopa(ano)), garantir = new Set(garantidas), excluir = new Set(fora.filter(n => !garantir.has(n)));
  // Campanha nas eliminatórias: força + sorte (Gumbel), como numa tabela longa.
  const nota = n => forca(n) - 4 * Math.log(-Math.log(limitar(rng(), Number.EPSILON, 1 - Number.EPSILON)));
  const vagas = [], restantes = {};
  for (const [conf, cota] of Object.entries(COTAS_COPA_48)) {
    const lista = selecoes.filter(n => n.confederacao === conf && !excluir.has(n.nac));
    const certos = lista.filter(n => sedes.has(n.nac) || garantir.has(n.nac));
    const ordem = lista.filter(n => !certos.includes(n)).map(n => ({n, v: nota(n)})).sort((a, b) => b.v - a.v).map(x => x.n);
    const diretos = [...certos, ...ordem].slice(0, Math.max(cota, certos.length));
    vagas.push(...diretos);
    restantes[conf] = ordem.filter(n => !diretos.includes(n));
  }
  // Repescagem: os melhores não classificados de cada confederação, em jogos únicos.
  const candidatos = [];
  const usados = {};
  for (const conf of REPESCAGEM) {
    const n = restantes[conf]?.[usados[conf] || 0];
    if (n) { candidatos.push(n); usados[conf] = (usados[conf] || 0) + 1; }
  }
  const ordem = candidatos.sort((a, b) => forca(b) - forca(a));
  const jogo = (a, b) => jogoEliminatorio({nome: a.nome, forca: forca(a)}, {nome: b.nome, forca: forca(b)}, rng, {nome: 'Repescagem intercontinental', tipo: 'copaMundo', neutro: true});
  // Os dois mais bem ranqueados esperam na final de cada chave.
  const [cabeca1, cabeca2, ...outros] = ordem;
  const chaves = [[cabeca1, outros[0], outros[3]], [cabeca2, outros[1], outros[2]]];
  const repescagem = [];
  for (const [cabeca, a, b] of chaves) {
    if (!cabeca) continue;
    let desafiante = a;
    if (a && b) { const j = jogo(a, b); repescagem.push(j); desafiante = j.vencedor === a.nome ? a : b; }
    if (!desafiante) { vagas.push(cabeca); continue; }
    const j = jogo(cabeca, desafiante); repescagem.push(j);
    vagas.push(j.vencedor === cabeca.nome ? cabeca : desafiante);
  }
  // Garante 48 (dados incompletos): completa pelo ranking.
  for (const n of selecoes.filter(n => !excluir.has(n.nac)).sort((a, b) => forca(b) - forca(a))) {
    if (vagas.length >= 48) break;
    if (!vagas.includes(n)) vagas.push(n);
  }
  return {classificadas: vagas.slice(0, 48), sedes: [...sedes], repescagem};
}

/**
 * Participantes do torneio continental de seleções. A Copa América recebe
 * convidados da CONCACAF até 16 seleções (como em 2024); nas demais, a força
 * com sorte nas eliminatórias define quem entra (Eurocopa: 24).
 */
export function participantesContinentalSelecoes(confederacao, selecoes = SELECOES_TECNICO) {
  const proprias = selecoes.filter(n => n.confederacao === confederacao);
  if (confederacao !== 'CONMEBOL') return proprias;
  const convidados = selecoes.filter(n => n.confederacao === 'CONCACAF').sort((a, b) => forca(b) - forca(a)).slice(0, Math.max(0, 16 - proprias.length));
  return [...proprias, ...convidados];
}
