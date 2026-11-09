import React from 'react';
import CenaPenaltis from '../treinador/CenaPenaltis.jsx';
import {desfechoCobranca,ladoGoleiroCobranca} from '../comum/desfechoCobranca.js';
const zonas=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]];
export default function PenaltiJogavel({res,goleiro,onZona}){
 const desfecho=desfechoCobranca(res);
 return <div className="penalti-jogavel" data-resultado-cobranca={desfecho||'preparacao'}>
  <CenaPenaltis animar={!!res} resultado={!!res} desfecho={desfecho} lado={ladoGoleiroCobranca(res)}/>
  {!res&&<svg className="penalti-alvos" viewBox="0 0 300 210" aria-label={goleiro?'Gol: escolha para onde pular':'Gol: escolha onde bater'} role="group">
   {zonas.map(([col,lin],i)=><g key={i} role="button" tabIndex={0} aria-label={`${lin===0?'Alto':'Baixo'} ${['esquerda','meio','direita'][col]}`} onClick={()=>onZona(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onZona(i);}}}>
    <rect x={120+col*55} y={48+lin*34} width="54" height="33" rx="4" fill="#081b12aa" stroke="#ebd797" strokeWidth=".8"/>
    <circle cx={147+col*55} cy={64+lin*34} r="3" fill="#f0d588"/>
   </g>)}
  </svg>}
 </div>;
}
