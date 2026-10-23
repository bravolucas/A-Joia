/* ===================== MODO RÁPIDO — LÓGICA =====================
   Carreira inteira em 5 a 10 minutos: cada temporada vira uma tela
   (resumo → evento → decisão). Reaproveita os dados do Modo Carreira
   (clubes, ligas, seleções, personalidades, mundo de jogadores reais e
   a fórmula da Bola de Ouro), mas tem estado e save próprios — nada aqui
   lê ou grava o save do Modo Carreira. */

import {
  CLUBES, LIGAS, POSICOES, NACIONALIDADES, PERSONALIDADES, EMPRESARIOS, AFINIDADE_MERCADO, CLASSICOS, ORIGENS, CAMINHOS_POS_CARREIRA, LENDAS,
} from "./data.js";
import {
  rand, pick, clampR, clamp, poisson, calcOVR, evoluirAtributos,
  gerarMundoJogadores, simularTemporadaMundo, rankingBolaDeOuro, nomeMundo,
} from "./lib.js";

export const VERSAO_RAPIDO = 1;
export const CHAVE_SAVE_RAPIDO = "ajoia_rapido_v1";
export const ANO_INICIAL = 2026;
export const IDADE_INICIAL = 16;
export const IDADES_TRACO = [19, 24, 29];

/* prêmios individuais não contam como título de time */
export const ehPremioIndividual = (tipo) => tipo === "bolaOuro" || tipo === "botaOuro";
const ATTRS = ["velocidade", "finalizacao", "passe", "drible", "defesa", "fisico"];
const DEFENSIVAS = ["GOL", "ZAG", "LD", "LE", "VOL"];
const rnd = () => Math.random();
const chance = (p) => rnd() < p;
const clone = (x) => JSON.parse(JSON.stringify(x));

/* ---------- semente: o mesmo código + as mesmas escolhas = a mesma carreira ----------
   Cada etapa sorteia com um gerador próprio, derivado do código da carreira e de
   uma etiqueta (ano, evento, opção…). Assim duas pessoas com o mesmo código veem o
   mesmo mundo e só divergem quando escolhem caminhos diferentes. */
