# Phaser e PixiJS no A JOIA inteiro

Pesquisa de 6 de novembro de 2026. Estado do jogo: revisão dos minigames publicada em `06f9e97`. Este documento contém propostas, não funcionalidades implementadas.

## O que foi examinado

Catalogado o índice público de 2.486 exemplos do Phaser e lidos 24 arquivos selecionados: nove do Phaser e quinze da documentação atual do PixiJS. O manifesto `phaser-pixi-fontes.json` registra URL, caminho, data e SHA-256 de cada fonte consultada. Os IDs S01–S24 abaixo apontam para esse manifesto.

Também foram inspecionados `App.jsx`, `ModoRapido.jsx`, `CriacaoCarreira.jsx`, `PrimeiroClube.jsx`, `CarreiraTecnico.jsx`, `TreinosPretemporada.jsx`, `DesafioTemporada.jsx`, `LojaJogador.jsx`, `Museu.jsx`, `museu.js`, `Personalizacao.jsx`, `CenarioMini.jsx` e `som.js`. Não foram instaladas engines, executados os exemplos ou incorporados assets/código externos. A pesquisa não alterou o produto publicado.

## O que já existe e deve ser aproveitado

O jogo já tem criação em capítulos, camisa com nome/número, bandeira animada, seleção de posição, contrato do primeiro clube, anúncio de transferência, 60 treinos, revelação animada de OVR, oito minigames, sons, confete, Lottie, taças agrupadas, coleção permanente, quatro visuais desbloqueáveis, compras diretas, UPs, notícias e exportação de cartas/galeria em PNG.

Assim, “adicionar confete”, “criar uma loja”, “animar a bandeira” ou “exportar uma carta” repetiria entregas existentes. As oportunidades são tornar a consequência das decisões mais legível, conectar as cenas e dar personalidade aos acontecimentos importantes.

## As 24 oportunidades

As avaliações de impacto e esforço são estimativas de produto, não medições de retenção. P1 é o primeiro lote recomendado; P2 amplia a experiência; P3 depende de investimento adicional em arte ou dados.

### Entrada e identidade

**1. Menu que acompanha a carreira — P2, impacto alto, esforço médio.** A camisa, o escudo e a luz de fundo acompanham o clube atual. O acesso a “Continuar” permanece dominante; troféus e peças recentes aparecem como detalhes do cenário. O menu atual já oferece continuar e fundos: a adição é personalização contextual e movimento discreto. Fontes S10/S12/S21; integração em `App.jsx` e `Personalizacao.jsx`.

**2. Apresentação da camisa com tecido e luz — P2, impacto alto, esforço médio.** Melhorar a camisa existente com inclinação suave, sombra e passagem de luz, mantendo nome/número legíveis. A animação de embrulhar continua no avanço da primeira etapa; uma malha pode enriquecer a dobra. É evolução da apresentação atual, sem acrescentar confirmação. Fontes S10/S09; `CriacaoCarreira.jsx` e `VisualFutebol.jsx`.

**3. Bandeiras com movimento de tecido — P3, impacto médio, esforço médio.** Substituir o balanço rígido da bandeira por deformação moderada da imagem, com mastro e borda fixos. A animação atual já existe; a mudança é a qualidade do movimento. Sem simulação física de tecido prometida e sem efeito permanente que distraia a escolha. Fontes S11/S24; `CriacaoCarreira.jsx`.

**4. Campo que explica a posição — P2, impacto alto, esforço médio.** Selecionar MC ilumina a faixa central; SA destaca o espaço atrás do atacante; ME/MD e alas mostram seus corredores. Uma frase explica o papel, mantendo avançar na mesma tela. Aproveita o campo existente e ajuda a distinguir as posições adicionadas. Fontes S12/S15; `CriacaoCarreira.jsx`.

### Decisões e temporada

**5. Cartas de treino com resposta tátil — P2, impacto médio, esforço baixo/médio.** As três cartas atuais recebem entrada sincronizada, leve inclinação no foco e realce dos ganhos. Tocar continua escolhendo e jogando imediatamente. Os efeitos ocorrem em paralelo à ação; não há arrastar obrigatório ou segundo toque para confirmar. Fontes S04/S05/S10; `TreinosPretemporada.jsx`.

**6. Evolução de OVR com uma linguagem visual única — P2, impacto alto, esforço médio.** Usar o mesmo padrão de contagem, cor e impacto em desafio, treino, resumo e técnico. Ganho, estabilidade e perda devem ser distinguíveis por texto e forma. A animação acompanha o resultado salvo; pular chega ao mesmo valor final. O desafio atual já tem revelação e contador. Fontes S03/S08/S09; `DesafioTemporada.jsx` e painéis de resumo.

