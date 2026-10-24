import React from "react";
import { ICONES } from "./icones.js";

/* Ícone do jogo no lugar do emoji (mesmo traço em todos os aparelhos).
   Herda o tamanho da fonte (1.15em) e a cor do texto, a menos que venham por props. */
export default function Icone({ e, size, cor, className = "", titulo }) {
  const body = e && ICONES[e];
  if (!body) return e ? <span className={className} aria-hidden={!titulo}>{e}</span> : null;
  const dim = size || "1.15em";
  return (
    <svg viewBox="0 0 512 512" width={dim} height={dim} className={`inline-block shrink-0 align-[-0.18em] ${className}`} style={cor ? { color: cor } : undefined}
      role={titulo ? "img" : undefined} aria-label={titulo} aria-hidden={titulo ? undefined : true} dangerouslySetInnerHTML={{ __html: body }} />
  );
}
