/**
 * Apresentação de partidas do Arquivo Vivo.
 * Não altera confrontos, placares, datas, séries ou saves.
 * Agrupa ligas por rodada e copas por fase DOCUMENTADA.
 * Em registros antigos sem fase, exibe "Etapa N" em vez de inventar oitavas/final.
 */
const numero=x=>Number.isInteger(x)&&x>=1?x:null;
const texto=x=>typeof x==='string'?x.trim():'';
const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const ordemFase=s=>{
 const f=normal(s);
 if(/preliminar|qualificat/.test(f))return 1;
 if(/grupo|league phase|fase de liga|primeira fase|fase inicial/.test(f))return 2;
 if(/playoff|repescagem|16 avos|dezesseis avos|1\/16|32 avos/.test(f))return 3;
 if(/oitavas|round of 16|1\/8/.test(f))return 4;
 if(/quartas|quarter|1\/4/.test(f))return 5;
 if(/semifinal|semi-final/.test(f))return 6;
 if(/terceiro lugar|3º lugar|3o lugar/.test(f))return 7;
 if(/final/.test(f))return 8;
 return 9;
};

function faseInformada(j){
 const fase=texto(j?.fase)||(!numero(j?.rodada)?texto(j?.rodada):'');
 if(!fase)return '';
 if(/^playoff-/i.test(fase))return 'Playoffs de acesso';
 if(/^quadrangular-/i.test(fase))return 'Quadrangulares';
 if(/^final-serie-c-/i.test(fase))return 'Final';
 return fase;
}
export function agruparPartidasCompeticao(edicao={},jogos=[]){
 const liga=edicao?.tipo==='liga';
 const agrupados=new Map();
 for(const partida of Array.isArray(jogos)?jogos:[]){
  if(!partida?.casa||!partida?.fora)continue;
  const fase=faseInformada(partida);
  const rodada=numero(partida.rodada);
  const decisiva=liga&&/^(playoff-|quadrangular-|final-serie-c-)/i.test(texto(partida.fase));
  let chave,rotulo,ordem;
  if(liga&&!decisiva){
   chave='rodada-'+(rodada??'sem-dado');
   rotulo=rodada?'Rodada '+rodada:'Rodada não registrada';
   ordem=rodada??999;
  }else{
   // Fases de grupos podem ter subdivisões por grupo; agrupamos todas
   // em uma fase para evitar dezenas de painéis.
   const grupo=/^fase de grupos/i.test(fase)?'Fase de grupos':fase;
   rotulo=grupo||(rodada?'Etapa '+rodada:'Fase não registrada');
   chave='fase-'+normal(rotulo);
   ordem=ordemFase(rotulo)*1000+(rodada??0);
  }
  if(!agrupados.has(chave))agrupados.set(chave,{chave,rotulo,ordem,partidas:[]});
  agrupados.get(chave).partidas.push(partida);
 }
 return [...agrupados.values()].sort((a,b)=>a.ordem-b.ordem||
  a.rotulo.localeCompare(b.rotulo,'pt-BR')).map(({chave,rotulo,partidas})=>({chave,rotulo,partidas}));
}
