import { CLUBES, LIGAS, COMPS_PAIS, ESTADUAIS } from './data.js';
import { competicaoDoTitulo } from './tacas.js';
import { slugCompeticao } from './arteCompeticoes.js';

export const CHAVE_MUSEU = 'ajoia_museu_v1';
const COPAS_MUSEU = { brasileirao: 'Copa do Brasil', serieB: 'Copa do Brasil', ...Object.fromEntries(Object.entries(COMPS_PAIS).map(([id, comp]) => [id, comp.copa])) };
const CATEGORIAS = ['tacas', 'camisas', 'feitos'];
const PREMIO = /bola.?ouro|bota.?ouro|yashin|artilheiro|premio|melhor|revelacao/i;
const texto = x => typeof x === 'string' ? x.slice(0, 180) : '';
const numero = x => Number.isFinite(+x) ? Math.max(0, +x) : 0;
let sequencia = 0;
const armazenamentoMuseu = () => { try { return globalThis.localStorage; } catch { return null; } };
export const criarIdMuseu = () => globalThis.crypto?.randomUUID?.() || `carreira-${Date.now()}-${++sequencia}`;
export const museuVazio = () => ({ versao: 1, tacas: {}, camisas: {}, feitos: {} });

export function competenciaMuseu(valor) {
  const nome = texto(valor).replace(/^Campe[ãa]o(?:\s+d[oa]s?|\s+de)?\s+/i, '').replace(/^(Copa do Mundo)\s*\([^)]*\)$/i, '$1').trim();
  const aliases = { 'copa-libertadores': 'Libertadores', 'conmebol-libertadores': 'Libertadores', 'uefa-champions-league': 'Champions League', 'campeonato-brasileiro-serie-a': 'Brasileirão', 'brasileirao-serie-a': 'Brasileirão', 'campeonato-brasileiro-serie-b': 'Brasileirão Série B', 'serie-b-italia': 'Serie B (Itália)', 'copa-do-rei': 'Copa del Rey', 'copa-da-franca': 'Coupe de France', 'saudi-pro-league': 'Liga Saudita', concacaf: 'Concacaf Champions', 'sul-americana': 'Copa Sul-Americana' };
  const canonico = aliases[slugCompeticao(nome)] || nome;
  return { id: `taca-${slugCompeticao(canonico)}`, nome: canonico, tipo: competicaoDoTitulo(canonico).tipo };
}

export const FEITOS_MUSEU = [
  { id: 'primeira-taca', nome: 'O primeiro brilho', descricao: 'Conquiste seu primeiro título como jogador ou treinador.', icone: '🏆' },
  { id: 'dez-tacas', nome: 'Colecionador de glórias', descricao: 'Conquiste 10 títulos em uma mesma carreira.', icone: '👑' },
  { id: 'triplice', nome: 'Temporada perfeita', descricao: 'Conquiste 3 títulos em uma temporada.', icone: '✦' },
  { id: 'cem-gols', nome: 'Faro de gol', descricao: 'Marque 100 gols em uma carreira de jogador.', icone: '⚽' },
  { id: 'quinhentos-gols', nome: 'Máquina de gols', descricao: 'Marque 500 gols em uma carreira de jogador.', icone: '🔥' },
  { id: 'cem-assistencias', nome: 'Garçom de luxo', descricao: 'Dê 100 assistências em uma carreira de jogador.', icone: '🎯' },
  { id: 'quinhentos-jogos', nome: 'Uma vida em campo', descricao: 'Dispute 500 jogos em uma carreira de jogador.', icone: '🏟️' },
  { id: 'vinte-temporadas', nome: 'Longevidade', descricao: 'Complete 20 temporadas como jogador.', icone: '⌛' },
  { id: 'bola-ouro', nome: 'O melhor do mundo', descricao: 'Ganhe uma Bola de Ouro.', icone: '🌟' },
  { id: 'campeao-mundo', nome: 'O mundo aos seus pés', descricao: 'Conquiste uma Copa do Mundo.', icone: '🌎' },
  { id: 'idolo', nome: 'Eterno na arquibancada', descricao: 'Desbloqueie sua primeira camisa de ídolo.', icone: '💚' },
  { id: 'cinco-clubes', nome: 'Passaporte carimbado', descricao: 'Dispute temporadas por 5 clubes em uma carreira de jogador.', icone: '✈️' },
  { id: 'treinador-campeao', nome: 'Glória à beira do campo', descricao: 'Conquiste um título como treinador.', icone: '📋' },
  { id: 'trinta-treinador', nome: 'Uma era no comando', descricao: 'Complete 30 temporadas como treinador.', icone: '🎖️' },
];

