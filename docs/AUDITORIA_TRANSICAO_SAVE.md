# Auditoria do save na passagem de Jogador para Treinador

A regressão em `tests/transicao-jogador-tecnico-indexeddb.spec.mjs` executa a carreira **real** do Modo Rápido até aposentadoria pelo motor `simularCarreiraAutomatica`. Não fabrica gols, temporadas, troféus ou IDs.

Em contexto isolado do Chromium:
1. Grava via `salvarRapidoConfirmado` e `armazenamentoMundo.js` no IndexedDB real, usando a chave de produção `ajoia_rapido_v1`.
2. Recarrega a página e lê a carreira pelo próprio `carregarRapido`.
3. Converte o atleta aposentado em treinador com `iniciarCarreiraTecnico`, toma decisões de pré-temporada e simula a primeira etapa de partidas.
4. Grava a nova etapa via `salvarRapidoConfirmado`, reinicia o navegador com janela desktop e reabre o save.
5. Confere digests SHA-256 idênticos do universo, histórico de jogador e conquistas, IDs globais únicos e partidas do treinador restauradas.

## Limites de aceitação
- Essa regressão cobre o **fluxo real de transição após a aposentadoria** e uma etapa no treinador. **Não** executa 50 anos de uma carreira integrada nem um dispositivo móvel físico.
- O teste pré-existente `armazenamento-mundo-50-anos.spec.mjs` continua responsável pela persistência de 50 temporadas do universo isolado.
- Não altera a interface do jogo, os saves dos usuários nem o esquema de IndexedDB. Executa em um contexto Playwright exclusivo.
- A publicação só deve ocorrer com o CI geral e a auditoria dedicada aprovados no SHA exato.

Relacionada às issues #103 e #98.
