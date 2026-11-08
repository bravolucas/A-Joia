# Créditos das taças

Parte das imagens de taças desta pasta foi adaptada do repositório público
**Football-Career** (https://github.com/AugustoCesarSalgado/Football-Career, pasta
`public/trophies`). O repositório declara a licença MIT e atribui os direitos de
autor a "Career Sim contributors". A atribuição é mantida aqui junto aos arquivos
derivados.

Foram recortadas (sem a margem transparente), reduzidas e convertidas para WebP, com o
nome no formato que o jogo usa (ex.: `copa-do-brasil.webp`, `bola-de-ouro.webp`).

As imagens são usadas para identificar as competições no jogo. Os troféus, nomes e
marcas também podem estar sujeitos a direitos das respectivas entidades organizadoras;
o A JOIA não é afiliado, patrocinado nem endossado por elas. Competição sem arquivo
correspondente usa uma silhueta original do jogo. Para remover uma imagem, basta
apagar o arquivo.

## Taças enviadas pelo autor do jogo

Fotos fornecidas pelo autor do A JOIA. O fundo foi removido com
[rembg](https://github.com/danielgatis/rembg) (MIT) quando a foto tinha cenário, e a
imagem foi recortada e convertida para WebP: `laliga-2`, `liga-portugal-2`,
`champions-asiatica`, `concacaf` (e a cópia `concacaf-champions`, nome usado no Modo
Carreira), `copa-ouro`, `copa-africana-de-nacoes`, `copa-das-nacoes-da-ofc`.

Do Football-Career também vieram as taças das ligas novas: `eredivisie`, `knvb-beker`,
`super-lig`, `liga-profesional`, `copa-argentina` e `supercopa-argentina`.

## Reexportação em resolução maior

44 imagens raster foram reexportadas dos originais do mesmo repositório `Football-Career`, commit `96b05075cb437197e8c8fdeb03a282a24340cc31`, preservando a transparência, removendo margens e limitando o maior lado a 900 px, sem ampliar originais menores. Esse grupo inclui as novas imagens de Community Shield, Supercopa de España, Supercoppa Italiana, Supercopa da Alemanha, Trophée des Champions, Copa Sul-Americana e Europa League. O mapa por arquivo está em `acervo.json`; o processo pode ser reproduzido com `scripts/atualizar-acervo.mjs`.

As sete ilustrações SVG novas (King's Cup, Copa da Turquia, Supercopa da Turquia, Supercopa Saudita, Supertaça, Campeones Cup e Johan Cruijff Schaal) são desenhos originais do A-Joia gerados por `tacas.js`, e não fotos nem réplicas oficiais. Não foi usada a imagem de outra competição como substituta.

O alias `concacaf` aponta para `concacaf-champions`, evitando armazenar duas cópias idênticas.

## Recriações de materiais e iluminação

Brasileirão, Copa do Brasil e Libertadores receberam novas renderizações produzidas com a ferramenta de edição de imagens, usando as ilustrações anteriores como referência estrutural. São recriações visuais para o jogo, não fotografias oficiais. As referências foram preservadas em `arte/originais/referencias/`, e as matrizes de produção em `arte/originais/tacas/`. A reexportação respeita essas matrizes; os PNGs gerados também permanecem em `/workspace/generated_images`.

- `copa-intercontinental-fifa.svg`: ilustração vetorial original criada para A JOIA (2026). Representação artística de uma taça mundial, sem reprodução do logotipo oficial.
