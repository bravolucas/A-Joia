/**
 * A JOIA — lote 34 (24/11/2026), início da Ligue 2 histórica.
 * Titulações verificadas em palmarés oficiais de ASSE e Bordeaux.
 * Recordes do Bordeaux: números do próprio clube, recorte publicado
 * em 01/07/2024; não comparáveis diretamente às carreiras simuladas.
 */
const F={
 asse:'https://www.asse.fr/fr/club/palmares/',
 herbin:'https://www.asse.fr/fr/actualites/une-carriere-exceptionnelle-en-chiffres-ac28325',
 bordeaux:'https://www.girondins.com/fr/club/prize-list',
 bordeauxDados:'https://girondins.com/fr/pages/27904/chiffres-cles',
 bordeauxGiresse:'https://backend.girondins.com/node/27706',
};
const m=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:F[f]});
const j=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[f]});
const t=(nome,periodo,descricao,f)=>Object.freeze({nome,periodo,descricao,fonte:F[f]});
const marcoAnual=(anos,titulo,fonte)=>anos.map(ano=>m(ano,titulo,'Título da edição encerrada em '+ano+'.',fonte));
const recorde=(id,atleta,valor,destaque)=>Object.freeze({
 tipo:'clube',nome:'Bordeaux',id,atleta,valor,
 ano:null,destaque,fonte:F.bordeauxDados,data:'2026-11-24',
 comparavel:false,
 criterio:'Balanço institucional do Bordeaux publicado com data-base em 01/07/2024. Escopo histórico de partidas do clube não uniformizado com os recortes do simulador.',
});
export const ACERVO_CLUBES_LOTE34=Object.freeze({
 'Saint-Étienne':Object.freeze({
  clube:'Saint-Étienne',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   j('Robert Herbin','ZAG','1957–1972','Jogador e depois treinador, personagem central da era de maior sucesso do clube. Fontes institucionais divergem sobre o número exato de jogos, que permanece sem total cadastrado.','herbin'),
  ]),
  marcos:Object.freeze([
   ...marcoAnual([1957,1964,1967,1968,1969,1970,1974,1975,1976,1981],'Campeão francês','asse'),
   ...marcoAnual([1962,1968,1970,1974,1975,1977],'Campeão da Copa da França','asse'),
   ...marcoAnual([1963,1999,2004],'Campeão da Ligue 2','asse'),
   m(2013,'Campeão da Copa da Liga Francesa','Título da edição 2012/13.','asse'),
   m(1976,'Vice-campeão europeu','Chegou à final da Copa dos Campeões contra o Bayern de Munique. Vice-campeonato não equivale a título.','herbin'),
  ]),
  tecnicos:Object.freeze([t('Robert Herbin','1972–1983','Técnico da equipe multicampeã francesa dos anos 1970 e finalista europeia de 1976.','herbin')]),
  recordes:Object.freeze([]),
 }),
 Bordeaux:Object.freeze({
  clube:'Bordeaux',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   j('Alain Giresse','MC','1970–1986','Maior goleador histórico dos Girondins segundo a própria instituição (158 gols); 519 jogos no recorte histórico do clube.','bordeauxDados'),
   j('Jean Tigana','MC','1981–1989','Meio-campista e ídolo dos títulos franceses de 1984, 1985 e 1987.','bordeauxGiresse'),
  ]),
  marcos:Object.freeze([
   ...marcoAnual([1950,1984,1985,1987,1999,2009],'Campeão francês','bordeaux'),
   ...marcoAnual([1941,1986,1987,2013],'Campeão da Copa da França','bordeaux'),
   ...marcoAnual([2002,2007,2009],'Campeão da Copa da Liga Francesa','bordeaux'),
   m(1992,'Campeão da Ligue 2','Título da segunda divisão encerrada em 1992.','bordeaux'),
   m(1996,'Vice-campeão da Copa UEFA','Chegou à final contra o Bayern de Munique; não contabilizar como título europeu.','bordeaux'),
  ]),
  tecnicos:Object.freeze([]),
  recordes:Object.freeze([
   recorde('golsCarreira','Alain Giresse',158,'Maior goleador no balanço histórico do clube; partidas e critérios podem diferir do universo simulado.'),
   recorde('jogosCarreira','Alain Giresse',519,'Maior quantidade de jogos pelo Bordeaux conforme números publicados pelo próprio clube.'),
  ]),
 }),
});
