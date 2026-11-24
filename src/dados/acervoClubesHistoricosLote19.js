/**
 * A JOIA — ACERVO HISTÓRICO, LOTE 19 (24/11/2026)
 * Novas fichas documentadas: Eyüpspor e Kayserispor.
 * Fontes: Federação Turca (TFF) e UEFA; totais desconhecidos são null.
 */
const FONTES={
 eyup:'https://www.tff.org/Resources/Tamsaha/234/88-89/',
 eyupT:'https://www.tff.org/Default.aspx?920pg=9&ftxtID=24074&pageID=182',
 eyupElenco:'https://www.tff.org/Resources/TFF/Documents/LIGLER/2023-2024/T1L/EYUPSPOR.PDF',
 kayseri:'https://www.uefa.com/news-media/news/01cd-0f84d9f95409-c177da819714-1000--kayserispor-hold-nerve-in-cup-final/',
 kayseriInter:'https://www.uefa.com/news/01b7-0e6d938bdc33-c0a7a31f6ff9-1000--brave-ob-surprise-hibernian/',
 kayseriT:'https://www.uefa.com/news-media/news/0205-0f8859891ba8-b99c0d4683ed-1000--kafkas-returns-to-take-charge-of-trabzonspor/',
};
const DADOS={
 'Eyüpspor':{
  atletas:[
   ['Ahmed Kutucu','ATA','2023–2025',null,null,'eyupElenco','Atacante do elenco histórico campeão da TFF 1. Lig 2023/24.'],
   ['Gianni Bruno','ATA','2023–2024',null,null,'eyupElenco','Atacante do elenco que conquistou o primeiro acesso à Süper Lig.'],
  ],
  marcos:[
   [2024,'Primeiro acesso à Süper Lig','eyup','Vitória por 4 a 1 sobre o Altay, em abril de 2024, confirmou a estreia na elite turca.'],
   [2024,'Campeão da segunda divisão turca','eyupT','Conquistou a TFF 1. Lig de 2023/24.'],
  ],
  tecnicos:[['Arda Turan','2023–2025','eyup','Treinador responsável pela inédita promoção do Eyüpspor à elite em 2024.']],
 },
 'Kayserispor':{
  atletas:[
   ['Gökhan Ünal','ATA','2003–2008',null,null,'kayseriInter','Marcou os dois gols na vitória por 2 a 0 contra o Larissa na Copa Intertoto de 2006.'],
   ['Mehmet Topuz','MC','2004–2009',null,null,'kayseri','Jogador de referência do clube na fase do título da Copa da Turquia de 2008.'],
  ],
  marcos:[
   [2006,'Classificação europeia via Copa Intertoto','kayseriInter','Superou o Larissa por 2 a 0 no confronto decisivo da Intertoto.'],
   [2008,'Campeão da Copa da Turquia','kayseri','Empate por 0 a 0 com o Gençlerbirliği e vitória por 11 a 10 nos pênaltis.'],
  ],
  tecnicos:[['Tolunay Kafkas','2007–2010','kayseriT','Treinador do Kayserispor campeão da Copa da Turquia em 2007/08.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte ausente lote 19: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE19=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze((d.tecnicos||[]).map(([nome,periodo,f,descricao])=>Object.freeze({nome,periodo,descricao,fonte:fonte(f)}))),
})])));
