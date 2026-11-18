# Atletas reais: separar identidade conhecida de dados estimados

Continuação da issue #84, sem alterar a base, regras de convocação ou motores de simulação.

## Problema e correção
O catálogo inicial contém nomes de pessoas reais, mas apenas uma parte possui
data de nascimento e nacionalidade documentadas em
`src/dados/metadadosAtletasReais.js`. O motor legado sorteia idade e,
quando falta nacionalidade, usa a distribuição da liga. Essas estimativas
são úteis à simulação mas **não equivalem a dados biográficos reais**.

Nas **novas carreiras**, os atletas do catálogo recebem:
- `origemCadastroReal: true` — nome presente na base de identidades reais;
- `idadeEstimada: true` apenas quando não há nascimento documentado;
- `nacionalidadeEstimada: true` apenas quando não há código no cadastro
  nem nos metadados documentados.

A ficha do jogador na História do Futebol mostra a idade e a seleção
associada e assinala claramente o que é estimativa do jogo. O campo
`nac` continua funcional para o motor atual; este PR não pretende
provar que a atribuição provisória corresponde ao país real do atleta.

## Compatibilidade
- Nenhum RNG adicional: continuamos consumindo a idade e nacionalidade
  sorteadas do motor legado no mesmo momento.
- Sem mudar nomes, clubes, posições, OVRs, IDs ou dados já salvos.
- Atletas do mundo procedural continuam sem o marcador de identidade real.
- Saves antigos sem marcadores continuam legíveis, sem presumir
  falsamente que suas biografias foram verificadas.
- Contratos, resultados, títulos, movimentos e rankings não mudam por
  causa da origem dos campos.

## Verificação
`node --test tests/proveniencia-atletas-reais.test.mjs tests/metadados-atletas-reais.test.mjs`

`GITHUB_PAGES=true npm run build`

Também exigir CI geral, testes de navegador, fusão controlada e Pages
confirmado no SHA integrado antes de anunciar publicação.

## Próximas etapas
Expandir os registros individuais documentados, distinguir informações
do catálogo sem fonte de documentos primários e revisar convocações que
dependem de nacionalidade provisória. Não adicionar informações
biográficas por aproximação do país do clube.
