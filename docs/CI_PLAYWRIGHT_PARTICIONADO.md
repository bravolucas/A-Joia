# Playwright — dois shards obrigatórios

Até este ajuste, o job único **navegador** executava todos os arquivos `tests/*.spec.mjs` em um único runner. Este job era o último da CI em diversas alterações do jogo.

O workflow `Validar A JOIA` passa a ter dois jobs independentes `navegador (1-de-2)` e `navegador (2-de-2)` com `fail-fast:false`. Ambos usam Chromium, compilam o mesmo código com `GITHUB_PAGES=true` e iniciam um servidor de prévia na porta 4173 de seus próprios runners.

A suíte continua inteira:
- `npx playwright test tests/*.spec.mjs --shard=1/2` executa a primeira partição.
- `npx playwright test tests/*.spec.mjs --shard=2/2` executa a outra partição.

O sharding nativo do Playwright divide o inventário de testes, sem usar filtros de nomes ou arquivos excluídos. Como ambos são jobs **obrigatórios** do mesmo workflow, a CI só é verde se os dois forem aprovados. Não foram alterados os arquivos de cenários, as verificações Playwright, o código do jogo nem os saves.

O teste prévio de `completo-copas-persistentes.spec.mjs` continua no runner 1 para que falhas conhecidas sejam detectadas cedo, mesmo antes do shard geral; os mesmos cenários continuam presentes na suíte dividida (sem redução de cobertura). Os artefatos `capturas-navegador-1-de-2` e `capturas-navegador-2-de-2` evitam sobrescrita de evidências.

**Critério para integração:** confirmar os dois jobs de navegador e os demais jobs do workflow no SHA exato. O workflow de Pages continua publicando somente uma `main` com CI integral aprovada.

A redução de tempo **não está garantida**; deve ser medida pelas execuções reais. Ganho esperado: reduzir o tamanho de cada carga de testes de navegador e remover o job serial como gargalo.
