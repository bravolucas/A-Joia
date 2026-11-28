// Recolorir apenas tecido azul em poses conhecidas, sem filtrar o retrato inteiro.
// Coordenadas no acervo original de 720 × 768. Não são máscaras de escudo/número.
const CAMISAS={
 'vitoria':[245,125,485,345],
 'vitoria-ajoelhado':[230,170,505,465],
 'corrida-comemoracao':[255,130,460,380],
 'jogador-neutro':[245,120,460,335],
 'mao-no-peito':[245,120,460,335],
 'aplausos':[245,120,460,335],
 'determinacao':[230,120,460,335],
 'silencio':[240,120,460,335],
 'derrota':[240,105,455,335],
 'frustracao-maos-cabeca':[245,110,490,345],
 'gol-deslizando':[195,175,520,460],
 'conducao-bola':[220,120,465,350],
 'conducao-capitao':[245,120,490,350],
 'drible-lateral':[195,120,455,350]
};
const AGASALHOS=new Set(['saudacao-agasalho','treino-concentracao']);
export function roupaAdaptavel(id){return Object.hasOwn(CAMISAS,id)||AGASALHOS.has(id)||id==='apresentacao-camisa';}
export function tecidoAzul(r,g,b,a){return a>0&&b>32&&b-r>16&&b-g>8&&b>r*1.18&&b>g*1.09;}
function rgb(hex){if(!/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(hex||''))return null;const s=hex.slice(1),v=parseInt(s.length===3?s.split('').map(x=>x+x).join(''):s,16);return [v>>16&255,v>>8&255,v&255];}
const limitar=x=>Math.max(0,Math.min(255,Math.round(x)));
function dentro(x,y,rect){return x>=rect[0]&&x<=rect[2]&&y>=rect[1]&&y<=rect[3];}
const CAMISA_MAO=[205,180,450,440];
function corTecido(padrao,x,y){switch(padrao){
 case 'listras':return Math.floor(x*6)%2===1?'secundaria':'base';
 case 'horizontais':return Math.floor(y*5)%2===1?'secundaria':'base';
 case 'tricolor':return Math.floor(x*7)%3===1?'secundaria':Math.floor(x*7)%3===2?'detalhe':'base';
 case 'faixa':return y>.32&&y<.53?'secundaria':'base';
 case 'diagonal':return Math.abs(y-x)<.13?'secundaria':'base';
 case 'metades':return x>.5?'secundaria':'base';
 case 'central':return x>.33&&x<.67?'secundaria':'base';
 case 'xadrez':return (Math.floor(x*6)+Math.floor(y*6))%2?'secundaria':'base';
 default:return 'base';
}}
// O resultado é uma camada transparente somente nos pixels modificados.
export function camadaUniforme(pixels,width,height,id,u){
 const out=new Uint8ClampedArray(pixels.length),base=rgb(u?.base),secundaria=rgb(u?.secundaria)||base,detalhe=rgb(u?.detalhe)||secundaria;
 if(!base||!roupaAdaptavel(id))return out;
 const rect=id==='apresentacao-camisa'?CAMISA_MAO:CAMISAS[id];
 for(let i=0;i<pixels.length;i+=4){
  const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
  if(!tecidoAzul(r,g,b,a))continue;
  const p=i/4,x=(p%width)*720/width,y=Math.floor(p/width)*768/height;
  if(id==='apresentacao-camisa'&&!dentro(x,y,CAMISA_MAO))continue;
  const cor=rect&&dentro(x,y,rect)?{base,secundaria,detalhe}[corTecido(u.padrao,(x-rect[0])/(rect[2]-rect[0]),(y-rect[1])/(rect[3]-rect[1]))]:base;
  // Retém as sombras e brilhos existentes no tecido; pele e cabelo ficam intactos.
  const luz=Math.max(.24,Math.min(1.42,(r*.2126+g*.7152+b*.0722)/57));
  for(let j=0;j<3;j++)out[i+j]=limitar(cor[j]*luz+(luz>1?(luz-1)*28:0));
  out[i+3]=a;
 }
 return out;
}
