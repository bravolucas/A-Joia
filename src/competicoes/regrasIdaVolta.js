/** Regulamento por competição e fase; não aplicar gol fora como desempate. */
export function temIdaVolta({nome='',ano=2026,tamanho=2,preContinental=false}={}){
 const n=String(nome).toLowerCase();
 if(/copa do mundo|mundial|seleç|selec|supercopa|recopa/.test(n))return false;
 if(/copa do brasil/.test(n)){
  // REC da CBF 2026: fases 5 a 8, desde 32 equipes até semifinal.
  if(ano>=2026)return [32,16,8,4].includes(tamanho);
  return tamanho>2&&tamanho<=16;
 }
 if(/libertadores|sul-americana|sudamericana|champions league|europa league|conference league/.test(n))
   return tamanho>2||preContinental;
 return false;
}
