# CI — paralelismo das regressões massivas de carreira

## Objetivo
Reduzir o tempo até uma publicação segura, sem suprimir **nenhum arquivo, carreira, assert ou teste de navegador**.

## Evidência medida antes do refinamento
- CI da `main`, run `44109222795` (SHA `8bfb13d`): aproximadamente **34 min 07 s**.
- Primeira matriz do PR #94, run `44111461041` (SHA `4d0fb86`): aproximadamente **36 min 12 s**. Todos os seis jobs passaram, mas o workflow não ficou mais rápido.
- A integração jogador→técnico ainda concentrava 32 carreiras completas no mesmo runner, mantendo um gargalo crítico.

**Conclusão da primeira tentativa:** a simples divisão dos quatro arquivos em quatro jobs não trouxe redução de tempo comprovada.

## Refinamento — duas metades de 16 carreiras
- `testes-e-build`: executa automaticamente **todos os testes de lógica não massivos** (84 arquivos), smoke de mercado/veteranos IA e build.
- `carreiras-massivas`: quatro jobs independentes, agora distribuídos assim:
  1. `integracao-1-de-2`: 16 das 32 carreiras de `tests/integracao-jogador-tecnico.test.mjs` (índices pares).
  2. `integracao-2-de-2`: as 16 outras carreiras (índices ímpares).
  3. `jogador-melhorias`: **todo** o `tests/jogador-melhorias.test.mjs`, incluindo 24 carreiras automáticas e demais asserts.
  4. `treinador-e-simulacao`: `tests/treinador-expresso.test.mjs` e `tests/simulacao-massiva-tecnico.test.mjs` **integrais**, incluindo as 80 carreiras massivas.
- `navegador`: **todos** os testes `tests/*.spec.mjs`, build Pages e capturas.

São **seis jobs no total**, exatamente como na versão anterior da matriz. Cada um é obrigatório para o sucesso completo do workflow.

## Garantias de cobertura
O teste `tests/integracao-jogador-tecnico.test.mjs` aceita `A_JOIA_INTEGRACAO_PARTE` e `A_JOIA_INTEGRACAO_PARTES`, configuradas pela matriz, usando a condição `i % PARTES === PARTE - 1`. Para duas partes, os conjuntos `{0,2,...,30}` e `{1,3,...,31}` são disjuntos e cobrem integralmente os 32 cenários.

**Sem variáveis de ambiente**, `node --test tests/integracao-jogador-tecnico.test.mjs` continua testando as **32 carreiras de uma só vez**, como antes. O corpo de simulação de cada carreira não foi alterado. Os asserts agregados por runner aplicam limiares proporcionais; exigir a aprovação de ambos assegura, em conjunto, o limiar global anterior.

A lista de quatro arquivos excluídos do job regular deve coincidir com os caminhos distribuídos pela matriz. Se um arquivo for renomeado indevidamente, os jobs falham, em vez de ignorar sua ausência.

## Critérios de aceite antes do merge
1. Os **seis jobs** aprovados no **SHA final** após o refinamento.
2. Conferir no log que os dois grupos cobriram 16 + 16 carreiras, sem duplicação de índices.
3. Comparar **duração total medida**, não apenas a média dos jobs, contra 34m07s da main e 36m12s da primeira tentativa.
4. Manter o deploy dependente de `Validar A JOIA` completo, inclusive Playwright, e validar Pages no SHA exato depois do merge.
5. Verificar a base mais recente da `main` e conflitos antes da integração.
6. Não modificar saves, regras de jogo ou dados dos atletas.

**Estado:** refinamento em PR draft; nenhum ganho é declarado até a execução nova terminar com sucesso e duração comparada.
