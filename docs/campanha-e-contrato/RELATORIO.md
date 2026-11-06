# Campanha e negociação do modo completo

## Mudanças

- Navegação da campanha identificada por “Áreas da carreira”, aba atual indicada semanticamente e alvos com pelo menos 48 px de altura.
- Folha de contrato com rótulos e valores em linhas próprias no celular. Controles de mais/menos de 44 px, com nomes de ação por termo e agrupamento acessível.
- Aceite ou recusa da diretoria informado após o pedido. A recusa mantém o valor anterior; não houve mudança na probabilidade, paciência, orçamento de pedidos ou regra de assinatura.
- Rodapé com “Recusar e sair” e “Fechar negócio” permanece visível dentro da janela rolável. Janela obrigatória mantém as saídas explícitas, sem X/Escape que descartem a conversa.

## Validação

Três cenários em 320, 390 e 1366 px carregam uma carreira normalizada, com mundo criado pelo motor; abrem a renovação pelo menu de contrato, testam pedido aceito e recusado com sorteio controlado apenas no navegador de teste, contam pedidos, verificam o rodapé e saem sem assinar. Navegam por Estatísticas, Mundo, Legado e Notícias, verificando a aba atual, ausência de overflow horizontal e erros de JavaScript.

Os testes novos inicialmente usavam mundo com tipo incorreto; substituído por `gerarMundoJogadores()` antes da rodada final. O primeiro teste também presumia aceite automático; ajustado para controlar o sorteio e verificar tanto aceite quanto recusa. A tentativa de rodapé sticky expôs `overflow:hidden` do cartão bloqueando o comportamento; removido somente na folha de contrato. Resultado final e publicação em `docs/CONTINUIDADE.md`.

## Pendências

Esta rodada não cobre todos os formatos e fases de competição nem as janelas de transferência por empréstimo do modo completo. Item 98 continua parcial; item 67 (recordes históricos de clubes/ligas) permanece pendente. Não confundir as duas revisões com a implementação já existente do modo rápido.


Build, 39 arquivos de lógica e sete cenários de navegador passaram na rodada final. As abas usam três colunas em telas abaixo de 480 px, sem palavras cortadas. Capturas de contrato em celular/desktop e navegação no celular acompanham este relatório.
