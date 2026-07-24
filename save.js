/* ===================== SISTEMA DE SAVE =====================
   Guarda a carreira no navegador (localStorage) e permite exportar/importar
   como arquivo, pra não perder tudo se limpar os dados do navegador. */

export const VERSAO_SAVE = 1;
const PREFIXO = "ajoia_save_";
export const SLOTS = ["auto", "1", "2", "3"];

/* Monta o objeto salvável a partir do estado do jogo.
   Só entra o que é essencial pra retomar: estado de interface (popups, filtros)
   é descartado de propósito, pra não restaurar o jogo no meio de uma janela aberta. */
export function montarSave({ stage, nome, posicao, nacionalidade, personalidade, pernaDominante, clubeCoracao, potencial, origemId, carreira, temporadas, mundo, fim, aba, modoSimulacao }) {
  return {
    versao: VERSAO_SAVE,
    salvoEm: new Date().toISOString(),
    stage, nome, posicao, nacionalidade, personalidade, pernaDominante, clubeCoracao,
    potencial, origemId, carreira, temporadas, mundo, fim, aba, modoSimulacao,
  };
}

/* Resumo mostrado na tela de saves, sem precisar carregar tudo */
export function resumoDoSave(save) {
  if (!save) return null;
  const c = save.carreira;
  return {
    nome: save.nome || "—",
    clube: c?.clube?.nome || (save.fim ? "aposentado" : "—"),
    idade: c?.idade ?? save.fim?.c?.idade ?? "—",
    temporadas: (save.temporadas || []).length,
    posicao: save.posicao || "—",
    encerrada: !!save.fim,
    salvoEm: save.salvoEm,
  };
}

function chave(slot) { return PREFIXO + slot; }

export function salvarLocal(slot, save) {
  try {
    localStorage.setItem(chave(slot), JSON.stringify(save));
    return { ok: true };
  } catch (e) {
    // o motivo mais comum é a cota do navegador estourar
    return { ok: false, erro: e?.name === "QuotaExceededError" ? "Espaço do navegador cheio. Apague um save antigo." : "Não foi possível salvar." };
  }
}

export function carregarLocal(slot) {
  try {
    const txt = localStorage.getItem(chave(slot));
    if (!txt) return null;
    const save = JSON.parse(txt);
    if (!save || typeof save !== "object") return null;
    return save;
  } catch {
    return null;
  }
}

export function apagarLocal(slot) {
  try { localStorage.removeItem(chave(slot)); return true; } catch { return false; }
}

export function listarSaves() {
  return SLOTS.map((slot) => {
    const save = carregarLocal(slot);
    return { slot, existe: !!save, resumo: resumoDoSave(save) };
  });
}

export function existeAlgumSave() {
  return SLOTS.some((s) => !!localStorage.getItem(chave(s)));
}

/* ---------- exportar / importar como arquivo ---------- */

export function baixarSave(save, nomeArquivo) {
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo || `ajoia-${(save.nome || "carreira").toLowerCase().replace(/\s+/g, "-")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function lerArquivoSave(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const save = JSON.parse(r.result);
        if (!save?.carreira && !save?.fim) return reject(new Error("Esse arquivo não parece ser um save do A JOIA."));
        if (save.versao > VERSAO_SAVE) return reject(new Error("Esse save foi feito numa versão mais nova do jogo."));
        resolve(save);
      } catch {
        reject(new Error("Arquivo inválido ou corrompido."));
      }
    };
    r.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    r.readAsText(file);
  });
}

/* Data amigável pra mostrar na lista de saves */
export function formatarData(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " às " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

/* ===== NORMALIZAÇÃO =====
   Um save pode vir de uma versão anterior do jogo (ou ter sido editado à mão).
   Aqui a carreira é completada com valores padrão pra que nada quebre ao carregar. */
const PADRAO_CARREIRA = {
  posicao: "ATA", nacionalidade: "BRA", personalidade: "ascensao", papelTatico: "padrao",
  idade: 16, gols: 0, assist: 0, melhorEmCampo: 0, titulos: 0, bolasDeOuro: 0,
  premiosIndividuais: 0, copasDoMundo: 0, fama: 12, cofre: 0, desgaste: 0, energia: 100,
  picoOvr: 50, anosDesdeCopa: 0, anoNoClube: 0, sequela: 0,
  tecnicoConfianca: 60, relacaoDiretoria: 40, calorMidia: 20, elencoMoral: 60,
  entrosamento: 20, titularidade: 100, relacaoPatrocinadores: 50, ostentacao: 0,
  historico: [], marcos: [], inbox: [], posses: [], traits: [], extrato: [],
  titulosLista: [], titulosSelecao: [], clubesInteresse: [], lesoesHistorico: [],
  cosmeticosDesbloqueados: [], posicoesAprendidas: [], valorHistorico: [], elenco: [],
  torcidaPorClube: {}, titulosPorClube: {}, camisaPorClube: {}, statsPorClube: {},
  recordesClube: {}, investimentosClube: {}, staff: {}, staffContratos: {},
  empresarioUsado: {}, streaksTraits: {}, relacoes: {}, estadoClubes: null,
  selecao: { jogos: 0, gols: 0, assist: 0, cleanSheets: 0, capitao: false, convocacoesSeguidas: 0, historico: [] },
};

export function normalizarCarreira(c) {
  if (!c) return null;
  const out = { ...PADRAO_CARREIRA, ...c };
  // garante que campos de coleção sejam do tipo certo, mesmo se vierem nulos
  Object.entries(PADRAO_CARREIRA).forEach(([k, v]) => {
    if (Array.isArray(v) && !Array.isArray(out[k])) out[k] = [];
    else if (v && typeof v === "object" && !Array.isArray(v) && (typeof out[k] !== "object" || out[k] === null)) out[k] = { ...v };
  });
  if (!out.attrs || typeof out.attrs !== "object") out.attrs = { velocidade: 50, finalizacao: 50, passe: 50, drible: 50, defesa: 50, fisico: 50, fintas: 3, pernaRuim: 3 };
  if (!out.potencial || typeof out.potencial !== "object") out.potencial = { ...out.attrs };
  if (!out.attrsAnteriores) out.attrsAnteriores = { ...out.attrs };
  if (!out.clube || !out.clube.nome) out.clube = { nome: "Clube", liga: "brasileirao", forca: 60, cor: "#12A876" };
  return out;
}

/* Registros de temporada antigos podem não ter campos criados depois (stats por
   competição, ranking, promessa do técnico...). Completar evita quebrar as telas. */
const PADRAO_TEMPORADA = {
  gols: 0, assist: 0, jogos: 0, cleanSheets: 0, melhorEmCampo: 0, nota: 6.5,
  premios: [], titulosLista: [], jogosLista: [], porCompeticao: [],
  rankingBO: [], artilhariaLiga: [], ligaNome: "—", ligaMult: 0.8,
  clube: "—", temporadaLabel: "—", idade: 16, salario: 0,
};
export function normalizarTemporada(t) {
  if (!t) return null;
  const out = { ...PADRAO_TEMPORADA, ...t };
  Object.entries(PADRAO_TEMPORADA).forEach(([k, v]) => {
    if (Array.isArray(v) && !Array.isArray(out[k])) out[k] = [];
  });
  return out;
}

export function normalizarSave(save) {
  if (!save) return null;
  return {
    ...save,
    carreira: normalizarCarreira(save.carreira),
    temporadas: (Array.isArray(save.temporadas) ? save.temporadas : []).map(normalizarTemporada).filter(Boolean),
  };
}
