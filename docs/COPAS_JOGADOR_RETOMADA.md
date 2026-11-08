# Copas do modo rápido como jogador — integração e retomada

Relato: as adições de calendário, temas, animações e disputa de copas não estavam aparecendo para o jogador. A preparação já existia ao iniciar uma temporada pela interface, mas a retomada dos saves anteriores podia permanecer no fluxo antigo.

## Correção

- `jogarTemporada(c,{copasInterativas:true})` agora prepara as copas no motor do jogador. A interface do modo rápido usa essa entrada nos três ritmos (normal, expresso e intenso).
- A retomada do modo jogador identifica saves sem calendário e integra seus próximos eventos. Um estadual em andamento mantém exatamente fase, adversário e resultado escolhido. Não simula outra liga nem altera idade, salário ou ano.
- Minigames e jogos de seleção em andamento são preservados. Os resultados das copas já resolvidas no fluxo antigo são mantidos; não se repetem partidas para transformar retroativamente o ano inteiro.
- Uma vitória continental principal em um lance do save antigo também registra a vaga mundial. Mundiais já disputados não são repetidos. A seleção não é reaberta depois de sua final.
- Temporadas encerradas, treinador e calendários já concluídos não são reabertos.
- O cabeçalho das copas do jogador identifica **MODO RÁPIDO · JOGADOR**, mantendo temas, animação curta, probabilidades e três escolhas.
- Identificador inicial da entrega: **Copas do jogador**. Não é necessário apagar a carreira.

## Verificação

`tests/copas-jogador-retomada.test.mjs`: os três ritmos pelo motor, resultado regional salvo, vitória continental e Mundial, seleção sem repetir final, temporada encerrada e Mundial já disputado.

`tests/copas-jogador-retomada.spec.mjs`: oito cenários em 320/1366px. Início pelo treino e sequência estadual → Brasileiro → Libertadores, usando personagem jogador sem `c.tecnico`; temas e escolhas visíveis. Retomada e recarga de estadual antigo preservam o mesmo resultado.

O teste agrupado de sete identidades de copa recebeu limite de 60s, pois faz várias navegações e animações no mesmo caso. Uma execução inicial excedeu os 30s durante captura de tela com a regressão de lógica em paralelo; não foi uma falha do jogo.
