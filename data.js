import { clamp, clampR, formatarDinheiro } from "./lib.js";

export const ATTR_SLOTS = [
  { id: "velocidade", label: "Velocidade", tipo: "num", abrev: "VEL" },
  { id: "finalizacao", label: "Finalização", tipo: "num", abrev: "FIN" },
  { id: "passe", label: "Passe", tipo: "num", abrev: "PAS" },
  { id: "drible", label: "Drible", tipo: "num", abrev: "DRI" },
  { id: "defesa", label: "Defesa", tipo: "num", abrev: "DEF" },
  { id: "fisico", label: "Físico", tipo: "num", abrev: "FIS" },
  { id: "fintas", label: "Fintas", tipo: "estrela", abrev: "FNT" },
  { id: "pernaRuim", label: "Perna ruim", tipo: "estrela", abrev: "P.R" },
];

export const NUM_ATTRS = ["velocidade", "finalizacao", "passe", "drible", "defesa", "fisico"];

export const ORIGENS = [
  {
    id: "varzea", nome: "Cria da várzea", icone: "🏙️", cor: "#F59E0B",
    desc: "Aprendeu a jogar no batente, driblando no cascalho. Técnica de sobra, mas o corpo ainda precisa amadurecer.",
    bias: { drible: 12, finalizacao: 8, velocidade: 6, fisico: -6, defesa: -4, fintas: 1 },
    perk: "A torcida ama uma história de superação: +8 de fama inicial.",
    aplicar: (c) => { c.fama = clamp(c.fama + 8, 0, 100); },
  },
  {
    id: "base", nome: "Base de clube grande", icone: "🏛️", cor: "#3B82F6",
    desc: "Formado nas categorias de base de um gigante. Fundamentos sólidos e equilíbrio, mas a pressão por resultado é imensa.",
    bias: { passe: 8, finalizacao: 6, defesa: 6, velocidade: 4, drible: 4, fisico: 4 },
    perk: "Já conhecido nos bastidores: começa com olheiros de olho e confiança do técnico um pouco maior.",
    aplicar: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 8, 0, 100); },
  },
  {
    id: "futsal", nome: "Veio do futsal", icone: "⚡", cor: "#8B5CF6",
    desc: "Passou a infância na quadra: reação rápida, drible curto e passe de primeira. Falta ritmo de campo grande.",
    bias: { drible: 10, passe: 10, finalizacao: 6, fisico: -4, defesa: -2, fintas: 2 },
    perk: "Canhota ou destra afiada — refinamento técnico raro pra idade.",
    aplicar: (c) => {},
  },
  {
    id: "herdeiro", nome: "Filho de ex-jogador", icone: "👑", cor: "#D8B44A",
    desc: "Cresceu dentro do vestiário. Leitura de jogo e maturidade acima da média, mas carrega a sombra do sobrenome.",
    bias: { passe: 8, defesa: 6, finalizacao: 6, velocidade: 4, drible: 4, fisico: 2 },
    perk: "Rede de contatos de peso: +12 de fama inicial e mais seguidores desde o começo.",
    aplicar: (c) => { c.fama = clamp(c.fama + 12, 0, 100); c.seguidores = Math.round((c.seguidores || 10000) * 1.5); },
  },
  {
    id: "tardio", nome: "Descoberto tarde", icone: "🌱", cor: "#12A876",
    desc: "Quase largou o futebol, mas explodiu numa peneira. Força física de adulto e faro de gol, ainda que cru tecnicamente.",
    bias: { fisico: 12, finalizacao: 10, velocidade: 6, drible: -4, passe: -2 },
    perk: "Corpo pronto: menos desgaste físico nas primeiras temporadas.",
    aplicar: (c) => { c.desgaste = Math.max(0, (c.desgaste || 0) - 10); },
  },
  {
    id: "prodigio", nome: "Prodígio precoce", icone: "✨", cor: "#EC4899",
    desc: "Sempre foi o melhor em campo desde os 10 anos. Talento equilibrado e altíssimo teto — as expectativas são enormes.",
    bias: { velocidade: 7, finalizacao: 7, passe: 7, drible: 7, defesa: 7, fisico: 7, fintas: 1 },
    perk: "Fenômeno anunciado: já nasce na mira dos grandes clubes.",
    aplicar: (c) => { c.fama = clamp(c.fama + 5, 0, 100); },
  },
];

export const TODOS_ATTRS = [...NUM_ATTRS, "fintas", "pernaRuim"];

export const LENDAS = [
  { nome: "Pelé", stats: { velocidade: 93, finalizacao: 97, passe: 90, drible: 95, defesa: 45, fisico: 88, fintas: 5, pernaRuim: 5 } },
  { nome: "Garrincha", stats: { velocidade: 92, finalizacao: 84, passe: 82, drible: 99, defesa: 30, fisico: 68, fintas: 5, pernaRuim: 2 } },
  { nome: "Zico", stats: { velocidade: 82, finalizacao: 92, passe: 95, drible: 90, defesa: 40, fisico: 70, fintas: 4, pernaRuim: 4 } },
  { nome: "Romário", stats: { velocidade: 88, finalizacao: 97, passe: 78, drible: 92, defesa: 25, fisico: 66, fintas: 4, pernaRuim: 4 } },
  { nome: "Ronaldo Fenômeno", stats: { velocidade: 96, finalizacao: 96, passe: 80, drible: 95, defesa: 30, fisico: 90, fintas: 5, pernaRuim: 4 } },
  { nome: "Ronaldinho", stats: { velocidade: 87, finalizacao: 87, passe: 94, drible: 97, defesa: 35, fisico: 78, fintas: 5, pernaRuim: 4 } },
  { nome: "Rivaldo", stats: { velocidade: 84, finalizacao: 92, passe: 89, drible: 91, defesa: 38, fisico: 80, fintas: 5, pernaRuim: 2 } },
  { nome: "Kaká", stats: { velocidade: 91, finalizacao: 87, passe: 90, drible: 89, defesa: 42, fisico: 82, fintas: 4, pernaRuim: 3 } },
  { nome: "Roberto Carlos", stats: { velocidade: 94, finalizacao: 82, passe: 83, drible: 80, defesa: 84, fisico: 92, fintas: 3, pernaRuim: 1 } },
  { nome: "Cafu", stats: { velocidade: 92, finalizacao: 68, passe: 84, drible: 79, defesa: 87, fisico: 91, fintas: 3, pernaRuim: 3 } },
  { nome: "Sócrates", stats: { velocidade: 74, finalizacao: 85, passe: 94, drible: 88, defesa: 48, fisico: 76, fintas: 4, pernaRuim: 4 } },
  { nome: "Falcão", stats: { velocidade: 76, finalizacao: 80, passe: 92, drible: 84, defesa: 78, fisico: 80, fintas: 3, pernaRuim: 4 } },
  { nome: "Careca", stats: { velocidade: 87, finalizacao: 91, passe: 76, drible: 84, defesa: 28, fisico: 78, fintas: 3, pernaRuim: 3 } },
  { nome: "Djalma Santos", stats: { velocidade: 82, finalizacao: 58, passe: 78, drible: 70, defesa: 93, fisico: 88, fintas: 2, pernaRuim: 3 } },
  { nome: "Nílton Santos", stats: { velocidade: 80, finalizacao: 62, passe: 84, drible: 78, defesa: 91, fisico: 86, fintas: 2, pernaRuim: 3 } },
  { nome: "Taffarel", stats: { velocidade: 68, finalizacao: 20, passe: 62, drible: 30, defesa: 94, fisico: 84, fintas: 1, pernaRuim: 2 } },
  { nome: "Maradona", stats: { velocidade: 88, finalizacao: 93, passe: 95, drible: 98, defesa: 35, fisico: 76, fintas: 5, pernaRuim: 2 } },
  { nome: "Cruyff", stats: { velocidade: 90, finalizacao: 89, passe: 94, drible: 93, defesa: 44, fisico: 78, fintas: 5, pernaRuim: 3 } },
  { nome: "Beckenbauer", stats: { velocidade: 82, finalizacao: 74, passe: 91, drible: 84, defesa: 95, fisico: 86, fintas: 3, pernaRuim: 4 } },
  { nome: "Zidane", stats: { velocidade: 80, finalizacao: 86, passe: 95, drible: 95, defesa: 48, fisico: 85, fintas: 5, pernaRuim: 4 } },
  { nome: "Messi", stats: { velocidade: 91, finalizacao: 96, passe: 95, drible: 98, defesa: 32, fisico: 70, fintas: 4, pernaRuim: 2 } },
  { nome: "Cristiano Ronaldo", stats: { velocidade: 93, finalizacao: 95, passe: 82, drible: 89, defesa: 34, fisico: 94, fintas: 5, pernaRuim: 4 } },
  { nome: "Van Basten", stats: { velocidade: 84, finalizacao: 95, passe: 82, drible: 87, defesa: 30, fisico: 85, fintas: 4, pernaRuim: 3 } },
  { nome: "Baggio", stats: { velocidade: 84, finalizacao: 91, passe: 90, drible: 93, defesa: 32, fisico: 70, fintas: 4, pernaRuim: 3 } },
  { nome: "Platini", stats: { velocidade: 78, finalizacao: 90, passe: 94, drible: 88, defesa: 40, fisico: 72, fintas: 3, pernaRuim: 4 } },
  { nome: "Puskás", stats: { velocidade: 78, finalizacao: 96, passe: 88, drible: 86, defesa: 28, fisico: 74, fintas: 3, pernaRuim: 1 } },
  { nome: "Eusébio", stats: { velocidade: 93, finalizacao: 94, passe: 80, drible: 88, defesa: 30, fisico: 84, fintas: 4, pernaRuim: 2 } },
  { nome: "Di Stéfano", stats: { velocidade: 86, finalizacao: 92, passe: 90, drible: 87, defesa: 55, fisico: 84, fintas: 3, pernaRuim: 4 } },
  { nome: "Maldini", stats: { velocidade: 84, finalizacao: 55, passe: 80, drible: 68, defesa: 96, fisico: 88, fintas: 2, pernaRuim: 4 } },
  { nome: "Yashin", stats: { velocidade: 70, finalizacao: 18, passe: 60, drible: 28, defesa: 97, fisico: 86, fintas: 1, pernaRuim: 2 } },
  { nome: "Gerd Müller", stats: { velocidade: 78, finalizacao: 96, passe: 74, drible: 80, defesa: 30, fisico: 82, fintas: 3, pernaRuim: 3 } },
  { nome: "Best", stats: { velocidade: 89, finalizacao: 88, passe: 86, drible: 96, defesa: 36, fisico: 74, fintas: 5, pernaRuim: 3 } },
  { nome: "Henry", stats: { velocidade: 94, finalizacao: 92, passe: 84, drible: 88, defesa: 32, fisico: 86, fintas: 4, pernaRuim: 3 } },
  { nome: "Ronaldo (R9 jovem)", stats: { velocidade: 97, finalizacao: 93, passe: 76, drible: 94, defesa: 28, fisico: 88, fintas: 5, pernaRuim: 4 } },
  { nome: "Iniesta", stats: { velocidade: 78, finalizacao: 78, passe: 96, drible: 94, defesa: 55, fisico: 72, fintas: 4, pernaRuim: 3 } },
  { nome: "Xavi", stats: { velocidade: 70, finalizacao: 74, passe: 98, drible: 88, defesa: 58, fisico: 68, fintas: 3, pernaRuim: 4 } },
  { nome: "Pirlo", stats: { velocidade: 66, finalizacao: 80, passe: 97, drible: 84, defesa: 60, fisico: 70, fintas: 3, pernaRuim: 3 } },
  { nome: "Gullit", stats: { velocidade: 86, finalizacao: 86, passe: 88, drible: 86, defesa: 70, fisico: 92, fintas: 4, pernaRuim: 4 } },
  { nome: "Neymar", stats: { velocidade: 90, finalizacao: 89, passe: 88, drible: 97, defesa: 28, fisico: 68, fintas: 5, pernaRuim: 3 } },
  { nome: "Vinícius Júnior", stats: { velocidade: 96, finalizacao: 86, passe: 82, drible: 93, defesa: 26, fisico: 74, fintas: 5, pernaRuim: 2 } },
  { nome: "Rodrygo", stats: { velocidade: 89, finalizacao: 85, passe: 84, drible: 88, defesa: 30, fisico: 72, fintas: 4, pernaRuim: 3 } },
  { nome: "Raphinha", stats: { velocidade: 87, finalizacao: 84, passe: 86, drible: 87, defesa: 32, fisico: 74, fintas: 4, pernaRuim: 3 } },
  { nome: "Endrick", stats: { velocidade: 85, finalizacao: 87, passe: 74, drible: 83, defesa: 24, fisico: 78, fintas: 3, pernaRuim: 3 } },
  { nome: "Adriano", stats: { velocidade: 82, finalizacao: 92, passe: 74, drible: 85, defesa: 26, fisico: 90, fintas: 3, pernaRuim: 3 } },
  { nome: "Denílson", stats: { velocidade: 90, finalizacao: 70, passe: 76, drible: 96, defesa: 20, fisico: 64, fintas: 5, pernaRuim: 2 } },
  { nome: "Bebeto", stats: { velocidade: 84, finalizacao: 90, passe: 78, drible: 82, defesa: 24, fisico: 68, fintas: 3, pernaRuim: 3 } },
  { nome: "Dida", stats: { velocidade: 62, finalizacao: 16, passe: 68, drible: 26, defesa: 92, fisico: 88, fintas: 1, pernaRuim: 2 } },
  { nome: "Marta", stats: { velocidade: 88, finalizacao: 93, passe: 89, drible: 95, defesa: 30, fisico: 70, fintas: 5, pernaRuim: 3 } },
  { nome: "Casemiro", stats: { velocidade: 74, finalizacao: 68, passe: 82, drible: 74, defesa: 90, fisico: 88, fintas: 2, pernaRuim: 3 } },
  { nome: "Thiago Silva", stats: { velocidade: 76, finalizacao: 48, passe: 82, drible: 68, defesa: 94, fisico: 84, fintas: 2, pernaRuim: 3 } },
  { nome: "Alisson", stats: { velocidade: 66, finalizacao: 18, passe: 78, drible: 30, defesa: 93, fisico: 84, fintas: 1, pernaRuim: 3 } },
  { nome: "Modrić", stats: { velocidade: 78, finalizacao: 78, passe: 96, drible: 92, defesa: 56, fisico: 68, fintas: 4, pernaRuim: 4 } },
];

export const POSICOES = [
  { id: "GOL", label: "Goleiro", pesos: { defesa: 3.2, finalizacao: 2.2, fisico: 1.8, drible: 1.4, passe: 1.0, velocidade: 0.6 }, golBase: 0, assistBase: 0.01 },
  { id: "ZAG", label: "Zagueiro", pesos: { defesa: 3.0, fisico: 2.4, velocidade: 1.0, passe: 0.9, finalizacao: 0.3, drible: 0.3 }, golBase: 0.06, assistBase: 0.03 },
  { id: "LD", label: "Lateral direito", pesos: { velocidade: 2.4, defesa: 2.0, fisico: 1.5, passe: 1.4, drible: 1.0, finalizacao: 0.4 }, golBase: 0.07, assistBase: 0.18 },
  { id: "LE", label: "Lateral esquerdo", pesos: { velocidade: 2.4, defesa: 2.0, fisico: 1.5, passe: 1.4, drible: 1.0, finalizacao: 0.4 }, golBase: 0.07, assistBase: 0.18 },
  { id: "VOL", label: "Volante", pesos: { defesa: 2.6, passe: 2.0, fisico: 1.8, velocidade: 0.9, drible: 0.8, finalizacao: 0.4 }, golBase: 0.08, assistBase: 0.12 },
  { id: "MC", label: "Meio-campo (box-to-box)", pesos: { passe: 2.0, fisico: 1.8, defesa: 1.5, drible: 1.4, velocidade: 1.2, finalizacao: 1.1 }, golBase: 0.2, assistBase: 0.24 },
  { id: "MEI", label: "Meia", pesos: { passe: 3.0, drible: 2.2, finalizacao: 1.3, velocidade: 1.0, fisico: 0.8, defesa: 0.5 }, golBase: 0.26, assistBase: 0.42 },
  { id: "PD", label: "Ponta direita", pesos: { velocidade: 2.8, drible: 2.4, finalizacao: 1.6, passe: 1.2, fisico: 0.8, defesa: 0.3 }, golBase: 0.4, assistBase: 0.3 },
  { id: "PE", label: "Ponta esquerda", pesos: { velocidade: 2.8, drible: 2.4, finalizacao: 1.6, passe: 1.2, fisico: 0.8, defesa: 0.3 }, golBase: 0.4, assistBase: 0.3 },
  { id: "SA", label: "Segundo atacante", pesos: { finalizacao: 2.4, drible: 2.0, passe: 1.8, velocidade: 1.6, fisico: 0.9, defesa: 0.2 }, golBase: 0.52, assistBase: 0.28 },
  { id: "ATA", label: "Centroavante", pesos: { finalizacao: 3.2, fisico: 1.8, velocidade: 1.6, drible: 1.2, passe: 0.7, defesa: 0.1 }, golBase: 0.74, assistBase: 0.14 },
];

export const NACIONALIDADES = [
  { id: "BRA", label: "Brasil", forcaSelecao: 86 }, { id: "ARG", label: "Argentina", forcaSelecao: 92 },
  { id: "FRA", label: "França", forcaSelecao: 90 }, { id: "ESP", label: "Espanha", forcaSelecao: 91 },
  { id: "POR", label: "Portugal", forcaSelecao: 87 }, { id: "ENG", label: "Inglaterra", forcaSelecao: 88 },
  { id: "ITA", label: "Itália", forcaSelecao: 83 }, { id: "ALE", label: "Alemanha", forcaSelecao: 85 },
];

