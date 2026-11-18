import {perfilAdversario,ajustePlanoAdversario} from '../competicoes/perfilAdversario.js';
import {TODAS_ESTRATEGIAS,NOVOS_PENALTIS,escolhasCopa} from './estrategiasCopas.js';
import {geradorTecnico} from './momentosTecnico.js';
import {simularPlacarRealista} from '../competicoes/motorPlacares.js';
import {temIdaVolta} from '../competicoes/regrasIdaVolta.js';
import {probabilidadesPlacar} from '../competicoes/motorPlacar.js';
import {ordenarGrupoMundial48} from '../competicoes/desempateMundial48.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const nivel=c=>Number(c?.forca??c?.elenco??60);
export const PLANOS_COPA=[{id:'pressionar',nome:'Pressionar e atacar',texto:'Mais risco, menos empates.'},{id:'controlar',nome:'Controlar o jogo',texto:'Mais proteção; aceita levar a decisão adiante.'},{id:'contra',nome:'Explorar os espaços',texto:'Funciona melhor diante de um adversário superior.'}];
export const PLANOS_PENALTIS=[{id:'canto',nome:'Bater colocado',texto:'Precisão para lidar com a pressão.'},{id:'forte',nome:'Bater com força',texto:'Uma cobrança agressiva.'},{id:'esperar',nome:'Esperar o goleiro',texto:'Frieza para decidir no último instante.'}];
export function chancesCopa(forca,adversario,plano='controlar',final=false,perfil=null){
 const estrategia=TODAS_ESTRATEGIAS.find(x=>x.id===plano);
 const diff=forca-adversario,ajuste=estrategia?(estrategia.ajuste==='contra'?clamp(-diff*.24,-4,7):estrategia.ajuste):plano==='pressionar'?3:plano==='contra'?clamp(-diff*.18,-3,5):0;
 return probabilidadesPlacar(forca+ajuste+ajustePlanoAdversario(plano,perfil),adversario,{neutro:final});
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
function partida(a,b,rng,plano='controlar',final=false,perfil=null){
 const bonus=plano==='pressionar'?2:plano==='contra'?1:0;
 const {golsCasa,golsFora}=simularPlacarRealista(nivel(a)+bonus+(ajustePlanoAdversario(plano,perfil)||0),nivel(b),rng,{neutro:final});
 const res=golsCasa>golsFora?'V':golsCasa<golsFora?'D':'E';
 return {casa:a.nome,fora:b.nome,golsCasa,golsFora,vencedor:res==='E'?null:res==='V'?a.nome:b.nome,res};
}
function tabela(times,jogos,usuario,desempateMundial=false){const tab=new Map(times.map(c=>[c.nome,{nome:c.nome,jogos:0,pontos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0,meuClube:c.nome===usuario}]));for(const j of jogos){const a=tab.get(j.casa),b=tab.get(j.fora);if(!a||!b)continue;a.jogos++;b.jogos++;a.golsPro+=j.golsCasa;a.golsContra+=j.golsFora;b.golsPro+=j.golsFora;b.golsContra+=j.golsCasa;if(j.vencedor){const v=tab.get(j.vencedor),d=tab.get(j.vencedor===a.nome?b.nome:a.nome);v.vitorias++;v.pontos+=3;d.derrotas++;}else{a.empates++;b.empates++;a.pontos++;b.pontos++;}}
 const linhas=[...tab.values()];
 const classificadas=desempateMundial?ordenarGrupoMundial48(linhas,jogos):linhas.sort((a,b)=>b.pontos-a.pontos||(b.golsPro-b.golsContra)-(a.golsPro-a.golsContra)||b.golsPro-a.golsPro||b.vitorias-a.vitorias||a.nome.localeCompare(b.nome));
 return classificadas.map((x,i)=>({...x,posicao:i+1,saldoGols:x.golsPro-x.golsContra}));}
function calendario(times,rodadas){const anel=[...times],primeiro=[];if(anel.length%2)anel.push(null);const n=anel.length;for(let r=0;r<n-1;r++){const jogos=[];for(let i=0;i<n/2;i++){let a=anel[i],b=anel[n-1-i];if(!a||!b)continue;if(r%2)[a,b]=[b,a];jogos.push({casa:a.nome,fora:b.nome});}primeiro.push(jogos);anel.splice(1,0,anel.pop());}return Array.from({length:rodadas},(_,r)=>primeiro[r%primeiro.length].map(j=>Math.floor(r/primeiro.length)%2?{casa:j.fora,fora:j.casa}:{...j}));}
const faseN=n=>n===2?'Final':n===4?'Semifinal':n===8?'Quartas de final':n===16?'Oitavas de final':n===32?'16 avos de final':'Fase preliminar';
/** O jogo do 3º lugar integra a competição, mesmo após a eliminação do usuário. */
function completarTerceiroLugar(c){
 if(c.tipo!=='copaMundo'||c.fases.some(f=>/terceiro lugar/i.test(f.fase)))return;
 const semifinal=c.fases.find(f=>/semifinal/i.test(f.fase));if(!semifinal||semifinal.jogos.length!==2)return;
 const perdedores=semifinal.jogos.map(j=>j.vencedor===j.casa?j.fora:j.casa).filter(Boolean);
 if(perdedores.length!==2)return;
 const rng=geradorTecnico(`${c.seed}|disputa-terceiro-lugar`);
 const j=jogoEliminatorio({nome:perdedores[0],forca:c.forcas[perdedores[0]]},{nome:perdedores[1],forca:c.forcas[perdedores[1]]},rng);
 c.terceiroLugar=j.vencedor;
 if(perdedores.includes(c.usuario))c.faseUsuario=j.vencedor===c.usuario?'3º lugar na Copa do Mundo':'4º lugar na Copa do Mundo';
 // A final deve permanecer como a última fase do torneio.
 const ultimaFinal=c.fases.findIndex(f=>f.fase==='Final');
 const disputa={fase:'Disputa de terceiro lugar',jogos:[{...j,fase:'Disputa de terceiro lugar'}]};
 if(ultimaFinal>=0)c.fases.splice(ultimaFinal,0,disputa);
 else c.fases.push(disputa);
 if([j.casa,j.fora].includes(c.usuario)){
  c.jogosUsuario.push({...j,fase:'Disputa de terceiro lugar'});
  c.faseUsuario=j.vencedor===c.usuario?'3º lugar na Copa do Mundo':'4º lugar na Copa do Mundo';
 }
}
export function criarCampanhaCopa({nome,tipo='continental',usuario,forcaUsuario,clubes,ano,formato='grupos',entrada='principal',seed,estado,interativoEstadual=false}){
 const rng=geradorTecnico(seed||`${ano}|${nome}|${usuario}`),eu={...(clubes.find(c=>c.nome===usuario)||{nome:usuario}),forca:forcaUsuario},outros=embaralhar(formato==='selecao48'?selecionarParticipantes(clubes.filter(c=>c.nome!==usuario),47,rng):clubes.filter(c=>c.nome!==usuario),rng);
 const c={nome,tipo,ano,usuario,selecao:null,seed:seed||`${ano}|${nome}|${usuario}`,forcaUsuario,forcas:Object.fromEntries([eu,...outros].map(c=>[c.nome,nivel(c)])),pool:[eu,...outros],fases:[],grupos:[],jogosUsuario:[],campeao:null,vice:null,faseUsuario:'Em disputa',etapa:0,rodada:0,resultado:null,eliminados:[],estado:estado||null};
 if(formato==='liga'){
  c.formato='liga';c.times=embaralhar([eu,...selecionarParticipantes(outros,35,rng)],rng);c.participantes=c.times.length;c.totalRodadas=/Conference/i.test(nome)?6:8;c.calendario=calendario(c.times,c.totalRodadas);const jogaveis=c.calendario.flatMap((js,i)=>js.some(j=>j.casa===usuario||j.fora===usuario)?[i]:[]);c.manual=[...new Set([jogaveis[0],jogaveis.at(-1)])];c.jogosLiga=[];c.fase='liga';
 }else if(formato==='grupos'||formato==='selecao32'||formato==='selecao48'){
  c.formato=formato;c.times=[eu,...outros.slice(0,3)];c.participantes=c.pool.length;c.totalRodadas=['selecao32','selecao48'].includes(formato)?3:6;c.calendario=calendario(c.times,c.totalRodadas);c.manual=c.calendario.flatMap((js,i)=>js.some(j=>j.casa===usuario||j.fora===usuario)?[i]:[]);c.jogosLiga=[];c.fase='grupos';
 }else if(formato==='estadual'){
  c.formato='estadual';c.times=[eu,...outros.slice(0,7)];c.totalRodadas=c.times.length%2?c.times.length:c.times.length-1;c.calendario=calendario(c.times,c.totalRodadas);const rodadasComUsuario=c.calendario.map((js,i)=>js.some(j=>j.casa===usuario||j.fora===usuario)?i:null).filter(i=>i!==null);c.manual=interativoEstadual?[...new Set([rodadasComUsuario[0],rodadasComUsuario.at(-1)])]:[];c.jogosLiga=[];c.fase='grupos';
 }else{
  c.formato=formato;c.fase='mata';c.tamanho=entrada==='pre'?32:entrada==='preliminar'?64:formato==='estadual'?4:16;
 }
 if(entrada==='pre'&&['grupos','liga'].includes(formato)){c.entradaPendente=true;c.faseAposPre=c.fase;c.fase='mata';c.tamanho=2;c.preContinental=true;}
 return preparar(c);
}
function avancarLiga(c,jogoUsuario){
 const rodada=c.calendario[c.rodada],rng=geradorTecnico(`${c.seed}|liga|${c.rodada}`),jogos=rodada.map(j=>{if(jogoUsuario&&[j.casa,j.fora].includes(c.usuario))return jogoUsuario;return partida({nome:j.casa,forca:c.forcas[j.casa]},{nome:j.fora,forca:c.forcas[j.fora]},rng);});
 c.jogosLiga.push(...jogos);for(const j of jogos)if([j.casa,j.fora].includes(c.usuario))c.jogosUsuario.push({...j,fase:c.fase==='liga'?'Fase de liga':'Fase de grupos',rodada:c.rodada+1});c.rodada++;c.classificacao=tabela(c.times,c.jogosLiga,c.usuario,c.formato==='selecao48');
}
function concluirLiga(c){
 c.grupos=[{grupo:c.formato==='liga'?'Tabela única':c.formato==='estadual'?'Classificação estadual':c.formato==='selecao48'?'Grupo A':c.selecao?'Grupo da seleção':'Grupo do seu clube',jogos:c.jogosLiga,classificacao:c.classificacao}];const pos=c.classificacao.find(x=>x.meuClube)?.posicao||99;c.posicaoInicial=pos;
 if(c.formato==='estadual'){
  c.candidatosMata=c.classificacao.slice(0,4).map(x=>x.nome);if(pos>4){c.faseUsuario='Eliminado na classificação estadual';concluirSemUsuario(c,c.candidatosMata);return;}c.tamanho=4;c.fase='mata';c.adversario=null;return;
 }
 if(c.formato==='liga'){
  if(pos>24){c.faseUsuario=`Eliminado na fase de liga · ${pos}º`;const diretos=c.classificacao.slice(0,8).map(x=>x.nome),playoffs=c.classificacao.slice(8,24).map(x=>x.nome);concluirSemUsuario(c,playoffs,{reservados:diretos,playoff:true});return;}
  c.candidatosMata=c.classificacao.slice(0,24).map(x=>x.nome);c.reservados=c.classificacao.slice(0,8).map(x=>x.nome).filter(x=>x!==c.usuario);c.tamanho=pos<=8?16:32;c.playoff=pos>8;c.faseUsuario=pos<=8?'Classificação direta às oitavas':'Playoff · 9º ao 24º';
  if(pos<=8){const rng=geradorTecnico(`${c.seed}|playoffs-outros`),diretos=c.classificacao.slice(0,8).map(x=>x.nome),playoffs=c.classificacao.slice(8,24).map(x=>({nome:x.nome,forca:c.forcas[x.nome]})),jogos=[];while(playoffs.length>1){const a=playoffs.shift(),b=playoffs.pop(),j=jogoDaChave({...c,tamanho:32},a,b,rng);jogos.push(j);diretos.push(j.vencedor);c.eliminados.push(j.vencedor===a.nome?b.nome:a.nome);}c.candidatosMata=diretos;c.reservados=[];c.fases.push({fase:'Playoff de acesso às oitavas',jogos});}

 }else{
  const mundial48=c.formato==='selecao48';
  const restantes=c.pool.filter(x=>!c.times.some(t=>t.nome===x.nome)),rng=geradorTecnico(`${c.seed}|outros-grupos`),classificados=c.classificacao.slice(0,2).map(x=>x.nome),terceiros=[c.classificacao[2]];
  c.eliminados.push(...c.classificacao.slice(mundial48?3:2).map(x=>x.nome));
  for(let i=0;i<restantes.length;i+=4){
   const grupo=restantes.slice(i,i+4),js=[];
   for(let a=0;a<grupo.length;a++)for(let b=a+1;b<grupo.length;b++){
    js.push(partida(grupo[a],grupo[b],rng));
    if(!['selecao32','selecao48'].includes(c.formato))js.push(partida(grupo[b],grupo[a],rng));
   }
   const tab=tabela(grupo,js,c.usuario,mundial48);
   c.grupos.push({grupo:`Grupo ${String.fromCharCode(65+c.grupos.length)}`,jogos:js,classificacao:tab});
   classificados.push(...tab.slice(0,2).map(x=>x.nome));
   if(mundial48)terceiros.push(tab[2]);
   c.eliminados.push(...tab.slice(mundial48?3:2).map(x=>x.nome));
  }
  if(mundial48){
   const melhores=terceiros.filter(Boolean).sort((a,b)=>b.pontos-a.pontos||b.saldoGols-a.saldoGols||b.golsPro-a.golsPro||a.nome.localeCompare(b.nome));
   classificados.push(...melhores.slice(0,8).map(x=>x.nome));
   c.eliminados.push(...melhores.slice(8).map(x=>x.nome));
   c.melhoresTerceiros=melhores.slice(0,8).map(x=>x.nome);
  }
  if(!classificados.includes(c.usuario)){c.faseUsuario=`${pos}º na fase de grupos`;c.repescagemSulamericana=pos===3&&/Libertadores/i.test(c.nome);concluirSemUsuario(c,classificados);return;}
  c.candidatosMata=classificados;
  c.tamanho=mundial48?32:/Sul-Americana/i.test(c.nome)&&pos===2?32:16;
  c.playoff=!mundial48&&c.tamanho===32;
 }
 c.fase='mata';c.adversario=null;
}
/** O torneio continua com os classificados reais mesmo sem o usuário. */
function concluirSemUsuario(c, nomes, {reservados=[],playoff=false}={}) {
 const rng=geradorTecnico(`${c.seed}|apos-grupos`);
 let vivos=[...new Set(nomes)].map(nome=>({nome,forca:c.forcas[nome]}));
 let paresMundial=c.formato==='selecao48'&&vivos.length===32?chaveInicialMundial48(c,rng):null;
 while(vivos.length>1){
  const tamanho=vivos.length,jogos=[],proximos=[];
  if(paresMundial){
   // Mesmo fora da Copa, o jogador acompanha o chaveamento correto.
   for(const [nomeA,nomeB] of paresMundial){
    const a=vivos.find(x=>x.nome===nomeA),b=vivos.find(x=>x.nome===nomeB);
    if(!a||!b)throw new Error('Chave da Copa do Mundo inconsistente.');
    const j=jogoDaChave({...c,tamanho},a,b,rng);
    jogos.push(j);proximos.push(j.vencedor===a.nome?a:b);
    c.eliminados.push(j.vencedor===a.nome?b.nome:a.nome);
   }
   paresMundial=null;
  }else{
   if(c.formato!=='selecao48')vivos.sort((a,b)=>nivel(b)-nivel(a));
   while(vivos.length>1){
    const a=vivos.shift(),b=c.formato==='selecao48'?vivos.shift():vivos.pop();
    const j=jogoDaChave({...c,tamanho},a,b,rng);
    jogos.push(j);proximos.push(j.vencedor===a.nome?a:b);
    c.eliminados.push(j.vencedor===a.nome?b.nome:a.nome);
    if(tamanho===2&&!reservados.length)c.vice=j.vencedor===a.nome?b.nome:a.nome;
   }
   if(vivos.length)proximos.push(vivos[0]);
  }
  c.fases.push({fase:playoff?'Playoff de acesso às oitavas':faseN(tamanho),jogos});
  vivos=proximos;
  if(reservados.length){vivos.push(...reservados.map(nome=>({nome,forca:c.forcas[nome]})));reservados=[];playoff=false;}
 }
 c.campeao=vivos[0]?.nome||null;completarTerceiroLugar(c);c.fase='fim';c.adversario=null;
}
function preparar(c){
 while(['liga','grupos'].includes(c.fase)&&c.rodada<c.totalRodadas&&!c.manual.includes(c.rodada))avancarLiga(c);
 if(['liga','grupos'].includes(c.fase)&&c.rodada>=c.totalRodadas)concluirLiga(c);
 if(c.fase==='mata'&&!c.adversario){if(c.roteiroMundial)c.adversario=c.pool.find(x=>x.nome===c.roteiroMundial[0]);else prepararChave(c);}
 return c;
}
export function decisaoCopa(c){
 if(!c||c.fase==='fim'||c.resultado&&!c.resultado.penaltisPendentes)return null;
 const grupo=['liga','grupos'].includes(c.fase),j=grupo?c.calendario[c.rodada]?.find(j=>[j.casa,j.fora].includes(c.usuario)):null,adv=grupo?(j.casa===c.usuario?j.fora:j.casa):c.adversario?.nome;
 return {chave:`${c.seed}|${c.etapa}|${c.rodada}|${c.resultado?.penaltisPendentes?'penaltis':'jogo'}`,fase:c.roteiroMundial?(c.roteiroMundial.length===1?'Final':c.roteiroMundial.length===3?'Derby das Américas':'Copa Challenger'):grupo?`${c.fase==='liga'?'Fase de liga':'Fase de grupos'} · jogo ${c.rodada+1}/${c.totalRodadas}`:c.preContinental?'Pré-classificação continental':c.playoff&&c.tamanho===32?'Playoff de acesso às oitavas':faseN(c.tamanho),adversario:adv,perfilAdversario:perfilAdversario(adv,c.ano),forcaUsuario:c.forcaUsuario,forcaAdv:c.forcas[adv],final:!grupo&&c.tamanho===2&&!c.preContinental,grupo,penaltis:!!c.resultado?.penaltisPendentes,casa:grupo?j.casa===c.usuario:true};
}
// All clubs play their side of the bracket. Later opponents are survivors, never fresh draws.
export function jogoEliminatorio(a,b,rng){
 const j=partida(a,b,rng,'pressionar');
 if(!j.vencedor){j.vencedor=rng()<chancePenaltis(nivel(a),nivel(b))?a.nome:b.nome;j.penaltis=true;}
 return j;
}
function jogoDaChave(c,a,b,rng){
 if(!temIdaVolta(c))return jogoEliminatorio(a,b,rng);
 const ida=partida(a,b,rng),volta=partida(b,a,rng),golsCasa=ida.golsCasa+volta.golsFora,golsFora=ida.golsFora+volta.golsCasa;
 return {casa:a.nome,fora:b.nome,golsCasa,golsFora,vencedor:golsCasa>golsFora?a.nome:golsFora>golsCasa?b.nome:rng()<chancePenaltis(nivel(a),nivel(b))?a.nome:b.nome,penaltis:golsCasa===golsFora,agregado:true,partidas:[{...ida,etapa:'Ida'},{...volta,etapa:'Volta'}]};
}
/** Sorteio da fase de 32: cabeças de grupo protegidos e sem revanche imediata
 * contra adversários da mesma chave; sem privilegiar a seleção do usuário.
 */
function chaveInicialMundial48(c,rng){
 const grupos=c.grupos||[];
 if(grupos.length!==12)throw new Error('Copa do Mundo: esperados 12 grupos.');
 const grupoPorEquipe=new Map(grupos.flatMap(g=>g.classificacao.map(t=>[t.nome,g.grupo])));
 const vencedores=embaralhar(grupos.map(g=>g.classificacao[0].nome),rng);
 const segundos=embaralhar(grupos.map(g=>g.classificacao[1].nome),rng);
 const terceiros=embaralhar(c.melhoresTerceiros||[],rng);
 if(vencedores.length!==12||segundos.length!==12||terceiros.length!==8)throw new Error('Copa do Mundo: classificação incompleta.');
 const pares=[];
 const escolherRival=(primeiro,pool)=>{
  const opcoes=pool.filter(nome=>grupoPorEquipe.get(nome)!==grupoPorEquipe.get(primeiro));
  if(!opcoes.length)throw new Error('Copa do Mundo: falta adversário de outro grupo.');
  const nome=opcoes[Math.floor(rng()*opcoes.length)];
  pool.splice(pool.indexOf(nome),1);
  return nome;
 };
 // Pareamento por busca evita sorteios que deixam o último cabeça de chave
 // sem rival elegível, embora existam combinações válidas.
 const parearTerceiros=(i,disponiveis)=>{
  if(i===8)return [];
  const opcoes=embaralhar(disponiveis.filter(nome=>grupoPorEquipe.get(nome)!==grupoPorEquipe.get(vencedores[i])),rng);
  for(const nome of opcoes){
   const demais=parearTerceiros(i+1,disponiveis.filter(x=>x!==nome));
   if(demais)return [nome,...demais];
  }
  return null;
 };
 const distribuicaoTerceiros=parearTerceiros(0,terceiros);
 if(!distribuicaoTerceiros)throw new Error('Copa do Mundo: não foi possível parear terceiros colocados.');
 for(let i=0;i<8;i++)pares.push([vencedores[i],distribuicaoTerceiros[i]]);
 for(let i=8;i<12;i++)pares.push([vencedores[i],escolherRival(vencedores[i],segundos)]);
 while(segundos.length){
  const a=segundos.shift();
  pares.push([a,escolherRival(a,segundos)]);
 }
 if(pares.length!==16||new Set(pares.flat()).size!==32)throw new Error('Copa do Mundo: fase de 32 inválida.');
 return pares;
}
function reduzirQuadro(times,limite,rng){
 let lista=[...times];if(limite<=0)return [];
 while(lista.length>limite){lista.sort((a,b)=>nivel(b)-nivel(a));const a=lista.pop(),b=lista.pop(),j=jogoEliminatorio(a,b,rng);lista.push(j.vencedor===a.nome?a:b);}
 return lista;
}
function prepararChave(c){
 const rng=geradorTecnico(`${c.seed}|chave|${c.etapa}|${c.tamanho}`);
 if(c.formato==='selecao48'&&c.tamanho===32&&c.grupos?.length===12){
  c.quadroMata=chaveInicialMundial48(c,rng);
  c.sobreviventes=c.quadroMata.flat();
  const meu=c.quadroMata.find(par=>par.includes(c.usuario));
  const adversario=meu?.find(nome=>nome!==c.usuario);
  c.adversario=c.pool.find(x=>x.nome===adversario);
  if(!c.adversario)throw new Error('Copa do Mundo: adversário do mata-mata não encontrado.');
  return;
 }
 if(!c.sobreviventes?.includes(c.usuario)){
  let outros=c.pool.filter(x=>x.nome!==c.usuario&&!c.eliminados.includes(x.nome)&&(!c.candidatosMata||c.candidatosMata.includes(x.nome))&&(!c.estado||x.estado===c.estado));
  // Strong national entrants join at the round of 16; early rounds retain the lower tiers.
  if(c.tipo==='copa'&&c.tamanho>16){c.reservados=outros.filter(x=>nivel(x)>=80).map(x=>x.nome);outros=outros.filter(x=>nivel(x)<80);}
  if(c.formato==='liga'&&c.tamanho===32)outros=outros.filter(x=>!c.reservados.includes(x.nome));
  if(c.preContinental)outros=outros.filter(x=>nivel(x)<82);
  outros=reduzirQuadro(outros,Math.max(1,c.tamanho-1),rng);
  c.sobreviventes=[c.usuario,...outros.map(x=>x.nome)];
 }
 let nomes=c.sobreviventes.filter(x=>!c.eliminados.includes(x));
 if(c.tamanho===16&&c.reservados?.length){nomes=[...new Set([...nomes,...c.reservados])];c.reservados=[];const outros=reduzirQuadro(nomes.filter(n=>n!==c.usuario).map(nome=>({nome,forca:c.forcas[nome]})),15,rng);nomes=[c.usuario,...outros.map(x=>x.nome)];c.sobreviventes=nomes;}
 if(nomes.length<=2)c.tamanho=2;else if(c.tamanho<=16)c.tamanho=Math.min(c.tamanho,2**Math.ceil(Math.log2(nomes.length)));
 // Seed once, then keep every winner. An underdog must actually eliminate its opponents.
 const ordenados=nomes.map(nome=>({nome,forca:c.forcas[nome]}));
 if(c.formato!=='selecao48')ordenados.sort((a,b)=>nivel(b)-nivel(a));
 const pares=[];while(ordenados.length>1){const a=ordenados.shift(),b=c.formato==='selecao48'?ordenados.shift():ordenados.pop();pares.push([a.nome,b.nome]);}if(ordenados.length)pares.push([ordenados[0].nome,null]);
 let meu=pares.find(p=>p.includes(c.usuario));
 if(meu?.[1]===null){const outro=pares.find(p=>!p.includes(c.usuario)&&p[1]);if(outro){meu[1]=outro.pop();outro.push(null);}}
 c.quadroMata=pares;
 const nome=meu?.find(n=>n&&n!==c.usuario);c.adversario=c.pool.find(x=>x.nome===nome);
 if(!c.adversario){c.fase='fim';c.faseUsuario='Sem adversário elegível';}
}
function registrarMata(c,jogo){
 if(c.roteiroMundial){const final=c.roteiroMundial.length===1,fase=final?'Final':c.roteiroMundial.length===3?'Derby das Américas':'Copa Challenger';c.fases.push({fase,jogos:[{...jogo,fase}]});c.jogosUsuario.push({...jogo,fase});if(jogo.vencedor!==c.usuario||final){c.fase='fim';c.campeao=final?jogo.vencedor:c.roteiroMundial.at(-1);c.vice=final?(jogo.vencedor===c.usuario?c.adversario.nome:c.usuario):null;c.faseUsuario=final?(c.campeao===c.usuario?'Campeão':'Vice-campeão'):`Eliminado: ${fase}`;}else{c.roteiroMundial.shift();c.tamanho=2**c.roteiroMundial.length;c.adversario=null;}return;}
 const fase=c.preContinental?'Pré-classificação continental':c.playoff&&c.tamanho===32?'Playoff de acesso às oitavas':faseN(c.tamanho);
 const rng=geradorTecnico(`${c.seed}|chave-resultados|${c.etapa}|${c.tamanho}`),jogos=[{...jogo,fase}],vencedores=[jogo.vencedor];
 for(const par of c.quadroMata||[]){if(par.includes(c.usuario))continue;const [a,b]=par;if(!b){vencedores.push(a);continue;}const j=jogoDaChave(c,{nome:a,forca:c.forcas[a]},{nome:b,forca:c.forcas[b]},rng);jogos.push({...j,fase});vencedores.push(j.vencedor);c.eliminados.push(j.vencedor===a?b:a);}
 if(c.formato==='selecao48'){
  // A ordem do quadro define o próximo cruzamento, não a posição do jogador.
  vencedores.splice(0,vencedores.length,...(c.quadroMata||[]).map(par=>{
   if(!par[1])return par[0];
   return jogos.find(j=>[j.casa,j.fora].includes(par[0])&&[j.casa,j.fora].includes(par[1]))?.vencedor;
  }).filter(Boolean));
 }
 c.fases.push({fase,jogos});c.jogosUsuario.push({...jogo,fase});
 c.eliminados.push(jogo.vencedor===jogo.casa?jogo.fora:jogo.casa);
 c.sobreviventes=vencedores;
 if(c.preContinental){if(jogo.vencedor===c.usuario){c.preContinental=false;c.fase=c.faseAposPre;c.adversario=null;c.sobreviventes=null;}else{c.fase='fim';c.faseUsuario='Eliminado na pré-classificação';}return;}
 if(c.tamanho===2){c.campeao=jogo.vencedor;c.vice=jogo.vencedor===jogo.casa?jogo.fora:jogo.casa;c.faseUsuario=c.campeao===c.usuario?'Campeão':'Vice-campeão';completarTerceiroLugar(c);c.fase='fim';return;}
 c.tamanho/=2;c.adversario=null;
 if(jogo.vencedor!==c.usuario){
  c.faseUsuario=`Eliminado: ${fase.toLowerCase()}`;c.fase='fim';let times=vencedores.map(nome=>({nome,forca:c.forcas[nome]}));
  // Continue the real remaining bracket, including stronger clubs joining after early national rounds.
  if(c.reservados?.length){times.push(...c.reservados.map(nome=>({nome,forca:c.forcas[nome]})));c.reservados=[];}
  while(times.length>1){const js=[],next=[];if(c.formato!=='selecao48')times.sort((a,b)=>nivel(b)-nivel(a));while(times.length>1){const a=times.shift(),b=c.formato==='selecao48'?times.shift():times.pop(),j=jogoDaChave({...c,tamanho:times.length+next.length*2+2},a,b,rng);js.push(j);next.push(j.vencedor===a.nome?a:b);if(!times.length&&!next.slice(0,-1).length)c.vice=j.vencedor===a.nome?b.nome:a.nome;}if(times.length)next.push(times[0]);c.fases.push({fase:faseN(next.length*2),jogos:js});times=next;}
  c.campeao=times[0]?.nome||null;completarTerceiroLugar(c);
 }
}
export function escolherCopa(c,chave,opcao){
 const d=decisaoCopa(c);if(!d||d.chave!==chave)return c;
 const planos=[...(d.penaltis?PLANOS_PENALTIS:PLANOS_COPA),...escolhasCopa(c,d).opcoes];if(!planos.some(x=>x.id===opcao))throw new Error('Escolha inválida.');
 const plano=planos.find(x=>x.id===opcao),revelacao={nome:plano.nome,probabilidades:d.penaltis?{classificacao:chancePenaltis(d.forcaUsuario,d.forcaAdv,opcao,d.final)}:chancesCopa(d.forcaUsuario,d.forcaAdv,opcao,d.final,d.perfilAdversario)};
 const novo=structuredClone(c),rng=geradorTecnico(`${chave}|${opcao}`);
 // Campaigns saved before full brackets keep the opponent already shown on screen.
 if(!d.grupo&&!novo.quadroMata&&!novo.roteiroMundial){const outros=reduzirQuadro(novo.pool.filter(x=>x.nome!==novo.usuario&&x.nome!==d.adversario&&!novo.eliminados.includes(x.nome)&&(!novo.candidatosMata||novo.candidatosMata.includes(x.nome))),Math.max(0,novo.tamanho-2),geradorTecnico(`${novo.seed}|migracao-chave`)).sort((a,b)=>nivel(b)-nivel(a));novo.quadroMata=[[novo.usuario,d.adversario]];while(outros.length>1)novo.quadroMata.push([outros.shift().nome,outros.pop().nome]);if(outros.length)novo.quadroMata.push([outros[0].nome,null]);}

 if(d.penaltis){const j={...novo.resultado.jogo,penaltis:true,vencedor:rng()<chancePenaltis(d.forcaUsuario,d.forcaAdv,opcao,d.final)?novo.usuario:d.adversario};novo.resultado={jogo:j,escolha:opcao,revelacao,penaltisPendentes:false,venceu:j.vencedor===novo.usuario,fase:d.fase,final:d.final};registrarMata(novo,j);novo.etapa++;return novo;}
 const eu={nome:novo.usuario,forca:d.forcaUsuario},adv={nome:d.adversario,forca:d.forcaAdv};
 let j=partida(eu,adv,rng,opcao,d.final,d.perfilAdversario);
 if(!d.grupo&&temIdaVolta(novo)){
  const volta=partida(adv,eu,rng,opcao,d.final,d.perfilAdversario);
  j={casa:eu.nome,fora:adv.nome,golsCasa:j.golsCasa+volta.golsFora,golsFora:j.golsFora+volta.golsCasa,
   vencedor:null,agregado:true,partidas:[{...j,etapa:'Ida'},{...volta,etapa:'Volta'}]};
  j.vencedor=j.golsCasa>j.golsFora?eu.nome:j.golsFora>j.golsCasa?adv.nome:null;
 }else if(!d.casa){[j.casa,j.fora]=[j.fora,j.casa];[j.golsCasa,j.golsFora]=[j.golsFora,j.golsCasa];}
 novo.resultado={jogo:j,escolha:opcao,revelacao,penaltisPendentes:!d.grupo&&!j.vencedor,venceu:j.vencedor===novo.usuario,empate:!j.vencedor,fase:d.fase,final:d.final};
 if(novo.resultado.penaltisPendentes)return novo;
 if(d.grupo)avancarLiga(novo,j);else registrarMata(novo,j);novo.etapa++;return novo;
}
/** Insere o resultado do motor ao vivo na mesma chave dos demais clubes. */
export function registrarPlacarCopa(c,chave,jogo) {
 const d=decisaoCopa(c);if(!d||d.chave!==chave||c.resultado)return c;
 const casa=d.casa?c.usuario:d.adversario,fora=d.casa?d.adversario:c.usuario;
 if(jogo.casa!==casa||jogo.fora!==fora||![jogo.golsCasa,jogo.golsFora].every(n=>Number.isInteger(n)&&n>=0))throw new Error('Placar incompatível com a partida da chave.');
 if(!d.grupo&&temIdaVolta(c)&&!jogo.partidas?.length){
  const rng=geradorTecnico(`${chave}|volta-ao-vivo`);
  const volta=partida({nome:fora,forca:c.forcas[fora]},{nome:casa,forca:c.forcas[casa]},rng);
  const ida={...jogo,etapa:'Ida'};
  jogo={casa,fora,golsCasa:ida.golsCasa+volta.golsFora,golsFora:ida.golsFora+volta.golsCasa,
    agregado:true,partidas:[ida,{...volta,etapa:'Volta'}]};
  if(jogo.golsCasa===jogo.golsFora){jogo.penaltis=true;jogo.vencedor=rng()<chancePenaltis(c.forcas[casa],c.forcas[fora])?casa:fora;}
 }
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
export function resumoCampanhaCopa(c){return {nome:c.nome,tipo:c.tipo,ano:c.ano,...(c.selecao?{selecao:c.selecao}:{}),participantes:c.participantes||c.pool?.length||0,campeao:c.campeao,vice:c.vice,faseUsuario:c.faseUsuario,formato:c.formato,grupos:c.grupos||[],classificacao:c.classificacao||[],fases:c.fases||[],jogosUsuario:c.jogosUsuario||[],...(c.terceiroLugar?{terceiroLugar:c.terceiroLugar}:{}),...(c.repescagemSulamericana?{repescagemSulamericana:true}:{})};}
