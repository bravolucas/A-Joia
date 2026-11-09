// Uma única leitura do resultado para imagem, legenda e feedback.
export function desfechoCobranca(r){
 if(!r)return null;
 if(r.resultado==='gol'||r.gol===true)return 'gol';
 if(r.resultado==='defesa'||r.tipo==='Defesa')return 'defesa';
 return 'fora';
}
// Direção do goleiro vista pelo cobrador. Em defesa segue a bola; no gol salta ao lado oposto.
export function ladoGoleiroCobranca(r){
 if(r?.ladoGoleiro==='esquerda'||r?.ladoGoleiro==='direita')return r.ladoGoleiro;
 const zona=String(r?.zonaGoleiro||r?.zona||'').toLowerCase(),lado=zona.includes('esq')?'esquerda':'direita';
 return r?.zonaGoleiro?lado:desfechoCobranca(r)==='gol'?(lado==='esquerda'?'direita':'esquerda'):lado;
}
