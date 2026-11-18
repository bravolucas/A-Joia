# Escalação histórica por partida do Modo Treinador

A prévia do PR #115 informa quais atletas **podem** atuar. A escalação histórica precisa preservar quem estava disponível e foi selecionado no instante da partida, mesmo se o cadastro mundial mudar depois.

## Implementação
- O novo `escalacaoHistoricaTecnico(c,t)` recupera os atletas do clube pelo painel atual e usa o matcher de posições exatas do PR #116.
- Retorna apenas `versao:1`, clube, formação, **11 vagas** com `id` mundial, nome, posição e OVR, até **7 reservas** e o total de vagas vazias.
- Não cria atletas, não grava elencos duplicados, não improvisa sem aptidão nem altera o estado de jogadores, contratos ou saves antigos.
- Nas partidas da liga simuladas por `simularEtapaTecnico` e `simularTemporadaTecnico`, os confrontos recebem a propriedade opcional `escalacao`, consultável no calendário da Central do Treinador por **Ver escalação**.
- A folha é um instantâneo de consulta. Resultados, probabilidade, sorteios, gols e ordem dos confrontos são calculados como antes.

## Restrições
- Só é registrada quando existe elenco real do clube. Para seleções ou carreiras sem elenco, não é produzido registro fictício.
- Os saves antigos sem `escalacao` permanecem legíveis; jogos antigos não recebem retrospectivamente nomes presumidos.
- A folha é registrada por simulação/etapa, não há ainda substituições durante os 90 minutos nem evolução de condição física rodada a rodada.
- O histórico cobre **liga**; as partidas independentes de copas, partidas de seleções e substituições detalhadas seguem pendentes da issue #110.
- O branch contém também a função de posições exatas já entregue no PR #116; após o merge daquele PR, a comparação com a `main` deverá eliminar esse arquivo duplicado.

## Aceite
Testes automatizados cobrem escalações completas, reservas exclusivos, suspensão, lesão, transferências posteriores, ausência de jogadores fictícios, compatibilidade de saves antigos, consulta ao calendário e etapa simulada. Testes gerais, dedicada e build devem estar verdes no head exato antes do merge.
