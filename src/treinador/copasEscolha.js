import {geradorTecnico} from './momentosTecnico.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const nivel=c=>Number(c?.forca??c?.elenco??60);
export const PLANOS_COPA=[{id:'pressionar',nome:'Pressionar e atacar',texto:'Mais risco, menos empates.'},{id:'controlar',nome:'Controlar o jogo',texto:'Mais proteção; aceita levar a decisão adiante.'},{id:'contra',nome:'Explorar os espaços',texto:'Funciona melhor diante de um adversário superior.'}];
export const PLANOS_PENALTIS=[{id:'canto',nome:'Bater colocado',texto:'Precisão para lidar com a pressão.'},{id:'forte',nome:'Bater com força',texto:'Uma cobrança agressiva.'},{id:'esperar',nome:'Esperar o goleiro',texto:'Frieza para decidir no último instante.'}];
export function chancesCopa(forca,adversario,plano='controlar',final=false){
 const diff=forca-adversario,ajuste=plano==='pressionar'?3:plano==='contra'?clamp(-diff*.18,-3,5):0;
 const empate=clamp(.27-Math.abs(diff)*.0015+(plano==='controlar'?.06:plano==='pressionar'?-.07:0),.12,.34);
 const vitoria=clamp((1-empate)/(1+Math.exp(-(diff+ajuste)/(final?18:14))),.03,1-empate-.03);
 return {vitoria,empate,derrota:1-vitoria-empate};
}
export function chancePenaltis(forca,adversario,plano='canto',final=false){const diff=forca-adversario;return clamp(.5+diff*(final?.003:.004)+(plano==='canto'?.015:plano==='esperar'?clamp(-diff*.0008,-.015,.025):-.005),.23,.77);}
function embaralhar(lista,rng){return lista.map(x=>({x,d:rng()})).sort((a,b)=>a.d-b.d).map(x=>x.x);}
function partida(a,b,rng,plano='controlar',final=false){
 const p=chancesCopa(nivel(a),nivel(b),plano,final),d=rng(),res=d<p.vitoria?'V':d<p.vitoria+p.empate?'E':'D',baixo=Math.floor(rng()*2),alto=baixo+1+Math.floor(rng()*2);
 return {casa:a.nome,fora:b.nome,golsCasa:res==='V'?alto:baixo,golsFora:res==='D'?alto:baixo,vencedor:res==='E'?null:res==='V'?a.nome:b.nome,res};
}
function tabela(times,jogos,usuario){const tab=new Map(times.map(c=>[c.nome,{nome:c.nome,jogos:0,pontos:0,vitorias:0,empates:0,derrotas:0,golsPro:0,golsContra:0,meuClube:c.nome===usuario}]));for(const j of jogos){const a=tab.get(j.casa),b=tab.get(j.fora);if(!a||!b)continue;a.jogos++;b.jogos++;a.golsPro+=j.golsCasa;a.golsContra+=j.golsFora;b.golsPro+=j.golsFora;b.golsContra+=j.golsCasa;if(j.vencedor){const v=tab.get(j.vencedor),d=tab.get(j.vencedor===a.nome?b.nome:a.nome);v.vitorias++;v.pontos+=3;d.derrotas++;}else{a.empates++;b.empates++;a.pontos++;b.pontos++;}}
 return [...tab.values()].sort((a,b)=>b.pontos-a.pontos||(b.golsPro-b.golsContra)-(a.golsPro-a.golsContra)||b.golsPro-a.golsPro||b.vitorias-a.vitorias||a.nome.localeCompare(b.nome)).map((x,i)=>({...x,posicao:i+1,saldoGols:x.golsPro-x.golsContra}));}