const nomesCatalogo = [...Object.values(LIGAS).filter(x => !x.naoJogavel).map(x => x.nome), ...Object.values(COMPS_PAIS).flatMap(Object.values), ...Object.values(ESTADUAIS).map(x => x.nome), 'Copa do Brasil', 'Copa do Mundo', 'Mundial de Clubes', 'Libertadores', 'Copa Sul-Americana', 'Copa América', 'Eurocopa', 'Copa Ouro', 'Copa Africana de Nações', 'Copa da Ásia', 'Copa das Nações da OFC'];
export const TACAS_MUSEU = [...new Map(nomesCatalogo.filter(x => typeof x === 'string').map(nome => { const c = competenciaMuseu(nome); return [c.id, { ...c, descricao: `Conquiste a competição ${c.nome} como jogador ou treinador.` }]; })).values()];
export const CAMISAS_MUSEU = CLUBES.map(c => ({ id: `camisa-${slugCompeticao(c.nome)}`, nome: c.nome, cor: c.cor || '#12A876', descricao: `Chegue a 75 de aprovação da torcida do ${c.nome}, após disputar ao menos uma temporada pelo clube.` }));

// A identidade acompanha o save: abrir outro slot ou importar a mesma carreira
// não conta suas taças de novo. Saves antigos têm uma identidade determinística.
export function extrairConquistasMuseu(c, { modo = 'rapido', temporadas = [] } = {}) {
  if (!c || typeof c !== 'object') return [];
  const nome = texto(c.nome) || 'Atleta';
  const origem = `${modo}:${c.museuId || `antiga-${slugCompeticao([nome, c.codigo || '', c.nac || c.nacionalidade || '', c.primeiroClube || (c.temporadas || temporadas)[0]?.clube || '', (c.temporadas || temporadas)[0]?.ano || ''].join('-'))}`}`;
  const registros = [];
  const adicionar = (categoria, item, quantidade = 1, papel = 'Jogador') => registros.push({ categoria, ...item, quantidade, fonte: `${origem}:${papel}`, atleta: nome, papel });
  const tacas = [];
  if (modo === 'rapido') {
    for (const t of c.lista || []) if (t?.nome && !PREMIO.test(slugCompeticao(t.tipo || ''))) tacas.push({ nome: t.nome, ano: t.ano, clube: t.clube });
  } else {
    for (const t of temporadas) {
      for (const titulo of t.titulosLista || []) {
        let valor = typeof titulo === 'string' ? titulo : titulo?.nome;
        if (/Copa Nacional/i.test(valor || '')) {
          const liga = t.clubeObj?.liga || Object.entries(LIGAS).find(([, l]) => l.nome === t.ligaNome)?.[0] || CLUBES.find(clube => clube.nome === t.clube)?.liga || c.clube?.liga || '';
          valor = t.copaNacional?.nome || COPAS_MUSEU[liga.replace(/2$/, '')] || valor;
        }
        if (valor) tacas.push({ nome: valor, ano: t.temporadaLabel || t.idade, clube: t.clube });
      }
      if (!c.titulosSelecao?.length && (t.copa?.titulo || t.copaResultado?.titulo)) tacas.push({ nome: 'Copa do Mundo', ano: t.temporadaLabel || t.idade });
      if (!c.titulosSelecao?.length && t.continentalSelecaoResultado?.titulo) tacas.push({ nome: t.continentalSelecaoResultado.nome, ano: t.temporadaLabel || t.idade });
    }
  }
  if (modo === 'completo') for (const nome of c.titulosSelecao || []) if (typeof nome === 'string') tacas.push({ nome });
  const registrarTacas = (lista, papel) => {
    const grupos = new Map();
    for (const t of lista) {
      const item = competenciaMuseu(t.nome);
      if (!item.nome) continue;
      const grupo = grupos.get(item.id) || { ...item, quantidade: 0, ano: t.ano, clube: t.clube };
      grupo.quantidade++;
      grupos.set(item.id, grupo);
    }
    for (const item of grupos.values()) adicionar('tacas', item, item.quantidade, papel);
    return grupos;
  };
  registrarTacas(tacas, 'Jogador');
  const tecnico = c.tecnico;
  const tacasTecnico = (tecnico?.temporadas || []).flatMap(t => (t.titulosConquistados?.length ? t.titulosConquistados : t.campeao ? [LIGAS[t.liga || CLUBES.find(clube => clube.nome === t.clube)?.liga]?.nome || t.competicao || 'Campeonato nacional'] : []).map(nome => ({ nome, ano: t.ano, clube: t.clube })));
  registrarTacas(tacasTecnico, 'Treinador');
  const jogadas = modo === 'rapido' ? c.temporadas || [] : temporadas;
  const torcida = { ...(modo === 'rapido' ? c.torcida || {} : c.torcidaPorClube || {}) };
  for (const temporada of jogadas) if (typeof temporada.clube === 'string' && numero(temporada.torcidaFim) >= 75) torcida[temporada.clube] = Math.max(numero(torcida[temporada.clube]), numero(temporada.torcidaFim));
  for (const [clube, valor] of Object.entries(torcida)) {
    const disputou = jogadas.some(t => t.clube === clube || t.clube?.nome === clube);
    if (numero(valor) >= 75 && disputou) adicionar('camisas', { id: `camisa-${slugCompeticao(clube)}`, nome: clube, clube });
  }
  if (numero(tecnico?.torcida) >= 75 && tecnico.temporadas?.some(t => t.clube === tecnico.clube)) adicionar('camisas', { id: `camisa-${slugCompeticao(tecnico.clube)}`, nome: tecnico.clube, clube: tecnico.clube }, 1, 'Treinador');
  const total = tacas.length + tacasTecnico.length;
  const anos = lista => Object.values(lista.reduce((acc, t) => { if (t.ano == null) return acc; const ano = String(t.ano); acc[ano] = (acc[ano] || 0) + 1; return acc; }, {}));
  const feitos = {
    'primeira-taca': total >= 1, 'dez-tacas': total >= 10, triplice: [...anos(tacas), ...anos(tacasTecnico)].some(n => n >= 3),
    'cem-gols': numero(c.totais?.gols ?? c.gols) >= 100, 'quinhentos-gols': numero(c.totais?.gols ?? c.gols) >= 500,
    'cem-assistencias': numero(c.totais?.assist ?? c.assist) >= 100, 'quinhentos-jogos': numero(c.totais?.jogos ?? c.jogos ?? jogadas.reduce((n, t) => n + numero(t.jogos), 0)) >= 500,
    'vinte-temporadas': jogadas.length >= 20, 'bola-ouro': numero(c.titulos?.bolaOuro ?? c.bolasDeOuro) > 0,
    'campeao-mundo': tacas.some(t => competenciaMuseu(t.nome).tipo === 'copaMundo'), idolo: registros.some(r => r.categoria === 'camisas'),
    'cinco-clubes': new Set(jogadas.map(t => t.clube).filter(Boolean)).size >= 5,
    'treinador-campeao': tacasTecnico.length > 0, 'trinta-treinador': (tecnico?.temporadas?.length || 0) >= 30,
  };
  for (const f of FEITOS_MUSEU) if (feitos[f.id]) adicionar('feitos', f);
  return registros;
}

