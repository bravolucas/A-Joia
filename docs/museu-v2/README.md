# Museu: identidade, marcas da carreira e campanhas internacionais

A entrada apresenta automaticamente a camisa de maior legado, o troféu de maior importância e um feito histórico ou a melhor marca registrada em uma temporada. A curadoria manual e os favoritos continuam disponíveis. Gols, assistências e defesas máximos vêm das temporadas do save.

Na sala das camisas, cada peça fica centralizada e maior. A prateleira inferior reúne miniaturas apenas dos títulos de clube conquistados na passagem, agrupados por competição. Uma passagem sem títulos mantém a prateleira vazia com a informação correspondente.

A camisa do Brasil usa uma recriação fotográfica baseada no modelo Nike 2024/25, com fundo removido e versões de 512/1024 px. As outras seleções usam tecido fotográfico, cores e padrões próprios inspirados nos modelos nacionais, incluindo listras da Argentina e Paraguai, xadrez da Croácia e faixa diagonal do Peru. São representações comemorativas; o jogo não atribui um modelo de uniforme a cada ano quando o save não guarda esse dado.

Saves completos distinguem o técnico contratado pelo clube ou pela seleção da segunda carreira de treinador do jogador. Os dois técnicos aparecem como pessoas do acervo e permanecem no arquivo de encerramento.

Há 12 retratos adicionais: seis companheiros e seis técnicos. A escolha é estável pelo nome e papel, com distribuição sem repetição nos sete primeiros personagens de cada grupo. Os retratos são fictícios. Convite de gala e apito de treinamento ampliam os objetos comemorativos do acervo.

A taça intercontinental recebeu uma versão fotográfica original com colunas douradas, globo e pedestal. A Bola de Ouro foi recortada para retirar margens vazias, alinhada ao fundo da vitrine e apoiada em uma base. Ao abrir a Bola de Ouro, o top 3 é extraído da temporada correspondente, tanto do modo rápido quanto do completo. O arquivo de encerramento preserva esses dados. Saves antigos sem o ranking informam a ausência.

Segundo e terceiro lugar na Bola de Ouro têm apresentação própria em prata/bronze, posição em destaque, texto sobre o reconhecimento e a frustração, além do pódio salvo. Confetes e exibição de troféu conquistado ficam reservados ao vencedor.

## Seleções

- No modo rápido, todos os continentais usam o mesmo fluxo de jogos da Copa: três partidas de grupos, classificação e mata-mata, final decisiva e retomada do resultado salvo.
- Eurocopa, Copa Africana e Copa da Ásia começam o mata-mata nas oitavas; Copa América e Copa Ouro nas quartas; Oceania na semifinal. A Oceania ganhou sete adversários adicionais e bandeiras do pacote flag-icons (MIT).
- Adversários continentais pertencem à confederação do jogador. O modo completo também usa esse filtro e não repete adversários de grupo; a primeira eliminatória, antes pulada, foi corrigida.
- No rápido, convocados elegíveis têm quatro amistosos em anos de torneio e seis nos demais anos, com placares, gols e assistências limitados aos gols da equipe. Os amistosos têm estatísticas próprias no elenco e entram uma vez nos acumulados de seleção, sem conceder títulos.
- No completo, novas janelas de amistosos entram na agenda dos convocados. Continentais também abrem o motor de partidas na simulação por temporada. Números de copas concluídas usam as partidas registradas e somam aos amistosos, sem novo sorteio de gols.
- Marcas históricas de Copa do Mundo ignoram os novos continentais jogáveis e os amistosos.

## Referências visuais

- [Modelo Nike Brasil I 2024/25](https://www.nike.com.br/camisa-nike-brasil-i-2024-25-jogador-masculina-028567.html).
- [Coleção de seleções Nike 2024](https://about.nike.com/en/newsroom/collections/nike-national-federation-kits-2024).
- [Uniformes da França — FFF](https://www.fff.fr/article/12130-les-nouveaux-maillots-des-equipes-de-france.html).
- [Uniformes da Alemanha — DFB](https://www.dfb.de/news/detail/dfb-und-adidas-praesentieren-neues-heim-und-auswaertstrikot-259578).
- [Referência da Copa Intercontinental — FIFA](https://inside.fifa.com/official-documents/annual-report/2024/2024-at-a-glance/fifa-intercontinental-cup-2024).

Novas artes e tratamentos feitos com Adobe Firefly/Photoshop. As referências não constituem patrocínio nem atribuição de autoria oficial às recriações. Nomes e marcas pertencem aos respectivos titulares.

## Validação

Testes de lógica cobrem confederações, formatos, títulos corretos, placares e participações, contagem de seleção, arquivos de pódios, distribuição de retratos e prateleiras. Testes no navegador cobrem celular/desktop, imagem carregada, camisa centralizada, ausência de taças indevidas, pódio por edição, cerimônias distintas, partidas continentais e retomada.

Conferência local: build do GitHub Pages aprovado; 52 testes de integração de lógica aprovados após a revisão de contagens; cenários de museu/cerimônia/seleção verificados em 320, 390 e 1366 px, incluindo os dois continentais no motor do modo completo. A validação integral e a publicação ficam registradas após o GitHub Actions.
