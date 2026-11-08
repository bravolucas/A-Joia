# Créditos das imagens

Fotos licenciadas pelo Adobe Stock (licença padrão, conteúdo gratuito) na conta do projeto,
redimensionadas pelo Adobe Photoshop (API) ou recortadas e tratadas no próprio projeto, e convertidas para WebP.

| Arquivo | Adobe Stock ID | Título original | Uso no jogo |
|---|---|---|---|
| refletores.webp | 315920921 | stadium lights and smoke against dark night sky background | Anúncio de contratação |
| confete-dourado.webp | 359746417 | shiny gold glitter confetti golden on black background, 3d rendering | Festa de título e Bola de Ouro |
| estadio-noite.webp | 239375308 | Lights on empty football stadium | Menu inicial |
| estadio-por-do-sol.webp | 285253487 | Soccer stadium, green grass and night sky | Aposentadoria e fim de carreira |
| vestiario.webp | 607270659 | Soccer team uniforms in locker room | Eventos de vestiário, capitão, mentor |
| fisio.webp | 263196654 | Doctor physiotherapist assisting a male patient… | Lesões e recuperação |
| aviao.webp | 341241308 | Night cityscape from airplane two window | Empréstimo, saída, volta para casa, naturalização |
| treino.webp | 284556130 | Football training cone is aligned on artificial grass pitch | Pré-temporada, treino, desafio de OVR |
| mansao.webp | 129999183 | Lit swimming pool and building exterior at night | Fortuna, patrimônio |
| carro.webp | 410686542 | Red Sports Car in Dark | Patrocínio, golpe, patrimônio |
| protesto.webp | 197937420 | Football fans burn the lights and smoke bombs | Protesto da organizada, ódio nas redes |
| casa.webp | 293866842 | Smoke from the chimney of house during sunset | Eventos de família e vida pessoal |
| festa.webp | 237668684 | Blurred concept night scene in concert party… | Noitada, polêmica |
| sala-apresentacao.webp | 1534097092 | Press conference concept with podium and multiple microphones… | Apresentação oficial (sala de imprensa) |

A licença do Adobe Stock permite uso em projetos, mas não a redistribuição das imagens isoladas
(por exemplo, como banco de imagens). Não reutilize estes arquivos fora do A JOIA.

## Segunda leva

| Arquivo | Adobe Stock ID | Título original | Uso no jogo |
|---|---|---|---|
| tunel.webp | 839152440 | textured soccer game field with entrance to stadium | Estreia, eventos de base/empréstimo |
| torcida.webp | 197600090 | silhouettes of Soccer fans in a match and Spectators at football stadium | Seleção, convocação, clássico |
| lesao.webp | 427520032 | The injured footballer lies on the pitch (recortada) | Lesão grave, eventos de lesão |
| contrato.webp | 1193565407 | Close-Up of Hand Writing with Pen on Document in Low Light Setting | Negociação e assinatura de contrato |

## Taças

O componente `TacaCompeticao` prioriza as imagens de `arte/competicoes/` quando disponíveis e usa os desenhos originais de `tacas.js` como alternativa. O acervo reúne imagens raster de origens creditadas e ilustrações vetoriais originais. Veja `arte/competicoes/CREDITOS.md` e `acervo.json` para identificar cada grupo.

## Outras fotos

| Arquivo | Adobe Stock ID | Título original | Uso no jogo |
|---|---|---|---|
| coletiva.webp | 1534097092 | Press conference concept with podium and multiple microphones | Coletiva de imprensa (Modo Rápido) |

## Tratamento de cor

