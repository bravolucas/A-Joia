/**
 * Acervo histórico — lote 5. Revisão: 23/11/2026.
 * 11 clubes adicionais com fontes de clubes e organismos oficiais.
 * O valor null NÃO significa zero: impede falsa comparação com o save.
 * Em cada linha a descrição indica se a fonte usa apenas liga/temporada.
 */
const FONTES={
 roma:'https://www.asroma.com/en/club/history/hall-of-fame/15259/francesco-totti',
 napoli:'https://sscnapoli.it/en/il-club',
 lazio:'https://www.sslazio.it/en/club/storia-del-club/storia',
 lazioArtilheiro:'https://www.sslazio.it/en/news/statistiche/immobile-domina-nella-top-5-dei-marcatori-laziali-degli-ultimi-10-anni',
 rangers:'https://www.rangers.co.uk/article/play-rangers-museum-lotto/2FjEPRWk02ea37JWHkbdaz',
 celtic:'https://www.uefa.com/uefachampionsleague/news/0200-0e7ec08e3805-72f16e6d7b2b-1000--celtic-close-in-on-group-stage-as-helsborg-visit/',
 porto:'https://pt.uefa.com/news-media/news/027b-16aef484ace6-c7f7e024d25e-1000--futebol-portugues-de-luto-por-fernando-gomes/',
 valencia:'https://www.valenciacf.com/se-cumplen-50-anos-del-debut-de-la-leyenda-mario-alberto-kempes-con-el-valencia-cf',
 betis:'https://en.realbetisbalompie.es/club/consejo-de-administracion/joaquin-sanchez',
 sociedad:'https://www.realsociedad.eus/es/noticias/detalle/mas-que-de-alcanzar-unos-numeros-disfruto-del-camino',
 sociedadPrieto:'https://www.realsociedad.eus/es/noticias/detalle/vuelve-a-la-real-1',
 villarreal:'https://villarrealcf.es/manu-trigueros-iguala-los-425-partidos-de-bruno-soriano/',
 espanyol:'https://campaigns.rcdespanyol.com/es/la21/historical-journey',
};
const DADOS={
 'Roma':{
  atletas:[
   ['Francesco Totti','MEI','1993–2017',786,307,'roma','Recordista histórico da Roma em partidas oficiais e gols; 619 jogos e 250 gols pela Serie A.'],
  ],
  recordes:[['jogosCarreira','Francesco Totti',786,'roma','Partidas oficiais da Roma, todas as competições.'],
    ['golsCarreira','Francesco Totti',307,'roma','Gols oficiais da Roma, todas as competições.']],
  marcos:[[2001,'Scudetto com Totti','roma','Campeão italiano como capitão no início dos anos 2000.']],
 },
 'Napoli':{
  atletas:[['Diego Maradona','MEI','1984–1991',null,null,'napoli','Protagonista dos Scudetti de 1986/87 e 1989/90 e da conquista da Copa UEFA em 1988/89.']],
  recordes:[],
  marcos:[[1987,'Primeiro Scudetto','napoli','Campanha histórica liderada por Diego Maradona.'],
   [1989,'Título da Copa UEFA','napoli','Conquista europeia da era Maradona.'],
   [1990,'Segundo Scudetto','napoli','Título nacional com Maradona no elenco.']],
 },
 'Lazio':{
  atletas:[['Ciro Immobile','ATA','2016–2024',null,null,'lazioArtilheiro','Maior goleador histórico da Lazio. Fez 36 gols na Serie A 2019/20, campanha de Chuteira de Ouro.']],
  recordes:[],
  marcos:[[2020,'Immobile: 36 gols na Serie A','lazio','Chuteira de Ouro de 2019/20; marca exclusivamente de uma edição da liga italiana.']],
 },
 'Rangers':{
  atletas:[['Ally McCoist','ATA','1983–1998',581,355,'rangers','Museu do Rangers publica 355 gols em 581 jogos e registra disputa histórica sobre possível 356º gol.']],
  recordes:[],
  marcos:[[null,'Coleção de artilharias de McCoist','rangers','Segundo o clube, ganhou 10 ligas, 9 copas da liga e 1 Copa da Escócia.']],
 },
 'Celtic':{
  atletas:[['Henrik Larsson','ATA','1997–2004',315,242,'celtic','Números citados pela UEFA em levantamento retrospectivo; não extrapolar para todas as competições.']],
  recordes:[],
 },
 'Porto':{
  atletas:[['Fernando Gomes','ATA','1974–1980; 1982–1989',null,null,'porto','Maior goleador da história do FC Porto, homenageado pela UEFA; total numérico não informado na fonte utilizada.']],
  recordes:[],
 },
 'Valencia':{
  atletas:[['Mario Kempes','ATA','1976–1981; 1982–1984',246,149,'valencia','246 partidas oficiais e 149 gols segundo o Valencia CF em 2026; artilheiro da liga espanhola em 1976/77 e 1977/78.']],
  recordes:[],
  marcos:[[1979,'Kempes campeão da Copa do Rei','valencia','Venceu a Copa do Rei 1978/79.'],
   [1980,'Kempes campeão europeu','valencia','Conquistou a Recopa de 1979/80.']],
 },
 'Real Betis':{
  atletas:[['Joaquín Sánchez','PD','2000–2006; 2015–2023',528,null,'betis','Recordista histórico do Betis em partidas da equipe principal, conforme perfil institucional.']],
  recordes:[['jogosCarreira','Joaquín Sánchez',528,'betis','Partidas pelo time principal do Betis segundo seu perfil institucional.']],
 },
 'Real Sociedad':{
  atletas:[
   ['Alberto Górriz','ZAG','1979–1993',599,null,'sociedad','Mais jogos no ranking histórico do clube divulgado em 2025.'],
   ['Xabi Prieto','MEI','2003–2018',532,null,'sociedadPrieto','532 partidas oficiais pelo clube, segundo o arquivo institucional da Real Sociedad.'],
  ],
  recordes:[['jogosCarreira','Alberto Górriz',599,'sociedad','Mais partidas no levantamento oficial publicado pela Real Sociedad.']],
 },
 'Villarreal':{
  atletas:[['Bruno Soriano','VOL','2006–2020',425,null,'villarreal','425 jogos oficiais no recorte citado em 2022; a marca foi igualada por Manu Trigueros, não é afirmada como atual recorde absoluto.']],
  recordes:[],
 },
 'Espanyol':{
  atletas:[['Raúl Tamudo','ATA','1997–2010',389,129,'espanyol','Referência histórica do clube: 129 gols em LaLiga; os 389 jogos seguem a contagem específica da publicação.']],
  recordes:[],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte ausente no quinto lote: '+k);return FONTES[k];};
export const ACERVO_CLUBES_LOTE5=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-23',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>
  Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze(d.recordes.map(([id,atleta,valor,f,criterio])=>Object.freeze({
  tipo:'clube',nome:clube,id,atleta,valor,fonte:fonte(f),comparavel:false,
  criterio,data:'2026-11-23',
 }))),
 marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>
  Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
})])));
