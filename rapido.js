/* ===================== MODO RÁPIDO — LÓGICA =====================
   Carreira inteira em 5 a 10 minutos: cada temporada vira uma tela
   (resumo → evento → decisão). Reaproveita os dados do Modo Carreira
   (clubes, ligas, seleções, personalidades, mundo de jogadores reais e
   a fórmula da Bola de Ouro), mas tem estado e save próprios — nada aqui
   lê ou grava o save do Modo Carreira. */

import {
  CLUBES, LIGAS, POSICOES, NACIONALIDADES, PERSONALIDADES, EMPRESARIOS, AFINIDADE_MERCADO, CLASSICOS,
} from "./data.js";
import {
  rand, pick, clampR, clamp, poisson, calcOVR, evoluirAtributos,
  gerarMundoJogadores, simularTemporadaMundo, rankingBolaDeOuro,
} from "./lib.js";

export const VERSAO_RAPIDO = 1;
export const CHAVE_SAVE_RAPIDO = "ajoia_rapido_v1";
export const ANO_INICIAL = 2026;
export const IDADE_INICIAL = 16;
export const IDADES_TRACO = [19, 24, 29];

const ATTRS = ["velocidade", "finalizacao", "passe", "drible", "defesa", "fisico"];
const DEFENSIVAS = ["GOL", "ZAG", "LD", "LE", "VOL"];
const rnd = () => Math.random();
const chance = (p) => rnd() < p;
const clone = (x) => JSON.parse(JSON.stringify(x));

/* ---------- consultas básicas ---------- */
export const posicaoDe = (id) => POSICOES.find((p) => p.id === id) || POSICOES[0];
export const nacDe = (id) => NACIONALIDADES.find((n) => n.id === id) || NACIONALIDADES[0];
export const personaDe = (id) => PERSONALIDADES.find((p) => p.id === id) || PERSONALIDADES[3];
export const clubeDe = (nome) => CLUBES.find((x) => x.nome === nome) || { nome, forca: 60, liga: "serieB", cor: "#12A876" };
export const ligaDe = (id) => LIGAS[id] || { nome: "Liga", mult: 0.7 };
export const ehSegundaDivisao = (ligaId) => !!ligaDe(ligaId).promocao;
export const clubesJogaveis = () => CLUBES.filter((x) => !ligaDe(x.liga).naoJogavel);
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