export const PERSONALIDADES = [
  { id: "precoce", label: "Desenvolvimento precoce", desc: "Evolui muito rápido e chega ao auge cedo — mas estagna e cai rápido também.", cor: "#f59e0b", icone: "🚀",
    picoFim: 23, declinioApartir: 26, declinioTaxa: 2.0, taxaCresc: 1.7, risco: 1.0 },
  { id: "maturado", label: "Talento maturado", desc: "Evolui devagar no início, mas segura o auge por muito mais tempo e envelhece bem.", cor: "#3b82f6", icone: "🌳",
    picoFim: 29, declinioApartir: 34, declinioTaxa: 0.55, taxaCresc: 0.75, risco: 0.85 },
  { id: "midiatico", label: "Midiático", desc: "Ganha fama e patrocínio bem mais rápido; rende sob holofote, mas oscila mais.", cor: "#ec4899", icone: "📸",
    picoFim: 27, declinioApartir: 30, declinioTaxa: 1.1, taxaCresc: 1.15, risco: 1.05, famaMult: 1.6 },
  { id: "ascensao", label: "Estrela em ascensão", desc: "Curva sólida e constante do início ao pico, sem grandes sustos.", cor: "#12A876", icone: "📈",
    picoFim: 28, declinioApartir: 31, declinioTaxa: 0.9, taxaCresc: 1.0, risco: 0.95 },
  { id: "guerreiro", label: "Guerreiro incansável", desc: "Cresce superando adversidade, resiste mais a lesões e envelhece devagar.", cor: "#ef4444", icone: "🛡️",
    picoFim: 29, declinioApartir: 33, declinioTaxa: 0.45, taxaCresc: 0.9, risco: 0.7 },
  { id: "festeiro", label: "Talento indisciplinado", desc: "Potencial altíssimo e evolução rápida, mas propenso a lesão e queda mais cedo.", cor: "#a855f7", icone: "🎉",
    picoFim: 25, declinioApartir: 28, declinioTaxa: 1.8, taxaCresc: 1.5, risco: 1.6, famaMult: 1.3 },
];

export const PAPEIS_TATICOS = [
  { id: "padrao", label: "Função padrão", desc: "Sem ajuste — joga do jeito natural da posição.", bonus: {} },
  { id: "falso9", label: "Falso 9", desc: "Recua pra armar jogadas — passe e drible pesam mais, finalização menos.", bonus: { passe: 1.25, drible: 1.15, finalizacao: 0.85 } },
  { id: "alaInvertido", label: "Ala invertido", desc: "Corta pra dentro pra finalizar — finalização e drible pesam mais, físico menos.", bonus: { finalizacao: 1.2, drible: 1.15, fisico: 0.9 } },
  { id: "libero", label: "Líbero", desc: "Sai jogando de trás — passe pesa muito mais, físico um pouco menos.", bonus: { passe: 1.3, velocidade: 1.1, fisico: 0.9 } },
  { id: "pressao", label: "Pressão no campo de ataque", desc: "Trabalho defensivo avançado — defesa e físico pesam mais, técnica menos.", bonus: { defesa: 1.25, fisico: 1.15, drible: 0.9 } },
  { id: "artilheiro", label: "Matador de área", desc: "Vive dentro da área — finalização pesa muito mais, passe menos.", bonus: { finalizacao: 1.35, passe: 0.85 } },
];

export const COSMETICOS = [
  { id: "comemGol1", nome: "Comemoração assinatura: joelho no gramado", categoria: "Comemoração", icone: "🙇", requisito: (s) => s.titulos >= 1, desc: "Vira sua marca registrada — pequeno ganho de torcida sempre que você é campeão.", efeito: (c) => { c.fama = clamp(c.fama + 3, 0, 100); }, bonusTexto: "+3 fama ao desbloquear, +torcida extra em títulos futuros", torcidaBonusTitulo: 2 },
  { id: "comemGol2", nome: "Comemoração assinatura: dedo no céu", categoria: "Comemoração", icone: "☝️", requisito: (s) => s.bolasDeOuro >= 1, desc: "Dedicatória que já rendeu capa de revista — fama extra sempre que você fatura um prêmio individual.", efeito: (c) => { c.fama = clamp(c.fama + 4, 0, 100); }, bonusTexto: "+4 fama ao desbloquear, +fama extra em prêmios futuros", famaBonusPremio: 1 },
  { id: "corte1", nome: "Visual de ídolo pop (cabelo colorido)", categoria: "Imagem", icone: "💇", requisito: (s) => s.fama >= 40, desc: "Virou meme, virou capa — acelera o crescimento de seguidores.", efeito: (c) => { c.seguidores = Math.round((c.seguidores || 10000) * 1.05); }, seguidoresMult: 1.01 },
  { id: "chuteiraOuro", nome: "Chuteira dourada personalizada", categoria: "Performance", icone: "👟", requisito: (s) => s.picoOvr >= 85, desc: "Modelagem sob medida pro seu pé — +2 de finalização permanente.", efeito: (c) => { c.attrs = { ...c.attrs, finalizacao: clamp(c.attrs.finalizacao + 2, 1, 99) }; } },
  { id: "chuteiraLendaria", nome: "Chuteira edição lendária", categoria: "Performance", icone: "✨👟", requisito: (s) => s.picoOvr >= 93, desc: "Peça única feita pra lendas — +1 em todos os atributos numéricos.", efeito: (c) => { NUM_ATTRS.forEach((a) => { c.attrs[a] = clamp(c.attrs[a] + 1, 1, 99); }); } },
  { id: "luvaCampea", nome: "Luvas de campeão (goleiro)", categoria: "Performance", icone: "🧤", requisito: (s) => s.titulos >= 2, desc: "Par exclusivo forjado depois do segundo título — +2 de defesa permanente.", efeito: (c) => { c.attrs = { ...c.attrs, defesa: clamp(c.attrs.defesa + 2, 1, 99) }; } },
  { id: "braceleteCapitao", nome: "Bracelete de liderança", categoria: "Vestiário", icone: "🎗️", requisito: (s) => s.premiosIndividuais >= 3, desc: "O vestiário te enxerga como referência — melhora a confiança do técnico com o tempo.", efeito: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 6, 0, 100); }, tecnicoBonusAnual: 0.5 },
  { id: "documentarioProprio", nome: "Documentário biográfico", categoria: "Imagem", icone: "🎬", requisito: (s) => s.fama >= 85, desc: "Produção sobre sua carreira estreia nos streamings — salto grande de fama e seguidores.", efeito: (c) => { c.fama = clamp(c.fama + 10, 0, 100); c.seguidores = Math.round((c.seguidores || 10000) * 1.15); } },
];

export const TONS_COLETIVA = [
  { id: "calmo", label: "Calmo e ponderado", icone: "🙂", desc: "Discurso morno, sem gerar manchete.",
    efeito: { torcida: 2, calorMidia: -6, elenco: 2, diretoria: 3 } },
  { id: "agressivo", label: "Agressivo e confiante", icone: "🔥", desc: "Peita a crítica e promete resultado.",
    efeito: { fama: 5, calorMidia: 10, torcida: 6, elenco: -3, tecnicoConfianca: -4, diretoria: -4 } },
  { id: "humilde", label: "Humilde, mérito é do grupo", icone: "🤝", desc: "Divide os louros com o elenco.",
    efeito: { torcida: 3, elenco: 8, tecnicoConfianca: 5, fama: -1 } },
  { id: "cobrarReforcos", label: "Cobrar reforços publicamente", icone: "📣", desc: "Diz que o elenco precisa de ajuda.",
    efeito: { torcida: 8, calorMidia: 12, diretoria: -12, elenco: -5, fama: 3 } },
  { id: "defenderTecnico", label: "Defender o técnico da crítica", icone: "🛡️", desc: "Compra a briga pela comissão.",
    efeito: { tecnicoConfianca: 12, elenco: 4, torcida: -4, calorMidia: 4 } },
  { id: "assumirCulpa", label: "Assumir a culpa pessoalmente", icone: "🙇", desc: "Puxa a responsabilidade pra si.",
    efeito: { torcida: 6, elenco: 6, tecnicoConfianca: 4, calorMidia: -8, fama: -2 } },
];

export const PROMESSAS_TECNICO = [
  {
    id: "titularidade", titulo: "Vaga de titular",
    fala: (c) => `Quero você como titular, mas preciso de entrega: se render bem nessa temporada, a vaga é sua o ano todo.`,
    meta: (c) => ({ tipo: "nota", alvo: 7.0, label: "manter nota média acima de 7.0" }),
    checa: (card, meta) => card.nota >= meta.alvo,
    recompensa: (c) => { c.titularidade = clampR((c.titularidade ?? 100) + 20, 0, 100); c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 10, 0, 100); },
    textoOk: "O técnico cumpriu a palavra: titularidade blindada e confiança nas alturas.",
    textoFalha: "Você não correspondeu — o técnico voltou atrás e sua vaga ficou em aberto.",
    punicao: (c) => { c.titularidade = clampR((c.titularidade ?? 100) - 15, 0, 100); },
  },
  {
    id: "artilharia", titulo: "Referência do ataque",
    fala: (c) => `O time vai jogar pra você. Em troca, quero gols — muitos.`,
    meta: (c) => ({ tipo: "gols", alvo: Math.max(8, Math.round(10 + (c.attrs.finalizacao - 60) / 6)), label: null }),
    checa: (card, meta) => card.gols >= meta.alvo,
    recompensa: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 14, 0, 100); c.fama = clamp(c.fama + 5, 0, 100); },
    textoOk: "Você entregou os gols prometidos — virou o nome do time na boca do técnico.",
    textoFalha: "Os gols não vieram e o discurso do técnico mudou de tom.",
    punicao: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) - 12, 0, 100); },
  },
  {
    id: "lideranca", titulo: "Liderança no vestiário",
    fala: (c) => `Preciso de alguém que puxe o grupo. Assume esse papel comigo?`,
    meta: (c) => ({ tipo: "nota", alvo: 6.9, label: "manter regularidade (nota acima de 6.9)" }),
    checa: (card, meta) => card.nota >= meta.alvo,
    recompensa: (c) => { c.elencoMoral = clampR((c.elencoMoral ?? 60) + 15, 0, 100); c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 8, 0, 100); },
    textoOk: "Você segurou a barra do grupo — o vestiário te reconhece como líder.",
    textoFalha: "A liderança prometida não apareceu em campo; o grupo cobrou.",
    punicao: (c) => { c.elencoMoral = clampR((c.elencoMoral ?? 60) - 10, 0, 100); },
  },
  {
    id: "minutos", titulo: "Minutos garantidos",
    fala: (c) => `Sei que você quer jogar. Vou te dar sequência — mas aceite rodar de posição quando eu precisar.`,
    meta: (c) => ({ tipo: "jogos", alvo: 28, label: "disputar ao menos 28 jogos" }),
    checa: (card, meta) => card.jogos >= meta.alvo,
    recompensa: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 6, 0, 100); c.entrosamento = clampR((c.entrosamento ?? 20) + 15, 0, 100); },
    textoOk: "A sequência prometida veio de verdade — entrosamento lá em cima.",
    textoFalha: "Os minutos prometidos não vieram. O técnico te deve uma, e você sabe disso.",
    // técnico quebrou a promessa: você ganha respaldo (menos apego ao clube, torcida entende sua insatisfação)
    quebraDoTecnico: true,
    punicao: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) - 6, 0, 100); },
  },
];

export const EIXOS_APROVACAO = [
  { id: "torcida", label: "Torcida", icone: "📣", cor: "#12A876", get: (c, getT) => getT(c, c.clube.nome) },
  { id: "elenco", label: "Elenco", icone: "👥", cor: "#3b82f6", get: (c) => c.elencoMoral ?? 60 },
  { id: "tecnico", label: "Técnico", icone: "🧑‍💼", cor: "#D8B44A", get: (c) => c.tecnicoConfianca ?? 60 },
  { id: "diretoria", label: "Diretoria", icone: "🏛️", cor: "#a855f7", get: (c) => c.relacaoDiretoria ?? 40 },
  { id: "imprensa", label: "Pressão da mídia", icone: "📰", cor: "#D6483F", get: (c) => c.calorMidia ?? 20, inverso: true },
];

export const LIGAS = {
  serieB: { nome: "Brasileirão Série B", mult: 0.62, continental: "Acesso à Série A" },
  inglaterra2: { nome: "Championship", mult: 0.72, continental: "Acesso à Premier League" },
  espanha2: { nome: "LaLiga 2", mult: 0.66, continental: "Acesso à LaLiga" },
  italia2: { nome: "Serie B (Itália)", mult: 0.64, continental: "Acesso à Serie A" },
  alemanha2: { nome: "2. Bundesliga", mult: 0.68, continental: "Acesso à Bundesliga" },
  franca2: { nome: "Ligue 2", mult: 0.63, continental: "Acesso à Ligue 1" },
  portugal2: { nome: "Liga Portugal 2", mult: 0.55, continental: "Acesso à Liga Portugal" },
  brasileirao: { nome: "Brasileirão", mult: 0.8, continental: "Libertadores" },
  portugal: { nome: "Liga Portugal", mult: 0.82, continental: "Champions League" },
  franca: { nome: "Ligue 1", mult: 0.88, continental: "Champions League" },
  italia: { nome: "Serie A", mult: 0.95, continental: "Champions League" },
  alemanha: { nome: "Bundesliga", mult: 0.95, continental: "Champions League" },
  espanha: { nome: "La Liga", mult: 1.0, continental: "Champions League" },
  inglaterra: { nome: "Premier League", mult: 1.0, continental: "Champions League" },
  arabia: { nome: "Liga Saudita", mult: 0.6, continental: "Champions Asiática" },
  mls: { nome: "MLS", mult: 0.58, continental: "Concacaf" },
};

/* ===================== PALMARÉS HISTÓRICO DOS CLUBES =====================
   O que cada clube já ganhou ANTES da sua carreira começar. Esses números crescem
   ao longo do jogo conforme os títulos vão sendo conquistados no mundo.
   Clubes não listados recebem um palmarés estimado pela força (ver palmaresInicialDe). */
export const PALMARES_HISTORICO = {
  // ---- Brasil ----
  "Flamengo":        { liga: 8,  copa: 5, continental: 3, mundial: 1 },
  "Palmeiras":       { liga: 12, copa: 4, continental: 3, mundial: 0 },
  "Corinthians":     { liga: 7,  copa: 3, continental: 1, mundial: 2 },
  "São Paulo":       { liga: 6,  copa: 1, continental: 3, mundial: 3 },
  "Santos":          { liga: 8,  copa: 1, continental: 3, mundial: 2 },
  "Grêmio":          { liga: 2,  copa: 5, continental: 3, mundial: 1 },
  "Internacional":   { liga: 3,  copa: 1, continental: 2, mundial: 1 },
  "Cruzeiro":        { liga: 4,  copa: 6, continental: 2, mundial: 0 },
  "Vasco da Gama":   { liga: 4,  copa: 1, continental: 1, mundial: 0 },
  "Fluminense":      { liga: 4,  copa: 1, continental: 1, mundial: 0 },
  "Botafogo":        { liga: 3,  copa: 0, continental: 1, mundial: 0 },
  "Atlético-MG":     { liga: 2,  copa: 2, continental: 1, mundial: 0 },
  "Athletico-PR":    { liga: 1,  copa: 1, continental: 2, mundial: 0 },
  "Bahia":           { liga: 2,  copa: 1, continental: 0, mundial: 0 },
  "Sport Recife":    { liga: 1,  copa: 1, continental: 0, mundial: 0 },
  "Coritiba":        { liga: 1,  copa: 0, continental: 0, mundial: 0 },
  "Guarani":         { liga: 1,  copa: 0, continental: 0, mundial: 0 },
  "Fortaleza":       { liga: 0,  copa: 0, continental: 0, mundial: 0 },
  // ---- Espanha ----
  "Real Madrid":     { liga: 36, copa: 20, continental: 15, mundial: 8 },
  "Barcelona":       { liga: 27, copa: 31, continental: 5,  mundial: 3 },
  "Atlético Madrid": { liga: 11, copa: 10, continental: 0,  mundial: 0 },
  "Valencia":        { liga: 6,  copa: 8,  continental: 0,  mundial: 0 },
  "Athletic Bilbao": { liga: 8,  copa: 24, continental: 0,  mundial: 0 },
  "Sevilla":         { liga: 1,  copa: 5,  continental: 0,  mundial: 0 },
  // ---- Inglaterra ----
  "Manchester United": { liga: 20, copa: 12, continental: 3, mundial: 1 },
  "Liverpool":       { liga: 19, copa: 8,  continental: 6, mundial: 1 },
  "Arsenal":         { liga: 13, copa: 14, continental: 0, mundial: 0 },
  "Chelsea":         { liga: 6,  copa: 8,  continental: 2, mundial: 2 },
  "Manchester City": { liga: 10, copa: 7,  continental: 1, mundial: 1 },
  "Tottenham":       { liga: 2,  copa: 8,  continental: 0, mundial: 0 },
  "Everton":         { liga: 9,  copa: 5,  continental: 0, mundial: 0 },
  "Newcastle":       { liga: 4,  copa: 6,  continental: 0, mundial: 0 },
  "Aston Villa":     { liga: 7,  copa: 7,  continental: 1, mundial: 0 },
  // ---- Itália ----
  "Juventus":        { liga: 36, copa: 15, continental: 2, mundial: 2 },
  "Milan":           { liga: 19, copa: 5,  continental: 7, mundial: 4 },
  "Inter de Milão":  { liga: 20, copa: 9,  continental: 3, mundial: 3 },
  "Napoli":          { liga: 4,  copa: 6,  continental: 0, mundial: 0 },
  "Roma":            { liga: 3,  copa: 9,  continental: 0, mundial: 0 },
  "Lazio":           { liga: 2,  copa: 7,  continental: 0, mundial: 0 },
  "Fiorentina":      { liga: 2,  copa: 6,  continental: 0, mundial: 0 },
  // ---- Alemanha ----
  "Bayern de Munique": { liga: 33, copa: 20, continental: 6, mundial: 2 },
  "Borussia Dortmund": { liga: 8,  copa: 5,  continental: 1, mundial: 1 },
  "Bayer Leverkusen":  { liga: 1,  copa: 1,  continental: 0, mundial: 0 },
  "RB Leipzig":        { liga: 0,  copa: 2,  continental: 0, mundial: 0 },
  // ---- França ----
  "PSG":             { liga: 12, copa: 15, continental: 1, mundial: 0 },
  "Marseille":       { liga: 9,  copa: 10, continental: 1, mundial: 0 },
  "Lyon":            { liga: 7,  copa: 5,  continental: 0, mundial: 0 },
  "Monaco":          { liga: 8,  copa: 5,  continental: 0, mundial: 0 },
  // ---- Portugal ----
  "Benfica":         { liga: 38, copa: 26, continental: 2, mundial: 0 },
  "Porto":           { liga: 30, copa: 20, continental: 2, mundial: 2 },
  "Sporting":        { liga: 20, copa: 17, continental: 0, mundial: 0 },
};

