/**
 * A JOIA — acervo histórico, lote 27 (24/11/2026).
 * Prioridade: duas lacunas documentadas na Ligue 1.
 * Fontes primárias: páginas históricas oficiais dos clubes.
 * Jogos/gols completos não auditados continuam null.
 */
const FONTES={
 lensTitulo:'https://www.rclens.fr/fr/club/histoire/champions',
 lensCopa:'https://www.rclens.fr/fr/club/histoire/succes',
 lensEuropa:'https://www.rclens.fr/fr/club/rclens-parcours-europe',
 rennesIdentidade:'https://www.staderennais.com/identite',
 rennesCopas:'https://www.staderennais.com/actualites/le-club/les-deux-coupes-retrouvees',
};
const marco=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:FONTES[f]});
const atleta=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:FONTES[f]});
const tecnico=(nome,periodo,descricao,f)=>Object.freeze({nome,periodo,descricao,fonte:FONTES[f]});
export const ACERVO_CLUBES_LOTE27=Object.freeze({
 Lens:Object.freeze({
  clube:'Lens',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Yoann Lachor','LE','1996–2006','Autor do gol do empate diante do Auxerre na partida decisiva pelo título francês de 1998.','lensTitulo'),
   atleta('Jean-Guy Wallemme','ZAG','1986–1998','Capitão da equipe campeã da França em 1997/98.','lensTitulo'),
   atleta('Michaël Debève','MC','1994–2002','Marcador na vitória sobre o Arsenal em Wembley na Champions League de 1998/99.','lensEuropa'),
  ]),
  marcos:Object.freeze([
   marco(1998,'Campeão francês de 1997/98','Primeiro título da primeira divisão francesa; empate de 1 a 1 em Auxerre na rodada decisiva.','lensTitulo'),
   marco(1999,'Campeão da Copa da Liga Francesa','Venceu a final da Coupe de la Ligue contra o Metz.','lensCopa'),
   marco(1998,'Primeira vitória francesa sobre o Arsenal em Wembley','Venceu o Arsenal por 1 a 0 pela Champions League em novembro de 1998.','lensEuropa'),
  ]),
  tecnicos:Object.freeze([tecnico('Daniel Leclercq','1997–1999','Treinador responsável pelo título francês de 1997/98.','lensTitulo')]),
  recordes:Object.freeze([]),
 }),
 Rennes:Object.freeze({
  clube:'Rennes',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   marco(1965,'Primeira Copa da França','Primeiro título da Coupe de France conquistado pelo Stade Rennais.','rennesCopas'),
   marco(1971,'Segunda Copa da França','Repetiu o título da Coupe de France sob comando de Jean Prouff.','rennesCopas'),
   marco(2019,'Terceira Copa da França','Venceu o Paris Saint-Germain na decisão por pênaltis em 27 de abril de 2019.','rennesIdentidade'),
  ]),
  tecnicos:Object.freeze([tecnico('Jean Prouff','1964–1972','Treinador responsável pelos títulos da Copa da França de 1965 e 1971.','rennesIdentidade')]),
  recordes:Object.freeze([]),
 }),
});
