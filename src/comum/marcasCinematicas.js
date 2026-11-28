// Âncoras por pose no recorte de 720 × 768, independentes da resolução da tela.
const MARCAS=Object.freeze({
 'apresentacao-camisa':{escudo:[370,248,38,42],limparEscudo:true},
 'vitoria':{escudo:[388,176,27,31],numero:[420,412,30]},
 'vitoria-ajoelhado':{escudo:[435,240,31,35],numero:[520,557,34]},
 'corrida-comemoracao':{escudo:[387,203,25,29]},
 'jogador-neutro':{escudo:[391,184,25,29],numero:[412,420,27]},
 'saudacao-agasalho':{escudo:[427,204,25,29]},
 'derrota':{numero:[407,425,27]},
 'frustracao-maos-cabeca':{escudo:[395,190,25,29],numero:[416,420,27]},
 'aplausos':{numero:[409,420,27]},
 'mao-no-peito':{numero:[415,421,27]}
});
export function marcasDaPose(id,numero,temEscudo){
 const m=MARCAS[id];if(!m)return {};
 const n=typeof numero==='number'||typeof numero==='string'&&/^\d{1,2}$/.test(numero)?Number(numero):0;
 return {escudo:temEscudo?m.escudo:undefined,limparEscudo:!!(temEscudo&&m.limparEscudo),numero:Number.isInteger(n)&&n>=1&&n<=99&&m.numero?{coordenadas:m.numero,valor:n}:undefined};
}
// Restaura tecido atrás do emblema fictício sem modificar o arquivo original.
export function limparEscudoApresentacao(pixels,camada,w,h){
 const x0=Math.round(350*w/720),x1=Math.round(391*w/720),y0=Math.round(227*h/768),y1=Math.round(270*h/768),dx=Math.round(43*w/720);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const i=(y*w+x)*4,j=(y*w+x-dx)*4;
  if(pixels[i+3]<240||pixels[j+3]<240)continue;
  const origem=camada[j+3]?camada:pixels;
  const peso=Math.min(1,Math.min(x-x0,x1-1-x,y-y0,y1-1-y)/3);
  if(peso<=0)continue;
  const anterior=camada[i+3]?camada:pixels;
  for(let k=0;k<3;k++)camada[i+k]=Math.round(anterior[i+k]*(1-peso)+origem[j+k]*peso);
  camada[i+3]=pixels[i+3];
 }
 return camada;
}
