# Imagens: oportunidades após as copas do jogador

Varredura do repositório e inspeção visual do acervo em 08/11/2026. Escopo desta etapa: diagnóstico e proposta de imagens; não é uma nova implementação de telas.

## Acervo observado

457 arquivos raster fora de `arte/originais`: 362 escudos, 51 imagens de competições e 44 arquivos de cenas/personagens (incluindo pares desktop/celular). A contagem não inclui SVGs e não significa que todos os arquivos apareçam hoje na interface. Há bons ambientes de estádio, treino, sala de imprensa, recuperação e preparação mental; também existem cenas de primeiro contrato, primeiro dia e despedidas.

A maior oportunidade é reduzir repetição e dar contexto às imagens. Exemplos confirmados:
- `CriacaoCarreira.jsx`: futsal pode usar a imagem genérica de início; várias origens usam o mesmo treino/bairro.
- `DesafioTemporada.jsx`: as abordagens são agrupadas em apenas três fotos (mental, recuperação e equipamentos).
- `LojaJogador.jsx`: iate e mansão usam a imagem de mansão; diferentes itens de desempenho usam equipamentos/treino.
- `CopaEscolha.jsx` e `CopaEscolha.css`: identidades de copa já existem em cores/motivos gráficos; ainda não possuem cenas próprias de grupos, semifinais e final.
- `VisualFutebol.jsx`: uma imagem de goleiro em mergulho é reaproveitada. Novas poses devem acompanhar a direção e altura reais do lance, mantendo bola/rede/colisão em animação.

## Prioridades

| Ordem | Local | Imagem proposta | Aplicação e efeito esperado |
|---|---|---|---|
| 1 | Copas, jogador e treinador | Túnel de entrada, estádio de semifinal e arena de final; variantes sul-americana/europeia/mundial | Dentro do painel existente, como cenário atrás dos escudos/taça. A fase ganha importância sem acrescentar janela ou clique. |
| 2 | Escolha de origem | Quadra de futsal, campo de várzea, academia de clube, futebol escolar, praia e descoberta tardia | Uma ilustração contextual por família de origem; cada carta deixa de depender de uma foto genérica. |
| 3 | Desafios e pré-temporada | Nutrição esportiva, academia, análise de vídeo, treino de velocidade, recuperação e bola parada | Reconhecer a proposta pela imagem. Reaproveitar mental/recuperação existentes e criar apenas os contextos ausentes. |
| 4 | Minigames de goleiro | Defesa baixa e alta para ambos os lados, postura central e reação após defesa | Sequência de poses coerente com o lance; recorte transparente, mesmo ângulo, escala e iluminação. Uma fotografia não substitui a animação. |
| 5 | Loja | Nutrição, fisioterapia, análise de desempenho, luvas, chuteiras e iate próprios | Imagens por família de item, evitando dezenas de fotos diferentes e corrigindo associações como iate/mansão. |
| 6 | Propostas e chegada | Mala no CT, chegada ao estádio, mesa de assinatura e camisa dobrada | Fundos discretos nas ofertas/assinatura já existentes. Camisa, nome e escudo permanecem dinâmicos, sem voltar a um boneco de apresentação. |
| 7 | Seleção | Armário com camisa do país, túnel internacional e viagem da delegação | Dar uma imagem específica à primeira convocação/estreia; bandeira e nome aplicados pela interface, não desenhados dentro da fotografia. |
| 8 | Fechamento e premiações | Festa no vestiário, arquibancada de acesso, vestiário silencioso e palco de premiação | Diferenciar campeão, acesso, rebaixamento e top 3 da Bola de Ouro dentro do resultado já existente. |
| 9 | Museu e álbum | Sala de troféus, camisa emoldurada, bilhete de estreia e bola do primeiro gol | Transformar feitos em lembranças visuais, preservando agrupamento ×N, anos e registros reais da carreira. |
| 10 | Notícias e vínculos | Abraço com mentor, dupla de companheiros e braçadeira no armário | Pequenos recortes nos acontecimentos que já existem, sem introduzir uma caixa de entrada ou decisões obrigatórias. |

## O que reaproveitar primeiro

- Usar o estádio premium e o túnel existentes como base de enquadramento para as copas; gerar novas cenas apenas onde a fase/competição exigir diferença real.
- Recuperação e preparação mental já têm cenários próprios. Melhorar sua associação com os eventos antes de gerar duplicatas.
- As despedidas já possuem um painel com seis cenas e poses. Conferir resolução e recorte individual antes de produzir outra coleção semelhante.
- A apresentação de transferência deve continuar valorizando camisa e escudo, conforme a direção aprovada anteriormente.

## Direção das próximas artes

Fotografia cinematográfica de futebol, materiais críveis, iluminação consistente e áreas livres para os dados. O início deve parecer modesto; as grandes finais, grandiosas. Personagens fictícios e uniformes genéricos permitem aplicar as cores do clube na interface. Textos, nomes, números, escudos e placares continuam dinâmicos.

Entregar cenas com versões horizontal e vertical, WebP leve e carregamento sob demanda. Usar cenários discretos atrás das decisões; não adicionar tela extra, alongar animações nem esconder as três escolhas.

Primeiro lote recomendado: ambientes das copas, origens e treinos. É o conjunto com maior frequência de exposição e maior diferença perceptível na carreira rápida.

## Execução do primeiro lote

Copas, origens e treinos receberam 18 cenas originais. Detalhes da aplicação e dos testes em `docs/CENAS_CARREIRA_LOTE1.md`. Os demais tópicos permanecem oportunidades para os próximos lotes.
