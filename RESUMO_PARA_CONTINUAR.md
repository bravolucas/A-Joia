# A Joia — resumo para continuar em outro chat

Atualizado em **13/11/2026**, horário de Brasília. Este arquivo preserva decisões e contexto da conversa; não é uma transcrição literal. Leia também o estado do Git antes de trabalhar, pois alterações posteriores podem ter ocorrido.

## Identificação do projeto

- Jogo: **A Joia**, simulador de carreira de futebol **soccer**, com carreira de jogador e treinador.
- Repositório: https://github.com/bravolucas/A-Joia
- Site: https://bravolucas.github.io/A-Joia/
- Diretório usado nesta sessão: `/workspace/work/A-Joia`.
- Branch de trabalho/publicação: `main`.
- Frontend: React + Vite. Publicação no GitHub Pages por GitHub Actions.
- A carreira fica no navegador; compatibilidade dos saves e preservação do histórico são essenciais.

## Como colaborar com o usuário

O usuário quer que as alterações solicitadas sejam executadas e concluídas, incluindo testes e publicação quando aplicável. Evitar pedir confirmações desnecessárias. Não afirmar que algo foi publicado apenas porque foi editado ou enviado ao GitHub: conferir o workflow de publicação e o site.

Quando o usuário envia mais uma solicitação durante o trabalho, incorporá-la sem abandonar os pedidos anteriores. Distinguir pedidos antigos, código implementado, testes aprovados e publicação confirmada.

## Direção do jogo e decisões anteriores

### Visual e identidade

- Futebol de campo, nunca futebol americano.
- Cor principal em **azul claro de diamante**, em vez de verde.
- Transições, revelações e efeitos modernos com Motion e recursos inspirados nas referências React Bits/Motion.
- Respeitar movimento reduzido e não interromper a animação essencial dos minijogos.
- Referência compartilhada anteriormente: https://devdesignlibrary.com/libraries
- O usuário prefere modernização por etapas, preservando a jogabilidade.

### Simulação, clubes e seleções

- Nas copas, adversários fortes devem ter maior chance de avançar; finais contra zebras podem acontecer ocasionalmente.
- Foram acrescentados clubes sul-americanos e europeus para competições internacionais, sem torná-los necessariamente jogáveis.
- Os títulos de um clube só entram na galeria quando realmente conquistados. Exemplo do bug corrigido anteriormente: 5º/6º lugar da Ponte Preta não pode virar título da Série B.
- Estatísticas e feitos históricos devem usar dados registrados no save. Não inventar placares, conquistas ou anos ausentes.
- O treinador pode continuar até 85 anos e pode se aposentar voluntariamente ou pedir demissão do trabalho.
- As propostas de seleção representam vínculo exclusivo: assumir uma seleção encerra o vínculo com o clube.

### Museu

- Há um museu pessoal de cada carreira, apresentado ao encerrá-la, além da coleção permanente.
- O museu foi separado em abas superiores **Jogador** e **Treinador**.
- Cada aba tem suas próprias peças, títulos, números, percurso, favoritos, frase e ambiente.
- Jogador: camisas, seleção, prêmios, parceiros e lembranças de campo.
- Treinador: campanhas no banco, títulos, comissão técnica e saídas voluntárias.
- No encerramento do treinador, abrir diretamente a aba Treinador.
- Não confundir o técnico contratado do modo completo, cujo campo `temporadas` pode ser numérico, com a carreira do usuário como treinador, que tem `temporadas` em array.
- Camisas são o foco da sala correspondente, com pequenas taças na prateleira abaixo.
- O salão de entrada destaca a camisa/campanha marcante, principal conquista e marcas da carreira.
- A Bola de Ouro deve mostrar o top 3 registrado; segundo/terceiro lugares têm apresentação própria.
- As vitrines tiveram ajuste de escala para as taças permanecerem dentro do vidro, inclusive no celular.
- Pedidos visuais anteriores incluíram variações de companheiros e técnicos, modelos de camisas de seleção, taça intercontinental, suporte da Bola de Ouro e correção do goleiro quadruplicado nas faltas. Ao mexer nessas áreas, conferir o código e as referências existentes, sem presumir que todo pedido antigo precisa ser refeito.

## Últimas publicações confirmadas antes deste lote

| Commit | Alteração |
| --- | --- |
| `2ec9971` | Ajuste das taças ao interior das vitrines. |
| `e062bf0` | Museus independentes de jogador e treinador nas abas superiores. |
| `ee71459` | Fortaleza: força-base de 76 para 64, com migração dos saves antigos. |
| `8e7acef` | Preservação do foco ao navegar rapidamente nas salas do museu. |

O workflow de publicação e a validação de `8e7acef` terminaram com sucesso. Assim, museus separados e Fortaleza corrigido já estavam publicados antes das alterações descritas abaixo.

Outros trabalhos anteriores incluem identidade azul, correção do popup da Bola de Ouro no celular, 106 clubes internacionais adicionais e 278 novos escudos. Há documentação e testes no repositório; evitar baixar ou refazer todo esse acervo sem necessidade.