/* Clubes sem palmarés escrito à mão recebem um histórico plausível pela força */
export function palmaresInicialDe(clube) {
  const p = PALMARES_HISTORICO[clube.nome];
  if (p) return { ...p };
  const f = clube.forca || 60;
  if (f >= 84) return { liga: 3, copa: 3, continental: 1, mundial: 0 };
  if (f >= 78) return { liga: 1, copa: 2, continental: 0, mundial: 0 };
  if (f >= 70) return { liga: 0, copa: 1, continental: 0, mundial: 0 };
  return { liga: 0, copa: 0, continental: 0, mundial: 0 };
}

/* Nome bonito de cada tipo de taça, por liga */
export function nomeDosTitulos(ligaId) {
  const br = ligaId === "brasileirao" || ligaId === "serieB";
  return {
    liga: br ? "Brasileirão" : (LIGAS[ligaId]?.nome || "Liga"),
    copa: br ? "Copa do Brasil" : (COMPS_PAIS[ligaId]?.copa || "Copa Nacional"),
    continental: br ? "Libertadores" : "Champions League",
    mundial: "Mundial de Clubes",
  };
}

export const CLUBES = [
  // SÉRIE B
  { nome: "Ceará", forca: 58, liga: "serieB", estado: "CE", modesto: true, cor: "#1A1A1A" },
  { nome: "Guarani", forca: 55, liga: "serieB", estado: "SP", modesto: true, cor: "#005C2E" },
  { nome: "Ponte Preta", forca: 54, liga: "serieB", estado: "SP", modesto: true, cor: "#1A1A1A" },
  { nome: "CRB", forca: 56, liga: "serieB", estado: "AL", modesto: true, cor: "#D2001F" },
  { nome: "Novorizontino", forca: 53, liga: "serieB", estado: "SP", modesto: true, cor: "#E4181C" },
  { nome: "Goiás", forca: 57, liga: "serieB", estado: "GO", modesto: true, cor: "#1A7A3C" },
  { nome: "Avaí", forca: 52, liga: "serieB", estado: "SC", modesto: true, cor: "#0B4EA2" },
  { nome: "Chapecoense", forca: 54, liga: "serieB", estado: "SC", modesto: true, cor: "#1A7A3C" },
  { nome: "Operário-PR", forca: 50, liga: "serieB", estado: "PR", modesto: true, cor: "#1A1A1A" },
  { nome: "Amazonas FC", forca: 49, liga: "serieB", estado: "AM", modesto: true, cor: "#0B7A3C" },
  { nome: "Paysandu", forca: 52, liga: "serieB", estado: "PA", modesto: true, cor: "#B22222" },
  { nome: "Vila Nova", forca: 55, liga: "serieB", estado: "GO", modesto: true, cor: "#0B4EA2" },
  { nome: "Botafogo-SP", forca: 54, liga: "serieB", estado: "SP", modesto: true, cor: "#1A1A1A" },
  { nome: "América-MG", forca: 56, liga: "serieB", estado: "MG", modesto: true, cor: "#1A7A3C" },
  { nome: "Náutico", forca: 53, liga: "serieB", estado: "PE", modesto: true, cor: "#E4181C" },
  { nome: "Londrina", forca: 51, liga: "serieB", estado: "PR", modesto: true, cor: "#0033A0" },
  { nome: "Confiança", forca: 50, liga: "serieB", estado: "SE", modesto: true, cor: "#E4181C" },
  { nome: "Remo", forca: 52, liga: "serieB", estado: "PA", modesto: true, cor: "#003DA5" },
  // BRASILEIRÃO
  { nome: "Coritiba", forca: 64, liga: "brasileirao", estado: "PR", modesto: true, cor: "#1E9E5A" },
  { nome: "Vitória", forca: 65, liga: "brasileirao", estado: "BA", modesto: true, cor: "#B22222" },
  { nome: "Santos", forca: 70, liga: "brasileirao", estado: "SP", modesto: true, cor: "#3A3A3A" },
  { nome: "Vasco da Gama", forca: 71, liga: "brasileirao", estado: "RJ", modesto: true, cor: "#111111" },
  { nome: "Athletico-PR", forca: 66, liga: "brasileirao", estado: "PR", modesto: true, cor: "#A6192E" },
  { nome: "Bahia", forca: 71, liga: "brasileirao", estado: "BA", modesto: true, cor: "#12318C" },
  { nome: "Fortaleza", forca: 76, liga: "brasileirao", estado: "CE", cor: "#0033A0" },
  { nome: "Bragantino", forca: 67, liga: "brasileirao", estado: "SP", modesto: true, cor: "#E4181C" },
  { nome: "Juventude", forca: 62, liga: "serieB", estado: "RS", modesto: true, cor: "#1A7A3C" },
  { nome: "Criciúma", forca: 60, liga: "serieB", estado: "SC", modesto: true, cor: "#E4181C" },

  /* ===== SEGUNDAS DIVISÕES EUROPEIAS (sistema de acesso e rebaixamento) ===== */
  { nome: "Leeds United", forca: 71, liga: "inglaterra2", modesto: true, cor: "#FFFFFF", escuro: true },
  { nome: "Southampton", forca: 70, liga: "inglaterra2", modesto: true, cor: "#D71920" },
  { nome: "Norwich City", forca: 67, liga: "inglaterra2", modesto: true, cor: "#00A650" },
  { nome: "Sheffield United", forca: 69, liga: "inglaterra2", modesto: true, cor: "#EE2737" },
  { nome: "Middlesbrough", forca: 66, liga: "inglaterra2", modesto: true, cor: "#E21C38" },
  { nome: "West Bromwich", forca: 66, liga: "inglaterra2", modesto: true, cor: "#122F67" },
  { nome: "Coventry City", forca: 64, liga: "inglaterra2", modesto: true, cor: "#7BB9E8" },
  { nome: "Millwall", forca: 62, liga: "inglaterra2", modesto: true, cor: "#001D5E" },

  { nome: "Real Zaragoza", forca: 63, liga: "espanha2", modesto: true, cor: "#0B4EA2" },
  { nome: "Sporting Gijón", forca: 64, liga: "espanha2", modesto: true, cor: "#E53027" },
  { nome: "Racing Santander", forca: 63, liga: "espanha2", modesto: true, cor: "#0F9D58" },
  { nome: "Levante", forca: 65, liga: "espanha2", modesto: true, cor: "#004B9B" },
  { nome: "Eibar", forca: 62, liga: "espanha2", modesto: true, cor: "#0B4EA2" },
  { nome: "Deportivo La Coruña", forca: 64, liga: "espanha2", modesto: true, cor: "#0072CE" },
  { nome: "Cádiz", forca: 62, liga: "espanha2", modesto: true, cor: "#FFE500", escuro: true },
  { nome: "Huesca", forca: 60, liga: "espanha2", modesto: true, cor: "#0B4EA2" },

  { nome: "Sampdoria", forca: 64, liga: "italia2", modesto: true, cor: "#1B449C" },
  { nome: "Palermo", forca: 63, liga: "italia2", modesto: true, cor: "#EFA9C4", escuro: true },
  { nome: "Bari", forca: 61, liga: "italia2", modesto: true, cor: "#E4181C" },
  { nome: "Cremonese", forca: 63, liga: "italia2", modesto: true, cor: "#C8102E" },
  { nome: "Spezia", forca: 62, liga: "italia2", modesto: true, cor: "#000000", escuro: false },
  { nome: "Catanzaro", forca: 60, liga: "italia2", modesto: true, cor: "#FFD500", escuro: true },
  { nome: "Brescia", forca: 60, liga: "italia2", modesto: true, cor: "#0057B8" },
  { nome: "Modena", forca: 59, liga: "italia2", modesto: true, cor: "#F5B335", escuro: true },

  { nome: "Hamburgo", forca: 68, liga: "alemanha2", modesto: true, cor: "#0A3A82" },
  { nome: "Hertha Berlim", forca: 66, liga: "alemanha2", modesto: true, cor: "#004C9F" },
  { nome: "Schalke 04", forca: 65, liga: "alemanha2", modesto: true, cor: "#004D9D" },
  { nome: "Fortuna Düsseldorf", forca: 63, liga: "alemanha2", modesto: true, cor: "#E2001A" },
  { nome: "Kaiserslautern", forca: 62, liga: "alemanha2", modesto: true, cor: "#E30613" },
  { nome: "Nürnberg", forca: 62, liga: "alemanha2", modesto: true, cor: "#A61C23" },

  { nome: "Saint-Étienne", forca: 65, liga: "franca2", modesto: true, cor: "#00A94F" },
  { nome: "Bordeaux", forca: 64, liga: "franca2", modesto: true, cor: "#00285E" },
  { nome: "Metz", forca: 62, liga: "franca2", modesto: true, cor: "#7B1E3C" },
  { nome: "Caen", forca: 60, liga: "franca2", modesto: true, cor: "#E4181C" },
  { nome: "Guingamp", forca: 60, liga: "franca2", modesto: true, cor: "#E4181C" },
  { nome: "Ajaccio", forca: 59, liga: "franca2", modesto: true, cor: "#E4181C" },

  { nome: "Académico Viseu", forca: 54, liga: "portugal2", modesto: true, cor: "#0B4EA2" },
  { nome: "Chaves", forca: 55, liga: "portugal2", modesto: true, cor: "#E4181C" },
  { nome: "Feirense", forca: 54, liga: "portugal2", modesto: true, cor: "#0F9D58" },
  { nome: "Leixões", forca: 53, liga: "portugal2", modesto: true, cor: "#E4181C" },
  { nome: "Penafiel", forca: 52, liga: "portugal2", modesto: true, cor: "#E4181C" },
  { nome: "Torreense", forca: 52, liga: "portugal2", modesto: true, cor: "#0B4EA2" },
  { nome: "Mirassol", forca: 61, liga: "brasileirao", estado: "SP", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "Sport Recife", forca: 63, liga: "brasileirao", estado: "PE", modesto: true, cor: "#E4181C" },
  { nome: "Fluminense", forca: 74, liga: "brasileirao", estado: "RJ", cor: "#7C1F3D" },
  { nome: "Grêmio", forca: 74, liga: "brasileirao", estado: "RS", cor: "#0033A0" },
  { nome: "Cruzeiro", forca: 74, liga: "brasileirao", estado: "MG", cor: "#0047AB" },
  { nome: "Internacional", forca: 73, liga: "brasileirao", estado: "RS", cor: "#D2001F" },
  { nome: "Atlético-MG", forca: 76, liga: "brasileirao", estado: "MG", cor: "#1A1A1A" },
  { nome: "Corinthians", forca: 80, liga: "brasileirao", estado: "SP", cor: "#000000" },
  { nome: "São Paulo", forca: 78, liga: "brasileirao", estado: "SP", cor: "#B7093F" },
  { nome: "Botafogo", forca: 78, liga: "brasileirao", estado: "RJ", cor: "#2B2B2B" },
  { nome: "Palmeiras", forca: 82, liga: "brasileirao", estado: "SP", cor: "#006437" },
  { nome: "Flamengo", forca: 85, liga: "brasileirao", estado: "RJ", cor: "#E4181C" },
  // PORTUGAL
  { nome: "Estrela da Amadora", forca: 65, liga: "portugal", modesto: true, cor: "#1A7A3C" },
  { nome: "Famalicão", forca: 67, liga: "portugal", modesto: true, cor: "#E4181C" },
  { nome: "Boavista", forca: 68, liga: "portugal", modesto: true, cor: "#1A1A1A" },
  { nome: "Vitória de Guimarães", forca: 72, liga: "portugal", cor: "#005C2E" },
  { nome: "Braga", forca: 76, liga: "portugal", cor: "#B22222" },
  { nome: "Sporting", forca: 79, liga: "portugal", cor: "#008057" },
  { nome: "Porto", forca: 81, liga: "portugal", cor: "#003DA5" },
  { nome: "Benfica", forca: 82, liga: "portugal", cor: "#E4181C" },
  { nome: "Casa Pia", forca: 64, liga: "portugal", modesto: true, cor: "#1A7A3C" },
  { nome: "Rio Ave", forca: 62, liga: "portugal", modesto: true, cor: "#1A7A3C" },
  { nome: "Moreirense", forca: 60, liga: "portugal", modesto: true, cor: "#1A7A3C" },
  { nome: "Gil Vicente", forca: 61, liga: "portugal", modesto: true, cor: "#E4181C" },
  { nome: "Arouca", forca: 63, liga: "portugal", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "Santa Clara", forca: 59, liga: "portugal", modesto: true, cor: "#0033A0" },
  { nome: "Nacional", forca: 58, liga: "portugal", modesto: true, cor: "#B22222" },
  { nome: "Estoril", forca: 65, liga: "portugal", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "AVS", forca: 55, liga: "portugal", modesto: true, cor: "#1A1A1A" },
  { nome: "Tondela", forca: 54, liga: "portugal", modesto: true, cor: "#1A7A3C" },
  // FRANÇA
  { nome: "Reims", forca: 67, liga: "franca", modesto: true, cor: "#E4181C" },
  { nome: "Toulouse", forca: 68, liga: "franca", modesto: true, cor: "#5B2A86" },
  { nome: "Strasbourg", forca: 70, liga: "franca", modesto: true, cor: "#003DA5" },
  { nome: "Nantes", forca: 55, liga: "franca", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "Rennes", forca: 75, liga: "franca", cor: "#E4181C" },
  { nome: "Lens", forca: 84, liga: "franca", cor: "#FDE100", escuro: true },
  { nome: "Nice", forca: 73, liga: "franca", cor: "#E4181C" },
  { nome: "Lille", forca: 82, liga: "franca", cor: "#B22222" },
  { nome: "Lyon", forca: 80, liga: "franca", cor: "#1A2B49" },
  { nome: "Marseille", forca: 78, liga: "franca", cor: "#2FAADC" },
  { nome: "Monaco", forca: 74, liga: "franca", cor: "#E4002B" },
  { nome: "PSG", forca: 95, liga: "franca", cor: "#004170" },
  { nome: "Auxerre", forca: 61, liga: "franca", modesto: true, cor: "#1A7A3C" },
  { nome: "Angers", forca: 59, liga: "franca", modesto: true, cor: "#0033A0" },
  { nome: "Le Havre", forca: 58, liga: "franca", modesto: true, cor: "#0057B8" },
  { nome: "Brest", forca: 65, liga: "franca", cor: "#E4181C" },
  { nome: "Metz", forca: 53, liga: "franca", modesto: true, cor: "#8E1F2F" },
  { nome: "Paris FC", forca: 63, liga: "franca", cor: "#1A1A1A" },
  // ITÁLIA
  { nome: "Udinese", forca: 68, liga: "italia", modesto: true, cor: "#1A1A1A" },
  { nome: "Torino", forca: 66, liga: "italia", modesto: true, cor: "#8E1F2F" },
  { nome: "Bologna", forca: 73, liga: "italia", cor: "#B22222" },
  { nome: "Fiorentina", forca: 65, liga: "italia", cor: "#5B2A86" },
  { nome: "Atalanta", forca: 75, liga: "italia", cor: "#1A1A1A" },
  { nome: "Lazio", forca: 71, liga: "italia", cor: "#87CEEB", escuro: true },
  { nome: "Roma", forca: 83, liga: "italia", cor: "#8E1F2F" },
  { nome: "Napoli", forca: 85, liga: "italia", cor: "#12A0D7" },
  { nome: "Juventus", forca: 77, liga: "italia", cor: "#1A1A1A" },
  { nome: "Milan", forca: 78, liga: "italia", cor: "#A80532" },
  { nome: "Inter de Milão", forca: 88, liga: "italia", cor: "#0B1560" },
  { nome: "Genoa", forca: 62, liga: "italia", modesto: true, cor: "#1A1A1A" },
  { nome: "Cagliari", forca: 63, liga: "italia", modesto: true, cor: "#B22222" },
  { nome: "Verona", forca: 55, liga: "italia", modesto: true, cor: "#0033A0" },
  { nome: "Como", forca: 80, liga: "italia", modesto: true, cor: "#0057B8" },
  { nome: "Parma", forca: 64, liga: "italia", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "Lecce", forca: 60, liga: "italia", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "Cremonese", forca: 56, liga: "italia", modesto: true, cor: "#B22222" },
  { nome: "Pisa", forca: 53, liga: "italia", modesto: true, cor: "#0033A0" },
  { nome: "Sassuolo", forca: 67, liga: "italia", modesto: true, cor: "#1A7A3C" },
  // ALEMANHA
  { nome: "Freiburg", forca: 75, liga: "alemanha", modesto: true, cor: "#1A1A1A" },
  { nome: "Hoffenheim", forca: 79, liga: "alemanha", modesto: true, cor: "#003DA5" },
  { nome: "Union Berlin", forca: 71, liga: "alemanha", modesto: true, cor: "#B22222" },
  { nome: "Wolfsburg", forca: 58, liga: "alemanha", cor: "#1A7A3C" },
  { nome: "Stuttgart", forca: 82, liga: "alemanha", cor: "#E4181C" },
  { nome: "Eintracht Frankfurt", forca: 74, liga: "alemanha", cor: "#B22222" },
  { nome: "RB Leipzig", forca: 84, liga: "alemanha", cor: "#003DA5" },
  { nome: "Leverkusen", forca: 78, liga: "alemanha", cor: "#E32219" },
  { nome: "Borussia Dortmund", forca: 88, liga: "alemanha", cor: "#FDE100", escuro: true },
  { nome: "Bayern de Munique", forca: 96, liga: "alemanha", cor: "#DC052D" },
  { nome: "Borussia Mönchengladbach", forca: 72, liga: "alemanha", cor: "#1A7A3C" },
  { nome: "Werder Bremen", forca: 70, liga: "alemanha", cor: "#0B7A3C" },
  { nome: "Mainz 05", forca: 68, liga: "alemanha", cor: "#E4181C" },
  { nome: "Augsburg", forca: 65, liga: "alemanha", modesto: true, cor: "#B22222" },
  { nome: "Heidenheim", forca: 56, liga: "alemanha", modesto: true, cor: "#0033A0" },
  { nome: "St. Pauli", forca: 55, liga: "alemanha", modesto: true, cor: "#5A3A2E" },
  { nome: "FC Köln", forca: 63, liga: "alemanha", modesto: true, cor: "#E4181C" },
  { nome: "Hamburger SV", forca: 60, liga: "alemanha", modesto: true, cor: "#0033A0" },
  // ESPANHA
  { nome: "Valencia", forca: 69, liga: "espanha", modesto: true, cor: "#E4181C" },
  { nome: "Girona", forca: 60, liga: "espanha", cor: "#E4181C" },
  { nome: "Real Betis", forca: 78, liga: "espanha", cor: "#1A7A3C" },
  { nome: "Sevilla", forca: 77, liga: "espanha", cor: "#D8112B" },
  { nome: "Real Sociedad", forca: 76, liga: "espanha", cor: "#003DA5" },
  { nome: "Villarreal", forca: 82, liga: "espanha", cor: "#FDE100", escuro: true },
  { nome: "Athletic Bilbao", forca: 83, liga: "espanha", cor: "#D8112B" },
  { nome: "Atlético de Madrid", forca: 88, liga: "espanha", cor: "#CB3524" },
  { nome: "Barcelona", forca: 95, liga: "espanha", cor: "#A50044" },
  { nome: "Real Madrid", forca: 92, liga: "espanha", cor: "#FEBE10", escuro: true },
  { nome: "Celta Vigo", forca: 74, liga: "espanha", cor: "#8ACBEA", escuro: true },
  { nome: "Osasuna", forca: 67, liga: "espanha", modesto: true, cor: "#E4181C" },
  { nome: "Mallorca", forca: 58, liga: "espanha", modesto: true, cor: "#E4181C" },
  { nome: "Rayo Vallecano", forca: 68, liga: "espanha", cor: "#E4181C" },
  { nome: "Getafe", forca: 70, liga: "espanha", modesto: true, cor: "#0033A0" },
  { nome: "Alavés", forca: 63, liga: "espanha", modesto: true, cor: "#1A7A3C" },
  { nome: "Espanyol", forca: 61, liga: "espanha", modesto: true, cor: "#0033A0" },
  { nome: "Elche", forca: 59, liga: "espanha", modesto: true, cor: "#1A7A3C" },
  { nome: "Levante", forca: 57, liga: "espanha", modesto: true, cor: "#B22222" },
  { nome: "Real Oviedo", forca: 54, liga: "espanha", modesto: true, cor: "#0033A0" },
  // INGLATERRA
  { nome: "Everton", forca: 71, liga: "inglaterra", modesto: true, cor: "#274488" },
  { nome: "Crystal Palace", forca: 72, liga: "inglaterra", modesto: true, cor: "#1B458F" },
  { nome: "Fulham", forca: 70, liga: "inglaterra", cor: "#FFFFFF", escuro: true },
  { nome: "Wolves", forca: 57, liga: "inglaterra", cor: "#FDB913", escuro: true },
  { nome: "West Ham", forca: 61, liga: "inglaterra", cor: "#7A263A" },
  { nome: "Brighton", forca: 73, liga: "inglaterra", cor: "#0057B8" },
  { nome: "Aston Villa", forca: 83, liga: "inglaterra", cor: "#670E36" },
  { nome: "Tottenham", forca: 78, liga: "inglaterra", cor: "#FFFFFF", escuro: true },
  { nome: "Newcastle", forca: 80, liga: "inglaterra", cor: "#241F20" },
  { nome: "Chelsea", forca: 79, liga: "inglaterra", cor: "#034694" },
  { nome: "Manchester United", forca: 87, liga: "inglaterra", cor: "#DA020E" },
  { nome: "Arsenal", forca: 94, liga: "inglaterra", cor: "#EF0107" },
  { nome: "Liverpool", forca: 81, liga: "inglaterra", cor: "#C8102E" },
  { nome: "Manchester City", forca: 92, liga: "inglaterra", cor: "#6CABDD" },
  { nome: "Nottingham Forest", forca: 68, liga: "inglaterra", cor: "#DD0000" },
  { nome: "Bournemouth", forca: 77, liga: "inglaterra", cor: "#DA291C" },
  { nome: "Brentford", forca: 69, liga: "inglaterra", cor: "#E30613" },
  { nome: "Leeds United", forca: 65, liga: "inglaterra", modesto: true, cor: "#FFCD00", escuro: true },
  { nome: "Burnley", forca: 58, liga: "inglaterra", modesto: true, cor: "#6C1D45" },
  { nome: "Sunderland", forca: 74, liga: "inglaterra", modesto: true, cor: "#E4181C" },
  // MLS
  { nome: "Seattle Sounders", forca: 66, liga: "mls", cor: "#5D9741" },
  { nome: "Atlanta United", forca: 68, liga: "mls", cor: "#80000B" },
  { nome: "LA Galaxy", forca: 70, liga: "mls", cor: "#00245D" },
  { nome: "Inter Miami", forca: 72, liga: "mls", cor: "#F5B6CD", escuro: true },
  { nome: "LAFC", forca: 74, liga: "mls", cor: "#1A1A1A" },
  { nome: "New York City FC", forca: 71, liga: "mls", cor: "#6CABDD" },
  { nome: "Columbus Crew", forca: 72, liga: "mls", cor: "#FDE100", escuro: true },
  { nome: "Philadelphia Union", forca: 70, liga: "mls", cor: "#0033A0" },
  // ARÁBIA
  { nome: "Al-Ittihad", forca: 78, liga: "arabia", cor: "#F9E300", escuro: true },
  { nome: "Al-Ahli", forca: 77, liga: "arabia", cor: "#1A7A3C" },
  { nome: "Al-Nassr", forca: 79, liga: "arabia", cor: "#F9E300", escuro: true },
  { nome: "Al-Hilal", forca: 80, liga: "arabia", cor: "#0055A5" },
  { nome: "Al-Ettifaq", forca: 74, liga: "arabia", cor: "#1A1A1A" },
  { nome: "Al-Taawoun", forca: 68, liga: "arabia", modesto: true, cor: "#FDE100", escuro: true },
  { nome: "Al-Fateh", forca: 66, liga: "arabia", modesto: true, cor: "#1A7A3C" },
  { nome: "Al-Shabab", forca: 70, liga: "arabia", cor: "#FFFFFF", escuro: true },
];

