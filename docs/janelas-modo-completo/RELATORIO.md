# Janelas do modo completo e gerenciador de saves

## Alterações

`PopupOverlay` agora usa diálogo nativo em portal: fundo inativo, bloqueio compartilhado de rolagem, área útil dinâmica, Escape quando há fechamento permitido e restauração de foco ao botão anterior. Janelas obrigatórias sem `onClose` não são dispensadas por Escape ou clique no fundo. Clique no conteúdo não fecha a janela. Janelas dispensáveis têm botão de fechar de 44 px sempre visível fora da área rolável. Preferência de movimento reduzido desliga as animações de entrada desse componente.

O gerenciador recebe nome acessível “Carreiras salvas”, cartões arredondados, texto mínimo de 12 px, botões com altura mínima de 44 px e disposição adaptativa. Orientação corrigida para os cinco espaços. Importação por arquivo acessível pelo teclado (Enter/Espaço), sem mudar o formato do save ou regras de sobrescrita/exclusão.

## Verificação

Quatro cenários novos cobrem 320, 390 e 1366 px, tela de 568 px de altura, rolagem interna, navegação por teclado, retorno do foco, Escape, clique no fundo/conteúdo, integridade do save e abertura do seletor de arquivos por teclado. Fixtures populam apenas dados de listagem; não pretendem validar carregamento de uma carreira completa ou parsing do arquivo importado.

Primeira rodada começou sem servidor de prévia ativo e foi descartada. Prévia reiniciada e testada antes das rodadas válidas. Teste de Tab ajustado para admitir a passagem do foco à interface do navegador, sem admitir foco nos controles de fundo. Quatro cenários específicos passaram antes do acabamento visual; build e regressão ampla de **132 cenários** passaram. Após incluir o botão de fechar sempre visível, build e os quatro cenários específicos foram reexecutados. Resultado final e publicação em `docs/CONTINUIDADE.md`.

## Escopo restante

É um avanço da revisão visual do item 98, não auditoria completa de todos os estados do modo completo. Permanecem as demais telas de campanha, competições, negociação, aposentadoria e cenas raras. Recordes históricos reais de clubes/ligas continuam separados como pendência do item 67.