### Fortaleza: explicação importante

O valor **76 estava fixo no cadastro**, mesmo com o clube na Série B. Foi ajustado para **64**. A migração é aplicada uma vez e mantém os ganhos/perdas da simulação: um Fortaleza antigo em 80 passa para 68, preservando os quatro pontos de evolução. Histórico, títulos e investimentos não são apagados. Carreiras novas recebem marcador para não descontar a força novamente.

Arquivos: `src/dados/equilibrioClubes.js`, `src/dados/data.js`, carregamento em `src/jogador/rapido.js` e `src/completo/save.js`.

## Pedidos atuais que estavam em execução

1. Tornar a demissão mais rigorosa e coerente com o tamanho do clube e as metas da temporada.
2. Real Madrid em 3º sem Champions deve correr risco alto de demissão; ganhar a Champions deve garantir a permanência nesse cenário.
3. Clubes grandes fora do top 4 devem poder demitir mesmo com confiança acumulada alta.
4. Propostas de seleção devem aparecer ocasionalmente, não praticamente todo ano.
5. Copa do Mundo do treinador deve ser jogável, partida a partida, como as outras copas.
6. Adicionar consulta aos campeões das competições, semelhante à galeria de títulos dos clubes.
7. Criar este Markdown para transportar o raciocínio a outro chat.

## Implementação deste lote

### Cobrança da diretoria

Arquivo central: `src/treinador/exigenciasTecnico.js`.

- Mapeamento de **351 clubes jogáveis** em `docs/exigencias-treinador/clubes.csv`.
- Metas consideram força-base, força relativa dos rivais e divisão atual. Reforços temporários e reputação do treinador não reduzem a cobrança.
- A estreia de um treinador deixou de aliviar automaticamente a meta de um clube grande.
- Gigantes: risco esportivo de 90% em 3º/4º sem Champions; 98% abaixo do top 4; vice sem taças tem risco menor, de 30%.
- Grandes: fora do top 4, risco esportivo de 80%, ou 95% abaixo do 6º.
- São riscos-base, com agravantes e atenuantes; não significam demissão automática em todos os casos.
- Promessas descumpridas aumentam o risco. Libertadores reduz bastante a pressão; uma copa nacional reduz menos.
- A Champions garante permanência, exceto em caso de rebaixamento.
- Projetos de acesso, estabilidade e permanência têm cobrança proporcional à sua situação, sem exigir o mesmo que um Real Madrid.
- Sorteio da avaliação é determinístico: recarregar o save não permite sortear outra decisão da diretoria.
- A avaliação final espera todas as copas/finais terminarem. Guarda uma base da confiança para não aplicar penalidades repetidas ao retomar.
- O contrato de um ano mantém os registros de renovação/encerramento. Houve uma regressão nesse metadado durante o desenvolvimento; foi corrigida e os testes correspondentes passaram.
- Os cartões de proposta mostram a meta; preparação, histórico e demissão explicam a cobrança/decisão.

Guia: `docs/exigencias-treinador/README.md`.

### Propostas ocasionais de seleção

Arquivo: `src/treinador/selecoesTecnico.js`.

- Janela anual determinística de 16%, ou 24% para reputação 80+.
- No máximo **uma proposta de seleção** por geração de mercado.
- Mantidas as exigências de experiência, reputação e nível para ser elegível.
- A chance anual não é sorteada novamente a cada consulta.
- As taxas se referem às novas gerações de propostas; não há intenção de apagar retroativamente uma proposta válida já recebida.

### Copa do Mundo jogável no treinador

Arquivos: `src/treinador/selecoesTecnico.js`, `copasCarreiraTecnico.js`, `copasEscolha.js` e `src/competicoes/calendarioCopas.js`.

- O calendário interativo abre a Copa desde a primeira partida.
- Mantido o formato de **32 seleções** já usado pela simulação: três partidas no grupo e mata-mata desde as oitavas.
- Escolhas de plano de jogo, resultados e pênaltis usam o motor das copas jogáveis.
- A campanha e o resultado apresentado ficam salvos; fechar/reabrir não repete a partida.
- É necessário ter vaga na Copa. Uma seleção não classificada não recebe participação fictícia.
- Continentais de seleção também usam decisões por partida; seus formatos continuam reduzidos. Eliminatórias permanecem resumidas.
- Jogos, vitórias, empates, derrotas e títulos são creditados à seleção, sem duplicar e sem atribuir a taça ao antigo clube.
- Confiança e objetivo da seleção aguardam a conclusão das copas, em vez de avaliar a campanha antes de jogá-la.
- Copas de seleção não geram um Mundial de Clubes como prêmio.
- Saves de competições já concluídas não são reescritos para permitir jogar novamente partidas do passado.

### Campeões das competições

Arquivos novos: `src/historia/competicoesHistoricas.js`, `tests/competicoes-historicas.test.mjs`.

Interface: `src/historia/HistoriaFutebol.jsx` e `HistoriaFutebol.css`.

Acesso:

1. Abrir a história/galeria do clube e escolher **Competições**; ou
2. Tocar no nome de uma competição na vitrine de títulos. A ficha do modo completo também oferece esse acesso.

