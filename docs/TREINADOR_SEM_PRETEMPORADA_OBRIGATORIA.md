# Issue #89 — iniciar temporada sem decisão obrigatória

A interface do Modo Treinador ainda abria uma janela de decisão sempre que o jogador pressionava **Começar temporada**. Isso tornava a preparação obrigatória mesmo no fluxo anual rápido solicitado para o A JOIA.

## Comportamento novo

- **Começar temporada** agora chama diretamente o callback já existente `onSimularTemporada`, que executa `jogarTemporadaExpressaTecnico(...)`. O próprio motor já completa com registros neutros as decisões administrativas que estiverem faltando, sem inventar benefícios ou mexer no histórico do jogador.
- **Preparar equipe (opcional)** aparece separadamente somente quando existe uma carta pendente e a temporada não está sendo retomada. Ela abre a mesma janela já implementada; ao concluir a preparação, o fluxo existente simula a temporada.
- **Retomar temporada** mantém o caminho de recuperação de save interrompido, sem reiniciar partidas ou decisões.
- As decisões extraordinárias por intervenção ou diretoria continuam protegidas pelas regras próprias do motor; a mudança só remove o bloqueio obrigatório de pré-temporada.

## Regressões incluídas

- Novo teste navegador em `tests/coach-remodelacao.spec.mjs`: iniciar em clube, começar a temporada diretamente, não abrir janela de preparação, conferir apenas uma temporada no save e decisões administrativas neutras, sem transbordo horizontal no celular.
- Os testes da escolha opcional continuam cobrindo o efeito de preparação, ausência de verba, compra na loja, preparação de seleção e jogos/copas: agora acionam explicitamente **Preparar equipe (opcional)**.
- Testes antigos de trocar de clube/fazer nova temporada exercitam o botão principal com a decisão dispensada.
- Compatibilidade esperada com saves antigos, decisões de comissão e sorteio determinístico do motor; não altera estado salvo, IDs, catálogos ou regras de competição.

## Integração segura

Este PR deve ser revisado após publicação da Fase 4.3 e preferencialmente após a sequência de jogadores reais **#85 → #86 → #87**, para evitar múltiplos deploys simultâneos. É independente desses dados e não precisa modificar `src/comum/lib.js`.

Não fazer merge sem CI completo verde (lógica, navegador e build) na versão combinada com `main`. Verificar visualmente a experiência em 390 px e 1366 px, com e sem preparação, com saves antigos e com desafio histórico.

## Escopo não incluído

Não altera a idade máxima do treinador (atualmente 85 anos), a proporção de títulos, as taças ou a aparência do Copero. Esses itens permanecem sob a issue #89 e #88.
