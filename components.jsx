import React, { useState, useMemo, useEffect } from "react";
import { ANO_INICIO, ATTR_SLOTS, CLUBES, DIAS_SEMANA_ABREV, DIAS_SEMANA_LABEL, FALTA_BONECO_POS, FALTA_BOX, FALTA_GOAL, FALTA_SPOT, LANCES_POR_POSICAO, MESES_LABEL, NUM_ATTRS, PASSE_H, PASSE_ORIGEM, PASSE_W, PEN_GOAL, PEN_H, PEN_SPOT, PEN_W, PEN_ZONE_X, POS_GRUPO, TIPOS_NOTICIA } from "./data";
import { calcularSucessoPasse, clamp, diaNaJanela, diasNoMes, distribuirRodadasNaJanela, estimarRodadasLiga, faltaAlvoBola, formatarDinheiro, gerarCenaPasse, janelasPorLiga, labelAtributoGoleiro, nacDe, penAlvoBola, pick, primeiroDiaSemanaMes, rand, tierInfo } from "./lib";

export function Card({ children, className = "", accent, padded = true, id }) {
  return (
    <div id={id} className={`relative glass rounded-md ${padded ? "p-5" : ""} overflow-hidden ${className}`}>
      {accent && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />}
      {children}
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", disabled }) {
  const base = "hud-btn px-4 py-2.5 text-sm font-bold uppercase tracking-wide rounded-md font-sport disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 active:scale-[0.97]";
  const styles = { primary: "btn-primary", ghost: "btn-ghost", gold: "btn-gold" };
  return <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>;
}

export function Estrelas({ n }) { return <span className="text-amber-400 text-[11px]">{"★".repeat(n)}<span className="text-zinc-700">{"★".repeat(5 - n)}</span></span>; }

export function Diamond({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="20,42 32,15 50,42" fill="#5B9BDE" stroke="#111" strokeWidth="3.2" strokeLinejoin="round" />
      <polygon points="80,42 68,15 50,42" fill="#5B9BDE" stroke="#111" strokeWidth="3.2" strokeLinejoin="round" />
      <polygon points="32,15 68,15 50,42" fill="#AEE0FB" stroke="#111" strokeWidth="3.2" strokeLinejoin="round" />
      <polygon points="20,42 50,42 50,95" fill="#4A86D0" stroke="#111" strokeWidth="3.2" strokeLinejoin="round" />
      <polygon points="80,42 50,42 50,95" fill="#2F6FC4" stroke="#111" strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Sparkle({ size = 14, cor = "#7EC8F2" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill={cor} /></svg>;
}

export function BallIcon({ size = 22, spin }) { return <svg width={size} height={size} viewBox="0 0 24 24" className={spin ? "animate-spin" : ""} style={spin ? { animationDuration: "1.6s" } : {}}><circle cx="12" cy="12" r="10" fill="#fff" stroke="#111" strokeWidth="1" /><polygon points="12,7 15,9.2 13.8,13 10.2,13 9,9.2" fill="#111" /></svg>; }

export function BolaGirandoBox({ revelado }) {
  return (
    <div className="w-full h-20 border-2 border-zinc-700 rounded-sm bg-gradient-to-br from-emerald-950/50 to-zinc-900 flex items-center justify-center overflow-hidden relative">
      {!revelado ? <BallIcon size={40} spin /> : <div className="animate-[popIn_0.4s_ease-out]"><BallIcon size={36} /></div>}
    </div>
  );
}

export function SilhuetaJogador({ size = 56, cor = "#12A876" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r="31" fill="#1a1a1a" stroke={cor} strokeWidth="1.5" />
      <circle cx="32" cy="24" r="11" fill={cor} opacity="0.85" />
      <path d="M12 56c1-12 9-18 20-18s19 6 20 18" fill={cor} opacity="0.85" />
    </svg>
  );
}

export function TrophyIcon({ tipo = "ouro", size = 24 }) {
  const cores = { ouro: "#D8B44A", prata: "#C7CDD6", bronze: "#B08D57", mundo: "#3b82f6", liga: "#12A876" };
  const cor = cores[tipo] || cores.ouro;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
      <path d="M7 3h10v5a5 5 0 0 1-10 0V3z" fill={cor} />
      <path d="M7 4H3v2a4 4 0 0 0 4 4V4zM17 4h4v2a4 4 0 0 1-4 4V4z" fill={cor} opacity="0.7" />
      <rect x="11" y="12" width="2" height="5" fill={cor} />
      <rect x="8" y="17" width="8" height="2.5" rx="0.5" fill={cor} />
    </svg>
  );
}

export function CountUp({ value, duration = 700, formatter }) {
  const [display, setDisplay] = useState(0);
  const prevRef = React.useRef(0);
  useEffect(() => {
    const from = prevRef.current;
    const to = typeof value === "number" ? value : 0;
    const start = Date.now();
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duration);
      setDisplay(Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
      if (t >= 1) { clearInterval(id); prevRef.current = to; }
    }, 30);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{formatter ? formatter(display) : display}</>;
}

export function Confetti() {
  const cores = ["#D8B44A", "#12A876", "#3b82f6", "#ec4899", "#f59e0b"];
  const pecas = Array.from({ length: 24 }, (_, i) => ({ left: Math.random() * 100, delay: Math.random() * 0.6, cor: cores[i % cores.length], size: 4 + Math.random() * 5 }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pecas.map((p, i) => <div key={i} className="absolute top-0 rounded-sm" style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.cor, animation: `confettiFall 1.6s ease-in ${p.delay}s infinite` }} />)}
    </div>
  );
}

export function FichaPartida({ jogo, clubeNome, posicao, onClose }) {
  if (!jogo) return null;
  const venceu = jogo.resultado === "V", empatou = jogo.resultado === "E";
  const cor = venceu ? "#12A876" : empatou ? "#a1a1aa" : "#D6483F";
  const adv = CLUBES.find((x) => x.nome === jogo.adversario);
  const meu = CLUBES.find((x) => x.nome === clubeNome);
  const melhorEmCampo = (jogo.nota ?? 0) >= 8;
  return (
    <Card className="border-2" accent={`linear-gradient(90deg,${cor},#18181b)`}>
      <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color: cor }}>
        ⚽ Ficha do jogo · rodada {jogo.numero} {jogo.classico ? "· ⚔️ Clássico" : ""} {jogo.casa === false ? "· ✈️ Fora" : "· 🏠 Em casa"}
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex flex-col items-center gap-1 flex-1">
          <ClubDot club={jogo.casa === false ? adv : meu} size={34} />
          <span className="text-[10px] text-zinc-400 text-center truncate w-full">{jogo.casa === false ? jogo.adversario : clubeNome}</span>
        </div>
        <div className="text-center shrink-0">
          <div className="font-stat font-black text-3xl" style={{ color: cor }}>
            {jogo.casa === false ? `${jogo.golsAdv} × ${jogo.golsMeu}` : `${jogo.golsMeu} × ${jogo.golsAdv}`}
          </div>
          <div className="text-[9px] uppercase tracking-widest" style={{ color: cor }}>{venceu ? "Vitória" : empatou ? "Empate" : "Derrota"}</div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <ClubDot club={jogo.casa === false ? meu : adv} size={34} />
          <span className="text-[10px] text-zinc-400 text-center truncate w-full">{jogo.casa === false ? clubeNome : jogo.adversario}</span>
        </div>
      </div>
      {melhorEmCampo && <div className="text-center text-[10px] text-amber-400 mb-3">⭐ Você foi o melhor em campo</div>}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-zinc-950/50 rounded-sm p-2.5 text-center">
          <div className="font-stat font-black text-xl" style={{ color: (jogo.nota ?? 0) >= 7.5 ? "#12A876" : (jogo.nota ?? 0) >= 6.5 ? "#e4e4e7" : "#D6483F" }}>{jogo.nota ?? "—"}</div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Sua nota</div>
        </div>
        <div className="bg-zinc-950/50 rounded-sm p-2.5 text-center">
          <div className="font-stat font-black text-xl">{posicao === "GOL" ? (jogo.golsAdv === 0 ? "1" : "0") : (jogo.golsMinha || 0)}</div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-widest">{posicao === "GOL" ? "Clean sheet" : "Gols"}</div>
        </div>
        <div className="bg-zinc-950/50 rounded-sm p-2.5 text-center">
          <div className="font-stat font-black text-xl">{jogo.assistMinha || 0}</div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-widest">Assistências</div>
        </div>
      </div>
      <div className="grid gap-1 text-[11px] text-zinc-400 border-t border-zinc-800 pt-2.5">
        <div className="flex justify-between"><span className="text-zinc-500">Adversário</span><span>{jogo.adversario}{jogo.adversarioForca ? ` (força ${jogo.adversarioForca})` : ""}</span></div>
        <div className="flex justify-between"><span className="text-zinc-500">Mando de campo</span><span>{jogo.casa === false ? "Visitante" : "Mandante"}</span></div>
        {jogo.competicao && <div className="flex justify-between"><span className="text-zinc-500">Competição</span><span>{jogo.competicao === "liga" ? "Liga nacional" : jogo.competicao}</span></div>}
        <div className="flex justify-between"><span className="text-zinc-500">Sua participação</span><span>{(jogo.golsMinha || 0) + (jogo.assistMinha || 0) > 0 ? `${jogo.golsMinha || 0}G ${jogo.assistMinha || 0}A` : "sem participação direta"}</span></div>
      </div>
      {onClose && <div className="mt-3"><Button variant="ghost" onClick={onClose}>Fechar</Button></div>}
    </Card>
  );
}

