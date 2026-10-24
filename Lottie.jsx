import React, { useEffect, useRef } from "react";

/* Animações Lottie opcionais: só existem se o arquivo estiver em arte/animacoes/.
   O tocador (lottie-web, MIT) só é baixado quando há o que tocar. */
const ARQUIVOS = Object.fromEntries(Object.entries(import.meta.glob("./arte/animacoes/*.json", { query: "?url", import: "default", eager: true }))
  .map(([k, v]) => [k.split("/").pop().replace(/\.json$/, ""), v]));
export const temAnimacao = (nome) => !!ARQUIVOS[nome];

export default function Lottie({ nome, className = "", loop = false, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const url = ARQUIVOS[nome];
    if (!url || !ref.current) return undefined;
    let anim, vivo = true;
    import("lottie-web/build/player/lottie_light").then((m) => {
      if (!vivo || !ref.current) return;
      anim = (m.default || m).loadAnimation({ container: ref.current, renderer: "svg", loop, autoplay: true, path: url });
    }).catch(() => {});
    return () => { vivo = false; try { anim?.destroy(); } catch { /* nada */ } };
  }, [nome, loop]);
  if (!ARQUIVOS[nome]) return null;
  return <div ref={ref} className={className} style={style} aria-hidden="true" />;
}
