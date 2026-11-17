# Issue #84 — segundo lote de metadados reais (21 atletas)

Este lote é **incremental e dependente do PR #85**. Ele adiciona nacionalidade e nascimento verificados a mais 21 atletas, totalizando **39 de 1.775 jogadores** com ambos os campos fundamentados quando os PRs #85 e este lote estiverem integrados.

## Registro de evidências (dados públicos de identidade)

| Atleta (nome do jogo) | Nascimento | Seleção | Evidência oficial |
|---|---|---|---|
| Antoine Griezmann | 1991-03-21 | FRA | [UEFA — França](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefaeuro/2020/match/2026129/) |
| Phil Foden | 2000-05-28 | ENG | [UEFA — perfil](https://www.uefa.com/uefachampionsleague/clubs/players/250101534--phil-foden/) |
| Kenan Yildiz | 2005-05-04 | TUR | [Juventus — perfil oficial](https://www.juventus.com/en/teams/first-team-men/squad/kenan-yildiz) |
| Dušan Vlahović | 2000-01-28 | SER | [Juventus — anúncio oficial](https://www.juventus.com/en/news/articles/vlahovic-joins-juventus) |
| Virgil van Dijk | 1991-07-08 | HOL | [UEFA — Liverpool](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2045927/) |
| Trent Alexander-Arnold | 1998-10-07 | ENG | [Real Madrid — anúncio](https://www.realmadrid.com/en-US/news/football/first-team/latest-news/perfil-arnold-30-05-2025) |
| Alisson (Liverpool) | 1992-10-02 | BRA | [Premier League — perfil oficial](https://www.premierleague.com/en/players/116535/alisson-ramses-becker/overview) |
| Manuel Neuer | 1986-03-27 | ALE | [UEFA — Bayern](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2045957/) |
| Rúben Dias | 1997-05-14 | POR | [UEFA — Manchester City](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2046030/) |
| Pedri | 2002-11-25 | ESP | [FC Barcelona — perfil Pedri](https://www.fcbarcelona.com/en/football/first-team/players/70486/pedro-gonzalez-lopez) |
| Gavi | 2004-08-05 | ESP | [FC Barcelona — perfil Gavi](https://www.fcbarcelona.com/en/football/first-team/players/116719/pablo-paez-gavira/) |
| Gabriel Martinelli | 2001-06-18 | BRA | [UEFA — Arsenal](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2045986/) |
| Gabriel Magalhães | 1997-12-19 | BRA | [UEFA — perfil](https://www.uefa.com/uefachampionsleague/clubs/players/250131901--gabriel/) |
| Enzo Fernández | 2001-01-17 | ARG | [UEFA — Chelsea](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2045972/) |
| Cole Palmer | 2002-05-06 | ENG | [UEFA — Chelsea](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2045972/) |
| Florian Wirtz | 2003-05-03 | ALE | [UEFA — Liverpool](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2026/match/2048069/) |
| Ousmane Dembélé | 1997-05-15 | FRA | [UEFA — França](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefaeuro/2020/match/2026129/) |
| Rodrygo | 2001-01-09 | BRA | [Real Madrid — aniversário](https://www.realmadrid.com/en-US/news/football/first-team/latest-news/rodrygo-cumple-25-anos-09-01-2026) |
| Gianluigi Donnarumma | 1999-02-25 | ITA | [PSG — transferência para Manchester City](https://www.psg.fr/en/content/pr-gianluigi-donnarumma-joins-manchester-city) |
| Rúben Neves | 1997-03-13 | POR | [Al Hilal — perfil oficial](https://alhilal.com/en/teams/mens-team/ruben-neves-profile) |
| Bernardo Silva | 1994-08-10 | POR | [UEFA — Manchester City](https://www.uefa.com/news-media/mediaservices/informationkits/competitions/uefachampionsleague/2025/match/2042066/printmatchpresskits/) |

A data de nascimento é utilizada exclusivamente para calcular a idade em **01/07/2026** para novas carreiras. Códigos nacionais (`BRA`, `HOL`, `ALE`, `TUR`, etc.) seguem a tabela interna de seleções do jogo, e não ISO 3166.

## Segurança e regressão

- Não altera o catálogo de 1.775 atletas, clubes, posições, salários, OVRs, títulos ou saves existentes.
- Reaproveita o mecanismo de correspondência exata `nome + clube` já introduzido pelo lote 1, evitando que homônimos recebam os dados uns dos outros.
- Não modifica o gerador procedural, o calendário ou o motor de transferências.
- Amplia os testes para as 39 identidades, nacionalidades válidas, idades entre seeds, referências de homônimos e aniversários após 1º de julho.
- Este PR é **empilhado sobre o PR #85**; primeiro integrar o #83, depois o #85 e só então reenquadrar e validar este lote contra a `main`. Nunca realizar merge de código não aprovado pelo CI.

**Limites:** cobertura dos dados confirmados ainda é de 39 de 1.775 atletas. O cadastro restante precisa ser auditado. Fontes podem indicar transferências mais recentes, mas o objetivo deste lote **não** é atualizar o mercado de clubes: qualquer alteração em clubes requer auditoria separada.