function calendario(times,rodadas){const anel=[...times],primeiro=[];if(anel.length%2)anel.push(null);const n=anel.length;for(let r=0;r<n-1;r++){const jogos=[];for(let i=0;i<n/2;i++){let a=anel[i],b=anel[n-1-i];if(!a||!b)continue;if(r%2)[a,b]=[b,a];jogos.push({casa:a.nome,fora:b.nome});}primeiro.push(jogos);anel.splice(1,0,anel.pop());}return Array.from({length:rodadas},(_,r)=>primeiro[r%primeiro.length].map(j=>Math.floor(r/primeiro.length)%2?{casa:j.fora,fora:j.casa}:{...j}));}
const faseN=n=>n===2?'Final':n===4?'Semifinal':n===8?'Quartas de final':n===16?'Oitavas de final':n===32?'Pré-oitavas':'Fase preliminar';
export function criarCampanhaCopa({nome,tipo='continental',usuario,forcaUsuario,clubes,ano,formato='grupos',entrada='principal',seed,estado}){
 const rng=geradorTecnico(seed||`${ano}|${nome}|${usuario}`),eu={...(clubes.find(c=>c.nome===usuario)||{nome:usuario}),forca:forcaUsuario},outros=embaralhar(clubes.filter(c=>c.nome!==usuario),rng);
 const c={nome,tipo,ano,usuario,selecao:null,seed:seed||`${ano}|${nome}|${usuario}`,forcaUsuario,forcas:Object.fromEntries([eu,...outros].map(c=>[c.nome,nivel(c)])),pool:[eu,...outros],fases:[],grupos:[],jogosUsuario:[],campeao:null,vice:null,faseUsuario:'Em disputa',etapa:0,rodada:0,resultado:null,eliminados:[],estado:estado||null};
 if(formato==='liga'){
  c.formato='liga';c.times=[eu,...outros.slice(0,35)];c.participantes=c.times.length;c.totalRodadas=/Conference/i.test(nome)?6:8;c.calendario=calendario(c.times,c.totalRodadas);c.manual=[0,c.totalRodadas-1];c.jogosLiga=[];c.fase='liga';
 }else if(formato==='grupos'){
  c.formato='grupos';c.times=[eu,...outros.slice(0,3)];c.participantes=c.pool.length;c.totalRodadas=6;c.calendario=calendario(c.times,6);c.manual=[0,1,2,3,4,5];c.jogosLiga=[];c.fase='grupos';
 }else if(formato==='estadual'){
  c.formato='estadual';c.times=[eu,...outros.slice(0,7)];c.totalRodadas=c.times.length%2?c.times.length:c.times.length-1;c.calendario=calendario(c.times,c.totalRodadas);c.manual=[];c.jogosLiga=[];c.fase='grupos';
 }else{
  c.formato=formato;c.fase='mata';c.tamanho=entrada==='pre'?32:entrada==='preliminar'?64:formato==='estadual'?4:16;
 }
 if(entrada==='pre'&&['grupos','liga'].includes(formato)){c.entradaPendente=true;c.faseAposPre=c.fase;c.fase='mata';c.tamanho=2;c.preContinental=true;}
 return preparar(c);
}
function avancarLiga(c,jogoUsuario){
 const rodada=c.calendario[c.rodada],rng=geradorTecnico(`${c.seed}|liga|${c.rodada}`),jogos=rodada.map(j=>{if(jogoUsuario&&[j.casa,j.fora].includes(c.usuario))return jogoUsuario;return partida({nome:j.casa,forca:c.forcas[j.casa]},{nome:j.fora,forca:c.forcas[j.fora]},rng);});
 c.jogosLiga.push(...jogos);for(const j of jogos)if([j.casa,j.fora].includes(c.usuario))c.jogosUsuario.push({...j,fase:c.fase==='liga'?'Fase de liga':'Fase de grupos',rodada:c.rodada+1});c.rodada++;c.classificacao=tabela(c.times,c.jogosLiga,c.usuario);
}
function concluirLiga(c){
 c.grupos=[{grupo:c.formato==='liga'?'Tabela única':c.formato==='estadual'?'Classificação estadual':'Grupo do seu clube',jogos:c.jogosLiga,classificacao:c.classificacao}];const pos=c.classificacao.find(x=>x.meuClube)?.posicao||99;c.posicaoInicial=pos;
 if(c.formato==='estadual'){
  c.candidatosMata=c.classificacao.slice(0,4).map(x=>x.nome);if(pos>4){c.fase='fim';c.faseUsuario='Eliminado na classificação estadual';return;}c.tamanho=4;c.fase='mata';c.adversario=null;return;
 }
 if(c.formato==='liga'){
  if(pos>24){c.fase='fim';c.faseUsuario=`Eliminado na fase de liga · ${pos}º`;return;}
  c.candidatosMata=c.classificacao.slice(0,24).map(x=>x.nome);c.tamanho=pos<=8?16:32;c.playoff=pos>8;c.faseUsuario=pos<=8?'Classificação direta às oitavas':'Playoff · 9º ao 24º';
 }else{
  if(pos>2){c.fase='fim';c.faseUsuario=`${pos}º na fase de grupos`;c.repescagemSulamericana=pos===3&&/Libertadores/i.test(c.nome);return;}
  c.eliminados.push(...c.classificacao.filter(x=>x.posicao>2).map(x=>x.nome));
  c.tamanho=/Sul-Americana/i.test(c.nome)&&pos===2?32:16;c.playoff=c.tamanho===32;
 }
 c.fase='mata';c.adversario=null;
}
function preparar(c){
 while(['liga','grupos'].includes(c.fase)&&c.rodada<c.totalRodadas&&!c.manual.includes(c.rodada))avancarLiga(c);
 if(['liga','grupos'].includes(c.fase)&&c.rodada>=c.totalRodadas)concluirLiga(c);
 if(c.fase==='mata'&&!c.adversario){const rng=geradorTecnico(`${c.seed}|adv|${c.etapa}|${c.tamanho}`),opcoes=c.pool.filter(x=>x.nome!==c.usuario&&!c.eliminados.includes(x.nome)&&(!c.candidatosMata||c.candidatosMata.includes(x.nome))&&(c.formato!=='liga'||!c.playoff||c.tamanho!==32||c.classificacao.find(y=>y.nome===x.nome)?.posicao>8)&&(!c.estado||x.estado===c.estado));const elegiveis=c.tamanho>16?opcoes.filter(x=>nivel(x)<(c.tamanho>=64?71:81)):opcoes;const pool=elegiveis.length?elegiveis:opcoes;c.adversario=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];if(!c.adversario){c.fase='fim';c.faseUsuario='Sem adversário elegível';}}
 return c;
}
export function decisaoCopa(c){
 if(!c||c.fase==='fim'||c.resultado&&!c.resultado.penaltisPendentes)return null;
 const grupo=['liga','grupos'].includes(c.fase),j=grupo?c.calendario[c.rodada]?.find(j=>[j.casa,j.fora].includes(c.usuario)):null,adv=grupo?(j.casa===c.usuario?j.fora:j.casa):c.adversario?.nome;
 return {chave:`${c.seed}|${c.etapa}|${c.rodada}|${c.resultado?.penaltisPendentes?'penaltis':'jogo'}`,fase:grupo?`${c.fase==='liga'?'Fase de liga':'Fase de grupos'} · jogo ${c.rodada+1}/${c.totalRodadas}`:c.preContinental?'Pré-classificação continental':c.playoff&&c.tamanho===32?'Playoff de acesso às oitavas':faseN(c.tamanho),adversario:adv,forcaUsuario:c.forcaUsuario,forcaAdv:c.forcas[adv],final:!grupo&&c.tamanho===2&&!c.preContinental,grupo,penaltis:!!c.resultado?.penaltisPendentes,casa:grupo?j.casa===c.usuario:true};
}
function registrarMata(c,jogo){
 const fase=c.preContinental?'Pré-classificação continental':c.playoff&&c.tamanho===32?'Playoff de acesso às oitavas':faseN(c.tamanho);c.fases.push({fase,jogos:[{...jogo,fase}]});c.jogosUsuario.push({...jogo,fase});
 if(jogo.vencedor!==c.usuario){c.eliminados.push(c.usuario);c.faseUsuario=`Eliminado: ${fase.toLowerCase()}`;c.fase='fim';const rng=geradorTecnico(`${c.seed}|restante|${c.etapa}`);let times=[{nome:jogo.vencedor,forca:c.forcas[jogo.vencedor]},...embaralhar(c.pool.filter(x=>!c.eliminados.includes(x.nome)&&x.nome!==jogo.vencedor&&(!c.candidatosMata||c.candidatosMata.includes(x.nome))),rng).slice(0,Math.max(0,c.tamanho/2-1))];
  if(c.tamanho===2&&!c.preContinental){c.campeao=jogo.vencedor;c.vice=c.usuario;c.faseUsuario='Vice-campeão';return;}
  while(times.length>1){if(times.length%2)times.pop();const faseRest=faseN(times.length),js=[],next=[];for(let i=0;i<times.length;i+=2){const j=partida(times[i],times[i+1],rng);if(!j.vencedor){j.vencedor=rng()<chancePenaltis(nivel(times[i]),nivel(times[i+1]))?j.casa:j.fora;j.penaltis=true;}js.push(j);next.push(times.find(x=>x.nome===j.vencedor));if(times.length===2)c.vice=j.vencedor===j.casa?j.fora:j.casa;}c.fases.push({fase:faseRest,jogos:js});times=next;}if(!c.preContinental)c.campeao=times[0]?.nome||null;return;
 }
 c.eliminados.push(jogo.casa===c.usuario?jogo.fora:jogo.casa);
 if(c.preContinental){c.preContinental=false;c.fase=c.faseAposPre;c.adversario=null;return;}
 if(c.tamanho===2){c.campeao=c.usuario;c.vice=c.adversario.nome;c.faseUsuario='Campeão';c.fase='fim';return;}
 c.tamanho/=2;c.adversario=null;
}
export function escolherCopa(c,chave,opcao){
 const d=decisaoCopa(c);if(!d||d.chave!==chave)return c;
 const planos=d.penaltis?PLANOS_PENALTIS:PLANOS_COPA;if(!planos.some(x=>x.id===opcao))throw new Error('Escolha inválida.');
 const novo=structuredClone(c),rng=geradorTecnico(`${chave}|${opcao}`);
 if(d.penaltis){const j={...novo.resultado.jogo,penaltis:true,vencedor:rng()<chancePenaltis(d.forcaUsuario,d.forcaAdv,opcao,d.final)?novo.usuario:d.adversario};novo.resultado={jogo:j,escolha:opcao,penaltisPendentes:false,venceu:j.vencedor===novo.usuario,fase:d.fase,final:d.final};registrarMata(novo,j);novo.etapa++;return novo;}
 const j=partida({nome:novo.usuario,forca:d.forcaUsuario},{nome:d.adversario,forca:d.forcaAdv},rng,opcao,d.final);
 if(!d.casa){[j.casa,j.fora]=[j.fora,j.casa];[j.golsCasa,j.golsFora]=[j.golsFora,j.golsCasa];}
 novo.resultado={jogo:j,escolha:opcao,penaltisPendentes:!d.grupo&&!j.vencedor,venceu:j.vencedor===novo.usuario,empate:!j.vencedor,fase:d.fase,final:d.final};
 if(novo.resultado.penaltisPendentes)return novo;
 if(d.grupo)avancarLiga(novo,j);else registrarMata(novo,j);novo.etapa++;return novo;
}
export function continuarCopa(c){if(c?.fase==='fim'&&!c.resultado)return {...c};if(!c?.resultado||c.resultado.penaltisPendentes)return c;return preparar({...c,resultado:null});}
export function simularCampanhaCopa(opcoes){let c=criarCampanhaCopa(opcoes);for(let i=0;c.fase!=='fim'&&i<80;i++){const d=decisaoCopa(c);c=d?escolherCopa(c,d.chave,d.penaltis?'canto':'controlar'):continuarCopa(c);}return c;}

/** Keep full public results; discard draw and animation state from historical seasons. */
export function resumoCampanhaCopa(c){return {nome:c.nome,tipo:c.tipo,ano:c.ano,participantes:c.participantes||c.pool?.length||0,campeao:c.campeao,vice:c.vice,faseUsuario:c.faseUsuario,formato:c.formato,grupos:c.grupos||[],classificacao:c.classificacao||[],fases:c.fases||[],jogosUsuario:c.jogosUsuario||[],...(c.repescagemSulamericana?{repescagemSulamericana:true}:{})};}
