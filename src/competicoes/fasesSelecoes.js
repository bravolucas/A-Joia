import {CONFEDERACAO_POR_NACAO} from '../dados/data.js';
const MATA=[{id:'oitavas',label:'Oitavas de Final',prep:'nas'},{id:'quartas',label:'Quartas de Final',prep:'nas'},{id:'semifinal',label:'Semifinal',prep:'na'},{id:'final',label:'Final',prep:'na'}];
export function primeiraFaseContinental(nac){const conf=CONFEDERACAO_POR_NACAO[nac];return conf==='OFC'?3:['CONMEBOL','CONCACAF'].includes(conf)?2:1;}
export const fasesMataSelecao=nac=>MATA.slice(primeiraFaseContinental(nac)-1);
