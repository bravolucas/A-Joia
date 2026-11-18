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
