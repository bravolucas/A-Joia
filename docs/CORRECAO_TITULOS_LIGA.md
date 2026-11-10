# Galeria: apenas campeonatos conquistados — 10/11/2026

O modo rápido salvava `campeaoLiga` como o nome do vencedor da competição. A galeria e uma leitura do museu tratavam esse campo como booleano: qualquer nome preenchido podia creditar a taça ao clube do jogador, mesmo terminando em 6º ou 5º. Os títulos pessoais em `lista` já usavam o resultado efetivo; não precisam ser zerados ou reconstruídos.

As novas temporadas guardam `campeaoLiga` como booleano e `vencedorLiga` com o nome do campeão. Os desafios da tabela mantêm ambos atualizados. A galeria reconhece os dois formatos antigos/atuais e atribui a edição ao vencedor correto. O museu do completo usa a mesma interpretação, incluindo aliases de clubes e campanhas interrompidas.

Ao carregar o modo rápido, os registros antigos com nome no campo ambíguo são normalizados. O histórico de títulos é reconciliado com as temporadas, substituindo o clube incorretamente creditado pelo campeão já registrado. Falsos feitos de primeira conquista da mesma liga são removidos quando o registro comprova que o clube não venceu. Classificações, estatísticas, outras competições, títulos pessoais legítimos e progresso permanecem. O salvamento normal persiste o ajuste; não é necessário começar outra carreira.

A reprodução cobre Ponte Preta em 6º e 5º com duas taças falsas no histórico: nenhuma Série B é atribuída à Ponte, e os campeões originais são preservados. Um título efetivo posterior entra apenas uma vez, inclusive após recarregar. Há verificações de vice/acesso, booleanos do completo, geração de novas temporadas, atualização da tabela, imutabilidade, aliases e preservação de outras conquistas.

Publicado em `e908ce0`. [CI 42732487721](https://github.com/bravolucas/A-Joia/actions/runs/42732487721) aprovado: 427 testes de lógica e 294 cenários de navegador. [Pages 42732487412](https://github.com/bravolucas/A-Joia/actions/runs/42732487412) aprovado. Versão pública e módulos conferidos por HTTPS.
