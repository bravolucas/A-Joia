import React,{useMemo,useState} from 'react';
import {Escudo} from './uiTreinador.jsx';
import LinkEntidade from '../historia/LinkEntidade.jsx';
import {rotuloDia,rotuloData} from '../competicoes/calendarioCopas.js';
import {INTERVENCOES_TECNICO,proximoCompromissoTecnico,agendaCalendarioTecnico,tabelaCalendarioTecnico} from './tecnico.js';
import {LIGAS} from '../dados/data.js';
import './CalendarioTemporada.css';

/* Calendário da temporada (Modo Rápido · treinador): liga e copas nas mesmas datas.
   Jogar a próxima partida escolhendo a estratégia, pular a próxima (estratégia padrão)
   ou simular até uma data sem paradas, como no Football Manager. */
const ROTULO_RESULTADO={V:'V',E:'E',D:'D'};
function Placar({j,clube}){
 const meu=j.casa===clube?'casa':'fora';
 return <li className={`cal-recente cal-${j.resultado||'E'}`}><small>{rotuloDia(j.data,j.ano)} · {j.competicao==='liga'?`Liga · rodada ${j.rodada}`:<LinkEntidade tipo="competicao" nome={j.competicao}/>}</small>
  <span><b className={meu==='casa'?'cal-eu':''}><LinkEntidade tipo="clube" nome={j.casa}/></b> <strong>{j.golsCasa} × {j.golsFora}</strong> <b className={meu==='fora'?'cal-eu':''}><LinkEntidade tipo="clube" nome={j.fora}/></b></span>
  <i aria-label={j.resultado==='V'?'Vitória':j.resultado==='D'?'Derrota':'Empate'}>{ROTULO_RESULTADO[j.resultado]||'E'}</i></li>;
}
/** Dados do calendário do treinador para o painel. */
export function dadosCalendarioTecnico(t,nomeLiga){
 const p=t.temporadaPausada;
 return {ano:t.ano,clube:t.clube,nomeLiga,proximo:proximoCompromissoTecnico(t),agenda:agendaCalendarioTecnico(t),tabela:tabelaCalendarioTecnico(t),
  recentes:(t.calendarioRecentes||[]).filter(x=>x.ano===t.ano),totalJogos:p?.calendario?.filter(x=>!x.folga).length,mundo:p?.mundo};
}
export default function CalendarioTemporada({dados,ocupado,onAcao,onAbrirCopa,modoJogador=false}){
 const {ano,clube,nomeLiga,proximo:prox,agenda=[],tabela=[],recentes=[],totalJogos,mundo}=dados;
 const t={ano,clube};
 const [verTodas,setVerTodas]=useState(false);
 const minha=tabela.find(x=>x.meuClube);
 const lista=useMemo(()=>{
  const itens=agenda.map(x=>({...x,chave:`l${x.indice}`}));
  if(prox&&prox.tipo==='copa')itens.push({tipo:'copa',data:prox.data,campanha:prox.campanha,decisao:prox.decisao,chave:'copa'});
  return itens.sort((a,b)=>a.data-b.data||(a.tipo==='copa'?-1:1));
 },[agenda,prox]);
 const visiveis=verTodas?lista:lista.slice(0,8);
 const meses=[];for(const x of visiveis){const m=rotuloData(x.data,t.ano);if(meses.at(-1)?.mes!==m)meses.push({mes:m,itens:[]});meses.at(-1).itens.push(x);}
 const noticias=mundo?.noticias||[];
 const lideres=Object.entries(mundo?.ligas||{}).filter(([,e])=>e.classificacao?.[0]?.jogos>0).map(([liga,e])=>({liga,lider:e.classificacao[0],progresso:e.progresso})).slice(0,8);
 const acao=a=>{if(!ocupado)onAcao?.(a);};
 const adv=prox?.tipo==='liga'?(typeof prox.adversario==='string'?{nome:prox.adversario,casa:prox.casa,forca:prox.forca}:prox.adversario):null,d=prox?.tipo==='copa'?prox.decisao:null;
 return <section className="cal-temporada" aria-label="Calendário da temporada">
  <header className="cal-topo"><div><small>CALENDÁRIO · TEMPORADA {t.ano}</small><h2>{prox?rotuloDia(prox.data,t.ano):'Temporada encerrada'}</h2></div>
   {minha&&<div className="cal-situacao"><strong>{minha.posicao}º</strong><span>{minha.pontos} pts · {minha.jogos}{totalJogos?`/${totalJogos}`:''} jogos</span></div>}</header>

  {prox&&<div className="cal-proximo" aria-label="Próximo compromisso">
   <small>PRÓXIMO COMPROMISSO · {prox.tipo==='liga'?`${nomeLiga} · rodada ${prox.rodada}${prox.total?` de ${prox.total}`:''}`:prox.tipo==='copa'?<><LinkEntidade tipo="competicao" nome={prox.campanha.nome}/>{d?` · ${d.fase}`:''}</>:prox.marco?.titulo}</small>
   {adv&&(adv.folga?<p className="cal-folga">Rodada de folga: o {clube} não joga.</p>
    :<div className="ct-season-preview"><Escudo nome={adv.nome} size={48}/><div><strong><LinkEntidade tipo="clube" nome={adv.nome}/></strong><span>{adv.casa?'Em casa':'Fora de casa'}{Number.isFinite(adv.forca)?` · Força ${Math.round(adv.forca)}`:''}</span></div></div>)}
   {d&&<div className="ct-season-preview"><Escudo nome={d.adversario} size={48}/><div><strong><LinkEntidade tipo={['copaMundo','continentalSelecao'].includes(prox.campanha.tipo)?'selecao':'clube'} nome={d.adversario}/></strong><span>{d.penaltis?'Decisão nos pênaltis':d.casa?'Em casa':'Fora de casa'} · Força {Math.round(d.forcaAdv)}</span></div></div>}
   {prox.tipo==='copa'&&!d&&<p className="cal-folga">Resultado da partida de copa registrado.</p>}
   {['momento','selecao','marco'].includes(prox.tipo)&&<p className="cal-folga">{prox.tipo==='momento'?'Um lance decisivo espera por você.':prox.tipo==='selecao'?'Compromisso com a seleção.':prox.marco?.titulo||'Marco do calendário.'}</p>}
   {adv&&!adv.folga&&<><p className="cal-instrucao">{modoJogador?'Jogar a partida: escolha como o time vai encarar o jogo.':'Jogar a partida: escolha a estratégia.'}</p><div className="ct-decisions cal-estrategias">{INTERVENCOES_TECNICO.map(op=><button key={op.id} disabled={ocupado} onClick={()=>acao({modo:'jogar',estrategia:op.id})}><strong>{op.nome}</strong><span>{op.descricao}</span></button>)}</div></>}
   {prox.tipo!=='liga'&&<button className="ct-primary" disabled={ocupado} onClick={onAbrirCopa}>{prox.tipo==='copa'?(d?'Jogar e escolher a estratégia':'Ver resultado e continuar'):'Abrir'}<span aria-hidden="true">→</span></button>}
   <div className="cal-pulos">
    <button type="button" disabled={ocupado} onClick={()=>acao({modo:'pular'})}>{adv?.folga?'Avançar a rodada':'Pular próxima partida'}<small>Estratégia padrão</small></button>
    <button type="button" disabled={ocupado} onClick={()=>acao({modo:'ate',data:Infinity})}>Simular até o fim da temporada<small>Sem paradas</small></button>
   </div>
  </div>}

  <details className="cal-lista" open>
   <summary>Calendário · simular até uma data</summary>
   <p className="cal-instrucao">Escolha um dia: tudo antes dele é simulado com a estratégia padrão, sem paradas, e o jogo volta a você nesse dia.</p>
   {meses.map(m=><div key={m.mes} className="cal-mes"><h3>{m.mes}</h3><ol>{m.itens.map((x,i)=>{
    const primeiro=x===lista[0];
    return <li key={x.chave} className={x.tipo==='copa'?'cal-item cal-item-copa':'cal-item'}>
     <time>{rotuloDia(x.data,t.ano).split(' ')[0]}</time>
     <span className="cal-item-jogo">{x.tipo==='copa'?<><LinkEntidade tipo="competicao" nome={x.campanha.nome}/>{x.decisao?<> · <LinkEntidade tipo="clube" nome={x.decisao.adversario}/></>:''}</>
      :x.adversario?.folga?<em>Folga · rodada {x.rodada}</em>:<>{nomeLiga} {x.rodada}ª · {(x.adversario?.casa??x.casa)?'vs':'em'} <LinkEntidade tipo="clube" nome={x.adversario?.nome??x.adversario}/></>}</span>
     {primeiro?<span className="cal-hoje">Próximo</span>:<button type="button" disabled={ocupado} onClick={()=>acao({modo:'ate',data:x.data})} aria-label={`Simular até ${rotuloDia(x.data,t.ano)}`}>Ir para este dia</button>}
    </li>;})}</ol></div>)}
   {lista.length>8&&<button type="button" className="cal-mais" onClick={()=>setVerTodas(v=>!v)}>{verTodas?'Mostrar menos':`Ver calendário completo (${lista.length} datas)`}</button>}
   <p className="cal-nota">As partidas de copa entram no calendário assim que o sorteio e a fase anterior definem a data.</p>
  </details>

  {recentes.length>0&&<section className="cal-bloco" aria-label="Últimos resultados"><h3>Últimos resultados</h3><ol className="cal-recentes">{recentes.slice(0,5).map((j,i)=><Placar key={i} j={j} clube={t.clube}/>)}</ol></section>}

  {tabela.length>0&&<section className="cal-bloco" aria-label="Classificação da liga"><h3>{nomeLiga}</h3><table className="cal-tabela"><thead><tr><th>#</th><th>Clube</th><th>J</th><th>SG</th><th>Pts</th></tr></thead><tbody>
   {tabela.filter((x,i)=>i<6||x.meuClube).map(x=><tr key={x.nome} className={x.meuClube?'cal-eu':''}><td>{x.posicao}</td><td><LinkEntidade tipo="clube" nome={x.nome}/></td><td>{x.jogos}</td><td>{x.saldoGols??(x.golsPro??0)-(x.golsContra??0)}</td><td><b>{x.pontos}</b></td></tr>)}
  </tbody></table></section>}

  {(noticias.length>0||lideres.length>0)&&<section className="cal-bloco" aria-label="Pelo mundo"><h3>Pelo mundo</h3>
   {noticias.length>0&&<ul className="cal-noticias">{noticias.map((n,i)=><li key={i}><small>{LIGAS[n.liga]?.nome||n.liga}</small>{n.texto}</li>)}</ul>}
   {lideres.length>0&&<ul className="cal-lideres">{lideres.map(x=><li key={x.liga}><small>{LIGAS[x.liga]?.nome||x.liga}{x.progresso>=1?' · encerrada':''}</small><span><LinkEntidade tipo="clube" nome={x.lider.nome}/> <b>{x.lider.pontos} pts</b></span></li>)}</ul>}
  </section>}
 </section>;
}
