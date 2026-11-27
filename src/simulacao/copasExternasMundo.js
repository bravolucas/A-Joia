import {SELECOES_TECNICO,CONTINENTAIS_TECNICO} from '../treinador/selecoesTecnico.js';
import {simularCampanhaCopa,resumoCampanhaCopa,jogoEliminatorio} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {classificadosCopaDoMundo,participantesContinentalSelecoes} from '../competicoes/copaDoMundo.js';
import {CLUBES_MUNDIAIS_EXTRAS,NOME_MUNDIAL_ANUAL} from '../competicoes/mundialRapido.js';
const semente=(c,a,nome)=>`${c.codigoMundo||c.codigo||c.nome||'mundo'}|${a.ano}|calendario-externo|${nome}`;
const ocupadas=a=>new Set([...(a.torneios||[]),...(a.torneiosMundo||[]),a.copa,a.copaResultado,a.continentalSelecaoResultado,a.mundial].filter(Boolean).map(t=>t.nome));
const continentalAno=(conf,ano)=>['UEFA','CONMEBOL','OFC'].includes(conf)?ano%4===0:conf==='AFC'?ano%4===3:ano%2===1;
/** O calendário internacional existe mesmo sem convocação ou emprego numa seleção. */
const copaPessoal=(a,tipo)=>a.copa&&(a.copa.ano==null||a.copa.ano===a.ano)&&(a.copa.tipo===tipo||(!a.copa.tipo&&a.copa.nome===(tipo==='copaMundo'?'Copa do Mundo':'')))?a.copa:null;
const campeaoConfirmado=t=>typeof t?.campeao==='string'&&!!t.campeao;
export function simularSelecoesMundo(c,a){
 // Uma campanha do jogador não representa o campeão da edição inteira.
 // Só bloqueia o calendário externo quando existe vencedor confirmado.
 const pessoal=copaPessoal(a,'copaMundo');
 const conhecidas=ocupadas({...a,copa:campeaoConfirmado(a.copa)?a.copa:null}),torneios=[];
 const conf=SELECOES_TECNICO.find(n=>n.nac===(c.nac||c.nacionalidade||c.tecnico?.selecao))?.confederacao;
 if(a.copa&&!a.copa.nome&&campeaoConfirmado(a.copa))conhecidas.add(a.ano%4===2?'Copa do Mundo':CONTINENTAIS_TECNICO[conf]);
 if(a.copaResultado&&!a.copaResultado.nome)conhecidas.add('Copa do Mundo');
 if(a.continentalSelecaoResultado&&!a.continentalSelecaoResultado.nome)conhecidas.add(CONTINENTAIS_TECNICO[conf]);
 const simular=(nome,tipo,pool,formato)=>{
  if(conhecidas.has(nome)||pool.length<2)return;
  const eu=pool[0],camp=simularCampanhaCopa({nome,tipo,usuario:eu.nome,forcaUsuario:eu.elenco,clubes:pool.map(n=>({...n,forca:n.elenco})),ano:a.ano,formato,seed:semente(c,a,nome)});
  if(camp.fase!=='fim'||!camp.campeao)throw new Error(`A simulação de ${nome} ${a.ano} não foi concluída.`);
  torneios.push({...resumoCampanhaCopa(camp),selecao:true,origem:'calendario-mundo'});
 };
 const eliminada=c.tecnico?.tipoEquipe==='selecao'&&c.tecnico.classificacaoSelecao?.copa===a.ano&&!c.tecnico.classificacaoSelecao.classificado?c.tecnico.selecao:null;
 if(a.ano%4===2){
  // A final efetivamente disputada tem precedência. Não sortear outro campeão
  // quando o usuário venceu a taça ou perdeu a final para uma seleção conhecida.
  const ultimo=Array.isArray(pessoal?.jogos)?pessoal.jogos.at(-1):null;
  const viceOuCampeao=pessoal?.fim&&pessoal.convocado&&
    (pessoal.campeao===true||(ultimo?.fase===4&&ultimo.res==='D'));
  if(!conhecidas.has('Copa do Mundo')&&viceOuCampeao){
   const minha=SELECOES_TECNICO.find(n=>n.nac===(pessoal.nac||c.nac));
   const pais=minha?.nome||pessoal.label;
   const adversario=ultimo?.adv||ultimo?.adversario;
   const rival=typeof adversario==='string'?adversario:adversario?.label||adversario?.nome;
   if(pais&&(pessoal.campeao===true||rival)){
    const ganhou=pessoal.campeao===true;
    torneios.push({nome:'Copa do Mundo',tipo:'copaMundo',ano:a.ano,
      participantes:48,formato:'copa48',campeao:ganhou?pais:rival,
      vice:ganhou?rival||null:pais,jogosUsuario:Array.isArray(pessoal.jogos)?pessoal.jogos:[],
      selecao:true,origem:'campanha-jogador'});
    conhecidas.add('Copa do Mundo');
   }
  }
  // Quem já foi eliminado não pode reaparecer campeão numa segunda simulação.
  const fora=[...(eliminada?[eliminada]:[]),
    ...(pessoal?.fim&&pessoal.convocado&&!pessoal.campeao?[pessoal.nac||c.nac]:[])];
  simular('Copa do Mundo','copaMundo',classificadosCopaDoMundo(a.ano,{
    semente:semente(c,a,'eliminatorias'),fora,selecoes:SELECOES_TECNICO
  }).classificadas,'copa48');
 }
 for(const [conf,nome] of Object.entries(CONTINENTAIS_TECNICO))if(continentalAno(conf,a.ano))simular(nome,'continentalSelecao',participantesContinentalSelecoes(conf,SELECOES_TECNICO),'selecaoGrupos');
 return torneios;
}

/** Recompõe apenas campeões de edições encerradas que ficaram ausentes no
 * histórico antigo. Não refaz jogos, gols, convocações ou títulos pessoais. */
export function completarHistoricoCopasMundo(c){
 if(!Array.isArray(c?.temporadas)||!Array.isArray(c?.historiaFutebol?.anos))return c;
 const anteriores=c.historiaFutebol.titulos||[],registrados=new Set(anteriores
  .filter(t=>t.nome==='Copa do Mundo'&&t.clube).map(t=>t.ano));
 const encerrados=new Set(c.historiaFutebol.anos),novos=[];
 for(const a of c.temporadas){
  if(!Number.isInteger(a?.ano)||a.ano<2026||a.ano%4!==2||!encerrados.has(a.ano)||registrados.has(a.ano))continue;
  const venceu=a.copa?.campeao===true||a.selecao?.campeao===true||
   (a.titulos||[]).some(t=>t?.tipo==='copaMundo')||
   (c.lista||[]).some(t=>t?.ano===a.ano&&t.tipo==='copaMundo');
  const selecao=SELECOES_TECNICO.find(t=>t.nac===(a.copa?.nac||c.nac));
  const resultado=venceu&&selecao?{campeao:selecao.nome}:
   simularSelecoesMundo(c,a).find(t=>t.nome==='Copa do Mundo');
  if(!resultado?.campeao)continue;
  novos.push({ano:a.ano,nome:'Copa do Mundo',tipo:'copaMundo',clube:resultado.campeao});
  registrados.add(a.ano);
 }
 return novos.length?{...c,historiaFutebol:{...c.historiaFutebol,titulos:[...anteriores,...novos]}}:c;
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
