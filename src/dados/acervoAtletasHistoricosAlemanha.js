// A posição do clube no catálogo é independente da divisão em que ocorreu cada marco.
const bundesliga = 'https://www.bundesliga.com/en/bundesliga/';
const perfis = {
  Paderborn: [
    ['Moritz Stoppelkamp', 'MEI', '2014/15', 'Marcou de 82,3 metros nos acréscimos do 2 a 0 contra o Hannover 96. A Bundesliga registrou a distância como recorde da competição.', bundesliga + 'news/paderborn-club-by-club-historical-guide-furthest-goal-stoppelkamp-24305'],
  ],
  Freiburg: [
    ['Vincenzo Grifo', 'MEI', '2022/23', 'Marcou 15 gols pelo Freiburg na Bundesliga, um a menos que os dois artilheiros da edição.', bundesliga + 'stats/overview/2022-2023'],
  ],
  Hoffenheim: [
    ['Andrej Kramarić', 'ATA', '2019/20', 'Marcou os quatro gols da vitória por 4 a 0 sobre o Borussia Dortmund na rodada final. Foi o primeiro atleta do Hoffenheim a marcar quatro vezes em uma partida da primeira divisão.', bundesliga + 'matchday/2019-2020/34/borussia-dortmund-vs-tsg-hoffenheim/liveticker'],
  ],
  'Union Berlin': [
    ['Rani Khedira', 'VOL', '2022/23', 'O capitão fez o gol do 1 a 0 sobre o Werder Bremen na rodada final, que garantiu ao Union Berlin a classificação para a Liga dos Campeões.', bundesliga + 'matchday/2022-2023/34/1-fc-union-berlin-vs-sv-werder-bremen/liveticker'],
    ['Sheraldo Becker', 'ATA', '2022/23', 'Marcou 11 gols pelo Union Berlin na edição da Bundesliga em que o clube se classificou para a Liga dos Campeões.', bundesliga + 'matchday/2022-2023/34/1-fc-union-berlin-vs-sv-werder-bremen/liveticker'],
  ],
  'RB Leipzig': [
    ['Christopher Nkunku', 'ATA', '2022/23', 'Dividiu a artilharia da Bundesliga com Niclas Füllkrug, do Werder Bremen. Cada um marcou 16 gols na edição.', bundesliga + 'news/a-history-of-top-scorers-by-season-lewandowski-muller-aubameyang-19353'],
  ],
  'Mainz 05': [
    ['Jonathan Burkardt', 'ATA', '2024/25', 'Fez 18 gols em 29 jogos na Bundesliga e terminou a temporada com 41 gols pelo Mainz na história da competição, maior marca do clube àquela data.', bundesliga + 'news/mainz-05-season-to-remember-henriksen-burkardt-amiri-europe-32206'],
  ],
  Augsburg: [
    ['Ermedin Demirović', 'ATA', '2023/24', 'Marcou 15 gols na Bundesliga 2023/24 pelo Augsburg, a melhor marca do clube em uma edição até então.', bundesliga + 'stats/players/goals/2023-2024'],
  ],
  'FC Köln': [
    ['Hans Schäfer', 'PE', '1963/64', 'Liderou o Köln ao título na primeira edição da Bundesliga.', bundesliga + 'news/60-years-anniversary-fans-goals-stars-24240'],
    ['Lukas Podolski', 'ATA', '2004/05', 'Foi o artilheiro da segunda divisão alemã com 24 gols em 30 jogos na campanha de acesso do Köln.', bundesliga + 'news/lukas-podolski-germany-legend-bayern-munich-cologne-arsenal-19693'],
  ],
  'Hamburger SV': [
    ['Uwe Seeler', 'ATA', '1963/64', 'Foi o primeiro artilheiro da história da Bundesliga. Marcou 30 gols em 30 partidas pelo Hamburger SV na edição inaugural.', bundesliga + 'news/hamburger-sv-bundesliga-club-by-club-historical-guide-keegan-seeler-24135'],
  ],
  'Hertha Berlim': [
    ['Marcelinho Paraíba', 'MEI', '2004/05', 'Marcou 18 gols pelo Hertha Berlin na Bundesliga, segundo a tabela de artilharia da federação alemã.', 'https://datencenter.dfb.de/en/competitions/bundesliga/seasons/2004-2005/top_scorer'],
  ],
  'Fortuna Düsseldorf': [
    ['Rouwen Hennings', 'ATA', '2019/20', 'Chegou a 15 gols na Bundesliga ao marcar contra o Augsburg na 33ª rodada. Um jogador do Fortuna não alcançava essa marca desde Thomas Allofs em 1990/91.', 'https://www.bundesliga.com/de/bundesliga/spieltag/2019-2020/33/fortuna-duesseldorf-vs-fc-augsburg/liveticker'],
  ],
  Kaiserslautern: [
    ['Fritz Walter', 'MEI', '1950/51 e 1952/53', 'Liderou o Kaiserslautern nos títulos alemães de 1951 e 1953, disputados antes da criação da Bundesliga.', 'https://fck.de/fck/verein/tradition/'],
  ],
  Nürnberg: [
    ['Max Morlock', 'ATA', '1948 e 1961', 'Conquistou os campeonatos alemães de 1948 e 1961 com o Nürnberg, antes da criação da Bundesliga.', 'https://www.fcn.de/news/artikel/max-morlock-vom-strassenfussballer-zum-weltmeister/'],
  ],
  'Darmstadt 98': [
    ['Tobias Kempe', 'MEI', '2015 e 2023', 'Participou de dois acessos do Darmstadt à Bundesliga, em 2015 e 2023, ao longo de dez temporadas pelo clube.', 'https://www.sv98.de/tobias-kempes-time-as-a-lilien-professional-ends-after-the-season/'],
  ],
  'Karlsruher SC': [
    ['Marvin Wanitzek', 'MEI', '2024/25', 'Marcou 13 gols pelo Karlsruher na segunda divisão alemã. Fez seu primeiro hat-trick na competição contra o Köln, segundo o relato oficial da partida.', 'https://www.bundesliga.com/en/2bundesliga/stats/players/goals/2024-2025', 'https://www.bundesliga.com/en/2bundesliga/matchday/2024-2025/7/1-fc-koeln-vs-karlsruher-sc/liveticker'],
  ],
  'Hannover 96': [
    ['Lars Stindl', 'MEI', '2011/12', 'Marcou de voleio o gol da virada por 2 a 1 sobre o København, em Copenhague, pela fase de grupos da Liga Europa.', 'https://www.uefa.com/uefaeuropaleague/news/01f7-0ea3c21d59d3-e89cc79f6bc5-1000--stindl-seals-hannover-comeback-at-kobenhavn/'],
  ],
  Magdeburg: [
    ['Wolfgang Seguin', 'MC', '1973/74', 'Fez o segundo gol do Magdeburg no 2 a 0 sobre o Milan na final da Recopa Europeia, em Roterdã.', 'https://www.uefa.com/news-media/news/019d-0f8fc052b1ca-8673f1409f8c-1000--magdeburg-s-happy-anniversary/'],
  ],
  'Greuther Fürth': [
    ['Branimir Hrgota', 'ATA', '2020/21', 'Marcou 16 gols na campanha de acesso do Greuther Fürth à primeira divisão alemã.', 'https://www.bundesliga.com/en/2bundesliga/stats/players/goals/2020-2021'],
  ],
  'Eintracht Braunschweig': [
    ['Lothar Ulsaß', 'MEI', '1966/67', 'Marcou 15 gols em 32 partidas pelo Eintracht Braunschweig na campanha do título da Bundesliga.', 'https://www.eintracht.com/eintracht/chronik/geschichte-von-frueher/artikel/eintracht-erinnert-an-lothar-ulsass'],
  ],
  'Preußen Münster': [
    ['Joel Grodowski', 'ATA', '2023/24', 'Participou do acesso do Preußen Münster à segunda divisão. A DFB registrou 17 gols em 36 jogos da 3. Liga nessa campanha.', 'https://datencenter.dfb.de/datencenter/personen/joel-grodowski/spieler', 'https://scpreussen-muenster.de/news/der-adler-fliegt-weiter-joel-grodowski-verlaengert-vorzeitig/'],
  ],
  'SSV Ulm': [
    ['Léo Scienza', 'PE', '2023/24', 'Eleito pela DFB o melhor jogador da 3. Liga na campanha do título do Ulm. O clube registrou 12 gols e 15 assistências em 34 jogos oficiais da temporada.', 'https://www.dfb.de/news/detail/ulmer-triumph-perfekt-scienza-und-woerle-sind-spieler-und-trainer-der-saison-261376', 'https://www.ssvulm1846-fussball.de/profis/leo-scienza-wechselt-zum-1-fc-heidenheim/'],
  ],
  Wolfsburg: [
    ['Grafite', 'ATA', '2008/09', 'Foi o artilheiro da Bundesliga com 28 gols e ajudou o Wolfsburg a conquistar seu primeiro título na competição.', bundesliga + 'news/iconic-teams-wolfsburg-2008-09-champions-dzeko-grafite-magath-24937/'],
  ],
  Heidenheim: [
    ['Tim Kleindienst', 'ATA', '2022/23', 'Foi artilheiro da segunda divisão, com 25 gols. Marcou nos acréscimos da última rodada o gol que garantiu ao Heidenheim o título e o primeiro acesso à Bundesliga.', 'https://www.bundesliga.com/de/bundesliga/news/tim-kleindienst-1-fc-heidenheim-borussia-monchengladbach-24-spieltag-31118'],
  ],
  'St. Pauli': [
    ['Marcel Hartel', 'MEI', '2023/24', 'Artilheiro do St. Pauli na campanha do acesso, com 17 gols na segunda divisão alemã.', 'https://www.bundesliga.com/en/2bundesliga/videos/goals/2023-2024/marcel-hartel', bundesliga + 'news/what-is-recipe-promoted-teams-stay-up-relegation-hamburg-hsv-cologne-33107'],
  ],
  Elversberg: [
    ['Fisnik Asllani', 'ATA', '2024/25', 'Marcou 18 gols na segunda divisão alemã, na campanha em que o Elversberg terminou em terceiro lugar e disputou o playoff de acesso.', bundesliga + 'news/fisnik-asllani-contract-extension-hoffenheim-kosovo-forward-33078'],
  ],
};

export const ACERVO_ATLETAS_HISTORICOS_ALEMANHA = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, atletas]) => [clube, Object.freeze(
    atletas.map(([nome, posicao, periodo, descricao, fonte, fonteAdicional]) =>
      Object.freeze({nome, posicao, periodo, descricao, fonte, jogos: null, gols: null,
        ...(fonteAdicional ? {fontesAdicionais: Object.freeze([fonteAdicional])} : {}),
      })),
  )]),
));
