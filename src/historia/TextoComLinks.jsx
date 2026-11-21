import React,{createContext,useContext} from 'react';
import LinkEntidade from './LinkEntidade.jsx';
import {segmentarTexto} from './textoComLinks.js';

/* A carreira em jogo, para os textos saberem quais nomes existem neste save. */
const ContextoCarreira=createContext(null);
export const ProvedorLinks=({c,children})=><ContextoCarreira.Provider value={c}>{children}</ContextoCarreira.Provider>;

/** Texto livre com nomes clicáveis: clubes, jogadores, seleções, competições e prêmios.
    Uso: <TextoComLinks texto={frase}/> ou <TextoComLinks>{frase}</TextoComLinks>. */
export default function TextoComLinks({texto,children,c,ignorar,pessoas}) {
 const doContexto=useContext(ContextoCarreira);
 const valor=texto??children;
 if(valor==null||valor===false)return null;
 if(typeof valor!=='string'&&typeof valor!=='number')return <>{valor}</>;
 const partes=segmentarTexto(valor,c||doContexto,{ignorar,pessoas});
 return <>{partes.map((p,i)=>typeof p==='string'?<React.Fragment key={i}>{p}</React.Fragment>
  :<LinkEntidade key={i} tipo={p.tipo} nome={p.nome} id={p.id||undefined}>{p.texto}</LinkEntidade>)}</>;
}
