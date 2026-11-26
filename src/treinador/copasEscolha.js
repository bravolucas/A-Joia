import {perfilAdversario,ajustePlanoAdversario} from '../competicoes/perfilAdversario.js';
import {idaEVolta} from '../competicoes/formatoMataMata.js';
import {golsEsperados,probabilidadesPlacar,sortearPlacar,sortearProrrogacao,temProrrogacao} from '../competicoes/motorPartida.js';
import {TODAS_ESTRATEGIAS,NOVOS_PENALTIS,escolhasCopa} from './estrategiasCopas.js';
import {geradorTecnico} from './momentosTecnico.js';
import {embaralhar as embaralharSorteio,montarPotes,sortearGrupos,sortearFaseLiga,sortearOitavasConmebol,chaveUefa,chaveGruposFifa,chaveCopa48,melhoresTerceiros,chaveSelecoes,coeficientesClubes,detentorDoTitulo,paisDoSorteio,sedesDaCopa} from '../competicoes/sorteio.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const nivel=c=>Number(c?.forca??c?.elenco??60);
export const PLANOS_COPA=[{id:'pressionar',nome:'Pressionar e atacar',texto:'Mais risco, menos empates.'},{id:'controlar',nome:'Controlar o jogo',texto:'Mais proteção; aceita levar a decisão adiante.'},{id:'contra',nome:'Explorar os espaços',texto:'Funciona melhor diante de um adversário superior.'}];
export const PLANOS_PENALTIS=[{id:'canto',nome:'Bater colocado',texto:'Precisão para lidar com a pressão.'},{id:'forte',nome:'Bater com força',texto:'Uma cobrança agressiva.'},{id:'esperar',nome:'Esperar o goleiro',texto:'Frieza para decidir no último instante.'}];
/** Ajustes do plano sobre o modelo de gols: pontos de força e abertura do jogo. */
function efeitoPlano(forca,adversario,plano,perfil){
 if(!plano)return {ajuste:0,abertura:1};
 const estrategia=TODAS_ESTRATEGIAS.find(x=>x.id===plano),diff=forca-adversario;
 const ajuste=estrategia?(estrategia.ajuste==='contra'?clamp(-diff*.24,-4,7):estrategia.ajuste):plano==='pressionar'?3:plano==='contra'?clamp(-diff*.18,-3,5):0;
 const empate=estrategia?.empate??(plano==='controlar'?.06:plano==='pressionar'?-.07:0);
 return {ajuste:ajuste+ajustePlanoAdversario(plano,perfil),abertura:clamp(1-empate*3,.6,1.45)};
}
const esperadosPlano=(forca,adversario,plano,final,perfil,mando=0)=>golsEsperados(forca,adversario,{...efeitoPlano(forca,adversario,plano,perfil),final,mando});
/** Chances de vitória, empate e derrota do mesmo modelo que sorteia o placar. */
export function chancesCopa(forca,adversario,plano='controlar',final=false,perfil=null,mando=0){
 const p=probabilidadesPlacar(esperadosPlano(forca,adversario,plano,final,perfil,mando)),vitoria=clamp(p.vitoria,.005,.99),derrota=clamp(p.derrota,.005,.99);
 return {vitoria,empate:1-vitoria-derrota,derrota};
}
export function chancePenaltis(forca,adversario,plano='canto',final=false){const diff=forca-adversario;return clamp(.5+diff*(final?.003:.004)+(NOVOS_PENALTIS.find(x=>x.id===plano)?.ajuste??(plano==='canto'?.015:plano==='esperar'?clamp(-diff*.0008,-.015,.025):-.005)),.23,.77);}
function embaralhar(lista,rng){return lista.map(x=>({x,d:rng()})).sort((a,b)=>a.d-b.d).map(x=>x.x);}
// Ranking de classificação: força pesa mais que o sorteio, sem excluir zebras.
function selecionarParticipantes(times,limite,rng){return times.map(x=>({x,nota:nivel(x)-4*Math.log(-Math.log(clamp(rng(),Number.EPSILON,1-Number.EPSILON)))})).sort((a,b)=>b.nota-a.nota).slice(0,limite).map(x=>x.x);}

/** Adversários dos momentos resumidos também precisam vencer sua parte da copa. */
export function adversarioCopaPorFase(times,fase,rng){
 let vivos=[...times];
 const limite=/final/i.test(fase)&&!/semi|quart|oitav/i.test(fase)?1:/semi/i.test(fase)?2:/quart/i.test(fase)?4:8;
 while(vivos.length>limite){
  const rodada=vivos.sort((a,b)=>nivel(b)-nivel(a)),proximos=[];
  while(rodada.length>1){const a=rodada.shift(),b=rodada.pop(),j=jogoEliminatorio(a,b,rng);proximos.push(j.vencedor===a.nome?a:b);}
  if(rodada.length)proximos.push(rodada[0]);vivos=proximos;
 }
 return vivos.length?vivos[Math.floor(rng()*vivos.length)]:null;
}
/** Uma partida com placar do motor de gols. `mando`: 1 = a em casa, -1 = b em casa, 0 = neutro. */
function partida(a,b,rng,plano=null,final=false,perfil=null,mando=1){
 const {golsA,golsB}=sortearPlacar(esperadosPlano(nivel(a),nivel(b),plano,final,perfil,mando),rng),res=golsA>golsB?'V':golsA===golsB?'E':'D';
 return {casa:a.nome,fora:b.nome,golsCasa:golsA,golsFora:golsB,vencedor:res==='E'?null:res==='V'?a.nome:b.nome,res};
}
/** Prorrogação de 30 minutos somada ao placar do jogo (quando o regulamento prevê). */
function prorrogar(j,a,b,rng,mando=1){
 const {golsA,golsB}=sortearProrrogacao(golsEsperados(nivel(a),nivel(b),{mando}),rng),casaA=j.casa===a.nome;
 const golsCasa=j.golsCasa+(casaA?golsA:golsB),golsFora=j.golsFora+(casaA?golsB:golsA);
 return {...j,golsCasa,golsFora,prorrogacao:{golsCasa:casaA?golsA:golsB,golsFora:casaA?golsB:golsA}};
}
function tabela(times,jogos,usuario){const tab=new Map(times.map(c=>[c.nome,{nome:c.nome,jogos:0,pontos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0,meuClube:c.nome===usuario}]));for(const j of jogos){const a=tab.get(j.casa),b=tab.get(j.fora);if(!a||!b)continue;a.jogos++;b.jogos++;a.golsPro+=j.golsCasa;a.golsContra+=j.golsFora;b.golsPro+=j.golsFora;b.golsContra+=j.golsCasa;if(j.vencedor){const v=tab.get(j.vencedor),d=tab.get(j.vencedor===a.nome?b.nome:a.nome);v.vitorias++;v.pontos+=3;d.derrotas++;}else{a.empates++;b.empates++;a.pontos++;b.pontos++;}}
 return [...tab.values()].sort((a,b)=>b.pontos-a.pontos||(b.golsPro-b.golsContra)-(a.golsPro-a.golsContra)||b.golsPro-a.golsPro||b.vitorias-a.vitorias||a.nome.localeCompare(b.nome)).map((x,i)=>({...x,posicao:i+1,saldoGols:x.golsPro-x.golsContra}));}
