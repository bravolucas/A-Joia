# Celebração de todas as taças e continuação da lista

## Problema e correção

O fechamento anterior guardava o resumo em estado local e já abria a próxima etapa; uma recarga perdia o pop-up. Além disso, apenas Copa do Mundo e Bola de Ouro entravam na festa completa, e rever uma copa comum pelo caminho legado podia gerar uma tela vazia.

Agora toda temporada fechada usa a etapa persistida `fechamento`. O card, os troféus e as recompensas já estão registrados; essa etapa somente os apresenta. O fluxo de ações seguinte só é aberto ao continuar. Título de copa nacional, liga, continental, seleção e prêmio usam a mesma janela: taça animada, nome, quantidade/anos da carreira, jogos/gols/assistências, OVR e nota. Outras conquistas ficam acessíveis na mesma janela, sem sequência obrigatória. Detalhes da campanha e histórias são opcionais. Sem título também existe resumo.

Uma ação principal; rodapé sempre acessível; corpo pode rolar em situações extremas/ao expandir detalhes. Layout de duas colunas no computador. Movimento reduzido desliga animações. Avançar, recarregar ou rever não chama novamente o fechamento nem credita prêmios. Saves legados de festa, inclusive revisões com retorno, são retomados na apresentação correta.

## Outros avanços autorizados

- Elenco de 26 atletas passa a participar de campanhas continentais da seleção, com partidas materializadas coerentes com o resultado sorteado, escalação, minutos e gols/assistências limitados ao placar. Final titular acompanha o minigame; final de reserva acompanha o resultado automático. Copas e continentais mantêm estatísticas separadas, jogadores e renovação compartilhados. O formato de fases continua o formato abstrato do motor anterior, não uma reprodução de todos os regulamentos oficiais.
- Recordes de temporada por clube, clubes da liga e universo observado. Só resultados disponíveis são usados; rivais entram a partir desta atualização e números de atleta transferido pertencem ao clube anterior. Não são recordes históricos reais. Marcas locais são apresentadas antes do universo. Não há bônus esportivo por quebrar uma marca.
- Reflexo do goleiro mostra três posturas fotográficas do cobrador. A regra anterior de pista imperfeita foi preservada; bola só parte após escolha, para o alvo real.
- Álbum recebe imagens locais; museu dá progresso também a objetivos booleanos; recusa de capitania vale na temporada.

## Auditoria e pendências

A situação exata dos 50 itens selecionados está em `docs/jornada-com-memoria/AUDITORIA-LISTA-USUARIO.md`. Permanecem cobertura histórica real do item 67 e auditoria visual exaustiva do item 98, além de refinamentos de variedade/fluidez nas bases narrativas e animações. Não tratar os recordes simulados como substituição silenciosa de dados históricos reais.

## Validação

37 arquivos de lógica e 119 cenários de navegador passaram. Novos testes exercitam a Copa do Brasil ganha de fato, resumo persistido após recarga, transição única, replay legado sem duplicação, múltiplas taças/anos, temporada sem título, movimento reduzido, elenco continental, recordes e três posturas que podem enganar. Fluxo de título testado em 320×568, 390×640 e 1366×640. Testes de domínio cobrem 60 campanhas continentais em quatro seleções, minutos/placares, goleiro, estatísticas separadas, autoria de recordes após transferência, aposentados, capitania e metas. Capturas nesta pasta; logs e publicação em `docs/CONTINUIDADE.md`.


### Complemento de replay
O acesso pelos detalhes agora mostra **Rever conquistas** para qualquer título, incluindo Copa do Brasil; o replay restaura a etapa anterior sem novas recompensas. Copa vencida aparece como Campeão no resumo. Build e 32 testes direcionados de navegador passaram após o ajuste (14 fechamento, 12 jornada, 6 OVR).
