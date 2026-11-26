/**
 * A JOIA — acervo histórico, lote 28 (24/11/2026).
 * Dados de títulos de fontes institucionais FC Nantes, FFF e OGC Nice.
 * A edição de cada campeonato/copa é registrada individualmente; não há
 * totais de jogos e gols inventados.
 */
const FONTES={
 nantes:'https://www.fcnantes.com/articles/article2809.php?num=49238',
 nantesHistoria:'https://plus.fcnantes.com/articles/article2809.php?num=10252',
 nice:'https://www.ogcnice.com/fr/club/histoire/les-50-glorieuses.html',
 niceCopa:'https://www.fff.fr/article/7367-ogc-nice-l-eloge-de-la-patience.html',
 strasbourgLiga:'https://www.fff.fr/257-palmares-ligue-1.html',
 strasbourgCopas:'https://www.fff.fr/473-palmares-de-la-coupe-de-france.html',
 strasbourgDetalhes:'https://www.lequipe.fr/Football/FootballFicheClub13.html',
};
const marco=(ano,titulo,descricao,src)=>Object.freeze({ano,titulo,descricao,fonte:FONTES[src]});
const atleta=(nome,posicao,periodo,descricao,src)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:FONTES[src]});
const gerarTitulos=(anos,titulo,src)=>anos.map(ano=>marco(ano,titulo,`Conquista da edição encerrada em ${ano}.`,src));
export const ACERVO_CLUBES_LOTE28=Object.freeze({
 Nantes:Object.freeze({
  clube:'Nantes',atualizadoEm:'2026-11-24',recordes:Object.freeze([]),tecnicos:Object.freeze([]),
  atletas:Object.freeze([
   atleta('Jacky Simon','ATA','1959–1968','Destaque ofensivo da equipe campeã francesa de 1965.','nantesHistoria'),
   atleta('Robert Budzynski','ZAG','1959–1969','Defensor da geração que conquistou os primeiros títulos franceses do Nantes.','nantesHistoria'),
  ]),
  marcos:Object.freeze([
   marco(1943,'Fundação do FC Nantes','Clube formado em abril de 1943, após união de equipes locais.','nantesHistoria'),
   ...gerarTitulos([1965,1966,1973,1977,1980,1983,1995,2001],'Campeão da primeira divisão francesa','nantes'),
   ...gerarTitulos([1979,1999,2000,2022],'Campeão da Copa da França','nantes'),
  ]),
 }),
 Nice:Object.freeze({
  clube:'Nice',atualizadoEm:'2026-11-24',recordes:Object.freeze([]),tecnicos:Object.freeze([]),
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   ...gerarTitulos([1951,1952,1956,1959],'Campeão da primeira divisão francesa','nice'),
   ...gerarTitulos([1952,1954,1997],'Campeão da Copa da França','niceCopa'),
   marco(1957,'Quartas de final da Copa dos Campeões','Chegou às quartas de final da Copa dos Campeões de 1956/57, enfrentando o Real Madrid.','nice'),
  ]),
 }),
 Strasbourg:Object.freeze({
  clube:'Strasbourg',atualizadoEm:'2026-11-24',recordes:Object.freeze([]),tecnicos:Object.freeze([]),
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   marco(1979,'Campeão da primeira divisão francesa','Único título da elite francesa, na edição 1978/79.','strasbourgLiga'),
   ...gerarTitulos([1951,1966,2001],'Campeão da Copa da França','strasbourgCopas'),
   ...gerarTitulos([1997,2005,2019],'Campeão da Copa da Liga Francesa','strasbourgDetalhes'),
  ]),
 }),
});
