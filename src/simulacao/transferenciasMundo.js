/**
 * Mercado entre clubes da IA, inspirado no ciclo do Football Manager:
 * - transferências têm valor (valor de mercado ± negociação) e movem o caixa dos clubes;
 * - jovens sem espaço em clubes grandes saem emprestados e retornam na temporada seguinte;
 * - parte dos atletas em fim de contrato sai sem custos para outro clube.
 *
 * As decisões novas usam um sorteio derivado (ano, atleta, motivo) e não consomem
 * o gerador da simulação, preservando a sequência das demais etapas do mundo.
 * Valores em € mil.
 */
import {valorMercadoEuro, verbaTransferenciasEuro} from './economia.js';

/** Quantidade máxima de negócios guardados na central (temporadas mais recentes). */
export const LIMITE_CENTRAL_TRANSFERENCIAS = 900;
/** Temporadas mantidas na central. */
export const TEMPORADAS_CENTRAL = 3;

/** Número estável em [0, 1) para uma combinação de chaves. */
export function sorteioTransferencia(...partes) {
  let h = 2166136261;
  for (const c of partes.join('|')) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Escolhe um item de forma estável, sem consumir o gerador da simulação. */
export const escolherEstavel = (lista, ...chaves) =>
  lista.length ? lista[Math.min(lista.length - 1, Math.floor(sorteioTransferencia(...chaves) * lista.length))] : null;

/**
 * Valor pago numa transferência definitiva: valor de mercado no clube de origem,
 * com margem de negociação (85%–120%) e prêmio para compradores mais ricos.
 */
export function valorTransferenciaMundo(p, comprador, ano) {
  const base = valorMercadoEuro(p);
  const negociacao = 0.85 + sorteioTransferencia(ano, p.id, 'negociacao') * 0.35;
  const premio = comprador ? Math.max(0, Math.min(0.25, ((comprador.forca ?? 70) - 78) / 60)) : 0;
  return Math.max(10, Math.round(base * (negociacao + premio)));
}

/** Verba anual de cada clube a partir do valor atual do elenco no mundo. */
export function verbasPorClube(jogadores) {
  const porClube = new Map();
  for (const p of jogadores) {
    if (p.aposentado || !p.clubeNome) continue;
    if (!porClube.has(p.clubeNome)) porClube.set(p.clubeNome, []);
    porClube.get(p.clubeNome).push({valor: valorMercadoEuro(p)});
  }
  return new Map([...porClube].map(([nome, elenco]) => [nome, verbaTransferenciasEuro(elenco)]));
}

/**
 * Caixa dos clubes da IA no início da janela: começa na verba anual e recebe
 * 60% dela a cada temporada, até o teto de duas verbas acumuladas.
 */
export function renovarCaixaClubes(caixaAnterior = {}, verbas) {
  const caixa = {};
  for (const [nome, verba] of verbas) {
    const atual = caixaAnterior[nome];
    caixa[nome] = Number.isFinite(atual) ? Math.min(verba * 2, Math.max(atual, 0) + Math.round(verba * 0.6)) : verba;
  }
  return caixa;
}

/** Registro compacto exibido na central de transferências. */
export function registroCentral({ano, temporada, p, de, para, valor, tipo}) {
  return {ano, temporada, id: p.id, nome: p.nome, posicao: p.posicao, idade: p.idade, ovr: p.ovr,
    nac: p.nac, de: de ?? null, para: para ?? null, valor, tipo, moeda: 'EUR'};
}

/** Mantém apenas as temporadas recentes e um teto de registros. */
export function podarCentral(lista, temporadaAtual) {
  const minimo = (temporadaAtual ?? 0) - TEMPORADAS_CENTRAL + 1;
  return lista.filter(t => (t.temporada ?? temporadaAtual) >= minimo).slice(-LIMITE_CENTRAL_TRANSFERENCIAS);
}