export function validarMuseu(dados) {
  if (!dados || dados.versao !== 1 || !CATEGORIAS.every(k => dados[k] && typeof dados[k] === 'object' && !Array.isArray(dados[k]))) throw new Error('Esse arquivo não é uma coleção válida do A-Joia.');
  const seguro = museuVazio();
  for (const cat of CATEGORIAS) for (const [id, item] of Object.entries(dados[cat])) {
    if (!/^[a-z0-9-]+$/.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id) || !item || typeof item.fontes !== 'object' || !item.fontes) continue;
    const fontes = {};
    for (const [fonte, registro] of Object.entries(item.fontes)) if (/^(rapido|completo):/.test(fonte) && registro && numero(registro.quantidade) > 0) fontes[fonte] = { quantidade: Math.floor(numero(registro.quantidade)), atleta: texto(registro.atleta), papel: registro.papel === 'Treinador' ? 'Treinador' : 'Jogador', clube: texto(registro.clube), ano: texto(String(registro.ano ?? '')) };
    if (Object.keys(fontes).length) seguro[cat][id] = { id, nome: texto(item.nome), tipo: texto(item.tipo), desbloqueadoEm: texto(item.desbloqueadoEm), fontes };
  }
  return seguro;
}
export function lerMuseu(storage = armazenamentoMuseu()) {
  try { const raw = storage?.getItem(CHAVE_MUSEU); return raw ? validarMuseu(JSON.parse(raw)) : museuVazio(); } catch { return museuVazio(); }
}
export function mesclarMuseu(atual, registros, agora = new Date().toISOString()) {
  const proximo = validarMuseu(atual);
  for (const r of registros) {
    if (!CATEGORIAS.includes(r.categoria) || !r.id || !r.nome) continue;
    const anterior = proximo[r.categoria][r.id];
    const item = anterior || { id: r.id, nome: r.nome, tipo: r.tipo || '', desbloqueadoEm: agora, fontes: {} };
    const fonte = item.fontes[r.fonte];
    if (!fonte || numero(r.quantidade) > fonte.quantidade) item.fontes[r.fonte] = { quantidade: numero(r.quantidade), atleta: r.atleta, papel: r.papel, clube: texto(r.clube), ano: String(r.ano ?? '') };
    proximo[r.categoria][r.id] = item;
  }
  return proximo;
}
export function registrarMuseu(c, opcoes = {}, storage = armazenamentoMuseu()) {
  try {
    if (!storage) throw new Error('Armazenamento indisponível');
    const conquistas = extrairConquistasMuseu(c, opcoes);
    const anterior = storage?.getItem(CHAVE_MUSEU);
    // Um arquivo corrompido é preservado, para não apagar a coleção silenciosamente.
    const atual = anterior ? validarMuseu(JSON.parse(anterior)) : museuVazio();
    const proximo = mesclarMuseu(atual, conquistas);
    if (JSON.stringify(atual) !== JSON.stringify(proximo)) storage.setItem(CHAVE_MUSEU, JSON.stringify(proximo));
    return { ok: true, museu: proximo };
  } catch { return { ok: false, erro: 'Não foi possível atualizar o museu. Verifique o armazenamento do navegador e guarde um backup.' }; }
}
export function importarMuseu(dados, storage = armazenamentoMuseu()) {
  const recebido = validarMuseu(dados);
  const registros = CATEGORIAS.flatMap(categoria => Object.values(recebido[categoria]).flatMap(item => Object.entries(item.fontes).map(([fonte, r]) => ({ ...item, ...r, fonte, categoria }))));
  const atual = storage.getItem(CHAVE_MUSEU);
  const museu = mesclarMuseu(atual ? validarMuseu(JSON.parse(atual)) : museuVazio(), registros);
  storage.setItem(CHAVE_MUSEU, JSON.stringify(museu));
  return museu;
}
export function sincronizarMuseuDosSaves(storage = armazenamentoMuseu()) {
  let ok = true;
  try {
    if (!storage) return false;
    const colecao = storage.getItem(CHAVE_MUSEU);
    if (colecao) validarMuseu(JSON.parse(colecao));
    let rapido;
    try { rapido = JSON.parse(storage.getItem('ajoia_rapido_v1') || 'null'); } catch { rapido = null; }
    if (rapido?.c) ok = registrarMuseu(rapido.c, {}, storage).ok && ok;
    for (const slot of ['auto', '1', '2', '3', '4', '5']) {
      let salvo;
      try { salvo = JSON.parse(storage?.getItem(`ajoia_save_${slot}`) || 'null'); } catch { continue; }
      if (salvo?.carreira || salvo?.fim?.c) ok = registrarMuseu({ ...(salvo.fim?.c || salvo.carreira), nome: salvo.nome || salvo.fim?.c?.nome || salvo.carreira?.nome }, { modo: 'completo', temporadas: salvo.temporadas || [] }, storage).ok && ok;
    }
  } catch { ok = false; }
  return ok;
}
