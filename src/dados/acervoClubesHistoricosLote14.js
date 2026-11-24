/**
 * ACERVO HISTÓRICO A JOIA — LOTE 14 / INGLATERRA (24/11/2026).
 * Quatro fichas para completar a liga "inglaterra" do cadastro principal.
 * Fontes FA, Premier League, Brentford FC e UEFA. Totais desconhecidos null.
 */
const F={
 hull:'https://www.thefa.com/news/2014/apr/11/hull-city-wembley-moments',
 bournemouth:'https://www.premierleague.com/en/news/60243/eddie-howe',
 bournemouthClub:'https://careers.afcb.co.uk/en?scroll_to=js-careers-jobs-block',
 bournemouthCap:'https://www.premierleague.com/en/news/4121583',
 brentford:'https://www.brentfordfc.com/en/news/article/the-long-read-2021-championship-play-off-final-peter-gilham-pontus-jansson-emiliano-marcondes',
 brentfordT:'https://www.brentfordfc.com/en/news/cliff-crowns-christmas-message-616371',
 ipswich:'https://www.uefa.com/news-media/news/01d9-0e7232d327d9-d0421ac286cc-1000--six-of-the-best-uefa-cup-finals/',
};
const D={
 'Hull City':{
  atletas:[['Dean Windass','ATA','2007–2008',null,null,'hull','Autor do voleio decisivo na final do playoff da Championship 2007/08, diante do Bristol City.']],
  marcos:[[2008,'Primeiro acesso à elite do futebol inglês','hull','Hull venceu o Bristol City por 1 a 0 em Wembley, com gol de Dean Windass, e foi à Premier League pela primeira vez.']],
  tecnicos:[['Phil Brown','2008','hull','Treinador na conquista do acesso à Premier League de 2008.']],
 },
 'Bournemouth':{
  atletas:[['Tommy Elphick','ZAG','2012–2016',null,null,'bournemouthCap','Capitão do Bournemouth no acesso e título da Championship de 2014/15.']],
  marcos:[[2015,'Título da Championship e primeiro acesso à Premier League','bournemouthClub','Bournemouth conquistou a segunda divisão inglesa em 2014/15 e alcançou a Premier League pela primeira vez.']],
  tecnicos:[['Eddie Howe','2012–2020','bournemouth','Treinador da histórica subida à elite inglesa de 2015.']],
 },
 'Brentford':{
  atletas:[
   ['Ivan Toney','ATA','2020–2024',null,null,'brentford','Marcou o primeiro gol na decisão dos playoffs de 2020/21 contra o Swansea City, em Wembley.'],
   ['Emiliano Marcondes','MEI','2017–2021',null,null,'brentford','Marcou o segundo gol da decisão de 2021, encerrada em 2 a 0 sobre o Swansea.'],
  ],
  marcos:[[2021,'Primeiro acesso do Brentford à Premier League','brentford','Vitória de 2 a 0 contra o Swansea City na final do playoff da Championship em 29 de maio de 2021.']],
  tecnicos:[['Thomas Frank','2018–2024','brentfordT','Treinador do acesso histórico de 2021.']],
 },
 'Ipswich Town':{
  atletas:[
   ['John Wark','MEI','1975–1983',null,null,'ipswich','Marcou na ida e na volta da decisão da Copa UEFA de 1981 diante do AZ Alkmaar.'],
   ['Frans Thijssen','MEI','1979–1983',null,null,'ipswich','Meio-campista que marcou na ida e na volta da final europeia de 1981.'],
  ],
  marcos:[[1981,'Campeão da Copa UEFA contra o AZ Alkmaar','ipswich','Vitória por 3 a 0 na ida, derrota por 4 a 2 na volta e título com agregado de 5 a 4.']],
  tecnicos:[['Bobby Robson','1969–1982','ipswich','Treinador do Ipswich campeão da Copa UEFA de 1980/81.']],
 },
};
const fonte=k=>{if(!F[k])throw new Error('Fonte não encontrada no lote 14: '+k);return F[k]};
export const ACERVO_CLUBES_LOTE14=Object.freeze(Object.fromEntries(Object.entries(D).map(([clube,d])=>[clube,Object.freeze({
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
