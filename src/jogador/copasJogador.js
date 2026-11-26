import {avancarCalendarioLigasRapido,finalizarCalendarioLigasRapido} from './ligasCalendarioRapido.js';
import {clubesDoMundo} from '../simulacao/mundoVivo.js';
import {criarAgenda,dataCopa,selecionarAgenda,avancarPausa,chaveAgenda} from '../competicoes/calendarioCopas.js';
import {clubesParaCopas,COPAS_NACIONAIS,vagaJogador,nomeVaga,regiaoDaLiga,calcularVagasRapidas} from '../competicoes/regrasCopasRapidas.js';
import {primeiraLiga} from '../competicoes/vagasInternacionais.js';
import {participantesEstadual} from '../competicoes/estaduaisRapidos.js';
import {ampliarParticipantesInternacionais} from '../competicoes/clubesInternacionais.js';
import {eCampeaoPrincipal,criarMundialAnual,criarMundial32} from '../competicoes/mundialRapido.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa,resumoCampanhaCopa} from '../treinador/copasEscolha.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {torneiosDoHistorico} from '../competicoes/sorteio.js';

// Participação esperada em gols e assistências do time, por função.
const PESO_GOL={ATA:.36,SA:.3,PE:.24,PD:.24,ME:.18,MD:.18,MEI:.2,MC:.1,VOL:.06,ZAG:.05,LD:.04,LE:.04,GOL:0};
const PESO_ASSIST={MEI:.3,PE:.24,PD:.24,ME:.22,MD:.22,MC:.2,SA:.2,ATA:.14,LD:.12,LE:.12,VOL:.1,ZAG:.03,GOL:.01};
/**
 * Lances do atleta numa partida de copa, coerentes com a temporada: dependem da
 * participação (minutos), da produção do ano e dos gols do time no jogo, e nunca
 * ultrapassam os totais da temporada já contados em outras copas.
 */
