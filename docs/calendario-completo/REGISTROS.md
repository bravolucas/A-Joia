# Calendário e registros do modo completo

## Partidas e estatísticas

No modo `jogoAJogo`, cada rodada conserva todos os placares estruturados em `card.jogosLiga`, antes de limpar o estado transitório. A chave rodada/mandante/visitante permite retomar sem duplicar jogos. A última rodada decidida por minijogo usa a tabela atualizada no fechamento.

Os totais do clube somam participações da liga e estatísticas das copas jogadas. Suspensão, descanso e ausência não contam como participação. Seleções mantêm contagem própria. A distribuição por competição usa os totais registrados quando disponíveis. As defesas do goleiro vêm dos eventos do motor ao vivo ou da simulação individual da partida no avanço rápido. O histórico antigo de copas deixa de descartar partidas depois de 120 registros.

## Chaves persistentes

As novas temporadas em `jogoAJogo` ativam `copasPersistentesVersao`. Copa nacional, estadual, Copinha e continental guardam sua campanha em `card.campanhasCompletas`. O adversário mostrado pelo motor ao vivo é o adversário da chave. O placar entra na campanha sem um segundo sorteio. Os próximos confrontos respeitam os classificados; uma eliminação conclui o restante do torneio e conserva o campeão e vice.

São formatos adaptados ao jogo: copa nacional com 16 participantes, estadual com até oito clubes do mesmo estado, Copinha e continental por grupos com até 32 participantes; continental por fase de liga com até 36. Os participantes são congelados no início da campanha. A força do jogador é atualizada ao iniciar suas partidas. A copa nacional e o mata-mata continental têm ida e volta, com final única. O agregado não vira uma terceira partida nas estatísticas nem no arquivo. A classificação dos grupos vem dos placares, substituindo os antigos limites fixos de pontos.

O motor compartilhado conserva os demais grupos e continua o torneio após eliminação na fase de grupos, fase de liga ou classificação estadual. Tanto o arquivo do mundo quanto a distribuição das estatísticas dos NPCs leem os grupos e as pernas efetivas dos confrontos. O campeão da chave da copa nacional e do continental prevalece sobre o sorteio antigo na história e no palmarés do modo completo.

Saves que já estavam no meio de uma temporada sem a versão nova continuam no fluxo anterior. Não se recriam chaves ou placares de partidas passadas.

## Trabalho restante

O modo `completa` ainda usa projeção anual. Copas de seleções do modo completo ainda usam o fluxo anterior. A integração de todas as ligas mundiais, a reconciliação dos NPCs do modo completo com o calendário mundial inteiro e as promoções/rebaixamentos das demais ligas permanecem para uma próxima etapa. O leitor compartilhado de estatísticas já aceita os jogos novos; esta etapa não substitui toda a evolução anual dos NPCs no modo completo.

## Verificação

Testes de lógica cobrem eliminação nos três formatos iniciais, continuação até o campeão, ida e volta, preservação dos placares, validação do agregado, folgas, retomada, ausência de migração de competições em andamento e leitura dos jogos pelo arquivo e pelas estatísticas do mundo. Testes no navegador verificam partida ao vivo alimentando a copa nacional e o continental, próximo jogo agendado, estatísticas e salvamento; os testes anteriores cobrem avanço rápido e retomada em celular e desktop.
