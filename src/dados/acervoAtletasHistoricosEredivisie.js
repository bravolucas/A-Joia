const liga = 'https://eredivisie.nl/nieuws/';

const perfis = {
  AZ: [
    ['Vangelis Pavlidis', 'ATA', '2023/24', 'Dividiu a artilharia da Eredivisie com Luuk de Jong, do PSV. Cada um marcou 29 gols na edição.', liga + 'vangelis-pavlidis-en-luuk-de-jong-winnaars-willy-van-der-kuijlen-trofee-2023-24/'],
  ],
  Twente: [
    ['Dick van Dijk', 'ATA', '1968/69', 'Dividiu a artilharia da Eredivisie com Ove Kindvall, com 30 gols na edição.', liga + 'tasos-douvikas-en-xavi-simons-winnaars-willy-van-der-kuijlen-trofee-2022-23/'],
    ['Sem Steijn', 'MEI', '2024/25', 'Ganhou o Troféu Willy van der Kuijlen como artilheiro da Eredivisie, com 24 gols na edição.', liga + 'sem-steijn-winnaar-willy-van-der-kuijlen-trofee-2024-25/'],
  ],
  Utrecht: [
    ['Anastasios Douvikas', 'ATA', '2022/23', 'Dividiu a artilharia da Eredivisie com Xavi Simons, com 19 gols na edição.', liga + 'tasos-douvikas-en-xavi-simons-winnaars-willy-van-der-kuijlen-trofee-2022-23/'],
  ],
  NEC: [
    ['Tjaronn Chery', 'MEI', '2023/24', 'Foi eleito jogador de maio de 2024 pela Eredivisie na campanha em que o NEC ficou em sexto lugar e chegou à final da Copa dos Países Baixos.', liga + 'tjaronn-chery-verkozen-tot-eredivisie-speler-van-de-maand-mei/'],
  ],
  'Go Ahead Eagles': [
    ['Oliver Antman', 'PD', '2024/25', 'Destaque do Go Ahead Eagles na Eredivisie. A liga registrou 13 participações em gols entre dezembro de 2024 e a publicação do balanço de 14 de março de 2025, com cinco gols e oito assistências nesse intervalo.', liga + 'uitgelicht-oliver-antman-laat-go-ahead-eagles-vliegen/'],
  ],
  Heerenveen: [
    ['Georgios Samaras', 'ATA', 'até janeiro de 2006', 'A UEFA registrou 25 gols em 88 partidas da Eredivisie pelo Heerenveen quando o atacante se transferiu para o Manchester City.', 'https://www.uefa.com/news-media/news/01b1-0f8eecac6019-187845b438c7-1000--city-content-with-samaras-signing/'],
  ],
  'Sparta Rotterdam': [
    ['Ruud Geels', 'ATA', '1980/81', 'Foi artilheiro da Eredivisie pelo Sparta Rotterdam, com 22 gols na edição.', liga + 'sparta-rotterdam-bereikt-mijlpaal-van-3-000-competitiedoelpunten/'],
  ],
  Groningen: [
    ['Erik Nevland', 'ATA', '2005/06', 'Dividiu a artilharia do Groningen na Eredivisie com Yuri Cornelisse. Cada um marcou oito gols na edição.', liga + '70-jaar-ons-voetbal-het-shirt-van-fc-groningen/'],
  ],
  'Fortuna Sittard': [
    ['Zian Flemming', 'ATA', '2020–2022', 'Artilheiro do Fortuna nas duas temporadas. Na despedida, o clube informou 25 gols e 11 assistências em 62 partidas com sua camisa.', 'https://fortunasittard.nl/en/news/fortuna-verkoopt-zian-flemming-aan-millwall'],
  ],
  'PEC Zwolle': [
    ['Ryan Thomas', 'MC', '2013/14', 'Marcou dois gols na vitória por 5 a 1 sobre o Ajax na final da Copa dos Países Baixos.', 'https://peczwolle.nl/nieuws/pec-zwolle-wint-de-knvb-beker'],
    ['Guyon Fernandez', 'ATA', '2013/14', 'Marcou dois gols na final da Copa dos Países Baixos de 2014, conquistada contra o Ajax.', 'https://peczwolle.nl/nieuws/pec-zwolle-wint-de-knvb-beker'],
  ],
  Excelsior: [
    ['Thijs Dallinga', 'ATA', '2021/22', 'Terminou a fase regular da segunda divisão neerlandesa com 32 gols, liderou a artilharia e foi eleito pelos torcedores o jogador do ano do Excelsior.', 'https://excelsiorrotterdam.nl/2022/05/fans-kiezen-thijs-dallinga-als-speler-van-het-jaar/'],
  ],
  'Willem II': [
    ['Vangelis Pavlidis', 'ATA', 'até junho de 2021', 'Eleito pelos torcedores o jogador da temporada 2020/21. Na despedida, o Willem II registrou 33 gols em 82 jogos pelo clube.', 'https://www.willem-ii.nl/artikel/thank-you-pavli'],
  ],
  Cambuur: [
    ['Robert Mühren', 'ATA', '2020/21', 'Marcou 38 gols na campanha do título do Cambuur na segunda divisão neerlandesa.', 'https://cambuur.nl/nieuws/het-jaar-2021-in-twaalf-fotos/'],
  ],
  'ADO Den Haag': [
    ['Lex Immers', 'MEI', '2007–2020, em duas passagens', 'O ADO registrou 259 jogos oficiais e 49 gols na despedida do meio-campista em 2020.', 'https://adodenhaag.nl/nl/nieuws/laatste-nieuws/1e-elftal/8976-ado-den-haag-en-lex-immers-in-goed-overleg-uit-elkaar', 259, 49],
  ],
  Telstar: [
    ['Youssef El Kachati', 'ATA', '2024/25', 'Marcou cinco gols em seis jogos dos playoffs que garantiram o retorno do Telstar à Eredivisie para 2025/26, após 47 anos.', liga + 'telstar-promoveert-na-47-jaar-naar-de-eredivisie/'],
  ],
};

export const ACERVO_ATLETAS_HISTORICOS_EREDIVISIE = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, atletas]) => [clube, Object.freeze(
    atletas.map(([nome, posicao, periodo, descricao, fonte, jogos = null, gols = null]) =>
      Object.freeze({nome, posicao, periodo, descricao, fonte, jogos, gols})),
  )]),
));
