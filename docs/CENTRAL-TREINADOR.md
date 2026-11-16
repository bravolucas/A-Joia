# Central do treinador

A central organiza os dados existentes em sete áreas: visão geral, elenco, calendário,
competições, estatísticas, carreira e clube. Usa menu lateral no computador e navegação
horizontal no celular. As fotografias são os cenários locais já licenciados do jogo.

A decisão da temporada tem prioridade na visão geral do celular. Os atalhos visuais,
a ficha do treinador e as temporadas ficam abaixo. O botão Central de decisões retorna
ao ponto de ação ou reabre a competição em andamento.

As consultas não avançam a simulação nem escrevem no save. Elenco e contratos preserva
a gestão existente, incluindo compra e venda em janelas e renovação de um a cinco anos.
As tabelas têm rolagem própria, busca por nome e seleção do ano dos números individuais.

## Origem dos dados

- Elenco: cadastro de gestão do clube, com complemento do mundo; sem cadastro, jogadores
  ativos do clube no mundo. Em seleções, o painel identifica explicitamente os atletas
  da nacionalidade e seus clubes, sem apresentá-los como convocação.
- Calendário: resultados registrados da campanha e das copas, além do próximo confronto
  interativo disponível. Ida e volta são partidas; o agregado não é contado novamente.
  Não são inventados datas ou jogos futuros.
- Competições: campanhas em andamento ou da última temporada, resumo da liga e acesso
  ao arquivo do futebol. O detalhe mantém grupos, classificações e mata-mata existentes.
- Estatísticas da equipe: última campanha ou campanha parcial registrada. Gols só são
  derivados quando todos os placares estão disponíveis, caso o total não esteja salvo.
- Estatísticas dos jogadores: arquivo anual, atribuído ao clube da temporada, mesmo se
  o jogador já foi transferido. Partidas, gols, assistências e defesas; sem métricas
  secundárias. Para seleções, a tabela informa que esses registros são dos clubes.
- Carreira e clube: histórico, títulos, colocações e dados financeiros já existentes.

Dados não registrados aparecem como —. O visual não muda as regras de simulação,
o tempo das cenas de partida ou o formato de persistência das carreiras.

## Validação

`tests/painel-tecnico.test.mjs` verifica atribuição histórica de atletas, totais
incompletos, precedência do elenco ativo e contagem dos jogos.
`tests/centro-treinador.spec.mjs` percorre as sete áreas em 320, 390, 768 e 1366 px,
confere imagens, filtros, contratos, detalhes de competição, limites da página e
igualdade do save após consultas. Também verifica os rótulos de seleções.
