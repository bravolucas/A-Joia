/**
 * A JOIA — acervo histórico lote 35 (24/11/2026).
 * Metz: palmarès e história oficiais (fcmetz.com).
 * Guingamp: palmarès oficial do EAG e finais documentadas pela FFF.
 * Não atribuir números de carreira sem recorte e método verificáveis.
 */
const FONTES={
 metzPalmares:'https://www.fcmetz.com/historique/palmares',
 metzHistoria:'https://www.fcmetz.com/historique/histoire-du-club',
 guingampPalmares:'https://www.eaguingamp.com/palmares/',
 guingampHistoria:'https://www.eaguingamp.com/le-club/2010-2015-la-coupe-encore-leurope-en-plus/',
 fffFranca:'https://www.fff.fr/473-palmares-de-la-coupe-de-france.html',
 fffLiga:'https://www.fff.fr/304-palmares-de-la-coupe-de-la-ligue.html',
};
const marco=(ano,titulo,descricao,fonte)=>Object.freeze({ano,titulo,descricao,fonte:FONTES[fonte]});
const jogador=(nome,posicao,periodo,descricao,fonte)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:FONTES[fonte]});
const tecnico=(nome,periodo,descricao,fonte)=>Object.freeze({nome,periodo,descricao,fonte:FONTES[fonte]});
const edicoes=(anos,titulo,fonte)=>anos.map(ano=>marco(ano,titulo,'Título da edição encerrada em '+ano+'.',fonte));

export const ACERVO_CLUBES_LOTE35=Object.freeze({
 Metz:Object.freeze({
  clube:'Metz',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   jogador('Nico Braun','ATA','década de 1970','Atacante identificado pelo próprio FC Metz como maior goleador histórico do clube; números totais não informados nesta ficha.','metzHistoria'),
   jogador('Robert Pirès','MEI','década de 1990','Parte da geração vice-campeã francesa de 1997/98, antes de sair do FC Metz.','metzHistoria'),
   jogador('Sylvain Kastendeuch','ZAG','décadas de 1980 e 1990','Zagueiro histórico citado pelo clube entre os destaques da geração dos anos 1990.','metzHistoria'),
  ]),
  marcos:Object.freeze([
   marco(1932,'Fundação profissional do FC Metz','Em 15 de abril de 1932, o Cercle Athlétique Messin adotou o nome Football Club de Metz ao ingressar no futebol profissional.','metzHistoria'),
   ...edicoes([1935,2007,2014,2019],'Campeão da segunda divisão francesa','metzPalmares'),
   ...edicoes([1984,1988],'Campeão da Copa da França','metzPalmares'),
   ...edicoes([1986,1996],'Campeão da Copa da Liga Francesa','metzPalmares'),
   marco(1984,'Vitória europeia histórica no Camp Nou','Venceu o Barcelona por 4 a 1 fora de casa em 3 de outubro de 1984.','metzHistoria'),
   marco(1998,'Vice-campeão francês','Concluiu a Division 1 1997/98 na segunda posição, atrás do Lens; não equivale a título.','metzPalmares'),
  ]),
  tecnicos:Object.freeze([tecnico('Joël Muller','década de 1990','Treinador associado à geração do FC Metz que disputou o título francês de 1997/98.','metzHistoria')]),
  recordes:Object.freeze([]),
 }),
 Guingamp:Object.freeze({
  clube:'Guingamp',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   jogador('Lionel Mathis','MC','2009–2015','Integrante da equipe do Guingamp nas campanhas que culminaram nas Copas da França de 2009 e 2014.','guingampHistoria'),
  ]),
  marcos:Object.freeze([
   marco(2009,'Campeão da Copa da França','Venceu o Rennes por 2 a 1 na final de 2008/09, atuando na segunda divisão francesa.','fffFranca'),
   marco(2014,'Campeão da Copa da França','Voltou a vencer o Rennes na final, por 2 a 0, na edição 2013/14.','fffFranca'),
   marco(2013,'Retorno à primeira divisão francesa','Conquistou acesso à Ligue 1 em maio de 2013.','guingampHistoria'),
   marco(2019,'Vice-campeão da Copa da Liga Francesa','Perdeu a decisão para o Strasbourg nos pênaltis após 0 a 0; não é título.','fffLiga'),
  ]),
  tecnicos:Object.freeze([tecnico('Jocelyn Gourvennec','2010–2016','Comandou Guingamp na conquista da Copa da França de 2014.','guingampHistoria')]),
  recordes:Object.freeze([]),
 }),
});
