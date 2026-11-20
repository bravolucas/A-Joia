/**
 * Manchetes sobre o seu jogador ao fim da temporada, com reação da torcida e
 * efeito na moral. Os efeitos são pequenos e complementam o vínculo que a
 * temporada já gera (nota, títulos, fidelidade, momentos decisivos).
 */
import {ehClassico} from '../simulacao/classicos.js';

const ATACANTES = new Set(['ATA', 'SA', 'PE', 'PD']);
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

/** Gols e jogos do jogador em clássicos na liga (partidas registradas). */
export function classicosDaTemporada(card) {
  let jogos = 0, gols = 0;
  for (const j of card?.jogosLista || []) {
    if (j.suspenso || j.descansou || j.naoEscalado || !ehClassico(card.clube, j.adversario)) continue;
    jogos++; gols += j.golsMinha || 0;
  }
  return {jogos, gols};
}

export function manchetesDoJogador(c, card) {
  const lista = [], clube = card.clube, nome = c.nome || 'O camisa ' + (c.numero || 10);
  const add = (tipo, texto, torcida = 0, moral = 0) => lista.push({tipo, texto, torcida, moral});
  const titulos = (card.titulos || []).filter(t => typeof t === 'object').map(t => t.nome);
  const cl = classicosDaTemporada(card);
  if (cl.gols >= 2) add('classico', `${nome} decide clássicos: ${cl.gols} gols contra os rivais do ${clube}`, Math.min(6, cl.gols * 2), 3);
  else if (cl.gols === 1) add('classico', `Gol em clássico coloca ${nome} no coração da torcida do ${clube}`, 2, 2);
  else if (cl.jogos >= 3 && ATACANTES.has(c.posicao)) add('cobranca', `Torcida do ${clube} cobra gols de ${nome} nos clássicos`, -2, -2);
  if (titulos.length) add('titulo', `${nome} levanta ${titulos.length > 1 ? `${titulos.length} taças` : `a taça · ${titulos[0]}`} com o ${clube}`, 0, 4);
  if (card.bola?.pos === 1) add('premio', `${nome} é o melhor do mundo: Bola de Ouro`, 4, 6);
  else if (card.bola?.pos <= 3) add('premio', `${nome} no pódio da Bola de Ouro (${card.bola.pos}º)`, 2, 3);
  if (ATACANTES.has(c.posicao) && card.jogos >= 20 && card.gols <= 4) add('crise', `Seca de gols: ${nome} marca só ${card.gols} vezes e vira alvo de críticas`, -4, -4);
  else if (card.gols >= 20) add('artilharia', `${nome} chega a ${card.gols} gols e vira o nome da temporada no ${clube}`, 3, 3);
  if (Number.isFinite(card.nota) && card.nota < 6.2 && card.jogos >= 15) add('crise', `Temporada abaixo: nota média ${card.nota.toFixed(1)} e vaias no ${clube}`, -3, -4);
  if ((card.cairam || []).includes(clube)) add('queda', `${clube} é rebaixado; torcida protesta e cobra o elenco`, 0, -6);
  if (card.acesso) add('acesso', `Acesso! ${nome} comemora a subida do ${clube}`, 0, 4);
  return lista;
}

/** Aplica a reação na torcida do clube e na moral; devolve as manchetes aplicadas. */
export function aplicarManchetesJogador(c, card, mexerMoral) {
  const lista = manchetesDoJogador(c, card);
  const tc = card.clube;
  let torcida = 0, moral = 0;
  for (const m of lista) { torcida += m.torcida; moral += m.moral; }
  torcida = limitar(torcida, -10, 10); moral = limitar(moral, -10, 10);
  if (tc && torcida && !card.emprestado) c.torcida[tc] = limitar(Math.round((c.torcida[tc] ?? 30) + torcida), 0, 100);
  if (moral) mexerMoral(c, moral);
  card.manchetes = lista;
  card.reacaoTorcida = {torcida: card.emprestado ? 0 : torcida, moral};
  return lista;
}

/** Manchetes sobre o seu trabalho como técnico (só informativas: torcida e diretoria já reagem aos resultados). */
export function manchetesDoTecnico(nome, a = {}) {
  const lista = [], clube = a.clube;
  if (!clube) return lista;
  const add = (tipo, texto) => lista.push({tipo, texto});
  for (const t of a.titulosConquistados || []) add('titulo', `${nome} conquista ${t} no comando do ${clube}`);
  if (a.rebaixado) add('queda', `${clube} rebaixado: pressão total sobre ${nome}`);
  else if (a.posicao === 1) add('titulo', `Campanha de campeão: ${clube} termina em 1º com ${nome}`);
  if (a.cumpriuObjetivo === false && !a.rebaixado) add('cobranca', `Diretoria do ${clube} cobra ${nome}: objetivo da temporada não foi cumprido`);
  else if (a.cumpriuObjetivo && !(a.titulosConquistados || []).length) add('elogio', `${nome} cumpre o objetivo e ganha prestígio no ${clube}`);
  return lista;
}
