# Campeões das competições

Abra a história do clube e escolha **Competições**, ou toque no nome de uma competição na vitrine de títulos. Na ficha do modo completo, os nomes das taças também abrem a consulta diretamente.

A consulta inclui:

- Campeões por edição da simulação, último vencedor e indicação de conquistas com o usuário.
- Ranking com a base histórica cadastrada, títulos da carreira e totais legados sem ano.
- Ligas, copas nacionais, continentais, estaduais e torneios de seleções.
- Escudos ou bandeiras e retorno à galeria de cada clube vencedor.

Uma edição aparece apenas quando existe vencedor registrado. Finais e copas ainda abertas não antecipam o campeão. Aliases e registros repetidos da mesma edição são conciliados. O painel apenas consulta o save: não sorteia resultados nem preenche anos históricos desconhecidos. As contagens históricas usam o acervo inicial existente do jogo; a simulação não altera a história real.

A Copa do Mundo e os continentais do treinador utilizam os resultados efetivamente disputados. As competições de seleção também consultam os títulos registrados pelo jogador.

## Libertadores — acervo real corrigido (referência em 18/11/2026)

A Libertadores tem agora **66 campeões por edição, de 1960 a 2025**,
incluindo **27 clubes de diferentes países**, mesmo quando o clube não
possui elenco jogável no universo. Os dados estão em
`src/dados/libertadoresHistorica.js` e são consultados por
`galeriaCompeticao` e pelas vitrines de clubes.

O histórico real aparece em lista separada das **edições simuladas**.
O ranking combina a quantidade histórica documentada até 2025 com as
conquistas desta carreira, sem transformar edições reais em eventos
do save. Independiente tem sete títulos; Boca Juniors, seis; Peñarol,
cinco; River Plate, Estudiantes e Flamengo, quatro cada. Os vencedores
estrangeiros não são mais excluídos do ranking por falta de cadastro
de clube jogável.

A **Libertadores 2026 ainda não tem campeão**, porque sua decisão está
marcada para 28/11/2026. Não inserir um vencedor antes da conclusão.

