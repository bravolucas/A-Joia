/* =====================================================================
   Taças do A JOIA — uma taça própria para cada competição.
   Todas são desenhos originais do jogo (nenhuma reproduz troféu real).
   Cada competição tem uma combinação fixa de forma, alças, metal, gema e
   faixas na base; o nome da competição decide a combinação, então a mesma
   competição sempre tem a mesma taça e competições diferentes têm taças
   diferentes. A gema da marca é a assinatura das maiores.
   Gera SVG em texto (viewBox 500x600); "__ID__" é trocado por um id único.
   ===================================================================== */

const W = 500, H = 600, CX = 250, BASE = 594;

const METAIS = {
  ouro: ["#5A3F00", "#9C7414", "#E8C35A", "#FFF0B5", "#F2CF6A", "#B88A1E", "#7A5A06", "#D9AE3E", "#FFE49A", "#8E6A0C", "#4A3300"],
  prata: ["#3A3F44", "#7D858D", "#C9CFD6", "#FFFFFF", "#DDE2E8", "#9AA2AA", "#5F666D", "#B9C0C8", "#F2F5F8", "#7A8188", "#2F3438"],
  bronze: ["#3A1E0A", "#7E4620", "#C9824D", "#FFD2A8", "#E39E68", "#A8622F", "#6B3A18", "#C27A44", "#F0B88A", "#7A4420", "#2E1708"],
  platina: ["#2E3436", "#6E7A7D", "#B8C6C9", "#F4FBFC", "#D3E0E2", "#8C9C9F", "#4D5A5D", "#A9B9BC", "#E6F2F3", "#687679", "#252B2D"],
};
const GEMAS = {
  esmeralda: ["#0B5E42", "#12A876", "#5FE0B0"],
  safira: ["#173F8F", "#2E6FE0", "#9CC0FF"],
  rubi: ["#7A1420", "#C9303F", "#FF9AA5"],
  ametista: ["#3E1A6E", "#7A45C9", "#C9A8FF"],
  topazio: ["#7A4A06", "#E39B1E", "#FFD58A"],
};
const LISTA_GEMAS = ["esmeralda", "safira", "rubi", "ametista", "topazio"];

