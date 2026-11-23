/**
 * Lote 2 de clubes (23/11/2026): históricos institucionais publicados
 * pelos próprios clubes. Mantidos separados para facilitar auditoria por lote.
 * A chave é o nome exato utilizado pelo catálogo de A JOIA.
 */
const font={
 boca:'https://www.bocajuniors.com.ar/historias',
 juventus:'https://www.juventus.com/en/news/articles/juventus-launches-the-adp-collection',
 milan:'https://www.acmilan.com/en/club/legends/player/paolo-maldini',
 milanGols:'https://www.acmilan.com/en/club/ac-milan-top-scorers',
 inter:'https://www.inter.it/en/news/2020-08-27-zanetti-debut-inter-vicenza-1995',
 liverpool:'https://www.liverpoolfc.com/ian-rush',
 manunited:'https://www.manutd.com/en/news/wayne-rooney-confirmed-to-play-in-man-utd-charity-match-v-celtic-supporting-man-utd-foundation',
 tottenham:'https://www.tottenhamhotspur.com/news/1015980/kane-equals-best-ever-premier-league-goalscoring-campaign',
 benfica:'https://www.slbenfica.pt/en-us/agora/noticias/2016_2017/06/historia-eusebio',
};
// [nome, posição, período, jogos, gols, fonte, contexto]
// Valores nos critérios de cada fonte, não preenchidos onde não atestados.
const dados={
 'Boca Juniors':{
  atletas:[['Martín Palermo','ATA','1997–2000; 2004–2011',404,236,'boca','Recorde de gols segundo o portal histórico do Boca; contagem do próprio clube.']],
  recordes:[['golsCarreira','Martín Palermo',236,'boca']],
 },
 'Juventus':{
  atletas:[['Alessandro Del Piero','ATA','1993–2012',705,290,'juventus','Mais partidas e mais gols do clube segundo publicação institucional de dezembro de 2025.']],
  recordes:[['golsCarreira','Alessandro Del Piero',290,'juventus'],['jogosCarreira','Alessandro Del Piero',705,'juventus']],
 },
 'Milan':{
  atletas:[
   ['Paolo Maldini','ZAG','1985–2009',902,null,'milan','Recordista de jogos oficiais pelo Milan.'],
   ['Gunnar Nordahl','ATA','1949–1956',null,221,'milanGols','Maior artilheiro no ranking histórico publicado pelo Milan, segundo o recorte estatístico da instituição.'],
  ],
  recordes:[['jogosCarreira','Paolo Maldini',902,'milan'],['golsCarreira','Gunnar Nordahl',221,'milanGols']],
 },
 'Inter de Milão':{
  atletas:[['Javier Zanetti','LD','1995–2014',858,null,'inter','Recordista de atuações oficiais pela Inter.']],
  recordes:[['jogosCarreira','Javier Zanetti',858,'inter']],
 },
 'Liverpool':{
  atletas:[['Ian Rush','ATA','1980–1987; 1988–1996',660,346,'liverpool','Maior artilheiro histórico segundo o Liverpool; 660 partidas na contagem do clube.']],
  recordes:[['golsCarreira','Ian Rush',346,'liverpool']],
 },
 'Manchester United':{
  atletas:[['Wayne Rooney','ATA','2004–2017',559,253,'manunited','Recordista histórico de gols do Manchester United; 559 partidas no recorte da publicação.']],
  recordes:[['golsCarreira','Wayne Rooney',253,'manunited']],
 },
 'Tottenham':{
  atletas:[['Harry Kane','ATA','2009–2023',null,280,'tottenham','Maior artilheiro do clube após a temporada 2022/23.']],
  recordes:[['golsCarreira','Harry Kane',280,'tottenham']],
 },
 'Benfica':{
  atletas:[['Eusébio','ATA','1960/61–1974/75',614,638,'benfica','Dados históricos do Benfica abrangem 614 partidas e 638 gols; podem incluir amistosos.']],
  recordes:[],
 },
};
export const ACERVO_CLUBES_LOTE2 = Object.freeze(Object.fromEntries(Object.entries(dados).map(([clube,d])=>[clube,
 Object.freeze({
  clube,atualizadoEm:'2026-11-23',
  atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,fonte,descricao])=>
   Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:font[fonte]}))),
  recordes:Object.freeze(d.recordes.map(([id,atleta,valor,fonte])=>
   Object.freeze({tipo:'clube',nome:clube,id,atleta,valor,fonte:font[fonte],
    comparavel:false,criterio:'Referência institucional com escopo próprio; não comparar diretamente com estatísticas de jogos simulados.',
    data:'2026-11-23'}))),
 })
])));
