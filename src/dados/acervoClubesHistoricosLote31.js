/** A JOIA — acervo histórico lote 31 (24/11/2026).
 * Fontes: clube Angers SCO, Ligue 1/FFF, Paris FC e Cidade de Paris.
 * Angers: finais não são títulos. Brest: registrar D2 1981, sem tratar a
 * temporada 2023/24 como campeonato. Paris FC e PSG têm identidades separadas.
 */
const F={
 angers:'https://angers-sco.fr/club/histoire/',
 copaFranca:'https://www.fff.fr/473-palmares-de-la-coupe-de-france.html',
 brestD2:'https://ligue1.com/fr/articles/l1_article_509-palmares-des-champions-de-ligue-2-bkt',
 brestFFF:'https://www.fff.fr/476-palmares-ligue-2.html',
 parisHistoria:'https://parisfc.fr/historique/',
 parisAcesso:'https://www.paris.fr/pages/jusqu-en-1972-le-pfc-et-le-psg-ne-faisaient-qu-un-31030',
};
const marco=(ano,titulo,descricao,ref)=>Object.freeze({ano,titulo,descricao,fonte:F[ref]});
const jogador=(nome,posicao,periodo,descricao,ref)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[ref]});
const tecnico=(nome,periodo,descricao,ref)=>Object.freeze({nome,periodo,descricao,fonte:F[ref]});
export const ACERVO_CLUBES_LOTE31=Object.freeze({
 Angers:Object.freeze({
  clube:'Angers',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([jogador('Raymond Kopa','MEI','1949–1951','Iniciou sua carreira profissional no Angers antes de seguir para o Stade de Reims.','angers')]),
  marcos:Object.freeze([
   marco(1919,'Fundação do Angers SCO','Fundado em 1919.','angers'),
   marco(1957,'Vice-campeão da Copa da França','Primeira final: derrota para o Toulouse FC da época. Não contar como título.','angers'),
   marco(2017,'Vice-campeão da Copa da França','Derrota por 1 a 0 para o Paris Saint-Germain, com gol contra no fim; a final ocorreu 60 anos após a anterior.','copaFranca'),
  ]),
  tecnicos:Object.freeze([]),recordes:Object.freeze([]),
 }),
 Brest:Object.freeze({
  clube:'Brest',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   marco(1981,'Campeão da segunda divisão francesa','Stade Brestois campeão da Division 2 1980/81, no formato histórico de grupos e decisão.','brestD2'),
   marco(1981,'Líder do grupo B da Division 2','A FFF registra o Stade Brestois como campeão do grupo B da temporada 1980/81.','brestFFF'),
  ]),
  tecnicos:Object.freeze([]),recordes:Object.freeze([]),
 }),
 'Paris FC':Object.freeze({
  clube:'Paris FC',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   marco(1969,'Fundação do Paris FC','Criação do clube na capital francesa em 1969.','parisHistoria'),
   marco(1972,'Separação de Paris FC e PSG','Após a separação, o Paris FC permaneceu na primeira divisão; o PSG retornou à terceira.','parisHistoria'),
   marco(2015,'Acesso à Ligue 2','Retorno ao futebol profissional documentado pelo clube em 2015.','parisHistoria'),
   marco(2025,'Retorno à primeira divisão francesa','Garantiu o retorno à Ligue 1 em 2 de maio de 2025, após longa ausência da elite.','parisAcesso'),
  ]),
  tecnicos:Object.freeze([tecnico('Roger Lemerre','1979–1981','Treinador do Paris FC durante duas temporadas.','parisAcesso')]),
  recordes:Object.freeze([]),
 }),
});
