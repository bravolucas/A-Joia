/** Placar sem teto artificial de 3 gols. Força determina a média, não o resultado. */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function mediasGols(forcaCasa,forcaFora,{neutro=false,ritmo=1}={}){
 const diferenca=clamp((Number(forcaCasa)||50)-(Number(forcaFora)||50),-85,85);
 const casa=clamp((neutro?1.25:1.47)*Math.exp(diferenca/42)*ritmo,.12,6.8);
 const fora=clamp((neutro?1.25:1.14)*Math.exp(-diferenca/42)*ritmo,.12,6.8);
 return {casa,fora};
}
export function amostrarPoisson(media,rng=Math.random){
 // Algoritmo de Knuth; 20 é proteção contra RNG patológico, não teto de placar.
 const alvo=Math.exp(-clamp(media,0,10));let produto=1,n=0;
 do {produto*=Math.max(Number.EPSILON,rng());n++;}while(produto>alvo&&n<25);
 return n-1;
}
export function simularPlacarRealista(forcaCasa,forcaFora,rng=Math.random,opcoes={}){
 const m=mediasGols(forcaCasa,forcaFora,opcoes);
 // Oscilação por jogo permite 0x0 entre fortes e goleadas entre desiguais.
 const ritmoDaPartida=.78+rng()*.46;
 const golsCasa=amostrarPoisson(m.casa*ritmoDaPartida,rng);
 const golsFora=amostrarPoisson(m.fora*ritmoDaPartida,rng);
 return {golsCasa,golsFora};
}
