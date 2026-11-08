# Cenas da carreira — primeiro lote visual

Implementação das três prioridades aprovadas após a varredura: copas, origens e preparação do jogador no modo rápido.

## Conteúdo

18 cenas originais geradas com OpenAI, reunidas em três arquivos locais WebP:

- **Copas (284.922 bytes):** estádio regional, túnel, semifinal sul-americana, final sul-americana, arena europeia e arena mundial.
- **Origens (388.568 bytes):** várzea, quadra de futsal, academia da base, futebol escolar, praia e tradição familiar. As 12 origens usam famílias coerentes; escola de goleiros aproveita a nova arte de goleiros do pacote de treinos.
- **Treinos (262.272 bytes):** nutrição, vídeo/análise, academia, velocidade, bola parada e goleiros. Mental e recuperação reutilizam os ambientes próprios existentes.

Total: 935.762 bytes para 18 cenas, sem chamadas externas durante o jogo. As imagens são fictícias, sem marcas nem textos incorporados. Créditos e origem dos arquivos em `arte/colecoes/CREDITOS.md`.

## Aplicação

`CenaFotografica.jsx` exibe uma única célula de cada coleção em SVG. Mantém proporção com `preserveAspectRatio`, sem esticar nem exibir as células vizinhas; o foco do recorte muda para várzea, futsal, base e escola. Os PNGs originais foram preservados no ambiente de geração, sem serem enviados pelo jogo.

`direcaoCenas.js` relaciona o conteúdo à imagem. Nutrição não usa mais foto de fisioterapia; análise não usa apenas gramado; força e velocidade recebem contextos próprios. Em copas, quartas de final não são confundidas com a final. Semifinal e final sul-americanas têm imagens distintas; finais europeias e Mundial usam seus ambientes. O cenário estadual continua regional.

- `CriacaoCarreira`: imagens na escolha de origem, com seleção por um clique e rerolls preservados.
- `DesafioTemporada`: imagens conforme o desafio de OVR, sem mudar riscos, ganhos ou duração da animação.
- `TreinosPretemporada`: imagens conforme conteúdo e posição do atleta; goleiros têm contexto próprio.
- `CopaEscolha`: cenário atrás das informações e das escolhas, aplicado tanto ao jogador quanto ao treinador. Temas, probabilidades, adversários, animação curta e persistência permanecem no fluxo existente.

Nenhum clique ou nova tela foi acrescentado. Identificador inicial: **Cenas da carreira**.

## Verificação

346 testes de lógica aprovados, incluindo quatro novos testes de contexto e peso dos arquivos. 17 cenários existentes de criação/treinos/desafios/copas aprovados e seis cenários novos em 320/1366 px aprovados. Os novos testes verificam decodificação das imagens, recorte de uma célula por vez, origem futsal, seleção em um clique, efeitos de treino preservados e escolhas inteiras em semifinal/finais. Build de produção aprovado. Uma tentativa sem servidor de prévia foi descartada; a execução válida manteve servidor e testes no mesmo processo supervisor.

Logs: `/tmp/cenas-carreira-full-unit.log`, `/tmp/cenas-carreira-browser.log`, `/tmp/cenas-carreira-browser-valido.log`, `/tmp/cenas-carreira-build-final.log`.

## Demais oportunidades

Loja, novas poses dos minigames, seleção, premiações, museu, transferências e vínculos continuam no mapa de próximos lotes. Não foram apresentados como entregues nesta etapa. Ver `docs/planejamento/OPORTUNIDADES_IMAGENS_2026-11-08.md`.
