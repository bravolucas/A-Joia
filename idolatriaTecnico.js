import { CLASSICOS } from './data.js';
export function vinculoAtivoTecnico(t,clube){
 const v=t?.vinculosJogador?.find(v=>v.clube===clube);
 return v&&(t.rupturasIdolo||[]).some(r=>r.clube===clube)?{...v,idolatria:false}:v;
}
export function riscosIdolatriaTecnico(t,destino){
 return (t?.vinculosJogador||[]).filter(v=>v.clube!==destino&&vinculoAtivoTecnico(t,v.clube)?.idolatria&&CLASSICOS.some(par=>Array.isArray(par)&&par.includes(v.clube)&&par.includes(destino)));
}
export function registrarRupturasTecnico(t,destino){
 return [...(t.rupturasIdolo||[]),...riscosIdolatriaTecnico(t,destino).map(v=>({clube:v.clube,rival:destino,ano:t.ano}))];
}
