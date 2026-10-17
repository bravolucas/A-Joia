import React, { useState } from "react";
import { ARTE } from "./arte.js";
import AJoiaGame from "./AJoiaGame.jsx";
import ModoRapido, { ESTILO_BASE } from "./ModoRapido.jsx";
import { Gema } from "./components.jsx";
import { carregarRapido } from "./rapido.js";

/* Porta de entrada: escolhe entre o Modo Carreira (completo) e o Modo Rápido.
   Os dois modos não compartilham estado nem save. */
export default function App() {
  const [modo, setModo] = useState(null);

  if (modo === "carreira") return <AJoiaGame />;
  if (modo === "rapido") return <ModoRapido onSair={() => setModo(null)} />;

  const rapidoSalvo = carregarRapido();
  const rapidoEmAndamento = rapidoSalvo && rapidoSalvo.etapa !== "criacao" && rapidoSalvo.etapa !== "fim";

  return (
    <div className="rp flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <style>{ESTILO_BASE}</style>
      <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(14,21,18,.55) 0%, rgba(14,21,18,.8) 55%, #0E1512 100%), url(${ARTE.estadioNoite}) center 35%/cover` }} />
      <div className="relative w-full max-w-3xl flex flex-col items-center gap-8 rp-entra">
        <div className="flex flex-col items-center gap-4 text-center">
          <Gema size={112} />
          <h1 className="display font-black text-4xl md:text-5xl tracking-wider text-[#F2F5F3]">A JOIA</h1>
          <p className="font-semibold text-sm uppercase tracking-[0.3em] text-[#8FA39A]">Simulador de carreira</p>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-4">
          <button onClick={() => setModo("rapido")} className="rp-opcao backdrop-blur-md p-6 flex flex-col gap-3 min-h-[200px]" style={{ borderColor: "rgba(216,180,74,.45)" }}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#EBC557]">Novo · 5 a 10 minutos</span>
            <span className="display text-xl text-[#F2F5F3]">Modo Rápido</span>
            <span className="text-[17px] leading-snug text-[#C9D3CE]">Uma temporada por tela. Decisões que não se desfazem, Copa do Mundo, Bola de Ouro e o seu legado no fim.</span>
            <span className="mt-auto text-[15px] font-bold text-[#EBC557]">{rapidoEmAndamento ? `Continuar: ${rapidoSalvo.c.nome}, ${rapidoSalvo.c.idade} anos →` : "Começar →"}</span>
          </button>
          <button onClick={() => setModo("carreira")} className="rp-opcao backdrop-blur-md p-6 flex flex-col gap-3 min-h-[200px]">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7FE3BC]">Completo</span>
            <span className="display text-xl text-[#F2F5F3]">Modo Carreira</span>
            <span className="text-[17px] leading-snug text-[#C9D3CE]">Jogo a jogo, com treinos, partidas ao vivo, mercado, vestiário e torcida. Para quem quer viver cada detalhe.</span>
            <span className="mt-auto text-[15px] font-bold text-[#7FE3BC]">Entrar →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
