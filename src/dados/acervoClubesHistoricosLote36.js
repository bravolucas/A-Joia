/**
 * A JOIA — acervo historico, lote 36 (24/11/2026).
 * Fontes primarias: SM Caen, SC Bastia e Federation Francaise de Football.
 * Os dados numericos de atletas nesta etapa descrevem recortes de carreira;
 * não confundir finais/participacoes com titulos ou recordes absolutos.
 */
const F={
 caenPalmares:'https://www.smcaen.fr/palmares',
 caenHistoria:'https://www.smcaen.fr/histoire',
 caenGravelaine:'https://www.smcaen.fr/2013-2014/actualites/infos-club/xavier-gravelaine-caen-ma-beaucoup-apporte',
 caen1992:'https://www.smcaen.fr/2015-2016/actualites/groupe-pro/j2-quand-la-bande-gravelaine-etrillait-le-tefece',
 copaLiga:'https://www.fff.fr/304-palmares-de-la-coupe-de-la-ligue.html',
 bastiaPalmares:'https://sc-bastia.corsica/pages/palmares',
 bastiaHistoria:'https://sc-bastia.corsica/pages/histoire-du-club',
};
const fonte=k=>{if(!F[k])throw Error('Fonte ausente lote 36: '+k);return F[k]};
const atleta=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:fonte(f)});
const marco=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)});
const tecnico=(nome,periodo,descricao,f)=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)});
export const ACERVO_CLUBES_LOTE36=Object.freeze({
 Caen:Object.freeze({
  clube:'Caen',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Xavier Gravelaine','ATA','1991–1993; 2001–2002','O SM Caen informa 110 jogos e 45 gols em seus três anos pelo clube; não extrapolar a outras equipes nem competições.','caenGravelaine'),
   atleta('Stéphane Paille','ATA','1991–1993','Atacante da equipe de 1992 que levou o Caen à Copa UEFA.','caenHistoria'),
   atleta('Cyrille Watier','ATA','1999–2004','Lembrado pelo clube entre os grandes artilheiros do estádio Michel d’Ornano.','caenHistoria'),
  ]),
  marcos:Object.freeze([
   marco(1913,'Fundação do Stade Malherbe Caennais','Nasceu em 17 de novembro de 1913 da união de duas entidades de Caen.','caenHistoria'),
   marco(1988,'Primeiro acesso à elite francesa','Conquistou a promoção à Division 1 pelos playoffs da segunda divisão.','caenHistoria'),
   marco(1992,'Quinto lugar no campeonato francês e classificação europeia','Terminou a temporada 1991/92 em 5º e disputou a Copa UEFA na temporada seguinte; não é título nacional.','caenHistoria'),
   marco(1996,'Campeão da segunda divisão francesa','Título da Division 2 de 1995/96.','caenPalmares'),
   marco(2005,'Vice-campeão da Copa da Liga Francesa','Perdeu por 2 a 1 para o Strasbourg na final de 2004/05; não é título.','copaLiga'),
   marco(2010,'Campeão da segunda divisão francesa','Título da Ligue 2 de 2009/10.','caenPalmares'),
  ]),
  tecnicos:Object.freeze([
   tecnico('Daniel Jeandupeux','1992','Comandou a equipe na temporada da primeira participação em competições europeias.','caen1992'),
  ]),
  recordes:Object.freeze([]),
 }),
 Bastia:Object.freeze({
  clube:'Bastia',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Claude Papi','MEI','década de 1970','Meio-campista e referência técnica da equipe finalista da Copa UEFA de 1978.','bastiaHistoria'),
   atleta('Johnny Rep','ATA','1977–1978','Atacante integrante da campanha do Bastia na Copa UEFA de 1977/78.','bastiaHistoria'),
   atleta('Charles Orlanducci','ZAG','década de 1970','Capitão e defensor histórico da campanha europeia do clube.','bastiaHistoria'),
  ]),
  marcos:Object.freeze([
   marco(1905,'Fundação do Sporting Club de Bastia','Fundado na Córsega em 1905.','bastiaHistoria'),
   marco(1968,'Campeão da segunda divisão francesa','Título nacional da Division 2 e primeiro acesso à elite.','bastiaPalmares'),
   marco(1978,'Vice-campeão da Copa UEFA','Chegou à decisão de 1977/78, vencida pelo PSV; não contabilizar como título europeu.','bastiaHistoria'),
   marco(1981,'Campeão da Copa da França','Venceu o Saint-Étienne na decisão.','bastiaPalmares'),
   marco(1997,'Campeão da Copa Intertoto','Título de 1997 e classificação à Copa UEFA.','bastiaPalmares'),
   marco(2011,'Campeão do National','Título da terceira divisão francesa da edição 2010/11.','bastiaPalmares'),
   marco(2012,'Campeão da Ligue 2','Título da segunda divisão da edição 2011/12.','bastiaPalmares'),
   marco(2017,'Reestruturação após liquidação judicial','O clube recomeçou no National 3 após a liquidação da sociedade profissional; marco institucional, não título.','bastiaHistoria'),
   marco(2021,'Campeão do National','Título da terceira divisão francesa da edição 2020/21.','bastiaPalmares'),
  ]),
  tecnicos:Object.freeze([
   tecnico('Pierre Cahuzac','1977–1978','Treinador da campanha finalista da Copa UEFA.','bastiaHistoria'),
   tecnico('Antoine Redin','1980–1981','Treinador da conquista da Copa da França em 1981.','bastiaHistoria'),
   tecnico('Frédéric Antonetti','1997','Conduziu a campanha campeã da Intertoto.','bastiaHistoria'),
  ]),
  recordes:Object.freeze([]),
 }),
});
