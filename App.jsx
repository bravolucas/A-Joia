import Icone from "./Icone.jsx";
import React, { Suspense, lazy, useState } from "react";
import { ARTE } from "./arte.js";
// o Modo Carreira é grande: só baixa quando a pessoa entra nele
const AJoiaGame = lazy(() => import("./AJoiaGame.jsx"));
import ModoRapido, { ESTILO_BASE, BotaoSom } from "./ModoRapido.jsx";
import { Gema } from "./components.jsx";
import { carregarRapido, RITMOS, ritmoDe } from "./rapido.js";

/* Porta de entrada com a cara da A JOIA: a gema, verde-esmeralda e dourado, e o ritmo em cartões.
   Os dois modos não compartilham estado nem save. */
export default function App() {
  const [modo, setModo] = useState(null);
  const [ritmo, setRitmo] = useState("normal");
  const [nova, setNova] = useState(false);

  if (modo === "carreira") {
    return (
      <Suspense fallback={<div className="rp flex items-center justify-center min-h-screen"><style>{ESTILO_BASE}</style><div className="flex flex-col items-center gap-4 text-[#8FA39A]"><Gema size={72} /><span>Carregando o Modo Carreira…</span></div></div>}>
        <AJoiaGame />
      </Suspense>
    );
  }
  if (modo === "rapido") return <ModoRapido onSair={() => { setModo(null); setNova(false); }} ritmoInicial={ritmo} nova={nova} />;

  const salvo = carregarRapido();
  const emAndamento = salvo && salvo.etapa !== "criacao" && salvo.etapa !== "fim";
  const comecar = (zero) => { setNova(zero); setModo("rapido"); };

  const cadencia = { intenso: 1, normal: 2, expresso: 3 };
  return (
    <div className="rp min-h-screen" style={{ background: "radial-gradient(120% 60% at 50% -10%, #12352A 0%, #0E1512 55%, #0A0F0D 100%)" }}>
      <style>{ESTILO_BASE}</style>
      <main className="max-w-md mx-auto px-4 pt-6 pb-10 flex flex-col gap-5">
        <div className="flex justify-end -mb-3"><BotaoSom compacto /></div>
        {/* marca: a gema no centro, a foto ao fundo */}
        <section className="relative rounded-[28px] overflow-hidden border border-[#D8B44A]/25 rp-entra" aria-label="A JOIA">
          <div className="absolute inset-0" style={{ background: `url(${ARTE.porDoSol}) center 55%/cover` }} aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,21,18,.35), rgba(14,21,18,.82) 60%, #0E1512), radial-gradient(60% 45% at 50% 38%, rgba(216,180,74,.28), transparent 70%)" }} aria-hidden="true" />
          <div className="relative flex flex-col items-center text-center px-5 pt-8 pb-6">
            <div className="relative">
              <div className="absolute left-1/2 top-1/2 w-[190px] h-[190px] rounded-full pointer-events-none" aria-hidden="true"
                style={{ background: "repeating-conic-gradient(from 0deg, rgba(245,215,122,.16) 0deg 6deg, transparent 6deg 24deg)", animation: "rpRaios 28s linear infinite", maskImage: "radial-gradient(circle, #000 30%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle, #000 30%, transparent 70%)" }} />
              <Gema size={92} className="relative drop-shadow-[0_8px_24px_rgba(18,168,118,.45)]" />
            </div>
            <h1 className="display text-[34px] leading-none mt-4 tracking-wide" style={{ background: "linear-gradient(180deg,#FFF1B8,#E3B93B 60%,#B8902A)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>A JOIA</h1>
            <p className="text-[17px] font-semibold text-[#F2F5F3] mt-3 leading-snug">Da peneira à Bola de Ouro.</p>
            <p className="text-[15px] text-[#C9D3CE] leading-snug">Cada escolha lapida a sua carreira.</p>
            <p className="text-[11px] text-[#8FA39A] mt-2">Versão 2026.10.26 · Treinador Expresso</p>
          </div>
        </section>

        {/* ritmo: três cartões com a linha da carreira (◆ dourado = ano de decisão) */}
        <section aria-label="Ritmo da carreira">
          <div className="flex items-baseline justify-between px-1 mb-2">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#8FA39A]">Escolha o seu ritmo</h2>
            <span className="text-[12px] text-[#8FA39A]"><span className="text-[#EBC557]">◆</span> ano de decisão</span>
          </div>
          <div className="flex flex-col gap-2" role="radiogroup">
            {RITMOS.map((r) => {
              const sel = ritmo === r.id;
              return (
                <button key={r.id} role="radio" aria-checked={sel} onClick={() => setRitmo(r.id)}
                  className={`rp-opcao px-3.5 py-3 flex items-center gap-3 ${sel ? "sel" : ""}`}>
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0 border" style={{ background: sel ? "rgba(18,168,118,.18)" : "rgba(255,255,255,.04)", borderColor: sel ? "#12A876" : "rgba(255,255,255,.08)" }}><Icone e={r.icone} size={24} cor={sel ? "#12A876" : "#C9D3CE"} /></span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[18px] font-bold text-[#F2F5F3]">{r.nome}</span>
                      <span className="flex gap-[3px] shrink-0" aria-hidden="true">
                        {Array.from({ length: 9 }, (_, k) => <span key={k} className="text-[11px] leading-none" style={{ color: k % cadencia[r.id] === 0 ? "#EBC557" : "rgba(255,255,255,.18)" }}>◆</span>)}
                      </span>
                    </span>
                    <span className="block text-[14px] text-[#8FA39A] leading-snug">{r.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-2">
          {emAndamento ? (
            <>
              <button onClick={() => comecar(false)} className="rp-btn rp-prim text-[17px] flex items-center justify-center gap-2"><Gema size={20} /> Continuar · {salvo.c.nome}, {salvo.c.idade} anos</button>
              <button onClick={() => comecar(true)} className="rp-btn rp-sec text-[16px]">Nova carreira ({ritmoDe(ritmo).nome})</button>
            </>
          ) : (
            <button onClick={() => comecar(true)} className="rp-btn rp-ouro display text-[14px] tracking-wide flex items-center justify-center gap-2"><Gema size={22} /> Começar carreira</button>
          )}
        </div>

        <button onClick={() => setModo("carreira")} className="rp-painel flex items-center gap-3 px-4 py-3.5 text-left hover:border-[#12A876]/60 transition-colors">
          <span className="w-11 h-11 rounded-xl shrink-0 border border-white/10" style={{ background: `url(${ARTE.estadioNoite}) center/cover` }} aria-hidden="true" />
          <span className="flex-1 min-w-0">
            <span className="block text-[16px] font-bold text-[#F2F5F3]">Modo Carreira completo</span>
            <span className="block text-[14px] text-[#8FA39A]">Jogo a jogo, com treinos, partidas e mercado</span>
          </span>
          <span className="text-[#7FE3BC] text-xl" aria-hidden="true">›</span>
        </button>

        <p className="text-[12px] leading-snug text-center text-[#5F6E68] mt-1">Nomes de clubes, competições e jogadores reais aparecem só para identificação dentro da simulação. A JOIA não é afiliado, patrocinado nem endossado por eles. Ícones: game-icons.net (CC BY 3.0) · bandeiras: flag-icons (MIT).</p>
      </main>
    </div>
  );
}