export function LeitorNoticia({ noticia: nt, nome, clube, onClose }) {
  if (!nt) return null;
  const t = TIPOS_NOTICIA[nt.tipo] || TIPOS_NOTICIA.mundo;
  const arroba = `@${(nome || "jogador").toLowerCase().replace(/\s+/g, "")}`;
  const formato = ["destaque", "titulo", "premio", "recorde"].includes(nt.tipo) ? "jornal"
    : ["critica", "mundo", "mercado"].includes(nt.tipo) ? "tweet" : "post";

  if (formato === "jornal") return (
    <div className="rounded-md overflow-hidden" style={{ background: "#f4f1ea", color: "#1a1a1a" }}>
      <div className="px-5 pt-4 pb-2 border-b-2" style={{ borderColor: "#1a1a1a" }}>
        <div className="flex items-center justify-between">
          <span className="font-black text-lg tracking-tight" style={{ fontFamily: "Georgia,serif" }}>O GLOBO ESPORTIVO</span>
          <span className="text-[9px] uppercase tracking-widest">{nt.temporada} · {nt.idade} anos</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="text-[9px] uppercase tracking-widest mb-2" style={{ color: "#8a1c1c" }}>{t.label}</div>
        <h2 className="font-black text-2xl leading-tight mb-3" style={{ fontFamily: "Georgia,serif" }}>{nt.titulo}</h2>
        <div className="h-px mb-3" style={{ background: "#c9c4b8" }} />
        <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: "Georgia,serif" }}>
          <span className="font-bold">{clube?.toUpperCase()} — </span>{nt.corpo}
        </p>
        <p className="text-[13px] leading-relaxed" style={{ fontFamily: "Georgia,serif", color: "#444" }}>
          A redação apurou que o desempenho de {nome} segue no centro das atenções. Nos bastidores, dirigentes e comissão técnica acompanham de perto cada passo do atleta, cientes de que momentos como este definem carreiras.
        </p>
        <div className="mt-4 pt-3 text-[10px] uppercase tracking-widest" style={{ borderTop: "1px solid #c9c4b8", color: "#666" }}>Reportagem · Caderno de Esportes</div>
      </div>
      <div className="px-5 pb-4"><button onClick={onClose} className="w-full py-2 text-xs font-bold uppercase tracking-widest" style={{ background: "#1a1a1a", color: "#f4f1ea", borderRadius: 4 }}>Fechar</button></div>
    </div>
  );

  if (formato === "tweet") return (
    <Card className="border-zinc-700">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-lg" style={{ background: `${t.cor}22`, border: `1px solid ${t.cor}66` }}>{t.icone}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm">Central do Futebol</span>
            <span className="text-cyan-400 text-xs">✔</span>
            <span className="text-zinc-500 text-xs">@centralfut</span>
          </div>
          <p className="text-[15px] leading-snug mt-2 text-zinc-100">{nt.titulo}</p>
          <p className="text-sm leading-relaxed mt-2 text-zinc-300">{nt.corpo}</p>
          <div className="text-[11px] text-zinc-500 mt-3">{nt.temporada} · {nt.idade} anos de {nome}</div>
          <div className="flex gap-5 mt-3 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500">
            <span>💬 {rand(80, 900)}</span><span>🔁 {rand(200, 4000)}</span><span>❤️ {rand(900, 40000)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4"><Button variant="ghost" onClick={onClose}>Fechar</Button></div>
    </Card>
  );

  return (
    <Card padded={false} className="border-zinc-700 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-zinc-800">
        <SilhuetaJogador size={26} cor="#E1306C" />
        <span className="text-sm font-bold">{arroba}</span>
        <span className="ml-auto text-[10px] text-zinc-500">{nt.temporada}</span>
      </div>
      <div className="h-44 flex flex-col items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${t.cor}, #18181b)` }}>
        <span className="text-5xl">{t.icone}</span>
        <span className="text-[10px] uppercase tracking-widest text-white/70">{t.label}</span>
      </div>
      <div className="px-4 py-3">
        <div className="flex gap-4 text-lg mb-2">❤️ 💬 📤</div>
        <div className="text-xs font-bold mb-1">{rand(12, 900)} mil curtidas</div>
        <p className="text-sm leading-snug"><span className="font-bold">{arroba}</span> {nt.titulo}</p>
        <p className="text-[13px] text-zinc-400 leading-relaxed mt-1.5">{nt.corpo}</p>
        <div className="text-[10px] text-zinc-600 mt-2">Ver todos os {rand(200, 5000)} comentários</div>
      </div>
      <div className="px-4 pb-4"><Button variant="ghost" onClick={onClose}>Fechar</Button></div>
    </Card>
  );
}

