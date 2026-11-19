import React from 'react';
import {eventosIndividuaisPartida} from './estatisticasPartida.js';
export default function ResumoIndividualPartida({jogo,titulo='Seu desempenho'}){
 if(!jogo)return null;
 const itens=eventosIndividuaisPartida(jogo);
 return <div aria-label="Estatísticas individuais da partida" className="mt-2 w-full text-center">
  {titulo&&<div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">{titulo}</div>}
  {itens.length?<div className="flex flex-wrap justify-center gap-1.5">
   {itens.map(item=><span key={item.id} className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800/70 border border-white/10 rounded-md text-[11px] text-zinc-200">
     {item.icone||''} {item.valor!=null?<strong>{item.valor}</strong>:null} {item.rotulo}
   </span>)}
  </div>:<div className="text-[11px] text-zinc-500">Sem ações individuais de destaque registradas.</div>}
 </div>;
}
