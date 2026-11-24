/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 15 (24/11/2026)
 * Turquia: fichas iniciais documentadas pela UEFA e pelos clubes.
 * Números de carreira não verificados permanecem null; marcos não são recordes absolutos.
 */
const FONTES={
 gala:'https://www.uefa.com/uefaeuropaleague/news/016e-0e6a3091ff2c-b6d02ad6a643-1000--1999-2000-galatasaray-the-pride-of-turkey/',
 galaH:'https://www.uefa.com/news-media/news/0253-0d7b44063db3-f7b83163252b-1000--hagi-makes-galatasaray-return/',
 galaSuper:'https://pt.uefa.com/uefasupercup/history/2000/',
 fener:'https://www.uefa.com/uefaeuropaleague/news/025a-0ea912f5e9ed-90dc9e4cb850-1000--fenerbahce-hold-off-lazio-to-book-semi-date/',
 fenerSemi:'https://www.uefa.com/uefaeuropaleague/history/seasons/2013/clubs/',
 bes:'https://www.uefa.com/uefachampionsleague/news/0239-0e972a5a1938-a72d3dd3f48b-1000--besiktas-retain-turkish-league-title/',
 besU:'https://www.uefa.com/uefachampionsleague/news/023a-0e94e0c9fede-3a84530875c7-1000--club-facts-besiktas/',
 trab:'https://www.uefa.com/uefachampionsleague/news/0278-15e7be65ad83-1c6a4d4fdb7e-1000--trabzonspor-vs-copenhagen-facts/',
};
const DADOS={
 'Galatasaray':{
  atletas:[
   ['Gheorghe Hagi','MEI','1996–2001',null,null,'galaH','Líder técnico do ciclo vencedor da Copa UEFA de 1999/2000.'],
   ['Mário Jardel','ATA','2000–2001',null,null,'galaSuper','Autor dos dois gols contra o Real Madrid na Supercopa da UEFA de 2000, incluindo o gol de ouro.'],
  ],
  marcos:[
   [2000,'Campeão da Copa UEFA','gala','Conquistou a Copa UEFA 1999/2000 superando o Arsenal nos pênaltis na final.'],
   [2000,'Campeão da Supercopa da UEFA','galaSuper','Venceu o Real Madrid por 2 a 1 com gol de ouro de Mário Jardel.'],
  ],
  tecnicos:[['Fatih Terim','1996–2000','gala','Treinador da equipe campeã da Copa UEFA de 1999/2000.']],
 },
 'Fenerbahçe':{
  atletas:[['Dirk Kuyt','ATA','2012–2015',null,null,'fener','Atacante da campanha europeia que levou o clube às semifinais em 2012/13.']],
  marcos:[[2013,'Primeira semifinal europeia','fener','Eliminou a Lazio nas quartas da Europa League de 2012/13 e chegou às semifinais.']],
 },
 'Beşiktaş':{
  atletas:[
   ['Ricardo Quaresma','PD','2010–2012; 2015–2019',null,null,'bes','Destaque ofensivo do bicampeonato turco em 2015/16 e 2016/17.'],
   ['Anderson Talisca','MEI','2016–2018',null,null,'bes','Meio-campista do time bicampeão turco e da campanha europeia de 2017/18.'],
  ],
  marcos:[
   [2017,'Bicampeonato turco consecutivo','bes','Conquistou a liga de 2016/17 após vencer a edição de 2015/16.'],
   [2018,'Oitavas de final da Champions League','besU','Chegou às oitavas de final da Liga dos Campeões de 2017/18.'],
  ],
  tecnicos:[['Şenol Güneş','2015–2019','bes','Treinador das conquistas nacionais de 2015/16 e 2016/17.']],
 },
 'Trabzonspor':{
  atletas:[],
  marcos:[[2022,'Campeão turco após 38 anos','trab','Conquistou a Süper Lig 2021/22, primeiro título nacional desde 1983/84; sétimo até aquela edição.']],
  tecnicos:[['Abdullah Avcı','2020–2023','trab','Treinador do título da Süper Lig 2021/22.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte não encontrada no lote 15: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE15=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
