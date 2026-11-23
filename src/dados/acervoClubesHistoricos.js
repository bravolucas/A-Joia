import {ACERVO_CLUBES_LOTE2} from './acervoClubesHistoricosLote2.js';
import {ACERVO_CLUBES_LOTE3} from './acervoClubesHistoricosLote3.js';
import {ACERVO_CLUBES_LOTE4} from './acervoClubesHistoricosLote4.js';
import {ACERVO_CLUBES_LOTE5} from './acervoClubesHistoricosLote5.js';
/**
 * Acervo de referências históricas de clubes — lote 1 (auditoria em 23/11/2026).
 * Fontes por linha e valores explícitos. NUNCA se tornam estatísticas do save.
 *
 * ATENÇÃO: clubes e historiadores podem contar amistosos ou adotar recortes
 * diferentes. Sem metodologia equivalente ao Arquivo Vivo, comparavel=false.
 * A simulação continua acumulando suas próprias marcas independentemente.
 */
const FONTES = Object.freeze({
 fla: 'https://ge.globo.com/futebol/times/flamengo/lista/2024/03/13/c-maiores-artilheiros-do-flamengo-veja-lista-e-numero-de-gols.ghtml',
 corG: 'https://ge.globo.com/futebol/times/corinthians/lista/2024/04/03/c-maiores-artilheiros-do-corinthians-veja-lista-e-numero-de-gols.ghtml',
 corJ: 'https://ge.globo.com/futebol/times/corinthians/noticia/recordista-em-jogos-do-corinthians-wladimir-ganhara-busto-no-clube.ghtml',
 palG: 'https://palmeiras.com.br/listas-e-rankings/',
 palJ: 'https://www.palmeiras.com.br/craques/ademir-da-guia/',
 palP: 'https://palmeiras.com.br/numeros-e-recordes/',
 spG: 'https://www.saopaulofc.net/enciclopedia-jogadores-recordistas/',
 spI: 'https://www.saopaulofc.net/spfcpedia/grandes-idolos/',
 san: 'https://www.santosfc.com.br/assim-nasce-um-rei/',
 sanP: 'https://www.santosfc.com.br/recorde-de-gols-em-uma-partida/',
 vas: 'https://vasco.com.br/vasco/roberto-dinamite-sera-homenageado-com-trofeu-de-artilheiro-do-brasileirao/',
 flu: 'https://www.fluminense.com.br/noticia/estreia-no-carioca-sera-o-jogo-de-numero-6-mil-da-historia-do-fluminense',
 fluG: 'https://fluminense.com.br/noticia/maior-artilheiro-da-historia-do-flu-waldo-nos-deixa-aos-84-anos',
 botG: 'https://botafogo.com.br/idolos/quarentinha',
 botJ: 'https://www.botafogo.com.br/idolos/nilton-santos',
 gre: 'https://gremio.net/clubedetodos/flecha_negra',
 atlG: 'https://atletico.com.br/idolos/reinaldo/',
 atlJ: 'https://atletico.com.br/idolos/joao-leite/',
 int: 'https://internacional.com.br/clube/idolos/carlitos',
 int2: 'https://www.internacional.com.br/clube/idolos/claudiomiro',
 cruG: 'https://www.mg.superesportes.com.br/app/noticias/especiais/cruzeiro-100-anos/2021/01/03/cruzeiro-100-anos%2C3882778/amp.html',
 cruJ: 'https://www.cnnbrasil.com.br/esportes/futebol/cruzeiro/cruzeiro-parabeniza-fabio-por-recorde-historico-no-futebol/',
 bar: 'https://www.fcbarcelona.com/en/card/2214377/leo-messi',
 rea: 'https://www.realmadrid.com/en-US/the-club/history/football-legends/cristiano-ronaldo-dos-santos-aveiro/',
});
// [nome, posição, período, jogos, gols, fonte, síntese].
// null significa dado NÃO apurado, e jamais zero.
const CLUBES = Object.freeze({
 'Flamengo': {
  atletas: [
   ['Zico','MEI','1971–1983; 1985–1989',732,508,'fla','Maior artilheiro da história do clube.'],
   ['Dida','ATA','1954–1963',358,254,'fla','Segundo maior artilheiro histórico.'],
  ],
  recordes: [['golsCarreira','Zico',508,'fla']],
 },
 'Corinthians': {
  atletas: [
   ['Cláudio Christóvam','ATA','1945–1957',550,306,'corG','Maior artilheiro da história corintiana.'],
   ['Wladimir','LE','1972–1985; 1987',806,32,'corJ','Maior número de partidas na história do clube.'],
  ],
  recordes: [['golsCarreira','Cláudio Christóvam',306,'corG'],['jogosCarreira','Wladimir',806,'corJ']],
 },
 'Palmeiras': {
  atletas: [
   ['Heitor','ATA','1916–1931',null,324,'palG','Maior goleador no ranking atualizado pelo clube em novembro de 2026.'],
   ['Ademir da Guia','MEI','1961–1977',902,155,'palJ','Recordista de atuações e referência da Academia.'],
  ],
  recordes: [['golsCarreira','Heitor',324,'palG'],['jogosCarreira','Ademir da Guia',902,'palJ'],['golsAtletaPartida','Heitor',6,'palP',1920,'Palestra Italia 11 × 0 Internacional-SP (08/08/1920)']],
 },
 'São Paulo': {
  atletas: [
   ['Rogério Ceni','GOL','1993–2015',1237,131,'spI','Goleiro artilheiro; recordista de jogos do clube.'],
   ['Serginho Chulapa','ATA','1973–1982',399,242,'spG','Maior artilheiro do São Paulo.'],
  ],
  recordes: [['golsCarreira','Serginho Chulapa',242,'spG'],['jogosCarreira','Rogério Ceni',1237,'spG']],
 },
 'Santos': {
  atletas: [
   ['Pelé','ATA','1956–1974',1116,1091,'san','O clube contabiliza partidas e gols de toda sua trajetória, inclusive jogos fora de competições oficiais.'],
   ['Araken Patusca','ATA',null,null,null,'sanP','Marcou sete gols em uma partida oficial pelo Santos.'],
  ],
  recordes: [['golsCarreira','Pelé',1091,'san'],['jogosCarreira','Pelé',1116,'san'],['golsAtletaPartida','Araken Patusca',7,'sanP']],
 },
 'Vasco da Gama': {
  atletas: [
   ['Roberto Dinamite','ATA','1971–1979; 1980–1993',1110,708,'vas','Maior artilheiro e recordista de jogos do clube.'],
  ],
  recordes: [['golsCarreira','Roberto Dinamite',708,'vas'],['jogosCarreira','Roberto Dinamite',1110,'vas']],
 },
 'Fluminense': {
  atletas: [
   ['Waldo','ATA','1954–1961',403,319,'fluG','Maior artilheiro do clube.'],
   ['Castilho','GOL','1947–1965',697,null,'flu','Maior número de partidas pelo Fluminense.'],
  ],
  recordes: [['golsCarreira','Waldo',319,'fluG'],['jogosCarreira','Castilho',697,'flu'],['golsTemporada','Waldo',69,'fluG',1959]],
 },
 'Botafogo': {
  atletas: [
   ['Quarentinha','ATA',null,444,313,'botG','Maior goleador histórico do clube.'],
   ['Nílton Santos','LE','1948–1964',723,11,'botJ','A biografia oficial do clube registra 723 partidas (há rankings com recorte de 721).'],
  ],
  recordes: [['golsCarreira','Quarentinha',313,'botG'],['jogosCarreira','Nílton Santos',723,'botJ']],
 },
 'Grêmio': {
  atletas: [
   ['Tarciso','ATA','1973–1986',723,228,'gre','Recordista de jogos e segundo maior artilheiro da história.'],
  ],
  recordes: [['jogosCarreira','Tarciso',723,'gre']],
 },
 'Atlético-MG': {
  atletas: [
   ['Reinaldo','ATA',null,475,255,'atlG','Maior goleador da história do Atlético.'],
   ['João Leite','GOL','1976–1989; 1992',684,null,'atlJ','Jogador com mais partidas pelo Galo.'],
  ],
  recordes: [['golsCarreira','Reinaldo',255,'atlG'],['jogosCarreira','João Leite',684,'atlJ']],
 },
 'Internacional': {
  atletas: [
   ['Carlitos','ATA','1938–1951',null,485,'int','Maior artilheiro colorado, conhecido pela participação nos Gre-Nais.'],
   ['Claudiomiro','ATA',null,null,210,'int2','Terceiro maior goleador segundo o histórico do clube.'],
  ],
  recordes: [['golsCarreira','Carlitos',485,'int']],
 },
 'Cruzeiro': {
  atletas: [
   ['Tostão','ATA','1963–1972',383,245,'cruG','Maior goleador no levantamento histórico do Estado de Minas.'],
   ['Fábio','GOL','2000; 2005–2021',976,null,'cruJ','Mais partidas na história do Cruzeiro.'],
  ],
  recordes: [['golsCarreira','Tostão',245,'cruG'],['jogosCarreira','Fábio',976,'cruJ']],
 },
 'Barcelona': {
  atletas: [['Lionel Messi','ATA','2004–2021',778,672,'bar','Maior goleador e recordista de atuações, segundo o perfil histórico do Barcelona.']],
  recordes: [], // Já registrados em recordesFutebolReais.js.
 },
 'Real Madrid': {
  atletas: [['Cristiano Ronaldo','ATA','2009–2018',438,451,'rea','Maior goleador histórico, segundo o Real Madrid.']],
  recordes: [], // Já registrados em recordesFutebolReais.js.
 },
});
const MAPA = Object.fromEntries(Object.entries(CLUBES).map(([nome,entrada])=>[nome,Object.freeze({
  clube:nome,
  atualizadoEm:'2026-11-23',
  atletas:Object.freeze(entrada.atletas.map(([atleta,posicao,periodo,jogos,gols,f,descricao])=>
   Object.freeze({nome:atleta,posicao,periodo,jogos,gols,descricao,fonte:FONTES[f]}))),
  recordes:Object.freeze(entrada.recordes.map(([id,atleta,valor,f,ano,destaque])=>
   Object.freeze({tipo:'clube',nome,id,atleta,valor,ano,destaque,fonte:FONTES[f],data:'2026-11-23',
    comparavel:false,criterio:'Contagem do acervo histórico; metodologia não necessariamente equivalente às competições simuladas.'}))),
})]));
export const ACERVO_CLUBES_HISTORICOS = Object.freeze({...MAPA,...ACERVO_CLUBES_LOTE2,...ACERVO_CLUBES_LOTE3,...ACERVO_CLUBES_LOTE4,...ACERVO_CLUBES_LOTE5});
export const acervoClubeHistoricoDe = nome => ACERVO_CLUBES_HISTORICOS[nome] || null;
/** Somente métricas explicitamente documentadas. Não contém projeções. */
export const REFERENCIAS_RECORDES_CLUBES = Object.freeze(Object.values(ACERVO_CLUBES_HISTORICOS).flatMap(c=>c.recordes));
