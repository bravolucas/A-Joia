/**
 * A JOIA — acervo histórico lote 37, 24/11/2026.
 * AC Ajaccio (Ajaccio) e Clermont Foot: dados de fontes oficiais dos clubes.
 * Gols de temporadas específicas não são gols de carreira nem recordes globais.
 */
const FONTES={
 ajaccioHistoria:'https://ac-ajaccio.corsica/club/storia',
 ajaccioJogadores:'https://ac-ajaccio.corsica/club/storia/i-ghjucadori',
 ajaccioMoyano:'https://ac-ajaccio.corsica/article-l-aca-perd-l-un-de-ses-champions-1967-11367-co.html',
 ajaccioGranon:'https://ac-ajaccio.corsica/article-cyril-granon-honore-a-timizzolu-11888-fr.html',
 clermontHistoria:'https://www.clermontfoot.com/histoire',
 clermontGastien:'https://www.clermontfoot.com/pascal-gastien-et-son-staff-prolongent-au-cf63',
 clermontLigue1:'https://www.clermontfoot.com/les-10-dates-marquantes-du-clermont-foot-63-en-ligue-1-uber-eats',
 clermont35:'https://www.clermontfoot.com/nouveau-maillot-exterieur-25-26-un-hommage-vibrant-aux-35-ans-du-club',
};
const fonte=id=>{if(!FONTES[id])throw new Error('Fonte ausente no lote 37: '+id);return FONTES[id]};
const atleta=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:fonte(f)});
const marco=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)});
const tecnico=(nome,periodo,descricao,f)=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)});
export const ACERVO_CLUBES_LOTE37=Object.freeze({
 Ajaccio:Object.freeze({
  clube:'Ajaccio',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Aurélio Moyano','MC','1965–1967','Meio-campista argentino e integrante do título da segunda divisão francesa de 1967.','ajaccioMoyano'),
   atleta('Cyril Granon','MC','década de 1990–2002','Capitão lembrado pelo clube como integrante importante do elenco campeão da D2 em 2002; sem total exato de partidas cadastrado.','ajaccioGranon'),
  ]),
  marcos:Object.freeze([
   marco(1910,'Fundação do AC Ajaccio','A história institucional do clube começa em 1910, na Córsega.','ajaccioHistoria'),
   marco(1967,'Campeão da segunda divisão francesa','Venceu a Division 2 em 1966/67 e tornou-se o primeiro clube da Córsega a jogar a primeira divisão.','ajaccioHistoria'),
   marco(1998,'Campeão do National','Conquistou a terceira divisão francesa em 1997/98.','ajaccioHistoria'),
   marco(2002,'Campeão da segunda divisão francesa','Conquistou a Ligue 2 em 2001/02.','ajaccioHistoria'),
  ]),
  tecnicos:Object.freeze([]),
  recordes:Object.freeze([]),
 }),
 'Clermont Foot':Object.freeze({
  clube:'Clermont Foot',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Mohamed Bayo','ATA','2020–2022','Artilheiro da Ligue 2 2020/21 com 22 gols; marcou o primeiro gol da história do Clermont na Ligue 1 em 2021. Os 22 gols são de uma temporada, não um total de carreira.','clermontHistoria'),
   atleta('Jodel Dossou','ATA','temporada 2021/22','Marcou o segundo gol da primeira vitória do Clermont Foot na Ligue 1, fora de casa contra o Bordeaux em 2021.','clermontLigue1'),
  ]),
  marcos:Object.freeze([
   marco(1990,'Formação do Clermont Foot 63 atual','O clube atual foi estruturado em junho de 1990 após a crise e a falência do Clermont FC anterior; não confundir suas conquistas.','clermont35'),
   marco(2021,'Primeiro acesso à primeira divisão francesa','Terminou a Ligue 2 2020/21 em segundo lugar com 72 pontos e obteve acesso inédito; não foi campeão da Ligue 2.','clermontHistoria'),
   marco(2021,'Primeira vitória na Ligue 1','Venceu o Bordeaux por 2 a 0 na estreia na elite; Mohamed Bayo marcou o primeiro gol do clube na primeira divisão.','clermontLigue1'),
   marco(2023,'Oitavo lugar histórico na Ligue 1','Terminou a Ligue 1 2022/23 em 8º, com 59 pontos; não foi campeão francês.','clermontLigue1'),
  ]),
  tecnicos:Object.freeze([
   tecnico('Pascal Gastien','2017–2024','Assumiu a equipe profissional em setembro de 2017 e comandou o acesso inédito de 2021.','clermontGastien'),
   tecnico('Corinne Diacre','2014–2017','Treinou a equipe masculina do Clermont, antes de assumir a seleção francesa feminina.','clermontHistoria'),
  ]),
  recordes:Object.freeze([]),
 }),
});
