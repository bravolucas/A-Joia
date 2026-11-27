/**
 * Palmarés mundial de clubes em três competições distintas.
 * Copa Intercontinental clássica (1960–2004), Mundial de Clubes FIFA
 * (2000, 2005–2023 e formato expandido de 2025) e Copa Intercontinental
 * FIFA (desde 2024) nunca têm seus totais somados.
 *
 * O ano identifica a edição oficial, não necessariamente o ano da final:
 * as edições 2020, 2021 e 2022 foram decididas no ano seguinte.
 * A edição FIFA de 2026 segue em disputa; final em 16/12/2026.
 *
 * Fontes:
 * https://www.rsssf.org/tablest/toyota.html
 * https://rsssf.org/tablesf/fifawcc.html
 * https://www.fifa.com/en/tournaments/mens/intercontinentalcup/2026/articles/teams-dates-venues-history
 */
const criarEdicoes = porAno => Object.freeze(Object.entries(porAno)
 .map(([ano,clube])=>Object.freeze({ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})])}))
 .sort((a,b)=>b.ano-a.ano));
const criarTotais = edicoes => {
 const totais=new Map();
 for(const {campeoes} of edicoes)for(const {clube,quantidade} of campeoes)
  totais.set(clube,(totais.get(clube)||0)+quantidade);
 return Object.freeze(Object.fromEntries(totais));
};
// Copa Intercontinental clássica. Não houve edições em 1975 e 1978;
// a final da edição de 1974 foi disputada em março e abril de 1975.
const INTERCONTINENTAL_CLASSICA_POR_ANO=Object.freeze({
 1960:'Real Madrid',1961:'Peñarol',1962:'Santos',1963:'Santos',
 1964:'Inter de Milão',1965:'Inter de Milão',1966:'Peñarol',
 1967:'Racing Club',1968:'Estudiantes',1969:'Milan',1970:'Feyenoord',
 1971:'Nacional',1972:'Ajax',1973:'Independiente',1974:'Atlético de Madrid',
 1976:'Bayern de Munique',1977:'Boca Juniors',1979:'Olimpia',
 1980:'Nacional',1981:'Flamengo',1982:'Peñarol',1983:'Grêmio',
 1984:'Independiente',1985:'Juventus',1986:'River Plate',1987:'Porto',
 1988:'Nacional',1989:'Milan',1990:'Milan',1991:'Estrela Vermelha',
 1992:'São Paulo',1993:'São Paulo',1994:'Vélez Sarsfield',1995:'Ajax',
 1996:'Juventus',1997:'Borussia Dortmund',1998:'Real Madrid',
 1999:'Manchester United',2000:'Boca Juniors',2001:'Bayern de Munique',
 2002:'Real Madrid',2003:'Boca Juniors',2004:'Porto',
});
export const ULTIMO_ANO_COPA_INTERCONTINENTAL=2004;
export const HISTORICO_COPA_INTERCONTINENTAL=criarEdicoes(INTERCONTINENTAL_CLASSICA_POR_ANO);
export const TOTAIS_COPA_INTERCONTINENTAL=criarTotais(HISTORICO_COPA_INTERCONTINENTAL);
export const totalCopaIntercontinentalHistoricas=clube=>TOTAIS_COPA_INTERCONTINENTAL[clube]||0;
// Mundial de Clubes FIFA: 2000, 2005–2023 e o formato expandido de 2025.
const MUNDIAL_CLUBES_FIFA_POR_ANO=Object.freeze({
 2000:'Corinthians',2005:'São Paulo',2006:'Internacional',2007:'Milan',
 2008:'Manchester United',2009:'Barcelona',2010:'Inter de Milão',
 2011:'Barcelona',2012:'Corinthians',2013:'Bayern de Munique',
 2014:'Real Madrid',2015:'Barcelona',2016:'Real Madrid',2017:'Real Madrid',
 2018:'Real Madrid',2019:'Liverpool',2020:'Bayern de Munique',
 2021:'Chelsea',2022:'Real Madrid',2023:'Manchester City',2025:'Chelsea',
});
export const ULTIMO_ANO_MUNDIAL_CLUBES_FIFA=2025;
export const HISTORICO_MUNDIAL_CLUBES_FIFA=criarEdicoes(MUNDIAL_CLUBES_FIFA_POR_ANO);
export const TOTAIS_MUNDIAL_CLUBES_FIFA=criarTotais(HISTORICO_MUNDIAL_CLUBES_FIFA);
export const totalMundialClubesFifaHistoricas=clube=>TOTAIS_MUNDIAL_CLUBES_FIFA[clube]||0;
// Copa Intercontinental FIFA, torneio anual reintroduzido em 2024.
const COPA_INTERCONTINENTAL_FIFA_POR_ANO=Object.freeze({2024:'Real Madrid',2025:'PSG'});
export const ULTIMO_ANO_COPA_INTERCONTINENTAL_FIFA=2025;
export const HISTORICO_COPA_INTERCONTINENTAL_FIFA=criarEdicoes(COPA_INTERCONTINENTAL_FIFA_POR_ANO);
export const TOTAIS_COPA_INTERCONTINENTAL_FIFA=criarTotais(HISTORICO_COPA_INTERCONTINENTAL_FIFA);
export const totalCopaIntercontinentalFifaHistoricas=clube=>TOTAIS_COPA_INTERCONTINENTAL_FIFA[clube]||0;
