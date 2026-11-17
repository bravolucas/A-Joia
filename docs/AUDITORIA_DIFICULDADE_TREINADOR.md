# Issue #89 — Auditoria estatística da dificuldade do Modo Treinador

## Motivação
O usuário relatou títulos excessivamente fáceis. Antes de modificar a chance de vitória, demissão ou as tabelas, é necessário registrar resultados reproduzíveis no **motor real do A JOIA**, por clube fraco, mediano e forte, em uma mesma competição.

## Como executar
Na raiz do repositório (Node 22 e dependências do projeto instaladas):

```bash
node scripts/auditar-dificuldade-treinador.mjs --liga=brasileirao --amostras=12 --semente=2026
node scripts/auditar-dificuldade-treinador.mjs --liga=brasileirao --amostras=50 --semente=2026 --json > dificuldade-base.json
```

São usadas três equipes reais do **catálogo interno do jogo**, selecionadas pela menor força, força mediana e maior força na mesma liga. Cada repetição simula uma carreira de **uma temporada**, com treinador de 40 anos, reputação derivada do mesmo legado, ritmo expresso, comissão neutra, sem escolha extra de investimento e com RNG fornecido por semente. A cada repetição a mesma semente alimenta as três faixas para comparação aproximada de cenários.

O relatório de cada faixa apresenta: clube e força inicial, amostras, títulos de liga, porcentagem de títulos, taxa de demissão, posição média e quantis, pontos médios e quantis, outros títulos. A saída `--json` permite comparação textual antes/depois.

`--amostras` aceita valores entre 1 e 200 **por faixa**: 50 significa 150 temporadas completas e pode levar um tempo considerável. Começar pequeno; aumentar a amostragem para decisões de balanceamento. O script não roda no CI por padrão, para não tornar a validação geral ainda mais lenta. Os testes de unidade `tests/auditoria-dificuldade-treinador.test.mjs` rodam normalmente e cobrem as métricas, seleção de clubes e semente.

## Critérios de análise, sem fabricar números
- Comparar títulos e posição média entre clubes fracos, médios e fortes: um padrão de clubes fracos dominando frequentemente exige investigação.
- Comparar diretamente com as mesmas três equipes e `--semente` antes/depois da proposta de balanceamento.
- Analisar a taxa de demissão junto à distribuição de posições, sem equiparar posição ruim automaticamente a demissão.
- Comparar ligas diferentes **separadamente**; forças relativas e calendários variam.
- Não assumir precisão estatística com poucas amostras. O RNG do argumento é determinístico, mas qualquer aleatoriedade interna não injetada no motor pode impedir uma repetição byte a byte.
- Revisar adicionalmente outras competições e copas, pois o campo `campeaoLiga` mede apenas o 1º lugar da liga e `outrosTitulos` é exploratório.

## Escopo e riscos
- Nenhuma alteração ao código de partidas, ao balanceamento, a saves, a jogadores, às taças ou ao fluxo da interface.
- Os números **não foram executados ou observados neste PR**: este é um instrumento de diagnóstico, e não uma afirmação de que a dificuldade atual está correta ou incorreta.
- A integração definitiva deve ser feita depois da revisão em curso dos PRs #90 (temporada direta) e #91 (limite 30 anos), porque os resultados do jogo precisam ser novamente medidos no motor efetivamente publicado.

## Checklist de aceite
1. Testes de unidade do auditor passam no CI e a suite existente continua integral.
2. Executar a CLI numa máquina com o repositório e documentar pelo menos uma amostra-base de cada faixa.
3. Registrar a amostra e versão do commit nos comentários da issue #89.
4. Alterar o motor **somente depois** de medir, corrigindo separadamente com regressões que evidenciem o efeito.
