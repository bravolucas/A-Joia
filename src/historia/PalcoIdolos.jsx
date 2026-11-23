import React,{useMemo,useState} from 'react';
import {idolosDoClube,idolosDaSelecao,rankingIdolos,CRITERIOS_IDOLOS} from './idolos.js';
import {lendasDe} from './lendasHistoricas.js';
import {acervoClubeHistoricoDe} from '../dados/acervoClubesHistoricos.js';
import {acervoSelecaoHistoricoDe} from '../dados/acervoSelecoesHistoricas.js';
import LinkEntidade from './LinkEntidade.jsx';
import './PalcoIdolos.css';

const n=x=>Number.isFinite(x)?x.toLocaleString('pt-BR'):'—';
const periodo=x=>x.desde==null?'':x.desde===x.ate?String(x.desde):`${x.desde}–${x.ate}`;
function Selo({status}){return status?<span className={`pi-selo pi-${status.id}`}>{status.nome}</span>:null;}
const plural=(v,um,varios)=>`${n(v)} ${v===1?um:varios}`;
function Linha({x}){
 return <small className="pi-numeros">{plural(x.jogos,'jogo','jogos')} · {plural(x.gols,'gol','gols')}{x.golsClassicos?` · ${n(x.golsClassicos)} em clássicos`:''}{x.titulos?` · ${plural(x.titulos,'título','títulos')}`:''}</small>;
}

