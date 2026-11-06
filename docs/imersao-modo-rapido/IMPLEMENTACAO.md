# Imersão com poucas decisões

## Entregue

- Quatro minigames originais em SVG/React: cruzamento (escolher atacante livre), interceptação (ler a rota do passe), cabeceio (toque na faixa de tempo) e reflexo (ler o canto do chute). Mesmos controles por toque/teclado, um resultado e continuação. Cabeceio sem movimento usa um toque sem exigência de timing.
- Oito famílias no total, compatíveis com posição, priorizando inéditas e evitando repetição consecutiva na geração normal da carreira. Novos momentos usam sorteio determinístico isolado, mantendo resultados esportivos e recargas coerentes. Jogos antigos com mini salvo não são remapeados.
- Legado: bônus de superação para títulos de clube, calculado pela força registrada na temporada, até 60% extra sobre os pontos dos títulos elegíveis. Não altera OVR, chance de título ou patrimônio. Saves sem registro de força não recebem bônus retroativo inventado. Nenhum bônus para títulos de seleção. A força registrada inclui o ajuste de força de foco já usado naquela campanha.
- Cosméticos: quatro estilos (um inicial e três desbloqueáveis por coleção), equipáveis na loja, ficha e museu. Persistência local separada, sem moeda ou vantagem esportiva. Aplicação no fundo da carreira e detalhes de painéis, preservando cores dos clubes. Seleção validada com as conquistas existentes; nenhum desbloqueio por compra de OVR.
- Idolatria: patamares Chegando, Acolhido, Referência, Ídolo e Lenda; próximo marco e pontos faltantes. Usa a torcida atual por clube, inclusive destino do empréstimo. Ídolo em 75, compatível com o museu; Lenda em 95. Não muda pontos ou curva de ganho de torcida.
- OVR: revelação em cartas com destaque animado, bola e confirmação do resultado persistido; retirados ponteiro/seta e seta do antes/depois. Mantidos animação de contagem, pular revelação, respeito a movimento reduzido e ausência de novo sorteio ao recarregar.

## Referências consultadas

- https://github.com/CakeDev4k/prime-files : explorador Windows em Rust/GPUI, licença MIT. Não é biblioteca web nem pacote de UI de jogo. Referência possível de organização compacta; nenhum código ou asset incorporado.
- https://github.com/motiondivision/motion : biblioteca de animações JS/React/Vue. Consultada como referência de transições. A implementação do lote usa CSS/SVG/RAF existentes, sem instalar Motion ou introduzir dependência adicional.
- Artes locais existentes e personagens do próprio A JOIA. Nenhuma imagem de outros jogos copiada.

## Validação

203 testes de lógica passaram. Primeira suíte de navegador: 35 casos passaram (novos jogos, museu, desafios, compras, goleiro, empréstimos e criação). Após ajustes de movimento e apresentação: 15 casos relevantes repetidos e aprovados. Build de produção e diff check passaram. Testes verificam rotação por posição, ausência de repetição, méritos históricos, faixas de idolatria, quatro jogos em 390/1366, cosmético persistente sem mudar atributos e resultado de OVR salvo. Novos testes incluídos no CI. Logs `/tmp/imersao-*`.

## Próximas opções — propostas, não implementadas

1. Treino livre: praticar os oito jogos fora da carreira, sem alterar save ou dar recompensas. Alto valor, esforço médio.
2. Metas diárias em três níveis: usar a Carreira do Dia existente com objetivos por posição e recompensas cosméticas. Alto valor, esforço médio.
3. Projeto esportivo nas propostas: papel esperado/minutos, com consequência real no empréstimo e no clube novo. Alto valor, esforço alto.
4. Revanche: reconhecer o adversário de uma eliminação anterior e contextualizar o reencontro. Alto valor, esforço médio.
5. História curta de dupla: um companheiro acompanha alguns anos e aparece em assistências/reencontros, sem tarefas extras. Valor médio, esforço alto.
6. Perfil sonoro discreto: diferenças entre estreia, título, defesa e despedida, com volume e silêncio respeitados. Valor alto, esforço médio.
7. Recapitulação ao voltar: uma linha com último clube/decisão e próximo objetivo. Alto valor, esforço baixo.
8. Cartão final compartilhável com três momentos escolhidos da carreira, sem exigir login para gerar a imagem. Alto valor, esforço médio.
