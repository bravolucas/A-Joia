# Revisão de legado, telas raras e marcas

## Mudanças

- Traços em três cartas no computador, leitura vertical no celular; escolha continua em um clique, com movimento reduzido.
- Legado completo usa duas colunas no computador, caminhos de pós-carreira em área própria de largura total; celular mantém rolagem normal.
- Sala de troféus do legado: taça, ×quantidade e anos disponíveis, sem duplicar troféus.
- Tela inicial permite **Rever legado** depois de encerrar uma carreira; começar nova continua disponível.
- Marcas em Copas ganha **26 partidas de Messi**. Fonte Fjelstul, CSV de aparições masculino 1970–2022, atribuição/licença em `dados/CREDITOS-COPAS.md`. Apenas jogos registrados em Copas entram; saves sem esse campo têm aviso de contagem parcial. Gols seguem separados de partidas; continentes e clubes não entram.

## Validação

Build e 38 arquivos de testes de lógica passaram. Três novos casos de domínio verificam escopo, ano de igualar/superar, replay e ausência de dados antigos. Sete cenários novos de navegador cobrem traços, coletiva, legenda de partidas e legado, em celular/computador.

Primeira execução de navegador iniciou sem prévia ativa e foi descartada. Prévia reiniciada e conferida antes da rodada válida. Novos testes de legado inicialmente usaram saves artificiais incompletos; corrigidos para criar temporadas e aposentadoria pelo motor real, sem alterar o produto para acomodar esses fixtures.

Resultado final da regressão e publicação registrados no topo de `docs/CONTINUIDADE.md`.

## Limites e próximos pontos

Os itens 67 e 98 ainda não estão completos. Faltam referências de clubes/ligas com métricas comparáveis, atualização mundial posterior a 2022 e auditoria visual das demais telas raras e do modo completo. O ranking atual de ligas não fornece pontos reais, nem os totais de gols distinguem cada competição: não comparar essas métricas com recordes históricos de uma liga.
