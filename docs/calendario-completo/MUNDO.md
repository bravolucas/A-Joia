# Calendário mundial no modo completo

Ao fechar a temporada, as demais ligas jogáveis simulam todos os confrontos em dois turnos. A liga do jogador conserva sua classificação e os placares efetivamente disputados. No modo anual, essa liga ainda usa a projeção anterior: não se inventam placares para ela. As demais ligas têm resultados completos nos dois modos.

As copas nacionais e continentais externas usam o motor compartilhado. Uma competição já disputada pelo jogador prevalece sobre a simulação externa; as copas próprias do fluxo antigo são preservadas sem criar uma segunda edição ou atribuir um campeão desconhecido. O clube controlado não é inscrito independentemente em outro continental pela simulação externa.

Os campeões da tabela e das chaves alimentam o palmarés e a história. Acesso e rebaixamento usam a tabela completa de cada divisão disponível. Quando a divisão do jogador ainda usa a projeção anual, somente esse lado conserva o critério anterior; uma tabela real da outra divisão continua prevalecendo. O cadastro do calendário seguinte recebe as divisões atualizadas.

As estatísticas dos NPCs são reconciliadas com os jogos antes de calcular artilharia e premiações. Gols e assistências do usuário são reservados no seu jogo; sua presença ocupa uma das 11 vagas da equipe. Jogadores sem participação nos clubes cobertos não mantêm números sorteados. A liga própria do modo anual preserva os totais projetados, com origem identificada como projeção, até sua conversão ao calendário real. A separação por competição do ano anterior não é reaproveitada, e a artilharia usa a liga e o clube defendidos antes de uma transferência. A evolução, as transferências e as aposentadorias continuam ocorrendo uma vez por temporada. O prêmio anual usa o vencedor do ranking corrigido e sua identidade; a liga defendida na temporada é preservada após transferências.

As vagas continentais da temporada seguinte são calculadas com tabelas e títulos disponíveis e pertencem ao clube. Nas ligas com calendário real, essas vagas substituem a inscrição aleatória do modo completo. Saves sem histórico suficiente conservam o fluxo anterior. O histórico de edições guarda os jogos compactados; o resumo anual conserva as tabelas e os campeões, evitando duplicar o calendário mundial inteiro a cada ano.

A temporada é registrada uma vez. Reabrir a carreira consulta os mesmos dados e não simula outro ano.

## Limites

A liga do próprio jogador no modo anual e as copas de seleções ainda precisam de conversão ao calendário persistente. A gestão financeira dos clubes NPCs continua simplificada. Não há preenchimento retroativo de temporadas antigas.

## Validação

Os testes cobrem conservação dos placares do usuário, dois turnos das outras ligas, campeão único, retomada determinística, divisões atualizadas, promoções pela tabela, estatísticas e vagas continentais, clubes de segunda divisão, liga defendida antes de transferir e identidade do vencedor do prêmio. O navegador fecha uma temporada, verifica o arquivo mundial, salva e retoma em celular e desktop.
