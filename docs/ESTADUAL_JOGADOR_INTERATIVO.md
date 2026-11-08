# Estadual disputado no modo jogador

A entrega anterior havia incluído o estadual automaticamente no resumo do jogador. Após o relato de ausência de disputa com Mirassol e Ponte Preta, a interface passou a abrir o Campeonato Paulista após a escolha de treino e antes dos outros lances da temporada.

São duas escolhas na classificação regional e, se o clube avançar, semifinal e final. Não há eliminação anterior à primeira escolha. A disputa usa o clube e o estado da temporada, chances pela força dos dois times e escolha separada nos pênaltis. Os rótulos dos planos foram adaptados ao jogador.

A etapa `estadual` e a campanha `card.estadualEmJogo` ficam salvas. Fechar/recarregar retoma o mesmo resultado; nenhuma escolha repete a liga, salário ou idade. Ao concluir, o resultado substitui apenas a projeção automática daquele estadual ainda não registrado. O título só entra na contagem ao fechar a temporada, uma vez. A classificação perdida é informada antes de prosseguir. Temporadas já encerradas não são refeitas; a alteração passa a valer no próximo início de temporada pela interface.

Testes dedicados: `tests/estadual-jogador.test.mjs` e `tests/estadual-jogador.spec.mjs`. Incluem Mirassol e Ponte Preta, primeira escolha obrigatória, persistência/duplo clique, fechar/retomar, 320/1366 px, continuidade dos demais lances e bloqueio de fechamento prematuro.

Validação: 323 testes de lógica e 199 cenários de navegador aprovados. A faixa da temporada indica Campanha durante o estadual. Build de produção e verificação final dedicada antes da publicação.

Publicação: commit `8c03287`, GitHub Pages [42523762945](https://github.com/bravolucas/A-Joia/actions/runs/42523762945) concluído com sucesso. Tela inicial identifica “Estadual interativo”. Vale para a próxima temporada iniciada pela interface; saves existentes são preservados.

Validação remota [42523762972](https://github.com/bravolucas/A-Joia/actions/runs/42523762972) também concluída com sucesso.
