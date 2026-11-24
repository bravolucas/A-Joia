/** A JOIA — Acervo histórico, lote 20 (24/11/2026).
 * Fontes oficiais AFC. Números de carreira desconhecidos permanecem null.
 */
const FONTES={
 fateh:'https://assets.the-afc.com/migration/a/f/afc-champions-league-2017-technical-report',
 taawoun:'https://www.the-afc.com/en/club/afc_champions_league/news/al_taawoun_stun_al_ittihad_to_win_saudi_king%E2%80%99s_cup.html',
 taawounElenco:'https://assets.the-afc.com/migration/a/f/afc-champions-league-2020-technical-report-statistics',
};
const DADOS={
 'Al-Fateh':{
  atletas:[],
  marcos:[[2013,'Campeão saudita pela primeira vez','fateh','Conquista da Saudi Pro League de 2012/13, reconhecida pela AFC como título surpreendente.']],
 },
 'Al-Taawoun':{
  atletas:[
   ['Cédric Amissi','MEI','2017–2020',null,null,'taawounElenco','Meio-campista relacionado no relatório técnico da AFC Champions League de 2020.'],
   ['Iago Santos','ZAG','2018–2020',null,null,'taawounElenco','Zagueiro relacionado no elenco do Al-Taawoun na AFC Champions League de 2020.'],
  ],
  marcos:[[2019,'Primeiro título da Copa do Rei Saudita','taawoun','Venceu o Al-Ittihad por 2 a 1 na decisão da King’s Cup de 2018/19.']],
 },
};
const fonte=k=>{if(!FONTES[k])throw new Error('Fonte ausente no lote 20: '+k);return FONTES[k]};
export const ACERVO_CLUBES_LOTE20=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze((d.atletas||[]).map(([nome,posicao,periodo,jogos,gols,f,descricao])=>Object.freeze({nome,posicao,periodo,jogos,gols,descricao,fonte:fonte(f)}))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(([ano,titulo,f,descricao])=>Object.freeze({ano,titulo,descricao,fonte:fonte(f)}))),
 tecnicos:Object.freeze([]),
})])));
