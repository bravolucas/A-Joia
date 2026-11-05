# Escolhas e empréstimos

Referências públicas consultadas: [Inky/ink](https://github.com/inkle/inky) para fluxo de escolhas narrativas em jogos (o README menciona 80 Days), [Radix Themes](https://github.com/radix-ui/themes) e [Primer React](https://github.com/primer/react) para linguagem de componentes e acessibilidade. Não são três jogos nem modelos visuais copiados. A composição do A JOIA é original, sem código ou novas dependências desses projetos. Imagens reutilizam o acervo local já creditado.

Escolhas: imagem contextual, índice de risco, descrição curta, barra de probabilidade e percentuais explícitos; um toque escolhe. Desktop em três colunas e celular em linhas ilustradas, reduzindo altura. Animação de revelação existente preservada.

Empréstimos: painel de pedido antes da simulação; três propostas determinísticas por ano/clube/código, respeitando força do atleta e com preferência por diversidade de ligas. Duração um/dois anos limitada ao contrato restante. O clube de origem continua dono do vínculo; o atleta joga no destino. Cada fechamento desconta um ano, com retorno após o prazo. Saves antigos sem duração continuam com uma temporada. Transferências definitivas não são geradas durante empréstimo. Ofertas automáticas ampliadas até 28 anos, com maior peso para reservas; incluem as durações permitidas pelo contrato.

Validação: 195 testes de lógica e 12 casos browser; criação, desafio/revelação, loja e pedido de empréstimo em 390/1366px, recarga, dois anos completos e compatibilidade de saves antigos. Uma tentativa inicial de browser falhou por servidor de prévia indisponível; repetida com servidor ativo e passou. Logs em `/tmp/escolhas-emprestimos-*` e `/tmp/emprestimos-logica.log`.