export const EMOJI_CLUBES = {
  "Flamengo": "🔴⚫", "Fluminense": "🟢⚪🔴", "Botafogo": "⭐⚫⚪", "Vasco da Gama": "⚓⚫⚪", "Corinthians": "⚪⚫",
  "Palmeiras": "🐷💚", "São Paulo": "🔴⚪⚫", "Santos": "🐳⚪⚫", "Grêmio": "🔵⚫⚪", "Internacional": "🔴⚪",
  "Cruzeiro": "🔵✝️", "Athletico-PR": "🔴⚫", "Coritiba": "🦅💚", "Bahia": "🔵🔴⚪", "Vitória": "🔴⚫",
  "Fortaleza": "🔵🔴", "Bragantino": "🔴⚪", "Atlético-MG": "⚫⚪", "Juventude": "💚⚪", "Criciúma": "🎩🦁",
  "Mirassol": "💛🍇", "Sport Recife": "🔴⚫🦁", "Avaí": "🔵⚪", "Chapecoense": "💚⚪", "Paysandu": "🔵⚪🔴",
  "Real Madrid": "👑⚪", "Barcelona": "🔵🔴", "Atlético de Madrid": "🔴⚪", "Sevilla": "⚪🔴",
  "Manchester City": "💙", "Manchester United": "😈🔴", "Liverpool": "🔴🐦", "Arsenal": "🔴⚪🔫", "Chelsea": "🔵🦁", "Newcastle": "⚫⚪🦄",
  "Bayern de Munique": "🔴⚪", "Borussia Dortmund": "🟡⚫", "Leverkusen": "🔴⚫",
  "PSG": "🔵🔴", "Marseille": "🔵⚪", "Lyon": "🔴🔵", "Monaco": "🔴⚪",
  "Milan": "🔴⚫", "Inter de Milão": "🔵⚫", "Juventus": "⚪⚫🦓", "Napoli": "🔵", "Roma": "🟠🔴🐺",
  "Porto": "🔵⚪🐉", "Benfica": "🔴⚪🦅", "Sporting": "🟢⚪🦁",
};

export const PEDIDOS_DIRETORIA = [
  { label: "pedir reforços pro elenco", efeito: (c) => { c.tecnicoConfianca = clampR((c.tecnicoConfianca ?? 60) + 4, 0, 100); } },
  { label: "pedir melhorias na estrutura de treino", efeito: (c) => { c.staff = { ...c.staff, estruturaMelhorada: true }; } },
  { label: "pedir prioridade em patrocínios pessoais", efeito: (c) => { c.fama = clamp(c.fama + 5, 0, 100); } },
  { label: "pedir apoio em uma causa social do clube", efeito: (c) => { c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + 6, 0, 100); } },
];

export const PEDIDOS_TECNICO = [
  { titulo: "Pedido do técnico", texto: "O técnico quer marcar um treino individual extra com você antes da temporada.", opts: [
    { label: "Aceitar o treino individual", energia: -15, confianca: 10, txt: "Você topou o treino extra — o técnico valorizou o comprometimento." },
    { label: "Recusar, prefere descansar", energia: 5, confianca: -4, txt: "Recusou o convite — o técnico anotou mentalmente." },
  ]},
  { titulo: "Pedido do técnico", texto: "O técnico pede que você abra mão de parte das férias pra treinar mais cedo.", opts: [
    { label: "Abrir mão das férias", energia: -25, confianca: 14, txt: "Sacrificou o descanso — ganhou a confiança total da comissão." },
    { label: "Manter as férias como estão", energia: 10, confianca: -6, txt: "Manteve o planejado — o técnico entendeu, mas ficou de olho." },
  ]},
  { titulo: "Pedido do técnico", texto: "O técnico pede que você lidere um treino específico com os companheiros de elenco.", opts: [
    { label: "Treinar e liderar o grupo", energia: -10, confianca: 8, txt: "Liderou a sessão com o grupo — reforçou seu status no elenco." },
    { label: "Preferir treinar sozinho", energia: 0, confianca: -3, txt: "Optou por treinar à parte — passou despercebido." },
  ]},
];

export const RIVAIS_POR_TIER = [
  { min: 0, max: 69, nomes: ["G. Almeida", "T. Ferraz", "L. Souto", "R. Bittencourt", "M. Prado"] },
  { min: 70, max: 79, nomes: ["L. Vázquez", "R. Okafor", "F. Rossi", "A. Kovač", "J. Bellini"] },
  { min: 80, max: 89, nomes: ["K. Adeyemi", "M. Sterling Jr.", "T. Andersen", "D. Silveira", "N. Aubert"] },
  { min: 90, max: 100, nomes: ["S. Haaland Jr.", "D. Mbappé Jr.", "E. Camavinga Jr.", "P. Yamal Jr."] },
];

export const RIVAIS_PREMIO = RIVAIS_POR_TIER.flatMap((t) => t.nomes);

export const FASES_COPINHA = ["Fase de Grupos", "Oitavas de Final", "Quartas de Final", "Semifinal", "Final"];

export const ESTADUAIS = {
  SP: "Campeonato Paulista", RJ: "Campeonato Carioca", MG: "Campeonato Mineiro", RS: "Campeonato Gaúcho",
  PR: "Campeonato Paranaense", BA: "Campeonato Baiano", CE: "Campeonato Cearense", PE: "Campeonato Pernambucano",
  SC: "Campeonato Catarinense", GO: "Campeonato Goiano", PA: "Campeonato Paraense", AM: "Campeonato Amazonense", AL: "Campeonato Alagoano",
};

export const FASES_POR_COMPETICAO = {
  estadual: [{ id: "grupos", label: "Fase de Grupos", prep: "na" }, { id: "semifinal", label: "Semifinal", prep: "na" }],
  copaNacional: [{ id: "oitavas", label: "Oitavas de Final", prep: "nas" }, { id: "quartas", label: "Quartas de Final", prep: "nas" }, { id: "semifinal", label: "Semifinal", prep: "na" }],
  copinha: [{ id: "grupos", label: "Fase de Grupos", prep: "na" }, { id: "oitavas", label: "Oitavas de Final", prep: "nas" }, { id: "quartas", label: "Quartas de Final", prep: "nas" }, { id: "semifinal", label: "Semifinal", prep: "na" }],
};

export const FASES_COPA_MUNDO = [
  { id: "grupos", label: "Fase de Grupos", prep: "na" },
  { id: "dezesseis", label: "Dezesseis-avos de Final", prep: "nos" },
  { id: "oitavas", label: "Oitavas de Final", prep: "nas" },
  { id: "quartas", label: "Quartas de Final", prep: "nas" },
  { id: "semifinal", label: "Semifinal", prep: "na" },
];

export const NIVEIS = [
  { n: 1, label: "Jogador comum" }, { n: 2, label: "Sensação de uma temporada" },
  { n: 3, label: "Estrela" }, { n: 4, label: "Jogador histórico" },
  { n: 5, label: "Top 50 de todos os tempos" }, { n: 6, label: "Um dos melhores da sua posição" },
  { n: 7, label: "Top 10 de todos os tempos" }, { n: 8, label: "O melhor da sua posição na história" },
  { n: 9, label: "Top 5 de todos os tempos" }, { n: 10, label: "Sempre citado no debate GOAT" },
  { n: 11, label: "A JOIA" },
];

export const TIERS_TORCIDA = [
  { min: 90, label: "Lenda Máxima", cor: "#D8B44A" }, { min: 75, label: "Ídolo", cor: "#12A876" },
  { min: 60, label: "Xodó da torcida", cor: "#34d399" }, { min: 45, label: "Querido", cor: "#3b82f6" },
  { min: 30, label: "Respeitado", cor: "#8b5cf6" }, { min: 18, label: "Coadjuvante", cor: "#a1a1aa" },
  { min: 8, label: "Contestado", cor: "#f59e0b" }, { min: 0, label: "Jogador esquecível", cor: "#6b7280" },
];

/* ===================== INSÍGNIAS =====================
   Conquistadas por comportamento repetido, não por sorte. Evoluem em três níveis
   (bronze → prata → ouro) e cada nível aperta o efeito. Diferente da versão antiga,
   elas não servem só pra mata-mata: mexem em treino, lesão, moral, mercado e minigames. */
export const NIVEIS_INSIGNIA = [
  { nivel: 1, nome: "Bronze", cor: "#CD7F32" },
  { nivel: 2, nome: "Prata", cor: "#C0C0C0" },
  { nivel: 3, nome: "Ouro", cor: "#D8B44A" },
];

