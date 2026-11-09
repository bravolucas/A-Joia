# História viva e longevidade do treinador — 09/11/2026

## História de cada clube

A ficha do modo completo estendido foi usada como base: `estadoClubes/palmares`, títulos por clube, temporadas, números por competição, seleção e confrontos já existentes continuam sendo usados. O resumo de quatro categorias virou uma galeria com imagens de taças, multiplicadores, acervo inicial, anos da carreira e indicação de conquistas com o usuário. O nome do clube no cabeçalho do jogador e do treinador abre o arquivo; na ficha do modo completo também há acesso para explorar todos os clubes e recordes.

Um título é identificado por competição e ano. Listas pessoais, campanhas e registros do mundo da mesma edição não somam o mesmo título outra vez. Totais absolutos dos saves estendidos são reconciliados com o acervo e os eventos, não somados como novas conquistas. Registros antigos sem ano continuam identificados como legado do save.

Exemplos cobertos por testes: Corinthians começa com uma Libertadores no cadastro e passa a duas após ganhar uma edição; Atlético de Madrid tem zero Champions no cadastro e sua primeira conquista na carreira vira um capítulo inédito. A associação antiga `Atlético Madrid`/`Atlético de Madrid`, assim como Leverkusen, foi corrigida. As três Europa Leagues do Atlético e as sete do Sevilla não aparecem como Champions.

A base histórica continua sendo o cadastro do jogo, que não constitui inventário completo nem atualização oficial de todos os clubes até 2026. Clubes sem cadastro histórico explícito exibem “Base histórica estimada”. Essa distinção permanece visível; não afirmar que todos os totais são oficiais. Competições conquistadas na simulação são incorporadas mesmo que não constem nas quatro categorias iniciais.

## Universo que avança

O registro anual da carreira rápida e do treinador guarda campeões das ligas e copas de fundo, além das campanhas efetivamente jogadas. Estas prevalecem sobre o resultado de fundo da mesma edição. O modo estendido utiliza seus próprios campeões já simulados. A galeria atualiza ao concluir a temporada/competição e preserva os capítulos após mudar de clube ou se aposentar. Anos anteriores à introdução do arquivo não recebem campeões fictícios retroativos: apenas títulos conhecidos dos saves são recuperados.

O motor de fundo reutiliza os campeões nacionais do cálculo de vagas e o sorteio-base das classificações. O fechamento do treinador registra também a última temporada antes do limite de idade, sem exigir iniciar mais uma temporada e sem alterar os registros das temporadas anteriores.

## Estatísticas e feitos individuais

- Jogos, gols, assistências e, quando disponíveis, jogos sem sofrer gols e defesas por competição e clube; totais existentes de seleção aparecem separadamente.
- O modo estendido conserva sua divisão anual por competição. No rápido, novas temporadas passam a distribuir os totais simulados entre as competições disputadas. A soma conserva jogos/gols/assistências; gols e assistências nas copas não podem superar os gols da própria equipe. A origem simulada está indicada na interface.
- Defesas passam a ser uma estatística simulada de novas temporadas de goleiro, estável por semente e persistida, inclusive no modo completo. Defesas decisivas de lances resolvidos são um contador separado. Não preencher defesas antigas como se tivessem sido registradas.
- Rankings cumulativos de atletas observados por nacionalidade: gols, assistências, jogos e defesas. São números de clubes de atletas daquela nacionalidade, não gols pela seleção. A distinção está escrita na tela; só dados observados desde o início do registro entram no ranking.
- Referências reais datadas: 140 gols e 183 jogos de Cristiano Ronaldo na Champions; Neymar 79 gols e Cafu 142 jogos pelo Brasil; artilharia histórica de Alemanha, Itália, Espanha e Países Baixos. Datas e fontes constam nos cartões. Não anunciar como consulta em tempo real a um banco oficial atualizado.
- Ao igualar ou ultrapassar uma referência, o feito entra nos destaques da temporada e no histórico individual. Primeira taça do acervo conhecido do clube também gera destaque.
- Saves antigos sem separação por competição ficam identificados como incompletos, conservando os números existentes.

## Treinador até 85 anos

O encerramento por 30 temporadas foi removido. A idade avança com temporadas de clube, seleção e anos sem emprego; aos 85 anos não começa nova temporada. Copas/finais já abertas na última temporada ainda podem ser concluídas. O painel preserva acesso ao legado e às conquistas após o encerramento.

“Aposentar como treinador” está disponível antes do limite, inclusive em temporada em curso, com opção de cancelar. Confirmar preserva os resultados concluídos e guarda o estado das competições interrompidas no registro de aposentadoria; não inventa os jogos restantes. O treinador aposentado não volta a simular por recarregar o save. A aposentadoria de jogador continua independente.

## Validação

Testes específicos de dados cobrem deduplicação, Corinthians, Atlético, títulos continentais distintos, reconciliação do modo estendido, conservação de estatísticas, goleiros, referências, rankings, persistência anual, limite de idade, ano sabático e aposentadoria. Browser cobre galeria em 320/1366px, navegação por clubes/estatísticas/recordes, ficha estendida, cancelamento/confirmação de aposentadoria, reload e limite de 85 anos.

Validação local: build final aprovado; 399/399 testes de lógica na rodada geral anterior ao último caso adicional de Série B; 18 testes específicos finais aprovados. Quinze cenários distintos de navegador aprovados na união das verificações (incluindo seis novos em verificação final isolada), em celular e desktop. A rodada inicial geral revelou testes que ainda exigiam o limite antigo; foram atualizados para 85 anos, assim como os bloqueios antigos de loja/mercado. O registro de temporada anterior foi preservado, sem anexar metadados retroativos. CI completo e publicação em acompanhamento.


Entrega funcional `203a60e`: publicação Pages 42685294982 confirmada. CI 42685295116 aprovou 400 testes de lógica, build e 274 cenários browser; três testes de migração ainda esperavam o rótulo antigo da versão. Expectativas ajustadas para “História viva”, com todas as verificações de saves/cache/SW preservadas; os três passaram localmente. Nova confirmação completa em acompanhamento.
