// Os números publicados permanecem no recorte da edição ou da partida.
const relatorioNational = 'https://media.fff.fr/uploads/documents/ra23-24_competitions-nationales.pdf';

const perfis = {
  Reims: [
    ['Just Fontaine', 'ATA', '1958/59', 'Foi o artilheiro da Copa dos Campeões Europeus com dez gols na edição em que o Reims chegou à final contra o Real Madrid.', 'https://www.uefa.com/news-media/news/027f-176dd16122e4-e75fd1fbb1d9-1000--french-football-mourns-just-fontaine/'],
  ],
  Troyes: [
    ['Benjamin Nivet', 'MEI', '2016/17', 'Liderou o Troyes na campanha do acesso à Ligue 1 em 2017. Naquela temporada completou 40 anos e ultrapassou 600 jogos como profissional, segundo a história oficial do clube.', 'https://www.estac.fr/le-club/histoire/'],
  ],
  Toulouse: [
    ['Logan Costa', 'ZAG', '2022/23', 'Marcou dois gols na final da Copa da França de 2023, conquistada pelo Toulouse contra o Nantes.', 'https://www.toulousefc.com/play/blog/2024/08/logan-costa-quitte-le-tefece-et-s-engage-a-villarreal'],
  ],
  Strasbourg: [
    ['Joaquín Panichelli', 'ATA', '2025/26', 'Marcou o gol de empate aos 79 minutos no 1 a 1 com o Jagiellonia, pela fase de liga da UEFA Conference League.', 'https://www.uefa.com/uefaconferenceleague/match/2046323/'],
  ],
  Rennes: [
    ['Benjamin Bourigeaud', 'MC', '2018/19', 'Marcou contra o Orléans nas quartas de final da Copa da França, na campanha em que o Rennes conquistou o título contra o PSG.', 'https://www.staderennais.com/actualites/equipe-pro/cdf-srfcuso-laventure-continue', 'https://www.staderennais.com/actualites/equipe-pro/cest-nous-quon-la-gagnee'],
  ],
  Nice: [
    ['Just Fontaine', 'ATA', '1953–1956', 'Artilheiro do Nice em 1954/55 com 20 gols segundo o clube. Conquistou o campeonato francês de 1956 pelo Nice.', 'https://www.ogcnice.com/fr/fiche/3022/just-fontaine.html'],
  ],
  'Le Havre': [
    ['Victor Lekhal', 'VOL', '2022/23', 'Integra a seleção da temporada da Ligue 2 registrada pela FFF, na campanha do título do Le Havre, que terminou com 79 pontos.', 'https://media.fff.fr/uploads/documents/ra22-23_competitions-nationales.pdf'],
  ],
  Brest: [
    ['Hugo Magnetti', 'MC', '2024/25', 'Marcou o primeiro gol do Brest em competições europeias na vitória por 2 a 1 sobre o Sturm Graz, na estreia do clube na Liga dos Campeões.', 'https://www.uefa.com/uefachampionsleague/news/0295-1ccdcdd67cb5-b8f7482e2a47-1000--shakhtar-donetsk-vs-brest-facts/'],
  ],
  'Paris FC': [
    ['Ilan Kebbal', 'MEI', '2025/26', 'Ganhou o prêmio de melhor gol de agosto de 2025 pelo gol contra o Olympique de Marseille na segunda rodada da Ligue 1.', 'https://parisfc.fr/equipe-pro/ilan-kebbal-remporte-le-trophee-du-plus-beau-but-du-mois-daout/'],
  ],
  Rodez: [
    ['Killian Corredor', 'ATA', '2023/24', 'O Rodez registrou 19 gols e oito assistências somando todas as competições da temporada. Corredor marcou também contra o Paris FC na primeira rodada dos playoffs da Ligue 2.', 'https://rodezaveyronfootball.com/2024/08/mercato-merci-pour-tout-killian-corredor/'],
  ],
  Laval: [
    ['Malik Tchokounté', 'ATA', '2023/24', 'Foi o artilheiro do Stade Lavallois na temporada 2023/24, conforme a retrospectiva publicada pelo Dunkerque antes do reencontro com o atacante.', 'https://www.usldunkerque.com/lavalusld-la-presentation-de-ladversaire-2/'],
  ],
  'Pau FC': [
    ['Moussa Sylla', 'ATA', '2023/24', 'O Schalke 04 registrou 15 gols e sete assistências na temporada de Sylla pelo Pau FC, antes de contratá-lo em 2024.', 'https://schalke04.de/personal/neuzugang-moussa-sylla/'],
  ],
  Amiens: [
    ['Louis Mafouta', 'ATA', '2023/24 e 2024/25', 'O Amiens identificou Mafouta como artilheiro da equipe em cada uma de suas duas temporadas pelo clube.', 'https://www.amiensfootball.com/actualites/louis-mafouta-quitte-l-amiens-sc'],
  ],
  Dunkerque: [
    ['Yacine Bammou', 'ATA', '2024/25', 'Fechou o placar nos acréscimos da vitória por 3 a 1 sobre o Haguenau, classificando o Dunkerque para as oitavas da Copa da França.', 'https://www.fff.fr/article/14030-16es-dunkerque-s-en-sort-a-haguenau.html'],
  ],
  Martigues: [
    ['Amine Hemia', 'MEI', '2023/24', 'Integra a seleção da temporada do Championnat National publicada pela FFF. O Martigues ficou em segundo e subiu para a Ligue 2.', relatorioNational],
    ['Yanis Zouaoui', 'LAT', '2023/24', 'Foi incluído na defesa da seleção da temporada do Championnat National pela FFF na campanha de acesso do Martigues.', relatorioNational],
  ],
  'Red Star': [
    ['Merwan Ifnaoui', 'MEI', '2023/24', 'Eleito melhor jogador do Championnat National na edição em que o Red Star conquistou o título e o acesso para a Ligue 2.', relatorioNational],
    ['Quentin Beunardeau', 'GOL', '2023/24', 'Eleito melhor goleiro do Championnat National durante a campanha do título do Red Star.', relatorioNational],
  ],
};

export const ACERVO_ATLETAS_HISTORICOS_FRANCA = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, atletas]) => [clube, Object.freeze(
    atletas.map(([nome, posicao, periodo, descricao, fonte, fonteAdicional]) =>
      Object.freeze({nome, posicao, periodo, descricao, fonte, jogos: null, gols: null,
        ...(fonteAdicional ? {fontesAdicionais: Object.freeze([fonteAdicional])} : {}),
      })),
  )]),
));
