import React, { useEffect, useState } from "react";
import { POSICOES, NACIONALIDADES, PERSONALIDADES, EMPRESARIOS } from "./data.js";
import { Gema } from "./components.jsx";
import {
  criarJogador, jogarTemporada, aplicarMomento, fecharTemporada, sortearEvento, resolverEvento,
  precisaEscolherTraco, opcoesDeTraco, escolherTraco, tracoDe, podeAposentar, aposentadoriaForcada, aposentar,
  calcularLegado, NIVEIS_LEGADO, statusNoClube, valorMercado, formatarValor, ovrDe, clubeDe, ligaDe, posicaoDe, nacDe, personaDe,
  textoCompartilhar, salvarRapido, carregarRapido, apagarRapido, NACS_DESTAQUE, IDADES_TRACO, anoDeCopa, chancePenalti,
} from "./rapido.js";

/* Estilo compartilhado pelo seletor de modos e pelo Modo Rápido
   (o Modo Carreira injeta o dele; aqui é só o necessário). */
export const ESTILO_BASE = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Oswald:wght@500;600;700&family=Unbounded:wght@700;900&display=swap');
.rp{min-height:100vh;background:#0E1512;color:#E1E6E3;font-family:'Rajdhani',ui-sans-serif,system-ui,sans-serif;}
.rp .display{font-family:'Unbounded',sans-serif;}
.rp .font-stat{font-family:'Oswald',sans-serif;}
.rp-painel{background:rgba(19,26,23,0.72);border:1px solid rgba(255,255,255,0.08);border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,0.35);}
.rp-btn{transition:transform .2s ease,box-shadow .2s ease,background .2s ease;border-radius:14px;font-weight:700;min-height:48px;}
.rp-btn:hover{transform:translateY(-1px);} .rp-btn:active{transform:scale(.98);}
.rp-btn:disabled{opacity:.4;transform:none;cursor:not-allowed;}
.rp-prim{background:#12A876;color:#06110C;} .rp-prim:hover{background:#18BB85;box-shadow:0 0 18px rgba(18,168,118,.45);}
.rp-ouro{background:linear-gradient(90deg,#D8B44A,#F5D77A);color:#1A1405;}
.rp-sec{background:rgba(19,29,25,.8);border:1px solid #2A3A33;color:#F2F5F3;} .rp-sec:hover{border-color:#12A876;}
.rp-opcao{background:rgba(19,29,25,.8);border:1px solid #2A3A33;border-radius:14px;text-align:left;transition:all .2s ease;}
.rp-opcao:hover{border-color:#12A876;background:rgba(18,168,118,.08);}
.rp-opcao.sel{border-color:#12A876;background:rgba(18,168,118,.14);box-shadow:0 0 0 1px #12A876 inset;}
.rp-entra{animation:rpEntra .35s ease-out both;}
@keyframes rpEntra{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes rpBrilho{0%,100%{box-shadow:0 0 18px rgba(216,180,74,.25)}50%{box-shadow:0 0 38px rgba(216,180,74,.55)}}
.rp-carta{animation:rpBrilho 3s ease-in-out infinite;}
.rp-goleiro{transition:transform .45s cubic-bezier(.2,.8,.2,1);}
.rp-bola{transition:transform .5s cubic-bezier(.2,.8,.2,1);}
`;

const ATTR_LABEL = { velocidade: "VEL", finalizacao: "FIN", passe: "PAS", drible: "DRI", defesa: "DEF", fisico: "FIS" };
const ICONE_TITULO = { liga: "🏆", copa: "🥇", continental: "🌟", copaMundo: "🌍", bolaOuro: "⚽", segunda: "📈" };

function Barra({ valor, cor = "#12A876" }) {
  return (
    <div className="h-1.5 rounded-full bg-[#222926] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, valor))}%`, background: cor, transition: "width .8s ease" }} />
    </div>
  );
}

function Escudo({ cor = "#12A876", size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2 L28 6 V15 C28 22 22.5 27.5 16 30 C9.5 27.5 4 22 4 15 V6 Z" fill={cor} stroke="rgba(255,255,255,.35)" strokeWidth="1.5" />
      <path d="M16 8 L22 10 V15 C22 19 19.5 22 16 23.5 C12.5 22 10 19 10 15 V10 Z" fill="rgba(255,255,255,.18)" />
    </svg>
  );
}

/* Linha do tempo da carreira: um segmento por temporada, na cor do clube */
function LinhaDoTempo({ c, total = 22 }) {
  const ts = c.temporadas;
  return (
    <div className="flex gap-[3px]" aria-label={`${ts.length} temporadas jogadas`}>
      {Array.from({ length: Math.max(total, ts.length + 1) }).map((_, i) => {
        const t = ts[i];
        const titulo = t?.titulos?.length;
        return (
          <div key={i} className="flex-1 h-2 rounded-sm relative" title={t ? `${t.ano} · ${t.clube}` : ""}
            style={{ background: t ? t.cor || "#12A876" : i === ts.length ? "rgba(18,168,118,.35)" : "#1A211E", opacity: t ? 0.9 : 1 }}>
            {titulo ? <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D8B44A]" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Cabecalho({ c, onSair }) {
  return (
    <header className="sticky top-0 z-20 bg-[#0E1512]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={onSair} className="flex items-center gap-2 min-h-[44px] pr-2" aria-label="Voltar ao menu">
          <Gema size={26} />
          <span className="display text-[11px] tracking-[0.2em] text-[#F2F5F3]">A JOIA</span>
        </button>
        <span className="font-semibold text-xs uppercase tracking-[0.2em] text-[#8FA39A]">Modo Rápido</span>
        {c && (
          <span className="ml-auto font-stat text-sm text-[#C9D3CE]">
            {c.ano} · {c.idade} anos
          </span>
        )}
      </div>
      {c && <div className="max-w-xl mx-auto px-4 pb-2"><LinhaDoTempo c={c} /></div>}
    </header>
  );
}

/* Ficha compacta do atleta, presente na tela de jogar e nos eventos */
function Ficha({ c }) {
  const ovr = ovrDe(c);
  const clube = clubeDe(c.emprestimo?.destino || c.clubeNome);
  const st = statusNoClube(c, clube.nome);
  const torcida = c.torcida[clube.nome] ?? 30;
  return (
    <div className="rp-painel p-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-[#131A17] border border-[#D8B44A]/40">
          <span className="font-stat text-2xl font-bold text-[#EBC557] leading-none">{ovr}</span>
          <span className="text-[10px] font-bold tracking-widest text-[#8FA39A]">{c.posicao}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="display text-sm text-[#F2F5F3] truncate">{c.nome}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[15px] font-semibold text-[#C9D3CE]">
            <Escudo cor={clube.cor} size={18} />
            <span className="truncate">{clube.nome}{c.emprestimo ? " (empréstimo)" : ""}</span>
          </div>
          <div className="text-[13px] text-[#8FA39A]">{ligaDe(clube.liga).nome} · {st.label}</div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 mt-4">
        {Object.keys(ATTR_LABEL).map((a) => (
          <div key={a} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-wider text-[#8FA39A]">{ATTR_LABEL[a]}</span>
            <span className="font-stat text-[15px] text-[#F2F5F3] leading-none">{c.attrs[a]}</span>
            <Barra valor={(c.attrs[a] - 40) * 1.7} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="rounded-xl bg-[#131A17] py-2"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">VALOR</div><div className="font-stat text-sm">{formatarValor(valorMercado(ovr, c.idade, c.fama))}</div></div>
        <div className="rounded-xl bg-[#131A17] py-2"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">TORCIDA</div><div className="font-stat text-sm">{torcida}/100</div></div>
        <div className="rounded-xl bg-[#131A17] py-2"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">FAMA</div><div className="font-stat text-sm">{c.fama}/100</div></div>
      </div>
      {c.tracos.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {c.tracos.map((id) => { const t = tracoDe(id); return t ? <span key={id} className="text-[13px] font-semibold px-2 py-1 rounded-lg bg-[#D8B44A]/12 text-[#EBC557] border border-[#D8B44A]/30">{t.icone} {t.nome}</span> : null; })}
        </div>
      )}
    </div>
  );
}

/* ---------- criação ---------- */
function TelaCriacao({ onCriar }) {
  const [nome, setNome] = useState("");
  const [nac, setNac] = useState("BRA");
  const [posicao, setPosicao] = useState("");
  const [personalidade, setPersonalidade] = useState("");
  const [gerando, setGerando] = useState(false);
  const destaque = NACS_DESTAQUE.map((id) => NACIONALIDADES.find((n) => n.id === id)).filter(Boolean);
  const outras = NACIONALIDADES.filter((n) => !NACS_DESTAQUE.includes(n.id)).sort((a, b) => a.label.localeCompare(b.label));
  const pronto = nome.trim().length >= 2 && posicao && personalidade;

  const comecar = () => {
    setGerando(true);
    // dá tempo de a tela mostrar o carregamento antes de gerar o mundo
    setTimeout(() => onCriar({ nome, nac, posicao, personalidade }), 30);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 rp-entra">
      <div>
        <h1 className="display text-xl text-[#F2F5F3]">Crie seu atleta</h1>
        <p className="text-[17px] text-[#8FA39A] mt-1">Você começa aos 16 anos na base de um clube modesto. Cada temporada é uma tela.</p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Nome</span>
        <input value={nome} onChange={(e) => setNome(e.target.value.slice(0, 24))} placeholder="Como a torcida vai te chamar"
          className="rp-painel px-4 min-h-[52px] text-lg text-[#F2F5F3] placeholder:text-[#5E7068] outline-none focus:border-[#12A876]" />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Nacionalidade</span>
        <select value={nac} onChange={(e) => setNac(e.target.value)} className="rp-painel px-4 min-h-[52px] text-lg text-[#F2F5F3] outline-none">
          <optgroup label="Principais">{destaque.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}</optgroup>
          <optgroup label="Todas">{outras.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}</optgroup>
        </select>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Posição</span>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {POSICOES.map((p) => (
            <button key={p.id} onClick={() => setPosicao(p.id)} className={`rp-opcao px-3 py-2 min-h-[56px] ${posicao === p.id ? "sel" : ""}`}>
              <div className="font-stat text-base text-[#F2F5F3]">{p.id}</div>
              <div className="text-[12px] leading-tight text-[#8FA39A]">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Personalidade</span>
        <div className="grid sm:grid-cols-2 gap-2">
          {PERSONALIDADES.map((p) => (
            <button key={p.id} onClick={() => setPersonalidade(p.id)} className={`rp-opcao px-4 py-3 ${personalidade === p.id ? "sel" : ""}`}>
              <div className="font-bold text-[16px] text-[#F2F5F3]">{p.icone} {p.label}</div>
              <div className="text-[14px] leading-snug text-[#8FA39A] mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button disabled={!pronto || gerando} onClick={comecar} className="rp-btn rp-prim display text-sm tracking-wide">
        {gerando ? "Montando o mundo do futebol…" : "Começar carreira"}
      </button>
    </div>
  );
}

/* ---------- pênalti decisivo ---------- */
const ZONAS = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]; // [coluna, linha]
function TelaPenalti({ c, momento, onFim }) {
  const [escolha, setEscolha] = useState(null);
  const [res, setRes] = useState(null);

  const chutar = (i) => {
    if (escolha != null) return;
    const [col, lin] = ZONAS[i];
    const pesoCol = [0.4, 0.2, 0.4];
    const r = Math.random();
    const gCol = r < pesoCol[0] ? 0 : r < pesoCol[0] + pesoCol[1] ? 1 : 2;
    const gLin = Math.random() < 0.55 ? 1 : 0;
    const bonus = (c.tracos || []).includes("decisao") ? 0.12 : 0;
    const fin = c.attrs.finalizacao;
    let resultado = "gol";
    if (lin === 0 && Math.random() < Math.max(0.04, 0.2 - (fin - 60) * 0.005)) resultado = "fora";
    else if (gCol === col) {
      const pDef = (gLin === lin ? 0.8 : 0.45) - bonus - (fin - 70) * 0.004;
      if (Math.random() < pDef) resultado = "defesa";
    }
    setEscolha(i);
    setRes({ resultado, goleiro: [gCol, gLin] });
  };

  useEffect(() => {
    if (!res) return undefined;
    const t = setTimeout(() => onFim(res.resultado === "gol"), 2200);
    return () => clearTimeout(t);
  }, [res, onFim]);

  // geometria do gol (viewBox 300x170)
  const zx = (col) => 60 + col * 90, zy = (lin) => 52 + lin * 58;
  const gx = res ? (res.goleiro[0] - 1) * 82 : 0, gy = res ? (res.goleiro[1] === 0 ? -22 : 6) : 0;
  const gRot = res ? (res.goleiro[0] - 1) * 55 : 0;
  const bola = escolha != null ? ZONAS[escolha] : null;
  const fora = res?.resultado === "fora";

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#EBC557]">Momento decisivo</div>
        <h2 className="display text-lg text-[#F2F5F3] mt-2">{momento.titulo}</h2>
        <p className="text-[17px] text-[#8FA39A] mt-1">{momento.texto}</p>
      </div>
      <div className="rp-painel p-3 overflow-hidden" style={{ background: "linear-gradient(#0F2A1F, #0B1F17)" }}>
        <svg viewBox="0 0 300 200" className="w-full" role="img" aria-label="Gol: escolha onde bater">
          <rect x="0" y="150" width="300" height="50" fill="#14432F" />
          <rect x="15" y="20" width="270" height="132" fill="rgba(255,255,255,.04)" stroke="#F2F5F3" strokeWidth="5" />
          {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={15 + i * 22.5} y1="20" x2={15 + i * 22.5} y2="152" stroke="rgba(255,255,255,.08)" />)}
          {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="15" y1={20 + i * 22} x2="285" y2={20 + i * 22} stroke="rgba(255,255,255,.08)" />)}
          {/* goleiro */}
          <g className="rp-goleiro" style={{ transform: `translate(${gx}px, ${gy}px) rotate(${gRot}deg)`, transformOrigin: "150px 150px" }}>
            <rect x="138" y="96" width="24" height="40" rx="8" fill="#2E6FE0" />
            <circle cx="150" cy="86" r="10" fill="#E8C7A6" />
            <rect x="112" y="98" width="28" height="9" rx="4" fill="#2E6FE0" />
            <rect x="160" y="98" width="28" height="9" rx="4" fill="#2E6FE0" />
            <rect x="140" y="134" width="8" height="18" fill="#0E1512" /><rect x="152" y="134" width="8" height="18" fill="#0E1512" />
          </g>
          {/* zonas clicáveis */}
          {escolha == null && ZONAS.map(([col, lin], i) => (
            <g key={i} onClick={() => chutar(i)} style={{ cursor: "pointer" }}>
              <rect x={zx(col) - 42} y={zy(lin) - 27} width="84" height="54" rx="8" fill="rgba(18,168,118,.10)" stroke="rgba(18,168,118,.55)" strokeDasharray="4 4" />
              <circle cx={zx(col)} cy={zy(lin)} r="6" fill="#1BC28A" opacity=".8" />
            </g>
          ))}
          {/* bola */}
          <circle className="rp-bola" cx="150" cy="185" r="8" fill="#F2F5F3" stroke="#0E1512" strokeWidth="1.5"
            style={{ transform: bola ? `translate(${zx(bola[0]) - 150 + (fora ? (bola[0] - 1) * 40 : 0)}px, ${zy(bola[1]) - 185 - (fora ? 50 : 0)}px) scale(.8)` : "none", transformOrigin: "150px 185px" }} />
        </svg>
      </div>
      <div className="text-center min-h-[64px]">
        {!res && <p className="text-[17px] text-[#C9D3CE]">Toque no canto onde vai bater. Finalização: <span className="font-stat">{c.attrs.finalizacao}</span> · chance estimada <span className="font-stat">{Math.round(chancePenalti(c) * 100)}%</span></p>}
        {res && (
          <div className="rp-entra">
            <div className={`display text-2xl ${res.resultado === "gol" ? "text-[#1BC28A]" : "text-[#E36B5B]"}`}>
              {res.resultado === "gol" ? "GOOOL!" : res.resultado === "defesa" ? "DEFENDEU!" : "PRA FORA!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- resumo da temporada ---------- */
function Stat({ label, valor }) {
  return (
    <div className="rounded-xl bg-[#131A17] py-2.5 text-center">
      <div className="font-stat text-xl text-[#F2F5F3] leading-none">{valor}</div>
      <div className="text-[10px] font-bold tracking-wider text-[#8FA39A] mt-1">{label}</div>
    </div>
  );
}

function TelaResumo({ c, card, onContinuar, onAposentar }) {
  const forcada = aposentadoriaForcada(c);
  const delta = card.ovrDepois - card.ovr;
  const bola = card.bola;
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4 rp-entra">
      <div className="flex items-center gap-3">
        <Escudo cor={card.cor} size={40} />
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Temporada {card.ano} · {card.idade} anos</div>
          <h2 className="display text-base text-[#F2F5F3] truncate">{card.clube}{card.emprestado ? " (empréstimo)" : ""}</h2>
          <div className="text-[14px] text-[#8FA39A]">{card.ligaNome} · {card.posLiga}º lugar · {card.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Stat label="JOGOS" valor={card.jogos} />
        <Stat label="GOLS" valor={card.gols} />
        <Stat label="ASSIST." valor={card.assist} />
        <Stat label="NOTA" valor={card.nota ? card.nota.toFixed(1) : "—"} />
      </div>

      {card.lesao && <div className="rp-painel px-4 py-3 text-[16px] text-[#F0A99E]">🩹 Desfalcou parte da temporada: {card.lesao}.</div>}

      {card.titulos.length > 0 && (
        <div className="rp-painel p-4 border-[#D8B44A]/40" style={{ borderColor: "rgba(216,180,74,.4)" }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#EBC557] mb-2">Conquistas</div>
          <div className="flex flex-col gap-1.5">
            {card.titulos.map((t, i) => <div key={i} className="text-[17px] font-semibold text-[#F2F5F3]">{ICONE_TITULO[t.tipo]} {t.nome}</div>)}
          </div>
        </div>
      )}

      {card.continental && (
        <div className="rp-painel px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-[16px] text-[#C9D3CE]">🌟 {card.continental.nome}</span>
          <span className="font-stat text-[15px] text-[#F2F5F3]">{card.titulos.some((t) => t.tipo === "continental") ? "Campeão" : card.continental.faseNome === "Final" ? "Vice-campeão" : card.continental.faseNome}</span>
        </div>
      )}

      {card.copaMundo && (
        <div className="rp-painel p-4" style={{ background: "linear-gradient(135deg, rgba(46,111,224,.18), rgba(19,26,23,.72))" }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8DB4F5]">Copa do Mundo {card.copaMundo.ano}</div>
          <div className="text-[17px] font-semibold text-[#F2F5F3] mt-1">
            {card.copaMundo.convocado ? `${nacDe(c.nac).label}: ${card.copaMundo.resultado}` : "Você ficou fora da lista final."}
          </div>
          {card.copaMundo.convocado && <div className="text-[14px] text-[#8FA39A]">{card.copaMundo.titular ? "Titular" : "Reserva"} · {card.copaMundo.gols} gol(s) no torneio</div>}
        </div>
      )}

      <div className="rp-painel p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Bola de Ouro</div>
          <div className="font-stat text-[15px] text-[#EBC557]">{bola.pos <= 50 ? `Você: ${bola.pos}º` : "Fora do top 50"}</div>
        </div>
        <ol className="mt-2 flex flex-col gap-1">
          {bola.top.map((r, i) => (
            <li key={i} className={`flex items-center gap-2 text-[16px] ${r.voce ? "text-[#EBC557] font-bold" : "text-[#C9D3CE]"}`}>
              <span className="font-stat w-5 text-[#8FA39A]">{i + 1}</span>
              <span className="truncate">{r.voce ? c.nome : r.nome}</span>
              <span className="ml-auto text-[13px] text-[#5E7068] truncate">{r.clube}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rp-painel px-4 py-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">OVERALL</div>
          <div className="font-stat text-lg text-[#F2F5F3]">{card.ovr} → {card.ovrDepois} <span className={delta > 0 ? "text-[#1BC28A]" : delta < 0 ? "text-[#E36B5B]" : "text-[#8FA39A]"}>{delta > 0 ? `+${delta}` : delta === 0 ? "=" : delta}</span></div>
        </div>
        <div className="rp-painel px-4 py-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">VALOR DE MERCADO</div>
          <div className="font-stat text-lg text-[#F2F5F3]">{formatarValor(card.valor)}</div>
        </div>
      </div>

      {card.destaques.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {card.destaques.map((d, i) => <li key={i} className="text-[16px] text-[#C9D3CE]">✨ {d}</li>)}
        </ul>
      )}

      {forcada ? (
        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-[#F0A99E]">{forcada}</p>
          <button onClick={onAposentar} className="rp-btn rp-ouro display text-sm">Ver o legado</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button onClick={onContinuar} className="rp-btn rp-prim display text-sm">Continuar</button>
          {podeAposentar(c) && <button onClick={onAposentar} className="rp-btn rp-sec text-[16px]">Pendurar as chuteiras aos {c.idade - 1}</button>}
        </div>
      )}
    </div>
  );
}

/* ---------- traço de carreira ---------- */
function TelaTraco({ c, opcoes, onEscolher }) {
  const marco = IDADES_TRACO.indexOf(c.idade) + 1;
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4 rp-entra">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#EBC557]">Marco da carreira {marco} de 3 · {c.idade} anos</div>
        <h2 className="display text-lg text-[#F2F5F3] mt-2">Que jogador você quer ser?</h2>
        <p className="text-[17px] text-[#8FA39A] mt-1">Escolha um traço. Ele fica com você até o fim e muda como sua carreira é simulada.</p>
      </div>
      {opcoes.map((t) => (
        <button key={t.id} onClick={() => onEscolher(t.id)} className="rp-opcao px-4 py-4">
          <div className="font-bold text-[18px] text-[#F2F5F3]">{t.icone} {t.nome}</div>
          <div className="text-[15px] text-[#8FA39A] mt-0.5">{t.desc}</div>
        </button>
      ))}
    </div>
  );
}

/* ---------- evento ---------- */
function TelaEvento({ c, evento, resultado, onEscolher, onJogar }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4 rp-entra">
      {evento && (
        <div className="rp-painel p-5">
          <div className="text-3xl">{evento.icone}</div>
          <h2 className="display text-base text-[#F2F5F3] mt-2">{evento.titulo}</h2>
          <p className="text-[17px] text-[#C9D3CE] mt-2 leading-snug">{evento.texto}</p>
          {!resultado && (
            <div className="flex flex-col gap-2 mt-4">
              {evento.opcoes.map((o) => (
                <button key={o.id} onClick={() => onEscolher(o.id)} className="rp-opcao px-4 py-3">
                  <div className="font-bold text-[17px] text-[#F2F5F3] flex items-center gap-2">
                    {o.oferta && <Escudo cor={o.oferta.cor} size={18} />}{o.label}
                  </div>
                  {o.dica && <div className="text-[14px] text-[#8FA39A] mt-0.5">{o.dica}</div>}
                </button>
              ))}
            </div>
          )}
          {resultado && <p className="mt-4 text-[17px] font-semibold text-[#7FE3BC] rp-entra">→ {resultado}</p>}
        </div>
      )}
      {(resultado || !evento) && (
        <>
          <Ficha c={c} />
          <button onClick={onJogar} className="rp-btn rp-prim display text-sm">
            Jogar temporada {c.ano}{anoDeCopa(c.ano) && c.idade >= 18 ? " · ano de Copa" : ""}
          </button>
        </>
      )}
    </div>
  );
}

/* ---------- fim de carreira ---------- */
function CartaFinal({ c }) {
  const L = c.legado || calcularLegado(c);
  const t = c.titulos;
  const totalTitulos = (t.liga || 0) + (t.copa || 0) + (t.continental || 0) + (t.copaMundo || 0) + (t.segunda || 0);
  return (
    <div className="rp-carta mx-auto w-full max-w-[340px] rounded-[28px] p-[2px]" style={{ background: `linear-gradient(160deg, ${L.nivel.cor}, #0E1512 55%, ${L.nivel.cor})` }}>
      <div className="rounded-[26px] p-5 relative overflow-hidden" style={{ background: "linear-gradient(170deg, #17201C, #0E1512)" }}>
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-20 blur-2xl" style={{ background: L.nivel.cor }} />
        <div className="flex items-start justify-between relative">
          <div>
            <div className="font-stat text-5xl font-bold leading-none" style={{ color: L.nivel.cor }}>{c.picoOvr}</div>
            <div className="text-sm font-bold tracking-widest text-[#C9D3CE] mt-1">{c.posicao}</div>
            <div className="text-[13px] text-[#8FA39A]">{nacDe(c.nac).label}</div>
          </div>
          <Gema size={64} />
        </div>
        <div className="display text-lg text-[#F2F5F3] mt-5 leading-tight relative">{c.nome}</div>
        {c.apelidos.length > 0 && <div className="text-[14px] text-[#8FA39A] italic">"{c.apelidos[0].nome}"</div>}
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[14px] font-bold" style={{ background: `${L.nivel.cor}22`, color: L.nivel.cor, border: `1px solid ${L.nivel.cor}55` }}>
          {L.nivel.icone} {L.nivel.nome}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 relative">
          {[["JOGOS", c.totais.jogos], ["GOLS", c.totais.gols], ["ASSIST.", c.totais.assist], ["TÍTULOS", totalTitulos], ["BOLAS", t.bolaOuro || 0], ["COPAS", t.copaMundo || 0]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-black/25 py-2 text-center">
              <div className="font-stat text-lg text-[#F2F5F3] leading-none">{v}</div>
              <div className="text-[10px] font-bold tracking-wider text-[#8FA39A] mt-1">{k}</div>
            </div>
          ))}
        </div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#5E7068] mt-4 text-center">A JOIA · Modo Rápido · {c.temporadas[0]?.ano}–{c.ano - 1}</div>
      </div>
    </div>
  );
}

function TelaFim({ c, onNova, onSair }) {
  const L = c.legado || calcularLegado(c);
  const [copiado, setCopiado] = useState(false);
  const clubes = [];
  c.temporadas.forEach((s) => {
    const ult = clubes[clubes.length - 1];
    if (ult && ult.nome === s.clube) { ult.ate = s.ano; ult.jogos += s.jogos; ult.gols += s.gols; }
    else clubes.push({ nome: s.clube, cor: s.cor, de: s.ano, ate: s.ano, jogos: s.jogos, gols: s.gols, emp: s.emprestado });
  });
  const proximo = NIVEIS_LEGADO.find((n) => n.min > L.pontos);
  const rotulos = { numeros: "Números em campo", titulos: "Títulos por clubes", selecao: "Seleção", premios: "Prêmios individuais", auge: "Auge técnico", torcida: "Idolatria e legado" };
  const copiar = async () => {
    try { await navigator.clipboard.writeText(textoCompartilhar(c)); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { setCopiado(false); }
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#8FA39A]">Fim de carreira · {c.idade - 1} anos</div>
        <h2 className="display text-xl mt-2" style={{ color: L.nivel.cor }}>{L.nivel.icone} {L.nivel.nome}</h2>
        <p className="text-[17px] text-[#C9D3CE] mt-1">{L.nivel.desc}</p>
      </div>
      <CartaFinal c={c} />
      <div className="flex flex-col gap-2">
        <button onClick={copiar} className="rp-btn rp-ouro display text-sm">{copiado ? "Copiado!" : "Copiar resumo para compartilhar"}</button>
      </div>

      <div className="rp-painel p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Pontos de legado</div>
          <div className="font-stat text-lg text-[#EBC557]">{L.pontos}</div>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {Object.entries(L.partes).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-[15px]"><span className="text-[#C9D3CE]">{rotulos[k]}</span><span className="font-stat">{v}</span></div>
              <Barra valor={(v / Math.max(1, L.pontos)) * 100} cor="#D8B44A" />
            </div>
          ))}
        </div>
        {proximo && <p className="text-[14px] text-[#8FA39A] mt-3">Faltaram {proximo.min - L.pontos} pontos para "{proximo.nome}".</p>}
      </div>

      <div className="rp-painel p-4">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Trajetória</div>
        <ol className="flex flex-col gap-2">
          {clubes.map((k, i) => (
            <li key={i} className="flex items-center gap-3">
              <Escudo cor={k.cor} size={22} />
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-semibold text-[#F2F5F3] truncate">{k.nome}{k.emp ? " (empréstimo)" : ""}</div>
                <div className="text-[13px] text-[#8FA39A]">{k.de === k.ate ? k.de : `${k.de}–${k.ate}`} · {k.jogos} jogos · {k.gols} gols</div>
              </div>
              {(c.torcida[k.nome] ?? 0) >= 75 && <span className="text-[12px] font-bold text-[#12A876]">ÍDOLO</span>}
            </li>
          ))}
        </ol>
      </div>

      {c.lista.length > 0 && (
        <div className="rp-painel p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Sala de troféus</div>
          <ul className="flex flex-col gap-1">
            {c.lista.map((t, i) => <li key={i} className="text-[15px] text-[#C9D3CE]"><span className="font-stat text-[#8FA39A] mr-2">{t.ano}</span>{ICONE_TITULO[t.tipo]} {t.nome} <span className="text-[#5E7068]">· {t.clube}</span></li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onNova} className="rp-btn rp-prim display text-xs">Nova carreira</button>
        <button onClick={onSair} className="rp-btn rp-sec text-[16px]">Menu</button>
      </div>
    </div>
  );
}

/* ---------- orquestração ---------- */
export default function ModoRapido({ onSair }) {
  // etapas: criacao → jogar → (momento) → resumo → (traco) → evento → jogar …  → fim
  const [estado, setEstado] = useState(() => carregarRapido() || { etapa: "criacao" });
  const { etapa, c, card, evento, resultado, opcoesTraco } = estado;

  useEffect(() => {
    if (etapa === "criacao") apagarRapido();
    else salvarRapido(estado);
    window.scrollTo({ top: 0 });
  }, [estado, etapa]);

  const criar = (dados) => setEstado({ etapa: "evento", c: criarJogador(dados), evento: null, resultado: null });

  const jogar = () => {
    const { c: c2, card: k, momento } = jogarTemporada(c);
    if (momento) setEstado({ etapa: "momento", c: c2, card: k });
    else { const f = fecharTemporada(c2, k); setEstado({ etapa: "resumo", c: f.c, card: f.card }); }
  };

  const fimMomento = (acertou) => {
    const k = aplicarMomento(card, acertou);
    const f = fecharTemporada(c, k);
    setEstado({ etapa: "resumo", c: f.c, card: f.card });
  };

  const continuar = () => {
    if (precisaEscolherTraco(c)) return setEstado({ etapa: "traco", c, opcoesTraco: opcoesDeTraco(c).map((t) => t.id) });
    irParaEvento(c);
  };
  const irParaEvento = (cc) => setEstado({ etapa: "evento", c: cc, evento: sortearEvento(cc), resultado: null });
  const escolherT = (id) => irParaEvento(escolherTraco(c, id));
  const escolherEvento = (opId) => { const r = resolverEvento(c, evento, opId); setEstado({ etapa: "evento", c: r.c, evento, resultado: r.resultado || "Decisão tomada." }); };
  const encerrar = () => setEstado({ etapa: "fim", c: aposentar(c) });
  const nova = () => setEstado({ etapa: "criacao" });

  return (
    <div className="rp">
      <style>{ESTILO_BASE}</style>
      <Cabecalho c={etapa === "criacao" || etapa === "fim" ? null : c} onSair={onSair} />
      <main className="pb-10">
        {etapa === "criacao" && <TelaCriacao onCriar={criar} />}
        {etapa === "evento" && (
          <>
            {!evento && c.temporadas.length === 0 && (
              <div className="max-w-xl mx-auto px-4 pt-6 rp-entra">
                <h2 className="display text-lg text-[#F2F5F3]">A história começa aqui</h2>
                <p className="text-[17px] text-[#8FA39A] mt-1">{c.nome}, {c.idade} anos, {posicaoDe(c.posicao).label.toLowerCase()} da base do {c.clubeNome}. Empresário: {(EMPRESARIOS.find((e) => e.id === c.empresario) || EMPRESARIOS[0]).nome.toLowerCase()}. Perfil: {personaDe(c.personalidade).label.toLowerCase()}.</p>
              </div>
            )}
            <TelaEvento c={c} evento={evento} resultado={resultado} onEscolher={escolherEvento} onJogar={jogar} />
          </>
        )}
        {etapa === "momento" && <TelaPenalti c={c} momento={card.pendente} onFim={fimMomento} />}
        {etapa === "resumo" && <TelaResumo c={c} card={card} onContinuar={continuar} onAposentar={encerrar} />}
        {etapa === "traco" && <TelaTraco c={c} opcoes={(opcoesTraco || []).map(tracoDe).filter(Boolean)} onEscolher={escolherT} />}
        {etapa === "fim" && <TelaFim c={c} onNova={nova} onSair={onSair} />}
      </main>
    </div>
  );
}
