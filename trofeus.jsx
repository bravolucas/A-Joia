import React from "react";
import { logoCompeticao } from "./arte.js";

/* Taças do A JOIA: uma silhueta própria para cada tipo de competição, todas
   desenhadas para o jogo (nenhuma reproduz troféu real). O facetado de gema
   aparece em várias delas como assinatura da marca. */

const METAIS = {
  ouro: ["#FFF1B8", "#E3B93B", "#8E6F00"],
  prata: ["#FFFFFF", "#C7CDD6", "#6C7470"],
  bronze: ["#F3C49A", "#C27A44", "#6B4320"],
};

function Defs({ id, metal }) {
  const [c1, c2, c3] = METAIS[metal] || METAIS.ouro;
  return (
    <defs>
      <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={c1} /><stop offset="45%" stopColor={c2} /><stop offset="100%" stopColor={c3} />
      </linearGradient>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A3A33" /><stop offset="100%" stopColor="#0E1512" />
      </linearGradient>
    </defs>
  );
}

/* Base escalonada comum (madeira escura com placa) */
const Base = ({ id, y = 96, w = 46 }) => (
  <g>
    <rect x={50 - w / 2} y={y} width={w} height="10" rx="2" fill={`url(#${id}b)`} />
    <rect x={50 - w / 2 - 5} y={y + 10} width={w + 10} height="10" rx="2" fill={`url(#${id}b)`} />
    <rect x="42" y={y + 3} width="16" height="4" rx="1" fill={`url(#${id}m)`} opacity=".9" />
  </g>
);

const DESENHOS = {
  // Liga: urna alta com tampa e pequenas alças
  liga: (id) => (
    <g>
      <circle cx="50" cy="8" r="5" fill={`url(#${id}m)`} />
      <path d="M36 16 H64 L60 24 H40 Z" fill={`url(#${id}m)`} />
      <path d="M34 24 H66 C68 50 62 68 50 74 C38 68 32 50 34 24 Z" fill={`url(#${id}m)`} />
      <path d="M34 30 C24 30 24 46 36 50" fill="none" stroke={`url(#${id}m)`} strokeWidth="4" strokeLinecap="round" />
      <path d="M66 30 C76 30 76 46 64 50" fill="none" stroke={`url(#${id}m)`} strokeWidth="4" strokeLinecap="round" />
      <path d="M40 30 C40 48 44 60 50 66" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" />
      <rect x="46" y="74" width="8" height="12" fill={`url(#${id}m)`} />
      <path d="M38 86 H62 L58 96 H42 Z" fill={`url(#${id}m)`} />
      <Base id={id} />
    </g>
  ),
  // Copa nacional: taça larga e rasa sobre haste fina
  copa: (id) => (
    <g>
      <path d="M18 24 H82 C80 46 66 58 50 60 C34 58 20 46 18 24 Z" fill={`url(#${id}m)`} />
      <ellipse cx="50" cy="24" rx="32" ry="5" fill="#fff" opacity=".25" />
      <path d="M26 32 C30 44 38 50 46 52" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" />
      <rect x="47" y="60" width="6" height="22" fill={`url(#${id}m)`} />
      <circle cx="50" cy="70" r="5" fill={`url(#${id}m)`} />
      <path d="M36 82 H64 L60 96 H40 Z" fill={`url(#${id}m)`} />
      <Base id={id} />
    </g>
  ),
  // Continental de clubes: coluna facetada com estrela no topo
  continental: (id) => (
    <g>
      <polygon points="50,2 54,12 65,12 56,19 59,30 50,23 41,30 44,19 35,12 46,12" fill={`url(#${id}m)`} />
      <polygon points="38,34 62,34 58,86 42,86" fill={`url(#${id}m)`} />
      <polygon points="50,34 62,34 58,86 50,86" fill="#000" opacity=".18" />
      <polygon points="38,34 50,34 50,86 42,86" fill="#fff" opacity=".12" />
      <path d="M34 46 H66 M35 62 H65" stroke="#0E1512" strokeOpacity=".25" strokeWidth="2" />
      <path d="M32 86 H68 L64 96 H36 Z" fill={`url(#${id}m)`} />
      <Base id={id} />
    </g>
  ),
  // Mundial de Clubes: globo envolto por um anel, sobre pedestal
  mundial: (id) => (
    <g>
      <circle cx="50" cy="40" r="24" fill={`url(#${id}m)`} />
      <ellipse cx="50" cy="40" rx="10" ry="24" fill="none" stroke="#0E1512" strokeOpacity=".3" strokeWidth="2" />
      <path d="M27 32 H73 M27 48 H73" stroke="#0E1512" strokeOpacity=".3" strokeWidth="2" />
      <ellipse cx="50" cy="44" rx="34" ry="9" fill="none" stroke={`url(#${id}m)`} strokeWidth="4" transform="rotate(-14 50 44)" />
      <circle cx="42" cy="31" r="6" fill="#fff" opacity=".3" />
      <path d="M44 64 H56 L58 86 H42 Z" fill={`url(#${id}m)`} />
      <path d="M34 86 H66 L62 96 H38 Z" fill={`url(#${id}m)`} />
      <Base id={id} />
    </g>
  ),
  // Copa do Mundo (seleções): gema lapidada sobre coluna, com ramos de louro
  copaMundo: (id) => (
    <g>
      <polygon points="36,8 64,8 72,20 50,48 28,20" fill={`url(#${id}m)`} />
      <polygon points="36,8 50,8 50,20 28,20" fill="#fff" opacity=".35" />
      <polygon points="50,20 72,20 50,48" fill="#000" opacity=".18" />
      <path d="M28 20 H72" stroke="#0E1512" strokeOpacity=".3" strokeWidth="1.5" />
      <path d="M44 48 H56 L60 86 H40 Z" fill={`url(#${id}m)`} />
      <path d="M44 56 C30 58 26 70 30 82 M56 56 C70 58 74 70 70 82" fill="none" stroke={`url(#${id}m)`} strokeWidth="3" />
      {[62, 69, 76].map((y, i) => (
        <g key={y}>
          <ellipse cx={30 - i} cy={y} rx="5" ry="2.4" transform={`rotate(-35 ${30 - i} ${y})`} fill={`url(#${id}m)`} />
          <ellipse cx={70 + i} cy={y} rx="5" ry="2.4" transform={`rotate(35 ${70 + i} ${y})`} fill={`url(#${id}m)`} />
        </g>
      ))}
      <path d="M32 86 H68 L64 96 H36 Z" fill={`url(#${id}m)`} />
      <Base id={id} />
    </g>
  ),
  // Copa continental de seleções: placa em forma de escudo com estrela
  continentalSelecao: (id) => (
    <g>
      <path d="M50 6 L80 14 V44 C80 62 66 74 50 80 C34 74 20 62 20 44 V14 Z" fill={`url(#${id}m)`} />
      <path d="M50 14 L72 20 V44 C72 57 62 66 50 71 C38 66 28 57 28 44 V20 Z" fill="#0E1512" opacity=".22" />
      <polygon points="50,28 54,38 65,38 56,44 59,55 50,49 41,55 44,44 35,38 46,38" fill={`url(#${id}m)`} />
      <rect x="46" y="80" width="8" height="8" fill={`url(#${id}m)`} />
      <path d="M36 88 H64 L60 96 H40 Z" fill={`url(#${id}m)`} />
      <Base id={id} />
    </g>
  ),
  // Segunda divisão: medalha com fita
  segunda: (id) => (
    <g>
      <path d="M34 4 L46 44 H54 L66 4 H56 L50 28 L44 4 Z" fill="#2E6FE0" />
      <path d="M44 4 L50 28 L56 4 Z" fill="#12A876" />
      <circle cx="50" cy="70" r="28" fill={`url(#${id}m)`} />
      <circle cx="50" cy="70" r="20" fill="none" stroke="#0E1512" strokeOpacity=".3" strokeWidth="2.5" />
      <path d="M40 74 L48 64 L52 70 L60 60" fill="none" stroke="#0E1512" strokeOpacity=".45" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="60" r="6" fill="#fff" opacity=".3" />
    </g>
  ),
};

