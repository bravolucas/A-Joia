/**
 * A JOIA — acervo histórico lote 32 (24/11/2026).
 * Fontes institucionais dos clubes, FFF, Ligue 1 e City Football Group.
 * Registrar temporadas e títulos por edição; totais de carreira permanecem null.
 * As duas finais europeias do Reims são vices, não títulos.
 */
const F={
 lorientHistoria:'https://www.fclorient.bzh/lhistoire-du-club/',
 lorientCopa:'https://www.fclorient.bzh/coupe-de-france-la-premiere-coupe-des-merlus/',
 lorientLiga:'https://www.fclorient.bzh/a-laube-de-sa-saison-centenaire-le-fc-lorient-vient-de-tourner-une-page-memorable-de-son-histoire/',
 troyesHistoria:'https://www.estac.fr/le-club/histoire/',
 troyesEuropa:'https://www.estac.fr/estac-lepopee-europeenne/',
 troyesLigue:'https://www.cityfootballgroup.com/clubs/estac-troyes',
 reims:'https://www.stade-de-reims.com/palmares/',
 reimsDatas:'https://www.stade-de-reims.com/les-dates-cles/',
};
const m=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:F[f]});
const a=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[f]});
const t=(nome,periodo,descricao,f)=>Object.freeze({nome,periodo,descricao,fonte:F[f]});
export const ACERVO_CLUBES_LOTE32=Object.freeze({
 Lorient:Object.freeze({
  clube:'Lorient',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([a('Jean-Claude Darcheville','ATA','2000–2002','Autor do gol da final da Copa da França de 2002 diante do Bastia.','lorientCopa')]),
  marcos:Object.freeze([
   m(1926,'Fundação do FC Lorient','Fundado em 2 de abril de 1926 a partir da equipe Marée Sportive.','lorientHistoria'),
   m(2002,'Campeão da Copa da França','Vitória de 1 a 0 contra o SC Bastia na final.','lorientCopa'),
   m(2002,'Vice-campeão da Copa da Liga','Final contra Bordeaux na mesma temporada; resultado não é título.','lorientHistoria'),
   m(2025,'Campeão da Ligue 2','Título de 2024/25, garantindo o retorno à elite francesa.','lorientLiga'),
  ]),
  tecnicos:Object.freeze([]),recordes:Object.freeze([]),
 }),
 Troyes:Object.freeze({
  clube:'Troyes',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   m(1986,'Fundação do clube atual','A associação troyana que se tornaria o ESTAC foi criada em 1986, sucedendo projetos anteriores da cidade.','troyesHistoria'),
   m(2001,'Campeão da Copa Intertoto','Conquistou a Copa Intertoto da UEFA em decisão contra o Newcastle United.','troyesEuropa'),
   m(2015,'Campeão da Ligue 2','Título da segunda divisão francesa da temporada 2014/15.','troyesHistoria'),
   m(2021,'Campeão da Ligue 2','Título da segunda divisão francesa da temporada 2020/21.','troyesLigue'),
  ]),
  tecnicos:Object.freeze([t('Alain Perrin','1993–2002','Treinador na conquista da Copa Intertoto de 2001.','troyesEuropa')]),
  recordes:Object.freeze([]),
 }),
 Reims:Object.freeze({
  clube:'Reims',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   ...[1949,1953,1955,1958,1960,1962].map(ano=>m(ano,'Campeão francês','Título nacional da edição encerrada em '+ano+'.','reims')),
   ...[1950,1958].map(ano=>m(ano,'Campeão da Copa da França','Conquista da edição encerrada em '+ano+'.','reims')),
   ...[1956,1959].map(ano=>m(ano,'Vice-campeão da Copa dos Campeões da Europa','Final diante do Real Madrid; não contabilizar como título europeu.','reimsDatas')),
  ]),
  tecnicos:Object.freeze([]),recordes:Object.freeze([]),
 }),
});
