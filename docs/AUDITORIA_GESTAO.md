# Revisão de gestão e dificuldade — 04/11/2026

Auditoria reproduzível com `node scripts/auditar-gestao.mjs`. Dados completos em `docs/auditoria-gestao.json`. O script não lê nem escreve saves do navegador.

## Reposição anual

A reposição calculava cada geração a partir da qualidade média do elenco já reduzido. Repetir isso criava uma espiral: saídas geravam jovens mais fracos, que reduziam a referência da geração seguinte. O ajuste preserva como piso de referência a força inicial da estrutura do clube, registrada em `forcaMercado`. Os jovens continuam abaixo dessa referência e ainda podem evoluir; comissão e contratações continuam tendo utilidade.

Cenário: 30 viradas anuais, 24 jogadores, sem compras/vendas nem renovação de contratos de atletas. Força abaixo é a variável efetiva da simulação, com evolução anual aplicada uma única vez.

| Força inicial | Antes, sem gestão | Depois, sem gestão | Depois, renovando os três cargos |
| --- | ---: | ---: | ---: |
| 40 | 34,3 | 36,3 | 40,0 |
| 65 | 34,3 | 61,2 | 64,8 |
| 85 | 34,2 | 81,2 | 84,8 |

As seis trajetórias preservaram 24 ids únicos, saldo não negativo, folha dentro do teto e idempotência após serializar/recarregar a gestão a cada ano. Um teste de regressão cobre a espiral e o risco de crescimento ilimitado.

## Comissão e orçamento

Foram mantidas as taxas salariais de 6%, 5% e 4% da folha dos atletas, os 12 meses pagos na contratação e a participação no teto mensal. Custo acumulado dos três cargos, renovados por 30 anos: R$ 8,34 milhões (força 40), R$ 21,924 milhões (65) e R$ 38,556 milhões (85). O aporte anual continuou suficiente nestes cenários; não houve créditos duplicados, débitos negativos ou renovação automática.

A folha cria concorrência entre comissão e reforços. Este ensaio mantém o elenco inicial e a reposição automática; estratégias intensivas de compras, vendas e renovações permanecem decisões do jogador, com regras de saldo e teto cobertas pelos testes de transações.

## Desafios históricos

Amostra: 100 sementes por missão, estilo equilibrado, sem reforços, comissão ou decisões visíveis. As taxas descrevem este ensaio do motor, não uma garantia de dificuldade para todas as estratégias.

| Missão | Objetivo | Conclusões / 100 | Posição média | Rótulo |
| --- | --- | ---: | ---: | --- |
| Santos 2002 | Top 4 | 51 | 5,60 | Intermediário |
| Leicester 2016 | Título | 13 | 5,45 | Difícil |
| Flamengo 2019 | Título | 58 | 1,93 | Acessível |

Flamengo foi reclassificado de Avançado para Acessível. Força, orçamento e objetivo das missões foram preservados.

## Carreiras completas

Três carreiras adicionais completaram 30 temporadas pelo fluxo real, com recarga por serialização entre temporadas e tratamento de demissão/propostas. O início no Santos passou por três clubes; Leicester e Flamengo terminaram em um clube. Nenhuma ultrapassou 30 temporadas nem precisou simular duas vezes a mesma campanha.

A revisão não publica o jogo. Todos os ajustes permanecem na branch de continuidade.
