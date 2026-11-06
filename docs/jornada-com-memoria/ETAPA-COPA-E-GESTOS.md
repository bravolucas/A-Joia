# Continuação — corpos em movimento e elenco da Copa

## Entrega

Três gestos agora possuem troca real de poses: abraço (uma sequência), aplauso e caminhada (loops). São quatro quadros por ação em um atlas com transparência limpa, com redução de movimento exibindo uma pose estática. Controles e contratos não dependem da animação. O cenário original de vestiário permite compor o corpo em escala natural na caminhada e também melhora chegada/primeira seleção. As taças continuam agrupadas com quantidade e anos. Não se trata de vídeo, interpolação de corpo ou animação esquelética.

A Copa do Mundo passa a registrar um elenco de 26 atletas, incluindo o jogador. Companheiros são fictícios e persistentes; jogadores elegíveis permanecem entre ciclos e os maiores de 37 anos saem. Há distribuição por função, OVR, números únicos, titulares, entradas do banco, minutos, gols, assistências e nota. A soma dos minutos por jogo é 990; no máximo cinco reservas entram; gols da equipe fecham com o placar; assistências não superam gols e ninguém assiste seu próprio gol. Cobranças de desempate não viram gols de jogo. Goleiro recebe jogo sem sofrer apenas quando joga pelo menos 60 minutos sem gol contra.

O melhor onze por função influencia a força do país em até ±1,5 ponto. Essa influência não concede convocação automaticamente. Elencos de Copas ainda não fechadas ficam no card salvo; consolidação ocorre ao encerrar a campanha/temporada. Preparar elenco não registra convocação no estado permanente. Campanhas antigas sem esses dados não recebem estatísticas fictícias retroativas.

O elenco pode ser aberto na Copa e depois nos caminhos da carreira, com filtro por função e linha do jogador em destaque. A consulta não é uma nova decisão obrigatória.

Marcas históricas: painel com Klose/16 gols em Copas e Fontaine/13 em uma edição, referência explicitamente datada 1930–2022. Progresso, ano de empate/superação, duas conquistas do museu e memórias da carreira simulada. Fonte e licença visíveis na tela e em `dados/CREDITOS-COPAS.md`.

## Revisão visual realizada neste lote

| Superfície | Revisão e evidência |
| --- | --- |
| Despedida de base | Abraço por poses, CT, movimento reduzido, avanço disponível. |
| Homenagem no estádio | Aplauso por poses, taças agrupadas, três atos. |
| Caminhada/saída | Corpo com mala e cenário de vestiário em escala natural. |
| Chegada e primeira seleção | Novo cenário vazio, camisa e informações preservadas. |
| Ficha e resumo em gaveta | Diálogo nativo, foco contido/restaurado, Escape e rolagem compartilhada; fechar ficha ao abrir a loja evita sobreposição inacessível. |
| Copa em computador | Área de até 1100 px e duas colunas no lugar de uma coluna de celular. |
| Elenco e marcas históricas | Diálogos opcionais, filtros, dados datados e fonte legível. |

Regressões cobrem também criação, loja, museu, empréstimos, desafios, oito minigames e técnico. Isso não equivale à auditoria manual de todas as telas do modo completo e de todos os pop-ups raros.

## Pendências que permanecem

1. Aplicar o elenco individual aos torneios continentais da seleção; eles continuam com o motor resumido anterior. Os novos números de companheiros são explicitamente de Copas do Mundo.
2. Expandir as referências históricas para clubes e ligas com fontes e escopos consistentes, e atualizar o recorte mundial além de 2022 quando houver base verificada.
3. Concluir a auditoria visual manual das telas raras/legadas e do modo completo.

Refinamento opcional futuro: ampliar as sequências de quatro poses para mais quadros/interpolação. Os três gestos básicos pedidos já têm movimento corporal; cenas de imprensa ainda usam arte e composição.

## Validação

Nove novos casos de domínio incluem 15 posições, troca de função/país, placares/minutos, reserva, final por minigame, desempate, idempotência, não convocação e referências históricas. Nove casos de navegador verificam elenco, recarga, filtros, fontes, ficha/loja e poses com preferência de movimento reduzido. Resultado final e publicação em `docs/CONTINUIDADE.md`.
