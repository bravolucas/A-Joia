# Jornada com memória — implementação

Escopo: itens selecionados pelo usuário. Recursos existentes foram ampliados quando já havia uma base; não foi feita migração para Phaser/PixiJS nem acrescentada dependência.

## Cobertura

| Item | Entrega |
| --- | --- |
| 12 | Escolhas registradas geram ecos posteriores, limitados e sem clique obrigatório. |
| 13 | Faixa de preparação, campanha e fechamento nos dois modos. |
| 21 | Identidade, desafios e primeiros feitos específicos para as 15 posições. |
| 26 | Troca real de posição compatível, prévia do OVR ponderado, penalidade temporária e histórico preservado. |
| 23 | Seis assinaturas por comportamento repetido; apenas uma ativa. |
| 25 | Adaptação limitada por idioma, país, retorno e reencontro. |
| 27 | Veterano troca velocidade por passe, defesa ou influência de mentor, dentro do potencial. |
| 30 | Primeiros feitos por função registrados no museu. |
| 31 | Rival guarda resultados e encontros efetivamente registrados. |
| 32 | Até três parceiros fictícios persistentes, com rota própria, conexão e bônus limitado de reencontro. |
| 33 | Orientador da base acompanha três momentos; eventual evolução a treinador é registrada. |
| 34 | Torcida cita títulos, retornos e rupturas reais da carreira. |
| 35 | Contexto de antigo clube e celebração contextual em lances registrados. |
| 36 | Capitania exige permanência, idade, jogos, moral e vínculo. |
| 39 | Mensagens raras de família e mentor, com limite anual. |
| 40 | Dez contextos de despedida, seis painéis originais: base, títulos, homenagem, ruptura, imprensa, vestiário, empréstimo, retorno, aposentadoria e ascensão. |
| 41 | Novos lances guardam adversário, minuto, placar e disputa. Legados sem dados não recebem contexto inventado. |
| 42 | Trajetória da bola, goleiro, impacto na rede e resultado sincronizados; movimento reduzido respeitado. |
| 43 | Cruzamento contextualizado para alas e laterais no desafio existente. |
| 44 | Interceptação própria para defensores no conjunto de minigames. |
| 45 | Pista imperfeita de cobrança, sem determinar automaticamente o lado correto. |
| 47 | Mensagens curtas de estreia, título e reencontro. |
| 51 | Ofertas explicam papel, projeção de jogos, clube, liga e contrato. |
| 52 | Cena de armário e camisa após apresentação, com avanço automático ou imediato. |
| 53 | Empréstimos guardam propósito, expectativa e relatório de jogos efetivos. |
| 54 | Interesse discreto de clubes elegíveis; não garante oferta. |
| 55 | Especialidades e limitações existentes dos empresários preservadas no fluxo simplificado. |
| 57 | Consulta opcional de retorno ao formador, sujeita a condição esportiva. |
| 58 | Peso de idioma, país, fase e projeto nas ofertas, sem eliminar exceções. |
| 59 | Resumo de origem, destino, papel, salário e duração na chegada. |
| 60 | Prioridade única: jogar, títulos ou salário. |
| 62 | Régua usa o mesmo corte do motor de convocação e explicita a incerteza. |
| 63 | Primeira convocação/estreia tem cena própria com bandeira e camisa. |
| 64 | Geração fictícia persistente da seleção, respeitando nacionalidade e idade. |
| 67 | Marcas pessoais no clube e liga; não são apresentadas como recordes históricos reais. |
| 71 | Novos feitos por função e progresso no museu. |
| 72 | Camisas guardam clube, anos, números, posições e principal feito. |
| 73 | Primeiros momentos viram memórias automáticas. |
| 77 | Legado explica rótulos derivados dos dados da carreira. |
| 78 | Álbum permite selecionar até três marcos e baixar PNG. |
| 79 | Condições e progresso visíveis; troféus continuam agrupados. |
| 81 | Loja mantém compra direta e explica efeitos, duração e compatibilidade. |
| 83 | UPs ativos aparecem na preparação sem abrir a loja. |
| 84 | Três aparências adicionais desbloqueadas por trajetória, sem vantagem esportiva. |
| 87 | Até três recomendações acessíveis e compatíveis, sem esconder catálogo. |
| 91 | Herança do jogador explica reputação inicial do técnico, preservando limites. |
| 92 | Filosofia de posse, transição ou pressão dentro da decisão única. |
| 93 | Seis novas cartas com contrapartidas; uma decisão anual permanece. |
| 94 | Encontro só cita mentor cujo vínculo e clube foram registrados. |
| 98 | Componentes novos seguem tipografia, espaçamento, responsividade e diálogos existentes. |

## Modelo de mudanças de posição

A posição muda de fato no estado da carreira, nos pesos do OVR, na produção e na elegibilidade dos desafios. O histórico de temporadas mantém sua posição original. O jogador vê OVR anterior, início da adaptação, prazo e possível ganho antes de aceitar com um clique. Não há conversão entre goleiro e jogador de linha. Ações ficam entre temporadas; adaptação e intervalo impedem trocas repetidas para explorar bônus.

Recuos por idade exigem atributos e idade compatíveis: ATA pode recuar para MEI a partir de 29 anos com passe suficiente; depois há caminhos para MC/VOL. Laterais produtivos podem avançar para meio/ponta; ZAG com passe pode virar VOL; pontas podem trocar de lado. Não há promessa de que toda transição aumente o OVR. Recomendação não substitui a escolha do jogador.

