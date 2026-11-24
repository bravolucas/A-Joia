/**
 * ACERVO A JOIA · LOTE 12 — Argentina e América do Sul (24/11/2026).
 * Dez clubes que faltavam na liga argentina e na lista sul-americana do
 * catálogo principal. Pesquisa ligada a fontes AFA, APF e clubes oficiais.
 * Um "marco" é um evento real documentado, não um recorde de carreira.
 * Estatísticas sem contagem/escopo conclusivos permanecem null.
 */
const FONTES={
 tall:'https://www.afa.com.ar/en/posts/3-10-jose-valencia',
 hur:'https://www.afa.com.ar/en/posts/el-huracan-del-73-un-campeon-inolvidable',
 bel:'https://www.afa.com.ar/berufe/posts/belgrano-es-de-primera',
 ban:'https://www.afa.com.ar/es/posts/banfieldcolon-empate-en-el-sur',
 banSilva:'https://www.afa.com.ar/campeonatos/posts/los-veras-volver',
 gim:'https://www.afa.com.ar/Sitio/posts/el-ultimo-encuentro-del-mariscal',
 gimNiell:'https://www.afa.com.ar/campeonatos/posts/los-veras-volver',
 god:'https://clubgodoycruz.com.ar/historia/',
 godAsc:'https://www.pagina12.com.ar/diario/deportes/8-67192-2006-05-21.html',
 tig:'https://www.afa.com.ar/Sitio/posts/copa-superliga-final',
 plat:'https://www.afa.com.ar/blog/posts/platense-es-el-nuevo-campeon-del-futbol-argentino',
 platGol:'https://www.afa.com.ar/calendario/posts/platense-supero-1-0-a-huracan-y-es-campeon-de-la-maxima-categoria',
 cerro:'https://clubcerro.com/cerro-porteno-recuerda-hoy-la-obtencion-del-clausura-2021/',
 cerroFinal:'https://clubcerro.com/a-lo-ciclon-cerro-porteno-es-el-campeon-del-clausura-2021/',
 bar:'https://www.barcelonasc.com.ec/2026/10/26/damian-diaz-91-goles-barcelona-sc/',
 bar90:'https://www.barcelonasc.com.ec/gol-uquillas-emelec-libertadores-1990/',
 barFinal:'https://www.elcomercio.com/deportes/futbol/barcelona-copalibertadores-futbol-historia/',
};
const DADOS={
 'Talleres':{
  atletas:[['José Daniel Valencia','MEI','1975–1987; retorno',null,null,'tall','Um dos maiores ídolos do Talleres segundo a AFA; vice-campeão do Nacional de 1977 e convocado para a seleção mundialista de 1978.']],
  marcos:[[1977,'Vice-campeão argentino do Nacional','tall','Campanha do Talleres de Córdoba com José Daniel Valencia entre os protagonistas.']],
 },
 'Huracán':{
  atletas:[
   ['René Houseman','PD','1973',null,null,'hur','Extremo da equipe histórica campeã do Metropolitano de 1973.'],
   ['Miguel Ángel Brindisi','MEI','1973',null,null,'hur','Meio-campista titular do Huracán campeão do Metropolitano de 1973.'],
   ['Carlos Babington','MEI','1973',null,null,'hur','Um dos principais nomes do ataque coletivo do título de 1973.'],
  ],
  marcos:[[1973,'Título do Torneo Metropolitano','hur','Huracán garantiu a conquista em 16 de setembro de 1973, duas rodadas antes do fim do campeonato.']],
  tecnicos:[['César Luis Menotti','1971–1974','hur','Treinador da equipe campeã do Metropolitano de 1973.']],
 },
 'Belgrano':{
  atletas:[['Pablo Vegetti','ATA','2022',null,null,'bel','Atacante integrante do elenco campeão da Primera Nacional e do acesso à elite em 2022.']],
  marcos:[[2022,'Título da Primera Nacional e acesso à Primeira Divisão','bel','Belgrano de Córdoba confirmou acesso com vitória por 3 a 2 sobre Brown de Adrogué.']],
  tecnicos:[['Guillermo Farré','2022','bel','Treinador do acesso à Primeira Divisão, listado na ficha oficial da AFA.']],
 },
 'Godoy Cruz':{
  atletas:[
   ['Sebastián Torrico','GOL','2006',null,null,'godAsc','Goleiro da campanha do primeiro acesso à Primeira Divisão em 2006.'],
   ['David Ramírez','MEI','2007–2008; 2009–2011; 2012–2013',null,null,'banSilva','Referência do Godoy Cruz, com três passagens documentadas pela AFA até 2013.'],
  ],
  marcos:[[2006,'Primeiro acesso à Primeira Divisão','god','Godoy Cruz conquistou a Primera B Nacional 2005/06 após final com o Nueva Chicago.']],
  tecnicos:[['Juan Manuel Llop','2005–2006','godAsc','Treinador do título e primeiro acesso do Godoy Cruz à divisão principal.']],
 },
 'Banfield':{
  atletas:[['Santiago Silva','ATA','2009',null,null,'banSilva','Um dos pilares da equipe campeã nacional em 2009, segundo retrospectiva da AFA.']],
  marcos:[[2009,'Primeiro título argentino na era profissional','ban','Banfield conquistou o título nacional com Julio César Falcioni como treinador.']],
  tecnicos:[['Julio César Falcioni','2009','ban','Técnico do título nacional de 2009, confirmado pela AFA.']],
 },
 'Gimnasia La Plata':{
  atletas:[['Franco Niell','ATA','2009',null,null,'gimNiell','Marcou duas vezes contra o Atlético Rafaela na promoção de 2009, preservando o Gimnasia na primeira divisão.']],
  marcos:[[1993,'Conquista da Copa Centenario da AFA','gim','Roberto Perfumo treinou o Gimnasia no torneio comemorativo do centenário da AFA.'],
   [2009,'Dois gols de Franco Niell na promoção','gimNiell','O atacante marcou dois gols decisivos para a permanência do Gimnasia na elite nacional.']],
  tecnicos:[['Roberto Perfumo','1993','gim','Treinador vencedor da Copa Centenario organizada pela AFA.']],
 },
 'Tigre':{
  atletas:[
   ['Federico González','ATA','2019',null,null,'tig','Atacante do elenco do Tigre campeão da Copa de la Superliga em 2019.'],
   ['Diego Castaño','VOL','2004–2014',null,null,'banSilva','Ídolo da geração do acesso à Primeira Divisão e três vice-campeonatos nacionais.'],
  ],
  marcos:[[2019,'Primeira Copa de la Superliga','tig','Tigre venceu a edição de 2019, com decisão contra o Boca Juniors.']],
  tecnicos:[['Néstor Gorosito','2019','tig','Treinador da conquista da Copa de la Superliga 2019.']],
 },
 'Platense':{
  atletas:[['Guido Mainero','PD','2025',null,null,'platGol','Autor do gol da vitória por 1 a 0 sobre o Huracán na final do Apertura de 2025.']],
  marcos:[[2025,'Primeiro título de primeira divisão do Platense','plat','Campeão do Torneo Apertura 2025 após derrotar o Huracán.']],
  tecnicos:[['Favio Orsi e Sergio Gómez','2025','plat','Dupla técnica campeã da Primeira Divisão argentina no Apertura de 2025.']],
 },
 'Cerro Porteño':{
  atletas:[
   ['Claudio Aquino','MEI','2021',null,null,'cerroFinal','Meia do Cerro Porteño campeão paraguaio do Clausura de 2021.'],
   ['Robert Morales','ATA','2021',null,null,'cerroFinal','Atacante lançado pelo técnico Francisco Arce na decisão do Clausura de 2021.'],
  ],
  marcos:[[2021,'34º título paraguaio: Clausura 2021','cerro','O Cerro Porteño empatou por 2 a 2 diante do Guaraní em reação dramática e conquistou o torneio.']],
  tecnicos:[['Francisco Arce','2021','cerroFinal','Treinador da conquista do Clausura de 2021.']],
 },
 'Barcelona de Guayaquil':{
  atletas:[
   ['Washington Muñoz','ATA','décadas de 1960–1970',null,101,'bar','Líder do levantamento de gols publicado pelo clube em 2026: 101 gols somando Campeonato do Guayas, campeonato nacional e Libertadores.'],
   ['Manuel Uquillas','ATA','1990',null,92,'bar','92 gols no recorte de competições reconhecidas pelo levantamento de 2026; autor do gol contra o Emelec nas quartas da Libertadores de 1990.'],
   ['Nicolás Asencio','ATA','1997–1998',null,93,'bar','93 gols no recorte institucional do clube; campeão equatoriano de 1997 e finalista da Libertadores de 1998.'],
  ],
  recordes:[],
  marcos:[[1990,'Primeira final de Libertadores do Barcelona SC','barFinal','Equipe de Guayaquil terminou vice-campeã da Copa Libertadores de 1990.'],
   [1998,'Segunda final da Libertadores','barFinal','Vice-campeonato diante do Vasco da Gama em 1998.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte inexistente lote 12: '+k);return FONTES[k];};
export const ACERVO_CLUBES_LOTE12=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
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
