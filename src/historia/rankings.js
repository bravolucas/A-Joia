/**
 * Rankings vivos do save, com evolução ano a ano:
 * - Clubes por confederação (UEFA e CONMEBOL): pontos nos torneios continentais
 *   das últimas cinco temporadas (vitória 2, empate 1, campeão +4, vice +2).
 * - Seleções: nível do elenco somado aos resultados nos torneios de seleções
 *   dos últimos quatro anos.
 * - Treinadores: títulos ponderados e nível, incluindo o seu técnico.
 */
import {jogosDaEdicao} from '../simulacao/mundoVivo.js';
import {pontosTreinador} from '../simulacao/tecnicosMundo.js';
import {SELECOES_TECNICO} from '../treinador/selecoesTecnico.js';
import {CLUBES} from '../dados/data.js';

const universo = c => c?.tecnico?.universo || c?.universo || {};
export const FAMILIAS_RANKING = {
  uefa: {nome: 'Clubes · UEFA', teste: n => /champions league|europa league|conference/i.test(n) && !/asi|afc/i.test(n), janela: 5},
  conmebol: {nome: 'Clubes · CONMEBOL', teste: n => /libertadores|sul-americana/i.test(n), janela: 5},
  fifa: {nome: 'Seleções', teste: n => /copa do mundo|eurocopa|copa am[eé]rica|copa africana|copa da [aá]sia|copa ouro|na[cç][oõ]es da oceania/i.test(n), janela: 4},
};

function pontosPorEquipe(edicoes, teste, anoFinal, janela) {
  const mapa = new Map();
  const somar = (nome, ano, pts) => {
    if (!nome) return;
    const x = mapa.get(nome) || {nome, total: 0, porAno: {}};
    x.total += pts; x.porAno[ano] = (x.porAno[ano] || 0) + pts;
    mapa.set(nome, x);
  };
  for (const e of edicoes) {
    if (!teste(e.nome || '') || e.ano > anoFinal || e.ano <= anoFinal - janela) continue;
    for (const j of jogosDaEdicao(e)) {
      if (!Number.isFinite(j.golsCasa) || !Number.isFinite(j.golsFora)) continue;
      const [pc, pf] = j.golsCasa > j.golsFora ? [2, 0] : j.golsCasa < j.golsFora ? [0, 2] : [1, 1];
      somar(j.casa, e.ano, pc); somar(j.fora, e.ano, pf);
    }
    somar(e.campeao, e.ano, 4); somar(e.vice, e.ano, 2);
  }
  return mapa;
}

/** Ranking com posição atual, posição no ano anterior e pontos por temporada. */
export function rankingDaFamilia(c, familia) {
  const u = universo(c), f = FAMILIAS_RANKING[familia];
  const edicoes = u.edicoes || [];
  const anos = [...new Set(edicoes.filter(e => f.teste(e.nome || '')).map(e => e.ano))].sort((a, b) => a - b);
  const anoFinal = anos.at(-1);
  if (!f || anoFinal == null) return {familia, anos: [], linhas: []};
  const base = familia === 'fifa' ? new Map(SELECOES_TECNICO.map(s => [s.nome, s.elenco])) : null;
  const montar = ano => {
    const mapa = pontosPorEquipe(edicoes, f.teste, ano, f.janela);
    if (base) for (const [nome, forca] of base) { const x = mapa.get(nome) || {nome, total: 0, porAno: {}}; x.base = forca; x.pontos = x.total * 3 + forca * 10; mapa.set(nome, x); }
    const lista = [...mapa.values()].map(x => ({...x, pontos: x.pontos ?? x.total}));
    return lista.sort((a, b) => b.pontos - a.pontos || a.nome.localeCompare(b.nome, 'pt-BR'));
  };
  const atual = montar(anoFinal), antes = new Map(montar(anoFinal - 1).map((x, i) => [x.nome, i + 1]));
  const janelaAnos = anos.filter(a => a > anoFinal - f.janela);
  return {familia, anos: janelaAnos, linhas: atual.filter(x => x.pontos > 0).map((x, i) => ({...x, posicao: i + 1, anterior: antes.get(x.nome) ?? null,
    liga: CLUBES.find(cl => cl.nome === x.nome)?.liga || null}))};
}

/** Ranking de treinadores: técnicos da IA (empregados e livres) e o seu técnico. */
export function rankingTreinadores(c) {
  const u = universo(c), lista = [];
  for (const t of Object.values(u.tecnicos || {})) if (t) lista.push({...t, situacao: t.clube});
  for (const t of u.tecnicosLivres || []) lista.push({...t, situacao: 'Sem clube'});
  if (c?.tecnico) {
    const titulos = (c.tecnico.temporadas || []).flatMap(a => (a.titulosConquistados || []).map(nome => ({nome, ano: a.ano, clube: a.clube})));
    lista.push({id: 'voce', voce: true, nome: c.nome || 'Você', qualidade: c.tecnico.reputacao ?? 60, titulos, situacao: c.tecnico.clube || 'Sem clube'});
  }
  return lista.map(t => ({...t, pontos: pontosTreinador(t)})).sort((a, b) => b.pontos - a.pontos || (b.titulos?.length || 0) - (a.titulos?.length || 0) || a.nome.localeCompare(b.nome, 'pt-BR'))
    .map((t, i) => ({...t, posicao: i + 1}));
}
