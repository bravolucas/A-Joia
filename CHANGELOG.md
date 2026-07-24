# 📋 Registro de alterações — A JOIA

Tudo que mudou desde a primeira versão publicada, organizado por bloco de trabalho.

---

## 🐛 Bloco 1 — Correção de bugs

### Gol de minigame não contava
Dois problemas somados:
- **Trava de posição:** só atacante e meia recebiam o gol. Zagueiro, lateral, volante e goleiro acertavam o minigame e não ganhavam nada.
- **Destino errado:** o gol ia para o total da carreira mas não para o card da temporada, sumindo das estatísticas do ano, da artilharia e das estatísticas por competição.

### Empréstimo não travava negociação
Apenas a cláusula de rescisão verificava o empréstimo. Agora está travado no menu de transferências, na sondagem do empresário e nas propostas espontâneas de fim de temporada.

### Notícia mudava de clube
A notícia guardava a temporada mas não o clube, então sempre exibia o clube atual. Agora o clube é carimbado no momento em que a notícia nasce (`noticiaDoMomento`).

### Rebaixamento só funcionava no Brasil
Criadas 7 segundas divisões (Championship, LaLiga 2, Serie B italiana, 2. Bundesliga, Ligue 2, Liga Portugal 2 e a Série B existente) com o número real de rebaixados de cada país.

---

## 💾 Bloco 2 — Salvar e continuar

- Autosave ao fim de cada temporada
- 3 espaços manuais de save
- Botão "Continuar carreira" na tela inicial
- Exportar e importar save como arquivo (backup fora do navegador)
- **Normalizadores** (`normalizarCarreira`, `normalizarTemporada`) que completam campos faltantes ao carregar, protegendo contra saves de versões diferentes e dados corrompidos
- `calcOVR` tolerante a dados inválidos

Save de uma carreira completa ocupa ~147 KB, com folga no limite do navegador.

---

## 🏛️ Bloco 3 — Palmarés e elencos

### Sala de troféus dos clubes
- Palmarés histórico escrito à mão para 51 clubes
- Clubes sem histórico próprio recebem um palmarés estimado pelo porte
- **Os números crescem** conforme os títulos acontecem no mundo
- Popup do clube mostra quantas taças, e quantas foram na sua era

### O mundo tem campeões próprios
Toda temporada o jogo decide os campeões de todas as ligas, não só a sua. Correção importante: antes, quando você jogava no Brasil e não ganhava o Brasileirão, ninguém ganhava.

### Elencos completos
De ~19 para **24 a 26 jogadores**, com titular e reserva em cada posição, 3 goleiros e 2 a 4 jovens da base.

---

## 🏅 Bloco 4 — Insígnias e Marcos

### Insígnias: de 5 para 14, com três níveis
Bronze → prata → ouro, com efeito crescente. Seis por atributo mantido no alto (Finalizador Clínico, Muralha, Maestro, Driblador Nato, Fenômeno Físico, Velocista) e oito por comportamento na carreira (Cobrador, Jogador de Decisão, Sangue Frio, Líder Nato, Ídolo Eterno, Cidadão do Mundo, Artilheiro Nato, Imortal).

Efeitos reais: multiplicam gols e assistências, reduzem risco de lesão, aceleram valor de mercado, aumentam chance em minigames, estabelecem piso de torcida, seguram moral do elenco e freiam o declínio por idade.

### Marcos: 12 especiais
- **Com recompensa permanente:** 100 gols pelo clube (+2 finalização), década no clube (torcida máxima), tríplice coroa (+15 fama), melhor do mundo (+1 em todos os atributos), camisa 10 da seleção (+10 fama)
- **Cicatrizes:** o jejum, a queda, a cirurgia
- **Secretos:** Profeta da casa, O andarilho, Fênix, Carrasco do rival

---

## 🟨 Bloco 5 — Cartões e postura

