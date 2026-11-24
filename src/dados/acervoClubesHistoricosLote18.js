/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 18 (24/11/2026)
 * Clubes sem ficha inicial: Alanyaspor, Kasımpaşa, Antalyaspor e Al-Shabab.
 * Fontes específicas: TFF, sites oficiais e AFC; nenhum total absoluto presumido.
 */
const FONTES={
 alanya:'https://www.tff.org/default.aspx?2586pg=44&ftxtID=43307&pageID=471',
 alanyaT:'https://www.tff.org/Resources/Tamsaha/ZTK-Finali-2020/24-25/',
 kasim:'https://www.kasimpasa.com.tr/en/our-club?movetodesktop=1',
 antalya:'https://www.tff.org/default.aspx?2586pg=16&ftxtID=43308&pageID=471',
 antalyaClub:'https://www.antalyaspor.com.tr/tr/futbol-haberleri/final-21-fraport-tav-antalyaspor-besiktas-jk.html',
 shabab:'https://www.the-afc.com/en/more/news/roll_of_honour.html',
 shababFinal:'https://www.arabnews.com/archive/211892',
};
const DADOS={
 'Alanyaspor':{
  atletas:[
   ['Papiss Cissé','ATA','2018–2020',null,null,'alanya','Atacante titular na final da Copa da Turquia de 2019/20.'],
   ['Anastasios Bakasetas','MEI','2019–2021',null,null,'alanya','Meio-campista titular da equipe finalista da Copa da Turquia de 2020.'],
  ],
  marcos:[[2020,'Primeira final da Copa da Turquia','alanya','Vice-campeão nacional da Copa de 2019/20, após derrota por 2 a 0 para o Trabzonspor.']],
  tecnicos:[['Erol Bulut','2019–2020','alanyaT','Comandou o Alanyaspor na campanha da Copa da Turquia 2019/20.']],
 },
 'Kasımpaşa':{
  atletas:[],
  marcos:[
   [1921,'Fundação do Kasımpaşa','kasim','Origem do clube em Istambul, conforme o histórico institucional.'],
   [1951,'Profissionalização do futebol turco','kasim','Kasımpaşa foi um dos primeiros dez clubes a adotar o profissionalismo na Turquia.'],
  ],
 },
 'Antalyaspor':{
  atletas:[
   ['Hakan Özmert','MC','2018–2022',null,null,'antalyaClub','Autor de gol na campanha da Copa da Turquia 2020/21.'],
   ['Gökdeniz Bayrakdar','PE','2020–2023',null,null,'antalyaClub','Atacante da equipe finalista da Copa da Turquia 2020/21.'],
   ['Nuri Şahin','MC','2020–2021',null,null,'antalya','Integrante da equipe que disputou a final da Copa da Turquia de 2021.'],
  ],
  marcos:[[2021,'Final da Copa da Turquia','antalya','Vice-campeão em 2020/21, após derrota por 2 a 0 para o Beşiktaş.']],
 },
 'Al-Shabab':{
  atletas:[['Abdullah Al-Shihane','ATA','2001',null,null,'shababFinal','Marcou três gols na final de 2001 da Recopa Asiática contra o Dalian Shide.']],
  marcos:[[2001,'Campeão da Recopa Asiática','shabab','Venceu a Recopa Asiática de 2000/01 contra o Dalian Shide por 4 a 2.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte não localizada no lote 18: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE18=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
