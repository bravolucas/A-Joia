# Museu com objetos fotográficos e goleiro recortado

## Alterações

- O goleiro em mergulho usa uma única região da folha de quatro poses: `887 × 443,5`, com coluna conforme a direção e linha conforme o tipo de defesa. `overflow: hidden` inline e um `clipPath` próprio impedem que a regra geral `.vf-cena svg { overflow: visible }` exponha as outras poses.
- 19 novas artes geradas com Adobe Firefly: duas bolas de futebol, chuteiras, luvas, braçadeira, prancheta, ingressos, passaporte, carta, jornal/arquivo, diário de recuperação, moldura de camisa, vitrine, homenagem, três retratos fictícios, contrato e salão.
- Camisas com seus números e nomes continuam renderizadas a partir do save, dentro da moldura vazia. As taças reais de cada competição ficam dentro da vitrine vazia. As imagens não contêm resultados, estatísticas ou conquistas fictícias.
- Memórias recebem objetos conforme seu tipo e conteúdo; defesas usam luvas, assistências usam chuteiras, recuperação usa diário. Pessoas recebem retratos comemorativos fictícios conforme seu papel.
- Imagens originais preservadas em `arte/museu/`. Versões de 512 px (salão: 896 px), criadas pela ferramenta Adobe de redimensionamento, ficam em `arte/museu/mini/`. `srcSet`, dimensões explícitas e carregamento tardio permitem que o navegador escolha a resolução e carregue os objetos conforme entram na tela. Miniaturas somam aproximadamente 5,6 MiB, contra aproximadamente 22 MiB dos originais.
- Geração registrada em `arte/museu/creditos.json`, sem URLs temporárias de download.

## Validação

Build do GitHub Pages e testes do museu e dos minigames em desktop e celular. Os testes verificam carregamento real das imagens, manutenção do número da camisa, tipos distintos de objetos, dimensões do recorte do goleiro, navegação, favoritos, persistência e abertura automática do museu ao encerrar a carreira.

Validação do commit `157ec91`: os workflows de testes e build passaram com **427 testes de lógica** e **299 cenários de navegador**, incluindo museu, abertura no encerramento da carreira, minigames e quatro poses do goleiro. [Execução completa](https://github.com/bravolucas/A-Joia/actions/runs/42809476810).

As duas bolas da coleção são de futebol de campo (soccer): uma moderna e uma clássica redonda de couro. Os originais e as versões menores usados no jogo foram conferidos visualmente.

Publicação no GitHub Pages ainda em processamento no serviço externo.

Capturas: [desktop](entrada-desktop.png), [celular](entrada-celular.png), [objetos](objetos-desktop.png), [retratos](retratos-desktop.png) e [falta](falta-celular.png).
