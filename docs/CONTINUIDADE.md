# Continuidade interna — treinador, elenco e mercado

Atualizado em 03/11/2026. Ler este documento antes de retomar o desenvolvimento.

## Pedido atual e limite de escopo

O usuário aprovou seguir com elenco + orçamento + mercado como próxima evolução do treinador. Informou que restava aproximadamente 3% do limite e pediu para fazer e salvar o progresso, incluindo um relatório interno para retomar quando o limite renovar. Esta entrega é um checkpoint de fundação, não a funcionalidade completa. Não publicar no site sem instrução do usuário.

## Estado publicado e preservação

- Última versão publicada: `03f27bf`, após `45e40eb` (renovação visual).
- Museu permanente: publicado em `5de8df7`.
- O pacote visual publicado inclui cenários, taças revisadas, fontes locais, personagens, uniformes, medalhas, Lottie e controles acessíveis. Preservar esse visual, que o usuário aprovou.
- O checkpoint desta etapa fica na branch remota `checkpoint/treinador-elenco-orcamento`. Não mesclar automaticamente em main.
- Usar o checkout existente em `/workspace/A-Joia`; não criar worktree sem pedido explícito.

## Implementado neste checkpoint

Arquivos novos: `mercadoTecnico.js` e `tests/mercado-tecnico.test.mjs`.

O módulo é independente e ainda não é importado pelo jogo:

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
- Mudança de clube recria gestão. Não há alteração de fórmulas, telas ou saves existentes nesta etapa.

## Verificação

- `node tests/mercado-tecnico.test.mjs`: oito testes passaram (geração estável, serialização, compras, vendas, janela, troca de clube, virada anual, idempotência, recompra e preservação de saldo).
- `npm test`: 18 arquivos/suítes passaram, sem falhas. Log auxiliar da instância: `/tmp/continuidade-tests-2.log`.
- Não foi necessária alteração no build: o módulo ainda não é importado pela aplicação.

## Próximos passos concretos

1. Revisar e balancear valores econômicos. Os números iniciais são provisórios.
2. Virada anual já implementada e testada neste segundo checkpoint. Antes da interface, decidir a renovação manual de contratos e revisar o balanceamento da reposição automática pela base.
3. Bloqueio de recompra na mesma janela já implementado e testado. Preservar o histórico de movimentos na integração e nos saves.
4. Decidir o vínculo entre qualidade por setor e força usada nas probabilidades. Atualmente `t.elenco` é numérico; não sobrescrevê-lo com a lista. Manter a lista em `t.gestao.elenco` e preservar saves antigos.
5. Integrar inicialização na escolha do primeiro clube e na aceitação de proposta; preservar a passagem jogador → treinador.
6. Integrar `contratarJogadorTecnico` e `venderJogadorTecnico` aos callbacks de `ModoRapido.jsx`, usando atualizações funcionais de `setEstado`.
7. Criar janela/painel de gestão em `CarreiraTecnico.jsx`, reutilizando o visual existente. Mostrar orçamento, folha/teto, setores e jogadores; permitir compras/vendas com mensagens claras e confirmação de venda.
8. **Revisar avanço automático:** atualmente escolher/continuar em um clube pode abrir decisão/simular automaticamente. O jogador precisa de oportunidade real de administrar o elenco antes de avançar. Inserir a etapa de gestão sem criar dupla simulação, nem quebrar a retomada do save.
9. Migrar saves antigos de forma preguiçosa e estável, sem criar atletas/creditar verba novamente a cada render.
10. Adicionar testes de integração e navegador: orçamento/folha, janela fechada, recarga, ano seguinte, troca de clube, desemprego, fim de 30 temporadas e persistência após compra/venda.

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
