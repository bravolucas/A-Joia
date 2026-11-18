# Nomes regionais no painel de camisas dos clubes

## Problema

`src/jogador/camisasCarreira.js` ainda mostrava os **mesmos 24 nomes brasileiros** para o grupo fictício que ocupa números em qualquer clube, inclusive ingleses, espanhóis, alemães e argentinos.

## Correção

O painel de numeração passa a usar `gerarNomeRegionalUnico` e a nacionalidade-base da **liga** do clube no catálogo `CLUBES`:
- Brasil, Argentina, Inglaterra, Espanha, Itália, Alemanha, França, Portugal, Holanda, Arábia Saudita, MLS e Turquia recebem pools regionais coerentes.
- Segunda divisão usa a mesma referência linguística da principal.
- Liga com países misturados (`sulamericano`) ou clube desconhecido usa o catálogo neutro `INT`, nunca um fallback brasileiro universal.
- Os 24 nomes são únicos e a escolha é determinística pelo código da carreira, clube e slot. Nenhum sorteio global adicional ocorre.

**Importante:** trata-se somente de nomes fictícios exibidos no painel de camisas; não é um cadastro de atletas reais nem uma mudança nos elencos do universo persistente. A nacionalidade-base da liga é uma aproximação visual, não uma afirmação de nacionalidade de cada jogador.

## Compatibilidade

- IDs dos placeholders, números de camisa, algoritmo de distribuição, tamanho do grupo e estrutura do save são preservados.
- Kits já gerados e armazenados em `c.camisas.clubes` **não são alterados ou renomeados**.
- Não altera probabilidades, simulação, contratações, estatísticas ou o histórico.

## Validação

`tests/camisas-nomes-regionais.test.mjs` cobre as 20 ligas do catálogo, unicidade dos 24 nomes, IDs e números idênticos ao algoritmo legado, determinismo e preservação de nomes de kits já salvos. A CI dedicada executa também `tests/camisas-projetos-carreira.test.mjs` e o build.

Nenhum merge antes de CI geral, auditoria específica, `main` aprovada e deploy confirmado. 
