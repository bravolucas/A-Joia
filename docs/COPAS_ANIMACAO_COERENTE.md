# Coerência da animação após estratégias de copa

Relato específico: após “Como desmontar a marcação”, a antiga cena mostrava bola indo para fora e resultado de vitória. Identificada em CopaEscolha, não no minigame individual substituído no lote anterior.

A antiga animação por CSS usava uma cobrança com deslocamentos em pixels fixos e cor/classe conforme flags, para comunicar o resultado da partida inteira. Em empate mostrava impacto na trave, inclusive para 1×1; não havia relação entre destino da bola e placar. Removidos palco, gol, bola de chute, rastro e respectivos keyframes da cena de partidas normais.

Nova SimulacaoCopa: circulação tática de passes em coordenadas SVG, integralmente dentro do campo. Inverter, entrelinhas e apoio curto possuem rotas próprias. O movimento representa a estratégia, não um chute isolado. Em seguida, cartão FIM DE JOGO com VITÓRIA, EMPATE ou DERROTA, escudos, nomes e placar real. Não há novo sorteio. Resultado visual deriva do placar salvo relativo ao clube do usuário; não assume derrota enquanto o resultado ainda está chegando. Resultado recebido só é exibido quando corresponde à opção clicada.

Mudança compartilhada por jogador/treinador e todas as estratégias normais de copas. Disputas de pênaltis continuam com componente próprio, sem alteração de probabilidades, sorteio, chaves, classificação ou duração da revelação (1,35s). Chances continuam sendo mostradas depois do clique. Home identifica “2026.11.09 · Copas com resultado claro”.

Validação: build e suíte completa de 356 testes de lógica aprovados. 44 cenários de navegador passaram; 12 casos finais da tela específica repetidos e aprovados no build final, incluindo limites da linha de chances acima do rodapé. Cobertura das três escolhas, vitória/empate/derrota, jogador/treinador, 320/1366, calendário, estaduais, recarga e disputas de pênaltis. Captura móvel final inspecionada. Logs /tmp/copas-coerencia-*.log. Probabilidades e resultados salvos foram comparados ao motor, sem alteração.
