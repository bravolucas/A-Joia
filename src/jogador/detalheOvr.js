/* ===================== MODO RÁPIDO — DETALHE DO OVR =====================
   Explica o número do topo: de onde vem cada ponto, quanto é passageiro (fase),
   quanto a troca de posição está custando e onde vale mais a pena evoluir.
   Tudo aqui só lê a carreira; nada é alterado. */
import { clamp } from '../comum/lib.js';
import { penalidadePosicao } from './posicoesCarreira.js';
import { ovrDe, posicaoDe, personaDe, cartaDe, ganhosAplicadosCarta, TETO_SUAVE } from './rapido.js';

export const ATRIBUTOS_OVR = ['velocidade', 'finalizacao', 'passe', 'drible', 'defesa', 'fisico'];
const NOMES = { velocidade: 'Velocidade', finalizacao: 'Finalização', passe: 'Passe', drible: 'Drible', defesa: 'Defesa', fisico: 'Físico' };
const NOMES_GOL = { finalizacao: 'Reflexo', drible: 'Elasticidade', defesa: 'Posicionamento' };
export const nomeAtributo = (a, posicao) => (posicao === 'GOL' && NOMES_GOL[a]) || NOMES[a] || a;

/* Mesmo cálculo de ovrDe, sem arredondar (Fintas e Perna ruim travadas em 3 no Modo Rápido). */
export function ovrExato(c, attrs = c.attrs) {
  const pesos = posicaoDe(c.posicao).pesos || {};
  let soma = 0, total = 0;
  ATRIBUTOS_OVR.forEach((a) => { const w = pesos[a] || 0.5; soma += (attrs?.[a] || 50) * w; total += w; });
  return Math.max(40, clamp(soma / total, 40, 99) - penalidadePosicao(c));
}

/* Teto que a evolução natural persegue: acima de 85 o potencial rende cada vez menos. */
const tetoEfetivo = (p) => (p > TETO_SUAVE ? Math.round(TETO_SUAVE + (p - TETO_SUAVE) * 0.55) : p);

const relevancia = (rel) => (rel >= 0.8 ? 'Essencial' : rel >= 0.5 ? 'Importante' : rel >= 0.25 ? 'Secundário' : 'Pouco relevante');

/* Fase da carreira pela curva do Modo Rápido (2 anos depois do Modo Carreira). */
export function faseCarreira(c) {
  const p = personaDe(c.personalidade);
  const pico = (p.picoFim ?? 28) + 2, declinio = (p.declinioApartir ?? 31) + 2;
  if (c.idade < pico) return { id: 'evolucao', txt: `Evoluindo: cresce rumo ao teto até os ${pico} anos.`, pico, declinio };
  if (c.idade < declinio) return { id: 'auge', txt: `Auge: estável até os ${declinio} anos. Treinos seguram o nível.`, pico, declinio };
  return { id: 'declinio', txt: `Declínio desde os ${declinio} anos: velocidade e físico caem mais rápido.`, pico, declinio };
}

/** Raio-X do OVR atual de um atleta do Modo Rápido. */
export function detalharOvr(c) {
  const pesos = posicaoDe(c.posicao).pesos || {};
  const total = ATRIBUTOS_OVR.reduce((s, a) => s + (pesos[a] || 0.5), 0);
  const maxPeso = Math.max(...ATRIBUTOS_OVR.map((a) => pesos[a] || 0.5));
  const forma = c.formaAttrs || {};
  const atributos = ATRIBUTOS_OVR.map((a) => {
    const peso = pesos[a] || 0.5, valor = c.attrs?.[a] ?? 50, fase = forma[a] || 0;
    const nivel = valor - fase;
    const teto = c.potencial?.[a] != null ? tetoEfetivo(c.potencial[a]) : null;
    return {
      id: a, nome: nomeAtributo(a, c.posicao), valor, fase, peso,
      contribuicao: (valor * peso) / total, // pontos de OVR que este atributo carrega
      porPonto: peso / total, // OVR ganho a cada +1 no atributo
      relevancia: relevancia(peso / maxPeso),
      teto, faltaTeto: teto == null ? null : Math.max(0, teto - nivel),
    };
  });
  const ovr = ovrDe(c), exato = ovrExato(c);
  const semFase = { ...c.attrs };
  ATRIBUTOS_OVR.forEach((a) => { if (forma[a]) semFase[a] = clamp(semFase[a] - forma[a], 40, 99); });
  const exatoSemFase = ovrExato(c, semFase);
  const penalidade = penalidadePosicao(c);
  const nivelFase = c.formaNivel || 0;
  // o ovrDe arredonda: o próximo ponto chega quando o valor exato passa de X,5
  const proximo = Math.min(99, ovr + 1);
  const falta = ovr >= 99 ? 0 : Math.max(0.01, ovr + 0.5 - exato);
  // onde evoluir: mais OVR por ponto primeiro; atributo já no teto vai pro fim
  const prioridades = atributos.slice().sort((x, y) => (x.faltaTeto === 0) - (y.faltaTeto === 0) || y.porPonto - x.porPonto);
  return {
    ovr, exato, posicao: posicaoDe(c.posicao).label, atributos, prioridades,
    base: Math.round(exatoSemFase + penalidade), // nível real dos atributos
    fase: { nivel: nivelFase, pontos: Math.round(exato) - Math.round(exatoSemFase), proxima: Math.trunc(nivelFase / 2) },
    penalidade, transicao: penalidade ? c.jornada?.transicao : null,
    proximo: { ovr: proximo, falta: +falta.toFixed(2), progresso: ovr >= 99 ? 1 : clamp(1 - falta, 0, 1) },
    carreira: faseCarreira(c),
  };
}

/** Quanto uma carta de pré-temporada mexe no OVR deste atleta, com as regras reais do treino. */
export function impactoCartaOvr(c, cartaOuId) {
  const carta = typeof cartaOuId === 'string' ? cartaDe(cartaOuId) : cartaOuId;
  if (!carta) return { exato: 0, ovr: 0, aplicados: {} };
  const aplicados = ganhosAplicadosCarta(c, carta);
  const depois = { ...c.attrs };
  Object.entries(aplicados).forEach(([a, d]) => { depois[a] += d; });
  const antesExato = ovrExato(c), depoisExato = ovrExato(c, depois);
  return {
    exato: +(depoisExato - antesExato).toFixed(2),
    ovr: Math.max(40, Math.round(depoisExato)) - Math.max(40, Math.round(antesExato)),
    aplicados,
  };
}
