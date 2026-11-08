// Banco contextual de eventos da carreira como técnico. Quatro cartas por temporada.
export const EVENTOS_CONTEXTO_TECNICO = [
  {
    "id": "estreia",
    "titulo": "Primeiros dias no comando",
    "texto": "A comissão técnica questiona sua experiência.",
    "contexto": "inicio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Ouvir a comissão",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 4,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Impor seu método",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 5,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Construir consenso",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 4,
        "elenco": -1
      }
    ]
  },
  {
    "id": "auxiliar",
    "titulo": "Seu auxiliar discorda da estratégia",
    "texto": "O braço direito sugere mudar o plano de jogo.",
    "contexto": "inicio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Ouvir a comissão",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 4,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Impor seu método",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 5,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Construir consenso",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 4,
        "elenco": -1
      }
    ]
  },
  {
    "id": "veterano",
    "titulo": "Veterano pede uma última chance",
    "texto": "Um ídolo do clube teme perder espaço.",
    "contexto": "inicio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Ouvir a comissão",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 4,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Impor seu método",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 5,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Construir consenso",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 4,
        "elenco": -1
      }
    ]
  },
  {
    "id": "torcida",
    "titulo": "Torcida pede futebol ofensivo",
    "texto": "A arquibancada critica o estilo atual.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "patrocinio",
    "titulo": "Patrocinador pressiona por exposição",
    "texto": "Um evento comercial ameaça a preparação.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "gramado",
    "titulo": "Gramado em más condições",
    "texto": "O campo prejudica o treinamento da equipe.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "arbitragem",
    "titulo": "Polêmica com a arbitragem",
    "texto": "A imprensa cobra uma reação pública.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "imprensa",
    "titulo": "Jornalista publica crítica dura",
    "texto": "Uma matéria questiona seu trabalho.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "lideranca",
    "titulo": "Capitão pede reunião",
    "texto": "O líder do elenco quer discutir o ambiente.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "torneio",
    "titulo": "Calendário apertado",
    "texto": "Três jogos importantes se aproximam.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "olheiro",
    "titulo": "Olheiro encontra talento desconhecido",
    "texto": "Uma aposta barata aparece no mercado.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "emprestado",
    "titulo": "Atleta emprestado pede retorno",
    "texto": "Um jovem quer voltar antes do previsto.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "comissao",
    "titulo": "Preparador físico recebe proposta",
    "texto": "Um profissional importante pode deixar o clube.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "academia",
    "titulo": "Reforma do centro de treinamento",
    "texto": "A diretoria oferece investir na estrutura.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "penalti",
    "titulo": "Quem cobrará os pênaltis?",
    "texto": "Dois jogadores disputam a responsabilidade.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "capitao",
    "titulo": "Troca de capitão",
    "texto": "O grupo discute quem deve usar a braçadeira.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "esquema",
    "titulo": "Adversários aprenderam seu esquema",
    "texto": "Os últimos jogos revelaram padrões previsíveis.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "amistoso",
    "titulo": "Convite para amistoso internacional",
    "texto": "A viagem pode trazer visibilidade e desgaste.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "empresario",
    "titulo": "Empresário oferece jogador polêmico",
    "texto": "Um talento conhecido traz riscos ao vestiário.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "renovacao",
    "titulo": "Renovação de contrato complicada",
    "texto": "Um titular exige aumento acima do planejado.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "promessa",
    "titulo": "Promessa quer minutos em campo",
    "texto": "A torcida acompanha um jovem muito elogiado.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "derby",
    "titulo": "Provocação antes do dérbi",
    "texto": "O técnico rival dispara declarações provocativas.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "bonus",
    "titulo": "Prêmio por desempenho",
    "texto": "A diretoria considera bonificações para o elenco.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "analise",
    "titulo": "Departamento de análise pede atenção",
    "texto": "Dados mostram um problema recorrente.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "derrota",
    "titulo": "Sequência de derrotas",
    "texto": "O ambiente ficou pesado após resultados ruins.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "ultimato",
    "titulo": "Presidente exige reação imediata",
    "texto": "A confiança dos dirigentes está baixa.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "protesto",
    "titulo": "Protesto no centro de treinamento",
    "texto": "Torcedores exigem respostas da equipe.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "rachadura",
    "titulo": "Vestiário dividido",
    "texto": "Dois grupos discordam das suas escolhas.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "boicote",
    "titulo": "Jogadores questionam sua liderança",
    "texto": "Parte do elenco pede mudanças.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "lider",
    "titulo": "Líder da competição sob pressão",
    "texto": "Os adversários estudam cada detalhe da equipe.",
    "contexto": "lider",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Manter concentração",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 5,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Elevar a intensidade",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Administrar expectativas",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "recorde",
    "titulo": "Chance de quebrar um recorde",
    "texto": "A equipe se aproxima de uma marca histórica.",
    "contexto": "lider",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Manter concentração",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 5,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Elevar a intensidade",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Administrar expectativas",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "euforia",
    "titulo": "Excesso de confiança",
    "texto": "O grupo começa a subestimar adversários.",
    "contexto": "lider",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Manter concentração",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 5,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Elevar a intensidade",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Administrar expectativas",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "assediado",
    "titulo": "Treinador cobiçado",
    "texto": "Rumores apontam interesse de outros clubes.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "selecao",
    "titulo": "Convite para palestra internacional",
    "texto": "Seu trabalho chamou atenção fora do país.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "legado",
    "titulo": "Estátua e homenagem",
    "texto": "A torcida deseja homenagear sua trajetória.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "retorno",
    "titulo": "Seu antigo clube pede ajuda",
    "texto": "O clube em que foi ídolo atravessa uma crise.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "sucessao",
    "titulo": "Planejamento de longo prazo",
    "texto": "A diretoria quer saber seu projeto para o futuro.",
    "contexto": "experiente",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Compartilhar experiência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Renovar os métodos",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Planejar com cautela",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "desgaste",
    "titulo": "Desgaste de uma longa trajetória",
    "texto": "A rotina começa a afetar sua motivação.",
    "contexto": "experiente",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Compartilhar experiência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Renovar os métodos",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Planejar com cautela",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "mentor",
    "titulo": "Ex-jogador pede estágio",
    "texto": "Um antigo atleta quer aprender com você.",
    "contexto": "experiente",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Compartilhar experiência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Renovar os métodos",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Planejar com cautela",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "pressao_titulo",
    "titulo": "Obrigação de conquistar títulos",
    "texto": "A diretoria não aceita mais apenas boas campanhas.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "financeiro",
    "titulo": "Corte inesperado de orçamento",
    "texto": "O clube precisa reduzir despesas.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "salarios",
    "titulo": "Atraso de salários",
    "texto": "Os atletas cobram explicações sobre pagamentos.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "reconstrucao",
    "titulo": "Projeto de reconstrução",
    "texto": "A diretoria propõe reformular profundamente o elenco.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "virada",
    "titulo": "Vitória inesperada reacende esperança",
    "texto": "Um resultado improvável mudou o clima do clube.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "renome",
    "titulo": "Grande nome disponível",
    "texto": "Um jogador consagrado está livre no mercado.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "confronto",
    "titulo": "Duelo contra ex-clube",
    "texto": "Você reencontra a equipe onde fez história.",
    "contexto": "experiente",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Compartilhar experiência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Renovar os métodos",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Planejar com cautela",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "final",
    "titulo": "Decisão de mata-mata se aproxima",
    "texto": "Uma partida decisiva pode definir sua reputação.",
    "contexto": "lider",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Manter concentração",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 5,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Elevar a intensidade",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Administrar expectativas",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "jovens",
    "titulo": "Geração promissora na base",
    "texto": "Três atletas apresentam evolução acima da média.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "lesao_craque",
    "titulo": "Lesão do principal jogador",
    "texto": "A equipe precisa encontrar soluções sem sua estrela.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "comportamento",
    "titulo": "Atleta chega atrasado ao treino",
    "texto": "O episódio divide opiniões dentro do clube.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "contrato_tecnico",
    "titulo": "Renovação do seu contrato",
    "texto": "A diretoria propõe uma extensão com novas metas.",
    "contexto": "experiente",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Compartilhar experiência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Renovar os métodos",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Planejar com cautela",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "pressao_midias",
    "titulo": "Redes sociais contra a equipe",
    "texto": "Uma campanha de críticas ganha força.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "classificacao",
    "titulo": "Disputa por vaga continental",
    "texto": "Uma sequência decisiva pode mudar a temporada.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "premiacao",
    "titulo": "Jogador concorre a prêmio individual",
    "texto": "A preparação da equipe divide espaço com a cerimônia.",
    "contexto": "lider",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Manter concentração",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 5,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Elevar a intensidade",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Administrar expectativas",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "amistoso_base",
    "titulo": "Treino com a equipe sub-20",
    "texto": "Jovens podem ganhar espaço na equipe principal.",
    "contexto": "inicio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Ouvir a comissão",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 4,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Impor seu método",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 5,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Construir consenso",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 4,
        "elenco": -1
      }
    ]
  },
  {
    "id": "consultoria",
    "titulo": "Conselheiro influente interfere",
    "texto": "Um dirigente quer opinar na escalação.",
    "contexto": "crise",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Assumir a responsabilidade",
        "detalhe": "Alto potencial · risco de reação negativa",
        "moral": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Cobrar reação imediata",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "elenco": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com dirigentes",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 7,
        "elenco": -1
      }
    ]
  },
  {
    "id": "torcida_visitante",
    "titulo": "Jogo fora de casa hostil",
    "texto": "O ambiente adversário pode abalar o elenco.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "proposta_exterior",
    "titulo": "Interesse de um clube estrangeiro",
    "texto": "Uma sondagem pode mexer com sua concentração.",
    "contexto": "prestigio",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Usar a influência",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 7,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Valorizar o elenco",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 7,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Negociar com a diretoria",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 6,
        "elenco": -1
      }
    ]
  },
  {
    "id": "treino_tatico",
    "titulo": "Mudança de formação",
    "texto": "Sua comissão sugere experimentar outro sistema.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  },
  {
    "id": "poupanca",
    "titulo": "Jogo de menor importância",
    "texto": "Você pode descansar titulares ou manter o ritmo.",
    "contexto": "geral",
    "opcoes": [
      {
        "id": "ousadia",
        "nome": "Apostar em mudança ousada",
        "detalhe": "Alto potencial · risco de reação negativa",
        "elenco": 6,
        "risco": 0.4,
        "riscoMoral": -5,
        "riscoDiretoria": -4
      },
      {
        "id": "dialogo",
        "nome": "Conversar com o grupo",
        "detalhe": "Fortalece o grupo · custo de gestão",
        "moral": 6,
        "diretoria": -2
      },
      {
        "id": "prudencia",
        "nome": "Priorizar a estabilidade",
        "detalhe": "Mais segurança · menor impacto",
        "diretoria": 5,
        "elenco": -1
      }
    ]
  }
];
