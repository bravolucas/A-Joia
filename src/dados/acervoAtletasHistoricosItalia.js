const perfis = {
  Sassuolo: [
    ['Domenico Berardi', 'PD', '2013/14', 'Marcou os quatro gols do Sassuolo no 4 a 3 sobre o Milan em janeiro de 2014. Segundo a Lega Serie A, foi o primeiro jogador a marcar quatro vezes contra o Milan em uma partida da competição.', 'https://www.legaseriea.it/serie-a/news/berardi-contro-il-milan-la-saga-continua'],
  ],
  Frosinone: [
    ['Leonardo Blanchard', 'ZAG', '2015/16', 'Marcou nos acréscimos o gol do 1 a 1 contra a Juventus, fora de casa, que deu ao Frosinone seu primeiro ponto na Serie A.', 'https://www.frosinonecalcio.com/wp-content/uploads/2023/12/numero-09-small.pdf'],
    ['Federico Dionisi', 'ATA', '2015/16', 'Marcou os dois gols da vitória por 2 a 0 sobre o Empoli, a primeira do Frosinone na Serie A.', 'https://www.ansa.it/amp/sito/notizie/sport/2015/09/27/serie-a-frosinone-empoli-atalanta-sampdoria_32caeb54-2049-4b3f-a9f1-0a6032981e39.html'],
  ],
  Venezia: [
    ['Joel Pohjanpalo', 'ATA', '2023/24', 'Foi o artilheiro da Serie B com 22 gols na edição em que o Venezia conquistou o acesso à Serie A.', 'https://www.veneziafc.it/news/joel-pohjanpalo-al-palermo'],
  ],
  Udinese: [
    ['Antonio Di Natale', 'ATA', '2004–2016', 'Foi artilheiro da Serie A em 2009/10, com 29 gols, e em 2010/11, com 28. A Udinese registra 445 partidas e 227 gols pelo clube, somando as competições.', 'https://www.udinese.it/Apps/WebObjects/Udinese.woa/wa/viewSection?id=35844&lang=ita', 445, 227],
  ],
  Torino: [
    ['Paolo Pulici', 'ATA', '1968–1982', 'Foi artilheiro da Serie A com 21 gols na campanha do título de 1975/76. O Torino registra 437 partidas e 172 gols pelo clube.', 'https://www.torinofc.it/news/27/04/2025/tanti-auguri_22282', 437, 172, 'https://www.torinofc.it/storia/il-torino-vince-il-campionato'],
  ],
  Bologna: [
    ['Dan Ndoye', 'PD', '2024/25', 'Marcou aos 53 minutos o único gol da final da Copa da Itália contra o Milan, disputada no Estádio Olímpico de Roma.', 'https://img.legaseriea.it/vimages/68250f90/2024-25_CPITA_FINAL_UNI_1_MILBOL.pdf'],
  ],
  Genoa: [
    ['Diego Milito', 'ATA', '2008/09', 'Marcou 24 gols em 31 partidas da Serie A pelo Genoa na temporada anterior à sua transferência para a Internazionale.', 'https://www.uefa.com/uefachampionsleague/news/01df-0e73396f6e49-341ec120cc29-1000--milito-underlines-inter-ambitions/'],
  ],
  Cagliari: [
    ['Luigi Riva', 'ATA', '1969/70', 'Marcou 21 gols na campanha em que o Cagliari conquistou o campeonato italiano. Era conhecido como Gigi Riva.', 'https://cagliaricalcio.com/en/news/forever-gigi-riva/'],
  ],
  Como: [
    ['Patrick Cutrone', 'ATA', '2023/24', 'O Como registra 14 gols do atacante na temporada que terminou com o acesso à Serie A.', 'https://comofootball.com/patrick-cutrone-prolunga-il-contratto-fino-al-2028/'],
  ],
  Lecce: [
    ['Javier Ernesto Chevantón', 'ATA', '2003/04', 'Marcou 19 gols pelo Lecce na Serie A. O clube registra essa marca como seu recorde individual de uma edição da primeira divisão naquele levantamento.', 'https://oo.uslecce.it/storia'],
  ],
  Monza: [
    ['Dany Mota', 'ATA', '2021/22', 'Abriu o placar no 2 a 1 sobre o Pisa na ida da final dos playoffs da Serie B. O Monza conquistou o primeiro acesso à Serie A na volta.', 'https://www.acmonza.com/it/news/3678/', null, null, 'https://www.acmonza.com/news/3689/'],
  ],
};

export const ACERVO_ATLETAS_HISTORICOS_ITALIA = Object.freeze(Object.fromEntries(
  Object.entries(perfis).map(([clube, atletas]) => [clube, Object.freeze(
    atletas.map(([nome, posicao, periodo, descricao, fonte, jogos = null, gols = null, fonteAdicional]) =>
      Object.freeze({nome, posicao, periodo, descricao, fonte, jogos, gols,
        ...(fonteAdicional ? {fontesAdicionais: Object.freeze([fonteAdicional])} : {}),
      })),
  )]),
));
