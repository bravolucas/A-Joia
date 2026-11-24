/** A JOIA — lote histórico 22 (24/11/2026). Fontes verificadas por entidade.
 * Não equiparar estatística desconhecida a zero e não misturar modalidades.
 */
const DADOS={
 'Rizespor':{
  atletas:[
   {nome:'Emirhan Topçu',posicao:'ZAG',periodo:'2021–2024',jogos:null,gols:null,descricao:'Zagueiro relacionado no elenco oficial de 2023/24 da primeira divisão turca.',fonte:'https://www.tff.org/Resources/TFF/Documents/LIGLER/2023-2024/TSL/CAYKUR-RIZESPOR-AS.pdf'},
  ],
  marcos:[
   {ano:1953,titulo:'Fundação do Rizespor',descricao:'Fundado em 19 de maio de 1953 na cidade de Rize.',fonte:'https://www.caykurrizespor.org.tr/kulup/tarihce-9'},
   {ano:1979,titulo:'Primeiro acesso à elite turca',descricao:'Conquistou o título de sua divisão em 1978/79 e estreou na elite em 1979/80.',fonte:'https://www.caykurrizespor.org.tr/kulup/tarihce-9'},
   {ano:2023,titulo:'Retorno à Süper Lig',descricao:'Garantiu o acesso à primeira divisão turca na temporada 2022/23.',fonte:'https://www.tff.org/default.aspx?2707pg=21&ftxtID=41282&pageID=204'},
  ],
 },
 'Al-Qadsiah':{
  atletas:[
   {nome:'Nacho Fernández',posicao:'ZAG',periodo:'2024–2026',jogos:null,gols:null,descricao:'Zagueiro espanhol entre os atletas de destaque relacionados no histórico do clube.',fonte:'https://saudipedia.com/en/al-qadsiah-club'},
   {nome:'Pierre-Emerick Aubameyang',posicao:'ATA',periodo:'2024–2025',jogos:null,gols:null,descricao:'Atacante gabonês citado entre os jogadores de destaque do Al-Qadsiah.',fonte:'https://saudipedia.com/en/al-qadsiah-club'},
  ],
  marcos:[
   {ano:1992,titulo:'Campeão da Copa do Príncipe Herdeiro',descricao:'Conquista da Crown Prince Cup saudita de 1992.',fonte:'https://saudipedia.com/en/al-qadsiah-club'},
   {ano:1994,titulo:'Campeão da Recopa Asiática',descricao:'Título da edição de 1993/94 da Asian Cup Winners’ Cup (fontes também registram o evento como 1993).',fonte:'https://saudipedia.com/en/al-qadsiah-club'},
  ],
 },
 'Al-Khaleej':{
  atletas:[],
  marcos:[
   {ano:2003,titulo:'Acesso à elite saudita',descricao:'Uma das temporadas de promoção à Saudi Pro League documentadas na história institucional.',fonte:'https://saudipedia.com/en/al-khaleej-club'},
   {ano:2007,titulo:'Novo acesso à primeira divisão',descricao:'Promoção à Saudi Pro League mencionada no histórico do Al-Khaleej.',fonte:'https://saudipedia.com/en/al-khaleej-club'},
   {ano:2014,titulo:'Retorno à elite saudita',descricao:'Uma das promoções documentadas para a primeira divisão.',fonte:'https://saudipedia.com/en/al-khaleej-club'},
   {ano:2021,titulo:'Promoção à Saudi Pro League',descricao:'Acesso identificado no histórico institucional como temporada 2021.',fonte:'https://saudipedia.com/en/al-khaleej-club'},
  ],
 },
};
export const ACERVO_CLUBES_LOTE22=Object.freeze(Object.fromEntries(Object.entries(DADOS).map(([clube,d])=>[clube,Object.freeze({
 clube,atualizadoEm:'2026-11-24',
 atletas:Object.freeze(d.atletas.map(a=>Object.freeze(a))),
 recordes:Object.freeze([]),
 marcos:Object.freeze(d.marcos.map(m=>Object.freeze(m))),
 tecnicos:Object.freeze([]),
})])));
