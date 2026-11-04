# Continuidade interna — treinador, elenco e mercado

Atualizado em 04/11/2026. Ler este documento antes de retomar o desenvolvimento.

## Publicação confirmada — 04/11/2026

O usuário autorizou publicar as alterações. `main` recebeu **`93416ea`** por fast-forward de `47f17bc`, sem conflitos. **GitHub Pages concluiu com sucesso**: https://github.com/bravolucas/A-Joia/actions/runs/41886776214 (1m23s). Validação geral também passou: https://github.com/bravolucas/A-Joia/actions/runs/41886776264 . Conferência do treinador/navegador também concluiu com sucesso: https://github.com/bravolucas/A-Joia/actions/runs/41886776170 .

Publicado: apresentação com camisa e escudo sem o boneco, correções de bloqueio/altura/rolagem das janelas e agrupamento de taças com ×N e anos na galeria do jogador e seleção. Endereço: https://bravolucas.github.io/A-Joia/ . As indicações de “salva localmente/sem publicação” nas seções abaixo descrevem os checkpoints anteriores e foram superadas por este registro. Não reaplicar ou republicar automaticamente.

## Conquistas agrupadas na galeria do jogador

O usuário apontou o cartão de clube do fim da carreira de jogador, que ainda repetia ícones e ocultava excedentes em “+N”. `GaleriaFim` agora usa `ConquistasJogador` nos cartões dos clubes e da seleção: mesma função de agrupamento canônico e mesmo componente de taça do treinador, uma taça por competição, multiplicador dourado ×N, nome e todos os anos em ordem decrescente. Nenhum título é ocultado por limite de seis ícones. Prêmios individuais permanecem na área própria. Os registros do save não são alterados.

Captura: `docs/conquistas-jogador/celular.png`. Validado no Chromium com a tela real `ModoRapido` e save de fim de carreira, em 390 e 1366 px: seis registros distribuídos entre clube/seleção, Bundesliga ×3 com os três anos e três grupos no cartão do Bayern, sem transbordamento horizontal. Todos os 26 arquivos de testes e build passaram (`/tmp/tacas-jogador-tests.log`, `/tmp/tacas-jogador-build.log`). Prévia temporária removida. Revisão salva localmente, ainda sem nova publicação.

## Correção de rolagem e altura das janelas

Após o anúncio com camisa, o usuário relatou informações escondidas e dificuldade de subir/descer a página. `TelaCheia` e `JanelaTreinador` manipulavam `body.style.overflow` separadamente, com risco de restaurar um `hidden` antigo ao fechar janelas sobrepostas. Agora usam `bloqueioRolagem.js`, que conta bloqueios e restaura o valor original apenas quando a última janela fecha. Testes cobrem ambas as ordens de fechamento, liberação duplicada e reabertura.

`PopupOverlay` usa altura dinâmica (`dvh`) e margens de área segura, com fallback `vh`; janelas do treinador também descontam as margens. O botão de `TelaCheia` acompanha o conteúdo, sem ficar sobre as informações, e seus blocos não encolhem para caber à força. O histórico do treinador permite passar a rolagem para a página ao atingir as extremidades, removendo `overscroll-behavior:contain` dessa lista.

Conferência Chromium do `PopupOverlay` real: topo e última ação acessíveis nas duas direções, redimensionando a mesma janela para 360×640, 360×420 e 360×740. Todos os 26 arquivos de testes e o build passaram (`/tmp/rolagem-tests.log`, `/tmp/rolagem-build.log`). Prévia temporária removida. Revisão salva localmente, sem publicação nova.

## Apresentação de contratação — camisa e escudo

Pedido seguinte do usuário: substituir o boneco da tela de anúncio por uma combinação de camisa em destaque e anúncio oficial do clube. Implementado em `AnuncioClube` (`components.jsx`) com estilos em `AnuncioClube.css`: camisa vetorial existente com nome/número, escudo de 64 px, número decorativo ao fundo, nome do jogador e origem, termos em bloco separado e botão “Vestir a camisa”. A composição usa fluxo vertical com rolagem em telas menores, sem personagem sobreposto. Não altera economia nem os dados de transferência. A apresentação especial `ApresentacaoGrande` é outra tela e não foi alterada nesta revisão.

Prévia: `docs/apresentacao-camisa/celular.png`. Conferência Chromium em 390×844, 360×640 e 1366×900, botão/callback e ausência de transbordamento da página; conferido também nome longo em tela pequena. Build de produção e os 178 testes de lógica passaram. Removida uma asserção antiga que exigia o SVG do boneco descartado. Esta revisão está salva localmente e ainda não foi enviada a `main`.

## Recuperação da publicação — 04/11/2026

A recuperação foi enviada em **`47f17bc`**, para `main` e checkpoint. Execuções:

- Pages: https://github.com/bravolucas/A-Joia/actions/runs/41877485074
- Treinador/navegador: https://github.com/bravolucas/A-Joia/actions/runs/41877485167
- Validação geral: https://github.com/bravolucas/A-Joia/actions/runs/41877485142

Na consulta inicial, o novo artefato já existia e o job de publicação havia iniciado às 17:26 UTC; o resumo ainda mostrava Queued. Aguardar conclusão desta execução antes de reenviar qualquer publicação.

A consulta atualizada (com `?check_suite_focus=true`) revelou que a publicação `41862065975` falhou: a construção e o artefato concluíram, mas `actions/deploy-pages@v4` atingiu o prazo padrão de dez minutos (`Timeout reached, aborting!`). As consultas anteriores mostravam um estado Queued desatualizado. A validação do treinador/navegador `41862065941` concluiu com sucesso.

