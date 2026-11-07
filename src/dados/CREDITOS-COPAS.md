# Referências históricas de Copas masculinas

Dados derivados em `marcasCopas.js`: © 2023 Joshua C. Fjelstul, Ph.D. Fonte: [Fjelstul World Cup Database](https://github.com/jfjelstul/worldcup). Licença desta tabela derivada: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

O README do repositório declara CC-BY-SA 4.0 para sua base/replicação. A referência a CC-BY-NC-SA no início do README trata do download da plataforma WorldCups.ai; esta etapa consultou o CSV público do repositório, sem acessar ou usar a plataforma. A tabela derivada preserva atribuição e licença próprias; ela não modifica a licença do código de simulação. Nenhum CSV integral é distribuído no jogo.

Arquivo consultado: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/goals.csv

SHA-256 do CSV consultado nesta sessão: `4fbe990b7f42bb8af00d1587af09359ecfdb4ee4101bb44fda0eb336fc1e5be3`.

Modificações: filtrar `tournament_name` contendo `FIFA Men's World Cup`, excluir `own_goal != 0`, somar por atleta para carreira e por atleta/edição para edição. Não filtrar só pelo prefixo do ID de torneio, pois ele não distingue corretamente os sexos na base. Resultado: Miroslav Klose, 16 gols; Just Fontaine, 13 gols na edição de 1958. A janela masculina consultada termina em 18/12/2022.

Esses valores são apresentados como referências históricas **até 2022**, não como recordes atuais de 2026. A comparação usa exclusivamente os gols do atleta nas Copas masculinas registradas no save, sem torneios continentais, clubes, gols contra ou cobranças de desempate. Não existem novos rankings históricos de clubes/ligas nesta etapa.


## Partidas disputadas (ampliação)

CSV: https://raw.githubusercontent.com/jfjelstul/worldcup/master/data-csv/player_appearances.csv

SHA-256: `edab41b99556cf7494387a5c7d74824c4c69a4474c32d1d4fbf8bab4e61ad483`. Filtro masculino, conjunto de `match_id` distintos por `player_id`: Lionel Messi, 26 jogos. A cobertura deste arquivo é **1970–2022**, exibida na própria referência; não atribuir cobertura de 1930 ao CSV de aparições. Mesma atribuição/licença CC-BY-SA 4.0 da tabela derivada. Inclui somente quem entrou em campo. O jogo soma `selecao.jogos` de Copas; saves antigos sem esse campo são identificados como contagem parcial, sem inventar jogos por convocação.
