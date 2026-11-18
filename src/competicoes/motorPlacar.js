/** Motor de placares: gols independentes condicionados a um ritmo compartilhado.
 * A força altera as expectativas de gols, não determina o resultado.
 * RNG injetável permite reproduzir partidas e testar distribuição estatística.
 */
export const limitarPlacar=(n,min,max)=>Math.max(min,Math.min(max,n));
export function expectativasGols(forcaCasa,forcaFora,{neutro=false,ritmo=1}={}){
 const a=limitarPlacar(Number(forcaCasa)||50,1,100),b=limitarPlacar(Number(forcaFora)||50,1,100);
 const mando=neutro?0:5;
 const diff=a-b;
 return {
  casa:limitarPlacar(1.34*Math.exp((diff+mando)/54)*ritmo,.15,6.8),
  fora:limitarPlacar(1.34*Math.exp((-diff-mando)/54)*ritmo,.15,6.8)
 };
}
export function amostraPoisson(media,rng=Math.random){
 const limite=Math.exp(-limitarPlacar(media,.0001,12));let produto=1,n=0;
 do{produto*=Math.max(Number.EPSILON,rng());n++;}while(produto>limite&&n<24);
 return n-1;
}
export function simularPlacar(forcaCasa,forcaFora,rng=Math.random,opcoes={}){
 const ritmo=.79+rng()*.47;
 const taxas=expectativasGols(forcaCasa,forcaFora,{...opcoes,ritmo:(opcoes.ritmo||1)*ritmo});
 return {golsCasa:amostraPoisson(taxas.casa,rng),golsFora:amostraPoisson(taxas.fora,rng),xgCasa:taxas.casa,xgFora:taxas.fora};
}
/** Probabilidades analíticas para informar o usuário sem contradizer o motor. */
export function probabilidadesPlacar(forcaCasa,forcaFora,opcoes={}){
 const {casa,fora}=expectativasGols(forcaCasa,forcaFora,opcoes);
 const probs=(media)=>{const x=[Math.exp(-media)];for(let i=1;i<=22;i++)x.push(x[i-1]*media/i);return x;};
 const a=probs(casa),b=probs(fora);let vitoria=0,empate=0,derrota=0;
 for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++){
  const p=a[i]*b[j];if(i>j)vitoria+=p;else if(i===j)empate+=p;else derrota+=p;
 }
 const total=vitoria+empate+derrota;
 return {vitoria:vitoria/total,empate:empate/total,derrota:derrota/total};
}
