import React,{useEffect,useMemo,useState} from 'react';
import {Escudo} from './uiTreinador.jsx';
import './SorteioCopa.css';

const CHAVE_VISTOS='a-joia:sorteios-vistos';
const lerVistos=()=>{try{return new Set(JSON.parse(localStorage.getItem(CHAVE_VISTOS)||'[]'));}catch{return new Set();}};
/** Identifica um sorteio de uma campanha (temporada + competição + fase). */
export const chaveSorteio=(c,s)=>`${c.seed}|${c.ano}|${c.nome}|${s.id}`;
export function sorteioVisto(c,s){return lerVistos().has(chaveSorteio(c,s));}
export function marcarSorteioVisto(c,s){try{const v=[...lerVistos(),chaveSorteio(c,s)].slice(-300);localStorage.setItem(CHAVE_VISTOS,JSON.stringify(v));}catch{/* armazenamento indisponível: o sorteio volta a aparecer, sem prejuízo */}}
/** Sorteio a exibir antes da próxima decisão: o mais recente ainda não visto. */
const sorteiosDesligados=()=>{try{return localStorage.getItem('a-joia:pular-sorteios')==='1';}catch{return false;}};
export function sorteioPendente(c){
 if(!c||c.resultado||c.fase==='fim'||sorteiosDesligados())return null;
 const s=(c.sorteios||[]).at(-1);
 return s&&!sorteioVisto(c,s)?s:null;
}

/** Sequência de "bolinhas" retiradas no sorteio, na ordem em que aparecem. */
function passos(s,usuario){
 if(s.tipo==='grupos')return s.potes.flatMap((pote,p)=>pote.map(nome=>({nome,pote:p,grupo:s.grupos.find(g=>g.times.includes(nome))?.letra}))).sort((a,b)=>a.pote-b.pote||a.grupo.localeCompare(b.grupo));
 if(s.tipo==='liga')return s.adversarios.map(a=>({...a,usuario}));
 return s.confrontos.map((par,i)=>({par,i}));
}

export default function SorteioCopa({campanha:c,sorteio:s,onConcluir}){
 const lista=useMemo(()=>passos(s,c.usuario),[s,c.usuario]);
 const reduzir=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const [n,setN]=useState(reduzir?lista.length:0);
 const terminou=n>=lista.length;
 useEffect(()=>{if(terminou)return;const t=setTimeout(()=>setN(x=>x+1),s.tipo==='grupos'?260:520);return ()=>clearTimeout(t);},[n,terminou,s.tipo]);
 const revelados=lista.slice(0,n),atual=!terminou?lista[n]:null;
 const concluir=()=>{marcarSorteioVisto(c,s);onConcluir?.();};
 return <section className="sct" aria-label={s.titulo}>
  <header className="sct-topo"><small>{c.nome} · {c.ano}</small><h3>{s.titulo}</h3>
   <p>{s.tipo==='grupos'?c.tipo==='copaMundo'?'Potes e confederações: uma seleção por confederação por grupo, com até duas europeias.':'Potes pelo ranking do torneio. Clubes do mesmo país não caem no mesmo grupo.':s.tipo==='liga'?'Dois adversários de cada pote, sem rivais do mesmo país. Metade dos jogos em casa.':s.sementes?'Os cabeças de chave esperam o vencedor de cada confronto nas oitavas.':'Confrontos sorteados. A chave segue até a final.'}</p></header>
  <div className="sct-urna" aria-live="polite">{atual?<><i className="sct-bola" key={n}/><span>{s.tipo==='confrontos'?`Confronto ${n+1}`:s.tipo==='liga'?`Pote ${atual.pote}`:`Pote ${atual.pote+1}`}</span></>:<span>Sorteio concluído</span>}</div>
  {s.tipo==='grupos'&&<div className="sct-grupos">{s.grupos.map(g=>{const meu=g.times.includes(c.usuario);return <div key={g.letra} className={meu?'sct-grupo sct-meu':'sct-grupo'}><b>Grupo {g.letra}</b>{g.times.map(nome=>{const x=revelados.find(r=>r.nome===nome);return <span key={nome} className={x?'sct-entrou':'sct-vazio'}>{x?<><Escudo nome={nome} size={18}/>{nome}</>:'—'}</span>;})}</div>;})}</div>}
  {s.tipo==='liga'&&<><div className="sct-potes">{s.potes.map((pote,i)=><div key={i}><b>Pote {i+1}</b><span>{pote.length} clubes</span></div>)}</div>
   <ol className="sct-adversarios">{revelados.map(a=><li key={a.nome}><small>Pote {a.pote}</small><Escudo nome={a.nome} size={22}/><strong>{a.nome}</strong><em>{a.casa?'em casa':'fora'}</em></li>)}</ol></>}
  {s.tipo==='confrontos'&&<ol className="sct-confrontos">{revelados.map(({par,i})=><li key={i}>
   <span className={par.includes(c.usuario)?'sct-meu':''}><Escudo nome={par[0]} size={20}/>{par[0]||'—'}<i>×</i>{par[1]?<><Escudo nome={par[1]} size={20}/>{par[1]}</>:'avança direto'}</span>
   {s.sementes?.[i]&&<small>Vencedor enfrenta {s.sementes[i]}</small>}</li>)}</ol>}
  <footer className="sct-rodape">{!terminou&&<button className="ct-secondary" onClick={()=>setN(lista.length)}>Pular sorteio</button>}<button className="ct-primary" disabled={!terminou} onClick={concluir}>{terminou?'Continuar':'Sorteando…'}</button></footer>
 </section>;
}
