# Histórico e calendário dos estaduais

O início da carreira é 2025 (`ANO_INICIO`). A base de estaduais inclui os registros anteriores a esse ano, com os clubes e os anos das conquistas. Títulos de 2025 em diante pertencem à simulação do save. A base não injeta resultados reais posteriores ao início da carreira.

`src/dados/estaduaisHistoricos.js` contém os dados compilados de listas históricas da RSSSF Brasil e das tabelas de campeões da Wikipédia em português, consultadas em 14/11/2026. Os URLs específicos dos 27 campeonatos estão em cada registro. A RSSSF credita as listas aos seus respectivos autores (entre eles Julio Bovi Diogo e colaboradores). O arquivo do jogo contém fatos — clubes e anos — e mantém a atribuição por links; não reproduz os textos das páginas.

## Critérios da base

- Quantidades resultam dos anos cadastrados, inclusive conquistas compartilhadas. Um clube pode ter duas conquistas no mesmo ano: o Flamengo, por exemplo, possui dois títulos cariocas em 1979.
- O Supercampeonato Paulista de 2002 não entra no Paulista do São Paulo. O título estadual paranaense de 2002 do Athletico está incluído na contagem adotada pelo clube e pelo quadro de títulos da competição.
- Atlético Paranaense e Athletico são o mesmo clube; Bragantino/Red Bull Bragantino também. América-MG, América-RN e clubes homônimos de outros estados continuam distintos.
- O clube pode ter títulos em mais de um estadual. Operário-MS e Comercial-MS mantêm também suas conquistas no antigo Mato Grosso, anteriores à divisão do estado.
- O Tocantinense usa o período profissional, a partir de 1993; as edições amadoras de 1989–1992 não reconhecidas como estaduais pela federação não entram.
- Há divergências documentadas no Potiguar. As contagens de ABC (57) e América-RN (38) seguem os registros e reivindicações apresentados no histórico da competição até 2024, incluindo 1924. As edições controversas de 1920, 1921 e 1924/25 são informadas junto do histórico, preservando os registros dos dois clubes em vez de atribuir certeza a uma única versão. A lista da RSSSF e a tabela de títulos homologados apresentam contagens diferentes; essa diferença não é escondida.
- Ano sem vencedor documentado não recebe campeão inventado. Clubes sem conquista no levantamento ficam com zero, independentemente da força atual.

A galeria do clube mostra os anos históricos; a galeria da competição mostra as edições anteriores a 2025 e o ranking com base + carreira. Clubes regionais e históricos também podem ser consultados. As edições reais antigas não recebem placares ou estatísticas individuais fictícias.

## Calendário vivo

Os 26 estados e o Distrito Federal são processados em cada temporada concluída, sem filtrar pela liga, pelo país ou pela convocação do usuário. Os formatos são os formatos simplificados do jogo: classificação e mata-mata com os representantes regionais cadastrados, sem prometer o regulamento oficial nem todos os participantes de cada edição real.

Cada torneio guarda campeão, vice, classificação e partidas efetivamente simuladas. Os clubes existentes usam o mesmo elenco e a mesma avaliação de força do mundo. Clubes regionais também mantêm o histórico de evolução no universo.

Ligas, copas nacionais, continentais de clubes, Copa São Paulo, copas de seleções e mundiais seguem o calendário externo. A Copa do Mundo segue os anos `ano % 4 === 2`; as copas continentais de seleções seguem o calendário já usado pelo modo treinador. O mundial de clubes de 32 equipes ocorre a cada quatro anos a partir de 2025. A Intercontinental anual usa os quatro campeões continentais disponíveis no calendário e os representantes africano e oceânico cadastrados; suas cinco partidas são arquivadas. Os formatos de seleções e as vagas complementares dos mundiais continuam simplificados.

A edição já disputada pelo usuário prevalece. Campos legados de copas próprias, quando não permitem recuperar o campeão, são preservados; não se sorteia outro campeão para substituir o que foi jogado. Essa proteção também vale após eliminação ou derrota na final. A Copa São Paulo distribui estatísticas somente entre os jogadores de até 20 anos.

No treinador de seleção, o mundo dos clubes também avança, incluindo evolução dos jogadores, classificação, acessos, rebaixamentos e os estaduais.

## Compatibilidade e persistência

A base histórica é consultada também nos saves antigos. Contadores estaduais legados eram contadores de carreira sem base inicial: `historicoEstadualVersao` distingue esses contadores dos novos totais absolutos, para adicionar o histórico uma única vez e preservar conquistas já realizadas. A galeria concilia os totais com os eventos salvos sem duplicar títulos.

Não são inventadas temporadas simuladas que aconteceram antes desta implementação e não foram salvas. A base anterior a 2025 passa a aparecer imediatamente; o novo calendário registra as próximas temporadas concluídas. Visualizar ou recarregar não gera uma nova edição. Arquivos de partidas completos são preservados no universo; os resumos das temporadas continuam compactos.

Falsas placas antigas de “primeiro estadual”, causadas pela base vazia, deixam de ser apresentadas como feitos históricos no arquivo e no museu pessoal. As conquistas reais da carreira são mantidas.
