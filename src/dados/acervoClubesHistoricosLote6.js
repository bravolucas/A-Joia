/**
 * ACERVO HISTÓRICO · LOTE 6 (23/11/2026).
 * 25 entidades EXATAMENTE como cadastradas em data.js.
 * Fontes institucionais: clubes, CBF, FIFA e CONMEBOL. Em caso de ausência
 * de contagem de jogos/gols comparável, utiliza null e mantém a explicação.
 */
const FONTES={
 ath:'https://ge.globo.com/pr/futebol/times/athletico-pr/noticia/heroi-em-2001-alex-mineiro-relembra-titulo-pelo-athletico-o-mais-importante-da-carreira.ghtml',
 vit:'https://www.cbf.com.br/selecao-brasileira/noticias/selecao-masculina/a/bebeto-completa-61-anos',
 ame:'https://www.americafc.com.br/comunicado-oficial-jair-bala',
 cri:'https://www.criciuma.com.br/noticias/o-clube/paulo-baier-recebe-homenagem-pelos-150-jogos',
 atl:'https://atleticogoianiense.com.br/noticias/atletico-goianiense-e-sao-paulo-fundacao-nos-anos-30-confronto-nos-anos-50-e-a-marca-de-goleiros-artilheiros.html',
 juv:'https://www.juventude.com.br/blog/flavio-campos-e-o-novo-diretor-executivo-de-futebol-do-juventude',
 juvLinha:'https://www.juventude.com.br/linha-do-tempo',
 ope:'https://www.operarioferroviario.com.br/wp-content/uploads/2024/04/2021-Relatorio-de-Gestao-Tecnica.pdf',
 bra:'https://www.redbullbragantino.com/br-pt/noticias/idolo-mauro-silva-completa-53-anos',
 pen:'https://gol.conmebol.com/libertadores/pt-br/news/os-maiores-artilheiros-da-historia-da-conmebol-libertadores',
 penGols:'https://gol.conmebol.com/libertadores/pt-br/news/quem-e-o-maior-artilheiro-da-historia-da-conmebol-libertadores-veja-como-esta-disputa',
 ind:'https://gol.conmebol.com/libertadores/pt-br/news/quem-sao-os-campeoes-mundiais-que-disputarao-conmebol-libertadores-2026',
 est:'https://gol.conmebol.com/libertadores/pt-br/news/da-fase-preliminar-ao-topo-quem-conquistou-conmebol-libertadores-partir-das-fases-preliminares',
 arg:'https://gol.conmebol.com/libertadores/pt-br/news/quem-sao-os-campeoes-mundiais-que-disputarao-conmebol-libertadores-2026',
 ros:'https://gol.conmebol.com/libertadores/pt-br/news/rosario-central-na-conmebol-libertadores-2026-resultados-elenco-e-calendario',
 idv:'https://gol.conmebol.com/libertadores/pt-br/news/independiente-del-valle-en-la-conmebol-libertadores-2026-resultados-plantel-y-calendario',
 ldu:'https://gol.conmebol.com/libertadores/pt-br/news/grupo-g-da-conmebol-libertadores-2026-tabela-equipes-e-horarios-dos-confrontos',
 junior:'https://gol.conmebol.com/libertadores/pt-br/news/cerro-porteno-junior-conmebol-libertadores',
 uc:'https://gol.conmebol.com/libertadores/pt-br/news/zampedri-o-hexacampeao-de-artilharia-do-chile-que-aquece-voz-na-conmebol-libertadores',
 oli:'https://inside.fifa.com/tournaments/mens/worldcup/2018russia/news/santa-cruz-it-s-hard-to-take-retiring-from-paraguay-2848741',
 san:'https://gol.conmebol.com/sudamericana/pt-br/news/pela-segunda-os-campeoes-que-disputarao-conmebol-sudamericana-em-2026',
 colo:'https://gol.conmebol.com/libertadores/pt-br/news/arruabarrena-o-torcedor-quer-conmebol-libertadores-e-uma-obsessao',
 mil:'https://inside.fifa.com/es/news/adolfo-pedernera-maquinista-bailarin-y-maestro-2604270',
 lan:'https://gol.conmebol.com/sudamericana/pt-br/news/pela-grande-conquista-comeca-fase-de-grupos-da-conmebol-sudamericana',
 newell:'https://inside.fifa.com/tournaments/mens/clubworldcup/uae2018/news/argentina-versus-brazil-semi-sizzlers',
 uch:'https://inside.fifa.com/es/news/leonel-sanchez-una-zurda-divina',
 vel:'https://velez.com.ar/junta-historica/notas/2021/08/31/090901_velez-campeon-de-america-1994',
};
const DADOS={
 'Athletico-PR':{
  atletas:[['Alex Mineiro','ATA','2001–2003; 2007; 2009–2010',null,null,'ath','Decisivo no primeiro título brasileiro do clube, em 2001, com gols na final contra o São Caetano.']],
  marcos:[[2001,'Campeonato Brasileiro com Alex Mineiro','ath','Alex Mineiro foi destaque e marcou o gol do título diante do São Caetano.']],
 },
 'Vitória':{
  atletas:[['Bebeto','ATA','1982–1983; 1997 e outras passagens',null,null,'vit','Revelado profissionalmente pelo Vitória e campeão da Copa do Nordeste e do Campeonato Baiano em 1997.']],
  marcos:[[1997,'Copa do Nordeste com Bebeto','vit','Bebeto voltou ao clube e conquistou a competição regional e o Campeonato Baiano.']],
 },
 'América-MG':{
  atletas:[['Jair Bala','ATA',null,null,null,'ame','Ídolo máximo segundo nota oficial do América; artilheiro estadual em seu primeiro ano no clube.']],
 },
 'Criciúma':{
  atletas:[['Paulo Baier','MEI','1997–1998; 2002; 2014',null,null,'cri','Ídolo homenageado pela marca de 150 jogos; campeão catarinense de 1998 e da Série B de 2002.']],
  marcos:[[2002,'Série B com Paulo Baier','cri','Conquista do Campeonato Brasileiro da Série B; o meia marcou três gols na final.']],
 },
 'Atlético-GO':{
  atletas:[['Márcio','GOL',null,null,null,'atl','Goleiro-artilheiro do Dragão, com 37 gols citados na retrospectiva oficial de 2021.']],
  marcos:[[null,'37 gols do goleiro Márcio','atl','Marca específica para um goleiro; não representa o recorde global de gols dos atletas de linha.']],
 },
 'Juventude':{
  atletas:[
   ['Flávio Campos','VOL','1995–1999',null,null,'juv','Capitão do Gaúcho de 1998 e da Copa do Brasil de 1999, confirmado pela instituição.'],
   ['Laurinho','ZAG',null,572,null,'juvLinha','Participou de 572 partidas segundo a linha do tempo publicada pelo Juventude.'],
  ],
  marcos:[[1998,'Campeonato Gaúcho','juv','Conquista estadual com Flávio Campos como capitão.'],
   [1999,'Copa do Brasil','juvLinha','Campeão nacional com Flávio Campos como capitão e Valmir Louruz como treinador.']],
  tecnicos:[['Valmir Louruz','1999','juvLinha','Treinador do título da Copa do Brasil de 1999.']],
 },
 'Operário-PR':{
  atletas:[['Simão','GOL','2016–2019',null,null,'ope','Goleiro do elenco campeão da Série D de 2017 e Série C de 2018; atingiu 100 jogos em julho de 2019.']],
  marcos:[[2017,'Campeonato Brasileiro Série D','ope','Título nacional com Simão entre os jogadores.'],
   [2018,'Campeonato Brasileiro Série C','ope','Título da divisão seguinte, em temporadas consecutivas.']],
 },
 'Bragantino':{
  atletas:[['Mauro Silva','VOL','final dos anos 1980–1992',null,null,'bra','Ídolo da geração campeã paulista de 1990 e vice-campeã brasileira em 1991.']],
  marcos:[[1990,'Campeonato Paulista de 1990','bra','Título marcante do Bragantino com Mauro Silva no elenco.']],
 },
 'Peñarol':{
  atletas:[['Fernando Morena','ATA','1973–1979; 1981–1983',null,null,'pen','Lenda do Peñarol: gol decisivo contra o Cobreloa na final da Libertadores de 1982.']],
  marcos:[[1982,'Quarta Libertadores com gol de Morena','pen','Fernando Morena marcou o gol decisivo; soma 37 gols na história da Libertadores segundo o levantamento de 2026.']],
 },
 'Independiente':{
  atletas:[['Ricardo Bochini','MEI','1972–1991',null,null,'ind','Cinco vezes campeão da Libertadores pelo Independiente segundo retrospectiva da CONMEBOL.']],
  marcos:[[1984,'Quinta Libertadores de Bochini','ind','A conquista de 1984 foi a quinta edição vencida por Ricardo Bochini no clube.']],
 },
 'Estudiantes de La Plata':{
  atletas:[['Juan Sebastián Verón','MC','1994–1996; 2006–2014',null,null,'est','Liderou a retomada do clube, campeão argentino em 2006 e da Libertadores de 2009.']],
  marcos:[[2009,'Libertadores de Juan Sebastián Verón','est','Primeiro clube a conquistar a edição da Libertadores após iniciar na primeira fase preliminar.']],
  tecnicos:[['Alejandro Sabella','2009','est','Treinador na conquista continental de 2009.']],
 },
 'Argentinos Juniors':{
  atletas:[['Claudio Borghi','MEI','anos 1980',null,null,'arg','Integrante da geração que conquistou a Libertadores de 1985 com Argentinos Juniors.']],
  marcos:[[1985,'Copa Libertadores de 1985','arg','A equipe tinha Claudio Borghi e Sergio Batista em seu elenco.']],
 },
 'Rosario Central':{
  atletas:[['Ángel Di María','PD','2005–2007; 2025–2026',null,null,'ros','Ídolo revelado pelo Central; liderou o retorno do clube à Libertadores em 2026.']],
  marcos:[[2026,'Retorno de Ángel Di María à Libertadores','ros','Rosario Central disputou sua 14ª Libertadores com Di María como referência.']],
 },
 'Independiente del Valle':{
  atletas:[
   ['Moisés Caicedo','VOL','categorias de base e profissional',null,null,'idv','Formado pelo Independiente del Valle, posteriormente transferido ao futebol inglês.'],
   ['Willian Pacho','ZAG','categorias de base',null,null,'idv','Formado pelo clube equatoriano antes de atuar no futebol europeu.'],
  ],
  marcos:[[2019,'Primeira Sul-Americana do IDV','idv','O clube foi campeão da CONMEBOL Sudamericana de 2019.'],
   [2022,'Segunda Sul-Americana do IDV','idv','Bicampeonato continental confirmado pela CONMEBOL.']],
 },
 'LDU de Quito':{
  atletas:[
   ['Joffre Guerrón','PD','2008',null,null,'ldu','Atacante equatoriano de destaque na Libertadores de 2008.'],
   ['José Francisco Cevallos','GOL','2008',null,null,'ldu','Goleiro equatoriano de destaque na campanha continental.'],
  ],
  marcos:[[2008,'Primeira Libertadores da LDU','ldu','A equipe campeã foi comandada pelo argentino Edgardo Bauza.']],
  tecnicos:[['Edgardo Bauza','2008','ldu','Treinador do título da Libertadores de 2008.']],
 },
 'Junior de Barranquilla':{
  atletas:[['Teófilo Gutiérrez','ATA',null,null,null,'junior','Referência do setor ofensivo do Junior; voltou a marcar na Libertadores de 2026.']],
 },
 'Universidad Católica':{
  atletas:[['Fernando Zampedri','ATA','2020–2026',null,null,'uc','Maior artilheiro histórico da Universidad Católica; contagem citada de 157 gols na publicação, recorte a conferir antes de afirmar recorde absoluto por todas as competições.']],
  marcos:[[2024,'Zampedri assume a liderança histórica de gols','uc','Em outubro de 2024 chegou ao 119º gol na contagem descrita pela CONMEBOL.']],
 },
 'Olimpia':{
  atletas:[['Roque Santa Cruz','ATA','1997–1999; retorno em 2016',null,null,'oli','Estreou pelo Olimpia aos 15 anos, em 1997, e retornou ao clube em 2016.']],
 },
 'San Lorenzo':{
  atletas:[['Leandro Romagnoli','MEI','2002; 2014',null,null,'san','Camisa 10 e criador do time campeão da primeira Copa Sul-Americana, em 2002.']],
  marcos:[[2002,'Primeira CONMEBOL Sul-Americana','san','Campeão da edição inaugural com Romagnoli no meio-campo.'],
   [2014,'Primeira Libertadores','san','Conquista continental do clube na competição principal.']],
 },
 'Colo-Colo':{
  atletas:[['Luis Pérez','ATA','1991',null,null,'colo','Marcou pelo menos dois gols em finais da Libertadores de 1991 segundo retrospectiva da CONMEBOL.']],
  marcos:[[1991,'Libertadores de 1991','colo','Primeiro título chileno na principal competição continental de clubes; Luis Pérez foi decisivo.']],
 },
 'Millonarios':{
  atletas:[['Adolfo Pedernera','MEI','final dos anos 1940–anos 1950',null,null,'mil','Lenda do Ballet Azul dos Millonarios, conforme perfil histórico da FIFA.']],
 },
 'Lanús':{
  atletas:[['José Sand','ATA','anos 2000–2020',null,null,'lan','Veterano goleador do Lanús; em 2022 figurava entre os atletas mais longevos a marcar na Sul-Americana.']],
 },
 "Newell's Old Boys":{
  atletas:[['Maxi Rodríguez','MEI','década de 2000; 2012–2021',null,null,'newell','Protagonista do Newell’s na semifinal da Libertadores de 2013 diante do Atlético-MG.']],
 },
 'Universidad de Chile':{
  atletas:[['Leonel Sánchez','PE','décadas de 1950–1960',null,null,'uch','Ídolo do Ballet Azul, com mais de 500 jogos e 200 gols no recorte biográfico da FIFA.']],
  marcos:[[1959,'Campeonato chileno com Leonel Sánchez','uch','A virada histórica da Universidad de Chile culminou no título nacional de 1959.']],
 },
 'Vélez Sarsfield':{
  atletas:[['José Luis Chilavert','GOL','1992–2000',null,null,'vel','Goleiro protagonista da Libertadores e do título mundial interclubes de 1994.']],
  marcos:[[1994,'Libertadores sob comando de Carlos Bianchi','vel','Vélez superou o São Paulo na decisão, com Chilavert no gol.'],
   [1994,'Título mundial interclubes','vel','Vélez derrotou o Milan na decisão do Mundial Intercontinental de 1994.']],
  tecnicos:[['Carlos Bianchi','1994','vel','Treinador dos títulos internacionais de 1994.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Lote 6: fonte não registrada: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE6=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-23',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>
  Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze((d.recordes||[]).map(([id,atleta,valor,f,criterio])=>
  Object.freeze({tipo:'clube',nome:clube,id,atleta,valor,criterio,fonte:fonte(f),comparavel:false,data:'2026-11-23'}))),
 marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>
  Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>
  Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
