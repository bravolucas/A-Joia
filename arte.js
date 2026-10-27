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
import vestiario from "./arte/vestiario.webp";
import fisio from "./arte/fisio.webp";
import aviao from "./arte/aviao.webp";
import treino from "./arte/treino.webp";
import mansao from "./arte/mansao.webp";
import carro from "./arte/carro.webp";
import protesto from "./arte/protesto.webp";
import casa from "./arte/casa.webp";
import festa from "./arte/festa.webp";
import salaApresentacao from "./arte/sala-apresentacao.webp";
// gramado em escala oficial (Kyogijo Stadiums, MIT)
import campo from "./arte/campo.svg";

export const ARTE = { refletores, coletiva, confete, estadioNoite, porDoSol, tunel, torcida, lesao, contrato, vestiario, fisio, aviao, treino, mansao, carro, protesto, casa, festa, salaApresentacao, campo };

/* Escudos e logos de competição opcionais. O jogo não traz nenhum: quem quiser
   usar imagens próprias coloca os arquivos em arte/escudos/ e arte/competicoes/
   com o nome em formato de slug (ex.: "atletico-de-madrid.svg", "premier-league.png").
   Ver os LEIA-ME de cada pasta. Sem arquivo, o jogo usa o brasão e a taça desenhados. */
export const slug = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const porNome = (g) => Object.fromEntries(Object.entries(g).map(([k, v]) => [k.split("/").pop().replace(/\.\w+$/, ""), v]));
const ESCUDOS = porNome(import.meta.glob("./arte/escudos/*.{svg,png,webp}", { eager: true, query: "?url", import: "default" }));
const LOGOS = porNome(import.meta.glob("./arte/competicoes/*.{svg,png,webp}", { eager: true, query: "?url", import: "default" }));
export const escudoDe = (nome) => ESCUDOS[slug(nome)] || null;
// Aceita nomes alternativos usados pelo motor de treinador sem duplicar imagens.
const ALIASES_COMPETICOES = {
  'copa-libertadores': 'libertadores',
  'conmebol-libertadores': 'libertadores',
  'uefa-champions-league': 'champions-league',
  'campeonato-brasileiro-serie-a': 'brasileirao',
  'campeonato-brasileiro-serie-b': 'brasileirao-serie-b'
};
export const logoCompeticao = (nome) => {
  const chave = slug(nome);
  return LOGOS[chave] || LOGOS[ALIASES_COMPETICOES[chave]] || null;
};
const BANDEIRAS = porNome(import.meta.glob("./arte/bandeiras/*.svg", { eager: true, query: "?url", import: "default" }));
/* bandeiras em SVG (pacote flag-icons, MIT): o emoji de bandeira não aparece no Windows */
export const bandeiraDe = (nac) => BANDEIRAS[nac] || null;
export const temImagensOficiais = Object.keys(ESCUDOS).length + Object.keys(LOGOS).length > 0;

/* Foto de cabeçalho por evento do Modo Rápido (eventos sem foto ficam só com o ícone) */
export const ARTE_EVENTO = {
  propostas: contrato, renovacao: contrato, fimContrato: contrato, livre: contrato, clausula: contrato, empresario: contrato, parceria: contrato,
  lesaoPre: fisio, voltaLesao: fisio, esgotamento: fisio, machucado: fisio, infiltracao: fisio, recuperacao: fisio, veterano: lesao,
  emprestimo: aviao, forcarSaida: aviao, voltarCasa: aviao, excursao: aviao, saudade: aviao, idiomaImprensa: aviao, naturalizacao: aviao,
  pretemporada: treino, novoTecnico: treino, treinoExtra: treino, academia: treino, intertemporada: treino, concentracao: treino, especialista: treino,
  novaPosicao: treino, garotoBase: treino, video: treino, batedor: treino, olheiros: treino,
  vestiario, capitao: vestiario, mentor: vestiario, jovemMentor: vestiario, camisa10: vestiario, expulsao: vestiario, traicao: vestiario,
  noitada: festa, polemica: festa, romance: festa, videogame: festa,
  organizada: protesto, odioRedes: protesto, salarioAtrasado: protesto,
  casaPais: casa, filho: casa, luto: casa, cachorro: casa, amigo: casa, reencontro: casa, social: casa, beneficente: casa, paiEmpresario: casa, estudos: casa, treinoFerias: casa, dieta: casa,
  fortuna: mansao, patrocinio: carro, golpe: carro,
  sub20: torcida, selecaoAmistoso: torcida, classico: torcida, golDePlaca: torcida, homenagem: torcida, recordeClube: torcida, foraDaLista: torcida, pressaoCopa: torcida, adeusSelecao: torcida,
  presidente: estadioNoite, documentario: refletores, rivalMundo: refletores,
};
