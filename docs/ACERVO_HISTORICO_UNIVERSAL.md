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
- `src/dados/acervoClubesHistoricos.js` e `acervoClubesHistoricosLote2.js` `acervoClubesHistoricosLote3.js` `acervoClubesHistoricosLote4.js` `acervoClubesHistoricosLote5.js` `acervoClubesHistoricosLote6.js` `acervoClubesHistoricosLote7.js` `acervoClubesHistoricosLote8.js` `acervoClubesHistoricosLote9.js` `acervoClubesHistoricosLote10.js` `acervoClubesHistoricosLote11.js` `acervoClubesHistoricosLote12.js` `acervoClubesHistoricosLote13.js` `acervoClubesHistoricosLote14.js` `acervoClubesHistoricosLote15.js` `acervoClubesHistoricosLote16.js` `acervoClubesHistoricosLote17.js` `acervoClubesHistoricosLote18.js` `acervoClubesHistoricosLote19.js` `acervoClubesHistoricosLote20.js` `acervoClubesHistoricosLote21.js` `acervoClubesHistoricosLote22.js` `acervoClubesHistoricosLote23.js` `acervoClubesHistoricosLote24.js` `acervoClubesHistoricosLote25.js` e `acervoClubesHistoricosLote26.js`.
- `src/dados/acervoSelecoesHistoricas.js`.
- Clubes com fichas individuais verificadas neste ciclo: **225**.
- **Turquia e Arábia Saudita:** 18 + 17 clubes do catálogo principal com ficha documental inicial. Fichas com apenas marcos históricos recebem `parcial_documentado`, não `pendente_apuracao`. Os 35 clubes ainda podem ter jogadores, recordes ou temporadas por apurar; não equivalem a cobertura completa.
- A auditoria é incremental: o teste de integridade não impõe a contagem fixa de 191 nem inventa um atleta para cada clube.
- Seleções com fichas individuais verificadas neste ciclo: **21**.
- As 23 equipes da Série D, as 20 equipes da Série C e as 20 equipes da Série B do catálogo principal possuem ficha histórica inicial.
- O lote 6 e o lote 8 incluem técnicos responsáveis por títulos documentados.
- O lote 10 amplia clubes ingleses e sauditas com fontes de clubes e da AFC.
- O lote 11 inclui clubes alemães, italianos e espanhóis com referências da UEFA e Bundesliga.
- O lote 12 completa as fichas históricas iniciais dos 20 clubes argentinos e 13 clubes do grupo continental sul-americano.
- O lote 13 fecha a lacuna de Defensa y Justicia e documenta as oito equipes pendentes do grupo Espanha.
- O lote 14 completa o grupo inglês de 20 clubes com quatro novas fichas documentadas.
- O lote 15 documenta Galatasaray, Fenerbahçe, Beşiktaş e Trabzonspor com atletas, marcos e técnicos associados a fontes da UEFA.
- O lote 16 adiciona Başakşehir, Samsunspor e Göztepe com fontes UEFA e TFF; dados absolutos não apurados permanecem null.
- O lote 17 adiciona Konyaspor, Kocaelispor, Gençlerbirliği e Al-Nassr com dados de UEFA, TFF e AFC; sem recordes absolutos não apurados.
- O lote 18 acrescenta Alanyaspor, Kasımpaşa, Antalyaspor e Al-Shabab (fontes de TFF, clubes e AFC).
- O lote 19 inclui Eyüpspor e Kayserispor, com fontes da TFF e UEFA, atletas documentados e marcos de acesso e títulos.
- O lote 20 adiciona Al-Fateh (título saudita 2012/13) e Al-Taawoun (King’s Cup 2018/19), com documentação da AFC.
- O lote 21 adiciona Al-Ettifaq (títulos sauditas de 1983 e 1987) e Gaziantep FK (origem como Sankospor e primeiro acesso à elite em 2019), preservando a distinção em relação ao Gaziantepspor.
- O lote 22 adiciona Rizespor, Al-Qadsiah e Al-Khaleej com fundação, acessos, títulos e jogadores documentados; o Al-Khaleej ainda não possui atleta individual apurado.
- O lote 23 adiciona Al-Fayha (Copa do Rei 2022, primeira vitória asiática 2023) e Al-Wehda (Copas do Rei 1957 e 1966, final de 2023), com atletas reais e fontes AFC, FIFA e clube.
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

- O lote 24 adiciona Al-Riyadh, Al-Raed, Damac e Al-Kholood (fundação, títulos e promoções documentadas na Saudipedia). Os registros de atletas sem períodos comprovados são mantidos com `periodo: null`; não há preenchimento fictício de recordes.

- O lote 25 adiciona Fatih Karagümrük (fundação, retomada em 1946, acessos em 2020 e 2025, fontes oficiais do clube e TFF) e Al-Orobah (fundação, título e primeiro acesso em 2013, retorno à elite em 2024, atletas Zouma, Guðmundsson e Young, fontes SPL e clube). Sem totais inventados.

- O lote 26 adiciona Kocaelispor (Copas da Turquia de 1997 e 2002, acesso de 2025, atletas da temporada 1992/93) e Gençlerbirliği (Campeonatos Turcos pré-Süper Lig de 1941 e 1946, Copas de 1987 e 2001, campanha europeia de 2003/04). Fontes de TFF e clubes. Os títulos de 1941/1946 são descritos explicitamente como competições anteriores à liga nacional.
