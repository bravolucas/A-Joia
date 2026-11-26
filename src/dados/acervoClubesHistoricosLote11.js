/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 11 (24/11/2026).
 * 11 clubes de Alemanha, Itália e Espanha. Apenas fatos que podem ser
 * associados a uma fonte de UEFA ou Bundesliga; totais desconhecidos = null.
 */
const FONTES={
 atalanta:'https://www.uefa.com/uefaeuropaleague/news/028d-1af3bf5e7e68-7d9202792002-1000--atalanta-3-0-leverkusen-lookman-treble-brings-uefa-europa/',
 atalantaTre:'https://www.uefa.com/uefaeuropaleague/news/028d-1af728f14d65-2d603f3b58f8-1000--match-analysis-2024-europa-league-final-atalanta-3-0-lever/',
 leverkusen:'https://www.bundesliga.com/en/bundesliga/news/bayer-leverkusen-record-unbeaten-run-xabi-alonso-26289',
 leverkusenTit:'https://www.bundesliga.com/en/bundesliga/news/bayer-leverkusen-are-2023-24-bundesliga-champions-26930/',
 frankfurt:'https://www.uefa.com/uefaeuropaleague/news/0275-152d4568b8fe-4c36a5db723e-1000--frankfurt-edge-out-rangers-on-penalties/',
 werder:'https://www.uefa.com/uefasupercup/history/1992/',
 schalke:'https://www.uefa.com/news-media/news/01d9-0e7232d327d9-d0421ac286cc-1000--six-of-the-best-uefa-cup-finals/',
 gladbach:'https://www.uefa.com/uefaeuropaleague/news/01b3-0ea7dafe82a4-0e7a35c0a090-1000--previous-dutch-deciders/',
 gladbachTit:'https://www.uefa.com/uefaeuropaleague/news/0253-0e8262d68383-9b4127768cf0-1000--club-facts-monchengladbach/',
 stuttgart:'https://www.uefa.com/uefachampionsleague/news/0254-0d7bb2860ad2-6d9fc14643b9-1000--gomez-going-nowhere-at-stuttgart/',
 depor:'https://www.uefa.com/uefachampionsleague/news/019c-0e6c12450ff2-294c584e2602-1000--dazzling-depor-ditch-milan/',
 deporTre:'https://www.uefa.com/uefachampionsleague/news/019c-0e6ad4ab2c95-44a6a11e445f-1000--irureta-witnesses-miracle-win/',
 parma:'https://www.uefa.com/uefaeuropaleague/news/0162-0e6a26246bfc-f7b6f7a9f9ec-1000/',
 fiorentina:'https://www.uefa.com/uefaconferenceleague/news/028d-1b01e5ec31a5-144c1f00e4f3-1000--olympiacos-1-0-fiorentina-aet-el-kaabi-swoops-in-to-secure-/',
 fiorentinaTre:'https://www.uefa.com/uefaconferenceleague/news/028e-1b0b6556a5b3-4e91be88b95c-1000--swissquote-match-analysis-olympiacos-1-0-fiorentina/',
 celta:'https://www.uefa.com/uefaeuropaleague/news/0238-0e96cc7955e4-b8efa0cc18fc-1000--celta-v-man-united-background/',
 celtaTre:'https://www.uefa.com/uefaeuropaleague/news/0239-0e96dcc7ab51-33c48e2c11ba-1000--celta-v-man-united-line-ups-where-to-watch-form-guide/',
};
const DADOS={
 'Atalanta':{
  atletas:[['Ademola Lookman','PE','2022–2026',null,null,'atalanta','Marcou três gols na final da Liga Europa de 2023/24 contra o Bayer Leverkusen; marca apenas daquela partida.']],
  marcos:[[2024,'Primeiro título da UEFA Europa League','atalanta','Vitória por 3 a 0 sobre o Bayer Leverkusen, com hat-trick de Lookman, encerrou uma série adversária de 51 jogos sem derrota.']],
  tecnicos:[['Gian Piero Gasperini','2016–2025','atalantaTre','Técnico na conquista europeia de 2024.']],
 },
 'Leverkusen':{
  atletas:[['Florian Wirtz','MEI','2020–2025',null,null,'leverkusen','Atacante criativo central na primeira conquista da Bundesliga pelo Bayer Leverkusen.']],
  marcos:[[2024,'Primeiro campeonato alemão da Bundesliga, invicto','leverkusen','Bayer Leverkusen de 2023/24 terminou as 34 rodadas sem sofrer uma derrota.']],
  tecnicos:[['Xabi Alonso','2022–2025','leverkusenTit','Treinador do título inédito e invicto do Campeonato Alemão em 2023/24.']],
 },
 'Eintracht Frankfurt':{
  atletas:[
   ['Kevin Trapp','GOL','2012–2015; 2018–2025',null,null,'frankfurt','Defesa de pênalti na cobrança de Aaron Ramsey na final da Liga Europa de 2022.'],
   ['Rafael Borré','ATA','2021–2023',null,null,'frankfurt','Fez o gol de empate contra o Rangers e converteu a última cobrança da série na final de 2022.'],
  ],
  marcos:[[2022,'Campeão da UEFA Europa League','frankfurt','Empate por 1 a 1 com o Rangers e vitória por 5 a 4 nos pênaltis em Sevilha.']],
 },
 'Werder Bremen':{
  atletas:[['Wynton Rufer','ATA','1989–1995',null,null,'werder','Marcou contra o Monaco na final da Recopa Europeia de 1992 e contra o Barcelona na Supercopa Europeia daquele ano.']],
  marcos:[[1992,'Recopa Europeia contra o Monaco','werder','Werder Bremen venceu o AS Monaco por 2 a 0 na decisão da competição europeia.']],
 },
 'Schalke 04':{
  atletas:[['Marc Wilmots','MEI','1996–2000; 2001–2003',null,null,'schalke','Fez o gol da vitória do Schalke sobre a Internazionale no jogo de ida da final da Copa UEFA de 1997.']],
  marcos:[[1997,'Título da Copa UEFA diante da Inter','schalke','Após 1 a 1 no agregado, o Schalke venceu o desempate por pênaltis em Milão.']],
 },
 'Borussia Mönchengladbach':{
  atletas:[['Jupp Heynckes','ATA','1963–1967; 1970–1978',null,null,'gladbach','Marcou três gols na vitória por 5 a 1 contra o Twente na decisão da Copa UEFA de 1975.']],
  marcos:[[1975,'Primeira Copa UEFA do Mönchengladbach','gladbach','Vitória por 5 a 1 sobre o Twente no segundo jogo da decisão, com hat-trick de Heynckes.'],
   [1979,'Segundo título da Copa UEFA','gladbachTit','Bicampeonato da competição continental.']],
 },
 'Stuttgart':{
  atletas:[['Mario Gómez','ATA','2003–2009',null,null,'stuttgart','Marcador de 14 gols em 25 jogos somente na Bundesliga de 2006/07, campanha campeã; não é o total no clube.']],
  marcos:[[2007,'Título da Bundesliga de 2006/07','stuttgart','Stuttgart campeão alemão com Mario Gómez entre os destaques ofensivos.']],
 },
 'Deportivo La Coruña':{
  atletas:[
   ['Juan Carlos Valerón','MEI','2000–2013',null,null,'depor','Um dos autores dos gols da vitória por 4 a 0 sobre o Milan nas quartas da Champions League de 2004.'],
   ['Walter Pandiani','ATA','2000–2005',null,null,'depor','Abriu o placar na remontada de 2004 sobre o Milan.'],
   ['Fran','MEI','1988–2005',null,null,'depor','Autor do quarto gol diante do Milan no histórico retorno da Champions League de 2004.'],
  ],
  marcos:[[2004,'Remontada por 4 a 0 diante do Milan','depor','Deportivo reverteu derrota por 4 a 1 na ida e avançou às semifinais da Champions League com placar agregado de 5 a 4.']],
  tecnicos:[['Javier Irureta','1998–2005','deporTre','Treinador da remontada contra o Milan nas quartas de final europeias de 2004.']],
 },
 'Parma':{
  atletas:[
   ['Hernán Crespo','ATA','1996–2000; 2010–2012',null,null,'parma','Marcou um dos gols do Parma na final de 1999 contra o Marseille.'],
   ['Enrico Chiesa','ATA','1996–1999',null,null,'parma','Autor do terceiro gol do Parma na final europeia de 1999.'],
  ],
  marcos:[[1999,'Segundo título da Copa UEFA','parma','Parma venceu o Olympique de Marseille por 3 a 0 na final de 1999.']],
 },
 'Fiorentina':{
  atletas:[['Nicolás González','PD','2021–2024',null,null,'fiorentina','Participou da equipe titular da final da UEFA Conference League de 2024 contra o Olympiacos.']],
  marcos:[[2024,'Vice-campeonato da UEFA Conference League','fiorentina','A Fiorentina chegou à final em Atenas, mas perdeu por 1 a 0 na prorrogação.']],
  tecnicos:[['Vincenzo Italiano','2021–2024','fiorentinaTre','Treinador da Fiorentina que chegou a duas finais consecutivas da Conference League.']],
 },
 'Celta Vigo':{
  atletas:[['Iago Aspas','ATA','2008–2013; desde 2015',null,null,'celta','Chegou às semifinais europeias de 2017 como um dos maiores artilheiros restantes, com cinco gols na edição.']],
  marcos:[[2017,'Primeira semifinal europeia do Celta Vigo','celta','Campanha na UEFA Europa League terminou diante do Manchester United.']],
  tecnicos:[['Eduardo Berizzo','2014–2017','celtaTre','Treinador na primeira semifinal continental do clube, em 2017.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte inexistente no lote 11: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE11=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
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
