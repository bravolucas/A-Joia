/** Classifica somente conquistas e números presentes na carreira. */
export function pesoConquista(o){
 const n=o.nome||'';
 return /copa do mundo/i.test(n)?120:/bola de ouro/i.test(n)?110:/champions league|libertadores/i.test(n)?100:/intercontinental|mundial/i.test(n)?92:/eurocopa|copa américa|africana|copa da ásia/i.test(n)?85:/europa league|sul-americana/i.test(n)?72:/bota de ouro|yashin/i.test(n)?70:/série b|segunda|championship/i.test(n)?30:/estadual|paulista|carioca/i.test(n)?20:55;
}
export function podioTemporada(t){
 const linhas=t?.bola?.top||t?.rankingBO||[];
 return linhas.slice(0,3).filter(p=>typeof p?.nome==='string'&&p.nome.trim()).map((p,i)=>({nome:p.nome,clube:p.clube||p.clubeNome||null,posicao:i+1,voce:!!p.voce}));
}
export function tacasDaPassagem(o){
 const grupos=new Map();for(const t of o.titulos||[]){const k=t.nome;if(!grupos.has(k))grupos.set(k,{nome:t.nome,tipo:t.tipo,quantidade:0});grupos.get(k).quantidade++;}
 return [...grupos.values()].sort((a,b)=>pesoConquista(b)-pesoConquista(a));
}
export function marcasMuseu(ts){return [['gols','Gols em uma temporada'],['assist','Assistências em uma temporada'],['defesas','Defesas em uma temporada']].map(([campo,rotulo])=>{const t=ts.filter(t=>Number.isFinite(t[campo])&&t[campo]>0).sort((a,b)=>b[campo]-a[campo]||a.ano-b.ano)[0];return t?{campo,rotulo,valor:t[campo],ano:t.ano,clube:t.clube}:null;}).filter(Boolean);}
export function destaquesMuseu(objetos){
 const camisas=objetos.filter(o=>o.tipo==='camisa');
 const valor=o=>(o.stats?.jogos||0)*.15+(o.idolo?45:0)+(o.temporadas?.length||0)*4+(o.titulos||[]).reduce((n,t)=>n+pesoConquista(t)+(t.primeiro?40:0),0);
 const camisa=[...camisas].sort((a,b)=>valor(b)-valor(a))[0];
 const trofeu=objetos.filter(o=>['taca','premio'].includes(o.tipo)).sort((a,b)=>pesoConquista(b)-pesoConquista(a)||(b.quantidade||1)-(a.quantidade||1))[0];
 const valorMarco=o=>o.id==='marca-temporada'?5:(o.id.startsWith('feito-')?25:10)+pesoConquista(o)+(/recorde|artilheiro histórico|mais gols|mais jogos|maior.*artilheiro|seleção|mundo/i.test(`${o.nome} ${o.texto}`)?100:0);
 const recorde=objetos.filter(o=>o.tipo==='placa').sort((a,b)=>valorMarco(b)-valorMarco(a))[0];
 return [{id:camisa?.id,rotulo:'A camisa mais marcante'},{id:trofeu?.id,rotulo:'A maior conquista'},{id:recorde?.id,rotulo:'Uma marca da carreira'}].filter(o=>o.id);
}