export function clubeInicial(nacId) {
  const ligas = LIGA_BASE_POR_NAC[nacId] || ["portugal2", "inglaterra2", "franca2"];
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

export function opcoesDeTraco(c) {
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
export function criarJogador({ nome, nac, posicao, personalidade }) {
  const pos = posicaoDe(posicao);
  const persona = personaDe(personalidade);
  // potencial: ponto alto nos atributos que a posição mais usa, com uma faixa de sorte
  const teto = rand(82, 93) + (persona.id === "festeiro" ? 2 : 0);
  const pesos = Object.entries(pos.pesos).sort((a, b) => b[1] - a[1]);
  const potencial = {};
  pesos.forEach(([a], i) => { potencial[a] = clampR(teto - i * rand(2, 5) + rand(-2, 2), 50, 97); });
  const attrs = {};
  ATTRS.forEach((a) => { attrs[a] = clampR(potencial[a] - rand(24, 32), 38, 66); });
  const clube = clubeInicial(nac);
  const c = {
    v: VERSAO_RAPIDO, nome: nome.trim(), nac, posicao, personalidade: persona.id,
    idade: IDADE_INICIAL, ano: ANO_INICIAL, attrs, potencial,
    clubeNome: clube.nome, primeiroClube: clube.nome, empresario: "iniciante",
    torcida: { [clube.nome]: 30 }, apelidos: [], tracos: [], tracosEscolhidos: {},
    temporadas: [], totais: { jogos: 0, gols: 0, assist: 0 },
    titulos: { liga: 0, copa: 0, continental: 0, copaMundo: 0, bolaOuro: 0, segunda: 0 },
    lista: [], top3Bola: 0, fama: 5, mod: {}, flags: { historicoEventos: [], cronica: false, blindado: 0, selecaoFria: 0, social: false, traidor: [] },
    selecao: { convocacoes: 0, copas: [] }, vagaContinental: false, picoOvr: 0, aposentado: false, emprestimo: null,
    mundo: mundoCompacto(),
  };
  c.picoOvr = ovrDe(c);
  return c;
}

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
export function formatarValor(k) {
  if (k >= 1000) { const m = k / 1000; return `€ ${m >= 100 ? Math.round(m) : m.toFixed(1).replace(".0", "")} mi`; }
  return `€ ${Math.round(k)} mil`;
}

/* ---------- temporada ---------- */
export const anoDeCopa = (ano) => ano % 4 === 2;
const forcaSelecao = (c) => nacDe(c.nac).forcaSelecao;

function simularLiga(c, clube, ovr, share) {
  const rivais = clubesJogaveis().filter((x) => x.liga === clube.liga);
  const impacto = (ovr - clube.forca) * share * 0.35 + somaTraco(c, "forcaTime") * share;
  const tabela = rivais.map((x) => ({ nome: x.nome, s: x.forca + (x.nome === clube.nome ? impacto : 0) + (rnd() + rnd() + rnd() - 1.5) * 6 }))
    .sort((a, b) => b.s - a.s);
  const pos = tabela.findIndex((x) => x.nome === clube.nome) + 1;
  return { pos: pos || rand(5, 15), total: tabela.length, campeao: tabela[0]?.nome };
}

function mataMata(forcaEf, base, bonus = 0) {
  return clampR(0.5 + (forcaEf - base) * 0.03 + bonus, 0.12, 0.85);
}

function simularContinental(c, clube, ovr, share) {
  const nome = ligaDe(clube.liga).continental;
  const forcaEf = clube.forca + (ovr - clube.forca) * share * 0.3 + somaTraco(c, "forcaTime") * share;
  const fases = ["Fase de grupos", "Oitavas", "Quartas", "Semifinal", "Final"];
  const base = nome === "Champions League" ? 84 : 76;
  const bonus = somaTraco(c, "mataMata") * share;
  if (!chance(clampR(0.55 + (forcaEf - base) * 0.035, 0.2, 0.92))) return { nome, fase: 0, faseNome: fases[0] };
  for (let f = 1; f <= 3; f++) {
    if (!chance(mataMata(forcaEf, base, bonus))) return { nome, fase: f, faseNome: fases[f] };
  }
  return { nome, fase: 4, faseNome: "Final", final: true, chanceFinal: mataMata(forcaEf, base, bonus) };
}

function simularCopaMundo(c, ovr) {
  const fs = forcaSelecao(c);
  const corte = fs - 6 + (c.flags.selecaoFria || 0) * 2;
  if (c.idade < 18) return null;
  let convocado = ovr >= corte ? chance(0.92) : ovr >= corte - 4 ? chance(0.35) : false;
  if (!convocado) return { ano: c.ano, convocado: false, resultado: "Fora da convocação" };
  const titular = ovr >= fs - 2;
  const bonus = titular ? (ovr - fs) * 0.01 + 0.03 + somaTraco(c, "mataMata") : 0;
  const fases = ["Fase de grupos", "Oitavas", "Quartas", "Semifinal", "Final"];
  const out = { ano: c.ano, convocado: true, titular, fase: 0, resultado: "Eliminado na fase de grupos", gols: 0 };
  const lance = titular ? posicaoDe(c.posicao).golBase * 0.9 : posicaoDe(c.posicao).golBase * 0.3;
  out.gols += poisson(lance * 3);
  if (!chance(clampR(0.55 + (fs - 75) * 0.025 + bonus, 0.2, 0.95))) return out;
  for (let f = 1; f <= 3; f++) {
    out.gols += poisson(lance);
    if (!chance(mataMata(fs, 82, bonus))) { out.fase = f; out.resultado = `Eliminado nas ${fases[f].toLowerCase()}`; if (f === 3) out.resultado = "Eliminado na semifinal"; return out; }
  }
  out.fase = 4; out.final = true; out.chanceFinal = mataMata(fs, 82, bonus); out.resultado = "Final";
  return out;
}

/* Joga a temporada inteira. Se houver uma final com você em campo,
   devolve um "momento decisivo" (pênalti) para o jogador resolver na tela. */
export function jogarTemporada(c0) {
  const c = clone(c0);
  const mod = c.mod || {};
  const persona = personaDe(c.personalidade);
  const clubeNome = c.emprestimo?.destino || c.clubeNome;
  const clube = clubeDe(clubeNome);
  const liga = ligaDe(clube.liga);
  const pos = posicaoDe(c.posicao);
  const ovr = ovrDe(c);
  const st = statusPorDiff(ovr - clube.forca, c.idade);
  let share = clampR((st.share + (mod.shareAdd || 0)) * (mod.shareMult ?? 1), 0.04, 1);

  // lesão durante a temporada
  const riscoLesao = clampR((0.07 + (mod.lesaoAdd || 0) + (c.flags.cronica ? 0.05 : 0) + Math.max(0, c.idade - 30) * 0.01) * persona.risco * multTraco(c, "lesaoMult"), 0.01, 0.4);
  const lesao = chance(riscoLesao) ? pick([
    { nome: "estiramento na coxa", fator: 0.8 }, { nome: "entorse no tornozelo", fator: 0.75 },
    { nome: "lesão muscular", fator: 0.7 }, { nome: "ruptura de ligamento", fator: 0.35 },
  ]) : null;
  if (lesao) share *= lesao.fator;

  const jogos = clampR(Math.round(48 * share * (0.9 + rnd() * 0.15)), 0, 52);
  const nivel = Math.pow(Math.max(0.25, (ovr - 55) / 35), 1.55) * (1.25 - liga.mult * 0.45);
  const gols = c.posicao === "GOL" ? 0 : Math.round(poisson(pos.golBase * nivel * jogos) * multTraco(c, "golsMult"));
  const assist = Math.round(poisson(pos.assistBase * nivel * jogos * (c.posicao === "GOL" ? 0.1 : 1)) * multTraco(c, "assistMult"));
  const defBonus = DEFENSIVAS.includes(c.posicao) ? 0.15 : 0;
  const nota = jogos === 0 ? 0 : +clamp(6.2 + (ovr - 70) * 0.035 + (ovr - clube.forca) * 0.02 + ((gols + assist) / Math.max(1, jogos)) * 1.2
    + defBonus + somaTraco(c, "notaBonus") + (mod.notaBonus || 0) + (rnd() - 0.5) * 0.5, 5.2, 9.7).toFixed(2);

  const card = {
    idx: c.temporadas.length, ano: c.ano, idade: c.idade, clube: clube.nome, cor: clube.cor, ligaId: clube.liga, ligaNome: liga.nome,
    emprestado: !!c.emprestimo, ovr, status: st.label, jogos, gols, assist, nota, lesao: lesao?.nome || null,
    titulos: [], destaques: [],
  };

  // campeonato nacional
  const tab = simularLiga(c, clube, ovr, share);
  card.posLiga = tab.pos; card.totalLiga = tab.total;
  if (tab.pos === 1) card.titulos.push({ tipo: ehSegundaDivisao(clube.liga) ? "segunda" : "liga", nome: liga.nome });
  else if (ehSegundaDivisao(clube.liga) && tab.pos <= 2) card.destaques.push(`${liga.promocao} conquistado com o clube`);

  // copa nacional
  const copaNome = COPA_POR_LIGA[clube.liga];
  if (copaNome) {
    const p = clampR(0.06 + (clube.forca - 75) * 0.01 + (ovr - clube.forca) * share * 0.004 + somaTraco(c, "mataMata") * share, 0.02, 0.3);
    if (chance(p)) card.titulos.push({ tipo: "copa", nome: copaNome });
  }

  // continental
  let momento = null;
  if (liga.continental && !ehSegundaDivisao(clube.liga) && (c.vagaContinental || (c.temporadas.length === 0 && clube.forca >= 80))) {
    const cont = simularContinental(c, clube, ovr, share);
    card.continental = { nome: cont.nome, faseNome: cont.faseNome, final: !!cont.final, chanceFinal: cont.chanceFinal };
    if (cont.final) {
      if (share >= 0.5 && !lesao) momento = { tipo: "continental", titulo: `Final da ${cont.nome}`, texto: `Prorrogação empatada. Pênaltis. A última cobrança é sua.` };
      else if (chance(cont.chanceFinal)) card.titulos.push({ tipo: "continental", nome: cont.nome });
    }
  }

  // Copa do Mundo
  if (anoDeCopa(c.ano)) {
    const copa = simularCopaMundo(c, ovr);
    if (copa) {
      card.copaMundo = copa;
      if (copa.convocado) c.selecao.convocacoes += 1;
      if (copa.final) {
        if (copa.titular) {
          // a Copa tem prioridade: se as duas finais caírem no mesmo ano, a continental é sorteada
          if (momento) { if (chance(card.continental.chanceFinal)) card.titulos.push({ tipo: "continental", nome: card.continental.nome }); card.continental.resolvida = true; }
          momento = { tipo: "copa", titulo: `Final da Copa do Mundo ${c.ano}`, texto: `${nacDe(c.nac).label} e o mundo inteiro te olhando. Pênalti decisivo.` };
        } else if (chance(copa.chanceFinal)) { copa.campeao = true; copa.resultado = "Campeão do mundo"; card.titulos.push({ tipo: "copaMundo", nome: "Copa do Mundo" }); }
        else copa.resultado = "Vice-campeão do mundo";
      }
    }
  }

  card.pendente = momento;
  return { c, card, momento };
}

/* Chance base de converter o pênalti decisivo — usada pela simulação automática */
export function chancePenalti(c) {
  return clampR(0.62 + (c.attrs.finalizacao - 65) * 0.006 + somaTraco(c, "penalti"), 0.45, 0.92);
}

export function aplicarMomento(card0, acertou) {
  const card = clone(card0);
  const m = card.pendente;
  if (!m) return card;
  if (m.tipo === "continental") {
    if (acertou) { card.titulos.push({ tipo: "continental", nome: card.continental.nome }); card.continental.faseNome = "Campeão"; card.destaques.push(`Pênalti decisivo convertido na final da ${card.continental.nome}`); }
    else { card.continental.faseNome = "Vice-campeão"; card.destaques.push(`Perdeu o pênalti decisivo na final da ${card.continental.nome}`); }
  } else if (m.tipo === "copa") {
    if (acertou) { card.copaMundo.campeao = true; card.copaMundo.resultado = "Campeão do mundo"; card.titulos.push({ tipo: "copaMundo", nome: "Copa do Mundo" }); card.destaques.push("Seu pênalti deu a Copa do Mundo ao seu país"); }
    else { card.copaMundo.resultado = "Vice-campeão do mundo"; card.destaques.push("O pênalti decisivo da Copa parou no goleiro"); }
  }
  card.pendente = null;
  card.momento = { tipo: m.tipo, acertou };
  return card;
}

/* ---------- apelidos ---------- */
function apelidoPara(c, card) {
  const t = c.totais;
  if (card.gols >= 25 || t.gols >= 120) return "O Artilheiro";
  if (card.assist >= 15) return "O Maestro";
  if (["GOL", "ZAG"].includes(c.posicao)) return c.posicao === "GOL" ? "O Paredão" : "A Muralha";
  if (c.attrs.velocidade >= 86) return "O Furacão";
  if (c.idade <= 21) return "A Joia";
  if ((c.tracos || []).includes("lider")) return "O Capitão";
  return "O Guerreiro";
}

/* Fecha a temporada: títulos, Bola de Ouro, torcida, evolução, idade e mundo. */
export function fecharTemporada(c0, card0) {
  const c = clone(c0);
  const card = clone(card0);
  const persona = personaDe(c.personalidade);
  const nTit = card.titulos.length;

  // mundo real anda junto e a Bola de Ouro sai do ranking contra ele
  c.mundo = simularTemporadaMundo(c.mundo);
  const pesoTit = card.titulos.reduce((s, t) => s + (t.tipo === "copaMundo" ? 3 : t.tipo === "continental" ? 2 : t.tipo === "segunda" ? 0 : 1), 0);
  const meuCard = { clube: card.clube, posicao: c.posicao, ovr: card.ovr, gols: card.gols, assist: card.assist, nota: card.nota || 6, ligaMult: ligaDe(card.ligaId).mult };
  let ranking = rankingBolaDeOuro(c.mundo, meuCard, c.nome, pesoTit);
  const bonusFama = somaTraco(c, "bolaBonus") + c.fama * 0.04;
  if (bonusFama) {
    ranking = ranking.map((r) => (r.voce ? { ...r, score: r.score + bonusFama } : r)).sort((a, b) => b.score - a.score).map((x, i) => ({ ...x, pos: i + 1 }));
  }
  const eu = ranking.find((r) => r.voce);
  card.bola = { pos: card.jogos >= 10 ? eu?.pos ?? 999 : 999, top: ranking.slice(0, 3).map((r) => ({ nome: r.nome, clube: r.clube, voce: r.voce })) };
  if (card.bola.pos === 1) { card.titulos.push({ tipo: "bolaOuro", nome: "Bola de Ouro" }); }
  if (card.bola.pos <= 3) c.top3Bola += 1;

  card.titulos.forEach((t) => { c.titulos[t.tipo] = (c.titulos[t.tipo] || 0) + 1; c.lista.push({ ano: card.ano, nome: t.nome, tipo: t.tipo, clube: t.tipo === "copaMundo" ? nacDe(c.nac).label : card.clube }); });

  // totais e fama
  c.totais.jogos += card.jogos; c.totais.gols += card.gols; c.totais.assist += card.assist;
  if (card.copaMundo?.convocado) { c.totais.gols += card.copaMundo.gols || 0; }
  const famaGanho = (Math.max(0, (card.nota - 6.5)) * 6 + nTit * 4 + (card.bola.pos <= 10 ? 8 : 0)) * (persona.famaMult || 1) * multTraco(c, "famaMult");
  c.fama = clampR(Math.round(c.fama * 0.92 + famaGanho), 0, 100);

  // torcida do clube em que jogou
  const tc = card.clube;
  const antes = c.torcida[tc] ?? 30;
  const delta = ((card.nota ? (card.nota - 6.6) * 9 : -4) + nTit * 7 + (card.jogos >= 30 ? 3 : 0) + somaTraco(c, "torcidaAno")) * (card.nota >= 6.6 ? multTraco(c, "torcidaMult") : 1);
  c.torcida[tc] = clampR(Math.round(antes + delta), 0, 100);
  card.torcida = c.torcida[tc];
  if (c.torcida[tc] >= 75 && antes < 75 && !c.apelidos.some((a) => a.clube === tc) && !card.emprestado) {
    const ap = apelidoPara(c, card);
    c.apelidos.push({ clube: tc, nome: ap });
    card.destaques.push(`A torcida do ${tc} passou a te chamar de "${ap}"`);
  }

  // vaga continental para o ano seguinte (só conta se você continuar no clube)
  c.vagaContinental = !card.emprestado && !ehSegundaDivisao(card.ligaId) && !!ligaDe(card.ligaId).continental && (card.posLiga <= 4 || card.titulos.some((t) => t.tipo === "continental"));

  // evolução e idade
  const fatorDes = clampR(1 + ((card.nota || 6) - 6.8) * 0.12, 0.8, 1.25) * (c.mod?.evolucao ?? 1);
  const reduc = multTraco(c, "declinio") * (c.mod?.declinio ?? 1);
  const novos = evoluirAtributos({ ...c.attrs, fintas: 3, pernaRuim: 3 }, { ...c.potencial, fintas: 3, pernaRuim: 3 }, c.idade, persona, null, reduc, fatorDes, 1 + nTit * 0.05);
  ATTRS.forEach((a) => { c.attrs[a] = novos[a]; });
  if (c.flags.cronica) { c.attrs.velocidade = clampR(c.attrs.velocidade - 1, 40, 99); c.attrs.fisico = clampR(c.attrs.fisico - 1, 40, 99); }
  card.ovrDepois = ovrDe(c);
  c.picoOvr = Math.max(c.picoOvr, card.ovr, card.ovrDepois);
  card.valor = valorMercado(card.ovrDepois, c.idade + 1, c.fama);

  if (c.flags.blindado > 0) c.flags.blindado -= 1;
  if (c.emprestimo) { card.destaques.push(`Fim do empréstimo: volta ao ${c.clubeNome}`); c.emprestimo = null; }
  c.mod = {};
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
  c.legado = calcularLegado(c);
  return c;
}

/* ---------- legado ---------- */
export const NIVEIS_LEGADO = [
  { min: 0, nome: "Promessa esquecida", icone: "🍂", cor: "#6C7470", desc: "O talento estava lá. A história não aconteceu." },
  { min: 90, nome: "Jogador de carreira", icone: "⚽", cor: "#9CA4A1", desc: "Uma carreira honesta, respeitada por quem viu de perto." },
  { min: 210, nome: "Ídolo de clube", icone: "💚", cor: "#12A876", desc: "Tem uma torcida que nunca vai te esquecer." },
  { min: 350, nome: "Estrela internacional", icone: "⭐", cor: "#2E6FE0", desc: "Seu nome atravessou fronteiras." },
  { min: 540, nome: "Lenda do futebol", icone: "🏆", cor: "#EBC557", desc: "Entrou para a história do esporte." },
  { min: 820, nome: "A Joia", icone: "💎", cor: "#D8B44A", desc: "Raro, lapidado, eterno. Um dos maiores de todos os tempos." },
];

export function calcularLegado(c) {
  const t = c.titulos;
  const defensivo = ["GOL", "ZAG"].includes(c.posicao);
  const idolos = Object.entries(c.torcida).filter(([, v]) => v >= 75).length;
  const partes = {
    numeros: Math.round(c.totais.gols * 0.35 + c.totais.assist * 0.25 + (defensivo ? c.totais.jogos * 0.12 : c.totais.jogos * 0.03)),
    titulos: (t.liga || 0) * 9 + (t.copa || 0) * 4 + (t.continental || 0) * 18 + (t.segunda || 0) * 2,
    selecao: (t.copaMundo || 0) * 45 + c.selecao.convocacoes * 6,
    premios: (t.bolaOuro || 0) * 55 + c.top3Bola * 10,
    auge: Math.max(0, c.picoOvr - 74) * 6,
    torcida: idolos * 12 + (c.flags.social ? 8 : 0),
  };
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

export function transferir(c, clubeNome, { torcidaInicial = 30 } = {}) {
  const deOnde = c.clubeNome;
  c.clubeNome = clubeNome;
  c.torcida[clubeNome] = c.torcida[clubeNome] ?? torcidaInicial;
  c.vagaContinental = false;
  c.emprestimo = null;
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
      return { ofertas: gerarOfertas(c, Math.min(3, Math.max(1, Math.round(emp.nOfertas * 0.6)) + somaTraco(c, "ofertasExtra") + (c.mod.ofertasExtra || 0))) };
    },
    titulo: () => "Janela de transferências",
    texto: (c, ctx) => `Seu empresário chegou com ${ctx.ofertas.length === 1 ? "uma proposta" : `${ctx.ofertas.length} propostas`}. Valor de mercado atual: ${formatarValor(valorMercado(ovrDe(c), c.idade, c.fama))}.`,
    opcoes: (c, ctx) => [
      ...ctx.ofertas.map((o) => ({
        id: `ir:${o.clube}`, label: `Assinar com o ${o.clube}`, dica: `${o.ligaNome} · você chegaria como ${o.status.toLowerCase()}`, oferta: o,
        efeito: (c) => { const de = transferir(c, o.clube); c.fama = clampR(c.fama + (o.forca > clubeDe(de).forca ? 4 : 0), 0, 100); return r(`Contrato assinado. Nova casa: ${o.clube}.`); },
      })),
      { id: "ficar", label: `Ficar no ${c.clubeNome}`, dica: "A torcida valoriza a lealdade",
        efeito: (c) => { c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 5, 0, 100); return r("Você recusou tudo e ficou. A arquibancada notou."); } },
    ],
  },
  {
    id: "renovacao", icone: "✍️",
    peso: (c) => (c.idade >= 19 && ["Titular", "Estrela do time"].includes(statusNoClube(c).label) && c.flags.blindado === 0 ? 2.5 : 0),
    titulo: (c) => `O ${c.clubeNome} quer renovar`,
    texto: () => "A diretoria oferece um contrato longo, com aumento. Assinar agora fecha a porta para o mercado por um tempo.",
    opcoes: () => [
      { id: "renovar", label: "Renovar por 4 anos", dica: "Torcida e técnico te abraçam · sem propostas por 2 temporadas",
        efeito: (c) => { c.flags.blindado = 2; c.torcida[c.clubeNome] = clampR((c.torcida[c.clubeNome] ?? 30) + 8, 0, 100); c.mod.shareAdd = (c.mod.shareAdd || 0) + 0.05; return r("Renovado. Você é um dos pilares do projeto."); } },
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
      return { destino: op.length ? pick(op) : null };
    },
    titulo: () => "A diretoria quer te emprestar",
    texto: (c, ctx) => (ctx.destino ? `O ${ctx.destino.nome} (${ligaDe(ctx.destino.liga).nome}) quer você por uma temporada, como titular.` : "Um clube menor quer você por uma temporada."),
    opcoes: (c, ctx) => [
      ...(ctx.destino ? [{ id: "ir", label: `Ir emprestado ao ${ctx.destino.nome}`, dica: "Joga muito por um ano e volta",
        efeito: (c) => { c.emprestimo = { destino: ctx.destino.nome }; c.torcida[ctx.destino.nome] = c.torcida[ctx.destino.nome] ?? 35; return r(`Um ano no ${ctx.destino.nome} para ganhar casca.`); } }] : []),
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
        efeito: (c) => { const de = transferir(c, ctx.ofertas[0].clube); c.torcida[de] = clampR((c.torcida[de] ?? 30) - 15, 0, 100); return r(`Saiu brigado, mas vai jogar: ${ctx.ofertas[0].clube}.`); } }] : []),
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
        efeito: (c) => { const de = transferir(c, ctx.rival, { torcidaInicial: 20 }); c.torcida[de] = 0; c.flags.traidor = [...(c.flags.traidor || []), de]; c.fama = clampR(c.fama + 8, 0, 100); return r(`Você cruzou a cidade. No ${de}, seu nome virou palavrão.`); } },
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
        efeito: (c) => { transferir(c, c.primeiroClube); c.torcida[c.primeiroClube] = clampR((c.torcida[c.primeiroClube] ?? 30) + 25, 0, 100); return r("O filho voltou para casa. Estádio cheio na reapresentação."); } },
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