export const TRAITS_DISPONIVEIS = [
  /* --- por atributo mantido no alto --- */
  { id: "finalizadorClinico", nome: "Finalizador Clínico", icone: "🎯", tipo: "atributo", attrId: "finalizacao",
    limiares: [82, 88, 93], temporadas: [1, 2, 3],
    desc: (n) => `Finalização acima de ${[82, 88, 93][n - 1]} por ${[1, 2, 3][n - 1]} temporada(s).`,
    efeito: (n) => `+${(n * 4)}% de gols na temporada`, golsMult: (n) => 1 + n * 0.04, mataMata: (n) => n * 0.02 },
  { id: "muralha", nome: "Muralha", icone: "🛡️", tipo: "atributo", attrId: "defesa",
    limiares: [82, 88, 93], temporadas: [1, 2, 3],
    desc: (n) => `Defesa acima de ${[82, 88, 93][n - 1]} por ${[1, 2, 3][n - 1]} temporada(s).`,
    efeito: (n) => `Time sofre ${n * 4}% menos gols com você em campo`, defesaTime: (n) => n * 0.04, mataMata: (n) => n * 0.02 },
  { id: "maestro", nome: "Maestro", icone: "🎼", tipo: "atributo", attrId: "passe",
    limiares: [82, 88, 93], temporadas: [1, 2, 3],
    desc: (n) => `Passe acima de ${[82, 88, 93][n - 1]} por ${[1, 2, 3][n - 1]} temporada(s).`,
    efeito: (n) => `+${n * 6}% de assistências`, assistMult: (n) => 1 + n * 0.06, mataMata: (n) => n * 0.015 },
  { id: "dribladorNato", nome: "Driblador Nato", icone: "🌀", tipo: "atributo", attrId: "drible",
    limiares: [82, 88, 93], temporadas: [1, 2, 3],
    desc: (n) => `Drible acima de ${[82, 88, 93][n - 1]} por ${[1, 2, 3][n - 1]} temporada(s).`,
    efeito: (n) => `+${n * 5}% de chance nos minigames de habilidade`, minigame: (n) => n * 0.05 },
  { id: "fenomenoFisico", nome: "Fenômeno Físico", icone: "💪", tipo: "atributo", attrId: "fisico",
    limiares: [80, 87, 92], temporadas: [1, 2, 3],
    desc: (n) => `Físico acima de ${[80, 87, 92][n - 1]} por ${[1, 2, 3][n - 1]} temporada(s).`,
    efeito: (n) => `${n * 12}% menos risco de lesão e desgaste`, riscoLesao: (n) => 1 - n * 0.12, desgaste: (n) => 1 - n * 0.1 },
  { id: "velocista", nome: "Velocista", icone: "⚡", tipo: "atributo", attrId: "velocidade",
    limiares: [85, 90, 94], temporadas: [1, 2, 3],
    desc: (n) => `Velocidade acima de ${[85, 90, 94][n - 1]} por ${[1, 2, 3][n - 1]} temporada(s).`,
    efeito: (n) => `+${n * 3}% de gols e assistências em contra-ataque`, golsMult: (n) => 1 + n * 0.02, assistMult: (n) => 1 + n * 0.02 },

  /* --- por comportamento ao longo da carreira --- */
  { id: "cobrador", nome: "Cobrador", icone: "🥅", tipo: "feito",
    condicao: (c) => c.especialistaBP ? 3 : (c.minigamesAcertados || 0) >= 12 ? 2 : (c.minigamesAcertados || 0) >= 5 ? 1 : 0,
    desc: () => "Acumule acertos em cobranças de pênalti e falta.",
    efeito: (n) => `+${n * 7}% de chance em pênaltis e faltas`, minigame: (n) => n * 0.07 },
  { id: "decisivo", nome: "Jogador de Decisão", icone: "🦁", tipo: "feito",
    condicao: (c) => { const d = c.difClassico || 0; return d >= 0.5 ? 3 : d >= 0.3 ? 2 : d >= 0.15 ? 1 : 0; },
    desc: () => "Renda mais em clássicos e mata-matas do que em jogos comuns.",
    efeito: (n) => `+${n * 4}% de chance em fases decisivas`, mataMata: (n) => n * 0.04 },
  { id: "sangueFrio", nome: "Sangue Frio", icone: "🧊", tipo: "feito",
    condicao: (c) => { const t = c.titulos || 0; return t >= 8 ? 3 : t >= 4 ? 2 : t >= 2 ? 1 : 0; },
    desc: () => "Conquiste títulos — quem já levantou taça não treme.",
    efeito: (n) => `Perde ${n * 25}% menos moral após derrotas`, protecaoMoral: (n) => n * 0.25, mataMata: (n) => n * 0.015 },
  { id: "lider", nome: "Líder Nato", icone: "👑", tipo: "feito",
    condicao: (c) => { const m = c.elencoMoral ?? 60; const cap = c.selecao?.capitao; return cap && m >= 75 ? 3 : m >= 75 ? 2 : m >= 68 ? 1 : 0; },
    desc: () => "Mantenha o vestiário do seu lado.",
    efeito: (n) => `+${n * 3} de moral do elenco por temporada`, moralAnual: (n) => n * 3 },
  { id: "idoloEterno", nome: "Ídolo Eterno", icone: "💎", tipo: "feito",
    condicao: (c) => { const t = Math.max(0, ...Object.values(c.torcidaPorClube || { x: 0 })); return t >= 90 ? 3 : t >= 80 ? 2 : t >= 70 ? 1 : 0; },
    desc: () => "Seja idolatrado pela torcida de algum clube.",
    efeito: (n) => `Torcida nunca cai abaixo de ${[40, 50, 60][n - 1]}`, pisoTorcida: (n) => [40, 50, 60][n - 1] },
  { id: "cidadaoMundo", nome: "Cidadão do Mundo", icone: "✈️", tipo: "feito",
    condicao: (c) => { const n = Object.keys(c.camisaPorClube || {}).length; return n >= 6 ? 3 : n >= 4 ? 2 : n >= 3 ? 1 : 0; },
    desc: () => "Defenda clubes diferentes ao longo da carreira.",
    efeito: (n) => `Entrosamento inicial +${n * 8} em clube novo`, entrosamentoNovo: (n) => n * 8 },
  { id: "artilheiroNato", nome: "Artilheiro Nato", icone: "👟", tipo: "feito",
    condicao: (c) => { const g = c.gols || 0; return g >= 250 ? 3 : g >= 120 ? 2 : g >= 50 ? 1 : 0; },
    desc: () => "Some gols na carreira: 50, 120 e 250.",
    efeito: (n) => `+${n * 3}% de gols e valor de mercado`, golsMult: (n) => 1 + n * 0.03, valorMult: (n) => 1 + n * 0.03 },
  { id: "imortal", nome: "Imortal", icone: "🕰️", tipo: "feito",
    condicao: (c) => { const i = c.idade || 16; return i >= 36 ? 3 : i >= 34 ? 2 : i >= 32 ? 1 : 0; },
    desc: () => "Siga jogando em alto nível depois dos 32.",
    efeito: (n) => `Declínio por idade ${n * 20}% mais lento`, declinio: (n) => 1 - n * 0.2 },
];

/* Soma o efeito de um tipo entre todas as insígnias conquistadas */
export function somaEfeitoInsignia(c, chave) {
  let total = 0;
  (c?.traits || []).forEach((t) => {
    const id = typeof t === "string" ? t : t.id;
    const nivel = typeof t === "string" ? 1 : (t.nivel || 1);
    const def = TRAITS_DISPONIVEIS.find((x) => x.id === id);
    if (def && typeof def[chave] === "function") total += def[chave](nivel);
  });
  return total;
}
/* Multiplicadores começam em 1 e se acumulam multiplicando */
export function multEfeitoInsignia(c, chave) {
  let m = 1;
  (c?.traits || []).forEach((t) => {
    const id = typeof t === "string" ? t : t.id;
    const nivel = typeof t === "string" ? 1 : (t.nivel || 1);
    const def = TRAITS_DISPONIVEIS.find((x) => x.id === id);
    if (def && typeof def[chave] === "function") m *= def[chave](nivel);
  });
  return m;
}

/* ===================== MARCOS DE CARREIRA =====================
   Não são só registro: os raros dão bônus permanente, os ruins deixam cicatriz,
   e alguns são secretos — você só descobre que existiam quando conquista. */
export const MARCOS_ESPECIAIS = [
  /* --- marcos de conquista, com recompensa permanente --- */
  { id: "gol100Clube", nome: "100 gols pelo mesmo clube", icone: "💯", cor: "#D8B44A", tipo: "recorde",
    condicao: (c) => Object.values(c.statsPorClube || {}).some((s) => (s.gols || 0) >= 100),
    texto: (c) => `Chegou a 100 gols com a mesma camisa — número que poucos alcançam.`,
    recompensa: (c) => { c.attrs.finalizacao = Math.min(99, c.attrs.finalizacao + 2); },
    recompensaTxt: "+2 de finalização permanente" },
  { id: "decada", nome: "Uma década no mesmo clube", icone: "🏛️", cor: "#12A876", tipo: "recorde",
    condicao: (c) => Object.values(c.statsPorClube || {}).some((s) => (s.temporadas || 0) >= 10),
    texto: () => `Dez temporadas defendendo o mesmo escudo. Isso já não se vê mais no futebol.`,
    recompensa: (c) => { c.torcidaPorClube = { ...(c.torcidaPorClube || {}), [c.clube.nome]: 100 }; },
    recompensaTxt: "Torcida no máximo, pra sempre" },
  { id: "trinca", nome: "Tríplice coroa", icone: "👑", cor: "#EC4899", tipo: "titulo",
    condicao: (c, card) => card && card.campeaoLiga && card.copaNacional?.titulo && card.continental?.titulo,
    texto: () => `Liga, copa e continental na mesma temporada. Uma temporada perfeita.`,
    recompensa: (c) => { c.fama = Math.min(100, c.fama + 15); },
    recompensaTxt: "+15 de fama" },
  { id: "artilheiroMundo", nome: "Artilheiro do mundo", icone: "🌍", cor: "#f59e0b", tipo: "premio",
    condicao: (c, card, ctx) => ctx?.postoBO === 1,
    texto: () => `Eleito o melhor jogador do planeta. O topo absoluto.`,
    recompensa: (c) => { NUM_ATTRS.forEach((a) => { c.attrs[a] = Math.min(99, c.attrs[a] + 1); }); },
    recompensaTxt: "+1 em todos os atributos" },
  { id: "camisa10", nome: "O camisa 10 da seleção", icone: "🎖️", cor: "#22D3EE", tipo: "selecao",
    condicao: (c) => c.selecao?.capitao && (c.selecao?.jogos || 0) >= 50,
    texto: (c) => `Capitão com mais de 50 jogos pela seleção. Você virou a referência do país.`,
    recompensa: (c) => { c.fama = Math.min(100, c.fama + 10); },
    recompensaTxt: "+10 de fama" },

  /* --- cicatrizes: o futebol também machuca --- */
  { id: "jejum", nome: "O jejum", icone: "🥀", cor: "#D6483F", tipo: "lesao", negativo: true,
    condicao: (c, card) => card && card.jogos >= 20 && card.gols === 0 && !["GOL", "ZAG"].includes(c.posicao),
    texto: () => `Uma temporada inteira sem marcar. A imprensa não deixou você esquecer.`,
    recompensa: (c) => { c.calorMidia = Math.min(100, (c.calorMidia ?? 20) + 15); },
    recompensaTxt: "A pressão aumentou" },
  { id: "rebaixado", nome: "A queda", icone: "⬇️", cor: "#D6483F", tipo: "lesao", negativo: true,
    condicao: (c, card) => card && (card.posLiga ?? 1) >= 18,
    texto: (c) => `Terminou entre os últimos com o ${c.clube.nome}. Uma temporada pra esquecer — mas que ninguém esquece.`,
    recompensaTxt: "Marca na carreira" },
  { id: "operado", nome: "A cirurgia", icone: "🏥", cor: "#D6483F", tipo: "lesao", negativo: true,
    condicao: (c) => (c.lesoesHistorico || []).some((l) => l.gravidade >= 4),
    texto: () => `Uma lesão que exigiu cirurgia e meses parado. O corpo nunca mais foi o mesmo.`,
    recompensaTxt: "Cicatriz permanente" },

  /* --- marcos secretos: aparecem só quando acontecem --- */
  { id: "profeta", nome: "Profeta da casa", icone: "🔮", cor: "#a855f7", tipo: "recorde", secreto: true,
    condicao: (c) => c.clubeCoracao && c.clube?.nome === c.clubeCoracao && (c.titulos || 0) >= 3,
    texto: (c) => `Três títulos pelo clube do seu coração. O menino que sonhava virou ídolo em casa.`,
    recompensa: (c) => { c.fama = Math.min(100, c.fama + 8); },
    recompensaTxt: "+8 de fama · sonho realizado" },
  { id: "andarilho", nome: "O andarilho", icone: "🧭", cor: "#a855f7", tipo: "transferencia", secreto: true,
    condicao: (c) => Object.keys(c.camisaPorClube || {}).length >= 7,
    texto: () => `Sete clubes diferentes. Sua carreira foi uma viagem sem endereço fixo.`,
    recompensa: (c) => { c.entrosamento = Math.min(100, (c.entrosamento ?? 20) + 20); },
    recompensaTxt: "Adapta-se instantaneamente" },
  { id: "fenix", nome: "Fênix", icone: "🔥", cor: "#a855f7", tipo: "recorde", secreto: true,
    condicao: (c, card) => card && (c.sequela || 0) >= 0.3 && card.nota >= 7.6,
    texto: () => `Depois de tantas lesões, uma temporada de altíssimo nível. Você renasceu.`,
    recompensa: (c) => { c.sequela = Math.max(0, (c.sequela || 0) - 0.15); },
    recompensaTxt: "Parte das sequelas superada" },
  { id: "carrasco", nome: "Carrasco do rival", icone: "😈", cor: "#a855f7", tipo: "recorde", secreto: true,
    condicao: (c) => (c.golsEmClassicos || 0) >= 15,
    texto: () => `15 gols em clássicos. A torcida adversária aprendeu a temer seu nome.`,
    recompensa: (c) => { c.fama = Math.min(100, c.fama + 6); },
    recompensaTxt: "+6 de fama · pesadelo dos rivais" },
];

/* ===================== POSTURA DE JOGO =====================
   Antes de cada partida você decide como vai entrar em campo.
   Não existe escolha certa: cada uma troca uma coisa por outra. */
export const POSTURAS_JOGO = [
  { id: "cauteloso", nome: "Jogar seguro", icone: "🛡️", cor: "#3b82f6",
    desc: "Menos risco, menos brilho. Evita cartão e poupa o corpo.",
    golMult: 0.82, assistMult: 0.9, cartaoMult: 0.5, desgasteMult: 0.75, notaBonus: -0.05 },
  { id: "normal", nome: "Jogo natural", icone: "⚖️", cor: "#a1a1aa",
    desc: "Do jeito que você sempre joga.",
    golMult: 1, assistMult: 1, cartaoMult: 1, desgasteMult: 1, notaBonus: 0 },
  { id: "ofensivo", nome: "Ir pra cima", icone: "⚔️", cor: "#D8B44A",
    desc: "Buscar o jogo o tempo todo. Mais chance de decidir, mais chance de se expor.",
    golMult: 1.3, assistMult: 1.15, cartaoMult: 1.5, desgasteMult: 1.35, notaBonus: 0.08 },
  { id: "raca", nome: "Jogar na raça", icone: "🔥", cor: "#D6483F",
    desc: "Entrar forte em toda dividida. A torcida ama — o árbitro nem tanto.",
    golMult: 1.1, assistMult: 1, cartaoMult: 2.4, desgasteMult: 1.5, notaBonus: 0.04, torcidaBonus: 1 },
];

/* Regras de cartão: 3 amarelos suspendem 1 jogo, vermelho suspende de 1 a 2 */
export const REGRAS_CARTAO = { amarelosParaSuspender: 3, jogosPorVermelho: [1, 2] };

/* Chance base de cartão por posição — zagueiro e volante levam muito mais que ponta */
export const CARTAO_POR_POSICAO = {
  GOL: 0.03, ZAG: 0.16, LD: 0.12, LE: 0.12, VOL: 0.18, MC: 0.13, MEI: 0.09, PD: 0.07, PE: 0.07, SA: 0.07, ATA: 0.08,
};

/* ===================== RESPOSTAS A TORCEDORES =====================
   Responder um fã é fácil. Responder um hater é onde a carreira se complica. */
export const RESPOSTAS_FA = [
  { id: "agradecer", label: "Agradecer com simplicidade", icone: "🙏", cor: "#12A876",
    texto: "Obrigado, torcedor! Vocês que fazem a diferença todo jogo.",
    efeito: { torcida: 4, elenco: 2, seguidores: 2 } },
  { id: "prometer", label: "Prometer mais", icone: "🔥", cor: "#D8B44A",
    texto: "Ainda tem muito por vir. Guarda esse print pro ano que vem.",
    efeito: { torcida: 6, fama: 3, calorMidia: 6, seguidores: 4 } },
  { id: "dividir", label: "Dividir com o grupo", icone: "🤝", cor: "#3b82f6",
    texto: "Mérito é do grupo todo. Sozinho eu não faço nada.",
    efeito: { elenco: 7, torcida: 3, seguidores: 1 } },
];
export const RESPOSTAS_HATER = [
  { id: "ignorarNao", label: "Responder com humildade", icone: "🙇", cor: "#12A876",
    texto: "Você tem razão, posso mais. Vou trabalhar pra melhorar.",
    efeito: { torcida: 5, elenco: 3, calorMidia: -4 } },
  { id: "ironia", label: "Responder com ironia", icone: "😏", cor: "#D8B44A",
    texto: "Se você jogasse metade do que fala, já era titular.",
    efeito: { fama: 6, torcida: -3, calorMidia: 14, seguidores: 6 } },
  { id: "peitar", label: "Peitar de frente", icone: "😤", cor: "#D6483F",
    texto: "Fala isso na minha cara. Fácil digitar atrás de um perfil falso.",
    efeito: { fama: 8, torcida: -8, elenco: -4, calorMidia: 20, seguidores: 8 } },
  { id: "bloquear", label: "Bloquear e seguir a vida", icone: "🚫", cor: "#71717a",
    texto: "(sem resposta pública)",
    efeito: { calorMidia: -6 } },
];

/* ===================== APELIDOS DA TORCIDA =====================
   Depois de algumas temporadas, a arquibancada te batiza. O apelido nasce do
   que você é em campo — e vem com um cântico que aparece nos jogos em casa. */
export const APELIDOS_TORCIDA = [
  { id: "anjo", nome: "O Anjo", icone: "😇", cond: (c, s) => s.golsPorJogo >= 0.7 && c.fama >= 60,
    cantico: (n) => `Ôoo, ${n}! O anjo da nossa torcida!`, req: "Média de gols altíssima" },
  { id: "maestro", nome: "O Maestro", icone: "🎼", cond: (c, s) => c.attrs.passe >= 85 && s.assistPorJogo >= 0.35,
    cantico: (n) => `${n} rege o time, a torcida canta em coro!`, req: "Passe e assistências de sobra" },
  { id: "muralha", nome: "A Muralha", icone: "🧱", cond: (c) => ["ZAG", "GOL"].includes(c.posicao) && c.attrs.defesa >= 85,
    cantico: (n) => `Não passa! ${n} é muralha, não passa ninguém!`, req: "Defensor dominante" },
  { id: "furacao", nome: "O Furacão", icone: "🌪️", cond: (c) => c.attrs.velocidade >= 88 && c.attrs.drible >= 82,
    cantico: (n) => `Corre, ${n}! Ninguém segura o furacão!`, req: "Velocidade e drible" },
  { id: "capitao", nome: "O Capitão", icone: "🎖️", cond: (c) => c.selecao?.capitao || (c.elencoMoral ?? 0) >= 80,
    cantico: (n) => `${n} na frente, que a gente vai atrás!`, req: "Liderança reconhecida" },
  { id: "carrasco", nome: "O Carrasco", icone: "😈", cond: (c) => (c.golsEmClassicos || 0) >= 8,
    cantico: (n) => `${n}, ${n}! Pesadelo do rival!`, req: "Muitos gols em clássicos" },
  { id: "eterno", nome: "O Eterno", icone: "♾️", cond: (c) => Object.values(c.statsPorClube || {}).some((x) => (x.temporadas || 0) >= 7),
    cantico: (n) => `${n} é dessa casa, é sangue do nosso sangue!`, req: "Sete temporadas no mesmo clube" },
  { id: "artilheiro", nome: "O Artilheiro", icone: "🎯", cond: (c) => (c.gols || 0) >= 150,
    cantico: (n) => `Bola no pé do ${n} é gol, pode confiar!`, req: "150 gols na carreira" },
  { id: "joia", nome: "A Joia", icone: "💎", cond: (c) => c.idade <= 21 && c.picoOvr >= 80,
    cantico: (n) => `Olha a joia! ${n} é o futuro chegando!`, req: "Jovem que já brilha" },
  { id: "guerreiro", nome: "O Guerreiro", icone: "⚔️", cond: (c) => (c.lesoesHistorico || []).length >= 3 && (c.titulos || 0) >= 2,
    cantico: (n) => `${n} joga machucado, ${n} é raça!`, req: "Superou lesões e ganhou títulos" },
];

