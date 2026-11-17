# Issue #89 — Encerramento da carreira de treinador após 30 anos

## Objetivo

O plano original do A JOIA prevê **até 30 anos de carreira como treinador**, além da carreira de jogador. Uma atualização posterior permitiu treinar até os 85 anos, sem limite de temporadas. Esta mudança retorna à duração de 30 anos, mantendo os 85 anos como teto etário secundário para casos de início tardio.

## Regra

A carreira encerra pelo primeiro limite atingido:

- **30 anos corridos de carreira como treinador**, incluindo anos sem clube, contados pela diferença `tecnico.ano - tecnico.anoInicio`; ou
- **85 anos de idade**, caso o treinador tenha iniciado a carreira tarde; ou
- aposentadoria voluntária.

Nos saves mais antigos que não guardam o ano de início, a contagem usa o histórico de `tecnico.temporadas` e, quando disponível, a diferença entre `idade` e `idadeInicio`. A contagem nunca remove nem modifica registros antigos. Saves já acima do limite preservam todas as conquistas e podem consultar a vitrine, mas não permitem iniciar uma nova temporada.

**Exceção:** copas ou finais já iniciadas podem ser concluídas antes do bloqueio de progressão — a regra antiga de preservar pendências aos 85 anos é mantida também aos 30 anos. Aposentadoria voluntária continua encerando imediatamente e arquivando o estado das partidas pendentes sem simulá-las.

## Código

- `src/treinador/longevidadeTecnico.js` exporta `LIMITE_TEMPORADAS_TECNICO=30` e `anosCarreiraTecnico`; a verificação `carreiraTecnicoEncerrada` usa ambos limites.
- `src/treinador/tecnico.js` reaproveita a verificação única inclusive na simulação rápida, no avanço entre temporadas, no desemprego e em jogos normais.
- `src/treinador/CarreiraTecnico.jsx` apresenta os dois limites no painel e na tela de encerramento.
- Regressões atualizadas em `tests/treinador-30-anos.test.mjs`, `tecnico-express.test.mjs`, `treinador-aposentadoria.test.mjs`, `treinador-tacas-auditoria.test.mjs`; cobertura adicional de casos fronteira em `tests/limite-carreira-treinador.test.mjs`.

## Ordem segura de integração

PR independente e **draft**. Não mesclar antes de:
1. Confirmar CI e deploy do #83 na `main`.
2. Concluir os três lotes de jogadores reais (#85, #86 e #87).
3. Concluir a correção de início direto do treinador (#90), pois ambos alteram `CarreiraTecnico.jsx`. Atualizar/reconciliar a branch com a `main` sem desfazer o botão de preparação opcional.
4. Revalidar testes de lógica, navegador, build e saves, com CI verde no SHA final; confirmar Pages para o SHA de merge.

Esta entrega não modifica arte, taças, calendário esportivo, negociações, probabilidade de título nem categorias de jogadores.
