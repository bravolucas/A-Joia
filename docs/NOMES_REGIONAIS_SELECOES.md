# Seleções: nomes regionais para convocados fictícios

## Problema corrigido

O cadastro mundial já usa pools de nomes por nacionalidade (`src/simulacao/nomesRegionais.js`), incluindo 83 seleções. Porém, ao preencher as 25 vagas controladas por IA da seleção do jogador, `src/jogador/elencoSelecao.js` gerava nomes de um **conjunto fixo com predominância brasileira**. Assim, novas promessas inglesas, japonesas ou marroquinas em Copas do Mundo podiam surgir com nomes brasileiros.

## Solução

- A geração **de novos convocados** usa `gerarNomeRegional(c.nac, rngDeterministico)` com uma sequência derivada do código da carreira, nacionalidade, ano e posição da vaga.
- A sequência é local ao gerador de nomes; **não consome o RNG global do jogo**, nem altera sorteios, resultados ou transferências.
- O hash utilizado para IDs, posição, idade e OVR é preservado integralmente. A lógica de renovação, aposentadoria, numeração e estatísticas permanece a mesma.
- Colisões são resolvidas por tentativas determinísticas com o mesmo pool cultural. Se um pool de 5×5 já estiver ocupado, o gerador combina dois sobrenomes da mesma origem, sem retroceder para o conjunto brasileiro.
- Jogadores já salvos, incluindo os com nomes brasileiros de versões antigas, **não são renomeados retroativamente**. Apenas o jogador gerado numa vaga nova recebe o nome regional. Nenhuma migração de save é necessária.

## Cobertura

`tests/elenco-selecao-nomes-regionais.test.mjs` valida as 83 nacionalidades, os 25 jogadores de cada elenco, nomes únicos e coerência com a origem regional, determinismo, invariância dos atributos e preservação de nomes antigos em temporadas futuras.

A CI específica executa esses testes, a suite antiga `elenco-selecao.test.mjs` e o build para GitHub Pages. O PR permanece em draft até ambas as suites e a CI geral estarem aprovadas no head, a main estar validada e sua publicação ser possível.

Este ajuste não afeta o cadastro do universo mundial e não resolve, sozinho, nomes de NPCs de outros módulos que ainda usem listas legadas.
