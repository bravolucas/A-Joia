# Integração da Série C no A JOIA — 2026 a 2028+

## Referências oficiais
- CBF, `REC Brasileiro Série C 2026`, notícias de 23/02/2026 e 24/10/2026.
- Participantes 2026: 20 clubes; 2027: 24; 2028 em diante: 28.
- 2026/2027: uma fase de turno único de 19/23 rodadas; oito avançam a dois quadrangulares de ida e volta (grupos B = 1/4/5/8 e C = 2/3/6/7); os dois primeiros de cada grupo sobem.
- Dois líderes dos quadrangulares disputam a final em dois jogos; mando da volta pela campanha somada; empate agregado decidido nos pênaltis.
- Dois descensos C→D em 2026/2027 e seis a partir de 2028.
- 2028 em diante: dois grupos de 14 e fase inicial de ida e volta. O desenho detalhado dos grupos e os critérios da próxima edição poderão exigir atualização quando houver REC específico.

## Entregue no código
- `src/dados/data.js`: vinte participantes da Série C 2026 e banco de 23 clubes da Série D para simulação da expansão; sem duplicações de nomes no catálogo.
- `src/simulacao/serieC.js`: modelo de primeira fase, tabelas, sorteio de placares, quadrangulares B/C, final e retorno de `promovidos`, `rebaixados`, `campeao`, jogos completos.
- `src/treinador/classificacoesMundoTecnico.js`: simula a Série C separadamente da fórmula genérica de 38 partidas e utiliza a progressão B↔C↔D.
- `src/simulacao/progressaoBrasilInferior.js`: concilia as três divisões; em 2026 respeita os seis promovidos reais da Série D; nos anos seguintes usa candidatos da reserva com sorteio ponderado por força.
- `src/jogador/rapido.js`: inclui a classificação da Série C no universo e aplica os acessos e rebaixamentos em sua passagem de temporada.
- `src/comum/lib.js` e `src/completo/mundoTemporada.js`: suporte à Série C no Modo Completo e progressão de divisões.
- `src/simulacao/mundoVivo.js`: conserva placares de fase regular, quadrangulares e final no histórico da competição.
- `src/treinador/compatibilidadeDivisoes.js` e `src/treinador/tecnico.js`: corrige caso de save anterior com Guarani, Amazonas FC, Paysandu ou Confiança na Série B; mantém 20 na divisão antiga sem duplicar clube.
- `src/treinador/tecnico.js`: calendário presencial da Série C agora respeita as três configurações anuais de temporada.

## Cenários verificados com execução isolada das funções
- Anos 2026, 2027, 2028, 2029, 2030: A=20, B=20, C=24/28/28/28/28 ao final do ano, após C=20 no início de 2026.
- Banco da Série D varia conforme movimentos, sem duplicações de nomes.
- Quatro acessos da C e quatro descensos da B por ano; expansão anual por seis acessos da Série D.
- 190, 276 e 364 partidas na fase regular nas regras 2026, 2027 e 2028+.
- Idempotência da simulação em uma mesma semente.
- Quatro saves legados (Guarani, Amazonas FC, Paysandu e Confiança) renderam 38 rodadas da Série B e contagem A=20/B=20/C=20 na reconciliação.

## Testes automatizados adicionados
- `tests/serie-c-2026-2028.test.mjs`: clubes, formatos, quadrangulares, finais, evolução 2026-2029.
- `tests/compatibilidade-serie-b-legada.test.mjs`: verificação de save anterior após cadastro novo da Série C.

## Pendências e limitações
1. **Treinador comandando pessoalmente um clube da Série C**: o calendário da fase regular já segue 19 rodadas em 2026, 23 em 2027 e 26 em grupos de 14 a partir de 2028. **Ainda falta integrar os quadrangulares e a final jogáveis ao desempenho real do treinador**, em vez de utilizar exclusivamente a edição simulada do universo para decidir o acesso.
2. **Modo Completo e Rápido na Série C**: testes end-to-end com um clube rebaixado da Série B ainda são necessários para validar interfaces, progressão, salvamento e retorno após recarregar.
3. **Série D**: banco de candidatos, ainda não simulação de regulamento próprio de competição; acessos da D pós-2026 são fictícios, ponderados por força.
4. **2028+**: distribuição de participantes nos grupos e quadrangulares adaptada até publicação de regulamento específico.
5. **CI e deploy**: a aprovação da suíte integral do GitHub Actions e a chegada da última revisão ao Pages ainda não foram confirmadas. As verificações isoladas não substituem os jobs de Node, build e Playwright.

