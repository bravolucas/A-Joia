/** Regulamento por competição e fase; não aplicar gol fora como desempate. */
export function temIdaVolta({nome='',ano=2026,tamanho=2,preContinental=false}={}){
 const n=String(nome).toLowerCase();
 if(/copa do mundo|mundial|seleç|selec|supercopa|recopa/.test(n))return false;
 if(/copa do brasil/.test(n)){
  // REC da CBF 2026: fases 5 a 8, desde 32 equipes até semifinal.
  if(ano>=2026)return [32,16,8,4].includes(tamanho);
  return tamanho>2&&tamanho<=16;
 }
 // Copa del Rey 2025/26 e 2026/27: somente as semifinais são em dois jogos.
 if(/copa del rey|copa do rei/.test(n))return tamanho===4;
 // Coppa Italia: semifinais em duas mãos, demais fases e final em jogo único.
 if(/coppa italia|copa da it[aá]lia/.test(n))return tamanho===4;
 // Taça de Portugal: mudança a partir da edição 2026/27 (final em 2027).
 if(/ta[çc]a de portugal/.test(n))return Number(ano)<=2026&&tamanho===4;
 if(/libertadores|sul-americana|sudamericana|champions league|europa league|conference league/.test(n))
   return tamanho>2||preContinental;
 return false;
}