const METAL_POR_TIPO = { liga: "ouro", continental: "ouro", mundial: "ouro", copaMundo: "ouro", continentalSelecao: "ouro", copa: "prata", segunda: "bronze" };

/* Taças originais do A JOIA: desenhadas em SVG (arte/tacas/fonte, gerador em
   ferramentas/gerar-tacas.py) e exportadas em WebP. Nenhuma reproduz troféu real.
   O desenho vetorial acima continua como reserva caso a imagem não carregue. */
import liga from "./arte/tacas/liga.webp";
import copa from "./arte/tacas/copa.webp";
import continental from "./arte/tacas/continental.webp";
import mundial from "./arte/tacas/mundial.webp";
import copaMundo from "./arte/tacas/copaMundo.webp";
import continentalSelecao from "./arte/tacas/continentalSelecao.webp";
import segunda from "./arte/tacas/segunda.webp";
const FOTOS = { liga, copa, continental, mundial, copaMundo, continentalSelecao, segunda };

function TacaVetor({ tipo, size }) {
  const desenho = DESENHOS[tipo] || DESENHOS.liga;
  const metal = METAL_POR_TIPO[tipo] || "ouro";
  const id = `taca-${tipo}`;
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" className="shrink-0" aria-hidden="true">
      <Defs id={id} metal={metal} />
      {desenho(id)}
    </svg>
  );
}

export function TacaCompeticao({ tipo = "liga", size = 40, nome = null }) {
  const [falhou, setFalhou] = React.useState(false);
  // logo da competição, se a pessoa colocou o arquivo em arte/competicoes/
  const logo = nome ? logoCompeticao(nome) : null;
  if (logo) return <img src={logo} alt="" aria-hidden="true" className="shrink-0 object-contain select-none" draggable="false" style={{ width: size, height: size * 1.2, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.5))" }} />;
  const metal = METAL_POR_TIPO[tipo] || "ouro";
  const brilho = METAIS[metal][1];
  const sombra = { filter: `drop-shadow(0 ${Math.max(2, size / 20)}px ${Math.max(4, size / 7)}px rgba(0,0,0,.55)) drop-shadow(0 0 ${Math.max(4, size / 6)}px ${brilho}55)` };
  if (falhou || !FOTOS[tipo]) return <span className="shrink-0 inline-block" style={sombra}><TacaVetor tipo={tipo} size={size} /></span>;
  return (
    <img src={FOTOS[tipo]} alt="" aria-hidden="true" width={size} height={Math.round(size * 1.2)} loading="lazy" decoding="async"
      onError={() => setFalhou(true)} className="shrink-0 object-contain select-none" draggable="false"
      style={{ width: size, height: size * 1.2, ...sombra }} />
  );
}
