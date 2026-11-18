import {sortearNacionalidadeMundo} from './nomesRegionais.js';

/**
 * Referência linguística da liga, NÃO identidade ou nacionalidade de cada atleta.
 * Elencos mistos/internacionais não recebem país local artificial.
 * Mapear aqui evita divergências entre mundo persistente e camisas fictícias.
 */
export const NACIONALIDADE_LOCAL_LIGA = Object.freeze({
  brasileirao:'BRA', serieB:'BRA', brasileiro:'BRA', brasilOutros:'BRA',
  argentina:'ARG',
  inglaterra:'ENG', inglaterra2:'ENG',
  espanha:'ESP', espanha2:'ESP',
  italia:'ITA', italia2:'ITA',
  alemanha:'ALE', alemanha2:'ALE',
  franca:'FRA', franca2:'FRA',
  portugal:'POR', portugal2:'POR',
  holanda:'HOL', arabia:'ARS', mls:'EUA', turquia:'TUR',
});

export function nacionalidadeLocalLiga(liga) {
  return NACIONALIDADE_LOCAL_LIGA[liga] || null;
}

/**
 * Regras provisórias de game design, não proporções reais observadas:
 * - Plantéis iniciais: 85% local no Brasil; 55% nos demais países.
 * - Jovens surgidos/repostos: 85% local, inclusive nas divisões inferiores.
 *
 * Sorteia no máximo uma vez a chance local e usa apenas o RNG recebido.
 * No mundo inicial de ligas mistas, preserva o primeiro sorteio legado
 * (mesmo sem país local) para não deslocar as seeds do mundo inicial.
 */
export function nacionalidadeInicialLiga(liga, rng = Math.random) {
  const local = nacionalidadeLocalLiga(liga);
  if (liga === 'brasileirao' || liga === 'serieB' || liga === 'brasileiro' || liga === 'brasilOutros') {
    return rng() < 0.85 ? 'BRA' : sortearNacionalidadeMundo(rng);
  }
  return rng() < 0.55 && local ? local : sortearNacionalidadeMundo(rng);
}

export function nacionalidadeNovoAtletaLiga(liga, rng = Math.random) {
  const local = nacionalidadeLocalLiga(liga);
  return local && rng() < 0.85 ? local : sortearNacionalidadeMundo(rng);
}
