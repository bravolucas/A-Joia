# Compatibilidade de posições secundárias nos pesos táticos do treinador

O Modo Treinador pondera as formações por setores (GOL/DEF/MEI/ATA). A leitura antiga contava apenas `j.setor`, então uma equipe capaz de cobrir a defesa com um volante/lateral apto poderia ser tratada como incompleta.

## Ajuste controlado
- A nova `alocarSetoresTecnico` executa matching de pessoas **únicas** para as 11 vagas dos pesos 4-3-3, 4-4-2 e 3-5-2.
- Cada atleta prefere seu setor principal e só pode cobrir outro setor mediante `posicoesSecundarias: [{posicao,apto:true}]`. Rótulos sem aptidão não valem.
- Lesionados (`lesao.jogosRestantes>0`), suspensos, indisponíveis ou aposentados são excluídos do cálculo do treinador.
- Vaga sem candidato vale zero como antes. Não é criada contratação, atleta, OVR extra nem bônus de gol.
- Sem posições secundárias e sem indisponibilidades, a qualidade tática é idêntica ao cálculo anterior (teste de equivalência).
- Nenhum save antigo é migrado nem qualquer ID modificado.

## Limites
Este ajuste corrige **a ponderação por setores do Modo Treinador**, não implementa escalações individuais e substituições dentro de partidas desse modo. A interface de contratação/seleção, decisões do técnico em jogo, movimentações do mercado e efeitos durante lesão exigem testes próprios na issue #110. Não indica que a experiência do Copero esteja concluída.
