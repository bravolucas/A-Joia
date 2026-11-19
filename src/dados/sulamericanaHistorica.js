/**
 * Copa Sul-Americana: campeões reais por edição (2002–2025).
 * Dados de referência; não são resultados de carreiras simuladas.
 * O título de 2016 foi concedido à Chapecoense, sem disputa da final.
 * Clubes não jogáveis permanecem no histórico (ex.: Pachuca, Cienciano).
 *
 * Fontes consultadas em 18/11/2026:
 * https://ge.globo.com/mg/futebol/copa-sul-americana/noticia/2025/11/22/todos-os-campeoes-da-copa-sul-americana-veja-lista.ghtml
 * https://www.fff.fr/626-palmares-copa-sudamericana.html
 * https://www1.folha.uol.com.br/esporte/2025/11/confira-a-lista-com-todos-os-campeoes-da-copa-sul-americana.shtml
 *
 * A edição de 2026 não tem campeão registrado neste acervo: nunca
 * inferir seu vencedor a partir de partidas ou saves do jogo.
 */
const POR_ANO=Object.freeze({
  2002:'San Lorenzo',2003:'Cienciano',2004:'Boca Juniors',
  2005:'Boca Juniors',2006:'Pachuca',2007:'Arsenal de Sarandí',
  2008:'Internacional',2009:'LDU de Quito',2010:'Independiente',
  2011:'Universidad de Chile',2012:'São Paulo',2013:'Lanús',
  2014:'River Plate',2015:'Independiente Santa Fe',2016:'Chapecoense',
  2017:'Independiente',2018:'Athletico-PR',2019:'Independiente del Valle',
  2020:'Defensa y Justicia',2021:'Athletico-PR',
  2022:'Independiente del Valle',2023:'LDU de Quito',
  2024:'Racing Club',2025:'Lanús',
});

export const ULTIMO_ANO_SULAMERICANA_HISTORICO=2025;
export const HISTORICO_SULAMERICANA=Object.freeze(
  Object.entries(POR_ANO)
    .map(([ano,clube])=>Object.freeze({
      ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})]),
    }))
    .sort((a,b)=>b.ano-a.ano),
);
const totais=new Map();
for(const {campeoes} of HISTORICO_SULAMERICANA)
  for(const {clube,quantidade} of campeoes)totais.set(clube,(totais.get(clube)||0)+quantidade);
export const TOTAIS_SULAMERICANA_HISTORICOS=Object.freeze(Object.fromEntries(totais));
export const totalSulAmericanaHistoricas=clube=>TOTAIS_SULAMERICANA_HISTORICOS[clube]||0;
