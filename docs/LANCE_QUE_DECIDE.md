# Lance que decide — 09/11/2026

Usuário rejeitou o alvo sobre a fotografia e pediu uma decisão de futebol que não precisasse ser pênalti. No modo rápido interativo, momentos antes encaminhados a penalti/defesa passam a DecisaoDeJogo. A disputa por escolhas do treinador/CopaEscolha permanece distinta; o modo completo mantém GoalMini.

12 situações: seis ofensivas, três defensivas e três de goleiro. Uma descrição curta e três ações: finalizar, servir, conduzir; fechar linha, pressionar, cobrir; abafar, proteger, sair no cruzamento. Probabilidade varia com atributo usado, adequação ao contexto, bônus e perfil. Cenário estável por campanha/ano/momento; não há alvo escondido nem clique sobre fotografia. Chance numérica aparece só depois do clique.

Quadro tático SVG mostra jogadores e trajeto coerente com ação e consequência. Passe bem-sucedido passa pelo apoio antes de chegar ao gol; ataque interrompido para no marcador; ação defensiva bem-sucedida afasta o perigo. Movimento reduzido mostra diretamente o destino final. Tela inicial identifica “2026.11.09 · Lance que decide”.

Escolha, probabilidade e resultado persistidos imediatamente em `pendente.decisaoJogo`. Reabrir retoma o resultado sem repetir sorteio. Continuar usa trava contra repetição. Não há confirmação nem avanço automático obrigatório. Legado penalti/defesa é adaptado ao abrir, sem reabrir temporadas encerradas. Lances passam a disputa:false, mantêm minuto e placar, e histórico registra `decisao`/`decisaoDefensiva`, não cobrança de pênalti. Final internacional registra gol/assistência da ação real, sem conceder gol a defensor por neutralizar ataque.

Novas decisões integram o modo rápido manual. Simulação automática que não abre minigame mantém a seleção histórica de minigames e suas regras; `baseMini` reconhece as novas chaves para compatibilidade. Falta, passe, cruzamento, interceptação, cabeceio e reflexo existentes foram preservados.

Validação: build aprovado; 352 testes de regressão e três testes novos de lógica aprovados (355 distintos). Navegador: 50/51 aprovados na rodada inicial; um reload de falta falhou enquanto o build era substituído. Rodada final de 15 cenários passou, incluindo aquele teste, os 12 casos de nova decisão e dois reencontros opcionais — 53 cenários distintos aprovados no conjunto. Cobertura atacante/zagueiro/goleiro × sucesso/erro × 320/1366, teclado, persistência após recarga, três cartas e continuar visíveis. Capturas em test-results/decisao-jogo-* inspecionadas. Logs /tmp/decisao-jogo-*.log. Documentos originais não rastreados preservados.
