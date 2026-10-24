import React, { Suspense, lazy, useState } from "react";
import { ARTE } from "./arte.js";
// o Modo Carreira é grande: só baixa quando a pessoa entra nele
const AJoiaGame = lazy(() => import("./AJoiaGame.jsx"));
import ModoRapido, { ESTILO_BASE } from "./ModoRapido.jsx";
import { Gema } from "./components.jsx";
import { carregarRapido, RITMOS, ritmoDe } from "./rapido.js";

/* Porta de entrada no estilo do Copero: banner, ritmo em pílulas e um botão branco.
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

  return (
    <div className="rp cp min-h-screen" style={{ background: "#0B0B0C" }}>
      <style>{ESTILO_BASE}</style>
      <header className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
        <Gema size={26} />
        <span className="text-[17px] font-extrabold text-white tracking-tight">A JOIA</span>
      </header>
      <main className="max-w-md mx-auto px-4 pb-10 flex flex-col gap-4">
        {/* banner */}
        <section className="relative h-[250px] rounded-[24px] overflow-hidden cp-surge" aria-label="Simulador de carreira">
          <div className="absolute inset-0" style={{ background: `url(${ARTE.estadioNoite}) center 40%/cover` }} aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,11,12,.15) 0%, rgba(11,11,12,.55) 50%, rgba(11,11,12,.96) 100%), linear-gradient(110deg, rgba(234,88,12,.35), transparent 55%)" }} aria-hidden="true" />
          <div className="absolute -right-4 -top-6 select-none font-black text-[150px] leading-none text-white/[.07] tracking-tighter" aria-hidden="true">10</div>
          <div className="absolute left-5 top-10 select-none font-black text-[70px] leading-none text-white/[.06]" aria-hidden="true">9</div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h1 className="text-[28px] leading-[1.05] font-black text-white">Construa sua carreira no futebol</h1>
            <p className="text-[14px] leading-snug text-[#D4D4D8] mt-2">Escolha sua origem, tome decisões e veja até onde a história te leva: títulos, Copa do Mundo, Bola de Ouro e o seu legado.</p>
          </div>
        </section>

        {/* ritmo */}
        <div>
          <div className="cp-seg" role="group" aria-label="Ritmo da carreira">
            {RITMOS.map((r) => <button key={r.id} aria-pressed={ritmo === r.id} onClick={() => setRitmo(r.id)}>{r.nome}</button>)}
          </div>
          <p className="text-[13px] text-[#A1A1AA] text-center mt-2">{ritmoDe(ritmo).desc}</p>
        </div>

        {emAndamento ? (
          <>
            <button onClick={() => comecar(false)} className="cp-pill cp-branca text-[16px]">Continuar · {salvo.c.nome}, {salvo.c.idade} anos</button>
            <button onClick={() => comecar(true)} className="cp-pill cp-contorno text-[15px]">Nova carreira</button>
          </>
        ) : (
          <button onClick={() => comecar(true)} className="cp-pill cp-branca text-[16px]">Começar carreira</button>
        )}

        <button onClick={() => setModo("carreira")} className="cp-card flex items-center gap-3 px-4 py-3.5 text-left hover:border-[#3F3F46]">
          <span className="w-10 h-10 rounded-xl bg-[#27272A] flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E4E4E7" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[15px] font-bold text-white">Modo Carreira completo</span>
            <span className="block text-[13px] text-[#A1A1AA]">Jogo a jogo, com treinos, partidas e mercado</span>
          </span>
          <span className="text-[#71717A] text-xl" aria-hidden="true">›</span>
        </button>

        <p className="text-[11px] leading-snug text-center text-[#71717A] mt-2">Nomes de clubes, competições e jogadores reais aparecem só para identificação dentro da simulação. A JOIA não é afiliado, patrocinado nem endossado por eles.</p>
      </main>
    </div>
  );
}
