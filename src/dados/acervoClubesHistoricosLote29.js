/**
 * A JOIA — acervo histórico lote 29 · 24/11/2026.
 * Lille e Toulouse com fontes oficiais. Identidade do Toulouse FC atual
 * não deve incorporar automaticamente o título de 1957 (outro clube).
 */
const FONTES={
 lilleLiga:'https://www.losc.fr/en/node/8464',
 lilleCopa:'https://www.losc.fr/en/node/12286',
 lilleBaratte:'https://www.losc.fr/en/node/18903',
 toulouseFinal:'https://www.toulousefc.com/play/blog/2023/04/le-tefece-ramene-la-coupe-de-france-au-capitole',
 toulouse2023:'https://www.toulousefc.com/play/blog/2025/04/le-tefece-celebre-les-deux-ans-de-son-sacre-en-coupe-de-france',
};
const m=(ano,titulo,descricao,src)=>Object.freeze({ano,titulo,descricao,fonte:FONTES[src]});
const a=(nome,posicao,periodo,descricao,src)=>Object.freeze({nome,posicao,periodo,jogos:null,gols:null,descricao,fonte:FONTES[src]});
export const ACERVO_CLUBES_LOTE29=Object.freeze({
 Lille:Object.freeze({
  clube:'Lille',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([a('Jean Baratte','ATA','1944–1953','Ídolo do LOSC, artilheiro do campeonato francês em 1948 (31 gols) e 1949 (26 gols). Números de edição não são totais da carreira.','lilleBaratte')]),
  marcos:Object.freeze([
   ...[1946,1954,2011,2021].map(ano=>m(ano,'Campeão da primeira divisão francesa','Título nacional do LOSC na edição encerrada em '+ano+'.','lilleLiga')),
   ...[1946,1947,1948,1953,1955,2011].map(ano=>m(ano,'Campeão da Copa da França','Conquista da Copa da França na edição encerrada em '+ano+'.','lilleCopa')),
  ]),
  tecnicos:Object.freeze([]),recordes:Object.freeze([]),
 }),
 Toulouse:Object.freeze({
  clube:'Toulouse',atualizadoEm:'2026-11-24',
  atletas:Object.freeze([]),
  marcos:Object.freeze([
   m(2023,'Campeão da Copa da França','O Toulouse Football Club atual venceu o Nantes por 5 a 1 na decisão de 29/04/2023. A Copa de 1957 pertence a um clube antecessor de nome semelhante e não é transferida automaticamente para esta ficha.','toulouseFinal'),
   m(2022,'Campeão da Ligue 2','Conquista da segunda divisão francesa na temporada 2021/22, seguida pela Copa da França de 2023.','toulouse2023'),
  ]),
  tecnicos:Object.freeze([]),recordes:Object.freeze([]),
 }),
});