**7. Retrospectiva curta da temporada — P1, impacto muito alto, esforço médio.** Montagem de até três fatos reais: preparação escolhida, momento decisivo e resultado esportivo. Escudo, contadores e manchete entram em sequência curta, com continuar disponível desde o início. Usar `card.pretemporada`, `card.momentos`, títulos e estatísticas existentes; se houver apenas um fato relevante, mostrar um. Fontes S02/S03/S23; `TelaResumo` em `ModoRapido.jsx`.

**8. Manchetes que valorizam os acontecimentos — P2, impacto alto, esforço médio.** Transformar as notícias já calculadas em duas ou três capas curtas, com foto contextual, ano e clube. Título inédito, volta por empréstimo, recorde ou recuperação ganham tratamentos distintos. Continuam no resumo, sem janela obrigatória adicional. Não inventar entrevista, placar ou rival que o save não registrou. Fontes S12/S23; `noticiasDaTemporada` e `TelaResumo`.

**9. Decisão do técnico com uma prévia visual — P1, impacto muito alto, esforço médio.** A única escolha de pré-temporada é acompanhada de uma pequena prancheta: mudança de esquema desloca as peças; contratação destaca um jogador; aposta na base mostra entrada de um jovem. Os bônus descritos precisam corresponder à opção real. A escolha continua iniciando a simulação, sem administração de elenco. Fontes S02/S12/S15; `ct-quick-decision` em `CarreiraTecnico.jsx`.

**10. Trilha visual dos marcos da carreira — P2, impacto alto, esforço médio.** Exibir os marcos de traço já existentes como etapas conquistadas, ligadas por uma linha. O jogador entende o que o próximo marco oferece e como sua identidade se formou. A escolha de traço existente abre no ponto correto; nenhuma nova árvore obrigatória ou gerenciamento paralelo. Fontes S08/S12; `TelaTraco` e histórico de carreira.

### Clubes, propostas e apresentações

**11. Mapa das ofertas — P2, impacto alto, esforço médio/alto.** As três propostas existentes aparecem vinculadas a países num mapa simples. Tocar num cartão destaca a rota e mantém clube, liga, salário e papel em texto. Não interfere na coerência de OVR/momento das ofertas. Começar por países: um mapa de cidades exigiria coordenadas novas e verificadas. Fontes S12/S15/S21; `CartaoEvento` e cartões do técnico.

**12. Assinatura e anúncio com direção de cena — P2, impacto alto, esforço médio.** Melhorar as cenas existentes com luz seguindo a camisa, entrada do escudo, assinatura e enquadramento consistente. O clube e os dados vêm da proposta aceita; a sequência não sorteia novos termos. Preservar pular, resultado único e acesso ao continuar. Fontes S01/S02/S09/S10; `PrimeiroClube.jsx`, `AnuncioClube` e `ApresentacaoGrande`.

**13. Empréstimo com ida e retorno claros — P2, impacto alto, esforço baixo/médio.** Mostrar clube de origem → destino, duração de um ou dois anos e, no retorno, o caminho inverso com a evolução alcançada. É uma apresentação dos dados já existentes, usando o mesmo fluxo de transferências. Não recriar painéis duplicados de empréstimo. Fontes S02/S03; anúncios e ficha do jogador.

**14. Confrontos com abertura curta — P2, impacto médio/alto, esforço médio.** Antes de um lance, os dois escudos entram lateralmente e a fase aparece em uma faixa, durante poucos décimos de segundo. Usar o adversário e a fase atuais, já exibidos no cabeçalho. Nenhum botão extra para “entrar na partida”. Fontes S01/S04/S12; `CabecalhoMomento` e `QuadroMini`.

### Loja e progresso permanente

**15. Compra com consequência visível — P1, impacto muito alto, esforço baixo/médio.** Após um único toque em Comprar, o saldo confirma a diferença e o ícone do item segue para o local de itens/UPs ativos. Um retorno curto mostra “Ativado por 1 temporada” ou “Permanente”. A loja já tem compra direta e mensagem; a adição conecta visualmente preço, aquisição e efeito. Fontes S03/S04/S12; `LojaJogador.jsx` e loja do técnico.

