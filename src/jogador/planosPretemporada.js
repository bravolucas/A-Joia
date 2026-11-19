/**
 * Planos de pré-temporada do Modo Jogador.
 * Ganhos de atributos persistem (respeitando potencial e idade); os efeitos
 * adicionais só valem na temporada escolhida. Os nomes e as cargas descrevem
 * sessões reais de futebol, não recompensas aleatórias de carreira.
 */
export const PLANOS_PRETEMPORADA = [
  // Técnica individual e fundamentos
  {id:'prepFinalizacao',grupo:'tecnica',nome:'Finalização de primeira',desc:'Repetições de chute após cruzamentos e passes em velocidade.',ganhos:{finalizacao:2},gols:1.04,gol:{nome:'Defesas à queima-roupa',desc:'Reação curta a finalizações dentro da área.',ganhos:{finalizacao:2},gols:null,nota:.05}},
  {id:'prepPassePressao',grupo:'tecnica',nome:'Passe sob pressão',desc:'Rondos e saída rápida de marcação próxima.',ganhos:{passe:2},assist:1.03,gol:{nome:'Saída de bola sob pressão',desc:'Domínio, passe curto e escolhas seguras no recuo.',ganhos:{passe:2},assist:null,nota:.04}},
  {id:'prepPrimeiroToque',grupo:'tecnica',nome:'Domínio orientado',desc:'Primeiro toque para fugir do marcador e acelerar o lance.',ganhos:{drible:2,passe:1}},
  {id:'prepBolaParada',grupo:'tecnica',nome:'Bolas paradas',desc:'Repetições de faltas e pênaltis com alvo e pressão.',ganhos:{finalizacao:1,passe:1},desafio:.04,gol:{nome:'Defesa de pênaltis',desc:'Leitura do cobrador, impulsão e escolha do canto.',ganhos:{defesa:1,finalizacao:1},desafio:.04}},
  {id:'prepCruzamento',grupo:'tecnica',nome:'Cruzamentos em movimento',desc:'Bola na área depois de correr e decidir rapidamente.',ganhos:{passe:2},assist:1.05,gol:{nome:'Reposição precisa',desc:'Lançamentos para iniciar o contra-ataque.',ganhos:{passe:2},assist:null,nota:.04}},
  {id:'prepConducao',grupo:'tecnica',nome:'Condução em espaços curtos',desc:'Mudança de direção e controle em corredor estreito.',ganhos:{drible:2,velocidade:1},gol:{nome:'Agilidade dentro da pequena área',desc:'Ajuste de pés e deslocamento curto antes da defesa.',ganhos:{drible:2,velocidade:1}}},
  {id:'prepPasseLongo',grupo:'tecnica',nome:'Inversões e lançamentos',desc:'Precisão nos passes longos e na troca de corredor.',ganhos:{passe:2},forcaTime:.2},

  // Consciência tática individual e coordenação com os companheiros
  {id:'prepVideo',grupo:'leitura',nome:'Análise de vídeo',desc:'Identificar erros de posição e opções melhores de passe.',ganhos:{passe:1,defesa:1},nota:.07},
  {id:'prepCobertura',grupo:'leitura',nome:'Cobertura defensiva',desc:'Fechar espaços e coordenar a linha com os colegas.',ganhos:{defesa:2},forcaTime:.25,gol:{nome:'Organização da área',desc:'Ângulos, coberturas e comando dos defensores.',ganhos:{defesa:2},forcaTime:.25}},
  {id:'prepTransicao',grupo:'leitura',nome:'Transições rápidas',desc:'Recuperar e progredir com a bola antes do rival se organizar.',ganhos:{passe:1,velocidade:1},forcaTime:.3},
  {id:'prepAntecipacao',grupo:'leitura',nome:'Antecipação de jogadas',desc:'Ler postura corporal e interceptar o passe no momento certo.',ganhos:{defesa:2},nota:.05},
  {id:'prepDesmarque',grupo:'leitura',nome:'Movimento sem bola',desc:'Atacar espaços e oferecer linha de passe ao portador.',ganhos:{finalizacao:1,velocidade:1},gols:1.03,gol:{nome:'Posicionamento no um contra um',desc:'Fechar o ângulo e esperar o momento da defesa.',ganhos:{defesa:1,finalizacao:1},gols:null,nota:.05}},
  {id:'prepPressao',grupo:'leitura',nome:'Pressão após perda',desc:'Aproximação coordenada e recuperação sem sair da função.',ganhos:{defesa:1,fisico:1},forcaTime:.3},
  {id:'prepScoutAdversario',grupo:'leitura',nome:'Leitura de adversários',desc:'Vídeo dos rivais e ensaio de respostas a situações recorrentes.',ganhos:{defesa:1,passe:1},nota:.06,desafio:.015},

  // Preparação física: intensidade tem custo real
  {id:'prepAerobico',grupo:'fisico',nome:'Resistência intervalada',desc:'Corridas alternadas para sustentar intensidade até o fim.',ganhos:{fisico:2},minutos:.03},
  {id:'prepForca',grupo:'fisico',nome:'Força funcional',desc:'Estabilidade, contato físico e proteção da bola.',ganhos:{fisico:2,defesa:1}},
  {id:'prepArranque',grupo:'fisico',nome:'Arranques de cinco metros',desc:'Pliometria e aceleração; carga mais alta exige cuidado.',ganhos:{velocidade:2,fisico:1},lesao:.015},
  {id:'prepPotencia',grupo:'fisico',nome:'Potência e explosão',desc:'Saltos e tiros repetidos; maior desgaste muscular.',ganhos:{fisico:2,velocidade:1},lesao:.02},
  {id:'prepRitmo',grupo:'fisico',nome:'Ritmo de jogo',desc:'Jogos-treino e blocos de alta intensidade com bola.',ganhos:{fisico:1},minutos:.04,nota:.03},
  {id:'prepAgilidade',grupo:'fisico',nome:'Agilidade e mudança de direção',desc:'Deslocamento lateral, frenagem e retomada.',ganhos:{velocidade:1,drible:2}},
  {id:'prepImpulsao',grupo:'fisico',nome:'Impulsão e equilíbrio',desc:'Salto, aterrissagem e disputa aérea segura.',ganhos:{fisico:1,defesa:1},nota:.04},

  // Gestão de cargas e disponibilidade (menos risco, mas nem sempre mais minutos)
  {id:'prepCarga',grupo:'recuperacao',nome:'Carga individualizada',desc:'Treinos dosados pelo desgaste; reduz o risco, mas poupa minutos.',ganhos:{fisico:1},lesao:-.025,minutos:-.015},
  {id:'prepPrevencao',grupo:'recuperacao',nome:'Prevenção de lesões',desc:'Fortalecer tendões e controlar impactos repetidos.',ganhos:{fisico:1},lesao:-.025},
  {id:'prepSono',grupo:'recuperacao',nome:'Sono e recuperação',desc:'Rotina de descanso para melhorar disponibilidade e confiança.',ganhos:{},moral:4,lesao:-.025},
  {id:'prepMobilidade',grupo:'recuperacao',nome:'Mobilidade articular',desc:'Amplitude, estabilidade e equilíbrio nas mudanças de direção.',ganhos:{drible:1,fisico:1},lesao:-.015},
  {id:'prepRecuperacaoAtiva',grupo:'recuperacao',nome:'Recuperação ativa',desc:'Sessões leves e fisioterapia: menos risco, ligeiramente menos campo.',ganhos:{},lesao:-.03,minutos:-.015},
  {id:'prepPosJogo',grupo:'recuperacao',nome:'Rotina pós-partida',desc:'Hidratação, descanso e trabalho leve entre partidas.',ganhos:{},lesao:-.02,minutos:.015},
  {id:'prepCalendarioCheio',grupo:'recuperacao',nome:'Preparação para calendário cheio',desc:'Alternar estímulo e descanso para jogar regularmente.',ganhos:{fisico:1},lesao:-.015,minutos:.02},

  // Preparação mental realmente ligada a rendimento e decisões
  {id:'prepPressaoMental',grupo:'mental',nome:'Decisões sob pressão',desc:'Treinos com placar adverso, torcida e pouco tempo no relógio.',ganhos:{},moral:4,desafio:.035},
  {id:'prepPenaltis',grupo:'mental',nome:'Pênaltis em situação de jogo',desc:'Rotina de execução com fadiga e cobranças decisivas.',ganhos:{finalizacao:1},desafio:.04,gol:{nome:'Leitura de pênaltis',desc:'Reagir ao cobrador em situações simuladas de decisão.',ganhos:{defesa:1},desafio:.04}},
  {id:'prepFoco',grupo:'mental',nome:'Concentração e leitura',desc:'Exercícios para manter a atenção durante toda a partida.',ganhos:{},nota:.06,moral:3},
  {id:'prepComunicar',grupo:'mental',nome:'Comunicação em campo',desc:'Comandos claros e entrosamento com o setor.',ganhos:{defesa:1},forcaTime:.3,moral:2},
  {id:'prepErro',grupo:'mental',nome:'Reação ao erro',desc:'Rotina mental para retomar o foco depois de falhar.',ganhos:{},moral:5,nota:.03},
  {id:'prepSimulacao',grupo:'mental',nome:'Cenários de partida',desc:'Treinar escolhas em inferioridade, empate e fim de jogo.',ganhos:{passe:1},nota:.05,desafio:.02},
  {id:'prepConstancia',grupo:'mental',nome:'Regularidade competitiva',desc:'Objetivos de desempenho e revisão de decisões a cada sessão.',ganhos:{},minutos:.015,nota:.05,moral:2},

  // Treinos direcionados à função: nunca aparecem para posições incompatíveis
  {id:'prepAtacanteDiagonal',grupo:'tecnica',posicoes:['ATA','SA','PD','PE'],nome:'Ataque à profundidade',desc:'Temporização de corrida e finalização ao cruzar a última linha.',ganhos:{finalizacao:1,velocidade:1},gols:1.06},
  {id:'prepCriacaoUltimoPasse',grupo:'leitura',posicoes:['MC','MEI','MD','ME','PD','PE','SA'],nome:'Último passe',desc:'Triangulações e passe entre zagueiros para o companheiro finalizar.',ganhos:{passe:1,drible:1},assist:1.07},
  {id:'prepDueloDefensivo',grupo:'leitura',posicoes:['ZAG','VOL','LE','LD','ALE','ALD'],nome:'Duelo defensivo',desc:'Bote, temporização e recomposição com superioridade numérica.',ganhos:{defesa:2,fisico:1},forcaTime:.25},
  {id:'prepLateralCruzamento',grupo:'tecnica',posicoes:['LE','LD','ALE','ALD','ME','MD'],nome:'Cruzamento do corredor',desc:'Chegar ao fundo e servir a área com precisão.',ganhos:{passe:2},assist:1.06},
  {id:'prepGoleiroUmContraUm',grupo:'tecnica',posicoes:['GOL'],nome:'Defesas no um contra um',desc:'Fechar o ângulo e reagir sem se antecipar.',ganhos:{finalizacao:2,defesa:1},nota:.05},
  {id:'prepGoleiroSaidaAlta',grupo:'leitura',posicoes:['GOL'],nome:'Saída em cruzamentos',desc:'Tempo de bola, impulso e comunicação com os zagueiros.',ganhos:{defesa:2,fisico:1},forcaTime:.2},
  {id:'prepGoleiroPes',grupo:'tecnica',posicoes:['GOL'],nome:'Goleiro construtor',desc:'Passe curto, inversões e lançamentos após a defesa.',ganhos:{passe:2},forcaTime:.2},
  {id:'prepVeteranoCarga',grupo:'recuperacao',minIdade:29,nome:'Gestão de carga do veterano',desc:'Menos trabalho explosivo, mais recuperação para atravessar a temporada.',ganhos:{},lesao:-.035,minutos:-.02,declinio:.93}
].map(plano=>({icone:'⚽',raridade:'comum',planoReal:true,...plano}));
