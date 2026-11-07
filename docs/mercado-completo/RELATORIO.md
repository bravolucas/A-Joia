# Mercado do modo completo: ofertas e empréstimos legíveis

## Alterações

- Cartões comparáveis, com clube, modalidade, liga/força, base salarial anual e informação de torcida separadas. Em desktop, a vitrine usa colunas; no celular, cartões completos com ações acessíveis.
- Modalidade explícita: **transferência definitiva** ou **empréstimo de 1/2 temporadas**. Oferta de empréstimo informa origem do passe e retorno ou eventual proposta de compra.
- Salário apresentado como base para negociar e calculado com o mesmo multiplicador do empresário usado para abrir a negociação. Não é mostrado como renda já garantida.
- Seleção de duração explica que haverá comparação de propostas antes de assinar. Folha de empréstimo mostra origem, destino e duração fixa; prazo dos termos contratuais recebe rótulo distinto.
- Voltar às buscas e ficar para jogar permanecem visíveis na área rolável. Botão que inicia a temporada agora diz **Ficar no clube e jogar**.
- Resumo de empréstimo em andamento na campanha: destino atual, clube de origem e temporadas restantes. Prazo zero aparece como retorno/compra em decisão; não anuncia um retorno que ainda não aconteceu.
- Busca sem propostas recebe mensagem explícita, sem prometer nova tentativa de empréstimo na mesma temporada.

## Validação

Primeira rodada: build e 12 cenários de navegador passaram (5 de mercado, 3 de campanha/contrato e 4 de saves/janelas). Rodada específica final inclui sete cenários de mercado: quatro combinações 1/2 temporadas × 320/1366 px, prazo ativo e encerrado, e oferta definitiva. Verificam modal correto, base salarial igual à folha, volta à lista com bloqueio de fundo preservado, ausência de overflow e nenhuma temporada criada só por consultar as informações.

As fixtures usam normalização do save e mundo criado pelo motor. Não simulam uma temporada inteira nem pretendem validar todos os caminhos de compra definitiva/retorno. Resultado final e publicação no registro de continuidade.

## Escopo restante

Sem alteração nas regras de contrato, duração de empréstimo, pagamento, compra, retorno ou simulação esportiva. Permanecem a revisão dos demais estados raros de competição/mercado do modo completo, referências históricas comparáveis de clubes/ligas e refinamentos corporais das cenas. Itens 67/98 não foram marcados como concluídos.
