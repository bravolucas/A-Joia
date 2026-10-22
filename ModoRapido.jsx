import React, { useEffect, useRef, useState } from "react";
import { ARTE, ARTE_EVENTO } from "./arte.js";
import { POSICOES, NACIONALIDADES, PERSONALIDADES, EMPRESARIOS } from "./data.js";
import { Gema, ClubDot, Brasao, Confetti, ApresentacaoNovoClube, FreeKickMini, PasseMini } from "./components.jsx";
import { calcularSucessoFalta, tipoResultadoFalta } from "./lib.js";
import { TacaCompeticao } from "./trofeus.jsx";
import {
  criarJogador, jogarTemporada, aplicarMomento, fecharTemporada, sortearEvento, resolverEvento, janelaExtra,
  precisaEscolherTraco, opcoesDeTraco, escolherTraco, tracoDe, podeAposentar, aposentadoriaForcada, aposentar,
  calcularLegado, NIVEIS_LEGADO, statusNoClube, valorMercado, formatarValor, ovrDe, clubeDe, ligaDe, posicaoDe, nacDe, personaDe,
  textoCompartilhar, salvarRapido, carregarRapido, apagarRapido, NACS_DESTAQUE, IDADES_TRACO, anoDeCopa, anoDeContinentalSelecao,
  nomeCopaContinental, chancePenalti, ORIGENS_RAPIDO, origemDe, FOCOS, focoDe, definirFoco,
  opcoesPretemporada, escolherPretemporada, textoCarta,
  iniciarNegociacao, ajustarNegociacao, fecharNegociacao, CAMPOS_NEGOCIACAO, fama_negociador,
  INVESTIMENTOS, comprarInvestimento, caminhosPosCarreira, escolherPosCarreira,
  chanceMomento, miniDaPosicao, PES, peDe, RITMOS, ritmoDe, numeroDe, NUMERO_PADRAO, opcoesClubeInicial, estadoMental,
  eventoDaJanela, segundoEvento, eventoImpasse, valorAtual, comparaSalario, textoEmoji, efeitosDaDecisao, LIGAS_EMPRESARIO, pedirLiga, deveTerColetiva, gerarColetiva, responderColetiva, codigoDoDia, dadosDoDia, dataDoCodigo, normalizarCodigo, lerHall, registrarNoHall, duelo,
} from "./rapido.js";

/* Estilo do seletor de modos e do Modo Rápido. Inclui as animações que as
   cenas reaproveitadas do Modo Carreira (apresentação no clube, confete) usam. */
export const ESTILO_BASE = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Oswald:wght@500;600;700&family=Unbounded:wght@700;900&family=Playfair+Display:wght@800;900&display=swap');
.rp{min-height:100vh;background:#0E1512;color:#E1E6E3;font-family:'Rajdhani',ui-sans-serif,system-ui,sans-serif;}
.rp .display{font-family:'Unbounded',sans-serif;}
.rp .font-stat{font-family:'bebas-neue','Oswald',sans-serif;letter-spacing:.02em;font-synthesis:none;}
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
.rp-bracos{transition:opacity .2s ease;}
@keyframes rpRede{0%{transform:scale(.3);opacity:0}35%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:.85}}
.rp-rede{animation:rpRede .6s .45s both;transform-box:fill-box;transform-origin:center;}
@keyframes rpFaisca{0%{transform:scale(.2);opacity:1}100%{transform:scale(1.6);opacity:0}}
.rp-faisca{animation:rpFaisca .5s .4s both;transform-box:fill-box;transform-origin:center;}
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
/* Títulos agrupados pelo nome da competição (Libertadores, Champions League, Brasileirão...), na ordem de importância */
function agruparTitulos(lista) {
  const grupos = [];
  ORDEM_TIPOS.forEach((tipo) => {
    lista.filter((x) => x.tipo === tipo).forEach((x) => {
      const nome = x.nome || ROTULO_TIPO[tipo];
      const g = grupos.find((y) => y.tipo === tipo && y.nome === nome);
      if (g) g.n += 1; else grupos.push({ tipo, nome, n: 1 });
    });
  });
  return grupos;
}
const RISCO = {
  seguro: { label: "Seguro", cor: "#7FE3BC", bg: "rgba(18,168,118,.14)" },
  equilibrado: { label: "Equilibrado", cor: "#8DB4F5", bg: "rgba(46,111,224,.16)" },
  arriscado: { label: "Arriscado", cor: "#F0A99E", bg: "rgba(227,107,91,.16)" },
};

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

