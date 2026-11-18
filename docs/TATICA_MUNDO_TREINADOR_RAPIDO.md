# Tática do Modo Treinador Rápido com o universo persistente

## Lacuna
O modo rápido já conserva jogadores na propriedade `c.mundo.jogadores`, mas `perfilTaticoTecnico(t)` antes ignorava esse elenco, pois não havia gestão tática tradicional em `t.gestao`. Isso produzia ajuste tático zero para qualquer formação, sem efeito da versatilidade real dos atletas.

## Solução não destrutiva
- `elencoTaticoRapidoDoMundo(mundo,clube)` lê o cadastro existente e produz uma pequena lista temporária dos jogadores **ativos do clube atual**; preserva seus IDs, OVR, posição e aptidão secundária explícita. Exclui aposentados, atletas de outros clubes e IDs duplicados.
- Os selecionadores já existentes filtram também suspensos, lesionados e indisponíveis; um jogador não é alocado em mais de um setor.
- `perfilTaticoTecnico(t,elencoMundoRapido)` usa o elenco temporário no modo rápido. Sem a lista, preserva o comportamento anterior; no modo de gestão tradicional permanece a mesma API.
- `probabilidadesConfrontoTecnico` recebe opcionalmente a lista, e `simularEtapaTecnico` e `simularTemporadaTecnico` fazem a projeção **uma vez por simulação**, para usar nos confrontos e copas.
- A lista é variável local, **não** é adicionada ao estado do treinador, histórico da temporada nem saves. Não são gerados novos jogadores, contratos ou transferências. Não há sorteios extras, novas imagens ou bônus gratuito de OVR.
- Os efeitos continuam limitados às margens táticas originais (entre -3 e +3) e só aparecem quando o clube tem um elenco mundial válido.

## Limites
Esta etapa **não** é uma escalação individual com substituições minuto a minuto; o modo treinador segue usando probabilidades agregadas. A issue #110 continua aberta para exibição de 11 nomes e banco em cada rodada, confirmação das vagas por posição exata e integração com negociação e lesões durante o calendário.

## Regressões
Testes focados verificam projeção sem mutação, IDs únicos, jogadores indisponíveis, probabilidade ao mudar a formação, equivalência sem mundo e simulação real de etapa sem gravar cópias de jogadores no save. Além disso, CI completa e build de produção são obrigatórios antes do merge.
