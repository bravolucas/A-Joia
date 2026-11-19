/* Base original derivada da Fjelstul World Cup Database (1930-2022),
 * com licenca CC-BY-SA 4.0; as referencias abaixo foram atualizadas a partir
 * dos levantamentos oficiais da FIFA apos a Copa do Mundo masculina de 2026.
 * A revisao nao atribui os resultados de 2026 ao CSV historico.
 */
export const FONTE_MARCAS_COPAS={
 autor:'Joshua C. Fjelstul, Ph.D.',copyright:'© 2023 Joshua C. Fjelstul, Ph.D.',
 url:'https://github.com/jfjelstul/worldcup',licenca:'CC-BY-SA 4.0',
 licencaUrl:'https://creativecommons.org/licenses/by-sa/4.0/',
 periodo:'CSV original até 2022; recordes revisados pela FIFA em 2026',
 fim:'2026-07-19'
};
export const MARCAS_COPAS=[
 {id:'gols-copas',nome:'Gols em Copas',atleta:'Kylian Mbappé',valor:22,tipo:'carreira',unidade:'gols',periodo:'1930–2026',
  fonte:'https://www.fifa.com/en/articles/fontaine-mbappe-ronaldo-and-more-every-world-cup-top-scorer'},
 {id:'gols-edicao',nome:'Gols em uma edição',atleta:'Just Fontaine',valor:13,ano:1958,tipo:'edicao',unidade:'gols',periodo:'1930–2026',
  fonte:'https://www.fifa.com/en/articles/fontaine-mbappe-ronaldo-and-more-every-world-cup-top-scorer'},
 {id:'jogos-copas',nome:'Jogos em Copas',atleta:'Lionel Messi',valor:34,tipo:'jogos',unidade:'jogos',periodo:'1930–2026',
  fonte:'https://www.fifa.com/en/tournaments/mens/worldcup/articles/players-most-appearances-games-matches-history'}
];