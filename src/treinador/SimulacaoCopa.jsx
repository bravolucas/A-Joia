import React from 'react';
import {Escudo} from './uiTreinador.jsx';
import {rotaEstrategiaCopa,resultadoVisualCopa} from './narrativaCopa.js';
export default function SimulacaoCopa({plano,resultado,usuario,estado}){
 const rota=rotaEstrategiaCopa(plano),r=resultadoVisualCopa(resultado,usuario);
 return <div className="cce-simulacao-partida" data-resultado={r?.estado||'aguardando'}>
  <div className="cce-prancheta"><small>MOVIMENTAÇÃO DA EQUIPE</small><svg viewBox="0 0 360 190" aria-label="Circulação tática da equipe" role="img">
   <rect x="12" y="12" width="336" height="166" rx="12" fill="#123b30"/><path d="M25 25H335V165H25ZM180 25V165" fill="none" stroke="#b5d5c5" strokeOpacity=".22"/><circle cx="180" cy="95" r="29" fill="none" stroke="#b5d5c533"/>
   {[[110,50],[205,135],[290,85]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="8" fill="#b96f69" opacity=".75"/>)}
   <path d={rota.path} stroke="#e0cf97" strokeOpacity=".6" strokeWidth="2" strokeDasharray="5 4" fill="none"/>
   {rota.pontos.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="10" fill="#88cfb3"/><circle cx={x} cy={y} r="15" fill="none" stroke="#88cfb333"/></g>)}
   <circle className="cce-bola-tatica" r="5" fill="#fff5d5" stroke="#18392d"><animateMotion dur=".65s" path={rota.path} fill="freeze" additive="replace"/></circle>
  </svg><span>{rota.texto}</span></div>
  {r?<div className={`cce-veredito cce-veredito-${r.estado}`} data-placar={`${r.golsCasa}-${r.golsFora}`}><small>FIM DE JOGO</small><strong>{r.titulo}</strong><div className="cce-veredito-placar"><span><Escudo estado={estado} nome={r.casa} size={27}/><b>{r.casa}</b></span><em>{r.golsCasa} <i>×</i> {r.golsFora}</em><span><Escudo estado={estado} nome={r.fora} size={27}/><b>{r.fora}</b></span></div><p>{r.descricao}</p></div>:<p className="cce-calculando">Simulando a partida…</p>}
 </div>;
}