function calendario(times,rodadas){const anel=[...times],primeiro=[];if(anel.length%2)anel.push(null);const n=anel.length;for(let r=0;r<n-1;r++){const jogos=[];for(let i=0;i<n/2;i++){let a=anel[i],b=anel[n-1-i];if(!a||!b)continue;if(r%2)[a,b]=[b,a];jogos.push({casa:a.nome,fora:b.nome});}primeiro.push(jogos);anel.splice(1,0,anel.pop());}return Array.from({length:rodadas},(_,r)=>primeiro[r%primeiro.length].map(j=>Math.floor(r/primeiro.length)%2?{casa:j.fora,fora:j.casa}:{...j}));}
/** Nome da fase (a Copa de 48 seleções tem 16 avos de final). */
const nomeFase=(c,n)=>c?.formato==='copa48'&&n===32?'16 avos de final':faseN(n);
const faseN=n=>n===2?'Final':n===4?'Semifinal':n===8?'Quartas de final':n===16?'Oitavas de final':n===32?'Pré-oitavas':'Fase preliminar';
const LETRAS='ABCDEFGHIJKLMNOP';
const nomes=lista=>lista.map(t=>t.nome);
/** Restrição de país no sorteio: torneios de seleções e Mundial usam confederações (UEFA pode ter dois por grupo). */
const restricaoSorteio=tipo=>({pais:t=>paisDoSorteio(t,tipo),limitePais:p=>['copaMundo','mundial'].includes(tipo)&&p==='UEFA'?2:1});
const rankingDaCopa=(nome,ano,historico)=>({ranking:coeficientesClubes(historico,{competicao:nome,ano}),primeiros:[detentorDoTitulo(historico,nome,ano)].filter(Boolean)});
export function criarCampanhaCopa({nome,tipo='continental',usuario,forcaUsuario,clubes,ano,formato='grupos',entrada='principal',seed,estado,interativoEstadual=false,historico=[],repescagem=[],agendaIA=false}){
 const rng=geradorTecnico(seed||`${ano}|${nome}|${usuario}`),eu={...(clubes.find(c=>c.nome===usuario)||{nome:usuario}),forca:forcaUsuario},outros=embaralhar(clubes.filter(c=>c.nome!==usuario),rng);
 const extras=repescagem.filter(x=>x.nome!==usuario&&!clubes.some(c=>c.nome===x.nome));
 const c={nome,tipo,ano,usuario,selecao:null,seed:seed||`${ano}|${nome}|${usuario}`,forcaUsuario,forcas:Object.fromEntries([eu,...outros,...extras].map(c=>[c.nome,nivel(c)])),pool:[eu,...outros],fases:[],grupos:[],jogosUsuario:[],campeao:null,vice:null,faseUsuario:'Em disputa',etapa:0,rodada:0,resultado:null,eliminados:[],estado:estado||null,sorteios:[]};
 if(agendaIA)c.agendaIA=true;
 if(extras.length)c.repescagem=nomes(extras);
 const {ranking,primeiros:detentor}=rankingDaCopa(nome,ano,historico);
 // Copa do Mundo: países-sede abrem o pote 1, ao lado dos melhores do ranking.
 const sedes=tipo==='copaMundo'?[eu,...outros].filter(t=>sedesDaCopa(ano).includes(t.nac)).map(t=>t.nome):[],primeiros=[...sedes,...detentor];
 if(formato==='liga'){
  // Fase de liga da UEFA: 36 clubes em potes pelo coeficiente; Champions e Europa com 4 potes (8 jogos), Conference com 6 potes (6 jogos).
  const conference=/Conference/i.test(nome),times=[eu,...selecionarParticipantes(outros,35,rng)],potes=montarPotes(times,conference?6:4,{ranking,primeiros});
  const {rodadas}=sortearFaseLiga(potes,{rng,pais:restricaoSorteio(tipo).pais,porPote:conference?1:2});
  c.formato='liga';c.times=times;c.participantes=times.length;c.calendario=rodadas;c.totalRodadas=rodadas.length;
  const adversarios=rodadas.flat().filter(j=>[j.casa,j.fora].includes(usuario)).map(j=>{const rival=j.casa===usuario?j.fora:j.casa;return {nome:rival,pote:potes.findIndex(p=>p.some(t=>t.nome===rival))+1,casa:j.casa===usuario};}).sort((a,b)=>a.pote-b.pote);
  (c.sorteios??=[]).push({id:'liga',titulo:'Sorteio da fase de liga',tipo:'liga',potes:potes.map(nomes),adversarios});
  const jogaveis=c.calendario.flatMap((js,i)=>js.some(j=>j.casa===usuario||j.fora===usuario)?[i]:[]);c.manual=[...new Set([jogaveis[0],jogaveis.at(-1)])];c.jogosLiga=[];c.fase='liga';
 }else if(['grupos','selecao32','copa48','selecaoGrupos'].includes(formato)){
  // Grupos de quatro sorteados em potes pelo ranking, sem dois clubes do mesmo país no grupo (quando possível).
  const nGrupos=formato==='copa48'?12:formato==='selecaoGrupos'?Math.max(1,Math.min(6,Math.floor((outros.length+1)/4))):Math.max(1,Math.min(8,Math.floor((outros.length+1)/4))),times=[eu,...selecionarParticipantes(outros,Math.max(0,nGrupos*4-1),rng)];
  const potes=montarPotes(times,Math.min(4,times.length),{ranking,primeiros}),{grupos}=sortearGrupos(potes,{rng,...restricaoSorteio(tipo)});
  c.gruposSorteados=grupos.map((g,i)=>({letra:LETRAS[i],times:nomes(g)}));
  const meu=c.gruposSorteados.find(g=>g.times.includes(usuario));
  c.letraGrupo=meu.letra;c.formato=formato;c.times=meu.times.map(n=>times.find(t=>t.nome===n));c.participantes=times.length;c.totalRodadas=['selecao32','copa48','selecaoGrupos'].includes(formato)?3:6;c.calendario=calendario(c.times,c.totalRodadas);c.manual=c.calendario.flatMap((js,i)=>js.some(j=>j.casa===usuario||j.fora===usuario)?[i]:[]);c.jogosLiga=[];c.fase='grupos';
  (c.sorteios??=[]).push({id:'grupos',titulo:'Sorteio da fase de grupos',tipo:'grupos',potes:potes.map(nomes),grupos:c.gruposSorteados});
 }else if(formato==='estadual'){
  c.formato='estadual';c.times=[eu,...outros.slice(0,7)];c.totalRodadas=c.times.length%2?c.times.length:c.times.length-1;c.calendario=calendario(c.times,c.totalRodadas);const rodadasComUsuario=c.calendario.map((js,i)=>js.some(j=>j.casa===usuario||j.fora===usuario)?i:null).filter(i=>i!==null);c.manual=interativoEstadual?[...new Set([rodadasComUsuario[0],rodadasComUsuario.at(-1)])]:[];c.jogosLiga=[];c.fase='grupos';
 }else{
  c.formato=formato;c.fase='mata';c.tamanho=entrada==='pre'?32:entrada==='preliminar'?64:formato==='estadual'?4:16;
 }
 if(entrada==='pre'&&['grupos','liga'].includes(formato)){c.entradaPendente=true;c.faseAposPre=c.fase;c.fase='mata';c.tamanho=2;c.preContinental=true;}
 return preparar(c);
}
function avancarLiga(c,jogoUsuario,partidaIA){
 const rodada=c.calendario[c.rodada],rng=geradorTecnico(`${c.seed}|liga|${c.rodada}`),jogos=rodada.map(j=>{if(jogoUsuario&&[j.casa,j.fora].includes(c.usuario))return jogoUsuario;const a={nome:j.casa,forca:c.forcas[j.casa]},b={nome:j.fora,forca:c.forcas[j.fora]},simular=(x,y)=>partida(x,y,rng,null,false,null,campoNeutro(c)?0:1);return partidaIA?partidaIA(a,b,simular):simular(a,b);});
 if(c.agendaIA&&c.gruposSorteados){
  c.jogosOutrosGrupos??={};
  for(const {letra,times} of c.gruposSorteados){
   if(times.includes(c.usuario))continue;
   const rngGrupo=geradorTecnico(`${c.seed}|${letra}|${c.rodada}`);
   const rodadaGrupo=calendario(times.map(nome=>({nome})),c.totalRodadas)[c.rodada];
   (c.jogosOutrosGrupos[letra]??=[]).push(...rodadaGrupo.map(({casa,fora})=>{
    const a={nome:casa,forca:c.forcas[casa]},b={nome:fora,forca:c.forcas[fora]};
    const simular=(x,y)=>partida(x,y,rngGrupo,null,false,null,campoNeutro(c)?0:1);
    return {...(partidaIA?partidaIA(a,b,simular):simular(a,b)),rodada:c.rodada+1};
   }));
  }
 }
 c.jogosLiga.push(...(c.agendaIA?jogos.map(j=>({...j,rodada:c.rodada+1})):jogos));for(const j of jogos)if([j.casa,j.fora].includes(c.usuario))c.jogosUsuario.push({...j,fase:c.fase==='liga'?'Fase de liga':'Fase de grupos',rodada:c.rodada+1});c.rodada++;c.classificacao=tabela(c.times,c.jogosLiga,c.usuario);
}
/** Classificação geral do mata-mata: define quem decide em casa (melhor campanha manda o jogo de volta). */
const posicaoGeral=(c,nome)=>{const i=c.ranqueGeral?.indexOf(nome)??-1;return i<0?Infinity:i;};
const ordenarCampanha=lista=>[...lista].sort((a,b)=>b.pontos-a.pontos||b.saldoGols-a.saldoGols||b.golsPro-a.golsPro||a.nome.localeCompare(b.nome));
function simularOutrosGrupos(c){
 const rng=geradorTecnico(`${c.seed}|outros-grupos`),m=campoNeutro(c)?0:1,umTurno=['selecao32','mundial32','copa48','selecaoGrupos'].includes(c.formato),grupos=[];
 // Saves anteriores ao sorteio: os demais grupos saem da lista de participantes, em blocos de quatro.
 const sorteados=c.gruposSorteados||(()=>{const resto=c.pool.filter(x=>!c.times.some(t=>t.nome===x.nome)),lista=[{letra:'A',times:nomes(c.times)}];for(let i=0;i<resto.length;i+=4)lista.push({letra:LETRAS[lista.length],times:nomes(resto.slice(i,i+4))});return lista;})();
 for(const g of sorteados){
  if(g.times.includes(c.usuario)){grupos.push({grupo:`Grupo ${g.letra}`,meuGrupo:true,jogos:c.jogosLiga,classificacao:c.classificacao});continue;}
  const times=g.times.map(nome=>({nome,forca:c.forcas[nome]})),js=c.jogosOutrosGrupos?.[g.letra]||[];
  if(js.length){grupos.push({grupo:`Grupo ${g.letra}`,jogos:js,classificacao:tabela(times,js,c.usuario)});continue;}
  for(let a=0;a<times.length;a++)for(let b=a+1;b<times.length;b++){js.push(partida(times[a],times[b],rng,null,false,null,m));if(!umTurno)js.push(partida(times[b],times[a],rng,null,false,null,m));}
  grupos.push({grupo:`Grupo ${g.letra}`,jogos:js,classificacao:tabela(times,js,c.usuario)});
 }
 return grupos;
}
function concluirLiga(c){
 const pos=c.classificacao.find(x=>x.meuClube)?.posicao||99;c.posicaoInicial=pos;
 if(c.formato==='estadual'){
  c.grupos=[{grupo:'Classificação estadual',jogos:c.jogosLiga,classificacao:c.classificacao}];
  c.ranqueGeral=c.classificacao.map(x=>x.nome);
  c.candidatosMata=c.classificacao.slice(0,4).map(x=>x.nome);if(pos>4){c.faseUsuario='Eliminado na classificação estadual';concluirSemUsuario(c,c.candidatosMata);return;}c.tamanho=4;c.fase='mata';c.adversario=null;return;
 }
 if(c.formato==='liga'){
  c.grupos=[{grupo:'Tabela única',jogos:c.jogosLiga,classificacao:c.classificacao}];
  c.ranqueGeral=c.classificacao.map(x=>x.nome);
  const rng=geradorTecnico(`${c.seed}|sorteio-mata`),{playoff,sementes}=chaveUefa(c.classificacao,rng);
  (c.sorteios??=[]).push({id:'playoff',titulo:'Sorteio do playoff e das oitavas',tipo:'confrontos',confrontos:playoff,sementes});
  c.reservados=[];
  if(pos>24){c.faseUsuario=`Eliminado na fase de liga · ${pos}º`;c.sementesOitavas=sementes;concluirSemUsuario(c,playoff.flat(),{playoff:true});return;}
  c.candidatosMata=c.classificacao.slice(0,24).map(x=>x.nome);c.tamanho=pos<=8?16:32;c.playoff=pos>8;c.faseUsuario=pos<=8?'Classificação direta às oitavas':'Playoff · 9º ao 24º';
  if(pos<=8){
   // O playoff dos outros clubes acontece antes das oitavas do usuário.
   if(c.agendaIA){c.sementesOitavas=sementes;agendarFaseIA(c,playoff.flat(),true,true);return;}
   const r=jogarFase(geradorTecnico(`${c.seed}|playoffs-outros`),c,playoff.flat(),{tamanho:32,fase:'Playoff de acesso às oitavas'});
   c.fases.push({fase:'Playoff de acesso às oitavas',jogos:r.jogos});
   c.ordemChave=r.vencedores.flatMap((v,k)=>[v,sementes[k]]);c.candidatosMata=c.ordemChave;c.sobreviventes=c.ordemChave;
  }else{c.ordemChave=playoff.flat();c.sementesOitavas=sementes;c.sobreviventes=c.ordemChave;}
 }else{
  c.grupos=simularOutrosGrupos(c);
  const letra=g=>g.grupo.replace('Grupo ',''),lideres=[],segundos=[],terceiros=[],grupoDe={};
  for(const g of c.grupos){const t=g.classificacao;if(t[0])lideres.push(t[0]);if(t[1])segundos.push(t[1]);if(t[2])terceiros.push(t[2]);for(const x of t)grupoDe[x.nome]=letra(g);c.eliminados.push(...t.slice(2).map(x=>x.nome));}
  c.ranqueGeral=[...ordenarCampanha(lideres),...ordenarCampanha(segundos)].map(x=>x.nome);
  const rng=geradorTecnico(`${c.seed}|sorteio-mata`),fifa=['mundial','copaMundo'].includes(c.tipo)||['selecao32','mundial32'].includes(c.formato);
  const sula=/Sul-Americana/i.test(c.nome)&&!c.selecao;
  let ordem,titulo='Sorteio das oitavas de final',terceirosOk=[];
  if(c.formato==='copa48'&&c.grupos.length===12){
   // 48 seleções: dois primeiros e os oito melhores terceiros, no chaveamento oficial.
   terceirosOk=melhoresTerceiros(c.grupos);c.eliminados=c.eliminados.filter(n=>!terceirosOk.includes(n));
   c.ranqueGeral=[...c.ranqueGeral,...ordenarCampanha(terceiros.filter(x=>terceirosOk.includes(x.nome))).map(x=>x.nome)];
   ordem=chaveCopa48(c.grupos,terceirosOk);titulo='Chaveamento dos 16 avos de final';
  }else if(c.formato==='selecaoGrupos'){
   // Eurocopa e afins: dois primeiros e os melhores terceiros até fechar uma chave (16, 8 ou 4).
   const g=c.grupos.length,alvo=g===1?2:2**Math.floor(Math.log2(3*g)),nTerceiros=Math.max(0,alvo-2*g);
   terceirosOk=melhoresTerceiros(c.grupos,nTerceiros);c.eliminados=c.eliminados.filter(n=>!terceirosOk.includes(n));
   const vivos=g===1?[c.grupos[0].classificacao[0],c.grupos[0].classificacao[1]].filter(Boolean):[...ordenarCampanha(lideres),...ordenarCampanha(segundos.slice(0,Math.min(segundos.length,alvo-g))),...ordenarCampanha(terceiros.filter(x=>terceirosOk.includes(x.nome)))];
   c.ranqueGeral=vivos.map(x=>x.nome);c.eliminados.push(...segundos.map(x=>x.nome).filter(n=>!c.ranqueGeral.includes(n)));ordem=chaveSelecoes(c.ranqueGeral,n=>grupoDe[n]);titulo='Chaveamento do mata-mata';c.tamanhoMata=alvo;
  }else if(fifa&&c.grupos.length===8)ordem=chaveGruposFifa(c.grupos).flat(),titulo='Chaveamento das oitavas de final';
  else if(sula&&lideres.length===8&&segundos.length===8){
   // Sul-Americana: segundos colocados enfrentam os terceiros da Libertadores no playoff; os líderes esperam nas oitavas.
   const vindos=(c.repescagem||[]).filter(n=>!c.eliminados.includes(n)&&!grupoDe[n]),terceirosLib=selecionarParticipantes(vindos.map(nome=>({nome,forca:c.forcas[nome]})),8,rng).map(x=>x.nome);
   const rivais=terceirosLib.length===8?terceirosLib:terceiros.map(x=>x.nome).slice(0,8);
   const pares=embaralharSorteio(segundos.map(x=>x.nome),rng).map((s,i)=>[rivais[i],s]);
   c.sementesOitavas=embaralharSorteio(lideres.map(x=>x.nome),rng);c.ranqueGeral=[...c.ranqueGeral,...rivais];
   ordem=pares.flat();titulo='Sorteio do playoff e das oitavas';c.playoffSula=true;
  }else ordem=sortearOitavasConmebol(lideres.map(x=>x.nome),segundos.map(x=>x.nome),{rng,grupoDe:n=>grupoDe[n]}).flat();
  (c.sorteios??=[]).push({id:'mata',titulo,tipo:'confrontos',confrontos:Array.from({length:Math.ceil(ordem.length/2)},(_,i)=>[ordem[2*i],ordem[2*i+1]??null]),...(c.sementesOitavas?{sementes:c.sementesOitavas}:{})});
  c.ordemChave=ordem;
  const segue=c.formato==='selecaoGrupos'?c.ranqueGeral.includes(c.usuario):pos<=2||terceirosOk.includes(c.usuario);
  if(!segue){c.faseUsuario=`${pos}º na fase de grupos`;c.repescagemSulamericana=pos===3&&/Libertadores/i.test(c.nome);concluirSemUsuario(c,ordem,{playoff:!!c.playoffSula});return;}
  c.candidatosMata=ordem;c.sobreviventes=ordem;
  c.tamanho=c.tamanhoMata?c.tamanhoMata:c.formato==='copa48'?32:c.playoffSula&&pos===2?32:16;c.playoff=!!c.playoffSula&&c.tamanho===32;
  if(c.playoffSula&&pos===1){
   if(c.agendaIA){agendarFaseIA(c,ordem,true,true);return;}
   const r=jogarFase(geradorTecnico(`${c.seed}|playoffs-outros`),c,ordem,{tamanho:32,fase:'Playoff de acesso às oitavas'});
   c.fases.push({fase:'Playoff de acesso às oitavas',jogos:r.jogos});
   c.ordemChave=r.vencedores.flatMap((v,k)=>[v,c.sementesOitavas[k]]);c.sementesOitavas=null;c.candidatosMata=c.ordemChave;c.sobreviventes=c.ordemChave;
  }
 }
 c.fase='mata';c.adversario=null;
}
/** Copas nacionais sorteiam cada fase; nas demais, a chave sorteada vale até a final. */
const chaveFixa=c=>c.tipo!=='copa';
/** Ordem dos confrontos de uma fase (pares vizinhos): chave do regulamento ou sorteio da fase. */
function ordemDaFase(c,lista,rng){
 const vivos=new Set(lista);
 if(c.ordemChave?.length){const ordem=c.ordemChave.filter(n=>vivos.has(n));if(ordem.length===vivos.size)return ordem;}
 if(c.tipo==='estadual'&&c.ranqueGeral&&lista.length===4){const o=[...lista].sort((a,b)=>posicaoGeral(c,a)-posicaoGeral(c,b));return [o[3],o[0],o[2],o[1]];}
 // Copa do Brasil antes das oitavas: pote dos mais fortes contra o dos demais; das oitavas em diante, sorteio livre.
 if(/copa do brasil/i.test(c.nome)&&lista.length>16){const o=[...lista].sort((a,b)=>c.forcas[b]-c.forcas[a]),meio=Math.ceil(o.length/2),A=embaralharSorteio(o.slice(0,meio),rng),B=embaralharSorteio(o.slice(meio),rng);return A.flatMap((a,i)=>B[i]?[B[i],a]:[a]);}
 return embaralharSorteio(lista,rng);
}
/** Joga uma fase entre pares vizinhos; o vencedor de cada par ocupa a vaga dele na chave. */
function jogarFase(rng,c,ordem,{tamanho,fase}){
 const jogos=[],vencedores=[];
 for(let i=0;i<ordem.length;i+=2){
  let a=ordem[i],b=ordem[i+1];if(!b){vencedores.push(a);continue;}
  if(c.ranqueGeral&&posicaoGeral(c,a)<posicaoGeral(c,b))[a,b]=[b,a];
  const j=jogoDaChave({...c,tamanho},{nome:a,forca:c.forcas[a]},{nome:b,forca:c.forcas[b]},rng);
  jogos.push({...j,fase});vencedores.push(j.vencedor);c.eliminados.push(j.vencedor===a?b:a);
 }
 return {jogos,vencedores};
}
/** Cabeças de chave esperando o playoff (UEFA, Sul-Americana) entram nas oitavas, cada um no seu trilho. */
function entrarSementes(c,vivos){
 if(!c.sementesOitavas?.length||vivos.length!==c.sementesOitavas.length)return vivos;
 const r=vivos.flatMap((v,k)=>[v,c.sementesOitavas[k]]);c.sementesOitavas=null;return r;
}
/** O torneio continua com os classificados reais, fase a fase, até o campeão. */
function continuarChave(c,lista,rng,{playoff=false}={}){
 if(c.agendaIA){agendarFaseIA(c,lista,playoff);return;}
 let vivos=[...lista];
 for(let guarda=0;guarda<12;guarda++){
  if(!playoff)vivos=entrarSementes(c,vivos);
  if(!playoff&&c.reservados?.length){vivos=[...new Set([...vivos,...c.reservados])];c.reservados=[];}
  if(vivos.length<=1)break;
  const tamanho=playoff?32:2**Math.ceil(Math.log2(vivos.length)),fase=playoff?'Playoff de acesso às oitavas':nomeFase(c,tamanho);
  const ordem=ordemDaFase(c,vivos,rng),r=jogarFase(rng,c,ordem,{tamanho,fase});
  c.fases.push({fase,jogos:r.jogos});
  if(tamanho===2){const j=r.jogos[0];if(j)c.vice=j.vencedor===j.casa?j.fora:j.casa;}
  vivos=r.vencedores;c.ordemChave=chaveFixa(c)?vivos:null;playoff=false;
 }
 c.campeao=vivos[0]||null;c.fase='fim';c.adversario=null;
}
function concluirSemUsuario(c,lista,{playoff=false}={}){
 continuarChave(c,[...new Set(lista)],geradorTecnico(`${c.seed}|apos-grupos`),{playoff});
}
function preparar(c){
 while(!c.agendaIA&&['liga','grupos'].includes(c.fase)&&c.rodada<c.totalRodadas&&!c.manual.includes(c.rodada))avancarLiga(c);
 if(['liga','grupos'].includes(c.fase)&&c.rodada>=c.totalRodadas)concluirLiga(c);
 if(c.fase==='mata'&&!c.adversario&&!c.pendenteIA){if(c.roteiroMundial)c.adversario=c.pool.find(x=>x.nome===c.roteiroMundial[0]);else prepararChave(c);}
 return c;
}
export function decisaoCopa(c){
 if(!c||rodadaAutomaticaCopa(c)||c.fase==='fim'||c.resultado&&!c.resultado.penaltisPendentes)return null;
 const grupo=['liga','grupos'].includes(c.fase),j=grupo?c.calendario[c.rodada]?.find(j=>[j.casa,j.fora].includes(c.usuario)):null,adv=grupo?(j.casa===c.usuario?j.fora:j.casa):c.adversario?.nome;
 const perna=!grupo&&idaVoltaNaFase(c)?(c.pernaIda?'volta':'ida'):null;
 // Melhor campanha (ou, sem classificação geral, o mais forte) decide em casa.
 const decideEmCasa=c.ranqueGeral?posicaoGeral(c,c.usuario)<=posicaoGeral(c,adv):c.forcaUsuario>=c.forcas[adv];
 const casa=grupo?j.casa===c.usuario:perna==='ida'?!decideEmCasa:perna==='volta'?decideEmCasa:true;
 return {chave:`${c.seed}|${c.etapa}|${c.rodada}|${c.resultado?.penaltisPendentes?'penaltis':perna||'jogo'}`,fase:c.roteiroMundial?(c.roteiroMundial.length===1?'Final':c.roteiroMundial.length===3?'Derby das Américas':'Copa Challenger'):grupo?`${c.fase==='liga'?'Fase de liga':'Fase de grupos'} · jogo ${c.rodada+1}/${c.totalRodadas}`:c.preContinental?'Pré-classificação continental':c.playoff&&c.tamanho===32?'Playoff de acesso às oitavas':nomeFase(c,c.tamanho),adversario:adv,perfilAdversario:perfilAdversario(adv,c.ano),forcaUsuario:c.forcaUsuario,forcaAdv:c.forcas[adv],final:!grupo&&c.tamanho===2&&!c.preContinental,grupo,penaltis:!!c.resultado?.penaltisPendentes,casa,perna,idaAnterior:c.pernaIda||null,mando:campoNeutro(c,!grupo&&c.tamanho===2&&!c.preContinental&&!perna)||c.roteiroMundial?0:casa?1:-1};
}
// All clubs play their side of the bracket. Later opponents are survivors, never fresh draws.
export function jogoEliminatorio(a,b,rng,ctx={}){
 const neutro=!!ctx.neutro,mando=neutro?0:1;let j=partida(a,b,rng,null,!!ctx.final,null,mando);
 if(!j.vencedor&&temProrrogacao({...ctx,idaVolta:false})){j=prorrogar(j,a,b,rng,mando);j.vencedor=j.golsCasa>j.golsFora?a.nome:j.golsFora>j.golsCasa?b.nome:null;}
 if(!j.vencedor){j.vencedor=rng()<chancePenaltis(nivel(a),nivel(b))?a.nome:b.nome;j.penaltis=true;}
 return j;
}
/** Esta fase do mata-mata é disputada em ida e volta? (regra por competição) */
export const idaVoltaNaFase=c=>!!c&&!c.roteiroMundial&&idaEVolta({nome:c.nome,tipo:c.tipo,tamanho:c.tamanho,preliminar:!!c.preContinental});
/** Sede neutra: torneios de seleções, Mundial e finais em jogo único. */
export const campoNeutro=(c,final=false)=>['mundial','copaMundo','continentalSelecao'].includes(c?.tipo)||/mundial|intercontinental/i.test(c?.nome||'')||(final&&!idaVoltaNaFase(c));
function jogoDaChave(c,a,b,rng){
 const final=c.tamanho===2&&!c.preContinental;
 if(!idaVoltaNaFase(c))return jogoEliminatorio(a,b,rng,{nome:c.nome,tipo:c.tipo,final,neutro:campoNeutro(c,final)});
 const ida=partida(a,b,rng);
 return fecharDuelo(c,a,b,rng,ida);
}
function fecharDuelo(c,a,b,rng,ida,partidaIA){
 const simularVolta=(x,y)=>{
  const volta=partida(x,y,rng);
  const empate=ida.golsCasa+volta.golsFora===ida.golsFora+volta.golsCasa;
  return empate&&temProrrogacao({nome:c.nome,tipo:c.tipo,final:c.tamanho===2&&!c.preContinental,idaVolta:true})
   ?prorrogar(volta,x,y,rng):volta;
 };
 const volta=partidaIA?partidaIA(b,a,simularVolta):simularVolta(b,a);
 const golsCasa=ida.golsCasa+volta.golsFora,golsFora=ida.golsFora+volta.golsCasa;
 return {casa:a.nome,fora:b.nome,golsCasa,golsFora,vencedor:golsCasa>golsFora?a.nome:golsFora>golsCasa?b.nome:rng()<chancePenaltis(nivel(a),nivel(b))?a.nome:b.nome,penaltis:golsCasa===golsFora,...(volta.prorrogacao?{prorrogacao:true}:{}),partidas:[{...ida,etapa:'Ida'},{...volta,etapa:'Volta'}]};
}
function agendarFaseIA(c,vivos,playoff=false,entradaUsuario=false){
 if(!playoff)vivos=entrarSementes(c,vivos);
 if(!playoff&&c.reservados?.length){vivos=[...new Set([...vivos,...c.reservados])];c.reservados=[];}
 if(vivos.length<=1){c.campeao=vivos[0]??null;c.fase='fim';return;}
 c.tamanho=playoff?32:2**Math.ceil(Math.log2(vivos.length));
 c.fase='mata';c.adversario=null;
 const ordem=entradaUsuario?vivos:ordemDaFase(c,vivos,geradorTecnico(`${c.seed}|ordem-ia|${c.tamanho}`));
 c.pendenteIA={ordem,playoff,entradaUsuario};
}

