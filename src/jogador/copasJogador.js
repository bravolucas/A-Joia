import {avancarCalendarioLigasRapido,finalizarCalendarioLigasRapido,prepararPartidasDeCopa} from './ligasCalendarioRapido.js';
import {jogosDaEdicao} from '../simulacao/mundoVivo.js';
import {clubesDoMundo} from '../simulacao/mundoVivo.js';
import {criarAgenda,dataCopa,selecionarAgenda,avancarPausa,chaveAgenda} from '../competicoes/calendarioCopas.js';
import {clubesParaCopas,COPAS_NACIONAIS,vagaJogador,nomeVaga,regiaoDaLiga,calcularVagasRapidas} from '../competicoes/regrasCopasRapidas.js';
import {primeiraLiga} from '../competicoes/vagasInternacionais.js';
import {participantesEstadual} from '../competicoes/estaduaisRapidos.js';
import {ampliarParticipantesInternacionais} from '../competicoes/clubesInternacionais.js';
import {eCampeaoPrincipal,criarMundialAnual,criarMundial32} from '../competicoes/mundialRapido.js';
import {avancarCopaAutomatica,rodadaAutomaticaCopa,criarCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa,resumoCampanhaCopa} from '../treinador/copasEscolha.js';
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
 const campeonatos=[],regiao=regiaoDaLiga(clube.liga),regional=participantesEstadual(clube),forca=Math.round(card.forcaClube??card.estadual?.forcaUsuario??clube.forca),historico=torneiosDoHistorico(c.temporadas),criar=o=>criarCampanhaCopa({usuario:clube.nome,forcaUsuario:forca,ano:card.ano,seed:`${c.codigo}|${card.ano}|${o.nome}|jogador`,historico,agendaIA:!!card.calendarioLigasExternas?.partilharCopas,...o});
 if(regional)campeonatos.push(criar({nome:regional.nome,tipo:'estadual',clubes:clubesDoMundo(c,regional.clubes),formato:'estadual',estado:regional.estado,interativoEstadual:true}));
 const nacional=COPAS_NACIONAIS[primeiraLiga(clube.liga)];if(nacional)campeonatos.push(criar({nome:nacional,tipo:'copa',clubes:clubes.filter(x=>x.pais===clube.pais),formato:'mata',entrada:nacional==='Copa do Brasil'?(clube.forca>=80?'principal':clube.forca>=65?'pre':'preliminar'):'principal'}));
 const vaga=vagaJogador(c,clube)||card.continental?.vaga||(card.continental?{competicao:regiao==='europa'?'champions':regiao==='sul'?'libertadores':regiao==='arabia'?'asia':'concacaf',entrada:'principal'}:null);
 if(vaga){const vagas=c.vagasInternacionaisAno===card.ano?c.vagasInternacionaisClubes:calcularVagasRapidas({ano:card.ano-1,ligasMundo:c.ligas}),pool=clubes.filter(x=>x.nome===clube.nome||vagas[x.nome]?.competicao===vaga.competicao);pool.splice(0,pool.length,...ampliarParticipantesInternacionais(pool,vaga.competicao,card.ano,clubesParaCopas(c.ligas)));const repescagem=vaga.competicao==='sulamericana'?ampliarParticipantesInternacionais(clubes.filter(x=>vagas[x.nome]?.competicao==='libertadores'),'libertadores',card.ano,clubesParaCopas(c.ligas)):[];campeonatos.push(criar({nome:nomeVaga(vaga.competicao),tipo:'continental',clubes:pool,formato:regiao==='europa'?'liga':'grupos',entrada:vaga.entrada,repescagem}));}
 const mundial=criarMundial32({usuario:clube.nome,forcaUsuario:forca,ano:card.ano,historico:c.lista||[],seed:c.codigo,agendaIA:!!card.calendarioLigasExternas?.partilharCopas});if(mundial)campeonatos.push(mundial);
 campeonatos.forEach(cp=>{cp.regiao=regiao;});
 const momentos=[card.pendente,...(card.filaMomentos||[])].filter(m=>m&&!['continental','copa','mundial'].includes(m.tipo));
 const externos=momentos.map(m=>({tipo:'momento',momento:m,data:m.tipo==='selecao'?6.6:m.tipo==='classico'?(regiao==='europa'?1.5:7.7):(regiao==='europa'?5.7:12)})).sort((a,b)=>a.data-b.data).map((x,i)=>({...x,id:`momento-${i}`,momento:{...x.momento,ordem:i+1,total:momentos.length}}));
 if(card.copa&&!card.copa.fim)externos.push({id:'copa-selecao',tipo:'selecao',data:6.5});
 let p=criarAgenda(campeonatos,{ano:card.ano,clube:clube.nome,liga:{nome:card.ligaNome,europa:regiao==='europa',brasil:clube.pais==='Brasil'},externos});
 // Liga no calendário: as rodadas já aparecem uma a uma; só o fim do campeonato vira marco.
 if(card.ligaPropria){const vistos=p.eventos.filter(e=>e.tipo==='liga'&&e.id!=='fim').map(e=>e.id);p=selecionarAgenda({...p,vistos:[...p.vistos,...vistos],pausa:null});}
 return sincronizarCard({...card,titulos:(card.titulos||[]).filter(t=>!['estadual','copa','continental','mundial'].includes(t.tipo)),destaques:(card.destaques||[]).filter(x=>!/^Vice-campeão da |Perdeu a final do Mundial/.test(x)),continental:null,copaNac:null,mundialRes:null,pendente:null,filaMomentos:[],calendarioCopas:p,torneios:[],estadual:regional?{nome:regional.nome,estado:regional.estado,fase:'Em disputa'}:null});
}
function sincronizarCard(card){
 for(;;){
  card=sincronizarData(card);
  const p=card.calendarioCopas, cp=p?.campeonatos[p.indice];
  if(!rodadaAutomaticaCopa(cp))return card;
  const calendario=card.calendarioLigasExternas;
  const rodada=calendario&&prepararPartidasDeCopa(calendario,p.dataAtual,cp.nome);
  const nova=avancarCopaAutomatica(cp,rodada?.partida);
  if(rodada)card={...card,calendarioLigasExternas:{...calendario,memoria:rodada.memoria}};
  card=registrarProgressoCopa(card,nova,true);
 }
}
function sincronizarData(card){
 const p=card.calendarioCopas,cp=p?.campeonatos[p.indice];
 const novo={...card,estadualEmJogo:cp?.tipo==='estadual'?cp:null,...(p?.pausa?.tipo==='momento'?{pendente:p.pausa.momento,filaMomentos:[]}: {})};
 if(card.calendarioLigasExternas){
  if(p){const rodada=proximaRodadaPropria(card),limite=rodada?Math.min(p.dataAtual,rodada.data-1e-6):p.dataAtual;novo.calendarioLigasExternas=avancarCalendarioLigasRapido(card.calendarioLigasExternas,limite);}
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
 const cp=p.campeonatos[p.indice],calendario=card.calendarioLigasExternas;
 const rodada=opcao!=='continuar'&&calendario?.partilharCopas&&['copa','estadual','continental','mundial'].includes(cp.tipo)
  ? prepararPartidasDeCopa(calendario,p.dataAtual,cp.nome) : null;
 const nova=opcao==='continuar'?continuarCopa(cp):escolherCopa(cp,chave,opcao,rodada?.partida);if(nova===cp)return card;
 if(rodada)card={...card,calendarioLigasExternas:{...calendario,memoria:rodada.memoria}};
 // Partida decidida agora: registra os lances do atleta uma única vez.
 if(nova.resultado&&!nova.resultado.penaltisPendentes&&!nova.resultado.lancesJogador&&!cp.resultado?.lancesJogador&&nova.resultado!==cp.resultado){
  const lances=lancesJogadorCopa(card,nova,chave);
  if(lances){nova.resultado={...nova.resultado,lancesJogador:lances};
   const atual=card.copaLances?.[nova.nome]||{jogos:0,gols:0,assist:0};
   card={...card,copaLances:{...card.copaLances,[nova.nome]:{jogos:atual.jogos+(lances.jogou?1:0),gols:atual.gols+(lances.gols||0),assist:atual.assist+(lances.assist||0)}}};}
 }
 return sincronizarCard(registrarProgressoCopa(card,nova,opcao==='continuar'));
}

function registrarProgressoCopa(card,nova,selecionar){
 const p=card.calendarioCopas;
 const novo={...p,campeonatos:[...p.campeonatos],concluidas:[...p.concluidas]};
 const anterior=p.campeonatos[p.indice];
 if(nova.agendaIA&&(nova.pernaIda||nova.idaIA)){
  nova={...nova,dataMinimaVoltaIA:anterior.dataMinimaVoltaIA??p.dataAtual+.24};
 }else if(nova.dataMinimaVoltaIA!==undefined){
  nova={...nova};
  delete nova.dataMinimaVoltaIA;
 }
 novo.campeonatos[p.indice]=nova;
 const k={...card,calendarioCopas:novo};
 if(nova.fase==='fim'&&!nova.resultado){
  const ganhou=nova.campeao===card.clube;k.torneios=[...(card.torneios||[]).filter(x=>x.nome!==nova.nome), {...resumoCampanhaCopa(nova),celebrado:ganhou}];
  if(ganhou&&!k.titulos.some(x=>x.nome===nova.nome))k.titulos=[...k.titulos,{tipo:nova.tipo,nome:nova.nome}];
  if(nova.tipo==='estadual')k.estadual={...card.estadual,disputado:true,fase:nova.faseUsuario,campeao:nova.campeao,vice:nova.vice,jogos:nova.jogosUsuario};
  if(nova.tipo==='copa')k.copaNac={nome:nova.nome,fase:nova.faseUsuario,campeao:nova.campeao,vice:nova.vice,jogos:nova.jogosUsuario};
  if(nova.tipo==='continental')k.continental={nome:nova.nome,faseNome:nova.faseUsuario,final:!!nova.vice,campeao:nova.campeao,vice:nova.vice};
  if(nova.tipo==='mundial')k.mundialRes=nova.faseUsuario;
  if(eCampeaoPrincipal(nova)&&!novo.campeonatos.some(x=>x.nome==='Copa Intercontinental FIFA'))novo.campeonatos.push(criarMundialAnual(nova));
  if(nova.repescagemSulamericana){const base=clubesParaCopas(),clubes=ampliarParticipantesInternacionais(base.filter(x=>regiaoDaLiga(x.liga)==='sul'),'sulamericana',card.ano,base);novo.campeonatos.push(criarCampanhaCopa({nome:'Copa Sul-Americana',tipo:'continental',usuario:card.clube,forcaUsuario:nova.forcaUsuario,clubes,ano:card.ano,formato:'mata',entrada:'pre',agendaIA:!!nova.agendaIA,seed:`${nova.seed}|repescagem`}));}
  novo.concluidas.push(p.indice);k.calendarioCopas=selecionarAgenda(novo);
 }else if(selecionar)k.calendarioCopas=selecionarAgenda(novo);
 return k;
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
export function etapaAgendaJogador(card){const p=card.calendarioCopas;if(!p)return null;if(proximoCompromissoJogador(card)?.tipo==='liga')return 'calendario';return p.pausa?.tipo==='momento'?'momento':p.pausa?.tipo==='selecao'?'copa':p.pausa?'calendarioLiga':p.campeonatos[p.indice].tipo==='estadual'?'estadual':'copasClubes';}
export function registrarLanceLegadoJogador(card,momento){
 const p=card.calendarioCopas;if(!p?.migrado||momento?.tipo!=='continental')return card;
 const titulo=card.titulos.find(t=>t.tipo==='continental'&&eCampeaoPrincipal({nome:t.nome,usuario:card.clube,campeao:card.clube}));
 if(!titulo||p.campeonatos.some(cp=>cp.nome==='Copa Intercontinental FIFA')||card.mundialRes||card.titulos.some(t=>t.tipo==='mundial')||card.momentos?.some(m=>m.tipo==='mundial'))return card;
 const mundial=criarMundialAnual({nome:titulo.nome,usuario:card.clube,campeao:card.clube,forcaUsuario:card.forcaClube||card.ovr,ano:card.ano,seed:`${p.clube}|${p.ano}|legado-final`});
 return {...card,calendarioCopas:{...p,campeonatos:[...p.campeonatos,mundial]}};
}

/* ---------- Calendário contínuo (Modo Rápido · jogador) ----------
   As rodadas da liga do clube do atleta entram nas mesmas datas das copas. Ele joga a
   próxima partida escolhendo a estratégia, pula a próxima (estratégia padrão) ou simula
   até um dia, sem paradas. O resto do mundo anda junto com o calendário. */
function proximaRodadaPropria(card){const l=card?.ligaPropria;return l&&l.indice<l.rodadas.length?{...l.rodadas[l.indice],indice:l.indice,total:l.rodadas.length}:null;}
export function proximoCompromissoJogador(card){
 const rodada=proximaRodadaPropria(card),p=card?.calendarioCopas;
 let copa=null;
 if(p){
  if(p.pausa)copa={tipo:p.pausa.tipo==='liga'?'marco':p.pausa.tipo==='momento'?'momento':p.pausa.tipo==='selecao'?'selecao':'marco',data:p.dataAtual,marco:p.pausa,chave:chaveCopaJogador(card)};
  else{const campanha=p.campeonatos[p.indice];if(campanha)copa={tipo:'copa',data:p.dataAtual,campanha,decisao:decisaoCopa(campanha),chave:chaveCopaJogador(card)};}
 }
 const liga=rodada?{tipo:'liga',...rodada}:null;
 if(liga&&(!copa||liga.data<=copa.data))return liga;
 return copa;
}
/** Próximas rodadas da liga do atleta, com data. */
export function agendaLigaJogador(card,limite=60){const l=card?.ligaPropria;if(!l)return [];return l.rodadas.slice(l.indice,l.indice+limite).map((r,i)=>({...r,tipo:'liga',indice:l.indice+i}));}
/** Classificação atual da liga do atleta. */
export function tabelaLigaJogador(card){
 const l=card?.ligaPropria,ed=card?.calendarioLigasExternas?.ligas?.[l?.liga]||card?.classificacoesMundo?.[l?.liga];
 return (ed?.classificacao||[]).map((x,i)=>({...x,posicao:x.posicao??i+1,meuClube:x.nome===card.clube}));
}
function registrarRecente(card,jogo){return {...card,calendarioRecentes:[jogo,...(card.calendarioRecentes||[])].slice(0,8)};}
function concluirLigaPropria(card){
 const l=card.ligaPropria,ed=card.calendarioLigasExternas?.ligas?.[l.liga];if(!ed)return card;
 const classificacao=ed.classificacao,ordem=classificacao.map(x=>x.nome),pos=ordem.indexOf(card.clube)+1;
 const k={...card,posLiga:pos||card.posLiga,totalLiga:ordem.length,tabelaLiga:ordem,vencedorLiga:ordem[0],campeaoLiga:pos===1,
  classificacoesMundo:{...(card.classificacoesMundo||{}),[l.liga]:{...ed,jogos:jogosDaEdicao(ed).map(({vencedor,penaltis,...j})=>j)}},
  ligaPropria:{...l,concluida:true}};
 const titulo={tipo:l.tituloTipo||'liga',nome:l.nome};
 if(pos===1&&!k.titulos.some(t=>t.nome===l.nome)){
  k.titulos=[...k.titulos,titulo];
  const vice=classificacao[1];k.destaques=[...(k.destaques||[]),`Título do ${l.nome} com ${vice&&classificacao[0].pontos-vice.pontos<3?'emoção até o fim':'folga na tabela'}`];
 }
 return k;
}
const ESTRATEGIAS_LIGA_JOGADOR=new Set(['manter','atacar','proteger']);
/** Um passo do calendário do atleta. Devolve {card, jogou} ou null quando depende de uma tela (desafio, seleção). */
function passoJogador(card,estrategia){
 const prox=proximoCompromissoJogador(card);if(!prox)return null;
 if(prox.tipo==='liga'){
  const l=card.ligaPropria,cal=card.calendarioLigasExternas,estrategias={...(cal.estrategias||{})};
  if(ESTRATEGIAS_LIGA_JOGADOR.has(estrategia)&&estrategia!=='manter')estrategias[prox.rodada]=estrategia;
  const avancado=avancarCalendarioLigasRapido({...cal,estrategias},prox.data);
  let k={...card,calendarioLigasExternas:avancado,ligaPropria:{...l,indice:l.indice+1}};
  const ed=avancado.ligas[l.liga],jogo=ed&&jogosDaEdicao(ed).find(j=>j.rodada===prox.rodada&&(j.casa===card.clube||j.fora===card.clube));
  if(jogo){
   const doTime=jogo.casa===card.clube?jogo.golsCasa:jogo.golsFora,contra=jogo.casa===card.clube?jogo.golsFora:jogo.golsCasa;
   const usados={...(card.copaLances||{}),...(card.ligaLances?{_liga:card.ligaLances}:{})};
   const lances=lancesJogadorCopa({...card,copaLances:usados},{usuario:card.clube,resultado:{jogo}},`${card.ano}|liga|${prox.rodada}`);
   if(lances){const atual=card.ligaLances||{jogos:0,gols:0,assist:0};k.ligaLances={jogos:atual.jogos+(lances.jogou?1:0),gols:atual.gols+(lances.gols||0),assist:atual.assist+(lances.assist||0)};}
   k=registrarRecente(k,{ano:card.ano,data:prox.data,competicao:'liga',rodada:prox.rodada,casa:jogo.casa,fora:jogo.fora,golsCasa:jogo.golsCasa,golsFora:jogo.golsFora,
    resultado:doTime>contra?'V':doTime<contra?'D':'E',...(estrategias[prox.rodada]?{estrategia:estrategias[prox.rodada]}:{}),...(lances?{lances}:{})});
  }
  if(k.ligaPropria.indice>=l.rodadas.length)k=concluirLigaPropria(k);
  return {card:k,jogou:true,data:prox.data,tipo:'liga'};
 }
 if(prox.tipo==='momento'||prox.tipo==='selecao')return null;
 if(prox.tipo==='marco')return {card:concluirEventoJogador(card),jogou:false,data:prox.data,tipo:'marco'};
 const d=prox.decisao,opcao=!d?'continuar':d.penaltis?'canto':(estrategia&&!ESTRATEGIAS_LIGA_JOGADOR.has(estrategia)?estrategia:'controlar');
 let k=escolherCopaJogador(card,prox.chave,opcao);if(k===card)return null;
 if(d&&!d.penaltis){
  const cp=k.calendarioCopas?.campeonatos.find(x=>x.seed===prox.campanha.seed),r=cp?.resultado,j=r?.jogoExibido||r?.jogo;
  if(j)k=registrarRecente(k,{ano:card.ano,data:prox.data,competicao:prox.campanha.nome,tipoCompeticao:prox.campanha.tipo,fase:d.fase,casa:j.casa,fora:j.fora,golsCasa:j.golsCasa,golsFora:j.golsFora,resultado:r.penaltisPendentes?'E':r.venceu?'V':r.empate?'E':'D',...(r.lancesJogador?{lances:r.lancesJogador}:{})});
 }
 return {card:k,jogou:!!d&&!d.penaltis,data:prox.data,tipo:'copa'};
}
/**
 * Avança o calendário do atleta: {modo:'jogar',estrategia} | {modo:'pular'} | {modo:'ate',data}.
 * Para em desafios e jogos da seleção, que têm tela própria.
 */
export function avancarCalendarioJogador(card,acao={}){
 let atual=card,jogou=false;const modo=acao.modo||'pular';
 for(let guarda=0;guarda<4000;guarda++){
  const prox=proximoCompromissoJogador(atual);
  if(!prox)break;
  if(modo==='ate'&&prox.data>=acao.data)break;
  if(modo!=='ate'&&jogou&&!(prox.tipo==='copa'&&(!prox.decisao||prox.decisao.penaltis)))break;
  const passo=passoJogador(atual,modo==='jogar'&&!jogou?acao.estrategia:null);
  if(!passo)break;
  atual=passo.card;if(passo.jogou)jogou=true;
 }
 return atual;
}
/** Dados do calendário do atleta para o painel compartilhado com o treinador. */
export function dadosCalendarioJogador(card){
 const equipes=new Map((card.calendarioLigasExternas?.equipes||[]).map(x=>[x.nome,x]));
 const comAdv=r=>r&&r.tipo==='liga'?{...r,adversario:{nome:r.adversario,casa:r.casa,forca:equipes.get(r.adversario)?.elenco}}:r;
 return {ano:card.ano,clube:card.clube,nomeLiga:card.ligaNome,proximo:comAdv(proximoCompromissoJogador(card)),agenda:agendaLigaJogador(card).map(comAdv),
  tabela:tabelaLigaJogador(card),recentes:card.calendarioRecentes||[],totalJogos:card.ligaPropria?.rodadas.length,mundo:card.calendarioLigasExternas};
}
