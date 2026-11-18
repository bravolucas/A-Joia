/**
 * Regulamentos reais por competição, fase e edição.
 * tamanho = número de equipes na chave desta rodada (2 = final).
 * Não aplicamos a antiga regra de gols marcados fora de casa.
 * Copas não cadastradas ficam em partida única até que seu regulamento seja definido.
 */
const normalizar = nome => String(nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const conhecido = n => /copa do brasil|copa del rey|copa do rei|coppa italia|copa da italia|taca de portugal|libertadores|sul-americana|sudamericana|champions league|europa league|conference league|concacaf.*(champions|campeones|campeoes)|afc champions|afc challenge|recopa|supercopa|copa do mundo|mundial|intercontinental|selecao|selecoes|copa argentina|fa cup|dfb.pokal|coupe de france|knvb beker|turkiye kupasi|king.s cup|mls cup|copa sao paulo/i.test(n);

export const regulamentoConhecidoIdaVolta = nome => conhecido(normalizar(nome));

export function temIdaVolta({nome='',ano=2026,tamanho=2,preContinental=false}={}){
 const n=normalizar(nome);
 const fase=Number(tamanho),edicao=Number(ano)||2026;
 if(!Number.isFinite(fase)||fase<2)return false;

 // CONMEBOL Recopa tem ida e volta mesmo sendo uma final entre dois clubes.
 if(/recopa (sul.americana|sudamericana)|conmebol recopa/.test(n))return fase===2;
 if(/copa do mundo|mundial|intercontinental|selecao|selecoes|supercopa|recopa/.test(n))return false;

 if(/copa do brasil/.test(n)){
  // CBF 2026: 5ª até 8ª fases em ida/volta, final única.
  // Edições anteriores recentes: a partir da 3ª fase, inclusive final.
  return edicao>=2026?[32,16,8,4].includes(fase):[32,16,8,4,2].includes(fase);
 }
 if(/copa del rey|copa do rei|coppa italia|copa da italia/.test(n))return fase===4;
 // Na edição 2026/27 a Taça de Portugal passou a ter semifinal única.
 if(/taca de portugal/.test(n))return edicao<=2026&&fase===4;

 // AFC Champions League Elite: oitavas em ida/volta; quartas em diante
 // são disputadas em fase final centralizada, em jogos únicos.
 if(/afc champions league elite/.test(n))return fase===16;
 if(/afc champions league two|afc challenge league/.test(n))return fase>2;
 if(/afc champions league/.test(n))return fase>2;

 // Concacaf Champions Cup: 1ª rodada, oitavas, quartas e semis em 2 jogos.
 if(/concacaf.*(champions|campeones|campeoes)/.test(n))return fase>2;

 // CONMEBOL e UEFA: eliminatórias em dois jogos, final única.
 if(/libertadores|sul-americana|sudamericana|champions league|europa league|conference league/.test(n))
  return fase>2||(preContinental&&fase===2);

 // Copas nacionais restantes cadastradas são em confronto único no motor.
 return false;
}
