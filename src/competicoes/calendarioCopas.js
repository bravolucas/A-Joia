import {decisaoCopa} from '../treinador/copasEscolha.js';
const meses=['','JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
export function dataCopa(c){
 const d=decisaoCopa(c),t=c.tamanho||16;
 if(c.tipo==='estadual')return c.fase==='grupos'?1+(c.rodada/Math.max(1,c.totalRodadas))*1.5:t<=2?3.3:3.1;
 if(c.tipo==='mundial')return c.formato==='mundial32'?(c.fase==='grupos'?6.15+c.rodada*.1:t>=16?6.8:t>=8?7.05:t>=4?7.2:7.4):12.2+(c.roteiroMundial?.length?(3-c.roteiroMundial.length)*.12:.36);
 const europeu=c.formato==='liga'||c.regiao==='europa';
 if(d?.grupo)return europeu?-3+(c.rodada/Math.max(1,c.totalRodadas-1))*4.2:4.1+c.rodada*.4;
 if(c.preContinental)return europeu?-5:3.7;
 return europeu?(t>16?2.1:t===16?3.1:t===8?4.1:t===4?4.7:5.5):(t>=64?2.3:t>=32?3.6:t===16?8.1:t===8?9.1:t===4?10.1:c.tipo==='copa'?11.8:11.5);
}
export function rotuloData(valor,ano){const mes=Math.floor(valor),normal=((mes-1)%12+12)%12+1;return `${meses[normal]} ${ano+(mes<=0?-1:0)}`;}
export function criarAgenda(campeonatos,{ano,clube,liga,externos=[]}={}){
 const europa=campeonatos.some(c=>c.formato==='liga')||liga?.europa;
 const marcos=liga?[{id:'inicio',data:europa?-4:liga?.brasil&&ano>=2026?1.5:3.8,titulo:'A liga vai começar',fracao:0},{id:'metade',data:europa?.1:7.5,titulo:'Metade do campeonato',fracao:.5},{id:'fim',data:europa?5.8:12.05,titulo:'Fim do campeonato',fracao:1}].map(x=>({...x,tipo:'liga',...liga})):[];
 return selecionarAgenda({calendarioVersao:1,ano,clube,campeonatos,indice:0,concluidas:[],vistos:[],eventos:[...marcos,...externos],dataAtual:europa?-5:1});
}
export function selecionarAgenda(p){
 const candidatos=p.campeonatos.map((c,i)=>({i,data:Math.max(p.dataAtual,dataCopa(c))})).filter(x=>!p.concluidas.includes(x.i));
 const externos=p.eventos.filter(x=>!p.vistos.includes(x.id)).map(x=>({...x,data:Math.max(p.dataAtual,x.data)}));
 const primeiro=[...candidatos,...externos].sort((a,b)=>a.data-b.data)[0];
 if(!primeiro)return null;
 return {...p,indice:primeiro.i??-1,pausa:primeiro.i==null?primeiro:null,dataAtual:primeiro.data};
}
export function chaveAgenda(p){return p?.pausa?`${p.ano}|${p.clube}|calendario|${p.pausa.id}`:null;}
export function avancarPausa(p){return selecionarAgenda({...p,vistos:[...p.vistos,p.pausa.id],pausa:null});}
export function contextoAgenda(p){if(!p?.calendarioVersao)return null;return {data:rotuloData(p.dataAtual,p.ano),liga:p.eventos.find(x=>x.tipo==='liga')?.nome,etapa:p.pausa?.titulo};}
