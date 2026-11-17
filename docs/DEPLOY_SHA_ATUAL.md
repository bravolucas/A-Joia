# Publicação segura do GitHub Pages — validação de SHA

## Problema
O site era publicado ao concluir com sucesso `Validar A JOIA` na `main`. O build usava corretamente o SHA aprovado, mas não confirmava se este ainda era o commit atual da branch. Quando duas validações terminam fora de ordem, o workflow mais antigo poderia publicar uma versão anterior.

O workflow antigo também aceitava `workflow_dispatch` diretamente, validando a lógica com `npm test` mas sem passar pelo mesmo conjunto obrigatório de testes de navegador.

## Alteração
- O deploy é acionado **exclusivamente** pelo resultado `success` do workflow `Validar A JOIA` na `main` (execução `push` ou `workflow_dispatch` do CI).
- Antes do build, o commit aprovado em `workflow_run.head_sha` é comparado com o commit atual da `main`. Se forem diferentes, os jobs de build/publicação são ignorados.
- Antes de `actions/deploy-pages`, uma nova checagem do SHA impede que um commit que ficou antigo durante a construção seja publicado.
- O artefato é construído exatamente do commit aprovado, nunca de `HEAD` flutuante.
- O retry de publicação continua disponível caso a implantação do commit aprovado falhe.
- Nenhuma modificação em saves, motor de jogo, assets ou testes.

## Como forçar publicação novamente
1. Abra **Actions → Validar A JOIA**.
2. Use **Run workflow** selecionando a branch `main`.
3. Aguarde **todos** os jobs de lógica, carreiras massivas (após PR #94) e navegador terminarem com sucesso.
4. `Publicar no GitHub Pages` executará automaticamente para o commit da `main` que ainda estiver atual.

## Critérios de aceite
1. Workflow de CI completo com falha: publicação não é iniciada.
2. CI aprovado na revisão mais recente da `main`: build e implantação.
3. CI aprovado para SHA antigo depois de novo merge: build/publicação ignorados.
4. `main` avança enquanto o build está em andamento: implantação ignorada na segunda checagem.
5. PR aprovado não provoca deploy: somente execução do CI na branch `main`.
6. Não oferecer botão de deploy manual que contorne a bateria de testes de navegador.

## Limite de segurança
A nova verificação de SHA é uma defesa contra versões obsoletas, não uma operação atômica: ainda pode haver uma janela entre a última verificação e o servidor do GitHub Pages finalizar a publicação. A proteção de branch e checks obrigatórios da issue #80 são uma configuração separada do repositório, ainda pendente.
