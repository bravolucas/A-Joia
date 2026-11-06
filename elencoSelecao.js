import {NACIONALIDADES} from './data.js';
import {calcOVR} from './lib.js';
import {penalidadePosicao} from './posicoesCarreira.js';
const clone=x=>JSON.parse(JSON.stringify(x));
const limitar=(n,a,b)=>Math.max(a,Math.min(b,n));
const hash=s=>[...String(s)].reduce((a,v)=>Math.imul(a^v.charCodeAt(0),16777619)>>>0,2166136261);
const POSICOES=['GOL','GOL','GOL','LD','LD','LE','LE','ZAG','ZAG','ZAG','ZAG','VOL','VOL','MC','MC','MC','MEI','MEI','MD','ME','PD','PD','PE','PE','ATA','ATA'];
export const grupoSelecao=p=>p==='GOL'?'GOL':['ZAG','LD','LE','ALE','ALD'].includes(p)?'DEF':['VOL','MC','MEI','ME','MD'].includes(p)?'MEI':'ATA';
const vazio=()=>({jogos:0,minutos:0,gols:0,assist:0,semSofrer:0,notas:0});
function criar(c,ano,slot,posicao,forca,usados){
 const h=hash(`${c.codigo}:elenco:${c.nac}:${ano}:${slot}`),nomes=['Caio','Mateo','André','Davi','Rafael','Gabriel','Nicolas','Bruno','Iago','Samuel','Leo','Daniel','Diego','Alex','Victor','Hugo'],sobrenomes=['Nunes','Duarte','Lemos','Monteiro','Vidal','Costa','Reis','Azevedo','Pires','Mendes','Ramos','Alves','Lima','Dias','Silva','Rocha'];
 let nome=`${nomes[h%16]} ${sobrenomes[(h>>>8)%16]}`;if(usados.has(nome))nome+=` ${sobrenomes[slot%16]}`;
 return{id:`convocado:${c.nac}:${ano}:${slot}:${posicao}`,nome,posicao,nascimento:ano-20-h%12,ovr:limitar(forca-6+(h>>>12)%13,45,94),desde:ano,estatisticas:vazio(),ficticio:true};
}
/** Elenco persistente, atualizado uma vez por ano. O atleta ocupa uma das 26 vagas. */
export function atualizarElencoSelecao(c,ano=c.ano){
 c.jornada=c.jornada||{};let e=c.jornada.elencoSelecao;
 const fs=NACIONALIDADES.find(n=>n.id===c.nac)?.forcaSelecao||72;
 if(!e||e.nac!==c.nac)e={nac:c.nac,ano:ano-1,jogadores:[],aposentados:[],processados:[],usuario:{estatisticas:vazio()}};
 if(e.ano>ano)return e;
 const slots=[...POSICOES],idx=slots.findIndex(p=>p===c.posicao),equiv=slots.findIndex(p=>grupoSelecao(p)===grupoSelecao(c.posicao));slots.splice(idx>=0?idx:equiv>=0?equiv:25,1);
 const antigos=e.jogadores.length?e.jogadores:(c.jornada.geracaoNac===c.nac?c.jornada.geracao||[]:[]).map((p,i)=>({...p,posicao:p.posicao||['GOL','LD','ZAG','ZAG','LE','VOL','MC','MEI','PD','PE','ATA'][i%11],ovr:p.ovr||fs,estatisticas:vazio()}));
 const disponiveis=antigos.filter(p=>ano-p.nascimento<=37&&ano-p.nascimento>=18),usados=new Set(),nomes=new Set(disponiveis.map(p=>p.nome)),jogadores=[];
 const retirados=antigos.filter(p=>ano-p.nascimento>37);
 e.aposentados=[...(e.aposentados||[]),...retirados.map(p=>({...p,saida:ano}))].slice(-52);
 for(let i=0;i<slots.length;i++){
  const posicao=slots[i],p=disponiveis.find(p=>p.posicao===posicao&&!usados.has(p.id));
  let novo=p?{...p}:criar(c,ano,i,posicao,fs,nomes);
  if(!p){let tentativa=0;while(usados.has(novo.id))novo=criar(c,ano,i+26*(++tentativa),posicao,fs,nomes);}
  if(p&&e.ano<ano){const anos=ano-Math.max(e.ano,p.desde||e.ano);const idade=ano-p.nascimento;novo.ovr=limitar(Math.round((p.ovr||fs)+(idade<=25?Math.min(3,anos):idade>=32?-Math.min(5,anos):0)),45,94);}
  usados.add(novo.id);nomes.add(novo.nome);novo.estatisticas={...vazio(),...novo.estatisticas};jogadores.push(novo);
 }
 // Mudanças reais de posição podem alterar a distribuição sem retirar todo o núcleo.
 e.jogadores=jogadores;e.ano=ano;e.usuario={...e.usuario,id:'usuario',nome:c.nome,posicao:c.posicao,ovr:Math.max(40,calcOVR(c.attrs,c.posicao)-penalidadePosicao(c)),nascimento:ano-c.idade,estatisticas:{...vazio(),...e.usuario?.estatisticas}};
 const numero=Number.isInteger(c.numero)&&c.numero>=1&&c.numero<=26?c.numero:10;e.usuario.numero=numero;
 const numeros=Array.from({length:26},(_,i)=>i+1).filter(n=>n!==numero);e.jogadores.forEach((p,i)=>p.numero=numeros[i]);
 c.jornada.elencoSelecao=e;return e;
}
function escolherXI(e,titular){
 const todos=[...e.jogadores,...(titular?[e.usuario]:[])],escolhidos=[];
 for(const grupo of ['GOL','DEF','DEF','DEF','DEF','MEI','MEI','MEI','ATA','ATA','ATA']){
  const candidatos=todos.filter(p=>grupoSelecao(p.posicao)===grupo&&!escolhidos.includes(p)).sort((a,b)=>(b.id==='usuario'?200:b.ovr)-(a.id==='usuario'?200:a.ovr));
  const p=candidatos[0]||todos.filter(p=>!escolhidos.includes(p)).sort((a,b)=>b.ovr-a.ovr)[0];if(p)escolhidos.push(p);
 }
 if(titular&&!escolhidos.some(p=>p.id==='usuario'))escolhidos[10]=e.usuario;
 return escolhidos;
}
export function prepararElencoCopa(c,ano=c.ano){const e=clone(atualizarElencoSelecao(clone(c),ano));e.processados=(e.processados||[]).filter(id=>id.startsWith(`${ano}:`));return e;}
export function forcaElencoCopa(e,fs){if(!e)return 0;const xi=escolherXI(e,false);return limitar((xi.reduce((n,p)=>n+p.ovr,0)/11-fs)*.3,-1.5,1.5);}
/** Distribui somente gols do placar registrado; cobranças de desempate ficam fora. */
export function registrarJogoElenco(e,jogo,{titular=true,ano=e?.ano}={}){
 if(!e||!jogo||!Number.isInteger(jogo.gp)||jogo.gp<0)return;
 const id=`${ano}:${jogo.fase}:${jogo.adv?.id||jogo.adv?.nome}`;if(e.processados.includes(id))return;
 e.processados=[...e.processados,id];
 const xi=escolherXI(e,titular),linhas=xi.map(p=>({id:p.id,nome:p.nome,posicao:p.posicao,minutos:90,gols:0,assist:0,titular:true}));
 if(!titular){const grupo=grupoSelecao(e.usuario.posicao),sai=[...linhas].reverse().find(p=>grupoSelecao(p.posicao)===grupo)||linhas.at(-1);sai.minutos=60;linhas.push({id:'usuario',nome:e.usuario.nome,posicao:e.usuario.posicao,minutos:30,gols:0,assist:0,titular:false});}
 const banco=e.jogadores.filter(p=>!linhas.some(l=>l.id===p.id)&&p.posicao!=='GOL').sort((a,b)=>hash(id+a.id)-hash(id+b.id));
 for(const p of banco.slice(0,3)){
  const sai=linhas.filter(l=>l.titular&&l.id!=='usuario'&&l.posicao!=='GOL'&&l.minutos===90).sort((a,b)=>Number(grupoSelecao(b.posicao)===grupoSelecao(p.posicao))-Number(grupoSelecao(a.posicao)===grupoSelecao(p.posicao)))[0];if(!sai)continue;
  sai.minutos=60;linhas.push({id:p.id,nome:p.nome,posicao:p.posicao,minutos:30,gols:0,assist:0,titular:false});
 }
 const eu=linhas.find(p=>p.id==='usuario');eu.gols=limitar(jogo.gols||0,0,jogo.gp);eu.assist=limitar(jogo.assist||0,0,jogo.gp-eu.gols);
 const artilheiros=linhas.filter(p=>p.id!=='usuario'&&p.posicao!=='GOL'),pool=artilheiros.flatMap(p=>Array(grupoSelecao(p.posicao)==='ATA'?5:grupoSelecao(p.posicao)==='MEI'?3:1).fill(p));
 const gols=Array.from({length:jogo.gp},(_,i)=>({marcadorId:i<eu.gols?'usuario':pool[hash(id+':gol:'+i)%pool.length].id,assistenteId:null}));
 let assistencias=eu.assist;
 for(let i=0;i<gols.length;i++){
  const gol=gols[i];if(gol.marcadorId!=='usuario'&&assistencias>0){gol.assistenteId='usuario';assistencias--;}
  else if(hash(id+':assist:'+i)%5!==0){const opcoes=artilheiros.filter(p=>p.id!==gol.marcadorId);if(opcoes.length)gol.assistenteId=opcoes[hash(id+':autor:'+i)%opcoes.length].id;}
 }
 for(const p of linhas){
  p.gols=gols.filter(g=>g.marcadorId===p.id).length;p.assist=gols.filter(g=>g.assistenteId===p.id).length;
  p.nota=Math.round(limitar(6+(jogo.res==='V'?.5:jogo.res==='D'?-.5:0)+p.gols*.6+p.assist*.3+(p.posicao==='GOL'&&jogo.gc===0?.4:0),4,10)*10)/10;
  const atleta=p.id==='usuario'?e.usuario:e.jogadores.find(a=>a.id===p.id),s=atleta.estatisticas;
  s.jogos++;s.minutos+=p.minutos;s.gols+=p.gols;s.assist+=p.assist;s.notas+=p.nota;if(p.posicao==='GOL'&&jogo.gc===0&&p.minutos>=60)s.semSofrer++;
 }
 jogo.elenco={jogadores:linhas,gols};
}
export function consolidarElencoCopa(c,card){
 const e=card?.copa?.elenco;if(!e||!card.copa.fim||!card.copa.convocado)return;
 c.jornada=c.jornada||{};if((c.jornada.elencoSelecao?.ano||0)>e.ano)return;
 c.jornada.elencoSelecao=clone(e);
}
