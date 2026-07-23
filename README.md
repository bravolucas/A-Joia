# ⚽ A JOIA — Simulador de Carreira

Simulador de carreira de jogador de futebol, no estilo Football Manager mas do ponto de vista do atleta.
Da peneira na base até pendurar as chuteiras.

## Rodando o projeto

Precisa ter [Node.js](https://nodejs.org) instalado (versão 18 ou superior).

```bash
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:5173
```

Outros comandos:

```bash
npm run build     # gera a versão de produção na pasta dist/
npm run preview   # testa a versão de produção localmente
```

## Estrutura

```
src/
  main.jsx         → ponto de entrada
  index.css        → Tailwind + estilos base
  data.js          → dados do jogo (clubes, ligas, posições, itens da loja...)
  lib.js           → lógica pura (simulação, mercado, calendário, mundo, lesões...)
  components.jsx   → componentes de UI reutilizáveis (cards, minigames, popups...)
  AJoiaGame.jsx    → componente principal com todo o fluxo de telas
```

A separação é por responsabilidade: `data.js` não depende de nada, `lib.js` depende dos dados,
`components.jsx` monta a interface, e `AJoiaGame.jsx` orquestra tudo.

## O que o jogo tem

**Carreira**
- Origem do jogador (várzea, base de clube grande, futsal, filho de ex-jogador...) que molda o potencial
- Peneira jogável com minigames de pênalti, falta e passe
- Evolução de atributos com curva de crescimento e declínio por idade
- Aposentadoria com escolha do que fazer da vida (técnico, embaixador, comentarista...)

**Mundo vivo**
- ~350 jogadores com carreira própria: evoluem, trocam de clube, ganham prêmios e se aposentam
- Disputa real da Bola de Ouro, artilharia e ranking mundial por posição
- Ligas que se mexem: acesso, rebaixamento e oscilação de força dos clubes
- Técnicos com nome, filosofia de jogo e ciclos que se encerram

**Relações**
- Pactos com o técnico, cobrados no fim da temporada
- Conversa sobre estar no banco, com motivo real e caminhos diferentes de resposta
- Vestiário com parceiro de jogadas, apadrinhado e desafeto
- Aprovação separada de torcida, elenco, comissão, diretoria e imprensa

**Carreira internacional**
- Convocações disputadas com compatriotas reais
- Ciclo de 4 anos: Copa do Mundo, continental, eliminatórias e amistosos
- Capitania da seleção

**Mercado e dinheiro**
- Empresários com estilos diferentes (agressivo, cauteloso, especialista numa liga...)
- Valor de mercado calculado por nível, idade, forma, contrato, liga e fama
- Cláusula de rescisão que outros clubes podem pagar
- Estilo de vida que afeta reputação, desgaste físico e patrocinadores

**Registros**
- Estatísticas separadas por competição e pela seleção
- Linha do tempo de marcos da carreira
- Recordes de clube pra perseguir
- Inbox de notícias em formato de jornal, tweet ou post

## Ideias pro futuro

- Atributos mais granulares (6 → 15, divididos em técnicos/mentais/físicos)
- Apelido dado pela torcida e cânticos no estádio
- Adaptação ao país e saudade de casa nas transferências
- Narração dos lances decisivos
- Biografia final gerada a partir dos marcos da carreira
