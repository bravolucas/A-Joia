// Regiões conservadoras do topo do cabelo, em coordenadas do WebP 720 × 768.
// Não desenha novos penteados nem altera a geometria do rosto.
const TOPO=Object.freeze({
 'aplausos':[292,18,370,55],'apresentacao-camisa':[325,17,395,49],
 'bola-ouro-a':[327,20,390,51],'conducao-bola':[255,17,330,55],
 'conducao-capitao':[302,17,391,56],'corrida-comemoracao':[266,16,342,54],
 'derrota':[328,17,407,63],'despedida-chuteiras':[310,78,384,110],
 'determinacao':[302,17,377,56],'drible-lateral':[263,17,344,60],
 'gala-aceno':[340,20,405,54],'gala-aplausos':[302,21,368,52],
 'gala-confianca':[310,20,381,55],'gala-decepcao':[336,17,410,60],
 'gala-gratidao':[301,19,369,55],'gala-neutro':[303,19,373,51],
 'gala-segundo-lugar':[320,20,392,60],'gol-deslizando':[396,18,510,70],
 'jogador-neutro':[310,19,380,54],'mao-no-peito':[300,20,367,55],
 'reabilitacao':[309,18,388,54],'saudacao-agasalho':[334,19,408,56],
 'silencio':[305,19,372,54],'treinador-prancheta':[310,19,374,53],
 'treino-concentracao':[310,19,377,53],'vitoria-ajoelhado':[270,20,390,80],
 'vitoria':[312,18,383,54]
});
const COR={preto:[33,32,33],castanho:[105,70,47],loiro:[155,125,78]};
export function grauGrisalho(idade){
 const n=Number(idade);return Number.isFinite(n)?Math.max(0,Math.min(5,Math.floor((n-35)/8))):0;
}
export function cabeloAdaptavel(id){return Object.hasOwn(TOPO,id);}
export function camadaCabelo(p,w,h,id,visual,grau=0){
 const out=new Uint8ClampedArray(p.length),rect=TOPO[id],cor=COR[visual?.cabelo];
 grau=Math.max(0,Math.min(5,Number(grau)||0));
 if(!rect||(!cor&&!grau))return out;
 const [x0,y0,x1,y1]=rect;
 for(let y=Math.max(0,Math.floor(y0*h/768));y<Math.min(h,Math.ceil(y1*h/768));y++)for(let x=Math.max(0,Math.floor(x0*w/720));x<Math.min(w,Math.ceil(x1*w/720));x++){
  const i=(y*w+x)*4,r=p[i],g=p[i+1],b=p[i+2],alpha=p[i+3];
  const lum=(r*.2126+g*.7152+b*.0722);
  // Somente tons escuros/neutros/quentes no topo; pele iluminada e azul excluídos.
  if(alpha<200||lum<12||lum>98||b>r+7||r-g>34||g-b>27||r-g>17&&lum>68)continue;
  const nx=(x*720/w-(x0+x1)/2)/((x1-x0)/2),ny=(y*768/h-(y0+y1)/2)/((y1-y0)/2);
  const peso=Math.max(0,Math.min(1,(1-nx*nx-ny*ny)*3));if(peso<=0)continue;
  const grisalho=grau/5*.58*(.65+.35*Math.abs(nx)),luz=Math.max(.28,Math.min(1.35,lum/65));
  for(let k=0;k<3;k++){
   const origem=p[i+k],pigmento=cor?cor[k]*luz:origem;
   const misto=pigmento*(1-grisalho)+(lum*.65+105)*grisalho;
   out[i+k]=Math.max(0,Math.min(255,Math.round(origem+(misto-origem)*peso)));
  }out[i+3]=alpha;
 }
 return out;
}