**16. Três espaços claros para UPs — P1, impacto alto, esforço médio.** Evoluir o contador “0/3” para três espaços compactos com ícone, efeito e temporadas restantes. Na compra, o espaço é preenchido; na expiração, fica livre com aviso breve. Dados vêm de `upsAtivosJogador` e do ano real, sem sugerir bônus ainda ativo após expirar. Fontes S03/S08/S16; loja, ficha e preparação.

**17. Novas peças do museu em destaque — P1, impacto muito alto, esforço médio.** Uma faixa mostra o que a carreira acabou de acrescentar: taça inédita, nova camisa ou feito. Distinguir uma nova peça de outra cópia de uma taça já obtida. Reunir várias novidades em uma única faixa, com atalho opcional ao museu. Registrar itens vistos sem marcar todo o acervo antigo como novo após a atualização. Fontes S02/S12/S17; `registrarMuseu`, `Museu.jsx` e fechamento da temporada.

**18. Vitrine da peça selecionada — P2, impacto alto, esforço médio.** Ao abrir detalhes, iluminar a taça ou a camisa, ampliar discretamente a arte e mostrar quantidade/anos com entrada curta. As peças da grade permanecem estáticas; só a selecionada recebe o efeito. Uma imagem plana pode ganhar perspectiva e brilho, mas rotação real em 360° exigiria modelo 3D. Fontes S09/S10/S19; `Detalhe` em `Museu.jsx`.

**19. Atlas do legado — P3, impacto alto, esforço alto.** Um mapa reúne países de clubes defendidos, ligas conquistadas e lacunas da coleção. Selecionar um país filtra as peças e carreiras relacionadas. Depende de uma camada geográfica consistente sobre clubes/competições; não inferir cidades ou presença em países sem registros. Fontes S12/S15/S21; `museu.js` e `Museu.jsx`.

### Premiações, memória e qualidade geral

**20. Celebrações com hierarquia — P2, impacto alto, esforço médio.** Fazer primeira taça, campeonato recorrente, título continental, Copa do Mundo e Bola de Ouro terem intensidade e identidade próprias. O agrupamento ×2/×3 e os anos continuam. Usar o confete e o áudio existentes, com duração curta e sem multiplicar pop-ups por conquista menor. Fontes S02/S09/S22; `SlideTitulo`, `SlideBolaDeOuro` e `PopUpTitulo`.

**21. Carta final como pôster de carreira — P2, impacto alto, esforço médio.** A exportação PNG já existe. Evoluir os templates com clubes principais, pico de OVR e três marcos reais, em versões de jogador e técnico. Caso o pôster tenha elementos Pixi, usar extração de textura; para a carta DOM atual, manter o exportador existente. Fonte S18; `TelaFim` e galeria, preservando os dados agrupados.

**22. Mais poses para cenas humanas — P3, impacto muito alto, esforço alto e dependente de arte.** Corrida curta, preparação do chute, salto, queda e comemoração em sequências de imagens bem produzidas. O Pixi oferece `AnimatedSprite`; ele não cria essas poses automaticamente. O acervo atual tem recortes de espera e mergulho, sem uma sequência completa de movimentos. Primeiro produzir/testar os assets; depois animar. Fonte S20; `JogadorCampo` e cenas de apresentação/minigames.

**23. Treino livre e replay opcional — P2 para treino, P3 para replay fiel; impacto alto.** Praticar os oito desafios fora da carreira, sem gastar salário ou mexer no save. Replays futuros podem repetir um lance real, mas precisam registrar entrada, geometria/seed e tempo da ação. Hoje `card.momentos` guarda tipo, minigame, acerto e título; isso permite retrospectiva textual, não reconstrução exata de um chute antigo. Fontes S01/S02/S20; componentes atuais dos lances e novo acesso opcional.

**24. Transições, carregamento e qualidade adaptativa — base do primeiro lote, impacto alto, esforço médio.** Preparar somente as imagens da próxima tela, manter a interface estável enquanto carregam e sincronizar entrada/saída dos elementos. Em telas densas, limitar efeitos à peça em foco. Menus, loja e museu mantêm controles HTML; uma eventual camada Pixi é carregada sob demanda, pausada em segundo plano e destruída ao sair. Fontes S01/S06/S07/S13/S14/S19/S21; `App.jsx` e serviços visuais compartilhados.

## Primeiro lote recomendado

1. **Retrospectiva da temporada (7):** maior ganho de imersão com os dados existentes.
2. **Compra e UPs com retorno visual (15/16):** torna salário e melhorias mais fáceis de entender.
3. **Novas peças da coleção (17):** conecta cada carreira à coleção permanente.
4. **Decisão visual do técnico (9):** dá significado à escolha única sem reintroduzir gerenciamento.
5. **Menu contextual (1):** usa o clube e a história salvos para melhorar a primeira impressão.

