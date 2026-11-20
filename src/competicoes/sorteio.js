/**
 * Sorteios das competições, como na vida real: potes pelo ranking (coeficiente),
 * grupos sem clubes do mesmo país, fase de liga da UEFA com adversários por pote
 * e chaves de mata-mata conforme o regulamento. Funções puras: o mesmo `rng`
 * produz o mesmo sorteio.
 */
import {paisClubeSul} from './clubesInternacionais.js';

/** Países-sede da Copa do Mundo: classificados e cabeças de chave do pote 1. */
export const SEDES_COPA = {2026: ['EUA', 'MEX', 'CAN'], 2030: ['ESP', 'POR', 'MAR'], 2034: ['ARS']};
export const sedesDaCopa = ano => SEDES_COPA[ano] || [];

export function embaralhar(lista, rng) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const nomeDe = t => typeof t === 'string' ? t : t?.nome;
const forcaDe = t => Number(t?.forca ?? t?.elenco ?? 0);

/** País (ou confederação, em torneios de seleções) usado nas restrições do sorteio. */
const CONFEDERACAO_LIGA = {inglaterra: 'UEFA', espanha: 'UEFA', italia: 'UEFA', alemanha: 'UEFA', franca: 'UEFA', portugal: 'UEFA', holanda: 'UEFA', turquia: 'UEFA',
  brasileirao: 'CONMEBOL', serieB: 'CONMEBOL', argentina: 'CONMEBOL', sulamericano: 'CONMEBOL', arabia: 'AFC', mls: 'CONCACAF'};
const CONFEDERACAO_CLUBE = {'Al Ahly': 'CAF', 'Wydad Casablanca': 'CAF', 'Espérance de Tunis': 'CAF', 'Mamelodi Sundowns': 'CAF', 'Auckland City': 'OFC', 'Inter Miami': 'CONCACAF'};
/** Confederação de um clube (Mundial de Clubes). */
export const confederacaoClube = t => t?.confederacao || CONFEDERACAO_CLUBE[t?.nome] || CONFEDERACAO_LIGA[t?.liga] || (t?.regiao === 'sul' ? 'CONMEBOL' : t?.regiao === 'europa' ? 'UEFA' : null);

export function paisDoSorteio(t, tipo = '') {
  if (!t) return null;
  if (tipo === 'copaMundo') return t.confederacao || null;
  if (tipo === 'mundial') return confederacaoClube(t);
  if (tipo === 'continentalSelecao') return null;
  if (t.pais === 'América do Sul') return paisClubeSul(t.nome) || t.nome;
  return t.pais || t.estado || null;
}

/**
 * Ordena pelo ranking (coeficiente). Detentores do título abrem o pote 1.
 * Empates no coeficiente: força atual e, por fim, nome.
 */
export function ordenarRanking(times, ranking = {}, primeiros = []) {
  const topo = new Set(primeiros);
  return [...times].sort((a, b) =>
    (topo.has(nomeDe(b)) - topo.has(nomeDe(a))) ||
    ((ranking[nomeDe(b)] ?? 0) - (ranking[nomeDe(a)] ?? 0)) ||
    (forcaDe(b) - forcaDe(a)) || nomeDe(a).localeCompare(nomeDe(b)));
}

export function montarPotes(times, nPotes, opcoes = {}) {
  const ordem = ordenarRanking(times, opcoes.ranking, opcoes.primeiros), tamanho = Math.ceil(ordem.length / nPotes);
  return Array.from({length: nPotes}, (_, i) => ordem.slice(i * tamanho, (i + 1) * tamanho)).filter(p => p.length);
}

/**
 * Grupos: um clube de cada pote por grupo; no máximo `limitePais(pais)` clubes
 * do mesmo país por grupo (1 por padrão). Se o regulamento não couber no
 * conjunto de clubes (ex.: todos do mesmo país), a restrição é relaxada.
 */
