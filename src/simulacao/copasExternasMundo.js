import {SELECOES_TECNICO,CONTINENTAIS_TECNICO} from '../treinador/selecoesTecnico.js';
import {simularCampanhaCopa,resumoCampanhaCopa,jogoEliminatorio} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {CLUBES_MUNDIAIS_EXTRAS,NOME_MUNDIAL_ANUAL} from '../competicoes/mundialRapido.js';
const semente=(c,a,nome)=>`${c.codigoMundo||c.codigo||c.nome||'mundo'}|${a.ano}|calendario-externo|${nome}`;
const ocupadas=a=>new Set([...(a.torneios||[]),...(a.torneiosMundo||[]),a.copa,a.copaResultado,a.continentalSelecaoResultado,a.mundial].filter(Boolean).map(t=>t.nome));
const continentalAno=(conf,ano)=>['UEFA','CONMEBOL','OFC'].includes(conf)?ano%4===0:conf==='AFC'?ano%4===3:ano%2===1;
/** O calendário internacional existe mesmo sem convocação ou emprego numa seleção. */
export function simularSelecoesMundo(c,a){
 const conhecidas=ocupadas(a),torneios=[];
 const conf=SELECOES_TECNICO.find(n=>n.nac===(c.nac||c.nacionalidade||c.tecnico?.selecao))?.confederacao;
 if(a.copa&&!a.copa.nome)conhecidas.add(a.ano%4===2?'Copa do Mundo':CONTINENTAIS_TECNICO[conf]);
 if(a.copaResultado&&!a.copaResultado.nome)conhecidas.add('Copa do Mundo');
 if(a.continentalSelecaoResultado&&!a.continentalSelecaoResultado.nome)conhecidas.add(CONTINENTAIS_TECNICO[conf]);
 const simular=(nome,tipo,pool,formato)=>{
  if(conhecidas.has(nome)||pool.length<2)return;
  const eu=pool[0],camp=simularCampanhaCopa({nome,tipo,usuario:eu.nome,forcaUsuario:eu.elenco,clubes:pool.map(n=>({...n,forca:n.elenco})),ano:a.ano,formato,seed:semente(c,a,nome)});
  torneios.push({...resumoCampanhaCopa(camp),selecao:true,origem:'calendario-mundo'});
 };
 const eliminada=c.tecnico?.tipoEquipe==='selecao'&&c.tecnico.classificacaoSelecao?.copa===a.ano&&!c.tecnico.classificacaoSelecao.classificado?c.tecnico.selecao:null;
 if(a.ano%4===2)simular('Copa do Mundo','copaMundo',SELECOES_TECNICO.filter(n=>n.nac!==eliminada).sort((a,b)=>b.elenco-a.elenco||a.nome.localeCompare(b.nome)).slice(0,48),'selecao48');
 for(const [conf,nome] of Object.entries(CONTINENTAIS_TECNICO))if(continentalAno(conf,a.ano))simular(nome,'continentalSelecao',SELECOES_TECNICO.filter(n=>n.confederacao===conf),'mata');
 return torneios;
}
const principal=t=>t.campeao&&['Champions League','Libertadores','Champions Asiática','Concacaf Champions','Concacaf'].includes(t.nome);
/** Mundial anual usa os campeões continentais efetivos; todas as suas cinco partidas ficam salvas. */
export function simularMundiaisMundo(c,a,clubes){
 if(a.mundial)return []; // Competição legada do usuário: não inventar um segundo vencedor.
 const conhecidas=ocupadas(a),torneios=[],fontes=[...(a.torneiosMundo||[]),...(a.torneios||[])];
 const porNome=new Map([...clubes,...CLUBES_MUNDIAIS_EXTRAS].map(cl=>[cl.nome,cl]));
 const campeao=nomes=>{const t=fontes.find(t=>nomes.includes(t.nome)&&t.campeao&&!t.finalPendente);return t&&porNome.get(t.campeao);};
 const europa=campeao(['Champions League']),sul=campeao(['Libertadores']),asia=campeao(['Champions Asiática']),norte=campeao(['Concacaf Champions','Concacaf']);
 const africa=porNome.get('Al Ahly'),oceania=porNome.get('Auckland City');
 if(!conhecidas.has(NOME_MUNDIAL_ANUAL)&&[europa,sul,asia,norte,africa,oceania].every(Boolean)){
  const rng=geradorTecnico(semente(c,a,NOME_MUNDIAL_ANUAL)),fases=[];
  const jogar=(fase,x,y)=>{const jogo=jogoEliminatorio(x,y,rng);fases.push({fase,jogos:[jogo]});return jogo.vencedor===x.nome?x:y;};
  const africasia=jogar('Playoff África–Ásia–Pacífico',asia,jogar('Primeira fase',africa,oceania));
  const americas=jogar('Derby das Américas',sul,norte),rival=jogar('Copa Challenger',americas,africasia),vencedor=jogar('Final',europa,rival);
  torneios.push({nome:NOME_MUNDIAL_ANUAL,tipo:'mundial',ano:a.ano,formato:'intercontinental',participantes:6,campeao:vencedor.nome,vice:vencedor.nome===europa.nome?rival.nome:europa.nome,fases,origem:'calendario-mundo'});
 }
 if((a.ano-2025)%4===0&&!conhecidas.has('Mundial de Clubes FIFA')&&!conhecidas.has('Mundial de Clubes')){
  const historico=(c.historiaFutebol?.titulos||[]).filter(t=>t.ano>=a.ano-4&&t.ano<a.ano&&principal({...t,campeao:t.clube}));
  const vagas=new Set(historico.map(t=>t.clube)),selecionar=(ligas,q)=>clubes.filter(cl=>ligas.includes(cl.liga)).sort((a,b)=>Number(vagas.has(b.nome))-Number(vagas.has(a.nome))||b.forca-a.forca||a.nome.localeCompare(b.nome)).slice(0,q);
  const pool=[...new Map([...selecionar(['inglaterra','espanha','italia','alemanha','franca','portugal','holanda'],12),...selecionar(['brasileirao','argentina','sulamericano'],6),...selecionar(['arabia'],4),...selecionar(['mls'],4),...CLUBES_MUNDIAIS_EXTRAS].map(cl=>[cl.nome,cl])).values()];
  for(const cl of [...clubes].sort((a,b)=>b.forca-a.forca))if(pool.length<32&&!pool.some(p=>p.nome===cl.nome))pool.push(cl);
  if(pool.length===32){const eu=pool[0],camp=simularCampanhaCopa({nome:'Mundial de Clubes FIFA',tipo:'mundial',usuario:eu.nome,forcaUsuario:eu.forca,clubes:pool,ano:a.ano,formato:'selecao32',seed:semente(c,a,'Mundial de Clubes FIFA')});torneios.push({...resumoCampanhaCopa(camp),formato:'mundial32',origem:'calendario-mundo'});}
 }
 return torneios;
}
/** A base também disputa sua copa quando a carreira já está no profissional ou fora do Brasil. */
export function simularCopinhaMundo(c,a,clubes){
 if(a.copinhaCarreira||[...(a.torneios||[]),...(a.torneiosMundo||[])].some(t=>t.tipo==='copinha'||/Copinha|Copa São Paulo/i.test(t.nome)))return [];
 const pool=clubes.filter(cl=>['brasileirao','serieB'].includes(cl.liga)).sort((a,b)=>b.forca-a.forca||a.nome.localeCompare(b.nome)).slice(0,32);if(pool.length<2)return [];
 const eu=pool[0],camp=simularCampanhaCopa({nome:'Copa São Paulo',tipo:'copinha',usuario:eu.nome,forcaUsuario:eu.forca,clubes:pool,ano:a.ano,formato:'selecao32',seed:semente(c,a,'Copa São Paulo')});
 return [{...resumoCampanhaCopa(camp),formato:'grupos',origem:'calendario-mundo'}];
}
