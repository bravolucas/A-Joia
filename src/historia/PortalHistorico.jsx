import React,{useEffect,useState} from 'react';
import {EVENTO_ENTIDADE} from './navegacaoEntidades.js';
import {HistoriaDialog} from './HistoriaFutebol.jsx';

/** Um único ponto de entrada para nomes clicados fora do Arquivo Vivo. */
export default function PortalHistorico({c,temporadas}) {
 const [destino,setDestino]=useState(null);
 useEffect(()=>{
  const ouvir=event=>{
   // Um Arquivo Vivo já aberto gerencia internamente os links e a pilha.
   if(document.querySelector('dialog.hf-dialog[open]'))return;
   if(event.detail)setDestino(event.detail);
  };
  window.addEventListener(EVENTO_ENTIDADE,ouvir);
  return ()=>window.removeEventListener(EVENTO_ENTIDADE,ouvir);
 },[]);
 if(!c||!destino)return null;
 return <HistoriaDialog key={destino.tipo+'|'+destino.id+'|'+destino.nome}
  c={c} temporadas={temporadas||c.temporadas} entradaInicial={destino}
  onFechar={()=>setDestino(null)}/>;
}
