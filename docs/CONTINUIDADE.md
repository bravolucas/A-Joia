# Continuidade interna — treinador, elenco e mercado

Atualizado em 04/11/2026. Ler este documento antes de retomar o desenvolvimento.

## Pedido atual e limite de escopo

O usuário aprovou seguir com elenco + orçamento + mercado como próxima evolução do treinador. Informou que restava aproximadamente 3% do limite e pediu para fazer e salvar o progresso, incluindo um relatório interno para retomar quando o limite renovar. A base já foi integrada à interface nos checkpoints de integração e contratos; ainda há balanceamento e evolução de contratos a fazer. Não publicar no site sem instrução do usuário.

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

## Verificação

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

Fases posteriores aprovadas em princípio na conversa: tática com efeito real, intervenções em partidas importantes, comissão técnica; depois idolatria com consequências e desafios históricos. A prioridade imediata é finalizar elenco + orçamento + mercado.

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
