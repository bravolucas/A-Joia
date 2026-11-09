import React,{useId} from 'react';
import atlas from '../../arte/colecoes/penaltis.webp';

function Quadro({indice,classe=''}){
 const x=indice%2*3,y=Math.floor(indice/2)*2,id=useId().replace(/:/g,'');
 return <svg className={`cce-penalti-quadro ${classe}`} viewBox={`${x+.008} ${y+.008} 2.984 1.984`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs><clipPath id={id}><rect x={x+.008} y={y+.008} width="2.984" height="1.984"/></clipPath></defs><image clipPath={`url(#${id})`} href={atlas} width="6" height="4" preserveAspectRatio="none"/></svg>;
}
/** A sequência ilustra a decisão; probabilidades e resultado permanecem no motor. */
export default function CenaPenaltis({animar=false,venceu=false,resultado=false}){
 return <div className={`cce-penalti-cena ${animar?'cce-penalti-animada':''}`} data-penalti-cena={animar?'cobranca':resultado?(venceu?'gol':'defesa'):'preparacao'} aria-hidden="true">
  <Quadro indice={resultado&&!animar?(venceu?2:3):animar?1:0} classe="cce-penalti-inicio"/>
  {animar&&<Quadro indice={venceu?2:3} classe="cce-penalti-desfecho"/>}
  <div className="cce-penalti-vinheta"/>
 </div>;
}