export function PopupOverlay({ children, onClose, largo = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
      <div className={`w-full max-h-[88vh] overflow-y-auto animate-[popIn_0.25s_ease-out] ${largo ? "popup-largo" : "max-w-md"}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ClubDot({ club, size = 20 }) {
  if (!club) return null;
  const ini = club.nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return <span className="inline-flex items-center justify-center font-black shrink-0" style={{ width: size, height: size * 1.14, background: club.cor, color: club.escuro ? "#0a0a0a" : "#fff", clipPath: "polygon(50% 0%,100% 18%,100% 65%,50% 100%,0% 65%,0% 18%)", fontSize: size * 0.34 }}>{ini}</span>;
}

export function CalendarioTemporadaPopup({ carreira, mesAtual, setMesAtual, onClose, onAbrirFicha }) {
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const ano = ANO_INICIO + (carreira.idade - 16);
  const ligaId = carreira.clube.liga;
  const janelas = janelasPorLiga(ligaId);
  const janelaLiga = janelas.find((j) => j.ligaPrincipal);
  const ta = carreira.temporadaAndamento;
  const nRodadas = ta ? ta.calendario.length : estimarRodadasLiga(ligaId);
  const datasRodadas = useMemo(() => distribuirRodadasNaJanela(nRodadas, janelaLiga, ano), [nRodadas, janelaLiga, ano]);
  const rodadaPorDia = {};
  datasRodadas.forEach((d, idx) => { rodadaPorDia[`${d.mes}-${d.dia}`] = idx; });
  const jovemElegivelCopinha = carreira.idade <= 18;
  const elegivelMundial = !!carreira.elegivelMundial;

  const nDias = diasNoMes(ano, mesAtual);
  const primeiroDia = primeiroDiaSemanaMes(ano, mesAtual);
  const celulas = [];
  for (let i = 0; i < primeiroDia; i++) celulas.push(null);
  for (let d = 1; d <= nDias; d++) celulas.push(d);

  function infoDoDia(dia) {
    const janelasAtivas = janelas.filter((j) => {
      if (j.soJovem && !jovemElegivelCopinha) return false;
      if (j.seElegivel && !elegivelMundial) return false;
      return diaNaJanela(mesAtual, dia, j);
    });
    const rodadaIdx = rodadaPorDia[`${mesAtual}-${dia}`];
    return { janelasAtivas, rodadaIdx };
  }

  const diaInfo = diaSelecionado != null ? infoDoDia(diaSelecionado) : null;
  const rodadaSel = diaInfo?.rodadaIdx;
  const jogoSel = ta && rodadaSel != null ? ta.calendario[rodadaSel]?.find((p) => p.casa.nome === carreira.clube.nome || p.fora.nome === carreira.clube.nome) : null;
  const resultadoSel = ta && rodadaSel != null ? ta.resultadosRodadas[rodadaSel] : null;
  const jogadaSel = ta && rodadaSel != null && rodadaSel < ta.rodadaAtual;
  const fichaDoDia = ta && rodadaSel != null ? (ta.logJogos || []).find((j) => j.numero === rodadaSel + 1) : null;
  const hojeSel = ta && rodadaSel === ta.rodadaAtual;

  return (
    <PopupOverlay onClose={onClose}>
      <Card className="border-amber-500/40" padded={false}>
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setMesAtual((m) => (m + 11) % 12)} className="w-7 h-7 border border-zinc-700 rounded-sm hover:border-amber-500">‹</button>
            <div className="text-center">
              <div className="text-sm font-sport font-black uppercase tracking-widest text-amber-400">{MESES_LABEL[mesAtual]}</div>
              <div className="text-[10px] text-zinc-500">{ano} · {carreira.clube.nome}</div>
            </div>
            <button onClick={() => setMesAtual((m) => (m + 1) % 12)} className="w-7 h-7 border border-zinc-700 rounded-sm hover:border-amber-500">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DIAS_SEMANA_ABREV.map((d) => <div key={d} className="text-center text-[9px] text-zinc-600 uppercase">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {celulas.map((d, i) => {
              if (d == null) return <div key={i} />;
              const info = infoDoDia(d);
              const temRodada = info.rodadaIdx != null;
              const jaJogou = ta && temRodada && info.rodadaIdx < ta.rodadaAtual;
              const eHoje = ta && temRodada && info.rodadaIdx === ta.rodadaAtual;
              const resultado = ta && temRodada ? ta.resultadosRodadas[info.rodadaIdx] : null;
              const corFundo = eHoje ? "#D8B44A" : jaJogou ? (resultado === "V" ? "#12A876" : resultado === "D" ? "#D6483F" : "#71717a") : temRodada ? "#27272a" : "transparent";
              const corBorda = info.janelasAtivas[0]?.cor || "#3f3f46";
              return (
                <button key={i} onClick={() => setDiaSelecionado(d)} className="aspect-square rounded-sm flex flex-col items-center justify-center relative text-[11px]" style={{ background: corFundo, border: `${temRodada ? "2px" : "1px"} solid ${temRodada ? (eHoje ? "#D8B44A" : "#12A876") : info.janelasAtivas.length ? corBorda : "#27272a"}`, opacity: diaSelecionado === d ? 1 : 0.94 }}>
                  <span className={`font-mono ${eHoje ? "text-zinc-900 font-black" : "text-zinc-100"}`}>{d}</span>
                  {temRodada
                    ? <span className="absolute bottom-0 text-[11px]" title="Dia de jogo">⚽</span>
                    : info.janelasAtivas.length > 0 && <span className="absolute bottom-0.5 text-[8px] opacity-70">{info.janelasAtivas[0].icone}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {diaSelecionado != null && (
          <div className="mx-4 mb-3 p-3 bg-zinc-950/50 rounded-sm border border-zinc-800">
            <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-1.5">{diaSelecionado.toString().padStart(2, "0")} de {MESES_LABEL[mesAtual]} · {DIAS_SEMANA_LABEL[new Date(ano, mesAtual, diaSelecionado).getDay()]}</div>
            {diaInfo.janelasAtivas.length === 0 && diaInfo.rodadaIdx == null && <p className="text-[11px] text-zinc-500">Sem compromisso confirmado nessa data.</p>}
            {diaInfo.janelasAtivas.map((j, i) => <div key={i} className="text-[11px] mb-0.5" style={{ color: j.cor }}>{j.icone} {j.comp}</div>)}
            {jogoSel && (
              <div className="mt-2 pt-2 border-t border-zinc-800 text-xs">
                <div className="font-bold">{jogoSel.casa.nome} <span className="text-zinc-500">x</span> {jogoSel.fora.nome} <span className="text-zinc-600">— rodada {rodadaSel + 1}</span></div>
                {jogadaSel && resultadoSel && <div className="text-[10px] mt-1" style={{ color: resultadoSel === "V" ? "#12A876" : resultadoSel === "D" ? "#D6483F" : "#a1a1aa" }}>{resultadoSel === "V" ? "Vitória" : resultadoSel === "D" ? "Derrota" : "Empate"}</div>}
                {hojeSel && <div className="text-[10px] text-amber-400 mt-1">📍 Próximo compromisso</div>}
                {!jogadaSel && !hojeSel && <div className="text-[10px] text-zinc-600 mt-1">Ainda por vir</div>}
                {jogadaSel && fichaDoDia && onAbrirFicha && (
                  <button onClick={() => onAbrirFicha(fichaDoDia)} className="w-full mt-2 text-[11px] text-emerald-400 border border-emerald-500/40 rounded-sm py-1.5 hover:bg-emerald-500/10">
                    ⚽ Ver ficha completa da partida →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="px-4 pb-2 flex flex-wrap gap-x-3 gap-y-1">
          {janelas.filter((j) => (!j.soJovem || jovemElegivelCopinha) && (!j.seElegivel || elegivelMundial)).map((j) => (
            <span key={j.comp} className="text-[9px] flex items-center gap-1" style={{ color: j.cor }}>{j.icone} {j.comp}</span>
          ))}
        </div>
        <div className="px-4 pb-4"><Button variant="ghost" onClick={onClose}>Fechar</Button></div>
      </Card>
    </PopupOverlay>
  );
}

export function PenEstadio() {
  return (
    <svg width={PEN_W} height={PEN_H} viewBox={`0 0 ${PEN_W} ${PEN_H}`} className="absolute inset-0">
      <defs>
        <radialGradient id="penHolofote" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff6dc" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff6dc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="penCeu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#030407" />
          <stop offset="100%" stopColor="#1a1e28" />
        </linearGradient>
        <linearGradient id="penGrama" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#153d24" />
          <stop offset="100%" stopColor="#1e7a3f" />
        </linearGradient>
        <pattern id="penTorcida" width="5" height="4" patternUnits="userSpaceOnUse">
          <rect width="5" height="4" fill="#14161c" />
          <circle cx="1.2" cy="1.5" r="0.9" fill="#454b5c" />
          <circle cx="3.4" cy="2.8" r="0.8" fill="#2c3040" />
          <circle cx="3.8" cy="0.8" r="0.6" fill="#5a6178" />
        </pattern>
        <pattern id="penRede" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0 L8 8 M8 0 L0 8" stroke="rgba(255,255,255,0.42)" strokeWidth="0.7" />
        </pattern>
        <radialGradient id="penVinheta" cx="50%" cy="35%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={PEN_W} height={PEN_H} fill="url(#penCeu)" />
      <rect x="0" y="0" width={PEN_W} height={PEN_GOAL.y + PEN_GOAL.h + 6} fill="url(#penTorcida)" />
      <rect x="0" y="0" width={PEN_W} height={PEN_GOAL.y + PEN_GOAL.h + 6} fill="#000" opacity="0.25" />
      <circle cx={PEN_W * 0.12} cy="2" r="34" fill="url(#penHolofote)" />
      <circle cx={PEN_W * 0.38} cy="-4" r="30" fill="url(#penHolofote)" />
      <circle cx={PEN_W * 0.64} cy="-4" r="30" fill="url(#penHolofote)" />
      <circle cx={PEN_W * 0.9} cy="2" r="34" fill="url(#penHolofote)" />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={(i + 0.5) * (PEN_W / 10)} cy={6} r="2.2" fill="#fff6dc" opacity="0.85" />
      ))}
      <rect x="0" y={PEN_GOAL.y + PEN_GOAL.h - 2} width={PEN_W} height="7" fill="#D8B44A" opacity="0.9" />
      <rect x="0" y={PEN_GOAL.y + PEN_GOAL.h - 2} width={PEN_W} height="7" fill="url(#penTorcida)" opacity="0.15" />
      <path d={`M -30,${PEN_H} L ${PEN_W + 30},${PEN_H} L ${PEN_W + 10},${PEN_GOAL.y + PEN_GOAL.h + 4} L -10,${PEN_GOAL.y + PEN_GOAL.h + 4} Z`} fill="url(#penGrama)" />
      <path d={`M ${PEN_SPOT.x - 70} ${PEN_H} L ${PEN_GOAL.x - 6} ${PEN_GOAL.y + PEN_GOAL.h + 5}`} stroke="#f5f5f5" strokeOpacity="0.35" strokeWidth="1.6" fill="none" />
      <path d={`M ${PEN_SPOT.x + 70} ${PEN_H} L ${PEN_GOAL.x + PEN_GOAL.w + 6} ${PEN_GOAL.y + PEN_GOAL.h + 5}`} stroke="#f5f5f5" strokeOpacity="0.35" strokeWidth="1.6" fill="none" />
      <line x1={PEN_GOAL.x - 6} y1={PEN_GOAL.y + PEN_GOAL.h + 5} x2={PEN_GOAL.x + PEN_GOAL.w + 6} y2={PEN_GOAL.y + PEN_GOAL.h + 5} stroke="#f5f5f5" strokeOpacity="0.4" strokeWidth="1.6" />
      <rect x={PEN_GOAL.x + 5} y={PEN_GOAL.y + 4} width={PEN_GOAL.w - 10} height={PEN_GOAL.h - 4} fill="url(#penRede)" opacity="0.92" />
      <rect x={PEN_GOAL.x + 5} y={PEN_GOAL.y + 4} width={PEN_GOAL.w - 10} height={PEN_GOAL.h - 4} fill="#04050a" opacity="0.28" />
      {[0.3, 0.55, 0.8].map((f, i) => (
        <path key={i} d={`M ${PEN_GOAL.x + 6} ${PEN_GOAL.y + PEN_GOAL.h * f} Q ${PEN_GOAL.x + PEN_GOAL.w / 2} ${PEN_GOAL.y + PEN_GOAL.h * f + 10 + i * 3} ${PEN_GOAL.x + PEN_GOAL.w - 6} ${PEN_GOAL.y + PEN_GOAL.h * f}`} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none" />
      ))}
      <path d={`M ${PEN_GOAL.x} ${PEN_GOAL.y + 2} L ${PEN_GOAL.x - 16} ${PEN_GOAL.y + 14} L ${PEN_GOAL.x - 16} ${PEN_GOAL.y + PEN_GOAL.h - 6} L ${PEN_GOAL.x} ${PEN_GOAL.y + PEN_GOAL.h - 2} Z`} fill="url(#penRede)" opacity="0.55" />
      <path d={`M ${PEN_GOAL.x + PEN_GOAL.w} ${PEN_GOAL.y + 2} L ${PEN_GOAL.x + PEN_GOAL.w + 16} ${PEN_GOAL.y + 14} L ${PEN_GOAL.x + PEN_GOAL.w + 16} ${PEN_GOAL.y + PEN_GOAL.h - 6} L ${PEN_GOAL.x + PEN_GOAL.w} ${PEN_GOAL.y + PEN_GOAL.h - 2} Z`} fill="url(#penRede)" opacity="0.55" />
      <rect x={PEN_GOAL.x - 5} y={PEN_GOAL.y} width="9" height={PEN_GOAL.h + 5} rx="2.5" fill="#f4f4f4" />
      <rect x={PEN_GOAL.x + PEN_GOAL.w - 4} y={PEN_GOAL.y} width="9" height={PEN_GOAL.h + 5} rx="2.5" fill="#f4f4f4" />
      <rect x={PEN_GOAL.x - 6} y={PEN_GOAL.y - 7} width={PEN_GOAL.w + 12} height="9" rx="2.5" fill="#f4f4f4" />
      <rect x="0" y="0" width={PEN_W} height={PEN_H} fill="url(#penVinheta)" />
    </svg>
  );
}

export function PenGoleiro({ zona }) {
  const kickerW = 52, kickerH = 76;
  const dx = { esquerdo: PEN_ZONE_X.esquerdo - PEN_ZONE_X.meio, meio: 0, direito: PEN_ZONE_X.direito - PEN_ZONE_X.meio }[zona] ?? 0;
  const rotAlvo = { esquerdo: -36, meio: 0, direito: 36 }[zona] ?? 0;
  const anim = zona === "meio" ? "ficaMeio" : "pulaLado";
  return (
    <div className="absolute" style={{ left: PEN_ZONE_X.meio, top: PEN_GOAL.y + PEN_GOAL.h - kickerH, width: kickerW, height: kickerH, transform: "translateX(-50%)" }}>
      <div key={zona} style={{ width: "100%", height: "100%", "--dx": `${dx}px`, "--rot": `${rotAlvo}deg`, animation: `${anim} 480ms ease-out forwards`, transformOrigin: "50% 92%" }}>
        <svg width={kickerW} height={kickerH} viewBox="0 0 46 66" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="penKitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2230" />
              <stop offset="100%" stopColor="#0d1119" />
            </linearGradient>
            <linearGradient id="penKitAccent" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#39FF88" />
            </linearGradient>
          </defs>
          <ellipse cx="23" cy="64" rx="13" ry="2.4" fill="#000" opacity="0.32" />
          <rect x="12" y="43" width="7.5" height="18" rx="3" fill="#12141a" />
          <rect x="26.5" y="43" width="7.5" height="18" rx="3" fill="#12141a" />
          <rect x="10.5" y="58" width="11" height="5" rx="2" fill="#050506" />
          <rect x="24.5" y="58" width="11" height="5" rx="2" fill="#050506" />
          <rect x="11" y="35" width="24" height="11" rx="4" fill="#181b22" />
          <rect x="11" y="35" width="24" height="3" fill="url(#penKitAccent)" opacity="0.85" />
          <rect x="8" y="14" width="30" height="24" rx="7" fill="url(#penKitGrad)" />
          <path d="M 8 30 L 22 14 L 30 14 L 16 38 L 8 38 Z" fill="url(#penKitAccent)" opacity="0.9" />
          <rect x="8" y="14" width="30" height="24" rx="7" fill="none" stroke="#22D3EE" strokeOpacity="0.3" strokeWidth="0.6" />
          <rect x="21" y="14" width="4" height="24" fill="#000" opacity="0.15" />
          <rect x="-6" y="17" width="14" height="8" rx="4" fill="url(#penKitGrad)" />
          <rect x="38" y="17" width="14" height="8" rx="4" fill="url(#penKitGrad)" />
          <circle cx="-7" cy="21" r="6.2" fill="#39FF88" stroke="#0a0a0a" strokeWidth="0.8" />
          <circle cx="53" cy="21" r="6.2" fill="#39FF88" stroke="#0a0a0a" strokeWidth="0.8" />
          <circle cx="23" cy="8.5" r="8.4" fill="#181b22" />
          <circle cx="23" cy="8.5" r="8.4" fill="none" stroke="#22D3EE" strokeOpacity="0.25" strokeWidth="0.6" />
        </svg>
      </div>
    </div>
  );
}

export function PenBola({ resultado }) {
  const alvo = penAlvoBola(resultado);
  const noChao = !resultado;
  return (
    <>
      <div className="absolute rounded-full transition-all ease-in" style={{
        width: 26 * (noChao ? 1.6 : alvo.scale), height: 7 * (noChao ? 1.6 : alvo.scale), left: alvo.x,
        top: noChao ? 205 : alvo.y + 9 * alvo.scale,
        transform: "translate(-50%,-50%)", background: "radial-gradient(closest-side, rgba(0,0,0,0.5), transparent)",
        opacity: noChao ? 1 : clamp(1 - (PEN_SPOT.y - alvo.y) / 170, 0.05, 1), transitionDuration: "620ms",
      }} />
      <div className="absolute rounded-full transition-all ease-in" style={{
        width: 15 * alvo.scale, height: 15 * alvo.scale, left: alvo.x, top: alvo.y,
        transform: "translate(-50%,-50%)", transitionDuration: "620ms",
        background: "radial-gradient(circle at 32% 28%, #fff, #dcdcdc 55%, #a8a8a8)",
        boxShadow: resultado && resultado.gol ? "0 0 16px 4px rgba(57,255,136,0.85), inset 0 0 0 1.5px #222" : "inset 0 0 0 1.5px #222, 0 2px 4px rgba(0,0,0,0.5)",
      }}>
        {alvo.scale > 1.2 && (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,20 65,32 59,50 41,50 35,32" fill="#1a1a1a" opacity="0.85" />
          </svg>
        )}
      </div>
    </>
  );
}

export function PenEfeitoGol({ ativo }) {
  const confetes = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    id: i, x: 30 + Math.random() * (PEN_W - 60), delay: Math.random() * 0.25,
    cor: pick(["#39FF88", "#22D3EE", "#D8B44A", "#fff"]),
  })), []);
  if (!ativo) return null;
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 45%, rgba(57,255,136,0.55) 0%, transparent 60%)", animation: "flashGol 700ms ease-out forwards" }} />
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {confetes.map((cf) => (
          <div key={cf.id} style={{
            position: "absolute", left: cf.x, top: PEN_GOAL.y + PEN_GOAL.h * 0.35, width: 5, height: 8, background: cf.cor,
            animation: `confeteGol 1100ms ${cf.delay}s ease-out forwards`, borderRadius: 1,
          }} />
        ))}
      </div>
      <div className="absolute pointer-events-none" style={{ left: "50%", top: PEN_GOAL.y + PEN_GOAL.h * 0.3, transform: "translate(-50%,-50%)", animation: "textoGol 900ms cubic-bezier(0.22,1,0.36,1) forwards" }}>
        <span className="display font-black text-4xl" style={{ color: "#39FF88", textShadow: "0 0 18px rgba(57,255,136,0.85), 0 2px 4px rgba(0,0,0,0.6)" }}>GOL!</span>
      </div>
    </>
  );
}

export function MatchTicker({ jogo, clube, posicao, attrs, temLance, onFim }) {
  const timeline = useMemo(() => {
    const evs = [];
    for (let i = 0; i < jogo.golsMeu; i++) evs.push({ minuto: rand(4, 87), tipo: i < jogo.golsMinha ? "gol-jogador" : "gol-time" });
    for (let i = 0; i < jogo.golsAdv; i++) evs.push({ minuto: rand(4, 87), tipo: "gol-adv" });
    evs.push({ minuto: rand(15, 35), tipo: "flavor", texto: `Boa troca de passes do ${clube.nome}, mas sem perigo real.` });
    evs.push({ minuto: rand(50, 75), tipo: "flavor", texto: `Cartão amarelo em disputa de meio de campo.` });
    if (temLance) evs.push({ minuto: rand(38, 70), tipo: "lance" });
    evs.sort((a, b) => a.minuto - b.minuto);
    return evs;
  }, [jogo, temLance]);
  const [minuto, setMinuto] = useState(0);
  const [feed, setFeed] = useState([]);
  const [idxEv, setIdxEv] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [bonus, setBonus] = useState({ gol: 0, assist: 0 });
  const [placarLocal, setPlacarLocal] = useState({ meu: 0, adv: 0 });

  useEffect(() => {
    if (pausado || minuto >= 90) return;
    const t = setTimeout(() => {
      const ev = timeline[idxEv];
      if (ev && ev.minuto <= minuto + 4) {
        if (ev.tipo === "lance") { setPausado(true); return; }
        if (ev.tipo === "gol-jogador") { setFeed((f) => [...f, { m: ev.minuto, t: `⚽ GOL SEU! Você balança a rede contra o ${jogo.adversario}!` }]); setPlacarLocal((p) => ({ ...p, meu: p.meu + 1 })); }
        else if (ev.tipo === "gol-time") { setFeed((f) => [...f, { m: ev.minuto, t: `⚽ Gol do ${clube.nome} contra o ${jogo.adversario}.` }]); setPlacarLocal((p) => ({ ...p, meu: p.meu + 1 })); }
        else if (ev.tipo === "gol-adv") { setFeed((f) => [...f, { m: ev.minuto, t: `😬 Gol do ${jogo.adversario}.` }]); setPlacarLocal((p) => ({ ...p, adv: p.adv + 1 })); }
        else if (ev.tipo === "flavor") { setFeed((f) => [...f, { m: ev.minuto, t: ev.texto }]); }
        setIdxEv((i) => i + 1);
        return;
      }
      setMinuto((m) => Math.min(90, m + rand(2, 5)));
    }, 180);
    return () => clearTimeout(t);
  }, [minuto, pausado, idxEv, timeline]);

  useEffect(() => { if (minuto >= 90 && !pausado) { const t = setTimeout(() => onFim(bonus, feed), 500); return () => clearTimeout(t); } }, [minuto, pausado]);

  function resolverLance(opcao) {
    const chance = clamp((attrs[opcao.attr] - 40) / 60, 0.15, 0.9);
    const sucesso = Math.random() < chance;
    const ehGol = opcao.id !== "passe" && opcao.id !== "sair" && opcao.id !== "contra";
    if (sucesso) {
      setFeed((f) => [...f, { m: timeline[idxEv].minuto, t: `🌟 ${opcao.sucesso(jogo.adversario)}` }]);
      if (["ATA", "MEI"].includes(POS_GRUPO[posicao])) {
        if (ehGol) { setPlacarLocal((p) => ({ ...p, meu: p.meu + 1 })); setBonus((b) => ({ ...b, gol: b.gol + 1 })); }
        else setBonus((b) => ({ ...b, assist: b.assist + 1 }));
      }
    } else {
      setFeed((f) => [...f, { m: timeline[idxEv].minuto, t: opcao.falha(jogo.adversario) }]);
    }
    setPausado(false);
    setIdxEv((i) => i + 1);
  }

  const grupo = POS_GRUPO[posicao] || "MEI";
  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="text-center"><div className="text-[9px] text-zinc-500 uppercase">{clube.nome}</div><div className="font-stat font-black text-3xl">{placarLocal.meu}</div></div>
        <div className="text-center"><div className="font-stat text-lg text-amber-400">{minuto}'</div><div className="h-1 w-16 bg-zinc-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-500" style={{ width: `${(minuto / 90) * 100}%` }} /></div></div>
        <div className="text-center"><div className="text-[9px] text-zinc-500 uppercase truncate max-w-[80px]">{jogo.adversario}</div><div className="font-stat font-black text-3xl">{placarLocal.adv}</div></div>
      </div>
      <div className="max-h-40 overflow-y-auto space-y-1 mb-3 text-left">
        {feed.slice().reverse().map((e, i) => <div key={i} className="text-[11px] text-zinc-400"><span className="font-mono text-emerald-500 mr-1.5">{e.m}'</span>{e.t}</div>)}
        {feed.length === 0 && <div className="text-[11px] text-zinc-600 text-center">Bola rolando...</div>}
      </div>
      {pausado && (
        <div className="border-t border-amber-500/30 pt-3">
          <div className="text-[10px] text-amber-400 uppercase tracking-widest mb-2">⚡ Lance-chave — o que você faz?</div>
          <div className="grid gap-1.5">{LANCES_POR_POSICAO[grupo].map((op) => <Button key={op.id} variant="ghost" onClick={() => resolverLance(op)}>{op.label}</Button>)}</div>
        </div>
      )}
    </div>
  );
}

export function GoalMini({ onPick, resultado }) {
  const [golKey, setGolKey] = useState(0);
  useEffect(() => { if (resultado && resultado.gol) setGolKey((k) => k + 1); }, [resultado]);
  const zonaGoleiro = useMemo(() => {
    if (!resultado) return "meio";
    if (resultado.tipo === "Defesa") return resultado.zona;
    const outras = ["esquerdo", "meio", "direito"].filter((z) => z !== resultado.zona);
    return pick(outras);
  }, [resultado]);
  return (
    <div className="mb-3">
      <div className="relative mx-auto" style={{ width: PEN_W * 0.85, height: PEN_H * 0.85, maxWidth: "100%" }}>
        <div className="absolute top-0 left-0 rounded-md overflow-hidden" style={{ width: PEN_W, height: PEN_H, transform: "scale(0.85)", transformOrigin: "top left" }}>
          <PenEstadio />
          <PenGoleiro zona={zonaGoleiro} />
          <PenBola resultado={resultado} />
          {resultado && resultado.gol && <PenEfeitoGol key={golKey} ativo />}
        </div>
      </div>
      {!resultado && <div className="grid grid-cols-3 gap-1.5 mt-2 mx-auto" style={{ width: 220 }}>
        <Button variant="ghost" onClick={() => onPick("esquerdo")}>Esq.</Button>
        <Button variant="ghost" onClick={() => onPick("meio")}>Meio</Button>
        <Button variant="ghost" onClick={() => onPick("direito")}>Dir.</Button>
      </div>}
    </div>
  );
}

export function FaltaCampo() {
  return (
    <svg width={PEN_W} height={PEN_H} viewBox={`0 0 ${PEN_W} ${PEN_H}`} className="absolute inset-0">
      <defs>
        <linearGradient id="faltaCeu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1016" /><stop offset="100%" stopColor="#1c212b" />
        </linearGradient>
        <linearGradient id="faltaGrama" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f9a4e" /><stop offset="100%" stopColor="#248041" />
        </linearGradient>
        <pattern id="faltaFaixa" width="34" height="11" patternUnits="userSpaceOnUse">
          <rect width="34" height="11" fill="#0a2a6b" />
          <rect width="17" height="11" fill="#0e3488" />
          <polygon points="2,8 4,3 6,8" fill="#f2c94c" />
        </pattern>
        <radialGradient id="faltaVinheta" cx="50%" cy="38%" r="80%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.38" />
        </radialGradient>
      </defs>
      <rect width={PEN_W} height={PEN_H} fill="url(#faltaCeu)" />
      {/* arquibancada simples */}
      <rect x="0" y="0" width={PEN_W} height="26" fill="#15181f" />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={i * (PEN_W / 9)} y="0" width={PEN_W / 9 - 1.5} height="26" fill="#1e222c" opacity={i % 2 ? 0.5 : 0.8} />)}
      {/* faixa de patrocínio */}
      <rect x="0" y="26" width={PEN_W} height="11" fill="url(#faltaFaixa)" />
      <text x="6" y="34.5" fill="#fff" fontSize="7" fontWeight="900" fontFamily="sans-serif">A JOIA</text>
      <text x="60" y="34.5" fill="#f2c94c" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">★ TEMPORADA ★</text>
      <text x="150" y="34.5" fill="#fff" fontSize="7" fontWeight="900" fontFamily="sans-serif">A JOIA</text>
      <text x="204" y="34.5" fill="#f2c94c" fontSize="6.5" fontWeight="700" fontFamily="sans-serif">★ TEMPORADA ★</text>
      <text x="294" y="34.5" fill="#fff" fontSize="7" fontWeight="900" fontFamily="sans-serif">A JOIA</text>
      {/* gramado */}
      <rect x="0" y="37" width={PEN_W} height={PEN_H - 37} fill="url(#faltaGrama)" />
      {Array.from({ length: 5 }).map((_, i) => <rect key={i} x="0" y={37 + i * 20} width={PEN_W} height="10" fill="#fff" opacity="0.025" />)}
      <ellipse cx={PEN_W * 0.66} cy="110" rx="30" ry="10" fill="#fff" opacity="0.03" />
      <ellipse cx={PEN_W * 0.22} cy="150" rx="24" ry="8" fill="#fff" opacity="0.03" />
      {/* grande área */}
      <rect x={FALTA_BOX.x} y={FALTA_BOX.y} width={FALTA_BOX.w} height={FALTA_BOX.h} fill="none" stroke="#f5f5f5" strokeOpacity="0.75" strokeWidth="1.2" />
      <line x1={FALTA_GOAL.x - 4} y1={FALTA_GOAL.y + FALTA_GOAL.h} x2={FALTA_GOAL.x + FALTA_GOAL.w + 4} y2={FALTA_GOAL.y + FALTA_GOAL.h} stroke="#f5f5f5" strokeOpacity="0.75" strokeWidth="1.2" />
      {/* arco do círculo central espiando debaixo */}
      <path d={`M ${PEN_W * 0.34} ${PEN_H} Q ${PEN_W * 0.5} ${PEN_H - 46} ${PEN_W * 0.7} ${PEN_H}`} fill="none" stroke="#f5f5f5" strokeOpacity="0.6" strokeWidth="1.4" />
      {/* trave */}
      <rect x={FALTA_GOAL.x + 3} y={FALTA_GOAL.y + 2} width={FALTA_GOAL.w - 6} height={FALTA_GOAL.h - 2} fill="url(#penRede)" opacity="0.85" />
      <rect x={FALTA_GOAL.x + 3} y={FALTA_GOAL.y + 2} width={FALTA_GOAL.w - 6} height={FALTA_GOAL.h - 2} fill="#04050a" opacity="0.22" />
      <rect x={FALTA_GOAL.x - 2.5} y={FALTA_GOAL.y} width="4" height={FALTA_GOAL.h + 3} rx="1.5" fill="#f7f7f7" />
      <rect x={FALTA_GOAL.x + FALTA_GOAL.w - 1.5} y={FALTA_GOAL.y} width="4" height={FALTA_GOAL.h + 3} rx="1.5" fill="#f7f7f7" />
      <rect x={FALTA_GOAL.x - 3} y={FALTA_GOAL.y - 3.5} width={FALTA_GOAL.w + 6} height="4" rx="1.5" fill="#f7f7f7" />
      <rect width={PEN_W} height={PEN_H} fill="url(#faltaVinheta)" />
    </svg>
  );
}

export function FaltaJogadorBarreira() {
  return (
    <svg width="15" height="34" viewBox="0 0 15 34" style={{ overflow: "visible" }}>
      <ellipse cx="7.5" cy="33.5" rx="6" ry="1.2" fill="#000" opacity="0.3" />
      {/* pernas */}
      <rect x="4" y="22" width="3.2" height="11" rx="1.4" fill="#101018" />
      <rect x="7.8" y="22" width="3.2" height="11" rx="1.4" fill="#101018" />
      {/* meião claro */}
      <rect x="4" y="30" width="3.2" height="3" rx="1" fill="#e8e8e8" opacity="0.85" />
      <rect x="7.8" y="30" width="3.2" height="3" rx="1" fill="#e8e8e8" opacity="0.85" />
      {/* short */}
      <rect x="3.4" y="19" width="8.2" height="5" rx="1.5" fill="#12183a" />
      {/* tronco / camisa */}
      <path d="M 3 20 L 2.4 11 Q 2.4 8 7.5 8 Q 12.6 8 12.6 11 L 12 20 Z" fill="#1f3f8f" />
      <path d="M 3 20 L 2.4 11 Q 2.4 8 7.5 8 Q 12.6 8 12.6 11 L 12 20 Z" fill="none" stroke="#0d1f4d" strokeWidth="0.5" />
      {/* braços cruzados na frente (proteção) */}
      <rect x="2.6" y="13" width="9.8" height="2.6" rx="1.3" fill="#183072" />
      {/* cabeça */}
      <circle cx="7.5" cy="4.5" r="3.8" fill="#c98a5e" />
      <path d="M 4 4 Q 7.5 0.5 11 4 L 11 3 Q 7.5 -0.5 4 3 Z" fill="#2a1c12" />
    </svg>
  );
}

export function FaltaBoneco({ bateu, zonaAcerto }) {
  const pulou = bateu && zonaAcerto === "porCima";
  const N = 4;
  const larguraJog = 15;
  return (
    <div className="absolute" style={{ left: FALTA_BONECO_POS.x, top: FALTA_BONECO_POS.y, transform: "translate(-50%,-100%) scale(1.2)", transformOrigin: "bottom center", animation: pulou ? "barreiraPula 480ms ease-out forwards" : "none" }}>
      <div className="flex items-end" style={{ gap: 0 }}>
        {Array.from({ length: N }).map((_, i) => (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : -2.5, zIndex: i === 1 || i === 2 ? 2 : 1 }}>
            <FaltaJogadorBarreira />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PenBolaFalta({ resultado }) {
  const alvo = faltaAlvoBola(resultado);
  const noChao = !resultado;
  return (
    <>
      {noChao && <div className="absolute rounded-full" style={{ width: 30, height: 30, left: alvo.x, top: alvo.y, transform: "translate(-50%,-50%)", backgroundImage: "radial-gradient(circle, rgba(57,255,136,0.5) 0%, rgba(57,255,136,0.15) 65%, transparent 100%)", animation: "miraPulsa 1.4s ease-in-out infinite" }} />}
      <div className="absolute rounded-full transition-all ease-in" style={{
        width: 20 * (noChao ? 1 : alvo.scale), height: 5.5 * (noChao ? 1 : alvo.scale), left: alvo.x,
        top: noChao ? alvo.y + 6 : alvo.y + 7 * alvo.scale, transform: "translate(-50%,-50%)",
        background: "radial-gradient(closest-side, rgba(0,0,0,0.45), transparent)",
        opacity: noChao ? 1 : clamp(1 - (FALTA_SPOT.y - alvo.y) / 150, 0.05, 1), transitionDuration: "620ms",
      }} />
      <div className="absolute rounded-full transition-all ease-in" style={{
        width: 11 * (noChao ? 1.2 : alvo.scale) + 4, height: 11 * (noChao ? 1.2 : alvo.scale) + 4, left: alvo.x, top: alvo.y, transform: "translate(-50%,-50%)", transitionDuration: "620ms",
        background: "radial-gradient(circle at 32% 28%, #fff, #dcdcdc 55%, #a8a8a8)",
        boxShadow: resultado && resultado.gol ? "0 0 14px 3px rgba(57,255,136,0.85), inset 0 0 0 1px #222" : "inset 0 0 0 1px #222, 0 1.5px 3px rgba(0,0,0,0.5)",
      }}>
        {alvo.scale > 0.9 && <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,20 65,32 59,50 41,50 35,32" fill="#1a1a1a" opacity="0.85" /></svg>}
      </div>
    </>
  );
}

export function FreeKickMini({ onPick, resultado }) {
  const [golKey, setGolKey] = useState(0);
  useEffect(() => { if (resultado && resultado.gol) setGolKey((k) => k + 1); }, [resultado]);
  const zonaGoleiro = useMemo(() => {
    if (!resultado) return "meio";
    if (resultado.tipo === "Defesa") return resultado.zona === "porCima" ? "meio" : resultado.zona === "cantoEsquerdo" ? "esquerdo" : "direito";
    return pick(["esquerdo", "meio", "direito"]);
  }, [resultado]);
  return (
    <div className="mb-3">
      <div className="relative mx-auto" style={{ width: PEN_W * 0.85, height: PEN_H * 0.85, maxWidth: "100%" }}>
        <div className="absolute top-0 left-0 rounded-md overflow-hidden" style={{ width: PEN_W, height: PEN_H, transform: "scale(0.85)", transformOrigin: "top left" }}>
          <FaltaCampo />
          <div style={{ position: "absolute", left: FALTA_GOAL.x + FALTA_GOAL.w / 2, top: FALTA_GOAL.y + FALTA_GOAL.h, transform: "scale(0.4)", transformOrigin: "0 0" }}>
            <div style={{ position: "relative", left: -PEN_ZONE_X.meio, top: -(PEN_GOAL.y + PEN_GOAL.h) }}>
              <PenGoleiro zona={zonaGoleiro} />
            </div>
          </div>
          <FaltaBoneco bateu={!!resultado} zonaAcerto={resultado?.zona} />
          <PenBolaFalta resultado={resultado} />
          {resultado && resultado.gol && <PenEfeitoGol key={golKey} ativo />}
        </div>
      </div>
      {!resultado && <div className="grid grid-cols-3 gap-1.5 mt-2 mx-auto" style={{ width: 220 }}>
        <Button variant="ghost" onClick={() => onPick("cantoEsquerdo")}>Canto esq.</Button>
        <Button variant="ghost" onClick={() => onPick("porCima")}>Por cima</Button>
        <Button variant="ghost" onClick={() => onPick("cantoDireito")}>Canto dir.</Button>
      </div>}
    </div>
  );
}

export function PasseCampo() {
  return (
    <svg width={PASSE_W} height={PASSE_H} viewBox={`0 0 ${PASSE_W} ${PASSE_H}`} className="absolute inset-0">
      <defs>
        <linearGradient id="passeGrama" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12341f" /><stop offset="100%" stopColor="#1e7a3f" />
        </linearGradient>
        <radialGradient id="passeVinheta" cx="50%" cy="40%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <rect width={PASSE_W} height={PASSE_H} fill="url(#passeGrama)" />
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x="0" y={i * (PASSE_H / 6)} width={PASSE_W} height={PASSE_H / 12} fill="#fff" opacity="0.03" />)}
      <circle cx={PASSE_W / 2} cy={PASSE_H * 0.3} r="34" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.4" />
      <line x1="0" y1={PASSE_H * 0.06} x2={PASSE_W} y2={PASSE_H * 0.06} stroke="#fff" strokeOpacity="0.25" strokeWidth="1.4" />
      <rect width={PASSE_W} height={PASSE_H} fill="url(#passeVinheta)" />
    </svg>
  );
}

export function PassePersonagem({ x, y, tipo, selecionavel, destacado, onClick }) {
  const cor = tipo === "adversario" ? "#D6483F" : tipo === "voce" ? "#D8B44A" : "#22D3EE";
  const escala = 0.55 + (y / PASSE_H) * 0.55;
  return (
    <button onClick={selecionavel ? onClick : undefined} disabled={!selecionavel}
      className="absolute" style={{ left: x, top: y, transform: `translate(-50%,-50%) scale(${escala})`, background: "none", border: "none", padding: 0, cursor: selecionavel ? "pointer" : "default" }}>
      <svg width="26" height="34" viewBox="0 0 26 34" style={{ overflow: "visible", filter: destacado ? `drop-shadow(0 0 6px ${cor})` : "none" }}>
        <ellipse cx="13" cy="33" rx="8" ry="1.6" fill="#000" opacity="0.3" />
        <rect x="9" y="20" width="3.6" height="11" rx="1.6" fill="#12141a" />
        <rect x="13.4" y="20" width="3.6" height="11" rx="1.6" fill="#12141a" />
        <rect x="6" y="9" width="14" height="13" rx="4" fill={cor} opacity="0.92" />
        <circle cx="13" cy="4.5" r="4.6" fill="#181b22" />
      </svg>
      {selecionavel && <div className="absolute left-1/2 -translate-x-1/2 -top-3 text-[8px] text-cyan-300">▼</div>}
    </button>
  );
}

export function PasseBola({ origem, alvo, resultado }) {
  const pos = !resultado ? origem : resultado.gol ? alvo : { x: resultado.ponto.cx, y: resultado.ponto.cy };
  return (
    <div className="absolute rounded-full transition-all ease-out" style={{
      width: 10, height: 10, left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", transitionDuration: "520ms",
      background: "radial-gradient(circle at 32% 28%, #fff, #dcdcdc 55%, #a8a8a8)", boxShadow: "inset 0 0 0 1px #222, 0 1px 3px rgba(0,0,0,0.5)",
    }} />
  );
}

export function PasseMini({ atributoPasse, onResultado, cenaForcada, alvoForcado, resultadoForcado }) {
  const cena = useMemo(() => cenaForcada || gerarCenaPasse(), []);
  const [alvo, setAlvo] = useState(alvoForcado || null);
  const [resultado, setResultado] = useState(resultadoForcado || null);
  useEffect(() => { if (alvoForcado) setAlvo(alvoForcado); if (resultadoForcado) setResultado(resultadoForcado); }, [alvoForcado, resultadoForcado]);
  function escolher(companheiro) {
    if (resultadoForcado || alvo) return;
    setAlvo(companheiro);
    const r = calcularSucessoPasse(atributoPasse, PASSE_ORIGEM, companheiro, cena.adversarios);
    setTimeout(() => { setResultado(r); onResultado?.(r, companheiro, cena); }, 520);
  }
  return (
    <div className="mb-3">
      <div className="relative mx-auto rounded-md overflow-hidden" style={{ width: PASSE_W * 0.85, height: PASSE_H * 0.85, maxWidth: "100%" }}>
        <div className="absolute top-0 left-0" style={{ width: PASSE_W, height: PASSE_H, transform: "scale(0.85)", transformOrigin: "top left" }}>
          <PasseCampo />
          {cena.adversarios.map((a) => <PassePersonagem key={a.id} x={a.x} y={a.y} tipo="adversario" destacado={resultado && !resultado.gol && resultado.adversarioCulpado.id === a.id} />)}
          {cena.companheiros.map((cp) => (
            <PassePersonagem key={cp.id} x={cp.x} y={cp.y} tipo="companheiro" selecionavel={!alvo} selecionado={alvo?.id === cp.id}
              destacado={resultado?.gol && alvo?.id === cp.id} onClick={() => escolher(cp)} />
          ))}
          <PassePersonagem x={PASSE_ORIGEM.x} y={PASSE_ORIGEM.y} tipo="voce" />
          {alvo && <PasseBola origem={PASSE_ORIGEM} alvo={alvo} resultado={resultado} />}
        </div>
      </div>
      {!alvo && <p className="text-[10px] text-zinc-500 text-center mt-2">Clique num companheiro pra tentar o passe.</p>}
    </div>
  );
}

export function ScrambleNumber({ value, duration = 650, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const isStars = typeof value === "string";
    let frame = 0;
    const totalFrames = Math.round(duration / 35);
    const id = setInterval(() => {
      frame++;
      if (frame >= totalFrames) { setDisplay(String(value)); clearInterval(id); return; }
      setDisplay(isStars ? Array.from({ length: value.length }, () => (Math.random() > 0.5 ? "★" : "☆")).join("") : String(rand(40, 99)));
    }, 35);
    return () => clearInterval(id);
  }, [value, duration]);
  return <span>{prefix}{display}{suffix}</span>;
}

export function ScrambleText({ text, duration = 650, className }) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÇÃÕ";
    let frame = 0;
    const totalFrames = Math.round(duration / 35);
    const id = setInterval(() => {
      frame++;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") { out += " "; continue; }
        out += i < revealCount ? text[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(out);
      if (frame >= totalFrames) { setDisplay(text); clearInterval(id); }
    }, 35);
    return () => clearInterval(id);
  }, [text, duration]);
  return <span className={className}>{display}</span>;
}

export function TimingBar({ onResult, sweetMin = 0.42, sweetMax = 0.58, duracao = 1100, label = "Parar" }) {
  const [startTime] = useState(() => Date.now());
  function handleClick() {
    const elapsed = (Date.now() - startTime) % (duracao * 2);
    const t = elapsed < duracao ? elapsed / duracao : (duracao * 2 - elapsed) / duracao;
    const acerto = t >= sweetMin && t <= sweetMax;
    onResult(acerto, t);
  }
  return (
    <div className="mb-2">
      <div className="relative h-7 bg-zinc-800 rounded-full overflow-hidden mb-2 border border-zinc-700">
        <div className="absolute top-0 bottom-0 bg-emerald-500/40" style={{ left: `${sweetMin * 100}%`, width: `${(sweetMax - sweetMin) * 100}%` }} />
        <div className="absolute top-0 bottom-0 w-2 bg-white rounded-full" style={{ animation: `slideBar ${duracao}ms linear infinite alternate` }} />
      </div>
      <Button onClick={handleClick}>{label}</Button>
    </div>
  );
}

export function AttrRadar({ attrs, baseline }) {
  const keys = NUM_ATTRS;
  const cx = 50, cy = 50, maxR = 38;
  const angleFor = (i) => (Math.PI * 2 * i) / keys.length - Math.PI / 2;
  const pointFor = (value, i) => {
    const r = (clamp(value, 0, 99) / 99) * maxR;
    const a = angleFor(i);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const toPath = (pts) => pts.map((p) => p.join(",")).join(" ");
  const playerPts = keys.map((k, i) => pointFor(attrs[k], i));
  const basePts = keys.map((_, i) => pointFor(baseline, i));
  const labelPts = keys.map((k, i) => { const a = angleFor(i); return { x: cx + (maxR + 11) * Math.cos(a), y: cy + (maxR + 11) * Math.sin(a), label: ATTR_SLOTS.find((s) => s.id === k)?.abrev || k }; });
  return (
    <svg viewBox="0 0 100 100" className="w-full h-40">
      {[0.33, 0.66, 1].map((f, i) => <polygon key={i} points={toPath(keys.map((_, j) => pointFor(99 * f, j)))} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />)}
      <polygon points={toPath(basePts)} fill="rgba(34,211,238,0.08)" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2,2" />
      <polygon points={toPath(playerPts)} fill="rgba(57,255,136,0.2)" stroke="#39FF88" strokeWidth="1.5" />
      {labelPts.map((p, i) => <text key={i} x={p.x} y={p.y} fontSize="6" fill="#a1a1aa" textAnchor="middle" dominantBaseline="middle">{p.label}</text>)}
    </svg>
  );
}

export function AttrBarDelta({ label, value, anterior, max = 99, posicao }) {
  const delta = anterior != null ? value - anterior : 0;
  const labelExibido = labelAtributoGoleiro(label, posicao);
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 text-[10px] font-sport font-bold text-zinc-400">{labelExibido}</div>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full bar-fill" style={{ width: `${(value / max) * 100}%`, background: "linear-gradient(90deg, #22D3EE, #39FF88)" }} />
      </div>
      <div className="w-7 text-right text-[11px] font-stat font-bold text-zinc-200">{value}</div>
      {delta !== 0 && (
        <div className={`text-[10px] font-bold font-stat w-10 text-right ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>{delta > 0 ? "▲" : "▼"}{Math.abs(delta)}</div>
      )}
    </div>
  );
}