export function sortearGrupos(potes, {rng, pais = t => t?.pais, limitePais = () => 1} = {}) {
  const nGrupos = Math.max(...potes.map(p => p.length)), contagem = new Map();
  for (const t of potes.flat()) { const p = pais(t); if (p) contagem.set(p, (contagem.get(p) || 0) + 1); }
  // País com mais clubes que grupos divide-os da forma mais espalhada possível.
  const limite = p => Math.max(limitePais(p), Math.ceil((contagem.get(p) || 0) / nGrupos));
  const tentar = folga => {
    const grupos = Array.from({length: nGrupos}, () => []);
    for (const pote of potes) {
      const ordem = embaralhar(pote, rng), ocupados = new Set();
      const cabe = (t, g) => {
        if (ocupados.has(g)) return false;
        const p = pais(t);
        return !p || grupos[g].filter(x => pais(x) === p).length < limite(p) + folga;
      };
      // Backtracking: o próximo clube sempre precisa ter um grupo possível.
      const colocar = i => {
        if (i >= ordem.length) return true;
        for (const g of embaralhar([...grupos.keys()], rng)) {
          if (!cabe(ordem[i], g)) continue;
          ocupados.add(g); grupos[g].push(ordem[i]);
          if (colocar(i + 1)) return true;
          grupos[g].pop(); ocupados.delete(g);
        }
        return false;
      };
      if (!colocar(0)) return null;
    }
    return grupos;
  };
  // Sem solução no regulamento (país com clubes demais), aceita o menor excesso possível.
  for (let folga = 0; folga <= 4; folga++) for (let i = 0; i < 30; i++) {
    const g = tentar(folga);
    if (g) return {grupos: g, restricaoRelaxada: folga > 0};
  }
  return {grupos: tentar(99), restricaoRelaxada: true};
}

/**
 * Fase de liga da UEFA: cada clube enfrenta `porPote` adversários de cada pote
 * (Champions/Europa: 4 potes × 2 = 8 jogos; Conference: 6 potes × 1 = 6 jogos),
 * nunca do próprio país e no máximo dois do mesmo país. Metade em casa.
 * Devolve as rodadas: em cada uma, todos os clubes jogam uma vez.
 */
export function sortearFaseLiga(potes, {rng, pais = t => t?.pais, porPote = 2, maxMesmoPais = 2} = {}) {
  const times = potes.flat(), indice = new Map(times.map((t, i) => [nomeDe(t), i]));
  const n = times.length;
  const montar = (respeitarPais, limite) => {
    const adj = times.map(() => new Set()), porPais = times.map(() => new Map());
    const pode = (a, b) => {
      if (a === b || adj[a].has(b)) return false;
      if (!respeitarPais) return true;
      const pa = pais(times[a]), pb = pais(times[b]);
      if (pa && pa === pb) return false;
      return !(pb && (porPais[a].get(pb) || 0) >= limite) && !(pa && (porPais[b].get(pa) || 0) >= limite);
    };
    const ligar = (a, b) => {
      adj[a].add(b); adj[b].add(a);
      const pa = pais(times[a]), pb = pais(times[b]);
      if (pb) porPais[a].set(pb, (porPais[a].get(pb) || 0) + 1);
      if (pa) porPais[b].set(pa, (porPais[b].get(pa) || 0) + 1);
    };
    const desligar = (a, b) => {
      adj[a].delete(b); adj[b].delete(a);
      const pa = pais(times[a]), pb = pais(times[b]);
      if (pb) porPais[a].set(pb, porPais[a].get(pb) - 1);
      if (pa) porPais[b].set(pa, porPais[b].get(pa) - 1);
    };
    const blocos = [];
    for (let i = 0; i < potes.length; i++) for (let j = i; j < potes.length; j++) blocos.push([i, j]);
    for (const [i, j] of blocos) {
      const A = potes[i].map(t => indice.get(nomeDe(t))), B = potes[j].map(t => indice.get(nomeDe(t)));
      let ok = false;
      for (let tentativa = 0; tentativa < 400 && !ok; tentativa++) {
        const a = embaralhar(A, rng), b = embaralhar(B, rng), arestas = [];
        if (i === j) {
          // Dentro do pote: ciclo (2 jogos) ou pares (1 jogo).
          if (porPote === 2) for (let k = 0; k < a.length; k++) arestas.push([a[k], a[(k + 1) % a.length]]);
          else for (let k = 0; k + 1 < a.length; k += 2) arestas.push([a[k], a[k + 1]]);
        } else {
          for (let k = 0; k < a.length; k++) {
            arestas.push([a[k], b[k % b.length]]);
            if (porPote === 2) arestas.push([a[k], b[(k + 1) % b.length]]);
          }
        }
        const feitas = [];
        ok = arestas.every(([x, y]) => { if (!pode(x, y)) return false; ligar(x, y); feitas.push([x, y]); return true; });
        if (!ok) for (const [x, y] of feitas) desligar(x, y);
      }
      if (!ok) return null;
    }
    return adj;
  };
  let adj = null;
  for (const [respeitar, limite] of [[true, maxMesmoPais], [true, Infinity], [false, Infinity]]) {
    for (let r = 0; r < 25 && !adj; r++) adj = montar(respeitar, limite);
    if (adj) break;
  }
  const jogos = orientarMetadeEmCasa(adj);
  const rodadas = dividirEmRodadas(jogos, n, rng);
  return {rodadas: rodadas.map(r => r.map(([c, f]) => ({casa: nomeDe(times[c]), fora: nomeDe(times[f])})))};
}

