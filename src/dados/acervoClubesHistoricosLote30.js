/** A JOIA — lote 30, 24/11/2026.
 * Clube e federação como fontes; 1993/94, e não 1992/93, é a edição
 * da primeira Copa da França da AJ Auxerre.
 * Não converter estatísticas de temporadas em recordes de carreira.
 */
const F={
 aja:'https://www.aja.fr/palmares',
 ajaHistoria:'https://www.aja.fr/histoire',
 ajaTreinador:'https://www.uefa.com/news-media/news/01aa-0f8474cb580e-f81956863fa1-1000--roux-stands-down-after-44-years/',
 hacCopa:'https://www.fff.fr/155-le-palmares-de-la-coupe-de-france.html',
 hacLiga:'https://www.fff.fr/259-palmares-ligue-2.html',
 hacRecorde:'https://www.fff.fr/159-chiffres-et-records.html',
};
const marco=(ano,titulo,descricao,ref)=>Object.freeze({ano,titulo,descricao,fonte:F[ref]});
const tecnico=(nome,periodo,descricao,ref)=>Object.freeze({nome,periodo,descricao,fonte:F[ref]});
const atleta=(nome,posicao,periodo,descricao,ref)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[ref]});
export const ACERVO_CLUBES_LOTE30=Object.freeze({
 Auxerre:Object.freeze({
  clube:'Auxerre',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Bonaventure Kalou','ATA','2003–2005','Autor do gol da vitória por 2 a 1 diante do Sedan na final da Copa da França de 2005.','ajaHistoria'),
  ]),
  recordes:Object.freeze([]),
  marcos:Object.freeze([
   marco(1905,'Fundação da AJ Auxerre','Clube fundado em 1905.','ajaHistoria'),
   marco(1996,'Campeão francês','Título da Division 1 de 1995/96 sob comando de Guy Roux.','aja'),
   ...[1994,1996,2003,2005].map(ano=>marco(ano,'Campeão da Copa da França','Conquista da edição encerrada em '+ano+'.','aja')),
  ]),
  tecnicos:Object.freeze([tecnico('Guy Roux','1961–2005','Treinador histórico associado ao campeonato de 1996 e a quatro Copas da França.','ajaTreinador')]),
 }),
 'Le Havre':Object.freeze({
  clube:'Le Havre',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  recordes:Object.freeze([]),
  marcos:Object.freeze([
   marco(1959,'Campeão da Copa da França','Venceu o Sochaux por 3 a 0 no jogo-desempate da decisão de 1958/59; era equipe da segunda divisão.','hacCopa'),
   marco(1959,'Campeão da segunda divisão francesa','Título da Division 2 na temporada 1958/59.','hacLiga'),
   marco(1959,'Primeiro campeão da Copa da França vindo da D2','Conquista de 1959; marco da competição, não recorde individual de jogador.','hacRecorde'),
  ]),
  tecnicos:Object.freeze([]),
 }),
});
