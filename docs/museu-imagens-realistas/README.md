# Museu com objetos fotográficos e goleiro recortado

## Alterações

- O goleiro em mergulho usa uma única região da folha de quatro poses: `887 × 443,5`, com coluna conforme a direção e linha conforme o tipo de defesa. `overflow: hidden` inline e um `clipPath` próprio impedem que a regra geral `.vf-cena svg { overflow: visible }` exponha as outras poses.
- 19 novas artes geradas com Adobe Firefly: duas bolas de futebol, chuteiras, luvas, braçadeira, prancheta, ingressos, passaporte, carta, jornal/arquivo, diário de recuperação, moldura de camisa, vitrine, homenagem, três retratos fictícios, contrato e salão.
- Camisas com seus números e nomes continuam renderizadas a partir do save, dentro da moldura vazia. As taças reais de cada competição ficam dentro da vitrine vazia. As imagens não contêm resultados, estatísticas ou conquistas fictícias.
- Memórias recebem objetos conforme seu tipo e conteúdo; defesas usam luvas, assistências usam chuteiras, recuperação usa diário. Pessoas recebem retratos comemorativos fictícios conforme seu papel.
- Imagens originais preservadas em `arte/museu/`. Versões de 512 px (salão: 896 px), criadas pela ferramenta Adobe de redimensionamento, ficam em `arte/museu/mini/`. `srcSet`, dimensões explícitas e carregamento tardio permitem que o navegador escolha a resolução e carregue os objetos conforme entram na tela. Miniaturas somam aproximadamente 5,6 MB, contra 21 MB dos originais.
- Geração registrada em `arte/museu/creditos.json`, sem URLs temporárias de download.

## Validação

Build do GitHub Pages e testes do museu e dos minigames em desktop e celular. Os testes verificam carregamento real das imagens, manutenção do número da camisa, tipos distintos de objetos, dimensões do recorte do goleiro, navegação, favoritos, persistência e abertura automática do museu ao encerrar a carreira.

Validação local: build do GitHub Pages aprovado; 21 testes de lógica do museu aprovados; 37 cenários de navegador verificados (36 passaram na rodada ampla e o caso de arquivo foi ajustado para respeitar a deduplicação factual de primeiros gols, passando na rodada final com outros três cenários de arte e recorte). A validação completa de publicação fica registrada após a conclusão do GitHub Actions.

Capturas: [desktop](entrada-desktop.png), [celular](entrada-celular.png), [objetos](objetos-desktop.png), [retratos](retratos-desktop.png) e [falta](falta-celular.png).
