# Pedido de demissão do treinador

No rodapé do modo treinador, **Pedir demissão** abre uma confirmação com as opções **Confirmar pedido de demissão** e **Continuar no comando**. A ação é oferecida enquanto existe um vínculo ativo com clube ou seleção, depois de escolher o primeiro trabalho. Não aparece para desempregados nem após encerrar a carreira; fica desabilitada durante a simulação.

Confirmar encerra apenas o vínculo. O treinador permanece na mesma carreira, sem equipe e sem salário, e pode aceitar as propostas compatíveis que chegarem ou escolher uma atividade para um ano sem clube. O histórico, os títulos e o patrimônio permanecem. Não há multa ou penalidade de reputação criada por esta alteração.

Campanhas, finais e convites abertos são interrompidos sem resolver resultados pendentes. Antes da temporada ou depois de uma campanha já concluída, pedir demissão não envelhece o treinador. Se há jogos de liga em andamento, uma campanha parcial registra as partidas e os resultados já disputados, paga o salário proporcional e encerra aquele ciclo anual, seguindo o fluxo já existente de saídas durante a temporada. A confirmação informa que o próximo trabalho será no ano seguinte nesse caso.

A saída fica identificada como escolha própria, sem contar como demissão pela diretoria nem provocar a apresentação de aposentadoria. O resumo automático de temporada não interrompe a busca por trabalho. O museu guarda uma lembrança da saída, inclusive no acervo final arquivado. Se um trabalho novo for aceito, o aviso da saída anterior é removido da situação atual, mantendo o registro histórico.

Testes específicos cobrem imutabilidade e salvamento, confirmação/cancelamento, clube e seleção, contratação seguinte, espera sem emprego, resultados parciais, proporcional de salário, fim das campanhas pendentes sem novos títulos, limites de carreira, idempotência e museu. Fluxos anteriores de aposentadoria e museu final continuam testados.

Publicado em `4180c0e`, com [CI 42728234220](https://github.com/bravolucas/A-Joia/actions/runs/42728234220) aprovado: 419 testes de lógica e 292 cenários de navegador. [Pages 42728234203](https://github.com/bravolucas/A-Joia/actions/runs/42728234203) aprovado; arquivos da versão pública conferidos por HTTPS.
