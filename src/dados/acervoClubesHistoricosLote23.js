/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 23 · 24/11/2026.
 * Evidências por clube: AFC, Saudipedia, FIFA e relatório oficial do Al-Wehda.
 * Não presumir totais completos de temporadas de atletas.
 */
const F={
 fayhaHistoria:'https://saudipedia.com/en/al-fayha-club',
 fayhaCopa:'https://www.the-afc.com/en/more/domestic_leagues/news/al_fayha_upset_al_hilal_to_win_historic_saudi_king%E2%80%99s_cup.html',
 fayhaAsia:'https://www.the-afc.com/en/club/afc_champions_league/news/group_a_al_fayha_ksa_v_pakhtakor_fc_uzb_2.html',
 wehdaHistoria:'https://saudipedia.com/en/al-wehda-club',
 wehdaRelatorio:'https://alwehdaclub.sa/new-website-in-progress/public/%D8%A7%D9%84%D8%AA%D9%82%D8%B1%D9%8A%D8%B1%20%D8%A7%D9%84%D8%B3%D9%86%D9%88%D9%8A%20%D9%84%D8%B9%D8%A7%D9%85%202023%20copy.pdf',
 wehdaFinal:'https://www.fifa.com/en/watch/eJGhhylJdEmLhhziIqy2hQ',
};
const atleta=(nome,posicao,periodo,descricao,fonte)=>({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[fonte]});
const marco=(ano,titulo,descricao,fonte)=>({ano,titulo,descricao,fonte:F[fonte]});
const D={
 'Al-Fayha':{
  atletas:[
   atleta('Vladimir Stojković','GOL','2021–2024','Goleiro sérvio decisivo na disputa de pênaltis da Copa do Rei Saudita de 2022.','fayhaCopa'),
   atleta('Abdelhamid Sabiri','MEI','2023–2024','Autor dos dois gols contra o Pakhtakor na primeira vitória do clube na AFC Champions League.','fayhaAsia'),
  ],
  marcos:[
   marco(1953,'Fundação do Al-Fayha','Clube fundado em 1953 e sediado em Al Majmaah.','fayhaHistoria'),
   marco(2022,'Campeão da Copa do Rei Saudita','Primeiro título da Copa do Rei Saudita: 1 a 1 com Al-Hilal e vitória por 3 a 1 nos pênaltis.','fayhaCopa'),
   marco(2023,'Primeira vitória na Champions asiática','Vitória por 2 a 0 sobre o Pakhtakor na fase de grupos, em outubro de 2023.','fayhaAsia'),
  ],
 },
 'Al-Wehda':{
  atletas:[],
  marcos:[
   marco(1947,'Fundação do Al-Wehda','Clube fundado em Meca em 1947.','wehdaHistoria'),
   marco(1957,'Campeão da Copa do Rei Saudita','Primeira conquista histórica da Copa do Rei, segundo relatório anual do próprio clube.','wehdaRelatorio'),
   marco(1966,'Bicampeão da Copa do Rei Saudita','Segundo título histórico da competição, registrado no relatório oficial.','wehdaRelatorio'),
   marco(2023,'Vice-campeão da Copa do Rei Saudita','Empatou a decisão com o Al-Hilal em 1 a 1 e perdeu nos pênaltis por 7 a 6.','wehdaFinal'),
  ],
 },
};
export const ACERVO_CLUBES_LOTE23=Object.freeze(Object.fromEntries(Object.entries(D).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(a=>Object.freeze(a))),
 marcos:Object.freeze(d.marcos.map(m=>Object.freeze(m))),
 recordes:Object.freeze([]),
 tecnicos:Object.freeze([]),
})])));
