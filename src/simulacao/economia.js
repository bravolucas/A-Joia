/**
 * Economia do futebol em euros (valores em € mil; salários por mês).
 *
 * Calibração na escala de OVR do jogo (elite mundial entre 95 e 99), aproximada
 * ao mercado de 2025/26 para um atleta de 25 anos na Premier League:
 * OVR 99 ≈ € 200 mi, 95 ≈ € 110 mi, 90 ≈ € 55 mi, 80 ≈ € 14 mi, 70 ≈ € 4,5 mi, 60 ≈ € 1,5 mi.
 * O mesmo nível vale menos em ligas com menor poder financeiro
 * (Brasileirão ≈ 42% da Premier League; Série B ≈ 30%; Série C ≈ 18%).
 * Salário mensal ≈ 1,5% do valor-base de mercado, com piso por liga.
 *
 * Funções puras: não consomem aleatoriedade nem alteram o save.
 */
export const VERSAO_ECONOMIA = 2;

// Valor-base (€ mil) por OVR para um atleta no auge, liga de referência, contrato longo.
const CURVA_OVR = [[40, 100], [45, 200], [50, 400], [55, 800], [60, 1500], [65, 2600], [70, 4500],
  [75, 8000], [80, 14000], [85, 28000], [90, 55000], [95, 110000], [99, 200000]];

/** Peso financeiro de cada liga em relação à Premier League. */
export const FATOR_MERCADO_LIGA = {
  inglaterra: 1, espanha: .85, alemanha: .8, italia: .8, franca: .7,
  portugal: .55, holanda: .5, arabia: .45, brasileirao: .42, turquia: .4, mls: .35,
  argentina: .3, sulamericano: .18,
  inglaterra2: .35, alemanha2: .22, espanha2: .2, italia2: .2, franca2: .18, portugal2: .12,
  serieB: .3, serieC: .18, serieD: .08,
};
const FATOR_PADRAO = .3;

/** Piso salarial mensal (€ mil) de um profissional em cada liga. */
const PISO_SALARIAL = {
  inglaterra: 40, espanha: 25, alemanha: 25, italia: 25, franca: 20, arabia: 30,
  portugal: 8, holanda: 10, turquia: 10, mls: 12, brasileirao: 12, argentina: 5, sulamericano: 3,
  inglaterra2: 10, alemanha2: 6, espanha2: 5, italia2: 5, franca2: 5, portugal2: 2,
  serieB: 5, serieC: 2, serieD: .8,
};
const PISO_PADRAO = 4;

const numero = (n, padrao) => Number.isFinite(Number(n)) ? Number(n) : padrao;
export const fatorLiga = liga => FATOR_MERCADO_LIGA[liga] ?? FATOR_PADRAO;

/** Valor-base (€ mil) por OVR, interpolado em escala logarítmica. */
export function valorBaseOvr(ovr) {
  const o = Math.max(CURVA_OVR[0][0], Math.min(CURVA_OVR.at(-1)[0], numero(ovr, 50)));
  for (let i = 1; i < CURVA_OVR.length; i++) {
    const [o1, v1] = CURVA_OVR[i - 1], [o2, v2] = CURVA_OVR[i];
    if (o <= o2) return v1 * (v2 / v1) ** ((o - o1) / (o2 - o1));
  }
  return CURVA_OVR.at(-1)[1];
}

function fatorIdade(idade) {
  if (idade <= 19) return .9;
  if (idade <= 21) return 1.1;
  if (idade <= 24) return 1.15;
  if (idade <= 27) return 1;
  if (idade <= 29) return .8;
  if (idade <= 31) return .55;
  if (idade <= 33) return .3;
  return .12;
}

function fatorContrato(anos) {
  if (!Number.isFinite(anos)) return 1;
  return anos >= 3 ? 1 : anos === 2 ? .9 : anos === 1 ? .7 : .5;
}

/**
 * Valor de mercado (€ mil) de um atleta: { ovr|qualidade, idade, potencial, liga, contrato }.
 * Jovens com potencial acima do nível atual valem mais; contrato curto derruba o preço.
 */
export function valorMercadoEuro(p = {}) {
  const ovr = numero(p.ovr ?? p.qualidade, 50), idade = numero(p.idade, 25);
  let v = valorBaseOvr(ovr) * fatorIdade(idade) * fatorLiga(p.liga);
  const potencial = numero(p.potencial, ovr);
  if (idade <= 23 && potencial > ovr) v *= 1 + Math.min(1.5, (potencial - ovr) * .06);
  v *= fatorContrato(Number.isInteger(p.contrato) ? p.contrato : undefined);
  return Math.max(10, Math.round(v));
}

/** Salário mensal (€ mil) compatível com o nível do atleta e a liga onde joga. */
export function salarioMensalEuro(p = {}) {
  const ovr = numero(p.ovr ?? p.qualidade, 50);
  const s = valorBaseOvr(ovr) * fatorLiga(p.liga) * .015 + (PISO_SALARIAL[p.liga] ?? PISO_PADRAO);
  return Math.max(1, Math.round(s));
}

/**
 * Verba anual de contratações (€ mil): cerca de 20% do valor do elenco,
 * o que coloca gigantes europeus na faixa de € 150–250 mi por ano,
 * grandes brasileiros entre € 30–60 mi e clubes da Série C abaixo de € 1 mi.
 */
export const verbaTransferenciasEuro = elenco =>
  Math.max(50, Math.round((elenco || []).reduce((n, j) => n + numero(j.valor, 0), 0) * .2));

/** Formatação em euros: € 1,5 mi · € 850 mil · € 900. */
export function formatarEuro(mil) {
  const n = numero(mil, 0), abs = Math.abs(n), sinal = n < 0 ? '−' : '';
  if (abs >= 1000) return `${sinal}€ ${(abs / 1000).toLocaleString('pt-BR', { maximumFractionDigits: abs >= 100000 ? 0 : 1 })} mi`;
  if (abs >= 1) return `${sinal}€ ${Math.round(abs).toLocaleString('pt-BR')} mil`;
  return `${sinal}€ ${Math.round(abs * 1000).toLocaleString('pt-BR')}`;
}