### Sistema disciplinar
Cartões por partida considerando posição, postura, personalidade, clássico e força do adversário. Três amarelos suspendem, vermelho tira de 1 a 2 jogos. **Suspensão tira você de campo de verdade.**

Taxas verificadas em 200 temporadas: zagueiro 5.9 amarelos/ano, atacante 3.2, goleiro 1.3.

### Postura de jogo
Escolha por rodada entre jogar seguro, natural, ir pra cima ou jogar na raça. Afeta gols, cartões, desgaste e nota. Jogar na raça mais que dobra os cartões.

---

## ⚡ Bloco 6 — Momentos contextuais e treinos

### Lance-chave com contexto
O lance agora tem minuto, placar parcial e leitura da situação. Decidir perdendo aos 86 minutos vale o dobro em fama e torcida; falhar num momento desses custa.

### Treinos variados
Cada atributo treina com o minigame que faz sentido: finalização com pênaltis, drible com faltas, passe com saída de bola.

---

## 🌎 Bloco 7 — Seleção, itens e mídia

- **Seleção no calendário:** Copa do Mundo, continental, eliminatórias e amistosos aparecem nas datas certas, com a campanha ao clicar
- **Itens comprados:** tela organizada por categoria, com patrimônio, manutenção anual e etiquetas do que cada item faz
- **Responder fã e hater:** 3 respostas para fã, 4 para hater, cada uma com efeito diferente em fama, torcida, elenco e pressão da mídia. Respostas agressivas viram notícia no inbox

---

## 📣 Bloco 8 — Memória e identidade

### Apelido da torcida
Após 2 temporadas no clube, a arquibancada te batiza. Dez apelidos possíveis, cada um com cântico próprio, escolhidos pelo seu perfil em campo.

### Memória de confrontos
O jogo guarda seu histórico contra cada adversário: jogos, vitórias, gols, nota média e aproveitamento. Aparece no popup do clube com veredito de freguesia ou pedra no sapato.

### Jogos inesquecíveis
Partidas excepcionais são salvas automaticamente por 7 critérios (hat-trick, atuação de gala, decidir clássico, dois gols, gol e assistência, vitória fora contra time forte, jogo sem sofrer gol). Nova aba no Legado guarda as 25 melhores.

---

## 📅 Bloco 9 — Semana e metas

### Preparação de semana
Cinco opções entre rodadas: descansar, treinar finalização, estudar o adversário, trabalho físico pesado ou compromissos de imagem. Cada uma afeta o próximo jogo e cobra energia ou desgaste.

### Metas por competição
A diretoria cobra objetivos específicos por torneio, dosados pelo porte do clube: o Real Madrid é cobrado por título, o Náutico por não cair na primeira fase da copa. Metas visíveis durante a temporada, com bônus em dinheiro e efeito na relação com a diretoria.

---

## 🔧 Mudanças técnicas

- Imports com extensão explícita (`./data.js`), permitindo testar módulos direto no Node
- Novo módulo `save.js`
- Layout responsivo por CSS próprio, sem depender do build do Tailwind
- Popups largos com listas em colunas no desktop
- Escala de texto aumentada ~35% no desktop
- Componente `FichaPartida` reutilizável
- Leitor de notícias em três formatos (jornal, tweet, post)

---

## ✅ Como cada bloco foi verificado

Todo bloco passou por:
1. **Build do Vite** — pega erro de sintaxe e import quebrado
2. **Teste no navegador** — confirma que monta, renderiza e não gera erro de JS
3. **Análise de escopo com Babel** — encontra variável usada fora do escopo, que o build não pega
4. **Testes de lógica em Node** — rodando as funções reais com dados realistas

Bugs encontrados pelos testes durante o trabalho: estado duplicado no bloco 6, metas invertidas por dificuldade no bloco 9, distribuição de títulos faltando na própria liga no bloco 3, e o crash ao carregar save incompleto no bloco 2.
