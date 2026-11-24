/**
 * A JOIA — acervo histórico lote 33 (24/11/2026).
 * Clube de Le Mans: fundado como MUC 72 em 1985, renomeado em 2010.
 * Fontes primárias do Le Mans FC; a recuperação após a liquidação de 2013
 * pertence à mesma trajetória institucional registrada pelo clube.
 * Nenhum total de partidas/gols inferido.
 */
const F={
 historia:'https://www.lemansfc.fr/index.php?section=le-club',
 identidade:'https://www.lemansfc.fr/index.php?actu=3552&section=actualites-contenu',
 acesso2026:'https://www.lemansfc.fr/index.php?actu=4051&section=actualites-contenu',
 idolos:'https://lemansfc.fr/index.php?actu=68&section=actualites-contenu',
};
const marco=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:F[f]});
const atleta=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[f]});
const tecnico=(nome,periodo,descricao,f)=>Object.freeze({nome,periodo,descricao,fonte:F[f]});
export const ACERVO_CLUBES_LOTE33=Object.freeze({
 'Le Mans':Object.freeze({
  clube:'Le Mans',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Patrick Van Kets','ATA',null,'Apontado pelo dirigente Bernard Guédet como maior goleador da história do clube, sem total de gols auditado.','idolos'),
   atleta('Régis Beunardeau','ZAG',null,'Capitão emblemático e jogador de referência lembrado pela direção do MUC 72.','idolos'),
   atleta('Mamadou Soro','ATA','2018–2019','Gol de bicicleta no acréscimo, contra o Gazélec Ajaccio, no acesso à Ligue 2 de 2019.','historia'),
  ]),
  marcos:Object.freeze([
   marco(1985,'Fundação do Le Mans Union Club 72','12 de junho de 1985: fusão da US Le Mans com o Stade Olympique du Maine, formando o MUC 72.','identidade'),
   marco(1988,'Acesso à segunda divisão francesa','Subiu à Division 2 sob comando de Christian Gourcuff.','historia'),
   marco(2003,'Primeiro acesso à primeira divisão','Estreou na Ligue 1 após o acesso conquistado em 2002/03.','historia'),
   marco(2008,'Melhor colocação histórica na Ligue 1 até então','9º colocado em 2007/08 sob comando de Rudi Garcia; não é título da liga.','historia'),
   marco(2010,'Mudança de nome para Le Mans FC','MUC 72 passou a denominar-se Le Mans Football Club em 2010.','identidade'),
   marco(2013,'Liquidação judicial e rebaixamento administrativo','Em outubro de 2013, liquidado judicialmente e rebaixado à Division d’Honneur do Maine.','historia'),
   marco(2019,'Retorno à Ligue 2','Acesso após playoff contra o Gazélec Ajaccio, seis anos depois da liquidação.','historia'),
   marco(2025,'Acesso do National à Ligue 2','Primeiro de dois acessos consecutivos do clube entre 2025 e 2026.','acesso2026'),
   marco(2026,'Retorno à Ligue 1 após 16 anos','Acesso oficializado em 13 de maio de 2026.','acesso2026'),
  ]),
  tecnicos:Object.freeze([
   tecnico('Christian Gourcuff','1988','Conduziu o primeiro acesso à segunda divisão, em 1988.','historia'),
   tecnico('Rudi Garcia','2007–2008','Treinador da equipe que terminou a Ligue 1 em 9º lugar em 2007/08.','historia'),
  ]),
  recordes:Object.freeze([]),
 }),
});
