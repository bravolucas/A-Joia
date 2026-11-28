# Biblioteca cinematográfica do A JOIA

O ZIP A-JOIA-personagens-WebP.zip já contém os 31 arquivos na pasta correta (`arte/jornada/personagens/`). Extraia na raiz do repositório. Execute `npm run validar:personagens` para confirmar os 31 WebP com alpha, dimensão 720 × 768 e estrutura válida. Em seguida execute `npm test` e `npm run build`.

Os recortes são modelos fixos, não avatares personalizados. As variantes B de premiação têm outro rosto e não devem ser sorteadas junto ao modelo A. O fundo é controlado pelo jogo. A ausência de imagens continua tolerada em desenvolvimento; antes de publicar este recurso, a validação de personagens deve passar. Não considerar aparência e uniforme dinâmicos concluídos.

A biblioteca já é consumida pela apresentação oficial, pela revelação do pódio, pela cerimônia principal da Bola de Ouro e pela reação final à convocação. Na ausência dos arquivos, as telas preservam a arte anterior ou o resultado sem personagem. O script de validação dos arquivos é obrigatório antes de aprovar a biblioteca.

## Bloqueio de publicação

O CI agora exige `npm run validar:personagens` antes dos testes de lógica e do build. Sem os 31 WebP, o PR não passa. O deploy já depende da conclusão bem-sucedida do CI da main. Extraia o pacote e envie os 31 arquivos `.webp` para esta pasta na branch do PR #180, sem substituir este README. A personalização individual ainda é uma etapa separada.
