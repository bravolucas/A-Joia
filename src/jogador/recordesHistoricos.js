import {MARCAS_COPAS} from '../dados/marcasCopas.js';
const numero=x=>Number.isFinite(x)?Math.max(0,x):0;
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