O painel apresenta:

- Campeões por ano da simulação.
- Último campeão registrado.
- Ranking dos maiores campeões do acervo.
- Escudos de clubes e bandeiras de seleções.
- Indicação de conquistas com o usuário.
- Retorno à galeria do clube vencedor.

Princípios importantes:

- Consulta apenas dados registrados; não sorteia vencedores ao abrir o painel.
- Concilia aliases como UEFA Champions League/Champions League e Copa Libertadores/Libertadores.
- Não duplica uma mesma edição encontrada em fontes diferentes do save.
- Copas e finais pendentes não antecipam o campeão.
- Usa o acervo histórico inicial existente nos totais, sem atribuir anos desconhecidos a essas conquistas.
- Equipes sem base histórica cadastrada aparecem com suas conquistas registradas na simulação.
- Os dados de jogador, treinador e temporadas externas do modo completo são considerados.
- Técnico contratado com `temporadas` numérico não é tratado como lista de campanhas.

Guia: `docs/historico-competicoes/README.md`.

## Validação feita durante o desenvolvimento

- Build de produção concluído com `GITHUB_PAGES=true npm run build`.
- 31 cenários de navegador sobre treinador, seleções, mercado, decisões e retomada passaram.
- 12 cenários de navegador sobre histórico, seleções e Copa jogável passaram.
- Após o último ajuste da interface, 7 cenários de histórico e Copa jogável passaram novamente.
- 81 testes de dados/regressão do treinador passaram após corrigir o metadado do contrato anual.
- 36 testes direcionados finais de diretoria, copas, histórico e momentos do treinador passaram.
- O primeiro teste global teve 466 aprovados e uma falha no metadado do contrato de um ano. Não apresentar essa rodada como totalmente aprovada: a falha foi corrigida e validada nos testes direcionados; a validação global do GitHub deve ser conferida abaixo.
- Conferência visual no celular: Copa do Mundo com decisões e consulta aos campeões.

## Estado da entrega

**Concluído, publicado e validado em 13/11/2026.**

- Revisão funcional: [`637a84598d353c114c721e5cfb20ce98bbcf2aff`](https://github.com/bravolucas/A-Joia/commit/637a84598d353c114c721e5cfb20ce98bbcf2aff).
- Validação global: **472 testes de dados aprovados, zero falhas; 344 testes de navegador aprovados**.
- Workflow de validação: https://github.com/bravolucas/A-Joia/actions/runs/43497686659 — sucesso.
- Workflow de publicação: https://github.com/bravolucas/A-Joia/actions/runs/43497686657 — sucesso.
- A implantação `github-pages` aponta para a revisão funcional acima.
- Conferência no JavaScript servido pelo site: cobrança da diretoria, Copa jogável e histórico de campeões presentes.
- O ajuste do contrato anual também passou na validação global final. A falha intermediária mencionada anteriormente está resolvida.
- Nenhuma pendência conhecida dos pedidos deste lote: cobrança/demissão, ofertas ocasionais de seleção, Copa do Mundo jogável, histórico de campeões e este resumo.

O commit posterior que finaliza este documento é somente de documentação (`[skip ci]`); não modifica o jogo publicado. Os próximos pedidos podem partir desta revisão.

## Como continuar tecnicamente

1. Ler este arquivo e executar `git status --short` e `git log -5 --oneline`.
2. Conferir a seção de entrega e os workflows da revisão atual.
3. Preservar saves, resultados já disputados, histórico e distinção entre jogador/treinador.
4. Não gerar anos, finais ou títulos para preencher lacunas históricas sem dados.
5. Acrescentar novos pedidos sem desfazer as decisões deste documento.

Comandos usados:

```bash
cd /workspace/work/A-Joia
npm test
GITHUB_PAGES=true npm run build
GITHUB_PAGES=true npm run preview -- --host 127.0.0.1 --port 4173
PLAYWRIGHT_BROWSERS_PATH=/workspace/work/pw-browsers npx playwright test tests/historia-futebol.spec.mjs tests/copa-mundo-tecnico-jogavel.spec.mjs --reporter=line --workers=2 --output=/tmp/ajoia-validacao
```

Observação de reprodução: `package-lock.json` está ignorado no repositório, e os workflows resolvem dependências por intervalos de versão. Foram observados hashes diferentes entre o build local e o CI por uma diferença na biblioteca de animação. A revisão implantada e os testes completos do CI foram conferidos; uma diferença de hash, isoladamente, não prova divergência no código do jogo.

O caminho dos navegadores é específico desta máquina; conferir antes de reutilizar em outro ambiente. No GitHub Actions há workflows **Validar A JOIA** e **Publicar no GitHub Pages**. O site usa a base `/A-Joia/`.

## Texto sugerido para iniciar o próximo chat

> Estamos desenvolvendo A Joia. Leia o arquivo RESUMO_PARA_CONTINUAR.md do repositório bravolucas/A-Joia, confira o estado atual do Git e dos workflows, e continue preservando as decisões e os saves descritos nele. Meus próximos pedidos são: …
