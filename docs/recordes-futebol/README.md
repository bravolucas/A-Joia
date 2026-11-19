# Livro de recordes — A JOIA

## Entregue nesta primeira etapa (2026-11-19)

- \`src/dados/recordesFutebolReais.js\`: referências oficiais e datadas para clubes, seleções e competições (lote inicial, **não** catálogo completo).
- \`src/historia/recordesFutebol.js\`: calcula recordistas exclusivamente a partir dos resultados e temporadas arquivados no save, sem sortear números novos e sem editar o estado. Lê \`universo\` ou \`tecnico.universo\` e recebe \`temporadas\` externas do Modo Carreira completo.
- \`src/historia/RecordesFutebol.jsx\`: interface com recorde do futebol real e recorde da simulação, atleta, ano, partida quando aplicável e link para fonte.
- Integração com o Arquivo Vivo nos perfis de clube, seleção e competição, e na aba **Recordes**, com filtro por entidade.
- Dados existentes: jogos, gols, assistências, defesas e jogos sem sofrer gols (carreira e temporada); maior vitória/derrota de clubes e seleções, mais gols/diferença de gols em jogo da competição; melhor atuação individual por partida em gols/assistências/defesas onde houve súmula individual arquivada.
- Copa do Mundo (masculina): referências de gols e aparições atualizadas após 2026, separando fontes oficiais FIFA da base Fjelstul cujo CSV original termina em 2022.

## Regras de integridade

1. Os totais de clubes não incluem o período do jogador em outro clube depois de transferido.
2. Estatísticas por competição são lidas do próprio campo \`porCompeticao\`; totais da temporada inteira não são considerados totais de uma competição.
3. Não preencher temporadas antigas sem dados com valores supostos. No Modo Rápido há distribuição simulada de estatísticas por competição e de partidas e esse limite deve continuar identificado quando apresentado.
4. Os recordes reais são fixos, com fonte e data; a carreira pode **igualar/superar no save**, nunca reescrever o histórico real.
5. IDs identificam os atletas da simulação para evitar homônimos.
6. O cálculo é idempotente (consultar duas vezes não grava ou duplica conquistas).
7. Comparações devem respeitar o escopo: clube, seleção, competição, edição ou carreira inteira.
8. Temporadas de competições com mudanças de formato precisam de datas e recorte comparáveis antes de incluir recordes reais.

## Pendências para atingir a profundidade do Football Manager

- Ampliar o acervo histórico real com fonte e recorte para **cada** clube, seleção e competição, incluindo: gols/jogos, estreias e extremos de idade, séries invictas, vitórias/derrotas, transferências, artilheiros por edição, pontos da liga (somente quando pontos e formato forem realmente calculados).
- Persistir eventos de quebra de recorde com marca anterior, vencedor, equipe, competição, ano, rodada e notificação de imprensa; hoje a tabela reflete automaticamente os resultados já arquivados, em geral após a temporada, e não dispara uma notícia em tempo real para cada lance.
- Calcular estatísticas por jogo dos outros atletas quando existirem fichas de partidas reais completas; não atribuir a terceiros marcas derivadas apenas de uma distribuição estatística sem indicar sua origem.
- Consolidar recordes de seleções além da carreira do próprio usuário quando todos os jogos das outras seleções forem arquivados.
- Implementar mais métricas de goleiros, defensores, treinadores, prêmios, valor e transações, somente quando houver dados suficientemente fiéis.
- Executar a suíte completa \`npm test\`, compilação \`npm run build\` e testes Playwright em ambiente de CI. Os novos testes de lógica foram executados de forma isolada; isso não garante aprovação de toda a aplicação.

## Como adicionar referências históricas reais

Cada entrada de \`REFERENCIAS_RECORDES_FUTEBOL\` contém:
\`{ tipo, nome, id, valor, atleta, ano?, fonte, data }\`.

Use apenas IDs já definidos em \`METRICAS_RECORDES\`, e registre fonte confiável com período específico. Quando o dado não for demonstrável, **não invente** o valor.


## Continuação: recordes e noticias de temporada (19/11/2026)

- Novo motor em \`src/historia/noticiasRecordes.js\`: compara o universo antes e depois da temporada, registra apenas recordes efetivamente quebrados/igualados e preserva marca antiga, titular, entidade, ano e fonte real quando aplicável.
- Integrado aos fechamentos do **Modo Rápido**, **Modo Treinador** e **Modo Carreira completo**. O Modo Rápido acrescenta manchetes ao seu feed, o Modo Treinador apresenta os feitos no resumo anual e o Modo Completo registra as manchetes na caixa de notícias.
- \`recordesEventos\` na raiz do save mantém os últimos 80 eventos, deduplicados por identificador. Cada temporada também mantém as próprias ocorrências. A lista histórica é apresentada nas páginas de recordes.
- Em \`recordesFutebol.js\`, os acumulados passam a referenciar o **ano mais recente** da marca, não o primeiro ano do atleta. Foram incluídas marcas de gols e vitórias por edição, gols de uma equipe em uma partida, sequência invicta e vitórias consecutivas.
- Sequências exigem **rodadas inteiras e consecutivas** registradas no arquivo de partidas. Em caso de lacuna, o contador recomeça; não se presume resultado ausente. As estatísticas de edição identificam explicitamente a cobertura restrita aos jogos arquivados.
- A avaliação de notícias é limitada a oito escopos relevantes para evitar varreduras desnecessárias ao fechar a temporada. Os recordes de outras equipes continuam acessíveis por consulta.
- Testes isolados de motor/estatísticas adicionados em \`tests/noticias-recordes.test.mjs\` e \`tests/recordes-futebol.test.mjs\`. Não equivalem à compilação integral nem aos testes de navegador.

### Permanecem pendentes
- Importar referências históricas abrangentes de todas as entidades com fonte independente e data de corte.
- Notícias no instante do lance (a primeira entrega notifica no fechamento anual).
- Ampliar a base com recordes de idade, contratos, transferências, treinadores, pontuações de ligas e sequências interanuais, apenas quando os jogos armazenarem a informação necessária.
- Validação integral em CI e publicação GitHub Pages.
