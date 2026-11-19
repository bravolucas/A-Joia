/**
 * Campeões REAIS da Libertadores (1960–2025); não são resultados de um save.
 * Nomes alinhados ao catálogo de clubes do A JOIA quando já cadastrados.
 *
 * Fontes:
 * CONMEBOL (histórico institucional):
 * https://cdn.conmebol.com/wp-content/uploads/2025/12/CL-2026-Manual-de-Clubes-POR-2.pdf
 * Histórico anual cruzado:
 * https://www.365scores.com/pt-br/news/magazine/quem-ja-venceu-a-libertadores/
 * Ranking e anos de cada vencedor:
 * https://ge.globo.com/futebol/times/flamengo/noticia/2025/11/29/flamengo-e-tetra-e-se-torna-o-brasileiro-com-mais-titulos-na-libertadores-veja-todos-os-campeoes.ghtml
 *
 * A final de 2026 ocorrerá em 28/11/2026; NÃO inserir campeão de 2026
 * até resultado oficial confirmado. Dados estáticos, sem requisições online.
 */
const POR_ANO = Object.freeze({
  1960:'Peñarol',1961:'Peñarol',1962:'Santos',1963:'Santos',
  1964:'Independiente',1965:'Independiente',1966:'Peñarol',
  1967:'Racing Club',1968:'Estudiantes de La Plata',
  1969:'Estudiantes de La Plata',1970:'Estudiantes de La Plata',
  1971:'Nacional de Montevidéu',1972:'Independiente',1973:'Independiente',
  1974:'Independiente',1975:'Independiente',1976:'Cruzeiro',
  1977:'Boca Juniors',1978:'Boca Juniors',1979:'Olimpia',
  1980:'Nacional de Montevidéu',1981:'Flamengo',1982:'Peñarol',
  1983:'Grêmio',1984:'Independiente',1985:'Argentinos Juniors',
  1986:'River Plate',1987:'Peñarol',1988:'Nacional de Montevidéu',
  1989:'Atlético Nacional',1990:'Olimpia',1991:'Colo-Colo',
  1992:'São Paulo',1993:'São Paulo',1994:'Vélez Sarsfield',
  1995:'Grêmio',1996:'River Plate',1997:'Cruzeiro',
  1998:'Vasco da Gama',1999:'Palmeiras',2000:'Boca Juniors',
  2001:'Boca Juniors',2002:'Olimpia',2003:'Boca Juniors',
  2004:'Once Caldas',2005:'São Paulo',2006:'Internacional',
  2007:'Boca Juniors',2008:'LDU de Quito',2009:'Estudiantes de La Plata',
  2010:'Internacional',2011:'Santos',2012:'Corinthians',
  2013:'Atlético-MG',2014:'San Lorenzo',2015:'River Plate',
  2016:'Atlético Nacional',2017:'Grêmio',2018:'River Plate',
  2019:'Flamengo',2020:'Palmeiras',2021:'Palmeiras',
  2022:'Flamengo',2023:'Fluminense',2024:'Botafogo',2025:'Flamengo',
});

export const ULTIMO_ANO_LIBERTADORES_HISTORICO = 2025;
export const HISTORICO_LIBERTADORES = Object.freeze(
  Object.entries(POR_ANO)
    .map(([ano,clube])=>Object.freeze({
      ano:Number(ano),campeoes:Object.freeze([Object.freeze({clube,quantidade:1})]),
    }))
    .sort((a,b)=>b.ano-a.ano),
);
const totais=new Map();
for(const {campeoes} of HISTORICO_LIBERTADORES)
  for(const {clube,quantidade} of campeoes)totais.set(clube,(totais.get(clube)||0)+quantidade);
export const TOTAIS_LIBERTADORES_HISTORICOS=Object.freeze(
  Object.fromEntries(totais),
);
export const totalLibertadoresHistoricas=clube=>TOTAIS_LIBERTADORES_HISTORICOS[clube]||0;
