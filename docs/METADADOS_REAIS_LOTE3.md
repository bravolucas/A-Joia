# Issue #84 — lote 3: 22 atletas reais adicionais

Este lote incrementa **PR #86**, já empilhado sobre o **PR #85**. Amplia o mapa de nacionalidade e nascimento para **61 identidades reais** no catálogo de 1.775 atletas, sem mudar OVR, clube, posição ou histórico de saves.

A data do nascimento determina a idade em **01/07/2026**; o país corresponde à seleção representada pelo atleta, não ao lugar de nascimento. A chave é `nome do catálogo + clube do catálogo`, sem inferências pelo nome ou pela liga.

## Fontes oficiais e referência de dados

| Jogador / clube no catálogo | Seleção | Nascimento | Fonte primária |
|---|---|---|---|
| Aurélien Tchouaméni / Real Madrid | FRA | 2000-01-27 | [Real Madrid](https://www.realmadrid.com/en-US/football/first-team/players/aurelien-tchouameni) |
| Arda Güler / Real Madrid | TUR | 2005-02-25 | [Real Madrid: aniversário de 21 anos](https://www.realmadrid.com/en-US/news/football/first-team/latest-news/arda-guler-cumple-21-anos-25-02-2026) |
| Éder Militão / Real Madrid | BRA | 1998-01-18 | [Real Madrid](https://www.realmadrid.com/en-US/football/first-team/players/eder-gabriel-militao) |
| Dean Huijsen / Real Madrid | ESP | 2005-04-14 | [Real Madrid](https://www.realmadrid.com/en-US/football/first-team/players/dean-huijsen); [seleção espanhola — RFEF](https://rfef.es/) |
| Brahim Díaz / Real Madrid | MAR | 1999-08-03 | [Real Madrid](https://www.realmadrid.com/en-US/football/first-team/players/brahim-diaz); [seleção marroquina — CAF](https://www.cafonline.com/news/brahim-diaz-morocco-and-real-madrid-s-lethal-weapon/) |
| Frenkie de Jong / Barcelona | HOL | 1997-05-12 | [Relatório oficial do Barcelona 2023/24](https://www.fcbarcelona.com/fcbarcelona/document/2025/10/15/3df4d520-9c42-4de7-b427-b4ff840a7dc9/MEM_2023_24_ENG-web.pdf) |
| Jules Koundé / Barcelona | FRA | 1998-11-12 | [Relatório oficial do Barcelona 2023](https://www.fcbarcelona.com/fcbarcelona/document/2024/05/17/58037f15-b448-43c3-9722-ff4ceab468a7/MEMORIA_2023_CAT-2-1.pdf) |
| Alejandro Balde / Barcelona | ESP | 2003-10-18 | [Relatório oficial do Barcelona 2023/24](https://www.fcbarcelona.com/fcbarcelona/document/2025/10/15/3df4d520-9c42-4de7-b427-b4ff840a7dc9/MEM_2023_24_ENG-web.pdf) |
| Dani Olmo / Barcelona | ESP | 1998-05-07 | [Relatório oficial do Barcelona 2024/25](https://www.fcbarcelona.com/fcbarcelona/document/2025/10/17/2f8e2017-fea7-4dd1-ab7f-9ee6fde42673/Annual-Report-2024-25-October-19th-2025.pdf) |
| Ferran Torres / Barcelona | ESP | 2000-02-29 | [Barcelona: ficha do atleta](https://www.fcbarcelona.com/en/news/2463268/present-and-future-ferran-torres) |
| Omar Marmoush / Manchester City | EGI | 1999-02-07 | [Manchester City: biografia](https://www.mancity.com/features/omar/) |
| Alexander Isak / Liverpool | SUE | 1999-09-21 | [Liverpool FC: ficha oficial](https://auction.liverpoolfc.com/product/alexander-isak-ceeThPqT_kGE5SXeAAvlug) |
| Dominik Szoboszlai / Liverpool | HUN | 2000-10-25 | [Liverpool FC: ficha oficial](https://auction.liverpoolfc.com/product/dominik-szoboszlai-dT1qmZDAQE2Dkn8gtV_7Xw) |
| Alexis Mac Allister / Liverpool | ARG | 1998-12-24 | [Liverpool FC: ficha oficial](https://auction.liverpoolfc.com/product/alexis-mac-allister-EiDRxJnmDkyjy_c3MbzGrg-25) |
| Cody Gakpo / Liverpool | HOL | 1999-05-07 | [Liverpool FC: perfil](https://www.liverpoolfc.com/teams/mens-team/cody-gakpo?tab=stats) |
| Nuno Mendes / PSG | POR | 2002-06-19 | [Paris Saint-Germain](https://www.psg.fr/en/players/nuno-mendes) |
| Vitinha / PSG | POR | 2000-02-13 | [Paris Saint-Germain](https://www.psg.fr/en/players/vitinha) |
| João Neves / PSG | POR | 2004-09-27 | [Paris Saint-Germain](https://www.psg.fr/en/players/joao-neves) |
| Joshua Kimmich / Bayern | ALE | 1995-02-08 | [Bayern München](https://fcbayern.com/en/teams/first-team/joshua-kimmich) |
| Michael Olise / Bayern | FRA | 2001-12-12 | [Bayern München](https://fcbayern.com/en/teams/first-team/michael-olise) |
| Luis Díaz / Bayern | COL | 1997-01-13 | [Bayern München](https://fcbayern.com/en/teams/first-team/luis-diaz) |
| Alphonso Davies / Bayern | CAN | 2000-11-02 | [Bayern München](https://fcbayern.com/en/teams/first-team/alphonso-davies) |

## Integridade e limites

- Cadastro, clubes, posição, OVR, salários, IDs, distribuição procedural e saves existentes **não** são modificados.
- A mudança só afeta novas carreiras, via `metadadosAtletaReal(nome, clube)` já criado no PR #85.
- Testes estendidos para 61 identidades, códigos de seleção válidos, idade invariável entre seeds, homônimos e ano bissexto real (Ferran, 29/02/2000).
- Correspondência exata para evitar confusão com homônimos e atletas que trocaram de clube em 2026/27.
- **A seleção de Brahim Díaz é Marrocos (MAR), e a de Dean Huijsen é Espanha (ESP)**, mesmo que os países de nascimento sejam outros.
- Existem **1.714** atletas do catálogo sem data de nascimento documentada após todos os três lotes. A issue #84 continua aberta.

## Ordem segura

**Não integrar antes de #83, #85 e #86** estarem publicados, respeitando essa ordem. Este PR começa como draft empilhado sobre #86 e precisa ser redirecionado para `main` após o PR #86, seguido por CI completo verde de lógica, build e navegador no SHA final. Não declarar disponibilizado no site antes do workflow GitHub Pages confirmar o SHA de merge.