export function AttrBar({ label, value, max = 99, posicao }) {
  const labelExibido = labelAtributoGoleiro(label, posicao);
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW((value / max) * 100));
    return () => cancelAnimationFrame(id);
  }, [value, max]);
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-8 text-[9px] font-sport font-bold text-zinc-400">{labelExibido}</div>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full bar-fill" style={{ width: `${w}%`, background: "linear-gradient(90deg, #22D3EE, #39FF88)" }} />
      </div>
      <div className="w-6 text-right text-[10px] font-stat text-zinc-300">{value}</div>
    </div>
  );
}

export function CurvaEvolucao({ temporadas }) {
  if (!temporadas.length) return null;
  const w = 280, h = 90, pad = 10;
  const idades = temporadas.map((t) => t.idade);
  const ovrs = temporadas.map((t) => t.ovr);
  const minIdade = Math.min(...idades), maxIdade = Math.max(...idades);
  const minOvr = Math.min(...ovrs) - 3, maxOvr = Math.max(...ovrs) + 3;
  const coords = temporadas.map((t) => ({
    x: pad + ((t.idade - minIdade) / Math.max(1, maxIdade - minIdade)) * (w - 2 * pad),
    y: h - pad - ((t.ovr - minOvr) / Math.max(1, maxOvr - minOvr)) * (h - 2 * pad),
  }));
  const picoIdx = ovrs.indexOf(Math.max(...ovrs));
  const pts = coords.map((p) => `${p.x},${p.y}`).join(" ");
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="#12A876" strokeWidth="2" />
      {coords[picoIdx] && <circle cx={coords[picoIdx].x} cy={coords[picoIdx].y} r="4" fill="#D8B44A" />}
    </svg>
  );
}

