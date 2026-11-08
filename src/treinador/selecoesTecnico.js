import { NACIONALIDADES } from '../dados/data.js';
import { geradorTecnico, simularCopaSelecaoTecnico, finalDoUsuarioTecnico } from './momentosTecnico.js';

const grupos = {
 CONMEBOL:'BRA ARG URU COL EQU PAR CHI PER BOL',
 AFC:'JAP COR ARS IRA AUS QAT CHN IRQ CDN KUW EAU',
 CAF:'MAR SNE NIG CMR ALG CSC EGI TUN GAN AFS ANG TOG RDC',
 CONCACAF:'EUA MEX CRC CAN JAM HON PAN TRI HAI ELS', OFC:'NZL FIJ TAH SOL',
};
export const confederacaoTecnico = id => Object.keys(grupos).find(k=>grupos[k].split(' ').includes(id)) || 'UEFA';
export const CONTINENTAIS_TECNICO = {UEFA:'Eurocopa',CONMEBOL:'Copa América',CAF:'Copa Africana de Nações',AFC:'Copa da Ásia',CONCACAF:'Copa Ouro',OFC:'Copa das Nações da Oceania'};
const extras = [{id:'FIJ',label:'Fiji',forcaSelecao:48},{id:'TAH',label:'Taiti',forcaSelecao:50},{id:'SOL',label:'Ilhas Salomão',forcaSelecao:49}];
export const SELECOES_TECNICO = [...NACIONALIDADES,...extras].map(n=>({nome:n.label,pais:n.label,nac:n.id,tipo:'selecao',liga:`selecao:${confederacaoTecnico(n.id)}`,confederacao:confederacaoTecnico(n.id),elenco:n.forcaSelecao,exigencia:Math.max(30,n.forcaSelecao-17),salario:Math.round(n.forcaSelecao*n.forcaSelecao/110),motivo:`Seleção · ${confederacaoTecnico(n.id)} · vínculo exclusivo; deixa o clube atual`}));
/** On taking an existing national team in a World Cup year, inherit its qualifying result. */
export function vagaHerdadaSelecaoTecnico(nac,ano){
 if(ano%4!==2)return null;
 const n=SELECOES_TECNICO.find(x=>x.nac===nac);if(!n)return null;
 return {nac,copa:ano,classificado:geradorTecnico(`${ano}|${nac}|eliminatorias-mundo`)()<Math.max(.12,Math.min(.95,(n.elenco-40)/55)),herdada:true};
}
export function propostasSelecoesTecnico(t,ovr,rng) {
 if ((t.temporadas?.length||0)<2 || ovr<48 || (t.reputacao||0)<38) return [];
 const recentes=new Set([...(t.propostas||[]).map(p=>p.nome),...(t.ofertasRecentes||[]).slice(-9)]);
 const elegiveis=SELECOES_TECNICO.filter(n=>n.nome!==t.clube && n.exigencia<=(t.reputacao||0) && n.elenco<=ovr+17 && (n.elenco<85 || ovr>=70));
 return elegiveis.filter(()=>rng()<.7).map(n=>({...n,prioridade:Math.log(Math.max(1e-9,rng()))/((recentes.has(n.nome)?.15:1)*(n.pais===t.pais?1.3:1))})).sort((a,b)=>b.prioridade-a.prioridade).slice(0,2).map(n=>{const classificacaoSelecao=vagaHerdadaSelecaoTecnico(n.nac,t.ano);return {...n,classificacaoSelecao,motivo:n.motivo+(classificacaoSelecao?classificacaoSelecao.classificado?' · Com vaga na Copa':' · Sem vaga nesta Copa':'')};});
}
/** Existing mixed seasons retain their club campaign; only national trophies change owner. */
export function equipeTituloTecnico(a,nome) {
 const torneio=(a.torneios||[]).find(x=>x.nome===nome && x.selecao);
 return torneio?.selecao || a.selecaoNome || a.clube;
}
const limitar=(v,a,b)=>Math.max(a,Math.min(b,v));
function partida(a,b,rng,mata=false) {
 let ga=Math.floor(rng()*3.3+Math.max(0,a.elenco-b.elenco)/22),gb=Math.floor(rng()*3.3+Math.max(0,b.elenco-a.elenco)/22);
 const penaltis=mata&&ga===gb;
 return {casa:a.nome,fora:b.nome,golsCasa:ga,golsFora:gb,penaltis,vencedor:ga===gb?(mata?(rng()<.5?a.nome:b.nome):null):ga>gb?a.nome:b.nome};
}
function eliminatorias(t,eu,pool,rng) {
 const rivais=pool.filter(n=>n.nac!==eu.nac).map(n=>({...n,ordem:rng()})).sort((a,b)=>a.ordem-b.ordem).slice(0,3);
 const times=[eu,...rivais], jogos=[],tabela=new Map(times.map(n=>[n.nome,{nome:n.nome,pontos:0,vitorias:0,golsPro:0,golsContra:0,meuClube:n.nome===eu.nome}]));
 for(let i=0;i<times.length;i++)for(let j=i+1;j<times.length;j++)for(const [a,b] of [[times[i],times[j]],[times[j],times[i]]]){
  const jogo=partida(a,b,rng);jogos.push(jogo);
  const x=tabela.get(a.nome),y=tabela.get(b.nome);x.golsPro+=jogo.golsCasa;x.golsContra+=jogo.golsFora;y.golsPro+=jogo.golsFora;y.golsContra+=jogo.golsCasa;
  if(jogo.vencedor){const v=tabela.get(jogo.vencedor);v.pontos+=3;v.vitorias++;}else{x.pontos++;y.pontos++;}
 }
 const classificacao=[...tabela.values()].sort((a,b)=>b.pontos-a.pontos||(b.golsPro-b.golsContra)-(a.golsPro-a.golsContra)||b.golsPro-a.golsPro||a.nome.localeCompare(b.nome)).map((x,i)=>({...x,posicao:i+1}));
 return {nome:`Eliminatórias da Copa · ${eu.confederacao}`,tipo:'eliminatorias',selecao:eu.nome,campeao:null,faseUsuario:classificacao.find(x=>x.meuClube).posicao<=2?'Vaga para a Copa':'Fora da zona de classificação',classificacao,grupos:[{grupo:'Grupo classificatório',jogos,classificacao}],fases:[],jogosUsuario:jogos.filter(j=>j.casa===eu.nome||j.fora===eu.nome)};
}
function continental(eu,pool,rng){
 let vivos=[eu,...pool.filter(n=>n.nac!==eu.nac).map(n=>({...n,ordem:rng()})).sort((a,b)=>a.ordem-b.ordem).slice(0,7)];
 // Four teams in Oceania; eight elsewhere, with the confederation's actual countries.
 const copa={nome:CONTINENTAIS_TECNICO[eu.confederacao],tipo:'continentalSelecao',selecao:eu.nome,forcas:Object.fromEntries(vivos.map(n=>[n.nome,n.elenco])),fases:[],jogosUsuario:[],faseUsuario:'Participação',campeao:null};
 while(vivos.length>1){const fase=vivos.length<=2?'Final':vivos.length<=4?'Semifinal':'Quartas de final',jogos=[],proximos=[];
  for(let i=0;i<vivos.length;i+=2){const a=vivos[i],b=vivos[i+1];if(!b){proximos.push(a);continue;}const j={...partida(a,b,rng,true),fase};jogos.push(j);proximos.push(j.vencedor===a.nome?a:b);if([j.casa,j.fora].includes(eu.nome)){copa.jogosUsuario.push(j);copa.faseUsuario=j.vencedor===eu.nome?fase:`Eliminado: ${fase.toLowerCase()}`;}}
  copa.fases.push({fase,jogos});vivos=proximos;
 }
 copa.campeao=vivos[0].nome;if(copa.campeao===eu.nome)copa.faseUsuario='Campeão';return copa;
}
export function simularAnoSelecaoTecnico(t,ovr,forca,rng,opcoes={}){
 const base=SELECOES_TECNICO.find(n=>n.nac===t.selecao);if(!base)throw new Error('Seleção indisponível.');
 const eu={...base,elenco:limitar(forca+Math.round((ovr-60)*.1),30,99)},pool=SELECOES_TECNICO.filter(n=>n.confederacao===eu.confederacao),ano=t.ano;
 const torneios=[],finaisPendentes=[];
 const copaAno=ano%4===2, continentalAno=['UEFA','CONMEBOL','OFC'].includes(eu.confederacao)?ano%4===0:eu.confederacao==='AFC'?ano%4===3:ano%2===1;
 let classificacaoSelecao=t.classificacaoSelecao || vagaHerdadaSelecaoTecnico(eu.nac,ano);
 if(!copaAno){const e=eliminatorias(t,eu,pool,rng);torneios.push(e);classificacaoSelecao={nac:eu.nac,copa:ano+(6-ano%4)%4,classificado:e.classificacao.find(x=>x.meuClube).posicao<=2};}
 if(continentalAno)torneios.push(continental(eu,pool,rng));
 if(copaAno && classificacaoSelecao?.copa===ano && classificacaoSelecao?.nac===eu.nac && classificacaoSelecao.classificado)torneios.push(simularCopaSelecaoTecnico({nac:eu.nac,selecao:eu.nome,forca:eu.elenco},ovr,`${ano}|${eu.nac}|mundial`));
 if(!torneios.length){const jogos=pool.filter(n=>n.nac!==eu.nac).slice(0,3).map(n=>partida(eu,n,rng));torneios.push({nome:'Amistosos internacionais',tipo:'amistoso',selecao:eu.nome,faseUsuario:'Preparação · sem vaga na Copa',fases:[{fase:'Amistosos',jogos}],jogosUsuario:jogos});}
 for(const copa of torneios){if(['eliminatorias','amistoso'].includes(copa.tipo))continue;const f=opcoes.interativo?finalDoUsuarioTecnico(copa,eu.nome):null;if(f){finaisPendentes.push({...f,ano,tipo:copa.tipo,forcaUsuario:eu.elenco,forcaAdv:copa.forcas?.[f.adversario]??80,dado:rng()});copa.campeao=null;copa.finalPendente=true;copa.faseUsuario='Final';}}
 const titulosConquistados=torneios.filter(x=>x.campeao===eu.nome).map(x=>x.nome),jogos=torneios.flatMap(x=>x.jogosUsuario||[]);
 const vitorias=jogos.filter(x=>x.vencedor===eu.nome).length,empates=jogos.filter(x=>!x.vencedor).length,derrotas=jogos.length-vitorias-empates;
 const cumpriuObjetivo=titulosConquistados.length>0 || (copaAno?torneios.some(x=>x.nome==='Copa do Mundo'&&!/grupo/.test(x.faseUsuario)):classificacaoSelecao?.classificado);
 const temporada={ano,clube:eu.nome,selecaoNome:eu.nome,tipoEquipe:'selecao',liga:eu.liga,competicao:torneios.map(x=>x.nome).join(' · '),objetivo:copaAno?'Avançar na Copa do Mundo':'Conquistar uma vaga na Copa',cumpriuObjetivo,jogos:jogos.length,vitorias,empates,derrotas,pontos:vitorias*3+empates,posicao:torneios[0].classificacao?.find(x=>x.meuClube)?.posicao??(titulosConquistados.length?1:null),campeao:false,titulosConquistados,torneios,decisoes:t.decisoes,classificacao:torneios[0].classificacao||[],formato:'Calendário internacional resumido: eliminatórias anuais em grupo de quatro; torneios continentais em mata-mata reduzido.'};
 return {ofertasRecentes:[...(t.ofertasRecentes||[]),...(t.propostas||[]).map(p=>p.nome)].slice(-18),ano:ano+1,fase:'resultado',temporadas:[...(t.temporadas||[]),temporada],classificacaoSelecao,finaisPendentes,conviteSelecao:null,reputacao:limitar(t.reputacao+(titulosConquistados.length?8:cumpriuObjetivo?3:-3),10,99),titulos:(t.titulos||0)+titulosConquistados.length,vitorias:(t.vitorias||0)+vitorias,empates:(t.empates||0)+empates,derrotas:(t.derrotas||0)+derrotas,diretoria:limitar((t.diretoria??60)+(cumpriuObjetivo?5:-10),0,100),torcida:limitar((t.torcida??55)+(cumpriuObjetivo?5:-6),0,100),demitido:(t.diretoria??60)<20,ultimaFinal:null,propostasCoerentesVersao:3};
}