/** Circuitos de Euler: com grau par, todo clube fica com metade dos jogos em casa. */
function orientarMetadeEmCasa(adj) {
  const resto = adj.map(s => new Set(s)), jogos = [];
  for (let v = 0; v < resto.length; v++) {
    while (resto[v].size) {
      const pilha = [v];
      while (pilha.length) {
        const x = pilha.at(-1);
        if (resto[x].size) {
          const y = resto[x].values().next().value;
          resto[x].delete(y); resto[y].delete(x);
          jogos.push([x, y]);
          pilha.push(y);
        } else pilha.pop();
      }
    }
  }
  return jogos;
}

/** Rodadas em que cada clube joga uma vez (fatoração em emparelhamentos perfeitos). */
function dividirEmRodadas(jogos, n, rng) {
  const grau = Math.max(0, ...Array.from({length: n}, (_, v) => jogos.filter(j => j.includes(v)).length));
  for (let tentativa = 0; tentativa < 400; tentativa++) {
    const restantes = embaralhar(jogos, rng), rodadas = [];
    let falhou = false;
    for (let r = 0; r < grau && !falhou; r++) {
      const usados = new Set(), escolhidos = [];
      const porVertice = new Map();
      for (const j of restantes) for (const v of j) { if (!porVertice.has(v)) porVertice.set(v, []); porVertice.get(v).push(j); }
      const vertices = [...porVertice.keys()];
      const busca = (passos) => {
        if (passos > 4000) return false;
        let melhor = null, opcoes = null;
        for (const v of vertices) {
          if (usados.has(v)) continue;
          const lista = porVertice.get(v).filter(([a, b]) => !usados.has(a) && !usados.has(b));
          if (!opcoes || lista.length < opcoes.length) { melhor = v; opcoes = lista; }
          if (!lista.length) return false;
        }
        if (melhor === null) return true;
        for (const j of opcoes) {
          usados.add(j[0]); usados.add(j[1]); escolhidos.push(j);
          if (busca(passos + 1)) return true;
          escolhidos.pop(); usados.delete(j[0]); usados.delete(j[1]);
        }
        return false;
      };
      if (!busca(0)) { falhou = true; break; }
      rodadas.push(escolhidos.slice());
      const tirar = new Set(escolhidos);
      for (let k = restantes.length - 1; k >= 0; k--) if (tirar.has(restantes[k])) restantes.splice(k, 1);
    }
    if (!falhou) return rodadas;
  }
  // Raríssimo: distribui em rodadas com folgas, sem perder nenhum jogo.
  const rodadas = [];
  for (const j of jogos) {
    let r = rodadas.find(x => !x.some(([a, b]) => a === j[0] || a === j[1] || b === j[0] || b === j[1]));
    if (!r) { r = []; rodadas.push(r); }
    r.push(j);
  }
  return rodadas;
}

