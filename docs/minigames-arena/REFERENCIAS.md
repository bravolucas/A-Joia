# Revisão visual dos minigames — 6 de novembro de 2026

## Problema observado

A falta posicionava a base do gol em y=76, mas o gramado começava em aproximadamente y=101. A foto genérica continuava atrás da trave, dando a impressão de um gol na arquibancada. Limitar a altura dos SVGs internos para encaixar os botões também distorcia a relação entre o fundo, os personagens em HTML e a bola. No celular, a cena do pênalti havia ficado com cerca de 130 px de altura.

## Busca online e referências

Consultados os READMEs, catálogos públicos, estrutura dos projetos e capturas disponíveis. Nenhum desses projetos foi instalado ou executado, e nenhum código ou asset foi copiado.

| Fonte gratuita / aberta | O que oferece | Uso nesta revisão |
|---|---|---|
| [Phaser e exemplos](https://github.com/phaserjs/phaser) — [catálogo](https://phaser.io/examples) | Engine MIT; exemplos de movimento, curvas, interação e cenas | Referência para separar coordenadas da cena e tamanho de apresentação; animação leve com RAF existente |
| [PixiJS](https://github.com/pixijs/pixijs) — [exemplos](https://pixijs.com/8.x/examples) | Renderização 2D, composição de sprites, primitivas e SVG; MIT | Referência para tratar fundo, jogadores e bola como uma cena que escala inteira |
| [Soccer.js](https://github.com/Mati365/Soccer.js) | Jogo aberto inspirado em HaxBall; README com MIT e capturas | Leitura clara do campo, posição dos participantes e alvos; não reproduzir seu visual antigo |
| [Penalty Night](https://github.com/Iknowitsimpossible/penalty-night) | Pênaltis em Three.js, toque/teclado e indicação de defesa | Referência de interação e enquadramento; licença de redistribuição não confirmada, sem reaproveitamento |
| [Penalty Goal](https://github.com/maxniu97/penalty-goal) | Projeto Three.js com capturas de pênaltis | Comparação de proporções e câmera; sem reaproveitamento |
| [FreeKick3](https://github.com/anttisalonen/freekick3) | Simulador aberto de futebol | Alternativa pesquisada; não integrada ao modo rápido |
| [Kenney Starter Kit](https://github.com/KenneyNL/Starter-Kit-3D-Platformer) | Kit gratuito Godot, MIT | Consultado como alternativa de assets; não é específico de futebol e não foi integrado |

Tentativas de abrir o Sports Pack no domínio Kenney e a busca Soccer no OpenGameArt foram bloqueadas pela política de rede. Não houve download dessas fontes nem suposição de licença. Pesquisas adicionais no GitHub cobriram soccer, penalty, free assets, CC0, Three.js e Phaser.

## Implementação

- `CenarioMini.jsx`: geometria comum do gramado, gol, área e rede; horizonte calculado a partir da linha do gol. O estádio e o gramado fotográficos locais têm recortes separados, com limites explícitos. As linhas e a trave ficam acima do piso, independentemente da câmera.
- A arte fotográfica e os recortes de jogadores são do acervo já existente do A JOIA. Créditos originais continuam em `arte/CREDITOS.md`. Nenhum asset externo novo.
- Passe, cruzamento e interceptação usam campo de leitura tática; cobranças, cabeceio e reflexo usam perspectiva frontal. Não sobrepor uma câmera aérea a uma arquibancada fotografada de frente.
- `QuadroMini` mede o cabeçalho real e distribui a altura restante entre confronto, cena e controles. `SuperficieMini` aplica uma única escala a todo o sistema de coordenadas, respeitando largura e altura disponíveis. Removidos os limites anteriores que encolhiam os SVGs separadamente.
- Pênalti: trave com proporção mais próxima de um gol, goleiro proporcional, alvos e bola alinhados; visão do goleiro identificada corretamente.
- Falta: prévia do alvo ao passar o mouse ou focar pelo teclado, escolha com um toque, curva da bola animada por 720 ms, sombra e giro. Movimento reduzido chega diretamente ao destino. O replay identifica a direção escolhida.
- Cruzamento: trajetória curva animada. Demais jogos recebem a mesma base de campo e apresentação.
- Resultado dos novos jogos ocupa uma faixa pequena, preservando a visão do lance. Ações continuam acessíveis sem rolar para o fim da página.
- Passe: sorteio mantém de dois a quatro companheiros e adversários, distribuídos em corredores e profundidades separados. Evita atletas sobrepostos; números no campo correspondem aos botões. A geometria visível é a mesma usada para calcular a interceptação.
- Sem nova engine, dependência ou serviço remoto. Fórmulas de chance, atributos e recompensas preservados; a distribuição espacial do passe foi ajustada para ficar legível.

## Verificação

`tests/arena-minigames.spec.mjs` verifica os oito jogos em 320×568 e 1366×768: cena legível, base do gol no gramado, coordenadas dentro da área disponível e botão de continuar dentro do viewport. Um caso adicional verifica prévia do alvo pelo teclado, posição intermediária da curva, chegada ao destino e avanço manual antes do timer automático.

O teste foi adicionado à validação contínua. Um teste de lógica também cobre distâncias mínimas entre participantes, inclusive nos extremos do sorteio. Capturas desta pasta representam a implementação final; imagens de referência externas ficam apenas em `/tmp`, fora do produto.
