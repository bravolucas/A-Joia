# OVR e histórico no computador

A partir de 1000 px, um seletor de layout da Copa também convertia o cartão laranja de OVR e o histórico em grades de duas colunas. Isso deslocava o número para o canto e comprimia as informações da trajetória.

A tela da Copa ganhou a classe própria `cp-torneio`. Apenas ela recebe as duas colunas; OVR volta ao fluxo vertical centralizado e histórico usa sua largura normal. O cálculo do OVR permanece intacto.

Seis novos testes reais de navegador medem os retângulos de rótulo/número/cartão em 390, 999, 1000, 1366 e 1920 px, checam a largura do histórico e a preparação, e preservam as duas colunas da Copa. Build passou. Os 100 cenários anteriores e cinco verificações novas passaram na rodada ampla; após corrigir a referência ao cabeçalho no teste da Copa, as seis verificações novas passaram em nova execução. Total: 106 cenários validados. Capturas de celular e computador nesta pasta. Resultado da publicação em `docs/CONTINUIDADE.md`.
