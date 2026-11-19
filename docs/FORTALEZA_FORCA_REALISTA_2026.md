# Auditoria de força — Fortaleza (referência 18/11/2026)

## Diagnóstico reproduzido

- O catálogo atribui **força-base 64** ao Fortaleza e a Série B.
- A correção anterior (76 → 64) atualizou **somente** o cadastro e os campos-base dos saves.
- Os **29 atletas com nomes reais** ainda tinham OVRs da referência antiga:
  Brenno 76, Tomás Cardona 80, Gabriel Fuentes 82, Luiz Fernando 81,
  Rodriguinho 81, entre outros.
- O motor unificado usa o nível dos 11 titulares e da profundidade do
  elenco: com esse plantel antigo o cálculo se aproximava de **76–77**,
  apesar do 64 mostrado em tabelas e propostas.
- Assim o Fortaleza podia ser muito superior ao seu nível de Série B
  em partidas de ambos os modos; apenas baixar o clube no catálogo não bastava.

## Calibração

Os 29 OVRs iniciais foram recalibrados por uma mesma regra auditável:

`OVR novo = max(52, OVR legado - 13)`.

Isso mantém a ordem relativa entre titulares, suplentes e posições. A
força efetiva fica perto de **64**, ainda competitiva na Série B sem
se equiparar aos favoritos da Série A. Os atributos dos demais clubes
não mudam. Não foram reescritos nomes, IDs, nacionalidades ou posições.

**Critério de referência:** o Fortaleza encerrou a fase regular da Série
B 2026 em quarto lugar com 65 pontos/38 partidas, disputando os playoffs
de acesso. É um clube competitivo pela promoção, mas não deve iniciar
a simulação com força próxima de times de elite.

Fontes:
- [CBF — tabela do Brasileiro Série B 2026](https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-b/2026)
- [ge — fase final e análise do Fortaleza em novembro/2026](https://ge.globo.com/ce/futebol/times/fortaleza/noticia/2026/11/15/analise-sem-brilho-mas-com-alma-fortaleza-resgata-conexao-com-a-torcida-e-ganha-efeito-vojvoda.ghtml)
- [Terra — quarta colocação e playoffs](https://www.terra.com.br/esportes/futebol/brasileiro-serie-b/fortaleza-vence-o-vila-nova-e-define-playoffs-do-acesso-a-serie-a%2C61a52a6dd2ddb20d8a563c615e304f80gpf48rdw.html)

## Saves e integridade

- Mundos **novos** saem marcados com `calibracaoFortalezaElenco:'2026-v2'`
  para nunca sofrerem desconto duplo.
- Mundos **antigos** passam por uma migração idempotente que ajusta
  somente os jogadores originais identificados no Fortaleza, preservando
  ganhos de treinamento relativos à referência anterior.
- Contratados, transferidos/retornados, jogadores de outros clubes,
  resultados, títulos e temporadas já encerradas não são modificados.
- O cache `forcasMundo.Fortaleza` e a gestão unificada são atualizados
  quando existe save legado dessa equipe.
- No modo completo, o mundo fica no campo externo `save.mundo`;
  não é copiado para dentro de `save.carreira`.

**Verificações:**

`node --test tests/fortaleza-elenco-calibracao.test.mjs tests/fortaleza-forca.test.mjs tests/elenco-unificado.test.mjs tests/mundo-vivo.test.mjs`

`GITHUB_PAGES=true npm run build`

A evolução natural após o início do save continua possível: compras, vendas,
treinos e temporadas futuras podem elevar ou diminuir a força real.
A correção trata apenas a escala inicial e o legado inconsistente.
