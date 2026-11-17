# Fase 1 — posições secundárias de novos atletas fictícios

O PR #101 adicionou a leitura de posições secundárias **com aptidão comprovada** para calcular carências de elenco, mas os novos atletas gerados automaticamente ainda não recebiam esses dados.

## Regra experimental de game design

- Apenas atletas **fictícios criados pelo motor de reposição** (emergência de base e substituição de aposentados) recebem aptidão secundária procedural.
- Em cada novo atleta, a chance de ter **uma** função alternativa é 20%. Goleiros nunca recebem alternativa e todas as duplas são compatíveis (por exemplo LD/LE, MC/VOL, ponta/MEI).
- A seleção usa hash estável de ID, nome, nacionalidade e posição; **não faz chamadas extras ao RNG** do jogo. Assim, a sequência dos demais sorteios, nomes e transferências permanece inalterada.
- Uma posição secundária gerada tem `{posicao,apto:true}`, significando habilidade presumida **somente dentro da ficção**. Não equivale a dados verificados de atletas reais.
- Jogadores e saves já existentes não são regravados ou recalculados, e nenhum clube recebe contratação profissional automática.
- O sistema pode reduzir reposições emergenciais quando houver versatilidade comprovada, sem permitir que o mesmo atleta cubra duas vagas simultaneamente.

## Validação

Teste de estabilidade do hash, faixas de frequência, pares válidos, identidade dos saves legados, IDs únicos e reposição após aposentadoria. O CI ainda deve simular 50 temporadas do catálogo completo para detectar regressões.

## Limitações
Não há scouting, treino especializado por posição, dual citizenship nem proficiência numérica. A frequência de 20% é uma escolha inicial de balanceamento **sujeita à auditoria de dificuldade**, não uma alegação estatística. As posições reais exigem fonte verificável e permissão/licença.
