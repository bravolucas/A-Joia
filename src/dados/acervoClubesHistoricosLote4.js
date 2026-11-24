/**
 * Acervo histórico de clubes — lote 4, fontes institucionais europeias.
 * Onde um jogador possui número parcial (somente liga ou temporada),
 * guardá-lo na descrição / marco, nunca como total de carreira.
 * Revisão documental em 23/11/2026.
 */
const FONTES={
 city:'https://www.mancity.com/mancitylegends/aguero-sergio',
 arsenal:'https://www.arsenal.com/feature/the-wenger-years-a05Ex7F5N6vd',
 ajax:'https://english.ajax.nl/articles/125-years-of-ajax-white-red-white-history-from-start-to-finish',
 ajaxSwart:'https://www.ajax.nl/artikelen/top-10-goals-mister-ajax',
 psv:'https://www.psv.nl/media/artikel/alles-over-feyenoord-psv-lijkt-garantie-voor-doelpunten',
 feyenoord:'https://www.feyenoord.com/en/our-club/organisation/history',
 dortmund:'https://www.bvb.de/de/en/teams/football/first-team/fifa-club-world-cup/former-players-usa.html',
 atletico:'https://www.atleticodemadrid.com/noticias/acuerdo-con-el-orlando-city-sc-para-la-incorporacion-de-griezmann-a-partir-de-la-proxima-temporada',
 athletic:'https://www.athletic-club.eus/en/news/2021/01/20/telmo-zarra-100-years-a-legend/',
 sevilla:'https://sevillafc.es/en/actualidad/noticias/navas-diciembre-partidos-2024',
 psg:'https://www.psg.fr/en/content/digne-express-lucas-digne-paris-saint-germain-2026-2027',
 monaco:'https://www.asmonaco.com/fr/joueurs/delio-onnis',
 monacoFalcao:'https://www.asmonaco.com/fr/news/quand-radamel-falcao-el-tigre-rugissait-a-l-as-monaco',
 lyon:'https://www.ol.fr/fr/actualites/depart-dalex-lacazette-la-fin-dune-tres-belle-histoire-31228',
 marseille:'https://billetterie.om.fr/fr/histoire',
};
const DADOS={
 'Manchester City':{
  atletas:[['Sergio Agüero','ATA','2011–2021',390,260,'city','Maior artilheiro histórico do City segundo sua galeria de lendas.']],
  recordes:[['golsCarreira','Sergio Agüero',260,'city','Partidas e gols contabilizados pelo clube.']],
 },
 'Arsenal':{
  atletas:[['Thierry Henry','ATA','1999–2007; 2012',null,null,'arsenal','Maior artilheiro histórico do Arsenal, ultrapassando Ian Wright segundo a história oficial.']],
  recordes:[],
 },
 'Ajax':{
  atletas:[
   ['Johan Cruijff','ATA','1964–1973; 1981–1983',null,null,'ajax','Ídolo formado em Amsterdã; estreou profissionalmente pelo Ajax em 1964.'],
   ['Sjaak Swart','PD','1956–1973',603,227,'ajaxSwart','Recordista de jogos oficiais pelo Ajax (603), com 227 gols de acordo com o clube.'],
  ],
  recordes:[['jogosCarreira','Sjaak Swart',603,'ajaxSwart','603 partidas oficiais pelo Ajax segundo o histórico institucional.']],
  marcos:[[1964,'Estreia de Johan Cruijff no Ajax','ajax','Marco da formação de um dos maiores ídolos da instituição.']],
 },
 'PSV':{
  atletas:[['Ruud van Nistelrooij','ATA','1998–2001',null,null,'psv','Ex-atacante do PSV, posteriormente treinador da equipe; personagem lembrado no arquivo institucional.']],
  recordes:[],
 },
 'Feyenoord':{
  atletas:[['Robin van Persie','ATA','2001–2004; 2018–2019',null,null,'feyenoord','Revelado pelo clube e mencionado como produto histórico da academia.']],
  recordes:[],
 },
 'Borussia Dortmund':{
  atletas:[['Marco Reus','MEI','2012–2024',null,170,'dortmund','170 gols em partidas competitivas segundo retrospectiva institucional do Borussia.']],
  recordes:[], // 170 gols são a segunda marca histórica, não o recorde absoluto.
 },
 'Atlético de Madrid':{
  atletas:[['Antoine Griezmann','ATA','2014–2019; 2021–2026',null,211,'atletico','Recordista de gols no comunicado institucional de transferência em 2026; valores posteriores requerem revisão.']],
  recordes:[['golsCarreira','Antoine Griezmann',211,'atletico','Marca de referência da publicação de 2026; verificar acréscimos desde a matéria.']],
 },
 'Athletic Bilbao':{
  atletas:[['Telmo Zarra','ATA','1940–1955',null,null,'athletic','Lenda do Athletic: 251 gols em LaLiga, não o total de todas as competições.']],
  recordes:[],
  marcos:[[null,'Zarra: 251 gols no Campeonato Espanhol','athletic','Recorte exclusivo de LaLiga; não representa gols por todas as competições.']],
 },
 'Sevilla':{
  atletas:[['Jesús Navas','LD','2003–2013; 2017–2024',705,null,'sevilla','Recordista de atuações oficiais pelo Sevilla, aposentado em dezembro de 2024.']],
  recordes:[['jogosCarreira','Jesús Navas',705,'sevilla','705 jogos oficiais, segundo comunicação da aposentadoria.']],
 },
 'PSG':{
  atletas:[
   ['Kylian Mbappé','ATA','2017–2024',null,null,'psg','Ultrapassou Edinson Cavani na lista de goleadores do Paris Saint-Germain; 235 no recorte institucional consultado.'],
   ['Edinson Cavani','ATA','2013–2020',null,null,'psg','Anterior recordista, com 200 gols no recorte do retrospecto oficial.'],
   ['Marquinhos','ZAG','2013–2026',null,null,'psg','Recordista de atuações e conquistas na comunicação do clube de 2026.'],
  ],
  recordes:[],
 },
 'Monaco':{
  atletas:[
   ['Delio Onnis','ATA','1973–1980',null,null,'monaco','Referência dos artilheiros da liga francesa: 299 gols em toda a competição, sendo 157 pelo Monaco.'],
   ['Radamel Falcao','ATA','2013–2019',140,83,'monacoFalcao','83 gols e 14 assistências em 140 jogos, segundo perfil retrospectivo publicado pelo Monaco.'],
  ],
  recordes:[],
 },
 'Lyon':{
  atletas:[['Alexandre Lacazette','ATA','2010–2017; 2022–2025',null,null,'lyon','Marcador histórico no Lyon; 27 gols na Ligue 1 2014/15 e 28 na edição seguinte.']],
  recordes:[],
  marcos:[[2015,'Lacazette: 27 gols na Ligue 1','lyon','Marca da temporada 2014/15 em apenas uma liga.']],
 },
 'Marseille':{
  atletas:[['Jean-Pierre Papin','ATA','1986–1992',null,null,'marseille','Artilheiro de destaque na história do Olympique; marcou 22 gols em uma temporada da primeira divisão, conforme a cronologia institucional.']],
  recordes:[],
 },
};
const url=f=>{if(!FONTES[f])throw new Error('Fonte não identificada no lote 4: '+f);return FONTES[f];};
export const ACERVO_CLUBES_LOTE4=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-23',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>
  Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:url(f)}))),
 recordes:Object.freeze(d.recordes.map(([id,atleta,valor,f,criterio])=>Object.freeze({
  tipo:'clube',nome:clube,id,atleta,valor,fonte:url(f),comparavel:false,criterio,data:'2026-11-23',
 }))),
 marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>
  Object.freeze({ano,titulo,descricao,fonte:url(f)}))),
})])));
