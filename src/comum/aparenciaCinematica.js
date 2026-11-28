// Personalização cromática do modelo principal. Não representa troca de feições.
export const TONS_PELE=Object.freeze([
 {id:'original',nome:'Original',cor:'#c49574',fator:1},
 {id:'claro',nome:'Mais claro',cor:'#dfb596',fator:1.15},
 {id:'bronze',nome:'Mais bronzeado',cor:'#a57450',fator:.82},
 {id:'escuro',nome:'Mais escuro',cor:'#785039',fator:.62}
]);
export function normalizarAparencia(valor){
 const tom=TONS_PELE.some(t=>t.id===valor?.tom)?valor.tom:'original';
 return {versao:1,modelo:'a',tom};
}
// Exclui azuis, neutros, pele muito escura em sombra profunda e reflexos brancos.
// A separação é aproximada, não é uma segmentação anatômica.
export function pixelPele(r,g,b,a){
 return a>0&&r>=65&&r-g>=9&&g-b>=5&&r-b>=24&&r-g<100&&r<g*1.68&&g<b*1.95;
}
const clamp=v=>Math.max(0,Math.min(255,Math.round(v)));
export function camadaAparencia(pixels,width,height,id,aparencia){
 const out=new Uint8ClampedArray(pixels.length);
 const tom=normalizarAparencia(aparencia).tom, fator=TONS_PELE.find(t=>t.id===tom).fator;
 if(fator===1||!id||id.endsWith('-b'))return out;
 for(let i=0;i<pixels.length;i+=4){
  const [r,g,b,a]=pixels.subarray(i,i+4);if(!pixelPele(r,g,b,a))continue;
  const p=i/4,x=(p%width)*720/width,y=Math.floor(p/width)*768/height;
  // No vencedor, protege o troféu e as peças douradas. Somente rosto/pescoço e
  // mãos nas bordas, fora da área central de metal.
  if(id==='bola-ouro-a'&&!((x>=315&&x<=410&&y<135)||(y>=252&&y<=302&&((x>=307&&x<337)||(x>407&&x<=439)))))continue;
  // O recorte de reabilitação inclui acessórios; não recolorir as faixas.
  if(id==='reabilitacao'&&y>385)continue;
  const intensidade=fator<1?fator:1+(fator-1)*(1-r/255);
  out[i]=clamp(r*intensidade);out[i+1]=clamp(g*intensidade);out[i+2]=clamp(b*intensidade);out[i+3]=a;
 }
 return out;
}
export function combinarCamadas(base,outra){
 for(let i=0;i<base.length;i+=4)if(outra[i+3])base.set(outra.subarray(i,i+4),i);
 return base;
}