Referências verificadas: dados abertos StatsBomb de escalações registram Kimmich como lateral em 2018/2024 e ala em 2020; Kroos como meia central e volante; Müller como ponta, meia ofensivo e segundo atacante em diferentes contextos. Dados de partidas indicam possibilidades táticas, não provam por si só uma transformação permanente de carreira.

- https://github.com/statsbomb/open-data/blob/master/data/lineups/7534.json
- https://github.com/statsbomb/open-data/blob/master/data/lineups/3788764.json
- https://github.com/statsbomb/open-data/blob/master/data/lineups/3930176.json

Pirlo, Rooney, Giggs, Valencia, Bale, Lahm e Mascherano são referências históricas de repertório para o modelo; as páginas oficiais tentadas nesta sessão retornaram 403 e não são apresentadas como fontes consultadas com sucesso. Despedidas de Totti, Iniesta, Casillas, Messi, Gerrard e Beckham inspiram situações gerais; a arte é original e não representa fotografias desses atletas.

## Persistência e limites

Dados opcionais em `jornada`, inicializados em saves antigos sem trocar a versão do save. Memórias, ecos, rivais e duplas têm limites. Fechamento de temporada, contratos, recompensas e efeitos são idempotentes. Primeiros feitos antigos são recuperados apenas de temporadas disponíveis; parceiros e mentores são identificados como fictícios. A adaptação expira e idiomas aprendidos são persistidos. Bônus de nota da jornada têm teto agregado de 0,14; reencontro concede moral/torcida uma vez por mudança registrada.

Recordes são marcas pessoais nesta carreira. Não se inventam rankings históricos de clube/país. Cenas não alteram contratos; avançar/pular apenas encerra a apresentação. As decisões opcionais de identidade não criam nova obrigação anual.

## Validação

Testes de domínio cobrem compatibilidade, mudança efetiva, atributos/potencial, adaptação, assinaturas, reencontros, idempotência, museu e empréstimos. Testes reais no Chromium cobrem troca em celular/desktop, preferências, UPs, álbum PNG, museu e sequência de transferência. Regressões abrangem criação, OVR, loja, empréstimos, minigames e técnico. Resultado final e publicação registrados em `docs/CONTINUIDADE.md`.

## Continuação: aprofundamento e pendências explícitas

- Taças na despedida são agrupadas por competição com ×N e anos, reutilizando a mesma normalização da vitrine.
- Despedidas/chegada ganharam três atos, câmera suave e atmosferas distintas (homenagem, CT, chuva, coletiva, viagem). A ação permanece disponível; movimento reduzido elimina efeitos. **Ainda são artes estáticas com animação de composição, sem movimento corporal de abraço/aplausos/caminhada.**
- Celebrações têm emblemas e sequências diferentes para primeiro gol, título, defesa/interceptação, passe/cruzamento e respeito ao ex-clube. O efeito de gol foi retirado dos contextos de defesa e reencontro.
- Duplas registram taças juntas, encontros como adversários, rota, transferências e aposentadoria. Um painel opcional mostra conexão, lembranças e clubes. A chegada mostra o parceiro que já estava no destino; o bônus segue idempotente. Quando o parceiro chega por trajetória própria ao clube do jogador, também existe notícia e bônus limitado.
- Núcleo narrativo da seleção ampliado para onze funções, preservando personagens existentes e substituindo os maiores de 37 anos por jovens. **Não é um elenco completo com estatísticas individuais integrado ao motor de todas as partidas.**
- Contra ex-clube há reação opcional: reconhecer a torcida (+2 carinho no clube antigo) ou focar no atual (+2 moral), uma vez por clube/ano. Não é necessário escolher para jogar.
- Continuidade visual ganhou foco visível e regras de leitura em superfícies compartilhadas; novas cenas e resultados foram testados em telas pequenas. **A revisão manual de todas as telas antigas permanece parcial.**

### O que ainda falta do pedido original

1. Animação corporal própria para abraços, caminhada e aplausos; requer poses/recortes animáveis ou clipes novos. As atmosferas não são apresentadas como esse tipo de animação.
2. Recordes históricos reais de clubes/ligas/mundo com fonte, cobertura e atualização definidas. O jogo continua mostrando apenas marcas pessoais verificáveis nos saves.
3. Elenco internacional completo com renovação e estatísticas individuais participando da simulação; nesta etapa o núcleo é narrativo.
4. Auditoria visual manual de todas as telas legadas/pop-ups; os ajustes compartilhados não equivalem a essa cobertura completa.

As interações de dupla e celebrações estão funcionais nesta versão e podem receber repertório adicional sem ser descritas como pendência bloqueadora.

## Atualização posterior — Copa e gestos

A lista de pendências anterior é histórica. A continuação em [ETAPA-COPA-E-GESTOS.md](ETAPA-COPA-E-GESTOS.md) entrega abraço/aplauso/caminhada por quatro poses, elenco individual de 26 atletas nas Copas do Mundo, duas referências históricas verificadas até 2022 e revisão de ficha/gaveta/Copa/chegada. Permanecem: torneios continentais com elenco individual, histórico de clubes/ligas e recorte mundial atualizado, e auditoria visual exaustiva das telas legadas/raras. Não descrever a Copa como integração de todos os torneios internacionais.
