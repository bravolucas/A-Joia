import { CLUBES, LIGAS } from '../dados/data.js';
import { avaliarClubeNoMundo } from './forcaEquipe.js';
import { geradorTecnico } from '../treinador/momentosTecnico.js';
const limitar=(n,a,b)=>Math.max(a,Math.min(b,n));
const red=n=>Math.round(n*10)/10||0;
/** Snapshot serializável: o cadastro nunca é modificado e os mundos de saves distintos não se misturam. */
export function forcasDoMundo(c={}, clubes=CLUBES) {
  const porClube=new Map();for(const j of c.mundo?.jogadores||[]){if(j.aposentado)continue;if(!porClube.has(j.clubeNome))porClube.set(j.clubeNome,[]);porClube.get(j.clubeNome).push(j);}
  return Object.fromEntries(clubes.map(cl=>[cl.nome,avaliarClubeNoMundo(c,cl,{elenco:porClube.get(cl.nome)||[]}).forca]));
}
export function clubesDoMundo(c={},clubes=CLUBES) {
  const ligas=c.tecnico?.ligasMundo||c.ligas||{},porClube=new Map();
  for(const p of c.mundo?.jogadores||[]){if(!porClube.has(p.clubeNome))porClube.set(p.clubeNome,[]);porClube.get(p.clubeNome).push(p);}
  return clubes.map(cl=>{const a=avaliarClubeNoMundo(c,cl,{elenco:porClube.get(cl.nome)||[]});return {...cl,forca:a.forca,elenco:a.forca,ataque:a.ataque,defesa:a.defesa,liga:ligas[cl.nome]||cl.liga};});
}
function campanhaClube(a,nome){
  for(const [liga,t] of Object.entries(a.classificacoesMundo||{})){
    const linha=t.classificacao?.find(x=>x.nome===nome);if(linha)return {liga,posicao:linha.posicao||t.classificacao.indexOf(linha)+1,total:t.classificacao.length,pontos:linha.pontos};
  }
  if((typeof a.clube==='string'?a.clube:a.clube?.nome)===nome)return {liga:a.ligaId||a.liga,posicao:a.posLiga||a.posicao,total:a.totalLiga||a.classificacao?.length||a.tabelaLiga?.length||20,pontos:a.pontos};
  return null;
}
function jogosTorneio(t){return (t.fases||[]).flatMap(f=>(f.jogos||[]).map(j=>({...j,fase:j.fase||f.fase})));}
/** Grava somente o ano que acaba de ocorrer. Retomar ou consultar não sorteia outra temporada. */
export function registrarMundoVivo(c,a,{antesMundo}={}){
  if(!Number.isFinite(a?.ano))return;
  const anterior=c.universo||c.tecnico?.universo||{versao:1,desde:a.ano,clubes:{},atletas:{},edicoes:[],anos:[]};
  if(anterior.anos?.includes(a.ano))return;
  const u={...anterior,versao:1,clubes:{...anterior.clubes},atletas:{...anterior.atletas},edicoes:[...(anterior.edicoes||[])],anos:[...(anterior.anos||[]),a.ano]};
  const forcasAntes=forcasDoMundo({...c,universo:anterior,mundo:antesMundo||c.mundo});
  const titulos=c.historiaFutebol?.titulos?.filter(t=>t.ano===a.ano)||[];
  for(const cl of CLUBES){
    const p=u.clubes[cl.nome]||{mercado:0,estrutura:0,fase:0,reputacao:cl.forca,financas:50,historico:[]};
    const campanha=campanhaClube(a,cl.nome),tacas=titulos.filter(t=>t.clube===cl.nome).map(t=>t.nome);
    const rng=geradorTecnico(`${c.codigo||'carreira'}|${a.ano}|${cl.nome}|gestao-mundo`);
    const esperado=limitar(1-(cl.forca-40)/65,.08,.85);
    const desempenho=campanha?limitar(esperado-campanha.posicao/Math.max(1,campanha.total),-.8,.8):0;
    const movimento=a.movimentosMundo?.find(m=>m.clube===cl.nome)?.tipo||(a.subiram?.includes(cl.nome)?'acesso':a.cairam?.includes(cl.nome)?'rebaixamento':null);
    const receita=limitar(desempenho*8+Math.min(3,tacas.length)*2+(movimento==='acesso'?4:movimento==='rebaixamento'?-6:0),-10,10);
    const financas=limitar(p.financas*.85+50*.15+receita,5,95);
    // Acertos e erros de gestão existem também fora do clube do usuário. Não inventam transferências nominais.
    const ajusteMercado=(rng()+rng()-1)*1.8+(financas-50)*.012;
    const mercado=limitar(p.mercado*.92+ajusteMercado,-12,12);
    const estrutura=limitar(p.estrutura+receita*.025,-3,3);
    const fase=limitar(desempenho*2,-1.5,1.5);
    const motivos=[...(movimento?[movimento==='acesso'?'Acesso de divisão':'Rebaixamento']:[]),...(tacas.length?[`${tacas.length} título${tacas.length>1?'s':''} na temporada`]:[]),ajusteMercado>.45?'Planejamento do elenco fortaleceu o clube':ajusteMercado<-.45?'Planejamento do elenco deixou perdas':'Elenco passou por ajustes pontuais'];
    const antes=forcasAntes[cl.nome];
    const perfil={...p,mercado:red(mercado),estrutura:red(estrutura),fase:red(fase),financas:red(financas),reputacao:red(limitar(p.reputacao+receita*.2,20,99))};
    const depois=avaliarClubeNoMundo({...c,universo:{clubes:{[cl.nome]:perfil}}},cl).forca;
    u.clubes[cl.nome]={...perfil,historico:[...p.historico,{ano:a.ano,...campanha,titulos:tacas,forcaAntes:antes,forca:depois,financas:perfil.financas,motivos,...(movimento?{movimento}:{})}]};
  }
  const antigos=new Map((antesMundo?.jogadores||[]).map(p=>[String(p.id),p]));
  for(const p of c.mundo?.jogadores||[]){
    const velho=antigos.get(String(p.id)),clube=velho?.clubeNome||p.clubeTemporada||p.clubeNome;
    // Um aposentado já registrado não ganha mais uma temporada de estatísticas.
    if(p.aposentado&&(!velho||velho.aposentado))continue;
    const id=String(p.id),anteriorAtleta=u.atletas[id];
    const linha={ano:a.ano,clube,liga:velho?.liga||p.liga,jogos:p.jogos||0,gols:p.gols||0,assist:p.assist||0,...(p.posicao==='GOL'?{defesas:p.defesas||0,cleanSheets:p.cleanSheets||0}:{}),...(p.porCompeticao?{porCompeticao:p.porCompeticao}:{}),titulos:titulos.filter(t=>t.clube===clube).map(t=>t.nome),...(clube!==p.clubeNome?{destino:p.clubeNome}:{}),...(p.aposentado?{aposentou:true}:{})};
    u.atletas[id]={id,nome:p.nome,posicao:p.posicao,nac:p.nac,clube:p.clubeNome,aposentado:!!p.aposentado,historico:[...(anteriorAtleta?.historico||[]),compactarLinhaAtleta(linha)]};
  }
  const eu={ano:a.ano,clube:typeof a.clube==='string'?a.clube:a.clube?.nome,jogos:a.jogos||0,gols:a.gols||0,assist:a.assist||0,...(Number.isFinite(a.defesas)?{defesas:a.defesas}:{}),...(Number.isFinite(a.cleanSheets)?{cleanSheets:a.cleanSheets}:{}),porCompeticao:a.porCompeticao||[],titulos:(a.titulos||[]).filter(t=>typeof t==='object').map(t=>t.nome)};
  if(!c.tecnico||c.tecnico.fase!=='resultado')u.atletas.voce={id:'voce',nome:c.nome,posicao:c.posicao,nac:c.nac||c.nacionalidade,voce:true,clube:eu.clube,historico:[...(u.atletas.voce?.historico||[]),compactarLinhaAtleta(eu)]};
  // Edições completas existentes são arquivadas; dados antigos ausentes continuam ausentes.
  for(const [liga,t]of Object.entries(a.classificacoesMundo||{}))u.edicoes.push({ano:a.ano,nome:LIGAS[liga]?.nome||liga,tipo:'liga',classificacao:t.classificacao,jogos:compactarJogos(t.jogos||[]),campeao:t.classificacao?.[0]?.nome});
  if(!a.classificacoesMundo?.[a.ligaId||a.liga]&&(a.classificacao?.length||a.tabelaLiga?.length))u.edicoes.push({ano:a.ano,nome:a.ligaNome||LIGAS[a.ligaId||a.liga]?.nome||a.liga,tipo:'liga',classificacao:a.classificacao||a.tabelaLiga.map((nome,i)=>({nome,posicao:i+1})),jogos:compactarJogos(a.jogosLiga||[]),campeao:a.vencedorLiga||a.classificacao?.[0]?.nome||a.tabelaLiga?.[0]});
  for(const t of [...(a.torneiosMundo||[]),...(a.torneios||[])])if(t.campeao&&!t.finalPendente)u.edicoes.push({ano:a.ano,nome:t.nome,tipo:t.tipo,campeao:t.campeao,vice:t.vice,classificacao:t.classificacao||[],jogos:compactarJogos(jogosTorneio(t))});
  u.edicoes=[...new Map(u.edicoes.map(e=>[`${e.ano}|${e.nome}`,e])).values()];
  if(c.tecnico){delete c.universo;c.tecnico={...c.tecnico,universo:u,forcasMundo:forcasDoMundo({...c,universo:u})};}else c.universo=u;
}

