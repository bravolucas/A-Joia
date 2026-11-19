import {simularPlacarRealista} from './motorPlacares.js';
/** Prorrogação de 30 minutos (aprox. um terço do tempo regulamentar).
 * Usada somente quando uma eliminatória exige vencedor e termina empatada.
 * O placar final inclui os gols marcados na prorrogação; as cobranças de
 * pênaltis não acrescentam gols ao placar nem ao histórico individual.
 */
export function aplicarProrrogacao(jogo,forcaCasa,forcaFora,rng=Math.random,{neutro=false}={}){
 if(!jogo||jogo.golsCasa!==jogo.golsFora)return jogo;
 const {golsCasa,golsFora}=simularPlacarRealista(forcaCasa,forcaFora,rng,{neutro,ritmo:1/3});
 const placar90={golsCasa:jogo.golsCasa,golsFora:jogo.golsFora};
 return {...jogo,golsCasa:jogo.golsCasa+golsCasa,golsFora:jogo.golsFora+golsFora,
  prorrogacao:{golsCasa,golsFora,placar90}};
}
/** Para ida e volta, a prorrogação é disputada no estádio da segunda partida. */
export function aplicarProrrogacaoAgregado(ida,volta,forcaMandanteVolta,forcaVisitanteVolta,rng=Math.random){
 const a=ida.golsCasa+volta.golsFora,b=ida.golsFora+volta.golsCasa;
 if(a!==b)return volta;
 const {golsCasa,golsFora}=simularPlacarRealista(forcaMandanteVolta,forcaVisitanteVolta,rng,{ritmo:1/3});
 return {...volta,golsCasa:volta.golsCasa+golsCasa,golsFora:volta.golsFora+golsFora,
  prorrogacao:{golsCasa,golsFora,placar90:{golsCasa:volta.golsCasa,golsFora:volta.golsFora}}};
}
