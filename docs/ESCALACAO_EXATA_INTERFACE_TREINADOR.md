# Escalação visual por posição exata no Modo Treinador

## Problema

O PR #115 passou a mostrar onze nomes e banco na tela **Elenco**, mas calculava as vagas apenas em quatro setores (GOL/DEF/MEI/ATA). Um clube com quatro zagueiros e nenhum lateral poderia ser mostrado com a defesa completa, embora não tivesse lateral apto.

## Solução

Este PR de integração mantém a UI responsiva do PR #115, mas usa o matcher `escalarOnzePosicionalTecnico` do PR #116 e exibe a **posição individual de cada vaga**: GOL, LD, ZAG, LE, VOL, MC, MEI, PD, PE e ATA, conforme a formação.
- Um atleta só pode aparecer como titular numa posição principal ou secundária com `apto:true`; um rótulo solto não basta.
- Onze nomes distintos são exigidos para 11/11. A posição sem candidato recebe `Vaga em aberto`, mesmo que sobrem jogadores de outro setor.
- Lesão, suspensão, aposentadoria e indisponibilidade removem o atleta da prévia e do banco.
- Banco de até sete atletas preserva goleiro reserva quando disponível, sem repetir nomes.
- Todos os jogadores são lidos do elenco do painel, já ligado ao universo persistente; esta prévia não grava estado, não simula substituições, nem cria atletas.

## Ordem de integração

Branch derivada do PR #115 e incluindo o matcher idêntico ao PR #116 para testes isolados. **Mesclar primeiro PR #116, depois PR #115** (ou reconciliar na mesma integração) e então este PR, conferindo possíveis conflitos e rodando novamente toda a CI no head exato. Não encerrar a issue #110 até historizar titulares por partida e implementar substituições e disponibilidade ao longo da temporada.

As suites `previsao-escalacao-tecnico.test.mjs` cobrem posições exatas, 4-3-3/4-4-2/3-5-2, aptidões secundárias, vagas abertas, banco e compatibilidade. A auditoria dedicada também executa `escalacao-posicional-tecnico.test.mjs`.
