# Pacote autorizado — número favorito e imersão

Pedido: criação escolhe número favorito; número efetivo só é escolhido entre livres ao chegar a clube/seleção. Favorito ocupado pode ser solicitado com muita moral/prestígio. Usuário também autorizou ideias 1,2,3,5,6,8,9,10 da lista imediata: disputa pela titularidade; perfil do adversário; reputação de estilo; fases da carreira; decisões com ecos; ofertas por projeto; personalidade da temporada do clube; retrospectiva em três capítulos.

Escopo: modo rápido jogador, com perfil de adversário também compartilhado pelas estratégias de CopaEscolha. Preservar museu/assinaturas/duplas/mercado existentes e expandir, sem duplicar. Preservar saves antigos, número histórico e dois docs não rastreados do usuário. Não alterar modo treinador para gestão de elenco.

Plano de integração: módulos puros para camisas e progressão narrativa; chegada combina escolha de camisa e postura na disputa de espaço, uma vez por clube/contrato; seleção tem numeração independente e integração com elenco real persistido. Mercado explica espaço/projeto/adaptação. Preparação mostra reputação/patamar/projeto; fechamento registra confiança, reputação e ecos; aposentadoria mostra origem/passagem marcante/despedida com fatos da carreira.

Estado inicial: auditoria identificou projetoOferta, preparar/fecharJornada e legadoNarrativo existentes; seleção atualmente reatribui todos os números a partir de c.numero a cada atualização, o que precisa ser substituído por alocação estável. Auditoria concluída e implementação integrada abaixo.

## Implementação integrada

- Favorito em campo próprio na criação. Chegada ao clube pede camisa livre; número selecionado salvo imediatamente, sem confirmar. Elenco de camisas é fictício e persistente por clube, com 24 colegas. Favorito ocupado exige moral ≥80 e prestígio/torcida ≥75; troca realoca o colega sem duplicação. Trocas posteriores somente entre temporadas. Evento do ídolo aposentado libera efetivamente a camisa; se a homenagem aposenta o número, ele deixa de ser oferecido.
- Seleção tem camisa própria, 1–26, vinculada aos 25 companheiros e usuário. Número é estável ao atualizar elenco; nova nacionalidade tem nova escolha. Seleção e clube nunca compartilham um único campo. Primeira convocação, elenco do card e memória usam o número internacional. Migração preserva camisa efetiva e histórico, inclusive Copa antiga em andamento.
- 1: postura de chegada (competir, aprender, responsabilidade), confiança por clube e projeção de minutos. Preparação altera participação/evolução com tetos; fechamento altera confiança uma vez por ano a partir de jogos/nota. Não há gestão individual de colegas.
- 2: quatro perfis simulados e estáveis do rival, renovados por ciclo de três anos. Leitura antes da escolha; pequenos ajustes por atributo/estratégia no sorteio real, inclusive CopaEscolha compartilhada. A chance revelada continua sendo a efetivamente usada. São perfis do simulador, não scouting oficial de clubes reais.
- 3: reputação de decisivo, criador, líder, especialista defensivo e grandes jogos calculada de gols, assistências, capitania e decisões efetivamente registradas. Painel, fechamento e propostas exibem a identidade; não é OVR gratuito.
- 5: primeiro contrato, ascensão, consolidado, estrela e veterano com critérios de jogos/fama/idade; capítulo novo registrado no fechamento e apresentação do painel por fase.
- 6: posturas e escolhas de jogo/pré-temporada entram na fila existente de ecos posteriores, limitada e sem novos cliques obrigatórios. Narrativas citam o que realmente foi escolhido.
- 8: ofertas mostram papel, projeção, força da liga, salário e ciclo do projeto; vantagem e custo ficam juntos. Não garante titularidade.
- 9: projetos por clube/ciclo (base, experiência, reconstrução, títulos), com ajustes pequenos e efetivos por idade/postura/confiança. Contexto legível na chegada, preparação, oferta e fechamento.
- 10: retrospectiva final em três capítulos factuais: origem, clube de maior marca e encerramento. Só conta títulos de clube para a passagem; desconhecimento de camisa antiga é indicado, sem inventar número.

## Validação final local

- Build de produção para GitHub Pages aprovado, com base `/A-Joia/`.
- **370/370 testes de lógica** aprovados no código final.
- Regressão inicial: 245/257 cenários de navegador aprovados; os 12 restantes precisavam incluir a nova escolha obrigatória de camisa (Copa, elenco nacional, empréstimo, despedida).
- Fluxos adaptados sem remover verificações de placar, estatísticas, imagens, teclado, animação e retomada. Revisão final no build definitivo: **69/69 cenários aprovados**, incluindo os 12 e dois novos casos adicionais. Total no conjunto: **259 cenários distintos** cobertos.
- Telas de 320 a 1366px, preferência por movimento reduzido, criação completa, reload, números de clube/seleção, realocação do favorito, Copa em andamento, efeitos idempotentes e histórico preservado. Capturas `/tmp/escolha-camisa-320.png` e `/tmp/camisa-chegada-320.png` inspecionadas.
- Não foi utilizado aparelho físico; navegador Chromium com tamanhos móveis/desktop. Acesso direto ao domínio GitHub Pages continua bloqueado pela política de rede do ambiente; confirmar publicação pelo workflow, sem alegar inspeção remota do site.

## Limites deliberados

O elenco de camisas do clube é simulado e não pretende reproduzir a numeração real atual. Não há negociação com caixa de diálogo adicional: prestígio suficiente conclui o pedido no clique. Seleções utilizam 1–26 neste modelo compacto. Perfis de adversário e projetos são próprios do jogo. Reputação é reconhecimento persistente, sem compra de OVR; projetos/postura/confiança afetam a simulação com limites. Histórico de outras temporadas não é renumerado. Não incluir os dois documentos originais não rastreados do usuário no commit.

Publicado em `73b3db3`. GitHub Pages [42629591816](https://github.com/bravolucas/A-Joia/actions/runs/42629591816) confirmado com sucesso. CI [42629591804](https://github.com/bravolucas/A-Joia/actions/runs/42629591804) ainda executando na confirmação.
