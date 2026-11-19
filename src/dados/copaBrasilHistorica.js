/**
 * Campeões reais da Copa do Brasil, 1989–2025.
 * A edição 2026 ainda não foi concluída em 18/11/2026 e não possui vencedor.
 * Uma entrada = um título real por ano; NÃO são conquistas simuladas.
 *
 * Fonte principal (relaciona as 37 finais, fonte CBF): 
 * https://ge.globo.com/mg/futebol/copa-do-brasil/noticia/2025/12/21/maiores-campeoes-da-copa-do-brasil-corinthians-leva-o-tetra-e-sobe-no-ranking.ghtml
 * Confirmação 2025 pela organizadora:
 * https://www.cbf.com.br/futebol-brasileiro/noticias/undefined/sport-recife-x-palmeiras/corinthians-vence-vasco-e-conquista-seu-quarto-titulo-da-copa-do-brasil
 *
 * Identidade de clubes segue o cadastro do A JOIA; Santo André e
 * Paulista permanecem registrados mesmo que não sejam clubes jogáveis.
 */
const POR_ANO=Object.freeze({
  1989:'Grêmio',
  1990:'Flamengo',
  1991:'Criciúma',
  1992:'Internacional',
  1993:'Cruzeiro',
  1994:'Grêmio',
  1995:'Corinthians',
  1996:'Cruzeiro',
  1997:'Grêmio',
  1998:'Palmeiras',
  1999:'Juventude',
  2000:'Cruzeiro',
  2001:'Grêmio',
  2002:'Corinthians',
  2003:'Cruzeiro',
  2004:'Santo André',
  2005:'Paulista',
  2006:'Flamengo',
  2007:'Fluminense',
  2008:'Sport Recife',
  2009:'Corinthians',
  2010:'Santos',
  2011:'Vasco da Gama',
  2012:'Palmeiras',
  2013:'Flamengo',
  2014:'Atlético-MG',
  2015:'Palmeiras',
  2016:'Grêmio',
  2017:'Cruzeiro',
  2018:'Cruzeiro',
  2019:'Athletico-PR',
  2020:'Palmeiras',
  2021:'Atlético-MG',
  2022:'Flamengo',
  2023:'São Paulo',
  2024:'Flamengo',
  2025:'Corinthians',
});

export const ULTIMO_ANO_COPA_BRASIL_HISTORICO=2025;
export const HISTORICO_COPA_BRASIL=Object.freeze(
 Object.entries(POR_ANO)
 .map(([ano,clube])=>Object.freeze({
  ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})]),
 }))
 .sort((a,b)=>b.ano-a.ano),
);
const totais=new Map();
for(const {campeoes} of HISTORICO_COPA_BRASIL)
 for(const {clube,quantidade} of campeoes)
  totais.set(clube,(totais.get(clube)||0)+quantidade);
export const TOTAIS_COPA_BRASIL_HISTORICOS=Object.freeze(Object.fromEntries(totais));
export const totalCopaBrasilHistoricas=clube=>TOTAIS_COPA_BRASIL_HISTORICOS[clube]||0;
