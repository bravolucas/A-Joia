# A JOIA · Copa do Mundo no Modo Rápido (jogador)

Atualizado em 24/11/2026. Implementação na branch de trabalho do acervo; **não publicada na main**.

## Causa identificada
A Copa de seleções do jogador era um minijogo separado em `src/jogador/rapido.js`, com:
- Grupo próprio formado por três adversários sorteados de faixas de força;
- Simulação aproximada de terceiros colocados para 2026+ (quatro pontos ou três com saldo não negativo);
- Adversários sorteados fase a fase, sem chave completa e persistente;
- Escolhas fixas `coletivo/decidir/arenga`, diferentes das cartas de estratégia das copas do clube;
- Tela `TelaCopa` distinta de `CopaEscolha`.

## Alteração implementada
- Nova ponte `src/jogador/copaSelecaoCompartilhada.js`, sem substituir saves legados em andamento;
- Para convocados de 2026 em diante, monta 48 participantes via `classificadosCopaDoMundo`;
- Utiliza `criarCampanhaCopa` (`formato: copa48`): 12 grupos de quatro, sorteio em potes, 32 classificados e chaveamento de 16 avos até a final;
- A mesma `CopaEscolha` das outras copas exibe sorteios, chaves, decisões de estratégia, pênaltis, placares e classificação;
- O resultado é mantido em `card.copaCompartilhada` (mesma campanha ao retomar o save);
- Ao concluir, o histórico da Copa e o título são vinculados ao card e à seleção, sem duplicação;
- Conclusão de partidas usa estatísticas individuais determinísticas do jogador;
- Saves antigos com jogos já disputados permanecem no fluxo legado, para não sobrescrever resultados.

## Pontos de validação
- `node --test tests/copa-mundo-jogador-compartilhada.test.mjs`;
- Regressão de `tests/copa-grupos.spec.mjs` e testes do calendário do jogador;
- Executar build, testar convocado e não convocado, pênaltis, 2026 e 2030, minimizar/retomar, e save antes/depois do término;
- Conferir que após a Copa a temporada retoma exatamente de onde parou.

**Atenção:** código e testes foram registrados, mas não foram executados neste ambiente. Não considerar a correção pronta para produção até obter aprovação de testes e validação visual.
