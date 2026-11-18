# Origem dos jovens da categoria de base da gestão do treinador

Continuação do Prompt Mestre #98 e do PR #124. Auditoria do caminho
`prepararGestaoTecnico` encontrou um quinto gerador de elenco no modo
treinador que criava **todo jovem com `nac:'BRA'`** e nome fixo
português — até em Real Madrid, clubes ingleses ou argentinos.

## Alteração no motor da gestão

Para jogadores **novos** adicionados quando a gestão unifica a base:

- Usa `nacionalidadeNovoAtletaLiga` do mapa regional compartilhado;
- Nome regional único via `gerarNomeRegionalUnico`, inclusive em segundas
  divisões; permite estrangeiros no clube;
- Sem consumir o RNG da geração de OVR, idade, contrato e potencial:
  a origem e o nome utilizam fonte determinística separada, derivada do ID;
- Guarda os mesmos IDs, número de vagas, setores, remuneração e força;
- Não renomeia jogadores reais nem altera os gerados em saves antigos.

## Migração de dados legados

Antes, `conectarElencoMundo` escrevia `nac:'BRA'` para qualquer
jogador de **elenco legado sem nacionalidade**, inclusive de um clube
estrangeiro. Agora `nac` desconhecida permanece `null`, sem atribuição
falsa; se `j.nac` já estiver registrado, é preservado. Jogadores já
importados em saves anteriores **não são reescritos** nem migrados
retroativamente.

A mudança não atribui país verdadeiro a pessoa real e não afeta
regulamentos das seleções. Ainda existe um gerador de nomes simples na
gestão exclusivamente legada; não renomeamos pessoas em saves antigos.

## Testes

`node --test tests/treinador-base-origem-regional.test.mjs tests/elenco-unificado.test.mjs tests/origens-ligas-mundo.test.mjs`

`GITHUB_PAGES=true npm run build`

Verifica clubes espanhóis/ingleses, liga mista, nomes exclusivos,
IDs, não consumo adicional de RNG global, idempotência,
e migração sem nacionalidade presumida. Requer CI geral e específica,
além de validação da publicação no SHA final.