O item 24 é infraestrutura compartilhada desse lote. As propostas 2/3/11/18/22 ficam para uma rodada de direção de arte após validar o conjunto.

## Como aplicar sem perder o modo rápido

Animações de interação devem durar aproximadamente 150–400 ms; consequências simples, 400–900 ms; a retrospectiva opcional, no máximo cerca de 2–3 segundos. São metas de desenho a validar, não tempos já medidos. Continuar/pular permanece visível desde o início. Não adicionar toques de confirmação, arrastar obrigatório, espera artificial ou tarefas diárias obrigatórias.

Som e movimento reduzido respeitam as configurações existentes. O resultado esportivo e a compra são confirmados uma vez pelo domínio; o efeito visual lê essa confirmação. Pular, sair, trocar de aba ou recarregar não pode comprar, sortear ou premiar novamente. Nenhum replay pode fabricar minuto, placar, adversário ou trajetória ausente no registro.

## Escolha técnica

**React e controles HTML continuam sendo a base.** Vários padrões dos exemplos podem ser adaptados com CSS/SVG/Web Animations já compatíveis com o produto. Para uma futura vitrine, mapa ou cena 2D com muitos elementos, PixiJS carregado sob demanda é uma opção. Phaser ganha valor em um módulo de treino com cenas, física, colisão e áudio sincronizados; não há justificativa para mover formulários, loja e navegação inteira para a engine.

Não instalar as duas engines apenas para reproduzir efeitos simples. Um primeiro protótipo deve comparar ganho visual, peso entregue, comportamento em celular e acessibilidade com a solução atual. O projeto já usa Lottie, canvas-confetti e html-to-image; respeitar essas responsabilidades evita três sistemas diferentes fazendo a mesma coisa.

Detalhes encontrados no código consultado:

- `PerspectiveMesh` do Pixi deforma os quatro cantos de uma textura plana. Dá profundidade visual a cartas; não produz um atleta ou uma taça 3D.
- `Assets.backgroundLoadBundle` prepara conjuntos de imagens, mas `loadBundle` continua sendo a confirmação de disponibilidade. Não exibir progresso de download fictício.
- O exemplo de áreas de toque explica que `hitArea` pode ignorar a máscara visual. Na adaptação, uma região escondida nunca deve continuar recebendo toques.
- `cacheAsTexture` precisa ser atualizado quando uma composição muda. Saldo, contador de troféus e durações de UPs não podem ficar congelados numa textura antiga.
- `AnimatedSprite` depende de frames/spritesheet previamente produzidos. Os personagens demonstrativos dos exemplos não são artes de futebol prontas para o A JOIA.
- A coleção Phaser inclui exemplos de gerações diferentes; alguns ainda usam APIs antigas de partículas, enquanto filtros recentes usam outras APIs. Escolher e fixar a versão antes de reutilizar qualquer código. A pesquisa atual usa padrões, sem importação direta.
- Os núcleos Phaser e PixiJS têm licença MIT verificada. Assets, plugins e exemplos específicos precisam de sua própria conferência se forem incorporados. As imagens demonstrativas não foram tratadas como um banco de arte livre para o jogo.

## Fontes primárias

- [Phaser — exemplos e código-fonte](https://github.com/phaserjs/examples/tree/master/public/src)
- [Phaser — timeline de acontecimentos](https://github.com/phaserjs/examples/blob/master/public/src/time/timeline/run%20timed%20events.js)
- [Phaser — contador animado](https://github.com/phaserjs/examples/blob/master/public/src/tweens/counter%20tween.js)
- [PixiJS — exemplos atuais](https://github.com/pixijs/pixijs.com/tree/main/docs/examples)
- [PixiJS — cartas em perspectiva](https://github.com/pixijs/pixijs.com/blob/main/docs/examples/mesh_perspective_3d.js)
- [PixiJS — carregamento por conjuntos](https://github.com/pixijs/pixijs.com/blob/main/docs/examples/assets_manifest_bundles.js)
- [PixiJS — animações em spritesheet](https://github.com/pixijs/pixijs.com/blob/main/docs/examples/animated-sprite_spritesheet.js)

As páginas e o código foram consultados; os exemplos externos não foram executados nesta pesquisa. O acesso à API do GitHub foi bloqueado pela política de rede, então a navegação usou diretórios HTML públicos e arquivos raw autorizados. Não foram modificadas configurações de rede.
