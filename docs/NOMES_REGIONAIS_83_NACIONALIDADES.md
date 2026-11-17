# Cobertura integral das nacionalidades do gerador de jogadores

## Problema

O catálogo de seleções do A JOIA contém **83 códigos**. A geração regional já diferenciava 74 seleções por dados próprios ou agrupamentos culturais, mas outras nove eram enviadas silenciosamente para o conjunto internacional neutro (`INT`), resultando em nomes repetitivos para atletas fictícios.

## Países acrescentados

| Código | Seleção | Exemplo para seed inicial |
|---|---|---|
| ISL | Islândia | Aron Gunnarsson |
| CDN | Coreia do Norte | Kwang-song Han |
| FIJ | Fiji | Setareki Hughes |
| SOL | Ilhas Salomão | Joses Nawo |
| TAH | Taiti | Teaonui Tehau |
| VAN | Vanuatu | Brian Kaltack |
| PNG | Papua-Nova Guiné | Raymond Gunemba |
| NCL | Nova Caledônia | Georges Gope-Fenepej |
| SAM | Samoa | Andrew Setefano |

**Importante:** os geradores criam jogadores **fictícios**, combinando independentemente cinco prenomes e cinco sobrenomes de cada conjunto, inspirados em exemplos reais de futebolistas dessas seleções. A saída gerada **não afirma** ser o nome de um atleta existente. As listas são amostras linguísticas, não um cadastro exaustivo, e podem evoluir com variantes culturais (inclusive a ordem do sobrenome em nomes coreanos).

## Referências para grafia e adequação regional

- Islândia: [Japan Football Association — convocação da seleção islandesa em 2026](https://www.jfa.jp/eng/samuraiblue/20260531/news/00036390/).
- Coreia do Norte: [RSSSF — registros da seleção norte-coreana](https://www.rsssf.org/miscellaneous/nkor-recintlp.html) e [National Football Teams — elenco de 2025](https://www.national-football-teams.com/country/136/2025/North%20Korea.html).
- Fiji: [Fiji Football Association — convocação para eliminatórias](https://www.fijifootball.com.fj/fiji-national-football-team-begins-preparations-for-fifa-world-cup-2026-qualifiers/).
- Ilhas Salomão: [Solomon Islands Football Federation — convocação de amistosos](https://www.siff.com.sb/solomon-islands-confirmed-for-international-friendlies-against-fiji.htm).
- Taiti: [Fédération Tahitienne de Football — convocação](https://www.ftf.pf/la-liste-des-23-joueurs-devoilee/) e [OFC — nomes do futebol taitiano](https://www.oceaniafootball.com/tahiti-and-new-caledonia-squads-finalised-for-semi-final/).
- Vanuatu: [Oceania Football Confederation — Vanuatu squad](https://www.oceaniafootball.com/archives-12261/).
- Papua-Nova Guiné: [OFC — convocação para eliminatórias](https://www.oceaniafootball.com/png-name-squad-for-fifa-world-cup-qatar-2022-ofc-preliminary-competition/).
- Nova Caledônia: [OFC — convocação para eliminatórias](https://www.oceaniafootball.com/new-caledonia-pick-mix-of-local-and-overseas-talent-for-oceania-qualifiers/).
- Samoa: [OFC — ficha Tahiti x Samoa 2024](https://www.oceaniafootball.com/competition-list/ofc-mens-nations-cup-2024-group-b-2700242809/tahiti-samoa-2701555892/).

## Proteções

- `NOMES_MUNDO`, `NACIONALIDADES`, atletas reais, clubes, OVRs, contratos, títulos e saves antigos não são alterados.
- Nomes aleatórios continuam determinados pelo mesmo RNG/seed da carreira.
- O comportamento de códigos **desconhecidos** segue `INT` e não assume nacionalidade brasileira.
- Novo teste percorre os 83 códigos oficiais e falha caso qualquer um retorne `INT`; outro valida exemplos das nove regiões.
- Mudanças incidem sobre **novos jogadores gerados depois da atualização**, sem reescrever o nome de jogadores existentes nos saves.

## Condição para publicação

PR draft até CI verde completo de lógica, build e navegador, a partir da `main` atualizada. Integrar após a sequência aberta #85–#87, #90–#92, ou em ordem tecnicamente independente com coordenação dos deploys e dos testes. A execução em `main` e o GitHub Pages devem confirmar o mesmo commit de merge.