O jogo está em `main` desde `9eeab44`. Para recuperar a publicação autorizada, o workflow passa a aguardar vinte minutos e usa concorrência `github-pages` sem cancelar uma publicação em andamento. Isso permite nova tentativa sem alterar o jogo. Ainda é necessário confirmar sucesso do novo workflow; não afirmar que está publicado antes disso.

A entrega inclui taças agrupadas com ×2/×3/×4 e treinador com uma/duas decisões, sem administração obrigatória de elenco, mercado ou comissão. Não reaplicar etapas antigas. Consultar execuções com uma query atualizada para evitar o HTML desatualizado observado.

## Revisão atual — treinador rápido e propostas coerentes

O usuário rejeitou a administração de elenco/comissão, pediu apenas uma ou duas decisões por pré-temporada com variações e ofertas de clubes mais coerentes, usando o COPERO como referência. Esta orientação substitui os objetivos antigos de construir telas de gestão. Não reintroduzir mercado/folha/comissão como etapas obrigatórias.

Implementação e capturas: `docs/TREINADOR_RAPIDO.md`. `pretemporadaRapida.js` contém dez famílias de cartas, níveis, nomes fictícios, investimento, impactos e efeitos futuros. `escolherPretemporadaRapidaTecnico` aplica a escolha e simula ao concluir o máximo de uma/duas cartas. O estado intermediário é serializável e idempotente. Os efeitos futuros são vinculados ao clube; o saldo de projeto e os limites de força são preservados.

O fluxo normal não chama a preparação anual da gestão nem mostra seus controles. O flag `modoTreinadorRapido` faz a simulação ignorar o elenco/comissão antigos, mantendo os registros armazenados. As funções antigas foram preservadas para compatibilidade; saves já em andamento ou intervenção continuam até o resultado sem novos sorteios do trecho concluído.

As propostas agora filtram saltos de nível e países pela trajetória, classificam projetos por compatibilidade e explicam o interesse. A campanha recém-concluída e o clube de referência são enviados corretamente, inclusive em demissão. `atualizarPropostasCoerentesTecnico` atualiza ofertas legadas uma única vez; ofertas vazias não são reabertas por recarga.

Validação: **25 arquivos de testes de lógica, build de produção e 44 testes de navegador passaram**. Duas carreiras rápidas completaram 30 temporadas com recarga entre escolhas, limite de decisões e finanças válidas. Os cenários de interface de administração retirados foram substituídos pelos do fluxo rápido. A vitrine de taças agrupadas do checkpoint anterior está incluída e validada.

Logs: `/tmp/treinador-rapido-test.log`, `/tmp/treinador-rapido-unidade-final.log`, `/tmp/treinador-rapido-build.log`, `/tmp/treinador-rapido-validacao-final.log`. Seguir a orientação anterior do usuário de concluir até a publicação, conferindo main e o deploy antes de confirmar o resultado. As seções antigas abaixo são histórico, não instruções para restaurar a gestão.

## Estado atual — vitrine de conquistas agrupada, ainda não publicada

O usuário pediu que as conquistas ficassem no formato de uma taça por competição com ×2/×3/×4, aprovou a proposta e autorizou implementar. A ficha e a janela de conquistas do treinador agora usam o agrupamento. Detalhes e capturas: `docs/VITRINE_AGRUPADA.md`.

- `conquistasTecnico.js`: agrupamento puro, com quantidade e histórico de todos os títulos; preserva o input e distingue competições por identidade e tipo. A chave usa aliases de `arteCompeticoes.js`, compartilhados com as imagens. Nomes curtos são usados apenas nos cartões.
- `VitrineConquistas.jsx`/`.css`: prévia de até seis competições na ficha, grade completa de três colunas no celular, contadores dourados e detalhe por toque com anos, clubes e contagem por clube. As taças existentes são mantidas em quadros de tamanho uniforme.
- `CarreiraTecnico.jsx`: integra os componentes e mantém os totais originais, a lista por temporada e as celebrações. A janela registra o foco de origem antes dos efeitos dos filhos, corrigindo a devolução do foco ao fechar o histórico.
- Sem alteração de saves ou migração de títulos; o museu permanente não foi modificado nesta etapa.
- Validação final: **24 arquivos de testes de lógica, build de produção e 52 testes de navegador passaram**. Inclui agrupamento de nomes equivalentes, compatibilidade com saves antigos, grade no celular, histórico por clube/ano, teclado, foco e recarga.
- Logs locais: `/tmp/vitrine-test.log`, `/tmp/vitrine-build.log`, `/tmp/vitrine-browser-final.log`. Duas capturas de revisão estão versionadas em `docs/vitrine-agrupada/`.

A aplicação publicada continua sendo `b8667e3`. Esta nova vitrine deve ser publicada quando o usuário solicitar; a autorização atual foi para implementar a proposta. Não reaplicar as etapas anteriores nem alterar outras telas de conquistas automaticamente.

## Estado atual — mercado remodelado publicado

O usuário autorizou continuar até a publicação. Em 04/11/2026, `main` recebeu o commit **`b8667e3`** por fast-forward a partir de `cc3d846`, sem conflitos. Deploy concluído no GitHub Pages: run `41850209869`. Validação geral `41850210195` e validação do treinador/navegador `41850210037`: sucesso.

A compra/venda também passou em dois testes locais adicionais com animações habilitadas, em celular e desktop (`/tmp/mercado-movimento-normal.log`). Endereço: https://bravolucas.github.io/A-Joia/ . A confirmação do deploy veio do workflow oficial, pois o acesso direto ao domínio retornou 403 neste ambiente na publicação anterior.

