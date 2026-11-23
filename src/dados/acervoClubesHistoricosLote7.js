/**
 * ACERVO HISTÓRICO — LOTE 7 · SÉRIE B DO BRASIL
 * Sete clubes ainda sem fichas no catálogo principal. Pesquisa datada:
 * 2026-11-23. Fontes institucionais oficiais e reportagens verificáveis.
 * Metadados ausentes permanecem null; marcos setoriais não viram recordes gerais.
 */
const FONTES={
 saob:'https://ge.globo.com/sp/futebol/times/sao-bernardo/noticia/2026/03/21/romisson-vira-referencia-no-sao-bernardo-para-a-serie-b-em-busca-de-mais-um-acesso.ghtml',
 saoHist:'https://saobernardofc.com.br/2025/10/12/sao-bernardo-jogara-a-serie-b-pela-primeira-vez-apos-dois-anos-batendo-na-trave/',
 nov:'https://www.gremionovorizontino.com.br/2026/03/09/novorizontino-encerra-campanha-historica-como-vice-campeao-do-paulistao-2026/',
 cui:'https://www.cuiabaesporteclube.com.br/noticia/155/cuiaba-e-coritiba-tem-historico-de-jogos-equilibrado/',
 atl:'https://ge.globo.com/mg/zona-da-mata-centro-oeste/futebol/noticia/2024/06/18/artilheiro-das-4-divisoes-do-brasileiro-ex-corinthians-e-cruzeiro-se-torna-maior-goleador-da-historia-do-athletic.ghtml',
 athHist:'https://athleticclub.com.br/o-clube/historia/',
 vil:'https://ge.globo.com/go/futebol/brasileirao-serie-c/noticia/2015/10/grande-demais-para-serie-c-veja-raio-x-dos-tres-acessos-do-vila-nova.html',
 vilHist:'https://www.vilanovafc.com.br/titulos',
 bot:'https://botafogofutebolsa.com.br/socrateshall/',
 botRai:'https://botafogofutebolsa.com.br/rai-halldafama/',
 lon:'https://www.londrinaesporteclube.com.br/noticia/2026/1/29/germano-e-o-novo-coordenador-das-categorias-de-base-do-londrina',
};
const DADOS={
 'São Bernardo':{
  atletas:[['Romisson','VOL','2021–2026',null,null,'saob','Volante com seis temporadas no Tigre do ABC em 2026; referência na campanha do primeiro acesso à Série B.']],
  marcos:[[2025,'Primeiro acesso à Série B nacional','saoHist','São Bernardo FC alcançou a Série B de 2026 após campanha na Série C de 2025.']],
 },
 'Novorizontino':{
  atletas:[['Robson','ATA','2026',null,null,'nov','Artilheiro do Campeonato Paulista de 2026 pelo Novorizontino, com sete gols no torneio.']],
  marcos:[[2026,'Vice-campeonato paulista e artilharia de Robson','nov','Equipe eliminou Santos e Corinthians e disputou a decisão; Robson somou sete gols no Estadual.']],
 },
 'Cuiabá':{
  atletas:[['Deyverson','ATA','2022–2024',null,null,'cui','Autor de gol na vitória fora de casa por 3 a 0 contra o Coritiba no Campeonato Brasileiro de 2023.']],
  marcos:[[2023,'Vitória de 3 a 0 sobre o Coritiba fora de casa','cui','Partida do Brasileirão de 2023 com gols de Deyverson, Pitta e Raniele.']],
 },
 'Athletic Club':{
  atletas:[['Jonathas','ATA','2024',null,null,'atl','Tornou-se maior artilheiro histórico do Athletic em junho de 2024, segundo levantamento jornalístico.']],
  marcos:[[2024,'Jonathas supera a marca histórica do Athletic','atl','Atingiu 15 gols na temporada até junho de 2024; não confundir este recorte com seu total pelo clube.'],
   [2024,'Vice-campeonato da Série C e acesso à Série B','athHist','A equipe mineira conquistou acesso à Série B pela primeira vez.']],
 },
 'Vila Nova':{
  atletas:[['Frontini','ATA','2013–2015',null,null,'vil','Artilheiro do Vila Nova nas campanhas dos acessos de 2013 e 2015, conforme retrospectiva da Série C.']],
  marcos:[[1996,'Campeão invicto da Série C','vilHist','Primeiro dos três títulos da Série C contabilizados pelo Vila Nova.'],
   [2015,'Campeão da Série C','vilHist','Segundo título nacional da Terceira Divisão.'],
   [2020,'Campeão da Série C','vilHist','Terceiro título nacional da Terceira Divisão.']],
 },
 'Botafogo-SP':{
  atletas:[
   ['Sócrates','MEI','1974–1978',null,null,'bot','Formado no Pantera, símbolo histórico do clube; protagonista do título da Taça Cidade de São Paulo em 1977.'],
   ['Raí','MEI','1984–1987',null,null,'botRai','Iniciou a carreira profissional pelo Botafogo de Ribeirão Preto antes de se destacar nacionalmente.'],
  ],
  marcos:[[1977,'Sócrates e a Taça Cidade de São Paulo','bot','Na campanha, o Botafogo venceu o Santos na Vila Belmiro por 3 a 2 com dois gols de Sócrates.']],
 },
 'Londrina':{
  atletas:[['Germano','VOL','mais de dez temporadas',null,null,'lon','Ídolo do Londrina, disputou mais de 300 partidas e voltou ao clube como coordenador de base em 2026.']],
  marcos:[[2026,'Germano retorna ao clube como dirigente da base','lon','Após uma trajetória de mais de dez temporadas como jogador, assumiu a coordenação das categorias de base.']],
 },
};
const url=f=>{if(!FONTES[f])throw new Error('Fonte desconhecida no lote 7: '+f);return FONTES[f]};
export const ACERVO_CLUBES_LOTE7=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-23',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>
  Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:url(f)}))),
 recordes:Object.freeze((d.recordes||[]).map(([id,atleta,valor,f,criterio])=>
  Object.freeze({tipo:'clube',nome:clube,id,atleta,valor,criterio,fonte:url(f),comparavel:false,data:'2026-11-23'}))),
 marcos:Object.freeze((d.marcos||[]).map(([ano,titulo,f,descricao])=>
  Object.freeze({ano,titulo,descricao,fonte:url(f)}))),
})])));
