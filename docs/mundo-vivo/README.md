# Mundo vivo — força do elenco e arquivo persistente

## Comportamento

A qualidade do jogador deixa de ser um bônus independente somado novamente em cada motor. A avaliação compartilhada separa goleiro, defesa, meio e ataque, considera os melhores titulares e os primeiros reservas e limita a influência da fase a 1,5 ponto. Um craque melhora seu setor proporcionalmente ao tempo utilizado; fora de campo sua contribuição é zero. Um jogador abaixo do nível reduz a força quando é utilizado. Contratar um reserva inferior não melhora automaticamente a equipe.

O modo rápido mantém os elencos de todos os clubes nas novas carreiras. Jogadores evoluem, envelhecem, mudam de clube e são substituídos por jovens na posição dos aposentados. O mercado automático respeita limite de elenco no destino e a situação financeira. As ofertas de empréstimo conservam três destinos possíveis para jovens mesmo quando a evolução dos elencos deixa todos os clubes acima da faixa ideal do atleta. A força dos rivais acompanha esses elencos. A gestão do treinador usa a escalação e a profundidade de seu plantel, conservando a API numérica dos saves existentes e evitando contar duas vezes os ajustes de compra e venda.

No modo completo, a avaliação considera o elenco e o usuário; suspensões, descanso e ausência retiram a contribuição. Jogadores do mundo que saem do clube deixam de permanecer no elenco local indefinidamente. As partidas dos demais clubes também usam força dinâmica.

O fechamento anual registra, por clube, colocação disponível, títulos, força antes/depois, evolução da reputação, saúde financeira e motivos do planejamento. Resultados alteram receitas e estrutura gradualmente. Acertos e erros de planejamento têm efeitos limitados, sem transformar derrotas em uma espiral irreversível.

## Competições e jogadores

As ligas do rápido simulam confrontos de ida e volta. O returno inverte o mando de cada jogo do primeiro turno, inclusive em ligas ímpares. A classificação usada nas vagas, nos acessos e nos rebaixamentos é preservada. Um lance de liga altera um placar e recalcula a tabela em vez de apenas trocar nomes de posição.

São arquivadas tabelas das ligas e fases/placares disponíveis das copas. A campanha efetivamente disputada prevalece sobre a simulação externa da mesma edição. Os participantes internacionais são definidos pelas vagas, antes de avaliar a força atual para jogar, sem mudar o catálogo ao trocar de modo.

As estatísticas dos atletas do mundo são distribuídas nos jogos registrados: partidas, gols, assistências, defesas, gols sofridos e jogos sem sofrer gols. Os gols do usuário já conquistados são reservados antes de distribuir os demais entre os companheiros. Não são acrescentadas métricas secundárias. O clube da temporada é preservado separadamente do destino de uma transferência.

O arquivo tem acesso pela História do futebol:

- **Clubes:** evolução de força e colocações por temporada.
- **Competições:** escolha de edição, tabela, placares, filtro de clube e líderes das estatísticas principais disponíveis.
- **Jogadores:** busca, filtro por clube da trajetória e ficha anual, incluindo conquistas, transferências e aposentadoria.

## Persistência e compatibilidade

O mundo é serializável e pertence ao save; não altera `CLUBES`. O fechamento é idempotente por ano. Consultar uma ficha não simula temporadas. As decisões mantêm referência ao arquivo imutável, evitando copiar décadas de jogos a cada escolha; cada fechamento cria novas linhas e mapas.

Novos saves com arquivo vivo usam IndexedDB (`ajoia-carreiras`, store `saves`). O indicador de localStorage é atualizado depois da confirmação da transação. A aplicação aguarda a abertura dos arquivos antes de mostrar a tela inicial. Os consumidores de saves, incluindo museu e slots do modo completo, usam o mesmo leitor. As transições do modo rápido e dos desafios históricos são serializadas e a próxima etapa só aparece depois da confirmação da gravação. Falhas mantêm a etapa anterior e permitem tentar novamente, sem apresentar um avanço que ainda não foi salvo. Exportações do modo completo continuam incluindo todos os dados no JSON.

Saves JSON antigos continuam legíveis. Há compactação compatível para ambientes sem IndexedDB. O acervo do mundo e os resultados compactam nomes repetidos e linhas históricas; as consultas reconstroem os objetos somente quando necessário. Nada é apagado para caber na cota de localStorage.

A simulação exploratória de 25 temporadas demonstrou que o arquivo excede a cota do armazenamento antigo; por isso IndexedDB é parte desta alteração, não uma otimização opcional.

## Limites desta camada

Esta é a primeira camada do mundo persistente, preservando os motores e regulamentos simplificados do A JOIA. Não reproduz todos os sistemas do Football Manager.

- Saves antigos que guardavam somente a elite mantêm esses atletas; suas temporadas passadas não recebem elencos ou estatísticas inventados.
- O calendário e as copas já existentes no modo completo continuam no motor próprio. Só são arquivados os detalhes efetivamente disponíveis nesse modo; a tabela de consulta informa quando não há placares individuais.
- A carreira do usuário mantém seus totais e as distribuições por competição já existentes; uma reformulação integral das partidas do jogador deve ser tratada separadamente, para não apagar o que foi conquistado em minijogos.
- As estruturas de elenco da gestão do treinador e dos jogadores do mundo ainda são distintas. A escalação da gestão influencia a força das partidas do treinador; unificar contratos e identidades entre esses cadastros exige migração específica.
- Competições sem liga doméstica cadastrada continuam usando a classificação internacional simplificada existente.

## Validação

Testes específicos em `tests/mundo-vivo.test.mjs` cobrem presença/ausência, jogador fraco, reservas, perda de titulares, mando dos confrontos, conservação dos gols, goleiros, determinismo, isolamento dos saves e retomada. `tests/mundo-vivo.spec.mjs` valida o arquivo, IndexedDB, filtros e recarga em celular e desktop. As suítes existentes de mercado, história, copas, Fortaleza e museu verificam compatibilidade.
