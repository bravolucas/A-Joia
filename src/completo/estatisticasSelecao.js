/** Credita torneios encerrados a partir das partidas; amistosos já têm seu próprio fechamento. */
export function creditarTorneiosSelecao(c,card){
 c.selecao=c.selecao||{jogos:0,gols:0,assist:0,historico:[]};
 for(const [campo,comp,nome,r]of [['copaDoMundo','copa','Copa do Mundo',card.copaResultado],['continentalSelecao','continental',card.continentalSelecaoResultado?.nome,card.continentalSelecaoResultado]]){
  const st=card.statsCompeticoes?.[campo];if(!r||r.resultado==='Não convocado'||!st?.jogos)continue;
  const h=c.selecao.historico||[];if(h.some(x=>x.idade===c.idade&&x.comp===comp))continue;
  const novo={idade:c.idade,ano:card.ano,comp,nomeComp:nome,campanha:r.resultado,titulo:!!r.titulo,jogos:st.jogos,gols:st.gols||0,assist:st.assist||0,cleanSheets:st.cleanSheets||0,origem:'partidas-jogadas'};
  for(const k of ['jogos','gols','assist','cleanSheets'])c.selecao[k]=(c.selecao[k]||0)+novo[k];
  c.selecao.historico=[...h,novo];c.selecao.convocacoesSeguidas=(c.selecao.convocacoesSeguidas||0)+1;
 }
 return c;
}
export function resumoSelecaoTemporada(c){
 const h=(c.selecao?.historico||[]).filter(t=>t.idade===c.idade);if(!h.length)return null;
 return {nome:'Seleção nacional',nomeComp:h.map(t=>t.nomeComp||t.campanha).filter(Boolean).join(' · '),campanha:h.map(t=>t.campanha).filter(Boolean).join(' · '),titulo:h.some(t=>t.titulo),...Object.fromEntries(['jogos','gols','assist','cleanSheets'].map(k=>[k,h.reduce((n,t)=>n+(t[k]||0),0)]))};
}
