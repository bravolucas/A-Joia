# Auditoria da lista selecionada pelo usuário

Esta tabela corresponde aos **50 itens selecionados** na mensagem extensa do usuário, não às cem sugestões originais. Atualiza relatórios anteriores que resumiam demais as pendências.

**Funcional** significa que existe implementação utilizável no escopo descrito; não é promessa de ausência de bugs ou auditoria manual de todos os caminhos. **Base funcional** identifica solução simplificada com espaço para aprofundamento. **Parcial** identifica cobertura ainda incompleta frente ao escopo discutido. Fontes apontam a implementação; nem toda variação rara possui um teste individual.

| Item | Estado | Entrega e limite | Fonte principal |
| --- | --- | --- | --- |
| 12 | Base funcional | Escolhas geram ecos posteriores limitados; notícias e pequenos efeitos não exigem nova decisão. | jornadaJogador.js · registrarEscolhaJornada/fecharJornada |
| 13 | Funcional | Faixa preparação/campanha/fechamento nos dois modos; novo fechamento é etapa persistida. | JornadaUI.jsx · FasesTemporada |
| 21 | Funcional | 15 funções com identidade, pesos, desafios e feitos próprios ou por família de posição. | posicoesCarreira.js; rapido.js |
| 23 | Funcional | Seis assinaturas por comportamento em temporadas distintas, somente uma ativa. | jornadaJogador.js · ASSINATURAS |
| 25 | Funcional | Adaptação finita por idioma, país, retorno e parceiro; efeitos explicitados. | jornadaJogador.js · registrarTransferenciaJornada |
| 26 | Funcional | Mudança real de função compatível, OVR ponderado, adaptação, intervalo e histórico. | posicoesCarreira.js |
| 27 | Funcional | Veterano troca velocidade por leitura/passe/defesa ou influência, respeitando potencial. | posicoesCarreira.js · reinventarVeterano |
| 30 | Funcional | Primeiros gols, assistências, defesas, recuperações e cruzamentos registrados. | jornadaJogador.js; museu.js |
| 31 | Base funcional | Rival lembra clubes, confrontos e prêmios; memória recente limitada para não crescer sem teto. | jornadaJogador.js · rivalMemorias |
| 32 | Funcional | Duplas têm rota, títulos, confrontos, aposentadoria e reencontro com bônus limitado. | jornadaJogador.js · atualizarDuplas; JornadaUI.jsx |
| 33 | Funcional | Mentor fictício acompanha três fases e pode ganhar um projeto registrado. | jornadaJogador.js · mentor |
| 34 | Funcional | Torcida cita títulos, retornos e saídas controversas efetivamente registrados. | jornadaJogador.js · memoriaTorcida |
| 35 | Funcional | Reação opcional diante de antigo clube, uma vez por clube/ano, com efeito explícito. | JornadaUI.jsx · ReacaoAntigoClube |
| 36 | Funcional | Capitania depende de trajetória/confiança; aceitação é registrada e recusa respeitada no ano. | rapido.js · evento capitao; jornadaJogador.js |
| 39 | Funcional | Mensagens raras de família/mentor; limitadas e reapresentadas no resumo e detalhes. | FechamentoTemporada.jsx; jornadaJogador.js |
| 40 | Base funcional | Dez contextos de saída; abraço/aplauso/caminhada em quatro poses. Ainda há margem para fluidez e mais quadros. | JornadaUI.jsx · CenasClube; arte/jornada/CREDITOS.md |
| 41 | Base funcional | Novos lances têm adversário, fase, minuto e placar do evento; saves antigos não recebem contexto inventado. | rapido.js · contextoMomento; ModoRapido.jsx |
| 42 | Funcional | Trajetória, resultado, goleiro e rede sincronizados nos lances revisados; movimento reduzido. | CenarioMini.jsx; VisualFutebol.jsx; components.jsx |
| 43 | Funcional | Desafio de cruzamento para alas/laterais, companheiro livre e trajetória própria. | LancesCriativos.jsx |
| 44 | Funcional | Interceptação com leitura de três corredores para funções defensivas. | LancesCriativos.jsx |
| 45 | Funcional | Reflexo agora tem três posturas fotográficas do cobrador e pista falível; não exige reflexos extremos. | leituraGoleiro.js; LancesCriativos.jsx |
| 47 | Base funcional | Celebrações diferem por estreia/título/defesa/parceria/reencontro; taça animada com resumo salvo. Não são vídeos. | JornadaUI.jsx · CelebracaoLance; FechamentoTemporada.jsx |
| 51 | Funcional | Oferta explica papel, jogos projetados, clube/liga, salário e duração. | jornadaJogador.js · projetoOferta; JornadaUI.jsx |
| 52 | Funcional | Chegada com armário, camisa, número, objetivo e avanço imediato ou automático. | JornadaUI.jsx · CenasClube |
| 53 | Funcional | Empréstimo tem propósito, expectativa e relatório real de jogos/retorno. | rapido.js; jornadaJogador.js · relatoriosEmprestimo |
| 54 | Funcional | Sondagens de clubes compatíveis são indicadas sem garantir proposta. | rapido.js · interesseMercado |
| 55 | Funcional | Empresário mostra uma vantagem principal e uma limitação compreensível. | JornadaUI.jsx · PainelJornada |
| 57 | Funcional | Sondagem opcional de volta ao clube formador com condição esportiva. | rapido.js · voltarCasa |
| 58 | Funcional | Ofertas ponderam geografia, idioma, fase e projeto sem bloquear exceções. | jornadaJogador.js · pesoProjeto; rapido.js |
| 59 | Funcional | Resumo de transferência reúne origem, destino, papel, salário e duração. | JornadaUI.jsx · jr-resumo-mudanca |
| 60 | Funcional | Prioridade única entre jogar, disputar títulos ou ganhar mais. | jornadaJogador.js · definirPreferenciaMercado |
| 62 | Funcional | Régua usa o corte real de convocação e informa incerteza. | rapido.js · caminhoSelecao |
| 63 | Funcional | Primeira convocação/estreia tem cerimônia, bandeira, camisa e memória. | JornadaUI.jsx · PrimeiraSelecao; jornadaJogador.js |
| 64 | Funcional | 26 convocados persistentes na seleção do atleta, com renovação e estatísticas separadas de Copas e continentais. | elencoSelecao.js; torneioContinental.js |
| 67 | Parcial | Marcas pessoais e recordes observados por clube/liga/universo implementados. Referências reais de Copas até 2022. Ainda falta histórico real abrangente de clubes/ligas e recorte mundial atualizado. | recordesUniverso.js; recordesHistoricos.js; dados/CREDITOS-COPAS.md |
| 71 | Funcional | Museu inclui primeiros feitos e objetivos próprios de funções defensivas/criadoras. | museu.js · FEITOS_MUSEU |
| 72 | Funcional | Camisas guardam clube, anos, números, posições e principal feito da passagem. | museu.js · historia; Museu.jsx |
| 73 | Funcional | Primeiros momentos são salvos automaticamente como memórias. | jornadaJogador.js · primeiro |
| 77 | Funcional | Legado explica rótulos derivados da trajetória, sem depender apenas de vencer. | jornadaJogador.js · legadoNarrativo |
| 78 | Funcional | Álbum permite escolher três marcos, usa escudos/bandeira locais e exporta PNG. | JornadaUI.jsx · AlbumJornada |
| 79 | Funcional | Condições e progresso quantitativo/booleano conhecidos no museu; anos preservados. | museu.js · progressoFeitoMuseu; Museu.jsx |
| 81 | Funcional | Compra direta mantém efeito, compatibilidade e duração antes do clique. | LojaJogador.jsx |
| 83 | Funcional | Bônus ativos e validade ficam visíveis na preparação. | JornadaUI.jsx · jr-ups |
| 84 | Funcional | Três aparências extras por trajetória, com prévia e sem bônus esportivo. | Personalizacao.jsx/css |
| 87 | Funcional | Até três recomendações acessíveis e compatíveis, catálogo disponível. | LojaJogador.jsx |
| 91 | Funcional | Técnico herda reputação explicada e limitada pelo legado de jogador. | tecnico.js · herancaJogador |
| 92 | Funcional | Filosofia de posse/transição/pressão dentro da decisão única do técnico. | tecnico.js; pretemporadaRapida.js |
| 93 | Funcional | Seis dilemas adicionais com contrapartidas; uma decisão anual. | pretemporadaRapida.js |
| 94 | Funcional | Encontro cita somente mentor com clube e promoção registrados. | tecnico.js; jornadaJogador.js |
| 98 | Parcial | Cabeçalho, Copa, lojas, criação, museu, minigames, ficha/gaveta e fechamento revisados. Ainda falta auditoria manual exaustiva de todas as telas raras e do modo completo. | docs/correcao-ovr-desktop; FechamentoTemporada.jsx; estilos compartilhados |