### Fontes para manutenção
- [CONMEBOL — Manual de Clubes 2026](https://cdn.conmebol.com/wp-content/uploads/2025/12/CL-2026-Manual-de-Clubes-POR-2.pdf)
- [365Scores — lista por edição 1960–2025](https://www.365scores.com/pt-br/news/magazine/quem-ja-venceu-a-libertadores/)
- [ge — campeões por clube e anos, 29/11/2025](https://ge.globo.com/futebol/times/flamengo/noticia/2025/11/29/flamengo-e-tetra-e-se-torna-o-brasileiro-com-mais-titulos-na-libertadores-veja-todos-os-campeoes.ghtml)
- [FIFA — final Palmeiras x Estudiantes em 28/11/2026](https://www.fifa.com/es/tournaments/mens/intercontinentalcup/2026/articles/palmeiras-estudinates-final-copa-libertadores-cuando-es-donde)

Não foram adicionados placares, vices ou partidas individuais históricos:
apenas os campeões confirmados por ano. Edições novas exigem atualização
documental antes de atualizar o arquivo; jamais inferir pelo resultado
da carreira.

### Testes
`node --test tests/libertadores-historica.test.mjs tests/competicoes-historicas.test.mjs tests/historia-futebol.test.mjs`

`GITHUB_PAGES=true npm run build`

Todos os saves existentes permanecem intactos: somente a consulta do
acervo real foi ampliada; históricos simulados, vitórias e títulos salvos
não são reescritos.

## Copa Sul-Americana — acervo real atualizado até 2026 (27/11/2026)

A **Copa Sul-Americana** tem agora **25 campeões por edição (2002–2026)**,
distribuídos entre **18 clubes**, incluindo representantes do México, Peru,
Colômbia, Argentina, Brasil, Equador e Chile. O acervo fica em
`src/dados/sulamericanaHistorica.js`. Pachuca, Cienciano, Arsenal de
Sarandí e Independiente Santa Fe também aparecem, mesmo não sendo equipes
jogáveis do A JOIA.

O **Boca Juniors lidera isolado com três títulos** (2004, 2005 e 2026).
Outros cinco clubes têm duas conquistas: Independiente, Athletico-PR,
Independiente del Valle, LDU de Quito e Lanús. A conquista de 2016 foi
**atribuída à Chapecoense**, sem disputa da decisão.

Em **21/11/2026**, o Boca Juniors venceu o Atlético Mineiro por **2 a 0**
na final única em Barranquilla, com gols de Santiago Ascacíbar e Miguel
Merentiel. A edição de 2026 está concluída e incluída; **2027 permanece
fora do acervo até sua decisão oficial**.

As edições reais, vencedores da carreira e totais legados são mostrados
separadamente: só os títulos da carreira alteram o save. Aliases
`Copa Sudamericana`, `Sul-Americana` e `Copa Sul-Americana`
consultam a mesma competição, sem fundir com a Libertadores.

### Fontes e manutenção

- [ge — lista completa por temporada (22/11/2025)](https://ge.globo.com/mg/futebol/copa-sul-americana/noticia/2025/11/22/todos-os-campeoes-da-copa-sul-americana-veja-lista.ghtml)
- [Folha — histórico 2002–2025 (22/11/2025)](https://www1.folha.uol.com.br/esporte/2025/11/confira-a-lista-com-todos-os-campeoes-da-copa-sul-americana.shtml)
- [Federação Francesa de Futebol — palmarés até 2024](https://www.fff.fr/626-palmares-copa-sudamericana.html)
- [AFA — Boca campeão da Sul-Americana 2026](https://www.afa.com.ar/es/posts/boca-se-corono-campeon-de-la-conmebol-sudamericana)
- [UOL — resultado da final Atlético-MG 0–2 Boca Juniors (21/11/2026)](https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/11/21/atletico-mg-x-boca-juniors-final-sul-americana.ghtm)

**Testes:** `node --test tests/sulamericana-historica.test.mjs
tests/libertadores-historica.test.mjs tests/competicoes-historicas.test.mjs`
e `GITHUB_PAGES=true npm run build`.

As mudanças não migram saves, nem inventam placares, vices ou resultados
históricos simulados.
## Champions League / Copa dos Campeões — histórico real (18/11/2026)

A história das duas fases da principal competição europeia foi reunida
sob o título **Champions League**: **71 finais, de 1956 a 2026**, com
**24 clubes diferentes**. Cada ano indica a **final** da temporada:
2026 corresponde a 2025/26; a edição 2026/27 ainda está em andamento
e não recebe campeão adiantado.

O banco fica em `src/dados/championsHistorica.js`.
O Real Madrid lidera com 15 títulos; Milan tem 7; Bayern de Munique e
Liverpool, 6 cada; Barcelona, 5; Ajax, 4. O PSG venceu **2025 e 2026**
e, portanto, tem **dois** títulos históricos, substituindo o número
antigo incompleto. O arquivo também inclui campeões sem elenco jogável,
como Celtic, Steaua Bucareste e Estrela Vermelha.

Na interface, `UEFA Champions League`, `Liga dos Campeões` e
`Copa dos Campeões Europeus` abrem a mesma competição. Os títulos
reais permanecem em lista distinta dos campeões gerados na carreira;
conquistas no save são somadas sem alterar as 71 edições reais.

### Fontes e verificação
- [UEFA — quadro oficial de títulos, atualizado em 30/05/2026](https://www.uefa.com/uefachampionsleague/news/0275-1541637ad1db-88aeeefefefd-1000--all-time-european-cup-honours-board/)
- [RSSSF — vencedores por final, 1956–2026](https://www.rsssf.org/ec/ec1stats.html)
- [UEFA — PSG campeão de 2026](https://www.uefa.com/uefachampionsleague/news/02a5-20c02e59f219-15e92acdc717-1000/)

**Validação:** `node --test tests/champions-historica.test.mjs
tests/libertadores-historica.test.mjs tests/sulamericana-historica.test.mjs
tests/competicoes-historicas.test.mjs tests/historia-futebol.test.mjs`.
Depois, `GITHUB_PAGES=true npm run build`.

Dados documentais, sem migração ou regravação de saves existentes,
sem inventar vice-campeões, placares ou resultados de carreira.

## Copa da UEFA / Europa League — campeões reais até 2026

O arquivo `src/dados/europaLeagueHistorica.js` documenta **55 finais
de 1972 a 2026**, com **31 clubes campeões**. Não é incluída a Copa
das Cidades com Feiras (torneio antecessor, com palmarés separado).
A final de **2026 foi vencida pelo Aston Villa**, enquanto a edição
2026/27 permanece sem campeão conhecido.

O Sevilla lidera com **sete** troféus; Tottenham, Juventus,
Inter de Milão, Atlético de Madrid e Liverpool têm **três** cada.
O acervo registra também clubes não jogáveis e preserva os nomes
portugueses usados pelo jogo em clubes como Inter de Milão e
Bayern de Munique.

A consulta aceita as variantes `Copa da UEFA`, `UEFA Cup`,
`UEFA Europa League` e `Liga Europa`. Não mistura esse
torneio com Champions League nem Conference League, e não
reescreve os títulos nem os resultados salvos pelos jogadores.

Fontes: [UEFA — 31 clubes e totais por equipe, 27/08/2026](https://www.uefa.com/uefaeuropaleague/news/0275-152d42886a65-efc6ff0e2d60-1000--which-teams-have-won-the-europa-league/);
[RSSSF — finais de 1972 a 2026](https://www.rsssf.org/ec/ec3stats.html);
[UEFA — Aston Villa campeão em maio de 2026](https://www.uefa.com/uefaeuropaleague/news/02a5-20ac3759bba4-7f91e47690b9-1000--freiburg-0-3-aston-villa-brilliant-villans-win-europa-leagu/).

Testes: `node --test tests/europa-league-historica.test.mjs
tests/champions-historica.test.mjs tests/sulamericana-historica.test.mjs
tests/libertadores-historica.test.mjs` e build de produção Pages.

## Conference League — histórico completo 2022–2026

A Conference League estreou na temporada 2021/22. Até a final de
maio de **2026**, contabiliza **cinco edições e cinco campeões**:
Roma (2022), West Ham (2023), Olympiacos (2024), Chelsea (2025)
e Crystal Palace (2026). A edição 2026/27 permanece em disputa.

Os campeões oficiais, no arquivo `src/dados/conferenceHistorica.js`,
são consultáveis de forma separada da Europa League e da Champions
League, com suporte a `UEFA Europa Conference League` (denominação
anterior) e `Liga Conferência`. Olympiacos é preservado como campeão
mesmo sem elenco jogável no A JOIA.

Fontes: [UEFA — lista dos cinco clubes vencedores](https://www.uefa.com/uefaconferenceleague/news/02a5-20ba66bce46d-a5d5586eeda6-1000--which-teams-have-won-the-conference-league/);
[UEFA — final de 2026, Crystal Palace campeão](https://www.uefa.com/uefaconferenceleague/news/029c-1e9ad66c8169-aaecb38941a7-1000--202526-conference-league-all-the-league-phase-fixtures/).

Testes: `node --test tests/conference-historica.test.mjs
tests/europa-league-historica.test.mjs tests/champions-historica.test.mjs`
e build Pages. Mudança somente documental e de consulta: sem mutação de saves.

## Mundiais de clubes — três palmares separados (27/11/2026)

O arquivo mundial distingue três torneios com formatos e históricos
próprios. Os totais não são somados entre categorias:

- **Copa Intercontinental clássica (1960–2004):** 43 edições disputadas
  entre campeões europeus e sul-americanos. Não houve partidas em 1975 e
  1978. O ano identifica a edição, inclusive quando partidas ocorreram
  no ano seguinte.
- **Mundial de Clubes FIFA:** edição inaugural de 2000, retorno em 2005 e
  edições anuais até 2023; depois, o torneio expandido para 32 equipes em
  2025. São 21 edições no histórico aqui cadastrado.
- **Copa Intercontinental FIFA:** torneio anual reintroduzido em 2024,
  com Real Madrid (2024) e PSG (2025) como campeões das duas edições
  concluídas. A final de 2026 está marcada para 16/12/2026; por isso,
  2026 ainda não entra como título.

A distinção de 2025 é essencial: Chelsea venceu o Mundial de Clubes
expandido, enquanto o PSG venceu a Copa Intercontinental FIFA. Ambos
recebem registros separados. O acervo antigo de PALMARES_HISTORICO guardava
uma contagem genérica de títulos mundiais; a galeria agora exibe as três
bases comprovadas por torneio. Conquistas simuladas e títulos legados de
saves continuam separados dos palmares reais.

### Fontes e critérios

- [RSSSF — Copa Intercontinental clássica, resultados e edições não disputadas](https://www.rsssf.org/tablest/toyota.html)
- [RSSSF — histórico da Copa do Mundo de Clubes FIFA e da Copa Intercontinental FIFA](https://rsssf.org/tablesf/fifawcc.html)
- [FIFA — calendário e final da Copa Intercontinental 2026 (16/12/2026)](https://www.fifa.com/en/tournaments/mens/intercontinentalcup/2026/articles/teams-dates-venues-history)

**Teste:** node --test tests/mundiais-historicos.test.mjs tests/competicoes-historicas.test.mjs
e GITHUB_PAGES=true npm run build.

## Copa do Brasil — histórico real 1989–2025

A edição inaugural foi vencida pelo Grêmio em **1989** e a última
edição concluída até 18/11/2026 foi a de **2025**, vencida pelo
Corinthians. O arquivo `src/dados/copaBrasilHistorica.js` registra
os **37 campeões de 1989 a 2025**, totalizando **17 clubes**.

O Cruzeiro lidera com seis títulos. Flamengo e Grêmio têm cinco cada;
Palmeiras e Corinthians têm quatro cada (o Corinthians conquistou
seu quarto em **2025**); Atlético-MG tem dois. Todos os demais
campeões ganharam uma taça.

**Santo André (2004) e Paulista (2005)** permanecem no ranking e em
suas vitrines de clube mesmo sem elenco jogável no A JOIA. Os nomes
seguem o catálogo (Internacional, Sport Recife, Vasco da Gama e
Athletico-PR).

Consultas por `Copa Brasil` e `Copa do Brasil` apontam para o
mesmo acervo. Os títulos históricos não se confundem com jogos do
save; conquistas simuladas somam apenas uma vez e não reescrevem
campeões reais. A edição **2026 ainda não tem vencedor cadastrado**,
porque não havia sido concluída na data de referência.

### Fontes
- [ge — palmarés dos 37 anos, reproduzido da CBF (21/12/2025)](https://ge.globo.com/mg/futebol/copa-do-brasil/noticia/2025/12/21/maiores-campeoes-da-copa-do-brasil-corinthians-leva-o-tetra-e-sobe-no-ranking.ghtml)
- [CBF — Corinthians tetracampeão em 2025](https://www.cbf.com.br/futebol-brasileiro/noticias/undefined/sport-recife-x-palmeiras/corinthians-vence-vasco-e-conquista-seu-quarto-titulo-da-copa-do-brasil)

**Validação:** `node --test tests/copa-brasil-historica.test.mjs
tests/competicoes-historicas.test.mjs tests/historia-futebol.test.mjs`
e `GITHUB_PAGES=true npm run build`.


## Ligas nacionais — acervo real por edição (19/11/2026)

A partir desta atualização, todas as **21 ligas identificáveis do cadastro** passam a ter
campeões reais por ano em `src/dados/ligasHistoricas.js`, com nome do campeão,
identificação da edição, URL da fonte, período coberto e sinalização de
`cobertura: 'completa' | 'recorte'`. São **649 registros de campeão** no
acervo de ligas, além dos acervos previamente existentes para copas, estaduais
e torneios de seleções.

Nas fichas de clubes ingleses, os títulos da antiga **Football League First Division**
são separados das conquistas da **Premier League** a partir de 1992/93.
Por exemplo, os 14 títulos nacionais do Arsenal são 10 da antiga primeira
divisão e 4 da Premier League até 2026.

As páginas de competição exibem o acervo documental separado das temporadas
jogadas na carreira. O ranking histórico de cada liga é calculado **somente
com as edições documentadas**, sem usar os números estimados por força do clube.
Para ligas com recorte parcial, o ranking é do **período coberto**, não o
número absoluto de campeonatos ao longo de toda a história da modalidade.
As fichas de clubes também passam a recuperar a relação de anos históricos
comprovados, inclusive para clubes sem elenco jogável e campeões de divisões
inferiores. A consulta não modifica saves nem reescreve resultados da carreira.

### Inventário coberto

- Brasil: Brasileirão, Série B, Série C e Série D.
- Inglaterra: Premier League e Championship.
- Espanha: La Liga e LaLiga 2.
- Itália: Serie A e Serie B (Itália).
- Alemanha: Bundesliga e 2. Bundesliga.
- França: Ligue 1 e Ligue 2.
- Portugal: Liga Portugal e Liga Portugal 2.
- Países Baixos: Eredivisie.
- Turquia: Süper Lig.
- Arábia Saudita: Liga Saudita.
- Estados Unidos: MLS (a lista corresponde à **MLS Cup**, e não ao
  Supporters' Shield).
- Argentina: Liga Profesional; o campeão da tabela anual oficial de 2025
  (Rosario Central) e 2026 (Boca Juniors) **não** representa vencedor de
  Apertura/Clausura, que são competições distintas.

`Outras Ligas Sul-Americanas` é um **agrupamento de clubes**, não uma
competição com campeão único; portanto, não foi inventado um palmarés para
esse identificador. As Séries C e D brasileiras passaram a ser consultáveis no
histórico mesmo quando não jogáveis no simulador.

### Recortes e anos ainda sem campeão

Algumas ligas têm cobertura integral desde a criação da **denominação/era
especificada** (por exemplo Premier League, MLS Cup, Eredivisie, Saudi Pro
League e Liga Portugal 2); outras contêm intervalos documentados, explicitamente
marcados como **recorte parcial**. Uma lista parcial não deve ser usada para
afirmar a quantidade absoluta de títulos de cada clube. A base ainda necessita
ampliar os períodos antigos e as competições nacionais de copa que não possuem
cadastro por edição.

**Não há campeão cadastrado da Série A brasileira de 2026 nem da MLS Cup de
2026**, pois seus títulos não estavam oficialmente definidos em 19/11/2026.
Eredivisie 2020, Liga Portugal 2 de 2019/20 e Serie A italiana 2004/05
permanecem sem campeão na lista, conforme as decisões das respectivas
organizações. Anos sem disputa não são preenchidos.

Os registros usam o ano civil para ligas brasileiras e MLS, e o ano **final**
da temporada nas ligas europeias (2026 = 2025/26). A separação entre Série A,
B, C e D foi ajustada também no rótulo da taça via `nomeDosTitulos`.

### Referências principais

- [Premier League — lista oficial de campeões](https://www.premierleague.com/en/premier-league-explained)
- [KNVB — vencedores da Eredivisie](https://www.knvb.com/node/56)
- [RSSSF — Campeonato Brasileiro](https://www.rsssf.org/tablesb/brazchamp.html)
- [CBF — Novorizontino campeão da Série B 2026](https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-b/a/novorizontino-e-campeao-da-serie-b)
- [CBF — Maringá campeão da Série C 2026](https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-c/a/maringa-e-campeao-da-serie-c-2026)
- [CBF — Uberlândia campeão da Série D 2026](https://www.cbf.com.br/futebol-brasileiro/noticias/campeonato-brasileiro-serie-d/a/uberlandia-e-campeao-da-serie-d-2026)
- [AFA — Boca campeão da tabela anual de 2026](https://www.afa.com.ar/es/posts/boca-se-corono-campeon-de-la-liga-2026)
- Demais fontes ficam anotadas em cada registro de `src/dados/ligasHistoricas.js`.

### Teste de regressão

`node --test tests/ligas-historicas.test.mjs tests/competicoes-historicas.test.mjs tests/historia-futebol.test.mjs`

`npm run build`

**Critério de aceitação:** a consulta de cada liga lista seu campeão real,
as conquistas criadas no save permanecem separadas, clubes fora da lista jogável
não desaparecem, e os torneios pendentes permanecem sem vencedor.


## Copas nacionais — acervo documental (19/11/2026)

Foram acrescentadas **273 edições reais em 11 copas nacionais** ao
`src/dados/copasNacionaisHistoricas.js`, preservando o histórico existente
da **Copa do Brasil** (1989–2025, 37 edições).

O inventário atual de copas principais inclui FA Cup, Copa del Rey,
Coppa Italia, DFB-Pokal, Coupe de France, Taça de Portugal,
KNVB Beker, Türkiye Kupası, King's Cup saudita, US Open Cup,
Copa Argentina e Copa do Brasil.

- A consulta de **Histórico → Competições** apresenta os campeões reais
  em uma lista distinta dos campeões simulados, com ranking documental.
- Cada registro inclui edição, ano, clube vencedor e fonte auditável.
- Os clubes podem mostrar conquistas históricas mesmo sem elenco
  jogável no universo (ex.: Torreense, Wigan Athletic, Patronato).
- As edições anteriores ao recorte de cada copa **não são inventadas**;
  a cobertura documental está marcada como **parcial**. Isso significa
  que o ranking é relativo ao período cadastrado, não uma relação de
  todas as taças vencidas desde a fundação do torneio.
- Sem vencedores fictícios para a Copa Argentina 2026, para a KNVB Beker
  2020, ou para a US Open Cup 2020 e 2021.
- A Copa del Rey 2019/20 conserva o nome da temporada (2020),
  mesmo com a final adiada para 2021; Copa Argentina 2020 usa o
  ano oficial da edição, embora decidida em 2021.
- A Copa da Turquia e Türkiye Kupası são a mesma competição; não
  se devem criar duas taças ou somar os títulos duas vezes.

As fontes utilizadas são consultáveis por `HISTORICO_COPAS_NACIONAIS[nome].fontes`.
Entre elas: [The FA](https://www.thefa.com/news/2026/may/16/emirates-fa-cup-final-chelsea-v-manchester-city-report-20261605),
[LaLiga](https://www.laliga.com/noticias/palmares-copa-del-rey),
[DFB](https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/statistik/bisherige-sieger),
[FFF](https://www.fff.fr/473-palmares-de-la-coupe-de-france.html),
[KNVB](https://www.knvb.com/dutch-football/mens-football/knvb-cup),
[TFF](https://www.tff.org/default.aspx?pageID=411),
[Copa Argentina](https://www.copaargentina.org/es/la-copa/17_Todos-los-ganadores-de-las-Copas-Nacionales.html)
e [U.S. Soccer](https://www.ussoccer.com/stories/2026/10/usoc/match-recap-st-louis-city-vs-columbus-crew-open-cup-final).

### Taça da UEFA Conference League

O recurso `arte/competicoes/conference-league.svg` adiciona uma
**ilustração vetorial original**, inspirada nas 32 colunas espiraladas
da taça da Conference League. **Não é foto licenciada nem arte oficial
da UEFA.** A interface prioriza o arquivo local, que funciona offline,
sem depender de CDN e é usado tanto em Modo Jogador como Treinador.
Aliases `UEFA Conference League`, `UEFA Europa Conference League`,
`Liga Conferência` e `Conference League` são resolvidos para o
mesmo recurso; se necessário, o fallback SVG do jogo também é fixo.

Referência de formato: [UEFA — apresentação e dimensões](https://www.uefa.com/uefaconferenceleague/news/0269-125a11b2e4f9-8459a7575502-1000--uefa-europa-conference-league-trophy-unveiled/).

**Testes:** `node --test tests/copas-nacionais-conference.test.mjs tests/competicoes-historicas.test.mjs tests/historia-futebol.test.mjs` e `npm run build`.

O conteúdo não altera saves antigos e não cria partidas inexistentes.