/* Critérios pra uma partida virar "jogo memorável" */
export const CRITERIOS_MEMORAVEL = [
  { id: "hattrick", label: "Hat-trick", icone: "⚽⚽⚽", teste: (j) => (j.golsMinha || 0) >= 3, peso: 3 },
  { id: "showTotal", label: "Atuação de gala", icone: "⭐", teste: (j) => (j.nota || 0) >= 8.8, peso: 3 },
  { id: "decisivoClassico", label: "Decidiu o clássico", icone: "⚔️", teste: (j) => j.classico && (j.golsMinha || 0) >= 1 && j.resultado === "V", peso: 3 },
  { id: "duploGol", label: "Dois gols", icone: "⚽⚽", teste: (j) => (j.golsMinha || 0) === 2, peso: 2 },
  { id: "golEAssist", label: "Gol e assistência", icone: "🎯", teste: (j) => (j.golsMinha || 0) >= 1 && (j.assistMinha || 0) >= 1, peso: 2 },
  { id: "viradaFora", label: "Vitória fora contra time forte", icone: "✈️", teste: (j) => j.casa === false && j.resultado === "V" && (j.adversarioForca || 0) >= 84, peso: 2 },
  { id: "paredao", label: "Jogo sem sofrer gol", icone: "🧤", teste: (j) => j.golsAdv === 0 && (j.nota || 0) >= 7.8, peso: 1 },
];

/* ===================== PREPARAÇÃO DE SEMANA =====================
   Entre uma rodada e outra existe uma semana. O que você faz com ela muda
   o próximo jogo — e o custo aparece no corpo ou na conta. */
export const PREPARACOES_SEMANA = [
  { id: "descanso", nome: "Poupar e descansar", icone: "😴", cor: "#3b82f6",
    desc: "Semana leve, foco em recuperar. Volta inteiro, mas sem afiar nada.",
    energia: 12, desgaste: -0.25, efeito: { golMult: 0.95, cartaoMult: 0.85 } },
  { id: "finalizacao", nome: "Treinar finalização", icone: "🎯", cor: "#12A876",
    desc: "Tarde inteira batendo pro gol. Cansa, mas o pé fica calibrado.",
    energia: -8, desgaste: 0.15, efeito: { golMult: 1.28 } },
  { id: "estudar", nome: "Estudar o adversário", icone: "🔍", cor: "#a855f7",
    desc: "Vídeo, reunião, mapa de calor. Você entra sabendo onde o espaço vai abrir.",
    energia: -3, desgaste: 0, efeito: { notaBonus: 0.25, assistMult: 1.2, cartaoMult: 0.8 } },
  { id: "fisico", nome: "Trabalho físico pesado", icone: "💪", cor: "#D6483F",
    desc: "Academia e campo no limite. Cobra caro agora, rende no longo prazo.",
    energia: -15, desgaste: 0.35, efeito: { golMult: 1.1 }, ganhoFisico: true },
  { id: "imagem", nome: "Compromissos de imagem", icone: "📸", cor: "#EC4899",
    desc: "Gravação, entrevista, ação de patrocinador. Rende dinheiro e fama, atrapalha o foco.",
    energia: -6, desgaste: 0.1, efeito: { notaBonus: -0.15 }, fama: 2, dinheiro: true },
];

/* ===================== METAS DA DIRETORIA POR COMPETIÇÃO =====================
   A diretoria não cobra "uma temporada boa": cobra coisas diferentes em cada torneio. */
export const METAS_COMPETICAO = {
  liga: [
    { id: "titulo", texto: "ser campeão da liga", checa: (card) => !!card.campeaoLiga, dificuldade: 3, bonus: 380 },
    { id: "g4", texto: "terminar entre os 4 primeiros", checa: (card) => (card.posLiga ?? 20) <= 4, dificuldade: 2, bonus: 200 },
    { id: "fugirZ4", texto: "escapar do rebaixamento com folga", checa: (card) => (card.posLiga ?? 20) <= 14, dificuldade: 1, bonus: 90 },
  ],
  copa: [
    { id: "titulo", texto: "levantar a copa nacional", checa: (card) => !!card.copaNacional?.titulo, dificuldade: 3, bonus: 300 },
    { id: "semi", texto: "chegar às semifinais da copa", checa: (card) => !!card.copaNacional, dificuldade: 2, bonus: 150 },
    { id: "fasesIniciais", texto: "não cair logo de cara na copa", checa: (card) => !!card.copaNacional || !!card.copaNacionalPendente, dificuldade: 1, bonus: 70 },
  ],
  continental: [
    { id: "titulo", texto: "conquistar o torneio continental", checa: (card) => !!card.continental?.titulo, dificuldade: 3, bonus: 450 },
    { id: "fase", texto: "avançar longe no continental", checa: (card) => !!card.continental, dificuldade: 2, bonus: 220 },
    { id: "participar", texto: "fazer boa figura no continental", checa: (card) => !!card.continental || !!card.continentalPendente, dificuldade: 1, bonus: 100 },
  ],
};

export const CATEGORIAS_INFLACAO_SALARIAL = ["Joias", "Luxo", "Ações Sociais"];

export const EMPRESARIOS = [
  {
    id: "iniciante", nome: "Empresário iniciante", icone: "🧳", cor: "#71717a",
    custo: 0, comissao: 0.02, temporadas: 3,
    desc: "Um amigo da família cuidando da sua carreira. Barato, mas com pouca porta aberta.",
    nOfertas: 2, alcance: 8, salarioMult: 0.95, anosBonus: 0, multaMult: 1,
    resumo: "2 propostas · alcance curto · sem custo",
  },
  {
    id: "agressivo", nome: "Empresário agressivo", icone: "🦈", cor: "#D6483F",
    custo: 220, comissao: 0.1, temporadas: 4,
    desc: "Vive cavando transferência. Consegue clubes acima do seu nível, mas queima pontes: a diretoria e a torcida sentem o assédio constante.",
    nOfertas: 5, alcance: 20, salarioMult: 1.2, anosBonus: -1, multaMult: 0.7,
    efeitoAnual: (c) => { c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) - 4, 0, 100); },
    resumo: "5 propostas · alcance longo · salário alto, mas desgasta a diretoria",
  },
  {
    id: "cauteloso", nome: "Empresário cauteloso", icone: "🛡️", cor: "#3b82f6",
    custo: 150, comissao: 0.06, temporadas: 4,
    desc: "Prioriza estabilidade: menos propostas, mas contratos longos, multas altas e boa relação com quem manda no clube.",
    nOfertas: 3, alcance: 10, salarioMult: 1.05, anosBonus: 1, multaMult: 1.6,
    efeitoAnual: (c) => { c.relacaoDiretoria = clampR((c.relacaoDiretoria ?? 40) + 4, 0, 100); },
    resumo: "3 propostas · contratos longos e seguros",
  },
  {
    id: "midiatico", nome: "Empresário midiático", icone: "📸", cor: "#EC4899",
    custo: 190, comissao: 0.09, temporadas: 3,
    desc: "Vende sua imagem antes do seu futebol. Fama e patrocínios crescem, mas o vestiário desconfia de quem aparece demais.",
    nOfertas: 3, alcance: 14, salarioMult: 1.1, anosBonus: 0, multaMult: 1,
    efeitoAnual: (c) => { c.fama = clamp(c.fama + 6, 0, 100); c.elencoMoral = clampR((c.elencoMoral ?? 60) - 3, 0, 100); },
    resumo: "3 propostas · fama sobe todo ano",
  },
];

export const LIGAS_ESPECIALISTA = ["inglaterra", "espanha", "italia", "alemanha", "franca", "portugal"];

export const AFINIDADE_MERCADO = {
  BRA: { portugal: 1.45, espanha: 1.2, italia: 1.15, brasileirao: 1.3, serieB: 1.25, mls: 1.1, arabia: 1.1, inglaterra: 0.9, alemanha: 0.9 },
  ARG: { espanha: 1.4, italia: 1.35, portugal: 1.15, brasileirao: 1.1, mls: 1.15, inglaterra: 0.9, alemanha: 0.85 },
  POR: { portugal: 1.5, espanha: 1.25, inglaterra: 1.15, franca: 1.05 },
  ESP: { espanha: 1.5, italia: 1.1, inglaterra: 1.1, portugal: 1.1 },
  FRA: { franca: 1.5, inglaterra: 1.2, espanha: 1.1, italia: 1.1, alemanha: 1.05 },
  ENG: { inglaterra: 1.55, alemanha: 0.95, espanha: 0.9, italia: 0.85 },
  ALE: { alemanha: 1.5, inglaterra: 1.15, italia: 1.05, espanha: 1.05 },
  ITA: { italia: 1.5, espanha: 1.1, inglaterra: 1.05, franca: 1.05 },
};

export const TIPOS_LESAO = [
  { id: "muscular", nome: "Lesão muscular na coxa", regiao: "coxa", gravidade: 1, jogosFora: [3, 7], sequela: 0.04, atributo: "velocidade" },
  { id: "panturrilha", nome: "Estiramento na panturrilha", regiao: "panturrilha", gravidade: 1, jogosFora: [2, 6], sequela: 0.03, atributo: "velocidade" },
  { id: "tornozelo", nome: "Entorse de tornozelo", regiao: "tornozelo", gravidade: 2, jogosFora: [5, 12], sequela: 0.06, atributo: "drible" },
  { id: "posterior", nome: "Lesão no posterior da coxa", regiao: "coxa", gravidade: 2, jogosFora: [6, 14], sequela: 0.08, atributo: "velocidade" },
  { id: "pubalgia", nome: "Pubalgia", regiao: "quadril", gravidade: 2, jogosFora: [8, 16], sequela: 0.1, atributo: "fisico" },
  { id: "menisco", nome: "Lesão de menisco", regiao: "joelho", gravidade: 3, jogosFora: [14, 24], sequela: 0.14, atributo: "velocidade" },
  { id: "ombro", nome: "Luxação no ombro", regiao: "ombro", gravidade: 2, jogosFora: [6, 13], sequela: 0.05, atributo: "fisico" },
  { id: "fratura", nome: "Fratura no pé", regiao: "pé", gravidade: 3, jogosFora: [16, 28], sequela: 0.12, atributo: "finalizacao" },
  { id: "ligamento", nome: "Ruptura do ligamento cruzado", regiao: "joelho", gravidade: 4, jogosFora: [30, 44], sequela: 0.22, atributo: "velocidade" },
  { id: "aquiles", nome: "Ruptura do tendão de aquiles", regiao: "tornozelo", gravidade: 4, jogosFora: [32, 46], sequela: 0.2, atributo: "velocidade" },
];

export const ROTINAS_FISICAS = [
  { id: "preventiva", nome: "Rotina preventiva", icone: "🧊", cor: "#3b82f6",
    desc: "Fisioterapia, carga controlada e sono monitorado. Menos risco de lesão, um pouco menos de explosão.",
    riscoMult: 0.6, desgasteMult: 0.7, notaBonus: -0.08 },
  { id: "equilibrada", nome: "Rotina equilibrada", icone: "⚖️", cor: "#a1a1aa",
    desc: "O padrão do clube, sem exageros pra nenhum lado.",
    riscoMult: 1, desgasteMult: 1, notaBonus: 0 },
  { id: "intensa", nome: "Rotina intensa", icone: "🔥", cor: "#D6483F",
    desc: "Treino pesado e jogo no limite. Rende mais em campo, mas castiga o corpo.",
    riscoMult: 1.5, desgasteMult: 1.45, notaBonus: 0.12 },
];

export const CAMINHOS_POS_CARREIRA = [
  {
    id: "tecnico", nome: "Virar treinador", icone: "🧑‍💼", cor: "#D8B44A",
    desc: "Assumir um banco e tentar repetir do lado de fora o que você fez em campo.",
    requisito: (c, t) => (c.tecnicoConfianca ?? 60) >= 55 || t.length >= 8,
    textoRequisito: "Boa relação com comissões técnicas ou carreira longa",
    epilogo: (c, t) => {
      const grande = c.titulos >= 6 || c.bolasDeOuro >= 1;
      return grande
        ? `Você começou num clube grande, cobrado desde o primeiro dia por ser quem é. A transição foi dura, mas o vestiário te respeita: jogador nenhum discute com quem levantou ${c.titulos} taças.`
        : `Você começou por baixo, num clube modesto, aprendendo o ofício. Poucos ex-jogadores têm paciência pra isso — você teve.`;
    },
  },
  {
    id: "auxiliar", nome: "Auxiliar técnico", icone: "📋", cor: "#3b82f6",
    desc: "Ficar no futebol sem o peso do cargo principal, ajudando a formar o próximo craque.",
    requisito: () => true, textoRequisito: "Aberto a todos",
    epilogo: (c) => `Você virou a ponte entre a comissão e o elenco — o cara que os garotos procuram quando a coisa aperta. O ${c.clube.nome} te queria por perto, e você ficou.`,
  },
  {
    id: "embaixador", nome: "Embaixador do clube", icone: "🎖️", cor: "#12A876",
    desc: "Ser o rosto eterno do clube onde você virou ídolo.",
    requisito: (c) => Math.max(0, ...Object.values(c.torcidaPorClube || { x: 0 })) >= 70,
    textoRequisito: "Ser ídolo da torcida de algum clube",
    epilogo: (c) => {
      const clube = Object.entries(c.torcidaPorClube || {}).sort((a, b) => b[1] - a[1])[0];
      return `Seu nome virou parte do ${clube ? clube[0] : "clube"}. Você recebe visitantes, abre o museu, aparece nas finais e vê a arquibancada cantar seu nome muito depois de você ter parado de jogar.`;
    },
  },
  {
    id: "comentarista", nome: "Comentarista de TV", icone: "🎙️", cor: "#EC4899",
    desc: "Trocar o gramado pelo estúdio e viver de opinião.",
    requisito: (c) => (c.fama ?? 0) >= 55,
    textoRequisito: "Fama alta (55+)",
    epilogo: (c) => `Com ${Math.round(c.fama)} de fama acumulada, sua cara já era conhecida do país inteiro. Agora sua voz também é: você analisa os jogos de domingo e opina sobre a nova geração — que às vezes é comparada a você.`,
  },
  {
    id: "dirigente", nome: "Dirigente de futebol", icone: "🏛️", cor: "#a855f7",
    desc: "Ir pro outro lado da mesa e montar elencos.",
    requisito: (c) => (c.relacaoDiretoria ?? 40) >= 55 || (c.cofre ?? 0) >= 400,
    textoRequisito: "Boa relação com a diretoria ou patrimônio sólido",
    epilogo: (c) => `Você conhece o jogo dos dois lados: já foi o atleta que pediu aumento e agora é quem diz não. Poucos entendem de contrato e vestiário como quem viveu os dois.`,
  },
  {
    id: "empresario", nome: "Empresário de jogadores", icone: "💼", cor: "#f59e0b",
    desc: "Cuidar da carreira de quem está começando, do jeito que você gostaria que cuidassem da sua.",
    requisito: (c) => (c.cofre ?? 0) >= 250,
    textoRequisito: "Patrimônio de ao menos $250",
    epilogo: (c) => `Você monta uma agência e passa a proteger garotos de 16 anos das armadilhas que quase te pegaram. Seu primeiro cliente lembra muito você naquela peneira.`,
  },
  {
    id: "afastar", nome: "Sumir do futebol", icone: "🌅", cor: "#71717a",
    desc: "Fechar a porta, cuidar da família e viver do que construiu.",
    requisito: () => true, textoRequisito: "Aberto a todos",
    epilogo: (c) => `Você desapareceu dos holofotes por escolha própria. Com $${formatarDinheiro(c.cofre)} guardados, não devia nada a ninguém. De vez em quando alguém pergunta por você — e a resposta é sempre que você está bem, longe de tudo isso.`,
  },
];

export const TIPOS_MARCO = {
  estreia: { icone: "👟", cor: "#3b82f6", label: "Estreia" },
  primeiroGol: { icone: "⚽", cor: "#12A876", label: "Primeiro gol" },
  golRedondo: { icone: "🎯", cor: "#12A876", label: "Marca de gols" },
  titulo: { icone: "🏆", cor: "#D8B44A", label: "Título" },
  premio: { icone: "🥇", cor: "#D8B44A", label: "Prêmio individual" },
  selecao: { icone: "🌎", cor: "#22D3EE", label: "Seleção" },
  transferencia: { icone: "✈️", cor: "#a855f7", label: "Transferência" },
  recorde: { icone: "📜", cor: "#EC4899", label: "Recorde" },
  lesao: { icone: "🩹", cor: "#D6483F", label: "Lesão grave" },
  aposentadoria: { icone: "🌅", cor: "#71717a", label: "Fim de carreira" },
};

export const PESO_OSTENTACAO = { Joias: 3.2, Garagem: 2.4, Luxo: 3.6, "Imóveis": 1.5, "Ações Sociais": -2.5, Staff: 0.3, "Estrutura do Clube": -1 };

