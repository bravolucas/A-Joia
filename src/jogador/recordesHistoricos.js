import {MARCAS_COPAS} from '../dados/marcasCopas.js';
const numero=x=>Number.isFinite(x)?Math.max(0,x):0;
/** Meta histórica legada de Klose (16 gols até 2022). Não se confunde
 * com o recorde mundial vigente, que pode mudar sem apagar troféus antigos. */
export function marcaLegadaKlose(c){
 const porAno=new Map();
 for(const t of c?.temporadas||[])if(t?.ano!=null)porAno.set(t.ano,t);
 let gols=0,anoIgualou=null;
 for(const t of [...porAno.values()].sort((a,b)=>a.ano-b.ano)){
  if(t.selecao?.tipo!=='copaMundo'&&!(t.copa?.convocado&&(t.copa.tipo||t.selecao?.tipo||'copaMundo')==='copaMundo'))continue;
  gols+=numero(t.selecao?.gols??t.copa?.gols);
  if(gols>=16&&anoIgualou===null)anoIgualou=t.ano;
 }
 return {atual:gols,anoIgualou,valor:16,nome:'Gols em Copas'};
}

export function compararMarcasCopas(c,atual){
 const temporadas=new Map();for(const t of [...(c.temporadas||[]),...(atual?[atual]:[])])if(t?.ano!=null)temporadas.set(t.ano,t);
 const copas=[...temporadas.values()].filter(t=>t.selecao?.tipo==='copaMundo'||t.copa?.convocado&&(t.copa.tipo||t.selecao?.tipo||'copaMundo')==='copaMundo').sort((a,b)=>a.ano-b.ano);
 const gols=t=>numero(t.selecao?.gols??t.copa?.gols);
 return MARCAS_COPAS.map(m=>{
  let acumulado=0,anoIgualou=null,anoSuperou=null,incompleto=false;
  for(const t of copas){if(m.tipo==='jogos'){const jogos=t.selecao?.jogos;if(Number.isFinite(jogos))acumulado+=numero(jogos);else incompleto=true;}else acumulado=m.tipo==='carreira'?acumulado+gols(t):Math.max(acumulado,gols(t));if(acumulado>=m.valor&&anoIgualou===null)anoIgualou=t.ano;if(acumulado>m.valor&&anoSuperou===null)anoSuperou=t.ano;}
  return{...m,incompleto,atual:acumulado,anoIgualou,anoSuperou,estado:acumulado>m.valor?'Superou na simulação':acumulado===m.valor?'Igualou na simulação':'Em busca',faltam:Math.max(0,m.valor-acumulado)};
 });
}