export function compactarJogos(jogos=[]) {
  const nomes=[...new Set(jogos.flatMap(j=>[j.casa,j.fora]).filter(Boolean))];
  const indices=new Map(nomes.map((n,i)=>[n,i]));
  return {nomes,partidas:jogos.filter(j=>j.casa&&j.fora&&Number.isFinite(j.golsCasa)&&Number.isFinite(j.golsFora)).map(j=>[indices.get(j.casa),indices.get(j.fora),j.golsCasa,j.golsFora,j.rodada||j.fase||'',j.vencedor?indices.get(j.vencedor):null,j.penaltis?1:0])};
}
export function jogosDaEdicao(edicao) {
  if(Array.isArray(edicao?.jogos))return edicao.jogos;
  const {nomes=[],partidas=[]}=edicao?.jogos||{};
  return partidas.map(([a,b,golsCasa,golsFora,rodada,v,penaltis])=>({casa:nomes[a],fora:nomes[b],golsCasa,golsFora,rodada,vencedor:v==null?null:nomes[v],penaltis:!!penaltis}));
}
export function resumirTabelas(classificacoes) {
  return Object.fromEntries(Object.entries(classificacoes||{}).map(([liga,t])=>{const {jogos,...resumo}=t;return [liga,resumo];}));
}

// Linhas compactas mantêm décadas de carreiras pequenas também durante a simulação.
function compactarLinhaAtleta(a){return [a.ano,a.clube,a.jogos,a.gols,a.assist,a.defesas??null,a.cleanSheets??null,a.titulos||[],a.destino||null,a.aposentou?1:0,(a.porCompeticao||[]).map(t=>[t.nome,t.jogos,t.gols,t.assist,t.defesas||0,t.cleanSheets||0])];}
const historicosLidos=new WeakMap();
export function historicoAtleta(p){
 if(!p)return [];
 if(historicosLidos.has(p))return historicosLidos.get(p);
 const linhas=(p.historico||[]).map(a=>!Array.isArray(a)?a:{ano:a[0],clube:a[1],jogos:a[2],gols:a[3],assist:a[4],defesas:a[5],cleanSheets:a[6],titulos:a[7],destino:a[8],aposentou:!!a[9],porCompeticao:(a[10]||[]).map(t=>({nome:t[0],jogos:t[1],gols:t[2],assist:t[3],defesas:t[4],cleanSheets:t[5]}))});
 historicosLidos.set(p,linhas);return linhas;
}
