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

## Amostra automatizada no GitHub Actions
O workflow `.github/workflows/auditoria-dificuldade.yml` roda de forma independente quando este auditor é alterado em um pull request para `main`. Ele testa os auxiliares, executa primeiro **três temporadas por faixa (nove no total)** com `--amostras=3` e depois uma medição ampliada com **50 temporadas por faixa (150 no total)** com `--amostras=50`, ambas na liga `brasileirao` e semente `2026`. Guarda os dois resultados no artefato `dificuldade-treinador-brasileirao` por 14 dias.

A primeira medição de nove temporadas **já foi executada com sucesso** no run [#44128447416](https://github.com/bravolucas/A-Joia/actions/runs/44128447416) (SHA `9509097`), e está registrada na issue #89. Resultados observados: Remo (força 52) 0/3 títulos, 17ª posição média, 41 pontos médios, 1/3 demissão; Fluminense (74) 0/3 títulos, 5,67ª posição, 59,33 pontos, 0 demissões; Flamengo (86) 1/3 títulos, 3,33ª posição, 65 pontos, 0 demissões. Nove temporadas não bastam para conclusões estatísticas.

A auditoria com anos independentes concluiu com **sucesso** no [run #44136767868](https://github.com/bravolucas/A-Joia/actions/runs/44136767868), SHA `bd0bf152`. Uma linha de base corrigida e permanente está em `docs/DIFICULDADE_TREINADOR_BASELINE_50.json`. Seus valores devem ser comparados com os mesmos 50 anos e a mesma semente após mudanças no motor.

## Correção metodológica: anos independentes para os estaduais
**Limitação identificada após a execução do baseline com 150 temporadas:** a auditoria original criava todas as carreiras com `ano: 2030`. O motor de estaduais usa `simularCampanhaCopa`, cuja semente interna é derivada de `ano|nome do torneio|clube`; por isso, mesmo variando a semente externa, ela **repetia a mesma edição do estadual 50 vezes**. Os 50 Campeonatos Cariocas observados **não demonstram 100% de probabilidade de título**; apenas que o Flamengo venceu a edição determinística testada. O resultado anterior do Brasileirão tem semente externa variável, mas não usar as taxas agregadas de copas como baseline probabilístico.

A partir desta correção, a repetição `i` da auditoria começa em `2030+i` (2030 a 2079, no cenário de 50 amostras). Os três níveis de clube usam **o mesmo ano dentro da mesma repetição**, e a semente externa de cada repetição continua parametrizada. Os anos distintos produzem sorteios internos de estaduais distintos, sem mudar o motor, a dificuldade, os saves ou as taças do jogo. O teste de unidade garante 50 anos distintos. O workflow corrigido foi aprovado: Flamengo venceu o Carioca em **24/50** edições (48%), Fluminense em **6/50** (12%) e Remo venceu o Paraense em **10/50** (20%). Isso não representa títulos automáticos.

O JSON antigo, **não independente para estaduais**, está preservado no histórico Git do commit `e84c7a36`. O caminho atual `docs/DIFICULDADE_TREINADOR_BASELINE_50.json` passa a conter os resultados corrigidos, com indicação expressa do SHA `bd0bf152` que os produziu.

## Discriminação dos títulos adicionais (após a linha de base)
O resumo por faixa agora inclui `titulosPorCompeticao`, que reúne os nomes reais registrados em `temporada.titulosConquistados`, excluindo o título da própria liga. Assim será possível identificar quantas vezes o Flamengo levou Copa do Brasil, Libertadores, estaduais e outros campeonatos nas mesmas 50 temporadas, em vez de depender só da média agregada de 1,02.

**Resultados observados na auditoria corrigida (50 temporadas por faixa):** Remo: 10 Campeonatos Paraenses; Fluminense: 6 Cariocas e 3 Copas do Brasil; Flamengo: 24 Cariocas e 1 Copa do Brasil. Brasileirão: Remo 0/50, Fluminense 1/50, Flamengo 15/50. Taxas de demissão observadas: Remo 66%, Fluminense 10%, Flamengo 38%; a taxa alta do Flamengo apesar da posição média de 3,64º exige auditoria das expectativas da diretoria antes de qualquer mudança. Nenhuma probabilidade ou regra foi alterada.

## Critérios de análise, sem fabricar números
- Comparar títulos e posição média entre clubes fracos, médios e fortes: um padrão de clubes fracos dominando frequentemente exige investigação.
- Comparar diretamente com as mesmas três equipes e `--semente` antes/depois da proposta de balanceamento.
- Analisar a taxa de demissão junto à distribuição de posições, sem equiparar posição ruim automaticamente a demissão.
- Comparar ligas diferentes **separadamente**; forças relativas e calendários variam.
- Não assumir precisão estatística com poucas amostras. O RNG do argumento é determinístico, mas qualquer aleatoriedade interna não injetada no motor pode impedir uma repetição byte a byte.
- Revisar adicionalmente outras competições e copas, pois o campo `campeaoLiga` mede apenas o 1º lugar da liga e `outrosTitulos` é exploratório.

## Escopo e riscos
- Nenhuma alteração ao código de partidas, ao balanceamento, a saves, a jogadores, às taças ou ao fluxo da interface.
- A amostragem corrigida de 150 temporadas foi observada e preservada, com resultados por competição e ressalva sobre comparar anos diferentes. Este instrumento diagnostica, mas não prova por si só que a dificuldade atual está correta ou incorreta.
- A integração definitiva deve ser feita depois da revisão em curso dos PRs #90 (temporada direta) e #91 (limite 30 anos), porque os resultados do jogo precisam ser novamente medidos no motor efetivamente publicado.

## Checklist de aceite
1. Testes de unidade do auditor passam no CI e a suite existente continua integral.
2. Executar a CLI numa máquina com o repositório e documentar pelo menos uma amostra-base de cada faixa.
3. Registrar a amostra e versão do commit nos comentários da issue #89.
4. Alterar o motor **somente depois** de medir, corrigindo separadamente com regressões que evidenciem o efeito.
