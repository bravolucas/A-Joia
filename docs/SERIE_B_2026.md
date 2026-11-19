# Auditoria do Brasileirão e da Série B — temporada 2026

Regra oficial: [CBF, regulamento da Série B 2026](https://www.cbf.com.br/futebol-brasileiro/noticias/competicoes-ranking/a/cbf-divulga-documentos-tecnicos-do-brasileirao-da-serie-b-de-2026).

## Participantes e fase regular
- Série A: 20 clubes. Série B: 20 clubes, verificados no catálogo `CLUBES`.
- Cada clube enfrenta os outros 19 em casa e fora, por 38 rodadas.
- São 380 partidas em cada série.

## Acesso da Série B para a Série A (regra 2026)
- 1º e 2º sobem diretamente.
- 3º recebe o 6º na volta do playoff, após visitar o 6º na ida.
- 4º recebe o 5º na volta do playoff, após visitar o 5º na ida.
- Os vencedores do agregado sobem. Se o agregado empatar, avança o clube com melhor classificação na fase regular (3º ou 4º).
- Não se sorteia prorrogação, pênaltis ou gol fora de casa nos playoffs.
- Quatro últimos da Série A descem à Série B, preservando 20 participantes nas duas divisões.

## Implementação
- `src/simulacao/playoffsSerieB.js`: regulamento único e resolução de partidas em dois jogos.
- `src/treinador/classificacoesMundoTecnico.js` + `src/treinador/tecnico.js`: promoção de clubes e do treinador somente com o resultado do playoff.
- `src/jogador/rapido.js`: modo jogador usa os mesmos classificados.
- `src/comum/lib.js`: rotação geral de ligas usa as mesmas regras.
- `src/simulacao/mundoVivo.js`: resultados de ida e volta incluídos no histórico da edição.
- `src/treinador/CarreiraTecnico.jsx` e `src/jogador/ModoRapido.jsx`: detalhes de confrontos, placares e vencedores.
- `src/dados/data.js`: grupos iniciais da Série B 2026 atualizados; clubes fora da edição preservados nos estaduais.
- `tests/playoffs-serie-b-2026.test.mjs`: contagem de clubes, ida e volta, mando, empate, zebra e promoção.
- Os confrontos de playoff são resolvidos automaticamente após a 38ª rodada e exibidos no histórico; não existe ainda uma escolha tática interativa específica para cada uma dessas partidas.

## Limites conhecidos / próximos passos
- O universo atual não contém uma Série C nacional completa com promoção/rebaixamento vinculados à Série B. A integração B↔C é uma tarefa própria e não foi implementada nesta alteração.
- Validação de unidade da regra e integração dos dois motores de acesso realizada; execução integral de `npm test`, build Vite e publicação efetiva em GitHub Pages dependem dos respectivos jobs/ambiente.
- Escudo do Atlético-GO acrescentado como versão vetorial simplificada (não verificada como reprodução fiel do escudo oficial).