As seções abaixo que indicam remodelação não publicada descrevem o checkpoint anterior à autorização e foram superadas por este registro. Esta atualização documental fica na branch de continuidade, sem novo deploy; a aplicação publicada é `b8667e3`. Não reaplicar nem republicar automaticamente. Novas alterações devem partir da versão publicada mais recente.

## Estado atual — nova remodelação do mercado, ainda não publicada

Após a publicação de `cc3d846`, o usuário considerou a compra/venda confusa, dispersa e pouco interativa, e pediu uma experiência mais fácil de jogar. A nova revisão substitui `GestaoTecnico.jsx` e acrescenta `GestaoTecnico.css`: três sugestões iniciais, cartões visuais, filtros por posição, comparação, previsão do impacto e confirmação antes de comprar/vender. A janela no desktop foi ampliada; dinheiro e salários ficam fixos no topo, pagamento e confirmação acompanham a rolagem. A lista fica oculta enquanto se avalia uma proposta, sem confirmações espalhadas por outras partes da tela.

Relatório visual: `docs/MERCADO_REMODELADO.md`, com duas capturas versionadas. As regras econômicas e o formato do save foram preservados; a previsão usa as mesmas funções puras de negociação, sem efetivar o negócio. Comissão e renovação também usam a etapa guiada. Venda mostra receita e salário liberado, com bloqueio de setor insuficiente. O recibo de compra oferece acesso direto ao novo jogador no elenco.

Validação: **23 arquivos de testes de lógica, build de produção e 50 testes de navegador passaram**. Os testes novos cobrem falta de dinheiro, teto salarial e venda que deixaria setor incompleto; os existentes passaram a exigir confirmação de compra e conferir o cancelamento sem débito e o retorno de foco. O desktop tem asserções de largura dos cartões e da janela; a confirmação precisa permanecer dentro da área visível.

Logs locais: `/tmp/mercado-remodelado-test.log`, `/tmp/mercado-remodelado-build.log`, `/tmp/mercado-remodelado-completo-final.log`. Esta nova revisão deve ser avaliada pelo usuário antes de substituir a versão pública. A autorização anterior de publicação referia-se à entrega anterior, já concluída. Não publicar automaticamente esta remodelação.

## Estado atual — publicado

Publicação autorizada pelo usuário em 04/11/2026 e concluída. `main` recebeu a entrega por fast-forward, de `03f27bf` para **`cc3d846`**, sem mudanças concorrentes. GitHub Pages confirmou sucesso no run `41837084515`; as validações gerais (`41837084694`) e do treinador/navegador (`41837084629`) também concluíram com sucesso.

Endereço: https://bravolucas.github.io/A-Joia/ . O acesso direto ao domínio retornou 403 neste ambiente; a confirmação do deploy veio do workflow oficial do GitHub Pages. Não confundir isso com falha de publicação.

Os trechos abaixo sobre publicação pendente descrevem checkpoints anteriores e foram superados por esta autorização. A atualização de documentação posterior fica apenas na branch de continuidade; a aplicação publicada é `cc3d846`. Não reaplicar o pacote. Retomar futuras alterações a partir da versão publicada mais recente.

## Pedido atual e limite de escopo

O usuário aprovou seguir com elenco + orçamento + mercado como próxima evolução do treinador. Informou que restava aproximadamente 3% do limite e pediu para fazer e salvar o progresso, incluindo um relatório interno para retomar quando o limite renovar. Elenco, mercado, renovação de contratos, plano tático, intervenção opcional e comissão técnica já estão integrados à interface na branch de continuidade. Ainda há balanceamento de campanhas longas a fazer. Não publicar no site sem instrução do usuário.

## Estado publicado e preservação

- Última versão publicada: `03f27bf`, após `45e40eb` (renovação visual).
- Museu permanente: publicado em `5de8df7`.
- O pacote visual publicado inclui cenários, taças revisadas, fontes locais, personagens, uniformes, medalhas, Lottie e controles acessíveis. Preservar esse visual, que o usuário aprovou.
- O checkpoint desta etapa fica na branch remota `checkpoint/treinador-elenco-orcamento`. Não mesclar automaticamente em main.
- Usar o checkout existente em `/workspace/A-Joia`; não criar worktree sem pedido explícito.

## Implementado neste checkpoint

Arquivos principais: `mercadoTecnico.js`, `GestaoTecnico.jsx`, `CarreiraTecnico.jsx`, `ModoRapido.jsx` e respectivos testes.

A gestão agora é acessível em **Elenco e mercado**, durante a pré-temporada:

