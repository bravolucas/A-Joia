> Atualização posterior: a chave, a ordem dos eventos, o Mundial e o visual foram remodelados. Consulte [Calendário e temas](CALENDARIO_COPAS_TEMAS.md) para o comportamento atual; este documento registra a entrega inicial.

# Copas com escolhas, vagas e estaduais — modo rápido

## Entrega

- Treinador de clube disputa as copas com três planos por jogo, chances visíveis de vitória/empate/derrota e força dos dois adversários. O empate eliminatório leva a outra escolha, de pênaltis. A final tem pressão maior e reduz a vantagem do favorito nos pênaltis, sem igualar artificialmente times fortes e fracos.
- Libertadores e Sul-Americana: grupo de quatro, seis partidas, primeiro/segundo avançam conforme o torneio. O terceiro da Libertadores recebe a repescagem da Sul-Americana. Na Sul-Americana, o primeiro vai às oitavas e o segundo joga um playoff.
- Champions/Europa/Conference: tabela única de 36 clubes. Oito jogos nas duas primeiras, seis na Conference; duas partidas exigem escolha, as demais são simuladas e contam de verdade na tabela. Oitavo para cima avança diretamente; 9º–24º disputa playoff; 25º–36º sai sem transferência para outra copa europeia.
- Copa do Brasil no jogo: força-base a partir de 80 começa nas oitavas; de 65 a 79 começa nas pré-oitavas; abaixo de 65, na fase anterior. **Essa entrada por nível é uma adaptação pedida para o jogo, não o regulamento oficial da Copa do Brasil.** Outros mata-matas nacionais mantêm uma versão curta.
- Estaduais nos dois modos: participantes do mesmo estado, classificação regional resumida e semifinal/final. Não é uma cópia integral de todos os regulamentos estaduais. Inclui o Sergipano para o Confiança, antes ausente do catálogo. Clubes regionais adicionais são reais; suas forças são estimativas de balanceamento.
- Jogador disputa o estadual com escolhas na classificação e, se avançar, semifinal/final. Os demais torneios mantêm seus fluxos atuais. Na entrega inicial o estadual do jogador era automático; a correção está documentada em `docs/ESTADUAL_JOGADOR_INTERATIVO.md`.

## Vagas e épocas

`vagasInternacionais.js` e `regrasCopasRapidas.js` são a regra compartilhada pelos dois modos. A vaga é do **clube e do ano**, não do jogador ou treinador. Trocar de clube não apaga a vaga do destino nem transporta a vaga do clube anterior.

### Brasil

Base anual modelada: até 2025, seis vagas pela liga; a partir de 2026, cinco vagas pela liga, campeão da Copa do Brasil e vice da edição de 2026 em diante. Os quatro primeiros do Brasileiro têm acesso direto. O campeão da copa tem acesso direto; o vice entra pela pré. Títulos da Libertadores/Sul-Americana dão acesso à Libertadores seguinte. Sobreposições são redistribuídas sem duplicar o clube nem rebaixar um integrante do G4 para a pré. Seis clubes seguintes sem vaga na Libertadores entram na Sul-Americana.

A condição de vice é parametrizada pelo ano: não é aplicada retroativamente aos saves de 2025. Campeão de copa em segunda divisão pode disputar a continental. Os campeões continentais aumentam o contingente do país conforme a base CONMEBOL do jogo.

### Europa

Cotas-base das oito ligas jogáveis, posição na liga, campeão de copa nacional e acessos por títulos europeus. Champions/Europa dão acesso à Champions; Conference dá acesso à Europa, preservando uma vaga superior já conquistada. Um campeão europeu já classificado para a Champions pela liga não abre automaticamente uma quinta vaga nacional: essa regra difere da redistribuição brasileira. O bônus anual UEFA (EPS) é configurável e não é sorteado nem presumido para países em temporadas futuras.

