/**
 * A JOIA — ACERVO HISTÓRICO · LOTE 9: os 23 clubes da Série D no catálogo.
 * Referências institucionais/CBF/federações e apurações jornalísticas
 * identificadas por clube. Atualizado em 24/11/2026.
 *
 * Zero jamais substitui ausência de fonte: jogos/gols null = não apurado.
 * Marca por UMA competição/temporada é descrita como marco, nunca transformada
 * em recorde de carreira; feitos simulatórios são mantidos separados.
 */
const FONTES={
 abc:'https://www.abcfc.com.br/historia/titulos/campeao-brasileiro-serie-c-2010',
 abcTe:'https://ge.globo.com/rn/abc-100-anos/noticia/2015/06/em-2010-abc-coloca-o-rio-grande-do-norte-no-rol-dos-campeoes-nacionais.html',
 asa:'https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-d/a/asa-encerra-serie-d-2026-com-orgulho-pelo-vice-campeonato',
 gama:'https://www.correiobraziliense.com.br/app/noticia/superesportes/2008/12/20/interna_superesportes%2C59301/amp.shtml',
 goia:'https://www.fgf.esp.br/pt/clubes/view.php?q=266',
 nac:'https://fafamazonas.com.br/site/noticia/e-campeao--nacional-vence-amazonas-por-2-a-1-e-conquista-o-barezao-sicredi-2026/',
 nacGols:'https://ge.globo.com/am/futebol/times/nacional-am/noticia/2026/03/21/hernane-brocador-celebra-titulo-do-amazonense-mostramos-quem-e-o-maior-do-estado.ghtml',
 uber:'https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-d/a/uberlandia-e-campeao-da-serie-d-2026',
 uberJ:'https://ge.globo.com/to/futebol/noticia/2026/09/14/veja-os-numeros-do-tocantinense-tomas-bastos-na-campanha-do-titulo-do-uberlandia.ghtml',
 uberCoach:'https://www.uberlandiasaf.com.br/uberlandia-saf-renova-com-o-tecnico-danilo-para-temporada-2027/',
 csa:'https://ge.globo.com/al/arquivo/futebol/times/csa/noticia/2023/10/21/csa-celebra-seis-anos-do-titulo-da-serie-c-lembre-como-foi-a-campanha.ghtml',
 america:'https://ge.globo.com/rn/futebol/times/america-rn/noticia/2022/10/13/titulo-brasileiro-e-retorno-a-serie-c-america-rn-divulga-numeros-de-2022.ghtml',
 retro:'https://retrofcbrasil.com.br/noticia/retro-e-campeao-da-serie-d-2024',
 retroJog:'https://www.fpf-pe.com.br/pt/noticias/view.php?q=10702',
 apar:'https://aparecida.go.gov.br/com-empate-em-casa-aparecidense-e-campea-brasileira-da-serie-d',
 aparCoach:'https://radiobandeirantesgoiania.com.br/aparecidense-empata-com-o-campinense-e-conquista-titulo-da-serie-d-do-campeonato-brasileiro/',
 ferro:'https://ge.globo.com/ce/futebol/times/ferroviario/noticia/2023/09/17/com-titulo-ciel-festeja-melhor-temporada-da-carreira.ghtml',
 ferroHist:'https://ge.globo.com/pi/futebol/brasileirao-serie-d/noticia/2023/09/16/ferroviario-garante-titulo-da-serie-d-do-brasileiro-de-2023-veja-lista-com-todos-os-campeoes.ghtml',
 tomb:'https://ge.globo.com/futebol/brasileirao-serie-d/noticia/2014/11/tombense-bate-brasil-pel-nos-penaltis-e-e-campeao-da-serie-d-do-brasileiro.html',
 tombElvis:'https://ge.globo.com/mg/zona-da-mata-centro-oeste/noticia/2014/11/autor-do-gol-do-titulo-da-serie-d-elvis-revela-pedi-para-ser-o-ultimo-bater.html',
 porto:'https://ffer.com.br/Publicacao.aspx?id=394374',
 portoJ:'https://ge.globo.com/ro/futebol/noticia/2025/03/07/luan-viana-destaque-do-porto-velho-em-2024-retorna-ao-clube.ghtml',
 manaus:'https://fcf.com.br/brusque-e-campeao-brasileiro-da-serie-d/',
 manausM:'https://ge.globo.com/am/futebol/times/manaus/noticia/rossini-e-eleito-por-torcedores-como-destaque-do-manaus-em-2019.ghtml',
 sampaio:'https://www.sampaiocorreafc.com.br/historico/',
 aguia:'https://aguiademaraba.com.br/',
 aguiaJ:'https://ge.globo.com/pa/futebol/times/aguia-de-maraba/noticia/2023/05/27/aguia-de-maraba-conquista-titulo-inedito-e-coloca-tecnico-e-atletas-na-vitrine-do-futebol-paraense.ghtml',
 altos:'https://ge.globo.com/pi/futebol/times/altos/noticia/2022/11/17/contratacoes-do-altos-para-2023-veja-quem-chega-quem-fica-e-quem-vai-embora.ghtml',
 altosHist:'https://ge.globo.com/pi/futebol/brasileirao-serie-d/noticia/com-acesso-altos-entra-na-lista-de-clubes-que-conquistaram-facanha-na-serie-d-veja-lista.ghtml',
 treze:'https://ge.globo.com/pb/futebol/times/treze/noticia/flavio-araujo-lamenta-titulo-mas-exalta-campanha-historica-do-treze-na-serie-d.ghtml',
 trezeJ:'https://ge.globo.com/pb/futebol/times/treze/noticia/2026/05/28/treze-revive-roteiros-de-2018-e-2024-na-serie-d-e-pode-se-inspirar-em-campanhas-pelo-acesso.ghtml',
 camp:'https://ge.globo.com/pb/futebol/brasileirao-serie-d/noticia/campinense-e-o-3o-clube-paraibano-a-disputar-uma-decisao-da-serie-d-botafogo-pb-e-treze-ja-estiveram-la.ghtml',
 cian:'https://ge.globo.com/pr/futebol/times/cianorte/noticia/2025/01/09/como-chega-o-cianorte-para-o-paranaense-2025-time-base-reforcos-e-objetivo.ghtml',
 cianMarco:'https://ge.globo.com/pr/futebol/times/cianorte/noticia/2024/01/30/cianorte-reencontra-o-corinthians-19-anos-depois-de-vitoria-marcante-e-tem-dois-ex-timao-no-elenco.ghtml',
 sj:'https://fgf.com.br/noticia/fgf-sauda-acesso-do-sao-jose',
 sjIdolo:'https://gauchazh.clicrbs.com.br/esportes/noticia/2018/07/com-acesso-a-serie-c-sao-jose-apresenta-ao-pais-a-forca-que-o-rio-grande-do-sul-ja-conhecia-cjjexfrol0pm501qomywszspn.html',
 portRJ:'https://www.fferj.com.br/noticias/portuguesa-e-campea-da-copa-rio',
 brasil:'https://ge.globo.com/pb/futebol/brasileirao-serie-d/noticia/2024/08/24/campeoes-nacionais-vice-da-copa-do-brasil-emergentes-veja-quem-esta-na-briga-pelo-acesso-na-serie-d.ghtml',
 brasilId:'https://blogs.correiobraziliense.com.br/dribledecorpo/20-anos-do-brasiliense-montamos-um-time-de-medalhoes-que-passaram-pelo-clube-do-distrito-federal/',
};
const DADOS={
 'ABC':{
  atletas:[['Cascata','ATA','2010',null,null,'abc','Atacante autor do gol do título da Série C de 2010 contra o Ituiutaba.']],
  marcos:[[2010,'Campeão brasileiro da Série C','abc','Campanha que colocou o ABC novamente na Série B.']],
  tecnicos:[['Leandro Campos','2010','abcTe','Treinador do time campeão brasileiro da Série C.']],
 },
 'ASA':{
  atletas:[['Rafael Mariano','GOL','2026',null,null,'asa','Goleiro do elenco do ASA de Arapiraca na campanha do vice da Série D de 2026.']],
  marcos:[[2026,'Vice-campeonato brasileiro da Série D','asa','O ASA de Arapiraca chegou à final, perdendo o título para o Uberlândia.']],
 },
 'Gama':{
  atletas:[['Rodrigo','MEI','1998',null,null,'gama','Autor de oito gols na campanha campeã da Série B 1998; oito é recorte daquela edição.']],
  marcos:[[1998,'Campeonato Brasileiro da Série B','gama','Conquista de acesso à Série A de 1999.']],
  tecnicos:[['Vágner Benazzi','1998','gama','Treinador da conquista da Série B.']],
 },
 'Goiatuba':{
  atletas:[['Marolla','GOL','1992',null,null,'goia','Goleiro do título goiano de 1992 na geração comandada por Orlando Lelé.']],
  marcos:[[1992,'Campeão goiano','goia','Título de um clube do interior depois de 25 anos de hegemonia de equipes da capital.']],
  tecnicos:[['Orlando Lelé','1992','goia','Técnico do título histórico do Campeonato Goiano.']],
 },
 'Nacional-AM':{
  atletas:[
   ['Hernane Brocador','ATA','2025–2026',null,null,'nacGols','Autor de gol na final do Campeonato Amazonense de 2026 contra o Amazonas FC.'],
   ['Renanzinho','MEI','2026',null,null,'nacGols','Autor do outro gol do Nacional no triunfo da decisão estadual de 2026.'],
  ],
  marcos:[[2026,'Campeão amazonense pela 44ª vez','nac','Nacional venceu o Amazonas por 2 a 1 na final.']],
 },
 'Uberlândia':{
  atletas:[['Tomas Bastos','MEI','2026',null,null,'uberJ','Meia referência na campanha do título da Série D em 2026, com 10 gols durante o torneio.']],
  marcos:[[2026,'Campeão brasileiro da Série D','uber','Título nacional conquistado diante do ASA de Arapiraca.']],
  tecnicos:[['Danilo','2026','uberCoach','Treinador do campeão de 2026; renovou para 2027.']],
 },
 'CSA':{
  atletas:[['Daniel Costa','MEI','2017',null,null,'csa','Meia da equipe campeã da Série C em 2017, na final diante do Fortaleza.']],
  marcos:[[2017,'Campeonato Brasileiro da Série C','csa','Título conquistado sobre o Fortaleza com empate sem gols na volta.']],
  tecnicos:[['Flávio Barros','2017','csa','Treinador da final que encerrou a campanha campeã.']],
 },
 'América-RN':{
  atletas:[['Wallace Pernambucano','ATA','2022',null,null,'america','Principal artilheiro do América no título da Série D de 2022, com 18 gols naquele campeonato.']],
  marcos:[[2022,'Campeão brasileiro da Série D','america','Conquista do título após a final contra o Pouso Alegre.']],
  tecnicos:[['Leandro Sena','2022','america','Treinador da campanha campeã da Série D.']],
 },
 'Retrô':{
  atletas:[['Júnior Fialho','ATA','2024',null,null,'retroJog','Autor do primeiro gol na vitória de 3 a 1 sobre o Anápolis, pela final da Série D 2024.']],
  marcos:[[2024,'Campeonato Brasileiro Série D','retro','Primeiro título nacional do clube pernambucano.']],
 },
 'Aparecidense':{
  atletas:[['Samuel','ATA','2021',null,null,'apar','Autor do gol do empate na final de 2021 contra o Campinense que confirmou a conquista.']],
  marcos:[[2021,'Campeã brasileira da Série D','apar','Primeiro título nacional do clube, após empate na decisão com o Campinense.']],
  tecnicos:[['Thiago Carvalho','2021','aparCoach','Treinador do título da Série D 2021.']],
 },
 'Ferroviário':{
  atletas:[['Ciel','ATA','2023',null,null,'ferro','Atacante decisivo na campanha invicta do título da Série D em 2023.']],
  marcos:[[2018,'Campeão brasileiro da Série D','ferroHist','Primeira conquista da Série D pelo Ferroviário.'],
   [2023,'Bicampeão brasileiro da Série D','ferro','Conquista invicta da Série D.']],
  tecnicos:[['Paulinho Kobayashi','2023','ferro','Treinador do título nacional de 2023.']],
 },
 'Tombense':{
  atletas:[['Élvis','MEI','2014',null,null,'tombElvis','Meia que converteu o pênalti decisivo para conquistar a Série D 2014.']],
  marcos:[[2014,'Campeão da Série D nos pênaltis','tomb','Final contra o Brasil de Pelotas definida por 4 a 2 nos pênaltis.']],
  tecnicos:[['Eugênio Souza','2014','tombElvis','Treinador da equipe campeã.']],
 },
 'Porto Velho':{
  atletas:[['Luan Viana','ATA','2024',null,null,'portoJ','Em 2024 fez 15 gols na temporada, marca do clube em uma só temporada até a publicação.']],
  marcos:[[2024,'Campeonato Rondoniense','porto','Conquista do tetracampeonato estadual do Porto Velho.'],
   [2025,'Quinto título rondoniense','porto','Título estadual confirmado no histórico da Federação de Rondônia.']],
 },
 'Manaus':{
  atletas:[['Rossini','ATA','2019',null,null,'manausM','Atacante eleito destaque de 2019, autor de quatro gols em partidas decisivas na Série D; ficha com totais da carreira pendente.']],
  marcos:[[2019,'Vice-campeonato da Série D e primeiro acesso nacional','manaus','Final contra o Brusque terminada na disputa por pênaltis, com recorde de público na Arena da Amazônia.']],
 },
 'Sampaio Corrêa':{
  atletas:[
   ['Eloir','MEI','2012',null,null,'sampaio','Autor do primeiro gol na final da Série D 2012 diante do Crac.'],
   ['Pimentinha','PD','2012',null,null,'sampaio','Autor do segundo gol da final da Série D 2012.'],
  ],
  marcos:[[1972,'Título nacional da Série B','sampaio','Primeiro título brasileiro do Sampaio Corrêa.'],
   [1997,'Campeão invicto da Série C','sampaio','Segunda conquista brasileira do clube.'],
   [2012,'Campeão invicto da Série D','sampaio','Final diante do Crac; terceiro título nacional em divisões distintas.']],
 },
 'Águia de Marabá':{
  atletas:[['Axel Lopes','GOL','2023',null,null,'aguiaJ','Goleiro da geração que conquistou o primeiro Campeonato Paraense da história do clube.']],
  marcos:[[2023,'Primeiro Campeonato Paraense','aguia','Águia de Marabá conquistou o título inédito estadual.']],
 },
 'Altos':{
  atletas:[['Manoel','ATA','2016–2022',218,84,'altos','Goleador histórico; 218 jogos e 84 gols até a despedida de 2022, sem extrapolar para retornos.']],
  marcos:[[2020,'Acesso à Série C','altosHist','Classificação às semifinais da Série D assegurou o acesso nacional.']],
 },
 'Treze':{
  atletas:[['Marcelinho Paraíba','MEI','2018',null,null,'trezeJ','Destaque técnico do Treze na campanha de acesso e vice da Série D 2018.']],
  marcos:[[2018,'Vice-campeonato da Série D e acesso','treze','Treze chegou à final nacional contra o Ferroviário.']],
  tecnicos:[['Flávio Araújo','2018','treze','Treinador da campanha do acesso à Série C.']],
 },
 'Campinense':{
  atletas:[['Filipe Ramon','ZAG','2021',null,null,'camp','Jogador do elenco vice-campeão da Série D em 2021; métricas individuais por confirmar.']],
  marcos:[[2021,'Vice-campeonato brasileiro da Série D','camp','Final contra a Aparecidense, após campanha que garantiu o acesso.']],
 },
 'Cianorte':{
  atletas:[['Márcio Machado','ATA','2005',null,null,'cianMarco','Atacante autor de dois dos três gols da vitória histórica sobre o Corinthians pela Copa do Brasil de 2005.']],
  marcos:[[2005,'Vitória de 3 a 0 sobre o Corinthians','cianMarco','Triunfo histórico na Copa do Brasil, em sua primeira participação nacional.'],
   [2025,'Título da Taça FPF','cian','Conquista registrada pelo clube na temporada de 2025.']],
  tecnicos:[['Rafael Ferro','2025','cian','Treinador do time vencedor da Taça FPF 2025.']],
 },
 'São José-RS':{
  atletas:[['Clayton','MEI','2018',null,null,'sjIdolo','Meia da geração do acesso nacional de 2018, citado entre os personagens marcantes do clube.']],
  marcos:[[2018,'Acesso à Série C e Recopa Gaúcha','sj','São José eliminou o Linense e alcançou a semifinal da Série D.']],
  tecnicos:[['Rafael Jaques','2018','sjIdolo','Técnico na campanha do acesso do São José.']],
 },
 'Portuguesa-RJ':{
  atletas:[
   ['Hugo Iglesias','ATA','2025',null,null,'portRJ','Marcou na vitória por 2 a 0 sobre o America na final da Copa Rio.'],
   ['Elicley','ATA','2025',null,null,'portRJ','Autor do gol do título nos acréscimos da final da Copa Rio 2025.'],
  ],
  marcos:[[2023,'Campeonato da Copa Rio','portRJ','Título anterior da Portuguesa da Ilha; não confundir com a Portuguesa de São Paulo.'],
   [2025,'Campeã da Copa Rio','portRJ','Vitória por 2 a 0 sobre o America-RJ assegurou o título e vaga na Série D.']],
 },
 'Brasiliense':{
  atletas:[
   ['Túlio Maravilha','ATA','2002',null,null,'brasilId','Símbolo da primeira conquista nacional do Brasiliense na Série C.'],
   ['Wellington Dias','ATA','2002',null,null,'brasilId','Destaque no elenco campeão brasileiro da Série C em 2002.'],
  ],
  marcos:[[2002,'Campeão brasileiro da Série C','brasil','Primeiro título nacional do clube; também vice-campeão da Copa do Brasil naquele ano.'],
   [2004,'Campeão brasileiro da Série B','brasil','Título e acesso à elite do Campeonato Brasileiro.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw Error('Fonte ausente no lote 9: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE9=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>
  Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze((d.recordes||[]).map(([id,atleta,valor,f,criterio])=>
  Object.freeze({tipo:'clube',nome:clube,id,atleta,valor,criterio,fonte:fonte(f),comparavel:false,data:'2026-11-24'}))),
 marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>
  Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>
  Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
