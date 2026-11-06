/** A postura dá uma pista, mas não revela o resultado. Mesma regra de engano do lance. */
export function lerPosturaCobrador(seed){
 const n=seed>>>0,alvo=n%3,pista=n%5===0?(alvo+1)%3:alvo;
 return{alvo,pista,descricao:['Quadril aberto e apoio inclinado','Apoio central e corpo equilibrado','Quadril fechado e apoio girado'][pista],tendencia:['esquerda','centro','direita'][pista]};
}