- `criarGestaoTecnico(t)`: cria uma gestão determinística por clube/ano, sem consumir `Math.random` da simulação. Tem 24 atletas fictícios: 3 goleiros, 8 defensores, 8 meias e 5 atacantes.
- Cada jogador possui id, nome, setor, idade, qualidade, potencial, anos de contrato, salário mensal, valor e origem.
- `atualizarGestaoAnual(g, ano)`: envelhece atletas, reduz contratos, encerra contratos vencidos e repõe os setores com jovens da base. Renova verba uma vez por ano; só é chamada automaticamente na pré-temporada, pois a simulação incrementa o ano antes da tela de resultado.
- O aporte anual provisório é 70% do orçamento inicial, limitado ao saldo de duas vezes esse orçamento. Saldo já acumulado acima do limite é preservado. Há renovação manual nos últimos dois anos de contrato. Salários continuam separados do orçamento de transferências; somente compras e luvas são debitadas desse saldo.
- `resumoGestaoTecnico(g)`: médias por setor, quantidade de atletas, folha mensal, teto, espaço salarial e saldo.
- `gerarMercadoTecnico(t)`: três opções por setor, estáveis dentro da mesma janela. Ofertas compradas/vendidas ficam indisponíveis até o próximo ano.
- `contratarJogadorTecnico(c, id)`: valida janela, saldo, teto salarial, duplicidade e limite de 30 atletas; debita compra e registra movimento.
- `propostaRenovacaoTecnico(j)` e `renovarJogadorTecnico(c, id)`: proposta de 3 anos, reajuste de 10% arredondado para cima em R$ mil e luvas de 2 salários novos. Valida janela, prazo elegível (1 ou 2 anos), orçamento, teto e repetição na mesma janela. Registra movimento e preserva a identidade do jogador após a virada. A interface pede confirmação e destaca os contratos que vencem ao fim da temporada.
- `venderJogadorTecnico(c, id)`: credita 80% do valor, libera folha, remove atleta e registra movimento; preserva mínimos por setor.
- Valores são **R$ mil**; salários são **por mês**. Orçamento é destinado a transferências, distinto do teto salarial.
- Funções retornam novos objetos; não alteram a entrada. A gestão pronta pode ser armazenada em `c.tecnico.gestao` pelo sistema de saves já existente.
- Mudança de clube recria gestão. A escolha do clube, permanência ou aceite de proposta agora para na pré-temporada: o usuário administra e depois solicita a simulação.
- `prepararGestaoTecnico(c)` materializa a gestão na escolha/avanço e migra saves antigos na pré-temporada. Um efeito com guarda de versão/clube/ano evita recriação/crédito repetido. Na virada anual, aplica à força numérica a diferença entre as médias de qualidade antes e depois da atualização; a mudança ocorre uma única vez e preserva os efeitos anteriores das decisões.
- `negociarElencoTecnico(c, tipo, id)` realiza transações e retorna mensagens de sucesso/erro dentro do estado, sem lançar erros em atualizações React. A força numérica `t.elenco` recebe a diferença entre médias antes/depois da transação; decisões existentes continuam funcionando. A força usada para gerar ofertas fica congelada na gestão para manter preços estáveis durante a janela.
- `GestaoTecnico.jsx` mostra orçamento, folha/teto, setores/OVR, filtro por setor, elenco e mercado. Vendas exigem confirmação e podem ser canceladas. Compras sem saldo, folha ou vaga ficam desabilitadas; regras também são validadas no módulo.
- A janela reutiliza o modal com Escape, foco preso (agora inclui select) e restauração do foco. O save existente persiste a gestão, sem alterar as chaves do museu.

## Verificação da etapa anterior — contratos

- `node tests/mercado-tecnico.test.mjs`: 12 testes de geração, transações, janela, renovação, virada anual, persistência/idempotência, integração, estabilidade das ofertas e aplicação única da força anual.
- `npm test`: 18 arquivos/suítes passaram. Log local: `/tmp/renovacao-test.log`.
- Build de produção: `GITHUB_PAGES=true npm run build`, passou. Log local: `/tmp/renovacao-build.log`.
- Regressão completa do navegador: **34 testes passaram**, abrangendo treinador, museu, apresentação, responsividade e minigames. Log: `/tmp/renovacao-browser.log`.
- Testes do treinador no Chromium: dez passaram, incluindo renovação, integração em 390 e 1366 pixels, compras, cancelamento/confirmação de vendas, recarga de save e simulação única após escolha explícita.
- Após o ajuste final de força anual, os dez testes do treinador passaram novamente. Log: `/tmp/renovacao-treinador-final.log`.
- Os testes antigos foram ajustados para a etapa explícita de pré-temporada, em vez de esperar simulação automática após escolher clube.
- Capturas da renovação: `/tmp/renovacao-390.png` e `/tmp/renovacao-1366.png`. Capturas anteriores: `/tmp/gestao-390.png` e `/tmp/gestao-1366.png`. Esses arquivos locais podem não sobreviver à troca de ambiente.

## Próximos passos concretos

1. Continuar o balanceamento por campanhas longas. A revisão estática desta etapa manteve o orçamento inicial e o aporte existentes; a evolução anual individual agora afeta a força numérica da simulação.
2. Renovação manual implementada e testada. Avaliar futuramente prazos negociáveis, aposentadoria de atletas e exigências por idade/potencial; hoje a proposta é fixa, de 3 anos.
3. Ampliar os cenários de navegador para várias viradas anuais com compras/vendas e mudança de clube com gestão anterior. A lógica anual já tem testes unitários.
4. Avaliar apresentação de histórico de movimentações e jogadores que estão no último ano de contrato.
5. Não mesclar/publicar automaticamente: o site permanece na versão visual anterior; toda a gestão está na branch de continuidade.

Fases posteriores aprovadas em princípio na conversa: tática com efeito real, intervenções em partidas importantes, comissão técnica; depois idolatria com consequências e desafios históricos. Elenco, mercado e contratos estão integrados; a etapa atual acrescenta táticas à liga e a próxima deve unificar as copas.

## Checkpoint de táticas