export function lancesJogadorCopa(card,campanha,chave){
 const r=campanha?.resultado;if(!r?.jogo||r.penaltisPendentes)return null;
 const rng=geradorTecnico(`${card.ano}|${chave}|lances-jogador`),j=r.jogoExibido||r.jogo,doTime=j.casa===campanha.usuario?j.golsCasa:j.golsFora;
 const usados=Object.values(card.copaLances||{}).reduce((s,x)=>({gols:s.gols+x.gols,assist:s.assist+x.assist}),{gols:0,assist:0});
 const share=Number.isFinite(card.share)?card.share:.7;
 if(rng()>Math.min(.98,share+.08))return {jogou:false,minutos:0,eventos:[]};
 const titular=rng()<share,minutos=titular?90:15+Math.floor(rng()*30),fracao=minutos/90;
 const taxa=card.jogos>0?Math.min(1.2,(card.gols||0)/card.jogos):0,taxaA=card.jogos>0?Math.min(1.2,(card.assist||0)/card.jogos):0;
 const pg=Math.min(.85,Math.max(PESO_GOL[card.posicao]??.1,taxa/1.6))*fracao,pa=Math.min(.7,Math.max(PESO_ASSIST[card.posicao]??.1,taxaA/1.6))*fracao;
 const eventos=[];let gols=0,assist=0;
 for(let g=0;g<doTime;g++){
  const x=rng();
  if(x<pg&&usados.gols+gols<(card.gols||0)){gols++;eventos.push({tipo:'gol'});}
  else if(x<pg+pa&&usados.assist+assist<(card.assist||0)){assist++;eventos.push({tipo:'assistencia'});}
 }
 const inicio=titular?1:91-minutos;
 for(const e of eventos)e.minuto=inicio+Math.floor(rng()*(90-inicio+1));
 eventos.sort((a,b)=>a.minuto-b.minuto);
 return {jogou:true,titular,minutos,gols,assist,eventos};
}
export function prepararCopasJogador(c,card){
 if(card.calendarioCopas||(c.temporadas||[]).some(a=>a.ano===card.ano))return card;
 const clubes=clubesDoMundo(c,clubesParaCopas(c.ligas)),clube=clubes.find(x=>x.nome===card.clube);if(!clube)return card;
 const campeonatos=[],regiao=regiaoDaLiga(clube.liga),regional=participantesEstadual(clube),forca=Math.round(card.forcaClube??card.estadual?.forcaUsuario??clube.forca),historico=torneiosDoHistorico(c.temporadas),criar=o=>criarCampanhaCopa({usuario:clube.nome,forcaUsuario:forca,ano:card.ano,seed:`${c.codigo}|${card.ano}|${o.nome}|jogador`,historico,...o});
 if(regional)campeonatos.push(criar({nome:regional.nome,tipo:'estadual',clubes:clubesDoMundo(c,regional.clubes),formato:'estadual',estado:regional.estado,interativoEstadual:true}));
 const nacional=COPAS_NACIONAIS[primeiraLiga(clube.liga)];if(nacional)campeonatos.push(criar({nome:nacional,tipo:'copa',clubes:clubes.filter(x=>x.pais===clube.pais),formato:'mata',entrada:nacional==='Copa do Brasil'?(clube.forca>=80?'principal':clube.forca>=65?'pre':'preliminar'):'principal'}));
 const vaga=vagaJogador(c,clube)||card.continental?.vaga||(card.continental?{competicao:regiao==='europa'?'champions':regiao==='sul'?'libertadores':regiao==='arabia'?'asia':'concacaf',entrada:'principal'}:null);
 if(vaga){const vagas=c.vagasInternacionaisAno===card.ano?c.vagasInternacionaisClubes:calcularVagasRapidas({ano:card.ano-1,ligasMundo:c.ligas}),pool=clubes.filter(x=>x.nome===clube.nome||vagas[x.nome]?.competicao===vaga.competicao);pool.splice(0,pool.length,...ampliarParticipantesInternacionais(pool,vaga.competicao,card.ano,clubesParaCopas(c.ligas)));const repescagem=vaga.competicao==='sulamericana'?ampliarParticipantesInternacionais(clubes.filter(x=>vagas[x.nome]?.competicao==='libertadores'),'libertadores',card.ano,clubesParaCopas(c.ligas)):[];campeonatos.push(criar({nome:nomeVaga(vaga.competicao),tipo:'continental',clubes:pool,formato:regiao==='europa'?'liga':'grupos',entrada:vaga.entrada,repescagem}));}
 const mundial=criarMundial32({usuario:clube.nome,forcaUsuario:forca,ano:card.ano,historico:c.lista||[],seed:c.codigo});if(mundial)campeonatos.push(mundial);
 campeonatos.forEach(cp=>{cp.regiao=regiao;});
 const momentos=[card.pendente,...(card.filaMomentos||[])].filter(m=>m&&!['continental','copa','mundial'].includes(m.tipo));
 const externos=momentos.map(m=>({tipo:'momento',momento:m,data:m.tipo==='selecao'?6.6:m.tipo==='classico'?(regiao==='europa'?1.5:7.7):(regiao==='europa'?5.7:12)})).sort((a,b)=>a.data-b.data).map((x,i)=>({...x,id:`momento-${i}`,momento:{...x.momento,ordem:i+1,total:momentos.length}}));
 if(card.copa&&!card.copa.fim)externos.push({id:'copa-selecao',tipo:'selecao',data:6.5});
 const p=criarAgenda(campeonatos,{ano:card.ano,clube:clube.nome,liga:{nome:card.ligaNome,europa:regiao==='europa',brasil:clube.pais==='Brasil'},externos});
 return sincronizarCard({...card,titulos:(card.titulos||[]).filter(t=>!['estadual','copa','continental','mundial'].includes(t.tipo)),destaques:(card.destaques||[]).filter(x=>!/^Vice-campeão da |Perdeu a final do Mundial/.test(x)),continental:null,copaNac:null,mundialRes:null,pendente:null,filaMomentos:[],calendarioCopas:p,torneios:[],estadual:regional?{nome:regional.nome,estado:regional.estado,fase:'Em disputa'}:null});
}
function sincronizarCard(card){
 const p=card.calendarioCopas,cp=p?.campeonatos[p.indice];
 const novo={...card,estadualEmJogo:cp?.tipo==='estadual'?cp:null,...(p?.pausa?.tipo==='momento'?{pendente:p.pausa.momento,filaMomentos:[]}: {})};
 if(card.calendarioLigasExternas){
  if(p)novo.calendarioLigasExternas=avancarCalendarioLigasRapido(card.calendarioLigasExternas,p.dataAtual);
  else{
   novo.classificacoesMundo={...card.classificacoesMundo,...finalizarCalendarioLigasRapido(card.calendarioLigasExternas)};
   delete novo.calendarioLigasExternas;
  }
 }
 return novo;
}
export function chaveCopaJogador(card){const p=card.calendarioCopas;if(!p)return null;if(p.pausa)return chaveAgenda(p);const cp=p.campeonatos[p.indice];return decisaoCopa(cp)?.chave||`${cp.seed}|resultado|${cp.etapa}`;}
export function concluirEventoJogador(card){const p=card.calendarioCopas;if(!p?.pausa)return card;const pronto=card.copa?.fim?{...p,vistos:[...p.vistos,...p.eventos.filter(x=>x.tipo==='selecao').map(x=>x.id)]}:p;return sincronizarCard({...card,calendarioCopas:avancarPausa(pronto),pendente:null,...(p.pausa.tipo==='liga'&&p.pausa.id==='fim'?{ligaCelebrada:true}:{})});}
export function escolherCopaJogador(card,chave,opcao){
 const p=card.calendarioCopas;if(!p||chave!==chaveCopaJogador(card))return card;
 if(p.pausa)return opcao==='continuar'?concluirEventoJogador(card):card;
 const cp=p.campeonatos[p.indice],nova=opcao==='continuar'?continuarCopa(cp):escolherCopa(cp,chave,opcao);if(nova===cp)return card;
 // Partida decidida agora: registra os lances do atleta uma única vez.
 if(nova.resultado&&!nova.resultado.penaltisPendentes&&!nova.resultado.lancesJogador&&!cp.resultado?.lancesJogador&&nova.resultado!==cp.resultado){
  const lances=lancesJogadorCopa(card,nova,chave);
  if(lances){nova.resultado={...nova.resultado,lancesJogador:lances};
   const atual=card.copaLances?.[nova.nome]||{jogos:0,gols:0,assist:0};
   card={...card,copaLances:{...card.copaLances,[nova.nome]:{jogos:atual.jogos+(lances.jogou?1:0),gols:atual.gols+(lances.gols||0),assist:atual.assist+(lances.assist||0)}}};}
 }
 const novo=structuredClone(p);novo.campeonatos[p.indice]=nova;let k={...card,calendarioCopas:novo};
 if(nova.fase==='fim'&&!nova.resultado){
  const ganhou=nova.campeao===card.clube;k.torneios=[...(card.torneios||[]).filter(x=>x.nome!==nova.nome), {...resumoCampanhaCopa(nova),celebrado:ganhou}];
  if(ganhou&&!k.titulos.some(x=>x.nome===nova.nome))k.titulos=[...k.titulos,{tipo:nova.tipo,nome:nova.nome}];
  if(nova.tipo==='estadual')k.estadual={...card.estadual,disputado:true,fase:nova.faseUsuario,campeao:nova.campeao,vice:nova.vice,jogos:nova.jogosUsuario};
  if(nova.tipo==='copa')k.copaNac={nome:nova.nome,fase:nova.faseUsuario,campeao:nova.campeao,vice:nova.vice,jogos:nova.jogosUsuario};
  if(nova.tipo==='continental')k.continental={nome:nova.nome,faseNome:nova.faseUsuario,final:!!nova.vice,campeao:nova.campeao,vice:nova.vice};
  if(nova.tipo==='mundial')k.mundialRes=nova.faseUsuario;
  if(eCampeaoPrincipal(nova)&&!novo.campeonatos.some(x=>x.nome==='Copa Intercontinental FIFA'))novo.campeonatos.push(criarMundialAnual(nova));
  if(nova.repescagemSulamericana){const base=clubesParaCopas(),clubes=ampliarParticipantesInternacionais(base.filter(x=>regiaoDaLiga(x.liga)==='sul'),'sulamericana',card.ano,base);novo.campeonatos.push(criarCampanhaCopa({nome:'Copa Sul-Americana',tipo:'continental',usuario:card.clube,forcaUsuario:nova.forcaUsuario,clubes,ano:card.ano,formato:'mata',entrada:'pre',seed:`${nova.seed}|repescagem`}));}
  novo.concluidas.push(p.indice);k.calendarioCopas=selecionarAgenda(novo);
 }else if(opcao==='continuar')k.calendarioCopas=selecionarAgenda(novo);
 return sincronizarCard(k);
}

