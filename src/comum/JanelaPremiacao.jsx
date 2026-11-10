import React from 'react';
import {PopupOverlay,Card,Button} from './components.jsx';
import './JanelaPremiacao.css';

/** Conteúdo rolável, ação sempre fora da rolagem: inclusive em celular deitado. */
export default function JanelaPremiacao({etapa,onContinuar,celebracao,children}) {
 return <PopupOverlay titulo="Premiação da temporada"><Card key={etapa} className="premiacao-completa border-amber-500/40">
  {celebracao}
  <div className="premiacao-etapas flex justify-center gap-1 mb-3" aria-label={`Etapa ${etapa+1} de 3`}>{[0,1,2].map(i=><div key={i} className={`h-1 w-8 rounded-full ${i<=etapa?'bg-amber-400':'bg-zinc-800'}`}/>)}</div>
  <div className="premiacao-corpo animate-[popIn_0.3s_ease-out]">{children}</div>
  <footer className="premiacao-acoes"><Button onClick={onContinuar}>{etapa<2?'Próximo':'Continuar'}</Button></footer>
 </Card></PopupOverlay>;
}
