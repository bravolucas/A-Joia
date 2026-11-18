import React,{useState} from 'react';
import {HistoriaDialog} from './HistoriaFutebol.jsx';

/**
 * Link interno do A JOIA: usa o identificador persistente do atleta, nunca
 * o nome como chave. Não abandona o save nem recarrega a página.
 */
export default function LinkEntidade({c,temporadas,tipo,id,nome,children,className='',title}){
 const [aberto,A]=useState(false);
 const valor=id==null?'':String(id).trim();
 if(!c||!valor)return <span className={className}>{children??nome??'—'}</span>;
 const rotulo=String(nome||valor);
 return <>
  <button type="button" className={'ajoia-entity-link '+className}
   title={title||'Abrir perfil de '+rotulo}
   aria-label={'Abrir perfil de '+rotulo}
   onClick={e=>{e.stopPropagation();A(true);}}>
   {children??nome??valor}
  </button>
  {aberto&&<HistoriaDialog c={c} temporadas={temporadas} rotaInicial={{tipo,id:valor}} onFechar={()=>A(false)}/>}
 </>;
}
