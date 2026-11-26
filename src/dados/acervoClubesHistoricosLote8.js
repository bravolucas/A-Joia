/**
 * ACERVO HISTÓRICO DE CLUBES — LOTE 8, Série C
 * Datas de pesquisa: novembro/2026. Fontes: CBF, federações, clubes, GE,
 * Diário do Nordeste e publicações esportivas.
 * Nunca transformar gols por campeonato em gols por toda a carreira.
 */
const FONTES={
 ana:'https://www.cbf.com.br/futebol-brasileiro/noticias/detalhes/competicoes-campeonato-brasileiro-serie-d/na-semi-da-serie-d-retro-itabaiana-anapolis-e-maringa-garantem-acesso-a-serie-c',
 anaAt:'https://ge.globo.com/go/futebol/times/atletico-go/noticia/2024/10/08/atletico-go-contrata-kevyn-vice-campeao-da-serie-d-com-o-anapolis.ghtml',
 ama:'https://ge.globo.com/am/futebol/times/amazonas-fc/noticia/2026/10/22/ha-tres-anos-amazonas-conquistava-o-brasil-com-titulo-inedito-da-serie-c.ghtml',
 amaS:'https://ge.globo.com/am/futebol/times/amazonas-fc/noticia/2025/04/09/de-saida-no-amazonas-desde-2023-atacante-sassa-pode-estar-a-caminho-do-criciuma.ghtml',
 barra:'https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro/serie-d/e-campeao-barra-conquista-o-titulo-da-serie-d-2025',
 boto:'https://ge.globo.com/pb/futebol/noticia/jogos-historicos-da-paraiba-botafogo-pb-vence-o-juventude-e-fica-com-o-titulo-da-serie-d-de-2013.ghtml',
 botoTre:'https://ge.globo.com/pb/noticia/2013/11/botafogo-vence-o-juventude-por-2-0-e-faz-historia-no-futebol-da-paraiba.html',
 bru:'https://www.cbf.com.br/futebol-brasileiro/noticias/detalhes/competicoes-campeonato-brasileiro-serie-b/brusque-sc-completa-37-anos-de-historia',
 bruPi:'https://ge.globo.com/sc/futebol/times/brusque/noticia/2020/04/09/junior-pirambu-exalta-vaga-em-selecao-historica-do-brusque-orgulho-muito-grande.ghtml',
 cax:'https://ge.globo.com/rs/futebol/times/caxias/noticia/2023/03/31/veja-por-onde-andam-os-campeoes-do-gauchao-pelo-caxias-em-2000.ghtml',
 conf:'https://ge.globo.com/se/futebol/times/confianca/noticia/2024/10/07/confianca-anuncia-saidas-de-italo-e-willians-santana.ghtml',
 confK:'https://ge.globo.com/se/noticia/2025/04/23/idolo-do-confianca-kivel-revisita-trajetoria-no-futebol-sergipano-em-entrevista-ao-zyb-podcast.ghtml',
 fer:'https://ge.globo.com/sp/ribeirao-preto-e-regiao/futebol/times/ferroviaria/noticia/2024/09/05/ferroviaria-completa-1-ano-do-acesso-a-serie-c-com-10-remanescentes-e-chance-de-subir-a-serie-b.ghtml',
 flor:'https://ge.globo.com/ce/futebol/times/floresta/noticia/do-amador-ao-acesso-a-serie-c-floresta-se-transforma-e-reaviva-memorias-do-neto-do-fundador.ghtml',
 flor2:'https://diariodonordeste.verdesmares.com.br/jogada/analise-floresta-mostra-forca-e-faz-historia-com-o-vice-da-serie-d-de-2020-1.3043818',
 lime:'https://interdelimeira.com/conquistas/',
 limeHist:'https://interdelimeira.com/nossa-historia/',
 itab:'https://ge.globo.com/se/futebol/times/itabaiana/noticia/2026/10/03/apos-tres-anos-e-mais-de-70-jogos-goleiro-jefferson-deixa-o-itabaiana.ghtml',
 itabTre:'https://ge.globo.com/se/futebol/times/itabaiana/noticia/2024/10/13/diretoria-do-itabaiana-confirma-renovacao-de-contrato-com-tecnico-roberto-cavalo.ghtml',
 itu:'https://ituanofc.com/clube/',
 ituTre:'https://ge.globo.com/sp/sorocaba/futebol/noticia/2015/08/tecnico-da-ponte-doriva-acompanha-eliminacao-do-ituano-na-copa-do-brasil.html',
 mac:'https://ge.globo.com/ma/futebol/times/maranhao/noticia/2026/10/12/mac-faz-proposta-para-ter-clessione-de-volta-na-temporada-2027.ghtml',
 macTre:'https://ge.globo.com/ma/futebol/times/maranhao/noticia/2025/09/08/marcinho-guerreiro-vive-auge-da-carreira-com-acesso-historico-do-maranhao-a-serie-c.ghtml',
 mar:'https://gmconline.com.br/esportes/maringa-fc-confirma-o-retorno-do-meio-campista-rodrigo-santos-na-reapresentacao-apos-o-natal/',
 marOf:'https://maringafc.com.br/o-clube/historia/',
 marTre:'https://ge.globo.com/pr/futebol/times/maringa/noticia/2024/09/01/tecnico-do-maringa-comemora-acesso-e-exalta-continuidade-no-cargo-hoje-entenderam.ghtml',
 santa:'https://santacruzpe.com.br/o-santa/titulos',
 santaRa:'https://www.santacruzpe.com.br/noticias/apos-acordo-raul-deixa-o-arruda-o-santa-cruz-vai-estar-sempre-no-coracao',
 volta:'https://www.cbf.com.br/futebol-brasileiro/noticias/detalhes/jogosdehoje-campeonato-brasileiro-serie-c/volta-redonda-e-campeao-da-serie-c',
 voltaG:'https://www.cbf.com.br/futebol-brasileiro/noticias/detalhes/competicoes-campeonato-brasileiro-serie-c/volta-redonda-vence-athletic-pelo-primeiro-jogo-da-final-da-serie-c',
 ypi:'https://www.yfc.com.br/historia-do-clube/',
 ypiJ:'https://ge.globo.com/sp/campinas-e-regiao/futebol/brasileirao-serie-c/noticia/2016/09/ypiranga-reage-busca-empate-contra-o-guarani-mas-e-eliminado-da-serie-c.html',
};
const DADOS={
 'Anápolis':{
  atletas:[['Kevyn','LE','2024',37,1,'anaAt','Disputou 37 partidas e marcou um gol na trajetória pelo Anápolis até outubro de 2024; integrou a campanha do vice da Série D.']],
  marcos:[[2024,'Vice-campeonato da Série D e acesso à Série C','ana','Anápolis avançou à semifinal da Série D, assegurando o acesso de 2025.']],
 },
 'Amazonas FC':{
  atletas:[['Sassá','ATA','2023–2025',null,29,'amaS','Artilheiro histórico do Amazonas segundo levantamento de abril de 2025: 29 gols pelo clube até aquela data; foram 18 na Série C 2023.']],
  marcos:[[2023,'Campeão brasileiro da Série C','ama','Sassá marcou o gol que decidiu o título na partida de volta contra o Brusque.']],
 },
 'Barra-SC':{
  atletas:[['Ewerton','GOL','2025',null,null,'barra','Goleiro do Barra-SC na decisão da Série D de 2025 contra o Santa Cruz.']],
  marcos:[[2025,'Primeiro título nacional: Série D','barra','Após vencer a ida por 2 a 1, empatou a volta por 0 a 0 e conquistou a Série D.']],
 },
 'Botafogo-PB':{
  atletas:[['Warley','ATA','2013',null,null,'boto','Atacante decisivo no título brasileiro da Série D de 2013; fez dois gols no jogo de ida da final contra o Juventude.']],
  marcos:[[2013,'Campeão brasileiro da Série D','boto','Conquista diante do Juventude, primeira taça nacional de equipe paraibana segundo retrospectiva.']],
  tecnicos:[['Marcelo Vilar','2013','botoTre','Técnico da conquista brasileira da Série D de 2013.']],
 },
 'Brusque':{
  atletas:[['Júnior Pirambu','ATA','2019',null,null,'bruPi','Artilheiro da Série D de 2019 com 10 gols na competição; também campeão da edição pelo Brusque.']],
  marcos:[[2019,'Título nacional da Série D','bru','Brusque conquistou seu primeiro título brasileiro, com Júnior Pirambu como artilheiro do torneio.']],
 },
 'Caxias':{
  atletas:[['Paulo Turra','ZAG','2000',null,null,'cax','Capitão da equipe campeã gaúcha em 2000, com vitória por 3 a 0 e empate em 0 a 0 contra o Grêmio.']],
  marcos:[[2000,'Campeonato Gaúcho de 2000','cax','Caxias derrotou o Grêmio de Ronaldinho Gaúcho na final.']],
  tecnicos:[['Tite','2000','cax','Técnico responsável pelo título estadual de 2000.']],
 },
 'Confiança':{
  atletas:[
   ['Leandro Kível','ATA','2014–2015',null,40,'confK','Ídolo com 40 gols na trajetória pelo Confiança, bicampeão sergipano em 2014 e 2015.'],
   ['Ítalo','MEI','2018–2024',184,null,'conf','184 partidas pelo Dragão até sua saída em 2024; esteve no acesso nacional de 2019.'],
  ],
  marcos:[[2014,'Acesso histórico à Série C','confK','Com Leandro Kível, o Confiança alcançou a Série C do Brasileiro.'],
   [2019,'Acesso à Série B','conf','Ítalo fez parte do elenco do retorno à segunda divisão nacional.']],
 },
 'Ferroviária':{
  atletas:[['Xavier','VOL','2023–2024',null,null,'fer','Autor de gol na campanha do acesso à Série C em 2023, quando a Ferroviária foi vice-campeã da Série D.']],
  marcos:[[2023,'Vice-campeonato da Série D e acesso à Série C','fer','Equipe de Araraquara subiu à Série C de 2024.']],
 },
 'Floresta':{
  atletas:[
   ['Flávio Torres','ATA','2020',null,null,'flor','Marcou na vitória da semifinal da Série D de 2020 sobre o Novorizontino que levou o Floresta à final.'],
   ['Núbio Flávio','ATA','2020',null,null,'flor','Também marcou na semifinal contra o Novorizontino na campanha de acesso.'],
  ],
  marcos:[[2020,'Vice-campeonato da Série D e acesso à Série C','flor2','Final contra o Mirassol; o torneio de 2020 terminou no começo de 2021.']],
 },
 'Inter de Limeira':{
  atletas:[['Kita','ATA','1986',null,null,'lime','Artilheiro do Campeonato Paulista de 1986, edição na qual a Inter foi campeã com o ataque mais positivo da disputa.']],
  marcos:[[1986,'Primeiro clube do interior a conquistar o Paulistão','lime','Inter de Limeira derrotou o Palmeiras nas finais de 1986.'],
   [1988,'Campeão da Série Amarela do Campeonato Brasileiro','limeHist','Título nacional registrado na história do clube para a temporada de 1988.']],
 },
 'Itabaiana':{
  atletas:[['Jefferson','GOL','2024–2026',76,null,'itab','Goleiro que fez 76 jogos em três temporadas e participou do acesso à Série C em 2024.']],
  marcos:[[2024,'Acesso à Série C depois de 20 anos','itab','Goleiro Jefferson integrado ao elenco do retorno nacional do Itabaiana.']],
  tecnicos:[['Roberto Cavalo','2024','itabTre','Técnico do acesso à Série C em 2024.']],
 },
 'Ituano':{
  atletas:[
   ['Django','ATA','1984–1989',null,147,'itu','Maior artilheiro histórico do Ituano segundo o clube: 147 gols em seis temporadas.'],
   ['Vagner','GOL','2014',null,null,'ituTre','Goleiro da campanha do bicampeonato paulista, conforme memória da decisão de 2014.'],
  ],
  recordes:[['golsCarreira','Django',147,'itu','147 gols em seis temporadas segundo o histórico oficial do Ituano.']],
  marcos:[[2002,'Campeonato Paulista','itu','Primeiro título estadual da era moderna do Ituano.'],
   [2003,'Campeonato Brasileiro da Série C','itu','Primeiro título nacional da instituição.'],
   [2014,'Bicampeonato paulista','ituTre','Conquistou o campeonato contra o Santos.']],
  tecnicos:[['Doriva','2014','ituTre','Treinador do título paulista de 2014.']],
 },
 'Maranhão':{
  atletas:[['Clessione','ATA','2022; 2024–2025',null,null,'mac','Destaque do Maranhão no acesso de 2025, com três gols na temporada documentada no levantamento de 2026.']],
  marcos:[[2025,'Primeiro acesso à Série C nacional','macTre','Maranhão garantiu vaga na Série C de 2026.']],
  tecnicos:[['Marcinho Guerreiro','2025','macTre','Treinador responsável pelo acesso à Série C em 2025.']],
 },
 'Maringá':{
  atletas:[['Rodrigo Santos','VOL','2024',36,7,'mar','Fez sete gols em 36 jogos em 2024, incluindo gol decisivo do acesso à Série C contra a Inter de Limeira.']],
  marcos:[[2024,'Primeiro acesso à Série C','marOf','Conquista após ser vice-campeão paranaense e disputar a Série D com campanha histórica.']],
  tecnicos:[['Jorge Castilho','2024','marTre','Treinador do acesso à Série C nacional.']],
 },
 'Santa Cruz':{
  atletas:[['Raul','MEI','2013–2014',59,10,'santaRa','Disputou 59 jogos oficiais e marcou 10 gols pelo Santa Cruz; foi campeão pernambucano e da Série C 2013.']],
  marcos:[[2013,'Campeão brasileiro da Série C','santa','Retomada nacional que marcou o centenário coral.'],
   [2016,'Copa do Nordeste','santa','Primeira conquista da competição regional conforme o histórico oficial do clube.']],
 },
 'Volta Redonda':{
  atletas:[['Heliardo','ATA','2024',null,null,'voltaG','Atacante autor do gol da vitória no jogo de ida da final da Série C contra o Athletic.']],
  marcos:[[2016,'Campeão brasileiro da Série D','volta','Primeira conquista nacional do Volta Redonda.'],
   [2024,'Campeão brasileiro da Série C','volta','Conquistou o título sobre o Athletic-MG, com 1 a 0 na ida e 2 a 0 na volta.']],
 },
 'Ypiranga-RS':{
  atletas:[['Marcelinho Paraíba','MEI','2016',null,null,'ypiJ','Meia que fez o gol de empate contra o Guarani na última rodada da Série C de 2016.']],
  marcos:[[2015,'Acesso à Série C','ypi','Ypiranga assegurou a presença na Série C de 2016 após a campanha da Série D 2015.']],
 },
};
const url=f=>{if(!FONTES[f])throw Error('Fonte inexistente no lote 8: '+f);return FONTES[f];};
export const ACERVO_CLUBES_LOTE8=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[
 clube,Object.freeze({
  clube,atualizadoEm:'2026-11-24',
  atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>
   Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:url(f)}))),
  recordes:Object.freeze((d.recordes||[]).map(([id,atleta,valor,f,criterio])=>
   Object.freeze({tipo:'clube',nome:clube,id,atleta,valor,criterio,fonte:url(f),comparavel:false,data:'2026-11-24'}))),
  marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>
   Object.freeze({ano,titulo,descricao,fonte:url(f)}))),
  tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>
   Object.freeze({nome,periodo,descricao,fonte:url(f)}))),
 })
])));
