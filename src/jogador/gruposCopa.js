const hash=s=>[...s].reduce((v,l)=>(v*31+l.charCodeAt(0))>>>0,7);
export const jogosDoGrupo=k=>(k.jogos||[]).filter(j=>j.fase===0);
export function tabelaGrupoCopa(k){
 const times=[{id:k.nac,label:k.label},...(k.grupo||[])];
 const linhas=times.map(t=>({...t,j:0,p:0,gp:0,gc:0,sg:0}));
 const registrar=(a,b,gp,gc)=>{const x=linhas.find(t=>t.id===a),y=linhas.find(t=>t.id===b);if(!x||!y||!Number.isInteger(gp)||!Number.isInteger(gc))return;x.j++;y.j++;x.gp+=gp;x.gc+=gc;y.gp+=gc;y.gc+=gp;x.p+=gp>gc?3:gp===gc?1:0;y.p+=gc>gp?3:gc===gp?1:0;};
 for(const j of jogosDoGrupo(k))registrar(k.nac,j.adv.id,j.gp,j.gc);
 for(const j of k.jogosGrupoOutros||[])registrar(j.mandante.id,j.visitante.id,j.gp,j.gc);
 for(const l of linhas)l.sg=l.gp-l.gc;
 return linhas.sort((a,b)=>b.p-a.p||b.sg-a.sg||b.gp-a.gp||hash(`${k.ano}:${a.id}`)-hash(`${k.ano}:${b.id}`)||a.id.localeCompare(b.id));
}
export const empateGrupo=p=>Math.min(.26,Math.max(0,1-p));
