/** Clássicos reais (pares de rivais), com consulta rápida. */
import {CLASSICOS} from '../dados/data.js';
const pares=new Set(CLASSICOS.filter(Array.isArray).flatMap(([a,b])=>[`${a}|${b}`,`${b}|${a}`]));
export const ehClassico=(a,b)=>!!a&&!!b&&pares.has(`${a}|${b}`);
/** Rivais clássicos de um clube. */
export const rivaisClassicos=clube=>CLASSICOS.filter(p=>Array.isArray(p)&&p.includes(clube)).map(([a,b])=>a===clube?b:a);