- `taticasTecnico.js`: formações 4-3-3, 4-4-2 (padrão) e 3-5-2. Seleciona os melhores atletas por setor para cada formação e compara a qualidade do onze com o 4-4-2; ajuste limitado a -3/+3 de força. Vagas sem jogador contam como zero. Se não houver gestão ou pertencer a outro clube, o ajuste é zero.
- `definirFormacaoTecnico` e `definirEstiloTecnico`: alterações permitidas antes do início da temporada, com bloqueios para desemprego, andamento e carreira encerrada. As escolhas usam os saves existentes; ausência de formação assume 4-4-2.
- `CarreiraTecnico.jsx`: controles de formação e estilo com descrição dos efeitos na pré-temporada. Permanecem desabilitados em saves com partidas já disputadas.
- A probabilidade de confronto da **liga** agora aplica formação e estilo. Ofensivo reduz empates e favorece equipes superiores, com risco adicional quando inferiores; defensivo aumenta empates, ajuda contra superiores e reduz a chance de vitória contra inferiores. Os limites de probabilidade são preservados.
- O placar também acompanha o estilo: faixa de gols menor no defensivo e maior no ofensivo. Resultado V/E/D permanece coerente. Usado tanto na temporada expressa quanto na simulação por etapas.
- Corrigido `forcaClubeTecnico`: o estado numérico `t.elenco` agora tem prioridade sobre o cadastro estático do clube. Antes, compras, vendas e evolução podiam não afetar os confrontos de clubes cadastrados.
- Estilo e formação são registrados nos confrontos e no resumo anual; resultados já salvos não são recalculados.
- **Escopo inicial (já ampliado no checkpoint seguinte):** esta primeira etapa cobria a liga. As copas agora recebem a tática, conforme a seção seguinte.
- Testes: novo arquivo `tests/taticas-tecnico.test.mjs` cobre adequação, compatibilidade, riscos, probabilidades, placares, força dinâmica e restrições de alteração. O navegador cobre escolha, recarga e registro na temporada em 390/1366 pixels.
- Validação final desta etapa: **19 arquivos de testes de lógica, build de produção e 36 testes de navegador passaram**. Inclui 12 fluxos de treinador e as regressões de apresentação, museu e minigames. A tela foi conferida em 390 pixels.
- Logs desta etapa: `/tmp/taticas-test.log`, `/tmp/taticas-build.log` e `/tmp/taticas-browser-final.log`. Capturas: `/tmp/taticas-390.png` e `/tmp/taticas-1366.png`.

Prioridade ao retomar: conferir o checkpoint atual; as copas já foram integradas. A intervenção opcional já está implementada; a comissão técnica também já foi integrada no checkpoint seguinte. Manter o site sem deploy até pedido do usuário.

## Checkpoint de táticas nas copas

- `simularCopaNacionalTecnico` e `simularCopaContinentalTecnico` recebem o parâmetro opcional `tatica`, calculado por `perfilTaticoTecnico` na simulação da temporada. O objeto acompanha somente o clube do treinador.
- `riscoEstiloTecnico` centraliza a vantagem contextual de estilo, compartilhada por liga e copas. Na liga mantém os coeficientes anteriores; nas copas é convertida para a escala de força antes do cálculo dos gols.
- `mediasPartidaCopaTecnico` aplica ajuste de formação limitado a -3/+3 e ritmo ofensivo de 1,2 ou defensivo de 0,8 nas médias de gols dos dois lados. A vantagem contextual é calculada da perspectiva do usuário e invertida quando ele joga fora. Terceiros continuam usando o modelo anterior.
- A mesma média rege os 90 minutos e a prorrogação. Ida/volta continuam independentes; agregado e pênaltis seguem as regras existentes. Campo neutro continua simétrico. Não foram alterados participantes, vagas nem formatos.
- O bônus antigo por estilo nas copas foi substituído pelo modelo compartilhado, mantendo o bônus neutro de 1 e o efeito de moral. Isso evita aplicar dois bônus de estilo ao mesmo tempo.
- A força do usuário agora sobrescreve tanto `forca` quanto `elenco` ao montar participantes. Corrige o caso em que um cadastro com campo `forca` ignorava o `forcaUsuario` informado.
- Partidas do usuário registram `planoTatico: { estilo, formacao }`. Confrontos agregados e as duas partidas também carregam esse registro. Não se recalculam torneios antigos ao abrir ou recarregar o save.
- A interface informa que o plano vale para liga e copas da temporada. Não houve novo fluxo nem mudança no layout.
- Validação final: **19 arquivos de testes de lógica, build de produção e 36 testes de navegador passaram**.
- Verificação de lógica: 22 testes no arquivo de competições, incluindo contexto/ritmo, neutralidade, ida/volta, grupos e compatibilidade. O equilibrado sem ajuste reproduz os placares antigos com a mesma semente, descontando somente os metadados novos.
- O navegador verifica em celular e desktop que as partidas da copa recebem o plano escolhido e que recarregar o save preserva os torneios completos. Logs atuais: `/tmp/copas-unidade.log`, `/tmp/copas-test.log`, `/tmp/copas-build.log`, `/tmp/copas-browser.log`.

## Checkpoint de intervenção opcional

