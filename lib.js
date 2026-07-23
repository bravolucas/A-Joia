import { AFINIDADE_MERCADO, CATEGORIAS_INFLACAO_SALARIAL, CLUBES, COMPETICOES_SELECAO, COMPS_PAIS, EMOJI_CLUBES, EMPRESARIOS, ESTADUAIS, ESTILOS_TECNICO, EVENTOS_CLUBE, FALTA_BONECO_POS, FALTA_GOAL, FALTA_SPOT, FALTA_ZONE_X, FASES_COPA_MUNDO, FASES_POR_COMPETICAO, FORMACAO_433, JANELAS_BRASIL, LIGAS, LIGAS_ESPECIALISTA, NACIONALIDADES, NACS_MUNDO, NIVEIS, NOMES_MUNDO, NUM_ATTRS, OFERTAS_PATROCINIO, PAPEIS_TATICOS, PASSE_W, PEN_GOAL, PEN_SPOT, PEN_ZONE_X, PERSONALIDADES, PESO_OSTENTACAO, POSICOES, PROMESSAS_TECNICO, RIVAIS_POR_TIER, RIVAIS_PREMIO, ROTINAS_FISICAS, SOBRENOMES_TECNICO, TIERS_TORCIDA, TIPOS_LESAO, TODOS_ATTRS, TRAITS_DISPONIVEIS } from "./data";

export function potencialDaOrigem(origem, posicao) {
  const base = { velocidade: 64, finalizacao: 64, passe: 64, drible: 64, defesa: 64, fisico: 64, fintas: 3, pernaRuim: 3 };
  const bias = origem?.bias || {};
  const out = {};
  Object.keys(base).forEach((k) => {
    const isStar = k === "fintas" || k === "pernaRuim";
    out[k] = isStar ? clampR(base[k] + (bias[k] || 0), 1, 5) : clampR(base[k] + (bias[k] || 0), 55, 88);
  });
  // leve reforço no atributo-chave da posição escolhida
  const chave = { GOL: "defesa", ZAG: "defesa", LAT: "velocidade", VOL: "passe", MEI: "passe", PON: "drible", ATA: "finalizacao" }[posicao];
  if (chave) out[chave] = clampR(out[chave] + 4, 55, 92);
  return out;
}

export function pesoComPapel(pos, papelId) {
  const papel = PAPEIS_TATICOS.find((p) => p.id === papelId) || PAPEIS_TATICOS[0];
  const pesos = { ...pos.pesos };
  Object.entries(papel.bonus).forEach(([attr, mult]) => { if (pesos[attr]) pesos[attr] = pesos[attr] * mult; });
  return pesos;
}

export function aplicarEfeitoCosmetico(c, item) { if (item.efeito) item.efeito(c); }

export function gerarPromessaTecnico(c) {
  const p = pick(PROMESSAS_TECNICO);
  return { id: p.id, meta: p.meta(c) };
}

export function promessaPorId(id) { return PROMESSAS_TECNICO.find((p) => p.id === id); }

export function descreverMetaPromessa(prom, posicao) {
  const m = prom?.meta;
  if (!m) return "";
  if (m.label) return m.label;
  if (m.tipo === "gols") return `marcar ao menos ${m.alvo} gols`;
  if (m.tipo === "jogos") return `disputar ao menos ${m.alvo} jogos`;
  if (m.tipo === "nota") return `manter nota média acima de ${m.alvo}`;
  return "";
}

export function emojiClube(nome) { return EMOJI_CLUBES[nome] || "⚽"; }

export function poolRivalPorOvr(ovr) { return (RIVAIS_POR_TIER.find((t) => ovr >= t.min && ovr <= t.max) || RIVAIS_POR_TIER[0]).nomes; }

export function sortearRival(ovr, atual) {
  const pool = poolRivalPorOvr(ovr).filter((n) => n !== atual);
  return pool.length ? pick(pool) : pick(poolRivalPorOvr(ovr));
}

export function labelFaseGenerica(pendente) {
  const fases = FASES_POR_COMPETICAO[pendente.tipo];
  if (pendente.faseIdx < fases.length) return fases[pendente.faseIdx].label;
  return "Final";
}

export function calcularSucessoDecisivo(c, cardTemporada, decisaoUsuarioOk) {
  const chanceBonus = decisaoUsuarioOk ? 0.20 : -0.35;
  const forcaTime = forcaEfetivaClube(c, c.clube);
  const ovrAtual = calcOVR(c.attrs, c.posicao, c.papelTatico);
  let baseSucesso = forcaTime * 0.6 + ovrAtual * 0.4;
  if (c.abordagem === "limite") baseSucesso += 5;
  const resultadoRolagem = rand(1, 100);
  const corteSucesso = 75 - baseSucesso * 0.2 - chanceBonus * 100;
  return resultadoRolagem >= clampR(corteSucesso, 10, 95);
}

export function chanceFaseGenerica(faseIdx, forca, ovr, decisaoOk, dificuldadeBase) {
  const dificuldade = dificuldadeBase + faseIdx * 9;
  const base = clamp((forca - 48) / 45, 0.18, 0.95);
  const ajusteOvr = clamp((ovr - 76) / 45, -0.15, 0.25);
  let chance = base + ajusteOvr - dificuldade / 100;
  chance = decisaoOk ? chance + chance * 0.25 : chance - (1 - chance) * 0.55;
  return clamp(chance, 0.1, 0.95);
}

export function labelFaseCopaMundo(pendente) {
  if (!pendente) return "";
  if (pendente.faseIdx < FASES_COPA_MUNDO.length) return FASES_COPA_MUNDO[pendente.faseIdx].label;
  return pendente.ramo === "final" ? "Final" : "Disputa de 3º Lugar";
}

export function chanceFaseCopaMundo(faseIdx, forcaSelecao, ovr, decisaoOk, ramo) {
  const dificuldadePorFase = [2, 8, 16, 26, 36];
  const dificuldade = ramo === "final" ? 40 : ramo === "terceiro" ? 28 : dificuldadePorFase[faseIdx] ?? 30;
  const base = clamp((forcaSelecao - 50) / 45, 0.15, 0.95);
  const ajusteOvr = clamp((ovr - 78) / 45, -0.15, 0.25);
  let chance = base + ajusteOvr - dificuldade / 100;
  chance = decisaoOk ? chance + chance * 0.25 : chance - (1 - chance) * 0.55;
  return clamp(chance, 0.08, 0.95);
}

export function pontosCampanhaCopa(resultado) {
  if (!resultado) return 0;
  if (resultado === "CAMPEÃO DO MUNDO") return 5;
  if (resultado === "Vice-campeão do Mundo") return 3;
  if (resultado === "3º lugar na Copa do Mundo") return 2;
  if (resultado === "4º lugar na Copa do Mundo") return 1;
  return 0;
}

export function tierTorcida(v) { return TIERS_TORCIDA.find((t) => v >= t.min) || TIERS_TORCIDA[TIERS_TORCIDA.length - 1]; }

export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function formatarDinheiro(k) {
  const abs = Math.abs(k);
  if (abs >= 1000) { const m = k / 1000; return `${Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1)}M`; }
  return `${Math.round(k)}k`;
}

export const pick = (arr) => arr[rand(0, arr.length - 1)];

export const clampR = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const clamp = (v, lo = 0, hi = 99) => clampR(v, lo, hi);

export function poisson(lambda) {
  lambda = Math.max(0.02, lambda);
  let g = 0, p = Math.exp(-lambda), cum = p;
  const r = Math.random();
  while (r > cum && g < 70) { g++; p = (p * lambda) / g; cum += p; }
  return g;
}

export function calcOVR(attrs, posId, papelId) {
  const pos = POSICOES.find((p) => p.id === posId);
  const pesos = papelId && papelId !== "padrao" ? pesoComPapel(pos, papelId) : pos.pesos;
  let soma = 0, pesoTotal = 0;
  NUM_ATTRS.forEach((id) => { const w = pesos[id] || 0.5; soma += (attrs[id] || 50) * w; pesoTotal += w; });
  let ovr = soma / pesoTotal;
  const ofensiva = ["MEI", "PD", "PE", "SA", "ATA", "MC"].includes(posId);
  ovr += ((attrs.fintas || 1) - 3) * (ofensiva ? 0.9 : 0.3);
  ovr += ((attrs.pernaRuim || 1) - 3) * (ofensiva ? 0.7 : 0.25);
  return Math.round(clamp(ovr, 40, 99));
}

export function attrsIniciais(potencial) {
  const obj = {};
  TODOS_ATTRS.forEach((id) => {
    const isStar = id === "fintas" || id === "pernaRuim";
    obj[id] = isStar ? Math.max(1, potencial[id] - 2) : clampR(potencial[id] - rand(18, 30), 40, 70);
  });
  return obj;
}

export function atualizarTraits(c) {
  c.streaksTraits = c.streaksTraits || {};
  c.traits = c.traits || [];
  TRAITS_DISPONIVEIS.forEach((t) => {
    if (c.traits.includes(t.id)) return;
    const atual = c.attrs[t.attrId] || 0;
    if (atual >= t.limiar) {
      c.streaksTraits[t.id] = (c.streaksTraits[t.id] || 0) + 1;
      if (c.streaksTraits[t.id] >= t.temporadas) {
        c.traits.push(t.id);
        logHist(c, `🏅 Trait desbloqueada: ${t.icone} ${t.nome} — ${t.desc}`);
      }
    } else {
      c.streaksTraits[t.id] = 0;
    }
  });
}

export function bonusTraitsMataMata(c) {
  return (c.traits || []).reduce((soma, id) => soma + (TRAITS_DISPONIVEIS.find((t) => t.id === id)?.bonus || 0), 0);
}

export function evoluirAtributos(atual, potencial, idade, persona, bonusFoco, reducaoDeclinio = 1) {
  const novo = { ...atual };
  TODOS_ATTRS.forEach((id) => {
    const isStar = id === "fintas" || id === "pernaRuim";
    const min = isStar ? 1 : 40, max = isStar ? 5 : 99;
    const focoMult = bonusFoco === id ? 1.5 : 1;
    if (idade < persona.picoFim) {
      const gap = potencial[id] - novo[id];
      const passo = gap * 0.18 * persona.taxaCresc * focoMult;
      novo[id] = clampR(Math.round(novo[id] + passo), min, max);
    } else if (idade >= persona.declinioApartir) {
      // Velocidade e físico caem 40% mais rápido que passe/finalização — curva de envelhecimento real
      const pesoFisico = ["velocidade", "fisico"].includes(id) ? 1.4 : 0.9;
      const queda = persona.declinioTaxa * pesoFisico * (isStar ? 0.1 : 1) * (1 + (idade - persona.declinioApartir) * 0.15) * reducaoDeclinio;
      novo[id] = clampR(Math.round(novo[id] - queda), min, max);
    }
  });
  return novo;
}

export function forcaEfetivaClube(c, clube) {
  const bonus = (c.investimentosClube || {})[clube.nome] || 0;
  return clampR(clube.forca + bonus, 35, 99);
}

export function multiplicadorInflacao(c) {
  const salarioRef = c.contrato?.salario || salarioClube(c.clube, calcOVR(c.attrs, c.posicao));
  return clampR(1 + salarioRef / 4000, 1, 5);
}

export function multiplicadorInflacaoFixa(c) {
  return clampR(1 + ((c.idade ?? 16) - 16) * 0.025, 1, 1.6);
}

export function precoAjustado(item, c) {
  const m = CATEGORIAS_INFLACAO_SALARIAL.includes(item.categoria) ? multiplicadorInflacao(c) : multiplicadorInflacaoFixa(c);
  return { custo: Math.round(item.custo * m), manutencao: Math.round((item.manutencao || 0) * m) };
}

export function ligaMultEfetivo(clube, liga) {
  const ajusteForca = clamp((clube.forca - 65) / 100, -0.15, 0.15);
  return clampR(liga.mult + ajusteForca, 0.4, 1.05);
}

export function empresarioEspecialista(ligaId) {
  const nomeLiga = LIGAS[ligaId]?.nome || ligaId;
  return {
    id: `especialista_${ligaId}`, nome: `Especialista na ${nomeLiga}`, icone: "🗝️", cor: "#D8B44A",
    custo: 175, comissao: 0.08, temporadas: 3, ligaFoco: ligaId,
    desc: `Tem trânsito livre nos clubes da ${nomeLiga}. Abre portas ali que ninguém mais abre — em troca, ignora o resto do mundo.`,
    nOfertas: 3, alcance: 12, salarioMult: 1.05, anosBonus: 0, multaMult: 1,
    resumo: `3 propostas · quase sempre da ${nomeLiga}`,
  };
}

export function todosEmpresarios() { return [...EMPRESARIOS, ...LIGAS_ESPECIALISTA.map(empresarioEspecialista)]; }

