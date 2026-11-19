/**
 * Campeões reais da Copa dos Campeões Europeus / Champions League.
 * Ano é o da FINAL (1956–2026), não o da abertura da temporada.
 * 1956–1992: Taça dos Clubes Campeões Europeus; desde 1993: Champions League.
 * Dados estáticos de referência; não são eventos salvos pelo jogo.
 *
 * Fontes verificadas em 18/11/2026:
 * UEFA: https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--all-time-european-cup-honours-board/
 * RSSSF (anuário de finais): https://www.rsssf.org/ec/ec1stats.html
 * UEFA (final 2026): https://www.uefa.com/uefachampionsleague/news/02a5-20c02e59f219-15e92acdc717-1000/
 *
 * Nomes seguem o catálogo A JOIA (PSG, Inter de Milão, Bayern de Munique).
 * Clubes históricos sem elenco jogável continuam no acervo.
 * A edição 2026/27 não terminou: NUNCA adicionar campeão de 2027
 * antes de confirmação oficial.
 */
const POR_ANO=Object.freeze({
  1956:'Real Madrid',
  1957:'Real Madrid',
  1958:'Real Madrid',
  1959:'Real Madrid',
  1960:'Real Madrid',
  1961:'Benfica',
  1962:'Benfica',
  1963:'Milan',
  1964:'Inter de Milão',
  1965:'Inter de Milão',
  1966:'Real Madrid',
  1967:'Celtic',
  1968:'Manchester United',
  1969:'Milan',
  1970:'Feyenoord',
  1971:'Ajax',
  1972:'Ajax',
  1973:'Ajax',
  1974:'Bayern de Munique',
  1975:'Bayern de Munique',
  1976:'Bayern de Munique',
  1977:'Liverpool',
  1978:'Liverpool',
  1979:'Nottingham Forest',
  1980:'Nottingham Forest',
  1981:'Liverpool',
  1982:'Aston Villa',
  1983:'Hamburger SV',
  1984:'Liverpool',
  1985:'Juventus',
  1986:'Steaua Bucareste',
  1987:'Porto',
  1988:'PSV',
  1989:'Milan',
  1990:'Milan',
  1991:'Estrela Vermelha',
  1992:'Barcelona',
  1993:'Marseille',
  1994:'Milan',
  1995:'Ajax',
  1996:'Juventus',
  1997:'Borussia Dortmund',
  1998:'Real Madrid',
  1999:'Manchester United',
  2000:'Real Madrid',
  2001:'Bayern de Munique',
  2002:'Real Madrid',
  2003:'Milan',
  2004:'Porto',
  2005:'Liverpool',
  2006:'Barcelona',
  2007:'Milan',
  2008:'Manchester United',
  2009:'Barcelona',
  2010:'Inter de Milão',
  2011:'Barcelona',
  2012:'Chelsea',
  2013:'Bayern de Munique',
  2014:'Real Madrid',
  2015:'Barcelona',
  2016:'Real Madrid',
  2017:'Real Madrid',
  2018:'Real Madrid',
  2019:'Liverpool',
  2020:'Bayern de Munique',
  2021:'Chelsea',
  2022:'Real Madrid',
  2023:'Manchester City',
  2024:'Real Madrid',
  2025:'PSG',
  2026:'PSG',
});

export const ULTIMO_ANO_CHAMPIONS_HISTORICO=2026;
export const HISTORICO_CHAMPIONS=Object.freeze(
 Object.entries(POR_ANO)
 .map(([ano,clube])=>Object.freeze({
  ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})]),
 }))
 .sort((a,b)=>b.ano-a.ano),
);
const totais=new Map();
for(const {campeoes} of HISTORICO_CHAMPIONS)
 for(const {clube,quantidade} of campeoes)
  totais.set(clube,(totais.get(clube)||0)+quantidade);
export const TOTAIS_CHAMPIONS_HISTORICOS=Object.freeze(Object.fromEntries(totais));
export const totalChampionsHistoricas=clube=>TOTAIS_CHAMPIONS_HISTORICOS[clube]||0;
