# CI — divisão das 24 carreiras do teste `jogador-melhorias`

O arquivo `tests/jogador-melhorias.test.mjs` executava, numa única job, 24 carreiras automáticas completas, além de quatro regressões rápidas. Esse gargalo atrasava a execução inteira e, por consequência, a publicação via GitHub Pages.

## Como a cobertura é preservada
- A matriz `carreiras-massivas` tem quatro runners `jogador-melhorias-1-de-4` a `4-de-4`, cada um executando **6** das 24 carreiras (distribuição determinística por módulo de índice).
- A combinação dos quatro artefatos `jogador-melhorias-parte-*.json` é obrigatória; `scripts/agregar-jogador-melhorias.mjs` verifica partes 1–4, índices 0–23, códigos `MELHORIAS0..23` e ausência de duplicação.
- A job **`conferir-melhorias-24`** só termina verde se a mediana dos **24** picos OVR for no máximo 90 e houver ao menos uma temporada com clássico e ao menos uma com fidelidade. São as **mesmas asserções** do teste original, não limiares alterados.
- Os quatro testes leves do arquivo seguem presentes nos quatro runners, e os demais cenários de integração e treinador permanecem obrigatórios.
- Se uma partição falhar, faltar seu artefato, enviar índice incorreto ou produzir medianas globais fora do limite, o CI fica vermelho.
- Executar localmente `node --test tests/jogador-melhorias.test.mjs` sem variáveis de ambiente continua avaliando as 24 carreiras e todas as asserções globais originais.

## Critérios antes de integrar
1. Testes unitários do agregador (`tests/agregacao-jogador-melhorias.test.mjs`) aprovados.
2. Quatro jobs de 6 carreiras aprovados e gerando exatamente quatro artefatos JSON.
3. Agregador final passando sobre os **24 resultados reais** e registrando mediana, clássicos e fidelidade.
4. Demais jobs de validação do navegador, integração, treinador e build aprovados.
5. Não publicar SHA sem CI completo e confirmação de Pages.

## Limites
A mudança não altera nenhum mecanismo de futebol, save, IA ou dificuldade. É uma otimização de paralelismo do CI da issue #79; não promete um fator fixo de ganho de desempenho, já que a execução depende da disponibilidade dos runners no GitHub.
