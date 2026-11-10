import {slugCompeticao} from './arteCompeticoes.js';
const ALIASES={kasimpasa:'kas-mpasa','fc-koln':'koln','hamburger-sv':'hamburgo','st-patrick-s-athletic':'st-patricks-athletic','connah-s-quay':'connahs-quay'};
// A normalização de acentos não pode confundir o clube paraguaio com o brasileiro.
const NOMES_EXATOS={'guaraní':'guarani-paraguai'};
export function chaveEscudo(nome,contexto){const original=String(nome||'').trim().normalize('NFC').toLowerCase(),chave=slugCompeticao(original);return original==='boavista'&&contexto?.estado==='RJ'?'boavista-rj':NOMES_EXATOS[original]||ALIASES[chave]||chave;}