export function JogadorCard({ attrs, posicao, papelTatico, ovr }) {
  const tier = tierInfo(ovr);
  return (
    <div
      className="w-64 h-96 rounded-2xl relative shadow-2xl flex flex-col p-5 text-white border transition-all duration-500 hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${tier.cor} 0%, #111827 80%)`,
        borderColor: tier.cor
      }}
    >
      {ovr >= 93 && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-2xl pointer-events-none" />
      )}
      <div className="flex justify-between items-start border-b border-white/10 pb-3">
        <div>
          <span className="text-4xl font-extrabold block tracking-tighter">{ovr}</span>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
            {posicao}
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl">💎</span>
          <p className="text-[10px] uppercase text-zinc-400 mt-1">{tier.label}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-6 flex-1 content-center">
        {ATTR_SLOTS.filter(a => a.tipo === "num").map((attr) => (
          <div key={attr.id} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
            <span className="text-xs font-semibold text-zinc-400 uppercase">{labelAtributoGoleiro(attr.abrev, posicao)}</span>
            <span className="text-sm font-bold" style={{ color: attrs[attr.id] >= 80 ? '#22c55e' : '#fff' }}>
              {attrs[attr.id]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto border-t border-white/10 pt-3 text-center">
        <p className="text-[11px] uppercase tracking-widest text-zinc-400">Função Atual</p>
        <p className="text-xs font-bold text-amber-400 truncate">{papelTatico || "Padrão"}</p>
      </div>
    </div>
  );
}

export function PlayerFutCard({ nome, posicao, ovr, clube, gols, assist, dinheiro, idade, attrs, nacionalidade, especial, baseline }) {
  const t = tierInfo(ovr);
  const nac = nacDe(nacionalidade);
  const corBorda = especial ? "#D8B44A" : t.cor;
  return (
    <div className="w-72 mx-auto relative" style={{ filter: especial ? "drop-shadow(0 0 14px rgba(216,180,74,0.45))" : "none" }}>
      <div className={`p-5 bg-gradient-to-b from-zinc-800/90 to-zinc-900/95 backdrop-blur-md border-2 relative overflow-hidden ${especial ? "glow-border" : ""}`} style={{ borderColor: corBorda, clipPath: "polygon(10% 0%, 90% 0%, 100% 8%, 100% 92%, 90% 100%, 10% 100%, 0% 92%, 0% 8%)" }}>
        <div className="shimmer-sweep" />
        {especial && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}
        <div className="flex justify-between items-start mb-1 relative">
          <div>
            <div className="text-5xl font-stat font-bold leading-none" style={{ color: corBorda }}>{ovr}</div>
            <div className="text-xs font-sport font-semibold text-zinc-400 mt-1">{posicao}{nac ? ` · ${nac.id}` : ""}</div>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle at 35% 30%, ${corBorda}22, #1a1a1a)`, border: `2px solid ${corBorda}` }}>
            <SilhuetaJogador size={44} cor={corBorda} />
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: corBorda }}>{especial ? "★ Destaque da temporada" : t.label}</div>
        <div className="font-bold text-base mb-0.5 truncate">{nome}</div>
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-3 truncate">{clube && typeof clube === "object" ? <><ClubDot club={clube} size={16} />{clube.nome}</> : clube}{idade ? ` · ${idade} anos` : ""}</div>
        {attrs && <div className="mb-2"><AttrBar label="VEL" value={attrs.velocidade} /><AttrBar label="FIN" value={attrs.finalizacao} /><AttrBar label="PAS" value={attrs.passe} /><AttrBar label="DRI" value={attrs.drible} /><AttrBar label="DEF" value={attrs.defesa} /><AttrBar label="FIS" value={attrs.fisico} /></div>}
        {attrs && baseline != null && (
          <div className="mb-2 border-t border-zinc-700/60 pt-2">
            <div className="text-[8px] text-zinc-500 uppercase tracking-widest text-center mb-1">Você vs. média da liga</div>
            <AttrRadar attrs={attrs} baseline={baseline} />
          </div>
        )}
        <div className="grid grid-cols-3 gap-1 border-t border-zinc-700 pt-2.5 text-center">
          <div><div className="font-mono text-sm font-bold"><CountUp value={gols} /></div><div className="text-[8px] text-zinc-500 uppercase">Gols</div></div>
          <div><div className="font-mono text-sm font-bold"><CountUp value={assist} /></div><div className="text-[8px] text-zinc-500 uppercase">Assist.</div></div>
          <div><div className="font-mono text-sm font-bold">$<CountUp value={dinheiro} formatter={formatarDinheiro} /></div><div className="text-[8px] text-zinc-500 uppercase">Dinheiro</div></div>
        </div>
        <div className="text-[8px] text-zinc-600 text-center mt-2 uppercase tracking-widest">a joia</div>
      </div>
    </div>
  );
}

