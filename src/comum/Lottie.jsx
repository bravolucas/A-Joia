import React, { useEffect, useRef, useState } from "react";

/* Animações Lottie opcionais: só existem se o arquivo estiver em arte/animacoes/.
   O tocador (lottie-web, MIT) só é baixado quando há o que tocar. */
const ARQUIVOS = Object.fromEntries(Object.entries(import.meta.glob("../../arte/animacoes/*.json", { query: "?url", import: "default", eager: true }))
  .map(([k, v]) => [k.split("/").pop().replace(/\.json$/, ""), v]));
export const temAnimacao = (nome) => !!ARQUIVOS[nome];

export default function Lottie({ nome, className = "", loop = false, style }) {
  const ref = useRef(null);
  const [reduzido, setReduzido] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mudar = () => setReduzido(media.matches); media.addEventListener('change', mudar);
    return () => media.removeEventListener('change', mudar);
  }, []);
  useEffect(() => {
    const url = ARQUIVOS[nome];
    if (reduzido || !url || !ref.current) return undefined;
    let anim, vivo = true;
    import("lottie-web/build/player/lottie_light").then((m) => {
      if (!vivo || !ref.current) return;
      anim = (m.default || m).loadAnimation({ container: ref.current, renderer: "svg", loop, autoplay: true, path: url });
    }).catch(() => {});
    return () => { vivo = false; try { anim?.destroy(); } catch { /* nada */ } };
  }, [nome, loop, reduzido]);
  if (reduzido || !ARQUIVOS[nome]) return null;
  return <div ref={ref} className={className} style={style} aria-hidden="true" />;
}