/** Palco de ídolos: lendas, ídolos e favoritos da torcida por critérios variados. */
export default function PalcoIdolos({c,tipo='clube',nome}){
 const lista=useMemo(()=>tipo==='selecao'?idolosDaSelecao(c,nome):idolosDoClube(c,nome),[c,tipo,nome]);
 const criterios=CRITERIOS_IDOLOS[tipo]||CRITERIOS_IDOLOS.clube;
 const [id,setId]=useState('torcida');
 const criterio=criterios.find(x=>x.id===id)||criterios[0];
 const ranking=rankingIdolos(lista,criterio,10),podio=ranking.slice(0,3),resto=ranking.slice(3);
 const lendas=lendasDe(nome),acervo=tipo==='clube'?acervoClubeHistoricoDe(nome):acervoSelecaoHistoricoDe(nome),contagem=['lenda','idolo','favorito'].map(s=>lista.filter(x=>x.status?.id===s).length);
 return <section className="pi-palco" aria-label={`Palco de ídolos · ${nome}`}>
  <header className="pi-topo"><div><span className="hf-eyebrow">PALCO DE ÍDOLOS</span><h3>Quem a torcida de {nome} nunca esquece</h3>
   <p>{contagem[0]} lenda{contagem[0]===1?'':'s'} · {contagem[1]} ídolo{contagem[1]===1?'':'s'} · {contagem[2]} favorito{contagem[2]===1?'':'s'} da torcida neste save</p></div></header>
  <div className="pi-criterios" role="tablist" aria-label="Critério do ranking">{criterios.map(x=>
   <button key={x.id} type="button" role="tab" aria-selected={x.id===criterio.id} onClick={()=>setId(x.id)}>{x.nome}</button>)}</div>
  {!ranking.length?<p className="hf-vazio">Ainda não há atletas com registros suficientes para este critério. O palco cresce a cada temporada.</p>:<>
   <ol className="pi-podio" aria-label={`Pódio · ${criterio.nome}`}>{podio.map((x,i)=><li key={x.id} className={`pi-posicao-${i+1}${x.voce?' pi-voce':''}`}>
    <span className="pi-lugar">{i+1}º</span>
    <span className="pi-avatar" aria-hidden="true">{(x.nome||'?').slice(0,1)}</span>
    <strong><LinkEntidade tipo="jogador" id={x.id} nome={x.nome}/>{x.voce?' · Você':''}</strong>
    <Selo status={x.status}/>
    <b className="pi-valor">{n(x[criterio.campo])}<small>{criterio.unidade}</small></b>
    <Linha x={x}/><small className="pi-periodo">{x.posicao||'—'} · {periodo(x)}{x.rival?' · saiu para um rival':''}{x.bandeira?' · encerrou a carreira no clube':''}</small>
   </li>)}</ol>
   {resto.length>0&&<ol className="pi-lista" start={4}>{resto.map((x,i)=><li key={x.id} className={x.voce?'pi-voce':''}>
    <span className="pi-lugar">{i+4}º</span><span><strong><LinkEntidade tipo="jogador" id={x.id} nome={x.nome}/>{x.voce?' · Você':''}</strong><Linha x={x}/></span>
    <Selo status={x.status}/><b>{n(x[criterio.campo])}</b>
   </li>)}</ol>}
  </>}
  {acervo?.atletas?.length>0&&<section className="pi-acervo" aria-label={'Atletas históricos documentados · '+nome}>
   <header><strong>Arquivo histórico real</strong><small>Ídolos anteriores à carreira · dados documentados, independentes do save</small></header>
   <div className="pi-acervo-lista">{acervo.atletas.map(x=><article key={x.nome}>
    <strong>{x.nome}</strong><small>{[x.posicao,x.periodo].filter(Boolean).join(' · ')}</small>
    <p>{x.jogos!=null?`${x.jogos.toLocaleString('pt-BR')} jogos`: 'Jogos não apurados'} · {x.gols!=null?`${x.gols.toLocaleString('pt-BR')} gols`:'Gols não apurados'}</p>
    <small>{x.descricao}</small><a href={x.fonte} target="_blank" rel="noopener noreferrer">Fonte histórica</a>
   </article>)}</div>
   <small className="pi-acervo-nota">{tipo==='selecao'?'As marcas internacionais seguem os critérios de jogos da seleção principal nas fontes citadas.':'O critério de contabilização do clube pode incluir amistosos.'} Os números acima não são somados aos jogadores deste universo.</small>
  </section>}
  {tipo==='clube'&&acervo?.marcos?.length>0&&<details className="pi-acervo" aria-label={'Marcos históricos documentados · '+nome}>
   <summary>Marcos reais do clube · {acervo.marcos.length} registros</summary>
   <ol className="pi-marcos-reais">{acervo.marcos.map((m,i)=><li key={(m.ano||'s-data')+'-'+i}>
    <strong>{m.ano||'Data não especificada'} · {m.titulo}</strong>
    <small>{m.descricao}</small>
    <a href={m.fonte} target="_blank" rel="noopener noreferrer">Fonte histórica</a>
   </li>)}</ol>
  </details>}
  {tipo==='selecao'&&acervo?.titulos?.length>0&&<details className="pi-acervo" aria-label={'Títulos históricos da seleção '+nome}>
   <summary>Títulos históricos documentados · {acervo.titulos.length} conquistas</summary>
   <p className="pi-acervo-titulos">{acervo.titulos.map(t=>`${t.ano} · ${t.competicao}`).join('  |  ')}</p>
  </details>}
  {tipo==='clube'&&!acervo&&<p className="pi-acervo-nota">Esta equipe já consta do catálogo do jogo. As estatísticas históricas reais ainda estão em pesquisa e não serão substituídas por estimativas.</p>}
  {tipo==='selecao'&&acervo&&!acervo.atletas.length&&<p className="pi-acervo-nota">Recordes individuais reais desta seleção ainda não apurados. A carreira continua registrando seus próprios recordes normalmente.</p>}
  {lendas.length>0&&<div className="pi-hall" aria-label="Lendas antes deste save"><span>Hall da fama · antes deste save</span><p>{lendas.join(' · ')}</p></div>}
  <details className="pi-como"><summary>Como a afeição da torcida é calculada</summary>
   <p>{tipo==='selecao'?'Jogos, gols, assistências e títulos pela seleção nos torneios simulados.':'Tempo de casa, títulos, gols e assistências, gols em clássicos, jogos e despedida no clube. Para o seu jogador, o vínculo com a torcida também conta. Trocar o clube por um rival clássico derruba a afeição.'} Lenda: 75+ · Ídolo: 55+ · Favorito: 35+.</p>
  </details>
 </section>;
}
