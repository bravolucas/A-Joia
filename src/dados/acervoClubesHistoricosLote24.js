/**
 * A JOIA — ACERVO HISTÓRICO · LOTE 24 (24/11/2026)
 * Identidades e marcos respaldados pelas fichas institucionais da Saudipedia.
 * Jogadores não documentados e recordes não apurados ficam vazios.
 */
const FONTE={
 riyadh:'https://saudipedia.com/en/al-riyadh-club',
 raed:'https://saudipedia.com/en/al-raed-club',
 damac:'https://saudipedia.com/en/damac-club',
 kholood:'https://saudipedia.com/en/al-kholood-club',
};
const marco=(ano,titulo,descricao,fonte)=>Object.freeze({ano,titulo,descricao,fonte:FONTE[fonte]});
const atleta=(nome,posicao,descricao,fonte)=>Object.freeze({nome,posicao,periodo:null,jogos:null,gols:null,descricao,fonte:FONTE[fonte]});
const DADOS={
 'Al-Riyadh':{
  atletas:[
   atleta('Khaled Al-Qarouni','MC','Meio-campista saudita listado entre os atletas de destaque da história do clube.','riyadh'),
   atleta('Fahad Al-Hamdan','ATA','Atacante saudita mencionado entre os principais jogadores históricos do Al-Riyadh.','riyadh'),
   atleta('Talal Al-Jebreen','MC','Meio-campista relacionado na lista institucional de jogadores relevantes.','riyadh'),
  ],
  marcos:[
   marco(1953,'Fundação como Ahli Riyadh','Clube fundado em 1953, posteriormente denominado Al-Yamamah e Al-Riyadh.','riyadh'),
   marco(1994,'Campeão da Crown Prince Cup','Conquistou a Copa do Príncipe Herdeiro saudita em 1994.','riyadh'),
   marco(1995,'Campeão da Copa da Federação Saudita','Conquistou a Saudi Football Federation Cup em 1995.','riyadh'),
  ],
 },
 'Al-Raed':{
  atletas:[],
  marcos:[
   marco(1954,'Fundação como Al Ahli de Buraidah','Criado em 1954 por jovens da cidade de Buraidah, na região de Al-Qassim.','raed'),
   marco(1962,'Registro oficial do clube','Registrado junto ao Ministério da Educação, responsável pela documentação esportiva.','raed'),
   marco(1968,'Mudança de nome para Al-Raed','Passou a utilizar o nome Al-Raed Club em 1968.','raed'),
  ],
 },
 'Damac':{
  atletas:[],
  marcos:[
   marco(1966,'Fundação do clube','Estabelecido sob supervisão do centro de desenvolvimento social de Khamis Mushayt.','damac'),
   marco(1972,'Registro oficial','Formalmente aprovado e registrado como clube esportivo em 1972.','damac'),
   marco(2019,'Criação da academia esportiva','Abriu uma academia para identificação e desenvolvimento de talentos em 12 de janeiro de 2019.','damac'),
  ],
 },
 'Al-Kholood':{
  atletas:[],
  marcos:[
   marco(1970,'Fundação em Ar-Rass','Clube criado em Ar-Rass, na província de Al-Qassim.','kholood'),
   marco(2017,'Acesso à segunda divisão','Conquistou o acesso à Second Division saudita em 2017.','kholood'),
   marco(2020,'Acesso à Yelo League','Subiu à Primeira Divisão saudita, conhecida como Yelo League, em 2020.','kholood'),
   marco(2024,'Primeiro acesso à Saudi Pro League','Alcançou a elite do futebol saudita pela primeira vez na temporada de 2024.','kholood'),
  ],
 },
};
export const ACERVO_CLUBES_LOTE24=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas),
 marcos:Object.freeze(d.marcos),
 recordes:Object.freeze([]),
 tecnicos:Object.freeze([]),
})])));
