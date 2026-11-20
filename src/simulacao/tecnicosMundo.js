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
  const nome = gerarNomeRegional(nac, rng);
  return {id: `${nome}|${clube.nome}|${ano}`, nome, nac, qualidade, desde: ano, clube: clube.nome, titulos: [], passagens: []};
}

const PESO_TITULO = t => /champions league|libertadores|mundial|intercontinental/i.test(t) ? 5 : /europa league|sul-americana|conference|concacaf|asi/i.test(t) ? 3
  : /copa do brasil|fa cup|copa del rey|coppa|pokal|coupe|ta[cç]a|kupas|beker|king|copa argentina/i.test(t) ? 2 : /estadual|paulista|carioca|mineiro|ga[uú]cho|campeonato [a-z]+ense/i.test(t) ? 1 : 3;

/**
 * Mercado de técnicos: vagas abertas por demissões são preenchidas, dos clubes
 * mais fortes para os mais fracos, por técnicos livres ou por técnicos em alta
 * em clubes menores (que deixam outra vaga). Quem é demitido vai para a lista
 * de livres. Devolve os técnicos, os livres e as movimentações do ano.
 */
export function preencherVagasTecnicos({tecnicos, livres = [], vagas = [], clubes = new Map(), desempenhos = new Map(), ano, semente = 'mundo', protegido = null}) {
  const mapa = {...tecnicos}, pool = [...livres], movimentos = [];
  const fila = [...vagas].sort((a, b) => (clubes.get(b)?.forca ?? 0) - (clubes.get(a)?.forca ?? 0));
  const preenchidas = new Set();
  for (let i = 0; i < fila.length && i < 200; i++) {
    const nome = fila[i], clube = clubes.get(nome);
    if (!clube || preenchidas.has(nome)) continue;
    const rng = geradorTecnico(`${semente}|${ano}|${nome}|mercado-tecnicos`);
    // Técnicos em alta em clubes menores: bom trabalho na temporada e nível compatível.
    const emAlta = Object.entries(mapa).filter(([c, t]) => c !== nome && c !== protegido && !fila.includes(c) && t && (desempenhos.get(c) ?? 0) > 0.25
      && (clubes.get(c)?.forca ?? 0) < (clube.forca ?? 0) - 3 && t.qualidade >= (clube.forca ?? 60) - 6);
    const livresAptos = pool.filter(t => t.qualidade >= (clube.forca ?? 60) - 10);
    let escolhido = null, origem = null;
    const melhorAlta = emAlta.sort((a, b) => b[1].qualidade - a[1].qualidade)[0];
    const melhorLivre = livresAptos.sort((a, b) => b.qualidade - a.qualidade || b.titulos.length - a.titulos.length)[0];
    if (melhorAlta && (!melhorLivre || melhorAlta[1].qualidade >= melhorLivre.qualidade) && rng() < 0.7) {
      escolhido = melhorAlta[1]; origem = melhorAlta[0];
      fila.push(origem); // o clube que perdeu o técnico abre uma vaga
      delete mapa[origem];
    } else if (melhorLivre && rng() < 0.85) {
      escolhido = melhorLivre; pool.splice(pool.indexOf(melhorLivre), 1);
    }
    const novo = escolhido
      ? {...escolhido, clube: nome, desde: ano + 1, passagens: [...(escolhido.passagens || []), ...(origem ? [{clube: origem, desde: escolhido.desde, ate: ano}] : [])]}
      : novoTecnico(clube, ano + 1, semente);
    movimentos.push({clube: nome, entra: novo.nome, de: origem, livre: !!escolhido && !origem});
    mapa[nome] = novo; preenchidas.add(nome);
  }
  // Livres: os mais qualificados e recentes ficam no mercado.
  return {tecnicos: mapa, livres: pool.filter(t => ano - (t.ate ?? t.desde ?? ano) <= 4).sort((a, b) => b.qualidade - a.qualidade).slice(0, 40), movimentos};
}

/** Pontos de um técnico no ranking: títulos ponderados e nível. */
export function pontosTreinador(t) {
  return Math.round((t.titulos || []).reduce((s, x) => s + PESO_TITULO(x.nome), 0) * 10 + (t.qualidade || 0) / 2);
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
  return {tecnico: null, demitido: {...atual, ate: ano, passagens: [...(atual.passagens || []), {clube: clube.nome, desde: atual.desde, ate: ano}]}};
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
  for (const x of trocas.slice(0, 6)) lista.push({peso: 2, tipo: 'tecnico', texto: !x.sai ? `${x.entra} deixa o ${x.de} e assume o ${x.clube}` : x.de ? `${x.clube} demite ${x.sai} e tira ${x.entra} do ${x.de}` : `${x.clube} demite ${x.sai} e anuncia ${x.entra}`, clube: x.clube});
  for (const nome of cairam.slice(0, 4)) lista.push({peso: 1, tipo: 'queda', texto: `${nome} é rebaixado`, clube: nome});
  // Seleção equilibrada: zebras, continentais, ligas, mercado, técnicos, copas nacionais e quedas.
  const de = (tipo, filtro = () => true, max = 99) => lista.filter(m => m.tipo === tipo && filtro(m)).sort((x, y) => y.peso - x.peso).slice(0, max);
  const escolhidas = [...de('zebra', undefined, 3), ...de('titulo', m => m.peso >= 4, 5), ...de('liga', m => m.peso >= 3, 6), ...de('mercado'), ...de('tecnico', undefined, 3),
    ...de('titulo', m => m.peso < 4, 3), ...de('queda', undefined, 2)];
  return [...new Set(escolhidas)].slice(0, 18).map(({peso, ...m}) => ({ano: a.ano, ...m}));
}

/**
 * Recordes de mercado por clube, preservados além da poda da central:
 * maior venda e maior contratação de cada clube.
 */
export function registrarMercadoDoAno(anterior = {}, transferencias = [], ano) {
  const mercado = {...(anterior || {})};
  for (const t of transferencias) {
    if (t.tipo !== 'transferencia' || !(t.valor > 0)) continue;
    const registro = {nome: t.nome, id: t.id, valor: t.valor, ano: t.ano ?? ano};
    if (t.de) { const m = mercado[t.de] = {...mercado[t.de]}; if (!(m.maiorVenda?.valor >= t.valor)) m.maiorVenda = {...registro, clube: t.para}; }
    if (t.para) { const m = mercado[t.para] = {...mercado[t.para]}; if (!(m.maiorCompra?.valor >= t.valor)) m.maiorCompra = {...registro, clube: t.de}; }
  }
  return mercado;
}