/** Resume older player saves without rerolling played matches or the current minigame. */
export function atualizarFluxoCopasJogador(estado){
 const {c,card,etapa}=estado||{};
 if(!c||!card||card.calendarioCopas||Object.hasOwn(card,'calendarioCopas')||!['estadual','momento','copa'].includes(etapa)||(c.temporadas||[]).some(a=>a.ano===card.ano))return estado;
 const preparado=prepararCopasJogador(c,card),p=preparado.calendarioCopas;if(!p)return estado;
 if(etapa==='estadual'&&card.estadualEmJogo){
  const indice=p.campeonatos.findIndex(cp=>cp.tipo==='estadual');if(indice<0)return estado;
  p.campeonatos[indice]=structuredClone(card.estadualEmJogo);p.indice=indice;p.pausa=null;p.dataAtual=dataCopa(card.estadualEmJogo);p.migrado=true;
  return {...estado,card:sincronizarCard({...preparado,estadual:card.estadual??preparado.estadual,calendarioCopas:p}),auto:false};
 }
 // Earlier versions had already resolved club cups before these screens. Keep those outcomes.
 const campeonatos=p.campeonatos.filter(cp=>cp.tipo!=='mundial');
 const eventos=[card.pendente,...(card.filaMomentos||[])].filter(Boolean).map((momento,i)=>({id:`legado-momento-${i}`,tipo:'momento',momento,data:12.1+i*.001}));
 if(card.copa&&!card.copa.fim)eventos.push({id:'copa-selecao',tipo:'selecao',data:etapa==='copa'?12.09:12.15});
 const agenda={...p,campeonatos,concluidas:campeonatos.map((_,i)=>i),eventos,vistos:[],dataAtual:12.09,indice:-1,pausa:null,migrado:true};
 // If an old cup was already won, its annual world qualification must also survive the update.
 const titulo=(card.titulos||[]).find(t=>t.tipo==='continental'&&eCampeaoPrincipal({nome:t.nome,usuario:card.clube,campeao:card.clube}));
 if(titulo&&!card.mundialRes&&!card.titulos.some(t=>t.tipo==='mundial')&&!card.momentos?.some(m=>m.tipo==='mundial'))agenda.campeonatos.push(criarMundialAnual({nome:titulo.nome,usuario:card.clube,campeao:card.clube,forcaUsuario:card.forcaClube||card.ovr,ano:card.ano,seed:`${c.codigo}|${card.ano}|legado`}));
 const proxima=selecionarAgenda(agenda);if(!proxima)return estado;
 const k=sincronizarCard({...card,calendarioCopas:proxima,pendente:null,filaMomentos:[]});
 return {...estado,card:k,etapa:etapaAgendaJogador(k),auto:false};
}
export function etapaAgendaJogador(card){const p=card.calendarioCopas;if(!p)return null;return p.pausa?.tipo==='momento'?'momento':p.pausa?.tipo==='selecao'?'copa':p.pausa?'calendarioLiga':p.campeonatos[p.indice].tipo==='estadual'?'estadual':'copasClubes';}
export function registrarLanceLegadoJogador(card,momento){
 const p=card.calendarioCopas;if(!p?.migrado||momento?.tipo!=='continental')return card;
 const titulo=card.titulos.find(t=>t.tipo==='continental'&&eCampeaoPrincipal({nome:t.nome,usuario:card.clube,campeao:card.clube}));
 if(!titulo||p.campeonatos.some(cp=>cp.nome==='Copa Intercontinental FIFA')||card.mundialRes||card.titulos.some(t=>t.tipo==='mundial')||card.momentos?.some(m=>m.tipo==='mundial'))return card;
 const mundial=criarMundialAnual({nome:titulo.nome,usuario:card.clube,campeao:card.clube,forcaUsuario:card.forcaClube||card.ovr,ano:card.ano,seed:`${p.clube}|${p.ano}|legado-final`});
 return {...card,calendarioCopas:{...p,campeonatos:[...p.campeonatos,mundial]}};
}