- Pré-temporada: checkbox **Acompanhar jogo importante**, desativado por padrão. O fluxo rápido continua sem pausas quando a opção não está marcada. A preferência permanece para os anos seguintes.
- Quando ativado, `simularTemporadaTecnico` pausa antes do adversário de maior força na segunda metade da liga (desempate pela rodada mais próxima). É uma intervenção antes da partida, não no intervalo, e ocorre uma vez por temporada.
- Nova fase `intervencao`, com `intervencaoPendente` (chave, adversário, rodada, jogos e pontos) e `temporadaPausada` (ano, clube, índice, calendário, classificação, confrontos e contadores de gols/resultados).
- O snapshot é serializável e salvo pelo mecanismo existente. Ano, idade, troféus e temporadas concluídas não avançam durante a pausa. Elenco e tática da temporada ficam indisponíveis enquanto o jogo está pendente.
- `responderIntervencaoTecnico(c, chave, escolha, rng)` valida a chave da decisão e retoma o mesmo laço a partir do índice pendente. Callbacks repetidos ou antigos retornam o estado atual, sem simular de novo. A retomada preserva todos os confrontos anteriores e a classificação parcial; somente a parte restante é sorteada.
- Opções: **Manter o plano**, **Buscar a vitória** (ofensivo) e **Proteger a equipe** (defensivo). O estilo temporário vale somente para o confronto selecionado. A formação e o estilo habitual são restaurados nas partidas seguintes e nas copas.
- O confronto registra `intervencao`; o detalhe da temporada mostra a escolha, adversário e placar. Ao terminar, os dois campos de pendência são limpos e idade/ano avançam uma única vez.
- A simulação antiga por etapas continua compatível. Esta primeira intervenção integra o fluxo atual de temporada expressa; não adiciona pausas aos saves antigos já em `andamento` por etapas.
- Verificação: **20 arquivos de testes de lógica, build de produção e 38 testes de navegador passaram**. O teste de lógica compara a campanha completa com a versão pausada/retomada usando a mesma sequência aleatória: ao manter o plano, todos os resultados coincidem, descontando somente o registro da intervenção. Também verifica não mutação, serialização, estilos temporários, chave inválida e cliques repetidos.
- Navegador em 390/1366 pixels: habilitar, iniciar temporada, pausar, recarregar, reencontrar a mesma pendência, decidir, preservar os jogos anteriores, concluir uma única temporada e recarregar o resultado completo.
- Logs: `/tmp/intervencao-test.log`, `/tmp/intervencao-build.log`, `/tmp/intervencao-browser.log`. Capturas: `/tmp/intervencao-390.png` e `/tmp/intervencao-1366.png`.

A comissão técnica descrita abaixo já foi integrada. Preservar a intervenção opcional, resultados já salvos, o museu e o visual aprovado. Publicação continua pendente de pedido do usuário.

## Checkpoint de comissão técnica

- Nova aba **Comissão técnica** na janela de elenco e mercado. São contratos de um ano, sem renovação automática e sem rescisão durante a temporada. Há uma vaga por cargo.
- `comissaoTecnico.js`: catálogo, proposta e consulta da equipe ativa. Custo mensal calculado sobre a folha dos atletas no momento da contratação, mínimo R$ 2 mil. Os valores aceitos são congelados no contrato.
- Auxiliar técnico: salário de 6% da folha dos atletas, +1 de força efetiva em partidas da liga e copas. O bônus é temporário e não altera permanentemente `t.elenco`. Combina com a formação (máximo +3 de formação e +1 do auxiliar); as copas aceitam o total +4.
- Preparador de desenvolvimento: 5% da folha dos atletas. Na virada, +1 de qualidade para atletas retidos com menos de 30 anos após envelhecer, sem exceder o potencial. O ganho entra na evolução anual já usada para atualizar a força do elenco.
- Olheiro da base: 4% da folha dos atletas. Na virada, +2 de qualidade nos jovens promovidos para repor vagas, limitado a 95. Potencial, salário e valor dos jovens acompanham a qualidade resultante; o valor usa a idade jovem efetiva, corrigindo o cálculo anterior feito antes de definir a idade da base.
- **Cobrança:** os 12 salários são debitados antecipadamente do orçamento de transferências. A parcela mensal também ocupa espaço no teto salarial. Não há segundo débito mensal nem nova cobrança ao recarregar.
- `resumoGestaoTecnico` agora separa `folhaJogadores` e `folhaComissao`; `folha` passa a ser a soma. Assim, compras, renovações de atletas e novas contratações de comissão respeitam o mesmo teto. Sem comissão, o comportamento anterior permanece.
- `contratarComissaoTecnico` valida janela, vínculo, 30 temporadas, cargo, orçamento, teto e duplicidade. Usa `t.gestao.comissao` com id, ano, salário e custo; registra movimento financeiro. `negociarElencoTecnico` aceita a operação `comissao` e retorna aviso seguro para a interface.
- Na virada, os especialistas atuam uma única vez e os contratos são encerrados (movimento `fim-comissao`). Não seguem para outro clube. A opção de contratar novamente aparece no novo ano, com nova confirmação; não existe renovação automática.
- A confirmação exibe efeito, pagamento imediato, espaço na folha e prazo. Cancelamento não altera o save; após contratar, o cargo fica indisponível até o ano seguinte. A interface mostra o custo aceito e a composição da folha.
- Testes novos: custo/folha, serialização, não mutação, duplicidade, orçamento, teto compartilhado com atletas, janela fechada, limite de carreira, bônus do auxiliar na liga/copas, limite de ano/clube, evolução e expiração sem cobrança automática.
- Validação final: **21 arquivos de testes de lógica, build de produção e 40 testes de navegador passaram**. A interface foi conferida em 390 pixels; compra, cancelamento e recarga foram verificados em celular e desktop.
- Logs: `/tmp/comissao-test.log`, `/tmp/comissao-build.log`, `/tmp/comissao-browser.log`. Capturas: `/tmp/comissao-390.png` e `/tmp/comissao-1366.png`.

A idolatria com consequências foi integrada no checkpoint abaixo. Próximo ponto do plano aprovado: desafios históricos. Continuar salvando na branch de checkpoint e manter o site sem deploy até pedido explícito.

## Checkpoint de idolatria com consequências

