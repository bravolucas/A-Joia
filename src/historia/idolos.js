/**
 * Palco de ídolos (inspirado nos "ícones e lendas" do Football Manager).
 * Cada atleta que passou pelo clube (ou pela seleção) recebe uma afeição da
 * torcida, de 0 a 100, calculada com o que ficou registrado no save:
 * tempo de casa, títulos, gols, gols em clássicos, jogos, despedida no clube
 * e, para o seu jogador, o vínculo com a torcida. Trocar o clube por um rival
 * clássico derruba a afeição.
 */
import {historicoAtleta} from '../simulacao/mundoVivo.js';
import {ehClassico} from '../simulacao/classicos.js';
import {partidasDoAtleta} from '../simulacao/historicoConfrontos.js';
import {NACIONALIDADES} from '../dados/data.js';

const universo = c => c?.tecnico?.universo || c?.universo || {};
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));
const somar = (linhas, campo) => linhas.reduce((s, l) => s + (Number(l[campo]) || 0), 0);

export const STATUS_IDOLO = [
  {id: 'lenda', nome: 'Lenda do clube', min: 75},
  {id: 'idolo', nome: 'Ídolo', min: 55},
  {id: 'favorito', nome: 'Favorito da torcida', min: 35},
];
export const statusIdolo = (afeicao, tipo = 'clube') => {
  const s = STATUS_IDOLO.find(x => afeicao >= x.min);
  return s && tipo === 'selecao' && s.id === 'lenda' ? {...s, nome: 'Lenda da seleção'} : s || null;
};

export const CRITERIOS_IDOLOS = {
  clube: [
    {id: 'torcida', nome: 'Favoritos da torcida', campo: 'afeicao', unidade: 'de afeição'},
    {id: 'conquistas', nome: 'Conquistas', campo: 'titulos', unidade: 'títulos'},
    {id: 'gols', nome: 'Artilheiros', campo: 'gols', unidade: 'gols'},
    {id: 'classicos', nome: 'Gols em clássicos', campo: 'golsClassicos', unidade: 'gols em clássicos'},
    {id: 'jogos', nome: 'Mais jogos', campo: 'jogos', unidade: 'jogos'},
    {id: 'assist', nome: 'Garçons', campo: 'assist', unidade: 'assistências'},
    {id: 'paredoes', nome: 'Paredões', campo: 'cleanSheets', unidade: 'jogos sem sofrer gol', posicao: 'GOL'},
  ],
  selecao: [
    {id: 'torcida', nome: 'Favoritos da torcida', campo: 'afeicao', unidade: 'de afeição'},
    {id: 'conquistas', nome: 'Conquistas', campo: 'titulos', unidade: 'títulos'},
    {id: 'gols', nome: 'Artilheiros', campo: 'gols', unidade: 'gols'},
    {id: 'jogos', nome: 'Mais convocados', campo: 'jogos', unidade: 'jogos'},
    {id: 'assist', nome: 'Garçons', campo: 'assist', unidade: 'assistências'},
  ],
};

/** Afeição de um atleta pelo clube, de 0 a 100. */
export function afeicaoClube(x) {
  const pontos = Math.min(30, x.temporadas * 5) + Math.min(25, x.titulos * 4) + Math.min(20, x.gols * 0.12 + x.assist * 0.06)
    + Math.min(15, x.golsClassicos * 1.5) + Math.min(10, x.jogos * 0.03) + (x.bandeira ? 8 : 0) + (x.vinculoTorcida || 0) * 0.3
    - (x.rival ? 30 : 0);
  return Math.round(limitar(pontos, 0, 100));
}
export function afeicaoSelecao(x) {
  const pontos = Math.min(30, x.jogos * 0.5) + Math.min(30, x.gols * 1.2 + x.assist * 0.4) + Math.min(36, x.titulos * 12) + Math.min(10, x.temporadas * 2);
  return Math.round(limitar(pontos, 0, 100));
}