/* cores da bandeira do país da competição, para as faixas da base */
const BANDEIRAS = {
  brasil: ["#009C3B", "#FFDF00"], inglaterra: ["#CF142B", "#FFFFFF"], espanha: ["#AA151B", "#F1BF00"],
  italia: ["#009246", "#CE2B37"], alemanha: ["#DD0000", "#FFCE00"], franca: ["#0055A4", "#EF4135"],
  portugal: ["#006600", "#FF0000"], arabia: ["#006C35", "#FFFFFF"], eua: ["#3C3B6E", "#B22234"],
};
const PAIS_POR_PALAVRA = [
  [/brasil|brasileir|paulist|carioca|mineir|gaúch|paranaens|baian|cearens|pernambuc|catarinens|goian|paraens|amazonens|alagoan|série b/i, "brasil"],
  [/premier|championship|fa cup|community shield|efl/i, "inglaterra"],
  [/la ?liga|laliga|copa del rey|supercopa de españa/i, "espanha"],
  [/serie a|serie b \(it|coppa|supercoppa/i, "italia"],
  [/bundesliga|dfb|alemanha/i, "alemanha"],
  [/ligue|coupe de france|trophée/i, "franca"],
  [/portugal|taça de portugal|supertaça/i, "portugal"],
  [/saudita|king's cup/i, "arabia"],
  [/mls|us open|campeones/i, "eua"],
];

/* desenhos fixos para as competições internacionais (garante que nenhuma se repita) */
const FIXAS = {
  "Brasileirão": { familia: "taca", forma: 4, alca: 0, metal: "ouro", gema: "esmeralda", gemaFrente: false, tampa: false, degraus: 2, base: "preta", faixas: ["#009C3B", "#FFDF00"] },
  "Brasileirão Série B": { familia: "taca", forma: 2, alca: 3, metal: "prata", gema: "esmeralda", tampa: false, degraus: 2, base: "preta", faixas: ["#009C3B", "#FFDF00"] },
  "Libertadores": { familia: "vaso", forma: 1, metal: "ouro", gema: "esmeralda", faixas: ["#12A876", "#E3B93B"] },
  "Copa Sul-Americana": { familia: "taca", forma: 4, alca: 5, metal: "prata", gema: "esmeralda", tampa: true },
  "Sul-Americana": { familia: "taca", forma: 4, alca: 5, metal: "prata", gema: "esmeralda", tampa: true },
  "Champions League": { familia: "vaso", forma: 0, metal: "ouro", gema: "safira", faixas: ["#2E6FE0", "#0E1512"] },
  "Europa League": { familia: "vaso", forma: 2, metal: "prata", gema: "topazio" },
  "Champions Asiática": { familia: "vaso", forma: 2, metal: "ouro", gema: "rubi", faixas: ["#C9303F", "#E3B93B"] },
  "Concacaf": { familia: "taca", forma: 3, alca: 2, metal: "ouro", gema: "safira", gemaFrente: true },
  "Concacaf Champions": { familia: "taca", forma: 3, alca: 2, metal: "ouro", gema: "safira", gemaFrente: true },
  "Copa América": { familia: "taca", forma: 2, alca: 2, metal: "ouro", gema: "safira", gemaFrente: true, degraus: 2 },
  "Eurocopa": { familia: "taca", forma: 4, alca: 4, metal: "ouro", gema: "ametista", tampa: true, degraus: 1 },
  "Copa Ouro": { familia: "taca", forma: 1, alca: 5, metal: "ouro", gema: "topazio", gemaFrente: true },
  "Copa Africana de Nações": { familia: "taca", forma: 4, alca: 0, metal: "ouro", gema: "esmeralda", gemaFrente: true, degraus: 2 },
  "Copa da Ásia": { familia: "vaso", forma: 2, metal: "platina", gema: "rubi" },
  "Copa das Nações da OFC": { familia: "taca", forma: 0, alca: 3, metal: "prata", gema: "safira", gemaFrente: true },
  "Copa do Mundo": { familia: "coroa", metal: "ouro", gema: "esmeralda", faixas: ["#12A876", "#2E6FE0"] },
  "Mundial de Clubes": { familia: "coroa", forma: 1, metal: "prata", gema: "safira", faixas: ["#2E6FE0"] },
};

/* desenho padrão de cada tipo (quando a competição não tem nome) */
const PADRAO = {
  liga: { familia: "taca", forma: 0, alca: 0, metal: "ouro", gema: "esmeralda", gemaFrente: true, degraus: 2 },
  copa: { familia: "taca", forma: 1, alca: 1, metal: "prata", base: "alta" },
  segunda: { familia: "taca", forma: 0, alca: 1, metal: "bronze", facetas: true },
  continental: FIXAS["Champions League"],
  continentalSelecao: FIXAS["Copa América"],
  copaMundo: FIXAS["Copa do Mundo"],
  mundial: FIXAS["Mundial de Clubes"],
};
const METAL_POR_TIPO = { liga: "ouro", continental: "ouro", mundial: "prata", copaMundo: "ouro", continentalSelecao: "ouro", copa: "prata", segunda: "bronze" };

function hash(txt) {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* parâmetros da taça de uma competição */
export function desenhoDaTaca(tipo = "liga", nome = null) {
  if (nome && FIXAS[nome]) return { ...FIXAS[nome] };
  // O motor do treinador usa nomes completos; resolva-os para a mesma taça
  // fixa da competição, evitando gerar uma taça aleatória para cada alias.
  const aliases = {
    'Copa Libertadores': 'Libertadores',
    'UEFA Champions League': 'Champions League',
    'CONMEBOL Libertadores': 'Libertadores',
    'Campeonato Brasileiro Série A': 'Brasileirão',
    'Campeonato Brasileiro Série B': 'Brasileirão Série B'
  };
  if (nome && aliases[nome] && FIXAS[aliases[nome]]) return { ...FIXAS[aliases[nome]] };
  if (!nome) return { ...(PADRAO[tipo] || PADRAO.liga) };
  const h = hash(`${tipo}:${nome}`);
  const pega = (n, desloc) => Math.floor(h / desloc) % n;
  const pais = (PAIS_POR_PALAVRA.find(([re]) => re.test(nome)) || [])[1];
  if (tipo === "copaMundo" || tipo === "mundial") return { ...PADRAO[tipo] };
  const familia = tipo === "continental" ? ["vaso", "taca"][pega(2, 7)] : "taca";
  return {
    familia,
    forma: pega(familia === "vaso" ? 3 : 5, 1),
    alca: pega(6, 5),
    metal: METAL_POR_TIPO[tipo] || "ouro",
    gema: LISTA_GEMAS[pega(5, 31)],
    gemaFrente: pega(2, 97) === 0,
    tampa: pega(4, 211) === 0,
    degraus: pega(3, 401),
    facetas: pega(2, 809) === 0,
    no: pega(3, 1601),
    base: pega(3, 3203) === 0 ? "marmore" : "preta",
    faixas: pais ? BANDEIRAS[pais] : null,
  };
}

/* ---------------- primitivas de desenho ---------------- */
const f1 = (n) => n.toFixed(1);
function grad(id, metal, x0, x1) {
  const cs = METAIS[metal] || METAIS.ouro;
  const st = cs.map((c, i) => `<stop offset="${(i / (cs.length - 1)).toFixed(3)}" stop-color="${c}"/>`).join("");
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f1(x0)}" y1="0" x2="${f1(x1)}" y2="0">${st}</linearGradient>`;
}
function suave(pts) {
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i > 0 ? i - 1 : i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d;
}
function torneado(perfil) {
  const dir = perfil.map(([r, y]) => [CX + r, y]);
  const esq = [...perfil].reverse().map(([r, y]) => [CX - r, y]);
  return `${suave(dir)} L${suave(esq).slice(1)} Z`;
}
function facetas(perfil, n, cor, op) {
  const y0 = perfil[0][1], y1 = perfil[perfil.length - 1][1];
  const larg = Math.max(...perfil.map((p) => p[0]));
  let s = "";
  for (let i = 1; i < n; i++) { const k = (i / n) * 2 - 1; s += `<line x1="${f1(CX + larg * k)}" y1="${y0}" x2="${f1(CX + larg * k * 0.4)}" y2="${y1}" stroke="${cor}" stroke-opacity="${op}" stroke-width="2"/>`; }
  return s;
}

function criarDesenhista(pfx) {
  let n = 0;
  const novoId = (t) => `${pfx}${t}${n++}`;
  const corpo = (metal, perfil, extra = "") => {
    const id = novoId("c");
    const larg = Math.max(...perfil.map((p) => p[0]));
    const y0 = perfil[0][1], y1 = perfil[perfil.length - 1][1];
    const d = torneado(perfil);
    return `<defs>${grad(id, metal, CX - larg, CX + larg)}<clipPath id="${id}k"><path d="${d}"/></clipPath></defs>`
      + `<path d="${d}" fill="url(#${id})"/>`
      + `<g clip-path="url(#${id}k)"><rect x="${f1(CX - larg * 0.52)}" y="${y0}" width="${f1(larg * 0.13)}" height="${y1 - y0}" fill="#FFF" opacity=".38"/>`
      + `<rect x="${f1(CX + larg * 0.48)}" y="${y0}" width="${f1(larg * 0.08)}" height="${y1 - y0}" fill="#FFF" opacity=".16"/>${extra}</g>`;
  };
  const borda = (y, r, metal, alt = 10) => {
    const id = novoId("b");
    return `<defs>${grad(id, metal, CX - r, CX + r)}</defs><ellipse cx="${CX}" cy="${y}" rx="${f1(r)}" ry="${alt}" fill="url(#${id})"/>`
      + `<ellipse cx="${CX}" cy="${y - 1}" rx="${f1(r * 0.92)}" ry="${f1(alt * 0.55)}" fill="#000" opacity=".35"/>`;
  };
  const alca = (lado, pts, metal, esp = 13) => {
    const id = novoId("a");
    const P = pts.map(([x, y]) => [CX + lado * x, y]);
    const xs = P.map((p) => p[0]);
    const d = suave(P);
    return `<defs>${grad(id, metal, Math.min(...xs) - esp, Math.max(...xs) + esp)}</defs>`
      + `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${esp + 3}" stroke-linecap="round"/>`
      + `<path d="${d}" fill="none" stroke="url(#${id})" stroke-width="${esp}" stroke-linecap="round"/>`
      + `<path d="${d}" fill="none" stroke="#FFF" stroke-opacity=".45" stroke-width="${f1(Math.max(2, esp * 0.22))}" stroke-linecap="round" transform="translate(${f1(-lado * esp * 0.18)},${f1(-esp * 0.12)})"/>`;
  };
  const folha = (lado, pts, metal) => {
    const id = novoId("f");
    const P = pts.map(([x, y]) => [CX + lado * x, y]);
    const xs = P.map((p) => p[0]);
    return `<defs>${grad(id, metal, Math.min(...xs), Math.max(...xs))}</defs><path d="${suave(P)} Z" fill="url(#${id})" stroke="#000" stroke-opacity=".3" stroke-width="2"/>`
      + `<path d="${suave(P.slice(0, 3))}" fill="none" stroke="#FFF" stroke-opacity=".4" stroke-width="3"/>`;
  };
  const gema = (cx, cy, r, cor) => {
    const id = novoId("g");
    const [esc, med, luz] = GEMAS[cor] || GEMAS.esmeralda;
    const t = r * 0.62, topo = cy - r * 0.55, cint = cy - r * 0.12, ponta = cy + r * 0.95;
    const P = (x, y) => `${f1(x)},${f1(y)}`;
    return `<defs><radialGradient id="${id}" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="${luz}"/><stop offset="1" stop-color="${med}"/></radialGradient></defs>`
      + `<polygon points="${P(cx - t, topo)} ${P(cx + t, topo)} ${P(cx + r, cint)} ${P(cx, ponta)} ${P(cx - r, cint)}" fill="${esc}" stroke="#0E1512" stroke-width="${f1(r * 0.06)}" stroke-linejoin="round"/>`
      + `<polygon points="${P(cx - t, topo)} ${P(cx + t, topo)} ${P(cx + t * 0.55, cint)} ${P(cx - t * 0.55, cint)}" fill="url(#${id})"/>`
      + `<polygon points="${P(cx - t, topo)} ${P(cx - t * 0.55, cint)} ${P(cx - r, cint)}" fill="${luz}" opacity=".75"/>`
      + `<polygon points="${P(cx + t, topo)} ${P(cx + r, cint)} ${P(cx + t * 0.55, cint)}" fill="${med}"/>`
      + `<polygon points="${P(cx - r, cint)} ${P(cx - t * 0.55, cint)} ${P(cx, ponta)}" fill="${med}"/>`
      + `<polygon points="${P(cx - t * 0.55, cint)} ${P(cx + t * 0.55, cint)} ${P(cx, ponta)}" fill="${esc}" opacity=".9"/>`
      + `<polygon points="${P(cx + t * 0.55, cint)} ${P(cx + r, cint)} ${P(cx, ponta)}" fill="#05140E" opacity=".45"/>`
      + `<polygon points="${P(cx - t * 0.7, topo + r * 0.06)} ${P(cx - t * 0.15, topo + r * 0.06)} ${P(cx - t * 0.4, cint - r * 0.05)}" fill="#FFF" opacity=".55"/>`;
  };
  const basePedestal = (topo, larg, alt, metal, tipo = "preta", placa = true, faixas = null) => {
    const y = BASE - alt;
    const id = novoId("p");
    const marmore = tipo === "marmore";
    const cores = marmore ? [["0", "#F2F4F2"], [".5", "#D9DEDB"], ["1", "#AEB6B2"]] : [["0", "#2C3431"], [".08", "#141A18"], [".9", "#0A0E0C"], ["1", "#050706"]];
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${cores.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient></defs>`
      + `<path d="M${CX - topo},${y} L${CX + topo},${y} L${CX + larg},${BASE - 8} Q${CX + larg},${BASE} ${CX + larg - 8},${BASE} L${CX - larg + 8},${BASE} Q${CX - larg},${BASE} ${CX - larg},${BASE - 8} Z" fill="url(#${id})"/>`;
    if (marmore) s += `<path d="M${CX - topo + 20},${y + 10} q40,${alt * 0.3} 90,${alt * 0.2} t70,${alt * 0.45}" fill="none" stroke="#8E9894" stroke-opacity=".5" stroke-width="2"/>`;
    else s += `<rect x="${CX - topo}" y="${y}" width="${topo * 2}" height="3" fill="#3E4744"/>`;
    if (faixas) faixas.forEach((c, i) => { s += `<rect x="${CX - topo - 4 - i * 2}" y="${f1(y + alt * (0.2 + i * 0.22))}" width="${topo * 2 + 8 + i * 4}" height="${f1(alt * 0.12)}" fill="${c}"/>`; });
    else if (placa) {
      const ip = novoId("q");
      s += `<defs>${grad(ip, metal, CX - topo * 0.6, CX + topo * 0.6)}</defs><rect x="${f1(CX - topo * 0.55)}" y="${f1(y + alt * 0.32)}" width="${f1(topo * 1.1)}" height="${f1(alt * 0.34)}" rx="3" fill="url(#${ip})" stroke="#000" stroke-opacity=".35"/>`;
    }
    return s;
  };
  const degraus = (yTopo, larguras, metal, alt = 16) => {
    let s = "", y = yTopo;
    larguras.forEach((r) => {
      const id = novoId("d");
      s += `<defs>${grad(id, metal, CX - r, CX + r)}</defs><rect x="${CX - r}" y="${y}" width="${r * 2}" height="${alt}" rx="4" fill="url(#${id})"/>`
        + `<rect x="${CX - r}" y="${y}" width="${r * 2}" height="2.5" fill="#FFF" opacity=".35"/>`;
      y += alt;
    });
    return s;
  };
  return { corpo, borda, alca, folha, gema, basePedestal, degraus, novoId };
}

/* ---------------- famílias ---------------- */

/* bojos (perfil direito, de cima para baixo) — terminam na altura do nó */
const BOJOS = [
  [[148, 80], [144, 130], [126, 196], [92, 250], [40, 288], [26, 296]],                 // clássico redondo
  [[174, 100], [170, 146], [148, 200], [106, 244], [52, 270], [26, 278]],               // largo e raso
  [[146, 90], [136, 120], [104, 176], [62, 236], [26, 280]],                            // cônico lapidado
  [[118, 74], [128, 112], [124, 170], [100, 230], [60, 276], [26, 292]],                // tulipa alta
  [[106, 92], [140, 116], [148, 164], [130, 222], [80, 268], [28, 292]],                // urna com ombro
];
/* alças: lista de pontos (lado direito), relativa ao topo do bojo */
const ALCAS = [
  (t) => [[[t.r - 12, t.y + 36], [t.r + 48, t.y + 36], [t.r + 64, t.y + 90], [t.r + 30, t.y + 152], [t.r - 44, t.y + 182]]],    // orelhas clássicas
  (t) => [[[t.r - 18, t.y + 32], [t.r + 44, t.y + 44], [t.r + 48, t.y + 98], [t.r, t.y + 138]]],                                  // laço baixo
  (t) => [[[t.r - 16, t.y + 14], [t.r + 50, t.y - 12], [t.r + 88, t.y + 24], [t.r + 64, t.y + 90], [t.r - 30, t.y + 130]]],      // asa
  (t) => [[[t.r - 8, t.y + 20], [t.r + 30, t.y - 30], [t.r + 40, t.y + 60], [t.r + 10, t.y + 170], [t.r - 60, t.y + 196]]],      // alta e fina
  () => [],                                                                                                                        // sem alças
  (t) => [[[t.r - 6, t.y + 30], [t.r + 30, t.y + 22], [t.r + 40, t.y + 54], [t.r + 18, t.y + 80], [t.r - 10, t.y + 70]],
          [[t.r - 20, t.y + 96], [t.r + 18, t.y + 92], [t.r + 26, t.y + 122], [t.r + 4, t.y + 144], [t.r - 26, t.y + 134]]],      // dois anéis
];

function familiaTaca(D, p) {
  const metal = p.metal;
  const bojo = BOJOS[p.forma % BOJOS.length];
  const topo = { r: bojo[0][0], y: bojo[0][1] };
  const yNo = bojo[bojo.length - 1][1];
  const altBase = p.base === "alta" ? 96 : 70;
  const nDeg = p.degraus ?? 0;
  const yPe = BASE - altBase - nDeg * 16;
  let s = D.basePedestal(104, 120, altBase, metal, p.base === "marmore" ? "marmore" : "preta", true, p.faixas);
  if (nDeg) s += D.degraus(yPe, [80, 92].slice(2 - nDeg), metal);
  const linhas = ALCAS[(p.alca ?? 0) % ALCAS.length](topo);
  [1, -1].forEach((l) => linhas.forEach((pts) => { s += D.alca(l, pts, metal, pts.length > 4 ? 13 : 14); }));
  // haste com nó
  const meio = (yNo + yPe) / 2 - 10;
  s += D.corpo(metal, [[15, yNo + 4], [13, meio], [15, yPe - 70]]);
  s += D.corpo(metal, [[26, yPe - 72], [46, yPe - 44], [78, yPe]]);
  s += D.borda(yPe - 72, 30, metal, 5);
  const no = p.no ?? 0;
  if (no === 0) { const id = D.novoId("n"); s += `<defs>${grad(id, metal, CX - 30, CX + 30)}</defs><ellipse cx="${CX}" cy="${meio}" rx="30" ry="16" fill="url(#${id})"/><ellipse cx="${CX}" cy="${meio - 6}" rx="22" ry="4" fill="#FFF" opacity=".35"/>`; }
  if (no === 1) { s += D.borda(meio - 12, 26, metal, 6) + D.borda(meio + 12, 26, metal, 6); }
  // bojo
  const extra = (p.facetas || p.forma === 2) ? facetas(bojo, 8, "#000", 0.2) + facetas(bojo, 8, "#FFF", 0.1) : "";
  s += D.corpo(metal, bojo, extra);
  s += D.borda(yNo, bojo[bojo.length - 1][0] + 6, metal, 6);
  s += D.borda(topo.y, topo.r, metal, 14);
  if (topo.r > 160) s += `<rect x="${CX - topo.r + 18}" y="${topo.y + 50}" width="${(topo.r - 18) * 2}" height="5" fill="#FFF" opacity=".25"/>`;
  if (p.tampa) {
    s += D.corpo(metal, [[topo.r * 0.2, topo.y - 70], [topo.r * 0.55, topo.y - 40], [topo.r * 0.85, topo.y - 14], [topo.r * 0.95, topo.y - 2]]);
    s += D.gema(CX, topo.y - 96, 30, p.gema);
  }
  if (p.gemaFrente && !p.tampa) s += D.gema(CX, topo.y + (bojo[2][1] - topo.y) * 0.9, Math.min(46, topo.r * 0.3), p.gema);
  return s;
}

const VASOS = [
  [[98, 118], [104, 150], [92, 230], [70, 304], [48, 364], [30, 404], [24, 412]],      // trompete esguio
  [[54, 112], [92, 150], [118, 214], [114, 290], [82, 350], [40, 392], [24, 412]],      // ânfora
  [[64, 176], [122, 206], [140, 262], [122, 330], [74, 384], [32, 408], [24, 412]],     // globo baixo
];
function familiaVaso(D, p) {
  const metal = p.metal;
  const vaso = VASOS[(p.forma ?? 0) % VASOS.length];
  let s = D.basePedestal(96, 112, 70, metal, "preta", !p.faixas, p.faixas);
  s += D.degraus(BASE - 70 - 32, [78, 90], metal);
  if ((p.forma ?? 0) === 1) [1, -1].forEach((l) => { s += D.alca(l, [[100, 168], [140, 176], [150, 214], [132, 250], [108, 254]], metal, 12); });
  s += D.corpo(metal, [[26, 412], [34, 436], [52, 464], [66, 492]]);
  const nFac = (p.forma ?? 0) === 2 ? 4 : 8;
  s += D.corpo(metal, vaso, facetas(vaso, nFac, "#000", 0.22) + facetas(vaso, nFac, "#FFF", 0.12));
  const aro = D.novoId("r");
  const ra = vaso[0][0] + 2;
  s += `<defs>${grad(aro, metal, CX - ra, CX + ra)}</defs><rect x="${CX - ra}" y="${vaso[0][1] - 12}" width="${ra * 2}" height="18" rx="7" fill="url(#${aro})"/>`;
  s += D.borda(412, 36, metal, 9);
  s += D.gema(CX, vaso[0][1] - 54, (p.forma ?? 0) === 2 ? 58 : 46, p.gema);
  return s;
}

function familiaCoroa(D, p) {
  const metal = p.metal;
  const alt = (p.forma ?? 0) === 1;
  let s = D.basePedestal(84, 104, 66, metal, "preta", false, null);
  (p.faixas || []).forEach((c, i) => { s += `<rect x="${CX - 86}" y="${BASE - 66 + 18 + i * 22}" width="172" height="7" fill="${c}"/>`; });
  const y0 = alt ? 270 : 250;
  const coluna = alt
    ? [[56, y0], [38, 320], [32, 380], [42, 440], [64, 494], [84, BASE - 66]]
    : [[60, y0], [40, 300], [34, 360], [44, 430], [66, 490], [84, BASE - 66]];
  s += D.corpo(metal, coluna, facetas(coluna, 6, "#000", 0.22) + facetas(coluna, 6, "#FFF", 0.14));
  const yb = y0 + 12, larg = alt ? 150 : 170;
  [1, -1].forEach((l) => {
    s += D.folha(l, [[4, yb], [larg * 0.55, yb - 30], [larg, yb - 100], [larg * 0.86, yb - 150], [larg * 0.5, yb - 72], [2, yb - 20]], metal);
    s += D.folha(l, [[2, yb + 4], [larg * 0.3, yb - 26], [larg * 0.52, yb - 96], [larg * 0.36, yb - 132], [larg * 0.18, yb - 60], [1, yb - 14]], metal);
  });
  s += D.gema(CX, yb - 120, alt ? 70 : 78, p.gema);
  return s;
}

const cache = new Map();
/* SVG completo (texto) da taça; "__ID__" deve ser trocado por um prefixo único */
export function svgDaTaca(tipo = "liga", nome = null) {
  const chave = `${tipo}|${nome || ""}`;
  if (cache.has(chave)) return cache.get(chave);
  const p = desenhoDaTaca(tipo, nome);
  const D = criarDesenhista("__ID__");
  let corpo = p.familia === "coroa" ? familiaCoroa(D, p) : p.familia === "vaso" ? familiaVaso(D, p) : familiaTaca(D, p);
  // taças com tampa e gema no alto: encolhe a partir da base para caber no quadro
  if (p.familia === "taca" && p.tampa) corpo = `<g transform="translate(${CX},${BASE}) scale(.8) translate(${-CX},${-BASE})">${corpo}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%">${corpo}</svg>`;
  cache.set(chave, svg);
  return svg;
}
export const metalDaTaca = (tipo, nome) => desenhoDaTaca(tipo, nome).metal;

/* "Campeão do Brasileirão", "Copa do Mundo (Brasil)", "Libertadores 2031" → { tipo, nome } */
export function competicaoDoTitulo(texto = "") {
  const nome = texto.replace(/^Campe[ãa]o (d[oa]s?|de) /i, "").replace(/\s*\(.*\)\s*$/, "").replace(/\s+\d{4}(\/\d{2,4})?$/, "").trim();
  const n = nome.toLowerCase();
  let tipo = "liga";
  if (/copa do mundo/.test(n)) tipo = "copaMundo";
  else if (/mundial/.test(n)) tipo = "mundial";
  else if (/copa américa|eurocopa|copa ouro|africana|copa da ásia|ofc/.test(n)) tipo = "continentalSelecao";
  else if (/série b|serie b|championship|laliga 2|bundesliga 2|2\. bundesliga|ligue 2|portugal 2/.test(n)) tipo = "segunda";
  else if (/libertadores|champions league|sul-americana|concacaf|europa league|conference/.test(n)) tipo = "continental";
  else if (/copa|cup|coppa|pokal|coupe|taça|supercopa|supertaça|shield|trophée/.test(n)) tipo = "copa";
  return { tipo, nome };
}