/**
 * Oitavas da Libertadores/Sul-Americana: líderes (pote 1) contra segundos
 * colocados (pote 2), sem repetir clubes do mesmo grupo. O líder decide em casa.
 * Devolve pares [segundo, líder] na ordem do sorteio (chave fixa até a final).
 */
export function sortearOitavasConmebol(lideres, segundos, {rng, grupoDe}) {
  const ordemLideres = embaralhar(lideres, rng);
  for (let t = 0; t < 50; t++) {
    const livres = embaralhar(segundos, rng), pares = [];
    const ok = ordemLideres.every(l => {
      const i = livres.findIndex(s => grupoDe(s) !== grupoDe(l));
      if (i < 0) return false;
      pares.push([livres.splice(i, 1)[0], l]);
      return true;
    });
    if (ok) return pares;
  }
  return ordemLideres.map((l, i) => [segundos[i], l]);
}

/**
 * Mata-mata da UEFA depois da fase de liga (36 clubes):
 * playoff 9º–24º (cabeças 9–16 contra 17–24, pares fixos de posições) e oitavas
 * com os oito primeiros. Os chaveamentos de 1º/2º só se cruzam na final.
 * Devolve `playoff` (pares [não cabeça, cabeça]) e `sementes`: o cabeça de chave
 * das oitavas que espera o vencedor de cada playoff, na ordem da chave.
 */
export function chaveUefa(classificacao, rng) {
  const nome = i => classificacao[i - 1]?.nome ?? classificacao[i - 1];
  // Grupos de posições: 1/2 x (15/16 v 17/18), 3/4 x (13/14 v 19/20), 5/6 x (11/12 v 21/22), 7/8 x (9/10 v 23/24).
  const blocos = [[1, 2, [15, 16], [17, 18]], [3, 4, [13, 14], [19, 20]], [5, 6, [11, 12], [21, 22]], [7, 8, [9, 10], [23, 24]]];
  const trilhos = {};
  for (const [s1, s2, cabecas, outros] of blocos) {
    const c = embaralhar(cabecas, rng), o = embaralhar(outros, rng), sementes = embaralhar([s1, s2], rng);
    trilhos[sementes[0]] = [nome(o[0]), nome(c[0])];
    trilhos[sementes[1]] = [nome(o[1]), nome(c[1])];
  }
  // Ordem clássica: 1 e 2 em lados opostos; 1 cruza com 8 nas quartas.
  const ordem = [1, 8, 4, 5, 2, 7, 3, 6];
  return {playoff: ordem.map(s => trilhos[s]), sementes: ordem.map(nome)};
}

/** Mundial de Clubes e Copa do Mundo (8 grupos): 1A×2B, 1C×2D... e o outro lado 1B×2A... */
export function chaveGruposFifa(grupos) {
  const g = i => grupos[i]?.classificacao || [];
  const ordem = [[0, 1], [2, 3], [4, 5], [6, 7], [1, 0], [3, 2], [5, 4], [7, 6]];
  if (grupos.length < 8) return null;
  return ordem.map(([a, b]) => [g(b)[1]?.nome, g(a)[0]?.nome]);
}

