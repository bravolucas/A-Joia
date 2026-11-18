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

## Copa Sul-Americana — acervo real corrigido (18/11/2026)

A **Copa Sul-Americana** tem agora **24 campeões por edição (2002–2025)**,
distribuídos entre **18 clubes**, incluindo representantes do México, Peru,
Colômbia, Argentina, Brasil, Equador e Chile. O acervo fica em
`src/dados/sulamericanaHistorica.js`. Pachuca, Cienciano, Arsenal de
Sarandí e Independiente Santa Fe também aparecem, mesmo não sendo equipes
jogáveis do A JOIA.

No ranking, seis equipes têm duas taças cada: Boca Juniors, Independiente,
Athletico-PR, Independiente del Valle, LDU de Quito e Lanús.
A conquista de 2016 foi **atribuída à Chapecoense**, sem disputa da decisão.
O Lanús é o último vencedor cadastrado (2025). **Não registrar o campeão
de 2026 antes da final e da confirmação do resultado.**

As edições reais, vencedores da carreira e totais legados são mostrados
separadamente: só os títulos da carreira alteram o save. Aliases
`Copa Sudamericana`, `Sul-Americana` e `Copa Sul-Americana`
consultam a mesma competição, sem fundir com a Libertadores.

### Fontes e manutenção

- [ge — lista completa por temporada (22/11/2025)](https://ge.globo.com/mg/futebol/copa-sul-americana/noticia/2025/11/22/todos-os-campeoes-da-copa-sul-americana-veja-lista.ghtml)
- [Folha — histórico 2002–2025 (22/11/2025)](https://www1.folha.uol.com.br/esporte/2025/11/confira-a-lista-com-todos-os-campeoes-da-copa-sul-americana.shtml)
- [Federação Francesa de Futebol — palmarés até 2024](https://www.fff.fr/626-palmares-copa-sudamericana.html)

**Testes:** `node --test tests/sulamericana-historica.test.mjs
tests/libertadores-historica.test.mjs tests/competicoes-historicas.test.mjs`
e `GITHUB_PAGES=true npm run build`.

As mudanças não migram saves, nem inventam placares, vices ou resultados
históricos simulados. A edição de 2026 deve ser adicionada somente quando
oficialmente concluída.

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
