# Auditoria: fila de salvamentos e cache

O armazenamento do A JOIA serializa gravações de uma mesma chave. A interface mantém um **cache otimista** que pode ser consultado de forma síncrona enquanto a gravação está pendente.

## Problema identificado

Se a gravação A for enfileirada antes de B, mas A falhar quando B já está no cache, o código anterior restaurava o conteúdo do cache para a versão anterior de A, embora B pudesse ser confirmada no IndexedDB depois. O usuário podia consultar dados antigos na aba até recarregar.

## Correção proposta
- O mapa `confirmados` guarda a versão já aceita pelo IndexedDB.
- O cache permanece otimista por compatibilidade com a interface.
- Em erro, restaura-se a última versão confirmada **somente quando a tentativa que falhou ainda é a última no cache**. Uma tentativa B posterior não é sobrescrita pela falha de A.
- Exclusão limpa também o estado confirmado.
- Nenhum formato de save, ID, histórico de atleta ou mecânica de temporada é alterado.

## Teste de regressão
`tests/armazenamento-fila-falhas.spec.mjs` usa o módulo real no Chromium: depois de um save base, enfileira A e B, faz A falhar uma vez com `QuotaExceededError` e verifica que B é a única versão resultante, tanto no IndexedDB quanto no cache e após recarga.

**Limites:** IndexedDB e localStorage não formam uma transação atômica conjunta. Encerrar a aba no meio de um commit, erro de gravação do marcador após commit e persistência em dispositivo móvel real continuam exigindo testes específicos.