- Ambiente recuperado após a falha de inicialização; checkout confirmado no commit anterior `eb8964f` antes das novas alterações.
- `idolatriaTecnico.js` centraliza vínculo ativo, riscos ao aceitar um clube e registro de rupturas. Usa rivalidades cadastradas em `CLASSICOS`, e compara o destino com **todos** os clubes onde o treinador mantém idolatria como ex-jogador, mesmo que o clube atual seja outro.
- Propostas de rivais recebem uma indicação no cartão e abrem **Decisão de legado** antes da negociação. O usuário pode cancelar sem modificar o save ou confirmar a transferência. O modal informa as consequências antes da assinatura.
- Ao aceitar a proposta, registra `t.rupturasIdolo` com clube afetado, rival e ano. Só vínculos ainda ativos são registrados; um vínculo já rompido não gera outra entrada. Rejeição da negociação não rompe nada.
- O clube novo recebe a mesma base de diretoria/torcida já usada para chegadas de rivais (48/35, antes dos ajustes da entrevista). Não é aplicada uma segunda penalidade se a proposta já era marcada como rival.
- O vínculo histórico continua intacto em `t.vinculosJogador`: afinidade passada e idolatria como jogador não são apagadas. A ruptura somente remove os benefícios atuais de ídolo: bônus e exigência reduzida nos convites de retorno, sinalização de retorno de ídolo e regras especiais de apoio/cobrança na simulação. Não altera as conquistas nem o museu.
- Retornar ao próprio clube não é rivalidade e mantém o status se não houver ruptura anterior. A ruptura é persistente nesta carreira; não há reconciliação automática implementada.
- Perfil mostra status ativo ou clubes com vínculo rompido. Convites de retorno indicam quando os benefícios de ídolo foram perdidos. Usa o mesmo save e não muda as chaves da coleção.
- Validação: **22 arquivos de testes de lógica, build de produção e 42 testes de navegador passaram**. Testes incluem rival de um clube anterior, entrada recusada, retorno ao próprio clube, remoção do bônus em convites, preservação do histórico, cancelamento e recarga em 390/1366 pixels.
- Logs: `/tmp/idolatria-test.log`, `/tmp/idolatria-build.log`, `/tmp/idolatria-browser.log`. Capturas: `/tmp/idolatria-390.png` e `/tmp/idolatria-1366.png`.

Os desafios históricos foram implementados no checkpoint abaixo. Manter o modo independente da carreira principal. Não publicar automaticamente.

## Checkpoint de desafios históricos

- Novo acesso **Desafios históricos** no menu principal; módulo carregado sob demanda.
- Três missões de uma temporada: Santos 2002 (elenco jovem, terminar entre os quatro primeiros), Leicester 2016 (conquistar a liga com orçamento curto) e Flamengo 2019 (conquistar a liga).
- A tela explica que são missões inspiradas em campanhas reais, com elencos fictícios e calendário da simulação. Não são reconstruções dos adversários, atletas, regulamentos ou resultados históricos. Leicester é colocado na liga inglesa principal via `ligasMundo`; com o cadastro atual, o calendário pode ter 21 participantes e 40 jogos, conforme o motor existente. Não anunciar uma reprodução exata da Premier League 2015/16.
- `desafiosHistoricos.js` define catálogo, estado, início, avaliação e persistência independente em **`ajoia_desafios_v1`**. Não usa `salvarRapido`, não registra no museu e não escreve no save da carreira principal.
- O cenário inicial usa o treinador e a gestão existentes, sem precisar criar uma carreira de jogador. Clube, ano, orçamento e força vêm da missão. Santos recebe atletas de 18–22 anos e potencial ajustado para representar a proposta de base.
- `DesafiosHistoricos.jsx` reutiliza `CarreiraTecnico` com tática, elenco, contratos, comissão e intervenção opcional. Os callbacks atualizam exclusivamente o save de desafios. O resultado encerra a tentativa, sem propostas ou avanço para outro ano.
- Galeria própria registra conclusões por desafio, melhor posição, maior pontuação e contagem de tentativas. Repetir ou falhar não apaga conclusões anteriores. Resultados não são inseridos como taças reais no museu.
- Só uma tentativa pode ficar ativa. É possível sair para o menu e retomar, ou encerrá-la após confirmação. Após concluir, pode repetir, escolher outra missão ou reabrir o último resultado após recarregar.
- `CarreiraTecnico` aceita um rótulo opcional no botão de retorno, evitando mostrar um legado de jogador inexistente dentro dos desafios.
- Testes de lógica cobrem as três missões, uma temporada por tentativa, objetivos, contagem única, serialização, save independente, recuperação de JSON inválido e preservação de conquistas anteriores.
- Navegador cobre início, tática, recarga, retomada, resultado e acesso ao último resultado em 390/1366 pixels, comparando os saves principal e do museu. O CI passou a incluir `tests/desafios-historicos.spec.mjs`.
- Verificação: **23 arquivos de testes de lógica, build de produção e regressão de 44 testes de navegador passaram**. Os dois testes específicos de desafios passaram novamente após o ajuste final de acesso ao último resultado.
- Logs: `/tmp/desafios-test.log`, `/tmp/desafios-build.log`, `/tmp/desafios-browser.log`, `/tmp/desafios-browser-final.log`. Capturas: `/tmp/desafios-390.png` e `/tmp/desafios-1366.png`.

## Checkpoint de revisão e balanceamento

- Auditoria persistida em `docs/AUDITORIA_GESTAO.md` e `docs/auditoria-gestao.json`. Script reproduzível: `node scripts/auditar-gestao.mjs`. A segunda execução reproduziu integralmente o JSON da primeira.
- Corrigida a espiral de perda de qualidade da reposição: a geração da base agora usa o maior entre a média do elenco e a referência estrutural inicial `g.forcaMercado`, descontando os mesmos 7 pontos anteriores. Isso preserva a estrutura do clube sem aumentar automaticamente a força dos atletas existentes.
- Em 30 anos sem gerir atletas, as forças iniciais 65/85 terminavam próximas de 34; depois do ajuste ficam em 61,2/81,2. Renovando os três cargos, ficam em 64,8/84,8. Não houve saldo negativo, quebra de teto, ids duplicados ou efeitos repetidos ao recarregar nas seis trajetórias testadas.
- Custos e regras da comissão foram mantidos. A auditoria também executa três carreiras completas de 30 temporadas, incluindo demissão e mudança de clube, sem escrever nos saves do jogador.
- Amostra de 100 sementes por desafio, sem reforços/decisões: Santos 51 conclusões, Leicester 13 e Flamengo 58. Flamengo mudou de Avançado para Acessível. As regras e objetivos dos desafios permanecem.
- Validação final: **23 arquivos de testes de lógica, build de produção e 44 testes de navegador passaram**. A auditoria foi repetida após a última alteração de verificação e reproduziu os mesmos resultados.
- Novo teste de regressão de gestão longa com e sem comissão protege contra colapso e crescimento ilimitado. Logs atuais: `/tmp/revisao-test.log`, `/tmp/revisao-build.log`, `/tmp/revisao-browser.log`.