function agregarClube(p, clube, linhas) {
  const doClube = linhas.filter(l => l.clube === clube);
  if (!doClube.length) return null;
  const comps = doClube.flatMap(l => l.porCompeticao || []);
  const anos = [...new Set(doClube.map(l => l.ano).filter(Number.isFinite))].sort((a, b) => a - b);
  const ultima = doClube.at(-1);
  const posterior = linhas.filter(l => l.ano > (anos.at(-1) ?? 0));
  // Saiu para um rival clássico ou defendeu um rival depois.
  const rival = doClube.some(l => l.destino && ehClassico(clube, l.destino)) || posterior.some(l => ehClassico(clube, l.clube));
  return {
    id: String(p.id), nome: p.nome || 'Jogador', posicao: p.posicao, voce: !!p.voce || String(p.id) === 'voce',
    clubeAtual: p.clube, jogos: somar(doClube, 'jogos'), gols: somar(doClube, 'gols'), assist: somar(doClube, 'assist'),
    cleanSheets: somar(doClube, 'cleanSheets'), titulos: doClube.reduce((s, l) => s + (l.titulos?.length || 0), 0),
    golsClassicos: somar(comps, 'golsClassicos'), jogosClassicos: somar(comps, 'jogosClassicos'),
    temporadas: anos.length, desde: anos[0] ?? null, ate: anos.at(-1) ?? null,
    bandeira: !!ultima?.aposentou && !rival, rival, ativo: p.clube === clube && !p.aposentado,
  };
}

/** Ídolos de um clube: todos os atletas com passagem registrada, ordenados pela afeição. */
export function idolosDoClube(c, clube) {
  const u = universo(c), lista = [];
  for (const p of Object.values(u.atletas || {})) {
    if (!p?.historico?.length) continue;
    const x = agregarClube(p, clube, historicoAtleta(p));
    if (!x || x.jogos <= 0) continue;
    if (x.voce) {
      // Seu jogador: o vínculo com a torcida conta, e os gols em clássicos vêm das partidas registradas.
      x.vinculoTorcida = c?.torcida?.[clube] || 0;
      const classicos = partidasDoAtleta(c, 'voce').filter(j => j.clube === clube && ehClassico(clube, j.adversario));
      if (classicos.length) { x.jogosClassicos = Math.max(x.jogosClassicos, classicos.length); x.golsClassicos = Math.max(x.golsClassicos, classicos.reduce((s, j) => s + (Number(j.gols) || 0), 0)); }
    }
    x.afeicao = afeicaoClube(x);
    x.status = statusIdolo(x.afeicao);
    lista.push(x);
  }
  return lista.sort((a, b) => b.afeicao - a.afeicao || b.jogos - a.jogos || a.nome.localeCompare(b.nome, 'pt-BR'));
}

/** Ídolos de uma seleção: convocações, gols e títulos registrados nos torneios simulados. */
export function idolosDaSelecao(c, selecao) {
  const u = universo(c), lista = [];
  for (const r of Object.values(u.selecoes?.[selecao]?.atletas || {})) {
    const x = {id: String(r.id), nome: r.nome, posicao: r.posicao, jogos: r.jogos, gols: r.gols, assist: r.assist,
      titulos: r.titulos?.length || 0, temporadas: r.anos?.length || 0, desde: Math.min(...(r.anos || [])), ate: Math.max(...(r.anos || []))};
    if (!(x.jogos > 0)) continue;
    x.afeicao = afeicaoSelecao(x);
    x.status = statusIdolo(x.afeicao, 'selecao');
    lista.push(x);
  }
  // Seu jogador pela seleção (modo jogador).
  const label = NACIONALIDADES.find(n => n.id === (c?.nac || c?.nacionalidade))?.label;
  if (label === selecao && !c?.tecnico) {
    const temporadas = (c.temporadas || []).filter(t => t.selecao?.jogos > 0);
    if (temporadas.length) {
      const x = {id: 'voce', voce: true, nome: c.nome || 'Você', posicao: c.posicao, jogos: somar(temporadas.map(t => t.selecao), 'jogos'),
        gols: somar(temporadas.map(t => t.selecao), 'gols'), assist: somar(temporadas.map(t => t.selecao), 'assist'),
        titulos: temporadas.filter(t => t.selecao.campeao).length, temporadas: temporadas.length,
        desde: temporadas[0].ano, ate: temporadas.at(-1).ano};
      x.afeicao = afeicaoSelecao(x); x.status = statusIdolo(x.afeicao, 'selecao');
      lista.push(x);
    }
  }
  return lista.sort((a, b) => b.afeicao - a.afeicao || b.jogos - a.jogos || a.nome.localeCompare(b.nome, 'pt-BR'));
}

/** Ranking de um critério (top N). */
export function rankingIdolos(lista, criterio, limite = 10) {
  return lista.filter(x => (!criterio.posicao || x.posicao === criterio.posicao) && (Number(x[criterio.campo]) || 0) > 0)
    .sort((a, b) => (b[criterio.campo] || 0) - (a[criterio.campo] || 0) || b.afeicao - a.afeicao || a.nome.localeCompare(b.nome, 'pt-BR'))
    .slice(0, limite);
}
