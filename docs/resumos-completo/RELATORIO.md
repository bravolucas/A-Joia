# Históricos e resumos de competição do modo completo

## Problemas encontrados

- Histórico antigo sem `clubeObj` podia quebrar a lista de temporadas; ausência de `artilheiro` podia quebrar o resumo.
- Resumo usava a posição atual do atleta para escolher gols/CS, mesmo quando a temporada tinha outra função.
- Grade de estatísticas misturava cabeçalhos e valores sem semântica de tabela e podia apertar nomes longos.
- Edição especial da competição sorteava um nome como artilheiro e anunciava o atleta/rival como melhor jogador sem apuração registrada.

## Correções

A normalização completa a identificação visual do clube com nome/catálogo, em cópia independente, sem alterar o registro original ou inventar posição, classificação ou artilheiro. Campos opcionais ausentes são tratados no resumo; xG só aparece se registrado e posição de liga ausente recebe texto explícito.

Próximas temporadas guardam `posicao` no registro. Resumo usa a posição daquele ano, não a atual. Temporadas antigas sem esse campo são identificadas como tal; gols registrados e eventuais jogos sem sofrer gol permanecem disponíveis, sem adivinhar a posição passada.

Tabela acessível separa clube e seleção, com J, G, A, CS e nota; dados de competição ausentes usam “—”, com legenda. Card e indicadores respondem ao tamanho da tela; fechar continua sempre acessível pelo diálogo compartilhado. Informações já registradas de títulos, prêmios, metas, contrato e treinador foram preservadas.

Removidos os dois anúncios de prêmio sem dados reais do painel de resultado da competição. Texto do resultado, celebração e animações permanecem. Prêmios registrados no histórico não foram removidos; não se adicionou apuração nova de artilharia de torneios nesta rodada.

## Validação

Build e **41 arquivos de lógica** passaram. Três casos novos verificam normalização sem mutação, clube fora do catálogo e preservação de posição/metadados. Seis cenários novos em 320/1366 px cobrem histórico sem posição e históricos de ATA/GOL consultados com outra posição atual, sem artilharia ou objeto de clube; tabela, limites de largura, fechamento e quantidade de temporadas são conferidos.

Teste inicial apontava a aba Legado, mas a lista fica em Estatísticas; fixture corrigida antes da rodada válida. Health-check interrompeu a tentativa sem prévia; servidor iniciado antes da validação. Os seis casos passaram; após acabamento de cabeçalho, regressão ampla executada. Resultado e publicação no topo de `docs/CONTINUIDADE.md`.

## Limites

A posição não é preenchida retroativamente nos saves que não a guardaram. Não há fonte histórica nova de clubes/ligas nem cálculo novo de prêmios de torneio. Demais cenas e estados raros seguem na auditoria parcial dos itens 67/98.


Rodada final: **153 cenários de navegador passaram**, depois do acabamento do cabeçalho. Log `/tmp/resumos-completo-regressao.log`; build final em `/tmp/resumos-completo-build-entrega.log`. Capturas de histórico no celular e goleiro no desktop acompanham o relatório.
