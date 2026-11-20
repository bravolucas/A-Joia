/**
 * Referências oficiais selecionadas, verificadas até 19/11/2026.
 * São marcas do futebol real, não estatísticas inventadas para a simulação.
 * Quando uma entidade não tem referência verificável, a UI exibe apenas o save.
 * metricas de carreira/temporada usam jogos e gols oficiais, sem amistosos de clube.
 */
export const REFERENCIAS_RECORDES_FUTEBOL = Object.freeze([
 {tipo:'clube',nome:'Barcelona',id:'golsCarreira',valor:672,atleta:'Lionel Messi',fonte:'https://www.fcbarcelona.com/en/card/2214377/leo-messi',data:'2021-08'},
 {tipo:'clube',nome:'Barcelona',id:'jogosCarreira',valor:778,atleta:'Lionel Messi',fonte:'https://www.fcbarcelona.com/en/card/2214377/leo-messi',data:'2021-08'},
 {tipo:'clube',nome:'Barcelona',id:'assistCarreira',valor:305,atleta:'Lionel Messi',fonte:'https://www.fcbarcelona.com/en/card/2214377/leo-messi',data:'2021-08'},
 {tipo:'clube',nome:'Real Madrid',id:'golsCarreira',valor:451,atleta:'Cristiano Ronaldo',fonte:'https://www.realmadrid.com/en-US/the-club/history/football-legends/cristiano-ronaldo-dos-santos-aveiro/',data:'2018-07'},
 {tipo:'clube',nome:'Real Madrid',id:'golsTemporada',valor:61,atleta:'Cristiano Ronaldo',ano:'2014/15',fonte:'https://www.realmadrid.com/en-US/the-club/history/football-legends/cristiano-ronaldo-dos-santos-aveiro/',data:'2015-06'},
 {tipo:'selecao',nome:'Brasil',id:'golsCarreira',valor:80,atleta:'Neymar',fonte:'https://www.cbf.com.br/selecao-brasileira/noticias/noticias/selecao-masculina/selecao-brasileira-tem-2700-gols-marcados-na-historia',data:'2026-11-13'},
 {tipo:'competicao',nome:'Copa do Mundo',id:'golsCarreira',valor:22,atleta:'Kylian Mbappé',fonte:'https://www.fifa.com/en/articles/fontaine-mbappe-ronaldo-and-more-every-world-cup-top-scorer',data:'2026-07'},
 {tipo:'competicao',nome:'Copa do Mundo',id:'jogosCarreira',valor:34,atleta:'Lionel Messi',fonte:'https://www.fifa.com/en/tournaments/mens/worldcup/articles/players-most-appearances-games-matches-history',data:'2026-07'},
 {tipo:'competicao',nome:'Copa do Mundo',id:'golsTemporada',valor:13,atleta:'Just Fontaine',ano:1958,fonte:'https://www.fifa.com/en/articles/fontaine-mbappe-ronaldo-and-more-every-world-cup-top-scorer',data:'2026-07'},
 {tipo:'competicao',nome:'Champions League',id:'golsCarreira',valor:140,atleta:'Cristiano Ronaldo',fonte:'https://www.uefa.com/uefachampionsleague/news/02a7-2136b8f054ea-76a61b3f9d24-1000--cristiano-ronaldo-in-the-champions-league-records-stats-wh/',data:'2026-08'},
 {tipo:'competicao',nome:'Champions League',id:'jogosCarreira',valor:183,atleta:'Cristiano Ronaldo',fonte:'https://www.uefa.com/uefachampionsleague/news/025a-0e9f8a3d1e40-d534e8b4a897-1000--leaderboard-champions-league-appearances/',data:'2026-11-04'},
 {tipo:'competicao',nome:'Premier League',id:'golsCarreira',valor:260,atleta:'Alan Shearer',fonte:'https://www.premierleague.com/en/stats/records',data:'2026-11'},
 {tipo:'competicao',nome:'Premier League',id:'golsTemporada',valor:36,atleta:'Erling Haaland',ano:'2022/23',fonte:'https://www.premierleague.com/en/stats/records',data:'2026-11'},
 // Técnicos: referências documentadas pela própria Premier League (era 1992/93+).
 {tipo:'competicao',nome:'Premier League',id:'tecnicoJogos',valor:828,atleta:'Arsène Wenger',fonte:'https://www.premierleague.com/en/stats/records',data:'2026-11'},
 {tipo:'competicao',nome:'Premier League',id:'tecnicoVitorias',valor:528,atleta:'Sir Alex Ferguson',fonte:'https://www.premierleague.com/en/events/hall-of-fame/inductees/alex-ferguson',data:'2026-11'},
 {tipo:'competicao',nome:'Premier League',id:'tecnicoPontos',valor:1752,atleta:'Sir Alex Ferguson',fonte:'https://www.premierleague.com/en/stats/records',data:'2026-11'},
 {tipo:'competicao',nome:'Premier League',id:'tecnicoTemporadas',valor:22,atleta:'Arsène Wenger',fonte:'https://www.premierleague.com/en/stats/records',data:'2026-11'},
 {tipo:'competicao',nome:'Premier League',id:'tecnicoTitulos',valor:13,atleta:'Sir Alex Ferguson',fonte:'https://www.premierleague.com/en/news/4660971/every-premier-league-title-winning-manager-in-history',data:'2026-05'},
]);
