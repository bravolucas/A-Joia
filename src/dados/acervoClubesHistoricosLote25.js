/**
 * A JOIA · Acervo histórico, lote 25 · 24/11/2026.
 * Fontes oficiais do clube, federação turca e Saudi Pro League.
 * Estatísticas completas não verificadas permanecem null.
 */
const F={
 karagumruk:'https://www.karagumruk.com/kulup/tarihce/',
 karagumruk2020:'https://www.tff.org/default.aspx?ftxtID=33538&pageID=287',
 karagumruk2025:'https://www.tff.org/default.aspx?ftxtID=47709&pageID=1269',
 orobahHistoria:'https://alorobahclub.sa/en/about',
 orobahPrimeira:'https://www.spl.com.sa/en/news/big-signing-zouma-can-bring-both-quality-and-experience-to-al-orobah',
 orobah2024:'https://www.spl.com.sa/en/news/introducing-the-2024-25-rsl-new-boys',
 orobahJogadores:'https://www.spl.com.sa/en/match/c7ce2760f1574c69bd16221e947161cf/orobah-vs-al-ittihad/commentary',
};
const marco=(ano,titulo,descricao,f)=>Object.freeze({ano,titulo,descricao,fonte:F[f]});
const atleta=(nome,posicao,periodo,descricao,f)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:F[f]});
export const ACERVO_CLUBES_LOTE25=Object.freeze({
 'Fatih Karagümrük':Object.freeze({
  clube:'Fatih Karagümrük',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),recordes:Object.freeze([]),tecnicos:Object.freeze([]),
  marcos:Object.freeze([
   marco(1926,'Fundação do Karagümrük İdman Yurdu','Fundado na primavera de 1926 em Istambul, após a união de equipes do bairro de Karagümrük.','karagumruk'),
   marco(1946,'Retomada das atividades','Reiniciou a atuação esportiva como Karagümrük Gençlik Kulübü.','karagumruk'),
   marco(2020,'Acesso à Süper Lig','Superou o Adana Demirspor na decisão dos playoffs da segunda divisão, em 30/07/2020.','karagumruk2020'),
   marco(2025,'Retorno à Süper Lig','Venceu o Bandırmaspor por 3 a 1 após a prorrogação na final dos playoffs em 29/05/2025.','karagumruk2025'),
  ]),
 }),
 'Al-Orobah':Object.freeze({
  clube:'Al-Orobah',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([
   atleta('Kurt Zouma','ZAG','2024–2025','Defensor francês citado no noticiário da liga saudita durante a temporada 2024/25.','orobahPrimeira'),
   atleta('Jóhann Berg Guðmundsson','MC','2024–2025','Meio-campista islandês relacionado à partida contra o Al-Ittihad pela liga saudita.','orobahJogadores'),
   atleta('Brad Young','ATA','2024–2025','Atacante mencionado em súmula da liga saudita, diante do Al-Ittihad.','orobahJogadores'),
  ]),
  recordes:Object.freeze([]),tecnicos:Object.freeze([]),
  marcos:Object.freeze([
   marco(1975,'Fundação do clube','Fundado em 1975 em Sakakah, na região saudita de Al-Jouf.','orobahHistoria'),
   marco(2013,'Título da segunda divisão e acesso inédito','Campeão da Saudi First Division League 2012/13, alcançando pela primeira vez a elite.','orobahPrimeira'),
   marco(2015,'Rebaixamento à segunda divisão','Terminou em último na temporada 2014/15 da primeira divisão saudita.','orobahPrimeira'),
   marco(2024,'Retorno à elite saudita','Promovido para disputar a Saudi Pro League 2024/25 após longo período fora da elite.','orobah2024'),
  ]),
 }),
});
