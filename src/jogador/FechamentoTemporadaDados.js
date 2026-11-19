/** Números por competição: copas pelos lances registrados; a liga nacional fica com o restante. */
export function porCompeticaoTemporada(card){
 const copas=Object.entries(card.copaLances||{}).map(([nome,x])=>({nome,...x}));
 if(!copas.length)return [];
 const soma=k=>copas.reduce((n,x)=>n+(x[k]||0),0);
 const liga={nome:card.ligaNome||'Liga',jogos:Math.max(0,(card.jogos||0)-soma('jogos')),gols:Math.max(0,(card.gols||0)-soma('gols')),assist:Math.max(0,(card.assist||0)-soma('assist'))};
 return [liga,...copas];
}
