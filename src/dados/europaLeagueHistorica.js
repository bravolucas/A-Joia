/**
 * Campeões reais da Copa da UEFA / Europa League (1972–2026).
 * Inclui ambas as denominações, SEM a Copa das Cidades com Feiras.
 * Ano corresponde à final, não ao início da temporada.
 * Jogos e saves não são mutados pelos dados.
 *
 * Fontes (18/11/2026):
 * UEFA: https://www.uefa.com/uefaeuropaleague/news/0275-152d42886a65-efc6ff0e2d60-1000--which-teams-have-won-the-europa-league/
 * RSSSF: https://www.rsssf.org/ec/ec3stats.html
 * UEFA final 2026: https://www.uefa.com/uefaeuropaleague/news/02a5-20ac3759bba4-7f91e47690b9-1000--freiburg-0-3-aston-villa-brilliant-villans-win-europa-leagu/
 *
 * Nome adaptado ao acervo A JOIA quando já há clube com esse nome.
 * Edição 2026/27 ainda não foi encerrada: não antecipar 2027.
 */
const POR_ANO=Object.freeze({
  1972:'Tottenham',
  1973:'Liverpool',
  1974:'Feyenoord',
  1975:'Borussia Mönchengladbach',
  1976:'Liverpool',
  1977:'Juventus',
  1978:'PSV',
  1979:'Borussia Mönchengladbach',
  1980:'Eintracht Frankfurt',
  1981:'Ipswich Town',
  1982:'IFK Göteborg',
  1983:'Anderlecht',
  1984:'Tottenham',
  1985:'Real Madrid',
  1986:'Real Madrid',
  1987:'IFK Göteborg',
  1988:'Leverkusen',
  1989:'Napoli',
  1990:'Juventus',
  1991:'Inter de Milão',
  1992:'Ajax',
  1993:'Juventus',
  1994:'Inter de Milão',
  1995:'Parma',
  1996:'Bayern de Munique',
  1997:'Schalke 04',
  1998:'Inter de Milão',
  1999:'Parma',
  2000:'Galatasaray',
  2001:'Liverpool',
  2002:'Feyenoord',
  2003:'Porto',
  2004:'Valencia',
  2005:'CSKA Moscou',
  2006:'Sevilla',
  2007:'Sevilla',
  2008:'Zenit São Petersburgo',
  2009:'Shakhtar Donetsk',
  2010:'Atlético de Madrid',
  2011:'Porto',
  2012:'Atlético de Madrid',
  2013:'Chelsea',
  2014:'Sevilla',
  2015:'Sevilla',
  2016:'Sevilla',
  2017:'Manchester United',
  2018:'Atlético de Madrid',
  2019:'Chelsea',
  2020:'Sevilla',
  2021:'Villarreal',
  2022:'Eintracht Frankfurt',
  2023:'Sevilla',
  2024:'Atalanta',
  2025:'Tottenham',
  2026:'Aston Villa',
});
export const ULTIMO_ANO_EUROPA_HISTORICO=2026;
export const HISTORICO_EUROPA_LEAGUE=Object.freeze(
  Object.entries(POR_ANO)
   .map(([ano,clube])=>Object.freeze({
     ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})]),
   }))
   .sort((a,b)=>b.ano-a.ano),
);
const totais=new Map();
for(const {campeoes} of HISTORICO_EUROPA_LEAGUE)
 for(const {clube,quantidade} of campeoes)
  totais.set(clube,(totais.get(clube)||0)+quantidade);
export const TOTAIS_EUROPA_LEAGUE_HISTORICOS=Object.freeze(Object.fromEntries(totais));
export const totalEuropaLeagueHistoricas=clube=>TOTAIS_EUROPA_LEAGUE_HISTORICOS[clube]||0;
