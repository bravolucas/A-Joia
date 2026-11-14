# Registros do modo completo

Esta etapa corrige a origem dos dados no modo `jogoAJogo`:

- Cada rodada conserva todos os placares estruturados em `card.jogosLiga`, antes de limpar o estado transitório. A chave rodada/mandante/visitante permite retomar sem duplicar jogos.
- A última rodada decidida por minijogo usa a tabela atualizada no fechamento.
- Os totais do clube somam participações da liga e estatísticas das copas jogadas. Suspensão, descanso e ausência não contam como participação. Seleções mantêm sua própria contagem.
- A distribuição por competição usa os totais registrados quando disponíveis. Saves sem registros continuam com a distribuição legada; não se inventam placares antigos.
- Defesas e jogos sem sofrer gols do goleiro são registrados por partida: eventos do motor ao vivo, ou simulação individual no avanço rápido.
- Partidas ao vivo de copas e seleções conservam placar, adversários e estatísticas principais no card da temporada. O histórico antigo de copas deixa de descartar partidas depois de 120 registros.

## Limites desta etapa

O modo `completa` ainda usa a projeção anual. Os sorteios das fases de copa no modo completo ainda precisam ser substituídos por chaves persistentes que simulem todos os participantes. A integração de todo o calendário mundial, a reconciliação dos NPCs com esses jogos e a promoção/rebaixamento das outras ligas permanecem para a próxima etapa. Os novos registros de copa ficam no save da temporada; a edição completa da competição no arquivo do mundo depende dessa integração.

## Verificação

Quatro testes de lógica novos cobrem persistência, deduplicação, ausência de placares legados e soma das estatísticas. Dois testes de navegador em 390 e 1366 px avançam rodadas, salvam em um espaço manual, recarregam e verificam a rodada e os placares preservados. Verificados também os testes de história, mundo vivo e classificações do mundo, e a compilação de produção.
