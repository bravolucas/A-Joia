# Consolidação do XI e histórico do treinador (PRs #115, #116, #119, #120)

## Motivo

Os quatro PRs trabalham em partes do mesmo fluxo e aguardariam quatro sequências completas de CI e publicação. Esta branch de integração junta funcionalidades e auditorias sem encerrá-los prematuramente e **só substitui os PRs originais após integração e publicação com testes verdes**.

## Componentes

1. Base de escalação posicional (PR #116): 11 posições por 4-3-3, 4-4-2 ou 3-5-2, aptidão principal ou secundária explícita, jogadores únicos e até sete reservas.
2. Prévia na Central do Treinador (PR #115): os 11 atletas do elenco atual e o banco, com estados vazios, busca e teste de layouts em 320, 390, 768 e 1366 pixels.
3. Correção de precisão da prévia (PR #120): slots da UI exibem LD/LE/ZAG/VOL/MC/MEI/PD/PE/ATA reais, nunca apenas setores DEF/MEI/ATA. Jogadores sem aptidão não preenchem vagas erradas.
4. Histórico por partida (PR #119): `confrontos[].escalacao` contém instantâneo compacto da folha de jogo no momento do resultado, com nome/ID da época, clube, formação e reservas. O calendário oferece **Ver escalação** sem editar o save.
5. Compatibilidade do PR #114: o motor de cálculo tático segue lendo os jogadores do mundo persistente; não duplica o elenco e a folha histórica não usa o RNG da partida.

## Validação

- Executar suites de posição, prévia, histórico e tática mundial na **mesma branch**.
- Executar o Playwright `tests/centro-treinador.spec.mjs` em quatro resoluções: consulta da prévia e expansão do histórico, sem alteração no save.
- Executar CI completa do jogo, incluindo 32 carreiras de integração (4 shards), 24 carreiras de melhorias (4 shards), treinador e os dois Playwright shards.
- Confirmar o Pages do SHA exato da main após merge.

## Limites

Ainda não implementa substituições nos 90 minutos, desgaste físico, escalação da equipe adversária ou folhas de jogos de copas/seleções. Não altera estatísticas, gols ou sorteios de resultados; este registro é histórico, não um novo motor tático. Saves antigos sem `escalacao` continuam legíveis.

## Política de release

O merge de #115, #116, #119 ou #120 **não é necessário** se a integração consolidada passar e entrar na main; somente depois confirmar quais PRs originais ficaram totalmente absorvidos, fechar os redundantes com link para a implementação testada e manter a issue #110 aberta para os módulos ausentes.
