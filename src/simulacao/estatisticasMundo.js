import {LIGAS} from '../dados/data.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {setorJogador} from './forcaEquipe.js';
const vazio=()=>({jogos:0,gols:0,assist:0,defesas:0,cleanSheets:0,golsSofridos:0});
function escolher(lista,rng,peso){const total=lista.reduce((s,p)=>s+peso(p),0);let sorteio=rng()*total;return lista.find(p=>(sorteio-=peso(p))<0)||lista.at(-1);}
/** As estatísticas principais dos atletas do mundo vêm dos placares salvos.
 * Os números já conquistados pelo usuário são reservados antes de distribuir
 * os demais gols do clube entre seus companheiros. */
export function estatisticasDasPartidas(mundo,antes,card,seed='mundo'){
 if(!mundo?.jogadores||!antes?.jogadores)return mundo;
 const originais=new Map(antes.jogadores.map(p=>[p.id,p]));
 const times=new Map(),linhas=new Map(),posicoes={GOL:1,DEF:4,MEI:3,ATA:3};
 for(const p of antes.jogadores){if(p.aposentado)continue;if(!times.has(p.clubeNome))times.set(p.clubeNome,[]);times.get(p.clubeNome).push(p);}
 const competicoes=Object.entries(card.classificacoesMundo||{}).map(([liga,t])=>({nome:LIGAS[liga]?.nome||liga,jogos:t.jogos||[]}));
 for(const t of [...(card.torneiosMundo||[]),...(card.torneios||[])])competicoes.push({nome:t.nome,jogos:(t.fases||[]).flatMap(f=>f.jogos||[])});
 const unicas=[...new Map(competicoes.map(t=>[t.nome,t])).values()];
 for(const comp of unicas){
  const rng=geradorTecnico(`${seed}|${card.ano}|${comp.nome}|estatisticas-principais`);
  const reserva={...(card.porCompeticao||[]).find(t=>t.nome===comp.nome)};
  for(const jogo of comp.jogos){
   if(!Number.isFinite(jogo.golsCasa)||!Number.isFinite(jogo.golsFora))continue;
   for(const [clube,gols,sofridos]of [[jogo.casa,jogo.golsCasa,jogo.golsFora],[jogo.fora,jogo.golsFora,jogo.golsCasa]]){
    const elenco=times.get(clube)||[];if(!elenco.length)continue;
    const titulares=[];
    for(const [setor,vagas]of Object.entries(posicoes))titulares.push(...elenco.filter(p=>setorJogador(p)===setor).map(p=>({p,peso:p.ovr+rng()*10})).sort((a,b)=>b.peso-a.peso).slice(0,vagas).map(x=>x.p));
    const stats=new Map();
    for(const p of titulares){const k=String(p.id);if(!linhas.has(k))linhas.set(k,new Map());const comps=linhas.get(k);if(!comps.has(comp.nome))comps.set(comp.nome,{nome:comp.nome,...vazio()});const s=comps.get(comp.nome);s.jogos++;stats.set(k,s);}
    if(!titulares.length)continue;
    const goleiro=titulares.find(p=>p.posicao==='GOL');
    if(goleiro){const s=stats.get(String(goleiro.id));s.golsSofridos+=sofridos;s.defesas+=Math.floor(1+rng()*6);s.cleanSheets+=sofridos===0?1:0;}
    const campo=titulares.filter(p=>p.posicao!=='GOL');if(!campo.length)continue;
    const seusGols=clube===card.clube?Math.min(gols,reserva.gols||0):0;
    const suasAssist=clube===card.clube?Math.min(Math.max(0,gols-seusGols),reserva.assist||0):0;
    reserva.gols=(reserva.gols||0)-seusGols;reserva.assist=(reserva.assist||0)-suasAssist;
    for(let gol=0;gol<gols;gol++){
     const autor=gol<seusGols?null:escolher(campo,rng,p=>({ATA:7,MEI:3,DEF:1}[setorJogador(p)]||1)*Math.max(1,p.ovr-30));
     if(autor)stats.get(String(autor.id)).gols++;
     if(gol>=seusGols&&gol<seusGols+suasAssist)continue;
     const parceiros=campo.filter(p=>p.id!==autor?.id);
     if(parceiros.length&&rng()<.72){const garcom=escolher(parceiros,rng,p=>({ATA:3,MEI:6,DEF:2}[setorJogador(p)]||1)*Math.max(1,p.ovr-30));stats.get(String(garcom.id)).assist++;}
    }
   }
  }
 }
 return {...mundo,jogadores:mundo.jogadores.map(p=>{
  const comps=linhas.get(String(p.id));if(!comps)return p;
  const porCompeticao=[...comps.values()],total=porCompeticao.reduce((s,t)=>{for(const k of Object.keys(s))s[k]+=t[k];return s;},vazio());
  const original=originais.get(p.id);
  const carreira={...p.carreira};for(const k of ['jogos','gols','assist','defesas','cleanSheets','golsSofridos'])carreira[k]=Math.max(0,(original?.carreira?.[k]||0)+total[k]);
  return {...p,...total,carreira,porCompeticao};
 })};
}
