# Copas: chave real, calendário e identidade visual (08/11/2026)

## Entrega

A escolha de um adversário novo a cada fase foi substituída por uma chave persistida. Os outros clubes disputam seus confrontos e os vencedores avançam. Playoffs da UEFA têm vencedores registrados antes das oitavas dos classificados diretos. Clubes mais fortes conservam vantagem pelas probabilidades de jogo e pênaltis; nenhum resultado é imposto e zebras continuam possíveis. Entrada por força na Copa do Brasil permanece a adaptação solicitada anteriormente.

As copas usam uma agenda compartilhada nos modos rápidos de jogador e técnico. No Brasil o primeiro evento é estadual. O início da liga aparece depois da primeira decisão regional; desde 2026, janeiro, compatível com a sobreposição do Brasileiro aos estaduais. Preliminares nacionais entram em fevereiro/março; grupos continentais em abril–junho; mata-matas no segundo semestre; finais nacionais/continentais em novembro; encerramento da liga e competição mundial anual em dezembro. Na Europa a edição atravessa setembro do ano anterior a maio do ano de encerramento, com marcos da liga em agosto/janeiro/maio. São janelas de calendário, não datas oficiais diárias futuras.

No jogador, decisões das copas agora usam o motor compartilhado (não apenas uma probabilidade abstrata de chegar à final). Clássicos, lances da liga e torneios de seleção existentes entram na agenda, sem repetir a liga. Temporadas/saves já em andamento no fluxo anterior mantêm compatibilidade. Estaduais ainda usam uma classificação regional curta, sem reproduzir todos os regulamentos estaduais reais. As APIs automáticas antigas continuam disponíveis; a interface usa o calendário novo. Pausas do antigo fluxo serial de liga do técnico não se sobrepõem à nova agenda.

Identidades próprias para Libertadores, Sul-Americana, Champions, Europa League, Conference, Copa do Brasil, copas nacionais e mundial. Fundos originais em CSS/SVG, cores, motivos, taça e cartas com trajetórias táticas. Animação de 850 ms após a escolha; trajetórias de gol, trave/empate e bola para fora. Resultado gravado antes da animação, trava contra clique repetido e modo de movimento reduzido entrega direta. A escolha e o resultado ficam no mesmo painel; botão de continuidade fixo no rodapé. Telas de 320 px recebem cartas compactas.

## Mundiais diferentes

- **Copa Intercontinental FIFA:** anual em dezembro. Vencer a competição continental principal abre a vaga imediatamente no mesmo ano, sem exigir permanência até a temporada seguinte. UEFA entra na final; vencedor da Libertadores enfrenta o representante CONCACAF, o vencedor do outro caminho e o europeu. Caminhos dos demais representantes seguem uma versão rápida da disputa. Campeões europeus/sul-americanos adversários e as eliminatórias entre os demais são simulados, com forças estimadas; não são apresentados como resultados oficiais reais.
- **Mundial de Clubes FIFA:** 32 participantes, a cada quatro anos a partir de 2025, em junho/julho. Campeões principais registrados nas quatro temporadas anteriores qualificam o clube vencedor, não o jogador/treinador que tenha mudado de emprego. Três jogos de grupos e mata-mata. Europa, América do Sul, Ásia, CONCACAF, África e Oceania têm representantes. Fora dos campeões registrados, a composição é uma adaptação por força e região: o ranking oficial de quatro anos e todos os seus limites por país ainda não são reproduzidos. Não se inventam títulos anteriores para saves sem histórico.

As duas competições têm títulos distintos no histórico/museu. A Intercontinental recebeu ilustração vetorial original com crédito no acervo. Conquistas já celebradas durante a campanha não voltam como pop-up de título no fechamento; continuam no resumo e nas contagens.

## Fontes consultadas

- https://github.com/openfootball/brazil — `brazil/2026_br1.txt`: início em 28/01 e encerramento em dezembro; `copa-libertadores/2026_copal.txt`: eliminatórias em fevereiro e final em novembro. `brazil/2025_brcup.txt` contém apenas parte da edição; não foi usado como calendário completo.
- https://github.com/openfootball/champions-league — `2025-26/cl.txt`: fase de liga em setembro–janeiro, final em maio.
- https://github.com/openfootball/club-world-cup — `2025/clubworldcup.txt`: grupos em junho, mata-mata e final em julho; base de exemplo de 32 participantes.
- A consulta direta ao site FIFA recebeu bloqueio de rede 403 neste ambiente. O formato mundial anual foi adaptado ao modelo conhecido de campeões continentais; não afirmar verificação online de todos os regulamentos oficiais futuros.

## Verificação

Testes em `tests/calendario-copas.test.mjs` e `tests/copas-calendario.spec.mjs`, mais regressão existente. Incluem qualidade estatística dos finalistas, zebras possíveis, adversários sobreviventes, persistência sem mutação, duplo clique, classificação mundial no mesmo ano, janela de quatro anos, cronologia dos dois modos, identidades de sete competições, animação antes da revelação e movimento reduzido. Detalhes finais da execução/publicação em `docs/CONTINUIDADE.md`.

Migração: campanhas antigas sem chave completa preservam o adversário já apresentado; os demais sobreviventes são montados sem reabrir clubes já eliminados. A liga mostra campanha parcial calculada a partir dos confrontos efetivamente salvos, sem inventar uma classificação parcial dos outros clubes. O campeão da liga celebra no marco de encerramento, antes da Intercontinental.

Em telas baixas de celular, a data da agenda permanece no cabeçalho; a faixa duplicada é ocultada para manter as três escolhas inteiras, inclusive na fase de liga da Champions.
