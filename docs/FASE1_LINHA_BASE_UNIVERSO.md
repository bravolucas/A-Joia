# Fase 1 — linha de base do universo persistente (17/11/2026)

## Escopo do teste e referência
- Prompt Mestre: [issue #98](https://github.com/bravolucas/A-Joia/issues/98); instrumentação: [PR #99](https://github.com/bravolucas/A-Joia/pull/99).
- Workflow auditado: [GitHub Actions #44146887052](https://github.com/bravolucas/A-Joia/actions/runs/44146887052), **SUCCESS** com dois jobs no SHA `5e78e9a8cfc4c00a6c394c1426902b406d13245e`.
- Artefatos temporários: [três clubes / 10 mil nomes](https://github.com/bravolucas/A-Joia/actions/runs/44146887052/artifacts/14356173446) e [catálogo completo / 50 anos](https://github.com/bravolucas/A-Joia/actions/runs/44146887052/artifacts/14355714541). Arquivos gerados no runner, retidos por 14 dias.
- Semente `2026`; Node.js 22. As medições foram geradas sem gravar ou acessar saves de jogadores.

## Teste A parcial — 50 temporadas no catálogo completo

| Métrica | Valor observado |
| --- | ---: |
| Clubes do catálogo analisados | 364 |
| Anos consecutivos | 50 (2030 a 2079) |
| Atletas no estado inicial | 8.531 |
| Atletas no estado final (inclui aposentados) | 15.314 |
| Atletas ativos no estado final | 11.124 |
| Registros de aposentados no estado final | 4.190 |
| Temporadas com IDs repetidos ou posições mínimas incompletas | **0** |
| Tamanho inicial do estado serializado em JSON | 3.228.158 bytes |
| Tamanho final do estado serializado em JSON | **18.297.334 bytes** |
| Crescimento do tamanho JSON | ~5,67× |
| Pico de heap observado em Node.js | 300,63 MiB |
| Tempo total do ensaio em runner Linux | 9.310 ms |
| P95 da etapa `simularTemporadaMundo` por ano | 71,48 ms |

O motor anual manteve cobertura por posição e IDs distintos **ao final de cada uma das 50 viradas** dos 364 clubes. A população ativa cresceu; não houve desaparecimento geral de jogadores nesse cenário.

**Atenção:** os indicadores não comprovam economia equilibrada nem crescimento aceitável do armazenamento em dispositivos reais. O teste registra somente o estado do motor mundial; também não percorre todas as partidas, lesões, negociações detalhadas ou o calendário de todas as ligas. A memória é a do runner Node.js, **não** de um smartphone. Uma taxa de títulos ou um resultado de carreira não pode ser inferido deste teste.

### Risco identificado — tamanho do save
A expansão de ~3,23 MB para ~18,30 MB em 50 anos requer estresse real do IndexedDB, exportação/importação, compatibilidade de saves antigos e medição em celular. Não destruir ou resumir históricos de atletas automaticamente antes de definir política de arquivamento compatível.

## Teste B parcial — 10.000 nomes e 83 nacionalidades

| Métrica | Valor |
| --- | ---: |
| Nacionalidades cobertas | 83 |
| Nomes amostrados | 10.000 |
| Taxa de repetições **dentro de cada nacionalidade** | **66,21%** |
| Amostra de elencos de três clubes por 50 anos | **0** violações de cobertura/IDs |
| Tamanho JSON de três clubes antes/depois | 28.930 / 140.586 bytes |

A amostra foi distribuída quase uniformemente entre os 83 códigos, portanto **não simula a distribuição demográfica real dos clubes**. O repertório atual de cinco ou dez nomes por lista em muitas nacionalidades favorece repetição; ampliar a geração com dicionários curados e padrões culturais regionais, preservando o nome de duas partes quando culturalmente apropriado. Dados verificados de pessoas reais não devem ser deduzidos desses geradores.

## Próximos ensaios antes de concluir a Fase 1
1. Medir IndexedDB real, exportação/importação de save, consumo de memória e UI em desktop e celular com mundo de 30/50+ anos.
2. Testar vagas por posição **durante** lesões/suspensões, empréstimos e janelas, inclusive reposição sem contratar automaticamente no clube controlado pelo usuário.
3. Avaliar diversidade dos newgens e limitar repetição com listas e regras culturais verificadas, comparando os mesmos 10.000 sorteios antes/depois.
4. Ampliar volume, economia, reputação e comportamento da IA em testes separados; não usar resultados de três clubes para declarar aprovado o universo mundial.
5. Validar o CI completo no HEAD definitivo e apenas então integrar a instrumentação do PR #99.

**Requisito de carreira preservado:** treinador se aposenta automaticamente aos **85 anos**, com saída voluntária a qualquer momento. O horizonte de 50 anos é do **mundo simulado**, não um limite de duração da carreira do treinador. Não introduzir teto genérico 95 de força do elenco.