export const EFEITO_FISICO_BENS = { casaCT: -0.35, academiaParticular: -0.3, coberturaLuxo: 0.2, iate: 0.25, boate: 0.4 };

export const FORMACAO_433 = ["GOL", "LD", "ZAG", "ZAG", "LE", "VOL", "MC", "MEI", "PD", "ATA", "PE"];

export const ESTILOS_TECNICO = [
  { id: "ofensivo", nome: "Ofensivo", icone: "⚔️", cor: "#D6483F", valoriza: ["finalizacao", "drible", "velocidade"],
    fala: "Quero o time no campo do adversário. Se tomar 3, a gente faz 4.", bonusAtaque: 0.06, bonusDefesa: -0.03 },
  { id: "defensivo", nome: "Defensivo", icone: "🛡️", cor: "#3b82f6", valoriza: ["defesa", "fisico"],
    fala: "Time organizado sofre pouco. Primeiro não levar, depois pensar em fazer.", bonusAtaque: -0.04, bonusDefesa: 0.07 },
  { id: "posse", nome: "Jogo de posse", icone: "🎯", cor: "#12A876", valoriza: ["passe", "drible"],
    fala: "A bola tem que circular. Quem tem a bola manda no jogo.", bonusAtaque: 0.03, bonusDefesa: 0.02 },
  { id: "intenso", nome: "Pressão alta", icone: "🔥", cor: "#f59e0b", valoriza: ["fisico", "velocidade"],
    fala: "Correr mais que o adversário. Quem cansar primeiro perde.", bonusAtaque: 0.04, bonusDefesa: 0.03, desgasteExtra: 0.25 },
  { id: "equilibrado", nome: "Equilibrado", icone: "⚖️", cor: "#a1a1aa", valoriza: ["passe", "defesa", "finalizacao"],
    fala: "Sem invenção: fazer o simples bem feito ganha campeonato.", bonusAtaque: 0, bonusDefesa: 0.02 },
];

export const SOBRENOMES_TECNICO = ["Ferreira", "Mendes", "Sampaio", "Aguirre", "Bianchi", "Klopfer", "Vidal", "Machado", "Otero", "Salgado", "Ramírez", "Duarte", "Pellegrini", "Fontana", "Nunes"];

export const COMPETICOES_SELECAO = {
  copa: { id: "copa", nome: "Copa do Mundo", icone: "🌎", cor: "#D8B44A", jogosBase: 7, peso: 3 },
  continental: { id: "continental", nome: null, icone: "🏅", cor: "#12A876", jogosBase: 6, peso: 2 },
  eliminatorias: { id: "eliminatorias", nome: "Eliminatórias", icone: "🎫", cor: "#3b82f6", jogosBase: 8, peso: 1 },
  amistosos: { id: "amistosos", nome: "Amistosos e preparação", icone: "🤝", cor: "#71717a", jogosBase: 4, peso: 0 },
};

export const TIPOS_NOTICIA = {
  destaque: { icone: "⭐", cor: "#D8B44A", label: "Destaque" },
  titulo: { icone: "🏆", cor: "#D8B44A", label: "Título" },
  premio: { icone: "🥇", cor: "#D8B44A", label: "Prêmio" },
  mercado: { icone: "💰", cor: "#12A876", label: "Mercado" },
  tecnico: { icone: "🧑‍💼", cor: "#f59e0b", label: "Comissão técnica" },
  selecao: { icone: "🌎", cor: "#22D3EE", label: "Seleção" },
  lesao: { icone: "🩹", cor: "#D6483F", label: "Departamento médico" },
  recorde: { icone: "📜", cor: "#EC4899", label: "Recorde" },
  mundo: { icone: "🌍", cor: "#a855f7", label: "Mundo do futebol" },
  clube: { icone: "🏟️", cor: "#3b82f6", label: "Clube" },
  critica: { icone: "📰", cor: "#D6483F", label: "Imprensa" },
};

export const TIPOS_RELACAO = {
  parceiro: {
    id: "parceiro", nome: "Parceria em campo", icone: "🤝", cor: "#12A876",
    desc: (r) => `Você e ${r.nome} se acham de olhos fechados. Quanto maior a sintonia, mais jogadas nascem entre vocês.`,
  },
  pupilo: {
    id: "pupilo", nome: "Apadrinhado", icone: "🌱", cor: "#3b82f6",
    desc: (r) => `${r.nome} é o garoto que você pegou pra cuidar. O que ele virar tem um pouco de você.`,
  },
  desafeto: {
    id: "desafeto", nome: "Desafeto no vestiário", icone: "⚡", cor: "#D6483F",
    desc: (r) => `Você e ${r.nome} não se bicam. O clima pesa quando vocês dividem o mesmo vestiário.`,
  },
};

export const NOMES_MUNDO = {
  BRA: { pri: ["Gabriel", "Lucas", "Matheus", "Rafael", "Bruno", "Thiago", "Vinícius", "Caio", "Wesley", "Danilo", "Igor", "Léo", "Murilo", "Kaio", "Éder"], sob: ["Silva", "Souza", "Ferreira", "Almeida", "Ribeiro", "Barbosa", "Nogueira", "Vasconcelos", "Andrade", "Moura", "Teixeira", "Rocha"] },
  ARG: { pri: ["Matías", "Julián", "Facundo", "Nicolás", "Agustín", "Lautaro", "Tomás", "Emiliano", "Santiago", "Joaquín"], sob: ["González", "Rodríguez", "Fernández", "López", "Martínez", "Romero", "Álvarez", "Sosa", "Benítez", "Ibarra"] },
  ESP: { pri: ["Pablo", "Álvaro", "Sergio", "Marcos", "Iker", "Dani", "Hugo", "Adrián", "Javier", "Rubén"], sob: ["García", "Hernández", "Ruiz", "Moreno", "Navarro", "Ortega", "Serrano", "Castillo", "Iglesias", "Vidal"] },
  FRA: { pri: ["Lucas", "Enzo", "Théo", "Nathan", "Malo", "Ibrahim", "Yanis", "Rayan", "Ousmane", "Clément"], sob: ["Dubois", "Laurent", "Moreau", "Lefèvre", "Girard", "Bonnet", "Traoré", "Diallo", "Perrin", "Faure"] },
  ENG: { pri: ["Jack", "Harry", "Oliver", "Charlie", "Alfie", "Reece", "Callum", "Mason", "Kai", "Declan"], sob: ["Walker", "Hughes", "Bennett", "Fletcher", "Hayes", "Cole", "Turner", "Whitfield", "Ashcroft", "Doyle"] },
  ALE: { pri: ["Leon", "Jonas", "Felix", "Luca", "Noah", "Elias", "Maximilian", "Tim", "Nico", "Jannik"], sob: ["Müller", "Schmidt", "Weber", "Wagner", "Becker", "Hoffmann", "Krüger", "Neumann", "Brandt", "Lang"] },
  ITA: { pri: ["Matteo", "Lorenzo", "Andrea", "Davide", "Simone", "Nicolò", "Gianluca", "Federico", "Riccardo", "Alessio"], sob: ["Rossi", "Conti", "Greco", "Bruno", "Marchetti", "Gallo", "Ferrari", "Costa", "Rinaldi", "Villa"] },
  POR: { pri: ["Diogo", "Tomás", "Rúben", "Gonçalo", "Afonso", "Rodrigo", "Duarte", "Vasco", "Nuno", "Bernardo"], sob: ["Ferreira", "Cardoso", "Pinto", "Machado", "Coelho", "Antunes", "Faria", "Matos", "Neves", "Correia"] },
};

export const NACS_MUNDO = ["BRA", "ARG", "ESP", "FRA", "ENG", "ALE", "ITA", "POR"];

export const EVENTOS_CLUBE = [
  { txt: "Patrocinador master investiu pesado na base do clube", delta: 3, positivo: true },
  { txt: "Diretoria reformou o centro de treinamento", delta: 2, positivo: true },
  { txt: "Clube vendeu bem na base e reinvestiu na estrutura", delta: 2, positivo: true },
  { txt: "Torcida organizou um mutirão e o clube ganhou moral", delta: 1, positivo: true },
  { txt: "Crise financeira na diretoria — o clube vendeu peças importantes do elenco", delta: -4, positivo: false },
  { txt: "Escândalo de gestão abalou a confiança dos patrocinadores", delta: -3, positivo: false },
  { txt: "Departamento médico do clube foi sucateado por falta de verba", delta: -2, positivo: false },
  { txt: "Concorrência local roubou o principal patrocinador do clube", delta: -2, positivo: false },
];

export const CATEGORIAS_HISTORICO = [
  { id: "todos", label: "Todos" },
  { id: "titulos", label: "🏆 Títulos" },
  { id: "confrontos", label: "⚔️ Confrontos" },
  { id: "transferencias", label: "🔁 Transferências" },
  { id: "lesoes", label: "🩹 Lesões" },
  { id: "social", label: "📱 Social" },
  { id: "clube", label: "🏛️ Clube" },
];

export const DECISOES_JOGO = [
  { titulo: "Pênalti decisivo", texto: "Final da temporada, últimos minutos. Pênalti a favor. Você assume?", mira: "penalti" },
  { titulo: "Falta na entrada da área", texto: "Fim de jogo decisivo, falta na entrada da área bem na medida. Você mesmo cobra.", mira: "falta" },
  { titulo: "Contra-ataque nos acréscimos", texto: "Contra-ataque decisivo nos acréscimos — você tem a bola e companheiros em posição, mas a defesa adversária tenta fechar o passe.", mira: "passe" },
  { titulo: "Falta perigosa", texto: "Falta na entrada da área em jogo grande. Você bate ou toca pro companheiro?", opts: [
    { label: "Bater a falta", risco: true, seAcerta: { fama: 6, torcida: 8, gols: 1, txt: "GOLAÇO de falta! A torcida enlouquece." }, seErra: { fama: -1, torcida: -2, txt: "A bola bate na barreira." } },
    { label: "Tocar pro companheiro", efeito: { torcida: 1, txt: "Jogada trabalhada, sem perigo real." } },
  ]},
  { titulo: "Gol importante!", texto: "Você marcou um gol decisivo num clássico. Como comemora?", opts: [
    { label: "Correr pra abraçar a torcida", efeito: { fama: 4, torcida: 10, txt: "A torcida te carrega nos braços — momento eterno." } },
    { label: "Comemoração contida e profissional", efeito: { fama: 1, torcida: 3, txt: "Respeito e classe." } },
    { label: "Provocar a torcida adversária", efeito: { fama: 7, torcida: 6, txt: "Virou meme nacional — amado por uns, odiado por outros." } },
  ]},
  { titulo: "Chance clara de gol", texto: "Você recebe na entrada da área com dois marcadores. O que faz?", opts: [
    { label: "Arriscar o drible e chutar", risco: true, seAcerta: { fama: 4, torcida: 6, gols: 1, txt: "Driblou e mandou pra rede! Que jogada." }, seErra: { torcida: -3, txt: "Perdeu a bola no drible." } },
    { label: "Tocar pro companheiro melhor posicionado", efeito: { assist: 1, torcida: 3, txt: "Assistência de primeira, gol do companheiro!" } },
  ]},
  { titulo: "Provocação da imprensa", texto: "Um jornalista provoca você antes de um jogo decisivo. Como responde?", opts: [
    { label: "Provocar de volta com confiança", efeito: { fama: 5, torcida: 4, txt: "Manchete garantida — a torcida amou a atitude." } },
    { label: "Resposta diplomática", efeito: { fama: 1, torcida: 1, txt: "Respeito e foco no jogo." } },
  ]},
  { titulo: "Convite chamativo", texto: "Um convite pra uma festa badalada surge na semana de um jogo decisivo.", opts: [
    { label: "Recusar e focar", efeito: { torcida: 2, txt: "Sua dedicação não passa despercebida." } },
    { label: "Aceitar o convite", risco: true, seAcerta: { fama: 5, txt: "Apareceu nas redes, mas rendeu bem em campo mesmo assim." }, seErra: { torcida: -4, fama: 2, txt: "Rendeu mal no jogo seguinte — a imprensa cobrou." } },
  ]},
  { titulo: "Causa social", texto: "Uma ONG te convida pra ser embaixador de uma causa.", opts: [
    { label: "Aceitar e se envolver", efeito: { fama: 5, torcida: 6, txt: "Imagem pública em alta — a torcida valoriza o gesto." } },
    { label: "Recusar, sem tempo agora", efeito: { txt: "Você prefere manter o foco só no futebol." } },
  ]},
  { titulo: "Rivalidade no vestiário", texto: "Um companheiro disputa sua posição e provoca você nos treinos.", opts: [
    { label: "Responder no campo, calado", efeito: { torcida: 3, txt: "Seu desempenho fala mais alto que qualquer provocação." } },
    { label: "Confrontar publicamente", risco: true, seAcerta: { fama: 4, txt: "Você se impôs e ganhou respeito do grupo." }, seErra: { torcida: -5, txt: "Criou clima ruim no vestiário." } },
  ]},
  { titulo: "Cartão debatido", texto: "Você recebe um cartão que considera injusto. Reage?", opts: [
    { label: "Reclamar com o árbitro", risco: true, seAcerta: { fama: 2, txt: "Reclamação enérgica, mas sem punição extra." }, seErra: { torcida: -3, fama: -2, txt: "Recebeu o segundo amarelo e foi expulso!" } },
    { label: "Manter a calma", efeito: { torcida: 1, txt: "Postura profissional elogiada." } },
  ]},
  { titulo: "Capa de revista", texto: "Uma revista esportiva quer você na capa da edição especial.", opts: [
    { label: "Topar o ensaio", efeito: { fama: 6, txt: "Capa estampada em bancas — repercussão nacional." } },
    { label: "Preferir discrição", efeito: { torcida: 2, txt: "Torcida valoriza o perfil discreto." } },
  ]},
  { titulo: "Pressão da diretoria", texto: "A diretoria cobra resultados imediatos depois de resultados irregulares.", opts: [
    { label: "Assumir o discurso publicamente", risco: true, seAcerta: { fama: 3, torcida: 5, txt: "Discurso confiante caiu bem." }, seErra: { torcida: -4, txt: "Cobrou demais de si e o resultado não veio." } },
    { label: "Deixar o técnico se posicionar", efeito: { txt: "Você prefere deixar a cobrança com a comissão técnica." } },
  ]},
  { titulo: "Provocação nas redes sociais", texto: "Um torcedor rival viraliza provocando você antes do clássico.", opts: [
    { label: "Responder com humor", efeito: { fama: 4, torcida: 3, txt: "Resposta espirituosa rende memes positivos." } },
    { label: "Ignorar", efeito: { torcida: 1, txt: "Manteve o perfil profissional." } },
  ]},
  { titulo: "Convite para seleção sub-23 / amistoso", texto: "Você recebe um convite inesperado para representar o país num amistoso.", opts: [
    { label: "Aceitar o convite", risco: true, seAcerta: { fama: 5, txt: "Boa atuação amplia sua vitrine internacional." }, seErra: { fama: 1, txt: "Atuação discreta, sem grandes repercussões." } },
    { label: "Priorizar descanso pelo clube", efeito: { forma: 2, txt: "Chegou mais fresco pro returno." } },
  ]},
  { titulo: "Reencontro com clube antigo", texto: "Você enfrenta um clube em que já defendeu as cores.", opts: [
    { label: "Comemorar gol com discrição", efeito: { torcida: 2, txt: "Gesto de respeito bem recebido dos dois lados." } },
    { label: "Comemorar efusivamente", efeito: { fama: 3, txt: "Comemoração deu o que falar na imprensa." } },
  ]},
];

export const OFERTAS_PATROCINIO = [
  { marca: "Rasteira Sports", texto: "A Rasteira Sports quer estampar seu nome numa linha de chuteiras.", valorMult: 1, perfil: "neutro" },
  { marca: "Trivela Bebidas", texto: "A Trivela Bebidas oferece contrato de imagem por uma temporada.", valorMult: 1.2, perfil: "neutro" },
  { marca: "Golaço Wear", texto: "A Golaço Wear quer você como garoto-propaganda da nova coleção.", valorMult: 0.9, perfil: "neutro" },
  { marca: "Impacto Esportes", texto: "A Impacto Esportes propõe uma parceria de longo prazo.", valorMult: 1.4, perfil: "neutro" },
  { marca: "Aurum Watches", texto: "A Aurum Watches, marca de relógios de luxo, quer você no comercial internacional.", valorMult: 2.2, perfil: "luxo", minOstentacao: 45 },
  { marca: "Velluto Moda", texto: "A grife italiana Velluto quer seu rosto na campanha de alto padrão.", valorMult: 1.9, perfil: "luxo", minOstentacao: 55 },
  { marca: "Raiz Alimentos", texto: "A Raiz Alimentos busca um atleta de imagem familiar pra campanha do café da manhã.", valorMult: 1.3, perfil: "familia", maxOstentacao: 40, maxCalorMidia: 55 },
  { marca: "Instituto Vida", texto: "O Instituto Vida quer um embaixador de projeto social — cachê menor, imagem impecável.", valorMult: 0.8, perfil: "familia", maxOstentacao: 35, bonusTorcida: 8 },
];

