# Copas: estratégias variadas e revelação posterior

24 estratégias em oito situações e seis opções de pênaltis. Cada partida oferece três cartas com intenção e perfil de risco, sem porcentagem antecipada. Após um clique, revelação automática de 1,35 segundo apresenta a chance calculada; o resultado e o botão de continuar surgem no mesmo painel. Movimento reduzido entrega o resultado com as chances diretamente.

`estrategiasCopas.js` determina o cenário pelo seed da campanha e etapa. Partidas consecutivas alternam situações; reabrir a mesma partida não muda cartas. `copasEscolha.js` aplica ajustes reais de vitória/empate/derrota, com força relativa e pressão da final. Oportunismo favorece relativamente quem enfrenta adversário superior; cautela aumenta empates; agressividade abre o jogo. Não há garantia de vitória. Pênaltis continuam com força relativa e pressão própria.

A probabilidade exibida é a mesma usada no sorteio e fica persistida em `resultado.revelacao`, junto ao nome da estratégia. Saves antigos sem esse campo continuam abrindo; planos antigos seguem aceitos para compatibilidade. Novos IDs só são aceitos quando oferecidos na decisão atual. Integração compartilhada por jogador e treinador.

Em telas baixas, descrições continuam legíveis e as regras da fase de liga ficam em seção expansível. Preservados adversário, chave, calendário, resultado salvo antes da animação e uma única escolha.

Validação: 351 testes de lógica e build aprovados. Primeira tentativa de navegador foi interrompida por base incorreta da prévia, sem resultado válido; execução seguinte apontou duas falhas de altura em 320px, corrigidas compactando regras/cabeçalho. Revalidação final: seis cenários aprovados, incluindo as duas falhas de altura; 24 cenários distintos aprovados no conjunto das execuções válidas. Screenshot final em 320px inspecionado, três cartas inteiras e descrições visíveis.

## Pendências confirmadas fora deste lote

- Seis estaduais sem imagem adequada: Sergipano, Baiano, Cearense, Pernambucano, Paraense e Amazonense. Fontes externas propostas no rascunho da rede ainda não ativas na instância.
- Catálogo de estaduais no museu usa `.map(x => x.nome)` sobre strings; precisa corrigir junto com fallback/cobertura e testes do acervo.
- Próximos lotes visuais: goleiros, loja, propostas/chegada, seleção, fechamento/premiações, museu/álbum e vínculos. São oportunidades registradas no mapa visual, não uma auditoria de conclusão de toda a lista histórica de 100 itens.
- Validação anterior das oito taças confirmada: Pages e CI de `7a5903a` terminaram com sucesso.
