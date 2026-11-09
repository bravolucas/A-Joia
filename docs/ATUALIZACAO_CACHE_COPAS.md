# Verificação da versão e migração do cache das copas

## Evidência e limites

Usuário continua vendo mini gol após as três escolhas. Checkout e main remota estão em d8c1273; CopaEscolha usa SimulacaoCopa, sem cce-arena/rede/chute antigo. GitHub confirma Pages d0c8058 publicado com sucesso; CI geral anterior falhou. Site bravolucas.github.io bloqueado pelo proxy do ambiente (403), portanto não foi possível verificar diretamente o HTML/bundle entregue ao usuário nem afirmar qual versão ele usa. Domínio proposto no rascunho de rede, preservando os oito anteriores; só salvar/publicar ambiente aplica essa permissão.

Encontrada fragilidade no mecanismo antigo: registerSW.js voltava a registrar o worker enquanto a configuração selfDestroying tentava removê-lo e navegar clientes antes de concluir limpeza. Novos testes controlados demonstram que um worker legado pode manter HTML antigo apesar de o servidor já ter o app novo. Isso não prova, isoladamente, a origem do relato no navegador do usuário.

## Mudança

- Worker de migração próprio em src/atualizacao/sw.js: remove apenas caches ajoia-* e precache Workbox vinculado ao caminho da aplicação; unregister antes de navegar clientes do próprio app com URL versionada.
- Não altera localStorage, IndexedDB ou dados de carreira. Não apaga cache de outros aplicativos nem navega abas fora do caminho do jogo.
- injectRegister:false: HTML novo não registra outro worker. Script público registerSW.js permanece disponível para páginas anteriores, mas faz limpeza/migração em vez de registrar worker.
- Bootstrap incluído em index.html com revisão no URL; guarda de sessão/URL impede repetição de recarga. Botão manual “Atualizar jogo · manter saves” força HTML com URL única sem apagar progresso salvo.
- Home identifica “2026.11.09 · Copas v2 · Placar real”.

## Validação

Build e 356 testes de lógica aprovados. Três testes novos de navegador passaram: atualização manual, limpeza automática única e migração efetiva de HTML antigo controlado por worker. Compara saves reais serializados antes/depois e preserva cache de aplicativo alheio. Fixture HTTP Python em tests/fixtures/servidor-migracao.py, porta 4174, iniciada/encerrada pelo próprio teste, inclusive no CI.

Testes de CopaEscolha ampliados: verificam posição real da bola (getBoundingClientRect versus matriz SVG) contra destino do caminho, não só atributos do desenho; placar/veredito seguem comparados ao resultado do motor. Regressão de navegador: 249/254 na rodada inicial; cinco testes antigos adequados e celebração reintegrada; verificação final de 32 casos passou, cobrindo os cinco anteriores e todos os fluxos afetados. São 254 cenários distintos aprovados no conjunto das rodadas. Primeiras tentativas da fixture corrigiram corrida de instalação e charset do HTML legado; não eram falhas no aplicativo publicado.

## Regressão ampliada

Rodada de 254 cenários: 249 passaram. As cinco falhas eram testes antigos que ainda procuravam “Baixo esquerda” depois da substituição autorizada do minigame. Testes de fechamento e comemoração foram adaptados ao fluxo de decisão. A revisão também identificou que DecisaoDeJogo não exibira CelebracaoLance: reintegrada com semântica de gol, passe ou defesa, preservando os feitos existentes. Verificação final direcionada: 32/32 aprovada, incluindo atualização, trajetória real, resultados, salvamento e celebrações, sem alteração do sorteio/placar.

O problema do usuário permanece identificado como relato não reproduzido no seu próprio navegador. Nesta execução não se afirma que o cache seja a causa definitiva; há evidência de risco no mecanismo antigo e teste controlado de recuperação. É necessário confirmar que o usuário passou a ver “Copas v2 · Placar real” antes de atribuir uma eventual divergência restante ao fluxo atual.
