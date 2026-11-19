/**
 * Formato dos mata-matas por competição (jogo único ou ida e volta), seguindo os
 * regulamentos atuais. `tamanho` é o número de clubes ainda vivos na fase
 * (2 = final, 4 = semifinal, 8 = quartas...).
 *
 * - Libertadores, Sul-Americana, Champions, Europa League, Conference, Concacaf e
 *   Champions Asiática: ida e volta em todas as fases eliminatórias; final em jogo único.
 * - Fases preliminares continentais (pré-Libertadores, playoffs): ida e volta.
 * - Copa do Brasil: ida e volta da terceira fase (32 clubes) até a final.
 * - Copa do Rei: semifinal em dois jogos; demais fases em jogo único.
 * - Estaduais: final em dois jogos.
 * - Copas nacionais europeias, Mundial de Clubes e torneios de seleções: jogo único.
 */
const CONTINENTAIS = /libertadores|sul-americana|sudamericana|champions league|liga dos campe|europa league|conference|concacaf|champions asi/i;

export function idaEVolta({ nome = '', tipo = '', tamanho = 0, preliminar = false } = {}) {
  if (tipo === 'mundial' || tipo === 'copaMundo' || tipo === 'continentalSelecao' || /mundial|intercontinental/i.test(nome)) return false;
  if (CONTINENTAIS.test(nome)) return preliminar || tamanho > 2;
  if (/copa do brasil/i.test(nome)) return tamanho > 0 && tamanho <= 32;
  if (/copa del rey|copa do rei/i.test(nome)) return tamanho === 4;
  if (tipo === 'estadual') return tamanho === 2;
  return false;
}

/** Formato equivalente para a simulação automática antiga (flags por competição inteira). */
export function formatoEliminatoriaAntigo(nome = '', tipo = '') {
  if (CONTINENTAIS.test(nome)) return { mataMataIdaVolta: true, finalIdaVolta: false };
  if (/copa do brasil/i.test(nome)) return { mataMataIdaVolta: true, finalIdaVolta: true };
  return {};
}