export function rodadaAutomaticaCopa(c){
 return !!(c?.agendaIA&&!c.resultado&&(c.pendenteIA||
  (['liga','grupos'].includes(c.fase)&&c.rodada<c.totalRodadas&&!c.manual.includes(c.rodada))));
}

function disputarQuadroIA(c,pares,partidaIA,{ida=false}={}){
 const rng=geradorTecnico(`${c.seed}|quadro-ia|${c.tamanho}|${ida?'ida':'volta-ou-unico'}`);
 const jogos=[],vencedores=[];
 for(let [a,b] of pares){
  if(!a||!b){if(a||b)vencedores.push(a||b);continue;}
  if(c.ranqueGeral&&posicaoGeral(c,a)<posicaoGeral(c,b))[a,b]=[b,a];
  const casa={nome:a,forca:c.forcas[a]},fora={nome:b,forca:c.forcas[b]};
  let j;
  if(ida){
   const simular=(x,y)=>partida(x,y,rng);
   j=partidaIA?partidaIA(casa,fora,simular):simular(casa,fora);
  }else{
   const anterior=c.idaIA?.find(p=>p.casa===a&&p.fora===b);
   const simular=(x,y)=>jogoDaChave(c,x,y,rng);
   j=anterior?fecharDuelo(c,casa,fora,rng,anterior,partidaIA)
    :partidaIA&&!idaVoltaNaFase(c)?partidaIA(casa,fora,simular):simular(casa,fora);
   vencedores.push(j.vencedor);c.eliminados.push(j.vencedor===a?b:a);
  }
  jogos.push(j);
 }
 return {jogos,vencedores};
}