Coeficientes, vias preliminares e redistribuições europeias completas variam por edição. O jogo mantém cotas-base configuráveis e pré-fases resumidas; não promete reproduzir toda a lista oficial de acesso de cada ano futuro. Clubes de ligas europeias não jogáveis completam os quadros de 36, sem colocar um clube conhecido de outra competição no sorteio. São nomes reais, com força estimada para o jogo.

### Saves

Posição final já registrada tem prioridade sobre uma reconstrução por força. Um segundo colocado antigo continua classificado mesmo sem a tabela mundial completa. A campanha atual guarda decisões e resultados, incluindo pênaltis, sem rerrolar ao recarregar. Fechar a janela oferece “Retomar copas”. Trabalho e ano não podem mudar com copas pendentes. Ao terminar, atualizam-se taças, histórico, reputação e propostas, sem repetir liga, salário ou idade.

O histórico final remove estado transitório de sorteio/animação e mantém tabelas e jogos públicos para não multiplicar o tamanho dos saves. Anos já encerrados não são refeitos para inserir copas retroativamente. APIs antigas de simulação e configurações explícitas de torneios continuam compatíveis.

## Fontes consultadas e limites da pesquisa

Consultados os arquivos públicos OpenFootball (base de dados aberta):

- [Champions 2025/26](https://github.com/openfootball/champions-league/blob/master/2025-26/cl.txt): 36 equipes; fase de liga, playoff e mata-mata.
- [Champions 2024/25](https://github.com/openfootball/champions-league/blob/master/2024-25/cl.txt).
- [Europa 2024/25](https://github.com/openfootball/champions-league/blob/master/2024-25/el.txt).
- [Conference 2024/25](https://github.com/openfootball/champions-league/blob/master/2024-25/conf.txt).
- [Base sul-americana OpenFootball](https://github.com/openfootball/br-brazil).
- Catálogo existente de clubes, estados e competições em `src/dados/data.js`.

A consulta direta aos sites oficiais CBF e UEFA não ficou acessível na rede deste ambiente. Não houve validação documental oficial de todas as alterações anuais da CBF, de todas as federações estaduais ou da lista UEFA de cada edição. A regra do vice da Copa do Brasil 2026+ é explícita e separada das edições antigas; alterações futuras devem ser conferidas nos regulamentos da edição antes de atualizar essa base. Os arquivos OpenFootball comprovam formatos e jogos, não todas as regras futuras de acesso.

## Verificação

Testes dedicados: `tests/copas-rapidas.test.mjs` e `tests/copas-rapidas.spec.mjs`. Abrangem força/chances, final, empate/pênaltis, reload/duplo clique, grupos e tabela única, duas decisões europeias, entrada na Copa do Brasil, estadual sem misturar estados, vaga antiga de G4, vice da Copa do Brasil na Série B e histórico compacto. A regressão de treinador/loja foi atualizada para completar as escolhas novas, mantendo verificação de liga, salário e save.

Verificação de duração/volume: 30 temporadas completas, 98 campanhas e save de 2.688.466 bytes no cenário de teste. Logs em `/tmp/copas-*.log`; confirmação final de testes e publicação será acrescentada ao concluir. O tamanho em uma carreira real depende também do histórico prévio e dos demais saves do navegador.

Validação local de entrega: 320 testes de lógica, 194 cenários da regressão ampla de navegador e 40 casos finais direcionados, todos aprovados; o cenário adicional de estadual encerrado integra o CI com 195 casos totais. Build aprovado. Checkpoint de implementação: `a2e71ce`.

## Publicação confirmada

Versão `c77f039`, identificada como **Copas e estaduais**. [GitHub Pages](https://github.com/bravolucas/A-Joia/actions/runs/42500495474) e [validação geral](https://github.com/bravolucas/A-Joia/actions/runs/42500495333) concluídos com sucesso: **320 testes de lógica e 195 cenários de navegador**. A implementação e a publicação deste pedido estão concluídas; as limitações de fidelidade integral aos regulamentos permanecem as explicitadas acima.