- coletiva.webp: o original tinha parede azul saturada, fora da paleta. Recebeu um duotone grafite-esverdeado (sombras #0B1310, meios #2C4A3F, luzes #E6EFEA) para conversar com as outras cenas.



## Ícones e bandeiras

- **Ícones** (`icones.js`): [game-icons.net](https://game-icons.net), de Lorc, Delapouite e colaboradores, licença [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), obtidos pelo pacote `@iconify-json/game-icons`. Usados no lugar dos emojis (cartas de treino, desafios, eventos, ritmos, pós-carreira e outros).
- **Bandeiras** (`arte/bandeiras/`): pacote [flag-icons](https://github.com/lipis/flag-icons), licença MIT, formato 4:3.

## Outras bibliotecas visuais

- **Gramado** (`arte/campo.svg`): gerado com [Kyogijo Stadiums](https://github.com/johnmorrisdotca/kyogijo-stadiums), licença MIT, em escala oficial.
- **Confete** das comemorações: [canvas-confetti](https://github.com/catdad/canvas-confetti), licença ISC.
- **Animações Lottie** (opcionais, `arte/animacoes/`): tocadas com [lottie-web](https://github.com/airbnb/lottie-web), licença MIT.

## Sons

- **Efeitos de interface** (`arte/sons/`): [Kenney — Interface Sounds](https://kenney.nl/assets/interface-sounds), licença CC0 (domínio público), pelo espelho [Calinou/kenney-interface-sounds](https://github.com/Calinou/kenney-interface-sounds). Convertidos para MP3 mono.
- **Apito e torcida**: sintetizados no próprio jogo (Web Audio), sem arquivo.

## Dados das ligas

- **Elencos das ligas 2026/27** (quem subiu e quem caiu, Eredivisie, Süper Lig e Liga Profesional): conferidos nos dados públicos do [openfootball](https://github.com/openfootball) (domínio público, CC0). As forças dos clubes são estimativas do próprio jogo.

## Direção visual 2026 — cenários originais

Os cenários em `arte/cenarios/` foram criados para o A-Joia com a ferramenta de geração de imagens da sessão: estádio noturno, sala de imprensa, sala da diretoria e centro de treinamento. Não contêm texto ou marcas de clubes. Os originais PNG foram mantidos em `/workspace/generated_images`, e as matrizes WebP em `arte/originais/cenarios/`; as versões WebP de produção têm 1280 px e variantes móveis de 768 px. A exportação foi feita com ImageMagick, qualidade 82.

Os componentes `VisualFutebol.jsx` (jogadores, retratos, camisas e medalhas) e as três animações em `arte/animacoes/` são desenhos originais criados em código para o A-Joia. Os retratos são fictícios e parametrizados; nomes, números, cores e escudos são aplicados pelo jogo.

Fontes locais em `arte/fontes/`: Inter, Unbounded, Oswald, Playfair Display e Rajdhani, obtidas pelos pacotes Fontsource 5.3.0, sob SIL Open Font License. Os textos de licença acompanham os arquivos. Não é necessária conexão com Google Fonts.

O impacto da bola e da rede é sintetizado por Web Audio em `som.js`, sem amostras externas, e respeita a preferência de som do usuário.

## Loja do jogador — novembro de 2026

`loja/vestiario-premium.webp`: arte original gerada com OpenAI Image Generation para o A JOIA, sem marcas, otimizada em WebP (cerca de 80 KiB). Canva e Adobe não foram usados nesta atualização. Os cartões reutilizam as fotos já creditadas acima.

## Preparação do jogador — novembro de 2026

`cenarios/equipamentos-premium.webp`, `cenarios/recuperacao-premium.webp` e `cenarios/mental-premium.webp`: três artes originais geradas com OpenAI Image Generation para o A JOIA, sem marcas ou pessoas. Conversão WebP, qualidade 80; aproximadamente 133–145 KiB cada. Aplicadas à loja e a eventos de treino, saúde e concentração. Originais mantidos no workspace de geração. Canva e Adobe não utilizados nesta atualização. Gramado, luz e sombra dos minigames são vetores SVG do próprio projeto.

## Personagens realistas — novembro de 2026

`personagens/{goleiro,jogador,adversario,apresentacao,dirigente}.webp`: cinco personagens fictícios originais gerados com OpenAI Image Generation, em WebP com transparência preservada. Sem marcas. Substituem os desenhos de pessoas nos minigames e na apresentação grande. Uniformes dos sprites são fixos (verde e azul); a camisa central da apresentação continua dinâmica por clube, nome e número. As imagens são estáticas; animações de deslocamento e mergulho continuam no código. Originais PNG mantidos no workspace de geração.

## Criação por capítulos

`criacao/inicio.webp` e `criacao/bairro.webp`: artes originais geradas com OpenAI, vestiário de início de carreira e campo de bairro. Sem uso de capturas ou marcas de PES. Camisa/nome são SVG dinâmico; caixa de presente e bandeira animadas em CSS. Cartas combinam essas imagens com cenários já creditados de treino, imprensa e preparação mental.

## Primeiro contrato da base

`criacao/primeiro-contrato.webp`: arte original gerada com OpenAI Image Generation. Jovem fictício assinando contrato no CT, com família ao fundo; sem marcas ou clubes reais na fotografia. Escudos e camisa aplicados dinamicamente pelo jogo. Assinatura decorativa, carimbo e movimentos em SVG/CSS.

## Goleiro em mergulho

`personagens/goleiro-mergulho.webp`: nova pose de ação gerada com OpenAI Image Generation a partir do goleiro fictício existente. Transparência preservada. Espelhamento em SVG para defesa à esquerda; pose de espera mantida antes da cobrança.

## Bola em 3D

- [Zdog](https://github.com/metafizzy/zdog) 1.1.3, de David DeSandro — licença MIT. Usado em `src/comum/Bola3D.jsx`.