O plano de funcionalidades desta sequência e esta revisão estão implementados na branch de continuidade. Próximo passo: revisão do usuário e publicação quando solicitada. Não expandir automaticamente o escopo com novas funcionalidades. Publicação continua pendente de pedido explícito do usuário; push em main faria deploy automático.

## Revisão econômica desta etapa

Análise estática com clube Santos, ano 2030 e forças entre 30 e 95. Valores em R$ mil. Não é uma simulação de equilíbrio de longo prazo.

| Força | Saldo inicial | Folha mensal | Folga salarial | Compra média das ofertas |
| --- | ---: | ---: | ---: | ---: |
| 30 | 200 | 112 | 28 | 160 |
| 50 | 5.000 | 269 | 68 | 582 |
| 65 | 12.800 | 454 | 114 | 1.304 |
| 80 | 24.200 | 691 | 173 | 2.467 |
| 95 | 39.200 | 934 | 234 | 4.000 |

A folga de 25% na folha limita a expansão mesmo quando há caixa para várias compras. A renovação consome parte dessa folga e luvas do saldo de transferências. Foram preservados os valores anteriores; o ajuste central foi permitir manter atletas e refletir a evolução anual na força da simulação. Balanceamento de campanhas longas continua pendente.

## Arquivos relevantes

- `tecnico.js`: carreira, propostas, decisões, simulação e `proximaTemporadaTecnico`.
- `ModoRapido.jsx`: callbacks do treinador, avanço automático e saves.
- `CarreiraTecnico.jsx` / `.css`: interface; já possui um componente de janela com foco/teclado.
- `rapido.js`: `salvarRapido` e `carregarRapido`; preservam campos adicionais no estado.
- `museu.js`: coleção persistente; não perder nem duplicar conquistas ao migrar gestão.
- `tests/coach-remodelacao.spec.mjs`: fluxos de treinador e simulação única.
- `tests/visual-minigames.spec.mjs`: regressão visual/interação.
- `.github/workflows/validacao-treinador.yml`: suíte de navegador existente.

## Ambiente e publicação

Node 24 e npm disponíveis nesta instância. Sem lockfile versionado: usar `npm install --package-lock=false --no-audit --no-fund` se necessário, sem alterar manifests por rotina. Validação principal: `npm test` e `GITHUB_PAGES=true npm run build`.

Para navegador local: `GITHUB_PAGES=true npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. O CI instala `@playwright/test`; a instância já o tem em node_modules. Arquivos de configuração em /tmp são auxiliares e podem não sobreviver. O Chromium do ambiente está em `/usr/bin/chromium`.

Acesso GitHub usa o proxy HTTPS existente. Em sandbox com isolamento de rede pode ser necessário o fluxo de execução com permissão ampliada; preservar proxy e TLS. `gh`/API já recusaram acesso, mas Git e páginas públicas do GitHub funcionam. Não pedir token apenas porque a CLI não está autenticada.

Push em main aciona GitHub Pages automaticamente. Para preservar checkpoints sem deploy, usar a branch indicada. Não confundir publicação do ambiente na nuvem com deploy do jogo.


## Verificação final de retomada e encerramento

- Acrescentados dois cenários de navegador (390/1366 pixels) que combinam desafio histórico e intervenção: pausar, voltar ao catálogo, cancelar encerramento, recarregar, retomar a mesma decisão e concluir uma única campanha.
- O mesmo fluxo inicia outra missão e confirma o encerramento, verificando que a tentativa ativa é liberada, a contagem permanece correta e as conquistas anteriores são preservadas.
- Os quatro testes específicos de desafios passaram, incluindo os dois anteriores de isolamento dos saves e acesso ao último resultado. Log: `/tmp/retomada-desafios-browser.log`.
- Não foram necessárias mudanças no código da aplicação nesta verificação. O build e os 23 arquivos de testes de lógica permanecem os da revisão anterior; a regressão geral anterior de 44 casos está registrada acima.
- O CI existente já inclui este arquivo, passando a ter 46 cenários de navegador disponíveis. Próximo passo continua sendo revisão do usuário e publicação quando solicitada, sem novas funcionalidades automáticas.


## Fechamento da entrega

- Execução final completa: **46 testes de navegador passaram**, em 32,7 segundos, contra o build já aprovado e sem alterações posteriores no código da aplicação. Log local: `/tmp/entrega-final-browser.log`.
- Documento de revisão: `docs/ENTREGA_TREINADOR.md`, com funcionalidades, roteiro para o usuário, limites de escopo e referências da auditoria.
- O escopo combinado está concluído. Não repetir verificações ou inventar novas funcionalidades apenas para preencher outra rodada de trabalho. Se o usuário pedir publicação, atualizar as referências remotas e conferir mudanças concorrentes antes de mesclar a branch em main e acompanhar o deploy. Sem pedido de publicação, manter a branch preservada.
