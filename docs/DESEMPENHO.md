# Resposta dos botões e salvamento

O modo rápido confirma a gravação durável antes de trocar a etapa. Essa proteção continua ativa: falha de gravação mantém a tela e o save anterior, com opção de tentar novamente.

O gargalo identificado em novembro de 2026 era o critério de uso do IndexedDB. Ele só reconhecia `universo`, criado após o primeiro fechamento, embora a carreira já tivesse cerca de 7.200 jogadores em `mundo`. Assim, decisões simples compactavam todo o mundo com LZString na thread da interface e gravavam em localStorage antes de apresentar a resposta.

Agora a presença de `mundo.jogadores` também seleciona o IndexedDB, nos modos jogador, treinador, completo e desafios. Saves JSON anteriores são lidos normalmente e a próxima gravação usa o banco. Sem IndexedDB disponível, o formato compactado anterior continua funcionando. Nenhum atleta, competição ou histórico é removido.

O snapshot também deixou de passar por duas cópias consecutivas. `clonarEstado` possui uma opção para copiar integralmente o universo ao salvar, preservando o contrato JSON e o isolamento em relação a mutações posteriores. Os redutores continuam compartilhando o arquivo imutável, como antes; o banco mantém sua própria cópia durável.

## Medição reproduzida

Build de produção, Chromium, carreira nova com 7.200 atletas, clique em “Não arriscar este ano” até as três cartas de treino aparecerem e o salvamento terminar. Perfil coletado pelo Chrome DevTools Protocol. São medidas do cenário observado, não limites universais de desempenho.

| Condição | Antes | Depois |
| --- | ---: | ---: |
| CPU normal | 492 ms | 121 ms |
| CPU limitada a 4× | 3.535 ms | 270 ms |
| Maior tarefa de JS, CPU limitada | 3.389 ms | 136 ms |

Antes, `_compress` concentrou cerca de 2.986 ms do perfil com CPU limitada. Depois, essa função não participou do caminho medido. Em um snapshot com um ano e cerca de 8,7 MB de dados, a cópia isolada passou de aproximadamente 107 ms para 70 ms no teste de lógica.

Os intervalos visuais da prancheta técnica não foram alterados. A simulação do fechamento anual continua processando o calendário mundial. Os testes de regressão verificam migração do JSON, preservação dos atletas e da decisão após recarga, fallback sem IndexedDB e falha de gravação sem avanço indevido da tela.
