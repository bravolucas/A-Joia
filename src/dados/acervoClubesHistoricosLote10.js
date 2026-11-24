/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 10 (24/11/2026).
 * 16 clubes do catálogo principal (Inglaterra/Championship/Arábia Saudita).
 * Fontes de clubes, AFC e histórias institucionais consultadas neste ciclo.
 * Valores nulos são lacunas: nunca zero, nunca estatística inferida de outra liga.
 * Os recordes históricos NÃO são somados aos dados simulados.
 */
const FONTES={
 everton:'https://www.evertonfc.com/news/2025/february/11/goodison-s-most-memorable-merseyside-derbies/',
 evertonTit:'https://www.evertonfc.com/club/history/honours/honours-and-records',
 newcastle:'https://www.newcastleunited.com/en/hall-of-fame/alan-shearer',
 villa:'https://www.avfc.co.uk/history/timeline/',
 villaTre:'https://www.avfc.co.uk/news/2022/september/23/roy-maclaren--1930-2022-/',
 fulham:'https://www.fulhamfc.com/club/history/honours',
 fulhamDav:'https://www.fulhamfc.com/club/history/timeline/1990s/1991',
 brighton:'https://www.brightonandhovealbion.com/media-article/My-Albion-memories%3A-Paul-Arnold',
 brighton2023:'https://www.brightonandhovealbion.com/media-article/De-Zerbi-so-proud-as-Albion-reach-Europa-League',
 palace:'https://www.cpfc.co.uk/news/club/bill-leslie-recalls-zaha-oh-yes-eight-years-on/',
 palace2013:'https://www.cpfc.co.uk/news/features/2012-13-part-three-comebacks-changes-derbies/',
 leeds:'https://www.leedsunited.com/en/club-honours',
 leedsTre:'https://www.leedsunited.com/en/news/don-revies-leeds-united-side-to-receive-citys-highest-civic-honour',
 forest:'https://www.nottinghamforest.co.uk/club-information/history/club-information-history-of-nottingham-forest',
 forestFinal:'https://livepreview.nottinghamforest.co.uk/news/2025/november/27/forest-preview---reds-set-for-historic-reunion-with-malm-/',
 sunderland:'https://www.safc.com/news/2026/march/25/legends--way-stones-now-on-sale/',
 wolves:'https://www.wolves.co.uk/club/history/hall-of-fame/billy-wright/',
 wolvesRec:'https://www.wolves.co.uk/club/history/club-records/',
 westham:'https://www.whufc.com/en/the-club/history/greatest-matches/1965-west-ham-united-2-0-tsv-1860-munich',
 westhamHist:'https://www.whufc.com/en/the-club/history/club-history/1960s',
 leicester:'https://www.lcfc.com/history-honours-men-premierleague',
 leicesterTit:'https://www.lcfc.com/media-article/champions-leicester-city-secure-premier-league-title',
 coventry:'https://www.ccfc.co.uk/news/2025/may/16/on-this-day--coventry-city-win-the-1987-fa-cup-final-/',
 hilal:'https://www.the-afc.com/en/club/afc_champions_league/news/report_al_hilal_sfc_ksa_v_fc_pohang_steelers_kor.html',
 hilalMvp:'https://www.the-afc.com/en/club/afc_champions_league/news/2021_afc_champions_league_mvp.html',
 ittihad:'https://www.the-afc.com/en/club/afc_champions_league/news/al_ittihad_2004-2005_the_last_team_to_win_back-to-back_acl_titles.html',
 ittihadGols:'https://www.the-afc.com/en/club/afc_champions_league/news/five_memorable_afc_champions_league_finals.html',
 ahli:'https://www.the-afc.com/en/club/afc_champions_league_elite.html/news/al-ahli-saudi-fc-end-title-wait-in-style',
 ahliTre:'https://www.the-afc.com/en/club/afc_champions_league_elite.html/news/aclelite-facts-figure',
};
const DADOS={
 'Everton':{
  atletas:[['Dixie Dean','ATA','1925–1937',null,null,'everton','Autor de 60 gols somente na primeira divisão inglesa de 1927/28; a fonte não oferece nesta linha o total da carreira.']],
  marcos:[[1928,'Dixie Dean: 60 gols em uma temporada de liga','everton','Recorde de gols em uma única edição da primeira divisão inglesa (1927/28).']],
 },
 'Newcastle':{
  atletas:[['Alan Shearer','ATA','1996–2006',405,206,'newcastle','O clube lista 405 partidas e 206 gols em todas as competições; ultrapassou Jackie Milburn como maior artilheiro em 2006.']],
  recordes:[['golsCarreira','Alan Shearer',206,'newcastle','Gols oficiais do Newcastle em todas as competições de 1996 a 2006.']],
  marcos:[[2006,'Shearer supera os 200 gols de Jackie Milburn','newcastle','Concluiu a passagem pelo Newcastle com 206 gols no recorte oficial.']],
 },
 'Aston Villa':{
  atletas:[['Peter Withe','ATA','1980–1985',null,null,'villa','Marcou o gol da decisão da Copa dos Campeões Europeus de 1981/82 contra o Bayern de Munique.']],
  marcos:[[1982,'Campeão europeu contra o Bayern','villa','Em 26 de maio de 1982, Peter Withe marcou o único gol da final.']],
  tecnicos:[['Tony Barton','1982','villaTre','Treinador responsável pela campanha do título europeu de 1981/82.']],
 },
 'Fulham':{
  atletas:[
   ['Johnny Haynes','MEI','1952–1970',658,null,'fulham','Recordista de partidas pelo Fulham, com 658 jogos no levantamento do clube.'],
   ['Gordon Davies','ATA','1978–1984; 1986–1991',450,178,'fulhamDav','Maior artilheiro de todos os tempos do Fulham: 178 gols em 450 jogos, segundo o histórico do clube.'],
  ],
  recordes:[['jogosCarreira','Johnny Haynes',658,'fulham','Partidas oficiais reconhecidas pelo Fulham.'],
   ['golsCarreira','Gordon Davies',178,'fulhamDav','Total de gols oficiais em suas duas passagens pelo Fulham.']],
 },
 'Brighton':{
  atletas:[['Bobby Zamora','ATA','2000–2003; 2015–2016',null,null,'brighton','Marcou 63 gols somados nas temporadas de títulos consecutivos de 2000/01 e 2001/02; não representa seu total pelo clube.'],
   ['Julio Enciso','MEI','2022–2025',null,null,'brighton2023','Marcou no empate de 2023 com o Manchester City que confirmou a vaga europeia.']],
  marcos:[[2002,'Zamora lidera bicampeonato de divisões','brighton','63 gols somados nas campanhas de título de 2000/01 e 2001/02.'],
   [2023,'Primeira classificação para torneio europeu','brighton2023','Sexto lugar na Premier League garantiu vaga na Liga Europa pela primeira vez.']],
  tecnicos:[['Roberto De Zerbi','2022–2024','brighton2023','Treinador na classificação inédita à Liga Europa em 2023.']],
 },
 'Crystal Palace':{
  atletas:[['Wilfried Zaha','PE','2010–2013; 2014–2023',null,null,'palace','Marcou os dois gols contra o Brighton na semifinal do playoff de acesso de 2013.']],
  marcos:[[2013,'Zaha decide semifinal de acesso','palace','Dois gols contra o Brighton na volta da semifinal do playoff, abrindo caminho ao acesso à Premier League.']],
 },
 'Leeds United':{
  atletas:[['Billy Bremner','MC','1959–1976',null,null,'leedsTre','Capitão e referência da geração campeã inglesa de 1968/69 e 1973/74 e da FA Cup de 1972.'],
   ['Allan Clarke','ATA','1969–1978',null,null,'leeds','Integrante do grupo de Don Revie que venceu a FA Cup em 1972.']],
  marcos:[[1969,'Campeão inglês pela primeira vez na era Revie','leeds','Conquista da First Division de 1968/69.'],
   [1972,'FA Cup do Leeds United','leeds','Taça conquistada na temporada 1971/72.'],
   [1974,'Segundo campeonato inglês da era Revie','leeds','First Division de 1973/74.']],
  tecnicos:[['Don Revie','1961–1974','leedsTre','Técnico das duas ligas nacionais de 1968/69 e 1973/74 e da FA Cup de 1972.']],
 },
 'Nottingham Forest':{
  atletas:[['Trevor Francis','ATA','1979–1981',null,null,'forestFinal','Marcou de cabeça o gol contra o Malmö na final europeia de 1979, após cruzamento de John Robertson.'],
   ['John Robertson','PE','1970–1983; 1985–1986',null,null,'forestFinal','Autor do cruzamento do gol de Trevor Francis na decisão de 1979.']],
  marcos:[[1978,'Campeão inglês','forest','Primeiro título da divisão principal inglesa sob Brian Clough.'],
   [1979,'Primeira Copa dos Campeões Europeus','forestFinal','Trevor Francis decidiu a final contra o Malmö.'],
   [1980,'Bicampeonato europeu consecutivo','forest','Nottingham Forest manteve o título na temporada seguinte.']],
  tecnicos:[['Brian Clough','1975–1993','forest','Treinador do título inglês de 1977/78 e das duas conquistas europeias consecutivas.']],
 },
 'Sunderland':{
  atletas:[['Jimmy Montgomery','GOL','1960–1977',null,null,'sunderland','Goleiro histórico e recordista de aparições homenageado pelo Sunderland na memória da FA Cup de 1973.']],
  marcos:[[1973,'FA Cup do Sunderland','sunderland','Conquista histórica em Wembley, lembrada pelo clube no projeto Legends’ Way.']],
  tecnicos:[['Bob Stokoe','1972–1976','sunderland','Treinador homenageado pelo Sunderland como símbolo do título da FA Cup de 1973.']],
 },
 'Wolves':{
  atletas:[['Billy Wright','ZAG','1939–1959',null,null,'wolves','Capitão lendário do Wolverhampton e primeiro jogador a completar 100 partidas internacionais por sua seleção; terminou com 105 pela Inglaterra.']],
  marcos:[[1954,'Campeonato inglês na era Billy Wright','wolvesRec','Conquista na primeira divisão inglesa com o defensor como referência.']],
 },
 'West Ham':{
  atletas:[['Bobby Moore','ZAG','1958–1974',null,null,'westhamHist','Capitão do West Ham campeão europeu e da seleção inglesa campeã do mundo em 1966.'],
   ['Alan Sealey','ATA','1961–1967',null,null,'westham','Autor dos dois gols na final europeia de 1965 contra o TSV 1860 München.']],
  marcos:[[1965,'Recopa Europeia com dois gols de Sealey','westham','Vitória do West Ham sobre o TSV 1860 München por 2 a 0 na final.']],
  tecnicos:[['Ron Greenwood','1961–1974','westhamHist','Técnico do West Ham na conquista da Recopa Europeia em 1964/65.']],
 },
 'Leicester City':{
  atletas:[['Jamie Vardy','ATA','2012–2025',null,null,'leicester','Atacante com recorde de 11 jogos seguidos marcando na Premier League de 2015/16.'],
   ['Riyad Mahrez','PD','2014–2018',null,null,'leicesterTit','Uma das figuras centrais do primeiro título inglês do clube em 2015/16.']],
  marcos:[[2016,'Campeão da Premier League 2015/16','leicesterTit','Primeira conquista da primeira divisão na história do Leicester City.']],
  tecnicos:[['Claudio Ranieri','2015–2017','leicester','Treinador do histórico título inglês de 2015/16.']],
 },
 'Coventry City':{
  atletas:[['Keith Houchen','ATA','1986–1989',null,null,'coventry','Autor do gol de cabeça que empatou em 2 a 2 a final da FA Cup de 1987 contra o Tottenham.']],
  marcos:[[1987,'Primeira FA Cup do Coventry City','coventry','Vitória por 3 a 2 na prorrogação contra o Tottenham em Wembley.']],
 },
 'Al-Hilal':{
  atletas:[['Salem Al-Dawsari','PE','2011–2026',null,null,'hilalMvp','Eleito melhor jogador da AFC Champions League de 2021 e autor do gol mais rápido da história de uma final, 16 segundos após o início.']],
  marcos:[[2021,'Quarto título continental do Al-Hilal','hilal','O clube derrotou o Pohang Steelers por 2 a 0 na final da Champions asiática; Salem Al-Dawsari marcou aos 16 segundos.']],
 },
 'Al-Ittihad':{
  atletas:[['Mohammed Noor','MEI','1993–2013; 2014–2016',null,null,'ittihad','Meia central da equipe bicampeã continental em 2004 e 2005; não confundir este recorte com estatísticas gerais.']],
  marcos:[[2004,'Campeão asiático em reação histórica','ittihadGols','Após perder por 3 a 1 na ida, venceu o Seongnam por 5 a 0 na volta da decisão da AFC Champions League.'],
   [2005,'Bicampeão asiático consecutivo','ittihad','Confirmou a segunda taça continental seguida.']],
 },
 'Al-Ahli':{
  atletas:[['Franck Kessié','MC','2023–2026',null,null,'ahli','Autor de um dos gols do título continental do Al-Ahli na final de 2025.'],
   ['Galeno','PE','2025–2026',null,null,'ahli','Marcador de um dos gols da vitória por 2 a 0 sobre o Kawasaki Frontale na final continental.']],
  marcos:[[2025,'Primeira Champions League Elite asiática','ahli','Galeno e Franck Kessié marcaram na vitória por 2 a 0 contra o Kawasaki Frontale.']],
  tecnicos:[['Matthias Jaissle','2023–2026','ahliTre','Técnico do Al-Ahli na campanha do primeiro título asiático de 2025.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte não localizada no lote 10: '+k);return FONTES[k];};
export const ACERVO_CLUBES_LOTE10=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({
  nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f),
 }))),
 recordes:Object.freeze((d.recordes||[]).map(([id,atleta,valor,f,criterio])=>Object.freeze({
  tipo:'clube',nome:clube,id,atleta,valor,criterio,fonte:fonte(f),comparavel:false,data:'2026-11-24',
 }))),
 marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>Object.freeze({
  ano,titulo,descricao,fonte:fonte(f),
 }))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({
  nome,periodo,descricao,fonte:fonte(f),
 }))),
})])));
