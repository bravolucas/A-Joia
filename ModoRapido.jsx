import React, { useEffect, useState } from "react";
import { ARTE, ARTE_EVENTO } from "./arte.js";
import { POSICOES, NACIONALIDADES, PERSONALIDADES, EMPRESARIOS } from "./data.js";
import { Gema, ClubDot, Confetti, ApresentacaoNovoClube } from "./components.jsx";
import { TacaCompeticao } from "./trofeus.jsx";
import {
  criarJogador, jogarTemporada, aplicarMomento, fecharTemporada, sortearEvento, resolverEvento, janelaExtra,
  precisaEscolherTraco, opcoesDeTraco, escolherTraco, tracoDe, podeAposentar, aposentadoriaForcada, aposentar,
  calcularLegado, NIVEIS_LEGADO, statusNoClube, valorMercado, formatarValor, ovrDe, clubeDe, ligaDe, posicaoDe, nacDe, personaDe,
  textoCompartilhar, salvarRapido, carregarRapido, apagarRapido, NACS_DESTAQUE, IDADES_TRACO, anoDeCopa, anoDeContinentalSelecao,
  nomeCopaContinental, chancePenalti, ORIGENS_RAPIDO, origemDe, FOCOS, focoDe, definirFoco,
  iniciarNegociacao, ajustarNegociacao, fecharNegociacao, CAMPOS_NEGOCIACAO, fama_negociador,
  INVESTIMENTOS, comprarInvestimento, caminhosPosCarreira, escolherPosCarreira,
} from "./rapido.js";

/* Estilo do seletor de modos e do Modo Rápido. Inclui as animações que as
   cenas reaproveitadas do Modo Carreira (apresentação no clube, confete) usam. */
