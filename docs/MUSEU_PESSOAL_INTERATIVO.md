# Museu pessoal interativo — 09/11/2026

O menu **Meu museu** abre uma exposição de uma carreira por vez. A ficha do jogador e o histórico individual também oferecem **Visitar meu museu**. Quando existem várias carreiras salvas, o seletor permite alternar entre o rápido e os slots do completo, sem somar suas estatísticas.

## Salas e interação

- Salão de entrada em perspectiva, iluminação, pedestais e camisa principal. Cada objeto abre uma história.
- Sala das camisas: passagens contínuas, com uma peça nova ao retornar a um clube. Álbum com temporadas e gaveta com lembranças e títulos relacionados.
- Sala dos troféus: vitrine por competição, com seletor das edições conquistadas. Prêmios individuais separados dos títulos coletivos.
- Arquivo de lembranças: contratos, cartas, ingressos, recortes, braçadeiras, bolas, placas e passaportes comemorativos. Inclui lesões, rebaixamentos e finais perdidas que constem no save.
- Túnel da carreira: capítulos por ano, incluindo a fase de treinador.
- Seleção, pessoas e treinador: estatísticas nacionais, retratos ilustrativos de personagens registrados e pranchetas das temporadas no banco.
- Visita guiada manual, com próxima/anterior e abertura de peças, sem reprodução automática.

**Organizar minha exposição** permite escolher três favoritos, camisa central, frase de até 120 caracteres e três ambientes. A camisa principal continua exposta mesmo quando há favoritos. A curadoria fica por identidade de carreira em `ajoia_museu_pessoal_v1`, separada dos saves e de `ajoia_museu_v1`.

## Preservação e limites

A coleção permanente continua em **Coleção permanente →**, com seu catálogo, objetivos, progresso, importação e exportação existentes. Seu backup cobre a coleção permanente; a curadoria pessoal fica neste navegador. Os saves continuam sendo a fonte do museu pessoal. A galeria histórica dos clubes permanece no nome do clube e não é somada aos títulos pessoais.

Os objetos são representações comemorativas. Nenhuma fotografia de partida, placar, adversário, data exata de estreia ou número histórico ausente é inventado. A primeira temporada com gols não é apresentada como uma partida conhecida do primeiro gol. Retornos com numeração desconhecida não herdam o número de outra passagem. Títulos nacionais antigos sem ano permanecem sem ano; só são adicionados quando excedem os registros datados da mesma competição. Estatísticas de treinador e seleção não entram nos totais de jogador por clubes.

Acessibilidade: diálogos nativos com Escape e restauração de foco, bloqueio de rolagem compartilhado nas janelas sobrepostas, controles de pelo menos 44px, redução de movimento e telas de 320px em diante. Arquivos extensos têm exibição progressiva de 24 peças.

## Validação

Testes de modelo cobrem passagens/retornos, deduplicação das edições, preservação do save, ausência de fatos inventados, modo completo, seleção, treinador, isolamento da curadoria e slots. Testes de navegador cobrem celular/desktop, foco, gavetas, álbuns, edições, favoritos, curadoria persistente, túnel, visita guiada, troca de carreira e coleção permanente. A suíte anterior de backup/importação e galeria dos clubes continua ativa.
