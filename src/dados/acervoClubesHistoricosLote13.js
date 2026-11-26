/**
 * A JOIA · ACERVO HISTÓRICO, LOTE 13 · 24/11/2026
 * Ficha pendente do Defensa y Justicia + oito clubes do grupo Espanha.
 * Fontes institucionais AFA, LaLiga, UEFA, RFEF e páginas oficiais de clubes.
 * Estatística de uma edição/partida nunca é total da carreira no jogo.
 */
const FONTES={
 defensa:'https://www.afa.com.ar/7/posts/el-camino-del-campeon-de-la-copa-sudamericana-defensa-y-justicia',
 defensaG:'https://www.afa.com.ar/Sitio/posts/defensa-y-justicia-el-protagonista-de-la-final-de-la-conmebol-recopa',
 racing:'https://www.realracingclub.es/noticias/munitis-se-despide-orgulloso-de-su-carrera-racinguista',
 levante:'https://www.levanteud.com/tercer-milenio',
 levanteI:'https://museo.levanteud.com/2022/08/02/iborra/',
 malaga:'https://www.malagacf.com/en/temporada-2012-2013',
 malagaU:'https://www.uefa.com/uefachampionsleague/news/0208-0e84375f0965-020e001ded44-1000--last-gasp-dortmund-comeback-stuns-malaga/',
 osasuna:'https://rfef.es/es/noticias/resumen-alegria-madridista-ante-un-gran-ca-osasuna',
 rayo:'https://www.laliga.com/es-US/noticias/historia-estadio-de-vallecas-rayo-vallecano',
 rayoT:'https://www.laliga.com/videos/oscar-trejo-la-brujula-del-rayo-vallecano',
 getafe:'https://www.getafecf.com/noticias/se-cumplen-15-anos-del-getafe-bayern-de-munich',
 getafeUEFA:'https://www.uefa.com/uefaeuropaleague/match/301969--getafe-vs-bayern-munchen/events/',
 alaves:'https://www.laliga.com/noticias/que-fue-de-javi-moreno',
 alavesFinal:'https://www.laliga.com/noticias/dos-historicos-se-reencuentran-en-la-liga-adelante',
 elche:'https://www.elchecf.es/noticias/efemeride-47-anos-de-la-final-de-copa',
 elcheBase:'https://www.elchecf.es/1966-1971',
};
const DADOS={
 'Defensa y Justicia':{
  atletas:[['Braian Romero','ATA','2020',null,null,'defensa','Artilheiro do Defensa na Copa Sul-Americana 2020, com 10 gols naquela edição; a fonte não estabelece seu total pelo clube.']],
  marcos:[[2020,'Primeira Copa Sul-Americana do Defensa y Justicia','defensa','O torneio 2020 teve final em 23 de janeiro de 2021: vitória por 3 a 0 diante do Lanús.']],
  tecnicos:[['Hernán Crespo','2020–2021','defensaG','Treinador do primeiro título internacional do Defensa y Justicia, na Sudamericana 2020.']],
 },
 'Racing Santander':{
  atletas:[['Pedro Munitis','ATA','anos 1990; 2003–2012',null,null,'racing','Capitão e referência do Racing Santander no sexto lugar de 2007/08, que levou o clube à primeira competição europeia.']],
  marcos:[[2008,'Primeira classificação para a Copa UEFA','racing','O Racing terminou a La Liga de 2007/08 na sexta posição e disputou a Copa UEFA na temporada seguinte.']],
 },
 'Levante':{
  atletas:[['Vicente Iborra','VOL','2007–2013',null,null,'levanteI','Meio-campista da primeira participação do Levante UD na fase de grupos da UEFA Europa League, em 2012/13.']],
  marcos:[[2012,'Primeira participação continental do Levante','levante','Sexto colocado em LaLiga 2011/12; conquistou classificação para a Europa League 2012/13.']],
  tecnicos:[['Juan Ignacio Martínez','2011–2013','levante','Treinador da classificação inédita do Levante às competições europeias.']],
 },
 'Málaga':{
  atletas:[
   ['Isco','MEI','2011–2013',null,null,'malaga','Meio-campista destaque do Málaga na primeira participação do clube na Champions League, em 2012/13.'],
   ['Joaquín','PD','2011–2013',null,null,'malagaU','Marcou contra o Borussia Dortmund na volta das quartas de final da Champions League 2012/13.'],
  ],
  marcos:[[2013,'Quartas de final da Champions League na estreia','malagaU','A campanha europeia de 2012/13 terminou na derrota por 3 a 2 para o Borussia Dortmund, com dois gols nos acréscimos.']],
  tecnicos:[['Manuel Pellegrini','2010–2013','malaga','Treinador do Málaga na melhor campanha europeia do clube em 2012/13.']],
 },
 'Osasuna':{
  atletas:[['Kike Barja','PE','2022–2023',null,null,'osasuna','Atacante do Osasuna na histórica final da Copa do Rei de 2023 contra o Real Madrid.']],
  marcos:[[2023,'Vice-campeonato da Copa do Rei','osasuna','Osasuna perdeu a final para o Real Madrid por 2 a 1, no Estádio La Cartuja.']],
  tecnicos:[['Jagoba Arrasate','2018–2024','osasuna','Treinador na final da Copa do Rei de 2022/23.']],
 },
 'Rayo Vallecano':{
  atletas:[['Óscar Trejo','MEI','2010–2013; 2017–2026',null,null,'rayoT','Meio-campista destacado pela LaLiga como referência do Rayo Vallecano.']],
  marcos:[[2001,'Quartas de final da Copa UEFA','rayo','Rayo chegou às quartas de final da Copa UEFA na temporada 2000/01; eliminado pelo Alavés.']],
 },
 'Getafe':{
  atletas:[
   ['Rubén de la Red','MEI','2007–2008',null,null,'getafe','Meio-campista do Getafe que disputou as quartas da Copa UEFA diante do Bayern em 2008.'],
   ['Ikechukwu Uche','ATA','2007–2008',null,null,'getafeUEFA','Atacante participante do empate em 3 a 3 com o Bayern na volta das quartas de 2008.'],
  ],
  marcos:[[2008,'Quartas da Copa UEFA contra o Bayern de Munique','getafe','Após empatar por 1 a 1 na ida e 3 a 3 na volta, o Getafe caiu no critério de gols fora de casa.']],
 },
 'Alavés':{
  atletas:[['Javi Moreno','ATA','1998–2001',null,null,'alaves','Marcou 22 gols somente em LaLiga 2000/01 e dois gols na final da Copa UEFA contra o Liverpool.']],
  marcos:[[2001,'Vice-campeonato da Copa UEFA','alavesFinal','Alavés disputou a final da Copa UEFA de 2000/01 e perdeu para o Liverpool por 5 a 4.']],
 },
 'Elche':{
  atletas:[['José Araquistain','GOL','1969',null,null,'elcheBase','Goleiro titular do Elche na final da Copa do Generalísimo de 1969 contra o Athletic Bilbao.']],
  marcos:[[1969,'Primeira final de Copa do Elche','elche','Elche disputou a final no Santiago Bernabéu e perdeu por 1 a 0 para o Athletic Club.']],
  tecnicos:[['Roque Gastón Máspoli','1969','elche','Treinador na final da Copa do Generalísimo de 1969.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte não localizada no lote 13: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE13=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
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
