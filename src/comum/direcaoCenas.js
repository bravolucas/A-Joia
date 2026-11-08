/** Scene choices follow the content, not the card's risk or rarity. */
export const CENAS_ORIGEM={varzea:'origem-varzea',rua:'origem-varzea',interior:'origem-varzea',base:'origem-base',prodigio:'origem-base',projeto:'origem-escola',escolar:'origem-escola',futsal:'origem-futsal',praia:'origem-praia',herdeiro:'origem-familia',tardio:'origem-familia',goleiros:'treino-goleiro'};
export const cenaOrigem=id=>CENAS_ORIGEM[id]||'origem-varzea';
const limpar=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function cenaTreino(carta={},posicao){
 const texto=limpar(`${carta.id||''} ${carta.nome||''} ${carta.grupo||''}`);
 if(/dieta|nutri|aliment/.test(texto))return 'treino-nutricao';
 if(/sono|mental|medit|respira|guru|concentr|pressao|lider|diario|foco/.test(texto))return 'mental';
 if(/fisio|recuper|descanso|mobilidade|yoga|tornozelo|lesao|corpo.*pronto/.test(texto))return 'recuperacao';
 if(/goleiro|reflexo|luva/.test(texto)||posicao==='GOL'&&carta.grupo==='tecnica')return 'treino-goleiro';
 if(/video|analis|leitura|tatica|linha|posicao|cobertura|setor/.test(texto))return 'treino-analise';
 if(/velocidade|sprint|arranque|arranca|agilidade|corrida|freio/.test(texto))return 'treino-velocidade';
 if(/forca|fisico|academia|potencia|muscul|ombro/.test(texto))return 'treino-forca';
 if(/bola|falta|penalti|finaliza|chut|passe|rondo|cruza|tecnica|drible|conducao|batedor/.test(texto))return 'treino-bola';
 return 'treino';
}
export function cenaCopa(c,decisao){
 if(c.tipo==='estadual')return 'copa-regional';
 if(c.tipo==='mundial')return 'copa-mundial';
 const fase=decisao?.fase||c.resultado?.fase||c.faseUsuario||'',final=decisao?.final||c.resultado?.final||/^(final|campeao|campeão|vice-campe)/i.test(fase),europa=c.regiao==='europa'||/Champions League|Europa League|Conference|FA Cup|Rey|Pokal|Coppa|France|Portugal|KNVB|Kupas/i.test(c.nome||'');
 if(final)return europa?'copa-final-europa':'copa-final-sul';
 if(/semifinal/i.test(fase))return europa?'copa-final-europa':'copa-semifinal';
 if(c.tipo==='copa'&&c.tamanho>=32)return 'copa-regional';
 return 'copa-tunel';
}
