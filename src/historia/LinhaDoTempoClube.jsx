import React from 'react';
import LinkEntidade from './LinkEntidade.jsx';
import './LinhaDoTempoClube.css';

/**
 * Linha do tempo do clube: gráfico da colocação na liga temporada a temporada
 * (1º no topo, troféus marcados) e, para cada ano, técnico, artilheiro, títulos
 * e o que mudou no clube.
 */
export default function LinhaDoTempoClube({historico=[]}){
 const anos=historico.filter(h=>Number.isFinite(h.ano));
 if(!anos.length)return <p className="hf-vazio">A linha do tempo será registrada a partir da primeira temporada concluída.</p>;
 const comPos=anos.filter(h=>Number.isFinite(h.posicao));
 const maxTotal=Math.max(20,...comPos.map(h=>h.total||20));
 const L=1000,A=150,m={x:40,y:14},w=L-2*m.x,h=A-2*m.y,pct=(v,t)=>Math.round(v/t*1000)/10;
 const x=i=>m.x+(anos.length===1?w/2:i*w/(anos.length-1)),y=p=>m.y+((p-1)/Math.max(1,maxTotal-1))*h;
 const pontos=anos.map((s,i)=>Number.isFinite(s.posicao)?[x(i),y(s.posicao),s]:null);
 const caminho=pontos.filter(Boolean).map(([px,py],i)=>`${i?'L':'M'}${px},${py}`).join(' ');
 return <div className="lt-linha">
  <div className="lt-grafico" role="img" aria-label={`Colocação do clube por temporada: ${comPos.map(s=>`${s.ano} ${s.posicao}º`).join(', ')}`}>
   <div className="lt-area">
    {[1,Math.round(maxTotal/2),maxTotal].map(p=><span key={p} className="lt-guia-h" style={{top:`${pct(y(p),A)}%`}}><em>{p}º</em></span>)}
    <svg viewBox={`0 0 ${L} ${A}`} preserveAspectRatio="none" aria-hidden="true"><path d={caminho} className="lt-caminho" vectorEffect="non-scaling-stroke"/></svg>
    {pontos.map((pt,i)=>pt&&<i key={i} className={pt[2].titulos?.length?'lt-ponto lt-titulo':pt[2].posicao===1?'lt-ponto lt-campeao':'lt-ponto'} style={{left:`${pct(pt[0],L)}%`,top:`${pct(pt[1],A)}%`}} title={`${pt[2].ano}: ${pt[2].posicao}º${pt[2].titulos?.length?` · ${pt[2].titulos.join(', ')}`:''}`}/>)}
   </div>
   <div className="lt-anos">{anos.map((s,i)=><span key={s.ano} style={{left:`${pct(x(i),L)}%`}}>{s.ano}</span>)}</div>
  </div>
  <ol className="lt-temporadas">{[...anos].reverse().map(s=><li key={s.ano}>
   <b className="lt-ano-forte">{s.ano}</b>
   <span className="lt-pos">{Number.isFinite(s.posicao)?`${s.posicao}º${s.total?` de ${s.total}`:''}`:'—'}{s.movimento&&<em className={`lt-mov lt-${s.movimento}`}>{s.movimento==='acesso'?'Acesso':s.movimento==='rebaixamento'?'Rebaixado':s.movimento}</em>}</span>
   <span className="lt-detalhes">
    {s.tecnico&&<small>Técnico: <b>{s.tecnico}</b></small>}
    {s.artilheiro&&<small>Artilheiro: <b>{s.artilheiro.id!=null&&s.artilheiro.id!=='voce'?<LinkEntidade tipo="jogador" id={String(s.artilheiro.id)} nome={s.artilheiro.nome}/>:s.artilheiro.nome}</b> · {s.artilheiro.gols} gols</small>}
    {s.titulos?.length>0&&<small className="lt-tacas">🏆 {s.titulos.map((t,i)=><React.Fragment key={t+i}>{i?' · ':''}<LinkEntidade tipo="competicao" nome={t}/></React.Fragment>)}</small>}
    {s.motivos?.length>0&&<small className="lt-motivos">{s.motivos.join(' · ')}</small>}
   </span>
   {Number.isFinite(s.forca)&&<span className="lt-forca" title="Força do elenco">{Number.isFinite(s.forcaAntes)?`${s.forcaAntes} → `:''}{s.forca}</span>}
  </li>)}</ol>
 </div>;
}
