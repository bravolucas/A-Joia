# Continuidade interna — treinador, elenco e mercado

Atualizado em 04/11/2026. Ler este documento antes de retomar o desenvolvimento.

## Pedido atual e limite de escopo

O usuário aprovou seguir com elenco + orçamento + mercado como próxima evolução do treinador. Informou que restava aproximadamente 3% do limite e pediu para fazer e salvar o progresso, incluindo um relatório interno para retomar quando o limite renovar. A base já foi integrada à interface neste terceiro checkpoint; ainda há balanceamento e evolução de contratos a fazer. Não publicar no site sem instrução do usuário.

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
- O aporte anual provisório é 70% do orçamento inicial, limitado ao saldo de duas vezes esse orçamento. Saldo já acumulado acima do limite é preservado. Não há renovação manual de contrato nem pagamento de salários debitado do orçamento de transferências.
- `resumoGestaoTecnico(g)`: médias por setor, quantidade de atletas, folha mensal, teto, espaço salarial e saldo.
- `gerarMercadoTecnico(t)`: três opções por setor, estáveis dentro da mesma janela. Ofertas compradas/vendidas ficam indisponíveis até o próximo ano.
- `contratarJogadorTecnico(c, id)`: valida janela, saldo, teto salarial, duplicidade e limite de 30 atletas; debita compra e registra movimento.
- `venderJogadorTecnico(c, id)`: credita 80% do valor, libera folha, remove atleta e registra movimento; preserva mínimos por setor.
- Valores são **R$ mil**; salários são **por mês**. Orçamento é destinado a transferências, distinto do teto salarial.
- Funções retornam novos objetos; não alteram a entrada. A gestão pronta pode ser armazenada em `c.tecnico.gestao` pelo sistema de saves já existente.
- Mudança de clube recria gestão. A escolha do clube, permanência ou aceite de proposta agora para na pré-temporada: o usuário administra e depois solicita a simulação.
- `prepararGestaoTecnico(c)` materializa a gestão na escolha/avanço e migra saves antigos na pré-temporada. Um efeito com guarda de versão/clube/ano evita recriação/crédito repetido.
- `negociarElencoTecnico(c, tipo, id)` realiza transações e retorna mensagens de sucesso/erro dentro do estado, sem lançar erros em atualizações React. A força numérica `t.elenco` recebe a diferença entre médias antes/depois da transação; decisões existentes continuam funcionando. A força usada para gerar ofertas fica congelada na gestão para manter preços estáveis durante a janela.
- `GestaoTecnico.jsx` mostra orçamento, folha/teto, setores/OVR, filtro por setor, elenco e mercado. Vendas exigem confirmação e podem ser canceladas. Compras sem saldo, folha ou vaga ficam desabilitadas; regras também são validadas no módulo.
- A janela reutiliza o modal com Escape, foco preso (agora inclui select) e restauração do foco. O save existente persiste a gestão, sem alterar as chaves do museu.

## Verificação

- `node tests/mercado-tecnico.test.mjs`: nove testes de geração, transações, janela, virada anual, persistência/idempotência, integração e estabilidade das ofertas.
- `npm test`: 18 arquivos/suítes passaram. Log local: `/tmp/gestao-test.log`.
- Build de produção: `GITHUB_PAGES=true npm run build`, passou. Log local: `/tmp/gestao-build.log`.
- Regressão completa do navegador: **32 testes passaram**, abrangendo treinador, museu, apresentação, responsividade e minigames. Log: `/tmp/gestao-regressao.log`.
- Testes do treinador no Chromium: oito passaram, incluindo integração em 390 e 1366 pixels, compras, cancelamento/confirmação de vendas, recarga de save e simulação única após escolha explícita.
- Os testes antigos foram ajustados para a etapa explícita de pré-temporada, em vez de esperar simulação automática após escolher clube.
- Capturas auxiliares: `/tmp/gestao-390.png` e `/tmp/gestao-1366.png`. Esses arquivos locais podem não sobreviver à troca de ambiente.

## Próximos passos concretos

1. Revisar o balanceamento econômico, o aporte anual, a reposição pela base e o efeito das transações na força. Números ainda provisórios; a evolução anual de qualidade individual não recalcula automaticamente a força numérica da simulação.
2. Adicionar renovação manual de contratos antes da virada: hoje contratos vencidos saem automaticamente e jovens repõem os setores. A interface informa essa regra.
3. Ampliar os cenários de navegador para várias viradas anuais com compras/vendas e mudança de clube com gestão anterior. A lógica anual já tem testes unitários.
4. Avaliar apresentação de histórico de movimentações e jogadores que estão no último ano de contrato.
5. Não mesclar/publicar automaticamente: o site permanece na versão visual anterior; toda a gestão está na branch de continuidade.

Fases posteriores aprovadas em princípio na conversa: tática com efeito real, intervenções em partidas importantes, comissão técnica; depois idolatria com consequências e desafios históricos. A prioridade imediata é finalizar elenco + orçamento + mercado.

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