export function empresarioPorId(id) { return todosEmpresarios().find((e) => e.id === id) || EMPRESARIOS[0]; }

export function afinidadeMercado(nacionalidade, ligaId) {
  return (AFINIDADE_MERCADO[nacionalidade] || {})[ligaId] ?? 1;
}

export function scoreInteresseClube(c, clube, ultimaTemporada, emp) {
  const ovr = calcOVR(c.attrs, c.posicao, c.papelTatico);
  const alcance = emp?.alcance ?? 10;
  // 1) Encaixe de nível: clube muito acima não te quer; muito abaixo não te atrai (curva, não corte)
  const gap = clube.forca - ovr;
  const encaixe = gap > alcance ? 0 : Math.exp(-Math.pow(gap / (alcance * 0.75), 2));
  if (encaixe <= 0.02) return 0;
  // 2) Desempenho da última temporada conta muito
  let desempenho = 1;
  if (ultimaTemporada) {
    const t = ultimaTemporada;
    desempenho = clamp(0.55 + (t.nota - 6.6) * 0.55 + ((t.gols + t.assist) / Math.max(1, t.jogos)) * 0.7, 0.4, 2.1);
    if (t.campeaoLiga || t.continental?.titulo) desempenho *= 1.15;
  }
  // 3) Afinidade de mercado por nacionalidade
  const afinidade = afinidadeMercado(c.nacionalidade, clube.liga);
  // 4) Fama abre portas em clube grande
  const famaFator = 1 + ((c.fama ?? 20) / 100) * (clube.forca >= 82 ? 0.45 : 0.15);
  // 5) Idade: clube grande evita veterano; clube médio valoriza experiência
  const idade = c.idade ?? 20;
  const idadeFator = clube.forca >= 82
    ? clamp(1.15 - Math.max(0, idade - 29) * 0.09, 0.25, 1.15)
    : clamp(1 - Math.max(0, idade - 33) * 0.07, 0.4, 1.05);
  // 6) Clube que já te observava tem prioridade
  const observando = (c.clubesInteresse || []).some((n) => n === clube.nome || n?.nome === clube.nome) ? 1.35 : 1;
  // 7) Empresário especialista puxa a liga dele
  const foco = emp?.ligaFoco ? (clube.liga === emp.ligaFoco ? 2.2 : 0.35) : 1;
  return encaixe * desempenho * afinidade * famaFator * idadeFator * observando * foco;
}

