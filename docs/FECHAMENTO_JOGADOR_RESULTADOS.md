# Resultados de temporada do jogador

A apresentação segue a ordem: títulos, acesso/rebaixamento, top 3 da Bola de Ouro, resumo completo. Cada resultado ocupa sozinho a janela central, sem tabelas ou estatísticas. O último resultado oferece “Ver resumo da temporada”; o resumo continua com o desenho e as informações existentes.

Títulos repetidos no mesmo card são deduplicados na apresentação. Segundo e terceiro da Bola de Ouro têm posição explícita e não alteram a contagem do prêmio. Anos sem esses resultados abrem diretamente o resumo. A seleção mantém nome e bandeira nos títulos internacionais.

`celebracoesTemporada.js` constrói a fila sem alterar a carreira. `celebracaoIndice` fica no save da etapa `fechamento`; recarregar retoma o resultado atual ou o resumo já aberto. Nenhum clique dessa sequência executa novamente o motor da temporada. Saves da etapa antiga `bolaOuro` e a revisão pelo histórico continuam funcionando.

A janela mantém bloqueio de rolagem do fundo e foco do diálogo nativo. Escape avança somente a apresentação atual. Movimento reduzido desativa animações. O botão permanece visível em 320×568, 390×844 e desktop.

Testes: fila e top 3 na lógica; apresentação isolada, sequência título/acesso/prêmio, reload, números preservados, primeiro/segundo/terceiro/quarto lugares, rebaixamento, ausência de resultados, revisão, save legado e preferência de movimento reduzido no navegador.

Entrega `305851d` publicada. GitHub Pages (`42494223773`) e validação geral (`42494223817`) aprovados, com 298 testes de lógica e 189 cenários de navegador.
