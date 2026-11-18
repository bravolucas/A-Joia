import React from 'react';
/** Usa exclusivamente os eventos registrados na partida; não inventa estatísticas. */
export default function EstatisticasPosPartida({jogo,className=''}) {
 if(!jogo)return null;
 const gols=Number(jogo.golsMinha??jogo.gols??0)||0,assist=Number(jogo.assistMinha??jogo.assist??0)||0;
 const amarelos=Number(jogo.cartoesAmarelos??(jogo.amarelo?1:0))||0,vermelhos=Number(jogo.cartoesVermelhos??(jogo.vermelho?1:0))||0;
 const anulados=Number(jogo.golsAnulados??0)||0;
 const eventos=Array.isArray(jogo.eventos)?jogo.eventos:[];
 const varAnulados=eventos.filter(e=>e.tipo==='var'&&e.meu===true&&/anulad/i.test(e.texto||''));
 const itens=[['⚽','Gols',gols],['🎯','Assistências',assist]];
 if(amarelos)itens.push(['🟨','Cartões amarelos',amarelos]);
 if(vermelhos)itens.push(['🟥','Cartões vermelhos',vermelhos]);
 if(anulados)itens.push(['📺','Gols anulados',anulados]);
 if(varAnulados.length&&!anulados)itens.push(['📺','Gols anulados',varAnulados.length]);
 if(Number.isFinite(jogo.defesas))itens.push(['🧤','Defesas',jogo.defesas]);
 if(jogo.cleanSheets)itens.push(['🛡️','Sem sofrer gols',jogo.cleanSheets]);
 if(Number.isFinite(jogo.nota))itens.push(['⭐','Nota',jogo.nota]);
 return <div className={className} aria-label="Estatísticas individuais da partida">
  <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-1">Sua atuação na partida</div>
  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-zinc-200">
   {itens.map(([icone,rotulo,valor])=><span key={rotulo} title={rotulo}><span aria-hidden="true">{icone}</span> {valor} {rotulo.toLowerCase()}</span>)}
  </div>
 </div>;
}
