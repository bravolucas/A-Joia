# Prévia do onze e banco no painel do treinador

A área **Elenco** em `CentroTreinador.jsx` mostra uma prévia de **11 vagas**, organizada pelos setores GOL/DEF/MEI/ATA da formação selecionada (4-3-3, 4-4-2 ou 3-5-2). Cada titular exibe o nome do atleta que já está no cadastro mundial (ou legado de gestão), seu OVR e uma indicação de aptidão secundária quando for o caso. Também aparecem até 7 reservas.

A seleção é pura: recebe os mesmos jogadores exibidos pelo painel, remove IDs repetidos, aposentados, suspensos, lesionados e indisponíveis, e usa `alocarSetoresTecnico` para preencher vagas sem repetir nenhum atleta. Uma vaga sem cobertura fica visível como **Vaga em aberto**; não fabrica um novo jogador nem contrata alguém. Banco e titulares nunca incluem o mesmo ID.

**Limitação deliberada:** esta é uma prévia do elenco **atual**, e os slots são por grandes setores. Não representa a escalação histórica definitiva de cada confronto, não simula trocas ou cartões e não cria novos registros no save. A definição de cada posição exata por formação e de substituições em partidas permanece na issue #110.

Verificação: cinco testes puros de composição, 11 slots, três formações, banco sem duplicações, aptidão comprovada, indisponibilidade, OVR inalterado e estado imutável. CI dedicado, build e CI completa obrigatórios antes do merge.