/** Pontos de coeficiente de uma campanha: vitória 2, empate 1, +1 por fase de mata-mata, título +2. */
function pontosCampanha(t, nome) {
  let p = 0;
  const jogos = [...(t.grupos || []).flatMap(g => g.jogos || []), ...(t.fases || []).flatMap(f => f.jogos || [])];
  for (const j of jogos) {
    const partidas = j.partidas?.length ? j.partidas : [j];
    for (const x of partidas) {
      if (![x.casa, x.fora].includes(nome)) continue;
      if (x.vencedor === nome || (!x.vencedor && !x.penaltis && x.golsCasa !== x.golsFora && (x.casa === nome ? x.golsCasa > x.golsFora : x.golsFora > x.golsCasa))) p += 2;
      else if (x.golsCasa === x.golsFora) p += 1;
    }
  }
  p += (t.fases || []).filter(f => (f.jogos || []).some(j => [j.casa, j.fora].includes(nome))).length;
  if (t.campeao === nome) p += 2;
  return p;
}

const familia = n => /libertadores|sul-americana/i.test(n) ? 'conmebol' : /champions league|europa league|conference/i.test(n) && !/asi|afc/i.test(n) ? 'uefa'
  : /copa do mundo|eurocopa|copa am[eé]rica|copa africana|copa da [aá]sia|copa ouro|na[cç][oõ]es da oceania|eliminat[oó]rias/i.test(n) ? 'fifa' : n;
const mesmaFamilia = (a, b) => {
  const fam = familia;
  return fam(a || '') === fam(b || '');
};

/**
 * Coeficiente vivo dos clubes: soma dos pontos nas últimas cinco edições dos
 * torneios continentais da mesma confederação (como os rankings da UEFA e da
 * CONMEBOL), com peso maior para as temporadas recentes.
 */
export function coeficientesClubes(historico = [], {competicao, ano} = {}) {
  const ranking = {};
  for (const t of historico) {
    if (!t?.nome || !mesmaFamilia(t.nome, competicao)) continue;
    // Ranking FIFA: quatro anos de jogos de seleções; clubes: cinco temporadas.
    const idade = ano - (t.ano ?? ano), janela = familia(competicao || '') === 'fifa' ? 4 : 5;
    if (idade < 1 || idade > janela) continue;
    const peso = 1 - (idade - 1) * 0.1;
    const nomes = new Set([...(t.grupos || []).flatMap(g => (g.classificacao || []).map(x => x.nome)), ...(t.fases || []).flatMap(f => (f.jogos || []).flatMap(j => [j.casa, j.fora]))]);
    for (const n of nomes) if (n) ranking[n] = (ranking[n] || 0) + pontosCampanha(t, n) * peso;
  }
  return ranking;
}

/** Campeão da edição anterior da mesma competição, quando conhecido. */
export function detentorDoTitulo(historico = [], competicao, ano) {
  // Copa do Mundo: a edição anterior foi há quatro anos.
  const anterior = /copa do mundo/i.test(competicao || '') ? ano - 4 : ano - 1;
  return historico.find(t => t?.nome === competicao && t.ano === anterior && t.campeao)?.campeao || null;
}

/** Edições salvas no histórico de uma carreira (temporadas do jogador ou do técnico). */
export function torneiosDoHistorico(temporadas = []) {
  const vistos = new Set(), lista = [];
  for (const a of temporadas || []) for (const t of [...(a?.torneios || []), ...(a?.torneiosMundo || [])]) {
    const chave = `${t?.nome}|${t?.ano ?? a?.ano}`;
    if (!t?.nome || vistos.has(chave)) continue;
    vistos.add(chave); lista.push({...t, ano: t.ano ?? a.ano});
  }
  return lista;
}

/**
 * Copa do Mundo de 48 seleções: 16 avos com o chaveamento oficial da FIFA
 * (jogos 73 a 88). Os oito melhores terceiros ocupam as vagas permitidas para
 * o seu grupo. A ordem devolvida forma a chave até a final (pares vizinhos).
 */
const JOGOS_16_AVOS = {
  73: ['2A', '2B'], 74: ['1E', '3ABCDF'], 75: ['1F', '2C'], 76: ['1C', '2F'], 77: ['1I', '3CDFGH'], 78: ['2E', '2I'],
  79: ['1A', '3CEFHI'], 80: ['1L', '3EHIJK'], 81: ['1D', '3BEFIJ'], 82: ['1G', '3AEHIJ'], 83: ['2K', '2L'], 84: ['1H', '2J'],
  85: ['1B', '3EFGIJ'], 86: ['1J', '2H'], 87: ['1K', '3DEIJL'], 88: ['2D', '2G'],
};
/** Ordem da chave: (74,77)(73,75) | (83,84)(81,82) || (76,78)(79,80) | (86,88)(85,87). */
const ORDEM_16_AVOS = [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87];

