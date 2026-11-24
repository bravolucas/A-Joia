# A JOIA · Acervo histórico universal — clubes e seleções

Atualizado: 23/11/2026. Esta etapa cria uma **lista de trabalho de todas as
entidades do catálogo**; a existência de cadastro **não significa que todos os
recordes já foram apurados**.

## Fontes de identidade
- Clubes jogáveis: `src/dados/data.js` (`CLUBES`).
- Participantes regionais: `src/competicoes/estaduaisRapidos.js`.
- Adversários europeus: `src/competicoes/clubesEuropeusExtras.js`.
- Adversários sul-americanos: `src/competicoes/clubesInternacionais.js`.
- Seleções: `NACIONALIDADES` de `src/dados/data.js` (83 países).
- Campeões históricos de seleções: `src/dados/selecoesHistoricas.js`.

O inventário único, deduplicado por nome, está em
`src/dados/coberturaAcervoHistorico.js`.

## Fichas e recordes verificados
- `src/dados/acervoClubesHistoricos.js` e `acervoClubesHistoricosLote2.js` `acervoClubesHistoricosLote3.js` `acervoClubesHistoricosLote4.js` `acervoClubesHistoricosLote5.js` `acervoClubesHistoricosLote6.js` `acervoClubesHistoricosLote7.js` e `acervoClubesHistoricosLote8.js`.
- `src/dados/acervoSelecoesHistoricas.js`.
- Clubes com fichas individuais verificadas neste ciclo: **118**.
- Seleções com fichas individuais verificadas neste ciclo: **21**.
- As 20 equipes da Série C e as 20 equipes da Série B do catálogo principal possuem ficha histórica inicial.
- O lote 6 e o lote 8 incluem técnicos responsáveis por títulos documentados.
- As demais entidades têm cobertura `pendente_apuracao`.
- Dados reais são independentes do Arquivo Vivo de cada save.
- Os títulos históricos de seleções já existentes foram reutilizados, sem
  copiar a lista para um segundo lugar nem inventar edições ausentes.

## Como ampliar sem introduzir números incorretos
1. Localizar a identidade EXATA no catálogo, preservando clube/seleção e
   diferenciando homônimos. Registrar nome, posição, período e fonte pública.
2. Para jogos, gols e assistências, indicar **recorte**: oficiais, apenas liga,
   todas as competições, amistosos e/ou A-matches. Quando não houver número
   verificável, usar `null`, nunca zero.
3. Separar `atletas[]` (dados individuais) de `recordes[]` (marcas comprovadas).
   Um valor conhecido não é, necessariamente, o recorde absoluto do clube.
4. Usar `comparavel:false` para metodologias diferentes. O jogador do save
   não deve receber anúncio falso de recorde quebrado.
5. Conferir recordistas ativos (novembro de 2026) com fontes datadas e
   não repetir números de Copa do Mundo como se fossem de todas as partidas.
6. Rodar os testes e revisar a interface antes de integrar à `main`.

## Auditoria
```bash
node scripts/auditar-acervo-historico.mjs
node scripts/auditar-acervo-historico.mjs --pendentes
node scripts/auditar-acervo-historico.mjs --pendentes --json
node --test tests/acervo-clubes-historicos.test.mjs tests/acervo-selecoes-historicas.test.mjs
```

## Expansão futura
Preencher, entidade por entidade, os jogos e gols históricos; recordistas
de partidas por temporada e por competição; títulos de atletas; técnicos
históricos; fatos notáveis; transferências recordistas; marcos do estádio;
e estatísticas por adversário. Todas as afirmações precisam de fontes
específicas e uma regra de comparação compatível com a simulação.
