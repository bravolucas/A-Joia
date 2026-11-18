/** Compatibilidade com o motor unificado de placares.
 * Uma única distribuição fundamenta resultados, análises e probabilidades.
 */
import {expectativasGols,amostraPoisson,simularPlacar} from './motorPlacar.js';
export function mediasGols(forcaCasa,forcaFora,{neutro=false,ritmo=1}={}){
 return expectativasGols(forcaCasa,forcaFora,{neutro,ritmo});
}
export const amostrarPoisson=amostraPoisson;
export function simularPlacarRealista(forcaCasa,forcaFora,rng=Math.random,opcoes={}){
 const {golsCasa,golsFora}=simularPlacar(forcaCasa,forcaFora,rng,opcoes);
 return {golsCasa,golsFora};
}
