# Referência verificada e limite de comparação

Durante a espera pelo Pages, foi consultado o JSON público de resultados da Premier League 2017/18:

https://github.com/openfootball/football.json/blob/master/2017-18/en.1.json

Arquivo consultado: https://raw.githubusercontent.com/openfootball/football.json/master/2017-18/en.1.json

SHA-256: `b635f2442a94aa91d85f282fc5e8f7f5dc4f0d04e3e30c4472102f5708d7548c`.

Conferência: 380 partidas, cálculo de três pontos por vitória e um por empate. Manchester City terminou com **100 pontos em 38 jogos**. A consulta verifica essa campanha; não demonstra sozinha um máximo histórico de todas as temporadas. O JSON completo não é distribuído no jogo.

## Por que não entrou como um contador no produto

`simularLiga` em `rapido.js` retorna um campo chamado `pontos` formado por `tabela.map(x => x.s)`: esse `s` é o escore do sorteio/ranking, não uma soma de pontos por 38 partidas. O card atual guarda a ordem/posição da liga, sem tabela equivalente de pontos reais. Compará-lo aos 100 pontos seria incorreto.

Uma continuação correta exige simular placares e uma tabela de vitórias/empates/derrotas/pontos, manter títulos/acesso/rebaixamento coerentes com essa tabela e comparar somente ligas/formats compatíveis. Para recordes individuais de liga, também seria necessário distinguir gols por competição dos números totais da temporada.

Essa pesquisa é documental, não uma funcionalidade já entregue. Permanece dentro da pendência histórica do item 67.