/* Sorteia o evento da janela entre temporadas */
export function sortearEvento(c) {
  const recentes = (c.flags.historicoEventos || []).slice(-3);
  const cands = EVENTOS.map((e) => {
    if (e.id !== "propostas" && recentes.includes(e.id)) return null;
    const ctx = e.preparar ? e.preparar(c) : {};
    const p = e.peso(c, ctx);
    return p > 0 ? { e, ctx, p } : null;
  }).filter(Boolean);
  if (!cands.length) return null;
  const tot = cands.reduce((s, x) => s + x.p, 0);
  let roll = rnd() * tot;
  const escolhido = cands.find((x) => (roll -= x.p) <= 0) || cands[cands.length - 1];
  const { e, ctx } = escolhido;
  return {
    id: e.id, icone: e.icone, titulo: e.titulo(c, ctx), texto: e.texto(c, ctx),
    opcoes: e.opcoes(c, ctx).map(({ efeito, ...o }) => o), ctx,
  };
}

/* Aplica a escolha. Como funções não vão pro save, o evento é reconstruído pelo id + contexto. */
export function resolverEvento(c0, evento, opcaoId) {
  const c = clone(c0);
  c.mod = c.mod || {};
  const def = EVENTOS.find((e) => e.id === evento.id);
  const op = def?.opcoes(c, evento.ctx).find((o) => o.id === opcaoId);
  const resultado = op ? op.efeito(c) : "";
  c.flags.historicoEventos = [...(c.flags.historicoEventos || []), evento.id].slice(-8);
  const ultima = c.temporadas[c.temporadas.length - 1];
  if (ultima) ultima.decisao = { evento: evento.titulo, escolha: op?.label || "", resultado };
  return { c, resultado };
}