function hashTexto(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(a) {
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function comSemente(codigo, etiqueta, fn) {
  if (!codigo) return fn();
  const original = Math.random;
  Math.random = mulberry32(hashTexto(`${codigo}|${etiqueta}`));
  try { return fn(); } finally { Math.random = original; }
}
const ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const gerarCodigo = () => Array.from({ length: 6 }, () => ALFABETO_CODIGO[Math.floor(Math.random() * ALFABETO_CODIGO.length)]).join("");
export const normalizarCodigo = (s) => (s || "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 14);

/* Carreira do Dia: todo mundo recebe o mesmo atleta e o mesmo mundo no mesmo dia */
export function codigoDoDia(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `DIA-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}
export const dataDoCodigo = (codigo) => `${codigo.slice(10, 12)}/${codigo.slice(8, 10)}/${codigo.slice(4, 8)}`;
export const ehCodigoDiario = (codigo) => /^DIA-\d{8}$/.test(codigo || "");
export function dadosDoDia(codigo = codigoDoDia()) {
  return comSemente(codigo, "perfil", () => ({
    nac: pick(NACS_DESTAQUE), posicao: pick(POSICOES).id, personalidade: pick(PERSONALIDADES).id, origem: pick(ORIGENS_RAPIDO).id, codigo,
  }));
}

/* ---------- consultas básicas ---------- */
export const posicaoDe = (id) => POSICOES.find((p) => p.id === id) || POSICOES[0];
export const nacDe = (id) => NACIONALIDADES.find((n) => n.id === id) || NACIONALIDADES[0];
export const personaDe = (id) => PERSONALIDADES.find((p) => p.id === id) || PERSONALIDADES[3];
/* Liga ATUAL de cada clube nesta carreira. O cadastro (CLUBES) guarda só a liga de
   origem; acesso e rebaixamento mudam clubes de divisão ao longo dos anos e ficam
   registrados em c.ligas. Como só existe uma carreira rodando por vez, o mapa vive
   aqui no módulo e é sincronizado ao criar, carregar, jogar e fechar a temporada. */
let LIGAS_CARREIRA = {};
export function sincronizarLigas(c) { LIGAS_CARREIRA = { ...(c?.ligas || {}) }; }
const comLigaAtual = (x) => (LIGAS_CARREIRA[x.nome] ? { ...x, liga: LIGAS_CARREIRA[x.nome] } : x);
export const clubeDe = (nome) => {
  const x = CLUBES.find((y) => y.nome === nome);
  return x ? comLigaAtual(x) : { nome, forca: 60, liga: "serieB", cor: "#12A876" };
};
export const ligaDe = (id) => LIGAS[id] || { nome: "Liga", mult: 0.7 };
export const ehSegundaDivisao = (ligaId) => !!ligaDe(ligaId).promocao;
export const clubesJogaveis = () => CLUBES.map(comLigaAtual).filter((x) => !ligaDe(x.liga).naoJogavel);

/* Pirâmide de divisões: quantos sobem e quantos caem em cada país */
const PIRAMIDE = [
  { baixo: "serieB", cima: "brasileirao", vagas: 4 },
  { baixo: "inglaterra2", cima: "inglaterra", vagas: 3 },
  { baixo: "espanha2", cima: "espanha", vagas: 3 },
  { baixo: "italia2", cima: "italia", vagas: 3 },
  { baixo: "alemanha2", cima: "alemanha", vagas: 2 },
  { baixo: "franca2", cima: "franca", vagas: 2 },
  { baixo: "portugal2", cima: "portugal", vagas: 2 },
];
/* Vagas de acesso (2ª divisão) ou de rebaixamento (1ª divisão) da liga; 0 se não tiver */
export function vagasDaLiga(ligaId) {
  const p = PIRAMIDE.find((x) => x.baixo === ligaId || x.cima === ligaId);
  return p ? p.vagas : 0;
}
export const ovrDe = (c) => calcOVR({ ...c.attrs, fintas: 3, pernaRuim: 3 }, c.posicao);

/* Seleções mais citadas primeiro na tela de criação */
export const NACS_DESTAQUE = ["BRA", "ARG", "POR", "ESP", "FRA", "ENG", "ITA", "ALE", "URU", "COL", "HOL", "BEL", "MEX", "EUA", "JAP", "MAR"];

const COPA_POR_LIGA = {
  brasileirao: "Copa do Brasil", inglaterra: "FA Cup", espanha: "Copa do Rei", italia: "Coppa Italia",
  alemanha: "DFB-Pokal", franca: "Copa da França", portugal: "Taça de Portugal", arabia: "King's Cup", mls: "US Open Cup",
};

/* Clube de base: um time pequeno do país do jogador (ou de um país vizinho no mercado) */
const LIGA_BASE_POR_NAC = {
  BRA: ["serieB", "brasileirao"], ENG: ["inglaterra2"], ESP: ["espanha2"], ITA: ["italia2"], ALE: ["alemanha2"],
  FRA: ["franca2"], POR: ["portugal2", "portugal"], EUA: ["mls"], MEX: ["mls"], CAN: ["mls"],
  ARG: ["espanha2", "italia2"], URU: ["espanha2", "portugal2"], COL: ["serieB", "espanha2"], CHI: ["espanha2"],
  PAR: ["serieB"], EQU: ["serieB"], PER: ["serieB"], BOL: ["serieB"],
  HOL: ["alemanha2"], BEL: ["franca2"], SUI: ["alemanha2"], AUT: ["alemanha2"], DIN: ["alemanha2"],
  MAR: ["franca2"], SNE: ["franca2"], CSC: ["franca2"], ALG: ["franca2"], TUN: ["franca2"], CMR: ["franca2"],
  JAP: ["alemanha2"], COR: ["alemanha2"], ARS: ["arabia"], QAT: ["arabia"], EAU: ["arabia"],
};

/* Origem do atleta (mesmas do Modo Carreira): puxa o perfil de atributos
   e dá um empurrão diferente no começo da história. */
export const ORIGENS_RAPIDO = ORIGENS.map((o) => ({
  id: o.id, nome: o.nome, icone: o.icone, cor: o.cor, desc: o.desc, bias: o.bias,
  perk: {
    varzea: "+8 de fama: a torcida ama uma história de superação.",
    base: "Começa na base de um clube grande do seu país.",
    futsal: "Drible e passe acima da média desde cedo.",
    herdeiro: "+12 de fama e um empresário experiente desde o início.",
    tardio: "Corpo pronto: metade do risco de lesão até os 21.",
    prodigio: "Teto mais alto: +1 de potencial em tudo, além do perfil equilibrado.",
  }[o.id] || o.perk,
}));
export const origemDe = (id) => ORIGENS_RAPIDO.find((o) => o.id === id);

export function clubeInicial(nacId, grande = false) {
  const ligas = LIGA_BASE_POR_NAC[nacId] || ["portugal2", "inglaterra2", "franca2"];
  if (grande) {
    const primeira = ligas.map((l) => l.replace(/2$/, "")).map((l) => (l === "serieB" ? "brasileirao" : l));
    const grandes = clubesJogaveis().filter((x) => primeira.includes(x.liga) && x.forca >= 74).sort((a, b) => b.forca - a.forca).slice(0, 6);
    if (grandes.length) return pick(grandes);
  }
  let pool = clubesJogaveis().filter((x) => ligas.includes(x.liga) && x.forca <= 70);
  if (!pool.length) pool = clubesJogaveis().filter((x) => ligas.includes(x.liga));
  if (!pool.length) pool = clubesJogaveis().filter((x) => x.liga === "portugal2");
  // prefere os menores: é a base de um clube modesto
  const ordenado = [...pool].sort((a, b) => a.forca - b.forca).slice(0, Math.max(4, Math.ceil(pool.length / 2)));
  return pick(ordenado);
}

/* ---------- traços de carreira (as antigas insígnias, escolhidas em marcos) ---------- */
export const TRACOS_RAPIDO = [
  { id: "finalizador", nome: "Finalizador Clínico", icone: "🎯", desc: "+15% de gols por temporada.", golsMult: 1.15, posicoes: ["MEI", "PD", "PE", "SA", "ATA", "MC"] },
  { id: "maestro", nome: "Maestro", icone: "🎼", desc: "+20% de assistências e +1 de passe agora.", assistMult: 1.2, ganho: { passe: 1 } },
  { id: "muralha", nome: "Muralha", icone: "🛡️", desc: "Notas mais altas e o time sofre menos: mais chance de título.", notaBonus: 0.25, forcaTime: 1.5, posicoes: ["GOL", "ZAG", "LD", "LE", "VOL", "MC"] },
  { id: "fenomeno", nome: "Fenômeno Físico", icone: "💪", desc: "Metade do risco de lesão e declínio físico mais lento.", lesaoMult: 0.5, declinio: 0.85, ganho: { fisico: 2 } },
  { id: "decisao", nome: "Jogador de Decisão", icone: "🔥", desc: "Mais chance em finais e pênaltis decisivos.", mataMata: 0.05, penalti: 0.12 },
  { id: "lider", nome: "Líder Nato", icone: "🎖️", desc: "O time joga mais por você: +2 de força do clube e torcida cresce.", forcaTime: 2, torcidaAno: 3 },
  { id: "idolo", nome: "Ídolo Eterno", icone: "💚", desc: "A torcida te abraça 50% mais rápido.", torcidaMult: 1.5 },
  { id: "imortal", nome: "Imortal", icone: "♾️", desc: "Declínio por idade 40% mais lento.", declinio: 0.6 },
  { id: "cidadao", nome: "Cidadão do Mundo", icone: "🌍", desc: "Mais propostas, de qualquer país.", ofertasExtra: 1, semFronteira: true },
  { id: "velocista", nome: "Velocista", icone: "⚡", desc: "+3 de velocidade e +1 de drible agora.", ganho: { velocidade: 3, drible: 1 } },
  { id: "holofote", nome: "Nascido pro Holofote", icone: "📸", desc: "Fama sobe mais rápido e pesa na Bola de Ouro.", famaMult: 1.5, bolaBonus: 6 },
];
export const tracoDe = (id) => TRACOS_RAPIDO.find((t) => t.id === id);
const efeitosTracos = (c) => (c.tracos || []).map(tracoDe).filter(Boolean);
const multTraco = (c, k) => efeitosTracos(c).reduce((m, t) => m * (t[k] ?? 1), 1);
const somaTraco = (c, k) => efeitosTracos(c).reduce((s, t) => s + (t[k] ?? 0), 0);

export function opcoesDeTraco(c) { return comSemente(c.codigo, `traco:${c.ano}`, () => opcoesDeTracoBase(c)); }
function opcoesDeTracoBase(c) {
  const disp = TRACOS_RAPIDO.filter((t) => !(c.tracos || []).includes(t.id) && (!t.posicoes || t.posicoes.includes(c.posicao)));
  const out = [];
  const pool = [...disp];
  while (out.length < 3 && pool.length) out.push(pool.splice(rand(0, pool.length - 1), 1)[0]);
  return out;
}

export function escolherTraco(c0, id) {
  const c = clone(c0);
  const t = tracoDe(id);
  if (!t) return c;
  c.tracos = [...(c.tracos || []), id];
  Object.entries(t.ganho || {}).forEach(([a, v]) => { c.attrs[a] = clampR(c.attrs[a] + v, 40, 99); c.potencial[a] = clampR(c.potencial[a] + v, 40, 99); });
  c.tracosEscolhidos = { ...(c.tracosEscolhidos || {}), [c.idade]: id };
  return c;
}

export const precisaEscolherTraco = (c) => IDADES_TRACO.includes(c.idade) && !(c.tracosEscolhidos || {})[c.idade] && !c.aposentado;

/* ---------- criação ---------- */
export function criarJogador(dados) {
  const codigo = normalizarCodigo(dados.codigo) || gerarCodigo();
  sincronizarLigas(null); // carreira nova: todo mundo na liga de origem
  const c = comSemente(codigo, "criar", () => criarJogadorBase(dados));
  c.codigo = codigo;
  c.diario = ehCodigoDiario(codigo);
  return c;
}

/* ---------- pé preferido, número e ritmo ---------- */
export const PES = [
  { id: "destro", nome: "Destro", icone: "🦶", desc: "+1 de finalização e +1 de passe no teto." },
  { id: "canhoto", nome: "Canhoto", icone: "🫲", desc: "Raro e imprevisível: +2 de drible no teto." },
  { id: "ambidestro", nome: "Ambidestro", icone: "🔁", desc: "Chuta com as duas: +6% de gols e assistências, mas −1 em todo o teto." },
];
export const peDe = (id) => PES.find((p) => p.id === id) || PES[0];
export const NUMERO_PADRAO = { GOL: 1, ZAG: 4, LD: 2, LE: 6, VOL: 5, MC: 8, MEI: 10, PD: 7, PE: 11, SA: 10, ATA: 9 };
export const numeroDe = (c) => c.numero || NUMERO_PADRAO[c.posicao] || 8;
export const RITMOS = [
  { id: "intenso", nome: "Intenso", icone: "🔥", desc: "Uma decisão por temporada, imersão total" },
  { id: "normal", nome: "Normal", icone: "⚽", desc: "Decisões a cada 2 temporadas" },
  { id: "expresso", nome: "Expresso", icone: "⚡", desc: "Decisões a cada 3 temporadas, mais rápido" },
];
export const ritmoDe = (id) => RITMOS.find((r) => r.id === id) || RITMOS[1];

/* Três clubes de base possíveis para a pessoa escolher onde começar */
export function opcoesClubeInicial(nac, origem) {
  const vistos = new Set(), out = [];
  for (let i = 0; i < 30 && out.length < 3; i++) {
    const x = clubeInicial(nac, origem === "base");
    if (!vistos.has(x.nome)) { vistos.add(x.nome); out.push(x); }
  }
  return out;
}

/* ---------- estado mental ---------- */
export function mexerMoral(c, d) { c.moral = clampR(Math.round((c.moral ?? 65) + d), 0, 100); return c.moral; }
export function estadoMental(m = 65) {
  if (m >= 78) return { nome: "Confiante", icone: "😎", cor: "#1BC28A" };
  if (m >= 58) return { nome: "Tranquilo", icone: "🙂", cor: "#7FE3BC" };
  if (m >= 38) return { nome: "Oscilando", icone: "😐", cor: "#EBC557" };
  if (m >= 20) return { nome: "Abalado", icone: "😟", cor: "#F0A99E" };
  return { nome: "No limite", icone: "😣", cor: "#E36B5B" };
}

function criarJogadorBase({ nome, nac, posicao, personalidade, origem, pe, numero, clube: clubeEscolhido, ritmo }) {
  const pos = posicaoDe(posicao);
  const persona = personaDe(personalidade);
  const org = origemDe(origem);
  // potencial: ponto alto nos atributos que a posição mais usa, com uma faixa de sorte
  const teto = rand(82, 93) + (persona.id === "festeiro" ? 2 : 0);
  const pesos = Object.entries(pos.pesos).sort((a, b) => b[1] - a[1]);
  const potencial = {};
  pesos.forEach(([a], i) => { potencial[a] = clampR(teto - i * rand(2, 5) + rand(-2, 2) + Math.round((org?.bias?.[a] || 0) * 0.25) + (org?.id === "prodigio" ? 1 : 0), 50, 97); });
  const attrs = {};
  ATTRS.forEach((a) => { attrs[a] = clampR(potencial[a] - rand(24, 32) + Math.round((org?.bias?.[a] || 0) * 0.3), 38, 68); });
  // pé preferido mexe no teto
  const peId = peDe(pe).id;
  if (peId === "destro") { potencial.finalizacao = clampR(potencial.finalizacao + 1, 40, 99); potencial.passe = clampR(potencial.passe + 1, 40, 99); }
  if (peId === "canhoto") potencial.drible = clampR(potencial.drible + 2, 40, 99);
  if (peId === "ambidestro") ATTRS.forEach((a) => { potencial[a] = clampR(potencial[a] - 1, 40, 99); });
  const clube = (clubeEscolhido && CLUBES.find((x) => x.nome === clubeEscolhido)) || clubeInicial(nac, org?.id === "base");
  const c = {
    v: VERSAO_RAPIDO, nome: nome.trim(), nac, posicao, personalidade: persona.id, origem: org?.id || null,
    pe: peId, numero: clampR(Math.round(+numero || NUMERO_PADRAO[posicao] || 8), 1, 99), ritmo: ritmoDe(ritmo).id, moral: 70,
    idade: IDADE_INICIAL, ano: ANO_INICIAL, attrs, potencial, foco: "equilibrio",
    clubeNome: clube.nome, primeiroClube: clube.nome, empresario: org?.id === "herdeiro" ? "cauteloso" : "iniciante",
    torcida: { [clube.nome]: 30 }, apelidos: [], tracos: [], tracosEscolhidos: {},
    temporadas: [], totais: { jogos: 0, gols: 0, assist: 0 },
    titulos: { liga: 0, copa: 0, continental: 0, mundial: 0, copaMundo: 0, continentalSelecao: 0, bolaOuro: 0, botaOuro: 0, segunda: 0 },
    lista: [], marcos: [], top3Bola: 0, fama: { varzea: 8, herdeiro: 12, prodigio: 5 }[org?.id] ?? 5, mod: {},
    flags: { historicoEventos: [], cronica: false, blindado: 0, selecaoFria: 0, social: false, traidor: [], mentorJovem: false },
    selecao: { convocacoes: 0, copas: [] }, vagaContinental: false, picoOvr: 0, aposentado: false, emprestimo: null,
    mundo: mundoCompacto(),
  };
  c.picoOvr = ovrDe(c);
  c.patrimonio = 0; c.ganhosTotais = 0; c.investimentos = []; c.repNeg = 0;
  c.contrato = contratoPadrao(c, clube.nome, { base: true });
  c.picoAttrs = { ...attrs };
  c.rival = criarRival(c);
  return c;
}

/* ---------- rival de geração ----------
   Um garoto da mesma idade, de outro país, que a imprensa vai comparar com você
   a carreira inteira. Ele evolui sozinho, troca de clube, ganha (ou não) títulos. */
const GRUPO_POS = { GOL: ["GOL"], ZAG: ["ZAG"], LD: ["LD", "LE"], LE: ["LE", "LD"], VOL: ["VOL", "MC"], MC: ["MC", "MEI"], MEI: ["MEI", "MC"], PD: ["PD", "PE"], PE: ["PE", "PD"], SA: ["SA", "ATA"], ATA: ["ATA", "SA"] };
export function criarRival(c) {
  // só países com banco de nomes próprio, para o rival ter nome coerente
  const nac = pick(["BRA", "ARG", "ESP", "FRA", "ENG", "ALE", "ITA", "POR"].filter((n) => n !== c.nac));
  const posicao = pick(GRUPO_POS[c.posicao] || [c.posicao]);
  const clube = clubeInicial(nac, chance(0.4));
  return {
    nome: nomeMundo(nac), nac, posicao, clube: clube.nome, ovr: clampR(ovrDe(c) + rand(-1, 3), 50, 72), teto: rand(86, 93),
    totais: { jogos: 0, gols: 0, assist: 0 }, titulos: { liga: 0, copa: 0, continental: 0, copaMundo: 0, bolaOuro: 0 }, top3: 0, pico: 0, aposentado: false,
  };
}

function temporadaDoRival(r0, idade, meu) {
  const r = clone(r0);
  if (r.aposentado) return { r, linha: null };
  const pos = posicaoDe(r.posicao);
  // evolução: cresce até ~27, estabiliza, cai depois dos 30
  if (idade < 27) r.ovr = clampR(r.ovr + Math.max(0, Math.round((r.teto - r.ovr) * rand(14, 30) / 100)), 40, 97);
  else if (idade >= 30) r.ovr = clampR(r.ovr - rand(0, 2) - (idade >= 33 ? 1 : 0), 40, 97);
  r.pico = Math.max(r.pico, r.ovr);
  // mercado: quando fica grande demais para o clube, se transfere
  let mudou = null;
  const cl = clubeDe(r.clube);
  if (idade >= 18 && r.ovr - cl.forca >= 4 && chance(0.55)) {
    const alvo = clubesJogaveis().filter((x) => x.forca > cl.forca && x.forca >= r.ovr - 7 && x.forca <= r.ovr + 3 && !ehSegundaDivisao(x.liga));
    if (alvo.length) { mudou = r.clube; r.clube = pick(alvo).nome; }
  }
  const clube = clubeDe(r.clube);
  const st = statusPorDiff(r.ovr - clube.forca, idade);
  const jogos = clampR(Math.round(46 * st.share * (0.85 + rnd() * 0.2)), 0, 52);
  const nivel = Math.pow(Math.max(0.25, (r.ovr - 55) / 35), 1.55) * (1.25 - ligaDe(clube.liga).mult * 0.45);
  const gols = r.posicao === "GOL" ? 0 : poisson(pos.golBase * nivel * jogos);
  const assist = poisson(pos.assistBase * nivel * jogos * (r.posicao === "GOL" ? 0.1 : 1));
  const titulos = [];
  if (chance(clampR(0.03 + (clube.forca - 76) * 0.035, 0.01, 0.45) * (st.share > 0.5 ? 1 : 0.6))) { titulos.push("liga"); r.titulos.liga += 1; }
  if (chance(clampR(0.05 + (clube.forca - 76) * 0.01, 0.02, 0.2))) { titulos.push("copa"); r.titulos.copa += 1; }
  if (clube.forca >= 82 && chance(clampR((clube.forca - 82) * 0.025, 0.02, 0.2))) { titulos.push("continental"); r.titulos.continental += 1; }
  if (anoDeCopa(meu.ano) && r.ovr >= 82 && !meu.ganhouCopa && chance(clampR((r.ovr - 82) * 0.012, 0, 0.12))) { titulos.push("copaMundo"); r.titulos.copaMundo += 1; }
  // Bola de Ouro: só se você não levou
  let bola = null;
  if (jogos >= 20 && r.ovr >= 85) {
    const score = r.ovr + gols * 0.12 + titulos.length * 2 + rnd() * 4;
    if (meu.bolaPos !== 1 && score >= 96 && chance(0.45)) { bola = 1; r.titulos.bolaOuro += 1; r.top3 += 1; } else if (score >= 92) { bola = rand(2, 3); r.top3 += 1; } else if (score >= 88) bola = rand(4, 10);
  }
  r.totais.jogos += jogos; r.totais.gols += gols; r.totais.assist += assist;
  if ((idade >= 35 && r.ovr < 80) || idade >= 38) r.aposentado = true;
  return { r, linha: { clube: r.clube, mudou, ovr: r.ovr, jogos, gols, assist, titulos, bola, aposentou: r.aposentado } };
}

export function pontosRival(r) {
  const t = r.titulos;
  return Math.round(r.totais.gols * 0.35 + r.totais.assist * 0.25 + t.liga * 9 + t.copa * 4 + t.continental * 18 + t.copaMundo * 45 + t.bolaOuro * 55 + r.top3 * 10 + Math.max(0, r.pico - 74) * 6);
}

/* ---------- "Você foi como…": lenda com perfil mais parecido no auge ----------
   Compara só com lendas da mesma família de posição e pondera cada atributo
   pelo peso que ele tem na sua posição (um centroavante não é julgado pela defesa). */
const grupoLenda = (st) => (st.finalizacao <= 30 ? "gk" : st.defesa >= 75 ? "def" : st.passe >= st.finalizacao + 3 ? "mid" : "att");
const GRUPOS_DA_POSICAO = { GOL: ["gk"], ZAG: ["def"], LD: ["def"], LE: ["def"], VOL: ["def", "mid"], MC: ["mid", "def"], MEI: ["mid"], PD: ["att"], PE: ["att"], SA: ["att", "mid"], ATA: ["att"] };
export function lendaParecida(attrs, posicao = "ATA") {
  const grupos = GRUPOS_DA_POSICAO[posicao] || ["att"];
  const pesos = { ...posicaoDe(posicao).pesos };
  if (posicao === "GOL") pesos.finalizacao = 0; // no Modo Rápido ela mede reflexo; nas lendas é chute
  const somaPesos = ATTRS.reduce((s, a) => s + (pesos[a] || 0), 0) || 1;
  const cands = LENDAS.filter((l) => grupos.includes(grupoLenda(l.stats)));
  const notas = (cands.length ? cands : LENDAS).map((l) => {
    const dist = ATTRS.reduce((s, a) => s + Math.abs((attrs[a] || 0) - (l.stats[a] || 0)) * (pesos[a] || 0), 0) / somaPesos;
    return { nome: l.nome, dist };
  }).sort((a, b) => a.dist - b.dist);
  const m = notas[0];
  return { nome: m.nome, similaridade: clampR(Math.round(100 - m.dist * 2.4), 35, 99) };
}

/* ---------- foco da temporada: uma escolha rápida antes de cada temporada ---------- */
/* ---------- pré-temporada (estilo El Ídolo): em que você vai melhorar este ano ----------
   Antes de cada temporada chegam 3 cartas de treino, sorteadas pela semente; você
   escolhe uma. O ganho entra antes de a bola rolar, então já pesa na temporada. */
/* Pré-temporada: 3 cartas sorteadas de um baralho com raridade. Cada carta mexe
   de verdade: os pontos de atributo entram mesmo acima do teto (e o teto do
   atributo principal sobe 1), e os efeitos de temporada valem o ano inteiro. */
export const RARIDADES = {
  comum: { nome: "Comum", cor: "#8FA39A", peso: 60 },
  rara: { nome: "Rara", cor: "#5B8FEA", peso: 30 },
  epica: { nome: "Épica", cor: "#D8B44A", peso: 10 },
};
export const CARTAS_PRETEMPORADA = [
  // comuns
  { id: "finalizacao", raridade: "comum", icone: "🎯", nome: "Finalização na área", desc: "Horas batendo pro gol depois do treino.", ganhos: { finalizacao: 2, drible: 1 },
    gol: { nome: "Treino de reflexos", desc: "Bolas à queima-roupa até o reflexo virar instinto." } },
  { id: "explosao", raridade: "comum", icone: "⚡", nome: "Explosão e arranque", desc: "Tiros curtos e pliometria.", ganhos: { velocidade: 2, fisico: 1 },
    gol: { nome: "Explosão nas saídas", desc: "Saídas do gol mais rápidas e mais fortes." } },
  { id: "visao", raridade: "comum", icone: "🧭", nome: "Visão de jogo", desc: "Vídeo, rondos e tomada de decisão.", ganhos: { passe: 2, drible: 1 },
    gol: { nome: "Jogo com os pés", desc: "Reposição e saída de bola de líbero." } },
  { id: "tecnica", raridade: "comum", icone: "🪄", nome: "Técnica refinada", desc: "Domínio, condução e um contra um.", ganhos: { drible: 2, passe: 1 },
    gol: { nome: "Elasticidade", desc: "Alongamento e voo pros cantos." } },
  { id: "marcacao", raridade: "comum", icone: "🛡️", nome: "Marcação e leitura", desc: "Posicionamento e desarme.", ganhos: { defesa: 2, fisico: 1 },
    gol: { nome: "Posicionamento", desc: "Ângulos, cobertura e comando da área." } },
  { id: "musculacao", raridade: "comum", icone: "💪", nome: "Musculação pesada", desc: "Mais forte no choque, um pouco mais lento.", ganhos: { fisico: 3, velocidade: -1 } },
  { id: "bolaParada", raridade: "comum", icone: "🥅", nome: "Bola parada", desc: "Cobranças até a perfeição.", ganhos: { finalizacao: 1 }, desafio: 0.06,
    gol: { nome: "Treino de pênaltis", desc: "Estudo dos cobradores." } },
  { id: "cabeca", raridade: "comum", icone: "🧘", nome: "Cabeça no lugar", desc: "Psicólogo e descanso.", ganhos: {}, moral: 10, lesao: -0.03 },
  { id: "resistencia", raridade: "comum", icone: "🫁", nome: "Resistência aeróbica", desc: "Corrida longa todo dia: aguenta os 90 minutos.", ganhos: { fisico: 2 }, minutos: 0.05 },
  { id: "aereo", raridade: "comum", icone: "🙆", nome: "Jogo aéreo", desc: "Cabeceio e impulsão nas bolas cruzadas.", ganhos: { fisico: 1, finalizacao: 1 }, gols: 1.06,
    gol: { nome: "Saídas pelo alto", desc: "Cruzamentos na área são seus." } },
  { id: "estudo", raridade: "comum", icone: "📺", nome: "Estudo do adversário", desc: "Você chega sabendo o que cada rival faz.", ganhos: {}, nota: 0.15 },
  { id: "ferias", raridade: "comum", icone: "🏝️", nome: "Férias bem dormidas", desc: "Corpo descansado, cabeça leve.", ganhos: {}, moral: 6, lesao: -0.04 },
  // raras
  { id: "particular", raridade: "rara", icone: "🧑‍🏫", nome: "Treinador particular", desc: "Um especialista só pro seu ponto forte.", ganhos: {}, principal: 3 },
  { id: "pulmao", raridade: "rara", icone: "🫀", nome: "Pulmão de aço", desc: "Joga tudo e quase não se machuca.", ganhos: { fisico: 1 }, lesao: -0.06, minutos: 0.08 },
  { id: "mira", raridade: "rara", icone: "🔭", nome: "Mira calibrada", desc: "Cada chute vai no canto.", ganhos: { finalizacao: 1 }, gols: 1.15,
    gol: { nome: "Leitura de chute", desc: "Você adivinha o canto antes do chute.", ganhos: { finalizacao: 2 }, gols: null, nota: 0.2 } },
  { id: "garcom", raridade: "rara", icone: "🍽️", nome: "Garçom", desc: "Você enxerga o companheiro livre antes de todo mundo.", ganhos: { passe: 1 }, assist: 1.25,
    gol: { nome: "Lançador", desc: "Seus chutões viram ataque.", ganhos: { passe: 2 }, assist: null } },
  { id: "velocista", raridade: "rara", icone: "🏃", nome: "Velocista olímpico", desc: "Treino com atletas do atletismo.", ganhos: { velocidade: 3, drible: 1 } },
  { id: "liderVest", raridade: "rara", icone: "📣", nome: "Líder do vestiário", desc: "O grupo joga por você.", ganhos: {}, torcida: 6, moral: 6, nota: 0.1 },
  { id: "vitrine", raridade: "rara", icone: "📸", nome: "Vitrine internacional", desc: "Torneio de verão transmitido pro mundo todo.", ganhos: {}, fama: 8, ofertas: true },
  { id: "pernaRuim", raridade: "rara", icone: "🦶", nome: "Perna ruim afiada", desc: "Agora você chuta bem com as duas.", ganhos: { drible: 1, finalizacao: 1, passe: 1 } },
  // épicas
  { id: "lenda", raridade: "epica", icone: "👑", nome: "Treino com uma lenda", desc: "Um ídolo aposentado passou o verão com você.", ganhos: {}, todos: 2 },
  { id: "campeao", raridade: "epica", icone: "🏆", nome: "Mentalidade de campeão", desc: "Frieza nas finais e confiança lá em cima.", ganhos: {}, desafio: 0.12, moral: 10, nota: 0.2 },
  { id: "corpoNovo", raridade: "epica", icone: "🧬", nome: "Corpo novo", desc: "Nutrição, sono e fisiologia de ponta: o tempo para.", ganhos: { fisico: 2, velocidade: 1 }, lesao: -0.05, declinio: 0.4 },
  { id: "salto", raridade: "epica", icone: "🚀", nome: "Salto de qualidade", desc: "Tudo clicou de uma vez.", ganhos: {}, principal: 3, segundo: 2 },
];
export const cartaDe = (id) => CARTAS_PRETEMPORADA.find((x) => x.id === id) || null;
export const textoCarta = (carta, posicao) => (posicao === "GOL" && carta.gol ? { ...carta, ...carta.gol, ganhos: carta.gol.ganhos || carta.ganhos } : carta);
/* atributos que a carta vai mexer para esta posição (os dinâmicos viram números) */
export function ganhosDaCarta(carta, posicao) {
  const k = textoCarta(carta, posicao);
  const g = { ...(k.ganhos || {}) };
  const ordem = Object.entries(posicaoDe(posicao).pesos || {}).sort((a, b) => b[1] - a[1]).map(([a]) => a);
  if (k.principal) g[ordem[0]] = (g[ordem[0]] || 0) + k.principal;
  if (k.segundo) g[ordem[1]] = (g[ordem[1]] || 0) + k.segundo;
  if (k.todos) ATTRS.forEach((a) => { g[a] = (g[a] || 0) + k.todos; });
  return g;
}
/* efeitos da carta em texto curto, para mostrar na carta */
export function efeitosDaCarta(carta, posicao) {
  const k = textoCarta(carta, posicao);
  const out = [];
  if (k.gols) out.push(`+${Math.round((k.gols - 1) * 100)}% gols`);
  if (k.assist) out.push(`+${Math.round((k.assist - 1) * 100)}% assist.`);
  if (k.desafio) out.push(`+${Math.round(k.desafio * 100)}% nos desafios`);
  if (k.nota) out.push(`+${k.nota.toFixed(2).replace(/0$/, "")} de nota`);
  if (k.minutos) out.push("mais jogos");
  if (k.lesao) out.push(`${Math.round(k.lesao * 100)}% lesão`);
  if (k.moral) out.push(`+${k.moral} cabeça`);
  if (k.torcida) out.push(`+${k.torcida} torcida`);
  if (k.fama) out.push(`+${k.fama} fama`);
  if (k.ofertas) out.push("mais propostas");
  if (k.declinio) out.push("envelhece bem menos");
  return out;
}
function opcoesPretemporadaBase(c) {
  // sorteio de verdade: raridade primeiro, depois a carta; sem repetir o trio do ano passado
  const passado = new Set(c.pretemporadaVistas || []);
  const tot = Object.values(RARIDADES).reduce((a, r) => a + r.peso, 0);
  const out = [];
  for (let k = 0; k < 40 && out.length < 3; k++) {
    let r = rnd() * tot, rar = "comum";
    for (const [id, x] of Object.entries(RARIDADES)) { if ((r -= x.peso) <= 0) { rar = id; break; } }
    const pool = CARTAS_PRETEMPORADA.filter((x) => x.raridade === rar && !out.includes(x) && (k > 20 || !passado.has(x.id)));
    if (pool.length) out.push(pick(pool));
  }
  return out;
}
export function opcoesPretemporada(c) { return comSemente(c.codigo, `pretemp:${c.ano}`, () => opcoesPretemporadaBase(c)); }
export function escolherPretemporada(c0, id) { const c = clone(c0); c.pretemporada = { ano: c.ano, id }; return c; }

/* Fase: bônus (ou ônus) temporário nos atributos que mais pesam na posição, até o
   OVR andar "nivel" pontos. Pode passar do teto de potencial, porque é passageira:
   devolve os deltas aplicados pra serem retirados no fim da próxima temporada. */
function aplicarFase(c, nivel) {
  const deltas = {};
  if (!nivel) return deltas;
  const pesos = posicaoDe(c.posicao).pesos || {};
  const ordem = ATTRS.slice().sort((a, b) => (pesos[b] || 0.5) - (pesos[a] || 0.5)).slice(0, 3);
  const inicio = ovrDe(c), sinal = Math.sign(nivel);
  for (let i = 0; i < 18 && (sinal > 0 ? ovrDe(c) < inicio + nivel : ovrDe(c) > inicio + nivel); i++) {
    const a = ordem[i % ordem.length];
    const antes = c.attrs[a];
    c.attrs[a] = clampR(antes + sinal, 40, 99);
    if (c.attrs[a] !== antes) deltas[a] = (deltas[a] || 0) + (c.attrs[a] - antes);
  }
  return deltas;
}

export const FOCOS = [
  { id: "equilibrio", icone: "⚖️", nome: "Equilíbrio", desc: "Sem bônus nem custo." },
  { id: "protagonismo", icone: "🎯", nome: "Protagonismo", desc: "+12% de gols e assistências · nota oscila mais" },
  { id: "evolucao", icone: "📈", nome: "Evolução", desc: "Evolui 15% mais rápido · números um pouco menores" },
  { id: "coletivo", icone: "🤝", nome: "Jogo coletivo", desc: "Mais chance de título · menos gols" },
  { id: "vitrine", icone: "📸", nome: "Vitrine", desc: "Mais fama, seleção e Bola de Ouro · torcida desconfia" },
  { id: "preservar", icone: "🧊", nome: "Preservar o corpo", desc: "Menos lesão e declínio mais lento · menos jogos" },
];
export const focoDe = (id) => FOCOS.find((f) => f.id === id) || FOCOS[0];
export function definirFoco(c0, id) { const c = clone(c0); c.foco = focoDe(id).id; return c; }

/* ---------- copa continental de seleções ---------- */
const CONMEBOL = ["BRA", "ARG", "URU", "COL", "CHI", "PAR", "EQU", "PER", "BOL"];
const CONCACAF = ["EUA", "MEX", "CAN", "JAM", "HON", "PAN", "TRI", "HAI", "ELS", "CRC"];
const CAF = ["MAR", "SNE", "NIG", "CMR", "ALG", "CSC", "EGI", "TUN", "GAN", "AFS", "ANG", "TOG", "RDC"];
const AFC = ["JAP", "COR", "ARS", "IRA", "AUS", "QAT", "CHN", "IRQ", "CDN", "KUW", "EAU"];
export function nomeCopaContinental(nac) {
  if (CONMEBOL.includes(nac)) return "Copa América";
  if (CONCACAF.includes(nac)) return "Copa Ouro";
  if (CAF.includes(nac)) return "Copa Africana de Nações";
  if (AFC.includes(nac)) return "Copa da Ásia";
  if (nac === "NZL") return "Copa das Nações da OFC";
  return "Eurocopa";
}
export const anoDeContinentalSelecao = (ano) => ano % 4 === 0;

/* O mundo completo tem ~6 mil jogadores. Para a Bola de Ouro só interessa
   quem pode brigar por ela, então o Modo Rápido guarda só a elite (cabe no save). */
export function mundoCompacto() {
  const m = gerarMundoJogadores();
  return { ...m, jogadores: m.jogadores.filter((j) => j.ovr >= 78 || (j.potencial >= 87 && j.idade <= 22)) };
}

/* ---------- espaço no time ---------- */
export function statusPorDiff(diff, idade) {
  if (idade <= 17 && diff < -2) return { id: "base", label: "Base", share: 0.18 };
  if (diff >= 6) return { id: "estrela", label: "Estrela do time", share: 0.95 };
  if (diff >= 0) return { id: "titular", label: "Titular", share: 0.86 };
  if (diff >= -4) return { id: "rotacao", label: "Rotação", share: 0.6 };
  if (diff >= -9) return { id: "reserva", label: "Reserva", share: 0.32 };
  return { id: "fora", label: "Fora dos planos", share: 0.12 };
}
export function statusNoClube(c, clubeNome = c.clubeNome) {
  return statusPorDiff(ovrDe(c) - clubeDe(clubeNome).forca, c.idade);
}

/* ---------- valor de mercado ---------- */
export function valorMercado(ovr, idade, fama = 0) {
  const base = 1000 * Math.pow(1.173, ovr - 60); // em milhares de euro
  const idadeF = idade <= 21 ? 1.5 : idade <= 24 ? 1.25 : idade <= 28 ? 1 : idade <= 31 ? 0.65 : 0.35;
  return Math.max(50, Math.round(base * idadeF * (1 + fama / 400)));
}
/* Forma recente: a última temporada mexe no preço (nota, participação em gols
   para a posição, títulos e Bola de Ouro). 1 = neutro; vai de 0,75 a 1,4. */
const GA_ESPERADO = { GOL: 0, ZAG: 0.08, LD: 0.12, LE: 0.12, VOL: 0.12, MC: 0.3, MEI: 0.45, PD: 0.55, PE: 0.55, SA: 0.6, ATA: 0.65 };
export function formaDaTemporada(card, posicao, anterior = 1) {
  const jogos = card.jogos || 0;
  let bruto;
  if (jogos < 8) bruto = 0.9;
  else {
    const esp = GA_ESPERADO[posicao] ?? 0.4;
    const ga = ((card.gols || 0) + (card.assist || 0)) / jogos;
    const pGa = esp > 0 ? clamp((ga - esp) / esp, -0.6, 1) * 0.12 : 0;
    const nTit = (card.titulos || []).filter((t) => !ehPremioIndividual(t.tipo)).length;
    const pBola = card.bola?.pos <= 3 ? 0.1 : card.bola?.pos <= 10 ? 0.05 : 0;
    bruto = 1 + Math.min(1, jogos / 25) * (((card.nota || 6.5) - 6.8) * 0.25 + pGa + Math.min(nTit, 3) * 0.03 + pBola);
  }
  return Math.round(clamp(0.3 * anterior + 0.7 * bruto, 0.75, 1.4) * 100) / 100;
}
/* Valor de mercado do atleta hoje: nível, idade, fama e forma recente */
export const valorAtual = (c) => Math.max(50, Math.round(valorMercado(ovrDe(c), c.idade, c.fama) * (c.formaMercado ?? 1)));

export function formatarValor(k) {
  if (k >= 1000) { const m = k / 1000; return `€ ${m >= 100 ? Math.round(m) : m.toFixed(1).replace(".0", "")} mi`; }
  return `€ ${Math.round(k)} mil`;
}

/* ===================== ECONOMIA E CONTRATOS =====================
   Mesma ideia do Modo Carreira (salário, cláusula, bônus, comissão do
   empresário, gastos), com valores em milhares de euro e escala realista. */
const LIGA_PAGA = {
  inglaterra: 1.35, espanha: 1.1, italia: 1.0, alemanha: 1.0, franca: 0.9, portugal: 0.55, brasileirao: 0.5, arabia: 2.4, mls: 0.8,
  inglaterra2: 0.45, espanha2: 0.3, italia2: 0.28, alemanha2: 0.32, franca2: 0.28, portugal2: 0.18, serieB: 0.2,
};
export function salarioAnual(clubeNome, ovr) {
  const cl = clubeDe(clubeNome);
  return Math.max(15, Math.round(60 * Math.pow(1.155, ovr - 55) * (LIGA_PAGA[cl.liga] ?? 0.4) * (0.75 + (cl.forca - 60) / 80)));
}
/* "+40% do atual": compara um salário oferecido com o contrato vigente */
export function comparaSalario(c, novo) {
  const atual = c.contrato?.salario;
  if (!atual || !novo) return "";
  const pct = Math.round((novo / atual - 1) * 100);
  return pct === 0 ? " (igual ao atual)" : ` (${pct > 0 ? "+" : ""}${pct}% do atual)`;
}
const empresarioDe = (c) => EMPRESARIOS.find((e) => e.id === c.empresario) || EMPRESARIOS[0];

export function contratoPadrao(c, clubeNome, { base = false } = {}) {
  const emp = empresarioDe(c);
  const ovr = ovrDe(c);
  const salario = Math.round(salarioAnual(clubeNome, ovr) * (emp.salarioMult ?? 1) * (base ? 0.6 : 1));
  const anos = clampR(3 + (emp.anosBonus || 0), 1, 5);
  return {
    clube: clubeNome, anos, restantes: anos, salario,
    multa: Math.round(Math.max(valorAtual(c) * 1.6, salario * 4) * (emp.multaMult ?? 1)),
    bonusGol: Math.max(1, Math.round(salario * 0.012)),
  };
}

/* ---------- mesa de negociação ---------- */
export const CAMPOS_NEGOCIACAO = [
  { id: "salario", label: "Salário por ano", icone: "💰", pedirMais: "Pedir mais", ceder: "Aceitar menos" },
  { id: "anos", label: "Duração", icone: "📅", pedirMais: "Mais anos", ceder: "Menos anos" },
  { id: "multa", label: "Cláusula de rescisão", icone: "🔓", pedirMais: "Cláusula maior", ceder: "Cláusula menor" },
  { id: "bonusGol", label: "Bônus por gol", icone: "⚽", pedirMais: "Pedir mais", ceder: "Aceitar menos" },
];
/* Desgasta a diretoria: pedir mais salário, bônus ou anos, ou pedir cláusula menor (sair fica fácil). */
const ehDesgastante = (campo, dir) => (["salario", "bonusGol", "anos"].includes(campo) && dir > 0) || (campo === "multa" && dir < 0);

export function iniciarNegociacao(c, { clube, tipo = "transferencia", luvas = 0, contexto = null }) {
  const ovr = ovrDe(c);
  const cl = clubeDe(clube);
  const termos = contratoPadrao(c, clube);
  if (tipo === "renovacao") termos.salario = Math.max(termos.salario, Math.round((c.contrato?.salario || 0) * 1.05));
  const relevancia = clamp((ovr - cl.forca + ((c.fama ?? 20) - 40) / 4) / 40, -0.5, 0.6);
  const afeto = tipo === "renovacao" ? ((c.torcida[clube] ?? 30) - 50) / 5 : 0;
  const paciencia = clampR(Math.round(60 + relevancia * 60 - (c.repNeg || 0) / 8 + afeto), 20, 95);
  return { clube, tipo, termos, original: { ...termos }, paciencia, pacienciaInicial: paciencia, pedidos: 4, colapsou: false, luvas, contexto, historico: [], duro: 0, cedeu: 0, codigo: c.codigo || null, ano: c.ano };
}

export function ajustarNegociacao(n0, campo, dir) {
  return comSemente(n0.codigo, `neg:${n0.ano}:${n0.clube}:${n0.pedidos}:${campo}:${dir}`, () => ajustarNegociacaoBase(n0, campo, dir));
}
function ajustarNegociacaoBase(n0, campo, dir) {
  const n = clone(n0);
  if (n.pedidos <= 0 || n.colapsou) return n;
  const t = n.termos;
  const novo = campo === "anos" ? clampR(t.anos + dir, 1, 5)
    : campo === "salario" ? Math.max(10, Math.round(t.salario * (1 + dir * 0.1)))
    : campo === "multa" ? Math.max(Math.round(t.salario * 1.5), Math.round(t.multa * (1 + dir * 0.18)))
    : Math.max(0, Math.round(t.bonusGol * (1 + dir * 0.25)) + (dir > 0 && t.bonusGol < 4 ? 1 : 0));
  const desg = ehDesgastante(campo, dir);
  const aceitou = desg ? chance(clamp(n.paciencia / 100, 0.15, 0.95)) : true;
  n.paciencia = clampR(n.paciencia - (desg ? rand(6, 14) : -rand(2, 5)), 0, 100);
  n.pedidos -= 1;
  if (desg) n.duro += aceitou ? 1 : 0; else n.cedeu += 1;
  const rotulo = CAMPOS_NEGOCIACAO.find((x) => x.id === campo)?.label.toLowerCase();
  if (aceitou) { t[campo] = novo; if (campo === "anos") t.restantes = novo; }
  n.historico.push(aceitou ? (desg ? `Aceitaram mudar ${rotulo}.` : `Você cedeu em ${rotulo}. A diretoria gostou.`) : `Recusaram mexer em ${rotulo}.`);
  if (n.paciencia <= 0) { n.colapsou = true; n.historico.push("A diretoria levantou da mesa."); }
  return n;
}

/* Fecha o acordo: devolve o contrato e atualiza a fama de negociador */
export function fecharNegociacao(c0, n) {
  const c = clone(c0);
  c.repNeg = clampR((c.repNeg || 0) + n.duro * 4 - n.cedeu * 2, -60, 60);
  return { c, contrato: { ...n.termos, clube: n.clube, restantes: n.termos.anos } };
}
export const fama_negociador = (c) => ((c.repNeg || 0) >= 15 ? "Osso duro" : (c.repNeg || 0) <= -15 ? "Fácil de negociar" : "Equilibrado");

/* ---------- investimentos e luxos ---------- */
export const INVESTIMENTOS = [
  { id: "psicologo", nome: "Psicólogo do esporte", icone: "🧠", custo: 600, desc: "Cabeça mais estável: +3 de estado mental por ano e metade das quedas.", moralAno: 3, moralQueda: 0.5 },
  { id: "personal", nome: "Personal trainer", icone: "🏋️", custo: 400, desc: "20% menos risco de lesão.", lesaoMult: 0.8 },
  { id: "nutri", nome: "Nutricionista particular", icone: "🥗", custo: 900, desc: "Envelhece 12% mais devagar.", declinio: 0.88 },
  { id: "fisio", nome: "Fisioterapeuta particular", icone: "🩺", custo: 1500, desc: "Cura lesão crônica e reduz o risco de lesão.", lesaoMult: 0.9, curaCronica: true },
  { id: "imagem", nome: "Assessoria de imagem", icone: "🗞️", custo: 1200, desc: "+3 de fama todo ano.", famaAno: 3 },
  { id: "analista", nome: "Analista de desempenho", icone: "📊", custo: 2000, desc: "Notas um pouco mais altas.", notaBonus: 0.08 },
  { id: "ct", nome: "Centro de treinamento próprio", icone: "🏟️", custo: 8000, desc: "Evolui 8% mais rápido.", evolucao: 1.08 },
  { id: "instituto", nome: "Instituto com seu nome", icone: "🤝", custo: 5000, desc: "Legado fora de campo e +2 de torcida por ano.", torcidaAno: 2, social: true },
  { id: "origem", nome: "Reformar a base do clube que te revelou", icone: "🏠", custo: 12000, desc: "Vira benfeitor: +20 de torcida no seu primeiro clube e pontos de legado.", benfeitor: true },
  { id: "carro", nome: "Coleção de carros esportivos", icone: "🏎️", custo: 2500, desc: "+4 de fama. Luxo: custa manutenção e incomoda torcida de clube pequeno.", luxo: true, fama: 4 },
  { id: "mansao", nome: "Mansão com piscina", icone: "🏡", custo: 9000, desc: "+6 de fama. Luxo: custa manutenção e incomoda torcida de clube pequeno.", luxo: true, fama: 6 },
  { id: "iate", nome: "Iate", icone: "🛥️", custo: 25000, desc: "+8 de fama. Luxo de verdade — e polêmica.", luxo: true, fama: 8 },
];
export const investimentoDe = (id) => INVESTIMENTOS.find((i) => i.id === id);
const efeitosInv = (c) => (c.investimentos || []).map(investimentoDe).filter(Boolean);
const multInv = (c, k) => efeitosInv(c).reduce((m, i) => m * (i[k] ?? 1), 1);
const somaInv = (c, k) => efeitosInv(c).reduce((s, i) => s + (i[k] ?? 0), 0);

export function comprarInvestimento(c0, id) {
  const c = clone(c0);
  const inv = investimentoDe(id);
  if (!inv || (c.investimentos || []).includes(id) || c.patrimonio < inv.custo) return { c, ok: false };
  c.patrimonio -= inv.custo;
  c.investimentos = [...(c.investimentos || []), id];
  if (inv.curaCronica) c.flags.cronica = false;
  if (inv.fama) c.fama = clampR(c.fama + inv.fama, 0, 100);
  if (inv.social) c.flags.social = true;
  if (inv.benfeitor) { c.flags.benfeitor = true; c.torcida[c.primeiroClube] = clampR((c.torcida[c.primeiroClube] ?? 30) + 20, 0, 100); }
  return { c, ok: true };
}

/* Dinheiro da temporada: salário + bônus − comissão − manutenção dos luxos */
function fecharFinancas(c, card) {
  const k = c.contrato || contratoPadrao(c, c.clubeNome);
  const emp = empresarioDe(c);
  const nTit = card.titulos.filter((t) => !ehPremioIndividual(t.tipo)).length;
  const salario = k.salario;
  const bonus = k.bonusGol * card.gols + Math.round(salario * 0.1) * nTit + (card.bola?.pos === 1 ? Math.round(salario * 0.3) : 0);
  const comissao = Math.round((salario + bonus) * (emp.comissao || 0));
  const manutencao = efeitosInv(c).filter((i) => i.luxo).reduce((s, i) => s + Math.round(i.custo * 0.06), 0);
  const total = salario + bonus - comissao - manutencao;
  c.patrimonio = Math.max(0, (c.patrimonio || 0) + total);
  c.ganhosTotais = (c.ganhosTotais || 0) + salario + bonus;
  k.restantes = Math.max(0, (k.restantes ?? 1) - 1);
  c.contrato = k;
  return { salario, bonus, comissao, manutencao, total };
}

/* ---------- pós-carreira (os mesmos caminhos do Modo Carreira) ---------- */
export function caminhosPosCarreira(c) {
  const titulos = (c.lista || []).filter((x) => !ehPremioIndividual(x.tipo)).length;
  const idolo = Object.values(c.torcida).some((v) => v >= 75);
  const req = {
    tecnico: c.temporadas.length >= 15 || titulos >= 5,
    auxiliar: true,
    embaixador: idolo,
    comentarista: c.fama >= 55,
    dirigente: (c.patrimonio || 0) >= 10000 || (c.repNeg || 0) >= 20,
    empresario: (c.patrimonio || 0) >= 3000,
    afastar: true,
  };
  const textoReq = { tecnico: "Carreira longa (15+ temporadas) ou 5 títulos", dirigente: "Patrimônio de € 10 mi ou fama de negociador duro", empresario: "Patrimônio de € 3 mi" };
  return CAMINHOS_POS_CARREIRA.map((p) => ({ id: p.id, nome: p.nome, icone: p.icone, cor: p.cor, desc: p.desc, disponivel: !!req[p.id], requisito: textoReq[p.id] || p.textoRequisito }));
}
export function escolherPosCarreira(c0, id) {
  const c = clone(c0);
  const p = CAMINHOS_POS_CARREIRA.find((x) => x.id === id);
  if (!p) return c;
  const ultimo = c.temporadas[c.temporadas.length - 1];
  const adaptado = {
    titulos: c.lista.filter((x) => !ehPremioIndividual(x.tipo)).length, bolasDeOuro: c.titulos.bolaOuro || 0,
    clube: { nome: ultimo?.clube || c.clubeNome }, torcidaPorClube: c.torcida, fama: c.fama, cofre: c.patrimonio || 0,
    tecnicoConfianca: 60, relacaoDiretoria: 50,
  };
  let epilogo = "";
  try { epilogo = p.epilogo(adaptado, c.temporadas); } catch { epilogo = ""; }
  c.posCarreira = { id: p.id, nome: p.nome, icone: p.icone, cor: p.cor, epilogo: epilogo.replace(/\$([\d.]+M?k?)/g, (_, v) => `€ ${v}`) };
  return c;
}

/* ---------- temporada ---------- */
export const anoDeCopa = (ano) => ano % 4 === 2;
const forcaSelecao = (c) => nacDe(c.nac).forcaSelecao;

function simularLiga(c, clube, ovr, share, extra = 0) {
  const rivais = clubesJogaveis().filter((x) => x.liga === clube.liga);
  const impacto = (ovr - clube.forca) * share * 0.35 + somaTraco(c, "forcaTime") * share + extra;
  const tabela = rivais.map((x) => ({ nome: x.nome, s: x.forca + (x.nome === clube.nome ? impacto : 0) + (rnd() + rnd() + rnd() - 1.5) * 6 }))
    .sort((a, b) => b.s - a.s);
  const pos = tabela.findIndex((x) => x.nome === clube.nome) + 1;
  return { pos: pos || rand(5, 15), total: tabela.length, campeao: tabela[0]?.nome, ordem: tabela.map((x) => x.nome), pontos: tabela.map((x) => x.s) };
}

/* Classificação final de uma liga: a sua vem da temporada jogada; as outras são
   simuladas pela força dos clubes com um pouco de sorte. */
function ordemDaLiga(ligaId, card) {
  if (card.ligaId === ligaId && Array.isArray(card.tabelaLiga) && card.tabelaLiga.length) return card.tabelaLiga;
  return clubesJogaveis().filter((x) => x.liga === ligaId)
    .map((x) => ({ n: x.nome, s: x.forca + (rnd() + rnd() + rnd() - 1.5) * 6 }))
    .sort((a, b) => b.s - a.s).map((x) => x.n);
}

/* Fim de temporada: os primeiros da 2ª divisão sobem, os últimos da 1ª caem.
   Grava em c.ligas e devolve quem subiu e quem caiu. */
function girarDivisoes(c, card) {
  const ligas = { ...(c.ligas || {}) };
  const subiram = [], cairam = [];
  PIRAMIDE.forEach(({ baixo, cima, vagas }) => {
    const b = ordemDaLiga(baixo, card), a = ordemDaLiga(cima, card);
    if (b.length < vagas || a.length < vagas * 2) return;
    b.slice(0, vagas).forEach((n) => { ligas[n] = cima; subiram.push(n); });
    a.slice(-vagas).forEach((n) => { ligas[n] = baixo; cairam.push(n); });
  });
  // quem voltou pra liga de origem do cadastro não precisa ficar registrado
  Object.keys(ligas).forEach((n) => { if (CLUBES.find((x) => x.nome === n)?.liga === ligas[n]) delete ligas[n]; });
  c.ligas = ligas;
  sincronizarLigas(c);
  return { subiram, cairam };
}

function mataMata(forcaEf, base, bonus = 0) {
  return clampR(0.5 + (forcaEf - base) * 0.03 + bonus, 0.12, 0.85);
}

function simularContinental(c, clube, ovr, share, extra = 0) {
  const nome = ligaDe(clube.liga).continental;
  const forcaEf = clube.forca + (ovr - clube.forca) * share * 0.3 + somaTraco(c, "forcaTime") * share + extra;
  const fases = ["Fase de grupos", "Oitavas", "Quartas", "Semifinal", "Final"];
  const base = nome === "Champions League" ? 84 : 76;
  const bonus = somaTraco(c, "mataMata") * share;
  if (!chance(clampR(0.55 + (forcaEf - base) * 0.035, 0.2, 0.92))) return { nome, fase: 0, faseNome: fases[0] };
  for (let f = 1; f <= 3; f++) {
    if (!chance(mataMata(forcaEf, base, bonus))) return { nome, fase: f, faseNome: fases[f] };
  }
  return { nome, fase: 4, faseNome: "Final", final: true, chanceFinal: mataMata(forcaEf, base, bonus) };
}

/* Torneio de seleções (Copa do Mundo ou copa continental). Mesma lógica,
   nomes e pesos diferentes. */
function simularTorneioSelecao(c, ovr, { nome, tipo }) {
  const fs = forcaSelecao(c);
  const vitrine = c.foco === "vitrine" ? 2 : 0;
  const corte = fs - 6 + (c.flags.selecaoFria || 0) * 2 - vitrine;
  if (c.idade < 18 || c.flags.semSelecao) return null;
  const convocado = ovr >= corte ? chance(0.92) : ovr >= corte - 4 ? chance(0.35) : false;
  if (!convocado) return { ano: c.ano, nome, tipo, convocado: false, resultado: "Fora da convocação" };
  const titular = ovr >= fs - 2;
  const bonus = titular ? (ovr - fs) * 0.01 + 0.03 + somaTraco(c, "mataMata") : 0;
  const fases = ["Fase de grupos", "Oitavas", "Quartas", "Semifinal", "Final"];
  const out = { ano: c.ano, nome, tipo, convocado: true, titular, fase: 0, resultado: "Eliminado na fase de grupos", gols: 0 };
  const lance = titular ? posicaoDe(c.posicao).golBase * 0.9 : posicaoDe(c.posicao).golBase * 0.3;
  const baseGrupo = tipo === "copaMundo" ? 75 : 70;
  const baseMata = tipo === "copaMundo" ? 82 : 78;
  out.gols += poisson(lance * 3);
  if (!chance(clampR(0.55 + (fs - baseGrupo) * 0.025 + bonus, 0.2, 0.95))) return out;
  for (let f = 1; f <= 3; f++) {
    out.gols += poisson(lance);
    if (!chance(mataMata(fs, baseMata, bonus))) { out.fase = f; out.resultado = f === 3 ? "Eliminado na semifinal" : `Eliminado nas ${fases[f].toLowerCase()}`; return out; }
  }
  out.fase = 4; out.final = true; out.chanceFinal = mataMata(fs, baseMata, bonus); out.resultado = "Final";
  return out;
}

/* Efeitos do foco escolhido para a temporada */
function efeitoFoco(c) {
  return {
    protagonismo: { golsMult: 1.12, notaRuido: 2 },
    evolucao: { golsMult: 0.95 },
    coletivo: { golsMult: 0.9, forcaTime: 1.5 },
    vitrine: { bola: 5 },
    preservar: { lesaoAdd: -0.04, shareMult: 0.92 },
  }[c.foco] || {};
}

/* Joga a temporada inteira. Se houver uma final com você em campo,
   devolve um "momento decisivo" (pênalti) para o jogador resolver na tela. */
export function jogarTemporada(c0) { sincronizarLigas(c0); return comSemente(c0.codigo, `jogar:${c0.ano}`, () => jogarTemporadaBase(c0)); }
function jogarTemporadaBase(c0) {
  const c = clone(c0);
  c.mod = c.mod || {};
  const mod = c.mod;
  const fx = efeitoFoco(c);
  const persona = personaDe(c.personalidade);
  const clubeNome = c.emprestimo?.destino || c.clubeNome;
  const clube = clubeDe(clubeNome);
  const liga = ligaDe(clube.liga);
  const pos = posicaoDe(c.posicao);
  // pré-temporada: a carta escolhida mexe nos atributos antes de a bola rolar
  const ovrAntes = ovrDe(c);
  const carta0 = c.pretemporada?.ano === c.ano ? cartaDe(c.pretemporada.id) : null;
  const carta = carta0 ? textoCarta(carta0, c.posicao) : null;
  let preInfo = null;
  c.mod = c.mod || {};
  if (carta) {
    const fator = c.idade >= 31 ? 0.5 : 1; // veterano já não ganha tanto no treino
    const aplicados = {};
    const ganhos = ganhosDaCarta(carta0, c.posicao);
    // o atributo que mais cresce na carta ganha +1 permanente no teto
    const chave = Object.entries(ganhos).sort((a, b) => b[1] - a[1])[0]?.[0];
    Object.entries(ganhos).forEach(([a, g]) => {
      const ganho = g > 0 ? Math.max(1, Math.round(g * fator)) : g;
      // o treino pode passar do teto em até 2 pontos: sempre faz efeito, mesmo para quem já chegou ao auge
      const teto = Math.max(c.attrs[a], (c.potencial?.[a] ?? 99) + ((c.formaAttrs || {})[a] || 0) + 2);
      const novo = clampR(g > 0 ? Math.min(c.attrs[a] + ganho, teto) : c.attrs[a] + ganho, 40, 99);
      if (novo !== c.attrs[a]) aplicados[a] = novo - c.attrs[a];
      c.attrs[a] = novo;
      // carta épica deixa marca: o teto do atributo principal sobe
      if (a === chave && g > 0 && carta0.raridade === "epica") c.potencial[a] = clampR(c.potencial[a] + 1, 40, 99);
    });
    if (carta.moral) mexerMoral(c, carta.moral);
    if (carta.torcida) c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + carta.torcida, 0, 100);
    if (carta.fama) c.fama = clampR(c.fama + carta.fama, 0, 100);
    if (carta.gols) c.mod.golsMult = (c.mod.golsMult ?? 1) * carta.gols;
    if (carta.assist) c.mod.assistMult = (c.mod.assistMult ?? 1) * carta.assist;
    if (carta.nota) c.mod.notaBonus = (c.mod.notaBonus || 0) + carta.nota;
    if (carta.minutos) c.mod.shareAdd = (c.mod.shareAdd || 0) + carta.minutos;
    if (carta.ofertas) c.mod.ofertasExtra = 1;
    if (carta.declinio) c.mod.declinio = (c.mod.declinio ?? 1) * carta.declinio;
    preInfo = { id: carta.id, icone: carta.icone, nome: carta.nome, raridade: carta0.raridade, ganhos: aplicados, efeitos: efeitosDaCarta(carta0, c.posicao) };
  }
  c.bonusDesafio = carta?.desafio || 0;
  const ovr = ovrDe(c);
  const st = statusPorDiff(ovr - clube.forca, c.idade);
  const moral = c.moral ?? 65;
  // a arquibancada pesa: ídolo joga embalado, desafeto joga pressionado
  const torcidaAqui = c.torcida?.[clubeNome] ?? 30;
  const efTorcida = torcidaAqui >= 75 ? 0.12 : torcidaAqui >= 60 ? 0.05 : torcidaAqui <= 20 ? -0.15 : torcidaAqui <= 35 ? -0.05 : 0;
  let share = clampR((st.share + (mod.shareAdd || 0)) * (mod.shareMult ?? 1) * (fx.shareMult ?? 1) * (moral < 25 ? 0.9 : 1), 0.04, 1);

  // lesão durante a temporada
  const corpoPronto = c.origem === "tardio" && c.idade <= 21 ? 0.5 : 1;
  const riscoLesao = clampR((0.07 + (moral < 30 ? 0.03 : 0) + (mod.lesaoAdd || 0) + (fx.lesaoAdd || 0) + (carta?.lesao || 0) + (c.flags.cronica ? 0.05 : 0) + Math.max(0, c.idade - 30) * 0.01) * persona.risco * multTraco(c, "lesaoMult") * multInv(c, "lesaoMult") * corpoPronto, 0.01, 0.4);
  const lesao = chance(riscoLesao) ? pick([
    { nome: "estiramento na coxa", fator: 0.8 }, { nome: "entorse no tornozelo", fator: 0.75 },
    { nome: "lesão muscular", fator: 0.7 }, { nome: "ruptura de ligamento", fator: 0.35 },
  ]) : null;
  if (lesao) share *= lesao.fator;

  const jogos = clampR(Math.round(48 * share * (0.9 + rnd() * 0.15)), 0, 52);
  const nivel = Math.pow(Math.max(0.25, (ovr - 55) / 35), 1.55) * (1.25 - liga.mult * 0.45);
  const gm = multTraco(c, "golsMult") * (fx.golsMult ?? 1) * (mod.golsMult ?? 1) * (c.pe === "ambidestro" ? 1.06 : 1);
  const gols = c.posicao === "GOL" ? 0 : Math.round(poisson(pos.golBase * nivel * jogos) * gm);
  const assist = Math.round(poisson(pos.assistBase * nivel * jogos * (c.posicao === "GOL" ? 0.1 : 1)) * multTraco(c, "assistMult") * (fx.golsMult ?? 1) * (mod.assistMult ?? 1) * (c.pe === "ambidestro" ? 1.06 : 1));
  // quem não faz gol também precisa de nota alta quando joga bem
  const defBonus = c.posicao === "GOL" ? 0.4 : DEFENSIVAS.includes(c.posicao) ? 0.25 : 0;
  const nota = jogos === 0 ? 0 : +clamp(6.2 + (ovr - 70) * 0.035 + (ovr - clube.forca) * 0.02 + ((gols + assist) / Math.max(1, jogos)) * 1.2
    + defBonus + somaTraco(c, "notaBonus") + somaInv(c, "notaBonus") + (mod.notaBonus || 0) + (moral - 60) * 0.008 + efTorcida
    // mais variação: a fase do jogador, os minutos e um pouco de sorte (soma de dois sorteios = mais perto do meio, mas com pontas)
    + (c.formaNivel || 0) * 0.12 + (share - 0.6) * 0.5 - 0.25 + (rnd() + rnd() - 1) * 0.8 * (fx.notaRuido || 1), 5.2, 9.7).toFixed(2);

  const card = {
    idx: c.temporadas.length, ano: c.ano, idade: c.idade, clube: clube.nome, cor: clube.cor, ligaId: clube.liga, ligaNome: liga.nome,
    emprestado: !!c.emprestimo, ovr, ovrAntes, pretemporada: preInfo ? { ...preInfo, deltaOvr: ovr - ovrAntes } : null,
    status: st.label, foco: c.foco, jogos, gols, assist, nota, lesao: lesao?.nome || null, share,
    titulos: [], destaques: [],
  };
  if (jogos > 0 && efTorcida >= 0.12) card.destaques.push("A arquibancada te empurrou o ano inteiro: jogar em casa virou vantagem");
  else if (jogos > 0 && efTorcida <= -0.15) card.destaques.push("Vaia a cada toque errado: a própria torcida pesou contra você");
  const forcaTimeExtra = (fx.forcaTime || 0) * share;

  // Desafios da temporada: cada título disputado na bola vira um minigame seu,
  // em ordem cronológica (liga e copa em maio, finais continentais, seleção no meio do ano).
  const momentos = [];
  const emCampo = share >= 0.45 && jogos >= 10; // reserva não decide título

  // campeonato nacional
  const tab = simularLiga(c, clube, ovr, share, forcaTimeExtra);
  card.posLiga = tab.pos; card.totalLiga = tab.total; card.campeaoLiga = tab.campeao;
  card.tabelaLiga = tab.ordem; // a virada de divisões no fim da temporada usa a classificação inteira
  // só a briga pelo título vira desafio, e nem sempre; acesso e permanência saem da tabela
  const decisaoBruta = emCampo ? decisaoNaTabela(clube, tab) : null;
  const decisaoLiga = decisaoBruta?.tipo === "liga" && chance(0.5) ? decisaoBruta : null;
  if (decisaoLiga) momentos.push(decisaoLiga);
  if (tab.pos === 1 && decisaoLiga?.tipo !== "liga") {
    card.titulos.push({ tipo: ehSegundaDivisao(clube.liga) ? "segunda" : "liga", nome: liga.nome });
    card.destaques.push(`Título do ${liga.nome} com ${tab.pontos && tab.pontos[1] != null && tab.pontos[0] - tab.pontos[1] < 3.2 ? "emoção até o fim" : "folga na tabela"}`);
  }

  // copa nacional: chegar à final é o difícil; a final em si é decidida em campo
  const copaNome = COPA_POR_LIGA[clube.liga];
  if (copaNome) {
    const p = clampR(0.06 + (clube.forca - 75) * 0.01 + (ovr - clube.forca) * share * 0.004 + (somaTraco(c, "mataMata") + forcaTimeExtra * 0.02) * share, 0.02, 0.32);
    // a copa nacional sai como resultado (sem desafio): até onde o time foi
    if (chance(clampR(p * 1.45, 0.03, 0.5))) {
      const ganha = chance(clampR(0.45 + (clube.forca - 78) * 0.01 + (emCampo ? (ovr - clube.forca) * 0.006 : 0), 0.3, 0.7));
      if (ganha) card.titulos.push({ tipo: "copa", nome: copaNome });
      else card.destaques.push(`Vice-campeão da ${copaNome}`);
      card.copaNac = { nome: copaNome, fase: ganha ? "Campeão" : "Vice-campeão" };
    } else {
      const r = rnd() + (clube.forca - 72) * 0.015;
      card.copaNac = { nome: copaNome, fase: r < 0.3 ? "Terceira fase" : r < 0.6 ? "Oitavas de final" : r < 0.85 ? "Quartas de final" : "Semifinal" };
    }
  }

  // Mundial de Clubes: quem foi campeão continental no ano anterior e ficou no clube
  if (c.campeaoContinental === clube.nome && !c.emprestimo) {
    if (chance(clampR(0.45 + (clube.forca - 82) * 0.03 + forcaTimeExtra * 0.02 + (emCampo ? 0.05 : 0), 0.25, 0.8))) { card.titulos.push({ tipo: "mundial", nome: "Mundial de Clubes" }); card.mundialRes = "Campeão"; }
    else { card.destaques.push("Perdeu a final do Mundial de Clubes"); card.mundialRes = "Vice-campeão"; }
  }

  // continental
  if (liga.continental && !ehSegundaDivisao(clube.liga) && (c.vagaContinental || (c.temporadas.length === 0 && clube.forca >= 80))) {
    const cont = simularContinental(c, clube, ovr, share, forcaTimeExtra);
    card.continental = { nome: cont.nome, faseNome: cont.faseNome, final: !!cont.final, chanceFinal: cont.chanceFinal };
    if (cont.final) {
      if (share >= 0.5 && !lesao) momentos.push({ tipo: "continental", titulo: `Final da ${cont.nome}` });
      else if (chance(cont.chanceFinal)) card.titulos.push({ tipo: "continental", nome: cont.nome });
      else card.continental.faseNome = "Vice-campeão";
    }
  }

  // Seleção: Copa do Mundo (2026, 2030…) e copa continental (2028, 2032…)
  const torneio = anoDeCopa(c.ano) ? { nome: "Copa do Mundo", tipo: "copaMundo" }
    : anoDeContinentalSelecao(c.ano) ? { nome: nomeCopaContinental(c.nac), tipo: "continentalSelecao" } : null;
  if (torneio) {
    const t = simularTorneioSelecao(c, ovr, torneio);
    if (t) {
      card.selecao = t;
      if (t.convocado) {
        c.selecao.convocacoes += 1;
        // jogos e assistências no torneio (para a linha da seleção no painel)
        t.jogos = (t.titular ? 3 : 2) + (t.fase || 0) + (t.final ? 1 : 0) - (t.titular ? 0 : 1);
        t.assist = poisson(pos.assistBase * (t.titular ? 0.9 : 0.3) * t.jogos);
      }
      if (t.final) {
        if (t.titular) momentos.push({ tipo: "selecao", titulo: `Final da ${t.nome} ${c.ano}` });
        else if (chance(t.chanceFinal)) { t.campeao = true; t.resultado = "Campeão"; card.titulos.push({ tipo: t.tipo, nome: t.nome }); }
        else t.resultado = "Vice-campeão";
      }
    }
  }

  const mini = miniDaPosicao(c.posicao);
  momentos.forEach((m, i) => { m.mini = mini; m.texto = textoDoMomento(mini, m, c); m.ordem = i + 1; m.total = momentos.length; });
  card.momentos = [];
  card.pendente = momentos[0] || null;
  card.filaMomentos = momentos.slice(1);
  return { c, card, momento: card.pendente };
}

/* Briga apertada na tabela vira desafio na última rodada: pelo título (1º x 2º),
   pelo acesso (2ª divisão) ou pra não cair (1ª divisão). "fronteira" é a posição
   do lado de cima da disputa: acertar te deixa nela, errar te joga uma abaixo. */
function decisaoNaTabela(clube, tab) {
  const p = tab.pos, total = tab.total, pts = tab.pontos || [];
  const nomeLiga = ligaDe(clube.liga).nome;
  const vagas = vagasDaLiga(clube.liga);
  const segunda = ehSegundaDivisao(clube.liga);
  const apertado = (f) => pts[f - 1] != null && pts[f] != null && Math.abs(pts[f - 1] - pts[f]) < 3.2;
  // quem está do lado de cima garante vencendo (ou se o rival também tropeçar);
  // quem está atrás precisa vencer E torcer. O tropeço do rival já sai sorteado aqui.
  const base = (f) => ({ ligaNome: nomeLiga, segunda, fronteira: f, ladoCerto: p === f, rivalTropeca: chance(0.45) });
  if ((p === 1 || p === 2) && apertado(1)) return { ...base(1), tipo: "liga", titulo: `Última rodada do ${nomeLiga}` };
  if (segunda && vagas && (p === vagas || p === vagas + 1) && apertado(vagas)) return { ...base(vagas), tipo: "acesso", titulo: `Jogo do acesso · ${nomeLiga}` };
  if (!segunda && vagas && (p === total - vagas || p === total - vagas + 1) && apertado(total - vagas)) return { ...base(total - vagas), tipo: "permanencia", titulo: `Jogo da permanência · ${nomeLiga}` };
  return null;
}

/* A situação na tabela antes do desafio, pra o jogador saber o que precisa */
const SITUACAO_TABELA = {
  liga: ["Um ponto à frente do vice: vença e a taça é de vocês.", "Um ponto atrás do líder: precisam vencer e torcer por um tropeço."],
  acesso: ["Na zona de acesso, um ponto à frente do perseguidor: vença e o clube sobe.", "Um ponto fora da zona de acesso: precisam vencer e torcer por um tropeço."],
  permanencia: ["Um ponto acima da zona de rebaixamento: vença e o clube se salva.", "Na zona de rebaixamento por um ponto: precisam vencer e torcer por um tropeço."],
};

/* ---------- momento decisivo: cada posição decide do seu jeito ---------- */
export function miniDaPosicao(pos) {
  if (pos === "GOL") return "defesa";
  if (["MEI", "PD", "PE"].includes(pos)) return "falta";
  if (["MC", "VOL", "LD", "LE"].includes(pos)) return "passe";
  return "penalti";
}
const TEXTO_MINI = {
  penalti: (c, tipo) => (tipo === "selecao" ? `${nacDe(c.nac).label} inteiro te olhando. Pênalti decisivo.` : "Prorrogação empatada. Pênaltis. A última cobrança é sua."),
  falta: () => "Último minuto, empate no placar. Falta na entrada da área, e a bola é sua.",
  passe: () => "Acréscimos. O time puxa o contra-ataque e a bola chega em você: ache o passe do gol.",
  defesa: (c, tipo) => (tipo === "selecao" ? `Disputa de pênaltis. ${nacDe(c.nac).label} depende de você: defenda a última cobrança.` : "Disputa de pênaltis. Se você pegar a última cobrança, o título é seu."),
};
/* Cena de cada desafio da temporada, por minigame */
const CENA_MOMENTO = {
  // liga, acesso e permanência: só a ação; o que está em jogo vem da SITUACAO_TABELA
  liga: {
    penalti: "Empate no placar e pênalti a favor nos acréscimos. A bola é sua.",
    falta: "O placar não sai do zero. Falta na entrada da área, e a bola é sua.",
    passe: "Acréscimos, contra-ataque de três contra dois: ache o passe do gol.",
    defesa: "Vocês vencem por 1 a 0. Pênalti contra no último minuto: pegue.",
  },
  acesso: {
    penalti: "Empate no placar e pênalti a favor nos acréscimos. A bola é sua.",
    falta: "Falta perigosa no fim do jogo, na entrada da área.",
    passe: "A bola chega em você nos acréscimos: ache o passe do gol.",
    defesa: "Pênalti contra no último lance: defenda.",
  },
  permanencia: {
    penalti: "Pênalti a favor nos acréscimos. A bola é sua.",
    falta: "Falta no último minuto, na entrada da área.",
    passe: "Último ataque da temporada: ache o passe do gol.",
    defesa: "Pênalti contra no último minuto: tudo nas suas mãos.",
  },
  ligaConfirmacao: {
    penalti: "O título está praticamente garantido. Pênalti no jogo da festa: o gol da taça pode ser seu.",
    falta: "Estádio lotado pra festa do título. Falta na entrada da área: marque o gol da taça.",
    passe: "Jogo da festa do título. A bola chega em você: dê o passe do gol que confirma a taça.",
    defesa: "Jogo da festa do título. Pênalti contra: pegue e feche o campeonato sem sofrer gol.",
  },
  mundial: {
    penalti: "Final do Mundial empatada. Pênaltis. A última cobrança é sua.",
    falta: "Final do Mundial, último minuto. Falta na entrada da área: o mundo inteiro assistindo.",
    passe: "Final do Mundial, prorrogação. Último ataque: ache o passe que vale o planeta.",
    defesa: "Final do Mundial nos pênaltis. Pegue a última cobrança e vocês são campeões do mundo.",
  },
  copa: {
    penalti: "Final empatada. Pênaltis. A última cobrança é sua.",
    falta: "Final empatada nos acréscimos. Falta na entrada da área: a taça está nesse chute.",
    passe: "Final, prorrogação, último ataque. A bola chega em você: ache o passe do título.",
    defesa: "Final decidida nos pênaltis. Pegue a última cobrança e a taça é de vocês.",
  },
};
function textoDoMomento(mini, m, c) {
  const cena = CENA_MOMENTO[m.tipo]?.[mini] || TEXTO_MINI[mini](c, m.tipo);
  const sit = SITUACAO_TABELA[m.tipo]?.[m.ladoCerto ? 0 : 1];
  return sit ? `${sit} ${cena}` : cena;
}
/* Peso emocional de cada desafio: final de seleção ou continental mexe mais que copa */
const PESO_MOMENTO = { selecao: 3, continental: 3, mundial: 3, liga: 2, copa: 2, acesso: 2, permanencia: 2, ligaConfirmacao: 1 };

export const ACAO_MINI = {
  penalti: { ok: "Pênalti decisivo convertido", erro: "Perdeu o pênalti decisivo" },
  falta: { ok: "Gol de falta no último minuto", erro: "A falta decisiva não entrou" },
  passe: { ok: "Assistência decisiva no último lance", erro: "O passe decisivo foi interceptado" },
  defesa: { ok: "Defendeu o pênalti do título", erro: "Não alcançou o pênalti decisivo" },
};

/* Chance base de converter o pênalti decisivo — usada pela simulação automática */
export function chancePenalti(c) {
  return clampR(0.62 + (c.attrs.finalizacao - 65) * 0.006 + somaTraco(c, "penalti") + (c.bonusDesafio || 0), 0.45, 0.92);
}
/* Chance estimada de cada minigame (simulação automática e dica na tela) */
export function chanceMomento(c, mini = miniDaPosicao(c.posicao)) {
  const dec = somaTraco(c, "penalti") + (c.bonusDesafio || 0);
  if (mini === "falta") return clampR(((c.attrs.finalizacao * 0.65 + c.attrs.drible * 0.35) / 145 + 0.18) * 1.15 + dec, 0.3, 0.8);
  if (mini === "passe") return clampR(c.attrs.passe / 130 + 0.3 + dec, 0.4, 0.88);
  if (mini === "defesa") return clampR(0.38 + (c.attrs.defesa - 65) * 0.006 + dec, 0.25, 0.65);
  return chancePenalti(c);
}

export function aplicarMomento(card0, acertou) {
  const card = clone(card0);
  const m = card.pendente;
  if (!m) return card;
  const acao = ACAO_MINI[m.mini || "penalti"];
  if (m.tipo === "continental") {
    if (acertou) { card.titulos.push({ tipo: "continental", nome: card.continental.nome }); card.continental.faseNome = "Campeão"; card.destaques.push(`${acao.ok} na final da ${card.continental.nome}`); }
    else { card.continental.faseNome = "Vice-campeão"; card.destaques.push(`${acao.erro} na final da ${card.continental.nome}`); }
  } else if (m.tipo === "ligaConfirmacao") {
    card.destaques.push(acertou ? `${acao.ok} no jogo da festa do ${m.ligaNome}` : `A festa do ${m.ligaNome} veio sem o seu gol, mas a taça já era de vocês`);
  } else if (m.tipo === "mundial") {
    if (acertou) { card.titulos.push({ tipo: "mundial", nome: "Mundial de Clubes" }); card.destaques.push(`${acao.ok} na final do Mundial de Clubes`); }
    else card.destaques.push(`${acao.erro}: vice-campeão do Mundial de Clubes`);
  } else if (m.tipo === "copa") {
    if (acertou) { card.titulos.push({ tipo: "copa", nome: m.nome }); card.destaques.push(`${acao.ok} na final da ${m.nome}`); }
    else card.destaques.push(`${acao.erro}: vice-campeão da ${m.nome}`);
  } else if (m.tipo === "liga" || m.tipo === "acesso" || m.tipo === "permanencia") {
    // o resultado do desafio decide de que lado da fronteira o clube termina
    const ordem = [...(card.tabelaLiga || [])];
    const i = ordem.indexOf(card.clube), f = m.fronteira;
    // de cima: garante vencendo ou se o rival também tropeçar. De baixo: precisa vencer E o rival tropeçar.
    const ladoCerto = m.ladoCerto ?? (i === f - 1);
    const terminaEmCima = ladoCerto ? (acertou || !!m.rivalTropeca) : (acertou && !!m.rivalTropeca);
    const alvo = terminaEmCima ? f - 1 : f; // índice 0-based: em cima = posição f; embaixo = posição f+1
    if (i !== -1 && i !== alvo && (i === f - 1 || i === f)) [ordem[f - 1], ordem[f]] = [ordem[f], ordem[f - 1]];
    card.tabelaLiga = ordem;
    if (i !== -1) card.posLiga = ordem.indexOf(card.clube) + 1;
    card.campeaoLiga = ordem[0] || card.campeaoLiga;
    // o que aconteceu no outro jogo, quando ele decidiu a história
    const outro = acertou && !terminaEmCima ? "Você fez sua parte, mas o rival também venceu"
      : !acertou && terminaEmCima ? "O rival também tropeçou" : null;
    const lance = acertou ? acao.ok : acao.erro;
    if (m.tipo === "liga") {
      if (terminaEmCima) { card.titulos.push({ tipo: m.segunda ? "segunda" : "liga", nome: m.ligaNome }); card.destaques.push(`${outro ? `${lance}. ${outro}` : lance}: o título do ${m.ligaNome} veio na última rodada`); }
      else card.destaques.push(`${outro ? `${lance}. ${outro}` : lance}: vice-campeão do ${m.ligaNome} por um ponto`);
    } else if (m.tipo === "acesso") {
      card.destaques.push(`${outro ? `${lance}. ${outro}` : lance}: ${terminaEmCima ? "o acesso veio na última rodada" : "o acesso escapou por um ponto"}`);
    } else {
      card.destaques.push(`${outro ? `${lance}. ${outro}` : lance}: ${terminaEmCima ? "o clube se salvou na última rodada" : "o rebaixamento foi confirmado"}`);
    }
  } else {
    const t = card.selecao;
    if (acertou) { t.campeao = true; t.resultado = "Campeão"; card.titulos.push({ tipo: t.tipo, nome: t.nome }); card.destaques.push(`${acao.ok}: a ${t.nome} é do seu país`); }
    else { t.resultado = "Vice-campeão"; card.destaques.push(`${acao.erro} na final da ${t.nome}`); }
  }
  card.momentos = [...(card.momentos || []), { tipo: m.tipo, mini: m.mini || "penalti", acertou, titulo: m.titulo }];
  card.momento = { tipo: m.tipo, mini: m.mini || "penalti", acertou };
  // próximo desafio da fila, se houver
  const fila = card.filaMomentos || [];
  card.pendente = fila[0] || null;
  card.filaMomentos = fila.slice(1);
  return card;
}

/* ---------- apelidos ---------- */
const APELIDOS = [
  { nome: "O Artilheiro", cond: (c, k) => k.gols >= 25 || c.totais.gols >= 120, cantico: (n) => `Bate no peito e canta: é gol do ${n}!` },
  { nome: "O Matador", cond: (c) => ["ATA", "SA"].includes(c.posicao) && c.attrs.finalizacao >= 84, cantico: (n) => `Deu pra ele, é gol! ${n} não perdoa!` },
  { nome: "O Maestro", cond: (c, k) => k.assist >= 15 || c.attrs.passe >= 86, cantico: (n) => `Ôôô, ${n} rege a orquestra, ôôô!` },
  { nome: "O Garçom", cond: (c, k) => k.assist >= 10, cantico: (n) => `Serve a bandeja, ${n}! Serve a bandeja!` },
  { nome: "O Mágico", cond: (c) => c.attrs.drible >= 86, cantico: (n) => `Olé, olé, olé! ${n} faz o que quer!` },
  { nome: "O Furacão", cond: (c) => c.attrs.velocidade >= 86, cantico: (n) => `Corre, ${n}! Ninguém segura o furacão!` },
  { nome: "O Paredão", cond: (c) => c.posicao === "GOL", cantico: (n) => `Pode chutar que não entra: ${n} é paredão!` },
  { nome: "A Muralha", cond: (c) => c.posicao === "ZAG", cantico: (n) => `Não passa! ${n} é muralha, não passa ninguém!` },
  { nome: "O Xerife", cond: (c) => DEFENSIVAS.includes(c.posicao) && c.attrs.defesa >= 82, cantico: (n) => `Aqui tem lei: ${n} é o xerife!` },
  { nome: "O Trator", cond: (c) => c.attrs.fisico >= 86, cantico: (n) => `Passa por cima, ${n}! Passa por cima!` },
  { nome: "O Capitão", cond: (c) => (c.tracos || []).includes("lider"), cantico: (n) => `Capitão, capitão, ${n} é o nosso capitão!` },
  { nome: "O Filho da Casa", cond: (c, k) => k.clube === c.primeiroClube, cantico: (n) => `Cria da base, orgulho da gente: ${n}!` },
  { nome: "A Joia", cond: (c) => c.idade <= 21, cantico: (n) => `Brilha, ${n}! A joia é nossa!` },
];
const APELIDO_PADRAO = { nome: "O Guerreiro", cantico: (n) => `Raça e coração: ${n} é guerreiro!` };
/* Cada torcida escolhe entre os apelidos que combinam com você (sem repetir os de outros clubes) */
function apelidoPara(c, card) {
  const usados = (c.apelidos || []).map((a) => a.nome);
  const cands = APELIDOS.filter((a) => !usados.includes(a.nome) && a.cond(c, card)).slice(0, 3);
  const ap = cands.length ? cands[hashTexto(card.clube) % cands.length] : APELIDO_PADRAO;
  const curto = c.nome.trim().split(" ").slice(-1)[0];
  return { nome: ap.nome, cantico: ap.cantico(curto) };
}

/* ---------- marcos de carreira (conquistas pessoais que viram destaque) ---------- */
const MARCAS_GOL = [50, 100, 200, 300, 400, 500];
const MARCAS_JOGO = [100, 300, 500, 700];
function detectarMarcos(antes, c, card) {
  const m = [];
  const add = (id, icone, titulo, texto) => { if (!(c.marcos || []).some((x) => x.id === id)) m.push({ id, icone, titulo, texto, ano: card.ano }); };
  if (card.jogos >= 20 && !antes.temporadas.some((s) => s.jogos >= 20)) add("profissional", "👟", "Virou profissional de verdade", `Primeira temporada com ${card.jogos} jogos.`);
  if (card.gols > 0 && antes.totais.gols === 0) add("primeiroGol", "⚽", "Primeiro gol como profissional", `Aos ${card.idade} anos, pelo ${card.clube}.`);
  MARCAS_GOL.forEach((g) => { if (antes.totais.gols < g && c.totais.gols >= g) add(`gols${g}`, "🎯", `${g} gols na carreira`, `A marca veio vestindo a camisa do ${card.clube}.`); });
  MARCAS_JOGO.forEach((j) => { if (antes.totais.jogos < j && c.totais.jogos >= j) add(`jogos${j}`, "🏟️", `${j} jogos como profissional`, "Longevidade é talento também."); });
  if (card.selecao?.convocado && antes.selecao.convocacoes === 0) add("selecao", "🌎", "Primeira convocação", `${card.selecao.nome} ${card.ano} com ${nacDe(c.nac).label}.`);
  if (card.titulos.length && !antes.lista.length) add("primeiroTitulo", "🏆", "Primeiro título da carreira", card.titulos[0].nome);
  if (card.bola.pos <= 10 && !antes.temporadas.some((s) => s.bola?.pos <= 10)) add("top10", "🔟", "Top 10 do mundo", `${card.bola.pos}º na Bola de Ouro.`);
  if (card.bola.pos <= 3 && card.bola.pos > 1 && !antes.temporadas.some((s) => s.bola?.pos <= 3)) add("podio", "🥉", "No pódio da Bola de Ouro", `${card.bola.pos}º lugar do mundo.`);
  if (card.gols >= 30) add("temporada30", "🔥", "Temporada de 30 gols", `${card.gols} gols em ${card.jogos} jogos.`);
  if (card.valor >= 100000) add("valor100", "💰", "Valor de 100 milhões", formatarValor(card.valor));
  if (card.ovrDepois >= 90) add("ovr90", "💎", "Chegou a 90 de overall", "Patamar de craque mundial.");
  return m;
}

/* Fecha a temporada: títulos, Bola de Ouro, torcida, evolução, idade e mundo. */
export function fecharTemporada(c0, card0) { sincronizarLigas(c0); return comSemente(c0.codigo, `fechar:${c0.ano}`, () => fecharTemporadaBase(c0, card0)); }
function fecharTemporadaBase(c0, card0) {
  const antes = c0;
  const c = clone(c0);
  const card = clone(card0);
  const persona = personaDe(c.personalidade);
  const fx = efeitoFoco(c);

  // mundo real anda junto e a Bola de Ouro sai do ranking contra ele
  c.mundo = simularTemporadaMundo(c.mundo);
  const PESO_BOLA = { copaMundo: 3, continental: 2, continentalSelecao: 2, mundial: 1, segunda: 0 };
  const pesoTit = card.titulos.reduce((s, t) => s + (PESO_BOLA[t.tipo] ?? 1), 0);
  const meuCard = { clube: card.clube, posicao: c.posicao, ovr: card.ovr, gols: card.gols, assist: card.assist, nota: card.nota || 6, ligaMult: ligaDe(card.ligaId).mult };
  let ranking = rankingBolaDeOuro(c.mundo, meuCard, c.nome, pesoTit);
  const bonusFama = somaTraco(c, "bolaBonus") + c.fama * 0.04 + (fx.bola || 0);
  ranking = ranking.map((r) => (r.voce ? { ...r, score: r.score + bonusFama } : r)).sort((a, b) => b.score - a.score).map((x, i) => ({ ...x, pos: i + 1 }));
  const eu = ranking.find((r) => r.voce);
  card.bola = { pos: card.jogos >= 10 ? eu?.pos ?? 999 : 999, top: ranking.filter((r) => card.jogos >= 10 || !r.voce).slice(0, 3).map((r) => ({ nome: r.voce ? c.nome : r.nome, clube: r.clube, voce: r.voce })) };
  if (card.bola.pos === 1) card.titulos.push({ tipo: "bolaOuro", nome: "Bola de Ouro" });
  // Bota de Ouro: gols × peso da liga contra o artilheiro do resto da Europa/mundo
  if (c.posicao !== "GOL" && card.jogos >= 10) {
    const multLiga = ligaDe(card.ligaId).mult;
    const pontos = card.gols * (multLiga >= 0.95 ? 2 : multLiga >= 0.8 ? 1.5 : 1);
    const alvo = Math.round(56 + rnd() * 16);
    card.artilharia = { pontos, alvo };
    if (pontos > alvo) card.titulos.push({ tipo: "botaOuro", nome: "Bota de Ouro" });
  }
  if (card.bola.pos <= 3) c.top3Bola += 1;

  // contagem de cada taça (para "seu 3º Brasileirão")
  card.titulos = card.titulos.map((t) => {
    const n = c.lista.filter((x) => x.nome === t.nome).length + 1;
    return { ...t, n, primeiro: c.lista.length === 0 };
  });
  const nTit = card.titulos.filter((t) => !ehPremioIndividual(t.tipo)).length;
  card.titulos.forEach((t) => {
    c.titulos[t.tipo] = (c.titulos[t.tipo] || 0) + 1;
    const pelaSelecao = t.tipo === "copaMundo" || t.tipo === "continentalSelecao";
    c.lista.push({ ano: card.ano, nome: t.nome, tipo: t.tipo, clube: pelaSelecao ? nacDe(c.nac).label : ehPremioIndividual(t.tipo) ? "Individual" : card.clube });
  });
  c.campeaoContinental = card.titulos.some((t) => t.tipo === "continental") && !card.emprestado ? card.clube : null;

  // totais e fama
  c.totais.jogos += card.jogos; c.totais.gols += card.gols; c.totais.assist += card.assist;
  if (card.selecao?.convocado) {
    c.totais.gols += card.selecao.gols || 0;
    c.selecao.jogos = (c.selecao.jogos || 0) + (card.selecao.jogos || 0);
    c.selecao.gols = (c.selecao.gols || 0) + (card.selecao.gols || 0);
    c.selecao.assist = (c.selecao.assist || 0) + (card.selecao.assist || 0);
  }
  const famaGanho = (Math.max(0, (card.nota - 6.5)) * 6 + nTit * 4 + (card.bola.pos <= 10 ? 8 : 0)) * (persona.famaMult || 1) * multTraco(c, "famaMult") * (c.foco === "vitrine" ? 1.4 : 1);
  c.fama = clampR(Math.round(c.fama * 0.92 + famaGanho + somaInv(c, "famaAno")), 0, 100);

  // torcida do clube em que jogou
  const tc = card.clube;
  const tAntes = c.torcida[tc] ?? 30;
  const luxos = efeitosInv(c).filter((i) => i.luxo).length;
  const ostentacao = luxos && clubeDe(tc).forca < 80 ? luxos * 3 : 0;
  if (ostentacao) card.destaques.push("Seu padrão de vida destoa do clube: a torcida estranha a ostentação");
  const delta = ((card.nota ? (card.nota - 6.6) * 9 : -4) + nTit * 7 + (card.jogos >= 30 ? 3 : 0) + somaTraco(c, "torcidaAno") + somaInv(c, "torcidaAno") - ostentacao - (c.foco === "vitrine" ? 3 : 0)) * (card.nota >= 6.6 ? multTraco(c, "torcidaMult") : 1);
  c.torcida[tc] = clampR(Math.round(tAntes + delta), 0, 100);
  card.torcida = c.torcida[tc];
  card.torcidaDelta = c.torcida[tc] - tAntes;
  const novosMarcos = [];
  if (c.torcida[tc] >= 75 && tAntes < 75 && !card.emprestado) {
    novosMarcos.push({ id: `idolo:${tc}`, icone: "💚", titulo: `Ídolo do ${tc}`, texto: "A arquibancada canta o seu nome.", ano: card.ano });
    if (!c.apelidos.some((a) => a.clube === tc)) {
      const ap = apelidoPara(c, card);
      c.apelidos.push({ clube: tc, nome: ap.nome, cantico: ap.cantico });
      novosMarcos.push({ id: `apelido:${tc}`, icone: "📣", titulo: `Apelido: "${ap.nome}"`, texto: `Assim a torcida do ${tc} passou a te chamar. Na arquibancada: "${ap.cantico}"`, ano: card.ano });
    }
  }

  // desafios decisivos: acertar vira confiança, fama e carinho da torcida; errar pesa
  let dMomentos = 0;
  (card.momentos || []).forEach((m) => {
    const peso = PESO_MOMENTO[m.tipo] || 2;
    const doClube = m.tipo !== "selecao";
    if (m.acertou) {
      dMomentos += 2 * peso;
      c.fama = clampR(c.fama + peso, 0, 100);
      if (doClube) c.torcida[tc] = clampR((c.torcida[tc] ?? 30) + peso, 0, 100);
    } else if (m.tipo !== "ligaConfirmacao") {
      dMomentos -= 2 * peso;
      if (doClube) c.torcida[tc] = clampR((c.torcida[tc] ?? 30) - peso, 0, 100);
    }
  });

  // acesso e rebaixamento: clubes mudam de divisão de verdade (inclusive o seu)
  const giro = girarDivisoes(c, card);
  const ligaFoi = ligaDe(card.ligaId);
  if (giro.subiram.includes(tc)) {
    card.acesso = { de: ligaFoi.nome, para: ligaDe(c.ligas[tc] || clubeDe(tc).liga).nome };
    card.destaques.push(`🎉 ACESSO! O ${tc} vai disputar a ${card.acesso.para} em ${card.ano + 1}`);
    c.torcida[tc] = clampR((c.torcida[tc] ?? 30) + 8, 0, 100);
  } else if (giro.cairam.includes(tc)) {
    card.rebaixado = { de: ligaFoi.nome, para: ligaDe(c.ligas[tc] || clubeDe(tc).liga).nome };
    card.destaques.push(`⬇️ Rebaixado: o ${tc} vai jogar a ${card.rebaixado.para} em ${card.ano + 1}`);
    c.torcida[tc] = clampR((c.torcida[tc] ?? 30) - 6, 0, 100);
  }
  card.torcida = c.torcida[tc];
  card.torcidaDelta = c.torcida[tc] - tAntes;

  // vaga continental para o ano seguinte (só conta se você continuar no clube)
  c.vagaContinental = !card.emprestado && !ehSegundaDivisao(card.ligaId) && !!ligaDe(card.ligaId).continental && (card.posLiga <= 4 || card.titulos.some((t) => t.tipo === "continental"));

  // evolução e idade
  const focoEvo = c.foco === "evolucao" ? 1.15 : 1;
  const focoDecl = c.foco === "preservar" ? 0.8 : 1;
  const moralAntes = c.moral ?? 65;
  const fatorDes = clampR(1 + ((card.nota || 6) - 6.8) * 0.12, 0.8, 1.25) * (c.mod?.evolucao ?? 1) * focoEvo * multInv(c, "evolucao") * (moralAntes >= 70 ? 1.05 : moralAntes < 35 ? 0.92 : 1);
  const reduc = multTraco(c, "declinio") * (c.mod?.declinio ?? 1) * focoDecl * multInv(c, "declinio");
  // OVR = NÍVEL (evolução de longo prazo, respeita o teto de potencial)
  //     + FASE (bônus temporário de -3 a +3, puxado pelo rendimento da temporada).
  // Tira a fase da temporada passada pra evolução rodar só sobre o nível.
  const ovrInicioFechar = ovrDe(c);
  const formaAntes = c.formaAttrs || {};
  ATTRS.forEach((a) => { if (formaAntes[a]) c.attrs[a] = clampR(c.attrs[a] - formaAntes[a], 40, 99); });
  const ovrNivelAntes = ovrDe(c);
  // Curva do Modo Rápido: cresce e começa a cair 2 anos depois do Modo Carreira,
  // pra o auge cair entre 27 e 30, como no Copero (o modo completo não muda).
  // e o garoto chega ao teto mais devagar (antes batia o potencial aos 23-24)
  const ritmoJovem = c.idade < 23 ? 0.8 : c.idade < 26 ? 0.9 : 1;
  const personaCurva = { ...persona, picoFim: (persona.picoFim ?? 28) + 2, declinioApartir: (persona.declinioApartir ?? 31) + 2 };
  const novos = evoluirAtributos({ ...c.attrs, fintas: 3, pernaRuim: 3 }, { ...c.potencial, fintas: 3, pernaRuim: 3 }, c.idade, personaCurva, null, reduc, fatorDes * ritmoJovem, 1 + nTit * 0.05);
  ATTRS.forEach((a) => { c.attrs[a] = novos[a]; });
  if (c.flags.cronica) { c.attrs.velocidade = clampR(c.attrs.velocidade - 1, 40, 99); c.attrs.fisico = clampR(c.attrs.fisico - 1, 40, 99); }

  // Cada variação vem com o motivo, pra o resumo explicar por que o número andou.
  const motivos = [];
  if (card.pretemporada?.deltaOvr) motivos.push({ txt: `Pré-temporada: ${card.pretemporada.nome}`, d: card.pretemporada.deltaOvr });
  const dCurva = ovrDe(c) - ovrNivelAntes;
  if (dCurva) motivos.push({ txt: dCurva > 0 ? "Evolução natural (idade e potencial)" : "Desgaste da idade", d: dCurva });
  if (card.lesao === "ruptura de ligamento") {
    const antesL = ovrDe(c);
    c.attrs.velocidade = clampR(c.attrs.velocidade - 2, 40, 99); c.attrs.fisico = clampR(c.attrs.fisico - 1, 40, 99);
    const dL = ovrDe(c) - antesL;
    if (dL) motivos.push({ txt: "Sequela da lesão grave", d: dL });
  }

  // rendimento da temporada -> empurrão na fase
  let swing = 0, swingTxt = "";
  // limites calibrados na distribuição real das notas: ~20% das temporadas empurram
  // a fase pra cima e ~20% pra baixo (gala e "muito abaixo" são os ~6% das pontas)
  if (card.jogos >= 15 && card.nota >= 8.2) { swing = 2; swingTxt = "temporada de gala"; }
  else if (card.jogos >= 15 && card.nota >= 7.65) { swing = 1; swingTxt = "temporada de afirmação"; }
  else if (card.jogos >= 10 && card.nota < 6.05) { swing = -2; swingTxt = "temporada muito abaixo"; }
  else if (card.jogos >= 10 && card.nota < 6.5) { swing = -1; swingTxt = "temporada abaixo do esperado"; }
  else if (card.jogos < 8 && !card.lesao && c.idade >= 20) { swing = -1; swingTxt = "sem ritmo de jogo"; }
  // só uma temporada de gala eleva o teto (permanente), e no máximo 3 vezes na carreira
  if (swing === 2 && (c.tetoExtra || 0) < 3) {
    const pesosP = posicaoDe(c.posicao).pesos || {};
    const melhor = ATTRS.slice().sort((a, b) => (pesosP[b] || 0.5) - (pesosP[a] || 0.5))[0];
    c.potencial = { ...c.potencial, [melhor]: clampR((c.potencial?.[melhor] ?? c.attrs[melhor]) + 1, 40, 99) };
    c.tetoExtra = (c.tetoExtra || 0) + 1;
    card.destaques.push("Temporada de gala: os olheiros reviram seu teto pra cima");
  }
  // a fase anterior se esvai pela metade e soma com o empurrão desta temporada
  const nivelFaseAntes = c.formaNivel || 0;
  const nivelFase = clampR(Math.trunc(nivelFaseAntes / 2) + swing, -3, 3);
  const ovrNivel = ovrDe(c);
  c.formaAttrs = aplicarFase(c, nivelFase);
  c.formaNivel = nivelFase;
  card.fase = nivelFase;
  // a fase antiga já foi retirada dos atributos (a pré-temporada ficou no nível, não na fase)
  const dFase = (ovrDe(c) - ovrNivel) - (ovrInicioFechar - ovrNivelAntes);
  if (dFase) {
    const txt = swing > 0 ? `Grande fase: ${swingTxt}` : swing < 0 ? `Má fase: ${swingTxt}` : dFase < 0 ? "A boa fase passou" : "Saiu da má fase";
    motivos.push({ txt, d: dFase });
  }
  card.ovrMotivos = motivos;
  c.bonusDesafio = 0;
  c.pretemporada = null;
  card.ovrDepois = ovrDe(c);
  if (card.ovrDepois >= c.picoOvr || !c.picoAttrs) c.picoAttrs = { ...c.attrs };
  c.picoOvr = Math.max(c.picoOvr, card.ovr, card.ovrDepois);

  // o rival também jogou a temporada dele
  if (c.rival) {
    const ganhouCopa = card.titulos.some((t) => t.tipo === "copaMundo");
    const { r, linha } = temporadaDoRival(c.rival, card.idade, { ano: card.ano, bolaPos: card.bola.pos, ganhouCopa });
    c.rival = r;
    if (linha) {
      card.rival = linha;
      if (linha.bola === 1) card.destaques.push(`${r.nome}, seu rival de geração, ganhou a Bola de Ouro`);
      else if (linha.bola && card.bola.pos < linha.bola) card.destaques.push(`Você terminou à frente de ${r.nome} na Bola de Ouro`);
    }
  }
  card.valorAntes = valorAtual(c0);
  c.formaMercado = formaDaTemporada(card, c.posicao, c0.formaMercado ?? 1);
  card.forma = c.formaMercado;
  card.valor = Math.max(50, Math.round(valorMercado(card.ovrDepois, c.idade + 1, c.fama) * c.formaMercado));

  // promessa feita na coletiva: a imprensa confere
  resolverPromessa(c, card, tc);

  // cabeça: a temporada mexe com o estado mental, que tende a voltar ao normal
  const dMoral = (card.nota ? (card.nota - 7.0) * 6 : -6) + nTit * 3 + ((card.share ?? 0.5) < 0.4 ? -5 : 0)
    + (card.lesao ? -6 : 0) + (card.bola.pos <= 3 ? 4 : 0) + (card.acesso ? 6 : 0) + (card.rebaixado ? -8 : 0) + dMomentos + ((c.torcida[tc] ?? 30) <= 20 ? -4 : (c.torcida[tc] ?? 30) >= 75 ? 2 : 0) + (65 - moralAntes) * 0.3 + somaInv(c, "moralAno") + (c.mod?.moralAno || 0);
  mexerMoral(c, dMoral * (dMoral < 0 ? multInv(c, "moralQueda") : 1));
  card.moral = c.moral; card.moralDelta = c.moral - moralAntes;

  card.ganhos = fecharFinancas(c, card);
  card.contratoRestante = c.contrato.restantes;
  card.patrimonio = c.patrimonio;
  card.marcos = [...detectarMarcos(antes, c, card), ...novosMarcos];
  c.marcos = [...(c.marcos || []), ...card.marcos];

  if (c.flags.blindado > 0) c.flags.blindado -= 1;
  c.flags.impasse = null;
  if (c.emprestimo) { card.destaques.push(`Fim do empréstimo: volta ao ${c.clubeNome}`); c.emprestimo = null; }
  c.mod = {};
  // o trio deste ano não volta igual no próximo
  c.pretemporadaVistas = opcoesPretemporada(antes).map((k) => k.id);
  c.idade += 1; c.ano += 1;
  c.temporadas.push(card);
  return { c, card };
}

/* ---------- aposentadoria ---------- */
export const podeAposentar = (c) => c.idade >= 33;
export function aposentadoriaForcada(c) {
  const ovr = ovrDe(c);
  if (c.idade >= 40) return "Aos 40 anos, o corpo pediu para parar.";
  if (c.idade >= 34 && ovr < 64) return "O nível caiu demais e nenhum clube da elite quis renovar.";
  return null;
}
export function aposentar(c0) {
  const c = clone(c0);
  c.aposentado = true;
  c.lenda = lendaParecida(c.picoAttrs || c.attrs, c.posicao);
  c.legado = calcularLegado(c);
  return c;
}

/* ---------- legado ---------- */
export const NIVEIS_LEGADO = [
  { min: 0, nome: "Promessa esquecida", icone: "🍂", cor: "#6C7470", desc: "O talento estava lá. A história não aconteceu." },
  { min: 90, nome: "Jogador de carreira", icone: "⚽", cor: "#9CA4A1", desc: "Uma carreira honesta, respeitada por quem viu de perto." },
  { min: 230, nome: "Ídolo de clube", icone: "💚", cor: "#12A876", desc: "Tem uma torcida que nunca vai te esquecer." },
  { min: 400, nome: "Estrela internacional", icone: "⭐", cor: "#2E6FE0", desc: "Seu nome atravessou fronteiras." },
  { min: 640, nome: "Lenda do futebol", icone: "🏆", cor: "#EBC557", desc: "Entrou para a história do esporte." },
  { min: 950, nome: "A Joia", icone: "💎", cor: "#D8B44A", desc: "Raro, lapidado, eterno. Um dos maiores de todos os tempos." },
];

export function calcularLegado(c) {
  const t = c.titulos;
  const defensivo = ["GOL", "ZAG"].includes(c.posicao);
  const idolos = Object.entries(c.torcida).filter(([, v]) => v >= 75).length;
  const partes = {
    numeros: Math.round(c.totais.gols * 0.35 + c.totais.assist * 0.25 + (defensivo ? c.totais.jogos * 0.12 : c.totais.jogos * 0.03)),
    titulos: (t.liga || 0) * 9 + (t.copa || 0) * 4 + (t.continental || 0) * 18 + (t.mundial || 0) * 8 + (t.segunda || 0) * 2,
    selecao: (t.copaMundo || 0) * 45 + (t.continentalSelecao || 0) * 18 + c.selecao.convocacoes * 4,
    premios: (t.bolaOuro || 0) * 55 + c.top3Bola * 10 + (t.botaOuro || 0) * 20,
    auge: Math.max(0, c.picoOvr - 74) * 6,
    torcida: idolos * 12 + (c.flags.social ? 8 : 0) + (c.flags.mentorJovem ? 6 : 0) + (c.flags.benfeitor ? 10 : 0),
  };
  // duelo de geração: vencer o rival no fim vale um bônus pequeno
  if (c.rival) partes.rival = pontosRival(c.rival) < Object.values(partes).reduce((a, b) => a + b, 0) ? 25 : 0;
  const pontos = Object.values(partes).reduce((a, b) => a + b, 0);
  const nivel = [...NIVEIS_LEGADO].reverse().find((n) => pontos >= n.min) || NIVEIS_LEGADO[0];
  return { pontos, partes, nivel, idolos };
}

/* ---------- propostas ---------- */
const afinidade = (c, ligaId) => (tracoDe("cidadao") && (c.tracos || []).includes("cidadao") ? 1.2 : (AFINIDADE_MERCADO[c.nac]?.[ligaId] ?? 1));

export function gerarOfertas(c, n, opts = {}) {
  const ovr = ovrDe(c);
  const atual = clubeDe(c.clubeNome);
  const emp = EMPRESARIOS.find((e) => e.id === c.empresario) || EMPRESARIOS[0];
  const alcance = emp.alcance;
  const lo = opts.lo ?? ovr - 7, hi = opts.hi ?? ovr + Math.round(alcance * 0.4);
  let pool = clubesJogaveis().filter((x) => x.nome !== c.clubeNome && x.forca >= lo && x.forca <= hi
    && !(c.flags.traidor || []).includes(x.nome) && (opts.ligas ? opts.ligas.includes(x.liga) : x.liga !== "arabia" || c.idade >= 27));
  if (!opts.permitirSegunda && ovr >= 66) pool = pool.filter((x) => !ehSegundaDivisao(x.liga));
  const escolhidas = [];
  for (let i = 0; i < n && pool.length; i++) {
    const pesos = pool.map((x) => afinidade(c, x.liga) * (1 + clampR((x.forca - atual.forca) / 15, -0.6, 1)));
    const tot = pesos.reduce((a, b) => a + b, 0);
    let r = rnd() * tot, k = 0;
    while (k < pool.length - 1 && r > pesos[k]) { r -= pesos[k]; k++; }
    const x = pool.splice(k, 1)[0];
    // evita duas propostas do mesmo país quando há outras opções
    pool = pool.filter((y) => y.liga !== x.liga || pool.length < 4);
    escolhidas.push(x);
  }
  return escolhidas.sort((a, b) => b.forca - a.forca).map((x) => ({
    clube: x.nome, forca: x.forca, cor: x.cor, ligaId: x.liga, ligaNome: ligaDe(x.liga).nome,
    status: statusPorDiff(ovr - x.forca, c.idade).label,
  }));
}

/* Quanto o clube comprador paga ao atual: valor de mercado ajustado pelos anos de
   contrato restantes, limitado pela cláusula. Sem contrato, sai de graça. */
export function valorTransferencia(c, comprador) {
  const restantes = c.contrato?.restantes ?? 0;
  if (restantes <= 0) return 0;
  const base = valorAtual(c) * (0.75 + 0.1 * Math.min(restantes, 4)) * (clubeDe(comprador).forca >= 85 ? 1.15 : 1);
  const teto = c.contrato?.multa || base;
  return Math.max(50, Math.round(Math.min(base, teto) / 50) * 50);
}

/* Clube que não quer vender: titular ou estrela com contrato longo vira peça
   que a diretoria segura. No máximo uma proposta por janela fica travada; o
   desfecho de cada caminho do impasse já sai sorteado aqui (determinístico). */
function marcarResistencia(c, ofertas) {
  if (c.emprestimo || (c.contrato?.restantes ?? 0) < 2 || c.flags.impasseAno === c.ano || !ofertas.length) return ofertas;
  const st = statusNoClube(c).id;
  if (!["titular", "estrela"].includes(st)) return ofertas;
  const atual = clubeDe(c.clubeNome);
  const o = ofertas[0]; // a mais forte (as ofertas vêm ordenadas por força)
  const valor = valorTransferencia(c, o.clube);
  const multa = c.contrato?.multa ?? Infinity;
  const pedida = Math.round(Math.min(multa, valor * 1.35) / 50) * 50;
  if (c.idade < 19 || !valor || pedida < valor * 1.15) return ofertas; // base, ou cláusula baixa: pagariam a multa
  const p = (st === "estrela" ? 0.5 : 0.28) + (o.ligaId === atual.liga ? 0.15 : 0) - (o.forca - atual.forca >= 8 ? 0.15 : 0) + (c.idade <= 23 ? 0.05 : 0);
  if (!chance(p)) return ofertas;
  const emp = empresarioDe(c);
  const resiste = {
    valor, pedida, ligaNome: o.ligaNome, status: o.status,
    empOk: chance(emp.id === "agressivo" ? 0.75 : (emp.alcance ?? 8) >= 15 ? 0.55 : 0.4),
    forcarOk: chance(st === "estrela" ? 0.55 : 0.68),
  };
  return [{ ...o, resiste }, ...ofertas.slice(1)];
}

const JORNAIS = ["Diário da Bola", "Gazeta do Gramado", "O Placar", "Jornal da Arquibancada", "Folha Esportiva", "Correio do Futebol"];
function gerarManchete(c, t) {
  const nome = c.nome.split(" ").slice(-1)[0].toUpperCase();
  const para = t.para.toUpperCase();
  const v = t.valor ? formatarValor(t.valor) : null;
  const recorde = t.valor >= 100000;
  const titulo = t.tipo === "livre" ? pick([`${para} ACERTA COM ${nome} DE GRAÇA`, `SEM CUSTO: ${nome} É DO ${para}`, `${nome} SAI DE GRAÇA E VESTE A CAMISA DO ${para}`])
    : t.tipo === "clausula" ? pick([`${para} PAGA A MULTA E LEVA ${nome}`, `CLÁUSULA PAGA: ${nome} É DO ${para}`])
    : t.tipo === "casa" ? pick([`O FILHO VOLTOU: ${nome} DE VOLTA AO ${para}`, `${nome} VOLTA PARA CASA`])
    : t.tipo === "traicao" ? pick([`TRAIÇÃO! ${nome} TROCA DE LADO E ASSINA COM O ${para}`, `${nome} CRUZA A CIDADE E A TORCIDA EXPLODE`])
    : recorde ? pick([`NEGÓCIO HISTÓRICO: ${para} PAGA ${v} POR ${nome}`, `${v}! ${nome} É O REFORÇO MAIS CARO DO ANO`])
    : pick([`${para} FECHA COM ${nome} POR ${v}`, `${nome} É DO ${para}: NEGÓCIO DE ${v}`, `${para} ANUNCIA ${nome}; TRANSFERÊNCIA DE ${v}`]);
  const ultimo = t.de;
  const linhaFina = t.tipo === "livre" ? `Com o contrato encerrado no ${ultimo}, o ${posicaoDe(c.posicao).label.toLowerCase()} de ${c.idade} anos chega sem custo e assina por ${t.anos} temporadas.`
    : t.tipo === "traicao" ? `Saída do ${ultimo} para o maior rival revolta a torcida. Valor: ${v || "não divulgado"}.`
    : `Saindo do ${ultimo}, ${c.nome} chega aos ${c.idade} anos${v ? ` por ${v}` : ""} e assina por ${t.anos} temporadas. ${recorde ? "É uma das maiores vendas da história do clube." : "A torcida já lota as redes de boas-vindas."}`;
  return { jornal: pick(JORNAIS), titulo, linhaFina, ano: c.ano };
}

/* Como a torcida que fica se despede de você */
function despedidaDe(c, t, torcidaDe, saida) {
  if (t.tipo === "traicao" || c.emprestimo) return null;
  const ap = (c.apelidos || []).find((a) => a.clube === t.de)?.nome;
  if (saida === "forcada") return `No ${t.de}, a despedida foi um muro pichado na porta do CT. O clube nem publicou nota.`;
  if (torcidaDe >= 75) return `No último jogo pelo ${t.de}, a torcida estendeu uma faixa: "Obrigado, ${ap || c.nome.trim().split(" ").slice(-1)[0]}. Pra sempre nosso."`;
  if (torcidaDe <= 20) return `No ${t.de}, ninguém sentiu a sua falta. Houve até quem comemorasse a venda.`;
  return null;
}

export function transferir(c, clubeNome, { torcidaInicial = 30, contrato = null, luvas = 0, valor = null, tipo = null, saida = null } = {}) {
  const deOnde = c.clubeNome;
  const torcidaDe = c.torcida[deOnde] ?? 30;
  const pago = valor ?? valorTransferencia(c, clubeNome);
  const maiorAntes = Math.max(0, ...(c.transferencias || []).map((x) => x.valor));
  c.clubeNome = clubeNome;
  c.contrato = contrato ? { ...contrato, clube: clubeNome } : contratoPadrao(c, clubeNome);
  if (luvas) { c.patrimonio = (c.patrimonio || 0) + luvas; c.ganhosTotais = (c.ganhosTotais || 0) + luvas; }
  c.torcida[clubeNome] = c.torcida[clubeNome] ?? torcidaInicial;
  c.vagaContinental = false;
  c.emprestimo = null;
  const t = { ano: c.ano, de: deOnde, para: clubeNome, valor: pago, anos: c.contrato.anos, tipo: tipo || (pago === 0 ? "livre" : "venda") };
  t.manchete = gerarManchete(c, t);
  t.manchete.despedida = despedidaDe(c, t, torcidaDe, saida);
  c.transferencias = [...(c.transferencias || []), t];
  c.ultimaTransferencia = t;
  if (pago >= 20000 && pago > maiorAntes) {
    c.marcos = [...(c.marcos || []), { id: `transf:${c.ano}`, icone: "💸", titulo: maiorAntes < 20000 ? "Primeira grande transferência" : "Transferência mais cara da carreira", texto: `${formatarValor(pago)} do ${deOnde} para o ${clubeNome}.`, ano: c.ano }];
  }
  return deOnde;
}

/* ---------- eventos ---------- */
function rivalDoClube(nome) {
  const par = CLASSICOS.find((p) => p.includes(nome));
  if (par) return par.find((x) => x !== nome);
  const cl = clubeDe(nome);
  const mesma = clubesJogaveis().filter((x) => x.liga === cl.liga && x.nome !== nome).sort((a, b) => b.forca - a.forca);
  return mesma[0]?.nome || null;
}

const r = (texto) => texto;

export const EVENTOS = [
  {
    id: "propostas", icone: "📨",
    peso: (c, ctx) => {
      if (c.flags.blindado > 0 || !ctx.ofertas?.length || c.idade < 17) return 0;
      const d = ovrDe(c) - clubeDe(c.clubeNome).forca;
      return (d >= 4 ? 8 : d >= 0 ? 3 : 1.5) + (c.mod.ofertasExtra ? 6 : 0);
    },
    preparar: (c) => {
      const emp = EMPRESARIOS.find((e) => e.id === c.empresario) || EMPRESARIOS[0];
      // 1, 2 ou 3 propostas, sorteado; estrela e empresário forte puxam pra cima
      const dif = ovrDe(c) - clubeDe(c.clubeNome).forca;
      const r0 = rnd() + (dif >= 6 ? 0.2 : 0) + (emp.nOfertas >= 5 ? 0.1 : 0);
      const n = Math.min(4, (r0 < 0.45 ? 1 : r0 < 0.8 ? 2 : 3) + somaTraco(c, "ofertasExtra") + (c.mod.ofertasExtra || 0));
      if (!c.ligaAlvo) return { ofertas: marcarResistencia(c, gerarOfertas(c, n)) };
      // liga pedida ao empresário: a maior parte das propostas vem de lá, com faixa de nível mais larga
      const ovr = ovrDe(c);
      const daLiga = gerarOfertas(c, Math.max(2, n - 1), { ligas: [c.ligaAlvo], lo: ovr - 12, hi: ovr + Math.round(emp.alcance * 0.5) + 3 });
      const outras = gerarOfertas(c, Math.max(1, n - daLiga.length)).filter((o) => !daLiga.some((d) => d.clube === o.clube));
      return { ofertas: marcarResistencia(c, [...daLiga, ...outras].slice(0, n)), ligaAlvo: c.ligaAlvo, achouNaLiga: daLiga.length };
    },
    titulo: () => "Janela de transferências",
    texto: (c, ctx) => {
      const base = `Seu empresário chegou com ${ctx.ofertas.length === 1 ? "uma proposta" : `${ctx.ofertas.length} propostas`}. Valor de mercado atual: ${formatarValor(valorAtual(c))}.`;
      if (!ctx.ligaAlvo) return base;
      const liga = ligaDe(ctx.ligaAlvo).nome;
      return ctx.achouNaLiga ? `📞 Ele sondou a ${liga} a seu pedido. ${base}` : `📞 Ele ligou para a ${liga}, mas nenhum clube de lá quis apostar em você agora. ${base}`;
    },
    opcoes: (c, ctx) => [
      ...ctx.ofertas.map((o) => ({
        id: `ir:${o.clube}`, label: `Negociar com o ${o.clube}`, dica: `${o.ligaNome} · chegaria como ${o.status.toLowerCase()} · ~${formatarValor(contratoPadrao(c, o.clube).salario)}/ano${comparaSalario(c, contratoPadrao(c, o.clube).salario)} · transferência de ${valorTransferencia(c, o.clube) ? formatarValor(valorTransferencia(c, o.clube)) : "graça"}${o.resiste ? ` · ⚠️ o ${c.clubeNome} resiste a vender` : ""}`, oferta: o,
        ...(o.resiste ? { risco: "equilibrado" } : { negociar: { clube: o.clube, tipo: "transferencia" } }),
        efeito: (c, extra) => {
          if (o.resiste) {
            c.flags.impasse = { clube: o.clube, forca: o.forca, ...o.resiste };
            c.flags.impasseAno = c.ano;
            return r(`O ${o.clube} formalizou a proposta de ${formatarValor(o.resiste.valor)}, mas o ${c.clubeNome} recusou na hora: diz que você não está à venda e só conversa a partir de ${formatarValor(o.resiste.pedida)}.`);
          }
          const de = transferir(c, o.clube, { contrato: extra?.contrato }); c.fama = clampR(c.fama + (o.forca > clubeDe(de).forca ? 4 : 0), 0, 100); return r(`Contrato assinado. Nova casa: ${o.clube}.`);
        },
      })),
      ...(c.flags.ligaPedida !== c.ano ? [{ id: "pedirLiga", label: "📞 Pedir propostas de outra liga", dica: c.ligaAlvo ? `Hoje ele está sondando a ${ligaDe(c.ligaAlvo).nome}` : "Diga ao empresário onde você quer jogar", escolherLiga: true, efeito: () => "" }] : []),
      { id: "ficar", label: `Ficar no ${c.clubeNome}`, dica: ctx.ofertas.some((o) => o.forca > clubeDe(c.clubeNome).forca) ? "Recusar clubes maiores: a torcida valoriza a lealdade" : "Nenhuma proposta melhor que o seu clube",
        efeito: (c) => { const melhor = ctx.ofertas.some((o) => o.forca > clubeDe(c.clubeNome).forca); c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + (melhor ? 5 : 1), 0, 100); return r(melhor ? "Você recusou clubes maiores e ficou. A arquibancada notou." : "Nada que valesse a mudança. Você segue onde está."); } },
    ],
  },
  {
    id: "renovacao", icone: "✍️",
    peso: (c) => (c.idade >= 19 && ["Titular", "Estrela do time"].includes(statusNoClube(c).label) && c.flags.blindado === 0 ? 2.5 : 0),
    titulo: (c) => `O ${c.clubeNome} quer renovar`,
    texto: () => "A diretoria oferece um contrato longo, com aumento. Assinar agora fecha a porta para o mercado por um tempo.",
    opcoes: (c) => [
      { id: "renovar", label: "Sentar para negociar a renovação", dica: "Torcida e técnico te abraçam · sem propostas por 2 temporadas",
        negociar: { clube: c.clubeNome, tipo: "renovacao" },
        efeito: (c, extra) => { if (extra?.contrato) c.contrato = extra.contrato; c.flags.blindado = 2; c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 8, 0, 100); c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.05; return r("Renovado. Você é um dos pilares do projeto."); } },
      { id: "esperar", label: "Esperar o mercado", dica: "Mais propostas na próxima janela · a torcida estranha",
        efeito: (c) => { c.mod.ofertasExtra = 1; c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) - 6, 0, 100); return r("Você deixou a caneta na mesa. O mercado ficou sabendo."); } },
    ],
  },
  {
    id: "classico", icone: "⚔️",
    peso: (c) => (rivalDoClube(c.clubeNome) && c.idade >= 18 ? 2 : 0),
    preparar: (c) => ({ rival: rivalDoClube(c.clubeNome) }),
    titulo: (c, ctx) => `Clássico contra o ${ctx.rival}`,
    texto: () => "Semana de clássico. Os microfones estão na sua frente e a cidade inteira quer saber o que você vai dizer.",
    opcoes: (c, ctx) => [
      { id: "provocar", label: "Provocar o rival", dica: "Arriscado: pode virar herói ou piada",
        efeito: (c) => {
          const t = c.clubeNome;
          if (chance(0.55)) { c.torcida[t] = clampR((c.torcida[t] ?? 30) + 12, 0, 100); c.fama = clampR(c.fama + 6, 0, 100); return r(`Você falou e cumpriu: gol no clássico e o ${ctx.rival} calado.`); }
          c.torcida[t] = clampR((c.torcida[t] ?? 30) - 10, 0, 100); return r("Derrota feia. A provocação virou meme e a torcida cobrou.");
        } },
      { id: "respeitar", label: "Falar com respeito", dica: "Sem risco",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 2, 0, 100); return r("Discurso sereno. Clássico sem grandes histórias para você."); } },
    ],
  },
  {
    id: "sub20", icone: "🌎",
    peso: (c) => (c.idade >= 17 && c.idade <= 20 && ovrDe(c) >= forcaSelecao(c) - 20 ? 2.5 : 0),
    titulo: (c) => `Convocação para a seleção sub-20 de ${nacDe(c.nac).label}`,
    texto: () => "O torneio cai no meio da temporada do clube. Ir significa perder jogos e espaço no time.",
    opcoes: () => [
      { id: "ir", label: "Aceitar a convocação", dica: "Evolui e aparece para a seleção principal · perde espaço no clube",
        efeito: (c) => { ATTRS.forEach((a) => { c.potencial[a] = clampR(c.potencial[a] + 1, 40, 99); }); c.fama = clampR(c.fama + 5, 0, 100); c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.1; c.flags.selecaoFria = Math.max(0, (c.flags.selecaoFria || 0) - 1); return r("Você vestiu a camisa da seleção pela primeira vez. Os olheiros anotaram."); } },
      { id: "dispensa", label: "Pedir dispensa", dica: "Fica no clube · a seleção pode esfriar com você",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 4, 0, 100); c.flags.selecaoFria = (c.flags.selecaoFria || 0) + 1; return r("Você ficou no clube. A comissão técnica da seleção não gostou."); } },
    ],
  },
  {
    id: "lesaoPre", icone: "🩺",
    peso: (c) => 1.2 * personaDe(c.personalidade).risco * multTraco(c, "lesaoMult") + (c.idade >= 29 ? 0.8 : 0),
    titulo: () => "Dor no joelho na pré-temporada",
    texto: () => "Os exames mostram uma lesão no menisco. O médico recomenda cirurgia; o técnico quer você em campo.",
    opcoes: () => [
      { id: "operar", label: "Operar agora", dica: "Perde metade da temporada · sem sequelas",
        efeito: (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.5; return r("Cirurgia feita. Vai ser uma temporada curta, mas o joelho está novo."); } },
      { id: "sacrificio", label: "Jogar no sacrifício", dica: "Joga a temporada toda · risco de sequela para sempre",
        efeito: (c) => {
          if (chance(0.4)) { c.flags.cronica = true; c.attrs.velocidade = clampR(c.attrs.velocidade - 3, 40, 99); c.attrs.fisico = clampR(c.attrs.fisico - 3, 40, 99); return r("O joelho não aguentou. A lesão virou crônica e vai cobrar a conta todo ano."); }
          c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 5, 0, 100); return r("Infiltração, faixa e raça. Deu certo — a torcida viu tudo.");
        } },
    ],
  },
  {
    id: "polemica", icone: "📱",
    peso: (c) => (c.fama >= 25 ? 1.5 : 0),
    titulo: () => "Polêmica nas redes",
    texto: () => "Um vídeo seu reclamando do técnico vazou. O assunto está em alta.",
    opcoes: () => [
      { id: "desculpas", label: "Pedir desculpas publicamente", dica: "Encerra o assunto · perde um pouco de fama",
        efeito: (c) => { c.fama = clampR(c.fama - 3, 0, 100); return r("Nota oficial, abraço no técnico, vida que segue."); } },
      { id: "frente", label: "Bater de frente", dica: "Fama sobe · torcida e diretoria se irritam",
        efeito: (c) => { c.fama = clampR(c.fama + 8, 0, 100); c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) - 8, 0, 100); if (chance(0.35)) { c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.15; return r("Você não recuou. O técnico também não: começou a temporada no banco."); } return r("Você não recuou e virou assunto nacional."); } },
    ],
  },
  {
    id: "novoTecnico", icone: "📋",
    peso: (c) => (c.idade >= 18 ? 1.5 : 0),
    titulo: () => "Técnico novo, ideia nova",
    texto: () => "O novo treinador quer te usar numa função diferente, mais tática e com menos liberdade.",
    opcoes: () => [
      { id: "aceitar", label: "Aceitar a nova função", dica: "Mais minutos · seus números ofensivos caem um pouco",
        efeito: (c) => { c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.12; c.attrs.passe = clampR(c.attrs.passe + 1, 40, 99); c.attrs.defesa = clampR(c.attrs.defesa + 1, 40, 99); return r("Você comprou a ideia. O técnico confia em você."); } },
      { id: "recusar", label: "Bater o pé", dica: "Mantém seu estilo · pode perder espaço",
        efeito: (c) => { if (chance(0.4)) return r("Ele não durou até outubro. O substituto te devolveu a posição."); c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.15; return r("Você recusou. Passou boa parte da temporada no banco."); } },
    ],
  },
  {
    id: "pretemporada", icone: "🏋️",
    peso: () => 1.5,
    titulo: () => "Planejamento da pré-temporada",
    texto: (c) => (c.idade <= 25 ? "O preparador físico oferece um programa pesado de evolução." : "Seu corpo já não é o mesmo dos 20 anos. Como você quer se preparar?"),
    opcoes: () => [
      { id: "elite", label: "Rotina de elite", dica: "Evolui mais rápido · risco de lesão maior",
        efeito: (c) => { c.mod.evolucao = 1.25; c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) + 0.06; return r("Dois treinos por dia e nenhum fim de semana livre."); } },
      { id: "preservar", label: "Preservar o corpo", dica: "Menos lesão · envelhece mais devagar",
        efeito: (c) => { c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) - 0.05; c.mod.declinio = 0.7; return r("Fisiologia, sono e carga controlada."); } },
    ],
  },
  {
    id: "fortuna", icone: "💰",
    peso: (c) => (c.idade >= 28 && ovrDe(c) >= 74 && !["arabia", "mls"].includes(clubeDe(c.clubeNome).liga) ? 2 : 0),
    preparar: (c) => {
      const op = clubesJogaveis().filter((x) => ["arabia", "mls"].includes(x.liga)).sort((a, b) => b.forca - a.forca).slice(0, 6);
      return { clube: pick(op) };
    },
    titulo: (c, ctx) => `Proposta milionária do ${ctx.clube.nome}`,
    texto: (c, ctx) => `${ligaDe(ctx.clube.liga).nome}. O salário é cinco vezes o atual. Mas é longe dos holofotes do futebol de elite.`,
    opcoes: (c, ctx) => [
      { id: "aceitar", label: "Aceitar a fortuna", dica: "Vida feita · sai da briga pela Bola de Ouro e pela seleção",
        efeito: (c) => { transferir(c, ctx.clube.nome, { torcidaInicial: 40 }); c.fama = clampR(c.fama - 8, 0, 100); c.flags.selecaoFria = (c.flags.selecaoFria || 0) + 1; return r(`Você fez as malas para o ${ctx.clube.nome}.`); } },
      { id: "recusar", label: "Seguir na elite", dica: "A torcida atual valoriza",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 4, 0, 100); return r("Dinheiro nenhum compra a sua ambição."); } },
    ],
  },
  {
    id: "empresario", icone: "🧳",
    peso: (c) => (c.idade >= 18 ? 1.3 : 0),
    preparar: (c) => ({ novo: pick(EMPRESARIOS.filter((e) => e.id !== c.empresario && e.id !== "iniciante")) }),
    titulo: () => "Um empresário bateu na sua porta",
    texto: (c, ctx) => `${ctx.novo.icone} ${ctx.novo.nome}: ${ctx.novo.desc}`,
    opcoes: (c, ctx) => [
      { id: "trocar", label: `Contratar o ${ctx.novo.nome.toLowerCase()}`, dica: ctx.novo.resumo,
        efeito: (c) => { c.empresario = ctx.novo.id; if (ctx.novo.id === "agressivo") c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) - 4, 0, 100); if (ctx.novo.id === "midiatico") c.fama = clampR(c.fama + 6, 0, 100); return r(`Novo empresário: ${ctx.novo.nome.toLowerCase()}.`); } },
      { id: "manter", label: "Manter quem já cuida de você", dica: "Nada muda",
        efeito: () => r("Time que está ganhando não se mexe.") },
    ],
  },
  {
    id: "capitao", icone: "🎖️",
    peso: (c) => (c.idade >= 24 && ["Titular", "Estrela do time"].includes(statusNoClube(c).label) && (c.torcida[c.clubeNome] ?? 0) >= 50 ? 1.8 : 0),
    titulo: () => "A braçadeira é sua?",
    texto: () => "O capitão se aposentou e o técnico quer você no lugar dele.",
    opcoes: () => [
      { id: "aceitar", label: "Aceitar a braçadeira", dica: "Torcida sobe · mais pressão nas suas notas",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 10, 0, 100); c.mod.notaBonus = (c.mod.notaBonus || 0) + (chance(0.7) ? 0.15 : -0.2); return r("Capitão. A faixa pesa — e você gosta disso."); } },
      { id: "recusar", label: "Prefiro só jogar", dica: "Sem mudanças",
        efeito: () => r("Você agradeceu e indicou um companheiro.") },
    ],
  },
  {
    id: "noitada", icone: "🎉",
    peso: (c) => (c.idade <= 27 ? 1.2 * (personaDe(c.personalidade).id === "festeiro" ? 2 : 1) : 0),
    titulo: () => "Convite para a festa do ano",
    texto: () => "Um cantor famoso te chamou para o aniversário dele. Na véspera de um jogo.",
    opcoes: () => [
      { id: "ir", label: "Ir à festa", dica: "Fama sobe · pode dar problema",
        efeito: (c) => { c.fama = clampR(c.fama + 6, 0, 100); if (chance(0.35 * personaDe(c.personalidade).risco)) { c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.12; c.attrs.fisico = clampR(c.attrs.fisico - 2, 40, 99); return r("Fotos às 5 da manhã. Multa, banco e manchete."); } return r("Ninguém viu nada. Só os stories."); } },
      { id: "casa", label: "Ficar em casa", dica: "Mais foco na evolução",
        efeito: (c) => { c.mod.evolucao = Math.max(c.mod.evolucao ?? 1, 1.1); return r("Dormiu cedo e fez gol no dia seguinte."); } },
    ],
  },
  {
    id: "mentor", icone: "🧓",
    peso: (c) => (c.idade <= 20 ? 2.2 : 0),
    titulo: () => "Um veterano te adotou",
    texto: () => "O ídolo do elenco, em fim de carreira, se ofereceu para treinar com você depois dos treinos.",
    opcoes: () => [
      { id: "aceitar", label: "Aceitar a mentoria", dica: "Seu teto sobe · evolução mais lenta este ano",
        efeito: (c) => { ATTRS.forEach((a) => { c.potencial[a] = clampR(c.potencial[a] + 2, 40, 99); }); c.mod.evolucao = 0.9; return r("Horas extras, vídeos, conselhos. Ele vê algo grande em você."); } },
      { id: "sozinho", label: "Focar no próprio jogo", dica: "Mais minutos agora",
        efeito: (c) => { c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.08; return r("Você agradeceu e seguiu do seu jeito."); } },
    ],
  },
  {
    id: "emprestimo", icone: "🔁",
    peso: (c) => (c.idade <= 22 && ["Reserva", "Fora dos planos", "Base"].includes(statusNoClube(c).label) ? 3 : 0),
    preparar: (c) => {
      const ovr = ovrDe(c);
      const op = clubesJogaveis().filter((x) => x.nome !== c.clubeNome && x.forca <= ovr + 1 && x.forca >= ovr - 7);
      // três clubes, de preferência de ligas diferentes (como no Copero)
      const destinos = [];
      const pool = [...op];
      while (destinos.length < 3 && pool.length) {
        const x = pool.splice(rand(0, pool.length - 1), 1)[0];
        if (!destinos.some((d) => d.liga === x.liga) || pool.length < 3) destinos.push(x);
      }
      return { destinos };
    },
    grade: true,
    titulo: () => "Oferta de empréstimo",
    texto: (c, ctx) => (ctx.destinos.length ? "Seu clube quer que você ganhe minutos em outro time. Escolha onde seguir seu desenvolvimento." : "Um clube menor quer você por uma temporada."),
    opcoes: (c, ctx) => [
      ...ctx.destinos.map((d) => ({ id: `ir:${d.nome}`, label: `Ir por empréstimo para o ${d.nome}`, dica: `${ligaDe(d.liga).nome} · joga muito por um ano e volta`,
        oferta: { clube: d.nome, forca: d.forca, cor: d.cor, ligaId: d.liga, ligaNome: ligaDe(d.liga).nome, status: "Titular" }, risco: "seguro",
        efeito: (c) => { c.emprestimo = { destino: d.nome }; c.torcida[d.nome] = c.torcida[d.nome] ?? 35; return r(`Um ano no ${d.nome} para ganhar casca.`); } })),
      { id: "ficar", label: "Ficar e brigar pela posição", dica: "Pode ganhar espaço — ou não",
        efeito: (c) => { if (chance(0.35)) { c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.25; return r("Você ficou, treinou como nunca e roubou a vaga."); } return r("Você ficou. O banco continua seu lugar mais frequente."); } },
    ],
  },
  {
    id: "forcarSaida", icone: "🚪",
    peso: (c) => (c.idade >= 21 && ["Reserva", "Fora dos planos"].includes(statusNoClube(c).label) ? 2.5 : 0),
    preparar: (c) => ({ ofertas: gerarOfertas(c, 1, { lo: ovrDe(c) - 9, hi: ovrDe(c) - 1, permitirSegunda: true }) }),
    titulo: () => "Cansado do banco",
    texto: () => "Mais uma temporada sem jogar. Você pode forçar a saída — mas vai sair pela porta dos fundos.",
    opcoes: (c, ctx) => [
      ...(ctx.ofertas[0] ? [{ id: "forcar", label: `Forçar a ida ao ${ctx.ofertas[0].clube}`, dica: `${ctx.ofertas[0].ligaNome} · titular garantido · torcida atual fica magoada`,
        efeito: (c) => { const de = transferir(c, ctx.ofertas[0].clube, { saida: "forcada" }); c.torcida[de] = clampR((c.torcida[de] ?? 30) - 15, 0, 100); return r(`Saiu brigado, mas vai jogar: ${ctx.ofertas[0].clube}.`); } }] : []),
      { id: "aguentar", label: "Aguentar calado", dica: "O técnico pode reconhecer",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 5, 0, 100); c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.1; return r("Profissionalismo. Os minutos começaram a aparecer."); } },
    ],
  },
  {
    id: "traicao", icone: "🐍",
    peso: (c) => {
      const rv = rivalDoClube(c.clubeNome);
      return rv && ovrDe(c) >= 74 && statusNoClube(c).id === "estrela" && !(c.flags.traidor || []).includes(rv) ? 1.8 : 0;
    },
    preparar: (c) => ({ rival: rivalDoClube(c.clubeNome) }),
    titulo: (c, ctx) => `O ${ctx.rival} te quer`,
    texto: (c, ctx) => `O maior rival do ${c.clubeNome} oferece o dobro do salário. Aceitar é virar inimigo de uma torcida inteira.`,
    opcoes: (c, ctx) => [
      { id: "trair", label: `Assinar com o ${ctx.rival}`, dica: "Fama sobe · sua torcida atual nunca vai perdoar",
        efeito: (c) => { const de = transferir(c, ctx.rival, { torcidaInicial: 20, tipo: "traicao" }); c.torcida[de] = 0; c.flags.traidor = [...(c.flags.traidor || []), de]; c.fama = clampR(c.fama + 8, 0, 100); return r(`Você cruzou a cidade. No ${de}, seu nome virou palavrão.`); } },
      { id: "recusar", label: "Jamais", dica: "A torcida vai cantar seu nome",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 15, 0, 100); return r("A recusa vazou. Faixa na arquibancada no jogo seguinte."); } },
    ],
  },
  {
    id: "voltarCasa", icone: "🏠",
    peso: (c) => (c.idade >= 30 && c.primeiroClube !== c.clubeNome && !(c.flags.traidor || []).includes(c.primeiroClube) ? 2 : 0),
    titulo: (c) => `O ${c.primeiroClube} quer você de volta`,
    texto: () => "O clube que te revelou sonha com o seu retorno. O nível é menor, mas é a sua casa.",
    opcoes: (c) => [
      { id: "voltar", label: `Voltar ao ${c.primeiroClube}`, dica: "Torcida enorme desde o primeiro dia",
        efeito: (c) => { transferir(c, c.primeiroClube, { tipo: "casa" }); c.torcida[c.primeiroClube] = clampR((c.torcida[c.primeiroClube] ?? 30) + 25, 0, 100); return r("O filho voltou para casa. Estádio cheio na reapresentação."); } },
      { id: "seguir", label: "Ainda não é a hora", dica: "Segue onde está",
        efeito: () => r("Um dia, talvez. Hoje ainda há o que provar.") },
    ],
  },
  {
    id: "social", icone: "🤝",
    peso: (c) => (c.fama >= 35 && !c.flags.social ? 1.4 : 0),
    titulo: () => "Um projeto social com o seu nome",
    texto: () => "Uma ONG propõe abrir uma escolinha no bairro onde você cresceu, com o seu nome na fachada.",
    opcoes: () => [
      { id: "fundar", label: "Fundar o projeto", dica: "Legado fora de campo · torcida e fama sobem",
        efeito: (c) => { c.flags.social = true; c.fama = clampR(c.fama + 5, 0, 100); c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 6, 0, 100); return r("Duzentas crianças inscritas na primeira semana."); } },
      { id: "depois", label: "Deixar para depois", dica: "Foco total no campo",
        efeito: (c) => { c.mod.evolucao = Math.max(c.mod.evolucao ?? 1, 1.05); return r("Agora é só futebol."); } },
    ],
  },
  {
    id: "patrocinio", icone: "👟",
    peso: (c) => (c.fama >= 20 ? 1.2 : 0),
    titulo: () => "Contrato com marca global",
    texto: () => "Uma marca esportiva quer você como rosto da campanha mundial. A agenda vai ficar cheia.",
    opcoes: () => [
      { id: "assinar", label: "Assinar a campanha", dica: "Fama dispara · menos tempo de treino",
        efeito: (c) => { c.fama = clampR(c.fama + 10, 0, 100); c.mod.evolucao = Math.min(c.mod.evolucao ?? 1, 0.92); return r("Seu rosto está em outdoors de três continentes."); } },
      { id: "focar", label: "Recusar e focar no campo", dica: "Evolução extra",
        efeito: (c) => { c.mod.evolucao = Math.max(c.mod.evolucao ?? 1, 1.1); return r("Fama passa. Bola no pé fica."); } },
    ],
  },
  {
    id: "rivalMundo", icone: "🥊",
    peso: (c) => (ovrDe(c) >= 78 && c.mundo ? 1.5 : 0),
    preparar: (c) => {
      const ovr = ovrDe(c);
      const op = (c.mundo?.jogadores || []).filter((j) => !j.aposentado && Math.abs(j.ovr - ovr) <= 4 && j.posicao === c.posicao);
      return { rival: op.length ? pick(op) : pick((c.mundo?.jogadores || []).filter((j) => !j.aposentado && j.ovr >= ovr - 2)) };
    },
    titulo: (c, ctx) => `${ctx.rival?.nome || "Um rival"} te alfinetou`,
    texto: (c, ctx) => `Numa entrevista, ${ctx.rival?.nome || "ele"} (${ctx.rival?.clubeNome || "?"}) disse que você é "superestimado".`,
    opcoes: () => [
      { id: "responder", label: "Responder à altura", dica: "Motivação extra · pode sair pela culatra",
        efeito: (c) => { c.fama = clampR(c.fama + 5, 0, 100); c.mod.notaBonus = (c.mod.notaBonus || 0) + (chance(0.65) ? 0.2 : -0.15); return r("A rivalidade virou assunto mundial."); } },
      { id: "ignorar", label: "Responder em campo", dica: "Sem risco",
        efeito: () => r("Você não disse nada. Deixou para a bola falar.") },
    ],
  },
  {
    id: "veterano", icone: "🥗",
    peso: (c) => (c.idade >= 29 ? 2 : 0),
    titulo: () => "Rotina de atleta veterano",
    texto: () => "Nutricionista, crioterapia, sono monitorado. Custa caro e muda sua vida inteira fora de campo.",
    opcoes: () => [
      { id: "adotar", label: "Adotar a rotina completa", dica: "Envelhece bem mais devagar este ano",
        efeito: (c) => { c.mod.declinio = 0.55; c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) - 0.03; return r("Você virou o primeiro a chegar e o último a sair do CT."); } },
      { id: "manter", label: "Manter o estilo de sempre", dica: "Mais leve · o tempo cobra",
        efeito: (c) => { c.fama = clampR(c.fama + 2, 0, 100); return r("Do seu jeito, como sempre foi."); } },
    ],
  },
];

/* ---------- terceira opção nos eventos que pediam um meio-termo ---------- */
const sobe = (c, clube, v) => { c.torcida[clube] = clampR((c.torcida[clube] ?? 30) + v, 0, 100); };
const EXTRAS_OPCOES = {
  renovacao: () => [{ id: "clausula", label: "Renovar com cláusula de saída", dica: "Meio-termo: 1 temporada sem propostas · a diretoria aceita, a torcida nem tanto",
    efeito: (c) => { c.flags.blindado = 1; sobe(c, c.clubeNome, 3); return "Renovado, mas com uma porta entreaberta para o mercado."; } }],
  classico: (c, ctx) => [{ id: "dedicar", label: "Dedicar o clássico à torcida", dica: "Sem provocar ninguém, mas com o coração",
    efeito: (c) => { if (chance(0.5)) { sobe(c, c.clubeNome, 7); return `Gol no clássico e o beijo no escudo. A torcida do ${c.clubeNome} não esquece.`; } sobe(c, c.clubeNome, 2); return `Empate duro contra o ${ctx.rival}. Pelo menos ninguém pode dizer que faltou entrega.`; } }],
  lesaoPre: () => [{ id: "conservador", label: "Tratamento conservador", dica: "Perde algumas semanas · pequeno risco de sequela",
    efeito: (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.8; if (chance(0.15)) { c.flags.cronica = true; c.attrs.velocidade = clampR(c.attrs.velocidade - 2, 40, 99); return "Fisioterapia e paciência. O joelho voltou, mas nunca mais foi o mesmo."; } return "Fisioterapia e paciência. Voltou bem depois de um mês."; } }],
  polemica: () => [{ id: "silencio", label: "Silêncio total", dica: "Deixa a poeira baixar sozinha",
    efeito: (c) => { c.fama = clampR(c.fama - 1, 0, 100); return "Você não disse nada. Em uma semana ninguém lembrava mais."; } }],
  novoTecnico: () => [{ id: "conversar", label: "Pedir uma conversa franca", dica: "Pode chegar a um acordo — ou não",
    efeito: (c) => { if (chance(0.6)) { c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.06; return "Café, prancheta e acordo: você joga na sua, ele ganha sua entrega sem bola."; } c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.05; return "A conversa não andou. Começou a temporada fora de alguns jogos."; } }],
  pretemporada: () => [{ id: "equilibrio", label: "Programa equilibrado", dica: "Um pouco de evolução, sem risco extra",
    efeito: (c) => { c.mod.evolucao = 1.1; return "Nem tanto ao céu, nem tanto à terra."; } }],
  fortuna: (c, ctx) => [{ id: "leilao", label: "Usar a proposta para renovar", dica: "Aumento no clube atual · a torcida percebe a jogada",
    efeito: (c) => { c.flags.blindado = 1; sobe(c, c.clubeNome, -3); c.fama = clampR(c.fama + 2, 0, 100); return `A oferta do ${ctx.clube.nome} virou aumento no ${c.clubeNome}.`; } }],
  noitada: () => [{ id: "rapido", label: "Passar rápido e ir embora cedo", dica: "Aparece na foto sem exagero",
    efeito: (c) => { c.fama = clampR(c.fama + 3, 0, 100); if (chance(0.1)) { c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.05; return "Saiu cedo, mas a foto com o copo na mão viralizou."; } return "Uma foto, um abraço no cantor e cama às 23h."; } }],
  mentor: () => [{ id: "folgas", label: "Treinar com ele só nas folgas", dica: "Um pouco de cada",
    efeito: (c) => { ["finalizacao", "passe", "drible"].forEach((a) => { c.potencial[a] = clampR(c.potencial[a] + 1, 40, 99); }); return "Sábados de manhã no CT. Pequenos ajustes que fazem diferença."; } }],
  traicao: (c, ctx) => [{ id: "renovar", label: "Usar a proposta para renovar", dica: "Aumento e permanência · a torcida desconfia",
    efeito: (c) => { c.flags.blindado = 1; sobe(c, c.clubeNome, -4); return `O ${ctx.rival} serviu de moeda de troca. Ficou, mais rico.`; } }],
  patrocinio: () => [{ id: "local", label: "Marca nacional, agenda leve", dica: "Fama sobe um pouco, sem atrapalhar o treino",
    efeito: (c) => { c.fama = clampR(c.fama + 4, 0, 100); return "Comercial no intervalo da novela, e só."; } }],
  voltarCasa: (c) => [{ id: "promessa", label: "Prometer voltar para encerrar a carreira", dica: "A torcida do clube que te revelou já começa a te esperar",
    efeito: (c) => { sobe(c, c.primeiroClube, 10); return `A promessa virou faixa no estádio do ${c.primeiroClube}.`; } }],
  social: () => [{ id: "doacao", label: "Fazer uma doação discreta", dica: "Ajuda sem holofote",
    efeito: (c) => { sobe(c, c.clubeNome, 3); return "Ninguém soube. Mas fez diferença para muita gente."; } }],
  rivalMundo: () => [{ id: "elogiar", label: "Elogiar o rival em público", dica: "Classe pura · a imprensa adora",
    efeito: (c) => { c.fama = clampR(c.fama + 3, 0, 100); return "Você desarmou a provocação com um elogio. Virou exemplo."; } }],
};

/* Selo de risco mostrado em cada opção */
const RISCOS = {
  "propostas:ficar": "seguro", "renovacao:renovar": "seguro", "renovacao:esperar": "arriscado",
  "classico:provocar": "arriscado", "classico:respeitar": "seguro", "classico:dedicar": "equilibrado",
  "sub20:ir": "equilibrado", "sub20:dispensa": "equilibrado",
  "lesaoPre:operar": "seguro", "lesaoPre:sacrificio": "arriscado", "lesaoPre:conservador": "equilibrado",
  "polemica:desculpas": "seguro", "polemica:frente": "arriscado", "polemica:silencio": "seguro",
  "novoTecnico:aceitar": "seguro", "novoTecnico:recusar": "arriscado", "novoTecnico:conversar": "equilibrado",
  "pretemporada:elite": "arriscado", "pretemporada:preservar": "seguro", "pretemporada:equilibrio": "equilibrado",
  "fortuna:aceitar": "arriscado", "fortuna:recusar": "seguro", "fortuna:leilao": "equilibrado",
  "capitao:aceitar": "arriscado", "capitao:recusar": "seguro",
  "noitada:ir": "arriscado", "noitada:casa": "seguro", "noitada:rapido": "equilibrado",
  "mentor:aceitar": "equilibrado", "mentor:sozinho": "seguro", "mentor:folgas": "seguro",
  "emprestimo:ficar": "arriscado", "forcarSaida:forcar": "arriscado", "forcarSaida:aguentar": "seguro",
  "traicao:trair": "arriscado", "traicao:recusar": "seguro", "traicao:renovar": "equilibrado",
  "rivalMundo:responder": "arriscado", "rivalMundo:ignorar": "seguro", "rivalMundo:elogiar": "seguro",
  "naturalizacao:aceitar": "arriscado", "camisa10:aceitar": "arriscado", "documentario:aceitar": "equilibrado",
  "golDePlaca:provocar": "arriscado", "presidente:apoiar": "arriscado", "presidente:oposicao": "arriscado",
  "livre:grande": "arriscado", "selecaoAmistoso:jogar": "arriscado", "fimContrato:renovar": "seguro", "fimContrato:qualquer": "seguro", "clausula:ir": "equilibrado", "clausula:ficar": "seguro",
};

/* ---------- eventos novos ---------- */
const NUMEROS_POR_POS = { GOL: 1, ZAG: 4, LD: 2, LE: 6, VOL: 5, MC: 8, MEI: 10, PD: 7, PE: 11, SA: 9, ATA: 9 };
export const EVENTOS_EXTRAS = [
  {
    id: "fimContrato", icone: "📄",
    peso: (c) => (c.contrato && c.contrato.restantes <= 0 && !c.emprestimo ? 1000 : 0),
    preparar: (c) => {
      const ovr = ovrDe(c);
      const ofertas = gerarOfertas(c, 2, { lo: ovr - 8, hi: ovr + 6, permitirSegunda: true });
      const querRenovar = !["Fora dos planos"].includes(statusNoClube(c).label) && !(c.idade >= 33 && ovr < 72);
      return { ofertas, querRenovar };
    },
    titulo: (c) => `Seu contrato com o ${c.clubeNome} acabou`,
    texto: (c, ctx) => (ctx.querRenovar ? "Você está livre. O clube quer renovar, mas outros também ligaram — e quem sai de graça ainda leva luvas." : "Você está livre. O clube não demonstrou interesse em renovar."),
    opcoes: (c, ctx) => [
      ...(ctx.querRenovar ? [{ id: "renovar", label: `Negociar a renovação com o ${c.clubeNome}`, dica: "Continuidade e carinho da torcida", negociar: { clube: c.clubeNome, tipo: "renovacao" },
        efeito: (c, extra) => { c.contrato = extra?.contrato || contratoPadrao(c, c.clubeNome); sobe(c, c.clubeNome, 4); return "Renovado. Mais um capítulo na mesma casa."; } }] : []),
      ...ctx.ofertas.map((o) => ({
        id: `livre:${o.clube}`, label: `Negociar com o ${o.clube} (sem custo de transferência)`, dica: `${o.ligaNome} · chegaria como ${o.status.toLowerCase()} · leva luvas na assinatura`, oferta: o,
        negociar: { clube: o.clube, tipo: "transferencia", luvas: true },
        efeito: (c, extra) => { transferir(c, o.clube, { contrato: extra?.contrato, luvas: extra?.luvas, valor: 0 }); return `Assinou com o ${o.clube} de graça${extra?.luvas ? ` e embolsou ${formatarValor(extra.luvas)} de luvas` : ""}.`; },
      })),
      { id: "qualquer", label: "Aceitar o primeiro clube que ligar", dica: "Sem negociação: garante um contrato padrão",
        efeito: (c) => {
          const ovr = ovrDe(c);
          const op = clubesJogaveis().filter((x) => x.nome !== c.clubeNome && x.forca <= ovr && x.forca >= ovr - 10);
          const d = op.length ? pick(op) : clubeDe(c.clubeNome);
          if (d.nome === c.clubeNome) { c.contrato = contratoPadrao(c, c.clubeNome); return "Ninguém ligou. Você renovou nos termos que o clube ofereceu."; }
          transferir(c, d.nome, { valor: 0 }); return `O ${d.nome} ligou primeiro. Contrato padrão assinado.`;
        } },
    ],
  },
  {
    id: "clausula", icone: "🔓",
    peso: (c, ctx) => (ctx.clube && c.flags.blindado === 0 && !c.emprestimo && c.idade >= 19 ? (ctx.multa < valorAtual(c) * 0.5 ? 5 : 3) : 0),
    preparar: (c) => {
      const ovr = ovrDe(c);
      const atual = clubeDe(c.clubeNome);
      const multa = c.contrato?.multa ?? Infinity;
      const barata = multa <= valorAtual(c) * 1.15;
      if (!barata) return {};
      const op = clubesJogaveis().filter((x) => x.forca >= atual.forca + 4 && x.forca <= ovr + 8 && !ehSegundaDivisao(x.liga) && !(c.flags.traidor || []).includes(x.nome));
      return { clube: op.length ? pick(op).nome : null, multa };
    },
    titulo: (c, ctx) => `O ${ctx.clube} pagou sua cláusula de rescisão`,
    texto: (c, ctx) => `${formatarValor(ctx.multa)} depositados. O ${c.clubeNome} não pode impedir: a decisão é só sua. (Cláusula baixa é porta aberta.)`,
    opcoes: (c, ctx) => [
      { id: "ir", label: `Negociar salário com o ${ctx.clube}`, dica: `${ligaDe(clubeDe(ctx.clube).liga).nome} · salto de clube`, oferta: { clube: ctx.clube, status: statusPorDiff(ovrDe(c) - clubeDe(ctx.clube).forca, c.idade).label },
        negociar: { clube: ctx.clube, tipo: "transferencia" },
        efeito: (c, extra) => { const de = transferir(c, ctx.clube, { contrato: extra?.contrato, valor: ctx.multa, tipo: "clausula" }); sobe(c, de, -6); c.fama = clampR(c.fama + 5, 0, 100); return `A cláusula foi paga e você foi. Nova casa: ${ctx.clube}.`; } },
      { id: "ficar", label: "Recusar e ficar", dica: "A torcida te carrega nos braços · o clube sobe sua cláusula",
        efeito: (c) => { sobe(c, c.clubeNome, 12); c.contrato = { ...c.contrato, multa: Math.round(c.contrato.multa * 2), salario: Math.round(c.contrato.salario * 1.15) }; return "Você recusou. O clube dobrou sua cláusula e deu aumento como agradecimento."; } },
    ],
  },
  {
    id: "camisa10", icone: "🔟",
    peso: (c) => (c.idade >= 20 && ["Titular", "Estrela do time"].includes(statusNoClube(c).label) && !(c.flags.camisas || []).includes(c.clubeNome) ? 1.6 : 0),
    titulo: (c) => `A camisa ${["GOL"].includes(c.posicao) ? "1" : "10"} do ${c.clubeNome} está vaga`,
    texto: () => "O ídolo que vestia o número pendurou as chuteiras. O roupeiro deixou a camisa no seu armário — mas a escolha é sua.",
    opcoes: (c) => [
      { id: "aceitar", label: "Herdar o número do ídolo", dica: "Torcida empolgada · comparação inevitável",
        efeito: (c) => { c.flags.camisas = [...(c.flags.camisas || []), c.clubeNome]; c.numero = c.posicao === "GOL" ? 1 : 10; sobe(c, c.clubeNome, 6); c.mod.notaBonus = (c.mod.notaBonus || 0) + (chance(0.6) ? 0.15 : -0.15); return "O número pesa. Você decidiu que vai carregar."; } },
      { id: "infancia", label: "Manter o número da base", dica: "Fiel à própria história",
        efeito: (c) => { c.flags.camisas = [...(c.flags.camisas || []), c.clubeNome]; sobe(c, c.clubeNome, 2); return `Você segue com a ${numeroDe(c)}. A torcida respeitou.`; } },
      { id: "homenagem", label: "Pedir para aposentar a camisa", dica: "Gesto de respeito ao ídolo · fama sobe",
        efeito: (c) => { c.flags.camisas = [...(c.flags.camisas || []), c.clubeNome]; c.fama = clampR(c.fama + 4, 0, 100); sobe(c, c.clubeNome, 4); return "Ninguém mais vai usar aquele número. A ideia foi sua."; } },
    ],
  },
  {
    id: "documentario", icone: "🎬",
    peso: (c) => (c.fama >= 45 && !c.flags.documentario ? 1.2 : 0),
    titulo: () => "Uma série documental sobre você",
    texto: () => "Uma plataforma de streaming quer acompanhar sua temporada inteira, do vestiário ao sofá de casa.",
    opcoes: () => [
      { id: "aceitar", label: "Abrir as portas", dica: "Fama dispara · câmeras no vestiário incomodam o elenco",
        efeito: (c) => { c.flags.documentario = true; c.fama = clampR(c.fama + 12, 0, 100); c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.04; return "Três episódios, top 1 em vinte países."; } },
      { id: "limitado", label: "Só fora de campo", dica: "Menos fama, sem desgaste",
        efeito: (c) => { c.flags.documentario = true; c.fama = clampR(c.fama + 5, 0, 100); return "Família, infância e bastidores. Vestiário, nunca."; } },
      { id: "recusar", label: "Recusar", dica: "Privacidade acima de tudo",
        efeito: () => "Sua vida continua sendo só sua." },
    ],
  },
  {
    id: "parceria", icone: "🤜",
    peso: (c) => (c.idade >= 19 && c.posicao !== "GOL" ? 1.3 : 0),
    titulo: () => "Entrosamento com um companheiro",
    texto: () => "Você e um companheiro de ataque se encontraram em campo. O técnico quer montar o time em volta da dupla.",
    opcoes: (c) => [
      { id: "garcom", label: "Virar o garçom da dupla", dica: "Mais assistências, o time ganha mais",
        efeito: (c) => { c.attrs.passe = clampR(c.attrs.passe + 2, 40, 99); c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.05; return "Você enxerga o passe antes de ele pedir."; } },
      { id: "finalizador", label: "Ser quem finaliza", dica: "Mais gols, mais holofote",
        efeito: (c) => { c.attrs.finalizacao = clampR(c.attrs.finalizacao + 2, 40, 99); c.fama = clampR(c.fama + 3, 0, 100); return "Ele cria, você empurra para as redes."; } },
      { id: "solo", label: "Preferir jogar sozinho", dica: "Ninguém divide os seus gols",
        efeito: (c) => { c.mod.notaBonus = (c.mod.notaBonus || 0) - 0.05; c.attrs.drible = clampR(c.attrs.drible + 1, 40, 99); return "A dupla nunca engrenou. Você seguiu resolvendo do seu jeito."; } },
    ],
  },
  {
    id: "naturalizacao", icone: "🛂",
    peso: (c) => (c.idade >= 19 && c.idade <= 25 && forcaSelecao(c) <= 80 && c.selecao.convocacoes === 0 && ovrDe(c) >= 74 && !c.flags.naturalizacaoVista ? 2 : 0),
    preparar: (c) => {
      const op = NACIONALIDADES.filter((n) => n.id !== c.nac && n.forcaSelecao >= 85);
      return { nova: pick(op) };
    },
    titulo: (c, ctx) => `${ctx.nova.label} quer te naturalizar`,
    texto: (c, ctx) => `Você nunca foi chamado por ${nacDe(c.nac).label}. A federação de ${ctx.nova.label} oferece uma vaga na próxima convocação — e a chance real de disputar títulos.`,
    opcoes: (c, ctx) => [
      { id: "aceitar", label: `Defender ${ctx.nova.label}`, dica: "Seleção muito mais forte · seu país de origem não vai gostar",
        efeito: (c) => { c.flags.naturalizacaoVista = true; c.nacOrigem = c.nac; c.nac = ctx.nova.id; c.flags.selecaoFria = 0; c.fama = clampR(c.fama + 5, 0, 100); return `Passaporte novo. Você agora joga por ${ctx.nova.label}.`; } },
      { id: "esperar", label: `Esperar por ${nacDe(c.nac).label}`, dica: "Fiel às raízes · a convocação pode não vir",
        efeito: (c) => { c.flags.naturalizacaoVista = true; c.flags.selecaoFria = Math.max(0, (c.flags.selecaoFria || 0) - 1); return "Sua camisa é uma só. Os jornais do seu país fizeram festa."; } },
    ],
  },
  {
    id: "golDePlaca", icone: "🎥",
    peso: (c) => (c.posicao !== "GOL" && c.idade >= 18 ? 1.4 : 0),
    titulo: () => "Seu golaço rodou o mundo",
    texto: () => "Um gol de bicicleta no último minuto. Milhões de visualizações. Na próxima coletiva, todos querem saber da comemoração.",
    opcoes: () => [
      { id: "familia", label: "Dedicar à família", dica: "A torcida se emociona",
        efeito: (c) => { sobe(c, c.clubeNome, 5); c.fama = clampR(c.fama + 3, 0, 100); return "Você apontou para a arquibancada onde sua mãe estava. Ninguém segurou o choro."; } },
      { id: "marca", label: "Criar uma comemoração sua", dica: "Vira marca registrada · fama sobe",
        efeito: (c) => { c.fama = clampR(c.fama + 7, 0, 100); return "Crianças do mundo inteiro já imitam o seu gesto."; } },
      { id: "provocar", label: "Comemorar provocando a torcida rival", dica: "Viraliza mais · pode dar punição",
        efeito: (c) => { c.fama = clampR(c.fama + 6, 0, 100); if (chance(0.4)) { c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.08; return "Cartão, multa e dois jogos de suspensão."; } return "Polêmica de uma semana e um meme eterno."; } },
    ],
  },
  {
    id: "presidente", icone: "🗳️",
    peso: (c) => (c.idade >= 23 && (c.torcida[c.clubeNome] ?? 0) >= 45 ? 1.1 : 0),
    titulo: (c) => `Eleição para presidente do ${c.clubeNome}`,
    texto: () => "Os dois candidatos querem uma foto com você. Apoiar um lado pode mudar o clima no clube por anos.",
    opcoes: () => [
      { id: "apoiar", label: "Apoiar a situação", dica: "Se ganhar, ganha força com a diretoria",
        efeito: (c) => { if (chance(0.55)) { c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.08; sobe(c, c.clubeNome, 2); return "Seu candidato venceu. A diretoria lembra de quem ficou do lado."; } c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.08; return "Seu candidato perdeu. A nova diretoria te olha torto."; } },
      { id: "oposicao", label: "Apoiar a oposição", dica: "Se ganhar, você vira peça central do novo projeto",
        efeito: (c) => { if (chance(0.45)) { c.flags.blindado = 2; sobe(c, c.clubeNome, 6); return "A oposição venceu e te colocou no centro do projeto."; } sobe(c, c.clubeNome, -5); return "A oposição perdeu e você ficou isolado."; } },
      { id: "neutro", label: "Ficar neutro", dica: "Sem risco",
        efeito: () => "Você votou em silêncio. Ninguém soube em quem." },
    ],
  },
  {
    id: "livre", icone: "📝",
    peso: (c) => (c.contrato?.restantes === 1 && c.idade >= 22 && ovrDe(c) >= 72 ? 2.5 : 0),
    preparar: (c) => ({ grande: gerarOfertas(c, 1, { lo: ovrDe(c) - 1, hi: ovrDe(c) + 10 })[0] || null }),
    titulo: () => "Seu contrato está acabando",
    texto: (c, ctx) => `Último ano de contrato com o ${c.clubeNome}. Você pode sair de graça no fim da temporada${ctx.grande ? ` — e o ${ctx.grande.clube} já sinalizou interesse` : ""}.`,
    opcoes: (c, ctx) => [
      ...(ctx.grande ? [{ id: "grande", label: `Assinar pré-contrato com o ${ctx.grande.clube}`, dica: `${ctx.grande.ligaNome} · chegaria como ${ctx.grande.status.toLowerCase()} · torcida atual se sente traída`, oferta: ctx.grande,
        negociar: { clube: ctx.grande.clube, tipo: "transferencia", luvas: true },
        efeito: (c, extra) => { const de = transferir(c, ctx.grande.clube, { contrato: extra?.contrato, luvas: extra?.luvas, valor: 0 }); sobe(c, de, -12); c.fama = clampR(c.fama + 4, 0, 100); return `Saída de graça para o ${ctx.grande.clube}. No ${de}, o assunto foi amargo.`; } }] : []),
      { id: "renovar", label: "Negociar a renovação antes do fim", dica: "Estabilidade e carinho da torcida",
        negociar: { clube: c.clubeNome, tipo: "renovacao" },
        efeito: (c, extra) => { if (extra?.contrato) c.contrato = extra.contrato; c.flags.blindado = 2; sobe(c, c.clubeNome, 6); return "Renovado. Assinou no gramado, com a família."; } },
      { id: "testar", label: "Deixar correr e ouvir o mercado", dica: "Mais propostas na próxima janela",
        efeito: (c) => { c.mod.ofertasExtra = 2; return "Você deixou o relógio correr. O telefone do empresário não parou."; } },
    ],
  },
  {
    id: "jovemMentor", icone: "🧒",
    peso: (c) => (c.idade >= 30 && !c.flags.mentorJovem ? 1.8 : 0),
    titulo: () => "Um garoto da base pede conselhos",
    texto: () => "Um menino de 16 anos, que te tinha como pôster na parede, quer treinar ao seu lado.",
    opcoes: () => [
      { id: "adotar", label: "Assumir o garoto como pupilo", dica: "Legado fora de campo · a torcida se encanta",
        efeito: (c) => { c.flags.mentorJovem = true; sobe(c, c.clubeNome, 6); return "Você virou o veterano que um dia te adotou. O ciclo se fechou."; } },
      { id: "dicas", label: "Dar umas dicas e seguir focado", dica: "Foco total no seu fim de carreira",
        efeito: (c) => { c.mod.declinio = Math.min(c.mod.declinio ?? 1, 0.85); return "Algumas dicas, um autógrafo e de volta ao seu treino."; } },
    ],
  },
  {
    id: "selecaoAmistoso", icone: "✈️",
    peso: (c) => (c.selecao.convocacoes > 0 && c.idade >= 20 ? 1.2 : 0),
    titulo: (c) => `${nacDe(c.nac).label} te chamou para uma turnê de amistosos`,
    texto: () => "Dez dias, três continentes, logo antes de um jogo decisivo do clube.",
    opcoes: () => [
      { id: "jogar", label: "Ir e jogar todos os minutos", dica: "A comissão técnica adora · desgaste físico",
        efeito: (c) => { c.flags.selecaoFria = Math.max(0, (c.flags.selecaoFria || 0) - 1); c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) + 0.04; return "Dois gols na turnê e a vaga na seleção mais firme do que nunca."; } },
      { id: "poupar", label: "Ir, mas pedir para ser poupado", dica: "Meio-termo",
        efeito: () => "Viajou, treinou e jogou só o segundo tempo do último jogo." },
      { id: "cortar", label: "Pedir corte para cuidar do clube", dica: "O clube agradece · a seleção esfria",
        efeito: (c) => { c.flags.selecaoFria = (c.flags.selecaoFria || 0) + 1; sobe(c, c.clubeNome, 4); return "O clube agradeceu. O técnico da seleção anotou o nome."; } },
    ],
  },
];

/* ---------- vida fora de campo: mexe com a cabeça (estado mental) ---------- */
const gastar = (c, v) => { c.patrimonio = Math.max(0, (c.patrimonio || 0) - v); };
const ganhar = (c, v) => { c.patrimonio = (c.patrimonio || 0) + v; c.ganhosTotais = (c.ganhosTotais || 0) + v; };
const unico = (c, id) => !(c.flags.vistos || []).includes(id);
const marcar = (c, id) => { c.flags.vistos = [...(c.flags.vistos || []), id]; };
const ultimaTemporada = (c) => c.temporadas[c.temporadas.length - 1];
const longeDeCasa = (c) => c.clubeNome !== c.primeiroClube && !(LIGA_BASE_POR_NAC[c.nac] || []).map((l) => l.replace(/2$/, "")).concat(LIGA_BASE_POR_NAC[c.nac] || []).map((l) => (l === "serieB" ? "brasileirao" : l)).includes(clubeDe(c.clubeNome).liga);

export const EVENTOS_VIDA = [
  {
    id: "saudade", icone: "🧳", vida: true,
    peso: (c) => (c.idade <= 23 && longeDeCasa(c) ? 2 : 0),
    titulo: () => "Saudade de casa",
    texto: () => "Outro idioma, outra comida, inverno de verdade. As noites no apartamento novo estão longas demais.",
    opcoes: (c) => [
      { id: "familia", label: "Trazer a família para morar com você", dica: `Cabeça bem melhor · custa ${formatarValor(Math.max(60, Math.round((c.contrato?.salario || 100) * 0.3)))}`,
        efeito: (c) => { gastar(c, Math.max(60, Math.round((c.contrato?.salario || 100) * 0.3))); mexerMoral(c, 14); return "A casa ficou cheia e barulhenta de novo. Você voltou a sorrir no treino."; } },
      { id: "aguentar", label: "Aguentar firme e focar no futebol", dica: "Evolui mais · a cabeça sofre", risco: "equilibrado",
        efeito: (c) => { c.mod.evolucao = (c.mod.evolucao ?? 1) * 1.05; mexerMoral(c, -8); return "Treino, casa, treino. Funcionou em campo, mas pesou por dentro."; } },
      { id: "idioma", label: "Fazer aulas de idioma e se enturmar", dica: "Adaptação mais rápida, torcida gosta",
        efeito: (c) => { mexerMoral(c, 6); sobe(c, c.clubeNome, 4); return "Em três meses você já dava entrevista na língua local. A torcida adorou."; } },
    ],
  },
  {
    id: "romance", icone: "💘", vida: true,
    peso: (c) => (c.idade >= 20 && c.idade <= 30 && c.fama >= 30 && unico(c, "romance") ? 1.2 : 0),
    titulo: () => "Romance com uma celebridade",
    texto: () => "Vocês se conheceram num evento de patrocinador. Os paparazzi já descobriram.",
    opcoes: () => [
      { id: "assumir", label: "Assumir publicamente", dica: "Fama sobe · a vida vira notícia", risco: "equilibrado",
        efeito: (c) => { marcar(c, "romance"); c.fama = clampR(c.fama + 8, 0, 100); if (chance(0.35)) { mexerMoral(c, -6); return "O namoro rendeu capa de revista — e também fofoca toda semana."; } mexerMoral(c, 8); return "Foto oficial, casal do ano. Você anda leve."; } },
      { id: "discreto", label: "Manter longe dos holofotes", dica: "Paz e cabeça no lugar",
        efeito: (c) => { marcar(c, "romance"); mexerMoral(c, 6); return "Ninguém sabe direito. Do jeito que vocês queriam."; } },
    ],
  },
  {
    id: "filho", icone: "🍼", vida: true,
    peso: (c) => (c.idade >= 24 && c.idade <= 33 && unico(c, "filho") ? 1.4 : 0),
    titulo: () => "Seu primeiro filho vai nascer",
    texto: () => "A data prevista cai bem na semana da decisão do clube.",
    opcoes: () => [
      { id: "licenca", label: "Pedir licença e estar no parto", dica: "Perde alguns jogos · cabeça nas nuvens",
        efeito: (c) => { marcar(c, "filho"); c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.94; mexerMoral(c, 16); sobe(c, c.clubeNome, 2); return "Você estava lá. Voltou aos treinos mais leve do que nunca."; } },
      { id: "jogar", label: "Jogar a decisão e correr para a maternidade", dica: "Comemoração de ninar se fizer o gol", risco: "equilibrado",
        efeito: (c) => { marcar(c, "filho"); c.fama = clampR(c.fama + 3, 0, 100); if (chance(0.5)) { mexerMoral(c, 12); sobe(c, c.clubeNome, 6); return "Gol, comemoração de ninar e voo direto para o hospital. Chegou a tempo."; } mexerMoral(c, 2); return "Perdeu o parto por meia hora. A foto do primeiro colo foi no corredor."; } },
    ],
  },
  {
    id: "luto", icone: "🕯️", vida: true,
    peso: (c) => (c.idade >= 19 && unico(c, "luto") ? 0.8 : 0),
    titulo: () => "Uma perda na família",
    texto: () => "Seu avô, que te levava aos treinos da escolinha, faleceu. O jogo mais importante do ano é em dois dias.",
    opcoes: () => [
      { id: "viajar", label: "Viajar para a despedida", dica: "Perde o jogo · fica em paz consigo",
        efeito: (c) => { marcar(c, "luto"); mexerMoral(c, -4); c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.97; return "Você estava com a família. O clube entendeu e mandou flores."; } },
      { id: "dedicar", label: "Jogar e dedicar a ele", dica: "Pode ser o jogo da vida — ou pesar demais", risco: "arriscado",
        efeito: (c) => { marcar(c, "luto"); if (chance(0.55)) { mexerMoral(c, 4); sobe(c, c.clubeNome, 8); c.fama = clampR(c.fama + 4, 0, 100); return "Gol, dedo para o céu e o estádio inteiro aplaudindo de pé."; } mexerMoral(c, -12); return "Você não conseguiu jogar. Saiu no intervalo, em lágrimas."; } },
    ],
  },
  {
    id: "odioRedes", icone: "💬", vida: true,
    peso: (c) => { const u = ultimaTemporada(c); return c.fama >= 30 && u && u.nota && u.nota < 6.7 ? 2 : 0; },
    titulo: () => "Ataques nas redes sociais",
    texto: () => "Depois de uma temporada abaixo, as mensagens passaram do limite. Algumas falam da sua família.",
    opcoes: () => [
      { id: "psicologo", label: "Conversar com o psicólogo do clube", dica: "Cabeça no lugar · ninguém fica sabendo",
        efeito: (c) => { mexerMoral(c, 10); c.mod.notaBonus = (c.mod.notaBonus || 0) + 0.05; return "Algumas sessões e você aprendeu a desligar o barulho."; } },
      { id: "sair", label: "Sair das redes por um tempo", dica: "Paz · a fama esfria um pouco",
        efeito: (c) => { mexerMoral(c, 7); c.fama = clampR(c.fama - 4, 0, 100); return "Conta desativada. O celular ficou bem mais silencioso."; } },
      { id: "responder", label: "Responder um por um", dica: "Vira assunto · desgaste enorme", risco: "arriscado",
        efeito: (c) => { c.fama = clampR(c.fama + 4, 0, 100); mexerMoral(c, -10); return "Você ganhou algumas brigas e perdeu várias noites de sono."; } },
    ],
  },
  {
    id: "esgotamento", icone: "🔋", vida: true,
    peso: (c) => ((c.moral ?? 65) < 40 ? 3 : 0),
    titulo: () => "Esgotamento mental",
    texto: () => "Você acorda cansado, treina no automático e não sente mais prazer nos jogos. O departamento médico percebeu.",
    opcoes: () => [
      { id: "pausa", label: "Pedir duas semanas de pausa", dica: "Perde alguns jogos · recupera a cabeça",
        efeito: (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.92; mexerMoral(c, 20); return "Você desligou o celular, viajou com a família e voltou com vontade de jogar."; } },
      { id: "terapia", label: "Começar terapia com psicólogo do esporte", dica: "Melhora aos poucos, sem parar de jogar",
        efeito: (c) => { if (!(c.investimentos || []).includes("psicologo")) c.investimentos = [...(c.investimentos || []), "psicologo"]; mexerMoral(c, 10); return "Toda terça, uma hora de conversa. O psicólogo virou parte da sua rotina."; } },
      { id: "automatico", label: "Seguir em frente sem falar nada", dica: "Ninguém percebe — por enquanto", risco: "arriscado",
        efeito: (c) => { mexerMoral(c, -6); c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) + 0.03; return "Você engoliu tudo. O corpo começou a dar sinais."; } },
    ],
  },
  {
    id: "amigo", icone: "🤲", vida: true,
    peso: (c) => ((c.patrimonio || 0) >= 400 && unico(c, "amigo") ? 1.1 : 0),
    titulo: () => "Um amigo de infância pede ajuda",
    texto: (c) => `Ele quer abrir uma escolinha de futebol no bairro onde vocês cresceram e precisa de ${formatarValor(Math.round((c.patrimonio || 0) * 0.08))}.`,
    opcoes: (c) => [
      { id: "investir", label: "Entrar como sócio", dica: "Pode dar retorno · pode virar prejuízo", risco: "equilibrado",
        efeito: (c) => { marcar(c, "amigo"); const v = Math.round((c.patrimonio || 0) * 0.08); gastar(c, v); mexerMoral(c, 5); if (chance(0.5)) { ganhar(c, v * 2); sobe(c, c.primeiroClube, 5); return "A escolinha lotou. Você recuperou o dinheiro e ainda revelou um garoto."; } return "A escolinha fechou em um ano. Pelo menos a amizade continua."; } },
      { id: "doar", label: "Dar o dinheiro de presente", dica: "Gesto bonito · legado no bairro",
        efeito: (c) => { marcar(c, "amigo"); gastar(c, Math.round((c.patrimonio || 0) * 0.08)); mexerMoral(c, 8); c.flags.social = true; return "A escolinha tem seu nome na fachada. Seu amigo chorou na inauguração."; } },
      { id: "recusar", label: "Recusar com educação", dica: "Sem risco · a amizade esfria",
        efeito: (c) => { marcar(c, "amigo"); mexerMoral(c, -3); return "Ele entendeu. Mas as mensagens ficaram mais raras."; } },
    ],
  },
  {
    id: "golpe", icone: "📈", vida: true,
    peso: (c) => ((c.patrimonio || 0) >= 1500 && unico(c, "golpe") ? 1 : 0),
    titulo: () => "Investimento \"garantido\"",
    texto: () => "Um conhecido do vestiário promete retorno de 40% ao mês num negócio de criptomoedas. Vários jogadores já entraram.",
    opcoes: () => [
      { id: "entrar", label: "Colocar uma parte do patrimônio", dica: "Pode dobrar · pode sumir", risco: "arriscado",
        efeito: (c) => { marcar(c, "golpe"); const v = Math.round((c.patrimonio || 0) * 0.3); if (chance(0.25)) { ganhar(c, Math.round(v * 0.6)); return "Você saiu na hora certa, com lucro. Semanas depois, o esquema desabou."; } gastar(c, v); mexerMoral(c, -10); return "Era pirâmide. O dinheiro sumiu junto com o \"gestor\"."; } },
      { id: "assessor", label: "Perguntar ao seu assessor financeiro", dica: "Ele vai dizer não",
        efeito: (c) => { marcar(c, "golpe"); return "O assessor riu, depois ficou sério: \"isso é golpe\". Você ficou de fora."; } },
    ],
  },
  {
    id: "estudos", icone: "🎓", vida: true,
    peso: (c) => (c.idade >= 18 && c.idade <= 26 && unico(c, "estudos") ? 0.9 : 0),
    titulo: () => "Voltar a estudar?",
    texto: () => "Você parou os estudos cedo por causa do futebol. Uma faculdade a distância oferece bolsa para atletas.",
    opcoes: () => [
      { id: "estudar", label: "Fazer a faculdade a distância", dica: "Prepara o pós-carreira · menos descanso",
        efeito: (c) => { marcar(c, "estudos"); c.flags.estudou = true; mexerMoral(c, 4); c.mod.evolucao = (c.mod.evolucao ?? 1) * 0.98; return "Aulas no ônibus e no hotel de concentração. O diploma vem aí."; } },
      { id: "depois", label: "Deixar para depois da carreira", dica: "Foco total no campo",
        efeito: (c) => { marcar(c, "estudos"); return "O livro ficou na estante. Um dia, quem sabe."; } },
    ],
  },
  {
    id: "casaPais", icone: "🏠", vida: true,
    peso: (c) => ((c.patrimonio || 0) >= 300 && unico(c, "casaPais") ? 1.4 : 0),
    titulo: () => "A casa dos seus pais",
    texto: () => "Seus pais ainda moram de aluguel no bairro onde você nasceu. Dá para resolver isso agora.",
    opcoes: () => [
      { id: "comprar", label: "Comprar uma casa para eles", dica: "Custa € 250 mil · realização pessoal enorme",
        efeito: (c) => { marcar(c, "casaPais"); gastar(c, 250); mexerMoral(c, 15); return "Você entregou a chave no aniversário da sua mãe. Ninguém segurou o choro."; } },
      { id: "depois", label: "Esperar o próximo contrato", dica: "Guarda o dinheiro",
        efeito: (c) => { marcar(c, "casaPais"); return "Fica para o ano que vem. Eles disseram que não tem pressa."; } },
    ],
  },
  {
    id: "cachorro", icone: "🐶", vida: true,
    peso: (c) => (c.idade >= 19 && unico(c, "cachorro") ? 0.8 : 0),
    titulo: () => "Um cachorro na porta do CT",
    texto: () => "Um vira-lata começou a te esperar todo dia na saída do treino. Os funcionários já o chamam pelo seu sobrenome.",
    opcoes: () => [
      { id: "adotar", label: "Adotar", dica: "Companhia garantida · a torcida se derrete",
        efeito: (c) => { marcar(c, "cachorro"); mexerMoral(c, 8); sobe(c, c.clubeNome, 3); c.fama = clampR(c.fama + 2, 0, 100); return "Ele virou mascote do clube e tem mais seguidores que alguns jogadores."; } },
      { id: "ong", label: "Pagar uma ONG para cuidar dele", dica: "Ajuda sem mudar a rotina",
        efeito: (c) => { marcar(c, "cachorro"); mexerMoral(c, 3); return "Ele foi adotado por uma família do bairro. Você recebe fotos de vez em quando."; } },
    ],
  },
  {
    id: "homenagem", icone: "🎖️", vida: true,
    peso: (c) => (c.fama >= 40 && unico(c, "homenagem") ? 1.1 : 0),
    titulo: () => "Sua cidade natal quer te homenagear",
    texto: () => "A prefeitura vai dar seu nome ao campo onde você começou. A cerimônia cai numa semana de jogos.",
    opcoes: () => [
      { id: "ir", label: "Ir pessoalmente", dica: "Cabeça renovada · perde um treino importante",
        efeito: (c) => { marcar(c, "homenagem"); mexerMoral(c, 10); sobe(c, c.primeiroClube, 6); return "O campo de terra agora tem placa com seu nome. Seu primeiro técnico discursou."; } },
      { id: "video", label: "Mandar um vídeo emocionado", dica: "Sem desgaste",
        efeito: (c) => { marcar(c, "homenagem"); mexerMoral(c, 3); return "O vídeo passou no telão da praça. A cidade entendeu."; } },
    ],
  },
  {
    id: "pressaoCopa", icone: "🌎", vida: true,
    peso: (c) => (anoDeCopa(c.ano) && c.selecao.convocacoes > 0 && c.idade >= 20 ? 2.5 : 0),
    titulo: () => "O peso de uma Copa do Mundo",
    texto: (c) => `Faltam meses para a Copa e ${nacDe(c.nac).label} inteiro fala de você. A ansiedade aparece até no sono.`,
    opcoes: () => [
      { id: "mental", label: "Trabalhar a cabeça com um psicólogo", dica: "Mais frio na hora decisiva",
        efeito: (c) => { mexerMoral(c, 10); c.mod.notaBonus = (c.mod.notaBonus || 0) + 0.05; return "Respiração, visualização, rotina. Você chega à Copa em paz."; } },
      { id: "isolar", label: "Fugir da imprensa até a estreia", dica: "Menos barulho · fama esfria",
        efeito: (c) => { mexerMoral(c, 5); c.fama = clampR(c.fama - 3, 0, 100); return "Sem entrevistas, sem redes. Só treino e família."; } },
      { id: "assumir", label: "Assumir o favoritismo em público", dica: "Fama sobe · pressão também", risco: "equilibrado",
        efeito: (c) => { c.fama = clampR(c.fama + 6, 0, 100); mexerMoral(c, chance(0.5) ? 6 : -8); return "\"Vamos ser campeões.\" A frase abriu todos os jornais."; } },
    ],
  },
];

/* ---------- mais acontecimentos de campo ---------- */
/* Ex-clube da mesma liga com quem ficou uma história (ídolo ou desafeto) */
function exClubeParaReencontro(c) {
  if (c.emprestimo || c.idade < 19) return null;
  const liga = clubeDe(c.clubeNome).liga;
  const traidor = c.flags.traidor || [];
  return Object.entries(c.torcida || {})
    .filter(([nome, v]) => nome !== c.clubeNome && clubeDe(nome).liga === liga && unico(c, `reencontro:${nome}`) && (v >= 65 || v <= 25 || traidor.includes(nome)))
    .map(([nome, v]) => ({ clube: nome, torcida: v, traidor: traidor.includes(nome), tipo: traidor.includes(nome) || v <= 25 ? "hostil" : "idolo" }))
    .sort((a, b) => Math.abs(b.torcida - 50) - Math.abs(a.torcida - 50))[0] || null;
}

export const EVENTOS_CAMPO = [
  {
    id: "reencontro", icone: "🏟️",
    preparar: (c) => ({ ex: exClubeParaReencontro(c) }),
    peso: (c, ctx) => (ctx.ex ? 2.2 : 0),
    titulo: (c, ctx) => (ctx.ex.tipo === "hostil" ? `Volta ao estádio do ${ctx.ex.clube}` : `Reencontro com o ${ctx.ex.clube}`),
    texto: (c, ctx) => {
      if (ctx.ex.tipo === "hostil") return `Primeira vez no ${ctx.ex.clube} desde que você saiu ${ctx.ex.traidor ? "para o maior rival" : "brigado"}. A torcida preparou faixa, vaia e moeda no escanteio.`;
      const ap = (c.apelidos || []).find((a) => a.clube === ctx.ex.clube);
      return `O ${c.clubeNome} enfrenta o ${ctx.ex.clube}, e por lá você ainda é ${ap ? `"${ap.nome}"` : "ídolo"}. A antiga torcida promete te receber de pé.`;
    },
    opcoes: (c, ctx) => {
      const ex = ctx.ex.clube;
      const visto = (c) => marcar(c, `reencontro:${ex}`);
      if (ctx.ex.tipo === "hostil") return [
        { id: "calar", label: "Jogar para calar o estádio", dica: "Se fizer o gol, vira lenda no clube atual · se sumir, a vaia te engole", risco: "arriscado",
          efeito: (c) => { visto(c); if (chance(0.45)) { sobe(c, c.clubeNome, 8); sobe(c, ex, -10); c.fama = clampR(c.fama + 6, 0, 100); mexerMoral(c, 4); return `Gol, dedo na boca e o ${ex} em silêncio. Sua torcida atual nunca vai esquecer.`; } mexerMoral(c, -6); sobe(c, c.clubeNome, -3); return "Noventa minutos de vaia. Você sumiu do jogo e o estádio comemorou cada passe errado."; } },
        { id: "serio", label: "Jogar sério e não provocar", dica: "Sem polêmica · a cabeça sente um pouco", risco: "seguro",
          efeito: (c) => { visto(c); sobe(c, ex, 3); sobe(c, c.clubeNome, 2); mexerMoral(c, -2); return "Você fez o seu e não provocou ninguém. No fim, até alguns da antiga torcida aplaudiram."; } },
        { id: "poupar", label: "Pedir para não ser escalado", dica: "Poupa a cabeça · parte da torcida acha que faltou coragem", risco: "equilibrado",
          efeito: (c) => { visto(c); mexerMoral(c, 2); sobe(c, c.clubeNome, -5); c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.03; return "O técnico atendeu. Nas redes, sua torcida perguntou onde estava a coragem."; } },
      ];
      return [
        { id: "respeitar", label: "Fazer o gol e não comemorar", dica: "As duas torcidas aplaudem", risco: "seguro",
          efeito: (c) => { visto(c); sobe(c, ex, 6); sobe(c, c.clubeNome, -1); mexerMoral(c, 3); return "Gol e mãos levantadas pedindo desculpas. Os dois lados do estádio aplaudiram."; } },
        { id: "homenagem", label: "Ir até a antiga torcida antes do jogo", dica: "Momento emocionante · fama e cabeça sobem", risco: "seguro",
          efeito: (c) => { visto(c); sobe(c, ex, 8); mexerMoral(c, 5); c.fama = clampR(c.fama + 3, 0, 100); return "Você foi até a arquibancada antes do apito. Teve gente chorando com a sua camisa antiga."; } },
        { id: "comemorar", label: "Comemorar como sempre", dica: "A torcida atual adora · a antiga estranha", risco: "equilibrado",
          efeito: (c) => { visto(c); sobe(c, c.clubeNome, 5); sobe(c, ex, -10); c.fama = clampR(c.fama + 2, 0, 100); return `Gol e comemoração completa. O ${ex} vaiou; o ${c.clubeNome} cantou seu nome.`; } },
      ];
    },
  },
  {
    id: "batedor", icone: "🎯",
    peso: (c) => (c.posicao !== "GOL" && c.idade >= 20 && ["Titular", "Estrela do time"].includes(statusNoClube(c).label) && unico(c, `batedor:${c.clubeNome}`) ? 1.4 : 0),
    titulo: () => "Quem bate os pênaltis?",
    texto: () => "O cobrador oficial foi embora. O técnico olhou para você no treino.",
    opcoes: () => [
      { id: "assumir", label: "Assumir as cobranças", dica: "Mais gols · se errar, a cobrança vem", risco: "equilibrado",
        efeito: (c) => { marcar(c, `batedor:${c.clubeNome}`); c.mod.golsMult = (c.mod.golsMult ?? 1) * 1.12; mexerMoral(c, chance(0.75) ? 3 : -5); return "A bola é sua. Você já tem um canto preferido."; } },
      { id: "passar", label: "Deixar para o companheiro", dica: "Sem pressão extra",
        efeito: (c) => { marcar(c, `batedor:${c.clubeNome}`); return "Você apontou para o colega. Ele agradeceu a confiança."; } },
    ],
  },
  {
    id: "excursao", icone: "✈️",
    peso: (c) => (clubeDe(c.clubeNome).forca >= 80 && c.idade >= 18 ? 1.1 : 0),
    titulo: () => "Excursão de pré-temporada na Ásia",
    texto: () => "Três amistosos, dois fusos horários e muitos eventos de patrocinador. O clube quer você na foto.",
    opcoes: () => [
      { id: "ir", label: "Ir e fazer tudo", dica: "Fama e bônus · cansaço", risco: "equilibrado",
        efeito: (c) => { c.fama = clampR(c.fama + 5, 0, 100); ganhar(c, 80); c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) + 0.02; return "Estádios lotados, camisas esgotadas e um bônus no contrato."; } },
      { id: "ficar", label: "Pedir para treinar em casa", dica: "Chega mais inteiro à temporada",
        efeito: (c) => { c.mod.evolucao = (c.mod.evolucao ?? 1) * 1.04; return "Você ficou no CT com o preparador físico. O clube não gostou muito."; } },
    ],
  },
  {
    id: "expulsao", icone: "🟥",
    peso: (c) => (c.idade >= 19 ? 1 : 0),
    titulo: () => "Expulsão polêmica",
    texto: () => "Cartão vermelho direto num lance duvidoso. O tribunal pode te dar até cinco jogos de gancho.",
    opcoes: () => [
      { id: "recorrer", label: "Recorrer com o departamento jurídico", dica: "Pode reduzir a pena — ou não", risco: "equilibrado",
        efeito: (c) => { if (chance(0.55)) return "Pena reduzida para um jogo. O advogado do clube virou herói."; c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.9; return "Recurso negado. Cinco jogos na arquibancada."; } },
      { id: "desculpas", label: "Pedir desculpas e cumprir", dica: "Três jogos fora · imagem limpa",
        efeito: (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.94; sobe(c, c.clubeNome, 2); return "Três jogos de fora. A imprensa elogiou a postura."; } },
      { id: "arbitragem", label: "Detonar a arbitragem", dica: "Torcida ama · pena maior", risco: "arriscado",
        efeito: (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.86; sobe(c, c.clubeNome, 5); c.fama = clampR(c.fama + 3, 0, 100); return "A entrevista viralizou. O tribunal dobrou o gancho."; } },
    ],
  },
  {
    id: "vestiario", icone: "🗣️",
    peso: (c) => (c.idade >= 21 ? 1.2 : 0),
    titulo: () => "Racha no vestiário",
    texto: () => "Os veteranos e os mais jovens não se falam mais. Os dois lados querem você.",
    opcoes: () => [
      { id: "veteranos", label: "Ficar com os veteranos", dica: "O técnico confia mais em você",
        efeito: (c) => { c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.05; mexerMoral(c, -2); return "Você sentou na mesa dos mais velhos. A escalação agradeceu."; } },
      { id: "jovens", label: "Ficar com os jovens", dica: "Clima leve · técnico desconfia",
        efeito: (c) => { mexerMoral(c, 5); c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.04; return "Resenha no ônibus, playlist nova. O técnico olhou torto."; } },
      { id: "ponte", label: "Juntar os dois lados num churrasco", dica: "Se der certo, o time voa", risco: "equilibrado",
        efeito: (c) => { if (chance(0.6)) { c.mod.notaBonus = (c.mod.notaBonus || 0) + 0.1; mexerMoral(c, 6); sobe(c, c.clubeNome, 3); return "Churrasco na sua casa e o grupo voltou a ser um time."; } mexerMoral(c, -4); return "Teve discussão na beira da piscina. Ninguém mais tocou no assunto."; } },
    ],
  },
  {
    id: "salarioAtrasado", icone: "⏳",
    peso: (c) => (clubeDe(c.clubeNome).forca < 74 && c.idade >= 19 ? 1.3 : 0),
    titulo: () => "Salários atrasados",
    texto: () => "Três meses sem pagamento. O grupo quer uma posição sua.",
    opcoes: () => [
      { id: "cobrar", label: "Cobrar a diretoria em público", dica: "Vira notícia · o mercado ouve",
        efeito: (c) => { c.mod.ofertasExtra = 1; c.repNeg = clampR((c.repNeg || 0) + 6, -60, 60); sobe(c, c.clubeNome, -4); return "Sua fala abriu o noticiário esportivo. O telefone do empresário tocou."; } },
      { id: "esperar", label: "Esperar e confiar no clube", dica: "A torcida reconhece · a cabeça sofre",
        efeito: (c) => { sobe(c, c.clubeNome, 5); mexerMoral(c, -6); return "O dinheiro veio, aos poucos. A torcida não esqueceu sua paciência."; } },
      { id: "ajudar", label: "Ajudar os funcionários do clube do próprio bolso", dica: "Gesto enorme · custa caro",
        efeito: (c) => { gastar(c, 120); sobe(c, c.clubeNome, 10); mexerMoral(c, 5); c.flags.social = true; return "Roupeiros, seguranças e cozinheiras receberam em dia. Graças a você."; } },
    ],
  },
  {
    id: "olheiros", icone: "🔭",
    peso: (c) => (c.idade >= 18 && c.idade <= 23 && ovrDe(c) - clubeDe(c.clubeNome).forca >= 0 ? 1.5 : 0),
    titulo: () => "Olheiros de um gigante na arquibancada",
    texto: () => "Seu empresário avisou: domingo tem gente de um clube enorme vendo o jogo.",
    opcoes: () => [
      { id: "vitrine", label: "Jogar para aparecer", dica: "Mais propostas · nota oscila", risco: "equilibrado",
        efeito: (c) => { c.mod.ofertasExtra = 1; c.mod.notaBonus = (c.mod.notaBonus || 0) + (chance(0.5) ? 0.1 : -0.1); return "Caneta, chapéu e chute de longe. Os olheiros anotaram tudo."; } },
      { id: "time", label: "Jogar para o time", dica: "Torcida e técnico gostam",
        efeito: (c) => { sobe(c, c.clubeNome, 3); c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.03; return "Jogo simples, eficiente. Os olheiros também gostam disso."; } },
    ],
  },
  {
    id: "beneficente", icone: "🎗️",
    peso: (c) => (c.fama >= 40 ? 0.9 : 0),
    titulo: () => "Jogo beneficente das estrelas",
    texto: () => "Ex-jogadores, artistas e craques de vários clubes, tudo para um hospital infantil.",
    opcoes: () => [
      { id: "jogar", label: "Jogar e doar o cachê", dica: "Fama, torcida e cabeça boa",
        efeito: (c) => { c.fama = clampR(c.fama + 3, 0, 100); mexerMoral(c, 5); sobe(c, c.clubeNome, 2); return "Gol de letra e o hospital ganhou uma ala nova."; } },
      { id: "doar", label: "Só fazer uma doação", dica: "Ajuda sem risco de lesão",
        efeito: (c) => { gastar(c, 50); mexerMoral(c, 3); return "Doação feita, sem foto. Do jeito que você queria."; } },
    ],
  },
  {
    id: "recordeClube", icone: "📜",
    peso: (c) => { if (c.posicao === "GOL") return 0; const g = c.temporadas.filter((s) => s.clube === c.clubeNome).reduce((a, s) => a + s.gols, 0); return g >= 50 && unico(c, `recorde:${c.clubeNome}`) ? 2 : 0; },
    titulo: (c) => `Perto de virar o maior artilheiro do ${c.clubeNome}`,
    texto: () => "Faltam poucos gols para a marca histórica. A imprensa faz contagem regressiva.",
    opcoes: () => [
      { id: "buscar", label: "Buscar o recorde a todo custo", dica: "Mais gols · menos jogo coletivo", risco: "equilibrado",
        efeito: (c) => { marcar(c, `recorde:${c.clubeNome}`); c.mod.golsMult = (c.mod.golsMult ?? 1) * 1.12; c.mod.assistMult = (c.mod.assistMult ?? 1) * 0.85; sobe(c, c.clubeNome, 4); return "Cada gol vira contagem no telão. A marca está ao alcance."; } },
      { id: "natural", label: "Deixar acontecer naturalmente", dica: "Sem pressão",
        efeito: (c) => { marcar(c, `recorde:${c.clubeNome}`); mexerMoral(c, 3); return "Você parou de ler a contagem. Os gols vêm quando têm que vir."; } },
    ],
  },
  {
    id: "foraDaLista", icone: "📋",
    peso: (c) => (c.selecao.convocacoes > 0 && c.idade >= 22 && c.idade <= 32 && !c.flags.semSelecao && ovrDe(c) < forcaSelecao(c) - 2 ? 1.6 : 0),
    titulo: () => "Fora da lista da seleção",
    texto: (c) => `O técnico de ${nacDe(c.nac).label} divulgou a convocação. Seu nome não está lá.`,
    opcoes: () => [
      { id: "criticar", label: "Criticar o técnico da seleção", dica: "Fama sobe · a porta pode fechar", risco: "arriscado",
        efeito: (c) => { c.fama = clampR(c.fama + 4, 0, 100); c.flags.selecaoFria = (c.flags.selecaoFria || 0) + 2; return "Sua entrevista rendeu, mas o técnico guardou o recorte."; } },
      { id: "trabalhar", label: "Trabalhar calado", dica: "Motivação extra no clube",
        efeito: (c) => { c.mod.notaBonus = (c.mod.notaBonus || 0) + 0.1; mexerMoral(c, -3); c.flags.selecaoFria = Math.max(0, (c.flags.selecaoFria || 0) - 1); return "Nenhuma palavra. Só treino a mais."; } },
    ],
  },
  {
    id: "videogame", icone: "🎮",
    peso: (c) => (ovrDe(c) >= 78 && c.fama >= 35 && unico(c, `game:${c.ano}`) ? 0.9 : 0),
    titulo: () => "Sua carta no videogame de futebol",
    texto: (c) => `Saiu o novo jogo e o seu overall é ${ovrDe(c) - 2}. Os fãs acham pouco.`,
    opcoes: () => [
      { id: "reclamar", label: "Reclamar com bom humor nas redes", dica: "Fama sobe · vira meme",
        efeito: (c) => { marcar(c, `game:${c.ano}`); c.fama = clampR(c.fama + 4, 0, 100); mexerMoral(c, 3); return "\"Me deram 2 de velocidade a menos, quero falar com o gerente.\" Viralizou."; } },
      { id: "jogar", label: "Jogar uma partida ao vivo com você mesmo", dica: "Fãs adoram",
        efeito: (c) => { marcar(c, `game:${c.ano}`); c.fama = clampR(c.fama + 2, 0, 100); mexerMoral(c, 4); return "Você perdeu para você mesmo nos pênaltis. Três milhões de visualizações."; } },
    ],
  },
  {
    id: "adeusSelecao", icone: "🧣",
    peso: (c) => (c.idade >= 31 && c.selecao.convocacoes >= 3 && !c.flags.semSelecao ? 1.4 : 0),
    titulo: () => "Hora de se despedir da seleção?",
    texto: () => "O corpo reclama das viagens longas e os jovens pedem passagem.",
    opcoes: (c) => [
      { id: "despedir", label: "Anunciar a aposentadoria da seleção", dica: "Menos desgaste · sem mais torneios por seleção",
        efeito: (c) => { c.flags.semSelecao = true; mexerMoral(c, 6); c.mod.declinio = (c.mod.declinio ?? 1) * 0.9; return `Uma carta emocionada para ${nacDe(c.nac).label}. O ciclo fechou.`; } },
      { id: "continuar", label: "Seguir à disposição", dica: "Ainda sonha com mais uma Copa",
        efeito: (c) => { c.flags.selecaoFria = Math.max(0, (c.flags.selecaoFria || 0) - 1); return "\"Enquanto me chamarem, eu vou.\""; } },
    ],
  },
  {
    id: "treinoExtra", icone: "⏱️",
    peso: (c) => (c.idade <= 26 ? 1.3 : 0),
    titulo: () => "Treino extra depois do expediente",
    texto: () => "O auxiliar técnico se ofereceu para ficar uma hora a mais com você todo dia.",
    opcoes: (c) => {
      const foco = c.posicao === "GOL" ? "defesa" : DEFENSIVAS.includes(c.posicao) ? "defesa" : c.posicao === "MEI" || c.posicao === "MC" ? "passe" : "finalizacao";
      return [
        { id: "aceitar", label: "Aceitar a hora extra", dica: `+1 de ${foco} agora e no teto · cansa`,
          efeito: (c) => { c.attrs[foco] = clampR(c.attrs[foco] + 1, 40, 99); c.potencial[foco] = clampR(c.potencial[foco] + 1, 40, 99); mexerMoral(c, -2); return "Cem chutes por dia, chuva ou sol. Dá para ver a diferença."; } },
        { id: "descansar", label: "Descansar", dica: "Cabeça e corpo inteiros",
          efeito: (c) => { mexerMoral(c, 3); return "Você agradeceu e foi para casa. Recuperação também é treino."; } },
      ];
    },
  },
  {
    id: "voltaLesao", icone: "🦵",
    peso: (c) => (ultimaTemporada(c)?.lesao ? 2 : 0),
    titulo: () => "A volta depois da lesão",
    texto: () => "O departamento médico liberou, mas você ainda não confia 100% no corpo.",
    opcoes: () => [
      { id: "devagar", label: "Voltar aos poucos", dica: "Menos jogos no começo · sem recaída",
        efeito: (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.95; c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) - 0.03; mexerMoral(c, 4); return "Primeiro 20 minutos, depois 45. Na metade da temporada, 100%."; } },
      { id: "acelerar", label: "Acelerar a volta", dica: "Joga mais · risco de recaída", risco: "arriscado",
        efeito: (c) => { c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) + 0.05; mexerMoral(c, 2); return "Você pulou etapas. O joelho ainda avisa de vez em quando."; } },
    ],
  },
  {
    id: "paiEmpresario", icone: "👨‍👩‍👦",
    peso: (c) => (c.idade <= 21 && unico(c, "paiEmpresario") ? 1.2 : 0),
    titulo: () => "Sua família quer cuidar da sua carreira",
    texto: () => "Quem largou o emprego para te acompanhar desde a base agora quer cuidar dos seus contratos.",
    opcoes: () => [
      { id: "aceitar", label: "Deixar a família cuidar de tudo", dica: "Confiança total · menos contatos no mercado",
        efeito: (c) => { marcar(c, "paiEmpresario"); c.empresario = "iniciante"; mexerMoral(c, 8); return "Contrato assinado na mesa da cozinha. Teve choro de alegria."; } },
      { id: "conselheiro", label: "A família vira conselheira, o empresário segue", dica: "Meio-termo",
        efeito: (c) => { marcar(c, "paiEmpresario"); mexerMoral(c, 3); return "Sua família participa das reuniões, mas quem negocia é o profissional."; } },
      { id: "nao", label: "Manter a família fora dos negócios", dica: "Clima pesado em casa por um tempo",
        efeito: (c) => { marcar(c, "paiEmpresario"); mexerMoral(c, -5); return "A conversa foi difícil. O almoço de domingo ficou em silêncio."; } },
    ],
  },
  {
    id: "idiomaImprensa", icone: "🎙️",
    peso: (c) => (longeDeCasa(c) && c.idade >= 22 && unico(c, `imprensa:${c.clubeNome}`) ? 1 : 0),
    titulo: () => "A imprensa local quer ouvir você",
    texto: () => "Até agora você falou só pelo tradutor. Um programa de TV popular quer uma entrevista exclusiva.",
    opcoes: () => [
      { id: "lingua", label: "Dar a entrevista na língua deles", dica: "Torcida se encanta · pode escorregar", risco: "equilibrado",
        efeito: (c) => { marcar(c, `imprensa:${c.clubeNome}`); sobe(c, c.clubeNome, chance(0.75) ? 8 : -3); c.fama = clampR(c.fama + 3, 0, 100); return "Sotaque carregado, gramática criativa e muito carisma."; } },
      { id: "tradutor", label: "Ir com tradutor", dica: "Seguro",
        efeito: (c) => { marcar(c, `imprensa:${c.clubeNome}`); sobe(c, c.clubeNome, 2); return "Entrevista correta. Nada demais."; } },
    ],
  },
];

const riscoDaOferta = (o) => (["Reserva", "Fora dos planos", "Base"].includes(o.status) ? "arriscado" : o.status === "Rotação" ? "equilibrado" : "seguro");
/* Impasse: o clube atual recusou vender. Só aparece encadeado logo depois da proposta. */
const EVENTO_IMPASSE = {
  id: "impasse", icone: "🧱",
  peso: (c) => (c.flags.impasse ? 1000 : 0),
  preparar: (c) => ({ ...(c.flags.impasse || {}) }),
  titulo: (c) => `O ${c.clubeNome} não quer te vender`,
  texto: (c, ctx) => `O ${ctx.clube} ofereceu ${formatarValor(ctx.valor)}. A diretoria do ${c.clubeNome} recusou e só aceita conversar a partir de ${formatarValor(ctx.pedida)}. A decisão agora é sua.`,
  opcoes: (c, ctx) => [
    { id: "aceitar", label: "Aceitar e ficar", dica: "Diretoria e torcida agradecem · a cabeça sente um pouco", risco: "seguro",
      efeito: (c) => { c.flags.impasse = null; sobe(c, c.clubeNome, 6); mexerMoral(c, -4); c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.03; return "Você ficou. No vestiário, todo mundo sabe que você podia ter ido."; } },
    { id: "empresario", label: "Pedir ao empresário para pressionar", dica: `${empresarioDe(c).nome} vai à diretoria · pode sair um acordo no meio do caminho, ou nada`, risco: "equilibrado",
      ...(ctx.empOk ? { negociar: { clube: ctx.clube, tipo: "transferencia" } } : {}),
      efeito: (c, extra) => {
        c.flags.impasse = null;
        if (!ctx.empOk) { mexerMoral(c, -3); sobe(c, c.clubeNome, -3); return `O ${c.clubeNome} não cedeu e o ${ctx.clube} desistiu. Fica para a próxima janela.`; }
        const valor = Math.round((ctx.valor + ctx.pedida) / 2 / 50) * 50;
        const de = transferir(c, ctx.clube, { contrato: extra?.contrato, valor });
        sobe(c, de, -4); c.fama = clampR(c.fama + (ctx.forca > clubeDe(de).forca ? 4 : 0), 0, 100);
        return `Seu empresário achou o meio-termo: ${formatarValor(valor)}. Nova casa: ${ctx.clube}.`;
      } },
    { id: "forcar", label: "Forçar a saída", dica: "Não se apresentar até te liberarem · a torcida não vai perdoar", risco: "arriscado",
      ...(ctx.forcarOk ? { negociar: { clube: ctx.clube, tipo: "transferencia" } } : {}),
      efeito: (c, extra) => {
        c.flags.impasse = null; mexerMoral(c, -6);
        if (!ctx.forcarOk) { sobe(c, c.clubeNome, -15); c.mod.shareAdd = (c.mod.shareAdd || 0) - 0.2; return `O ${c.clubeNome} bancou a queda de braço e te afastou do elenco principal. A temporada começa no banco.`; }
        const de = transferir(c, ctx.clube, { contrato: extra?.contrato, valor: ctx.pedida, saida: "forcada" });
        sobe(c, de, -18); c.fama = clampR(c.fama + (ctx.forca > clubeDe(de).forca ? 3 : 0), 0, 100);
        return `Depois de dias de impasse, o ${de} cedeu por ${formatarValor(ctx.pedida)}. Você saiu pela porta dos fundos rumo ao ${ctx.clube}.`;
      } },
  ],
};
/* ---------- decisões de risco (estilo Copero): a chance aparece na tela ----------
   Cada opção arriscada mostra o que pode acontecer e com que probabilidade
   ("+3 OVR · 60% / −2 OVR · 40%"). O efeito mexe no NÍVEL do atleta (não na fase),
   então fica para o resto da carreira. */
export function mexerNivel(c, d) {
  if (!d) return 0;
  const pesos = posicaoDe(c.posicao).pesos || {};
  const ordem = ATTRS.slice().sort((a, b) => (pesos[b] || 0) - (pesos[a] || 0)).slice(0, 4);
  const alvo = ovrDe(c) + d;
  for (let k = 0; k < 40 && (d > 0 ? ovrDe(c) < alvo : ovrDe(c) > alvo); k++) {
    const a = ordem[k % ordem.length];
    c.attrs[a] = clampR(c.attrs[a] + Math.sign(d), 40, 99);
    // vale para o resto da carreira: o teto acompanha (senão a perda se recuperava sozinha e o ganho ficava)
    c.potencial[a] = clampR(c.potencial[a] + Math.sign(d), 40, 99);
  }
  return d;
}
const ruim = (x) => (x.d || 0) < 0 || (x.torcida || 0) < 0 || (x.lesao || 0) > 0 || (x.fama || 0) < 0;
const aposta = (id, label, chances, extra = {}) => ({
  id, label, chances, risco: chances.some(ruim) ? (chances.find(ruim).p >= 0.4 ? "arriscado" : "equilibrado") : "seguro", ...extra,
  efeito: (c) => {
    let r = rnd(), sorteado = chances[chances.length - 1];
    for (const x of chances) { if ((r -= x.p) <= 0) { sorteado = x; break; } }
    mexerNivel(c, sorteado.d || 0);
    if (sorteado.moral) mexerMoral(c, sorteado.moral);
    if (sorteado.torcida) c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + sorteado.torcida, 0, 100);
    if (sorteado.fama) c.fama = clampR(c.fama + sorteado.fama, 0, 100);
    if (sorteado.lesao) c.mod.lesaoAdd = (c.mod.lesaoAdd || 0) + sorteado.lesao;
    if (sorteado.minutos) c.mod.shareAdd = (c.mod.shareAdd || 0) + sorteado.minutos;
    if (extra.custo) gastar(c, extra.custo);
    c.ultimaAposta = { d: sorteado.d, p: sorteado.p };
    c.apostas = [...(c.apostas || []), { ano: c.ano, id, d: sorteado.d }];
    return sorteado.txt;
  },
});
/* O que a decisão mudou, para mostrar em chips verdes e vermelhos (como o Copero mostra o efeito de cada escolha) */
export function efeitosDaDecisao(a, d) {
  const out = [];
  const add = (v, txt, inverso = false) => { if (v) out.push({ txt, bom: inverso ? v < 0 : v > 0 }); };
  const sinal = (v) => (v > 0 ? `+${v}` : `${v}`);
  const dOvr = ovrDe(d) - ovrDe(a); add(dOvr, `${sinal(dOvr)} OVR`);
  const dVal = valorAtual(d) - valorAtual(a); if (Math.abs(dVal) >= 100) add(dVal, `valor ${dVal > 0 ? "▲" : "▼"} ${formatarValor(Math.abs(dVal))}`);
  const dMoral = (d.moral ?? 65) - (a.moral ?? 65); add(dMoral, `cabeça ${sinal(dMoral)}`);
  if (a.clubeNome === d.clubeNome) { const dT = (d.torcida[d.clubeNome] ?? 30) - (a.torcida[a.clubeNome] ?? 30); add(dT, `torcida ${sinal(dT)}`); }
  const dF = (d.fama ?? 0) - (a.fama ?? 0); add(dF, `fama ${sinal(dF)}`);
  const dP = (d.patrimonio || 0) - (a.patrimonio || 0); if (Math.abs(dP) >= 10 && a.clubeNome === d.clubeNome) add(dP, `${dP > 0 ? "+" : "−"}${formatarValor(Math.abs(dP))}`);
  const minA = (a.mod?.shareAdd || 0) + ((a.mod?.shareMult ?? 1) - 1), minD = (d.mod?.shareAdd || 0) + ((d.mod?.shareMult ?? 1) - 1);
  if (Math.abs(minD - minA) >= 0.03) add(minD - minA, minD > minA ? "mais minutos" : "menos minutos");
  const lA = a.mod?.lesaoAdd || 0, lD = d.mod?.lesaoAdd || 0; if (Math.abs(lD - lA) >= 0.01) add(lD - lA, lD > lA ? "risco de lesão ▲" : "risco de lesão ▼", true);
  return out;
}
const seguro = (id, label, dica, efeito = () => "Sem mudanças.") => ({ id, label, dica, risco: "seguro", efeito });
const nomeAtrib = (c) => (c.posicao === "GOL" ? "reflexo" : DEFENSIVAS.includes(c.posicao) ? "marcação" : ["MC", "MEI"].includes(c.posicao) ? "passe" : "finalização");

export const EVENTOS_APOSTA = [
  { id: "dieta", icone: "🥗", peso: () => 1.4,
    titulo: () => "Plano alimentar", texto: () => "Um nutricionista propõe mudar sua dieta de vez. Pode melhorar seu rendimento ou dar errado.",
    opcoes: () => [
      aposta("seguir", "Seguir o plano", [{ p: 0.55, d: 2, txt: "O corpo respondeu: mais fôlego e menos cansaço. +2 OVR." }, { p: 0.45, d: -2, txt: "Você perdeu massa demais e sentiu nos treinos. −2 OVR." }]),
      seguro("manter", "Manter sua dieta", "Sem mudanças"),
    ] },
  { id: "concentracao", icone: "🎯", peso: () => 1.3,
    titulo: () => "Concentração extra", texto: () => "Uma semana de concentração especial antes da temporada pode melhorar seu jogo, mas o esforço extra pode cobrar o preço.",
    opcoes: () => [
      aposta("fazer", "Fazer a concentração", [{ p: 0.55, d: 3, txt: "Você voltou outro jogador. +3 OVR." }, { p: 0.45, d: -3, txt: "Exagerou na carga e chegou desgastado. −3 OVR." }]),
      seguro("habitual", "Preparação habitual", "Sem mudanças"),
    ] },
  { id: "especialista", icone: "🧑‍🏫", peso: (c) => (c.idade <= 30 ? 1.2 : 0),
    titulo: (c) => `Especialista em ${nomeAtrib(c)}`, texto: (c) => `Um treinador famoso por lapidar ${nomeAtrib(c)} topa trabalhar com você nas férias. Ele cobra caro.`,
    opcoes: (c) => [
      aposta("contratar", `Contratar (${formatarValor(Math.max(40, Math.round((c.contrato?.salario || 100) * 0.15)))})`, [{ p: 0.5, d: 2, txt: "Detalhes que fazem diferença. +2 OVR." }, { p: 0.5, d: 0, txt: "Bom trabalho, mas nada mudou em campo." }], { custo: Math.max(40, Math.round((c.contrato?.salario || 100) * 0.15)) }),
      seguro("ferias", "Tirar férias de verdade", "Cabeça descansada", (c) => { mexerMoral(c, 4); return "Praia, família e celular desligado."; }),
    ] },
  { id: "academia", icone: "🏋️", peso: (c) => (c.idade >= 18 && c.idade <= 31 ? 1.1 : 0),
    titulo: () => "Ganho de massa muscular", texto: () => "O preparador quer você mais forte. Músculo novo pode dar potência — ou tirar a leveza.",
    opcoes: () => [
      aposta("ganhar", "Topar o programa de força", [{ p: 0.5, d: 3, txt: "Mais forte nas divididas e sem perder velocidade. +3 OVR." }, { p: 0.5, d: -3, txt: "Ficou pesado e lento. −3 OVR." }]),
      seguro("leve", "Manter o corpo como está", "Sem mudanças"),
    ] },
  { id: "novaPosicao", icone: "🔄", peso: (c) => (c.idade >= 20 && c.idade <= 29 && c.posicao !== "GOL" ? 0.9 : 0),
    titulo: () => "Teste em outra função", texto: () => "O técnico quer te testar numa função nova, mais perto da área adversária. Pode virar arma secreta ou te deixar perdido.",
    opcoes: () => [
      aposta("aceitar", "Aceitar o teste", [{ p: 0.35, d: 4, txt: "Encaixou como luva. O técnico achou um jogador novo. +4 OVR." }, { p: 0.65, d: -2, txt: "Você ficou perdido em campo por meses. −2 OVR." }]),
      seguro("recusar", "Ficar na sua posição", "Sem mudanças"),
    ] },
  { id: "intertemporada", icone: "🏔️", peso: () => 1,
    titulo: () => "Intertemporada na altitude", texto: () => "Três semanas treinando a 2.500 metros. Os pulmões agradecem — se o corpo aguentar.",
    opcoes: () => [
      aposta("ir", "Ir para a altitude", [{ p: 0.6, d: 2, txt: "Fôlego de sobra no começo da temporada. +2 OVR." }, { p: 0.4, d: -2, txt: "Uma gripe forte atrapalhou tudo. −2 OVR." }]),
      seguro("ficar", "Treinar no CT", "Sem mudanças"),
    ] },
  { id: "garotoBase", icone: "🧒", peso: (c) => (c.idade >= 24 && ["Titular", "Estrela do time"].includes(statusNoClube(c).label) ? 1.2 : 0),
    titulo: () => "Um garoto da base quer sua vaga", texto: () => "O técnico não para de elogiar o menino de 18 anos que joga na sua posição.",
    opcoes: () => [
      aposta("dobrado", "Treinar dobrado para segurar a vaga", [{ p: 0.5, d: 2, moral: 3, txt: "Você respondeu em campo. A vaga continua sua. +2 OVR." }, { p: 0.5, d: -2, moral: -6, txt: "O garoto é bom mesmo. Você perdeu a vaga e a confiança. −2 OVR." }]),
      seguro("mentor", "Ajudar o garoto a crescer", "A torcida gosta · você joga um pouco menos", (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.9; sobe(c, c.clubeNome, 5); return "Vocês viraram dupla nos treinos. O vestiário inteiro notou."; }),
    ] },
  { id: "recuperacao", icone: "❄️", peso: (c) => (c.idade >= 27 ? 1.2 : 0),
    titulo: () => "Novo método de recuperação", texto: () => "Câmara de crioterapia, sono monitorado e um protocolo novo que os grandes clubes estão testando.",
    opcoes: () => [
      aposta("testar", "Testar o protocolo", [{ p: 0.6, d: 2, txt: "Recuperação de garoto de 20 anos. +2 OVR." }, { p: 0.4, d: -2, txt: "O corpo estranhou e as dores voltaram. −2 OVR." }]),
      seguro("velho", "Seguir com o que funciona", "Sem mudanças"),
    ] },
  { id: "video", icone: "📺", peso: () => 1,
    titulo: () => "Intensivo de análise tática", texto: () => "O analista de desempenho montou horas de vídeo sobre os seus erros. Assistir tudo é cansativo.",
    opcoes: () => [
      aposta("assistir", "Encarar o intensivo", [{ p: 0.6, d: 2, txt: "Você passou a enxergar o jogo antes dos outros. +2 OVR." }, { p: 0.4, d: -1, txt: "Informação demais: você começou a pensar em vez de jogar. −1 OVR." }]),
      seguro("intuicao", "Confiar no instinto", "Sem mudanças"),
    ] },
  { id: "treinoFerias", icone: "🏖️", peso: (c) => (c.idade <= 27 ? 1 : 0),
    titulo: () => "Treinar nas férias?", texto: () => "Seus companheiros vão viajar. Você pode aproveitar o mês livre para treinar sozinho.",
    opcoes: () => [
      aposta("treinar", "Treinar o mês inteiro", [{ p: 0.5, d: 2, moral: -3, txt: "Voltou voando, mas cansado da cabeça. +2 OVR." }, { p: 0.5, d: -1, moral: -5, txt: "Sem descanso, o corpo cobrou logo na estreia. −1 OVR." }]),
      seguro("descansar", "Descansar com a família", "Cabeça renovada", (c) => { mexerMoral(c, 6); return "Você voltou leve e com saudade da bola."; }),
    ] },
  { id: "machucado", icone: "🩹", peso: (c) => (c.idade >= 19 ? 1 : 0),
    titulo: () => "Dor no jogo decisivo", texto: () => "O tornozelo inchou na véspera do jogo mais importante do semestre. O médico libera, mas avisa do risco.",
    opcoes: () => [
      aposta("jogar", "Jogar com dor", [{ p: 0.6, fama: 6, torcida: 6, rotulo: "+6 fama e torcida", txt: "Você jogou mancando e decidiu. A arquibancada não esquece." }, { p: 0.4, d: -2, lesao: 0.12, rotulo: "lesão longa · −2 OVR", txt: "O tornozelo cedeu no segundo tempo. Meses de tratamento pela frente." }]),
      seguro("poupar", "Ficar fora e tratar", "Sem risco · a torcida estranha um pouco", (c) => { sobe(c, c.clubeNome, -2); return "Você assistiu do camarote. Voltou inteiro na semana seguinte."; }),
    ] },
  { id: "organizada", icone: "📢", peso: (c) => ((c.torcida[c.clubeNome] ?? 30) < 50 && c.idade >= 19 ? 1.4 : 0),
    titulo: () => "Protesto da torcida organizada", texto: () => "Depois de uma sequência ruim, a organizada foi ao CT cobrar o elenco. Seu nome está nas faixas.",
    opcoes: () => [
      aposta("conversar", "Descer para conversar", [{ p: 0.6, torcida: 10, moral: 4, rotulo: "+10 torcida", txt: "Você ouviu, prometeu entrega e ganhou respeito. As faixas mudaram de tom." }, { p: 0.4, torcida: -8, moral: -6, rotulo: "−8 torcida", txt: "A conversa virou bate-boca e foi parar nas redes." }]),
      seguro("diretoria", "Deixar a diretoria resolver", "Sem mudanças"),
    ] },
  { id: "infiltracao", icone: "💉", peso: (c) => (c.idade >= 24 ? 0.9 : 0),
    titulo: () => "Infiltração para jogar", texto: () => "Uma dor no joelho te tiraria duas semanas. Com infiltração, você joga a sequência inteira.",
    opcoes: () => [
      aposta("infiltrar", "Tomar a infiltração", [{ p: 0.7, minutos: 0.08, rotulo: "mais jogos", txt: "Nenhum jogo perdido. O técnico agradeceu." }, { p: 0.3, d: -3, rotulo: "−3 OVR", txt: "Mascarar a dor piorou o joelho. Você perdeu explosão." }]),
      seguro("repouso", "Duas semanas de repouso", "Menos jogos, sem risco", (c) => { c.mod.shareMult = (c.mod.shareMult ?? 1) * 0.95; return "Repouso feito, joelho tranquilo."; }),
    ] },
];

/* Primeira decisão da carreira (como no Copero): três clubes querem você na base */
const EVENTO_BASE = {
  id: "base", icone: "🌱", grade: true,
  peso: (c) => (c.temporadas.length === 0 && !c.flags.baseEscolhida ? 1000 : 0),
  preparar: (c) => ({ clubes: opcoesClubeInicial(c.nac, c.origem).map((x) => x.nome) }),
  titulo: () => "Oferta de base",
  texto: () => "Três clubes querem te incluir no projeto de base. Escolha onde sua carreira começa.",
  opcoes: (c, ctx) => ctx.clubes.map((nome) => {
    const x = clubeDe(nome);
    return {
      id: `base:${nome}`, label: `Assinar com o ${nome}`, dica: `${ligaDe(x.liga).nome} · força ${x.forca}`, risco: "seguro",
      oferta: { clube: nome, forca: x.forca, cor: x.cor, ligaId: x.liga, ligaNome: ligaDe(x.liga).nome, status: statusPorDiff(ovrDe(c) - x.forca, c.idade).label },
      efeito: (c) => {
        const antigo = c.clubeNome;
        if (antigo !== nome) { delete c.torcida[antigo]; c.torcida[nome] = 30; }
        c.clubeNome = nome; c.primeiroClube = nome; c.flags.baseEscolhida = true;
        c.contrato = contratoPadrao(c, nome, { base: true });
        return `Contrato de base assinado. A história começa no ${nome}.`;
      },
    };
  }),
};
const TODOS_EVENTOS = () => [EVENTO_BASE, ...EVENTOS, ...EVENTOS_EXTRAS, ...EVENTOS_VIDA, ...EVENTOS_CAMPO, ...EVENTOS_APOSTA, EVENTO_IMPASSE];
/* Depois de uma escolha: se ela abriu um impasse, ele vem logo em seguida */
export const eventoImpasse = (c) => (c.flags?.impasse ? sortearEvento(c, { somente: "impasse" }) : null);
const opcoesCompletas = (e, c, ctx) => [...e.opcoes(c, ctx), ...(EXTRAS_OPCOES[e.id] ? EXTRAS_OPCOES[e.id](c, ctx) : [])];

/* Sorteia o evento da janela entre temporadas */
export function sortearEvento(c, opts = {}) {
  return comSemente(c.codigo, `evento:${c.ano}:${opts.somente || ""}:${(opts.excluir || []).join(",")}${opts.soApostas ? ":ap" : ""}`, () => sortearEventoBase(c, opts));
}
function sortearEventoBase(c, { somente = null, excluir = [], soApostas = false } = {}) {
  const recentes = (c.flags.historicoEventos || []).slice(-3);
  const cands = (soApostas ? EVENTOS_APOSTA : TODOS_EVENTOS()).map((e) => {
    if (somente && e.id !== somente) return null;
    if (excluir.includes(e.id)) return null;
    if (!somente && !["propostas", "fimContrato", "clausula"].includes(e.id) && recentes.includes(e.id)) return null;
    if (!somente && e.id === "impasse") return null;
    const ctx = e.preparar ? e.preparar(c) : {};
    const p = e.peso(c, ctx);
    return p > 0 ? { e, ctx, p } : null;
  }).filter(Boolean);
  if (!cands.length) return null;
  const forcado = cands.find((x) => x.p >= 1000);
  if (forcado) cands.splice(0, cands.length, forcado);
  const tot = cands.reduce((s, x) => s + x.p, 0);
  let roll = rnd() * tot;
  const escolhido = cands.find((x) => (roll -= x.p) <= 0) || cands[cands.length - 1];
  const { e, ctx } = escolhido;
  return {
    id: e.id, icone: e.icone, vida: !!e.vida, grade: !!e.grade, titulo: e.titulo(c, ctx), texto: e.texto(c, ctx),
    opcoes: opcoesCompletas(e, c, ctx).map(({ efeito, ...o }) => ({ ...o, risco: o.risco || RISCOS[`${e.id}:${o.id}`] || (o.oferta ? riscoDaOferta(o.oferta) : "seguro") })), ctx,
  };
}

/* Depois do evento principal: se o atleta já é grande demais para o clube,
   a janela de transferências abre também (sem perder a oportunidade). */
/* Mercado em toda janela (como no Copero): depois do acontecimento da temporada,
   o empresário traz propostas — salvo se você acabou de trocar de clube, renovou
   há pouco, está emprestado ou ainda é da base. */
export function janelaExtra(c, idJaVisto) {
  if (["propostas", "fimContrato", "clausula"].includes(idJaVisto) || c.contrato?.restantes <= 0 || c.flags.blindado > 0 || c.idade < 17 || c.emprestimo) return null;
  if (c.ultimaTransferencia?.ano === c.ano) return null;
  // nem toda janela tem proposta: depende de quanto você está aparecendo
  const ovr = ovrDe(c), dif = ovr - clubeDe(c.clubeNome).forca;
  const ult = c.temporadas[c.temporadas.length - 1];
  const p = clampR(0.5 + (dif >= 4 ? 0.25 : 0) + ((ult?.nota || 0) >= 7.3 ? 0.15 : 0) + (c.mod?.ofertasExtra ? 0.3 : 0) - (dif <= -6 ? 0.15 : 0), 0.25, 0.95);
  if (!comSemente(c.codigo, `mercado:${c.ano}`, () => chance(p))) return null;
  return sortearEvento(c, { somente: "propostas" });
}

/* Aplica a escolha. Como funções não vão pro save, o evento é reconstruído pelo id + contexto. */
export function resolverEvento(c0, evento, opcaoId, extra = null) {
  return comSemente(c0.codigo, `resolver:${c0.ano}:${evento.id}:${opcaoId}`, () => resolverEventoBase(c0, evento, opcaoId, extra));
}
function resolverEventoBase(c0, evento, opcaoId, extra = null) {
  const c = clone(c0);
  c.mod = c.mod || {};
  const def = TODOS_EVENTOS().find((e) => e.id === evento.id);
  const op = def ? opcoesCompletas(def, c, evento.ctx).find((o) => o.id === opcaoId) : null;
  const resultado = op ? op.efeito(c, extra) : "";
  c.flags.historicoEventos = [...(c.flags.historicoEventos || []), evento.id].slice(-8);
  const ultima = c.temporadas[c.temporadas.length - 1];
  if (ultima) ultima.decisao = { evento: evento.titulo, escolha: op?.label || "", resultado };
  return { c, resultado };
}

/* ---------- ligas que o empresário pode sondar ---------- */
export const LIGAS_EMPRESARIO = [
  { id: null, nome: "Qualquer liga", icone: "🌍" },
  { id: "inglaterra", nome: "Premier League", icone: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { id: "espanha", nome: "La Liga", icone: "🇪🇸" },
  { id: "italia", nome: "Serie A", icone: "🇮🇹" }, { id: "alemanha", nome: "Bundesliga", icone: "🇩🇪" },
  { id: "franca", nome: "Ligue 1", icone: "🇫🇷" }, { id: "portugal", nome: "Liga Portugal", icone: "🇵🇹" },
  { id: "brasileirao", nome: "Brasileirão", icone: "🇧🇷" }, { id: "arabia", nome: "Liga Saudita", icone: "🇸🇦" },
  { id: "mls", nome: "MLS", icone: "🇺🇸" },
];
/* Pede ao empresário outra liga durante a janela: refaz as propostas uma vez por janela */
export function pedirLiga(c0, ligaId) {
  const c = clone(c0);
  c.ligaAlvo = ligaId || null;
  c.flags.ligaPedida = c.ano;
  return { c, evento: sortearEvento(c, { somente: "propostas" }) };
}

/* ---------- ritmo: quantos acontecimentos por janela ---------- */
const EVENTOS_IMPORTANTES = ["propostas", "fimContrato", "clausula", "livre", "fortuna", "traicao", "voltarCasa", "naturalizacao", "emprestimo", "forcarSaida"];
/* Evento principal da janela, respeitando o ritmo escolhido */
/* Ritmo como no Copero: Intenso = decisão toda temporada; Normal = a cada 2; Expresso = a cada 3.
   Fora dessas janelas só aparece o que é obrigatório (fim de contrato). */
export const CADENCIA = { intenso: 1, normal: 2, expresso: 3 };
export const anoDeDecisao = (c) => (c.temporadas.length || 0) % (CADENCIA[c.ritmo] || 2) === 0;
export function eventoDaJanela(c) {
  if (!anoDeDecisao(c)) return sortearEvento(c, { somente: "fimContrato" });
  const ev = sortearEvento(c, { excluir: ["propostas"] });
  const forcado = ev && (EVENTOS_IMPORTANTES.includes(ev.id) || ev.id === "fimContrato");
  // decisão de risco (estilo Copero) em boa parte das janelas: ~45% no Normal e no Intenso,
  // e ela é o acontecimento do Expresso quando nada importante acontece
  const querAposta = comSemente(c.codigo, `aposta:${c.ano}`, () => chance(c.ritmo === "expresso" ? 0.4 : 0.45));
  if (!forcado && querAposta) {
    const ap = sortearEvento(c, { excluir: ["propostas"], soApostas: true });
    if (ap) return ap;
  }
  if (!ev || c.ritmo !== "expresso" || forcado) return ev;
  return null;
}
/* Depois da decisão: a janela de transferências, quando ela abre */
export function segundoEvento(c, idJaVisto) {
  if (!anoDeDecisao(c) || idJaVisto === "base") return null;
  return janelaExtra(c, idJaVisto);
}

/* ---------- coletiva de imprensa ---------- */
const COLETIVAS = {
  titulo: {
    pergunta: (c, k) => `Campeão${k.titulos.length > 1 ? ` de ${k.titulos.length} taças` : ""}. O que esse momento representa para você?`,
    tons: {
      calmo: ["“Foi um ano de muito trabalho. Agora é descansar e recomeçar.”", { torcida: 2, moral: 3 }],
      agressivo: ["“Isso é só o começo. Quem duvidou, que se prepare.”", { fama: 6, torcida: 5, moral: 4, tecnico: -2, aposta: true }],
      humilde: ["“O título é do grupo. Eu só fiz a minha parte.”", { torcida: 4, moral: 5, tecnico: 4 }],
      defenderTecnico: ["“Quero dedicar ao professor. Ninguém acreditava nele.”", { tecnico: 8, moral: 3 }],
    },
  },
  crise: {
    pergunta: (c, k) => `Nota ${(k.nota || 0).toFixed(1)} e muita crítica. A torcida tem razão em cobrar?`,
    tons: {
      calmo: ["“Faz parte. Vou trabalhar em silêncio.”", { moral: 2, torcida: 1 }],
      agressivo: ["“Quem me critica não vê os treinos. Vou calar muita gente.”", { fama: 4, moral: 4, aposta: true }],
      cobrarReforcos: ["“Sozinho não dá. O elenco precisa de reforços.”", { torcida: 6, diretoria: -10, moral: -2, ofertas: true }],
      defenderTecnico: ["“A culpa não é do treinador. Estamos com ele.”", { tecnico: 10, torcida: -3 }],
      assumirCulpa: ["“A responsabilidade é minha. Eu devo mais.”", { torcida: 6, moral: -4, tecnico: 4, fama: -2 }],
    },
  },
  rival: {
    pergunta: (c) => `${c.rival?.nome} está sendo comparado a você o tempo todo. Quem é melhor?`,
    tons: {
      calmo: ["“Respeito muito. Cada um faz a sua história.”", { moral: 2 }],
      agressivo: ["“Os números falam por mim. Pode comparar.”", { fama: 6, moral: 3, aposta: true }],
      humilde: ["“Ele é um craque. Me obriga a melhorar todo dia.”", { torcida: 2, moral: 4, fama: 1 }],
    },
  },
  mercado: {
    pergunta: (c) => `Dizem que grandes clubes da Europa estão de olho. Você fica no ${c.clubeNome}?`,
    tons: {
      calmo: ["“Tenho contrato e foco total aqui.”", { torcida: 5, moral: 2 }],
      agressivo: ["“Quero disputar tudo. Sonho em jogar no maior palco.”", { fama: 4, torcida: -8, ofertas: true }],
      humilde: ["“Estou feliz. Se um dia vier algo, a gente conversa com o clube.”", { torcida: 1, diretoria: 4 }],
    },
  },
  copa: {
    pergunta: (c) => `Ano de ${anoDeCopa(c.ano) ? "Copa do Mundo" : nomeCopaContinental(c.nac)}. ${nacDe(c.nac).label} pode contar com você?`,
    tons: {
      calmo: ["“Se o treinador me chamar, estarei pronto.”", { moral: 2 }],
      agressivo: ["“Vou ser campeão. Podem escrever.”", { fama: 6, moral: 5, aposta: true }],
      humilde: ["“Vestir essa camisa já é um sonho. O resto é consequência.”", { torcida: 3, moral: 4, selecao: 1 }],
    },
  },
  geral: {
    pergunta: (c) => `Temporada encerrada no ${c.clubeNome}. Qual é a meta para o ano que vem?`,
    tons: {
      calmo: ["“Evoluir um pouco a cada jogo.”", { moral: 3 }],
      agressivo: ["“Quero ser o melhor do mundo. Não tenho medo de falar.”", { fama: 5, moral: 2, aposta: true }],
      humilde: ["“Ajudar o grupo a brigar por título.”", { torcida: 3, tecnico: 4 }],
      cobrarReforcos: ["“Para sonhar alto, o clube precisa investir.”", { torcida: 5, diretoria: -8, ofertas: true }],
    },
  },
};
/* Promessas ousadas: guardadas e conferidas no fim da temporada seguinte */
const PROMESSAS = {
  titulo: { frase: "“Isso é só o começo”", meta: "ganhar outro título", ok: (k) => k.titulos.some((t) => !ehPremioIndividual(t.tipo)) },
  crise: { frase: "“Vou calar muita gente”", meta: "subir de produção", ok: (k, p) => (k.nota || 0) >= Math.max(6.6, (p.notaRef || 0) + 0.3) },
  rival: { frase: "“Os números falam por mim”", meta: "terminar à frente do rival", ok: (k) => (k.rival ? k.gols + k.assist > k.rival.gols + k.rival.assist || (!!k.rival.bola && k.bola.pos < k.rival.bola) : k.bola.pos <= 10) },
  copa: { frase: "“Vou ser campeão”", meta: "levantar a taça pela seleção", ok: (k) => k.titulos.some((t) => ["copaMundo", "continentalSelecao"].includes(t.tipo)) },
  geral: { frase: "“Quero ser o melhor do mundo”", meta: "ficar entre os 5 da Bola de Ouro", ok: (k) => k.bola.pos <= 5 },
};
function resolverPromessa(c, card, tc) {
  const p = c.promessa;
  if (!p || card.ano < p.ano) return;
  c.promessa = null;
  const def = PROMESSAS[p.contexto];
  if (!def || card.ano !== p.ano) return;
  const cumpriu = def.ok(card, p);
  if (cumpriu) {
    c.fama = clampR(c.fama + 5, 0, 100); c.torcida[tc] = clampR((c.torcida[tc] ?? 30) + 5, 0, 100); mexerMoral(c, 5);
    card.destaques.push(`Você disse ${def.frase} e cumpriu. A imprensa teve que dar o braço a torcer`);
  } else {
    c.fama = clampR(c.fama - 3, 0, 100); c.torcida[tc] = clampR((c.torcida[tc] ?? 30) - 4, 0, 100); mexerMoral(c, -6);
    card.destaques.push(`A imprensa lembrou: você disse ${def.frase} e não cumpriu`);
  }
  card.promessa = { frase: def.frase, cumpriu, contexto: p.contexto };
}

const JORNALISTAS = ["Rádio Arquibancada", "Jornal do Gramado", "TV Bola Rolando", "Portal Lance Livre", "Canal Resenha", "Diário da Grande Área"];

export function deveTerColetiva(c, card) {
  if (c.ritmo === "expresso" || c.idade < 18 || !card) return false;
  // no máximo uma a cada 3 temporadas, e só depois de algo grande (título importante, pódio ou crise)
  if (c.ultimaColetiva && c.ano - c.ultimaColetiva < 3) return false;
  const marcante = card.titulos.some((t) => ["liga", "continental", "copaMundo", "continentalSelecao", "mundial"].includes(t.tipo)) || card.bola.pos <= 3
    || (card.nota && card.nota < 6.2 && card.jogos >= 15) || card.rival?.bola === 1;
  if (!marcante) return false;
  return comSemente(c.codigo, `coletivaSorteio:${c.ano}`, () => chance(c.ritmo === "intenso" ? 0.8 : 0.55));
}

export function gerarColetiva(c, card) {
  return comSemente(c.codigo, `coletiva:${c.ano}`, () => {
    const ovr = ovrDe(c);
    const contexto = card.titulos.some((t) => !ehPremioIndividual(t.tipo)) ? "titulo"
      : card.nota && card.nota < 6.5 && card.jogos >= 12 ? "crise"
      : c.rival && !c.rival.aposentado && (card.rival?.bola || card.rival?.titulos?.length) && chance(0.7) ? "rival"
      : (anoDeCopa(c.ano) || anoDeContinentalSelecao(c.ano)) && c.selecao.convocacoes > 0 ? "copa"
      : ovr - clubeDe(c.clubeNome).forca >= 4 ? "mercado" : "geral";
    const def = COLETIVAS[contexto];
    return {
      contexto, veiculo: pick(JORNALISTAS), pergunta: def.pergunta(c, card),
      opcoes: Object.entries(def.tons).map(([id, [fala]]) => {
        const tom = TONS_COLETIVA_RAPIDO[id];
        return { id, label: tom.label, icone: tom.icone, fala };
      }),
    };
  });
}
const TONS_COLETIVA_RAPIDO = {
  calmo: { label: "Calmo e ponderado", icone: "🙂" }, agressivo: { label: "Confiante e provocador", icone: "🔥" },
  humilde: { label: "Humilde, mérito do grupo", icone: "🤝" }, cobrarReforcos: { label: "Cobrar a diretoria", icone: "📣" },
  defenderTecnico: { label: "Defender o técnico", icone: "🛡️" }, assumirCulpa: { label: "Assumir a culpa", icone: "🙇" },
};

export function responderColetiva(c0, coletiva, tomId) {
  return comSemente(c0.codigo, `coletivaResp:${c0.ano}:${tomId}`, () => {
    const c = clone(c0);
    c.mod = c.mod || {};
    const [fala, ef] = COLETIVAS[coletiva.contexto].tons[tomId] || COLETIVAS.geral.tons.calmo;
    const notas = [];
    const t = c.clubeNome;
    let { torcida = 0, fama = 0, moral = 0, tecnico = 0, diretoria = 0 } = ef;
    // promessa ousada: a imprensa cobra se não cumprir; ganha confiança se cumprir
    if (ef.aposta && PROMESSAS[coletiva.contexto]) {
      c.mod.notaBonus = (c.mod.notaBonus || 0) + 0.08;
      c.promessa = { ano: c.ano, contexto: coletiva.contexto, notaRef: c.temporadas[c.temporadas.length - 1]?.nota || 0 };
      notas.push(`A frase ficou gravada. No fim da temporada, a imprensa vai cobrar: ${PROMESSAS[coletiva.contexto].meta}.`);
    }
    if (torcida) c.torcida[t] = clampR((c.torcida[t] ?? 30) + torcida, 0, 100);
    if (fama) c.fama = clampR(c.fama + fama, 0, 100);
    if (moral) mexerMoral(c, moral);
    if (tecnico) c.mod.shareAdd = (c.mod.shareAdd || 0) + tecnico * 0.006;
    if (diretoria) c.repNeg = clampR((c.repNeg || 0) - Math.round(diretoria / 2), -60, 60);
    if (ef.ofertas) c.mod.ofertasExtra = 1;
    if (ef.selecao) c.flags.selecaoFria = Math.max(0, (c.flags.selecaoFria || 0) - ef.selecao);
    const efeitos = [
      torcida && `torcida ${torcida > 0 ? "+" : ""}${torcida}`, fama && `fama ${fama > 0 ? "+" : ""}${fama}`, moral && `cabeça ${moral > 0 ? "+" : ""}${moral}`,
      tecnico && (tecnico > 0 ? "técnico gostou" : "técnico não gostou"), diretoria && (diretoria > 0 ? "diretoria aprovou" : "diretoria irritada"),
      ef.ofertas && "o mercado ouviu",
    ].filter(Boolean);
    c.coletivas = (c.coletivas || 0) + 1; c.ultimaColetiva = c.ano;
    return { c, resultado: { fala, notas, efeitos } };
  });
}

/* ---------- texto para compartilhar ---------- */
/* "2× Libertadores · 1× Champions League · 3× Brasileirão" — do mais importante para o menos */
const ORDEM_TITULOS = ["bolaOuro", "botaOuro", "copaMundo", "continentalSelecao", "mundial", "continental", "liga", "copa", "segunda"];
function tituloPorNome(lista) {
  const cont = new Map();
  ORDEM_TITULOS.forEach((tipo) => (lista || []).filter((x) => x.tipo === tipo).forEach((x) => cont.set(x.nome, (cont.get(x.nome) || 0) + 1)));
  return [...cont].map(([nome, n]) => `${n}× ${nome}`).join(" · ");
}
export function textoCompartilhar(c) {
  const L = c.legado || calcularLegado(c);
  const t = c.titulos;
  const linhas = [
    `💎 A JOIA — Modo Rápido`,
    `${c.nome} · ${posicaoDe(c.posicao).label} · ${nacDe(c.nac).label}`,
    `${L.nivel.icone} ${L.nivel.nome} (${L.pontos} pts)`,
    `⚽ ${c.totais.gols} gols · 🅰️ ${c.totais.assist} assist. · ${c.totais.jogos} jogos · OVR máx. ${c.picoOvr}`,
    `🏆 ${tituloPorNome(c.lista) || "sem títulos"}`,
    `💼 Ganhou ${formatarValor(c.ganhosTotais || 0)} na carreira · patrimônio final ${formatarValor(c.patrimonio || 0)}`,
    `Clubes: ${[...new Set(c.temporadas.map((s) => s.clube))].join(" → ")}`,
  ];
  if (c.lenda) linhas.splice(3, 0, `🪞 Você foi como ${c.lenda.nome} (${c.lenda.similaridade}% de semelhança)`);
  if (c.rival) linhas.push(`⚔️ Rival: ${c.rival.nome} — ${duelo(c).venceu ? "você venceu o duelo de geração" : "ele levou a melhor"}`);
  linhas.push(c.diario ? `📅 Carreira do Dia ${dataDoCodigo(c.codigo)} · jogue a mesma em A JOIA` : `🔑 Código da carreira: ${c.codigo}`);
  return linhas.join("\n");
}

/* Resultado em emojis (estilo Wordle): uma figura por temporada */
export function emojiTemporada(s, anterior) {
  if (s.titulos.some((t) => t.tipo === "bolaOuro")) return "🥇";
  if (s.titulos.length) return "🏆";
  if (s.lesao && s.jogos < 25) return "🩹";
  if (anterior && anterior.clube !== s.clube) return "✈️";
  if (s.nota >= 7.2) return "⚽";
  if (s.nota >= 6.6) return "🟩";
  return "⬜";
}
export function textoEmoji(c) {
  const L = c.legado || calcularLegado(c);
  const fig = c.temporadas.map((s, i) => emojiTemporada(s, c.temporadas[i - 1]));
  const linhas = [];
  for (let i = 0; i < fig.length; i += 8) linhas.push(fig.slice(i, i + 8).join(""));
  const cab = c.diario ? `💎 A JOIA · Carreira do Dia ${dataDoCodigo(c.codigo)}` : `💎 A JOIA · código ${c.codigo}`;
  return [
    cab,
    `${posicaoDe(c.posicao).label} · ${nacDe(c.nac).label} · ${c.temporadas.length} temporadas`,
    ...linhas,
    `${L.nivel.icone} ${L.nivel.nome} · ${L.pontos} pts${c.rival ? ` · ${duelo(c).venceu ? "⚔️ venci o rival" : "⚔️ perdi pro rival"}` : ""}`,
    "https://bravolucas.github.io/A-Joia/",
  ].join("\n");
}

/* Placar do duelo de geração */
export function duelo(c) {
  const r = c.rival;
  if (!r) return null;
  const meus = c.legado?.pontos ?? calcularLegado(c).pontos;
  const dele = pontosRival(r);
  const tit = (t) => (t.liga || 0) + (t.copa || 0) + (t.continental || 0) + (t.copaMundo || 0) + (t.mundial || 0) + (t.continentalSelecao || 0);
  return {
    venceu: meus > dele, meus, dele,
    linhas: [
      ["Gols", c.totais.gols, r.totais.gols], ["Assistências", c.totais.assist, r.totais.assist], ["Títulos", tit(c.titulos), tit(r.titulos)],
      ["Bolas de Ouro", c.titulos.bolaOuro || 0, r.titulos.bolaOuro], ["Copas do Mundo", c.titulos.copaMundo || 0, r.titulos.copaMundo], ["OVR máximo", c.picoOvr, r.pico || r.ovr],
    ],
  };
}

/* ---------- ranking pessoal (só neste navegador) ---------- */
export const CHAVE_HALL = "ajoia_rapido_hall";
export function lerHall() {
  try { const h = JSON.parse(localStorage.getItem(CHAVE_HALL) || "[]"); return Array.isArray(h) ? h : []; } catch { return []; }
}
/* Registra a carreira encerrada e devolve a posição dela entre as suas */
export function registrarNoHall(c) {
  const L = c.legado || calcularLegado(c);
  const id = `${c.codigo}|${c.nome}|${L.pontos}|${c.totais.gols}`;
  const hall = lerHall().filter((x) => x.id !== id);
  const item = {
    id, nome: c.nome, pontos: L.pontos, nivel: L.nivel.nome, icone: L.nivel.icone, cor: L.nivel.cor, codigo: c.codigo, diario: !!c.diario,
    posicao: c.posicao, nac: c.nac, gols: c.totais.gols, titulos: c.lista.filter((x) => !ehPremioIndividual(x.tipo)).length, data: new Date().toISOString().slice(0, 10),
  };
  const novo = [...hall, item].sort((a, b) => b.pontos - a.pontos);
  const posicao = novo.findIndex((x) => x.id === id) + 1;
  const melhorDoDia = c.diario ? novo.filter((x) => x.codigo === c.codigo).findIndex((x) => x.id === id) + 1 : null;
  try { localStorage.setItem(CHAVE_HALL, JSON.stringify(novo.slice(0, 30))); } catch { /* sem armazenamento */ }
  return { posicao, total: novo.length, melhorDoDia, tentativasDoDia: c.diario ? novo.filter((x) => x.codigo === c.codigo).length : 0 };
}

/* ---------- save próprio ---------- */
export function salvarRapido(estado) {
  try { localStorage.setItem(CHAVE_SAVE_RAPIDO, JSON.stringify({ v: VERSAO_RAPIDO, ...estado })); return true; } catch { return false; }
}
export function carregarRapido() {
  try {
    const s = JSON.parse(localStorage.getItem(CHAVE_SAVE_RAPIDO) || "null");
    if (!s || s.v !== VERSAO_RAPIDO || !s.c?.attrs || !Array.isArray(s.c.temporadas)) return null;
    s.c.flags = { historicoEventos: [], traidor: [], ...(s.c.flags || {}) };
    s.c.mod = s.c.mod || {};
    s.c.marcos = s.c.marcos || [];
    s.c.torcida = s.c.torcida || {}; s.c.apelidos = (s.c.apelidos || []).map((a) => (typeof a === "string" ? { clube: "", nome: a } : a));
    s.c.patrimonio = s.c.patrimonio || 0; s.c.investimentos = s.c.investimentos || []; s.c.repNeg = s.c.repNeg || 0;
    if (!s.c.contrato) s.c.contrato = contratoPadrao(s.c, s.c.clubeNome);
    s.c.foco = s.c.foco || "equilibrio";
    s.c.picoAttrs = s.c.picoAttrs || { ...s.c.attrs };
    s.c.moral = s.c.moral ?? 65; s.c.transferencias = s.c.transferencias || []; s.c.ligaAlvo = s.c.ligaAlvo || null; s.c.ritmo = s.c.ritmo || "normal"; s.c.pe = s.c.pe || "destro";
    s.c.titulos = { liga: 0, copa: 0, continental: 0, mundial: 0, copaMundo: 0, continentalSelecao: 0, bolaOuro: 0, botaOuro: 0, segunda: 0, ...(s.c.titulos || {}) };
    if (!s.c.mundo?.jogadores) s.c.mundo = mundoCompacto();
    s.c.ligas = s.c.ligas || {};
    sincronizarLigas(s.c);
    return s;
  } catch { return null; }
}
export function apagarRapido() { try { localStorage.removeItem(CHAVE_SAVE_RAPIDO); } catch { /* sem armazenamento */ } }

/* ---------- simulação automática (testes e balanceamento) ---------- */
function resolverAuto(c, ev, escolher) {
  let op = escolher(ev.opcoes.filter((o) => !o.escolherLiga), ev);
  if (!op.negociar) return resolverEvento(c, ev, op.id).c;
  let n = iniciarNegociacao(c, op.negociar);
  for (let k = 0; k < 2 && chance(0.6); k++) n = ajustarNegociacao(n, pick(["salario", "anos", "multa", "bonusGol"]), pick([1, -1]));
  if (n.colapsou) {
    const resto = ev.opcoes.filter((o) => o.id !== op.id && !o.negociar);
    return resto.length ? resolverEvento(c, ev, resto[0].id).c : c;
  }
  const f = fecharNegociacao(c, n);
  return resolverEvento(f.c, ev, op.id, { contrato: f.contrato, luvas: op.negociar.luvas ? Math.round(f.contrato.salario * 0.5) : 0 }).c;
}

export function simularCarreiraAutomatica(dados, escolher = (op) => pick(op), escolherFoco = () => pick(FOCOS).id) {
  const codigo = normalizarCodigo(dados.codigo);
  // a simulação mexe no mapa de ligas; devolve o da carreira que estava aberta
  const ligasAntes = { ...LIGAS_CARREIRA };
  try { return comSemente(codigo, "auto", () => simularCarreiraAutomaticaBase({ ...dados, codigo }, escolher, escolherFoco)); }
  finally { LIGAS_CARREIRA = ligasAntes; }
}
function simularCarreiraAutomaticaBase(dados, escolher, escolherFoco) {
  let c = criarJogador(dados);
  const base = sortearEvento(c, { somente: "base" });
  if (base) c = resolverAuto(c, base, escolher);
  let guard = 0;
  while (!c.aposentado && guard++ < 30) {
    let { c: c2, card } = jogarTemporada(c);
    while (card.pendente) card = aplicarMomento(card, chance(chanceMomento(c2, card.pendente.mini)));
    ({ c } = fecharTemporada(c2, card));
    if (aposentadoriaForcada(c) || (podeAposentar(c) && c.idade >= 36 && chance(0.4))) { c = aposentar(c); break; }
    if (precisaEscolherTraco(c)) c = escolherTraco(c, pick(opcoesDeTraco(c)).id);
    const ultimo = c.temporadas[c.temporadas.length - 1];
    if (deveTerColetiva(c, ultimo)) { const col = gerarColetiva(c, ultimo); c = responderColetiva(c, col, pick(col.opcoes).id).c; }
    const ev = eventoDaJanela(c);
    if (ev) c = resolverAuto(c, ev, escolher);
    let imp = eventoImpasse(c);
    if (imp) c = resolverAuto(c, imp, escolher);
    const ex = imp ? null : segundoEvento(c, ev?.id);
    if (ex) c = resolverAuto(c, ex, escolher);
    imp = eventoImpasse(c);
    if (imp) c = resolverAuto(c, imp, escolher);
    const compra = INVESTIMENTOS.filter((i) => !(c.investimentos || []).includes(i.id) && i.custo <= c.patrimonio * 0.5);
    if (compra.length && chance(0.4)) c = comprarInvestimento(c, pick(compra).id).c;
    c = definirFoco(c, escolherFoco(c));
    c = escolherPretemporada(c, pick(opcoesPretemporada(c)).id);
  }
  if (!c.aposentado) c = aposentar(c);
  return c;
}