export function chaveCopa48(grupos, terceirosClassificados) {
  if (grupos.length !== 12) return null;
  const letra = i => 'ABCDEFGHIJKL'[i];
  const porLetra = Object.fromEntries(grupos.map((g, i) => [letra(i), g.classificacao || []]));
  const terceiroDe = Object.fromEntries(terceirosClassificados.map(n => [Object.keys(porLetra).find(l => porLetra[l][2]?.nome === n), n]));
  // Vagas dos terceiros: emparelhamento com as combinações permitidas pelo regulamento.
  const vagas = Object.entries(JOGOS_16_AVOS).filter(([, [, b]]) => b.startsWith('3')).map(([jogo, [, b]]) => ({jogo: Number(jogo), grupos: b.slice(1).split('')}));
  const letras = Object.keys(terceiroDe), escolha = {};
  const encaixar = i => {
    if (i >= vagas.length) return true;
    for (const l of vagas[i].grupos) {
      if (!letras.includes(l) || Object.values(escolha).includes(l)) continue;
      escolha[vagas[i].jogo] = l;
      if (encaixar(i + 1)) return true;
      delete escolha[vagas[i].jogo];
    }
    return false;
  };
  if (!encaixar(0)) {
    // Combinação fora da tabela (dados incompletos): ocupa as vagas na ordem.
    const livres = [...letras];
    for (const v of vagas) escolha[v.jogo] = livres.shift();
  }
  const time = codigo => {
    if (codigo.startsWith('3')) return null;
    const pos = Number(codigo[0]) - 1, l = codigo[1];
    return porLetra[l]?.[pos]?.nome || null;
  };
  return ORDEM_16_AVOS.flatMap(jogo => {
    const [a, b] = JOGOS_16_AVOS[jogo];
    const outro = b.startsWith('3') ? terceiroDe[escolha[jogo]] : time(b);
    return [outro, time(a)];
  });
}

/** Oito melhores terceiros: pontos, saldo, gols marcados. */
export function melhoresTerceiros(grupos, quantos = 8) {
  return grupos.map(g => g.classificacao?.[2]).filter(Boolean)
    .sort((a, b) => b.pontos - a.pontos || b.saldoGols - a.saldoGols || b.golsPro - a.golsPro || a.nome.localeCompare(b.nome))
    .slice(0, quantos).map(x => x.nome);
}

/**
 * Torneios continentais de seleções (Eurocopa, Copa América...): melhores
 * campanhas enfrentam as piores, sem reencontro do mesmo grupo na primeira fase.
 */
export function chaveSelecoes(ordenados, grupoDe) {
  const n = ordenados.length, topo = ordenados.slice(0, n / 2), base = ordenados.slice(n / 2).reverse();
  for (let i = 0; i < topo.length; i++) {
    if (grupoDe(topo[i]) !== grupoDe(base[i])) continue;
    const j = base.findIndex((b, k) => k !== i && grupoDe(b) !== grupoDe(topo[i]) && grupoDe(base[i]) !== grupoDe(topo[k]));
    if (j >= 0) [base[i], base[j]] = [base[j], base[i]];
  }
  // Ordem de chave: 1º e 2º só se cruzam na final.
  const pares = topo.map((t, i) => [base[i], t]), ordem = [];
  const posicoes = n / 2 === 8 ? [0, 7, 3, 4, 1, 6, 2, 5] : n / 2 === 4 ? [0, 3, 1, 2] : [...pares.keys()];
  for (const p of posicoes) if (pares[p]) ordem.push(...pares[p]);
  return ordem;
}
