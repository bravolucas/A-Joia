import React from "react";
import { logoCompeticao } from "./arte.js";
import { svgDaTaca, metalDaTaca } from "./tacas.js";

/* Taças do A JOIA: uma silhueta própria para cada tipo de competição, todas
   desenhadas para o jogo (nenhuma reproduz troféu real). O facetado de gema
   aparece em várias delas como assinatura da marca. */

const METAIS = {
  ouro: ["#FFF1B8", "#E3B93B", "#8E6F00"],
  prata: ["#FFFFFF", "#C7CDD6", "#6C7470"],
  bronze: ["#F3C49A", "#C27A44", "#6B4320"],
};

/* Taças: cada competição tem a sua, gerada em tacas.js a partir do nome. */
export function TacaCompeticao({ tipo = "liga", size = 40, nome = null, preferirTaca = true }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  // logo da competição, se a pessoa colocou o arquivo em arte/competicoes/
  const logo = nome ? logoCompeticao(nome) : null;
  if (logo && !preferirTaca) return <img src={logo} alt="" aria-hidden="true" className="shrink-0 object-contain select-none" draggable="false" style={{ width: size, height: size * 1.2, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.5))" }} />;
  const brilho = METAIS[metalDaTaca(tipo, nome) === "bronze" ? "bronze" : metalDaTaca(tipo, nome) === "ouro" ? "ouro" : "prata"][1];
  const sombra = { filter: `drop-shadow(0 ${Math.max(2, size / 20)}px ${Math.max(4, size / 7)}px rgba(0,0,0,.55)) drop-shadow(0 0 ${Math.max(4, size / 6)}px ${brilho}55)` };
  const html = svgDaTaca(tipo, nome).replaceAll("__ID__", `t${uid}`);
  return <span aria-hidden="true" className="shrink-0 inline-block select-none" style={{ width: size, height: size * 1.2, ...sombra }} dangerouslySetInnerHTML={{ __html: html }} />;
}
