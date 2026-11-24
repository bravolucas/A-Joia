/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 16 (24/11/2026)
 * Fichas iniciais de Başakşehir, Samsunspor e Göztepe.
 * Fontes: UEFA e Federação Turca de Futebol (TFF). Não inferir totais de carreira.
 */
const FONTES={
 bas:'https://www.uefa.com/uefaeuropaleague/news/025f-0ffe906d566e-2f7a072c2026-1000--how-have-the-europa-league-teams-performed-since-the-break/',
 basVisca:'https://www.uefa.com/uefaeuropaleague/news/0260-102d4d7fb0a8-9ed4c6b7dfd1-1000--europa-league-are-these-the-games-of-the-season/',
 basU:'https://www.uefa.com/uefachampionsleague/news/0264-11022bcea7d7-11facbf5afe9-1000--paris-vs-istanbul-basaksehir-uefa-champions-league-backgroun/',
 sam:'https://www.tff.org/Default.aspx?ftxtId=41082&pageId=200',
 samU:'https://www.uefa.com/uefaconferenceleague/news/029d-1ec2b10450d3-c17b3897688c-1000--uefa-conference-league-matchday-1-what-to-look-out-for/',
 goz:'https://www.tff.org/resources/tamsaha/209/106-107/',
 goz2:'https://www.tff.org/resources/tamsaha/209/104-105/',
 gozCup:'https://www.tff.org/Default.aspx?pageID=411',
};
const DADOS={
 'Başakşehir':{
  atletas:[
   ['Edin Višća','PD','2011–2022',null,null,'basVisca','Destaque da conquista nacional de 2019/20 e autor do gol decisivo contra o Sporting na Europa League.'],
   ['Mahmut Tekdemir','VOL','2006–2024',null,null,'bas','Capitão e referência da equipe campeã turca em 2019/20.'],
  ],
  marcos:[
   [2020,'Primeiro título da Süper Lig','bas','Campeão turco na temporada 2019/20 sob o comando de Okan Buruk.'],
   [2020,'Oitavas de final da Europa League','basU','Avançou até as oitavas da Europa League 2019/20, sendo eliminado pelo Copenhagen.'],
  ],
  tecnicos:[['Okan Buruk','2019–2021','bas','Treinador do primeiro título da Süper Lig do clube em 2019/20.']],
 },
 'Samsunspor':{
  atletas:[['Ahmet Sağat','ATA','2022–2023',null,null,'sam','Integrante do elenco do Samsunspor campeão da segunda divisão turca em 2022/23.']],
  marcos:[
   [2023,'Campeão da 1. Lig turca','sam','Conquistou o campeonato da segunda divisão em 2022/23 e retornou à Süper Lig.'],
   [1998,'Copa Intertoto contra o Crystal Palace','samU','Eliminou o Crystal Palace com vitórias por 2 a 0 nos dois jogos.'],
   [2025,'Retorno às competições europeias','samU','Iniciou campanha na fase de liga da Conference League 2025/26, após a última participação europeia em 1998.'],
  ],
 },
 'Göztepe':{
  atletas:[
   ['Fevzi Zemzem','ATA','1959–1974',null,null,'goz','Atacante histórico e figura central da campanha europeia do fim dos anos 1960.'],
   ['Gürsel Aksel','MEI','anos 1950–1960',null,null,'goz2','Ídolo do clube, autor de gol no confronto com o Atlético de Madrid em 1967.'],
  ],
  marcos:[
   [1969,'Semifinal da Copa das Cidades com Feiras','goz2','Após eliminar Marseille, Argeș Pitești, OFK Beograd e Hamburg, chegou às semifinais de 1968/69.'],
   [1970,'Bicampeão consecutivo da Copa da Turquia','gozCup','Conquistou a Copa da Turquia de 1968/69 e 1969/70.'],
  ],
  tecnicos:[['Adnan Süvari','anos 1960–1970','goz','Técnico da histórica trajetória continental e das conquistas de Copa de 1969 e 1970.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte não localizada no lote 16: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE16=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