## O que ainda falta

- **67:** completar referências históricas reais de clubes e ligas, com fontes e escopos comparáveis, e atualizar os recortes mundiais além de 2022. Os recordes do universo observado são um recurso distinto e estão identificados como simulação.
- **98:** terminar a auditoria visual manual das demais telas raras/legadas e do modo completo. Traços, coletiva e legado completo foram revisados nesta continuação em 320 e 1366 px. Os 119 cenários de navegador desta rodada cobrem os fluxos principais, não todo estado possível do jogo.
- **Refinamentos de base:** ampliar variedade dos ecos e do rival e melhorar a fluidez das cenas de quatro poses/comemorações. A base existe; isso não deve ser descrito como animação corporal contínua ou vídeo.

**Elenco continental deixou de ser pendência nesta etapa.** O escopo é a seleção do atleta e suas campanhas, não simular elencos individuais de todas as seleções do planeta a cada partida.

## Continuação: legado e partidas em Copas

Referência adicional: Messi, 26 partidas, derivada do CSV de aparições masculinas **1970–2022**. Comparação usa apenas jogos registrados em Copas; ausência de dados antigos aparece como contagem parcial. Não é uma atualização dos recordes até 2026. Sala de troféus do legado completo agora mostra ×quantidade e anos; acesso “Rever legado” preserva a carreira encerrada na tela inicial. Item 67 e 98 continuam parciais pelos limites acima.