export function sortearPorInteresse(cands, n) {
  const pool = cands.filter((x) => x.score > 0);
  const out = [];
  while (out.length < n && pool.length) {
    const total = pool.reduce((a, b) => a + b.score, 0);
    let r = Math.random() * total, idx = 0;
    for (let i = 0; i < pool.length; i++) { r -= pool[i].score; if (r <= 0) { idx = i; break; } }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function valorDeMercado(c, ovr, ultimaTemporada) {
  const idade = c.idade ?? 22;
  // 1) base exponencial no OVR — a diferença entre 85 e 90 vale muito mais que entre 60 e 65
  let v = Math.pow(Math.max(0, ovr - 45) / 10, 3.05) * 26;
  // 2) curva de idade: pico de valor entre 23 e 27, despenca depois dos 31
  const fatorIdade = idade <= 18 ? 1.22 : idade <= 21 ? 1.32 : idade <= 24 ? 1.28 : idade <= 27 ? 1.12
    : idade <= 29 ? 0.92 : idade <= 31 ? 0.7 : idade <= 33 ? 0.44 : idade <= 35 ? 0.24 : 0.1;
  v *= fatorIdade;
  // 3) potencial ainda não atingido valoriza jovem promessa
  const teto = calcOVR(c.potencial || c.attrs, c.posicao, c.papelTatico);
  if (idade <= 25) v *= 1 + clamp((teto - ovr) / 100, 0, 0.35);
  // 4) forma da última temporada
  if (ultimaTemporada) {
    v *= clamp(0.72 + (ultimaTemporada.nota - 6.6) * 0.42, 0.6, 1.45);
    const contrib = (ultimaTemporada.gols + ultimaTemporada.assist) / Math.max(1, ultimaTemporada.jogos);
    v *= clamp(1 + contrib * 0.35, 0.9, 1.4);
  }
  // 5) liga onde joga (vitrine)
  v *= 0.72 + (LIGAS[c.clube?.liga]?.mult ?? 0.8) * 0.5;
  // 6) contrato: pouco tempo restante derruba o preço
  const restantes = c.contrato?.restantes ?? 2;
  v *= restantes >= 4 ? 1.12 : restantes === 3 ? 1.05 : restantes === 2 ? 1 : restantes === 1 ? 0.72 : 0.45;
  // 7) apelo comercial
  v *= 1 + ((c.fama ?? 20) / 100) * 0.28;
  // 8) corpo castigado assusta comprador
  v *= 1 - clamp((c.sequela || 0) * 0.45, 0, 0.4);
  return Math.max(1, Math.round(v));
}

export function faixaValor(v) {
  if (v >= 4500) return { label: "Ativo global", cor: "#EC4899" };
  if (v >= 2500) return { label: "Estrela de mercado", cor: "#D8B44A" };
  if (v >= 1200) return { label: "Alto valor", cor: "#12A876" };
  if (v >= 500) return { label: "Valorizado", cor: "#3b82f6" };
  if (v >= 150) return { label: "Em construção", cor: "#a1a1aa" };
  return { label: "Baixo valor de mercado", cor: "#71717a" };
}

export function valorMundo(j) {
  let v = Math.pow(Math.max(0, j.ovr - 45) / 10, 3.05) * 26;
  const f = j.idade <= 21 ? 1.32 : j.idade <= 24 ? 1.28 : j.idade <= 27 ? 1.12 : j.idade <= 29 ? 0.92 : j.idade <= 31 ? 0.7 : j.idade <= 33 ? 0.44 : 0.2;
  v *= f * (0.72 + (LIGAS[j.liga]?.mult ?? 0.8) * 0.5);
  return Math.max(1, Math.round(v));
}

export function salarioClube(clube, ovr) {
  const base = (clube.forca * 0.9 + ovr * 1.1) * LIGAS[clube.liga].mult;
  return Math.round(base * 7);
}

export function gerarMetaIndividual(c) {
  const pos = POSICOES.find((p) => p.id === c.posicao);
  const ovr = calcOVR(c.attrs, c.posicao, c.papelTatico);
  const nivel = Math.pow(Math.max(0.3, (ovr - 55) / 35), 1.3);
  const jogos = 28;
  const gols = c.posicao === "GOL" ? 0 : Math.max(2, Math.round(pos.golBase * nivel * jogos));
  const assist = Math.max(1, Math.round(pos.assistBase * nivel * jogos));
  const cleanSheets = c.posicao === "GOL" ? Math.max(4, Math.round(jogos * clamp((ovr - 55) / 60, 0.1, 0.5))) : 0;
  return { jogos, gols, assist, cleanSheets, nivelNegociacao: 0 };
}

export function ajustarMeta(meta, delta) {
  const mult = 1 + delta * 0.35;
  return {
    ...meta, nivelNegociacao: meta.nivelNegociacao + delta,
    gols: Math.max(1, Math.round(meta.gols * mult)), assist: Math.max(1, Math.round(meta.assist * mult)),
    cleanSheets: Math.max(2, Math.round(meta.cleanSheets * mult)),
  };
}

export function avaliarMetaIndividual(meta, card, posicao) {
  const score = posicao === "GOL"
    ? card.cleanSheets / Math.max(1, meta.cleanSheets)
    : (card.gols / Math.max(1, meta.gols)) * 0.55 + (card.assist / Math.max(1, meta.assist)) * 0.3 + (card.jogos / Math.max(1, meta.jogos)) * 0.15;
  return score >= 0.85;
}

export function statusNoTime(confianca) {
  if (confianca < 10) return { label: "Não relacionado", cor: "#6b7280" };
  if (confianca < 50) return { label: "Reserva", cor: "#a1a1aa" };
  if (confianca < 60) return { label: "Rodízio", cor: "#3b82f6" };
  if (confianca < 70) return { label: "Disputando posição", cor: "#22c55e" };
  if (confianca < 80) return { label: "Titular", cor: "#12A876" };
  return { label: "Titular incontestável", cor: "#D8B44A" };
}

export function sortearLesao(c) {
  const hist = c.lesoesHistorico || [];
  const idade = c.idade ?? 20;
  const desgaste = c.desgaste ?? 0;
  const pesos = TIPOS_LESAO.map((t) => {
    let p = 5 - t.gravidade; // leves são mais comuns
    if (idade >= 30) p *= 1 + (t.gravidade - 1) * 0.25; // veterano se machuca mais feio
    if (desgaste > 2) p *= 1 + t.gravidade * 0.15;
    const recaidas = hist.filter((h) => h.regiao === t.regiao).length;
    if (recaidas) p *= 1 + recaidas * 0.85; // região já lesionada puxa muito
    return Math.max(0.1, p);
  });
  const total = pesos.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < TIPOS_LESAO.length; i++) { r -= pesos[i]; if (r <= 0) return TIPOS_LESAO[i]; }
  return TIPOS_LESAO[0];
}

export function aplicarLesao(c, tipo) {
  const jogosFora = rand(tipo.jogosFora[0], tipo.jogosFora[1]);
  const recaida = (c.lesoesHistorico || []).some((h) => h.regiao === tipo.regiao);
  const perda = tipo.gravidade >= 3 ? rand(1, 3) : tipo.gravidade === 2 ? rand(0, 1) : 0;
  if (perda > 0 && c.attrs[tipo.atributo] != null) {
    c.attrs = { ...c.attrs, [tipo.atributo]: clamp(c.attrs[tipo.atributo] - perda, 1, 99) };
  }
  c.lesoesHistorico = [...(c.lesoesHistorico || []), {
    idade: c.idade, nome: tipo.nome, regiao: tipo.regiao, gravidade: tipo.gravidade,
    jogosFora, recaida, perdaAtributo: perda, atributo: tipo.atributo,
  }];
  c.sequela = clamp((c.sequela || 0) + tipo.sequela, 0, 0.9);
  c.desgaste = (c.desgaste || 0) + tipo.gravidade * 0.35;
  return { jogosFora, recaida, perda };
}

export function nivelFragilidade(c) {
  const s = c.sequela || 0;
  if (s >= 0.5) return { label: "Muito frágil", cor: "#D6483F", desc: "Corpo bastante castigado — risco alto de recair." };
  if (s >= 0.28) return { label: "Frágil", cor: "#f59e0b", desc: "Histórico pesado começa a cobrar seu preço." };
  if (s >= 0.12) return { label: "Alguns desgastes", cor: "#D8B44A", desc: "Marcas de lesões antigas, nada grave ainda." };
  return { label: "Íntegro", cor: "#12A876", desc: "Corpo sem histórico relevante de lesão." };
}

export function registrarMarco(c, tipo, texto, detalhe) {
  c.marcos = [...(c.marcos || []), { idade: c.idade, tipo, texto, detalhe: detalhe || null, clube: c.clube?.nome }];
}

export function gerarRecordeClube(clube) {
  const base = Math.round(clube.forca * 2.2);
  return {
    gols: base + rand(-15, 35),
    nome: pick(["Ademir", "Túlio", "Roberto Dinamite", "Zico", "Pelé", "Romário", "Careca", "Nunes"].map((n) => n)) + " (histórico)",
  };
}

export function statsNoClube(c, clubeNome) {
  return (c.statsPorClube || {})[clubeNome] || { gols: 0, assist: 0, jogos: 0, temporadas: 0, titulos: 0 };
}

export function marcasDeGolAtingidas(antes, depois) {
  const marcas = [25, 50, 100, 150, 200, 250, 300, 400, 500];
  return marcas.filter((m) => antes < m && depois >= m);
}

export function calcularOstentacao(c) {
  const dosBens = (c.posses || []).reduce((s, p) => s + (PESO_OSTENTACAO[p.categoria] ?? 0) * (1 + (p.custo || 0) / 90), 0);
  const dasAcoes = (c.acoesSociaisFeitas || 0) * -4;
  return clampR(Math.round(dosBens + dasAcoes), 0, 100);
}

export function efeitosOstentacao(c) {
  const o = calcularOstentacao(c);
  const clubeGrande = (c.clube?.forca ?? 70) >= 82;
  const tolerancia = clubeGrande ? 55 : 35; // acima disso começa a incomodar
  const excesso = Math.max(0, o - tolerancia);
  return {
    nivel: o,
    // patrocinadores de luxo adoram quem tem imagem de estrela
    patrocinio: clampR(Math.round(o * 0.35), 0, 30),
    // vestiário e torcida estranham o exagero
    elenco: -Math.round(excesso * 0.22),
    torcida: -Math.round(excesso * 0.18),
    // vida noturna e agenda cheia cobram no corpo
    desgaste: +(excesso * 0.012).toFixed(2),
    label: o >= 70 ? "Astro global" : o >= 45 ? "Vida de craque" : o >= 22 ? "Confortável" : "Pé no chão",
    cor: o >= 70 ? "#EC4899" : o >= 45 ? "#D8B44A" : o >= 22 ? "#3b82f6" : "#12A876",
    alerta: excesso > 18 ? (clubeGrande
      ? "O vestiário comenta seu padrão de vida — num clube desse porte ainda passa, mas incomoda."
      : "Num clube desse tamanho, seu padrão de vida destoa: torcida e elenco cobram postura.") : null,
  };
}

export function gerarJogadorElenco(clube, posId, idBase) {
  const nac = clube.liga === "brasileirao" || clube.liga === "serieB" ? (Math.random() < 0.85 ? "BRA" : pick(NACS_MUNDO)) : pick(NACS_MUNDO);
  const idade = rand(18, 34);
  const variacao = idade < 21 ? rand(-14, -4) : idade > 31 ? rand(-8, 2) : rand(-7, 6);
  return {
    id: `e${idBase}`, nome: nomeMundo(nac), nac, posicao: posId, idade,
    ovr: clampR(clube.forca + variacao, 45, 95),
    forma: 0, doMundo: false,
  };
}

export function gerarElenco(clube, mundo, posicaoJogador) {
  const doMundo = (mundo?.jogadores || [])
    .filter((j) => !j.aposentado && j.clubeNome === clube.nome)
    .map((j) => ({ id: `m${j.id}`, nome: j.nome, nac: j.nac, posicao: j.posicao, idade: j.idade, ovr: j.ovr, forma: 0, doMundo: true }));
  const elenco = [...doMundo];
  // garante cobertura mínima de cada posição da formação (sem contar a sua, que é você)
  const necessarias = [...FORMACAO_433];
  let idBase = 1;
  necessarias.forEach((posId) => {
    const jaTem = elenco.filter((e) => e.posicao === posId).length;
    const precisa = posId === posicaoJogador ? 1 : 1; // pelo menos 1 por vaga (você disputa a sua)
    for (let i = jaTem; i < precisa; i++) elenco.push(gerarJogadorElenco(clube, posId, idBase++));
  });
  // reservas extras pra dar corpo ao grupo
  const extras = rand(8, 12);
  for (let i = 0; i < extras; i++) elenco.push(gerarJogadorElenco(clube, pick(FORMACAO_433), idBase++));
  return elenco;
}

export function escalacaoProvavel(elenco, jogador) {
  const disponiveis = [...(elenco || [])];
  const eu = jogador ? { id: "EU", nome: jogador.nome, posicao: jogador.posicao, idade: jogador.idade, ovr: jogador.ovr, voce: true, titularidade: jogador.titularidade } : null;
  if (eu) disponiveis.push(eu);
  const escalados = [];
  const usados = new Set();
  FORMACAO_433.forEach((posId) => {
    const candidatos = disponiveis
      .filter((j) => !usados.has(j.id) && j.posicao === posId)
      // sua titularidade dá (ou tira) peso na disputa pela vaga
      .map((j) => ({ ...j, peso: j.ovr + (j.voce ? ((j.titularidade ?? 100) - 70) * 0.25 : 0) }))
      .sort((a, b) => b.peso - a.peso);
    let escolhido = candidatos[0];
    if (!escolhido) {
      // ninguém da posição: improvisa o melhor disponível que sobrou
      const sobra = disponiveis.filter((j) => !usados.has(j.id)).sort((a, b) => b.ovr - a.ovr);
      escolhido = sobra[0] ? { ...sobra[0], improvisado: true } : null;
    }
    if (escolhido) { usados.add(escolhido.id); escalados.push({ ...escolhido, vaga: posId }); }
  });
  const banco = disponiveis.filter((j) => !usados.has(j.id)).sort((a, b) => b.ovr - a.ovr);
  return { titulares: escalados, banco, voceTitular: escalados.some((j) => j.voce) };
}

export function evoluirElenco(elenco, clube) {
  return (elenco || []).map((j) => {
    const idade = j.idade + 1;
    let ovr = j.ovr;
    if (idade <= 27) ovr = clampR(ovr + rand(0, 2), 40, 96);
    else if (idade >= 31) ovr = clampR(ovr - rand(0, 2), 40, 96);
    return { ...j, idade, ovr };
  }).filter((j) => j.idade < 38);
}

export function gerarTecnico(clube) {
  const estilo = pick(ESTILOS_TECNICO);
  const exigente = Math.random() < 0.35;
  return {
    nome: `${pick(["Cléber", "Vanderlei", "Marcelo", "Diego", "Roberto", "Ariel", "Paulo", "Fernando", "Jorge", "Tiago"])} ${pick(SOBRENOMES_TECNICO)}`,
    estilo: estilo.id, exigente, temporadas: 0,
    prestigio: clampR(Math.round((clube?.forca ?? 70) + rand(-10, 8)), 40, 95),
  };
}

export function estiloTecnico(id) { return ESTILOS_TECNICO.find((e) => e.id === id) || ESTILOS_TECNICO[4]; }

export function encaixeNoEstilo(c) {
  const est = estiloTecnico(c.tecnico?.estilo);
  const media = NUM_ATTRS.reduce((s, a) => s + c.attrs[a], 0) / NUM_ATTRS.length;
  const meus = est.valoriza.reduce((s, a) => s + (c.attrs[a] ?? media), 0) / est.valoriza.length;
  return +(meus - media).toFixed(1); // positivo = você é a cara do que ele quer
}

export function avaliarPermanenciaTecnico(c, card, bateuMeta) {
  const t = c.tecnico;
  if (!t) return null;
  const temporadas = (t.temporadas || 0) + 1;
  const foiBem = !!card.campeaoLiga || !!card.continental?.titulo || bateuMeta;
  const foiMal = (card.posLiga ?? 10) >= 15 || (!bateuMeta && (card.nota ?? 7) < 6.6);
  let chanceSaida = 0.12;
  if (foiMal) chanceSaida += 0.45;
  if (foiBem) chanceSaida -= 0.08;
  if (temporadas >= 4) chanceSaida += 0.2; // ciclos se esgotam
  // técnico que vai muito bem pode ser levado por um clube maior
  const assediado = foiBem && Math.random() < 0.25;
  if (Math.random() < clamp(chanceSaida, 0.03, 0.9) || assediado) {
    return { saiu: true, motivo: assediado ? "assediado" : foiMal ? "demitido" : "fim de ciclo" };
  }
  return { saiu: false, temporadas };
}

export function estadoInicialClubes() {
  const st = {};
  CLUBES.forEach((c) => { st[c.nome] = { liga: c.liga, forca: c.forca }; });
  return st;
}

export function clubeAtual(estado, nome) {
  const base = CLUBES.find((c) => c.nome === nome);
  if (!base) return null;
  const mod = estado?.[nome];
  return mod ? { ...base, liga: mod.liga, forca: mod.forca } : base;
}

export function girarLigas(estado) {
  const novo = { ...estado };
  // 1) oscilação de força: clubes sobem e caem de patamar com o tempo
  Object.keys(novo).forEach((nome) => {
    const base = CLUBES.find((c) => c.nome === nome);
    const cur = novo[nome];
    const drift = rand(-2, 2) + (Math.random() < 0.08 ? rand(-5, 5) : 0); // choques ocasionais
    // puxa levemente de volta pro patamar histórico, pra não desandar em 20 anos
    const retorno = (base.forca - cur.forca) * 0.12;
    novo[nome] = { ...cur, forca: clampR(Math.round(cur.forca + drift + retorno), 40, 96) };
  });
  // 2) acesso e rebaixamento entre Brasileirão e Série B
  const naA = Object.entries(novo).filter(([, v]) => v.liga === "brasileirao");
  const naB = Object.entries(novo).filter(([, v]) => v.liga === "serieB");
  if (naA.length >= 8 && naB.length >= 8) {
    // classificação estimada = força + sorte da temporada
    const ordenar = (arr) => arr.map(([n, v]) => ({ n, v, pts: v.forca + rand(-9, 9) })).sort((a, b) => b.pts - a.pts);
    const A = ordenar(naA), B = ordenar(naB);
    const rebaixados = A.slice(-4), promovidos = B.slice(0, 4);
    rebaixados.forEach((x) => { novo[x.n] = { ...novo[x.n], liga: "serieB", forca: clampR(novo[x.n].forca - rand(1, 4), 40, 96) }; });
    promovidos.forEach((x) => { novo[x.n] = { ...novo[x.n], liga: "brasileirao", forca: clampR(novo[x.n].forca + rand(1, 4), 40, 96) }; });
    return { estado: novo, rebaixados: rebaixados.map((x) => x.n), promovidos: promovidos.map((x) => x.n) };
  }
  return { estado: novo, rebaixados: [], promovidos: [] };
}

export function continentalDaSelecao(nac) {
  const sulAmerica = ["BRA", "ARG", "URU", "COL", "CHI"];
  return sulAmerica.includes(nac) ? "Copa América" : "Eurocopa";
}

export function competicaoSelecaoDoAno(anosDesdeCopa, nac) {
  if (anosDesdeCopa >= 4) return { ...COMPETICOES_SELECAO.copa };
  if (anosDesdeCopa === 2) return { ...COMPETICOES_SELECAO.continental, nome: continentalDaSelecao(nac) };
  if (anosDesdeCopa === 3 || anosDesdeCopa === 1) return { ...COMPETICOES_SELECAO.eliminatorias };
  return { ...COMPETICOES_SELECAO.amistosos };
}

export function concorrentesSelecao(mundo, nac, posicao, meuOvr, meuNome) {
  const lista = (mundo?.jogadores || [])
    .filter((j) => !j.aposentado && j.nac === nac && j.posicao === posicao && j.idade <= 35)
    .map((j) => ({ nome: j.nome, clube: j.clubeNome, ovr: j.ovr, idade: j.idade, voce: false }));
  lista.push({ nome: meuNome, clube: null, ovr: meuOvr, voce: true });
  return lista.sort((a, b) => b.ovr - a.ovr).map((x, i) => ({ ...x, pos: i + 1 }));
}

export function avaliarConvocacao(c, mundo, ultimaTemporada, meuOvr, meuNome) {
  const fila = concorrentesSelecao(mundo, c.nacionalidade, c.posicao, meuOvr, meuNome);
  const minhaPos = fila.find((x) => x.voce)?.pos ?? 99;
  // quantos da posição costumam ser levados
  const vagas = c.posicao === "GOL" ? 3 : ["ZAG", "MEI", "MC"].includes(c.posicao) ? 4 : 3;
  let chance = minhaPos <= vagas ? 0.92 : minhaPos <= vagas + 2 ? 0.45 : minhaPos <= vagas + 5 ? 0.12 : 0.02;
  // forma recente pesa
  if (ultimaTemporada) {
    if (ultimaTemporada.nota >= 7.4) chance += 0.12;
    if (ultimaTemporada.nota < 6.5) chance -= 0.15;
    if (ultimaTemporada.campeaoLiga || ultimaTemporada.continental?.titulo) chance += 0.08;
  }
  // jogar em liga fraca atrapalha, liga forte ajuda
  const ligaMult = LIGAS[c.clube.liga]?.mult ?? 0.8;
  chance += (ligaMult - 0.85) * 0.35;
  // idade
  if (c.idade < 19) chance -= 0.25;
  if (c.idade > 33) chance -= 0.2;
  // já ser figura da seleção ajuda a se manter
  if ((c.selecao?.jogos || 0) > 25) chance += 0.1;
  return { convocado: Math.random() < clamp(chance, 0.01, 0.97), fila, minhaPos, vagas };
}

export function simularSelecao(c, comp, meuOvr, titular) {
  const nacInfo = nacDe(c.nacionalidade);
  const forcaSel = (nacInfo?.forcaSelecao ?? 80) + (meuOvr - 80) * 0.12;
  const pos = POSICOES.find((p) => p.id === c.posicao) || POSICOES[0];
  let campanha = null, titulo = false, jogos = comp.jogosBase;
  if (comp.id === "copa" || comp.id === "continental") {
    const r = forcaSel + (Math.random() - 0.5) * 22;
    if (r >= 93) { campanha = `CAMPEÃO — ${comp.nome}`; titulo = true; }
    else if (r >= 88) campanha = `Vice-campeão — ${comp.nome}`;
    else if (r >= 84) campanha = `Semifinalista — ${comp.nome}`;
    else if (r >= 78) campanha = `Eliminado nas quartas — ${comp.nome}`;
    else if (r >= 71) campanha = `Eliminado nas oitavas — ${comp.nome}`;
    else { campanha = `Eliminado na fase de grupos — ${comp.nome}`; jogos = 3; }
    if (!titulo && !campanha.includes("grupos")) jogos = campanha.includes("Semi") || campanha.includes("Vice") ? 6 : 5;
    if (titulo) jogos = comp.jogosBase;
  } else if (comp.id === "eliminatorias") {
    campanha = `${comp.nome} — ${Math.random() < 0.8 ? "classificação encaminhada" : "campanha irregular"}`;
  } else {
    campanha = "Amistosos de preparação";
  }
  if (!titular) jogos = Math.max(1, Math.round(jogos * 0.45));
  const nivel = clamp((meuOvr - 68) / 30, 0.15, 1);
  const gols = c.posicao === "GOL" ? 0 : poisson(pos.golBase * jogos * nivel * 0.9);
  const assist = poisson(pos.assistBase * jogos * nivel * (c.posicao === "GOL" ? 0.1 : 0.9));
  const cleanSheets = c.posicao === "GOL" ? poisson(jogos * clamp((meuOvr - 60) / 75, 0.1, 0.5)) : 0;
  return { comp: comp.id, nomeComp: comp.nome, icone: comp.icone, cor: comp.cor, campanha, titulo, jogos, gols, assist, cleanSheets, titular,
    nota: +clamp(6.3 + (meuOvr - 78) * 0.035 + ((gols + assist) / Math.max(1, jogos)) * 1.3 + (Math.random() - 0.5) * 0.5, 5.2, 9.7).toFixed(2) };
}

export function gerarTecnicoSelecao(nac) {
  const t = gerarTecnico({ forca: nacDe(nac)?.forcaSelecao ?? 80 });
  return { ...t, temporadas: 0 };
}

export function noticia(tipo, titulo, corpo, prioridade = 1) {
  return { tipo, titulo, corpo, prioridade, lida: false, id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}` };
}

export function gerarNoticias(c, reg, mundo, nome) {
  const n = [];
  const clube = c.clube.nome;
  // --- seus feitos ---
  (reg.titulosLista || []).forEach((t) => n.push(noticia("titulo", t, `Mais uma taça na sua galeria com a camisa do ${clube}.`, 3)));
  (reg.premios || []).filter((p) => p.doJogador).forEach((p) => n.push(noticia("premio", p.nome, `Você foi eleito. Seu nome circula entre os melhores do mundo.`, 3)));
  if (reg.postoBO && reg.postoBO <= 10) {
    n.push(noticia("destaque", `${reg.postoBO}º na disputa da Bola de Ouro`, reg.postoBO === 1 ? "Você é o melhor jogador do mundo nesta temporada." : `Entre os dez melhores do planeta nesta temporada.`, reg.postoBO <= 3 ? 3 : 2));
  }
  if (reg.jogadorArtilheiro) n.push(noticia("destaque", `Artilheiro d${reg.ligaNome === "Premier League" ? "a" : "o"} ${reg.ligaNome}`, `${reg.gols} gols — ninguém marcou mais que você.`, 3));
  // --- crítica e cobrança ---
  if ((reg.nota ?? 7) < 6.4) n.push(noticia("critica", "Imprensa cobra reação", `Sua média de ${reg.nota} na temporada virou assunto. A torcida do ${clube} espera mais.`, 2));
  if (reg.bateuMeta === false) n.push(noticia("tecnico", "Meta da temporada não cumprida", `A diretoria esperava mais do seu desempenho. A cobrança aumenta pro ano que vem.`, 2));
  // --- técnico ---
  if (reg.trocaTecnico) {
    const m = reg.trocaTecnico.motivo === "demitido" ? "foi demitido" : reg.trocaTecnico.motivo === "assediado" ? "aceitou proposta de um clube maior" : "encerrou seu ciclo";
    n.push(noticia("tecnico", `${reg.trocaTecnico.novo} é o novo técnico`, `${reg.trocaTecnico.antigo} ${m}. Você recomeça do zero com a nova comissão — o estilo dele é ${estiloTecnico(reg.trocaTecnico.estiloNovo).nome.toLowerCase()}.`, 3));
  }
  if (reg.resultadoPromessa) {
    n.push(noticia("tecnico", `Pacto com o técnico: ${reg.resultadoPromessa.cumpriu ? "cumprido" : "quebrado"}`, reg.resultadoPromessa.texto, reg.resultadoPromessa.culpaDoTecnico ? 3 : 2));
  }
  // --- lesão ---
  if (reg.lesaoTipo) n.push(noticia("lesao", reg.lesaoTipo.nome, `Você passou boa parte da temporada em recuperação. ${reg.lesaoTipo.gravidade >= 3 ? "Uma lesão dessas deixa marcas." : "Nada que o tempo não resolva."}`, reg.lesaoTipo.gravidade >= 3 ? 3 : 1));
  // --- clube ---
  if (reg.movimentoLigas?.promovidos?.length) {
    const meuSubiu = reg.movimentoLigas.promovidos.includes(clube);
    const meuCaiu = reg.movimentoLigas.rebaixados.includes(clube);
    if (meuSubiu) n.push(noticia("clube", `${clube} está de volta à elite!`, "O acesso foi conquistado. Outro patamar de adversários pela frente.", 3));
    else if (meuCaiu) n.push(noticia("clube", `${clube} é rebaixado`, "A queda para a segunda divisão muda tudo: vitrine menor, salários menores, decisão difícil pela frente.", 3));
    else n.push(noticia("mundo", "Acesso e rebaixamento definidos", `Sobem: ${reg.movimentoLigas.promovidos.join(", ")}. Caem: ${reg.movimentoLigas.rebaixados.join(", ")}.`, 0));
  }
  // --- mercado ---
  if (reg.valorMercado && reg.valorAnterior) {
    const dif = Math.round(((reg.valorMercado - reg.valorAnterior) / Math.max(1, reg.valorAnterior)) * 100);
    if (dif >= 30) n.push(noticia("mercado", `Seu valor de mercado disparou ${dif}%`, `Avaliado agora em $${formatarDinheiro(reg.valorMercado)}. Os grandes clubes notaram.`, 2));
    else if (dif <= -25) n.push(noticia("mercado", `Seu valor de mercado caiu ${Math.abs(dif)}%`, `Avaliado agora em $${formatarDinheiro(reg.valorMercado)}. Uma temporada assim cobra caro.`, 2));
  }
  if (c.contrato && c.contrato.restantes === 1) n.push(noticia("mercado", "Seu contrato acaba na próxima temporada", "Sem renovação, seu valor despenca e a diretoria pode aceitar qualquer proposta. Hora de sentar e negociar.", 3));
  // --- seleção ---
  if (reg.selecaoTemporada) {
    const s = reg.selecaoTemporada;
    n.push(noticia("selecao", s.titulo ? `CAMPEÃO — ${s.nomeComp || "seleção"}` : `${s.campanha}`, `${s.jogos} jogos e ${s.gols} gols defendendo a seleção nesta temporada.`, s.titulo ? 3 : 1));
  } else if (reg.copaResultado?.resultado === "Não convocado") {
    n.push(noticia("selecao", "Fora da lista da seleção", "O técnico optou por outros nomes na sua posição. Vai ter que render mais pra voltar.", 2));
  }
  // --- recordes ---
  const st = (c.statsPorClube || {})[clube];
  const rec = (c.recordesClube || {})[clube];
  if (st && rec && !rec.quebrado) {
    const faltam = rec.gols - st.gols + 1;
    if (faltam > 0 && faltam <= 12) n.push(noticia("recorde", `Faltam ${faltam} gols pro recorde do ${clube}`, `O recorde histórico do clube é de ${rec.gols} gols. Você já tem ${st.gols}.`, 2));
  }
  if (rec?.quebrado && rec.idadeQuebra === c.idade) {
    n.push(noticia("recorde", `MAIOR ARTILHEIRO DA HISTÓRIA DO ${clube.toUpperCase()}`, `Com ${st?.gols} gols, você entrou definitivamente na história do clube.`, 3));
  }
  // --- o mundo lá fora ---
  if (mundo) {
    const campeaoBO = (reg.rankingBO || [])[0];
    if (campeaoBO && !campeaoBO.voce) n.push(noticia("mundo", `${campeaoBO.nome} leva a Bola de Ouro`, `${campeaoBO.gols} gols e ${campeaoBO.assist} assistências pelo ${campeaoBO.clube}. O prêmio ficou com ele desta vez.`, 1));
    const rival = mundo.jogadores.find((j) => j.nome === c.rivalPosicao && !j.aposentado);
    if (rival && rival.gols >= 20) n.push(noticia("mundo", `${rival.nome} vive grande fase`, `Seu rival de geração fez ${rival.gols} gols pelo ${rival.clubeNome} nesta temporada. A comparação é inevitável.`, 1));
    const lenda = mundo.jogadores.find((j) => j.aposentado && j.carreira.gols > 200 && j.idade <= 40);
    if (lenda && Math.random() < 0.25) n.push(noticia("mundo", `${lenda.nome} pendura as chuteiras`, `Encerrou a carreira com ${lenda.carreira.gols} gols em ${lenda.carreira.jogos} jogos. Uma era acabou.`, 0));
  }
  return n.sort((a, b) => b.prioridade - a.prioridade);
}

export function gerarRelacoesVestiario(elenco, posicao, idade) {
  if (!elenco || elenco.length < 6) return {};
  const rel = {};
  const usados = new Set();
  const escolher = (filtro) => {
    const pool = elenco.filter((j) => !usados.has(j.id) && filtro(j));
    if (!pool.length) return null;
    const e = pick(pool); usados.add(e.id); return e;
  };
  // parceiro: alguém do setor ofensivo (ou do seu setor, se você for defensor)
  const ofensivos = ["PD", "PE", "MEI", "SA", "ATA", "MC"];
  const p = escolher((j) => (ofensivos.includes(posicao) ? ofensivos.includes(j.posicao) : true) && j.idade >= 20);
  if (p) rel.parceiro = { id: p.id, nome: p.nome, sintonia: rand(15, 40) };
  // pupilo: só se você já tiver alguma estrada
  if (idade >= 24) {
    const jovem = escolher((j) => j.idade <= 20);
    if (jovem) rel.pupilo = { id: jovem.id, nome: jovem.nome, ovrInicial: jovem.ovr, temporadas: 0 };
  }
  // desafeto: nem sempre existe
  if (Math.random() < 0.45) {
    const d = escolher((j) => j.idade >= 22);
    if (d) rel.desafeto = { id: d.id, nome: d.nome, atrito: rand(30, 55) };
  }
  return rel;
}

export function aplicarEfeitosVestiario(c, card, elenco) {
  const rel = c.relacoes || {};
  const eventos = [];
  // PARCEIRO: a sintonia cresce jogando junto e vira assistências extras
  if (rel.parceiro) {
    const ainda = (elenco || []).find((j) => j.id === rel.parceiro.id);
    if (!ainda) {
      eventos.push({ tipo: "parceiro", texto: `${rel.parceiro.nome} deixou o clube. A parceria que vocês tinham em campo acabou.` });
      delete c.relacoes.parceiro;
    } else {
      const ganho = rand(6, 14) + (card.nota > 7.2 ? 5 : 0);
      rel.parceiro.sintonia = clampR(rel.parceiro.sintonia + ganho, 0, 100);
      if (rel.parceiro.sintonia >= 75 && !rel.parceiro.consolidada) {
        rel.parceiro.consolidada = true;
        eventos.push({ tipo: "parceiro", texto: `A dupla que você forma com ${rel.parceiro.nome} virou assunto — vocês se entendem de olhos fechados.` });
      }
    }
  }
  // PUPILO: cresce mais rápido sob sua asa, e o que ele vira conta pra você
  if (rel.pupilo) {
    const j = (elenco || []).find((x) => x.id === rel.pupilo.id);
    if (!j) {
      eventos.push({ tipo: "pupilo", texto: `${rel.pupilo.nome}, o garoto que você apadrinhou, saiu do clube. Levou junto o que aprendeu com você.` });
      delete c.relacoes.pupilo;
    } else {
      rel.pupilo.temporadas = (rel.pupilo.temporadas || 0) + 1;
      j.ovr = clampR(j.ovr + rand(1, 3), 40, 96); // cresce acelerado
      const evolucao = j.ovr - rel.pupilo.ovrInicial;
      if (evolucao >= 15 && !rel.pupilo.formado) {
        rel.pupilo.formado = true;
        c.fama = clamp(c.fama + 5, 0, 100);
        eventos.push({ tipo: "pupilo", texto: `${rel.pupilo.nome} virou jogador de verdade (OVR ${j.ovr}) — e todo mundo sabe quem cuidou dele.` });
      }
    }
  }
  // DESAFETO: envenena o ambiente
  if (rel.desafeto) {
    const j = (elenco || []).find((x) => x.id === rel.desafeto.id);
    if (!j) {
      eventos.push({ tipo: "desafeto", texto: `${rel.desafeto.nome} foi embora. O vestiário respira melhor sem aquele atrito.` });
      c.elencoMoral = clampR((c.elencoMoral ?? 60) + 8, 0, 100);
      delete c.relacoes.desafeto;
    } else {
      rel.desafeto.atrito = clampR(rel.desafeto.atrito + rand(-6, 10), 0, 100);
      c.elencoMoral = clampR((c.elencoMoral ?? 60) - Math.round(rel.desafeto.atrito * 0.07), 0, 100);
      if (rel.desafeto.atrito >= 80 && Math.random() < 0.4) {
        c.calorMidia = clampR((c.calorMidia ?? 20) + 15, 0, 100);
        c.elencoMoral = clampR((c.elencoMoral ?? 60) - 8, 0, 100);
        eventos.push({ tipo: "desafeto", texto: `Bate-boca com ${rel.desafeto.nome} vazou pra imprensa. O clima no vestiário azedou de vez.` });
      }
    }
  }
  return eventos;
}

export function bonusParceria(c) {
  const s = c.relacoes?.parceiro?.sintonia || 0;
  return { assist: Math.round(s / 28), gols: Math.round(s / 45) };
}

export function riscoLesao(desgaste) {
  const d = desgaste ?? 0;
  if (d >= 2.5) return { label: "Crítico", cor: "#D6483F" };
  if (d >= 1.5) return { label: "Alto", cor: "#f59e0b" };
  if (d >= 0.7) return { label: "Moderado", cor: "#eab308" };
  return { label: "Baixo", cor: "#12A876" };
}

export function statusSelecao(ovr, idade, anosDesdeCopa) {
  if (idade < 18) return { label: "Fora dos radares", cor: "#6b7280" };
  if (ovr >= 85) return { label: "Titular absoluto", cor: "#D8B44A" };
  if (ovr >= 80) return { label: "Convocado com regularidade", cor: "#12A876" };
  if (ovr >= 74) return { label: "Na mira do técnico", cor: "#3b82f6" };
  if (ovr >= 68) return { label: "Cotado pra base/lista extra", cor: "#a1a1aa" };
  return { label: "Fora dos planos por enquanto", cor: "#6b7280" };
}

export function sortearAdversario(c, competicao) {
  if (competicao === "estadual") {
    const pool = CLUBES.filter((x) => x.estado === c.clube.estado && x.nome !== c.clube.nome);
    return pool.length ? pick(pool).nome : "rival estadual";
  }
  if (competicao === "copaNacional" || competicao === "copinha") {
    const brasil = c.clube.liga === "brasileirao" || c.clube.liga === "serieB";
    const ligasPais = brasil ? ["brasileirao", "serieB"] : [c.clube.liga];
    const pool = CLUBES.filter((x) => ligasPais.includes(x.liga) && x.nome !== c.clube.nome);
    return pool.length ? pick(pool).nome : "adversário nacional";
  }
  if (competicao === "continental") {
    const pool = CLUBES.filter((x) => x.liga === c.clube.liga && x.nome !== c.clube.nome);
    return pool.length ? pick(pool).nome : "adversário continental";
  }
  if (competicao === "copaDoMundo") {
    const outras = NACIONALIDADES.filter((n) => n.id !== c.nacionalidade);
    return outras.length ? pick(outras).label : "seleção rival";
  }
  if (competicao === "classico") {
    const pool = CLUBES.filter((x) => x.liga === c.clube.liga && x.nome !== c.clube.nome);
    return pool.length ? pick(pool).nome : "rival";
  }
  const poolGeral = CLUBES.filter((x) => x.nome !== c.clube.nome);
  return poolGeral.length ? pick(poolGeral).nome : "rival";
}

export function gerarPlacar(venceu) {
  if (venceu) { const adv = rand(0, 2); const meu = adv + rand(1, 2); return `${meu}x${adv}`; }
  const meu = rand(0, 2); const adv = meu + rand(1, 2); return `${meu}x${adv}`;
}

export function sortearConcorrente(clube, elenco, posicao) {
  // se houver elenco, o concorrente é um companheiro real que joga na sua posição
  if (elenco && posicao) {
    const mesmaPos = elenco.filter((j) => j.posicao === posicao).sort((a, b) => b.ovr - a.ovr);
    if (mesmaPos.length) return { nome: mesmaPos[0].nome, forca: mesmaPos[0].ovr, doElenco: true };
  }
  return { nome: pick(RIVAIS_PREMIO), forca: clampR(clube.forca + rand(-6, 6), 40, 96) };
}

export function distribuirInteiro(total, pesos) {
  const soma = pesos.reduce((a, b) => a + b, 0);
  if (soma <= 0 || total <= 0) return pesos.map(() => 0);
  const exatos = pesos.map((p) => (total * p) / soma);
  const base = exatos.map((e) => Math.floor(e));
  const resto = total - base.reduce((a, b) => a + b, 0);
  const ordem = exatos.map((e, i) => ({ i, frac: e - Math.floor(e) })).sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < resto; k++) base[ordem[k % ordem.length].i] += 1;
  return base;
}

export function competicoesDaTemporada(c, card) {
  const brasil = c.clube.liga === "brasileirao" || c.clube.liga === "serieB";
  const comps = [];
  if (brasil) {
    if (c.idade <= 18) comps.push({ id: "copinha", nome: "Copa São Paulo", icone: "🌟", cor: "#8b5cf6", peso: 5, dificuldade: 1.35 });
    if (c.clube.estado) comps.push({ id: "estadual", nome: ESTADUAIS[c.clube.estado] || "Estadual", icone: "🗺️", cor: "#3b82f6", peso: 13, dificuldade: 1.25 });
    comps.push({ id: "liga", nome: LIGAS[c.clube.liga].nome, icone: "⚽", cor: "#12A876", peso: 38, dificuldade: 1, principal: true });
    comps.push({ id: "copaNacional", nome: "Copa do Brasil", icone: "🏆", cor: "#D8B44A", peso: 8, dificuldade: 0.95 });
  } else {
    comps.push({ id: "liga", nome: LIGAS[c.clube.liga].nome, icone: "⚽", cor: "#12A876", peso: 38, dificuldade: 1, principal: true });
    comps.push({ id: "copaNacional", nome: (COMPS_PAIS[c.clube.liga] || {}).copa || "Copa Nacional", icone: "🏆", cor: "#D8B44A", peso: 7, dificuldade: 1.05 });
  }
  if (card.continental || card.continentalPendente) {
    const nome = card.continental?.nome || card.continentalPendente?.nome || LIGAS[c.clube.liga].continental;
    comps.push({ id: "continental", nome, icone: "🌍", cor: "#f59e0b", peso: 9, dificuldade: 0.8 });
  }
  if (card.mundial) comps.push({ id: "mundial", nome: "Mundial de Clubes", icone: "🌐", cor: "#ec4899", peso: 5, dificuldade: 0.75 });
  return comps;
}

export function dividirPorCompeticao(c, card) {
  const comps = competicoesDaTemporada(c, card);
  if (!comps.length) return [];
  // jogos: proporcional ao tamanho típico de cada competição
  const jogosPorComp = distribuirInteiro(card.jogos, comps.map((k) => k.peso));
  // gols/assistências: proporcional a (jogos × facilidade de pontuar naquela competição)
  const pesoOfensivo = comps.map((k, i) => jogosPorComp[i] * k.dificuldade);
  const golsPorComp = distribuirInteiro(card.gols, pesoOfensivo);
  const assistPorComp = distribuirInteiro(card.assist, pesoOfensivo);
  const csPorComp = distribuirInteiro(card.cleanSheets || 0, comps.map((k, i) => jogosPorComp[i] * (2 - k.dificuldade)));
  const mecPorComp = distribuirInteiro(card.melhorEmCampo || 0, pesoOfensivo);
  return comps.map((k, i) => ({
    id: k.id, nome: k.nome, icone: k.icone, cor: k.cor,
    jogos: jogosPorComp[i], gols: golsPorComp[i], assist: assistPorComp[i],
    cleanSheets: csPorComp[i], melhorEmCampo: mecPorComp[i],
    // nota levemente ajustada pela dificuldade da competição, ancorada na nota do ano
    nota: +clamp(card.nota + (k.dificuldade - 1) * 0.6 + (Math.random() - 0.5) * 0.18, 5.2, 9.9).toFixed(2),
  })).filter((k) => k.jogos > 0);
}

export function agregarPorCompeticao(temporadas) {
  const mapa = {};
  const somar = (k) => {
    if (!k || !k.jogos) return;
    if (!mapa[k.nome]) mapa[k.nome] = { nome: k.nome, icone: k.icone, cor: k.cor, jogos: 0, gols: 0, assist: 0, cleanSheets: 0, melhorEmCampo: 0, somaNota: 0, temporadas: 0, selecao: k.id === "selecao" };
    const m = mapa[k.nome];
    m.jogos += k.jogos; m.gols += k.gols; m.assist += k.assist;
    m.cleanSheets += k.cleanSheets || 0; m.melhorEmCampo += k.melhorEmCampo || 0;
    m.somaNota += (k.nota || 0) * k.jogos; m.temporadas += 1;
  };
  temporadas.forEach((t) => {
    (t.porCompeticao || []).forEach(somar);
    somar(t.selecaoTemporada);
  });
  return Object.values(mapa)
    .map((m) => ({ ...m, notaMedia: m.jogos ? +(m.somaNota / m.jogos).toFixed(2) : 0 }))
    .sort((a, b) => (a.selecao === b.selecao ? b.jogos - a.jogos : a.selecao ? 1 : -1));
}

export function statsSelecao(c, card) {
  const r = card.copaResultado;
  if (!r || r.resultado === "Não convocado") return null;
  const res = r.resultado || "";
  const jogos = r.titulo ? 7 : res.includes("Vice") ? 7 : res.includes("3º") || res.includes("4º") ? 7 : res.includes("semi") ? 6 : res.includes("quartas") ? 5 : res.includes("oitavas") ? 4 : 3;
  const pos = POSICOES.find((p) => p.id === c.posicao);
  const nivel = clamp((card.ovr - 70) / 30, 0.15, 1);
  const gols = c.posicao === "GOL" ? 0 : poisson(pos.golBase * jogos * nivel * 0.85);
  const assist = poisson(pos.assistBase * jogos * nivel * (c.posicao === "GOL" ? 0.1 : 0.9));
  const cleanSheets = c.posicao === "GOL" ? poisson(jogos * clamp((card.ovr - 60) / 70, 0.1, 0.5)) : 0;
  return {
    id: "selecao", nome: `Seleção ${NACIONALIDADES.find((n) => n.id === c.nacionalidade)?.label || ""}`.trim(),
    icone: "🌎", cor: "#22D3EE", jogos, gols, assist, cleanSheets, melhorEmCampo: 0,
    nota: +clamp(card.nota + (Math.random() - 0.5) * 0.4, 5.2, 9.9).toFixed(2),
    campanha: r.resultado, titulo: !!r.titulo,
  };
}

export function simularTemporada(c) {
  const pos = POSICOES.find((p) => p.id === c.posicao);
  const ovr = clamp(calcOVR(c.attrs, c.posicao, c.papelTatico) + c.forma, 40, 99);
  const liga = LIGAS[c.clube.liga];

  const energiaFator = clamp((c.energia ?? 100) / 100, 0.55, 1);
  const confiancaFator = clamp((c.tecnicoConfianca ?? 60) / 100, 0.45, 1);
  const titularidadeFator = clamp((c.titularidade ?? 100) / 100, 0.55, 1);
  let jogos = c.abordagem === "limite" ? rand(38, 46) : c.abordagem === "dedicado" ? rand(28, 38) : rand(30, 44);
  jogos = Math.round(jogos * (0.75 + 0.25 * confiancaFator) * titularidadeFator);
  const persona = PERSONALIDADES.find((p) => p.id === c.personalidade);
  const rotina = ROTINAS_FISICAS.find((r) => r.id === c.rotinaFisica) || ROTINAS_FISICAS[1];
  let lesaoBase = (c.idade >= 31 ? 0.2 : 0.11) * (persona?.risco || 1) * (1 + (c.desgaste || 0) * 0.15) * (c.staff?.personalTrainer ? 0.75 : 1);
  lesaoBase *= (1 + (c.sequela || 0)); // corpo já castigado se machuca mais
  lesaoBase *= rotina.riscoMult;
  if (c.abordagem === "limite") lesaoBase *= 1.45;
  if (c.abordagem === "dedicado") lesaoBase *= 0.7;
  lesaoBase *= (2 - energiaFator);
  const lesao = Math.random() < clamp(lesaoBase, 0, 0.65);
  const lesaoTipo = lesao ? sortearLesao(c) : null;
  if (lesao) jogos -= rand(lesaoTipo.jogosFora[0], lesaoTipo.jogosFora[1]);
  jogos = Math.max(6, jogos);

  const ligaMult = ligaMultEfetivo(c.clube, liga);
  const dificuldade = 1.25 - ligaMult * 0.45;
  const entrosamentoFator = 0.9 + clamp(c.entrosamento ?? 20, 0, 100) / 500;
  const nivelFator = Math.pow(Math.max(0.25, (ovr - 55) / 35), 1.6) * dificuldade * (0.85 + energiaFator * 0.15) * entrosamentoFator;
  const bonusFin = c.focoTreino === "finalizacao" ? 1.12 : 1;
  // goleiros raramente marcam, mas os com bom "Reflexos" (finalização) batendo pênalti/falta têm uma chance mínima
  const chanceGolGoleiro = c.posicao === "GOL" ? clamp((c.attrs.finalizacao - 60) / 900, 0, 0.05) : 0;
  const parc = bonusParceria(c);
  const gols = (c.posicao === "GOL" ? poisson(chanceGolGoleiro * jogos) : poisson(pos.golBase * nivelFator * jogos * bonusFin)) + (c.posicao === "GOL" ? 0 : parc.gols);
  const xG = c.posicao === "GOL" ? +(chanceGolGoleiro * jogos).toFixed(1) : +(pos.golBase * nivelFator * jogos * bonusFin).toFixed(1);
  const assist = poisson(pos.assistBase * nivelFator * jogos * (c.posicao === "GOL" ? 0.1 : c.focoTreino === "passe" ? 1.12 : 1)) + (c.posicao === "GOL" ? 0 : parc.assist);
  const cleanSheets = c.posicao === "GOL" ? poisson(jogos * clamp((ovr - 55) / 60, 0.1, 0.55)) : 0;

  const taxaConversao = clamp(0.14 + (c.attrs.finalizacao - 50) * 0.003, 0.08, 0.32);
  const chutes = c.posicao === "GOL" ? 0 : Math.max(gols, Math.round(gols / taxaConversao));
  const forcaClubeEfetiva = forcaEfetivaClube(c, c.clube);
  const posseMedia = Math.round(clamp(45 + (ligaMult - 0.85) * 30 + (forcaClubeEfetiva - 75) * 0.35 + rand(-5, 5), 32, 72));
  const passeCerto = Math.round(clamp(58 + (c.attrs.passe - 50) * 0.55, 38, 96));
  const passesTentados = Math.round(jogos * (35 + c.attrs.passe * 0.4));
  const passesCompletos = Math.round(passesTentados * (passeCerto / 100));
  const desarmesTentados = c.posicao === "GOL" ? 0 : Math.round(jogos * (2.5 + c.attrs.defesa * 0.05));
  const desarmesCerteiros = Math.round(desarmesTentados * clamp(0.55 + c.attrs.velocidade * 0.002, 0.4, 0.9));

  let nota = 6.1 + (ovr - 70) * 0.045 + ((gols + assist) / jogos) * 1.4 + (Math.random() - 0.5) * 0.5;
  if (c.posicao === "GOL") nota = 6.1 + (ovr - 70) * 0.05 + (cleanSheets / jogos) * 2.2 + (Math.random() - 0.5) * 0.5;
  // Ajuste fino pela ficha técnica real (passes e desarmes), acima/abaixo de uma média razoável
  if (passesTentados > 0) nota += ((passesCompletos / passesTentados) - 0.78) * 1.2;
  if (desarmesTentados > 0) nota += ((desarmesCerteiros / desarmesTentados) - 0.6) * 0.8;
  nota = clamp(nota, 5.4, 9.8);
  const melhorEmCampo = poisson(jogos * clamp((nota - 7.1) / 6, 0, 0.3));
  const notaMediaPosicao = +(6.35 + (dificuldade - 0.85) * 0.3).toFixed(2);

  const forcaTotal = forcaClubeEfetiva + (ovr - 75) * 0.55 + (Math.random() - 0.5) * 8;
  const teto = c.clube.liga === "espanha" || c.clube.liga === "inglaterra" ? 96 : 88;
  let posLiga;
  if (forcaTotal >= teto - 3) posLiga = rand(1, 2);
  else if (forcaTotal >= teto - 9) posLiga = rand(1, 4);
  else if (forcaTotal >= teto - 15) posLiga = rand(3, 8);
  else posLiga = rand(6, 16);
  const campeaoLiga = posLiga === 1;

  let continental = null, continentalPendente = null;
  if (posLiga <= 6 || Math.random() < 0.45) {
    const r = forcaTotal + (Math.random() - 0.5) * 12;
    const corte = liga.continental === "Champions League" ? 92 : 84;
    if (r >= corte - 12) {
      const estagio = r >= corte ? "final" : r >= corte - 6 ? "semi" : "quartas";
      continentalPendente = { nome: liga.continental, estagio, forcaBase: r, corte, adversario: sortearAdversario(c, "continental") };
    }
    else continental = { nome: liga.continental, resultado: "Eliminado cedo", titulo: false };
  }

  let copaNacional = null, copaNacionalPendente = null;
  if (Math.random() < 0.6) {
    const r = forcaTotal + (Math.random() - 0.5) * 14;
    if (r >= 80) copaNacionalPendente = { forcaBase: r, adversario: sortearAdversario(c, "copaNacional") };
  }

  // Mundial de Clubes — só disputa quem se classificou (campeão de liga ou continental na temporada anterior)
  let mundial = null;
  if (c.elegivelMundial) {
    const r = forcaTotal + (Math.random() - 0.5) * 10;
    let resultado, titulo = false;
    if (r >= 90) { resultado = "CAMPEÃO DO MUNDIAL DE CLUBES"; titulo = true; }
    else if (r >= 84) resultado = "Vice-campeão do Mundial de Clubes";
    else if (r >= 78) resultado = "Semifinalista do Mundial de Clubes";
    else if (r >= 70) resultado = "Eliminado nas quartas do Mundial de Clubes";
    else resultado = "Eliminado na fase de grupos do Mundial de Clubes";
    mundial = { resultado, titulo };
  }

  // título de liga em disputa acirrada (rodada final decisiva)
  const ligaDecisiva = posLiga <= 2;

  // artilheiro fictício da liga (comparado ao próprio jogador)
  const golsRivalLiga = rand(14, 30) + Math.round((1 - liga.mult) * -6);
  const jogadorArtilheiro = gols > golsRivalLiga && gols > 0;
  const artilheiro = jogadorArtilheiro ? { nome: "Você", gols } : { nome: pick(RIVAIS_PREMIO), gols: golsRivalLiga };

  return { ovr, jogos, gols, xG, assist, cleanSheets, melhorEmCampo, nota: +nota.toFixed(2), notaMediaPosicao, chutes, posseMedia, passeCerto, passesTentados, passesCompletos, desarmesTentados, desarmesCerteiros, posLiga, campeaoLiga, continental, continentalPendente, copaNacional, copaNacionalPendente, mundial, ligaDecisiva, lesao, lesaoTipo, ligaNome: liga.nome, ligaMult: liga.mult, forcaTotal, artilheiro, jogadorArtilheiro };
}

export function nomeMundo(nac) {
  const n = NOMES_MUNDO[nac] || NOMES_MUNDO.BRA;
  return `${pick(n.pri)} ${pick(n.sob)}`;
}

export function gerarMundoJogadores() {
  const jogadores = [];
  let id = 1;
  const clubesRelevantes = CLUBES.filter((c) => c.liga !== "serieB");
  clubesRelevantes.forEach((clube) => {
    const n = clube.forca >= 85 ? 4 : clube.forca >= 78 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const idade = rand(18, 32);
      const teto = clampR(Math.round(clube.forca + rand(-6, 9)), 58, 96);
      const ovr = idade < 24 ? clampR(teto - rand(4, 14), 52, 92) : clampR(teto - rand(0, 4), 55, 95);
      const nac = clube.liga === "brasileirao" ? (Math.random() < 0.8 ? "BRA" : pick(NACS_MUNDO)) : (Math.random() < 0.55 ? { inglaterra: "ENG", espanha: "ESP", italia: "ITA", alemanha: "ALE", franca: "FRA", portugal: "POR" }[clube.liga] || pick(NACS_MUNDO) : pick(NACS_MUNDO));
      jogadores.push({
        id: id++, nome: nomeMundo(nac), nac, posicao: pick(POSICOES).id,
        idade, ovr, potencial: Math.max(ovr, teto), picoIdade: rand(26, 30), clubeNome: clube.nome, liga: clube.liga,
        gols: 0, assist: 0, jogos: 0, nota: 0,
        carreira: { gols: 0, assist: 0, jogos: 0, titulos: 0, bolasDeOuro: 0, premios: 0, temporadas: 0 },
        aposentado: false,
      });
    }
  });
  return { jogadores, temporada: 0, historicoBolaDeOuro: [] };
}

export function simularTemporadaMundo(mundo) {
  const jogadores = mundo.jogadores.map((j) => {
    if (j.aposentado) return j;
    const p = { ...j };
    const clube = CLUBES.find((x) => x.nome === p.clubeNome) || { forca: 70, liga: p.liga };
    const liga = LIGAS[clube.liga] || { mult: 0.8 };
    const pos = POSICOES.find((x) => x.id === p.posicao) || POSICOES[0];
    // rendimento da temporada
    const jogos = clampR(Math.round(rand(24, 40) * clamp(p.ovr / 80, 0.7, 1.1)), 8, 46);
    const nivel = Math.pow(Math.max(0.25, (p.ovr - 55) / 35), 1.55) * (1.25 - liga.mult * 0.45);
    const gols = p.posicao === "GOL" ? 0 : poisson(pos.golBase * nivel * jogos);
    const assist = poisson(pos.assistBase * nivel * jogos * (p.posicao === "GOL" ? 0.1 : 1));
    const nota = +clamp(6.1 + (p.ovr - 70) * 0.045 + ((gols + assist) / Math.max(1, jogos)) * 1.4 + (Math.random() - 0.5) * 0.5, 5.3, 9.6).toFixed(2);
    p.jogos = jogos; p.gols = gols; p.assist = assist; p.nota = nota;
    p.carreira = { ...p.carreira, gols: p.carreira.gols + gols, assist: p.carreira.assist + assist, jogos: p.carreira.jogos + jogos, temporadas: p.carreira.temporadas + 1 };
    // evolução / declínio
    p.idade += 1;
    if (p.idade <= p.picoIdade) p.ovr = clampR(p.ovr + Math.max(0, Math.round((p.potencial - p.ovr) * 0.28)) + rand(0, 1), 40, 99);
    else p.ovr = clampR(p.ovr - rand(0, 2) - Math.max(0, Math.round((p.idade - p.picoIdade - 2) * 0.6)), 40, 99);
    // aposentadoria
    if (p.idade >= 34 && (p.idade >= 39 || Math.random() < (p.idade - 33) * 0.2)) { p.aposentado = true; return p; }
    // transferência: quem cresceu muito acima do clube tende a sair
    const gap = p.ovr - clube.forca;
    if (gap > 5 && Math.random() < 0.35) {
      const destinos = CLUBES.filter((x) => x.liga !== "serieB" && x.nome !== p.clubeNome && Math.abs(x.forca - p.ovr) <= 6);
      if (destinos.length) { const d = pick(destinos); p.clubeNome = d.nome; p.liga = d.liga; }
    } else if (gap < -10 && Math.random() < 0.3) {
      const destinos = CLUBES.filter((x) => x.nome !== p.clubeNome && Math.abs(x.forca - p.ovr) <= 7);
      if (destinos.length) { const d = pick(destinos); p.clubeNome = d.nome; p.liga = d.liga; }
    }
    return p;
  });
  // repõe os aposentados com jovens promessas, mantendo a população estável
  const aposentadosAgora = jogadores.filter((j) => j.aposentado).length - mundo.jogadores.filter((j) => j.aposentado).length;
  let proxId = Math.max(0, ...mundo.jogadores.map((j) => j.id)) + 1;
  for (let i = 0; i < Math.max(0, aposentadosAgora); i++) {
    const clube = pick(CLUBES.filter((c) => c.liga !== "serieB"));
    const nac = pick(NACS_MUNDO);
    const teto = clampR(Math.round(clube.forca + rand(-4, 12)), 60, 96);
    jogadores.push({
      id: proxId++, nome: nomeMundo(nac), nac, posicao: pick(POSICOES).id,
      idade: rand(16, 19), ovr: clampR(teto - rand(10, 20), 48, 74), potencial: teto, picoIdade: rand(26, 30),
      clubeNome: clube.nome, liga: clube.liga, gols: 0, assist: 0, jogos: 0, nota: 0,
      carreira: { gols: 0, assist: 0, jogos: 0, titulos: 0, bolasDeOuro: 0, premios: 0, temporadas: 0 }, aposentado: false,
    });
  }
  return { ...mundo, jogadores, temporada: (mundo.temporada || 0) + 1 };
}

export function scoreBolaDeOuro({ ovr, gols, assist, nota, ligaMult, titulos = 0 }) {
  return ovr * ligaMult + (gols + assist) * ligaMult * 0.6 + (nota - 7) * 10 + titulos * 9;
}

export function scoreJogadorMundo(j) {
  const liga = LIGAS[j.liga] || { mult: 0.8 };
  return scoreBolaDeOuro({ ovr: j.ovr, gols: j.gols, assist: j.assist, nota: j.nota, ligaMult: liga.mult });
}

export function rankingBolaDeOuro(mundo, meuCard, meuNome, titulosMeus) {
  if (!mundo) return [];
  const lista = mundo.jogadores.filter((j) => !j.aposentado && j.jogos > 0).map((j) => ({
    nome: j.nome, clube: j.clubeNome, posicao: j.posicao, ovr: j.ovr, gols: j.gols, assist: j.assist, nota: j.nota,
    score: scoreJogadorMundo(j), voce: false,
  }));
  if (meuCard) lista.push({
    nome: meuNome, clube: meuCard.clube, posicao: meuCard.posicao, ovr: meuCard.ovr, gols: meuCard.gols, assist: meuCard.assist, nota: meuCard.nota,
    score: scoreBolaDeOuro({ ovr: meuCard.ovr, gols: meuCard.gols, assist: meuCard.assist, nota: meuCard.nota, ligaMult: meuCard.ligaMult, titulos: titulosMeus || 0 }), voce: true,
  });
  return lista.sort((a, b) => b.score - a.score).map((x, i) => ({ ...x, pos: i + 1 }));
}

export function artilhariaLiga(mundo, ligaId, meuCard, meuNome) {
  if (!mundo) return [];
  const lista = mundo.jogadores.filter((j) => !j.aposentado && j.liga === ligaId && j.gols > 0)
    .map((j) => ({ nome: j.nome, clube: j.clubeNome, gols: j.gols, assist: j.assist, voce: false }));
  if (meuCard && meuCard.gols > 0) lista.push({ nome: meuNome, clube: meuCard.clube, gols: meuCard.gols, assist: meuCard.assist, voce: true });
  return lista.sort((a, b) => b.gols - a.gols || b.assist - a.assist).map((x, i) => ({ ...x, pos: i + 1 }));
}

export function rankingPorPosicao(mundo, posicao, meuOvr, meuNome, meuClube) {
  if (!mundo) return [];
  const lista = mundo.jogadores.filter((j) => !j.aposentado && j.posicao === posicao)
    .map((j) => ({ nome: j.nome, clube: j.clubeNome, ovr: j.ovr, idade: j.idade, voce: false }));
  if (meuOvr) lista.push({ nome: meuNome, clube: meuClube, ovr: meuOvr, voce: true });
  return lista.sort((a, b) => b.ovr - a.ovr).map((x, i) => ({ ...x, pos: i + 1 }));
}

export function escolherRivalDoMundo(mundo, meuOvr, idAtual) {
  if (!mundo) return null;
  const cands = mundo.jogadores.filter((j) => !j.aposentado && j.id !== idAtual && Math.abs(j.ovr - meuOvr) <= 7 && j.idade <= 32);
  if (!cands.length) return null;
  return pick(cands);
}

export function avaliarPremios(card, posicao, copaTitulo, nomeJogador, nomeRival, postoBolaDeOuro) {
  const premios = [];
  const valor = (card.gols + card.assist) * card.ligaMult;
  const grandeTitulo = card.campeaoLiga || card.continental?.titulo || copaTitulo;
  const score = card.ovr * card.ligaMult + valor * 0.6 + (grandeTitulo ? 9 : 0) + (card.nota - 7) * 10;
  const rival = nomeRival || pick(RIVAIS_PREMIO);

  if (card.nota >= 7.2) {
    const venceu = card.nota >= 7.6 && Math.random() < 0.6;
    premios.push({ nome: `Melhor jogador d${card.ligaNome === "Premier League" ? "a" : "o"} ${card.ligaNome}`, vencedor: venceu ? nomeJogador : pick(RIVAIS_PREMIO), doJogador: venceu });
  }
  if (card.nota >= 7.4 && Math.random() < 0.5) {
    const venceu = Math.random() < 0.5;
    premios.push({ nome: `Melhor ${POSICOES.find((p) => p.id === posicao).label} do ano`, vencedor: venceu ? nomeJogador : rival, doJogador: venceu });
  }
  if (posicao === "GOL" && card.nota >= 7.4 && grandeTitulo && card.ligaMult >= 0.85 && Math.random() < 0.5) premios.push({ nome: "Luva de Ouro", vencedor: nomeJogador, doJogador: true });
  if (card.gols * card.ligaMult >= 26 && Math.random() < 0.7) premios.push({ nome: "Chuteira de Ouro", vencedor: nomeJogador, doJogador: true });
  // Com o mundo vivo, a Bola de Ouro é decidida pela COLOCAÇÃO REAL no ranking, não por sorteio
  if (postoBolaDeOuro != null) {
    if (postoBolaDeOuro === 1) {
      premios.push({ nome: "BOLA DE OURO", vencedor: nomeJogador, doJogador: true, bolaDeOuro: true, rivalConcorrente: rival, posicaoRanking: 1 });
      premios.push({ nome: "The Best FIFA", vencedor: Math.random() < 0.75 ? nomeJogador : rival, doJogador: Math.random() < 0.75 });
    } else if (postoBolaDeOuro <= 3) {
      premios.push({ nome: `Bola de Prata (${postoBolaDeOuro}º do mundo)`, vencedor: nomeJogador, doJogador: true, posicaoRanking: postoBolaDeOuro });
      premios.push({ nome: "BOLA DE OURO", vencedor: rival, doJogador: false, rivalConcorrente: rival });
    } else if (postoBolaDeOuro <= 10) {
      premios.push({ nome: `Top 10 da Bola de Ouro (${postoBolaDeOuro}º)`, vencedor: nomeJogador, doJogador: true, posicaoRanking: postoBolaDeOuro });
    }
  } else if (score >= 112 && card.ligaMult >= 0.88) {
    const venceu = Math.random() < 0.5;
    premios.push({ nome: "BOLA DE OURO", vencedor: venceu ? nomeJogador : rival, doJogador: venceu, bolaDeOuro: venceu, rivalConcorrente: rival });
    const venceuBest = venceu ? Math.random() < 0.7 : Math.random() < 0.3;
    premios.push({ nome: "The Best FIFA", vencedor: venceuBest ? nomeJogador : pick(RIVAIS_PREMIO), doJogador: venceuBest });
  } else if (score >= 102 && card.ligaMult >= 0.82) {
    premios.push({ nome: "Bola de Prata (Top 3 mundial)", vencedor: nomeJogador, doJogador: true });
  }
  if (card.nota >= 7.5 && Math.random() < 0.5) premios.push({ nome: "Seleção do Ano (FIFA FIFPro)", vencedor: nomeJogador, doJogador: true });
  return premios;
}

export function veredito(c, temporadas) {
  const s = {
    titulos: c.titulos, bolasDeOuro: c.bolasDeOuro, copas: c.copasDoMundo, premios: c.premiosIndividuais, pico: c.picoOvr,
    pontosCopa: c.pontosCopa || 0,
    melhorTemporada: Math.max(0, ...temporadas.map((t) => t.gols)),
    jogouElite: temporadas.some((t) => t.ligaMult >= 0.95),
  };
  let n = 1;
  if (s.melhorTemporada >= 15 || s.titulos >= 1) n = 2;
  if (s.titulos >= 3 && s.pico >= 82) n = 3;
  if (s.titulos >= 5 && s.pico >= 85 && s.jogouElite) n = 4;
  if (s.titulos >= 7 && s.pico >= 87 && (s.premios >= 2 || s.pontosCopa >= 2)) n = 5;
  if (s.titulos >= 9 && s.pico >= 89 && (s.premios >= 4 || s.pontosCopa >= 3)) n = 6;
  if (s.bolasDeOuro >= 1 && s.titulos >= 10 && s.pontosCopa >= 1) n = 7;
  if (s.bolasDeOuro >= 2 && s.titulos >= 12 && s.pontosCopa >= 2) n = 8;
  if (s.bolasDeOuro >= 3 && s.titulos >= 14 && (s.copas >= 1 || s.pontosCopa >= 5)) n = 9;
  if (s.bolasDeOuro >= 5 && s.titulos >= 16 && (s.copas >= 1 || s.pontosCopa >= 8)) n = 10;
  if (s.bolasDeOuro >= 7 && s.titulos >= 20 && (s.copas >= 2 || s.pontosCopa >= 13)) n = 11;
  return NIVEIS.find((x) => x.n === n);
}

export function logHist(c, txt) { c.historico = [...(c.historico || []), { idade: c.idade, txt }]; }

export function rodarEventoClube(c) {
  if (Math.random() >= 0.3) return null;
  const ev = pick(EVENTOS_CLUBE);
  const clubeKey = c.clube.nome;
  c.investimentosClube = { ...(c.investimentosClube || {}), [clubeKey]: clampR(((c.investimentosClube || {})[clubeKey] || 0) + ev.delta, -15, 20) };
  logHist(c, `📰 ${ev.txt} (${ev.delta > 0 ? "+" : ""}${ev.delta} de força pro ${c.clube.nome}).`);
  return ev;
}

export function categorizarEvento(txt) {
  const t = txt.toLowerCase();
  if (/x .+: (vitória|derrota) por/.test(t)) return "confrontos";
  if (t.includes("campeão") || t.includes("campeã") || t.includes("bola de ouro") || t.includes("3º lugar na copa") || t.includes("4º lugar na copa")) return "titulos";
  if (t.includes("🩹") || t.includes("🤕") || t.includes("💪") || t.includes("🩺") || t.includes("lesão") || t.includes("lesao")) return "lesoes";
  if (t.includes("transferido") || t.includes("emprestado") || t.includes("passou a vestir a camisa") || t.includes("compra definitiva") || t.includes("pediu para sair") || t.includes("assinou contrato") || t.includes("contrato com o") || t.includes("negociação de contrato")) return "transferencias";
  if (t.includes("📱") || t.includes("🔥 provocou") || t.includes("🕊️ elogiou") || t.includes("seguir") || t.includes("coletiva de imprensa")) return "social";
  if (t.includes("📰") || t.includes("investiu no clube") || t.includes("retirou investimento") || t.includes("reunião com a diretoria") || t.includes("trabalho com a base") || t.includes("capitania") || t.includes("meta individual") || t.includes("comprou:") || t.includes("contratou:") || t.includes("vendeu:") || t.includes("equipou") || t.includes("novo item desbloqueado")) return "clube";
  return "outros";
}

export function imagemPost(txt) {
  const t = txt.toLowerCase();
  if (t.includes("bola de ouro")) return { emoji: "🏆", bg: "linear-gradient(135deg,#D8B44A,#8a6d1a)" };
  if (t.includes("campeão") || t.includes("campeã")) return { emoji: "🏆", bg: "linear-gradient(135deg,#12A876,#0a5c40)" };
  if (t.includes("transferido") || t.includes("emprestado") || t.includes("compra definitiva")) return { emoji: "✈️", bg: "linear-gradient(135deg,#3b82f6,#1e3a8a)" };
  if (t.includes("assinou contrato") || t.includes("negociação de contrato") || t.includes("contrato com o")) return { emoji: "✍️", bg: "linear-gradient(135deg,#8b5cf6,#4c1d95)" };
  if (t.includes("lesão") || t.includes("lesao") || t.includes("🩹") || t.includes("🤕")) return { emoji: "🩹", bg: "linear-gradient(135deg,#ef4444,#7f1d1d)" };
  if (t.includes("patrocínio") || t.includes("patrocinio")) return { emoji: "💰", bg: "linear-gradient(135deg,#f59e0b,#78350f)" };
  if (t.includes("capitania") || t.includes("braçadeira")) return { emoji: "🎖️", bg: "linear-gradient(135deg,#D8B44A,#78350f)" };
  if (t.includes("investiu no clube") || t.includes("estrutura") || t.includes("centro de treinamento")) return { emoji: "🏟️", bg: "linear-gradient(135deg,#0ea5e9,#0c4a6e)" };
  if (t.includes("caridade") || t.includes("abrigo") || t.includes("hospital") || t.includes("fundação") || t.includes("social")) return { emoji: "❤️", bg: "linear-gradient(135deg,#ec4899,#831843)" };
  if (t.includes("noitada") || t.includes("night")) return { emoji: "🎉", bg: "linear-gradient(135deg,#a855f7,#581c87)" };
  if (t.includes("família") || t.includes("familia") || t.includes("folga")) return { emoji: "👨‍👩‍👧", bg: "linear-gradient(135deg,#22c55e,#14532d)" };
  if (t.includes("gols") || t.includes("hat-trick") || t.includes("marcou")) return { emoji: "⚽", bg: "linear-gradient(135deg,#10b981,#064e3b)" };
  if (t.includes("desbloqueado") || t.includes("chuteira") || t.includes("luvas")) return { emoji: "✨", bg: "linear-gradient(135deg,#f472b6,#831843)" };
  if (t.includes("escândalo") || t.includes("escandalo")) return { emoji: "🔥", bg: "linear-gradient(135deg,#dc2626,#450a0a)" };
  if (t.includes("provocou") || t.includes("elogiou") || t.includes("rival")) return { emoji: "🎙️", bg: "linear-gradient(135deg,#f97316,#7c2d12)" };
  if (t.includes("base do clube")) return { emoji: "🌱", bg: "linear-gradient(135deg,#84cc16,#365314)" };
  if (t.includes("diretoria") || t.includes("reunião")) return { emoji: "🏛️", bg: "linear-gradient(135deg,#64748b,#1e293b)" };
  return { emoji: "📸", bg: "linear-gradient(135deg,#3f3f46,#18181b)" };
}

export function tierDoTeste(totalAcertos) {
  if (totalAcertos >= 10) return { min: 74, max: 86, label: "Times fortes de olho em você" };
  if (totalAcertos >= 7) return { min: 65, max: 78, label: "Bons times" };
  if (totalAcertos >= 4) return { min: 57, max: 68, label: "Times medianos" };
  return { min: 52, max: 60, label: "Só times da Série B te dão uma chance" };
}

export function patrocinadoresDisponiveis(c) {
  const o = c.ostentacao ?? 0;
  const calor = c.calorMidia ?? 20;
  return OFERTAS_PATROCINIO.filter((p) => {
    if (p.minOstentacao != null && o < p.minOstentacao) return false;
    if (p.maxOstentacao != null && o > p.maxOstentacao) return false;
    if (p.maxCalorMidia != null && calor > p.maxCalorMidia) return false;
    return true;
  });
}

export function seguidoresBase(ovr) {
  if (ovr < 65) return 10000 + ((ovr - 45) / 20) * 30000;
  if (ovr < 70) return 50000 + ((ovr - 65) / 5) * 50000;
  if (ovr < 75) return 100000 + ((ovr - 70) / 5) * 400000;
  if (ovr < 80) return 500000 + ((ovr - 75) / 5) * 300000;
  if (ovr < 85) return 800000 + ((ovr - 80) / 5) * 4200000;
  return Math.min(500000000, 5000000 + (ovr - 85) * 35000000);
}

export function nacDe(id) { return NACIONALIDADES.find((n) => n.id === id); }

export function ligasOrdenadas() { return Object.entries(LIGAS).filter(([k]) => k !== "arabia" && k !== "mls"); }

export function temporadaLabel(idade, anoInicio) { const t = idade - 16; return `${anoInicio + t}/${anoInicio + t + 1}`; }

export function tierInfo(ovr) {
  if (ovr >= 93) return { cor: "#D8B44A", label: "Lendária" };
  if (ovr >= 85) return { cor: "#12A876", label: "Joia rara" };
  if (ovr >= 75) return { cor: "#3b82f6", label: "Lapidada" };
  return { cor: "#6B5B3F", label: "Pedra bruta" };
}

export function ovrHexGradiente(ovr) {
  if (ovr >= 93) return "linear-gradient(160deg,#FFE9A8,#D8B44A 55%,#8a6a1f)";
  if (ovr >= 85) return "linear-gradient(160deg,#7CFFC4,#12A876 55%,#0a5c40)";
  if (ovr >= 75) return "linear-gradient(160deg,#7ec8ff,#3b82f6 55%,#1e3a8a)";
  return "linear-gradient(160deg,#8a7860,#6B5B3F 55%,#3d3222)";
}

export function estimarRodadasLiga(ligaId) {
  let n = CLUBES.filter((x) => x.liga === ligaId).length;
  if (n % 2 !== 0) n += 1;
  return 2 * (n - 1);
}

export function penAlvoBola(resultado) {
  if (!resultado) return { x: PEN_SPOT.x, y: 196, scale: 2.75 };
  const x = PEN_ZONE_X[resultado.zona];
  if (resultado.gol) return { x, y: PEN_GOAL.y + PEN_GOAL.h * 0.6, scale: 0.95 };
  if (resultado.tipo === "Defesa") return { x, y: PEN_GOAL.y + PEN_GOAL.h * 0.85, scale: 1.05 };
  if (resultado.tipo === "Trave") return { x, y: PEN_GOAL.y - 4, scale: 0.95 };
  const foraX = x + (x < PEN_GOAL.x + PEN_GOAL.w / 2 ? -34 : 34);
  return { x: foraX, y: -46, scale: 0.32 };
}

export function faltaAlvoBola(resultado) {
  if (!resultado) return { x: FALTA_SPOT.x, y: FALTA_SPOT.y, scale: 1.5 };
  const x = FALTA_ZONE_X[resultado.zona];
  if (resultado.gol) {
    const y = resultado.zona === "porCima" ? FALTA_GOAL.y + FALTA_GOAL.h * 0.2 : FALTA_GOAL.y + FALTA_GOAL.h * 0.62;
    return { x, y, scale: 0.55 };
  }
  if (resultado.tipo === "Barreira") return { x: FALTA_BONECO_POS.x, y: FALTA_BONECO_POS.y - 10, scale: 0.62 };
  if (resultado.tipo === "Defesa") return { x, y: FALTA_GOAL.y + FALTA_GOAL.h * 0.8, scale: 0.6 };
  if (resultado.tipo === "Trave") return { x, y: FALTA_GOAL.y - 2, scale: 0.55 };
  const foraX = x + (x < FALTA_GOAL.x + FALTA_GOAL.w / 2 ? -20 : 20);
  return { x: foraX, y: FALTA_GOAL.y - 22, scale: 0.4 };
}

export function calcularSucessoFalta(atributoFinalizacao, atributoDrible) {
  const chuteBase = (atributoFinalizacao ?? 50) * 0.65 + (atributoDrible ?? 50) * 0.35;
  return Math.random() < clamp(chuteBase / 145 + 0.18, 0.15, 0.72);
}

export function tipoResultadoFalta(gol, zona) {
  if (gol) return "Gol";
  const r = Math.random();
  if (zona === "porCima") return r < 0.35 ? "Barreira" : r < 0.65 ? "Defesa" : r < 0.85 ? "Trave" : "Pra fora";
  return r < 0.45 ? "Defesa" : r < 0.7 ? "Trave" : "Pra fora";
}

export function gerarCenaPasse() {
  const nCompanheiros = rand(2, 4);
  const nAdversarios = rand(2, 4);
  const companheiros = Array.from({ length: nCompanheiros }, (_, i) => ({
    id: `c${i}`, x: 34 + Math.random() * (PASSE_W - 68), y: 34 + Math.random() * 92,
  }));
  const adversarios = Array.from({ length: nAdversarios }, (_, i) => ({
    id: `a${i}`, x: 28 + Math.random() * (PASSE_W - 56), y: 46 + Math.random() * 100,
  }));
  return { companheiros, adversarios };
}

export function distanciaPontoSegmento(px, py, qx, qy, rx, ry) {
  const dx = qx - px, dy = qy - py;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((rx - px) * dx + (ry - py) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return { d: Math.hypot(rx - (px + t * dx), ry - (py + t * dy)), t, cx: px + t * dx, cy: py + t * dy };
}

export function calcularSucessoPasse(atributoPasse, origem, alvo, adversarios) {
  const infos = adversarios.map((a) => ({ ...distanciaPontoSegmento(origem.x, origem.y, alvo.x, alvo.y, a.x, a.y), adv: a }));
  const maisPerto = infos.reduce((m, i) => (i.d < m.d ? i : m), infos[0]);
  const risco = clamp(1 - maisPerto.d / 40, 0, 0.55);
  const base = clamp((atributoPasse ?? 50) / 130 + 0.35, 0.35, 0.92);
  const chance = clamp(base - risco, 0.12, 0.95);
  return { gol: Math.random() < chance, ponto: maisPerto, adversarioCulpado: maisPerto.adv };
}

export function labelAtributoGoleiro(label, posicao) {
  if (posicao !== "GOL") return label;
  const mapa = { FIN: "REF", DRI: "ELA", DEF: "POS" };
  return mapa[label] || label;
}

export function diasNoMes(ano, mes) { return new Date(ano, mes + 1, 0).getDate(); }

export function primeiroDiaSemanaMes(ano, mes) { return new Date(ano, mes, 1).getDay(); }

export function janelasEuropaPais(ligaId) {
  const c = COMPS_PAIS[ligaId] || COMPS_PAIS.inglaterra;
  const mls = ligaId === "mls"; // MLS roda no ano civil (fev–dez), diferente da Europa
  if (mls) return [
    { comp: "Pré-temporada", icone: "🤝", cor: "#6b7280", inicioMes: 0, inicioDia: 10, fimMes: 1, fimDia: 20 },
    { comp: c.liga, icone: "⚽", cor: "#12A876", inicioMes: 1, inicioDia: 21, fimMes: 11, fimDia: 8, ligaPrincipal: true },
    { comp: c.copa, icone: "🏆", cor: "#D8B44A", inicioMes: 4, inicioDia: 1, fimMes: 8, fimDia: 30 },
    { comp: c.continental, icone: "🌎", cor: "#f59e0b", inicioMes: 1, inicioDia: 25, fimMes: 4, fimDia: 31 },
    { comp: "Mundial de Clubes", icone: "🌐", cor: "#ec4899", inicioMes: 5, inicioDia: 14, fimMes: 6, fimDia: 13, seElegivel: true },
  ];
  return [
    { comp: "Amistosos de pré-temporada", icone: "🤝", cor: "#6b7280", inicioMes: 6, inicioDia: 12, fimMes: 7, fimDia: 14 },
    { comp: c.superCopa, icone: "🛡️", cor: "#a855f7", inicioMes: 7, inicioDia: 10, fimMes: 7, fimDia: 16 },
    { comp: c.liga, icone: "⚽", cor: "#12A876", inicioMes: 7, inicioDia: 17, fimMes: 4, fimDia: 24, ligaPrincipal: true },
    { comp: c.copa, icone: "🏆", cor: "#D8B44A", inicioMes: 7, inicioDia: 29, fimMes: 4, fimDia: 16 },
    { comp: c.continental, icone: "🌍", cor: "#f59e0b", inicioMes: 8, inicioDia: 16, fimMes: 4, fimDia: 30 },
    { comp: "Mundial de Clubes", icone: "🌐", cor: "#ec4899", inicioMes: 5, inicioDia: 14, fimMes: 6, fimDia: 13, seElegivel: true },
  ];
}

export function janelasPorLiga(ligaId) { return (ligaId === "brasileirao" || ligaId === "serieB") ? JANELAS_BRASIL : janelasEuropaPais(ligaId); }

export function diaNaJanela(mes, dia, j) {
  const inicio = j.inicioMes * 100 + j.inicioDia, fim = j.fimMes * 100 + j.fimDia, alvo = mes * 100 + dia;
  if (inicio <= fim) return alvo >= inicio && alvo <= fim;
  return alvo >= inicio || alvo <= fim;
}

export function distribuirRodadasNaJanela(n, j, ano) {
  const diaDoAno = (mes, dia) => { let acc = 0; for (let m = 0; m < mes; m++) acc += diasNoMes(ano, m); return acc + dia; };
  let inicioAbs = diaDoAno(j.inicioMes, j.inicioDia);
  let fimAbs = diaDoAno(j.fimMes, j.fimDia);
  if (fimAbs < inicioAbs) fimAbs += 365;
  const total = fimAbs - inicioAbs;
  const datas = [];
  for (let i = 0; i < n; i++) {
    const off = n > 1 ? Math.round((i * total) / (n - 1)) : 0;
    let abs = (inicioAbs + off) % 365;
    let mes = 0, dia = abs;
    while (dia >= diasNoMes(ano, mes)) { dia -= diasNoMes(ano, mes); mes++; if (mes > 11) { mes = 0; } }
    datas.push({ mes, dia: dia + 1 });
  }
  return datas;
}

