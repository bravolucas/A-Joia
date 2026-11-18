# Particionamento seguro de 32 carreiras Jogador → Treinador

Os testes de integração de longa duração no CI passam de **2 runners × 16 carreiras** para **4 runners × 8 carreiras**. Todas as 32 carreiras individuais (`INTEGRACAO0` até `INTEGRACAO31`) são executadas, sem encurtar a carreira de jogador, alterar a aposentadoria, a temporada de treinador ou os asserts anteriores.

`tests/integracao-jogador-tecnico.test.mjs` continua rodando as 32 carreiras sem variáveis de ambiente no desenvolvimento local. Na CI, cada partição coleta:
- a lista de oito índices;
- o total de temporadas do jogador efetivamente simuladas;
- o total de jogos da carreira de treinador.

O `conferir-integracao-32` é **obrigatório** para que o workflow inteiro seja aprovado. Ele exige quatro artefatos, exatamente oito índices de 0 a 31 atribuídos a cada partição, sem repetição ou buracos, além dos limiares globais originais:
- **temporadas do jogador > 300**;
- **jogos de treinador ≥ 320**.

Um runner ausente, relatório corrompido, lacuna ou duplicação reprova, mesmo que os outros três executem normalmente. O agregador verifica os resultados globais **após** a matriz, além dos asserts individuais já existentes. As 24 carreiras de melhorias permanecem em quatro runners próprios com seu agregador separado.

Esta alteração não muda o código do jogo, o armazenamento, os times ou o balanço da simulação. Deve ser integrada apenas após auditoria dos 32 índices, CI geral aprovada no head e CI de publicação da main.

Relacionado à issue #110 e à evolução da CI do PR #113.
