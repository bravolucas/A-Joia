# Copa do Mundo: decisão em cada partida do grupo

## Experiência

No modo rápido, cada uma das três partidas agora oferece as escolhas do mata-mata: jogar para o time (ou papel de reserva), chamar a responsabilidade e discurso disponível. O discurso continua limitado a um uso por Copa e indisponível na final. Apresentação identifica adversário e Jogo 1/2/3, mantém animação e botão de pular, mostra placar, consequência e outro resultado da rodada.

O resultado fica salvo em `copaJogada` antes de Continuar. Recarregar retoma a consequência já calculada, sem sortear outro placar, repetir estatísticas ou dar nova escolha. Continuar consome esse resultado e abre a partida seguinte; não fecha a temporada após a primeira ou segunda rodada.

Abaixo da decisão, um resumo opcional do grupo mostra partidas e pontos. Ao expandir: tabela de quatro seleções com jogos, pontos e saldo. Os outros três confrontos são simulados junto às rodadas. Depois de seis placares, os dois primeiros avançam. Critérios: pontos, saldo, gols marcados e sorteio determinístico. Empates têm resultado próprio; uma derrota isolada não implica eliminação. Convocação, mata-mata e final decisiva continuam no fluxo existente.

## Compatibilidade e formato

- Saves antigos na entrada dos grupos passam a usar as três decisões. Saves já no mata-mata não voltam aos grupos.
- Tabela não é inventada retroativamente para saves antigos que não guardaram os resultados entre os adversários; sua lista de partidas é preservada.
- Novos grupos impedem repetição de seleção no sorteio das três faixas.
- O formato simplificado do jogo continua sendo grupo de quatro e dois classificados rumo às oitavas. Não representa todas as regras oficiais da Copa de 2026.
- Modo completo já possuía sequência de três partidas com lances; esta remodelação é do modo rápido.

## Validação

Cinco casos novos de lógica cobrem três decisões, imutabilidade da entrada, classificação coerente em 60 campanhas, saldo/gols conservados, adversários distintos, registro do elenco, discurso único, resultado determinístico após recarga, caminho automático completo e desempate estável.

Cinco cenários novos de navegador: sequência e recarga em 320×568, 390×640 e 1366×640, compatibilidade com mata-mata anterior (incluindo jogar uma oitava) e discurso único. Teste anterior de elenco agora espera 90 minutos após um clique, em vez de 270: uma partida, não três. Prévia foi iniciada após o health-check interromper a execução sem servidor; não contar uma rodada sem servidor como validação do produto.

Resultado final da suíte ampla e confirmação de publicação no topo de `docs/CONTINUIDADE.md`.

## O que ainda falta da lista

Recordes históricos comparáveis de clubes e ligas, revisão das outras situações raras do modo completo e refinamentos corporais das cenas permanecem registrados na auditoria. Esta entrega amplia o fluxo de competição e não conclui artificialmente os itens 67/98.


A suíte ampla passou com **139 cenários** antes do acabamento final. Probabilidades dos grupos foram separadas em blocos legíveis; faixas de probabilidade zero não são desenhadas. Depois da conferência das capturas, resultado da Copa foi compactado em telas baixas para manter o círculo inteiro e Continuar acessível. Movimento reduzido revela o resultado sem girar o scanner. Build e 14 cenários direcionados revalidados após o acabamento; resultado no registro de continuidade.
