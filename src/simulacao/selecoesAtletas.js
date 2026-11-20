/**
 * Números dos atletas pelas seleções: a cada torneio de seleções do ano, os
 * 23 melhores da nacionalidade formam o elenco; os titulares de cada partida
 * e os autores dos gols seguem força e posição, como nos clubes.
 * Acumula em universo.selecoes[nome].atletas[id] = {jogos, gols, assist, titulos, anos}.
 */
import {jogosDaCampanha} from '../competicoes/jogosCampanha.js';
import {NACIONALIDADES} from '../dados/data.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {setorJogador} from './forcaEquipe.js';

const LABEL = new Map(NACIONALIDADES.map(n => [n.label, n.id]));
const TIPOS = new Set(['copaMundo', 'continentalSelecao', 'eliminatorias']);
const torneioDeSelecoes = t => t && (t.selecao || TIPOS.has(t.tipo));

function escolher(lista, rng, peso) {
  const total = lista.reduce((s, p) => s + peso(p), 0);
  let x = rng() * total;
  return lista.find(p => (x -= peso(p)) < 0) || lista.at(-1);
}

export function registrarSelecoesDoAno(anterior = {}, a, jogadores = [], semente = 'mundo') {
  const selecoes = {};
  for (const [nome, s] of Object.entries(anterior || {})) selecoes[nome] = {...s, atletas: {...s.atletas}};
  const torneios = [...(a?.torneiosMundo || []), ...(a?.torneios || [])].filter(torneioDeSelecoes);
  if (!torneios.length) return selecoes;
  const porNac = new Map();
  for (const p of jogadores) {
    if (!p || p.aposentado || !p.nac) continue;
    if (!porNac.has(p.nac)) porNac.set(p.nac, []);
    porNac.get(p.nac).push(p);
  }
  const elencos = new Map();
  const elencoDe = nome => {
    if (elencos.has(nome)) return elencos.get(nome);
    const nac = LABEL.get(nome), lista = (porNac.get(nac) || []).sort((x, y) => (y.ovr || 0) - (x.ovr || 0)).slice(0, 23);
    elencos.set(nome, lista);
    return lista;
  };
  const vistos = new Set();
  for (const t of torneios) {
    if (vistos.has(`${t.nome}|${a.ano}`)) continue;
    vistos.add(`${t.nome}|${a.ano}`);
    const rng = geradorTecnico(`${semente}|${a.ano}|${t.nome}|selecoes-atletas`);
    for (const jogo of jogosDaCampanha(t)) {
      for (const [lado, gols] of [[jogo.casa, jogo.golsCasa], [jogo.fora, jogo.golsFora]]) {
        const elenco = elencoDe(lado);
        if (!elenco.length || !Number.isFinite(gols)) continue;
        const reg = selecoes[lado] ??= {atletas: {}};
        const titulares = elenco.map(p => ({p, peso: (p.ovr || 60) + rng() * 10})).sort((x, y) => y.peso - x.peso).slice(0, 11).map(x => x.p);
        for (const p of titulares) {
          const r = reg.atletas[p.id] ??= {id: p.id, nome: p.nome, posicao: p.posicao, jogos: 0, gols: 0, assist: 0, titulos: [], anos: []};
          r.jogos++;
          if (!r.anos.includes(a.ano)) r.anos.push(a.ano);
        }
        const campo = titulares.filter(p => p.posicao !== 'GOL');
        for (let g = 0; g < gols && campo.length; g++) {
          const autor = escolher(campo, rng, p => ({ATA: 7, MEI: 3, DEF: 1}[setorJogador(p)] || 1) * Math.max(1, (p.ovr || 60) - 30));
          reg.atletas[autor.id].gols++;
          const outros = campo.filter(p => p.id !== autor.id);
          if (outros.length && rng() < 0.72) reg.atletas[escolher(outros, rng, p => ({ATA: 3, MEI: 6, DEF: 2}[setorJogador(p)] || 1)).id].assist++;
        }
      }
    }
    // Título da seleção para todos os convocados que entraram em campo no torneio.
    if (t.campeao && !t.finalPendente && selecoes[t.campeao]) {
      for (const p of elencoDe(t.campeao)) {
        const r = selecoes[t.campeao].atletas[p.id];
        if (r?.anos.includes(a.ano) && !r.titulos.some(x => x.nome === t.nome && x.ano === a.ano)) r.titulos.push({nome: t.nome, ano: a.ano});
      }
    }
  }
  return selecoes;
}