export const LOJA_ITENS = [
  // GARAGEM
  { id: "bike", nome: "Bicicleta", custo: 3, manutencao: 0, categoria: "Garagem", icone: "🚲" },
  { id: "moto", nome: "Moto esportiva", custo: 25, manutencao: 1, categoria: "Garagem", icone: "🏍️" },
  { id: "carroPopular", nome: "Carro popular", custo: 15, manutencao: 1, categoria: "Garagem", icone: "🚗" },
  { id: "carroEsportivo", nome: "Carro esportivo", custo: 60, manutencao: 3, categoria: "Garagem", icone: "🏎️" },
  { id: "carroLuxo", nome: "Carro de luxo", custo: 220, manutencao: 8, categoria: "Garagem", icone: "🚘", fama: 4 },
  { id: "jetski", nome: "Jet ski", custo: 40, manutencao: 2, categoria: "Garagem", icone: "🛥️" },
  { id: "barco", nome: "Lancha", custo: 180, manutencao: 9, categoria: "Garagem", icone: "⛵", fama: 3 },
  { id: "iate", nome: "Iate", custo: 900, manutencao: 30, categoria: "Garagem", icone: "🛳️", fama: 8 },
  { id: "jatinho", nome: "Jato particular", custo: 2500, manutencao: 60, categoria: "Garagem", icone: "🛩️", fama: 15 },
  // IMÓVEIS
  { id: "apartamento", nome: "Apartamento na cidade", custo: 80, manutencao: 3, categoria: "Imóveis", icone: "🏢" },
  { id: "casaCT", nome: "Casa ao lado do CT", custo: 140, manutencao: 4, categoria: "Imóveis", icone: "🏠", desc: "Menos trânsito, mais sono: reduz o desgaste físico todo ano.", efeitoFisico: -0.35 },
  { id: "academiaParticular", nome: "Academia em casa", custo: 95, manutencao: 4, categoria: "Imóveis", icone: "🏋️‍♂️", desc: "Recuperação no seu ritmo — reduz o desgaste acumulado.", efeitoFisico: -0.3 },
  { id: "casa", nome: "Casa em condomínio fechado", custo: 200, manutencao: 6, categoria: "Imóveis", icone: "🏡" },
  { id: "coberturaLuxo", nome: "Cobertura com vista pro mar", custo: 380, manutencao: 12, categoria: "Imóveis", icone: "🌇", fama: 5, desc: "Endereço de estrela — muita fama, e uma agenda social que cansa.", efeitoFisico: 0.2 },
  { id: "mansao", nome: "Mansão", custo: 550, manutencao: 15, categoria: "Imóveis", icone: "🏰", fama: 6 },
  { id: "terreno", nome: "Terreno de investimento", custo: 120, manutencao: 1, categoria: "Imóveis", icone: "🌳" },
  { id: "shopping", nome: "Participação num shopping", custo: 800, manutencao: 10, categoria: "Imóveis", icone: "🏬", comercial: true },
  { id: "predioComercial", nome: "Prédio comercial alugado", custo: 400, manutencao: 5, categoria: "Imóveis", icone: "🏙️", comercial: true },
  // JOIAS
  { id: "relogio", nome: "Relógio de grife", custo: 30, manutencao: 0, categoria: "Joias", icone: "⌚", fama: 2 },
  { id: "anel", nome: "Anel de diamante", custo: 45, manutencao: 0, categoria: "Joias", icone: "💍", fama: 2 },
  { id: "corrente", nome: "Corrente de ouro", custo: 20, manutencao: 0, categoria: "Joias", icone: "📿", fama: 1 },
  { id: "brincos", nome: "Brincos de diamante", custo: 35, manutencao: 0, categoria: "Joias", icone: "💎", fama: 1 },
  // LUXO
  { id: "quadro", nome: "Quadro de arte raro", custo: 90, manutencao: 1, categoria: "Luxo", icone: "🖼️", fama: 2 },
  { id: "roupas", nome: "Guarda-roupa de grife", custo: 25, manutencao: 1, categoria: "Luxo", icone: "👔", fama: 2 },
  { id: "adega", nome: "Adega climatizada", custo: 50, manutencao: 2, categoria: "Luxo", icone: "🍷" },
  { id: "iate", nome: "Iate", custo: 620, manutencao: 22, categoria: "Luxo", icone: "🛳️", fama: 8, desc: "Símbolo máximo de status — e temporadas de férias que o preparador não aprova.", efeitoFisico: 0.25 },
  { id: "boate", nome: "Sociedade numa boate", custo: 300, manutencao: 9, categoria: "Luxo", icone: "🪩", fama: 7, comercial: true, desc: "Dá lucro e visibilidade, mas te coloca na noite — desgaste e olhares tortos no clube.", efeitoFisico: 0.4 },
  { id: "chuteiraElite", nome: "Chuteira de elite personalizada", custo: 140, manutencao: 0, categoria: "Luxo", icone: "👟", desc: "+1 de finalização permanente.", bonusAttr: { id: "finalizacao", valor: 1 } },
  { id: "foneGrife", nome: "Fone de ouvido de grife (foco pré-jogo)", custo: 70, manutencao: 0, categoria: "Luxo", icone: "🎧", desc: "+1 de passe permanente (foco tático apurado).", bonusAttr: { id: "passe", valor: 1 } },
  { id: "luvaCustom", nome: "Luvas de treino sob medida", custo: 60, manutencao: 0, categoria: "Luxo", icone: "🧤", desc: "+1 de físico permanente.", bonusAttr: { id: "fisico", valor: 1 } },
  // ESTRUTURA DO CLUBE (investe seu próprio dinheiro no clube atual — aumenta a força do time em campo; pode vender depois pra reduzir)
  { id: "travesRedes", nome: "Traves e redes novas", custo: 15, manutencao: 0, categoria: "Estrutura do Clube", icone: "🥅", desc: "Pequena melhoria de estrutura do estádio.", forcaClube: 1 },
  { id: "kitBolas", nome: "Kit de bolas profissionais", custo: 20, manutencao: 1, categoria: "Estrutura do Clube", icone: "⚽", desc: "Bolas de treino e jogo de padrão internacional.", forcaClube: 1 },
  { id: "equipTreino", nome: "Equipamentos de treino modernos", custo: 60, manutencao: 2, categoria: "Estrutura do Clube", icone: "🏋️‍♂️", desc: "Melhora a preparação física de todo o elenco.", forcaClube: 2 },
  { id: "reformaGramado", nome: "Reforma do gramado", custo: 90, manutencao: 2, categoria: "Estrutura do Clube", icone: "🌱", desc: "Gramado impecável, menos lesões e mais qualidade de jogo.", forcaClube: 2 },
  { id: "transporteElenco", nome: "Ônibus e voos fretados", custo: 130, manutencao: 4, categoria: "Estrutura do Clube", icone: "✈️", desc: "Conforto de viagem pro elenco inteiro.", forcaClube: 2 },
  { id: "alaMedica", nome: "Ala médica reforçada", custo: 180, manutencao: 5, categoria: "Estrutura do Clube", icone: "🏥", desc: "Departamento médico de ponta pro clube todo.", forcaClube: 3 },
  { id: "analiseDados", nome: "Departamento de análise de dados", custo: 220, manutencao: 5, categoria: "Estrutura do Clube", icone: "📊", desc: "Scout e análise tática de alto nível.", forcaClube: 4 },
  { id: "ctPonta", nome: "Centro de treinamento de ponta", custo: 300, manutencao: 8, categoria: "Estrutura do Clube", icone: "🏟️", desc: "O maior investimento estrutural que um jogador pode bancar sozinho.", forcaClube: 5 },
  // EQUIPE & ESTILO DE VIDA (contratos temporários — vencem e cobram manutenção anual; precisa renovar)
  { id: "personalTrainer", nome: "Personal trainer", custo: 100, manutencao: 6, duracaoTemporadas: 3, categoria: "Staff", icone: "🏋️", desc: "Reduz o desgaste acumulado a cada temporada. Contrato de 3 temporadas.", tipo: "staff" },
  { id: "nutricionista", nome: "Nutricionista particular", custo: 70, manutencao: 4, duracaoTemporadas: 3, categoria: "Staff", icone: "🥗", desc: "Melhora sua forma física base todo ano. Contrato de 3 temporadas.", tipo: "staff" },
  { id: "empresarioTop", nome: "Empresário renomado", custo: 250, manutencao: 15, duracaoTemporadas: 4, categoria: "Staff", icone: "🤝", desc: "Amplia o leque de clubes nas buscas de transferência. Contrato de 4 temporadas.", tipo: "staff" },
  { id: "departamentoScout", nome: "Departamento de scouts", custo: 180, manutencao: 10, duracaoTemporadas: 3, categoria: "Staff", icone: "🔎", desc: "Revela com precisão sua curva de crescimento e a idade do seu auge. Contrato de 3 temporadas.", tipo: "staff" },
  { id: "segurancaParticular", nome: "Segurança particular", custo: 90, manutencao: 5, duracaoTemporadas: 2, categoria: "Staff", icone: "🛡️", desc: "Reduz o estrago de decisões que dão errado. Contrato de 2 temporadas.", tipo: "staff" },
  { id: "psicologoEsportivo", nome: "Psicólogo esportivo", custo: 80, manutencao: 5, duracaoTemporadas: 3, categoria: "Staff", icone: "🧠", desc: "Suaviza quedas de moral após resultados ruins e reduz o declínio por idade. Contrato de 3 temporadas.", tipo: "staff" },
  { id: "chefParticular", nome: "Chef particular", custo: 60, manutencao: 4, duracaoTemporadas: 2, categoria: "Staff", icone: "👨‍🍳", desc: "Pequeno ganho extra de forma física. Contrato de 2 temporadas.", tipo: "staff" },
  { id: "consultorImagem", nome: "Consultor de imagem", custo: 120, manutencao: 8, duracaoTemporadas: 2, categoria: "Staff", icone: "📸", desc: "Fama sobe um pouco a cada temporada. Contrato de 2 temporadas.", tipo: "staff" },
  // AÇÕES SOCIAIS (não tem manutenção, geram seguidores/fama/torcida)
  { id: "doacaoCaridade", nome: "Doação para caridade", custo: 40, categoria: "Ações Sociais", icone: "🎗️", desc: "Impulso de torcida e fama, e ganha seguidores.", tipo: "acao" },
  { id: "abrigoAnimais", nome: "Abrir abrigo de animais", custo: 90, categoria: "Ações Sociais", icone: "🐾", desc: "Grande ganho de fama e seguidores.", tipo: "acao" },
  { id: "ajudaHospital", nome: "Ajudar um hospital", custo: 130, categoria: "Ações Sociais", icone: "🏥", desc: "Repercussão forte — muitos seguidores novos.", tipo: "acao" },
  { id: "fundacaoSocial", nome: "Fundação social própria", custo: 200, categoria: "Ações Sociais", icone: "🏛️", desc: "Impulso imediato e permanente de imagem.", tipo: "acao" },
];

export const FAN_MSGS_POS = ["Você é o melhor jogador que eu já vi jogar! 🔥🐐", "Que temporada incrível, orgulho de torcer por você!", "MELHOR DO MUNDO, sem discussão!", "Time nada sem você, simplesmente surreal essa fase!"];

export const FAN_MSGS_NEG = ["Precisa melhorar muito na próxima temporada...", "Decepção total esse ano, torcida merecia mais.", "Já não é mais o mesmo jogador de antes.", "Hora de repensar o time titular..."];

export const PEN_W = 320, PEN_H = 210;

export const PEN_GOAL = { x: 22, y: 30, w: 276, h: 122 };

export const PEN_SPOT = { x: PEN_W / 2, y: 214 };

export const PEN_ZONE_X = { esquerdo: PEN_GOAL.x + PEN_GOAL.w * 0.14, meio: PEN_GOAL.x + PEN_GOAL.w * 0.5, direito: PEN_GOAL.x + PEN_GOAL.w * 0.86 };

export const POS_GRUPO = { ZAG: "DEF", LD: "DEF", LE: "DEF", VOL: "DEF", MC: "MEI", MEI: "MEI", PD: "ATA", PE: "ATA", SA: "ATA", ATA: "ATA", GOL: "GOL" };

export const LANCES_POR_POSICAO = {
  ATA: [
    { id: "chute", label: "🎯 Chutar de longe", attr: "finalizacao", sucesso: (c) => `GOOOL! Bate de longe e balança a rede contra o ${c}!`, falha: (c) => `Chutou de longe, mas a bola foi por cima do gol do ${c}.` },
    { id: "drible", label: "🌀 Tentar o drible", attr: "drible", sucesso: (c) => `Driblou o zagueiro e bateu na saída do goleiro do ${c} — GOL!`, falha: (c) => `Tentou o drible, mas foi desarmado antes de finalizar.` },
    { id: "passe", label: "🤝 Passar pro companheiro isolado", attr: "passe", sucesso: (c) => `Serviu o companheiro isolado, que não perdoa contra o ${c} — assistência sua!`, falha: (c) => `Tentou o passe, mas a zaga do ${c} interceptou.` },
  ],
  MEI: [
    { id: "chute", label: "🎯 Arriscar de fora da área", attr: "finalizacao", sucesso: (c) => `Bateu de fora da área — no ângulo, contra o ${c}!`, falha: (c) => `Arriscou de longe, mas a bola saiu à esquerda do gol do ${c}.` },
    { id: "drible", label: "🌀 Tocar e infiltrar", attr: "drible", sucesso: (c) => `Encontrou espaço entre as linhas do ${c} e finalizou — GOL!`, falha: (c) => `Tentou infiltrar, mas foi travado pela marcação do ${c}.` },
    { id: "passe", label: "🤝 Enfiar a bola em profundidade", attr: "passe", sucesso: (c) => `Que passe! Achou o atacante livre contra o ${c} — assistência sua!`, falha: (c) => `O passe em profundidade foi cortado pela zaga do ${c}.` },
  ],
  DEF: [
    { id: "desarme", label: "🛡️ Antecipar e cortar", attr: "defesa", sucesso: (c) => `Leu a jogada e cortou o contra-ataque perigoso do ${c}!`, falha: (c) => `Chegou atrasado e o ${c} levou perigo.` },
    { id: "duro", label: "💪 Jogo duro na disputa", attr: "fisico", sucesso: (c) => `Ganhou a dividida no braço e afastou o perigo do ${c}.`, falha: (c) => `Perdeu a dividida física e o ${c} avançou.` },
    { id: "sair", label: "🤝 Sair jogando limpo", attr: "passe", sucesso: (c) => `Saiu jogando com categoria, tirando a pressão do ${c}.`, falha: (c) => `Errou a saída de bola e quase custou caro contra o ${c}.` },
  ],
  GOL: [
    { id: "sair", label: "🧤 Sair no cruzamento", attr: "defesa", sucesso: (c) => `Saiu do gol e afastou o cruzamento perigoso do ${c}!`, falha: (c) => `Saiu mal do gol e quase presenteou o ${c}.` },
    { id: "linha", label: "🧤 Ficar na linha", attr: "defesa", sucesso: (c) => `Fez a defesa milagrosa e salvou o time contra o ${c}!`, falha: (c) => `Não alcançou e o ${c} descontou.` },
    { id: "contra", label: "🤝 Distribuir rápido", attr: "passe", sucesso: (c) => `Reposição rápida armou o contra-ataque certeiro contra o ${c}!`, falha: (c) => `A reposição saiu errada e a posse voltou pro ${c}.` },
  ],
};

export const FALTA_GOAL = { x: 112, y: 44, w: 96, h: 32 };

export const FALTA_BOX = { x: 68, y: FALTA_GOAL.y + FALTA_GOAL.h, w: 184, h: 30 };

export const FALTA_SPOT = { x: 116, y: 182 };

export const FALTA_BONECO_POS = { x: FALTA_GOAL.x + FALTA_GOAL.w * 0.5, y: 132 };

export const FALTA_ZONE_X = {
  cantoEsquerdo: FALTA_GOAL.x + FALTA_GOAL.w * 0.1,
  porCima: FALTA_GOAL.x + FALTA_GOAL.w * 0.52,
  cantoDireito: FALTA_GOAL.x + FALTA_GOAL.w * 0.9,
};

export const PASSE_W = 320, PASSE_H = 210;

export const PASSE_ORIGEM = { x: PASSE_W / 2, y: PASSE_H - 18 };

export const ANO_INICIO = 2025;

export const MESES_LABEL = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export const DIAS_SEMANA_LABEL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const DIAS_SEMANA_ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const JANELAS_BRASIL = [
  { comp: "Amistosos de pré-temporada", icone: "🤝", cor: "#6b7280", inicioMes: 0, inicioDia: 1, fimMes: 0, fimDia: 9 },
  { comp: "Copa São Paulo (Copinha)", icone: "🌟", cor: "#8b5cf6", inicioMes: 0, inicioDia: 2, fimMes: 0, fimDia: 25, soJovem: true },
  { comp: "Campeonato Estadual", icone: "🗺️", cor: "#3b82f6", inicioMes: 0, inicioDia: 11, fimMes: 2, fimDia: 22 },
  { comp: "Brasileirão", icone: "⚽", cor: "#12A876", inicioMes: 2, inicioDia: 28, fimMes: 11, fimDia: 6, ligaPrincipal: true },
  { comp: "Copa do Brasil", icone: "🏆", cor: "#D8B44A", inicioMes: 1, inicioDia: 18, fimMes: 10, fimDia: 15 },
  { comp: "Libertadores / Sul-Americana", icone: "🌎", cor: "#f59e0b", inicioMes: 2, inicioDia: 4, fimMes: 10, fimDia: 28 },
  { comp: "Mundial de Clubes", icone: "🌐", cor: "#ec4899", inicioMes: 5, inicioDia: 14, fimMes: 6, fimDia: 13, seElegivel: true },
];

export const COMPS_PAIS = {
  inglaterra: { liga: "Premier League", copa: "FA Cup", superCopa: "Community Shield", continental: "Champions League" },
  espanha: { liga: "La Liga", copa: "Copa del Rey", superCopa: "Supercopa de España", continental: "Champions League" },
  italia: { liga: "Serie A", copa: "Coppa Italia", superCopa: "Supercoppa Italiana", continental: "Champions League" },
  alemanha: { liga: "Bundesliga", copa: "DFB-Pokal", superCopa: "Supercopa da Alemanha", continental: "Champions League" },
  franca: { liga: "Ligue 1", copa: "Coupe de France", superCopa: "Trophée des Champions", continental: "Champions League" },
  portugal: { liga: "Liga Portugal", copa: "Taça de Portugal", superCopa: "Supertaça", continental: "Champions League" },
  arabia: { liga: "Liga Saudita", copa: "King's Cup", superCopa: "Supercopa Saudita", continental: "Champions Asiática" },
  mls: { liga: "MLS", copa: "US Open Cup", superCopa: "Campeones Cup", continental: "Concacaf Champions" },
};

