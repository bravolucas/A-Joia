/**
 * Técnicos dos clubes da IA e manchetes do mundo. Funções puras e
 * determinísticas por carreira, ano e clube.
 *
 * - Cada clube tem um técnico com nome da escola do país e uma qualidade.
 * - Campanha muito abaixo do esperado ou rebaixamento podem custar o cargo;
 *   o substituto chega com o "efeito técnico novo" (fase recuperada).
 * - As manchetes resumem campeões, zebras, quedas, trocas de técnico e o maior negócio do ano.
 */
import {gerarNomeRegional} from './nomesRegionais.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {formatarEuro} from './economia.js';
import {LIGAS} from '../dados/data.js';

const NACIONALIDADE_LIGA = {brasileirao: 'BRA', serieB: 'BRA', serieC: 'BRA', serieD: 'BRA', argentina: 'ARG', inglaterra: 'ENG', espanha: 'ESP', italia: 'ITA',
  alemanha: 'ALE', franca: 'FRA', portugal: 'POR', holanda: 'HOL', turquia: 'TUR', arabia: 'ARS', mls: 'EUA'};
const ESCOLAS_ESTRANGEIRAS = ['POR', 'ESP', 'ARG', 'ITA', 'ALE', 'FRA', 'HOL', 'BRA'];
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));

export function novoTecnico(clube, ano, semente = 'mundo') {
  const rng = geradorTecnico(`${semente}|${clube.nome}|${ano}|tecnico`);
  const local = NACIONALIDADE_LIGA[clube.liga] || 'BRA';
  // Um em cada quatro clubes contrata um técnico de outra escola.
  const nac = rng() < 0.25 ? ESCOLAS_ESTRANGEIRAS[Math.floor(rng() * ESCOLAS_ESTRANGEIRAS.length)] : local;
  const qualidade = Math.round(limitar((clube.forca ?? 65) + (rng() + rng() - 1) * 12, 40, 95));
  return {nome: gerarNomeRegional(nac, rng), nac, qualidade, desde: ano};
}

/**
 * Decide se o técnico do clube fica após a temporada. `desempenho` vai de -0,8
 * (muito abaixo do esperado) a +0,8; `movimento` pode ser 'rebaixamento'.
 */
export function avaliarTecnicoClube(atual, {clube, ano, desempenho = 0, movimento = null, semente = 'mundo'}) {
  const rng = geradorTecnico(`${semente}|${clube.nome}|${ano}|avaliacao-tecnico`);
  const tempo = ano - (atual?.desde ?? ano);
  const risco = movimento === 'rebaixamento' ? 0.8 : desempenho < -0.35 ? 0.6 : desempenho < -0.2 ? 0.25 : 0;
  if (!atual || tempo < 1 || rng() >= risco) {
    // Bons trabalhos valorizam o técnico.
    const qualidade = atual ? limitar(atual.qualidade + (desempenho > 0.2 ? 1 : desempenho < -0.2 ? -1 : 0), 35, 97) : null;
    return {tecnico: atual ? {...atual, qualidade} : novoTecnico(clube, ano - Math.floor(rng() * 4), semente), demitido: null};
  }
  return {tecnico: novoTecnico(clube, ano + 1, semente), demitido: atual};
}

/** Manchetes do ano, em ordem de importância. */
export function manchetesDoAno(a, {forcas = {}, transferencias = [], trocas = [], cairam = []} = {}) {
  const lista = [];
  for (const t of [...(a.torneiosMundo || []), ...(a.torneios || [])]) {
    if (!t?.campeao || t.finalPendente || ['eliminatorias', 'amistoso', 'estadual', 'copinha'].includes(t.tipo)) continue;
    // Zebra: campeão fora do quarto mais forte da competição e bem abaixo do favorito.
    const nomes = new Set([...(t.grupos || []).flatMap(g => (g.classificacao || []).map(x => x.nome)), ...(t.fases || []).flatMap(f => (f.jogos || []).flatMap(j => [j.casa, j.fora]))]);
    const valores = [...nomes].map(n => forcas[n]).filter(Number.isFinite).sort((x, y) => y - x);
    const corte = valores[Math.floor(valores.length / 4)] ?? Infinity;
    const zebra = valores.length >= 8 && Number.isFinite(forcas[t.campeao]) && forcas[t.campeao] < corte && valores[0] - forcas[t.campeao] >= 8;
    lista.push({peso: ['continental', 'copaMundo', 'mundial'].includes(t.tipo) ? 5 : t.tipo === 'continentalSelecao' ? 4 : 3, tipo: zebra ? 'zebra' : 'titulo',
      texto: `${zebra ? 'Zebra! ' : ''}${t.campeao} é campeão · ${t.nome}${t.vice ? ` (vice: ${t.vice})` : ''}`, clube: t.campeao});
  }
  for (const [liga, t] of Object.entries(a.classificacoesMundo || {})) {
    const campeao = t.edicaoSerieC?.campeao || t.classificacao?.[0]?.nome;
    if (!campeao || !LIGAS[liga] || ['serieC', 'serieD'].includes(liga)) continue;
    lista.push({peso: /2$|serieB/.test(liga) ? 1 : 3, tipo: 'liga', texto: `${campeao} é campeão nacional · ${LIGAS[liga].nome}`, clube: campeao});
  }
  const maior = [...transferencias].filter(x => x.tipo === 'transferencia' && x.valor > 0).sort((x, y) => y.valor - x.valor)[0];
  if (maior) lista.push({peso: 3, tipo: 'mercado', texto: `Maior negócio do ano: ${maior.nome}, do ${maior.de} para o ${maior.para}, por ${formatarEuro(maior.valor)}`, clube: maior.para});
  for (const x of trocas.slice(0, 6)) lista.push({peso: 2, tipo: 'tecnico', texto: `${x.clube} demite ${x.sai} e anuncia ${x.entra}`, clube: x.clube});
  for (const nome of cairam.slice(0, 4)) lista.push({peso: 1, tipo: 'queda', texto: `${nome} é rebaixado`, clube: nome});
  // Seleção equilibrada: zebras, continentais, ligas, mercado, técnicos, copas nacionais e quedas.
  const de = (tipo, filtro = () => true, max = 99) => lista.filter(m => m.tipo === tipo && filtro(m)).sort((x, y) => y.peso - x.peso).slice(0, max);
  const escolhidas = [...de('zebra', undefined, 3), ...de('titulo', m => m.peso >= 4, 5), ...de('liga', m => m.peso >= 3, 6), ...de('mercado'), ...de('tecnico', undefined, 3),
    ...de('titulo', m => m.peso < 4, 3), ...de('queda', undefined, 2)];
  return [...new Set(escolhidas)].slice(0, 18).map(({peso, ...m}) => ({ano: a.ano, ...m}));
}
