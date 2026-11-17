# CI — paralelismo das regressões massivas de carreira

## Objetivo e evidência
A issue #79 registra uma execução com ~34 minutos de lógica, principalmente em quatro arquivos de carreira. O workflow anterior chamava `npm test` no mesmo runner para todos os `tests/*.test.mjs`.

## Alteração
- `testes-e-build` mantém todas as regressões não massivas, as verificações rápidas de mercado/veteranos e o build.
- `carreiras-massivas` usa matriz de quatro runners independentes para executar **os quatro arquivos integrais**, sem modificar loops, seeds, asserts nem quantidade de carreiras:
  1. `tests/integracao-jogador-tecnico.test.mjs` — 32 carreiras completas.
  2. `tests/jogador-melhorias.test.mjs` — 24 carreiras automáticas, mais os demais testes do arquivo.
  3. `tests/treinador-expresso.test.mjs` — fluxo expresso e regressões completas.
  4. `tests/simulacao-massiva-tecnico.test.mjs` — 80 carreiras massivas.
- `navegador` permanece sem alterações e executa todos os `tests/*.spec.mjs`.

A lista de exclusão do job regular **deve sempre coincidir exatamente** com os quatro caminhos da matriz. Se novos arquivos de testes forem criados, entram automaticamente no job regular. Se um desses quatro arquivos for renomeado, o job correspondente falhará, impedindo publicação silenciosa com cobertura ausente.

## Critérios de aceite
1. Os seis jobs terminam com sucesso: `testes-e-build`, quatro casos da matriz `carreiras-massivas` e `navegador`.
2. Comparar os resultados de cada arquivo e o tempo total do workflow com a execução da main anterior, sem supor ganho de desempenho antes da medição.
3. A publicação do Pages deve continuar condicionada ao sucesso **do workflow completo**, não apenas ao build.
4. Não exigir alterações em saves ou no motor do jogo: esta mudança toca somente CI e documentação.

## Próximas melhorias após validação
Se a maior carreira isolada continuar acima de 20–30 minutos, perfilar geração de mundo, progressão anual e consultas repetidas e propor otimização de CPU/dados. Reduzir quantidade de cenários ou enfraquecer asserts não é aceitável.

**Estado:** mudança em PR separado, não representa publicação até CI verde, merge seguro e deploy verificados.
