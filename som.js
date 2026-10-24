/* Sons do jogo. Efeitos de interface: Kenney "Interface Sounds" (CC0, arte/sons/).
   Apito e torcida são sintetizados na hora (Web Audio), sem arquivo.
   Tudo começa só depois de um toque (regra dos navegadores) e respeita o botão de som. */
const ARQ = Object.fromEntries(Object.entries(import.meta.glob("./arte/sons/*.mp3", { eager: true, query: "?url", import: "default" }))
  .map(([k, v]) => [k.split("/").pop().replace(/\.mp3$/, ""), v]));
const CHAVE = "ajoia_som_v1";
let ctx = null;
const buffers = {};
export const somLigado = () => { try { return localStorage.getItem(CHAVE) !== "0"; } catch { return true; } };
export const alternarSom = () => { const novo = !somLigado(); try { localStorage.setItem(CHAVE, novo ? "1" : "0"); } catch { /* sem storage */ } return novo; };
function audio() {
  if (!somLigado()) return null;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
}
async function carregar(nome) {
  if (buffers[nome]) return buffers[nome];
  const a = audio(); if (!a || !ARQ[nome]) return null;
  const dados = await (await fetch(ARQ[nome])).arrayBuffer();
  buffers[nome] = await a.decodeAudioData(dados);
  return buffers[nome];
}
export async function tocar(nome, volume = 0.5) {
  try {
    const a = audio(); if (!a) return;
    const b = await carregar(nome); if (!b) return;
    const s = a.createBufferSource(); const g = a.createGain();
    g.gain.value = volume; s.buffer = b; s.connect(g).connect(a.destination); s.start();
  } catch { /* sem áudio */ }
}
/* apito de árbitro: dois tons agudos com trinado */
export function apito(vezes = 1) {
  const a = audio(); if (!a) return;
  for (let i = 0; i < vezes; i++) {
    const t0 = a.currentTime + i * 0.42, dur = i === vezes - 1 && vezes > 1 ? 0.6 : 0.3;
    const g = a.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.12, t0 + 0.02); g.gain.setValueAtTime(0.12, t0 + dur - 0.05); g.gain.linearRampToValueAtTime(0, t0 + dur);
    const trinado = a.createGain(); trinado.gain.value = 0.5;
    const lfo = a.createOscillator(); lfo.frequency.value = 32; const lfoG = a.createGain(); lfoG.gain.value = 0.5; lfo.connect(lfoG).connect(trinado.gain);
    [2850, 3020].forEach((f) => { const o = a.createOscillator(); o.type = "sine"; o.frequency.value = f; o.connect(trinado); o.start(t0); o.stop(t0 + dur); });
    trinado.connect(g).connect(a.destination); lfo.start(t0); lfo.stop(t0 + dur);
  }
}
/* torcida: ruído filtrado que cresce e some */
export function torcida(dur = 2.4, forca = 0.18) {
  const a = audio(); if (!a) return;
  const n = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
  let ult = 0; for (let i = 0; i < n; i++) { ult = (ult + (Math.random() * 2 - 1) * 0.08) * 0.985; d[i] = ult * 6 + (Math.random() * 2 - 1) * 0.15; }
  const s = a.createBufferSource(); s.buffer = buf;
  const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.6;
  const g = a.createGain(); const t0 = a.currentTime;
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(forca, t0 + dur * 0.25); g.gain.setValueAtTime(forca, t0 + dur * 0.55); g.gain.linearRampToValueAtTime(0, t0 + dur);
  s.connect(f).connect(g).connect(a.destination); s.start(t0);
}
