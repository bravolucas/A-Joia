# Auditoria — Brasileirão Série A e Série B (regulamento de 2026)

Data da revisão: 18/11/2026. Escopo: quantidade de clubes, tabela, playoffs de acesso e passagem de temporada nos modos do jogo.

## Regulamento aplicado

- Série A: 20 clubes, 38 rodadas, turno e returno. Quatro últimos rebaixados à Série B.
- Série B: 20 clubes, 38 rodadas, turno e returno.
- 1º e 2º colocados da Série B: acesso direto.
- 3º x 6º e 4º x 5º: ida e volta. O 3º e o 4º colocados decidem em casa.
- Sem prorrogação/pênaltis; empate no placar agregado classifica o clube de melhor campanha.
- Dois ganhadores dos playoffs completam quatro clubes promovidos à Série A.
- A classificação final da fase regular continua determinando o campeão da Série B; campeão do playoff não recebe taça da liga.

Referências: CBF (REC Série B 2026 e notícias de fevereiro/março/novembro de 2026).

## Resultados verificados

- Cadastro `src/dados/data.js`: 20 clubes na Série A e 20 na Série B, sem nomes duplicados. A edição 2026 contém Athletic Club, Atlético-GO, Cuiabá e São Bernardo.
- Calendário `calendarioLigaTecnico` e `simularLigaMundo`: 38 rodadas e 380 confrontos por divisão, cada par de clubes duas vezes com mandos alternados.
- `src/simulacao/playoffsSerieB.js`: confrontos e critérios oficiais; acessos por vencedores reais, nunca promoção automática do 3º e 4º.
- `src/treinador/classificacoesMundoTecnico.js`: oito movimentos no conjunto Série A/Série B (quatro acessos, quatro quedas); divisões permanecem com 20 clubes após duas temporadas.
- `src/jogador/rapido.js`, `src/comum/lib.js` e `src/treinador/tecnico.js`: resultado dos playoffs compartilhado pelos fluxos de carreira.
- Revisita/retomada: um playoff já registrado e coerente com a classificação **não é sorteado novamente**.
- O resumo de temporada do Treinador por etapas registra o playoff, acesso, rebaixamento e a divisão do ano seguinte.
- `src/simulacao/mundoVivo.js`: placares dos playoffs incorporados ao histórico persistente da edição.

Foram executadas **10 verificações isoladas de lógica** contra funções extraídas dos arquivos atuais: 10/10 aprovadas. Foram ainda verificadas idempotência do resultado registrado e recomputação diante de tabela modificada.

## Complemento — desempates e critério oficial dos playoffs

- Art. 12 da Série B 2026: pontos; mais vitórias; saldo de gols; gols pró; confronto direto (apenas quando dois times seguem empatados); cartões vermelhos; cartões amarelos; sorteio.
- `src/simulacao/desempateBrasileiro.js`: as tabelas calculadas usam vitórias, saldo, gols pró e, quando existem os dois jogos, confronto direto. Consideram cartões apenas quando seus totais estão disponíveis. Nos saves sem cartões, o recurso técnico estável é ordem alfabética, **não sorteio oficial**. A simulação completa de disciplina e do último critério ainda exige evolução do modelo.
- O Modo Treinador aplica o desempate com as partidas registradas da temporada ao encerrar as rodadas.
- Art. 13: disputa de playoffs por pontos ganhos nos dois jogos; empate por saldo de gols; persistindo a igualdade, melhor posicionamento na fase regular. `src/simulacao/playoffsSerieB.js` registra `pontosPlayoff`, saldo agregado e o critério aplicado.
- Verificações isoladas adicionais: 7/7 casos de classificação aprovados e 120 temporadas simuladas, com 240 confrontos de playoff, sem divergências no critério de classificação.
- A versão pública do GitHub Pages e o resultado de todos os jobs do CI continuam sem confirmação por esta auditoria.

## Testes permanentes no projeto

- `tests/playoffs-serie-b-2026.test.mjs`
- `tests/brasileirao-calendario-progressao-2026.test.mjs`
- `tests/desempate-brasileiro-2026.test.mjs`
- `tests/classificacoes-mundo-tecnico.test.mjs`
- `tests/mundo-completo.test.mjs`

A suíte completa do projeto e o navegador são executados pela workflow `Validar A JOIA` em push para `main`. **Ainda não há confirmação nesta auditoria de que a última execução passou**, nem confirmação de que o GitHub Pages recebeu o último SHA. Não confundir verificações isoladas com aprovação integral do CI.

## Pendências fora do escopo desta correção

1. A Série C ainda não foi integrada como divisão completa na pirâmide brasileira. Portanto, os quatro últimos da Série B **não são movimentados para uma Série C jogável** no modelo atual. Não atribuir conformidade integral à pirâmide do Brasil enquanto isso faltar.
2. Compatibilidade de todas as carreiras antigas que continham Guarani, Amazonas FC, Paysandu ou Confiança na Série B ainda precisa de testes end-to-end. Os nomes continuam referenciáveis no catálogo regional, mas isso não garante restauração exata dos calendários legados.
3. Aprovação integral do GitHub Actions e publicação do Pages dependem de verificação dos jobs associados à revisão final.

## Como concluir o aceite

1. Conferir `Actions > Validar A JOIA` na branch `main`, na revisão mais recente, exigindo todos os jobs verdes.
2. Conferir `Publicar no GitHub Pages` vinculado ao mesmo SHA e validar manualmente o site publicado.
3. Criar carreiras na Série A e Série B, avançar ao menos duas temporadas e verificar posição, subida/queda, chaves e histórico ao recarregar.
4. Fazer teste de regressão com save legado que possua um dos quatro clubes substituídos.

