# Taças e imagens de competições

Esta pasta reúne imagens de taças e prêmios em WebP. Quando o nome do título
conquistado corresponde a um arquivo, a vitrine do treinador e os componentes
compartilhados exibem essa imagem. O nome do arquivo usa o formato slug, por
exemplo `copa-do-brasil.webp` ou `champions-league.webp`.

As imagens disponíveis incluem Libertadores, Champions League, Champions Asiática,
CONCACAF Champions, copas nacionais e ligas listadas nos arquivos desta pasta. Os
nomes alternativos usados pelo jogo são resolvidos em `arte.js`.

## Cobertura do acervo

As 55 competições do catálogo do museu possuem agora um recurso correspondente, em WebP ou SVG original. Quando não há fotografia do torneio, a ilustração é própria do A-Joia; consulte `acervo.json` e os créditos. A busca reconhece os nomes alternativos usados nos modos jogador e treinador.

## Créditos e uso

Parte das imagens foi adaptada do repositório [Football-Career](https://github.com/AugustoCesarSalgado/Football-Career),
que declara licença MIT; a atribuição está em `CREDITOS.md`. Outras taças foram
fornecidas pelo autor do A JOIA. Os nomes e marcas das competições pertencem às
respectivas entidades; as imagens servem para identificar os torneios e não
indicam afiliação ou endosso.

Veja `CREDITOS.md` para a origem de cada grupo de arquivos.

## Estaduais

Oito estaduais possuem **imagem local** específica: Paulista, Carioca, Mineiro, Gaúcho, Paranaense, Catarinense, Goiano e Alagoano. Outros quatro — **Baiano, Cearense, Pernambucano e Amazonense** — usam, quando há conexão, **ilustrações de troféus publicadas por Guigoma (Gmttos) no Wikimedia Commons** sob licenças Creative Commons, sem modificações. A CDN não está embutida no app e pode ficar indisponível; nesse caso, `TacaCompeticao` mantém a silhueta original do A JOIA. Essas ilustrações **não são fotos oficiais** das federações. Créditos individuais, links e licenças estão em `estaduais-fontes.json`.

**Sergipano e Paraense** permanecem com fallback original: os arquivos encontrados com bandeiras estaduais não comprovam reproduzir o troféu do campeonato. Não confundimos esse material com imagem oficial. A afirmação de cobertura do catálogo acima não incluía estaduais: há um erro anterior na construção desse catálogo (`ESTADUAIS` contém strings). Essa cobertura não significa que todos os troféus sejam fotografias reais.
