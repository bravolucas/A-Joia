import React from 'react';
import PersonagemCinematico from './PersonagemCinematico.jsx';
import {TONS_PELE,normalizarAparencia} from './aparenciaCinematica.js';
export default function SeletorAparencia({valor,onChange}){
 const visual=normalizarAparencia(valor);
 return <details className="mt-3 rounded-lg border border-blue-400/30 bg-slate-900 p-3">
  <summary className="cursor-pointer text-sm font-semibold text-blue-200">Personalizar aparência</summary>
  <div className="grid grid-cols-[minmax(72px,1fr)_minmax(0,2fr)] gap-2 items-center mt-2">
   <PersonagemCinematico pose="neutro" aparencia={visual} className="retrato-aparencia-completo" style={{width:'100%',height:148}}/>
   <fieldset className="min-w-0"><legend className="text-xs mb-2 text-slate-300">Tom de pele</legend>
    <div className="grid grid-cols-2 gap-1">{TONS_PELE.map(t=><button type="button" key={t.id} aria-pressed={visual.tom===t.id} onClick={()=>onChange(normalizarAparencia({tom:t.id}))} className={'rounded-md border p-1 text-[10px] flex flex-col items-center gap-1 '+(visual.tom===t.id?'border-blue-300 bg-blue-950':'border-slate-700 bg-slate-950')}><i aria-hidden="true" style={{background:t.cor,width:20,height:20,borderRadius:'50%'}}/>{t.nome}</button>)}</div>
    <p className="text-[10px] text-slate-400 mt-2">Variação do modelo atual, sem efeito nos atributos.</p>
   </fieldset>
  </div>
 </details>;
}