export function avancarCopaAutomatica(c,partidaIA){
 if(!rodadaAutomaticaCopa(c))return c;
 const novo=structuredClone(c);
 if(!novo.pendenteIA){avancarLiga(novo,null,partidaIA);return preparar(novo);}
 const {ordem,playoff,entradaUsuario}=novo.pendenteIA;
 const pares=Array.from({length:Math.ceil(ordem.length/2)},(_,i)=>ordem.slice(2*i,2*i+2));
 if(idaVoltaNaFase(novo)&&!novo.idaIA){
  novo.idaIA=disputarQuadroIA(novo,pares,partidaIA,{ida:true}).jogos;
  return novo;
 }
 const {jogos,vencedores}=disputarQuadroIA(novo,pares,partidaIA);
 const fase=playoff?'Playoff de acesso às oitavas':nomeFase(novo,novo.tamanho);
 novo.fases.push({fase,jogos:jogos.map(j=>({...j,fase}))});
 delete novo.idaIA;delete novo.pendenteIA;
 if(novo.tamanho===2&&jogos[0]){
  const {casa,fora,vencedor}=jogos[0];novo.vice=vencedor===casa?fora:casa;
 }
 if(entradaUsuario){
  novo.ordemChave=entrarSementes(novo,vencedores);
  novo.candidatosMata=novo.ordemChave;novo.sobreviventes=novo.ordemChave;novo.tamanho=16;
  return preparar(novo);
 }
 novo.ordemChave=chaveFixa(novo)?vencedores:null;
 agendarFaseIA(novo,vencedores);
 return novo;
}