function IconeTitulo({ tipo, size = 40, nome = null }) {
  if (tipo === "bolaOuro") return <BolaDourada size={size} />;
  return <TacaCompeticao tipo={tipo} size={size} nome={nome} />;
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
  const porTipo = agruparTitulos(c.lista);
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
            <div key={g.tipo + g.nome} className="rounded-2xl bg-[#0E1512] border border-white/5 p-3 flex items-center gap-3">
              <IconeTitulo tipo={g.tipo} nome={g.nome} size={34} />
              <div className="min-w-0">
                <div className="font-stat text-xl text-[#F2F5F3] leading-none">{g.n}</div>
                <div className="text-[13px] text-[#C9D3CE] leading-tight">{g.nome}</div>
              </div>
            </div>
          ))}
        </div>
        {c.lista.length > 0 && (
          <ul className="flex flex-col gap-1 mt-4">
            {[...c.lista].reverse().map((t, i) => <li key={i} className="text-[15px] text-[#C9D3CE]"><span className="font-stat text-[#8FA39A] mr-2">{t.ano}</span>{t.nome} <span className="text-[#7F918A]">· {t.clube}</span></li>)}
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
function BarraMental({ moral = 65, delta = null }) {
  const e = estadoMental(moral);
  return (
    <div className="mt-2 rounded-xl bg-[#0E1512]/70 px-3 py-2.5" title="Estado mental: afeta nota, evolução e risco de lesão">
      <div className="flex items-center justify-between text-[14px] mb-1.5">
        <span className="text-[#C9D3CE]">🧠 Cabeça</span>
        <span className="font-bold" style={{ color: e.cor }}>{e.icone} {e.nome} <span className="font-stat text-[#8FA39A]">{moral}</span>{delta ? <span className={delta > 0 ? "text-[#1BC28A]" : "text-[#E36B5B]"}> {delta > 0 ? `+${delta}` : delta}</span> : null}</span>
      </div>
      <Barra valor={moral} cor={e.cor} />
    </div>
  );
}

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
          <div className="text-[13px] text-[#8FA39A]">Camisa <span className="font-stat text-[#E1E6E3]">{numeroDe(c)}</span> · {peDe(c.pe).nome}</div>
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
        <BarraMental moral={c.moral} />
        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
          {[["VALOR", formatarValor(valorAtual(c))], ["TORCIDA", `${torcida}/100`], ["FAMA", `${c.fama}/100`]].map(([k, v]) => (
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

function MelhoresCarreiras() {
  const hall = lerHall().slice(0, 5);
  if (!hall.length) return null;
  return (
    <Secao titulo="Suas melhores carreiras">
      <ol className="rp-painel p-3 flex flex-col gap-2">
        {hall.map((h, i) => (
          <li key={h.id} className="flex items-center gap-3">
            <span className="font-stat text-lg w-6 text-center" style={{ color: i === 0 ? "#EBC557" : "#8FA39A" }}>{i + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] font-semibold text-[#F2F5F3] truncate">{h.nome} <span className="text-[13px] font-normal text-[#8FA39A]">· {h.posicao}{h.diario ? " · do dia" : ""}</span></div>
              <div className="text-[13px] text-[#8FA39A]">{h.icone} {h.nivel} · {h.gols} gols · {h.titulos} títulos</div>
            </div>
            <span className="font-stat text-lg" style={{ color: h.cor }}>{h.pontos}</span>
          </li>
        ))}
      </ol>
    </Secao>
  );
}

function TelaCriacao({ onCriar }) {
  const [modo, setModo] = useState("livre");
  const [nome, setNome] = useState("");
  const [nac, setNac] = useState("BRA");
  const [posicao, setPosicao] = useState("");
  const [personalidade, setPersonalidade] = useState("");
  const [origem, setOrigem] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pe, setPe] = useState("destro");
  const [numero, setNumero] = useState("");
  const [clube, setClube] = useState("");
  const [ritmo, setRitmo] = useState("normal");
  const [gerando, setGerando] = useState(false);
  // três bases possíveis, sorteadas de novo quando muda o país ou a origem
  const clubes = React.useMemo(() => (origem ? opcoesClubeInicial(nac, origem) : []), [nac, origem]);
  useEffect(() => { setClube(""); }, [nac, origem]);
  const destaque = NACS_DESTAQUE.map((id) => NACIONALIDADES.find((n) => n.id === id)).filter(Boolean);
  const outras = NACIONALIDADES.filter((n) => !NACS_DESTAQUE.includes(n.id)).sort((a, b) => a.label.localeCompare(b.label));
  const doDia = modo === "dia" ? dadosDoDia(codigoDoDia()) : null;
  const tentativasHoje = doDia ? lerHall().filter((h) => h.codigo === doDia.codigo) : [];
  const pronto = nome.trim().length >= 2 && (doDia || (posicao && personalidade && origem));

  const comecar = () => {
    setGerando(true);
    const dados = doDia ? { nome, ...doDia, ritmo }
      : { nome, nac, posicao, personalidade, origem, codigo: normalizarCodigo(codigo), pe, numero: numero || NUMERO_PADRAO[posicao], clube: clube || undefined, ritmo };
    // dá tempo de a tela mostrar o carregamento antes de gerar o mundo
    setTimeout(() => onCriar(dados), 30);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 rp-entra">
      <div>
        <h1 className="display text-xl text-[#F2F5F3]">Crie seu atleta</h1>
        <p className="text-[17px] text-[#8FA39A] mt-1">Você começa aos 16 anos. Cada temporada é uma tela, e cada escolha fica na sua história.</p>
      </div>

      <div className="grid grid-cols-2 gap-2" role="tablist">
        {[["livre", "Carreira livre", "Você monta o atleta"], ["dia", "Carreira do Dia", "Mesmo atleta e mesmo mundo para todos hoje"]].map(([id, t, d]) => (
          <button key={id} role="tab" aria-selected={modo === id} onClick={() => setModo(id)} className={`rp-opcao px-3 py-3 ${modo === id ? "sel" : ""}`}>
            <div className="font-bold text-[16px] text-[#F2F5F3]">{id === "dia" ? "📅 " : "✍️ "}{t}</div>
            <div className="text-[13px] leading-snug text-[#8FA39A] mt-0.5">{d}</div>
          </button>
        ))}
      </div>

      <Secao titulo="Nome">
        <input value={nome} onChange={(e) => setNome(e.target.value.slice(0, 24))} placeholder="Como a torcida vai te chamar"
          className="rp-painel px-4 min-h-[52px] text-lg text-[#F2F5F3] placeholder:text-[#7F918A] outline-none focus:border-[#12A876]" />
      </Secao>

      {doDia ? (
        <div className="rp-painel p-4 flex flex-col gap-3" style={{ borderColor: "rgba(216,180,74,.45)", background: "linear-gradient(135deg, rgba(216,180,74,.14), rgba(19,26,23,.9) 60%)" }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#EBC557]">Desafio de {dataDoCodigo(doDia.codigo)}</div>
          <div className="grid grid-cols-2 gap-2 text-[15px]">
            <div><span className="text-[#8FA39A]">País</span><div className="font-bold text-[#F2F5F3]">{nacDe(doDia.nac).label}</div></div>
            <div><span className="text-[#8FA39A]">Posição</span><div className="font-bold text-[#F2F5F3]">{posicaoDe(doDia.posicao).label}</div></div>
            <div><span className="text-[#8FA39A]">Origem</span><div className="font-bold text-[#F2F5F3]">{origemDe(doDia.origem)?.icone} {origemDe(doDia.origem)?.nome}</div></div>
            <div><span className="text-[#8FA39A]">Perfil</span><div className="font-bold text-[#F2F5F3]">{personaDe(doDia.personalidade).icone} {personaDe(doDia.personalidade).label}</div></div>
          </div>
          <p className="text-[14px] text-[#C9D3CE] leading-snug">Todo mundo que jogar hoje recebe este atleta, os mesmos clubes e os mesmos sorteios. Só as suas escolhas mudam a história. Compare o resultado com os amigos.</p>
          {tentativasHoje.length > 0 && <p className="text-[14px] text-[#EBC557]">Seu melhor hoje: <span className="font-stat">{Math.max(...tentativasHoje.map((h) => h.pontos))}</span> pts em {tentativasHoje.length} tentativa(s).</p>}
        </div>
      ) : (
        <>
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
            {posicao && <p className="text-[14px] text-[#8FA39A]">Nas finais, você decide {({ penalti: "no pênalti", falta: "na cobrança de falta", passe: "no passe do último lance", defesa: "defendendo o pênalti" })[miniDaPosicao(posicao)]}.</p>}
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

          <Secao titulo="Pé preferido">
            <div className="grid sm:grid-cols-3 gap-2">
              {PES.map((p) => (
                <button key={p.id} onClick={() => setPe(p.id)} className={`rp-opcao px-4 py-3 ${pe === p.id ? "sel" : ""}`}>
                  <div className="font-bold text-[16px] text-[#F2F5F3]">{p.icone} {p.nome}</div>
                  <div className="text-[13px] leading-snug text-[#8FA39A] mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </Secao>

          <Secao titulo="Número da camisa">
            <div className="flex items-center gap-2 flex-wrap">
              <input inputMode="numeric" value={numero} onChange={(e) => setNumero(e.target.value.replace(/\D/g, "").slice(0, 2).replace(/^0+/, ""))}
                placeholder={posicao ? String(NUMERO_PADRAO[posicao]) : "10"} aria-label="Número da camisa"
                className="rp-painel w-24 px-4 min-h-[52px] text-2xl font-stat text-center text-[#F2F5F3] placeholder:text-[#7F918A] outline-none focus:border-[#12A876]" />
              {[7, 9, 10, 11].map((n) => (
                <button key={n} onClick={() => setNumero(String(n))} className={`rp-opcao w-12 min-h-[44px] font-stat text-lg ${+numero === n ? "sel" : ""}`}>{n}</button>
              ))}
            </div>
          </Secao>

          {clubes.length > 0 && (
            <Secao titulo="Onde começar">
              <div className="grid gap-2">
                {clubes.map((x) => (
                  <button key={x.nome} onClick={() => setClube(x.nome)} className={`rp-opcao px-4 py-3 flex items-center gap-3 ${clube === x.nome ? "sel" : ""}`}>
                    <ClubDot club={x} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[16px] text-[#F2F5F3] truncate">{x.nome}</div>
                      <div className="text-[13px] text-[#8FA39A]">{ligaDe(x.liga).nome} · força <span className="font-stat">{x.forca}</span></div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[14px] text-[#8FA39A]">{clube ? "Clube menor: mais minutos cedo. Clube maior: vitrine e títulos, mas espaço difícil." : "Se não escolher, o clube é sorteado."}</p>
            </Secao>
          )}

          <Secao titulo="Código da carreira (opcional)">
            <input value={codigo} onChange={(e) => setCodigo(normalizarCodigo(e.target.value))} placeholder="Ex.: K7QX2M — deixe vazio para sortear"
              aria-label="Código da carreira" className="rp-painel px-4 min-h-[52px] text-lg font-stat tracking-widest text-[#F2F5F3] placeholder:text-[#7F918A] placeholder:font-sans placeholder:tracking-normal placeholder:text-[15px] outline-none focus:border-[#12A876]" />
            <p className="text-[14px] text-[#8FA39A]">Recebeu o código de um amigo? Use o mesmo para jogar no mesmo mundo, com os mesmos sorteios.</p>
          </Secao>
        </>
      )}

      <Secao titulo="Ritmo">
        <div className="grid grid-cols-3 gap-2">
          {RITMOS.map((r) => (
            <button key={r.id} onClick={() => setRitmo(r.id)} className={`rp-opcao px-3 py-3 ${ritmo === r.id ? "sel" : ""}`}>
              <div className="font-bold text-[16px] text-[#F2F5F3]">{r.icone} {r.nome}</div>
              <div className="text-[12px] leading-snug text-[#8FA39A] mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </Secao>

      <button disabled={!pronto || gerando} onClick={comecar} className="rp-btn rp-prim display text-sm tracking-wide">
        {gerando ? "Montando o mundo do futebol…" : doDia ? "Jogar a Carreira do Dia" : "Começar carreira"}
      </button>

      <MelhoresCarreiras />
    </div>
  );
}

/* ---------- momento decisivo: pênalti, falta, passe ou defesa ---------- */
const ZONAS = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]; // [coluna, linha]
const NOME_MINI = { penalti: "Pênalti decisivo", falta: "Falta decisiva", passe: "Último lance", defesa: "Pênalti contra" };

function CabecalhoMomento({ c, momento }) {
  const mini = momento.mini || "penalti";
  return (
    <div className="text-center">
      <span className="rp-chip" style={{ color: "#EBC557", background: "rgba(216,180,74,.14)" }}>
        {momento.total > 1 ? `Desafio ${momento.ordem} de ${momento.total}` : "Momento decisivo"} · {NOME_MINI[mini]}
      </span>
      <h2 className="display text-lg text-[#F2F5F3] mt-3">{momento.titulo}</h2>
      <p className="text-[17px] text-[#8FA39A] mt-1">{momento.texto}</p>
    </div>
  );
}

function PlacarMomento({ ok, texto }) {
  return <div className={`display text-3xl rp-sobe ${ok ? "text-[#1BC28A]" : "text-[#E36B5B]"}`}>{texto}</div>;
}

/* Cena do gol: estádio ao fundo, trave com rede em profundidade e um goleiro de verdade */
const GZX = (col) => 70 + col * 80, GZY = (lin) => 66 + lin * 50;
function Goleiro({ cor, mergulho }) {
  // mergulho: null (pronto) | [col, lin]
  const est = !!mergulho && !(mergulho[0] === 1 && mergulho[1] === 1);
  return (
    <g>
      {/* sombra */}
      <ellipse cx="150" cy="151" rx="15" ry="2.5" fill="rgba(0,0,0,.35)" />
      {/* pernas */}
      <path d="M142 122 L138 146 L145 146 L148 124 Z" fill="#1B1E24" />
      <path d="M158 122 L162 146 L155 146 L152 124 Z" fill="#1B1E24" />
      <rect x="137" y="131" width="8" height="12" rx="2" fill={cor} opacity=".85" />
      <rect x="155" y="131" width="8" height="12" rx="2" fill={cor} opacity=".85" />
      <path d="M135 145 h11 v4 h-13 z" fill="#0E1512" /><path d="M154 145 h11 l2 4 h-13 z" fill="#0E1512" />
      {/* calção */}
      <path d="M139 113 h22 l2 12 h-11 l-2 -4 l-2 4 h-11 z" fill="#1B1E24" />
      {/* camisa */}
      <path d="M138 92 q12 -5 24 0 l3 22 h-30 z" fill={cor} />
      <path d="M138 92 q12 -5 24 0 l1 6 q-13 -4 -26 0 z" fill="#fff" opacity=".18" />
      <text x="150" y="110" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0E1512" opacity=".55">1</text>
      {/* braços prontos (abertos, na altura da cintura) */}
      <g className="rp-bracos" style={{ opacity: est ? 0 : 1 }}>
        <path d="M139 94 q-10 6 -15 16" stroke={cor} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M161 94 q10 6 15 16" stroke={cor} strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="123" cy="112" r="4.6" fill="#F2F5F3" stroke="#0E1512" strokeWidth="1" /><circle cx="177" cy="112" r="4.6" fill="#F2F5F3" stroke="#0E1512" strokeWidth="1" />
      </g>
      {/* braços esticados (no mergulho, acima da cabeça) */}
      <g className="rp-bracos" style={{ opacity: est ? 1 : 0 }}>
        <path d="M141 92 L136 62" stroke={cor} strokeWidth="6" strokeLinecap="round" />
        <path d="M159 92 L164 62" stroke={cor} strokeWidth="6" strokeLinecap="round" />
        <circle cx="135.5" cy="58" r="5" fill="#F2F5F3" stroke="#0E1512" strokeWidth="1" /><circle cx="164.5" cy="58" r="5" fill="#F2F5F3" stroke="#0E1512" strokeWidth="1" />
      </g>
      {/* cabeça */}
      <rect x="146.5" y="86" width="7" height="6" fill="#C99A78" />
      <circle cx="150" cy="80" r="8" fill="#D8A988" />
      <path d="M142 79 q1 -10 8 -10 q8 0 8 9 q-3 -4 -8 -4 q-5 0 -8 5 z" fill="#2A1C14" />
    </g>
  );
}
function CenaGol({ goleiro, res, bola, fora, podeEscolher, onZona }) {
  const cor = goleiro ? "#EBC557" : "#B8F23A";
  const m = res?.goleiro || null;
  // mergulho: desloca e gira o corpo inteiro em torno dos pés
  const dx = m ? (m[0] - 1) * 50 : 0;
  const alto = m && m[1] === 0;
  const dy = !m ? 0 : m[0] === 1 ? (alto ? -22 : 0) : alto ? -40 : -8;
  const rot = !m ? 0 : m[0] === 1 ? 0 : (m[0] === 0 ? -1 : 1) * (alto ? 58 : 74);
  const bx = bola ? GZX(bola[0]) + (fora ? (bola[0] - 1) * 46 : 0) : 150;
  const by = bola ? GZY(bola[1]) - (fora ? 48 : 0) : 192;
  const gol = res && ((!goleiro && res.resultado === "gol") || (goleiro && res.resultado === "gol"));
  const salvou = res?.resultado === "defesa";
  return (
    <svg viewBox="0 0 300 210" className="w-full rounded-xl" role="img" aria-label={goleiro ? "Gol: escolha para onde pular" : "Gol: escolha onde bater"}>
      <defs>
        <pattern id="rpMalha" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V7 M0 0 H7" stroke="rgba(255,255,255,.38)" strokeWidth=".7" />
        </pattern>
        <pattern id="rpMalhaLado" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V6 M0 0 H6" stroke="rgba(255,255,255,.22)" strokeWidth=".6" />
        </pattern>
        <linearGradient id="rpGrama" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C5A38" /><stop offset="1" stopColor="#0F3A23" /></linearGradient>
        <linearGradient id="rpTrave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".6" stopColor="#E3E7E5" /><stop offset="1" stopColor="#9AA3A0" /></linearGradient>
        <radialGradient id="rpBola" cx=".35" cy=".3" r=".75"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".7" stopColor="#E6E8E7" /><stop offset="1" stopColor="#9DA3A1" /></radialGradient>
        <filter id="rpDesfoque"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>
      {/* estádio ao fundo */}
      <image href={ARTE.estadioNoite} x="-20" y="-30" width="340" height="150" preserveAspectRatio="xMidYMid slice" opacity=".55" filter="url(#rpDesfoque)" />
      <rect x="0" y="0" width="300" height="120" fill="url(#rpGrama)" opacity=".0" />
      <rect x="0" y="100" width="300" height="110" fill="url(#rpGrama)" />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x="0" y={112 + k * 22} width="300" height="11" fill="#fff" opacity=".035" />)}
      {/* linhas do campo */}
      <path d="M0 150 H300" stroke="rgba(255,255,255,.75)" strokeWidth="1.4" />
      <path d="M62 150 L50 170 H250 L238 150" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.2" />
      <ellipse cx="150" cy="196" rx="3.2" ry="1.4" fill="rgba(255,255,255,.8)" />
      {/* rede: fundo, laterais e teto, com profundidade */}
      <rect x="46" y="44" width="208" height="102" fill="rgba(7,16,12,.55)" />
      <rect x="46" y="44" width="208" height="102" fill="url(#rpMalha)" />
      <path d="M30 34 L46 44 L46 146 L30 150 Z" fill="url(#rpMalhaLado)" stroke="rgba(255,255,255,.3)" strokeWidth=".6" />
      <path d="M270 34 L254 44 L254 146 L270 150 Z" fill="url(#rpMalhaLado)" stroke="rgba(255,255,255,.3)" strokeWidth=".6" />
      <path d="M30 34 L270 34 L254 44 L46 44 Z" fill="url(#rpMalhaLado)" stroke="rgba(255,255,255,.3)" strokeWidth=".6" />
      <path d="M46 146 L30 150 M254 146 L270 150" stroke="rgba(255,255,255,.35)" />
      {/* balanço da rede no gol */}
      {gol && bola && !fora && <ellipse className="rp-rede" cx={bx} cy={by} rx="24" ry="18" fill="url(#rpMalha)" stroke="rgba(255,255,255,.55)" strokeWidth=".8" />}
      {/* trave */}
      <rect x="26" y="30" width="248" height="5" rx="1.5" fill="url(#rpTrave)" />
      <rect x="26" y="30" width="5" height="121" rx="1.5" fill="url(#rpTrave)" />
      <rect x="269" y="30" width="5" height="121" rx="1.5" fill="url(#rpTrave)" />
      <rect x="31" y="35" width="238" height="3" fill="rgba(0,0,0,.25)" />
      {/* goleiro */}
      <g className="rp-goleiro" style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, transformOrigin: "150px 150px" }}>
        <Goleiro cor={cor} mergulho={m} />
      </g>
      {/* zonas de escolha */}
      {podeEscolher && ZONAS.map(([col, lin], i) => (
        <g key={i} onClick={() => onZona(i)} style={{ cursor: "pointer" }} role="button" aria-label={`${lin === 0 ? "Alto" : "Baixo"} ${["esquerda", "meio", "direita"][col]}`}>
          <rect x={GZX(col) - 37} y={GZY(lin) - 23} width="74" height="46" rx="8" fill={goleiro ? "rgba(216,180,74,.12)" : "rgba(18,168,118,.12)"} stroke={goleiro ? "rgba(235,197,87,.75)" : "rgba(27,194,138,.7)"} strokeDasharray="4 4" />
          <circle cx={GZX(col)} cy={GZY(lin)} r="5" fill={goleiro ? "#EBC557" : "#1BC28A"} />
        </g>
      ))}
      {/* faísca da defesa */}
      {salvou && bola && <circle className="rp-faisca" cx={bx} cy={by} r="10" fill="none" stroke="#F5D77A" strokeWidth="2.5" />}
      {/* bola */}
      <g className="rp-bola" style={{ transform: bola ? `translate(${bx - 150}px, ${by - 192}px) scale(.62)` : "none", transformOrigin: "150px 192px", opacity: fora && res ? 0.85 : 1 }}>
        <ellipse cx="150" cy="200" rx="7" ry="2" fill="rgba(0,0,0,.35)" style={{ opacity: bola ? 0 : 1 }} />
        <circle cx="150" cy="192" r="7.5" fill="url(#rpBola)" stroke="#2A2F2D" strokeWidth=".8" />
        <path d="M150 188.5 l3 2.2 -1.1 3.5 h-3.8 l-1.1 -3.5 z" fill="#1B1E24" />
        <path d="M143.6 190 l2 1.2 M156.4 190 l-2 1.2 M147 197.8 l1.4 -2 M153 197.8 l-1.4 -2" stroke="#1B1E24" strokeWidth="1" />
      </g>
    </svg>
  );
}

/* Pênalti (você bate) e defesa (você é o goleiro) usam o mesmo gol */
function TelaPenalti({ c, momento, onFim, goleiro = false }) {
  const [escolha, setEscolha] = useState(null);
  const [res, setRes] = useState(null);

  const chutar = (i) => {
    if (escolha != null) return;
    const [col, lin] = ZONAS[i];
    const bonus = (c.tracos || []).includes("decisao") ? 0.12 : 0;
    if (goleiro) {
      // você escolhe para onde pular; o batedor escolhe o canto dele
      const k = Math.random() < 0.15 ? 4 : [0, 2, 3, 5, 1][Math.floor(Math.random() * 5)];
      const [bCol, bLin] = ZONAS[k];
      const def = c.attrs.defesa;
      let resultado = "gol";
      if (bLin === 0 && Math.random() < 0.08) resultado = "fora";
      else if (bCol === col && Math.random() < (bLin === lin ? 0.86 : 0.55) + bonus + (def - 70) * 0.005) resultado = "defesa";
      setEscolha(k);
      setRes({ resultado, goleiro: [col, lin], ok: resultado !== "gol" });
      return;
    }
    const r = Math.random();
    const gCol = r < 0.4 ? 0 : r < 0.6 ? 1 : 2;
    const gLin = Math.random() < 0.55 ? 1 : 0;
    const fin = c.attrs.finalizacao;
    let resultado = "gol";
    if (lin === 0 && Math.random() < Math.max(0.04, 0.2 - (fin - 60) * 0.005)) resultado = "fora";
    else if (gCol === col && Math.random() < (gLin === lin ? 0.8 : 0.45) - bonus - (fin - 70) * 0.004) resultado = "defesa";
    setEscolha(i);
    setRes({ resultado, goleiro: [gCol, gLin], ok: resultado === "gol" });
  };

  useEffect(() => {
    if (!res) return undefined;
    const t = setTimeout(() => onFim(res.ok), 2200);
    return () => clearTimeout(t);
  }, [res, onFim]);

  const bola = escolha != null ? ZONAS[escolha] : null;
  const fora = res?.resultado === "fora";
  const textoRes = !res ? "" : goleiro
    ? (res.resultado === "defesa" ? "QUE DEFESA!" : res.resultado === "fora" ? "PRA FORA! É CAMPEÃO!" : "GOL DELES…")
    : (res.resultado === "gol" ? "GOOOL!" : res.resultado === "defesa" ? "DEFENDEU!" : "PRA FORA!");

  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <CabecalhoMomento c={c} momento={momento} />
      <div className="rp-painel p-3 overflow-hidden" style={{ background: "linear-gradient(#0F2A1F, #0B1F17)" }}>
        <CenaGol goleiro={goleiro} res={res} bola={bola} fora={fora} podeEscolher={escolha == null} onZona={chutar} />
      </div>
      <div className="text-center min-h-[64px]">
        {!res && (goleiro
          ? <p className="text-[17px] text-[#C9D3CE]">Toque no canto para onde vai pular. Defesa <span className="font-stat">{c.attrs.defesa}</span> · chance estimada <span className="font-stat">{Math.round(chanceMomento(c, "defesa") * 100)}%</span></p>
          : <p className="text-[17px] text-[#C9D3CE]">Toque no canto onde vai bater. Finalização <span className="font-stat">{c.attrs.finalizacao}</span> · chance estimada <span className="font-stat">{Math.round(chancePenalti(c) * 100)}%</span></p>)}
        {res && <PlacarMomento ok={res.ok} texto={textoRes} />}
      </div>
    </div>
  );
}

function TelaFalta({ c, momento, onFim }) {
  const [res, setRes] = useState(null);
  const bater = (zona) => {
    if (res) return;
    const bonus = (c.tracos || []).includes("decisao") ? 8 : 0;
    // no Modo Rápido a falta decisiva é um pouco mais generosa que a do jogo completo
    const gol = calcularSucessoFalta(c.attrs.finalizacao + bonus + 6, c.attrs.drible + bonus);
    setRes({ gol, zona, tipo: tipoResultadoFalta(gol, zona) });
  };
  useEffect(() => {
    if (!res) return undefined;
    const t = setTimeout(() => onFim(res.gol), 2600);
    return () => clearTimeout(t);
  }, [res, onFim]);
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <CabecalhoMomento c={c} momento={momento} />
      <div className="rp-painel p-3 overflow-hidden flex justify-center" style={{ background: "linear-gradient(#0F2A1F, #0B1F17)" }}>
        <FreeKickMini onPick={bater} resultado={res} />
      </div>
      <div className="text-center min-h-[64px]">
        {!res && <p className="text-[17px] text-[#C9D3CE]">Escolha onde colocar a bola. Finalização <span className="font-stat">{c.attrs.finalizacao}</span> · drible <span className="font-stat">{c.attrs.drible}</span> · chance estimada <span className="font-stat">{Math.round(chanceMomento(c, "falta") * 100)}%</span></p>}
        {res && <PlacarMomento ok={res.gol} texto={res.gol ? "GOLAÇO DE FALTA!" : res.tipo === "Barreira" ? "NA BARREIRA!" : res.tipo === "Trave" ? "NA TRAVE!" : res.tipo === "Defesa" ? "DEFENDEU!" : "PRA FORA!"} />}
      </div>
    </div>
  );
}

function TelaPasse({ c, momento, onFim }) {
  const [res, setRes] = useState(null);
  const bonus = (c.tracos || []).includes("decisao") ? 8 : 0;
  useEffect(() => {
    if (!res) return undefined;
    const t = setTimeout(() => onFim(res.gol), 2200);
    return () => clearTimeout(t);
  }, [res, onFim]);
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <CabecalhoMomento c={c} momento={momento} />
      <div className="rp-painel p-3 overflow-hidden flex justify-center" style={{ background: "linear-gradient(#0F2A1F, #0B1F17)" }}>
        <PasseMini atributoPasse={c.attrs.passe + bonus + 6} onResultado={(r) => setRes(r)} />
      </div>
      <div className="text-center min-h-[64px]">
        {!res && <p className="text-[17px] text-[#C9D3CE]">Você é o jogador dourado. Toque num companheiro livre, longe dos adversários de vermelho. Passe <span className="font-stat">{c.attrs.passe}</span> · chance estimada <span className="font-stat">{Math.round(chanceMomento(c, "passe") * 100)}%</span></p>}
        {res && <PlacarMomento ok={res.gol} texto={res.gol ? "ASSISTÊNCIA! GOL!" : "INTERCEPTADO!"} />}
      </div>
    </div>
  );
}

function TelaMomento({ c, momento, onFim }) {
  const mini = momento.mini || "penalti";
  if (mini === "falta") return <TelaFalta c={c} momento={momento} onFim={onFim} />;
  if (mini === "passe") return <TelaPasse c={c} momento={momento} onFim={onFim} />;
  return <TelaPenalti c={c} momento={momento} onFim={onFim} goleiro={mini === "defesa"} />;
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
        <div style={{ animation: "floatY 2.6s ease-in-out infinite" }}><IconeTitulo tipo={titulo.tipo} nome={titulo.nome} size={120} /></div>
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

const NOME_TIT_RIVAL = { liga: "a liga", copa: "a copa nacional", continental: "a continental", copaMundo: "a Copa do Mundo" };
function PainelRival({ c, card }) {
  const r = c.rival, l = card.rival;
  const cor = clubeDe(l.clube).cor || "#E36B5B";
  const comp = [["Temporada", `${card.gols}G ${card.assist}A`, `${l.gols}G ${l.assist}A`], ["Carreira", `${c.totais.gols} gols`, `${r.totais.gols} gols`], ["OVR", card.ovrDepois, l.ovr]];
  const noticia = l.aposentou ? `${r.nome} anunciou a aposentadoria.`
    : l.bola === 1 ? `${r.nome} levou a Bola de Ouro.`
    : l.titulos.length ? `${r.nome} ganhou ${l.titulos.map((t) => NOME_TIT_RIVAL[t]).join(" e ")} pelo ${l.clube}.`
    : l.mudou ? `${r.nome} trocou o ${l.mudou} pelo ${l.clube}.`
    : l.bola && l.bola <= 3 ? `${r.nome} ficou em ${l.bola}º na Bola de Ouro.` : null;
  return (
    <div className="rp-painel p-4" style={{ borderColor: "rgba(227,107,91,.35)", background: "linear-gradient(135deg, rgba(227,107,91,.12), rgba(19,26,23,.9) 55%)" }}>
      <div className="flex items-center gap-3">
        <span className="text-xl" aria-hidden="true">⚔️</span>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#F0A99E]">Seu rival de geração</div>
          <div className="text-[16px] font-bold text-[#F2F5F3] truncate">{r.nome} <span className="font-normal text-[14px] text-[#8FA39A]">· {nacDe(r.nac).label} · {r.posicao}</span></div>
        </div>
        <ClubDot club={clubeDe(l.clube)} size={30} />
      </div>
      {noticia && <p className="text-[15px] text-[#C9D3CE] mt-2">{noticia}</p>}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 mt-3 text-[15px] items-center">
        <div className="text-[12px] font-bold tracking-wider text-[#7FE3BC] text-right">VOCÊ</div><div /><div className="text-[12px] font-bold tracking-wider" style={{ color: "#F0A99E" }}>ELE</div>
        {comp.map(([k, a, b]) => (
          <React.Fragment key={k}>
            <div className="font-stat text-right text-[#F2F5F3]">{a}</div>
            <div className="text-[12px] text-[#8FA39A] text-center">{k}</div>
            <div className="font-stat text-[#F2F5F3]" style={{ borderLeft: `3px solid ${cor}`, paddingLeft: 6 }}>{b}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* Curva compacta para a carta final (vai junto no PNG) */
function MiniCurva({ c, cor }) {
  const ovr = (c.temporadas || []).map((s) => s.ovrDepois ?? s.ovr);
  if (ovr.length < 2) return null;
  const W = 300, H = 46, mn = Math.min(...ovr) - 2, mx = Math.max(...ovr) + 2;
  const x = (i) => 4 + (i * (W - 8)) / (ovr.length - 1), y = (v) => 4 + (1 - (v - mn) / (mx - mn)) * (H - 8);
  const p = ovr.indexOf(Math.max(...ovr));
  const d = ovr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const ini = c.temporadas[0].idade, pico = c.temporadas[p].idade + 1, fim = c.temporadas[ovr.length - 1].idade + 1;
  return (
    <div className="mt-4 relative">
      <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] text-[#8FA39A]"><span>CURVA DA CARREIRA</span><span>{ini} → {pico} → {fim} anos</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-1" aria-hidden="true">
        <path d={`${d} L${x(ovr.length - 1)},${H} L${x(0)},${H} Z`} fill={`${cor}22`} />
        <path d={d} fill="none" stroke={cor} strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx={x(p)} cy={y(ovr[p])} r="3.5" fill="#EBC557" />
      </svg>
    </div>
  );
}

/* ---------- gráfico da carreira: OVR e valor ano a ano ---------- */
function GraficoCarreira({ c, altura = 132, titulo = "Sua curva" }) {
  const ts = c.temporadas || [];
  if (ts.length < 2) return null;
  const W = 340, H = altura, pl = 30, pr = 44, pt = 14, pb = 22;
  const ovr = ts.map((s) => s.ovrDepois ?? s.ovr);
  const val = ts.map((s) => s.valor || 0);
  const oMin = Math.max(40, Math.min(...ovr) - 3), oMax = Math.min(99, Math.max(...ovr) + 2);
  const vMax = Math.max(1, ...val);
  const x = (i) => pl + (i * (W - pl - pr)) / Math.max(1, ts.length - 1);
  const yo = (v) => pt + (1 - (v - oMin) / Math.max(1, oMax - oMin)) * (H - pt - pb);
  const yv = (v) => pt + (1 - v / vMax) * (H - pt - pb);
  const pico = ovr.indexOf(Math.max(...ovr));
  const linha = (arr, f) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${f(v).toFixed(1)}`).join(" ");
  const area = `${linha(val, yv)} L${x(val.length - 1)},${H - pb} L${x(0)},${H - pb} Z`;
  const idades = ts.map((s) => s.idade);
  return (
    <div className="rp-painel p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">{titulo}</span>
        <span className="flex items-center gap-3 text-[12px] text-[#C9D3CE]">
          <span className="flex items-center gap-1"><span className="w-3 h-[3px] rounded bg-[#1BC28A] inline-block" />OVR</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-[#D8B44A]/40 inline-block" />Valor</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-2" role="img" aria-label={`OVR de ${ovr[0]} a ${ovr[ovr.length - 1]}, pico de ${ovr[pico]} aos ${idades[pico] + 1} anos; valor máximo ${formatarValor(vMax)}`}>
        {[0, 0.5, 1].map((f) => <line key={f} x1={pl} x2={W - pr} y1={pt + f * (H - pt - pb)} y2={pt + f * (H - pt - pb)} stroke="rgba(255,255,255,.06)" />)}
        <path d={area} fill="rgba(216,180,74,.16)" />
        <path d={linha(val, yv)} fill="none" stroke="#D8B44A" strokeOpacity=".55" strokeWidth="1.5" />
        <path d={linha(ovr, yo)} fill="none" stroke="#1BC28A" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(pico)} cy={yo(ovr[pico])} r="4.5" fill="#EBC557" stroke="#0E1512" strokeWidth="1.5" />
        <text x={x(pico)} y={yo(ovr[pico]) - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#EBC557">{ovr[pico]}</text>
        <text x={pl - 6} y={yo(oMax) + 4} textAnchor="end" fontSize="10" fill="#8FA39A">{oMax}</text>
        <text x={pl - 6} y={yo(oMin) + 4} textAnchor="end" fontSize="10" fill="#8FA39A">{oMin}</text>
        <text x={W - 2} y={pt + 4} textAnchor="end" fontSize="9.5" fill="#B89A4A">{formatarValor(vMax).replace(/\s/g, "")}</text>
        {idades.map((a, i) => (i === 0 || i === idades.length - 1 || i === pico || a % 4 === 0) && <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill={i === pico ? "#EBC557" : "#8FA39A"}>{a + 1}</text>)}
      </svg>
      <p className="text-[13px] text-[#8FA39A] mt-1">Auge: <span className="font-stat text-[#EBC557]">{ovr[pico]}</span> de OVR aos {idades[pico] + 1} anos.</p>
    </div>
  );
}

/* Tabela ano a ano (idade, clube, títulos, OVR e números), como no Copero */
function TabelaAnoAno({ c }) {
  const [aberta, setAberta] = useState(false);
  const ts = c.temporadas || [];
  const linhas = aberta ? ts : ts.slice(-6);
  const corOvr = (o) => (o >= 85 ? "#D8B44A" : o >= 78 ? "#1BC28A" : o >= 70 ? "#2E6FE0" : "#5F6E68");
  return (
    <div className="rp-painel p-4">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-2">Ano a ano</div>
      <div className="grid grid-cols-[30px_1fr_auto_38px_30px_30px_30px] gap-x-2 items-center text-[11px] font-bold tracking-wider text-[#8FA39A] pb-1 border-b border-white/5">
        <span>IDADE</span><span>CLUBE</span><span /><span className="text-center">OVR</span><span className="text-right">J</span><span className="text-right">G</span><span className="text-right">A</span>
      </div>
      {linhas.map((s, i) => {
        const idx = ts.indexOf(s);
        const troca = idx > 0 && ts[idx - 1].clube !== s.clube;
        const o = s.ovrDepois ?? s.ovr;
        return (
          <div key={idx} className="grid grid-cols-[30px_1fr_auto_38px_30px_30px_30px] gap-x-2 items-center py-1.5 border-b border-white/5 text-[14px]">
            <span className="font-stat text-[#C9D3CE]">{s.idade}</span>
            <span className="flex items-center gap-1.5 min-w-0">{troca && <span className="text-[#8FA39A]" aria-label="clube novo">↳</span>}<ClubDot club={clubeDe(s.clube)} size={18} /><span className="truncate text-[#F2F5F3]">{s.clube}</span></span>
            <span className="flex -space-x-1.5">{s.titulos.filter((t) => t.tipo !== "bolaOuro").slice(0, 3).map((t, k) => <IconeTitulo key={k} tipo={t.tipo} nome={t.nome} size={16} />)}{s.titulos.some((t) => t.tipo === "bolaOuro") && <IconeTitulo tipo="bolaOuro" size={15} />}</span>
            <span className="font-stat text-center rounded-md text-[#0E1512] font-bold" style={{ background: corOvr(o) }}>{o}</span>
            <span className="font-stat text-right text-[#C9D3CE]">{s.jogos}</span>
            <span className="font-stat text-right text-[#F2F5F3]">{s.gols}</span>
            <span className="font-stat text-right text-[#C9D3CE]">{s.assist}</span>
          </div>
        );
      })}
      {ts.length > 6 && <button onClick={() => setAberta((v) => !v)} className="text-[14px] font-bold text-[#7FE3BC] min-h-[40px] mt-1">{aberta ? "Mostrar só as últimas" : `Ver as ${ts.length} temporadas`}</button>}
    </div>
  );
}

function TelaResumo({ c, card, onContinuar, onAposentar, onRever }) {
  const forcada = aposentadoriaForcada(c);
  // variação desde antes da pré-temporada (inclui o treino escolhido)
  const delta = card.ovrDepois - (card.ovrAntes ?? card.ovr);
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
                <IconeTitulo tipo={t.tipo} nome={t.nome} size={40} />
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

      {card.rival && c.rival && <PainelRival c={c} card={card} />}

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
              <span className="ml-auto text-[13px] text-[#7F918A] truncate">{r.clube}</span>
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
          {card.valorAntes != null && card.valor !== card.valorAntes && (
            <div className={`font-stat text-[13px] truncate ${card.valor > card.valorAntes ? "text-[#1BC28A]" : "text-[#E36B5B]"}`}>{card.valor > card.valorAntes ? "▲ +" : "▼ −"}{formatarValor(Math.abs(card.valor - card.valorAntes)).replace("€ ", "")}</div>
          )}
        </div>
      </div>

      {card.moral != null && <div className="-mt-2"><BarraMental moral={card.moral} delta={card.moralDelta} /></div>}

      <GraficoCarreira c={c} altura={112} />

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

      {(card.acesso || card.rebaixado) && (
        <div className="rp-painel px-4 py-3 flex items-center gap-3" style={{ borderColor: card.acesso ? "rgba(27,194,138,.45)" : "rgba(227,107,91,.45)", background: card.acesso ? "rgba(27,194,138,.08)" : "rgba(227,107,91,.08)" }}>
          <span className="text-3xl">{card.acesso ? "🎉" : "⬇️"}</span>
          <div>
            <div className="display text-sm" style={{ color: card.acesso ? "#1BC28A" : "#E36B5B" }}>{card.acesso ? "ACESSO!" : "REBAIXADO"}</div>
            <div className="text-[15px] text-[#C9D3CE]">O {card.clube} {card.acesso ? "sobe" : "cai"} pra {(card.acesso || card.rebaixado).para} em {card.ano + 1}.</div>
          </div>
        </div>
      )}

      {(card.ovrMotivos || []).length > 0 && (
        <div className="rp-painel px-4 py-3">
          <div className="text-[10px] font-bold tracking-wider text-[#8FA39A] mb-1.5">POR QUE SEU OVERALL MUDOU</div>
          <ul className="flex flex-col gap-1">
            {card.ovrMotivos.map((m, i) => (
              <li key={i} className="flex items-center justify-between text-[15px]">
                <span className="text-[#C9D3CE]">{m.txt}</span>
                <span className="font-stat" style={{ color: m.d > 0 ? "#1BC28A" : "#E36B5B" }}>{m.d > 0 ? `+${m.d}` : m.d}</span>
              </li>
            ))}
          </ul>
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
/* ---------- coletiva de imprensa ---------- */
function TelaColetiva({ c, coletiva, resposta, onResponder, onSeguir }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
      <div className="rp-painel overflow-hidden">
        <div aria-hidden="true" className="h-36 -mb-16" style={{ background: `linear-gradient(180deg, rgba(19,26,23,0) 0%, rgba(19,26,23,.75) 60%, rgba(19,26,23,1) 100%), url(${ARTE.coletiva}) center 45%/cover` }} />
        <div className="relative px-5 pb-4">
          <span className="rp-chip" style={{ color: "#9CC3FF", background: "rgba(46,111,224,.2)" }}>🎙️ Coletiva de imprensa</span>
          <div className="text-[13px] text-[#8FA39A] mt-3">{coletiva.veiculo} pergunta:</div>
          <p className="display text-[15px] leading-snug text-[#F2F5F3] mt-1">“{coletiva.pergunta}”</p>
        </div>
        {!resposta && (
          <div className="flex flex-col gap-2 p-4 pt-1">
            {coletiva.opcoes.map((o) => (
              <button key={o.id} onClick={() => onResponder(o.id)} className="rp-opcao px-4 py-3">
                <div className="font-bold text-[16px] text-[#F2F5F3]">{o.icone} {o.label}</div>
                <div className="text-[15px] text-[#8FA39A] mt-1 italic">{o.fala}</div>
              </button>
            ))}
          </div>
        )}
        {resposta && (
          <div className="px-5 pb-5 rp-entra">
            <p className="text-[17px] italic text-[#E1E6E3]">{resposta.fala}</p>
            {resposta.notas.map((n, i) => <p key={i} className="text-[16px] text-[#C9D3CE] mt-2">{n}</p>)}
            {resposta.efeitos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {resposta.efeitos.map((e) => <span key={e} className="rp-chip" style={{ color: "#C9D3CE", background: "rgba(255,255,255,.07)" }}>{e}</span>)}
              </div>
            )}
          </div>
        )}
      </div>
      {resposta && <button onClick={onSeguir} className="rp-btn rp-prim display text-sm">Continuar</button>}
      {!resposta && <button onClick={onSeguir} className="text-[15px] text-[#8FA39A] min-h-[44px]">Não dar entrevista</button>}
    </div>
  );
}

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
function CartaoEvento({ evento, resultado, efeitos, onEscolher, onPedirLiga }) {
  const foto = ARTE_EVENTO[evento.id];
  const [ligas, setLigas] = useState(false);
  return (
    <div className="rp-painel overflow-hidden">
      {foto && <div aria-hidden="true" className="h-32 -mb-14" style={{ background: `linear-gradient(180deg, rgba(19,26,23,0) 0%, rgba(19,26,23,.7) 60%, rgba(19,26,23,1) 100%), url(${foto}) center 45%/cover` }} />}
      <div className="relative px-5 pt-5 pb-4 flex items-start gap-4" style={{ background: foto ? "transparent" : evento.vida ? "linear-gradient(135deg, rgba(140,110,230,.18), transparent 70%)" : "linear-gradient(135deg, rgba(18,168,118,.16), transparent 70%)" }}>
        <span className="text-4xl w-16 h-16 rounded-2xl bg-[#0E1512]/70 border border-white/10 flex items-center justify-center shrink-0">{evento.icone}</span>
        <div className="min-w-0">
          {evento.vida && <span className="rp-chip mb-1.5 inline-block" style={{ color: "#C7B8F5", background: "rgba(140,110,230,.18)" }}>Vida pessoal · mexe com a cabeça</span>}
          <h2 className="display text-[15px] leading-snug text-[#F2F5F3]">{evento.titulo}</h2>
          <p className="text-[17px] text-[#C9D3CE] mt-1.5 leading-snug">{evento.texto}</p>
        </div>
      </div>
      {!resultado && (
        <div className="flex flex-col gap-2 p-4 pt-1">
          {evento.opcoes.map((o) => {
            const r = RISCO[o.risco] || RISCO.seguro;
            if (o.escolherLiga) {
              return (
                <div key={o.id} className="rounded-2xl border border-dashed border-[#2E6FE0]/50 bg-[#2E6FE0]/8">
                  <button onClick={() => setLigas((v) => !v)} aria-expanded={ligas} className="w-full text-left px-4 py-3 min-h-[52px]">
                    <div className="font-bold text-[17px] text-[#9CC3FF]">{o.label}</div>
                    <div className="text-[14px] text-[#8FA39A] mt-1">{o.dica} · uma vez por janela</div>
                  </button>
                  {ligas && (
                    <div className="grid grid-cols-2 gap-2 px-3 pb-3 rp-entra">
                      {LIGAS_EMPRESARIO.map((l) => (
                        <button key={l.id || "qualquer"} onClick={() => onPedirLiga(l.id)} className="rp-opcao px-3 py-2.5 text-left min-h-[48px]">
                          <span className="font-bold text-[15px] text-[#F2F5F3]">{l.icone} {l.nome}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button key={o.id} onClick={() => onEscolher(o.id)} className="rp-opcao px-4 py-3">
                <div className="flex items-center gap-2">
                  {o.oferta && <ClubDot club={clubeDe(o.oferta.clube)} size={20} />}
                  <span className="font-bold text-[17px] text-[#F2F5F3] flex-1">{o.label}</span>
                  <span className="rp-chip shrink-0" style={{ color: r.cor, background: r.bg }}>{r.label}</span>
                </div>
                {o.dica && <div className="text-[14px] text-[#8FA39A] mt-1">{o.dica}</div>}
                {o.chances && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {o.chances.map((x, i) => (
                      <span key={i} className="rp-chip" style={{ color: x.d > 0 ? "#7FE3BC" : x.d < 0 ? "#F0A99E" : "#C9D3CE", background: x.d > 0 ? "rgba(18,168,118,.16)" : x.d < 0 ? "rgba(227,107,91,.16)" : "rgba(255,255,255,.07)" }}>
                        {x.d > 0 ? `+${x.d} OVR` : x.d < 0 ? `−${-x.d} OVR` : "nada muda"} · {Math.round(x.p * 100)}%
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      {resultado && <p className={`px-5 ${efeitos?.length ? "pb-2" : "pb-5"} pt-1 text-[17px] font-semibold text-[#7FE3BC] rp-entra`}>→ {resultado}</p>}
      {resultado && efeitos?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pb-5 rp-entra" aria-label="Efeitos da decisão">
          {efeitos.map((e) => <span key={e.txt} className="rp-chip" style={{ color: e.bom ? "#7FE3BC" : "#F0A99E", background: e.bom ? "rgba(18,168,118,.16)" : "rgba(227,107,91,.16)" }}>{e.txt}</span>)}
        </div>
      )}
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

/* Pré-temporada (estilo El Ídolo): 3 cartas de treino, você escolhe em que melhora */
const NOME_ATTR = { velocidade: "VEL", finalizacao: "FIN", passe: "PAS", drible: "DRI", defesa: "DEF", fisico: "FIS" };
const NOME_ATTR_GOL = { finalizacao: "REF", drible: "ELA", defesa: "POS" };
function SeletorPretemporada({ c, onEscolher }) {
  const cartas = opcoesPretemporada(c);
  const escolhida = c.pretemporada?.ano === c.ano ? c.pretemporada.id : null;
  const rot = (a) => (c.posicao === "GOL" && NOME_ATTR_GOL[a]) || NOME_ATTR[a] || a;
  return (
    <div className="rp-painel p-4" style={escolhida ? undefined : { borderColor: "rgba(216,180,74,.45)" }}>
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Pré-temporada · escolha seu treino</div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {cartas.map((k0) => {
          const k = textoCarta(k0, c.posicao);
          const sel = escolhida === k.id;
          return (
            <button key={k.id} onClick={() => onEscolher(k.id)} aria-pressed={sel}
              className={`rp-opcao px-2 py-2.5 text-center min-h-[92px] flex flex-col items-center ${sel ? "sel" : ""}`}>
              <div className="text-xl leading-none">{k.icone}</div>
              <div className="text-[13px] font-bold text-[#F2F5F3] mt-1 leading-tight">{k.nome}</div>
              <div className="flex flex-wrap justify-center gap-x-1.5 mt-1">
                {Object.entries(k.ganhos).map(([a, g]) => (
                  <span key={a} className="font-stat text-[12px]" style={{ color: g > 0 ? "#1BC28A" : "#E36B5B" }}>{g > 0 ? "+" : ""}{g} {rot(a)}</span>
                ))}
                {k.desafio && <span className="font-stat text-[12px] text-[#EBC557]">+{Math.round(k.desafio * 100)}% desafios</span>}
                {k.moral && <span className="font-stat text-[12px] text-[#8DB4F5]">+moral</span>}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[14px] text-[#8FA39A] mt-2 min-h-[20px]">
        {escolhida ? textoCarta(cartas.find((k) => k.id === escolhida) || cartas[0], c.posicao).desc : "Sem treino escolhido, a temporada começa sem bônus."}
      </p>
    </div>
  );
}

/* Primeira vez: três dicas curtas antes da primeira temporada */
const CHAVE_DICAS = "ajoia_rapido_dicas_v1";
const DICAS = [
  { icone: "🎯", titulo: "Escolha o foco e jogue", texto: "Cada temporada é jogada de uma vez. Antes, escolha o foco: gols, evolução, títulos, vitrine ou preservar o corpo." },
  { icone: "🧠", titulo: "Cuide da cabeça", texto: "A barra de Cabeça sobe com boas temporadas e decisões leves, e cai com lesões, polêmicas e pressão. Cabeça boa joga melhor." },
  { icone: "⚔️", titulo: "Cada escolha fica na história", texto: "Entre as temporadas chegam propostas, coletivas e acontecimentos. Um rival da sua geração vai ser comparado a você até o fim." },
];
function DicasIniciais() {
  const [passo, setPasso] = useState(() => { try { return localStorage.getItem(CHAVE_DICAS) ? -1 : 0; } catch { return 0; } });
  if (passo < 0) return null;
  const fechar = () => { try { localStorage.setItem(CHAVE_DICAS, "1"); } catch { /* sem armazenamento */ } setPasso(-1); };
  const d = DICAS[passo];
  return (
    <div className="max-w-xl mx-auto px-4 pt-4">
      <div className="rp-painel p-4 rp-entra" key={passo} style={{ borderColor: "rgba(216,180,74,.45)" }} role="region" aria-label="Dicas para começar">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#EBC557]">Como funciona · {passo + 1}/{DICAS.length}</span>
          <button onClick={fechar} className="text-[14px] text-[#8FA39A] min-h-[40px] px-2">Pular</button>
        </div>
        <div className="flex gap-3 mt-1">
          <span className="text-3xl" aria-hidden="true">{d.icone}</span>
          <div><div className="font-bold text-[17px] text-[#F2F5F3]">{d.titulo}</div><p className="text-[16px] text-[#C9D3CE] leading-snug mt-0.5">{d.texto}</p></div>
        </div>
        <button onClick={() => (passo + 1 < DICAS.length ? setPasso(passo + 1) : fechar())} className="rp-btn rp-sec text-[16px] w-full mt-3">{passo + 1 < DICAS.length ? "Próxima dica" : "Entendi, bora jogar"}</button>
      </div>
    </div>
  );
}

/* Recorte de jornal que aparece depois de uma transferência */
function RecorteJornal({ manchete, transf }) {
  const clube = clubeDe(transf.para);
  return (
    <figure className="rp-entra mx-1 my-1" aria-label={`Manchete: ${manchete.titulo}`}
      style={{ transform: "rotate(-1.2deg)", background: "linear-gradient(175deg,#F6F1E4,#EAE2CE)", color: "#1B1A17", borderRadius: 4, boxShadow: "0 12px 30px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.6) inset", padding: "14px 16px 16px" }}>
      <div className="flex items-end justify-between border-b-2 border-[#1B1A17] pb-1">
        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: 20, letterSpacing: ".01em" }}>{manchete.jornal}</span>
        <span className="text-[11px] uppercase tracking-widest text-[#5B574E]">Edição de {manchete.ano}</span>
      </div>
      <div className="border-b border-[#1B1A17]/40 py-1 text-[10px] uppercase tracking-[0.25em] text-[#5B574E] flex justify-between"><span>Esportes</span><span>Mercado da bola</span></div>
      <div className="flex gap-3 mt-3 items-start">
        <div className="shrink-0 w-[68px] h-[78px] flex items-center justify-center" style={{ background: `repeating-radial-gradient(circle at 30% 30%, ${clube.cor || "#333"}33 0 1px, transparent 1px 4px), #D9D0BA`, filter: "grayscale(.35) contrast(1.1)" }}>
          <Brasao club={clube} size={48} />
        </div>
        <figcaption className="min-w-0">
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: 21, lineHeight: 1.08 }}>{manchete.titulo}</div>
        </figcaption>
      </div>
      <p className="mt-2 text-[14px] leading-snug text-[#2E2B25]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{manchete.linhaFina}</p>
      {manchete.despedida && (
        <p className="mt-2 pt-2 border-t border-dashed border-[#1B1A17]/40 text-[14px] leading-snug italic text-[#2E2B25]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          <span className="not-italic text-[11px] font-bold uppercase tracking-widest text-[#5B574E] mr-1">Despedida ·</span>{manchete.despedida}
        </p>
      )}
      <div className="mt-3 flex gap-2 text-[12px] font-bold uppercase tracking-wider" style={{ fontFamily: "Georgia, serif" }}>
        <span className="px-2 py-0.5 border border-[#1B1A17]">{transf.valor ? formatarValor(transf.valor) : "Sem custo"}</span>
        <span className="px-2 py-0.5 border border-[#1B1A17]/50 text-[#5B574E]">{transf.anos} anos de contrato</span>
      </div>
    </figure>
  );
}

function TelaEvento({ c, evento, resultado, efeitos, temMais, aviso, manchete, onEscolher, onPedirLiga, onProximo, onFoco, onPretemporada, onJogar, onPatrimonio }) {
  const torneio = c.idade >= 18 ? (anoDeCopa(c.ano) ? "Copa do Mundo" : anoDeContinentalSelecao(c.ano) ? nomeCopaContinental(c.nac) : null) : null;
  const pronto = !evento || resultado;
  return (
    <div className="max-w-xl mx-auto px-4 py-5 flex flex-col gap-4 rp-entra">
      {aviso && <div className="rp-painel px-4 py-3 text-[16px] text-[#F0A99E]" style={{ borderColor: "rgba(227,107,91,.35)" }}>{aviso}</div>}
      {evento && <CartaoEvento key={`${evento.id}:${evento.texto}`} evento={evento} resultado={resultado} efeitos={efeitos} onEscolher={onEscolher} onPedirLiga={onPedirLiga} />}
      {resultado && manchete && c.ultimaTransferencia && <RecorteJornal manchete={manchete} transf={c.ultimaTransferencia} />}
      {pronto && temMais && <button onClick={onProximo} className="rp-btn rp-prim display text-sm">Ver próxima notícia</button>}
      {pronto && !temMais && (
        <>
          <Ficha c={c} />
          <button onClick={onPatrimonio} className="rp-painel px-4 py-3 flex items-center gap-3 text-left hover:border-[#D8B44A]/50">
            <span className="text-2xl">💼</span>
            <span className="flex-1"><span className="block text-[13px] font-bold uppercase tracking-[0.15em] text-[#8FA39A]">Patrimônio</span><span className="font-stat text-lg text-[#EBC557]">{formatarValor(c.patrimonio || 0)}</span></span>
            <span className="text-[15px] font-bold text-[#EBC557]">Investir →</span>
          </button>
          <SeletorPretemporada c={c} onEscolher={onPretemporada} />
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
                {campo.id === "salario" && c.contrato?.salario > 0 && <div className="text-[12px] text-[#8FA39A]">Hoje: {formatarValor(c.contrato.salario)}/ano{comparaSalario(c, t.salario)}</div>}
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
/* ===== Artes do fim de carreira: imagens no lugar de emojis ===== */
const FOTO_NIVEL = { 0: ARTE.porDoSol, 90: ARTE.estadioNoite, 230: ARTE.torcida, 400: ARTE.refletores, 640: ARTE.confete, 950: ARTE.confete };
const fotoDoNivel = (nivel) => FOTO_NIVEL[nivel.min] || ARTE.porDoSol;
const FOTO_POS_CARREIRA = { tecnico: ARTE.estadioNoite, auxiliar: ARTE.tunel, embaixador: ARTE.torcida, comentarista: ARTE.coletiva, dirigente: ARTE.refletores, empresario: ARTE.contrato, afastar: ARTE.porDoSol };

function FotoMini({ src, size = 28, className = "" }) {
  return <span aria-hidden="true" className={`shrink-0 inline-block rounded-full border border-white/15 ${className}`} style={{ width: size, height: size, background: `url(${src}) center/cover` }} />;
}

/* clube onde jogou mais partidas */
function clubeDaVida(c) {
  const jogos = {};
  c.temporadas.forEach((s) => { jogos[s.clube] = (jogos[s.clube] || 0) + s.jogos; });
  return Object.entries(jogos).sort((a, b) => b[1] - a[1])[0]?.[0] || c.temporadas[c.temporadas.length - 1]?.clube;
}

/* Medalhão do nível de legado: taça ou gema para os maiores, escudo do clube da vida para os demais */
function EmblemaLegado({ c, L, size = 96 }) {
  const cor = L.nivel.cor;
  const interno = size * 0.62;
  let conteudo;
  if (L.nivel.min >= 950) conteudo = <Gema size={interno} />;
  else if (L.nivel.min >= 640) conteudo = (c.titulos.bolaOuro ? <BolaDourada size={interno} /> : <TacaCompeticao tipo={ORDEM_TIPOS.find((t) => t !== "bolaOuro" && c.titulos[t]) || "liga"} size={interno * 0.95} />);
  else {
    const idolo = Object.entries(c.torcida || {}).sort((a, b) => b[1] - a[1])[0];
    const clube = L.nivel.min >= 230 && idolo ? idolo[0] : clubeDaVida(c);
    conteudo = <span style={{ filter: L.nivel.min === 0 ? "grayscale(1) brightness(.85)" : undefined }}><Escudo nome={clube} size={interno} /></span>;
  }
  return (
    <div className="relative shrink-0 rounded-full p-[3px]" style={{ width: size, height: size, background: `conic-gradient(from 210deg, ${cor}, #0E1512 40%, ${cor} 70%, #0E1512 90%, ${cor})`, boxShadow: `0 0 ${size / 4}px ${cor}55` }} aria-hidden="true">
      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle at 50% 35%, #1E2A25, #0B1210 75%)" }}>{conteudo}</div>
    </div>
  );
}

/* Uma peça por temporada, com imagem: Bola de Ouro, taça, escudo do clube novo, lesão ou intensidade da temporada */
function PecaTemporada({ s, anterior, size = 36 }) {
  const titulo = s.titulos.find((t) => t.tipo !== "bolaOuro");
  const bola = s.titulos.some((t) => t.tipo === "bolaOuro");
  const lesao = s.lesao && s.jogos < 25;
  const novo = anterior && anterior.clube !== s.clube;
  const cor = s.cor || "#2A3A33";
  let fundo = "#1A211E", borda = "rgba(255,255,255,.06)", conteudo = null, rotulo = "temporada discreta";
  if (bola) { fundo = "radial-gradient(circle, #3A3015, #15120A)"; borda = "#D8B44A"; conteudo = <BolaDourada size={size * 0.72} />; rotulo = "Bola de Ouro"; }
  else if (titulo) { fundo = "radial-gradient(circle, #2A2617, #121510)"; borda = "rgba(216,180,74,.7)"; conteudo = <TacaCompeticao tipo={titulo.tipo} nome={titulo.nome} size={size * 0.6} />; rotulo = titulo.nome; }
  else if (lesao) { fundo = "repeating-linear-gradient(135deg, #3A1714 0 5px, #24100E 5px 10px)"; borda = "rgba(227,107,91,.55)"; rotulo = "lesão"; }
  else if (novo) { fundo = "#16201C"; borda = `${cor}AA`; conteudo = <Escudo nome={s.clube} size={size * 0.62} />; rotulo = `chegada ao ${s.clube}`; }
  else if (s.nota >= 7.2) { fundo = "#12A876"; rotulo = "grande temporada"; }
  else if (s.nota >= 6.6) { fundo = "rgba(18,168,118,.4)"; rotulo = "boa temporada"; }
  return (
    <div className="flex flex-col items-center gap-1" title={`${s.ano} · ${s.clube} · ${rotulo}`}>
      <div className="rounded-lg flex items-center justify-center overflow-hidden" style={{ width: size, height: size, background: fundo, border: `1px solid ${borda}` }}>{conteudo}</div>
      <span className="font-stat text-[11px] leading-none text-[#7F918A]">{String(s.ano).slice(2)}</span>
    </div>
  );
}

function FaixaTemporadas({ c }) {
  const leg = [
    [<BolaDourada size={14} />, "Bola de Ouro"], [<TacaCompeticao tipo="liga" size={12} />, "título"], [<Escudo nome={clubeDaVida(c)} size={14} />, "clube novo"],
    [<span className="w-3.5 h-3.5 rounded-sm" style={{ background: "repeating-linear-gradient(135deg, #3A1714 0 3px, #24100E 3px 6px)", border: "1px solid rgba(227,107,91,.55)" }} />, "lesão"],
    [<span className="w-3.5 h-3.5 rounded-sm bg-[#12A876]" />, "grande"], [<span className="w-3.5 h-3.5 rounded-sm bg-[#12A876]/40" />, "boa"], [<span className="w-3.5 h-3.5 rounded-sm bg-[#1A211E] border border-white/10" />, "discreta"],
  ];
  return (
    <>
      <div className="grid grid-cols-8 gap-x-1.5 gap-y-2.5 justify-items-center">
        {c.temporadas.map((s, i) => <PecaTemporada key={i} s={s} anterior={c.temporadas[i - 1]} />)}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
        {leg.map(([icone, nome]) => <span key={nome} className="inline-flex items-center gap-1.5 text-[12px] text-[#8FA39A]">{icone}{nome}</span>)}
      </div>
    </>
  );
}

/* Marcador com imagem para cada momento da carreira */
function MarcadorMomento({ c, m }) {
  const id = m.id || "";
  const clubeDoAno = c.temporadas.find((s) => s.ano === m.ano)?.clube;
  if (id.startsWith("idolo:") || id.startsWith("apelido:")) return <Escudo nome={id.split(":")[1]} size={26} />;
  if (id.startsWith("transf:") || id === "valor100") return <FotoMini src={ARTE.contrato} size={26} />;
  if (id === "primeiroTitulo") return <TacaCompeticao tipo={(c.lista.find((x) => x.tipo !== "bolaOuro") || {}).tipo || "liga"} size={20} />;
  if (id === "top10" || id === "podio") return <BolaDourada size={24} />;
  if (id === "ovr90") return <Gema size={24} />;
  if (id === "selecao") return <FotoMini src={ARTE.torcida} size={26} />;
  if (clubeDoAno) return <Escudo nome={clubeDoAno} size={26} />;
  return <span className="w-2.5 h-2.5 rounded-full bg-[#12A876]" />;
}

function CartaFinal({ c }) {
  const L = c.legado || calcularLegado(c);
  const t = c.titulos;
  const totalTitulos = c.lista.filter((x) => x.tipo !== "bolaOuro").length;
  return (
    <div className="rp-carta w-full rounded-[28px] p-[2px]" style={{ background: `linear-gradient(160deg, ${L.nivel.cor}, #0E1512 55%, ${L.nivel.cor})` }}>
      <div className="rounded-[26px] p-5 relative overflow-hidden" style={{ background: "linear-gradient(170deg, #17201C, #0E1512)" }}>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40" style={{ background: `linear-gradient(180deg, rgba(14,21,18,.35) 0%, rgba(23,32,28,.85) 70%, #17201C 100%), url(${fotoDoNivel(L.nivel)}) center/cover` }} />
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full opacity-20 blur-2xl" style={{ background: L.nivel.cor }} />
        <div className="flex items-start justify-between relative">
          <div>
            <div className="font-stat text-5xl font-bold leading-none" style={{ color: L.nivel.cor }}>{c.picoOvr}</div>
            <div className="text-sm font-bold tracking-widest text-[#C9D3CE] mt-1">{c.posicao} · #{numeroDe(c)}</div>
            <div className="text-[13px] text-[#8FA39A]">{nacDe(c.nac).label} · {peDe(c.pe).nome}</div>
          </div>
          <Gema size={64} />
        </div>
        <div className="display text-lg text-[#F2F5F3] mt-5 leading-tight relative">{c.nome}</div>
        {c.apelidos.length > 0 && <div className="text-[14px] text-[#8FA39A] italic">{c.apelidos.map((a) => `"${a.nome}"`).join(" · ")}</div>}
        {c.apelidos.some((a) => a.cantico) && <div className="text-[12px] text-[#8FA39A] mt-0.5">"{c.apelidos.filter((a) => a.cantico).slice(-1)[0].cantico}"</div>}
        <div className="mt-2 inline-flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full text-[14px] font-bold relative" style={{ background: `${L.nivel.cor}22`, color: L.nivel.cor, border: `1px solid ${L.nivel.cor}55` }}>
          <EmblemaLegado c={c} L={L} size={26} /> {L.nivel.nome}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5 relative">
          {[["JOGOS", c.totais.jogos], ["GOLS", c.totais.gols], ["ASSIST.", c.totais.assist], ["TÍTULOS", totalTitulos], ["BOLAS", t.bolaOuro || 0], ["COPAS", t.copaMundo || 0]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-black/25 py-2 text-center">
              <div className="font-stat text-lg text-[#F2F5F3] leading-none">{v}</div>
              <div className="text-[10px] font-bold tracking-wider text-[#8FA39A] mt-1">{k}</div>
            </div>
          ))}
        </div>
        <MiniCurva c={c} cor={L.nivel.cor} />
        {c.lenda && (
          <div className="mt-4 rounded-xl px-3 py-2 relative" style={{ background: "rgba(0,0,0,.28)", border: "1px solid rgba(255,255,255,.06)" }}>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#8FA39A]">VOCÊ FOI COMO</div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[17px] font-bold text-[#F2F5F3] truncate">{c.lenda.nome}</span>
              <span className="font-stat text-base" style={{ color: L.nivel.cor }}>{c.lenda.similaridade}%</span>
            </div>
          </div>
        )}
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#7F918A] mt-4 text-center">A JOIA · Modo Rápido · {c.temporadas[0]?.ano}–{c.ano - 1}</div>
        {c.codigo && <div className="text-[11px] tracking-[0.2em] uppercase text-[#7F918A] text-center mt-0.5">{c.diario ? `Carreira do Dia ${dataDoCodigo(c.codigo)}` : `Código ${c.codigo}`}</div>}
      </div>
    </div>
  );
}

function PosCarreira({ c, onEscolher }) {
  if (c.posCarreira) {
    return (
      <div className="rp-painel p-5" style={{ borderColor: `${c.posCarreira.cor}66` }}>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Depois da bola</div>
        <div className="-mx-5 mt-3 h-28" style={{ background: `linear-gradient(180deg, rgba(18,25,22,.1), #121916), url(${FOTO_POS_CARREIRA[c.posCarreira.id] || ARTE.porDoSol}) center/cover` }} aria-hidden="true" />
        <div className="display text-base -mt-4 relative" style={{ color: c.posCarreira.cor }}>{c.posCarreira.nome}</div>
        <p className="text-[17px] text-[#C9D3CE] mt-2 leading-snug">{c.posCarreira.epilogo}</p>
      </div>
    );
  }
  return (
    <div className="rp-painel p-4">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">E agora? O que vem depois da bola</div>
      <div className="grid gap-2 mt-3">
        {caminhosPosCarreira(c).map((p) => (
          <button key={p.id} disabled={!p.disponivel} onClick={() => onEscolher(p.id)} className="rp-opcao px-3 py-3 flex items-center gap-3 disabled:opacity-40 disabled:hover:translate-y-0">
            <span aria-hidden="true" className="shrink-0 w-14 h-14 rounded-xl border border-white/10" style={{ background: `url(${FOTO_POS_CARREIRA[p.id] || ARTE.porDoSol}) center/cover`, filter: p.disponivel ? undefined : "grayscale(1)" }} />
            <span className="min-w-0">
              <span className="block font-bold text-[16px] text-[#F2F5F3]">{p.nome}</span>
              <span className="block text-[14px] text-[#8FA39A]">{p.disponivel ? p.desc : `Requer: ${p.requisito}`}</span>
            </span>
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
  const rotulos = { numeros: "Números em campo", titulos: "Títulos por clubes", selecao: "Seleção", premios: "Prêmios individuais", auge: "Auge técnico", torcida: "Idolatria e legado", rival: "Duelo com o rival" };
  const porTipo = agruparTitulos(c.lista);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(textoCompartilhar(c)); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch { setCopiado(false); }
  };
  const [emojiOk, setEmojiOk] = useState(false);
  const emoji = textoEmoji(c);
  const compartilharEmoji = async () => {
    try {
      if (/Android|iPhone|iPad/i.test(navigator.userAgent) && navigator.share) await navigator.share({ text: emoji });
      else await navigator.clipboard.writeText(emoji);
      setEmojiOk(true); setTimeout(() => setEmojiOk(false), 2200);
    } catch { /* cancelado */ }
  };
  const cartaRef = useRef(null);
  const [imagem, setImagem] = useState("pronto");
  const du = duelo(c);
  const baixarCarta = async () => {
    if (!cartaRef.current) return;
    setImagem("gerando");
    try {
      const { toPng } = await import("html-to-image");
      const caixa = cartaRef.current.getBoundingClientRect();
      const opts = { pixelRatio: 3, cacheBust: true, backgroundColor: "#0E1512", width: Math.round(caixa.width), height: Math.round(caixa.height), style: { margin: "0" } };
      let url;
      try { url = await toPng(cartaRef.current, opts); } catch { url = await toPng(cartaRef.current, { ...opts, skipFonts: true }); }
      const arquivo = `a-joia-${c.nome.normalize("NFD").replace(/[^\w]+/g, "-").toLowerCase()}.png`;
      const blob = await (await fetch(url)).blob();
      const file = typeof File === "function" ? new File([blob], arquivo, { type: "image/png" }) : null;
      // no celular abre o menu de compartilhar; no computador baixa o arquivo
      if (file && /Android|iPhone|iPad/i.test(navigator.userAgent) && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Minha carreira em A JOIA", text: textoCompartilhar(c) });
      } else {
        const a = document.createElement("a");
        a.href = url; a.download = arquivo; document.body.appendChild(a); a.click(); a.remove();
      }
      setImagem("ok");
    } catch (e) {
      setImagem(e?.name === "AbortError" ? "pronto" : "erro");
    }
    setTimeout(() => setImagem("pronto"), 2500);
  };
  return (
    <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 rp-entra">
      <div className="text-center -mx-4 -mt-6 px-4 pt-16 pb-6 flex flex-col items-center" style={{ background: `linear-gradient(180deg, rgba(14,21,18,.15) 0%, rgba(14,21,18,.6) 55%, #0E1512 100%), url(${fotoDoNivel(L.nivel)}) center 60%/cover` }}>
        <EmblemaLegado c={c} L={L} size={104} />
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#E1E6E3] mt-4">Fim de carreira · {c.idade - 1} anos</div>
        <h2 className="display text-xl mt-2" style={{ color: L.nivel.cor, textShadow: "0 2px 14px rgba(0,0,0,.9), 0 0 2px rgba(0,0,0,.8)" }}>{L.nivel.nome}</h2>
        <p className="text-[17px] text-[#C9D3CE] mt-1">{L.nivel.desc}</p>
      </div>
      {c.hall && (
        <div className="rp-painel px-4 py-3 text-center text-[16px] text-[#C9D3CE]" style={{ borderColor: c.hall.posicao === 1 ? "rgba(216,180,74,.5)" : undefined }}>
          {c.hall.total === 1 ? <>Primeira carreira no seu ranking pessoal. Jogue de novo para tentar superá-la.</> : c.hall.posicao === 1 ? <b className="text-[#EBC557]">Sua melhor carreira até hoje!</b> : <>Esta é a sua <span className="font-stat text-[#EBC557]">{c.hall.posicao}ª</span> melhor carreira de {c.hall.total}.</>}
          {c.diario && <div className="text-[14px] text-[#8FA39A] mt-1">Carreira do Dia: {c.hall.melhorDoDia === 1 ? "seu melhor resultado hoje" : `${c.hall.melhorDoDia}º das suas ${c.hall.tentativasDoDia} tentativas de hoje`}.</div>}
        </div>
      )}
      <div ref={cartaRef} className="mx-auto w-full max-w-[364px] p-3 rounded-[32px]" style={{ background: "#0E1512" }}><CartaFinal c={c} /></div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={baixarCarta} disabled={imagem === "gerando"} className="rp-btn rp-ouro display text-xs">
          {imagem === "gerando" ? "Gerando…" : imagem === "ok" ? "Imagem pronta!" : imagem === "erro" ? "Não deu, tente de novo" : "Baixar carta (PNG)"}
        </button>
        <button onClick={compartilharEmoji} className="rp-btn rp-sec text-[16px]">{emojiOk ? "Copiado!" : "Compartilhar"}</button>
      </div>
      <div className="rp-painel p-4">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Temporada a temporada</div>
        <FaixaTemporadas c={c} />
        <button onClick={copiar} className="text-[14px] font-bold text-[#8FA39A] min-h-[40px] mt-1">{copiado ? "Resumo completo copiado!" : "Copiar resumo completo em texto"}</button>
      </div>

      {du && (
        <div className="rp-painel p-4" style={{ borderColor: du.venceu ? "rgba(18,168,118,.45)" : "rgba(227,107,91,.4)" }}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Duelo de geração</div>
          <div className="display text-base mt-2" style={{ color: du.venceu ? "#7FE3BC" : "#F0A99E" }}>{du.venceu ? `Você venceu ${c.rival.nome}` : `${c.rival.nome} levou a melhor`}</div>
          <p className="text-[14px] text-[#8FA39A] mt-1">{nacDe(c.rival.nac).label} · {c.rival.posicao} · último clube: {c.rival.clube}{du.venceu ? " · +25 pontos de legado" : ""}</p>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1.5 mt-3 items-center">
            <div className="text-[12px] font-bold tracking-wider text-[#7FE3BC] text-right">VOCÊ</div><div /><div className="text-[12px] font-bold tracking-wider text-[#F0A99E]">ELE</div>
            {[...du.linhas, ["Legado", du.meus, du.dele]].map(([k, a, b]) => (
              <React.Fragment key={k}>
                <div className={`font-stat text-right ${a > b ? "text-[#1BC28A]" : "text-[#F2F5F3]"}`}>{a}</div>
                <div className="text-[13px] text-[#8FA39A] text-center">{k}</div>
                <div className={`font-stat ${b > a ? "text-[#E36B5B]" : "text-[#F2F5F3]"}`}>{b}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <PosCarreira c={c} onEscolher={onPosCarreira} />

      <div className="grid grid-cols-2 gap-2">
        <div className="rp-painel px-4 py-3"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">GANHOU NA CARREIRA</div><div className="font-stat text-lg text-[#F2F5F3]">{formatarValor(c.ganhosTotais || 0)}</div></div>
        <div className="rp-painel px-4 py-3"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">PATRIMÔNIO FINAL</div><div className="font-stat text-lg text-[#EBC557]">{formatarValor(c.patrimonio || 0)}</div></div>
        {(c.transferencias || []).length > 0 && (
          <>
            <div className="rp-painel px-4 py-3"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">PAGARAM POR VOCÊ</div><div className="font-stat text-lg text-[#F2F5F3]">{formatarValor(c.transferencias.reduce((a, t) => a + t.valor, 0))}</div></div>
            <div className="rp-painel px-4 py-3"><div className="text-[10px] font-bold tracking-wider text-[#8FA39A]">MAIOR TRANSFERÊNCIA</div><div className="font-stat text-lg text-[#F2F5F3]">{(() => { const m = [...c.transferencias].sort((a, b) => b.valor - a.valor)[0]; return m.valor ? formatarValor(m.valor) : "Sem custo"; })()}</div></div>
          </>
        )}
      </div>

      {porTipo.length > 0 && (
        <div className="rp-painel p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Sala de troféus</div>
          <div className="grid grid-cols-2 gap-2">
            {porTipo.map((g) => (
              <div key={g.tipo + g.nome} className="rounded-2xl bg-[#0E1512] border border-white/5 p-3 flex items-center gap-3">
                <IconeTitulo tipo={g.tipo} nome={g.nome} size={34} />
                <div><div className="font-stat text-xl text-[#F2F5F3] leading-none">{g.n}</div><div className="text-[13px] text-[#C9D3CE] leading-tight">{g.nome}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      <GraficoCarreira c={c} altura={150} titulo="A curva da sua carreira" />
      <TabelaAnoAno c={c} />

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
                {(() => { const t = (c.transferencias || []).find((x) => x.para === k.nome && Math.abs(x.ano - k.de) <= 1); return t ? <div className="text-[13px] text-[#EBC557]">Chegou {t.valor ? `por ${formatarValor(t.valor)}` : "sem custo"}</div> : null; })()}
              </div>
              {(c.torcida[k.nome] ?? 0) >= 75 && <span className="rp-chip" style={{ color: "#7FE3BC", background: "rgba(18,168,118,.16)" }}>Ídolo</span>}
            </li>
          ))}
        </ol>
      </div>

      {(c.marcos || []).length > 0 && (
        <div className="rp-painel p-4">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#8FA39A] mb-3">Momentos da carreira</div>
          <ol className="flex flex-col gap-3 border-l border-[#2A3A33] ml-3.5 pl-6">
            {c.marcos.map((m, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[39px] top-0 w-7 h-7 rounded-full bg-[#121916] flex items-center justify-center"><MarcadorMomento c={c} m={m} /></span>
                <div className="text-[15px] font-bold text-[#F2F5F3]">{m.titulo} <span className="font-stat font-normal text-[#7F918A]">{m.ano}</span></div>
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
  const fimMomento = (acertou) => {
    const k = aplicarMomento(card, acertou);
    // mais de um título em jogo na temporada: um desafio por vez
    if (k.pendente) setEstado({ etapa: "momento", c, card: k });
    else aposFechar(fecharTemporada(c, k));
  };

  const continuar = () => {
    if (precisaEscolherTraco(c)) return setEstado({ etapa: "traco", c, card, opcoesTraco: opcoesDeTraco(c).map((t) => t.id) });
    irAdiante(c, card);
  };
  // depois do resumo: coletiva (conforme o ritmo) e então a janela de eventos
  const irAdiante = (cc, k) => {
    if (deveTerColetiva(cc, k)) return setEstado({ etapa: "coletiva", c: cc, card: k, coletiva: gerarColetiva(cc, k), resposta: null });
    irParaEvento(cc);
  };
  const irParaEvento = (cc) => setEstado({ etapa: "evento", c: cc, evento: eventoDaJanela(cc), resultado: null, fila: true });
  const escolherT = (id) => irAdiante(escolherTraco(c, id), card);
  const responder = (tom) => { const r = responderColetiva(c, estado.coletiva, tom); setEstado((st) => ({ ...st, c: r.c, resposta: r.resultado })); };
  // escolha com negociação: abre a mesa antes de aplicar a opção
  const escolherEvento = (opId) => {
    const op = evento.opcoes.find((o) => o.id === opId);
    if (op?.negociar) { setEstado((st) => ({ ...st, etapa: "negociacao", neg: iniciarNegociacao(c, op.negociar), negOp: opId, aviso: null })); return; }
    aplicarEscolha(c, opId, null);
  };
  const aplicarEscolha = (cBase, opId, extra) => {
    const r = resolverEvento(cBase, evento, opId, extra);
    // fila: depois do evento principal, a janela de transferências pode abrir também
    const extraEv = eventoImpasse(r.c) || (fila ? segundoEvento(r.c, evento.id) : null);
    const mudou = r.c.clubeNome !== c.clubeNome;
    setEstado({ etapa: "evento", c: r.c, evento, resultado: r.resultado || "Decisão tomada.", efeitos: efeitosDaDecisao(c, r.c), proximo: extraEv, fila: false, manchete: mudou ? r.c.ultimaTransferencia?.manchete : null });
    if (mudou) {
      const clube = clubeDe(r.c.clubeNome);
      setApresentacao({ clube, grande: clube.forca > clubeDe(c.clubeNome).forca + 3, deOnde: clubeDe(c.clubeNome), contrato: r.c.contrato, valor: r.c.ultimaTransferencia?.valor ?? null });
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
  const pedirLigaUI = (ligaId) => {
    const r = pedirLiga(c, ligaId);
    const nome = LIGAS_EMPRESARIO.find((l) => l.id === ligaId)?.nome || "qualquer liga";
    if (r.evento) setEstado((st) => ({ ...st, c: r.c, evento: r.evento, aviso: null }));
    else setEstado((st) => ({ ...st, c: r.c, evento: { ...st.evento, opcoes: st.evento.opcoes.filter((o) => !o.escolherLiga) }, aviso: `O empresário ligou para clubes da ${nome}, mas ninguém fez proposta agora.` }));
  };
  const comprar = (id) => { const r = comprarInvestimento(c, id); if (r.ok) setEstado((st) => ({ ...st, c: r.c })); };
  const proximoEvento = () => setEstado((s) => ({ ...s, evento: s.proximo, resultado: null, efeitos: null, proximo: null, manchete: null }));
  const mudarFoco = (id) => setEstado((s) => ({ ...s, c: definirFoco(s.c, id) }));
  const mudarPretemporada = (id) => setEstado((s) => ({ ...s, c: escolherPretemporada(s.c, id) }));
  const encerrar = () => {
    const cc = aposentar(c);
    cc.hall = registrarNoHall(cc);
    setEstado({ etapa: "fim", c: cc });
  };
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
            {!evento && c.temporadas.length === 0 && <DicasIniciais />}
            {!evento && c.temporadas.length === 0 && (
              <div className="max-w-xl mx-auto px-4 pt-6 rp-entra">
                <h2 className="display text-lg text-[#F2F5F3]">A história começa aqui</h2>
                <p className="text-[17px] text-[#8FA39A] mt-1">{c.nome}, {c.idade} anos, {posicaoDe(c.posicao).label.toLowerCase()} da base do {c.clubeNome}. {origemDe(c.origem) ? `${origemDe(c.origem).nome}. ` : ""}Perfil: {personaDe(c.personalidade).label.toLowerCase()}. Empresário: {(EMPRESARIOS.find((e) => e.id === c.empresario) || EMPRESARIOS[0]).nome.toLowerCase()}.</p>
              </div>
            )}
            <TelaEvento c={c} evento={evento} resultado={resultado} efeitos={estado.efeitos} temMais={!!estado.proximo} aviso={estado.aviso} manchete={estado.manchete} onEscolher={escolherEvento} onPedirLiga={pedirLigaUI} onProximo={proximoEvento} onFoco={mudarFoco} onPretemporada={mudarPretemporada} onJogar={jogar} onPatrimonio={() => setPatrimonioAberto(true)} />
          </>
        )}
        {etapa === "negociacao" && estado.neg && <TelaNegociacao c={c} n={estado.neg} onAjustar={ajustarNeg} onAssinar={assinar} onSair={sairNeg} />}
        {etapa === "momento" && <TelaMomento key={`${card.ano}:${(card.momentos || []).length}`} c={c} momento={card.pendente} onFim={fimMomento} />}
        {etapa === "festa" && <TelaFesta c={c} card={card} onFim={() => setEstado({ etapa: "resumo", c, card })} />}
        {etapa === "resumo" && <TelaResumo c={c} card={card} onContinuar={continuar} onAposentar={encerrar} onRever={() => setEstado({ etapa: "festa", c, card })} />}
        {etapa === "coletiva" && estado.coletiva && <TelaColetiva c={c} coletiva={estado.coletiva} resposta={estado.resposta} onResponder={responder} onSeguir={() => irParaEvento(c)} />}
        {etapa === "traco" && <TelaTraco c={c} opcoes={(opcoesTraco || []).map(tracoDe).filter(Boolean)} onEscolher={escolherT} />}
        {etapa === "fim" && <TelaFim c={c} onNova={nova} onSair={onSair} onPosCarreira={(id) => setEstado((st) => ({ ...st, c: escolherPosCarreira(st.c, id) }))} />}
      </main>
      {estanteAberta && c && <Estante c={c} onFechar={() => setEstanteAberta(false)} />}
      {patrimonioAberto && c && <Patrimonio c={c} onComprar={comprar} onFechar={() => setPatrimonioAberto(false)} />}
      {apresentacao && (
        <ApresentacaoNovoClube clube={apresentacao.clube} nome={c.nome} numero={numeroDe(c)} posicao={posicaoDe(c.posicao).label}
          idade={c.idade} grandeChegada={apresentacao.grande} deOnde={apresentacao.deOnde} contrato={apresentacao.contrato} valor={apresentacao.valor} onConcluir={() => setApresentacao(null)} />
      )}
    </div>
  );
}
