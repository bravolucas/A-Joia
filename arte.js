/* Fotos de fundo — Adobe Stock (licença gratuita), tratadas no Adobe
   Photoshop e convertidas para WebP. Ver arte/CREDITOS.md. */
import refletores from "./arte/refletores.webp";
import confete from "./arte/confete-dourado.webp";
import estadioNoite from "./arte/estadio-noite.webp";
import porDoSol from "./arte/estadio-por-do-sol.webp";
import tunel from "./arte/tunel.webp";
import torcida from "./arte/torcida.webp";
import lesao from "./arte/lesao.webp";
import contrato from "./arte/contrato.webp";

export const ARTE = { refletores, confete, estadioNoite, porDoSol, tunel, torcida, lesao, contrato };

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