function reduzirQuadro(times,limite,rng){
 let lista=[...times];if(limite<=0)return [];
 while(lista.length>limite){lista.sort((a,b)=>nivel(b)-nivel(a));const a=lista.pop(),b=lista.pop(),j=jogoEliminatorio(a,b,rng);lista.push(j.vencedor===a.nome?a:b);}
 return lista;
}
function prepararChave(c){
 const rng=geradorTecnico(`${c.seed}|chave|${c.etapa}|${c.tamanho}`);
 if(!c.sobreviventes?.includes(c.usuario)){
  let outros=c.pool.filter(x=>x.nome!==c.usuario&&!c.eliminados.includes(x.nome)&&(!c.candidatosMata||c.candidatosMata.includes(x.nome))&&(!c.estado||x.estado===c.estado));
  // Strong national entrants join at the round of 16; early rounds retain the lower tiers.
  if(c.tipo==='copa'&&c.tamanho>16){c.reservados=outros.filter(x=>nivel(x)>=80).map(x=>x.nome);outros=outros.filter(x=>nivel(x)<80);}
  if(c.preContinental)outros=outros.filter(x=>nivel(x)<82);
  outros=reduzirQuadro(outros,Math.max(1,c.tamanho-1),rng);
  c.sobreviventes=[c.usuario,...outros.map(x=>x.nome)];c.ordemChave=null;
 }
 let nomes=c.sobreviventes.filter(x=>!c.eliminados.includes(x));
 if(c.tamanho===16&&c.reservados?.length){nomes=[...new Set([...nomes,...c.reservados])];c.reservados=[];const outros=reduzirQuadro(nomes.filter(n=>n!==c.usuario).map(nome=>({nome,forca:c.forcas[nome]})),15,rng);nomes=[c.usuario,...outros.map(x=>x.nome)];c.sobreviventes=nomes;}
 if(nomes.length<=2)c.tamanho=2;else if(c.tamanho<=16)c.tamanho=Math.min(c.tamanho,2**Math.ceil(Math.log2(nomes.length)));
 // Chave do regulamento ou sorteio da fase. Quem vence segue no seu trilho até a final.
 const ordem=ordemDaFase(c,nomes,rng),pares=[];
 for(let i=0;i<ordem.length;i+=2)pares.push([ordem[i],ordem[i+1]??null]);
 let meu=pares.find(p=>p.includes(c.usuario));
 if(meu?.[1]===null||meu?.[0]===null){const outro=pares.find(p=>!p.includes(c.usuario)&&p[1]);if(outro){meu.splice(meu.indexOf(null),1,outro.pop());outro.push(null);}}
 c.quadroMata=pares;
 if(!c.sorteios)c.sorteios=[];
 if(!chaveFixa(c)&&pares.length>1&&!c.sorteios.some(s=>s.id===`fase-${c.etapa}`))c.sorteios.push({id:`fase-${c.etapa}`,titulo:`Sorteio · ${nomeFase(c,c.tamanho).toLowerCase()}`,tipo:'confrontos',confrontos:pares});
 const nome=meu?.find(n=>n&&n!==c.usuario);c.adversario=c.pool.find(x=>x.nome===nome)||(nome?{nome,forca:c.forcas[nome]}:null);
 if(!c.adversario){c.fase='fim';c.faseUsuario='Sem adversário elegível';}
}
function registrarMata(c,jogo,partidaIA){
 if(c.roteiroMundial){const final=c.roteiroMundial.length===1,fase=final?'Final':c.roteiroMundial.length===3?'Derby das Américas':'Copa Challenger';c.fases.push({fase,jogos:[{...jogo,fase}]});c.jogosUsuario.push({...jogo,fase});if(jogo.vencedor!==c.usuario||final){c.fase='fim';c.campeao=final?jogo.vencedor:c.roteiroMundial.at(-1);c.vice=final?(jogo.vencedor===c.usuario?c.adversario.nome:c.usuario):null;c.faseUsuario=final?(c.campeao===c.usuario?'Campeão':'Vice-campeão'):`Eliminado: ${fase}`;}else{c.roteiroMundial.shift();c.tamanho=2**c.roteiroMundial.length;c.adversario=null;}return;}
 const fase=c.preContinental?'Pré-classificação continental':c.playoff&&c.tamanho===32?'Playoff de acesso às oitavas':nomeFase(c,c.tamanho);
 const rng=geradorTecnico(`${c.seed}|chave-resultados|${c.etapa}|${c.tamanho}`),jogos=[],vencedores=[];
 for(const par of c.quadroMata||[]){
  if(par.includes(c.usuario)){jogos.push({...jogo,fase});vencedores.push(jogo.vencedor);continue;}
  let [a,b]=par;if(!a||!b){vencedores.push(a||b);continue;}
  if(c.ranqueGeral&&posicaoGeral(c,a)<posicaoGeral(c,b))[a,b]=[b,a];
  const casa={nome:a,forca:c.forcas[a]},fora={nome:b,forca:c.forcas[b]},simular=(x,y)=>jogoDaChave(c,x,y,rng);
  const pronto=c.quadroIAPronto?.find(p=>p.casa===a&&p.fora===b);
  const j=pronto??(partidaIA&&!idaVoltaNaFase(c)?partidaIA(casa,fora,simular):simular(casa,fora));jogos.push({...j,fase});vencedores.push(j.vencedor);if(!pronto)c.eliminados.push(j.vencedor===a?b:a);
 }
 if(!jogos.some(j=>j===jogo||[j.casa,j.fora].includes(c.usuario))){jogos.unshift({...jogo,fase});vencedores.unshift(jogo.vencedor);}
 delete c.idaIA;delete c.quadroIAPronto;
 c.fases.push({fase,jogos});c.jogosUsuario.push({...jogo,fase});
 c.eliminados.push(jogo.vencedor===jogo.casa?jogo.fora:jogo.casa);
 const proximos=c.playoff?entrarSementes(c,vencedores):vencedores;
 c.sobreviventes=proximos;c.ordemChave=chaveFixa(c)?proximos:null;
 if(c.preContinental){c.ordemChave=null;if(jogo.vencedor===c.usuario){c.preContinental=false;c.fase=c.faseAposPre;c.adversario=null;c.sobreviventes=null;}else{c.fase='fim';c.faseUsuario='Eliminado na pré-classificação';}return;}
 if(c.tamanho===2){c.campeao=jogo.vencedor;c.vice=jogo.vencedor===jogo.casa?jogo.fora:jogo.casa;c.faseUsuario=c.campeao===c.usuario?'Campeão':'Vice-campeão';c.fase='fim';return;}
 c.tamanho/=2;c.adversario=null;c.playoff=false;
 if(jogo.vencedor!==c.usuario){
  c.faseUsuario=`Eliminado: ${fase.toLowerCase()}`;
  // A chave real continua, inclusive com clubes fortes que entram depois das primeiras fases nacionais.
  continuarChave(c,proximos,rng);
 }
}
export function escolherCopa(c,chave,opcao,partidaIA){
 const d=decisaoCopa(c);if(!d||d.chave!==chave)return c;
 const planos=[...(d.penaltis?PLANOS_PENALTIS:PLANOS_COPA),...escolhasCopa(c,d).opcoes];if(!planos.some(x=>x.id===opcao))throw new Error('Escolha inválida.');
 const plano=planos.find(x=>x.id===opcao),revelacao={nome:plano.nome,probabilidades:d.penaltis?{classificacao:chancePenaltis(d.forcaUsuario,d.forcaAdv,opcao,d.final)}:chancesCopa(d.forcaUsuario,d.forcaAdv,opcao,d.final,d.perfilAdversario,d.mando)};
 const novo=structuredClone(c),rng=geradorTecnico(`${chave}|${opcao}`);
 // Campaigns saved before full brackets keep the opponent already shown on screen.
 if(!d.grupo&&!novo.quadroMata&&!novo.roteiroMundial){const outros=reduzirQuadro(novo.pool.filter(x=>x.nome!==novo.usuario&&x.nome!==d.adversario&&!novo.eliminados.includes(x.nome)&&(!novo.candidatosMata||novo.candidatosMata.includes(x.nome))),Math.max(0,novo.tamanho-2),geradorTecnico(`${novo.seed}|migracao-chave`)).sort((a,b)=>nivel(b)-nivel(a));novo.quadroMata=[[novo.usuario,d.adversario]];while(outros.length>1)novo.quadroMata.push([outros.shift().nome,outros.pop().nome]);if(outros.length)novo.quadroMata.push([outros[0].nome,null]);}

 if(d.penaltis){
  const j={...novo.resultado.jogo,penaltis:true,vencedor:rng()<chancePenaltis(d.forcaUsuario,d.forcaAdv,opcao,d.final)?novo.usuario:d.adversario};
  novo.resultado={...novo.resultado,jogo:j,escolha:opcao,revelacao,penaltisPendentes:false,venceu:j.vencedor===novo.usuario,empate:false,fase:d.fase,final:d.final};
  delete novo.pernaIda;registrarMata(novo,j,partidaIA);novo.etapa++;return novo;
 }
 const eu={nome:novo.usuario,forca:d.forcaUsuario},rival={nome:d.adversario,forca:d.forcaAdv};
 let j=partida(eu,rival,rng,opcao,d.final,d.perfilAdversario,d.mando);
 if(!d.casa){j={...j,casa:j.fora,fora:j.casa,golsCasa:j.golsFora,golsFora:j.golsCasa};}
 const decidir=x=>({...x,vencedor:x.golsCasa>x.golsFora?x.casa:x.golsFora>x.golsCasa?x.fora:null});
 if(d.perna==='ida'){
  // A ida fica salva no estado da campanha. Não simular a volta nem avançar a chave.
  novo.pernaIda={...j,etapa:'Ida',escolha:opcao};
  if(novo.agendaIA){
   const pares=novo.quadroMata.filter(par=>!par.includes(novo.usuario));
   novo.idaIA=disputarQuadroIA(novo,pares,partidaIA,{ida:true}).jogos;
  }
  novo.resultado={jogo:j,escolha:opcao,revelacao,jogoIda:true,penaltisPendentes:false,venceu:j.vencedor===novo.usuario,empate:!j.vencedor,fase:d.fase,final:false};
  return novo;
 }
 if(d.perna==='volta'){
  const ida=novo.pernaIda,golsDe=(p,time)=>p.casa===time?p.golsCasa:p.golsFora;
  if(golsDe(ida,novo.usuario)+golsDe(j,novo.usuario)===golsDe(ida,d.adversario)+golsDe(j,d.adversario)&&temProrrogacao({nome:novo.nome,tipo:novo.tipo,final:d.final,idaVolta:true}))j=decidir(prorrogar(j,eu,rival,rng,d.mando));
  if(novo.agendaIA&&novo.idaIA){
   const pares=novo.quadroMata.filter(par=>!par.includes(novo.usuario));
   novo.quadroIAPronto=disputarQuadroIA(novo,pares,partidaIA).jogos;
  }
  const volta={...j,etapa:'Volta',escolha:opcao};
  const meus=golsDe(ida,novo.usuario)+golsDe(volta,novo.usuario);
  const deles=golsDe(ida,d.adversario)+golsDe(volta,d.adversario);
  const agregado={casa:novo.usuario,fora:d.adversario,golsCasa:meus,golsFora:deles,vencedor:meus>deles?novo.usuario:deles>meus?d.adversario:null,agregado:true,partidas:[ida,volta]};
  novo.resultado={jogo:agregado,jogoExibido:volta,escolha:opcao,revelacao,penaltisPendentes:!agregado.vencedor,venceu:agregado.vencedor===novo.usuario,empate:!agregado.vencedor,fase:d.fase,final:d.final};
  if(novo.resultado.penaltisPendentes)return novo;
  delete novo.pernaIda;registrarMata(novo,agregado);novo.etapa++;return novo;
 }
 if(!d.grupo&&!j.vencedor&&temProrrogacao({nome:novo.nome,tipo:novo.tipo,final:d.final,idaVolta:false}))j=decidir(prorrogar(j,eu,rival,rng,d.mando));
 novo.resultado={jogo:j,escolha:opcao,revelacao,penaltisPendentes:!d.grupo&&!j.vencedor,venceu:j.vencedor===novo.usuario,empate:!j.vencedor,fase:d.fase,final:d.final};
 if(novo.resultado.penaltisPendentes)return novo;
 if(d.grupo)avancarLiga(novo,j,partidaIA);else registrarMata(novo,j,partidaIA);novo.etapa++;return novo;
}
/** Insere o resultado do motor ao vivo na mesma chave dos demais clubes. */
export function registrarPlacarCopa(c,chave,jogo) {
 const d=decisaoCopa(c);if(!d||d.chave!==chave||c.resultado)return c;
 const casa=d.grupo?(d.casa?c.usuario:d.adversario):jogo.casa,fora=d.grupo?(d.casa?d.adversario:c.usuario):jogo.fora;
 if(!d.grupo&&![c.usuario,d.adversario].includes(casa)||!d.grupo&&![c.usuario,d.adversario].includes(fora)||casa===fora)throw new Error('Times incompatíveis com a chave.');
 if(jogo.casa!==casa||jogo.fora!==fora||![jogo.golsCasa,jogo.golsFora].every(n=>Number.isInteger(n)&&n>=0))throw new Error('Placar incompatível com a partida da chave.');
 if(jogo.partidas?.length){
  const ps=jogo.partidas;
  if(d.grupo||ps.length!==2||ps.some(p=>![p.golsCasa,p.golsFora].every(n=>Number.isInteger(n)&&n>=0))||ps[0].casa!==casa||ps[0].fora!==fora||ps[1].casa!==fora||ps[1].fora!==casa||ps[0].golsCasa+ps[1].golsFora!==jogo.golsCasa||ps[0].golsFora+ps[1].golsCasa!==jogo.golsFora)throw new Error('Agregado incompatível com os jogos de ida e volta.');
 }
 const vencedor=jogo.golsCasa>jogo.golsFora?casa:jogo.golsFora>jogo.golsCasa?fora:null;
 if(jogo.vencedor&&![casa,fora].includes(jogo.vencedor)||vencedor&&jogo.vencedor&&vencedor!==jogo.vencedor||d.grupo&&!vencedor&&jogo.vencedor)throw new Error('Vencedor incompatível com o placar.');
 if(!d.grupo&&!vencedor&&!jogo.vencedor)throw new Error('O mata-mata empatado precisa de um vencedor nos pênaltis.');
 const novo=structuredClone(c),j={...structuredClone(jogo),vencedor:vencedor||jogo.vencedor||null};
 novo.resultado={jogo:j,origem:'partida-ao-vivo',penaltisPendentes:false,venceu:j.vencedor===novo.usuario,empate:!j.vencedor,fase:d.fase,final:d.final};
 if(d.grupo)avancarLiga(novo,j);else registrarMata(novo,j);novo.etapa++;
 return novo;
}
export function continuarCopa(c){if(c?.fase==='fim'&&!c.resultado)return {...c};if(!c?.resultado||c.resultado.penaltisPendentes)return c;return preparar({...structuredClone(c),resultado:null});}
export function simularCampanhaCopa(opcoes){let c=criarCampanhaCopa(opcoes);for(let i=0;c.fase!=='fim'&&i<80;i++){const d=decisaoCopa(c);c=d?escolherCopa(c,d.chave,d.penaltis?'canto':'controlar'):continuarCopa(c);}return c;}

/** Keep full public results; discard draw and animation state from historical seasons. */
export function resumoCampanhaCopa(c){return {nome:c.nome,tipo:c.tipo,ano:c.ano,...(c.selecao?{selecao:c.selecao}:{}),participantes:c.participantes||c.pool?.length||0,campeao:c.campeao,vice:c.vice,faseUsuario:c.faseUsuario,formato:c.formato,grupos:c.grupos||[],classificacao:c.classificacao||[],fases:c.fases||[],jogosUsuario:c.jogosUsuario||[],...(c.repescagemSulamericana?{repescagemSulamericana:true}:{})};}
