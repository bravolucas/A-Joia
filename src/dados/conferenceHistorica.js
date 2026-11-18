/**
 * Campeões oficiais da UEFA Conference League, por ANO da final.
 * A prova começou em 2021/22, com a primeira final em 2022.
 * Fonte: https://www.uefa.com/uefaconferenceleague/news/02a5-20ba66bce46d-a5d5586eeda6-1000--which-teams-have-won-the-conference-league/
 * 2026: https://www.uefa.com/uefaconferenceleague/news/029c-1e9ad66c8169-aaecb38941a7-1000--202526-conference-league-all-the-league-phase-fixtures/
 * Referência verificada em 18/11/2026; a edição 2026/27 não terminou.
 * Nomes de clube alinhados ao catálogo A JOIA quando jogáveis.
 */
const POR_ANO=Object.freeze({
  2022:'Roma',
  2023:'West Ham',
  2024:'Olympiacos',
  2025:'Chelsea',
  2026:'Crystal Palace',
});
export const ULTIMO_ANO_CONFERENCE_HISTORICO=2026;
export const HISTORICO_CONFERENCE=Object.freeze(Object.entries(POR_ANO)
 .map(([ano,clube])=>Object.freeze({
  ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})]),
 })).sort((a,b)=>b.ano-a.ano));
const totais=new Map();
for(const {campeoes} of HISTORICO_CONFERENCE)
 for(const {clube,quantidade} of campeoes)
  totais.set(clube,(totais.get(clube)||0)+quantidade);
export const TOTAIS_CONFERENCE_HISTORICOS=Object.freeze(Object.fromEntries(totais));
export const totalConferenceHistoricas=clube=>TOTAIS_CONFERENCE_HISTORICOS[clube]||0;
