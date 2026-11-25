// Perfis documentados pela liga ou pelo próprio clube. O período indica o recorte citado.
const mls = 'https://www.mlssoccer.com/news/';
const mvpDaFinal = mls + 'history-of-mls-cup-mvps-321202';
const finais = mls + 'mls-cup-winners';
const mvpsDaLiga = mls + 'landon-donovan-mls-most-valuable-player-winners';
const mvpsRecentes = 'https://es.mlssoccer.com/noticias/jugadores-mas-valiosos-figuras-mls-cup-historia';

const porClube = {
  'Seattle Sounders': [
    ['Stefan Frei', 'GOL', '2016', 'Goleiro eleito o melhor da final da MLS Cup de 2016. Seattle venceu o Toronto FC nos pênaltis.', finais],
    ['Víctor Rodríguez', 'MEI', '2019', 'Eleito o melhor da final da MLS Cup de 2019. Marcou o segundo gol do Seattle na vitória por 3 a 1 sobre o Toronto FC.', finais],
  ],
  'Atlanta United': [
    ['Josef Martínez', 'ATA', '2018', 'Eleito o melhor da temporada regular da MLS e o melhor da final da MLS Cup em 2018. Abriu o placar da final contra o Portland Timbers.', finais, mvpsDaLiga],
  ],
  'LA Galaxy': [
    ['Landon Donovan', 'ATA', '2011', 'Eleito o melhor da final da MLS Cup de 2011. Fez o gol do título contra o Houston Dynamo.', finais],
    ['Gastón Brugman', 'MC', '2024', 'Eleito o melhor da final da MLS Cup de 2024. Deu a assistência para o primeiro gol contra o New York Red Bulls.', mls + 'la-galaxy-win-mls-cup-2024-presented-by-audi-defeating-new-york-red-bulls-2-1'],
  ],
  'Inter Miami': [
    ['Lionel Messi', 'ATA', '2024–2025', 'Melhor jogador da temporada regular de 2024 e da final da MLS Cup de 2025. Deu duas assistências na vitória sobre o Vancouver Whitecaps na final de 2025.', mls + 'inter-miami-cf-win-2025-mls-cup-presented-by-audi', mls + 'inter-miami-cf-forward-lionel-messi-named-2024-landon-donovan-mls-most-valuable-player'],
  ],
  LAFC: [
    ['Carlos Vela', 'ATA', '2019', 'Eleito o melhor jogador da temporada regular da MLS em 2019 pelo Los Angeles FC.', mvpsDaLiga],
    ['John McCarthy', 'GOL', '2022', 'Eleito o melhor da final da MLS Cup de 2022 pelo Los Angeles FC.', mvpsRecentes],
  ],
  'New York City FC': [
    ['Sean Johnson', 'GOL', '2021', 'Eleito o melhor da final da MLS Cup de 2021 após ajudar na vitória sobre o Portland Timbers nos pênaltis.', mls + 'nycfc-goalkeeper-sean-johnson-named-mls-cup-mvp-pres-by-audi'],
  ],
  'Columbus Crew': [
    ['Guillermo Barros Schelotto', 'ATA', '2008', 'Eleito o melhor da final da MLS Cup de 2008 pelo Columbus Crew.', mvpDaFinal],
    ['Lucas Zelarayán', 'MEI', '2020', 'Eleito o melhor da final da MLS Cup de 2020. Marcou duas vezes na vitória sobre o Seattle Sounders.', finais],
    ['Cucho Hernández', 'ATA', '2023', 'Eleito o melhor da final da MLS Cup de 2023. Abriu o placar contra o Los Angeles FC e terminou os playoffs com cinco gols.', mls + 'columbus-crew-win-2023-mls-cup-presented-by-audi-defeating-lafc-2-1'],
  ],
  'Philadelphia Union': [
    ['Andre Blake', 'GOL', '2022', 'Recebeu o prêmio de melhor goleiro da temporada regular da MLS pela terceira vez em 2022. A liga registrou 15 jogos sem sofrer gol naquela fase.', mls + 'philadelphia-union-s-andre-blake-named-2022-allstate-mls-goalkeeper-of-the-year', mls + 'finalists-announced-for-2022-mls-year-end-awards'],
  ],
  'FC Cincinnati': [
    ['Luciano Acosta', 'MEI', '2023', 'Primeiro atleta do FC Cincinnati eleito o melhor jogador da temporada regular da MLS. Foi destaque na campanha do Supporters’ Shield de 2023.', mls + 'fc-cincinnati-s-luciano-lucho-acosta-named-2023-landon-donovan-mls-most-valuable'],
  ],
  'Real Salt Lake': [
    ['Nick Rimando', 'GOL', '2009', 'Eleito o melhor da final da MLS Cup de 2009. O Real Salt Lake conquistou o título nos pênaltis contra o LA Galaxy.', mvpDaFinal],
  ],
  'Minnesota United': [
    ['Robin Lod', 'MEI', '2024', 'Somou sete gols e 15 assistências na fase regular da MLS de 2024. Igualou a marca de assistências do clube em uma temporada regular estabelecida por Darwin Quintero em 2018.', 'https://www.mnufc.com/players/robin-lod/'],
  ],
  'Houston Dynamo': [
    ['Brian Ching', 'ATA', '2006', 'Eleito o melhor da final da MLS Cup de 2006 pelo Houston Dynamo.', mvpDaFinal],
    ['Dwayne De Rosario', 'MEI', '2007', 'Eleito o melhor da final da MLS Cup de 2007 pelo Houston Dynamo.', mvpDaFinal],
  ],
  'Vancouver Whitecaps': [
    ['Brian White', 'ATA', '2025', 'Recebeu a Chuteira de Ouro Domenic Mobilio, prêmio de artilharia do Vancouver Whitecaps em 2025.', 'https://www.whitecapsfc.com/news/2025-player-awards'],
  ],
  'Orlando City': [
    ['Facundo Torres', 'ATA', '2022', 'Marcou dois gols e deu uma assistência no 3 a 0 sobre o Sacramento Republic na final da U.S. Open Cup de 2022.', mls + 'us-open-cup-champions-orlando-city-achieve-history-beat-sacramento-republic-3-0'],
  ],
  'Colorado Rapids': [
    ['Conor Casey', 'ATA', '2010', 'Eleito o melhor da final da MLS Cup de 2010 pelo Colorado Rapids.', mvpDaFinal],
  ],
  'Portland Timbers': [
    ['Diego Valeri', 'MEI', '2015–2017', 'Eleito o melhor da final da MLS Cup em 2015 e o melhor jogador da temporada regular da MLS em 2017.', mls + 'portland-timbers-midfielder-diego-valeri-named-landon-donovan-mls-mvp'],
  ],
  'Nashville SC': [
    ['Hany Mukhtar', 'MEI', '2022', 'Eleito o melhor jogador da temporada regular da MLS de 2022 após conquistar a artilharia da mesma fase.', mls + 'nashville-sc-s-hany-mukhtar-named-2022-landon-donovan-mls-most-valuable-player'],
  ],
  'Charlotte FC': [
    ['Karol Świderski', 'ATA', '2022', 'Marcou o primeiro gol do Charlotte em casa na vitória inaugural do clube, por 3 a 1 sobre o New England Revolution.', 'https://www.charlottefootballclub.com/news/full-time-brilliant-team-effort-in-charlotte-fc-s-first-ever-win'],
  ],
};

export const ACERVO_ATLETAS_HISTORICOS_MLS = Object.freeze(Object.fromEntries(
  Object.entries(porClube).map(([clube, perfis]) => [clube, Object.freeze(
    perfis.map(([nome, posicao, periodo, descricao, fonte, fonteAdicional]) => Object.freeze({
      nome, posicao, periodo, descricao, fonte, jogos: null, gols: null,
      ...(fonteAdicional ? {fontesAdicionais: Object.freeze([fonteAdicional])} : {}),
    })),
  )]),
));
