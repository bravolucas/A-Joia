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
index.html            → página que o Vite serve; carrega src/main.jsx
src/
  main.jsx, App.jsx   → entrada e menu principal (escolha do modo)
  LimiteDeErro.jsx    → tela de erro que protege o save
  index.css           → Tailwind + estilos base
  jogador/            → carreira do jogador (o modo principal): ModoRapido.jsx (telas) e rapido.js (regras),
                        criação do atleta, pré-temporada, desafios, Copa, loja, jornada, recordes
  treinador/          → carreira de técnico pós-aposentadoria: tecnico.js, CarreiraTecnico.jsx, competições,
                        mercado, comissão, tática, loja e vitrine do treinador
  completo/           → Modo Carreira completo (jogo a jogo): AJoiaGame.jsx e save.js
  museu/              → museu permanente de taças e camisas entre carreiras
  desafios/           → desafios históricos
  comum/              → peças usadas por vários modos: lib.js (simulação), components.jsx, arte.js,
                        taças, ícones, sons, animações, visual de campo e minigames
  dados/              → data.js (clubes, ligas, posições...) e tabela histórica das Copas
arte/                 → escudos, taças, bandeiras, fotos, fontes, sons e animações (com créditos)
public/               → ícones do app (PWA)
tests/                → *.test.mjs (lógica, `npm test`) e *.spec.mjs (navegador, Playwright)
scripts/              → utilitários: gerar animações, atualizar acervo de taças, auditar gestão
docs/                 → relatórios e capturas de cada entrega (histórico em docs/CONTINUIDADE.md)
.github/workflows/    → ci.yml (testes + navegador) e deploy.yml (publica no GitHub Pages)
```

Regra de dependência: `dados/` não depende de nada; `comum/lib.js` depende dos dados;
cada modo (`jogador/`, `treinador/`, `completo/`) usa `comum/` e `dados/`.

## Testes

```bash
npm test                       # testes de lógica (node --test)
GITHUB_PAGES=true npm run build && GITHUB_PAGES=true npm run preview -- --port 4173 &
npx playwright test tests/*.spec.mjs   # testes no navegador (precisa de @playwright/test)
```

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

## Museu permanente

O botão **Meu museu** no menu reúne taças, camisas comemorativas e 14 feitos de todas as carreiras. As conquistas do modo rápido, do treinador e do modo carreira completo são registradas nos saves e permanecem ao iniciar outra partida.

- **Taças:** cada competição ocupa uma peça; títulos repetidos aumentam sua contagem.
- **Camisas:** dispute ao menos uma temporada por um clube e alcance 75 de aprovação da torcida. Treinadores também podem desbloqueá-las.
- **Feitos:** consulte cada peça bloqueada para ver seu objetivo, como marcar 100 gols ou conquistar um título como treinador.

O museu aproveita os saves existentes neste navegador. Ele fica separado dos slots de carreira; use **Exportar coleção** para fazer backup e **Importar coleção** para recuperá-lo em outro navegador. Importar soma as conquistas, sem apagar a coleção atual nem duplicar o mesmo save. Limpar os dados do navegador também remove a coleção local.

## Acabamento visual

Os quatro minigames compartilham cenários e personagens vetoriais próprios. Os alvos do pênalti funcionam com Enter/Espaço; falta e passe usam botões com foco e áreas de toque ampliadas. Efeitos respeitam movimento reduzido e a preferência de som. As fontes estão empacotadas para uso offline.

`src/comum/VisualFutebol.jsx` reúne os desenhos parametrizados; `arte/cenarios/` contém fundos com versões para celular. As taças e as fontes mantêm créditos e licenças em suas pastas. Animações podem ser recriadas com `node scripts/gerar-animacoes.mjs`. A reexportação opcional dos troféus usa `node scripts/atualizar-acervo.mjs /caminho/Football-Career`, com ImageMagick instalado.