export const ESTILO_BASE = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Oswald:wght@500;600;700&family=Unbounded:wght@700;900&display=swap');
.rp{min-height:100vh;background:#0E1512;color:#E1E6E3;font-family:'Rajdhani',ui-sans-serif,system-ui,sans-serif;}
.rp .display{font-family:'Unbounded',sans-serif;}
.rp .font-stat{font-family:'Oswald',sans-serif;}
.font-sport{font-family:'Rajdhani',sans-serif;}
.rp-painel{background:rgba(19,26,23,0.72);border:1px solid rgba(255,255,255,0.08);border-radius:18px;box-shadow:0 8px 30px rgba(0,0,0,0.35);}
.rp-btn{transition:transform .2s ease,box-shadow .2s ease,background .2s ease;border-radius:14px;font-weight:700;min-height:52px;}
.rp-btn:hover{transform:translateY(-1px);} .rp-btn:active{transform:scale(.98);}
.rp-btn:disabled{opacity:.4;transform:none;cursor:not-allowed;}
.rp-prim{background:#12A876;color:#06110C;} .rp-prim:hover{background:#18BB85;box-shadow:0 0 18px rgba(18,168,118,.45);}
.rp-ouro{background:linear-gradient(90deg,#D8B44A,#F5D77A);color:#1A1405;} .rp-ouro:hover{box-shadow:0 0 22px rgba(216,180,74,.5);}
.rp-sec{background:rgba(19,29,25,.8);border:1px solid #2A3A33;color:#F2F5F3;} .rp-sec:hover{border-color:#12A876;}
.rp-opcao{background:rgba(19,29,25,.8);border:1px solid #2A3A33;border-radius:16px;text-align:left;transition:all .2s ease;}
.rp-opcao:hover{border-color:#12A876;background:rgba(18,168,118,.08);transform:translateY(-1px);}
.rp-opcao.sel{border-color:#12A876;background:rgba(18,168,118,.14);box-shadow:0 0 0 1px #12A876 inset;}
.rp-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:999px;}
.rp-entra{animation:rpEntra .35s ease-out both;}
.rp-sobe{animation:rpSobe .6s cubic-bezier(.2,.8,.2,1) both;}
@keyframes rpEntra{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes rpSobe{from{opacity:0;transform:translateY(40px) scale(.85)}to{opacity:1;transform:none}}
@keyframes rpBrilho{0%,100%{box-shadow:0 0 18px rgba(216,180,74,.25)}50%{box-shadow:0 0 42px rgba(216,180,74,.6)}}
@keyframes rpRaios{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes rpPulso{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.rp-carta{animation:rpBrilho 3s ease-in-out infinite;}
.rp-goleiro{transition:transform .45s cubic-bezier(.2,.8,.2,1);}
.rp-bola{transition:transform .5s cubic-bezier(.2,.8,.2,1);}
.glass{background:rgba(19,26,23,0.92);border:1px solid rgba(255,255,255,0.08);box-shadow:0 8px 30px rgba(0,0,0,0.35);}
.hud-btn{transition:all .3s ease;width:100%;} .btn-gold{background:linear-gradient(90deg,#D8B44A,#F5D77A);color:#1A1405;}
@keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(420px) rotate(360deg);opacity:0}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{opacity:0;transform:scale(0.95) translateY(8px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes jerseyRise{0%{opacity:0;transform:translateY(60px) scale(0.7);filter:brightness(0.5)}70%{filter:brightness(1.3)}100%{opacity:1;transform:translateY(0) scale(1);filter:brightness(1)}}
@keyframes spotlightPulse{0%,100%{opacity:0.35;transform:scale(0.9)}50%{opacity:0.7;transform:scale(1.15)}}
@keyframes cameraFlashRandom{0%,100%{opacity:0}10%{opacity:1}20%{opacity:0}}
@keyframes ceremonyGlow{0%,100%{box-shadow:0 0 10px rgba(216,180,74,0.35)}50%{box-shadow:0 0 22px rgba(216,180,74,0.75)}}
@keyframes flipOut{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@keyframes flipIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
`;

const ATTR_LABEL = { velocidade: "VEL", finalizacao: "FIN", passe: "PAS", drible: "DRI", defesa: "DEF", fisico: "FIS" };
const ROTULO_TIPO = { liga: "Ligas nacionais", copa: "Copas nacionais", continental: "Continentais", mundial: "Mundiais de Clubes", copaMundo: "Copas do Mundo", continentalSelecao: "Copas continentais (seleção)", bolaOuro: "Bolas de Ouro", segunda: "Segundas divisões" };
const ORDEM_TIPOS = ["bolaOuro", "copaMundo", "continentalSelecao", "mundial", "continental", "liga", "copa", "segunda"];
const RISCO = {
  seguro: { label: "Seguro", cor: "#7FE3BC", bg: "rgba(18,168,118,.14)" },
  equilibrado: { label: "Equilibrado", cor: "#8DB4F5", bg: "rgba(46,111,224,.16)" },
  arriscado: { label: "Arriscado", cor: "#F0A99E", bg: "rgba(227,107,91,.16)" },
};
const numeroCamisa = (pos) => ({ GOL: 1, ZAG: 4, LD: 2, LE: 6, VOL: 5, MC: 8, MEI: 10, PD: 7, PE: 11, SA: 10, ATA: 9 }[pos] || 8);

function Barra({ valor, cor = "#12A876" }) {
  return (
    <div className="h-1.5 rounded-full bg-[#222926] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, valor))}%`, background: cor, transition: "width .8s ease" }} />
    </div>
  );
}

const Escudo = ({ nome, size = 24 }) => <ClubDot club={clubeDe(nome)} size={size} />;

/* Bola de Ouro (desenho próprio: uma bola dourada simples) */
function BolaDourada({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 0 16px rgba(244,208,63,.65))" }} aria-hidden="true">
      <defs><radialGradient id="bolaOuroG" cx="35%" cy="30%"><stop offset="0%" stopColor="#FFF3B0" /><stop offset="55%" stopColor="#E3B93B" /><stop offset="100%" stopColor="#8E6F00" /></radialGradient></defs>
      <circle cx="50" cy="50" r="44" fill="url(#bolaOuroG)" />
      <polygon points="50,30 63,40 58,56 42,56 37,40" fill="#9C7A12" opacity=".75" />
      {[[50, 30, 50, 8], [63, 40, 84, 33], [58, 56, 72, 75], [42, 56, 28, 75], [37, 40, 16, 33]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9C7A12" strokeWidth="2.5" opacity=".6" />)}
    </svg>
  );
}

function IconeTitulo({ tipo, size = 40 }) {
  if (tipo === "bolaOuro") return <BolaDourada size={size} />;
  return <TacaCompeticao tipo={tipo} size={size} />;
}

/* Linha do tempo: um segmento por temporada, na cor do clube; ponto dourado = título */
function LinhaDoTempo({ c, total = 22 }) {
  const ts = c.temporadas;
  return (
    <div className="flex gap-[3px]" aria-label={`${ts.length} temporadas jogadas`}>
      {Array.from({ length: Math.max(total, ts.length + 1) }).map((_, i) => {
        const t = ts[i];
        return (
          <div key={i} className="flex-1 h-2 rounded-sm relative" title={t ? `${t.ano} · ${t.clube}` : ""}
            style={{ background: t ? t.cor || "#12A876" : i === ts.length ? "rgba(18,168,118,.35)" : "#1A211E", opacity: t ? 0.9 : 1 }}>
            {t?.titulos?.length ? <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D8B44A]" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Cabecalho({ c, onSair, onEstante }) {
  const nTrofeus = c ? c.lista.length : 0;
  return (
    <header className="sticky top-0 z-30 bg-[#0E1512]/90 backdrop-blur border-b border-white/5">
      <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <button onClick={onSair} className="flex items-center gap-2 min-h-[44px] pr-1" aria-label="Voltar ao menu">
          <Gema size={26} />
          <span className="display text-[11px] tracking-[0.2em] text-[#F2F5F3] hidden sm:inline">A JOIA</span>
        </button>
        {c && <span className="font-stat text-[15px] text-[#C9D3CE]">{c.ano} · {c.idade} anos</span>}
        {c && (
          <button onClick={onEstante} className="ml-auto flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl border border-[#D8B44A]/35 bg-[#D8B44A]/10 text-[#EBC557]" aria-label="Abrir estante de troféus">
            <TacaCompeticao tipo="liga" size={15} />
            <span className="font-stat text-[15px]">{nTrofeus}</span>
          </button>
        )}
        {!c && <span className="ml-auto font-semibold text-xs uppercase tracking-[0.2em] text-[#8FA39A]">Modo Rápido</span>}
      </div>
      {c && <div className="max-w-xl mx-auto px-4 pb-2"><LinhaDoTempo c={c} /></div>}
    </header>
  );
}

/* Estante de troféus + momentos marcantes: abre por cima de qualquer tela */
function Estante({ c, onFechar }) {
  const porTipo = ORDEM_TIPOS.map((t) => ({ tipo: t, itens: c.lista.filter((x) => x.tipo === t) })).filter((g) => g.itens.length);
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onFechar}>
      <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#121916] border border-white/10 p-5 rp-entra" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="display text-base text-[#F2F5F3]">Estante de troféus</h2>
          <button onClick={onFechar} className="min-h-[44px] px-3 text-[15px] font-bold text-[#8FA39A]">Fechar</button>
        </div>
        {!porTipo.length && <p className="text-[16px] text-[#8FA39A] mt-3">Ainda vazia. O primeiro troféu vai ter um lugar de honra aqui.</p>}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {porTipo.map((g) => (
            <div key={g.tipo} className="rounded-2xl bg-[#0E1512] border border-white/5 p-3 flex items-center gap-3">
              <IconeTitulo tipo={g.tipo} size={34} />
              <div className="min-w-0">
                <div className="font-stat text-xl text-[#F2F5F3] leading-none">{g.itens.length}</div>
                <div className="text-[13px] text-[#8FA39A] leading-tight">{ROTULO_TIPO[g.tipo]}</div>
              </div>
            </div>
          ))}
        </div>
        {c.lista.length > 0 && (
          <ul className="flex flex-col gap-1 mt-4">
            {[...c.lista].reverse().map((t, i) => <li key={i} className="text-[15px] text-[#C9D3CE]"><span className="font-stat text-[#8FA39A] mr-2">{t.ano}</span>{t.nome} <span className="text-[#5E7068]">· {t.clube}</span></li>)}
          </ul>
        )}
        {(c.marcos || []).length > 0 && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mt-6 mb-2">Momentos da carreira</h3>
            <ul className="flex flex-col gap-2">
              {[...c.marcos].reverse().map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px]">
                  <span className="text-xl leading-none">{m.icone}</span>
                  <span><span className="font-bold text-[#F2F5F3]">{m.titulo}</span> <span className="text-[#8FA39A]">· {m.ano}</span><br /><span className="text-[#8FA39A]">{m.texto}</span></span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

/* Ficha compacta do atleta */
function Ficha({ c }) {
  const ovr = ovrDe(c);
  const clube = clubeDe(c.emprestimo?.destino || c.clubeNome);
  const st = statusNoClube(c, clube.nome);
  const torcida = c.torcida[clube.nome] ?? 30;
  return (
    <div className="rp-painel overflow-hidden">
      <div className="p-4 flex items-center gap-3" style={{ background: `linear-gradient(120deg, ${clube.cor}33, transparent 70%)` }}>
        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center bg-[#0E1512]/80 border border-[#D8B44A]/40 shrink-0">
          <span className="font-stat text-2xl font-bold text-[#EBC557] leading-none">{ovr}</span>
          <span className="text-[10px] font-bold tracking-widest text-[#8FA39A]">{c.posicao}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="display text-sm text-[#F2F5F3] truncate">{c.nome}</div>
          <div className="flex items-center gap-1.5 mt-1 text-[16px] font-semibold text-[#E1E6E3]">
            <ClubDot club={clube} size={18} />
            <span className="truncate">{clube.nome}{c.emprestimo ? " (empréstimo)" : ""}</span>
          </div>
          <div className="text-[13px] text-[#8FA39A]">{ligaDe(clube.liga).nome} · {st.label}</div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="grid grid-cols-6 gap-2 mt-1">
          {Object.keys(ATTR_LABEL).map((a) => (
            <div key={a} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold tracking-wider text-[#8FA39A]">{ATTR_LABEL[a]}</span>
              <span className="font-stat text-[15px] text-[#F2F5F3] leading-none">{c.attrs[a]}</span>
              <Barra valor={(c.attrs[a] - 40) * 1.7} />
            </div>
          ))}
        </div>
        {c.contrato && (
          <div className="mt-4 rounded-xl bg-[#0E1512]/70 px-3 py-2.5 flex items-center justify-between gap-2 text-[14px]">
            <span className="text-[#C9D3CE]">📄 {formatarValor(c.contrato.salario)}/ano · cláusula {formatarValor(c.contrato.multa)}</span>
            <span className={`font-bold ${c.contrato.restantes <= 1 ? "text-[#EBC557]" : "text-[#8FA39A]"}`}>{c.contrato.restantes <= 0 ? "acabou" : `${c.contrato.restantes} ano${c.contrato.restantes > 1 ? "s" : ""}`}</span>
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
          {[["VALOR", formatarValor(valorMercado(ovr, c.idade, c.fama))], ["TORCIDA", `${torcida}/100`], ["FAMA", `${c.fama}/100`]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-[#0E1512]/70 py-2"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">{k}</div><div className="font-stat text-sm">{v}</div></div>
          ))}
        </div>
        {c.tracos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {c.tracos.map((id) => { const t = tracoDe(id); return t ? <span key={id} className="text-[13px] font-semibold px-2 py-1 rounded-lg bg-[#D8B44A]/12 text-[#EBC557] border border-[#D8B44A]/30">{t.icone} {t.nome}</span> : null; })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- criação ---------- */
function Secao({ titulo, children }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">{titulo}</span>
      {children}
    </div>
  );
}

function TelaCriacao({ onCriar }) {
  const [nome, setNome] = useState("");
  const [nac, setNac] = useState("BRA");
  const [posicao, setPosicao] = useState("");
  const [personalidade, setPersonalidade] = useState("");
  const [origem, setOrigem] = useState("");
  const [gerando, setGerando] = useState(false);
  const destaque = NACS_DESTAQUE.map((id) => NACIONALIDADES.find((n) => n.id === id)).filter(Boolean);
  const outras = NACIONALIDADES.filter((n) => !NACS_DESTAQUE.includes(n.id)).sort((a, b) => a.label.localeCompare(b.label));
  const pronto = nome.trim().length >= 2 && posicao && personalidade && origem;

  const comecar = () => {
    setGerando(true);
    // dá tempo de a tela mostrar o carregamento antes de gerar o mundo
    setTimeout(() => onCriar({ nome, nac, posicao, personalidade, origem }), 30);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 rp-entra">
      <div>
        <h1 className="display text-xl text-[#F2F5F3]">Crie seu atleta</h1>
        <p className="text-[17px] text-[#8FA39A] mt-1">Você começa aos 16 anos. Cada temporada é uma tela, e cada escolha fica na sua história.</p>
      </div>

      <Secao titulo="Nome">
        <input value={nome} onChange={(e) => setNome(e.target.value.slice(0, 24))} placeholder="Como a torcida vai te chamar"
          className="rp-painel px-4 min-h-[52px] text-lg text-[#F2F5F3] placeholder:text-[#5E7068] outline-none focus:border-[#12A876]" />
      </Secao>

      <Secao titulo="Nacionalidade">
        <select value={nac} onChange={(e) => setNac(e.target.value)} className="rp-painel px-4 min-h-[52px] text-lg text-[#F2F5F3] outline-none">
          <optgroup label="Principais">{destaque.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}</optgroup>
          <optgroup label="Todas">{outras.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}</optgroup>
        </select>
      </Secao>

      <Secao titulo="Posição">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {POSICOES.map((p) => (
            <button key={p.id} onClick={() => setPosicao(p.id)} className={`rp-opcao px-3 py-2 min-h-[56px] ${posicao === p.id ? "sel" : ""}`}>
              <div className="font-stat text-base text-[#F2F5F3]">{p.id}</div>
              <div className="text-[12px] leading-tight text-[#8FA39A]">{p.label}</div>
            </button>
          ))}
        </div>
      </Secao>

      <Secao titulo="De onde você veio">
        <div className="grid grid-cols-2 gap-2">
          {ORIGENS_RAPIDO.map((o) => (
            <button key={o.id} onClick={() => setOrigem(o.id)} className={`rp-opcao px-3 py-3 ${origem === o.id ? "sel" : ""}`}>
              <div className="font-bold text-[16px] text-[#F2F5F3]">{o.icone} {o.nome}</div>
              <div className="text-[13px] leading-snug text-[#8FA39A] mt-0.5">{o.perk}</div>
            </button>
          ))}
        </div>
        {origem && <p className="text-[14px] text-[#8FA39A]">{origemDe(origem)?.desc}</p>}
      </Secao>

      <Secao titulo="Personalidade">
        <div className="grid sm:grid-cols-2 gap-2">
          {PERSONALIDADES.map((p) => (
            <button key={p.id} onClick={() => setPersonalidade(p.id)} className={`rp-opcao px-4 py-3 ${personalidade === p.id ? "sel" : ""}`}>
              <div className="font-bold text-[16px] text-[#F2F5F3]">{p.icone} {p.label}</div>
              <div className="text-[14px] leading-snug text-[#8FA39A] mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>
      </Secao>

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
    const r = Math.random();
    const gCol = r < 0.4 ? 0 : r < 0.6 ? 1 : 2;
    const gLin = Math.random() < 0.55 ? 1 : 0;
    const bonus = (c.tracos || []).includes("decisao") ? 0.12 : 0;
    const fin = c.attrs.finalizacao;
    let resultado = "gol";
    if (lin === 0 && Math.random() < Math.max(0.04, 0.2 - (fin - 60) * 0.005)) resultado = "fora";
    else if (gCol === col && Math.random() < (gLin === lin ? 0.8 : 0.45) - bonus - (fin - 70) * 0.004) resultado = "defesa";
    setEscolha(i);
    setRes({ resultado, goleiro: [gCol, gLin] });
  };

  useEffect(() => {
    if (!res) return undefined;
    const t = setTimeout(() => onFim(res.resultado === "gol"), 2200);
    return () => clearTimeout(t);
  }, [res, onFim]);

  const zx = (col) => 60 + col * 90, zy = (lin) => 52 + lin * 58;
  const gx = res ? (res.goleiro[0] - 1) * 82 : 0, gy = res ? (res.goleiro[1] === 0 ? -22 : 6) : 0;
  const gRot = res ? (res.goleiro[0] - 1) * 55 : 0;
  const bola = escolha != null ? ZONAS[escolha] : null;
  const fora = res?.resultado === "fora";

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <div className="text-center">
        <span className="rp-chip" style={{ color: "#EBC557", background: "rgba(216,180,74,.14)" }}>Momento decisivo</span>
        <h2 className="display text-lg text-[#F2F5F3] mt-3">{momento.titulo}</h2>
        <p className="text-[17px] text-[#8FA39A] mt-1">{momento.texto}</p>
      </div>
      <div className="rp-painel p-3 overflow-hidden" style={{ background: "linear-gradient(#0F2A1F, #0B1F17)" }}>
        <svg viewBox="0 0 300 200" className="w-full" role="img" aria-label="Gol: escolha onde bater">
          <rect x="0" y="150" width="300" height="50" fill="#14432F" />
          <rect x="15" y="20" width="270" height="132" fill="rgba(255,255,255,.04)" stroke="#F2F5F3" strokeWidth="5" />
          {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={15 + i * 22.5} y1="20" x2={15 + i * 22.5} y2="152" stroke="rgba(255,255,255,.08)" />)}
          {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="15" y1={20 + i * 22} x2="285" y2={20 + i * 22} stroke="rgba(255,255,255,.08)" />)}
          <g className="rp-goleiro" style={{ transform: `translate(${gx}px, ${gy}px) rotate(${gRot}deg)`, transformOrigin: "150px 150px" }}>
            <rect x="138" y="96" width="24" height="40" rx="8" fill="#2E6FE0" />
            <circle cx="150" cy="86" r="10" fill="#E8C7A6" />
            <rect x="112" y="98" width="28" height="9" rx="4" fill="#2E6FE0" />
            <rect x="160" y="98" width="28" height="9" rx="4" fill="#2E6FE0" />
            <rect x="140" y="134" width="8" height="18" fill="#0E1512" /><rect x="152" y="134" width="8" height="18" fill="#0E1512" />
          </g>
          {escolha == null && ZONAS.map(([col, lin], i) => (
            <g key={i} onClick={() => chutar(i)} style={{ cursor: "pointer" }}>
              <rect x={zx(col) - 42} y={zy(lin) - 27} width="84" height="54" rx="8" fill="rgba(18,168,118,.10)" stroke="rgba(18,168,118,.55)" strokeDasharray="4 4" />
              <circle cx={zx(col)} cy={zy(lin)} r="6" fill="#1BC28A" opacity=".8" />
            </g>
          ))}
          <circle className="rp-bola" cx="150" cy="185" r="8" fill="#F2F5F3" stroke="#0E1512" strokeWidth="1.5"
            style={{ transform: bola ? `translate(${zx(bola[0]) - 150 + (fora ? (bola[0] - 1) * 40 : 0)}px, ${zy(bola[1]) - 185 - (fora ? 50 : 0)}px) scale(.8)` : "none", transformOrigin: "150px 185px" }} />
        </svg>
      </div>
      <div className="text-center min-h-[64px]">
        {!res && <p className="text-[17px] text-[#C9D3CE]">Toque no canto onde vai bater. Finalização <span className="font-stat">{c.attrs.finalizacao}</span> · chance estimada <span className="font-stat">{Math.round(chancePenalti(c) * 100)}%</span></p>}
        {res && (
          <div className={`display text-3xl rp-sobe ${res.resultado === "gol" ? "text-[#1BC28A]" : "text-[#E36B5B]"}`}>
            {res.resultado === "gol" ? "GOOOL!" : res.resultado === "defesa" ? "DEFENDEU!" : "PRA FORA!"}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- celebração: uma tela por conquista ---------- */
function SlideTitulo({ c, card, titulo }) {
  const pelaSelecao = titulo.tipo === "copaMundo" || titulo.tipo === "continentalSelecao";
  const cor = pelaSelecao ? "#2E6FE0" : card.cor || "#12A876";
  const contagem = titulo.n > 1 ? `Seu ${titulo.n}º título de ${titulo.nome}` : titulo.primeiro ? "O primeiro título da sua carreira" : `Seu primeiro título de ${titulo.nome}`;
  return (
    <div className="relative overflow-hidden rounded-[28px] min-h-[440px] flex flex-col items-center justify-center text-center px-6 py-10 border border-white/10"
      style={{ background: `radial-gradient(circle at 50% 32%, ${cor}55 0%, rgba(14,21,18,.55) 68%), url(${ARTE.confete}) center/cover, #0E1512` }}>
      <div aria-hidden="true" className="absolute left-1/2 top-[38%] w-[620px] h-[620px] opacity-20"
        style={{ background: `repeating-conic-gradient(${cor} 0deg 8deg, transparent 8deg 24deg)`, animation: "rpRaios 26s linear infinite", borderRadius: "50%" }} />
      <Confetti />
      <div className="relative rp-sobe" style={{ animationDelay: ".1s" }}>
        <div style={{ animation: "floatY 2.6s ease-in-out infinite" }}><IconeTitulo tipo={titulo.tipo} size={120} /></div>
      </div>
      <div className="relative mt-5 rp-sobe" style={{ animationDelay: ".35s" }}>
        <div className="display text-3xl text-[#F5D77A] tracking-wide">CAMPEÃO!</div>
        <div className="display text-lg text-[#F2F5F3] mt-2">{titulo.nome}</div>
        <div className="flex items-center justify-center gap-2 mt-2 text-[17px] font-semibold text-[#E1E6E3]">
          {pelaSelecao ? <span>{nacDe(c.nac).label}</span> : <><ClubDot club={clubeDe(card.clube)} size={20} /><span>{card.clube}</span></>}
          <span className="text-[#8FA39A]">· {card.ano}</span>
        </div>
        <div className="mt-3 rp-chip" style={{ color: "#EBC557", background: "rgba(216,180,74,.16)" }}>{contagem}</div>
      </div>
    </div>
  );
}

function SlideBolaDeOuro({ c, card }) {
  const [revelados, setRevelados] = useState(0);
  const top = card.bola.top;
  const ordem = [2, 1, 0]; // revela do 3º ao 1º
  useEffect(() => {
    if (revelados >= top.length) return undefined;
    const t = setTimeout(() => setRevelados((r) => r + 1), revelados === 0 ? 700 : 1100);
    return () => clearTimeout(t);
  }, [revelados, top.length]);
  const ganhou = card.bola.pos === 1;
  const fim = revelados >= top.length;
  return (
    <div className="relative overflow-hidden rounded-[28px] min-h-[440px] flex flex-col items-center justify-center text-center px-5 py-8 border border-[#D8B44A]/30"
      style={{ background: `radial-gradient(circle at 50% 25%, rgba(216,180,74,.35) 0%, rgba(14,21,18,.6) 70%), url(${ARTE.confete}) center/cover, #0E1512` }}>
      {fim && ganhou && <Confetti />}
      <BolaDourada size={84} />
      <div className="display text-lg text-[#F5D77A] mt-3">Bola de Ouro {card.ano}</div>
      <p className="text-[16px] text-[#8FA39A]">Você está entre os três melhores do mundo.</p>
      <div className="grid grid-cols-3 gap-2 w-full mt-5 items-end">
        {[1, 0, 2].map((idx) => {
          const r = top[idx];
          const visivel = ordem.indexOf(idx) < revelados;
          const altura = idx === 0 ? 150 : idx === 1 ? 122 : 104;
          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className={`text-[14px] font-bold leading-tight min-h-[36px] ${visivel && r?.voce ? "text-[#F5D77A]" : "text-[#E1E6E3]"}`} style={visivel ? { animation: "popIn .35s ease-out" } : undefined}>
                {visivel ? (r?.voce ? `${r.nome} (você)` : r?.nome) : "?"}
              </div>
              <div className="w-full rounded-t-xl flex items-start justify-center pt-2 font-stat text-2xl"
                style={{ height: altura, background: idx === 0 ? "linear-gradient(#D8B44A,#8E6F00)" : idx === 1 ? "linear-gradient(#C7CDD6,#6C7470)" : "linear-gradient(#D2915B,#6B4320)", color: "#0E1512", boxShadow: visivel && r?.voce ? "0 0 26px rgba(245,215,122,.7)" : "none" }}>
                {idx + 1}º
              </div>
            </div>
          );
        })}
      </div>
      {fim && <div className={`display text-xl mt-5 rp-sobe ${ganhou ? "text-[#F5D77A]" : "text-[#E1E6E3]"}`}>{ganhou ? "O MELHOR DO MUNDO É VOCÊ!" : `${card.bola.pos}º lugar no mundo`}</div>}
    </div>
  );
}

function TelaFesta({ c, card, onFim }) {
  const titulos = card.titulos.filter((t) => t.tipo !== "bolaOuro");
  const slides = [...titulos.map((t) => ({ tipo: "titulo", t })), ...(card.bola.pos <= 3 ? [{ tipo: "bola" }] : [])];
  const [i, setI] = useState(0);
  const s = slides[i];
  if (!s) return null;
  const ultimo = i === slides.length - 1;
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-4">
      {slides.length > 1 && (
        <div className="flex gap-1.5 justify-center">{slides.map((_, k) => <span key={k} className="h-1.5 rounded-full transition-all" style={{ width: k === i ? 22 : 8, background: k <= i ? "#D8B44A" : "#2A3A33" }} />)}</div>
      )}
      <div key={i}>{s.tipo === "titulo" ? <SlideTitulo c={c} card={card} titulo={s.t} /> : <SlideBolaDeOuro c={c} card={card} />}</div>
      <button onClick={() => (ultimo ? onFim() : setI(i + 1))} className="rp-btn rp-ouro display text-sm">
        {ultimo ? "Ver a temporada" : "Próxima conquista"}
      </button>
    </div>
  );
}

/* ---------- resumo da temporada ---------- */
function AnelNota({ nota }) {
  const v = nota || 0;
  const p = Math.max(0, Math.min(1, (v - 5) / 4.5));
  const cor = v >= 7.5 ? "#1BC28A" : v >= 6.8 ? "#EBC557" : "#E36B5B";
  const r = 30, circ = 2 * Math.PI * r;
  return (
    <div className="relative w-[76px] h-[76px] shrink-0">
      <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
        <circle cx="38" cy="38" r={r} fill="none" stroke={cor} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-stat text-xl text-[#F2F5F3] leading-none">{v ? v.toFixed(1) : "—"}</span>
        <span className="text-[9px] font-bold tracking-widest text-[#8FA39A]">NOTA</span>
      </div>
    </div>
  );
}

function Stat({ label, valor }) {
  return (
    <div className="rounded-xl bg-[#0E1512]/70 py-2.5 text-center">
      <div className="font-stat text-2xl text-[#F2F5F3] leading-none">{valor}</div>
      <div className="text-[10px] font-bold tracking-wider text-[#8FA39A] mt-1">{label}</div>
    </div>
  );
}

function TelaResumo({ c, card, onContinuar, onAposentar, onRever }) {
  const forcada = aposentadoriaForcada(c);
  const delta = card.ovrDepois - card.ovr;
  const bola = card.bola;
  const sel = card.selecao;
  const temFesta = card.titulos.length > 0 || bola.pos <= 3;
  return (
    <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
      <div className="rp-painel overflow-hidden">
        <div className="p-4 flex items-center gap-3" style={{ background: `linear-gradient(120deg, ${card.cor}44, transparent 75%)` }}>
          <ClubDot club={clubeDe(card.clube)} size={44} />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9D3CE]">Temporada {card.ano} · {card.idade} anos</div>
            <h2 className="display text-base text-[#F2F5F3] truncate">{card.clube}{card.emprestado ? " (empréstimo)" : ""}</h2>
            <div className="text-[14px] text-[#C9D3CE]">{card.ligaNome} · <span className="font-stat">{card.posLiga}º</span> lugar · {card.status}</div>
          </div>
          <AnelNota nota={card.nota} />
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <Stat label="JOGOS" valor={card.jogos} />
          <Stat label="GOLS" valor={card.gols} />
          <Stat label="ASSIST." valor={card.assist} />
        </div>
      </div>

      {card.titulos.length > 0 && (
        <div className="rounded-[20px] p-4 border border-[#D8B44A]/45 rp-carta" style={{ background: "linear-gradient(135deg, rgba(216,180,74,.20), rgba(19,26,23,.85) 60%)" }}>
          <div className="flex items-center justify-between">
            <span className="rp-chip" style={{ color: "#1A1405", background: "#EBC557" }}>Conquistas da temporada</span>
            {temFesta && <button onClick={onRever} className="text-[14px] font-bold text-[#EBC557] min-h-[40px] px-2">Rever festa</button>}
          </div>
          <div className="flex flex-col gap-3 mt-3">
            {card.titulos.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <IconeTitulo tipo={t.tipo} size={40} />
                <div>
                  <div className="text-[18px] font-bold text-[#F5D77A] leading-tight">{t.nome}</div>
                  <div className="text-[13px] text-[#C9D3CE]">{t.n > 1 ? `${t.n}º da carreira` : "Primeiro da carreira"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {card.marcos?.length > 0 && (
        <div className="grid gap-2">
          {card.marcos.map((m, i) => (
            <div key={i} className="rp-painel px-4 py-3 flex items-center gap-3 rp-entra" style={{ animationDelay: `${i * 0.08}s`, borderColor: "rgba(46,111,224,.35)" }}>
              <span className="text-2xl">{m.icone}</span>
              <div><div className="text-[16px] font-bold text-[#F2F5F3]">{m.titulo}</div><div className="text-[14px] text-[#8FA39A]">{m.texto}</div></div>
            </div>
          ))}
        </div>
      )}

      {card.lesao && <div className="rp-painel px-4 py-3 text-[16px] text-[#F0A99E]">🩹 Desfalcou parte da temporada: {card.lesao}.</div>}

      {(card.continental || sel) && (
        <div className="grid gap-2">
          {card.continental && (
            <div className="rp-painel px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[16px] text-[#C9D3CE]">🌟 {card.continental.nome}</span>
              <span className="font-stat text-[15px] text-[#F2F5F3]">{card.titulos.some((t) => t.tipo === "continental") ? "Campeão" : card.continental.faseNome}</span>
            </div>
          )}
          {sel && (
            <div className="rp-painel px-4 py-3 pt-10" style={{ background: `linear-gradient(180deg, rgba(19,26,23,.15) 0%, rgba(19,26,23,.88) 65%), linear-gradient(135deg, rgba(46,111,224,.3), transparent), url(${ARTE.torcida}) center 55%/cover` }}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[16px] text-[#C9D3CE]">🌎 {sel.nome} {sel.ano}</span>
                <span className="font-stat text-[15px] text-[#F2F5F3]">{sel.convocado ? sel.resultado : "Fora da lista"}</span>
              </div>
              {sel.convocado && <div className="text-[14px] text-[#8FA39A]">{nacDe(c.nac).label} · {sel.titular ? "titular" : "reserva"} · {sel.gols} gol(s)</div>}
            </div>
          )}
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
              <span className="truncate">{r.nome}</span>
              <span className="ml-auto text-[13px] text-[#5E7068] truncate">{r.clube}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rp-painel px-3 py-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">OVERALL</div>
          <div className="font-stat text-lg text-[#F2F5F3]">{card.ovrDepois} <span className={delta > 0 ? "text-[#1BC28A]" : delta < 0 ? "text-[#E36B5B]" : "text-[#8FA39A]"}>{delta > 0 ? `+${delta}` : delta === 0 ? "=" : delta}</span></div>
        </div>
        <div className="rp-painel px-3 py-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">TORCIDA</div>
          <div className="font-stat text-lg text-[#F2F5F3]">{card.torcida} <span className={card.torcidaDelta > 0 ? "text-[#1BC28A]" : card.torcidaDelta < 0 ? "text-[#E36B5B]" : "text-[#8FA39A]"}>{card.torcidaDelta > 0 ? `+${card.torcidaDelta}` : card.torcidaDelta || "="}</span></div>
        </div>
        <div className="rp-painel px-3 py-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">VALOR</div>
          <div className="font-stat text-lg text-[#F2F5F3] truncate">{formatarValor(card.valor)}</div>
        </div>
      </div>

      {card.ganhos && (
        <div className="rp-painel px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Dinheiro da temporada</span>
            <span className="font-stat text-lg text-[#1BC28A]">+{formatarValor(card.ganhos.total)}</span>
          </div>
          <div className="text-[14px] text-[#8FA39A] mt-1">
            Salário {formatarValor(card.ganhos.salario)} · bônus {formatarValor(card.ganhos.bonus)} · empresário −{formatarValor(card.ganhos.comissao)}{card.ganhos.manutencao ? ` · luxos −${formatarValor(card.ganhos.manutencao)}` : ""}
          </div>
          <div className="text-[14px] mt-1"><span className="text-[#C9D3CE]">Patrimônio: {formatarValor(card.patrimonio)}</span>{card.contratoRestante <= 1 && <span className="text-[#EBC557] font-bold"> · {card.contratoRestante <= 0 ? "contrato encerrado" : "último ano de contrato"}</span>}</div>
        </div>
      )}

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
        <span className="rp-chip" style={{ color: "#EBC557", background: "rgba(216,180,74,.14)" }}>Marco {marco} de 3 · {c.idade} anos</span>
        <h2 className="display text-lg text-[#F2F5F3] mt-3">Que jogador você quer ser?</h2>
        <p className="text-[17px] text-[#8FA39A] mt-1">Escolha um traço. Ele fica com você até o fim e muda como sua carreira é simulada.</p>
      </div>
      {opcoes.map((t) => (
        <button key={t.id} onClick={() => onEscolher(t.id)} className="rp-opcao px-4 py-4 flex items-center gap-4">
          <span className="text-3xl w-12 h-12 rounded-2xl bg-[#D8B44A]/12 border border-[#D8B44A]/30 flex items-center justify-center shrink-0">{t.icone}</span>
          <span>
            <span className="block font-bold text-[18px] text-[#F2F5F3]">{t.nome}</span>
            <span className="block text-[15px] text-[#8FA39A] mt-0.5">{t.desc}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------- evento + preparação da próxima temporada ---------- */
function CartaoEvento({ evento, resultado, onEscolher }) {
  const foto = ARTE_EVENTO[evento.id];
  return (
    <div className="rp-painel overflow-hidden">
      {foto && <div aria-hidden="true" className="h-32 -mb-14" style={{ background: `linear-gradient(180deg, rgba(19,26,23,0) 0%, rgba(19,26,23,.7) 60%, rgba(19,26,23,1) 100%), url(${foto}) center 45%/cover` }} />}
      <div className="relative px-5 pt-5 pb-4 flex items-start gap-4" style={{ background: foto ? "transparent" : "linear-gradient(135deg, rgba(18,168,118,.16), transparent 70%)" }}>
        <span className="text-4xl w-16 h-16 rounded-2xl bg-[#0E1512]/70 border border-white/10 flex items-center justify-center shrink-0">{evento.icone}</span>
        <div className="min-w-0">
          <h2 className="display text-[15px] leading-snug text-[#F2F5F3]">{evento.titulo}</h2>
          <p className="text-[17px] text-[#C9D3CE] mt-1.5 leading-snug">{evento.texto}</p>
        </div>
      </div>
      {!resultado && (
        <div className="flex flex-col gap-2 p-4 pt-1">
          {evento.opcoes.map((o) => {
            const r = RISCO[o.risco] || RISCO.seguro;
            return (
              <button key={o.id} onClick={() => onEscolher(o.id)} className="rp-opcao px-4 py-3">
                <div className="flex items-center gap-2">
                  {o.oferta && <ClubDot club={clubeDe(o.oferta.clube)} size={20} />}
                  <span className="font-bold text-[17px] text-[#F2F5F3] flex-1">{o.label}</span>
                  <span className="rp-chip shrink-0" style={{ color: r.cor, background: r.bg }}>{r.label}</span>
                </div>
                {o.dica && <div className="text-[14px] text-[#8FA39A] mt-1">{o.dica}</div>}
              </button>
            );
          })}
        </div>
      )}
      {resultado && <p className="px-5 pb-5 pt-1 text-[17px] font-semibold text-[#7FE3BC] rp-entra">→ {resultado}</p>}
    </div>
  );
}

function SeletorFoco({ c, onFoco }) {
  return (
    <div className="rp-painel p-4">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Foco da temporada</div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {FOCOS.map((f) => (
          <button key={f.id} onClick={() => onFoco(f.id)} className={`rp-opcao px-2 py-2.5 text-center min-h-[64px] ${c.foco === f.id ? "sel" : ""}`} aria-pressed={c.foco === f.id}>
            <div className="text-xl leading-none">{f.icone}</div>
            <div className="text-[13px] font-bold text-[#F2F5F3] mt-1 leading-tight">{f.nome}</div>
          </button>
        ))}
      </div>
      <p className="text-[14px] text-[#8FA39A] mt-2 min-h-[20px]">{focoDe(c.foco).desc}</p>
    </div>
  );
}

function TelaEvento({ c, evento, resultado, temMais, aviso, onEscolher, onProximo, onFoco, onJogar, onPatrimonio }) {
  const torneio = c.idade >= 18 ? (anoDeCopa(c.ano) ? "Copa do Mundo" : anoDeContinentalSelecao(c.ano) ? nomeCopaContinental(c.nac) : null) : null;
  const pronto = !evento || resultado;
  return (
    <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
      {aviso && <div className="rp-painel px-4 py-3 text-[16px] text-[#F0A99E]" style={{ borderColor: "rgba(227,107,91,.35)" }}>{aviso}</div>}
      {evento && <CartaoEvento evento={evento} resultado={resultado} onEscolher={onEscolher} />}
      {pronto && temMais && <button onClick={onProximo} className="rp-btn rp-prim display text-sm">Ver próxima notícia</button>}
      {pronto && !temMais && (
        <>
          <Ficha c={c} />
          <button onClick={onPatrimonio} className="rp-painel px-4 py-3 flex items-center gap-3 text-left hover:border-[#D8B44A]/50">
            <span className="text-2xl">💼</span>
            <span className="flex-1"><span className="block text-[13px] font-bold uppercase tracking-[0.15em] text-[#8FA39A]">Patrimônio</span><span className="font-stat text-lg text-[#EBC557]">{formatarValor(c.patrimonio || 0)}</span></span>
            <span className="text-[15px] font-bold text-[#EBC557]">Investir →</span>
          </button>
          <SeletorFoco c={c} onFoco={onFoco} />
          {torneio && <div className="rp-painel px-4 py-3 text-[16px] text-[#8DB4F5]" style={{ borderColor: "rgba(46,111,224,.35)" }}>🌎 Ano de {torneio}. Jogue bem para ser convocado.</div>}
          <button onClick={onJogar} className="rp-btn rp-prim display text-sm">Jogar temporada {c.ano}</button>
        </>
      )}
    </div>
  );
}

/* ---------- mesa de negociação ---------- */
function TelaNegociacao({ c, n, onAjustar, onAssinar, onSair }) {
  const cl = clubeDe(n.clube);
  const t = n.termos, o = n.original;
  const corPac = n.paciencia >= 60 ? "#1BC28A" : n.paciencia >= 30 ? "#EBC557" : "#E36B5B";
  const humor = n.colapsou ? "Saiu da mesa" : n.paciencia >= 60 ? "Tranquila" : n.paciencia >= 30 ? "Impaciente" : "No limite";
  const fmt = { salario: (v) => `${formatarValor(v)}/ano`, anos: (v) => `${v} ano${v > 1 ? "s" : ""}`, multa: (v) => formatarValor(v), bonusGol: (v) => `${formatarValor(v)}/gol` };
  const luvas = n.luvas ? Math.round(t.salario * 0.5) : 0;
  return (
    <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
      <div className="rp-painel overflow-hidden">
        <div className="p-4 pt-16 flex items-center gap-3" style={{ background: `linear-gradient(180deg, rgba(19,26,23,.1) 0%, rgba(19,26,23,.85) 70%), linear-gradient(120deg, ${cl.cor}44, transparent 75%), url(${ARTE.contrato}) center 40%/cover` }}>
          <ClubDot club={cl} size={44} />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9D3CE]">{n.tipo === "renovacao" ? "Renovação de contrato" : "Proposta de contrato"}</div>
            <h2 className="display text-base text-[#F2F5F3] truncate">{cl.nome}</h2>
            <div className="text-[14px] text-[#C9D3CE]">{ligaDe(cl.liga).nome} · sua fama: {fama_negociador(c).toLowerCase()}</div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-bold text-[#C9D3CE]">Paciência da diretoria</span>
            <span className="font-bold" style={{ color: corPac }}>{humor}</span>
          </div>
          <div className="mt-1.5"><Barra valor={n.paciencia} cor={corPac} /></div>
          <div className="text-[13px] text-[#8FA39A] mt-1.5">{n.pedidos > 0 && !n.colapsou ? `${n.pedidos} pedido(s) restante(s). Pedir mais desgasta; ceder acalma.` : n.colapsou ? "Você forçou demais." : "Sem mais pedidos: assine ou saia."}</div>
        </div>
      </div>

      <div className="rp-painel p-2">
        {CAMPOS_NEGOCIACAO.map((campo) => {
          const mudou = t[campo.id] !== o[campo.id];
          const bloqueado = n.pedidos <= 0 || n.colapsou;
          return (
            <div key={campo.id} className="flex items-center gap-2 px-2 py-2.5 border-b border-white/5 last:border-0">
              <span className="text-xl w-7 text-center">{campo.icone}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[#8FA39A]">{campo.label}</div>
                <div className={`font-stat text-[17px] ${mudou ? "text-[#EBC557]" : "text-[#F2F5F3]"}`}>{fmt[campo.id](t[campo.id])}</div>
              </div>
              <button disabled={bloqueado} onClick={() => onAjustar(campo.id, -1)} className="rp-btn rp-sec !min-h-[44px] px-3 text-[13px]" aria-label={`${campo.ceder}: ${campo.label}`}>−</button>
              <button disabled={bloqueado} onClick={() => onAjustar(campo.id, 1)} className="rp-btn rp-sec !min-h-[44px] px-3 text-[13px]" aria-label={`${campo.pedirMais}: ${campo.label}`}>+</button>
            </div>
          );
        })}
        <p className="text-[13px] text-[#8FA39A] px-2 pt-2 pb-1">Cláusula baixa facilita sair no futuro, mas um clube grande pode pagá-la sem te consultar.</p>
      </div>

      {n.historico.length > 0 && (
        <ul className="flex flex-col gap-1">
          {n.historico.slice(-4).map((h, i) => <li key={i} className="text-[15px] text-[#C9D3CE]">• {h}</li>)}
        </ul>
      )}
      {luvas > 0 && !n.colapsou && <div className="rp-painel px-4 py-3 text-[16px] text-[#EBC557]">💰 Luvas na assinatura: {formatarValor(luvas)}</div>}

      {n.colapsou ? (
        <button onClick={onSair} className="rp-btn rp-sec text-[16px]">Voltar</button>
      ) : (
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <button onClick={onAssinar} className="rp-btn rp-ouro display text-sm">Assinar contrato</button>
          <button onClick={onSair} className="rp-btn rp-sec text-[16px] px-4">Sair da mesa</button>
        </div>
      )}
    </div>
  );
}

/* ---------- patrimônio e investimentos ---------- */
function Patrimonio({ c, onComprar, onFechar }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onFechar}>
      <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#121916] border border-white/10 p-5 rp-entra" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="display text-base text-[#F2F5F3]">Patrimônio</h2>
          <button onClick={onFechar} className="min-h-[44px] px-3 text-[15px] font-bold text-[#8FA39A]">Fechar</button>
        </div>
        <div className="font-stat text-3xl text-[#EBC557] mt-1">{formatarValor(c.patrimonio || 0)}</div>
        <p className="text-[14px] text-[#8FA39A]">Ganhou {formatarValor(c.ganhosTotais || 0)} na carreira. Investimentos são permanentes; luxos custam 6% ao ano de manutenção.</p>
        <div className="flex flex-col gap-2 mt-4">
          {INVESTIMENTOS.map((inv) => {
            const tem = (c.investimentos || []).includes(inv.id);
            const pode = !tem && (c.patrimonio || 0) >= inv.custo;
            return (
              <div key={inv.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${tem ? "border-[#12A876]/50 bg-[#12A876]/8" : "border-white/8 bg-[#0E1512]"}`}>
                <span className="text-2xl w-10 text-center">{inv.icone}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-bold text-[#F2F5F3]">{inv.nome} {inv.luxo && <span className="rp-chip ml-1" style={{ color: "#F0A99E", background: "rgba(227,107,91,.14)" }}>Luxo</span>}</div>
                  <div className="text-[13px] text-[#8FA39A] leading-snug">{inv.desc}</div>
                </div>
                {tem ? <span className="text-[13px] font-bold text-[#7FE3BC]">Seu</span> : (
                  <button disabled={!pode} onClick={() => onComprar(inv.id)} className="rp-btn rp-prim !min-h-[44px] px-3 text-[13px] whitespace-nowrap">{formatarValor(inv.custo)}</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- fim de carreira ---------- */
function CartaFinal({ c }) {
  const L = c.legado || calcularLegado(c);
  const t = c.titulos;
  const totalTitulos = c.lista.filter((x) => x.tipo !== "bolaOuro").length;
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

function PosCarreira({ c, onEscolher }) {
  if (c.posCarreira) {
    return (
      <div className="rp-painel p-5" style={{ borderColor: `${c.posCarreira.cor}66` }}>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Depois da bola</div>
        <div className="display text-base mt-2" style={{ color: c.posCarreira.cor }}>{c.posCarreira.icone} {c.posCarreira.nome}</div>
        <p className="text-[17px] text-[#C9D3CE] mt-2 leading-snug">{c.posCarreira.epilogo}</p>
      </div>
    );
  }
  return (
    <div className="rp-painel p-4">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">E agora? O que vem depois da bola</div>
      <div className="grid gap-2 mt-3">
        {caminhosPosCarreira(c).map((p) => (
          <button key={p.id} disabled={!p.disponivel} onClick={() => onEscolher(p.id)} className="rp-opcao px-4 py-3 disabled:opacity-40 disabled:hover:translate-y-0">
            <div className="font-bold text-[16px] text-[#F2F5F3]">{p.icone} {p.nome}</div>
            <div className="text-[14px] text-[#8FA39A]">{p.disponivel ? p.desc : `Requer: ${p.requisito}`}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TelaFim({ c, onNova, onSair, onPosCarreira }) {
  const L = c.legado || calcularLegado(c);
  const [copiado, setCopiado] = useState(false);
  const clubes = [];
  c.temporadas.forEach((s) => {
    const ult = clubes[clubes.length - 1];
    if (ult && ult.nome === s.clube) { ult.ate = s.ano; ult.jogos += s.jogos; ult.gols += s.gols; ult.titulos += s.titulos.filter((x) => x.tipo !== "bolaOuro" && x.tipo !== "copaMundo" && x.tipo !== "continentalSelecao").length; }
    else clubes.push({ nome: s.clube, de: s.ano, ate: s.ano, jogos: s.jogos, gols: s.gols, emp: s.emprestado, titulos: s.titulos.filter((x) => x.tipo !== "bolaOuro" && x.tipo !== "copaMundo" && x.tipo !== "continentalSelecao").length });
  });
  const proximo = NIVEIS_LEGADO.find((n) => n.min > L.pontos);
  const rotulos = { numeros: "Números em campo", titulos: "Títulos por clubes", selecao: "Seleção", premios: "Prêmios individuais", auge: "Auge técnico", torcida: "Idolatria e legado" };
  const porTipo = ORDEM_TIPOS.map((t) => ({ tipo: t, n: c.lista.filter((x) => x.tipo === t).length })).filter((g) => g.n);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(textoCompartilhar(c)); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { setCopiado(false); }
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <div className="text-center -mx-4 -mt-6 px-4 pt-24 pb-6" style={{ background: `linear-gradient(180deg, rgba(14,21,18,.1) 0%, rgba(14,21,18,.55) 55%, #0E1512 100%), url(${ARTE.porDoSol}) center 65%/cover` }}>
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#E1E6E3]">Fim de carreira · {c.idade - 1} anos</div>
        <h2 className="display text-xl mt-2" style={{ color: L.nivel.cor, textShadow: "0 2px 14px rgba(0,0,0,.9), 0 0 2px rgba(0,0,0,.8)" }}>{L.nivel.icone} {L.nivel.nome}</h2>
        <p className="text-[17px] text-[#C9D3CE] mt-1">{L.nivel.desc}</p>
      </div>
      <CartaFinal c={c} />
      <button onClick={copiar} className="rp-btn rp-ouro display text-sm">{copiado ? "Copiado!" : "Copiar resumo para compartilhar"}</button>

      <PosCarreira c={c} onEscolher={onPosCarreira} />

      <div className="grid grid-cols-2 gap-2">
        <div className="rp-painel px-4 py-3"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">GANHOU NA CARREIRA</div><div className="font-stat text-lg text-[#F2F5F3]">{formatarValor(c.ganhosTotais || 0)}</div></div>
        <div className="rp-painel px-4 py-3"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">PATRIMÔNIO FINAL</div><div className="font-stat text-lg text-[#EBC557]">{formatarValor(c.patrimonio || 0)}</div></div>
      </div>

      {porTipo.length > 0 && (
        <div className="rp-painel p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Sala de troféus</div>
          <div className="grid grid-cols-2 gap-2">
            {porTipo.map((g) => (
              <div key={g.tipo} className="rounded-2xl bg-[#0E1512] border border-white/5 p-3 flex items-center gap-3">
                <IconeTitulo tipo={g.tipo} size={34} />
                <div><div className="font-stat text-xl text-[#F2F5F3] leading-none">{g.n}</div><div className="text-[13px] text-[#8FA39A] leading-tight">{ROTULO_TIPO[g.tipo]}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <ol className="flex flex-col gap-2.5">
          {clubes.map((k, i) => (
            <li key={i} className="flex items-center gap-3">
              <Escudo nome={k.nome} size={24} />
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-semibold text-[#F2F5F3] truncate">{k.nome}{k.emp ? " (empréstimo)" : ""}</div>
                <div className="text-[13px] text-[#8FA39A]">{k.de === k.ate ? k.de : `${k.de}–${k.ate}`} · {k.jogos} jogos · {k.gols} gols{k.titulos ? ` · ${k.titulos} título(s)` : ""}</div>
              </div>
              {(c.torcida[k.nome] ?? 0) >= 75 && <span className="rp-chip" style={{ color: "#7FE3BC", background: "rgba(18,168,118,.16)" }}>Ídolo</span>}
            </li>
          ))}
        </ol>
      </div>

      {(c.marcos || []).length > 0 && (
        <div className="rp-painel p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Momentos da carreira</div>
          <ol className="flex flex-col gap-2.5 border-l border-[#2A3A33] ml-2 pl-4">
            {c.marcos.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[25px] top-0.5 text-base">{m.icone}</span>
                <div className="text-[15px] font-bold text-[#F2F5F3]">{m.titulo} <span className="font-stat font-normal text-[#5E7068]">{m.ano}</span></div>
                <div className="text-[14px] text-[#8FA39A]">{m.texto}</div>
              </li>
            ))}
          </ol>
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
  // etapas: criacao → evento(+foco) → (momento) → (festa) → resumo → (traco) → evento … → fim
  const [estado, setEstado] = useState(() => carregarRapido() || { etapa: "criacao" });
  const [estanteAberta, setEstanteAberta] = useState(false);
  const [apresentacao, setApresentacao] = useState(null);
  const [patrimonioAberto, setPatrimonioAberto] = useState(false);
  const { etapa, c, card, evento, resultado, opcoesTraco, fila } = estado;

  useEffect(() => {
    if (etapa === "criacao") apagarRapido();
    else salvarRapido(estado);
  }, [estado, etapa]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [etapa, evento?.id]);

  const criar = (dados) => setEstado({ etapa: "evento", c: criarJogador(dados), evento: null, resultado: null });

  const aposFechar = (f) => {
    const festa = f.card.titulos.length > 0 || f.card.bola.pos <= 3;
    setEstado({ etapa: festa ? "festa" : "resumo", c: f.c, card: f.card });
  };
  const jogar = () => {
    const { c: c2, card: k, momento } = jogarTemporada(c);
    if (momento) setEstado({ etapa: "momento", c: c2, card: k });
    else aposFechar(fecharTemporada(c2, k));
  };
  const fimMomento = (acertou) => aposFechar(fecharTemporada(c, aplicarMomento(card, acertou)));

  const continuar = () => {
    if (precisaEscolherTraco(c)) return setEstado({ etapa: "traco", c, card, opcoesTraco: opcoesDeTraco(c).map((t) => t.id) });
    irParaEvento(c);
  };
  const irParaEvento = (cc) => setEstado({ etapa: "evento", c: cc, evento: sortearEvento(cc), resultado: null, fila: true });
  const escolherT = (id) => irParaEvento(escolherTraco(c, id));
  // escolha com negociação: abre a mesa antes de aplicar a opção
  const escolherEvento = (opId) => {
    const op = evento.opcoes.find((o) => o.id === opId);
    if (op?.negociar) { setEstado((st) => ({ ...st, etapa: "negociacao", neg: iniciarNegociacao(c, op.negociar), negOp: opId, aviso: null })); return; }
    aplicarEscolha(c, opId, null);
  };
  const aplicarEscolha = (cBase, opId, extra) => {
    const r = resolverEvento(cBase, evento, opId, extra);
    // fila: depois do evento principal, a janela de transferências pode abrir também
    const extraEv = fila ? janelaExtra(r.c, evento.id) : null;
    setEstado({ etapa: "evento", c: r.c, evento, resultado: r.resultado || "Decisão tomada.", proximo: extraEv, fila: false });
    if (r.c.clubeNome !== c.clubeNome) {
      const clube = clubeDe(r.c.clubeNome);
      setApresentacao({ clube, grande: clube.forca > clubeDe(c.clubeNome).forca + 3, deOnde: clubeDe(c.clubeNome), contrato: r.c.contrato });
    }
  };
  const ajustarNeg = (campo, dir) => setEstado((st) => ({ ...st, neg: ajustarNegociacao(st.neg, campo, dir) }));
  const assinar = () => {
    const op = evento.opcoes.find((o) => o.id === estado.negOp);
    const f = fecharNegociacao(c, estado.neg);
    aplicarEscolha(f.c, estado.negOp, { contrato: f.contrato, luvas: op?.negociar?.luvas ? Math.round(f.contrato.salario * 0.5) : 0 });
  };
  const sairNeg = () => {
    const n = estado.neg;
    // diretoria saiu da mesa (ou você saiu): essa porta fecha, as outras opções continuam
    const restantes = evento.opcoes.filter((o) => o.id !== estado.negOp);
    const aviso = n.colapsou ? `O ${n.clube} encerrou a negociação. Essa porta fechou.` : `Você saiu da mesa com o ${n.clube}.`;
    const cNovo = n.colapsou ? { ...c, repNeg: Math.min(60, (c.repNeg || 0) + 6) } : c;
    setEstado((st) => ({ ...st, etapa: "evento", c: cNovo, evento: { ...evento, opcoes: restantes }, neg: null, negOp: null, aviso }));
  };
  const comprar = (id) => { const r = comprarInvestimento(c, id); if (r.ok) setEstado((st) => ({ ...st, c: r.c })); };
  const proximoEvento = () => setEstado((s) => ({ ...s, evento: s.proximo, resultado: null, proximo: null }));
  const mudarFoco = (id) => setEstado((s) => ({ ...s, c: definirFoco(s.c, id) }));
  const encerrar = () => setEstado({ etapa: "fim", c: aposentar(c) });
  const nova = () => setEstado({ etapa: "criacao" });

  const mostrarCabecalho = etapa !== "criacao" && etapa !== "fim";
  return (
    <div className="rp">
      <style>{ESTILO_BASE}</style>
      <Cabecalho c={mostrarCabecalho ? c : null} onSair={onSair} onEstante={() => setEstanteAberta(true)} />
      <main className="pb-10">
        {etapa === "criacao" && <TelaCriacao onCriar={criar} />}
        {etapa === "evento" && (
          <>
            {!evento && c.temporadas.length === 0 && (
              <div className="max-w-xl mx-auto px-4 pt-6 rp-entra">
                <h2 className="display text-lg text-[#F2F5F3]">A história começa aqui</h2>
                <p className="text-[17px] text-[#8FA39A] mt-1">{c.nome}, {c.idade} anos, {posicaoDe(c.posicao).label.toLowerCase()} da base do {c.clubeNome}. {origemDe(c.origem) ? `${origemDe(c.origem).nome}. ` : ""}Perfil: {personaDe(c.personalidade).label.toLowerCase()}. Empresário: {(EMPRESARIOS.find((e) => e.id === c.empresario) || EMPRESARIOS[0]).nome.toLowerCase()}.</p>
              </div>
            )}
            <TelaEvento c={c} evento={evento} resultado={resultado} temMais={!!estado.proximo} aviso={estado.aviso} onEscolher={escolherEvento} onProximo={proximoEvento} onFoco={mudarFoco} onJogar={jogar} onPatrimonio={() => setPatrimonioAberto(true)} />
          </>
        )}
        {etapa === "negociacao" && estado.neg && <TelaNegociacao c={c} n={estado.neg} onAjustar={ajustarNeg} onAssinar={assinar} onSair={sairNeg} />}
        {etapa === "momento" && <TelaPenalti c={c} momento={card.pendente} onFim={fimMomento} />}
        {etapa === "festa" && <TelaFesta c={c} card={card} onFim={() => setEstado({ etapa: "resumo", c, card })} />}
        {etapa === "resumo" && <TelaResumo c={c} card={card} onContinuar={continuar} onAposentar={encerrar} onRever={() => setEstado({ etapa: "festa", c, card })} />}
        {etapa === "traco" && <TelaTraco c={c} opcoes={(opcoesTraco || []).map(tracoDe).filter(Boolean)} onEscolher={escolherT} />}
        {etapa === "fim" && <TelaFim c={c} onNova={nova} onSair={onSair} onPosCarreira={(id) => setEstado((st) => ({ ...st, c: escolherPosCarreira(st.c, id) }))} />}
      </main>
      {estanteAberta && c && <Estante c={c} onFechar={() => setEstanteAberta(false)} />}
      {patrimonioAberto && c && <Patrimonio c={c} onComprar={comprar} onFechar={() => setPatrimonioAberto(false)} />}
      {apresentacao && (
        <ApresentacaoNovoClube clube={apresentacao.clube} nome={c.nome} numero={numeroCamisa(c.posicao)} posicao={posicaoDe(c.posicao).label}
          idade={c.idade} grandeChegada={apresentacao.grande} deOnde={apresentacao.deOnde} contrato={apresentacao.contrato} onConcluir={() => setApresentacao(null)} />
      )}
    </div>
  );
}
