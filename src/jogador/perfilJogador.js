/**
 * Perfil do jogador no modo rápido (inspirado na ficha do FM): papel prometido
 * × papel real, escala de moral, afeição das torcidas e "próximos passos"
 * gerados pelo momento da carreira. Funções puras.
 */
import {PAPEIS_CONTRATO} from './rapido.js';
import {idolatria} from './progressaoRapida.js';
import {ASSINATURAS} from './jornadaJogador.js';

/** Papel efetivo pela participação na última temporada no clube atual. */
export function papelReal(c) {
  const clube = c.emprestimo?.destino || c.clubeNome;
  const t = [...(c.temporadas || [])].reverse().find(x => x.clube === clube);
  if (!t) return null;
  const share = Number.isFinite(t.share) ? t.share : t.jogos ? Math.min(1, t.jogos / 38) : null;
  if (share == null) return null;
  const id = share >= 0.92 ? 'intocavel' : share >= 0.73 ? 'titular' : share >= 0.46 ? 'rotacao' : 'reserva';
  return {...PAPEIS_CONTRATO.find(p => p.id === id), share, ano: t.ano};
}

export function papelPrometido(c) {
  const k = c.contrato, clube = c.emprestimo?.destino || c.clubeNome;
  if (!k?.papel || k.clube !== clube) return null;
  return PAPEIS_CONTRATO.find(p => p.id === k.papel) || null;
}

const ORDEM = PAPEIS_CONTRATO.map(p => p.id);
/** Satisfação com o tempo de jogo, como no FM: abaixo do prometido gera insatisfação. */
export function satisfacaoTempoDeJogo(c) {
  const prometido = papelPrometido(c), real = papelReal(c);
  if (!prometido || !real) return null;
  const d = ORDEM.indexOf(real.id) - ORDEM.indexOf(prometido.id);
  return {prometido, real, diferenca: d, nivel: d >= 0 ? 'satisfeito' : d === -1 ? 'incomodado' : 'insatisfeito'};
}

const MORAL = [[85, 'Excelente'], [70, 'Muito boa'], [55, 'Boa'], [40, 'Razoável'], [25, 'Baixa'], [0, 'Muito baixa']];
export const nivelMoral = (m = 65) => {
  const v = Math.max(0, Math.min(100, Number(m) || 0));
  return {valor: v, nome: MORAL.find(([min]) => v >= min)[1]};
};

/** Afeição das torcidas por clube, do maior para o menor. */
export function torcidasDoJogador(c) {
  return Object.entries(c.torcida || {}).map(([clube, v]) => ({clube, pontos: Math.round(v), nivel: idolatria(v).atual}))
    .sort((a, b) => b.pontos - a.pontos);
}

/**
 * Próximos passos: de 0 a 4 alertas do momento da carreira, cada um com uma
 * ação sugerida ({aba} para abrir uma aba do perfil, {modal} para abrir uma
 * janela, {mercado:true} para abrir o mercado do empresário).
 */
export function proximosPassos(c, {caminho = null, possiveis = []} = {}) {
  const lista = [], clube = c.emprestimo?.destino || c.clubeNome, k = c.contrato;
  const add = (prioridade, tom, titulo, texto, acao = null) => lista.push({prioridade, tom, titulo, texto, acao});
  if (k?.clube === clube && Number.isFinite(k.restantes) && k.restantes <= 1 && !c.emprestimo)
    add(1, 'alerta', k.restantes <= 0 ? 'Contrato no fim' : 'Último ano de contrato', 'Defina o futuro: renovar ou ouvir o mercado antes que o vínculo termine.', {mercado: true, rotulo: 'Abrir mercado'});
  const sat = satisfacaoTempoDeJogo(c);
  if (sat?.nivel === 'insatisfeito' || sat?.nivel === 'incomodado')
    add(1, sat.nivel === 'insatisfeito' ? 'alerta' : 'atencao', 'Tempo de jogo abaixo do prometido', `Prometido: ${sat.prometido.label}. Na última temporada você atuou como ${sat.real.label}.`, {mercado: true, rotulo: 'Ver outras opções'});
  const real = papelReal(c);
  if (!sat && real?.id === 'reserva' && c.idade <= 21 && !c.emprestimo)
    add(2, 'atencao', 'Pouco espaço no elenco', 'Um empréstimo pode acelerar a sua evolução com minutos de verdade.', {mercado: true, rotulo: 'Procurar empréstimo'});
  if (caminho?.elegivel && Number.isFinite(caminho.ovr) && Number.isFinite(caminho.corte)) {
    const falta = caminho.corte - caminho.ovr;
    if (falta > 0 && falta <= 6) add(2, 'oportunidade', 'Seleção à vista', `Faltam ${falta} de OVR para a referência da convocação.`, {aba: 'desenvolvimento', rotulo: 'Ver caminho'});
  }
  if (nivelMoral(c.moral).valor < 40) add(2, 'alerta', 'Moral baixa', 'A confiança pesa na nota. Rotina, recuperação e bons jogos ajudam a virar a chave.');
  const torcida = c.torcida?.[clube] ?? 0;
  if (torcida < 25 && (c.temporadas || []).some(t => t.clube === clube))
    add(3, 'atencao', 'Torcida ainda desconfiada', 'Gols em clássicos, títulos e regularidade aproximam a arquibancada.', {aba: 'relacoes', rotulo: 'Ver torcidas'});
  const j = c.jornada || {};
  const pronta = ASSINATURAS.find(s => (j.assinaturas?.[s.id]?.anos?.length || 0) >= s.meta && j.assinaturaAtiva !== s.id);
  if (pronta && !j.assinaturaAtiva) add(2, 'oportunidade', 'Assinatura técnica disponível', `“${pronta.nome}” já pode ser ativada.`, {modal: 'assinatura', rotulo: 'Ativar'});
  if (c.idade >= 30 && !j.veterano) add(3, 'oportunidade', 'Hora de se reinventar?', 'A partir dos 30, trocar velocidade por leitura de jogo prolonga a carreira.', {modal: 'veterano', rotulo: 'Ver estilos'});
  if (possiveis.length && j.transicao?.restantes > 0) add(3, 'info', 'Adaptando-se à nova função', `${j.transicao.restantes} temporada(s) de adaptação pela frente.`);
  if (j.capitao?.clube === clube) add(4, 'positivo', 'Capitão do time', 'A braçadeira reforça sua liderança e o vínculo com a torcida.');
  return lista.sort((a, b) => a.prioridade - b.prioridade).slice(0, 4);
}
