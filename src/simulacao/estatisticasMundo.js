import {jogosDaCampanha} from '../competicoes/jogosCampanha.js';
import {LIGAS} from '../dados/data.js';
import {geradorTecnico} from '../treinador/momentosTecnico.js';
import {setorJogador} from './forcaEquipe.js';
const chaveJogo=(nome,j)=>`${nome}|${j.casa}|${j.fora}|${j.golsCasa}|${j.golsFora}`;
function participacoesUsuario(card){
 const mapa=new Map(),competicoes=new Set();
 const inserir=(nome,j,stats)=>{const k=chaveJogo(nome,j);if(!mapa.has(k))mapa.set(k,[]);mapa.get(k).push(stats);competicoes.add(nome);};
 const liga=LIGAS[card.ligaId]?.nome;
 for(const j of card.jogosLista||[]){if(!liga)continue;const presente=!j.suspenso&&!j.descansou&&!j.naoEscalado;inserir(liga,{casa:j.casa?card.clube:j.adversario,fora:j.casa?j.adversario:card.clube,golsCasa:j.casa?j.golsMeu:j.golsAdv,golsFora:j.casa?j.golsAdv:j.golsMeu},{presente,gols:presente?j.golsMinha||0:0,assist:presente?j.assistMinha||0:0});}
 for(const j of card.partidasCompeticoes||[])if(!j.selecao)inserir(j.competicao,j,{presente:true,gols:j.gols||0,assist:j.assist||0});
 return {mapa,competicoes};
}
const vazio=()=>({jogos:0,gols:0,assist:0,defesas:0,cleanSheets:0,golsSofridos:0});
function escolher(lista,rng,peso){const total=lista.reduce((s,p)=>s+peso(p),0);let sorteio=rng()*total;return lista.find(p=>(sorteio-=peso(p))<0)||lista.at(-1);}
/** As estatísticas principais dos atletas do mundo vêm dos placares salvos.
 * Os números já conquistados pelo usuário são reservados antes de distribuir
 * os demais gols do clube entre seus companheiros. */
export function estatisticasDasPartidas(mundo,antes,card,seed='mundo',{zerarSemPartidas=false,clubesLegados=[]}={}){
 if(!mundo?.jogadores||!antes?.jogadores)return mundo;
 const originais=new Map(antes.jogadores.map(p=>[p.id,p]));
 const times=new Map(),linhas=new Map(),posicoes={GOL:1,DEF:4,MEI:3,ATA:3};
 for(const p of antes.jogadores){if(p.aposentado)continue;if(!times.has(p.clubeNome))times.set(p.clubeNome,[]);times.get(p.clubeNome).push(p);}
 const competicoes=Object.entries(card.classificacoesMundo||{}).map(([liga,t])=>({nome:LIGAS[liga]?.nome||liga,jogos:t.jogos||[]}));
 for(const t of [...(card.torneiosMundo||[]),...(card.torneios||[])])competicoes.push({nome:t.nome,tipo:t.tipo,jogos:jogosDaCampanha(t)});
 const cobertos=new Set(competicoes.flatMap(t=>t.jogos.flatMap(j=>[j.casa,j.fora])));
 const legados=new Set(clubesLegados);
 const usuario=participacoesUsuario(card);
 const unicas=[...new Map(competicoes.map(t=>[t.nome,t])).values()];
 for(const comp of unicas){
  const rng=geradorTecnico(`${seed}|${card.ano}|${comp.nome}|estatisticas-principais`);
  const reserva={...(card.porCompeticao||[]).find(t=>t.nome===comp.nome)};
  for(const jogo of comp.jogos){
   if(!Number.isFinite(jogo.golsCasa)||!Number.isFinite(jogo.golsFora))continue;
   const participacao=usuario.mapa.get(chaveJogo(comp.nome,jogo))?.shift();
   for(const [clube,gols,sofridos]of [[jogo.casa,jogo.golsCasa,jogo.golsFora],[jogo.fora,jogo.golsFora,jogo.golsCasa]]){
    const elenco=(times.get(clube)||[]).filter(p=>comp.tipo!=='copinha'||p.idade<=20);if(!elenco.length)continue;
    const titulares=[];
    for(const [setor,vagas]of Object.entries(posicoes))titulares.push(...elenco.filter(p=>setorJogador(p)===setor).map(p=>({p,peso:p.ovr+rng()*10})).sort((a,b)=>b.peso-a.peso).slice(0,Math.max(0,vagas-(clube===card.clube&&participacao?.presente&&setorJogador({posicao:card.posicao})===setor?1:0))).map(x=>x.p));
    const stats=new Map();
    for(const p of titulares){const k=String(p.id);if(!linhas.has(k))linhas.set(k,new Map());const comps=linhas.get(k);if(!comps.has(comp.nome))comps.set(comp.nome,{nome:comp.nome,...vazio()});const s=comps.get(comp.nome);s.jogos++;stats.set(k,s);}
    if(!titulares.length)continue;
    const goleiro=titulares.find(p=>p.posicao==='GOL');
    if(goleiro){const s=stats.get(String(goleiro.id));s.golsSofridos+=sofridos;s.defesas+=Math.floor(1+rng()*6);s.cleanSheets+=sofridos===0?1:0;}
    const campo=titulares.filter(p=>p.posicao!=='GOL');if(!campo.length)continue;
    const detalhada=usuario.competicoes.has(comp.nome);
    const seusGols=clube===card.clube?Math.min(gols,(detalhada?participacao?.gols:reserva.gols)||0):0;
    const suasAssist=clube===card.clube?Math.min(Math.max(0,gols-seusGols),(detalhada?participacao?.assist:reserva.assist)||0):0;
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
  const original=originais.get(p.id);
  if(original?.aposentado)return p;
  if(legados.has(original?.clubeNome)){const atual={...p,origemEstatisticas:'projecao-legada'};delete atual.porCompeticao;return atual;}
  const comps=linhas.get(String(p.id));if(!comps&&(!zerarSemPartidas||!cobertos.has(original?.clubeNome)))return p;
  const porCompeticao=[...(comps?.values()||[])],total=porCompeticao.reduce((s,t)=>{for(const k of Object.keys(s))s[k]+=t[k];return s;},vazio());
  const carreira={...p.carreira};for(const k of ['jogos','gols','assist','defesas','cleanSheets','golsSofridos'])carreira[k]=Math.max(0,(original?.carreira?.[k]||0)+total[k]);
  return {...p,...total,carreira,porCompeticao,origemEstatisticas:'partidas'};
 })};
}
