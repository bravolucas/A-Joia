/**
 * Movimentação simultânea B ↔ C ↔ D após uma edição válida da Série C.
 *
 * A Série D ainda não é simulada por completo: os seis acessos vêm de um
 * banco de candidatos brasileiros. Os seis promovidos de 2026 são os
 * resultados reais conhecidos; nas temporadas seguintes, os candidatos
 * restantes são selecionados pelo nível e por um sorteador injetado.
 * Nada é alterado quando não existem os resultados da Série C.
 */
export const PROMOVIDOS_SERIE_D_2026 = [
  'ABC', 'ASA', 'Gama', 'Goiatuba', 'Nacional-AM', 'Uberlândia',
];

export function progredirBrasilInferior({
  ligasAtuais = {},
  edicaoSerieC = null,
  classificacaoB = [],
  forcas = {},
  ano = 2026,
  rng = Math.random,
} = {}) {
  const vazio = { alteracoes: {}, movimentos: [], validado: false };
  if (!edicaoSerieC || edicaoSerieC.ano !== ano || edicaoSerieC.liga !== 'serieC' ||
      !Array.isArray(classificacaoB) || classificacaoB.length !== 20 ||
      new Set(classificacaoB.map(linha => linha?.nome)).size !== 20) return vazio;

  const promovidos = edicaoSerieC.promovidos;
  const rebaixados = edicaoSerieC.rebaixados;
  const quatro = promovidos?.length === 4 && new Set(promovidos).size === 4;
  const quantidadeDescenso = ano <= 2027 ? 2 : 6;
  const descensosValidos = rebaixados?.length === quantidadeDescenso &&
    new Set(rebaixados).size === quantidadeDescenso;
  const descemB = classificacaoB.slice(-4).map(linha => linha.nome);
  const validoB = descemB.length === 4 && new Set(descemB).size === 4;
  if (!quatro || !descensosValidos || !validoB ||
      promovidos.some(nome => ligasAtuais[nome] !== 'serieC') ||
      rebaixados.some(nome => ligasAtuais[nome] !== 'serieC') ||
      descemB.some(nome => ligasAtuais[nome] !== 'serieB') ||
      promovidos.some(nome => rebaixados.includes(nome))) return vazio;

  const candidatosD = Object.entries(ligasAtuais)
    .filter(([, liga]) => liga === 'serieD')
    .map(([nome]) => nome);
  if (candidatosD.length < 6) return vazio;

  let promovidosD;
  if (ano === 2026 && PROMOVIDOS_SERIE_D_2026.every(nome => candidatosD.includes(nome))) {
    promovidosD = [...PROMOVIDOS_SERIE_D_2026];
  } else {
    promovidosD = candidatosD
      .map(nome => ({ nome, nota: (Number(forcas[nome]) || 50) + rng() * 16 }))
      .sort((a, b) => b.nota - a.nota || a.nome.localeCompare(b.nome, 'pt-BR'))
      .slice(0, 6).map(c => c.nome);
  }

  const alteracoes = {}, movimentos = [];
  const mover = (nomes, de, para, tipo) => {
    for (const nome of nomes) {
      alteracoes[nome] = para;
      movimentos.push({ clube: nome, tipo, de, para });
    }
  };
  mover(descemB, 'serieB', 'serieC', 'rebaixamento');
  mover(promovidos, 'serieC', 'serieB', 'acesso');
  mover(rebaixados, 'serieC', 'serieD', 'rebaixamento');
  mover(promovidosD, 'serieD', 'serieC', 'acesso');
  return {
    alteracoes, movimentos, validado: true,
    promovidosSerieC: [...promovidos],
    rebaixadosSerieB: descemB,
    rebaixadosSerieC: [...rebaixados],
    promovidosSerieD: promovidosD,
  };
}
