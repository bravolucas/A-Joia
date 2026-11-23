/**
 * Acervo real de atletas de seleções masculinas — lote inicial, 23/11/2026.
 * Todas as 83 seleções do catálogo recebem identidade, estado de cobertura e
 * títulos do acervo existente. SOMENTE as linhas auditadas recebem números.
 * Não adicionar números de amistosos não reconhecidos ou inferir estatísticas.
 */
import {NACIONALIDADES} from './data.js';
import {historicoDaSelecao,nomeSelecaoHistorica} from './selecoesHistoricas.js';

const FONTES = Object.freeze({
 brasil:'https://www.cbf.com.br/selecao-brasileira/noticias/noticias/selecao-masculina/selecao-brasileira-tem-2700-gols-marcados-na-historia',
 brasilJogos:'https://www1.folha.uol.com.br/esporte/2026/07/neymar-se-aposenta-da-selecao-confira-numeros-do-camisa-10-pelo-brasil.shtml',
 argentina:'https://theanalyst.com/players/10705/lionel-messi/national',
 portugal:'https://www.uefa.com/uefaeuro/history/news/023f-0e9797c3479b-bdb6067609d3-1000--ramos-breaks-caps-record/',
 portugalGols:'https://www.uefa.com/european-qualifiers/news/026a-1297500e1b34-a17bbbcad258-1000--ronaldo-is-all-time-top-scorer/',
 alemanha:'https://datencenter.dfb.de/en/data-center/team/germany/record-scorers',
 espanha:'https://rfef.es/en/noticias/Mikel-Oyarzabal-Climbing-Spains-All-Time-Scoring-Ranks',
 franca:'https://theanalyst.com/players/1634/kylian-mbappe/national',
 inglaterra:'https://www.uefa.com/european-qualifiers/news/0253-0d81f47dfe05-e92503acfb7d-1000--ronaldo-takes-tally-to-102/',
 italia:'https://it.uefa.com/news-media/news/0289-1a0153ac300d-82f7041b8f0e-1000--il-calcio-italiano-a-lutto-per-la-scomparsa-di-luigi-gigi/',
 italiaJogos:'https://www.uefa.com/news-media/news/0290-1bb41ad5dbf0-4fb33d3193c7-1000--gianluigi-buffon-to-receive-uefa-president-s-award/',
 holanda:'https://www.uefa.com/news-media/mediaservices/informationkits/competitions/european-qualifiers/2026/match/2044209/printmatchpresskits/',
 belgica:'https://www.uefa.com/european-qualifiers/news/0253-0d81f47dfe05-e92503acfb7d-1000--europe-s-top-international-scorers/',
 polonia:'https://www.uefa.com/european-qualifiers/news/0253-0d81f47dfe05-e92503acfb7d-1000--europe-s-top-international-scorers/',
 noruega:'https://theanalyst.com/players/4137/erling-haaland/national',
 uruguai:'https://www.fifa.com/pt/articles/luis-suarez-uruguai-aposentadoria-selecao',
 eua:'https://www.ussoccer.com/players/d/landon-donovan',
 euaDempsey:'https://www.ussoccer.com/players/d/clint-dempsey',
 japao:'https://inside.fifa.com/official-documents/annual-report/2025/in-memoriam',
 mexico:'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/javier-hernandez-mexico-interview',
 chile:'https://www.fifa.com/es/tournaments/mens/worldcup/articles/quienes-son-los-maximos-goleadores-de-la-historia-de-la-seleccion-chilena',
 colombia:'https://www.fifa.com/en/articles/luis-diaz-colombia-quotes-records-highlights',
 nigeria:'https://www.cafonline.com/afcon2025/news/the-totalenergies-caf-africa-cup-of-nations-greatest-goal-scorers-2025/',
 egito:'https://www.cafonline.com/afcon2025/news/five-star-egypt-start-maher-tenure-with-emphatic-win-in-salah-historic-night-mali-comeback-and-morocco-win-easily/',
 coreia:'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/son-heungmin-stats-quotes-records',
});
// [nome, posição, jogos, gols, fonte, destaque, período]
// Recordes de goleadores selecionados, com tratamento de empates (EUA).
const BASE = Object.freeze({
 Brasil: [
 ['Neymar','ATA',130,80,'brasil','Maior artilheiro segundo a CBF; partidas segundo levantamento de julho de 2026.','2010–2026'],
 ],
 Argentina: [
 ['Lionel Messi','ATA',208,126,'argentina','Recordista de gols e partidas da seleção argentina.','2005–2026'],
 ],
 Portugal: [
 ['Cristiano Ronaldo','ATA',234,146,'portugalGols','Maior artilheiro mundial de seleções masculinas e recordista de jogos de Portugal.','2003–2026'],
 ],
 Alemanha: [
 ['Miroslav Klose','ATA',137,71,'alemanha','Maior artilheiro da seleção alemã.','2001–2014'],
 ],
 Espanha: [
 ['David Villa','ATA',98,59,'espanha','Maior artilheiro histórico espanhol.','2005–2017'],
 ],
 França: [
 ['Kylian Mbappé','ATA',108,67,'franca','Superou Olivier Giroud durante a Copa de 2026; gols atualizados até novembro.','2017–2026'],
 ],
 Inglaterra: [
 ['Harry Kane','ATA',127,93,'inglaterra','Maior artilheiro da Inglaterra no levantamento da UEFA de novembro de 2026.','2015–2026'],
 ],
 Itália: [
 ['Luigi Riva','ATA',42,35,'italia','Maior artilheiro histórico italiano.','1965–1974'],
 ['Gianluigi Buffon','GOL',176,null,'italiaJogos','Mais jogos pela seleção italiana.','1997–2018'],
 ],
 Holanda: [
 ['Memphis Depay','ATA',109,55,'holanda','Marca internacional registrada em material de imprensa da UEFA; recorte de 2026.','2013–2026'],
 ],
 Bélgica: [
 ['Romelu Lukaku','ATA',135,94,'belgica','Maior artilheiro belga segundo a UEFA em novembro de 2026.','2010–2026'],
 ],
 Polônia: [
 ['Robert Lewandowski','ATA',172,92,'polonia','Maior artilheiro polonês segundo a UEFA em novembro de 2026.','2008–2026'],
 ],
 Noruega: [
 ['Erling Haaland','ATA',61,68,'noruega','Lidera a seleção norueguesa em gols, conforme dados Opta.','2019–2026'],
 ],
 Uruguai: [
 ['Luis Suárez','ATA',142,69,'uruguai','Maior artilheiro do Uruguai; segundo em partidas ao se despedir.','2007–2024'],
 ],
 'Estados Unidos': [
 ['Landon Donovan','ATA',157,57,'eua','Co-recordista de gols (com Clint Dempsey) e maior assistente histórico, 58.','2000–2014'],
 ['Clint Dempsey','ATA',null,57,'euaDempsey','Co-recordista de gols (com Landon Donovan).','2004–2017'],
 ],
 Japão: [
 ['Kunishige Kamamoto','ATA',76,75,'japao','Artilheiro histórico do Japão, conforme a FIFA.','1964–1977'],
 ],
 México: [
 ['Javier Hernández','ATA',null,52,'mexico','Maior artilheiro da seleção mexicana.','2009–2019'],
 ],
 Chile: [
 ['Alexis Sánchez','ATA',null,51,'chile','Maior artilheiro da seleção chilena.','2006–2026'],
 ],
 Colômbia: [
 ['Radamel Falcao','ATA',105,36,'colombia','Maior artilheiro da seleção colombiana na referência FIFA.','2007–2023'],
 ],
 Nigéria: [
 ['Rashidi Yekini','ATA',62,37,'nigeria','Maior artilheiro histórico da Nigéria.','1984–1998'],
 ],
 Egito: [
 ['Hossam Hassan','ATA',null,69,'egito','Marca histórica indicada pela CAF ao registrar Mohamed Salah com 68 gols em novembro de 2026.',null],
 ['Mohamed Salah','ATA',null,68,'egito','Marca parcial publicada em 13/11/2026, um gol atrás de Hossam Hassan.','2011–2026'],
 ],
 'Coreia do Sul': [
 ['Cha Bum-kun','ATA',null,58,'coreia','Referência histórica da FIFA antes da Copa de 2026; exige revisão do topo atual.','1972–1986'],
 ],
});
const REGISTROS = Object.freeze(Object.fromEntries(
 Object.entries(BASE).map(([pais,atletas])=>[pais,Object.freeze(atletas.map(([nome,posicao,jogos,gols,fonte,descricao,periodo])=>Object.freeze({
  nome,posicao,jogos,gols,descricao,periodo,fonte:FONTES[fonte]
 })))]),
));
const RECORDISTAS_GOLS = new Set([
 'Brasil','Argentina','Portugal','Alemanha','Espanha','França','Inglaterra','Itália',
 'Holanda','Bélgica','Polônia','Noruega','Uruguai','Estados Unidos','Japão',
 'México','Chile','Colômbia','Nigéria','Egito',
]);
const RECORDISTAS_JOGOS = Object.freeze({
 Argentina:'Lionel Messi',Portugal:'Cristiano Ronaldo',Itália:'Gianluigi Buffon',
});
export const ACERVO_SELECOES_HISTORICAS = Object.freeze(Object.fromEntries(NACIONALIDADES.map(({label,id})=>{
 const pais=nomeSelecaoHistorica(label),atletas=REGISTROS[pais]||REGISTROS[label]||Object.freeze([]);
 const titulos=Object.freeze(historicoDaSelecao(pais));
 const registrosAtletas=atletas.length? 'parcial_documentado':'pendente_apuracao';
 return [pais,Object.freeze({nome:pais,id,atualizadoEm:'2026-11-23',cobertura:registrosAtletas,atletas,titulos})];
})));
export function acervoSelecaoHistoricoDe(nome){
 const pais=nomeSelecaoHistorica(nome);
 return ACERVO_SELECOES_HISTORICAS[pais]||null;
}
export const REFERENCIAS_RECORDES_SELECOES = Object.freeze(Object.values(ACERVO_SELECOES_HISTORICAS).flatMap(x=>{
 const gols=RECORDISTAS_GOLS.has(x.nome) ? [...x.atletas].filter(a=>a.gols!=null)
   .sort((a,b)=>b.gols-a.gols)[0] : null;
 const jogos=RECORDISTAS_JOGOS[x.nome]&&x.atletas.find(a=>a.nome===RECORDISTAS_JOGOS[x.nome]);
 const base={tipo:'selecao',nome:x.nome,data:'2026-11-23',
   criterio:'Seleção principal masculina; histórico anterior ao save, sem somar atletas simulados.'};
 return [
  ...(gols?[{...base,id:'golsSelecao',atleta:gols.nome,valor:gols.gols,fonte:gols.fonte,
    destaque:x.nome==='Estados Unidos'?'Recorde compartilhado por Donovan e Dempsey':undefined,
    comparavel:x.nome!=='Egito'}]:[]),
  ...(jogos?.jogos?[{...base,id:'jogosSelecao',atleta:jogos.nome,valor:jogos.jogos,
    fonte:x.nome==='Portugal'?FONTES.portugal:jogos.fonte,comparavel:true}]:[]),
 ];
}));
export const TOTAL_SELECOES_COM_FICHA = Object.values(ACERVO_SELECOES_HISTORICAS).filter(x=>x.atletas.length>0).length;