/* ---------- texto para compartilhar ---------- */
export function textoCompartilhar(c) {
  const L = c.legado || calcularLegado(c);
  const t = c.titulos;
  const linhas = [
    `💎 A JOIA — Modo Rápido`,
    `${c.nome} · ${posicaoDe(c.posicao).label} · ${nacDe(c.nac).label}`,
    `${L.nivel.icone} ${L.nivel.nome} (${L.pontos} pts)`,
    `⚽ ${c.totais.gols} gols · 🅰️ ${c.totais.assist} assist. · ${c.totais.jogos} jogos · OVR máx. ${c.picoOvr}`,
    `🏆 ${t.liga} ligas · ${t.copa} copas · ${t.continental} continentais · ${t.copaMundo} Copas do Mundo · ${t.bolaOuro} Bolas de Ouro`,
    `Clubes: ${[...new Set(c.temporadas.map((s) => s.clube))].join(" → ")}`,
  ];
  return linhas.join("\n");
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
    if (!s.c.mundo?.jogadores) s.c.mundo = mundoCompacto();
    return s;
  } catch { return null; }
}
export function apagarRapido() { try { localStorage.removeItem(CHAVE_SAVE_RAPIDO); } catch { /* sem armazenamento */ } }

/* ---------- simulação automática (testes e balanceamento) ---------- */
export function simularCarreiraAutomatica(dados, escolher = (op) => pick(op)) {
  let c = criarJogador(dados);
  let guard = 0;
  while (!c.aposentado && guard++ < 30) {
    let { c: c2, card, momento } = jogarTemporada(c);
    if (momento) card = aplicarMomento(card, chance(chancePenalti(c2)));
    ({ c } = fecharTemporada(c2, card));
    if (aposentadoriaForcada(c) || (podeAposentar(c) && c.idade >= 36 && chance(0.4))) { c = aposentar(c); break; }
    if (precisaEscolherTraco(c)) c = escolherTraco(c, pick(opcoesDeTraco(c)).id);
    const ev = sortearEvento(c);
    if (ev) ({ c } = resolverEvento(c, ev, escolher(ev.opcoes, ev).id));
  }
  if (!c.aposentado) c = aposentar(c);
  return c;
}
