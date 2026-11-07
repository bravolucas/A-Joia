import React,{useEffect,useRef} from 'react';
import {TacaCompeticao} from '../comum/trofeus.jsx';
import './VitrineConquistas.css';
const rotulo=g=>`${g.nome}, ${g.quantidade} ${g.quantidade===1?'título':'títulos'}. Ver histórico`;
function TacaContada({grupo,compacta=false}){
 return <><span className="vc-cup"><TacaCompeticao tipo={grupo.tipo} nome={grupo.nome} size={compacta?48:80}/><b aria-hidden="true">×{grupo.quantidade}</b></span><span className="vc-name">{grupo.nomeCurto||grupo.nome}</span></>;
}
export function ResumoConquistas({grupos,total,onAbrir}){
 return <section className="ct-trophy-shelf vc-shelf" aria-label="Vitrine de conquistas"><button className="vc-shelf-header" aria-label="Ver conquistas como treinador" onClick={()=>onAbrir(null)}>{total?<><strong>{total} {total===1?'título':'títulos'} <span>· {grupos.length} {grupos.length===1?'competição':'competições'}</span></strong><span>Ver todas ↗</span></>:<><span aria-hidden="true">🏆</span><strong>VITRINE VAZIA</strong></>}</button>{total>0&&<><div className="vc-grid vc-compact">{grupos.slice(0,6).map(g=><button key={g.id} aria-label={rotulo(g)} onClick={()=>onAbrir(g.id)}><TacaContada grupo={g} compacta/></button>)}</div>{grupos.length>6&&<button className="vc-more" onClick={()=>onAbrir(null)}>+{grupos.length-6} {grupos.length===7?'competição':'competições'} · Ver vitrine completa</button>}</>}</section>;
}
export default function VitrineConquistas({grupos,total,selecionada,onSelecionar}){
 const raiz=useRef(null),titulo=useRef(null),anterior=useRef(null);
 const grupo=grupos.find(g=>g.id===selecionada);
 useEffect(()=>{
  if(grupo){anterior.current=grupo.id;titulo.current?.focus();}
  else if(anterior.current){[...(raiz.current?.querySelectorAll('[data-conquista]')||[])].find(el=>el.dataset.conquista===anterior.current)?.focus();}
 },[selecionada]);
 const porClube=grupo?[...grupo.conquistas.reduce((m,c)=>m.set(c.clube||'Clube não informado',(m.get(c.clube||'Clube não informado')||0)+1),new Map())].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR')):[];
 return <div className="vc-modal-content" ref={raiz}>{!total?<div className="ct-empty-trophies"><span aria-hidden="true">🏆</span><h3>Vitrine vazia</h3><p>As taças conquistadas na sua carreira aparecerão aqui.</p></div>:grupo?<section className="vc-history" aria-label={`Histórico de ${grupo.nome}`}><button className="vc-back" onClick={()=>onSelecionar(null)}>← Todas as conquistas</button><div className="vc-history-hero"><span className="vc-cup"><TacaCompeticao tipo={grupo.tipo} nome={grupo.nome} size={112}/><b aria-hidden="true">×{grupo.quantidade}</b></span><h3 tabIndex={-1} ref={titulo}>{grupo.nome}</h3><p>{grupo.quantidade} {grupo.quantidade===1?'título conquistado':'títulos conquistados'}</p></div><div className="vc-clubs" aria-label="Títulos por clube">{porClube.map(([clube,n])=><span key={clube}>{clube}<strong>×{n}</strong></span>)}</div><h4>Suas conquistas</h4><ol>{grupo.conquistas.map((c,i)=><li key={`${c.ano}-${c.clube}-${i}`}><strong>{c.ano||'Ano não informado'}</strong><span>{c.clube||'Clube não informado'}</span></li>)}</ol></section>:<><div className="vc-summary"><strong>{total} {total===1?'título':'títulos'}</strong><span>{grupos.length} {grupos.length===1?'competição':'competições'}</span><p>Toque em uma taça para ver anos e clubes.</p></div><div className="vc-grid">{grupos.map(g=><button key={g.id} data-conquista={g.id} aria-label={rotulo(g)} onClick={()=>onSelecionar(g.id)}><TacaContada grupo={g}/></button>)}</div></>}</div>;
}
