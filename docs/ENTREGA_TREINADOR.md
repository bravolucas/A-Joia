# Entrega para revisão — modo treinador

Todo o pacote está na branch `checkpoint/treinador-elenco-orcamento`. A versão pública continua sem estas mudanças: a branch não foi mesclada em main e não houve deploy nesta sequência.

## O que está pronto

- **Elenco e mercado:** orçamento, folha/teto, setores, compra e venda com confirmação, contratos e renovação.
- **Virada anual:** envelhecimento, evolução, encerramento de contratos, reposição pela base e aporte financeiro aplicado uma vez por ano.
- **Tática:** formações 4-3-3, 4-4-2 e 3-5-2; estilos ofensivo, equilibrado e defensivo com efeitos na liga e nas copas.
- **Jogo importante:** opção de pausar uma vez por temporada para manter o plano, atacar ou defender naquele confronto. A decisão pendente é salva.
- **Comissão:** auxiliar técnico, preparador de desenvolvimento e olheiro. Contratos de uma temporada, custos antecipados e espaço ocupado na folha; sem renovação automática.
- **Idolatria:** aviso e confirmação antes de assinar com rival de um clube onde o treinador é ídolo. A assinatura remove benefícios futuros daquele vínculo, preservando o passado e as conquistas.
- **Desafios históricos:** Santos 2002, Leicester 2016 e Flamengo 2019. Missões de uma temporada, galeria e save próprios.

## Como revisar

1. Na carreira de treinador, escolha ou mantenha um clube. O jogo para na pré-temporada para permitir a gestão antes de simular.
2. Abra **Elenco e mercado**, compare orçamento e folha, faça uma compra e cancele uma venda antes de confirmar outra. Na aba **Comissão técnica**, confira prazo e custos antes de contratar.
3. Escolha formação e estilo. Ative **Acompanhar jogo importante** para testar a pausa opcional. Saia e volte durante a pausa; a mesma decisão deve continuar disponível.
4. Após a temporada, confira campanha, plano usado e resultado do jogo importante. Na próxima pré-temporada, confira contratos, reposição e encerramento da comissão.
5. No menu inicial, abra **Desafios históricos**. Inicie uma missão, volte ao menu e retome. Ao concluir, revise o resultado e a galeria; a carreira principal permanece no seu save original.
6. Para conferir a idolatria, use uma carreira que tenha vínculo de ídolo e receba oferta de um rival: o aviso permite desistir antes da assinatura.

## Limites desta entrega

Os desafios são inspirados em campanhas reais; usam elencos fictícios e calendários da simulação, sem reconstrução exata dos campeonatos históricos. Seus resultados ficam na galeria própria, sem criar troféus históricos no museu da carreira principal.

A intervenção atual acontece antes de um jogo forte da segunda metade da liga. Não é uma simulação de intervalo nem uma pausa em toda rodada. Saves antigos já em andamento por etapas continuam no fluxo anterior.

A idolatria rompida não é reconciliada automaticamente nesta versão. Contratos de comissão não têm rescisão durante a temporada. Os efeitos e custos são informados antes da contratação.

## Evidências e continuidade

- [Auditoria de 30 anos e dificuldade dos desafios](AUDITORIA_GESTAO.md).
- [Dados reproduzíveis da auditoria](auditoria-gestao.json).
- [Relatório técnico de continuidade](CONTINUIDADE.md).
- Testes de lógica e build de produção aprovados na revisão de código anterior; não houve alteração do código da aplicação depois daquela validação.
- A validação final de navegador inclui 46 cenários em celular e desktop. O resultado final está registrado no relatório de continuidade.

O escopo combinado está concluído. O próximo passo é publicar quando o usuário solicitar, preservando a versão mais recente de main e resolvendo eventuais mudanças concorrentes antes de mesclar. Push em main aciona GitHub Pages automaticamente.
