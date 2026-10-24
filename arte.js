/* Fotos de fundo — Adobe Stock (licença gratuita), tratadas no Adobe
   Photoshop e convertidas para WebP. Ver arte/CREDITOS.md. */
import refletores from "./arte/refletores.webp";
import coletiva from "./arte/coletiva.webp";
import confete from "./arte/confete-dourado.webp";
import estadioNoite from "./arte/estadio-noite.webp";
import porDoSol from "./arte/estadio-por-do-sol.webp";
import tunel from "./arte/tunel.webp";
import torcida from "./arte/torcida.webp";
import lesao from "./arte/lesao.webp";
import contrato from "./arte/contrato.webp";

export const ARTE = { refletores, coletiva, confete, estadioNoite, porDoSol, tunel, torcida, lesao, contrato };

/* Escudos e logos de competição opcionais. O jogo não traz nenhum: quem quiser
   usar imagens próprias coloca os arquivos em arte/escudos/ e arte/competicoes/
   com o nome em formato de slug (ex.: "atletico-de-madrid.svg", "premier-league.png").
   Ver os LEIA-ME de cada pasta. Sem arquivo, o jogo usa o brasão e a taça desenhados. */
export const slug = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const porNome = (g) => Object.fromEntries(Object.entries(g).map(([k, v]) => [k.split("/").pop().replace(/\.\w+$/, ""), v]));
const ESCUDOS = porNome(import.meta.glob("./arte/escudos/*.{svg,png,webp}", { eager: true, query: "?url", import: "default" }));
const LOGOS = porNome(import.meta.glob("./arte/competicoes/*.{svg,png,webp}", { eager: true, query: "?url", import: "default" }));
export const escudoDe = (nome) => ESCUDOS[slug(nome)] || null;
export const logoCompeticao = (nome) => LOGOS[slug(nome)] || null;
const BANDEIRAS = porNome(import.meta.glob("./arte/bandeiras/*.svg", { eager: true, query: "?url", import: "default" }));
/* bandeiras em SVG (pacote flag-icons, MIT): o emoji de bandeira não aparece no Windows */
export const bandeiraDe = (nac) => BANDEIRAS[nac] || null;
export const temImagensOficiais = Object.keys(ESCUDOS).length + Object.keys(LOGOS).length > 0;

/* Foto de cabeçalho por evento do Modo Rápido (eventos sem foto ficam só com o ícone) */
export const ARTE_EVENTO = {
  propostas: contrato, renovacao: contrato, fimContrato: contrato, livre: contrato, clausula: contrato, fortuna: contrato,
  lesaoPre: lesao, veterano: lesao,
  sub20: torcida, selecaoAmistoso: torcida, naturalizacao: torcida, classico: torcida, golDePlaca: torcida, capitao: torcida,
  mentor: tunel, jovemMentor: tunel, emprestimo: tunel, forcarSaida: tunel, voltarCasa: tunel, camisa10: tunel,
  pretemporada: estadioNoite, novoTecnico: estadioNoite, parceria: estadioNoite, presidente: estadioNoite,
  polemica: refletores, noitada: refletores, documentario: refletores, patrocinio: refletores, rivalMundo: refletores, empresario: refletores,
  traicao: refletores, social: porDoSol,
};
