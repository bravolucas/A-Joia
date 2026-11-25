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
  Elversberg: [
    ['Fisnik Asllani', 'ATA', '2024/25', 'Marcou 18 gols na segunda divisão alemã, na campanha em que o Elversberg terminou em terceiro lugar e disputou o playoff de acesso.', bundesliga + 'news/fisnik-asllani-contract-extension-hoffenheim-kosovo-forward-33078'],
  ],
};

export const ACERVO_ATLETAS_HISTORICOS_ALEMANHA = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, atletas]) => [clube, Object.freeze(
    atletas.map(([nome, posicao, periodo, descricao, fonte]) =>
      Object.freeze({nome, posicao, periodo, descricao, fonte, jogos: null, gols: null})),
  )]),
));
