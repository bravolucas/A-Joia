/** Jogos efetivos, sem contar o placar agregado como uma terceira partida. */
export function jogosDaCampanha(campanha) {
  const grupos=campanha.grupos?.length
    ? campanha.grupos.flatMap(g=>(g.jogos||[]).map(j=>({...j,fase:j.fase||g.grupo||'Fase de grupos'})))
    : (campanha.jogosLiga||[]).map(j=>({...j,fase:j.fase||'Fase de grupos'}));
  const mata=(campanha.fases||[]).flatMap(f=>(f.jogos||[]).flatMap(j=>
    (j.partidas?.length?j.partidas:[j]).map(p=>({...p,fase:p.fase||j.fase||f.fase}))));
  return [...grupos,...mata];
}
