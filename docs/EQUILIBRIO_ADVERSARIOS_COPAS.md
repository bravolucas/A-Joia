# Equilíbrio dos adversários das copas — 09/11/2026

## Alterações

- Momentos resumidos de copa nacional e continental deixaram de escolher o finalista uniformemente entre todos os inscritos: os candidatos disputam eliminatórias simuladas até restarem sobreviventes compatíveis com a fase. Não há força mínima nem finalista obrigatório.
- A seleção dos 36 participantes das fases europeias usa força com variação aleatória (ranking Gumbel de escala 4), em vez de cortar uma lista embaralhada. O usuário continua incluído; classificação por competição e vagas continuam sendo respeitadas. A ordem do calendário é embaralhada após selecionar os participantes.
- No motor compartilhado de copas, a força pesa mais nos resultados: escala logística 8 em partidas comuns e 11 nas finais (antes 14/18), empate diminui mais com o desequilíbrio. Partidas equilibradas continuam equilibradas; finais ainda têm maior incerteza. Escolhas táticas e pênaltis continuam relevantes. Chances exibidas usam a mesma fórmula do sorteio.
- As próximas fases das campanhas continuam usando apenas sobreviventes, sem recriar rivais eliminados. Nacional, continental, estadual e Mundial do fluxo rápido de jogador/treinador compartilham o ajuste. No modo completo, os sorteios das próximas fases nacionais, estaduais, Copinha e continentais também recebem a fase e passam a ponderar sobreviventes simulados. Não foram alterados os motores separados de ligas e seleções.
- Adversários explícitos de momentos, resultados já salvos, fases concluídas e chave em andamento são preservados. A nova classificação de participantes vale para novas campanhas; o novo peso da força vale para partidas ainda não resolvidas.

## Amostra reproduzível

300 campanhas por formato, sementes `equilibrio|<nome>|<0..299>`, jogador controla o primeiro clube pela estratégia `controlar`; demais partidas simuladas. Amostra sintética fixa para comparação de motores, sem pretensão de prever futebol real. Champions usa 25 clubes mais fortes das ligas europeias jogáveis e todos os extras da Champions; nacional usa Brasil A/B; Libertadores usa os 32 mais fortes do Brasil, Argentina e cadastro sul-americano. Não são percentuais universais do jogo.

| Formato | Força média nas oitavas, antes → depois | Força média na final, antes → depois | Finais com algum clube abaixo de 75, antes → depois |
| --- | --- | --- | --- |
| Champions | 82,30 → 87,32 | 90,91 → 93,70 | 4/300 → 0/300 |
| Nacional | 75,23 → 75,24 | 80,15 → 82,26 | 66/300 → 13/300 |
| Libertadores | 74,38 → 75,18 | 80,21 → 82,54 | 72/300 → 23/300 |

Zebra permanece possível pela probabilidade de cada confronto; não se exige que ocorra em toda amostra. Testes adicionais cobrem 600 sorteios por fase resumida, 120 campanhas por cada um de sete formatos, determinismo, preservação de saves e elegibilidade por competição.

Validação: 37 testes relacionados e seis testes novos passaram; rodada geral local 381/381 anterior ao sexto teste. Build final aprovado. Primeira rodada browser descartada por concorrência com alterações/build e carga de simulação; rodada final isolada e CI remoto em acompanhamento.
