# Fase 4 — Primeira entrega: reputação em oito dimensões

## O que foi implementado
O painel **O momento do clube** pode mostrar oito indicadores calculados e persistidos em `universo.clubes[nome].reputacoes`: nacional, continental, mundial, histórica, financeira, formadora, institucional e atratividade.

A evolução utiliza somente acontecimentos registrados no save:
- classificação na liga, acessos/rebaixamentos e títulos cujo `tipo` está registrado (sem adivinhar títulos pelo nome);
- saúde financeira e estrutura **já existentes** no modelo anterior;
- jogadores explicitamente marcados `daBase` e com pelo menos uma temporada de carreira, pelo clube formador indicado em `clubeOrigem`.

Cada eixo tem inércia anual, valores entre 0 e 99 e histórico compacto por temporada em `historico[].reputacoesEixos` (oito números, na ordem de `EIXOS_REPUTACAO_CLUBE`). Se o save já tiver índices válidos, são preservados; quando ausentes, os índices são inicializados a partir dos atributos existentes, sem inventar conquistas históricas. Os anos anteriores à migração **não recebem retroativamente** as oito medidas. Reexecutar o mesmo ano não duplica registros.

## Limites explícitos
Esta é a **fundação descritiva e visual**, e não o sistema econômico completo do Prompt Mestre. Os oito índices ainda **não alteram** propostas, contratações, o peso da diretoria, força de jogadores, orçamento ou o motor de partidas. Esses efeitos exigirão regras específicas, modelagem de receitas e despesas e testes pareados de balanceamento; é importante não afirmar que a gestão financeira do Football Manager já existe.

O campo numérico legado `reputacao`, `financas` e `estrutura` mantém exatamente seu uso atual. Saves sem `reputacoes` continuam abrindo; o painel só mostra o detalhamento quando houver uma temporada nova registrada.

## Aceitação e validação
- `node --test tests/reputacoes-clube.test.mjs tests/mundo-vivo.test.mjs`: oito eixos, saves legados, deterministicidade, bônus por títulos reais, acesso e rebaixamento, persistência JSON, idempotência e simulação sintética de 50 temporadas.
- `npm test` e testes de navegador/build da CI obrigatória devem passar no **HEAD exato** deste PR.
- Depois do merge: validar publicação do SHA exato no GitHub Pages.
- Próxima fase: economia verificável, receitas/despesas e integração dos índices ao mercado sob testes estatísticos.

## Política de armazenamento
Oito índices atuais por clube e oito números por temporada, sem replicar strings de nome de eixo em cada histórico. Isso reduz a expansão do save frente a objetos repetidos e mantém consulta legível pelo mapeamento público dos eixos.
