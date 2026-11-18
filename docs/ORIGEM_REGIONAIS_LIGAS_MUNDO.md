# Origem regional dos atletas por liga — 18/11/2026

Esta etapa dá continuidade à issue #98 e à correção das camisas (#123).
A nacionalidade dos **jogadores fictícios do universo** passa a usar um mapa
compartilhado de 19 ligas e segundas divisões, em vez de três tabelas parciais
que ignoravam Argentina, Holanda, MLS, Arábia, Turquia e as divisões inferiores.

## Regras

- `nacionalidadeLocalLiga` é somente uma referência cultural, nunca inferência
  da identidade verdadeira de uma pessoa nem prova de país de nascimento.
- Elenco inicial do Brasil: chance local de 85%; dos demais países: 55%.
- Base/reposição anual: chance local de 85% nas ligas com país identificado.
- Ligas mistas (`sulamericano`) e desconhecidas mantêm o sorteio global.
- Todos os sorteios usam o RNG fornecido; nenhum `Math.random` adicional
  no motor persistente. Os fluxos iniciais retêm o primeiro sorteio antigo,
  inclusive na liga mista, para preservar sua sequência de RNG.
- O mapa também atende aos representantes fictícios do painel de camisas.
  Esses placeholders **não** se tornam os atletas reais do mundo por isso.

## Proteção dos saves

Somente a **criação de novos jogadores** usa a nova distribuição. Atletas
persistidos, nomes, IDs, nacionalidades, contratos, partidas, conquistas e
históricos anteriores não são migrados nem reescritos. O resultado
determinístico de uma carreira nova após a alteração pode ser diferente de uma
carreira nova em versão antiga; saves existentes preservam seus dados.

Esta regra é um **valor de game design provisório**, não estimativa demográfica
de clubes reais. O catálogo de biografias verificadas da issue #84 continua
pendente: não atribuir falsamente origem local aos atletas reais.
A fase de migração de base, famílias e dupla nacionalidade do Prompt Mestre
não está resolvida por esta implementação.

## Verificação

- `node --test tests/origens-ligas-mundo.test.mjs tests/camisas-nomes-regionais.test.mjs tests/nomes-regionais.test.mjs`
- `GITHUB_PAGES=true npm run build`
- CI global e navegador em PR e após integração, com publicação no SHA final.

Esperado: 19 ligas com código local, sem fallback brasileiro em ligas
desconhecidas, diversidade de origem preservada e IDs/saves inalterados.
