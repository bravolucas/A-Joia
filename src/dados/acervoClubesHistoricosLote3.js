/**
 * Lote 3 — 23/11/2026.
 * Cada ficha tem fonte específica e contagens apenas quando publicadas
 * no recorte informado. Null significa NÃO APURADO (não significa zero).
 * Em recordes, 'comparavel:false' impede vitória fictícia sobre o passado.
 */
const FONTES={
 bahia:'https://www.esporteclubebahia.com.br/la-se-foi-um-dos-maiores/',
 sport:'https://sportrecife.com.br/futebol/sport-realiza-serie-de-acoes-em-homenagem-aos-10-anos-sem-leonardo/',
 sport1984:'https://sportrecife.com.br/futebol/memoria-leonina-ha-40-anos-luiz-carlos-fazia-40-gols-no-pernambucano/',
 ceara:'https://cearasc.com/idolos/',
 cearaGols:'https://www.cearasc.com/noticia/vina-alcanca-marca-de-50-gols-pelo-ceara-e-se-rati',
 cearaMagno:'https://midia.cearasc.com/noticia/magno-alves-estrela-campanha-e-ceara-lanca-camisa-',
 fortaleza:'https://fortaleza1918.com.br/idolo/geraldino-sarava/',
 fortalezaClod:'https://fortaleza1918.com.br/idolo/clodoaldo/',
 fortalezaRin:'https://fortaleza1918.com.br/idolo/rinaldo-2/',
 coritiba:'https://oldsite.coritiba.com.br/NoticiaEMBED/21819',
 goias:'https://antigo.goiasec.com.br/acervo/tbt3-relembre-a-trajetoria-de-lincoln-o-leao-da-serra/',
 goiasF:'https://antigo.goiasec.com.br/acervo/tbt-fernandao-eterna-saudade/',
 ponte:'https://pontepreta.com.br/segundo-maior-artilheiro-da-historia-da-ponte-preta-paulinho-marcou-136-gols-em-274-partidas-entre-1952-a-1960/',
 avai:'https://avai.com.br/tbt-memoria-de-leao-nizeta-o-virtuoso-da-bola-tetra-campeao-catarinense/',
 chape:'https://chapecoense.com/2025/06/10/fechado-com-a-chape-perotti-e-o-novo-reforco-do-verdao/',
 remo:'https://www.remo100porcento.com/futebol-profissional/2026/remo-completa-121-anos-e-reforca-tradicao-como-gigante-do-futebol-da-amazonia',
 paysandu:'https://www.paysandu.com.br/noticias/5061/enquete-para-escolher-os-maiores-jogos-da-curuzu-abre-festejos-dos-100-anos-do-estadio',
 guarani:'https://guaranifc.com.br/destaque/especial-107-anos-idolos/',
 figueirense:'https://figueirense.com.br/nota-de-pesar-albeneir-marques-pereira/',
 figueirenseF:'https://figueirense.com.br/homenagens-campeoes-do-centenario/',
 figueirenseVari:'https://figueirense.com.br/idolo-fernandes-enaltece-diferencial-do-torcedor-do-figueirense/',
 nautico:'https://www.nautico-pe.com.br/noticias/3636/est-dio-dos-aflitos-completa-80-anos',
 nauticoI:'https://www.nautico-pe.com.br/grandes-idolos',
 crb:'https://www.crboficial.com.br/futebol/crb-comemora-113-anos-com-festa-no-casarao',
 mirassol:'https://mirassolfc.com.br/pages/historia',
 racing:'https://www.racingclub.com.ar/idolos/lisandro-lopez/',
 river:'https://www.racingclub.com.ar/primer-equipo/nota/2021/11/13082_la-previa-un-clasico-con-mucho-en-juego/',
 nacional:'https://nacional.uy/noticias/el-debut-del-historico-atilio-garcia',
 nacionalLey:'https://nacional.uy/club/historia/idolos-leyendas',
 atlN:'https://atlnacional.com.co/historia-en-los-clasicos/',
 sporting:'https://www.sporting.pt/pt/noticias/futebol/equipa-principal/2019-04-29/compre-bilhetes-online-para-o-sporting',
 sportingRec:'https://www.sporting.pt/pt/noticias/clube/jornal-sporting/2018-03-10/fazer-justica-a-peyroteo',
 chelsea:'https://www.chelseafc.com/en/news/article/line-of-duty--rank-chelsea-s-leading-appearance-makers',
 bayern:'https://fcbayern.com/en/club/history/mile-stones/1966-to-1979-golden-years',
};
// Arquivo: atletas [nome,posicao,periodo,jogos,gols,fonte,descricao];
// recordes [id,atleta,valor,fonte,recorte], marcos [ano,titulo,fonte,descricao].
const DADOS={
 'Bahia':{
  atletas:[
   ['Carlito','ATA',null,null,233,'bahia','Maior artilheiro na publicação oficial de agosto de 2026.'],
   ['Douglas Franklin','MEI','1972–1980',456,184,'bahia','Segundo maior artilheiro; 86 assistências segundo o clube; 98 gols no Campeonato Baiano.'],
  ],
  recordes:[['golsCarreira','Carlito',233,'bahia','Gols reconhecidos pelo Bahia.']],
 },
 'Sport Recife':{
  atletas:[
   ['Leonardo','ATA',null,null,136,'sport','Terceiro maior artilheiro do clube; há divergências nas fontes do clube sobre o total de jogos.'],
   ['Luiz Carlos','ATA','1984',null,null,'sport1984','Marcou 40 gols no Campeonato Pernambucano de 1984, recorde da edição pelo clube.'],
  ],
  recordes:[],
  marcos:[[1984,'Luiz Carlos: 40 gols no Pernambucano','sport1984','Recorde do Sport em uma única edição do Estadual.']],
 },
 'Ceará':{
  atletas:[
   ['Gildo','ATA',null,null,null,'ceara','Identificado pelo Ceará como maior artilheiro da história; contagem não apurada nesta fonte.'],
   ['Sérgio Alves','ATA',null,null,141,'cearaGols','Artilheiro histórico do século XXI, não confundir com recorde absoluto.'],
   ['Magno Alves','ATA',null,224,103,'cearaMagno','Ídolo, seis vezes citado entre os maiores goleadores do clube em publicação institucional.'],
  ],
  recordes:[],
 },
 'Fortaleza':{
  atletas:[
   ['Geraldino Saravá','ATA','década de 1970',null,127,'fortaleza','Maior artilheiro histórico segundo o clube: 127 gols oficiais e mais de 150 incluindo outras partidas.'],
   ['Clodoaldo','ATA',null,null,126,'fortalezaClod','Segundo maior artilheiro, segundo publicação institucional do Fortaleza.'],
   ['Rinaldo','ATA',null,null,108,'fortalezaRin','Ídolo conhecido como Homem-Raio; marcou quatro gols em um Clássico-Rei.'],
  ],
  recordes:[['golsCarreira','Geraldino Saravá',127,'fortaleza','Apenas partidas oficiais contabilizadas pelo clube.']],
 },
 'Coritiba':{
  atletas:[['Jairo do Nascimento','GOL',null,null,null,'coritiba','Goleiro histórico com sequência de 933 minutos sem sofrer gols, recorde apontado pelo clube.']],
  recordes:[],
  marcos:[[null,'Jairo: 933 minutos sem sofrer gols','coritiba','Marca histórica de invencibilidade do goleiro; não confundir com jogos sem sofrer gols.']],
 },
 'Goiás':{
  atletas:[
   ['Araújo','ATA',null,null,145,'goias','Maior artilheiro histórico segundo levantamento do clube.'],
   ['Fernandão','ATA',null,null,108,'goiasF','Quarto maior artilheiro, campeão estadual em 1996, 1997, 1998, 1999 e 2000.'],
  ],
  recordes:[['golsCarreira','Araújo',145,'goias','Contagem histórica publicada pelo Goiás.']],
 },
 'Ponte Preta':{
  atletas:[
   ['Dicá','MEI',null,581,155,'ponte','Maior artilheiro no ranking citado em matéria institucional; 581 partidas.'],
   ['Paulinho','ATA','1952–1960',274,136,'ponte','Segundo maior artilheiro no levantamento publicado pelo clube.'],
  ],
  recordes:[['golsCarreira','Dicá',155,'ponte','Contagem do arquivo institucional da Ponte Preta.']],
 },
 'Avaí':{
  atletas:[
   ['Saul Oliveira','ATA',null,null,219,'avai','Maior artilheiro do clube no levantamento centenário.'],
   ['Nizeta','MEI','décadas de 1930–1940',290,172,'avai','Segundo maior artilheiro; tetracampeão catarinense de 1942 a 1945.'],
   ['Marquinhos Santos','MEI',null,null,94,'avai','Ídolo; 94 gols em sua trajetória pelo clube, não confundir com gols no estádio da Ressacada.'],
  ],
  recordes:[['golsCarreira','Saul Oliveira',219,'avai','Todos os jogos registrados no almanaque histórico do clube.']],
  marcos:[[1945,'Tetracampeonato estadual de Nizeta e Saul','avai','Títulos em sequência: 1942, 1943, 1944 e 1945.']],
 },
 'Chapecoense':{
  atletas:[
   ['Bruno Rangel','ATA',null,null,null,'chape','Reconhecido pela Chapecoense como seu maior artilheiro histórico; sem valor numérico nesta fonte.'],
   ['Índio','ATA',null,null,null,'chape','Segundo maior artilheiro segundo apresentação oficial de Pedro Perotti em 2025.'],
  ],
  recordes:[],
 },
 'Remo':{
  atletas:[['Dadinho','ATA',null,null,163,'remo','Maior goleador histórico segundo retrospectiva do Remo 100%; publicação de fonte secundária.']],
  recordes:[['golsCarreira','Dadinho',163,'remo','Retrospectiva secundária; confirmar metodologia com o clube.']],
 },
 'Paysandu':{
  atletas:[['Bené','ATA',null,null,249,'paysandu','Maior artilheiro segundo a memória histórica publicada pelo próprio Paysandu.']],
  recordes:[['golsCarreira','Bené',249,'paysandu','Contagem histórica declarada pelo Paysandu.']],
 },
 'Guarani':{
  atletas:[['Careca','ATA','1976–1983',null,null,'guarani','Campeão brasileiro de 1978 pelo Guarani e da Taça de Prata de 1981, segundo a memória do clube.']],
  recordes:[],
  marcos:[[1978,'Título brasileiro com Careca','guarani','Conquista histórica do Campeonato Brasileiro.']],
 },
 'Figueirense':{
  atletas:[
   ['Fernandes','MEI',null,null,null,'figueirenseF','Maior artilheiro histórico; publicações do próprio clube divergem entre 107 e 108 gols, contagem em revisão.'],
   ['Albeneir Marques Pereira','ATA',null,221,93,'figueirense','221 partidas e 93 gols, documentados pelo Figueirense.'],
  ],
  recordes:[],
 },
 'Náutico':{
  atletas:[
   ['Bita','ATA',null,null,223,'nautico','Maior artilheiro do Náutico, conforme memória publicada pelo clube.'],
   ['Ivson de Freitas','ATA','1952–1956',159,118,'nauticoI','Quinto maior artilheiro no levantamento histórico do clube.'],
  ],
  recordes:[['golsCarreira','Bita',223,'nautico','Total reconhecido pela memória institucional do clube.']],
 },
 'CRB':{
  atletas:[['Joãozinho Paulista','ATA',null,null,null,'crb','Apresentado pelo clube como o maior artilheiro histórico de Alagoas; recorde específico do CRB não quantificado.']],
  recordes:[],
 },
 'Mirassol':{
  atletas:[['Reinaldo','LE','2025',null,null,'mirassol','Destaque na campanha de estreia na Série A: 11 gols em 2025 como artilheiro da equipe.']],
  recordes:[],
  marcos:[[2020,'Título nacional da Série D','mirassol','Conquistou a Série D da temporada 2020, concluída em 2021.'],
         [2022,'Título nacional da Série C','mirassol','Conquistou a Série C de 2022.'],
         [2025,'Primeira classificação direta à Libertadores','mirassol','Na temporada centenária, permaneceu invicto em casa na Série A.']],
 },
 'Racing Club':{
  atletas:[['Lisandro López','ATA','2005–2009; 2016–2021',null,null,'racing','Ídolo homenageado pelo Racing, campeão argentino em 2019.']],
  recordes:[],
 },
 'River Plate':{
  atletas:[['Ángel Labruna','ATA',null,null,null,'river','Ídolo do River; o próprio Racing registra 19 gols dele no clássico entre os clubes.']],
  recordes:[],
 },
 'Nacional de Montevidéu':{
  atletas:[['Atilio García','ATA','1938–1951',329,330,'nacional','329 partidas e 330 gols oficiais; considerando também outras partidas, 466 gols em 441 jogos. 22 títulos oficiais no clube.']],
  recordes:[['golsCarreira','Atilio García',330,'nacional','Gols em partidas oficiais segundo a comissão de história do Nacional.']],
  marcos:[[1943,'Quinquenio de Oro','nacional','Cinco Campeonatos Uruguaios consecutivos de 1939 a 1943.']],
 },
 'Atlético Nacional':{
  atletas:[['Víctor Hugo Aristizábal','ATA',null,null,null,'atlN','Ídolo e artilheiro com 19 gols no clássico diante do Independiente Medellín, segundo o clube.']],
  recordes:[],
 },
 'Sporting':{
  atletas:[['Fernando Peyroteo','ATA','1937–1949',332,540,'sporting','540 gols em 332 jogos oficiais, segundo publicação institucional do Sporting.']],
  recordes:[['golsCarreira','Fernando Peyroteo',540,'sportingRec','Partidas oficiais; publicações históricas do clube diferem por um gol, revisar confronto de registros.']],
 },
 'Chelsea':{
  atletas:[['Frank Lampard','MEI','2001–2014',648,211,'chelsea','Maior goleador histórico do Chelsea no registro oficial; 648 partidas pelo clube.']],
  recordes:[['golsCarreira','Frank Lampard',211,'chelsea','Todos os torneios contabilizados pela instituição.']],
 },
 'Bayern de Munique':{
  atletas:[['Gerd Müller','ATA','1964–1979',null,null,'bayern','Ídolo da era de ouro do Bayern; marcou 40 gols na Bundesliga 1971/72.']],
  recordes:[],
  marcos:[[1972,'Gerd Müller: 40 gols na Bundesliga','bayern','Marca da temporada 1971/72 em apenas uma competição; não igualar ao total anual de todas as competições.']],
 },
};
const verificarFonte=(f)=>{if(!FONTES[f])throw new Error('Fonte inexistente no lote 3: '+f);return FONTES[f];};
export const ACERVO_CLUBES_LOTE3=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,dados])=>[clube,
 Object.freeze({clube,atualizadoEm:'2026-11-23',atletas:Object.freeze(dados.atletas.map(
 ([nome,posicao,periodo,jogos,gols,fonte,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:verificarFonte(fonte)}))),
 recordes:Object.freeze(dados.recordes.map(([id,atleta,valor,fonte,recorte])=>Object.freeze({
  tipo:'clube',nome:clube,id,atleta,valor,fonte:verificarFonte(fonte),data:'2026-11-23',
  comparavel:false,criterio:recorte,
 }))),
 marcos:Object.freeze((dados.marcos||[]).map(([ano,titulo,fonte,descricao])=>Object.freeze({
  ano,titulo,descricao,fonte:verificarFonte(fonte)
 }))),
 })
])));
