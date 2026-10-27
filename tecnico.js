import { CLUBES, CLASSICOS } from './data.js';
import { EVENTOS_CONTEXTO_TECNICO } from './eventosTecnico.js';
import { competicaoDoTitulo } from './tacas.js';
// Continuação da mesma carreira, sem alterar o histórico do atleta.
export const ESTILOS_TECNICO = [
  { id: 'ofensivo', nome: 'Ofensivo', descricao: 'Mais gols e mais riscos.' },
  { id: 'equilibrado', nome: 'Equilibrado', descricao: 'Consistência ao longo da temporada.' },
  { id: 'defensivo', nome: 'Defensivo', descricao: 'Defesa sólida e jogos disputados.' },
];
const limitar = (n, min, max) => Math.max(min, Math.min(max, n));
const sorteio = () => Math.random();
export const DECISOES_TECNICO = [
  { id: 'reforcos', titulo: 'Mercado de transferências', texto: 'A diretoria quer saber sua prioridade.', opcoes: [
    { id: 'pedir', nome: 'Pedir reforços', detalhe: 'Elenco +8 · diretoria -6', elenco: 8, diretoria: -6 },
    { id: 'base', nome: 'Apostar na base', detalhe: 'Elenco +3 · diretoria +5', elenco: 3, diretoria: 5 },
    { id: 'manter', nome: 'Manter o grupo', detalhe: 'Moral +5 · diretoria +2', moral: 5, diretoria: 2 }
  ] },
  { id: 'vestiario', titulo: 'Clima no vestiário', texto: 'O elenco questiona a intensidade dos treinos.', opcoes: [
    { id: 'intenso', nome: 'Cobrar mais intensidade', detalhe: 'Elenco +5 · moral -6', elenco: 5, moral: -6 },
    { id: 'dialogo', nome: 'Conversar com o grupo', detalhe: 'Moral +8 · diretoria +2', moral: 8, diretoria: 2 },
    { id: 'descanso', nome: 'Reduzir a carga', detalhe: 'Moral +5 · elenco -2', moral: 5, elenco: -2 }
  ] },
  { id: 'craque', titulo: 'O craque quer privilégios', texto: 'O principal jogador ameaça pedir transferência.', opcoes: [
    { id: 'apoiar', nome: 'Dar liberdade ao craque', detalhe: 'Moral +7 · diretoria -5', moral: 7, diretoria: -5 },
    { id: 'cobrar', nome: 'Exigir disciplina', detalhe: 'Diretoria +5 · moral -7', diretoria: 5, moral: -7 },
    { id: 'negociar', nome: 'Conversar reservadamente', detalhe: 'Resultado incerto', moral: 3, risco: 0.45, riscoMoral: -8, riscoDiretoria: -4 }
  ] },
  { id: 'classico', titulo: 'Semana de clássico', texto: 'A imprensa exige uma vitória contra o rival.', opcoes: [
    { id: 'atacar', nome: 'Prometer vitória', detalhe: 'Moral +5 · pressão maior', moral: 5, risco: 0.5, riscoDiretoria: -9 },
    { id: 'prudente', nome: 'Diminuir expectativas', detalhe: 'Diretoria +3 · moral -2', diretoria: 3, moral: -2 },
    { id: 'foco', nome: 'Blindar o elenco', detalhe: 'Elenco +3 · moral +2', elenco: 3, moral: 2 }
  ] },
  { id: 'lesoes', titulo: 'Departamento médico em alerta', texto: 'Os jogadores reclamam de desgaste.', opcoes: [
    { id: 'rodizio', nome: 'Rodar o elenco', detalhe: 'Moral +5 · elenco -3', moral: 5, elenco: -3 },
    { id: 'arriscar', nome: 'Manter os titulares', detalhe: 'Elenco +5 · risco de queda de moral', elenco: 5, risco: 0.55, riscoMoral: -9 },
    { id: 'preparacao', nome: 'Reforçar preparação física', detalhe: 'Elenco +3 · diretoria -3', elenco: 3, diretoria: -3 }
  ] },
  { id: 'diretoria', titulo: 'Ultimato da diretoria', texto: 'Os dirigentes cobram uma resposta à pressão.', opcoes: [
    { id: 'ambicioso', nome: 'Prometer classificação', detalhe: 'Diretoria +7 · risco de cobrança', diretoria: 7, risco: 0.5, riscoDiretoria: -12 },
    { id: 'realista', nome: 'Defender o projeto', detalhe: 'Diretoria +2 · moral +2', diretoria: 2, moral: 2 },
    { id: 'confrontar', nome: 'Exigir apoio público', detalhe: 'Moral +6 · diretoria -8', moral: 6, diretoria: -8 }
  ] },
  { id: 'jovem', titulo: 'Uma promessa pede espaço', texto: 'Um jovem da base impressiona nos treinos.', opcoes: [
    { id: 'titular', nome: 'Promover a titular', detalhe: 'Elenco +5 · risco de pressão', elenco: 5, risco: 0.4, riscoMoral: -5 },
    { id: 'gradual', nome: 'Integrar aos poucos', detalhe: 'Elenco +2 · moral +3', elenco: 2, moral: 3 },
    { id: 'emprestar', nome: 'Emprestar para evoluir', detalhe: 'Diretoria +4 · elenco -2', diretoria: 4, elenco: -2 }
  ] }
];
export const QUANTIDADE_DECISOES_TECNICO = 4;
export const LIMITE_TEMPORADAS_TECNICO = 30;
export const carreiraTecnicoEncerrada = (t) => (t?.temporadas?.length || 0) >= LIMITE_TEMPORADAS_TECNICO;
const NOMES_COMPETICOES_TECNICO = { brasileirao: 'Brasileirão', serieB: 'Brasileirão Série B', argentina: 'Liga Profesional', portugal: 'Liga Portugal', portugal2: 'Liga Portugal 2', espanha: 'La Liga', espanha2: 'LaLiga 2', inglaterra: 'Premier League', inglaterra2: 'Championship', italia: 'Serie A', italia2: 'Serie B (Itália)', alemanha: 'Bundesliga', alemanha2: '2. Bundesliga', franca: 'Ligue 1', franca2: 'Ligue 2' };
export function competicaoTemporadaTecnico(a = {}) {
  if (a.competicao) return a.competicao;
  const liga = a.liga || CLUBES.find(clube => clube.nome === a.clube)?.liga;
  return NOMES_COMPETICOES_TECNICO[liga] || (liga ? String(liga) : 'Campeonato nacional');
}
export const titulosConquistadosTecnico = (t) => (t?.temporadas || []).flatMap(a => a.campeao ? [{ ano: a.ano, clube: a.clube, nome: competicaoTemporadaTecnico(a), tipo: competicaoDoTitulo(competicaoTemporadaTecnico(a)).tipo }] : []);
export const TODAS_CARTAS_TECNICO = [...DECISOES_TECNICO, ...EVENTOS_CONTEXTO_TECNICO];
export function elegivelTecnico(carta, t) {
  switch (carta.contexto) {
    case 'inicio': return (t.temporadas?.length || 0) <= 2;
    case 'crise': return (t.diretoria ?? 60) < 52 || (t.moral ?? 50) < 40 || (t.temporadas?.at(-1)?.posicao ?? 1) >= 15;
    case 'lider': return (t.temporadas?.at(-1)?.posicao ?? 20) <= 4 || (t.titulos || 0) >= 1;
    case 'prestigio': return (t.reputacao ?? 25) >= 65 || (t.titulos || 0) >= 2;
    case 'experiente': return (t.temporadas?.length || 0) >= 4;
    default: return true;
  }
}
export function sortearCartasTecnico(t = {}, rng = sorteio) {
  // Compatibilidade com chamadas antigas que passavam somente o gerador aleatório.
  if (typeof t === 'function') { rng = t; t = {}; }
  const recentes = new Set((t.historicoCartas || []).slice(-16));
  const candidatas = TODAS_CARTAS_TECNICO.filter(x => elegivelTecnico(x, t));
  const novas = candidatas.filter(x => !recentes.has(x.id));
  const pool = novas.length >= QUANTIDADE_DECISOES_TECNICO ? novas : candidatas;
  const cartas = [...pool];
  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }
  return cartas.slice(0, QUANTIDADE_DECISOES_TECNICO).map(x => x.id);
}
export function cartaAtualTecnico(t) {
  const ids = t.cartas || DECISOES_TECNICO.slice(0, QUANTIDADE_DECISOES_TECNICO).map(x => x.id);
  return TODAS_CARTAS_TECNICO.find(x => x.id === ids[t.decisoes?.length || 0]) || null;
}
export function tomarDecisaoTecnico(c, opcaoId, rng = sorteio) {
  if (!c?.tecnico || c.tecnico.fase !== 'pretemporada') throw new Error('Decisão indisponível.');
  const t = c.tecnico;
  const carta = cartaAtualTecnico(t);
  if (!carta) throw new Error('Todas as decisões já foram tomadas.');
  const op = carta.opcoes.find(x => x.id === opcaoId);
  if (!op) throw new Error('Opção inválida.');
  const riscoAtivado = !!op.risco && rng() < op.risco;
  const resultado = riscoAtivado ? 'A aposta trouxe consequências inesperadas.' : 'O plano foi recebido como esperado.';
  const impacto = { elenco: (op.elenco || 0), torcida: (op.moral || 0) + (riscoAtivado ? (op.riscoMoral || 0) : 0), moral: (op.moral || 0) + (riscoAtivado ? op.riscoMoral || 0 : 0), diretoria: (op.diretoria || 0) + (riscoAtivado ? op.riscoDiretoria || 0 : 0) };
  // Uma fração do impacto permanece no início do próximo ano, para decisões acumulativas.
  const heranca = Object.fromEntries(Object.entries(impacto).map(([k, v]) => [k, Math.trunc(v * 0.4)]));
  return { ...c, tecnico: {
    ...t, elenco: limitar((t.elenco ?? 50) + (op.elenco || 0), 10, 95),
    moral: limitar((t.moral ?? 50) + (op.moral || 0) + (riscoAtivado ? op.riscoMoral || 0 : 0), 10, 95),
    diretoria: limitar((t.diretoria ?? 60) + (op.diretoria || 0) + (riscoAtivado ? op.riscoDiretoria || 0 : 0), 0, 100),
    torcida: limitar((t.torcida ?? 55) + Math.round(impacto.torcida * 0.5), 0, 100),
    efeitosPendentes: [...(t.efeitosPendentes || []), { carta: carta.id, opcao: op.id, heranca, aplicarEm: t.ano + 1 }],
    decisoes: [...(t.decisoes || []), { carta: carta.id, opcao: op.id, nome: op.nome, resultado, riscoAtivado }]
  }};
}
export function calcularOvrTecnico(t) {
  // OVR é habilidade profissional; aprovação e confiança são avaliações locais.
  const temporadas = t.temporadas || [];
  const experiencia = Math.min(12, temporadas.length * 2);
  const titulos = Math.min(12, (t.titulos || 0) * 4);
  const aproveitamento = (t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0) > 0
    ? (3 * (t.vitorias || 0) + (t.empates || 0)) / (3 * ((t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0))) : 0.45;
  const desempenho = Math.round((aproveitamento - 0.45) * 22);
  return limitar(Math.round(30 + (t.reputacao || 25) * 0.36 + experiencia + titulos + desempenho), 25, 99);
}
export function historicoProfissionalTecnico(t = {}) {
  const temporadas = t.temporadas || [];
  const clubes = [];
  for (const temporada of temporadas) {
    const clube = temporada.clube || 'Sem clube';
    let registro = clubes.find(x => x.nome === clube);
    if (!registro) {
      registro = { nome: clube, temporadas: 0, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, titulos: 0, demissoes: 0, melhorPosicao: null, anos: [] };
      clubes.push(registro);
    }
    registro.temporadas++;
    registro.jogos += (temporada.vitorias || 0) + (temporada.empates || 0) + (temporada.derrotas || 0);
    registro.vitorias += temporada.vitorias || 0;
    registro.empates += temporada.empates || 0;
    registro.derrotas += temporada.derrotas || 0;
    registro.titulos += temporada.campeao ? 1 : 0;
    registro.demissoes += temporada.interrompida || temporada.demitido ? 1 : 0;
    if (Number.isFinite(temporada.posicao)) registro.melhorPosicao = registro.melhorPosicao === null ? temporada.posicao : Math.min(registro.melhorPosicao, temporada.posicao);
    registro.anos.push(temporada.ano);
  }
  const jogos = temporadas.reduce((n, x) => n + (x.vitorias || 0) + (x.empates || 0) + (x.derrotas || 0), 0);
  const vitorias = temporadas.reduce((n, x) => n + (x.vitorias || 0), 0);
  const empates = temporadas.reduce((n, x) => n + (x.empates || 0), 0);
  const derrotas = temporadas.reduce((n, x) => n + (x.derrotas || 0), 0);
  return { clubes, temporadas: temporadas.length, jogos, vitorias, empates, derrotas,
    aproveitamento: jogos ? Math.round((vitorias * 3 + empates) / (jogos * 3) * 100) : 0,
    titulos: temporadas.filter(x => x.campeao).length,
    demissoes: temporadas.filter(x => x.interrompida || x.demitido).length,
    reunioes: (t.reunioes || []).length };
}
export function painelEstabilidadeTecnico(t = {}) {
  const objetivo = objetivoTecnico(t);
  const perfil = perfilClubeTecnico(t);
  const pressao = riscoDemissaoTecnico(t);
  const promessa = t.promessaContrato?.clube === t.clube ? t.promessaContrato : null;
  const ult = (t.temporadas || []).at(-1);
  return {
    objetivo: objetivo.nome,
    perfil: perfil.perfil, expectativa: perfil.expectativa,
    posicaoMeta: objetivo.posicao,
    promessa: promessa ? { posicaoMaxima: promessa.posicaoMaxima, descricao: 'Terminar entre os 4 primeiros' } : null,
    torcida: limitar(t.torcida ?? 55, 0, 100),
    diretoria: limitar(t.diretoria ?? 60, 0, 100),
    pressao: pressao.pressao,
    situacao: t.demitido ? 'Demitido' : t.desempregado ? 'Sem clube' : pressao.situacao,
    ultimaTemporada: ult ? { posicao: ult.posicao, cumpriuObjetivo: !!ult.cumpriuObjetivo, promessaDescumprida: !!ult.promessaDescumprida } : null
  };
}
export function riscoDemissaoTecnico(t) {
  const torcida = t.torcida ?? 55;
  const diretoria = t.diretoria ?? 60;
  const pressao = limitar(Math.round((100 - diretoria) * 0.58 + (100 - torcida) * 0.42), 0, 100);
  return { pressao, situacao: pressao >= 75 ? 'Crítica' : pressao >= 55 ? 'Instável' : pressao >= 35 ? 'Em observação' : 'Segura' };
}
export const OBJETIVOS_TECNICO = [
  { id: 'titulo', nome: 'Disputar o título', posicao: 2 },
  { id: 'continental', nome: 'Conquistar vaga continental', posicao: 6 },
  { id: 'meio', nome: 'Terminar na metade de cima', posicao: 10 },
  { id: 'permanencia', nome: 'Evitar rebaixamento', posicao: 16 }
];
export function perfilClubeTecnico(t = {}) {
  const cadastro = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const forca = cadastro?.elenco ?? t.elenco ?? 50;
  const liga = cadastro?.liga || t.liga || null;
  const segundaDivisao = !!liga && /(?:2|serieB)$/i.test(liga);
  const perfil = forca >= 82 ? 'elite' : forca >= 69 ? 'competitivo' : forca >= 57 ? 'intermediario' : 'reconstrucao';
  const expectativa = perfil === 'elite' ? 'Cobrança por títulos e desempenho imediato' :
    perfil === 'competitivo' ? 'Buscar as primeiras posições' :
    perfil === 'intermediario' ? 'Consolidar campanha competitiva' : 'Construir elenco e evitar crise';
  return { perfil, forca, liga, segundaDivisao, expectativa };
}
export function objetivoTecnico(t) {
  const perfil = perfilClubeTecnico(t);
  if (perfil.perfil === 'elite') return OBJETIVOS_TECNICO[0];
  if (perfil.perfil === 'competitivo') return OBJETIVOS_TECNICO[1];
  if (perfil.perfil === 'intermediario') return OBJETIVOS_TECNICO[2];
  return OBJETIVOS_TECNICO[3];
}
export function vinculosComoJogador(c) {
  const porClube = new Map();
  for (const temporada of c?.temporadas || []) {
    if (!temporada?.clube) continue;
    const anterior = porClube.get(temporada.clube) || { clube: temporada.clube, temporadas: 0, jogos: 0, titulos: 0, nota: 0 };
    anterior.temporadas++;
    anterior.jogos += temporada.jogos || 0;
    anterior.titulos += (temporada.titulos || []).length;
    anterior.nota += temporada.nota || 0;
    porClube.set(temporada.clube, anterior);
  }
  return [...porClube.values()].map(v => {
    const torcida = c?.torcida?.[v.clube] ?? 0;
    const idolatria = torcida >= 75 || (v.temporadas >= 5 && v.titulos >= 2);
    const afinidade = limitar(Math.round(v.temporadas * 8 + v.titulos * 7 + torcida * 0.35 + (idolatria ? 20 : 0)), 0, 100);
    return { ...v, torcida, idolatria, afinidade };
  }).sort((a,b) => b.afinidade - a.afinidade);
}
export function opcoesInicioTecnico(c) {
  const vinculos = vinculosComoJogador(c);
  const elegiveis = vinculos.filter(v => v.idolatria || v.temporadas >= 3 || v.afinidade >= 45);
  return elegiveis.slice(0, 5).map(v => ({ ...v, motivo: v.idolatria ? 'Ídolo do clube' : 'Ex-jogador com vínculo forte' }));
}
export function iniciarNoClubeIdolo(c, clube) {
  if (!c?.tecnico || c.tecnico.temporadas.length || c.tecnico.fase !== 'pretemporada') throw new Error('Escolha disponível somente no início da carreira.');
  const opcao = (c.tecnico.opcoesInicio || []).find(x => x.clube === clube);
  if (!opcao) throw new Error('Clube sem vínculo suficiente.');
  const dadosClube = CLUBES_CONVITES_TECNICO.find(x => x.nome === clube);
  return { ...c, tecnico: { ...c.tecnico, clube, pais: dadosClube?.pais || c.tecnico.pais, elenco: dadosClube?.elenco || c.tecnico.elenco, salario: dadosClube?.salario || c.tecnico.salario, torcida: limitar(55 + Math.round(opcao.afinidade * 0.35), 0, 100),
    diretoria: limitar(60 + Math.round(opcao.afinidade * 0.15), 0, 100), clubeInicialEscolhido: true, retornoIdolo: !!opcao.idolatria } };
}
const PAIS_LIGA_TECNICO = { brasileirao: 'Brasil', serieB: 'Brasil', argentina: 'Argentina', portugal: 'Portugal', portugal2: 'Portugal', espanha: 'Espanha', espanha2: 'Espanha', inglaterra: 'Inglaterra', inglaterra2: 'Inglaterra', italia: 'Itália', italia2: 'Itália', alemanha: 'Alemanha', alemanha2: 'Alemanha', franca: 'França', franca2: 'França', sulamericano: 'América do Sul' };
export const CLUBES_CONVITES_TECNICO = CLUBES.map(x => ({
  nome: x.nome, pais: PAIS_LIGA_TECNICO[x.liga] || x.liga, liga: x.liga,
  exigencia: limitar(Math.round(25 + (x.forca - 45) * 1.12), 25, 94),
  elenco: x.forca, salario: Math.max(5, Math.round(x.forca * x.forca / 85))
}));
export function salarioTecnico(t) {
  const clube = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const base = clube?.salario ?? 12;
  return Math.round(base * (0.65 + calcularOvrTecnico(t) / 140));
}
export function gerarPropostasTecnico(t, rng = sorteio) {
  const ovr = calcularOvrTecnico(t);
  const clubesPassados = new Set((t.temporadas || []).map(x => x.clube));
  const vinculosJogador = new Map((t.vinculosJogador || []).map(x => [x.clube, x]));
  const clubeAtual = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const elegiveis = CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && (ovr >= x.exigencia || (vinculosJogador.get(x.nome)?.idolatria && ovr >= x.exigencia - 16)))
    .map(x => {
      const mesmoPais = !!clubeAtual && x.pais === clubeAtual.pais;
      const retorno = clubesPassados.has(x.nome);
      const vinculo = vinculosJogador.get(x.nome);
      const bonusIdolo = vinculo?.idolatria ? 0.32 : (vinculo?.temporadas || 0) >= 3 ? 0.17 : 0;
      const rival = (CLASSICOS || []).some(derby => {
        const nomes = Array.isArray(derby) ? derby : [derby.a, derby.b, derby.casa, derby.fora, derby.clube1, derby.clube2];
        return nomes.includes(x.nome) && nomes.includes(t.clube);
      });
      const chance = limitar(0.38 + (ovr - x.exigencia) / 160 + (mesmoPais ? 0.15 : -0.06)
        + (retorno ? 0.12 : 0) + bonusIdolo - (rival ? 0.30 : 0) + ((t.temporadas || []).length >= 4 ? 0.08 : 0), 0.06, 0.90);
      return { ...x, chance, rival, retorno, objetivo: objetivoTecnico({ ...t, clube: x.nome, elenco: x.elenco }).nome };
    });
  // Sorteio por clube: mesmo um treinador consagrado pode terminar sem convites.
  const selecionados = elegiveis.filter(x => rng() < x.chance);
  for (let i = selecionados.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [selecionados[i], selecionados[j]] = [selecionados[j], selecionados[i]];
  }
  return selecionados.slice(0, 3);
}
export const ENTREVISTAS_TECNICO = [
  { id: 'prudente', nome: 'Aceitar o projeto', multiplicador: 1, bonusDiretoria: 8, bonusTorcida: 0, exigenciaExtra: 0, risco: 0 },
  { id: 'salario', nome: 'Negociar salário maior (+20%)', multiplicador: 1.2, bonusDiretoria: -5, bonusTorcida: 0, exigenciaExtra: 6, risco: 0.18 },
  { id: 'ambicioso', nome: 'Prometer grandes resultados (+10%)', multiplicador: 1.1, bonusDiretoria: 10, bonusTorcida: 6, exigenciaExtra: 2, risco: 0.12 }
];
export function negociarContratoTecnico(c, clube, estrategia = 'prudente', rng = sorteio) {
  const t = c?.tecnico;
  if (!t || (t.fase !== 'resultado' && !t.desempregado)) throw new Error('Negociação indisponível nesta fase.');
  const proposta = (t.propostas || []).find(p => p.nome === clube);
  const opcao = ENTREVISTAS_TECNICO.find(x => x.id === estrategia);
  if (!proposta || !opcao) throw new Error('Proposta ou estratégia inválida.');
  const ovr = calcularOvrTecnico(t);
  const risco = limitar(opcao.risco + Math.max(0, proposta.exigencia + opcao.exigenciaExtra - ovr) / 100, 0, 0.9);
  if (rng() < risco) {
    return { ...c, tecnico: { ...t, propostas: t.propostas.filter(p => p.nome !== clube),
      ultimaNegociacao: { clube, estrategia, aceita: false, motivo: 'A diretoria recusou suas condições.' } } };
  }
  const contratado = aceitarPropostaTecnico(c, clube);
  const novo = contratado.tecnico;
  return { ...contratado, tecnico: { ...novo,
    salario: Math.round(proposta.salario * opcao.multiplicador),
    diretoria: limitar(novo.diretoria + opcao.bonusDiretoria, 0, 100),
    torcida: limitar(novo.torcida + opcao.bonusTorcida, 0, 100),
    promessaContrato: estrategia === 'ambicioso' ? { clube, posicaoMaxima: 4, temporada: t.ano } : null,
    ultimaNegociacao: { clube, estrategia, aceita: true } } };
}
export function aceitarPropostaTecnico(c, clube) {
  const t = c.tecnico;
  if (!t || (t.fase !== 'resultado' && !t.desempregado)) throw new Error('Propostas só podem ser aceitas entre temporadas.');
  const proposta = (t.propostas || []).find(x => x.nome === clube);
  if (!proposta) throw new Error('Proposta indisponível.');
  return { ...c, tecnico: { ...t, clube: proposta.nome, pais: proposta.pais, elenco: proposta.elenco,
    moral: 50, diretoria: proposta.rival ? 48 : 65, torcida: proposta.rival ? 35 : 55,
    demitido: false, desempregado: false, promessaContrato: null, retornoIdolo: !!(t.vinculosJogador || []).find(v => v.clube === proposta.nome && v.idolatria), propostas: [], salario: proposta.salario } };
}
export function passarAnoDesempregado(c, rng = sorteio) {
  if (!c?.tecnico || c.tecnico.fase !== 'resultado') throw new Error('Só é possível aguardar entre temporadas.');
  const t = c.tecnico;
  if (!t.demitido && !t.desempregado) throw new Error('O treinador ainda tem contrato.');
  const proximo = { ...t, ano: t.ano + 1, desempregado: true, demitido: false, clube: null,
    pais: null, salario: 0, propostas: [], reputacao: limitar(t.reputacao - 2, 10, 99),
    anosDesempregado: (t.anosDesempregado || 0) + 1 };
  return { ...c, idade: c.idade + 1, ano: c.ano + 1, tecnico: {
    ...proximo, propostas: gerarPropostasTecnico(proximo, rng)
  }};
}
export function iniciarCarreiraTecnico(c) {
  if (!c?.aposentado) throw new Error('O jogador precisa se aposentar primeiro.');
  if (c.tecnico) return c;
  const legado = c.legado?.pontos || 0;
  const reputacao = limitar(Math.round(25 + (Number.isFinite(legado) ? legado : 0) / 22), 25, 85);
  const vinculosJogador = vinculosComoJogador(c);
  const opcoesInicio = opcoesInicioTecnico(c);
  const clubeInicial = opcoesInicio[0]?.clube || c.clubeNome || 'Clube inicial';
  const dadosClubeInicial = CLUBES_CONVITES_TECNICO.find(x => x.nome === clubeInicial);
  const afinidadeInicial = opcoesInicio[0]?.afinidade || 0;
  return { ...c, tecnico: {
    idadeInicio: c.idade, ano: c.ano, clube: clubeInicial, vinculosJogador, opcoesInicio, clubeInicialEscolhido: false,
    reputacao, pais: dadosClubeInicial?.pais || 'Brasil', salario: dadosClubeInicial?.salario || 12, desempregado: false, anosDesempregado: 0, estilo: 'equilibrado', temporadas: [], vitorias: 0, empates: 0,
    derrotas: 0, titulos: 0, elenco: dadosClubeInicial?.elenco || 50, moral: 50, diretoria: limitar(60 + Math.round(afinidadeInicial * 0.15), 0, 100), torcida: limitar(55 + Math.round(afinidadeInicial * 0.35), 0, 100), decisoes: [], demitido: false, propostas: [], historicoCartas: [], cartas: sortearCartasTecnico({ reputacao, temporadas: [], diretoria: 60, moral: 50 }), fase: 'pretemporada'
  }};
}
export function definirEstiloTecnico(c, estilo) {
  if (!ESTILOS_TECNICO.some(x => x.id === estilo)) throw new Error('Estilo inválido.');
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  return { ...c, tecnico: { ...c.tecnico, estilo } };
}
export function probabilidadesTecnico(t = {}) {
  const forca = limitar(t.elenco ?? 50, 10, 95);
  const moral = limitar(t.moral ?? 50, 10, 95);
  const reputacao = limitar(t.reputacao ?? 40, 10, 99);
  const bonusEstilo = t.estilo === 'equilibrado' ? 0.015 : t.estilo === 'ofensivo' ? 0.025 : -0.015;
  const vitoria = limitar(0.16 + (forca - 35) * 0.0075 + (moral - 50) * 0.0015 +
    (reputacao - 50) * 0.001 + bonusEstilo, 0.16, 0.69);
  const empate = t.estilo === 'defensivo' ? 0.29 : t.estilo === 'ofensivo' ? 0.18 : 0.24;
  return { vitoria, empate: Math.min(empate, 0.94 - vitoria), derrota: Math.max(0.06, 1 - vitoria - empate) };
}
export function calendarioLigaTecnico(t = {}) {
  const clube = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const liga = clube?.liga || t.liga;
  const participantes = CLUBES_CONVITES_TECNICO.filter(x => !liga || x.liga === liga)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  if (!participantes.some(x => x.nome === t.clube)) {
    // Um clube de save antigo substitui um participante da liga; nao cria 21 times.
    if (participantes.length === 20) participantes.pop();
    participantes.unshift({ nome: t.clube || 'Meu clube', elenco: t.elenco ?? 50 });
  }
  if (participantes.length !== 20) return null;
  const times = [...participantes];
  const rodadas = [];
  for (let r = 0; r < 19; r++) {
    const jogos = [];
    for (let i = 0; i < 10; i++) {
      const a = times[i], b = times[19 - i];
      const casa = (r + i) % 2 === 0 ? a : b;
      const fora = casa === a ? b : a;
      jogos.push({ casa: casa.nome, fora: fora.nome });
    }
    rodadas.push(jogos);
    times.splice(1, 0, times.pop());
  }
  return [...rodadas, ...rodadas.map(jogos => jogos.map(j => ({ casa: j.fora, fora: j.casa })))];
}
export function calendarioAdversariosTecnico(t = {}) {
  const liga = calendarioLigaTecnico(t);
  if (liga) return liga.map((jogos, i) => {
    const nomeMeuClube = t.clube || 'Meu clube';
    const partida = jogos.find(j => j.casa === nomeMeuClube || j.fora === nomeMeuClube);
    if (!partida) throw new Error('Calendário inconsistente: clube ausente da rodada.');
    const nome = partida.casa === nomeMeuClube ? partida.fora : partida.casa;
    return { rodada: i + 1, nome, forca: CLUBES_CONVITES_TECNICO.find(x => x.nome === nome)?.elenco ?? 50,
      casa: partida.casa === nomeMeuClube };
  });
  const clube = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const candidatos = CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && (!clube || x.liga === clube.liga))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  if (!candidatos.length) return Array.from({ length: 38 }, (_, i) => ({ rodada: i + 1, nome: 'Adversário', forca: 50, casa: i % 2 === 0 }));
  return Array.from({ length: 38 }, (_, i) => {
    const rival = candidatos[i % candidatos.length];
    return { rodada: i + 1, nome: rival.nome, forca: rival.elenco, casa: i < 19 };
  });
}
export function probabilidadesConfrontoTecnico(t, adversario) {
  const base = probabilidadesTecnico(t);
  const diferenca = limitar(((t.elenco ?? 50) - (adversario?.forca ?? 50)) * 0.005, -0.24, 0.24);
  const mando = adversario?.casa ? 0.035 : -0.035;
  const vitoria = limitar(base.vitoria + diferenca + mando, 0.10, 0.78);
  const empate = Math.min(base.empate, 0.93 - vitoria);
  return { vitoria, empate, derrota: 1 - vitoria - empate };
}
export function placarTecnico(resultado, rng = sorteio) {
  if (resultado === 'E') { const gols = Math.floor(rng() * 3); return { pro: gols, contra: gols }; }
  const vencedor = 1 + Math.floor(rng() * 3);
  const perdedor = Math.floor(rng() * vencedor);
  return resultado === 'V' ? { pro: vencedor, contra: perdedor } : { pro: perdedor, contra: vencedor };
}
export function registrarGolsTecnico(linha, pro, contra) {
  linha.golsPro = (linha.golsPro || 0) + pro;
  linha.golsContra = (linha.golsContra || 0) + contra;
  linha.saldoGols = linha.golsPro - linha.golsContra;
}
export function simularRodadaRivaisTecnico(t, classificacaoAnterior, adversario, resultado, rng = sorteio, rodada = 1, placarTreinador = null) {
  const linhas = classificacaoAnterior.map(x => ({ ...x }));
  const calendario = calendarioLigaTecnico(t);
  const partidas = calendario?.[rodada - 1];
  if (partidas) {
    for (const partida of partidas) {
      const casa = linhas.find(x => x.nome === partida.casa);
      const fora = linhas.find(x => x.nome === partida.fora);
      if (!casa || !fora) continue;
      const envolveTreinador = casa.meuClube || fora.meuClube;
      const forcaCasa = CLUBES_CONVITES_TECNICO.find(x => x.nome === casa.nome)?.elenco ?? t.elenco ?? 50;
      const forcaFora = CLUBES_CONVITES_TECNICO.find(x => x.nome === fora.nome)?.elenco ?? t.elenco ?? 50;
      const chanceCasa = limitar(0.42 + (forcaCasa - forcaFora) * 0.007, 0.16, 0.69);
      const r = envolveTreinador ? null : rng();
      const desfecho = envolveTreinador
        ? (casa.meuClube ? resultado : resultado === 'V' ? 'D' : resultado === 'D' ? 'V' : 'E')
        : r < chanceCasa ? 'V' : r < chanceCasa + 0.25 ? 'E' : 'D';
      if (envolveTreinador) {
        const rival = casa.meuClube ? fora : casa;
        const placar = placarTreinador || placarTecnico(resultado, rng);
        registrarGolsTecnico(rival, placar.contra, placar.pro);
        rival.jogos++;
        if (resultado === 'E') { rival.empates++; rival.pontos++; }
        else if (resultado === 'V') rival.derrotas++;
        else { rival.vitorias++; rival.pontos += 3; }
      } else {
        const placar = placarTecnico(desfecho, rng);
        registrarGolsTecnico(casa, placar.pro, placar.contra);
        registrarGolsTecnico(fora, placar.contra, placar.pro);
        casa.jogos++; fora.jogos++;
        if (desfecho === 'V') { casa.vitorias++; fora.derrotas++; casa.pontos += 3; }
        else if (desfecho === 'E') { casa.empates++; fora.empates++; casa.pontos++; fora.pontos++; }
        else { fora.vitorias++; casa.derrotas++; fora.pontos += 3; }
      }
    }
    return linhas;
  }
  // Compatibilidade com ligas de tamanho diferente ou carreiras antigas.
  const rivalDireto = linhas.find(x => !x.meuClube && x.nome === adversario);
  if (rivalDireto) {
    const placar = placarTreinador || placarTecnico(resultado, rng);
    registrarGolsTecnico(rivalDireto, placar.contra, placar.pro);
    rivalDireto.jogos++;
    if (resultado === 'V') rivalDireto.derrotas++;
    else if (resultado === 'E') { rivalDireto.empates++; rivalDireto.pontos++; }
    else { rivalDireto.vitorias++; rivalDireto.pontos += 3; }
  }
  // Alterna a folga nas ligas de quantidade ímpar, evitando favorecer sempre o mesmo clube.
  const rivais = linhas.filter(x => !x.meuClube && x.nome !== adversario);
  if (rivais.length % 2 === 1) rivais.splice((rodada - 1) % rivais.length, 1);
  for (let i = 0; i + 1 < rivais.length; i += 2) {
    const a = rivais[i], b = rivais[i + 1];
    const forcaA = CLUBES_CONVITES_TECNICO.find(x => x.nome === a.nome)?.elenco ?? 50;
    const forcaB = CLUBES_CONVITES_TECNICO.find(x => x.nome === b.nome)?.elenco ?? 50;
    const chanceA = limitar(0.38 + (forcaA - forcaB) * 0.007, 0.16, 0.68);
    const r = rng();
    const desfecho = r < chanceA ? 'V' : r < chanceA + 0.25 ? 'E' : 'D';
    const placar = placarTecnico(desfecho, rng);
    registrarGolsTecnico(a, placar.pro, placar.contra);
    registrarGolsTecnico(b, placar.contra, placar.pro);
    if (r < chanceA) { a.vitorias++; b.derrotas++; a.pontos += 3; }
    else if (r < chanceA + 0.25) { a.empates++; b.empates++; a.pontos++; b.pontos++; }
    else { b.vitorias++; a.derrotas++; b.pontos += 3; }
    a.jogos++; b.jogos++;
  }
  return linhas;
}
export function tabelaClassificacaoTecnico(t, andamento, rng = sorteio) {
  const jogos = andamento?.jogos || 0;
  const clube = CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube);
  const liga = clube?.liga || t.liga;
  const rivais = CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && (!liga || x.liga === liga))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).slice(0, 19);
  const pontos = andamento?.pontos || 0;
  const linhas = [{ nome: t.clube || 'Meu clube', jogos, pontos, vitorias: andamento?.vitorias || 0,
    empates: andamento?.empates || 0, derrotas: andamento?.derrotas || 0, golsPro: andamento?.golsPro || 0, golsContra: andamento?.golsContra || 0, saldoGols: (andamento?.golsPro || 0) - (andamento?.golsContra || 0), meuClube: true }];
  for (const rival of rivais) {
    const forca = rival.elenco;
    const expectativa = limitar(0.22 + (forca - 45) * 0.007, 0.16, 0.57);
    const empates = Math.min(jogos, Math.round(jogos * 0.24));
    const variacao = jogos >= 38 && t.simulacaoExpressa ? Math.round((rng() + rng() + rng() - 1.5) * 10) : 0;
    const vitorias = Math.max(0, Math.min(jogos - empates, Math.round(jogos * expectativa) + variacao));
    const derrotas = jogos - vitorias - empates;
    linhas.push({ nome: rival.nome, jogos, pontos: vitorias * 3 + empates, vitorias, empates, derrotas, golsPro: 0, golsContra: 0, saldoGols: 0, meuClube: false });
  }
  return ordenarClassificacaoTecnico(linhas);
}
export function zonaClassificacaoTecnico(posicao, total = 20) {
  if (posicao === 1) return 'campeao';
  if (posicao <= 4) return 'continental';
  if (posicao > total - 4) return 'rebaixamento';
  return 'meio';
}
export function ordenarClassificacaoTecnico(linhas) {
  return [...linhas].sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias ||
    b.saldoGols - a.saldoGols || a.nome.localeCompare(b.nome, 'pt-BR'))
    .map((x, i, todos) => ({ ...x, posicao: i + 1, zona: zonaClassificacaoTecnico(i + 1, todos.length) }));
}
export const ETAPAS_TEMPORADA_TECNICO = [10, 19, 29, 38];
export const OPCOES_REUNIAO_TECNICO = [
  { id: 'responsabilidade', nome: 'Assumir responsabilidade', descricao: 'Confiança +12 · moral -4; compromete-se a reagir.' },
  { id: 'reforcos', nome: 'Exigir reforços', descricao: 'Elenco +5 · confiança -6 · torcida +3.' },
  { id: 'defesa', nome: 'Defender o trabalho', descricao: 'Moral +6 · risco de perder confiança da diretoria.' }
];
export function reuniaoEmergenciaTecnico(c, escolha, rng = sorteio) {
  const t = c?.tecnico;
  if (!t || t.fase !== 'pretemporada' || !t.reuniaoPendente || !t.andamento) throw new Error('Nenhuma reunião de emergência disponível.');
  if (!OPCOES_REUNIAO_TECNICO.some(x => x.id === escolha)) throw new Error('Resposta inválida.');
  let diretoria = t.diretoria, torcida = t.torcida, moral = t.moral, elenco = t.elenco;
  if (escolha === 'responsabilidade') { diretoria += 12; moral -= 4; }
  if (escolha === 'reforcos') { diretoria -= 6; elenco += 5; torcida += 3; }
  if (escolha === 'defesa') { moral += 6; diretoria += rng() < 0.4 ? 5 : -9; }
  const nova = { ...t, diretoria: limitar(diretoria, 0, 100), torcida: limitar(torcida, 0, 100),
    moral: limitar(moral, 10, 95), elenco: limitar(elenco, 10, 95),
    reuniaoPendente: false, reunioes: [...(t.reunioes || []), { ano: t.ano, rodada: t.andamento.jogos, escolha }] };
  return { ...c, tecnico: nova };
}
export function simularEtapaTecnico(c, rng = sorteio) {
  const t = c?.tecnico;
  if (!t || t.fase !== 'pretemporada') throw new Error('Etapa indisponível.');
  if ((t.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) throw new Error('Conclua as decisões antes de jogar.');
  if (t.reuniaoPendente) throw new Error('Responda à reunião com a diretoria antes de avançar.');
  const anterior = t.andamento || { jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0, avaliacoes: [] };
  const limite = ETAPAS_TEMPORADA_TECNICO.find(n => n > anterior.jogos);
  if (!limite) throw new Error('Temporada já concluída.');
  const calendario = anterior.calendario || calendarioAdversariosTecnico(t);
  // Copia cada partida para não alterar saves anteriores por referência.
  const confrontos = (anterior.confrontos || []).map(jogo => ({ ...jogo }));
  let v = anterior.vitorias, e = anterior.empates, d = anterior.derrotas;
  for (let i = anterior.jogos; i < limite; i++) {
    const adversario = calendario[i];
    const { vitoria: pVitoria, empate: pEmpate } = probabilidadesConfrontoTecnico(t, adversario);
    const r = rng();
    const resultado = r < pVitoria ? 'V' : r < pVitoria + pEmpate ? 'E' : 'D';
    if (resultado === 'V') v++; else if (resultado === 'E') e++; else d++;
    const placar = placarTecnico(resultado, rng);
    confrontos.push({ ...adversario, resultado, golsPro: placar.pro, golsContra: placar.contra });
  }
  const pontos = v * 3 + e;
  const aproveitamento = pontos / (limite * 3);
  const expectativa = objetivoTecnico(t).posicao;
  const ruim = aproveitamento < (expectativa <= 4 ? 0.44 : expectativa <= 8 ? 0.35 : 0.25);
  const otimo = aproveitamento > (expectativa <= 4 ? 0.72 : 0.62);
  const ajuste = otimo ? 6 : ruim ? -9 : 1;
  const diretoria = limitar((t.diretoria ?? 60) + ajuste, 0, 100);
  const torcida = limitar((t.torcida ?? 55) + (otimo ? 7 : ruim ? -8 : 1), 0, 100);
  const pressao = riscoDemissaoTecnico({ ...t, diretoria, torcida }).pressao;
  const demitido = (diretoria < 18 || pressao >= 85) && limite < 38;
  const reuniaoPendente = !demitido && limite < 38 && (pressao >= 55 || diretoria <= 45);
  const avaliacao = { rodada: limite, pontos, aproveitamento: Math.round(aproveitamento * 100),
    situacao: demitido ? 'Demitido durante a temporada' : ruim ? 'Diretoria insatisfeita' : otimo ? 'Diretoria satisfeita' : 'Diretoria acompanha os resultados',
    diretoria, torcida, pressao };
  const andamento = { jogos: limite, calendario, confrontos, vitorias: v, empates: e, derrotas: d, pontos,
    avaliacoes: [...anterior.avaliacoes, avaliacao] };
  // Saves anteriores à introdução dos placares preservam resultados e recebem gols coerentes.
  for (const jogo of confrontos) {
    if (!Number.isFinite(jogo.golsPro) || !Number.isFinite(jogo.golsContra)) {
      const placar = placarTecnico(jogo.resultado, rng);
      jogo.golsPro = placar.pro;
      jogo.golsContra = placar.contra;
    }
  }
  // Mantém os resultados dos rivais entre etapas; saves antigos iniciam pela tabela estimada.
  const base = anterior.classificacao || tabelaClassificacaoTecnico(t, { jogos: anterior.jogos, pontos: anterior.pontos, vitorias: anterior.vitorias, empates: anterior.empates, derrotas: anterior.derrotas });
  let classificacao = base;
  for (let rodada = anterior.jogos; rodada < limite; rodada++) {
    classificacao = simularRodadaRivaisTecnico(t, classificacao, confrontos[rodada]?.nome, confrontos[rodada]?.resultado, rng, rodada + 1, { pro: confrontos[rodada]?.golsPro, contra: confrontos[rodada]?.golsContra });
  }
  const golsPro = confrontos.reduce((n, j) => n + (j.golsPro || 0), 0);
  const golsContra = confrontos.reduce((n, j) => n + (j.golsContra || 0), 0);
  classificacao = classificacao.map(x => x.meuClube ? { ...x, jogos: limite, pontos, vitorias: v, empates: e, derrotas: d, golsPro, golsContra, saldoGols: golsPro - golsContra } : x);
  andamento.classificacao = ordenarClassificacaoTecnico(classificacao);
  if (demitido) {
    const posicao = andamento.classificacao.find(x => x.meuClube)?.posicao || 18;
    const temporada = { ano: t.ano, clube: t.clube, liga: CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.liga || t.liga, objetivo: objetivoTecnico(t).nome,
      cumpriuObjetivo: false, posicao, pontos, vitorias: v, empates: e, derrotas: d,
      jogos: limite, interrompida: true, demitido: true, confrontos, classificacao: andamento.classificacao, avaliacoes: andamento.avaliacoes };
    const novo = { ...t, diretoria, torcida, demitido: true, reuniaoPendente: false, andamento: null,
      fase: 'resultado', temporadas: [...t.temporadas, temporada],
      vitorias: t.vitorias + v, empates: t.empates + e, derrotas: t.derrotas + d,
      propostas: gerarPropostasTecnico({ ...t, diretoria, torcida, clube: null }, rng),
      promessaContrato: null, ano: t.ano + 1 };
    return { ...c, idade: c.idade + 1, ano: c.ano + 1, tecnico: novo };
  }
  if (limite < 38) return { ...c, tecnico: { ...t, diretoria, torcida, andamento, reuniaoPendente } };
  // Finalizar usando os resultados já disputados, sem sortear partidas novamente.
  return finalizarTemporadaTecnico(c, { ...andamento, diretoria, torcida }, rng);
}
export function simularTemporadaTecnico(c, rng = sorteio) {
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  if (c.tecnico.fase !== 'pretemporada') throw new Error('Conclua a temporada anterior antes de simular.');
  if (carreiraTecnicoEncerrada(c.tecnico)) throw new Error('Limite de 30 temporadas como treinador atingido.');
  const t = c.tecnico;
  if ((t.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) throw new Error('Tome as decisões da temporada antes de simular.');
  if (t.andamento?.jogos) throw new Error('Temporada em andamento: avance pelas etapas.');
  const calendario = calendarioAdversariosTecnico(t);
  let vitorias = 0, empates = 0, derrotas = 0;
  for (let rodada = 0; rodada < 38; rodada++) {
    const adversario = calendario[rodada % calendario.length];
    const base = probabilidadesConfrontoTecnico(t, adversario);
    const vitoria = limitar(0.23 + ((t.elenco ?? 50) - 60) * 0.004 + ((t.moral ?? 50) - 50) * 0.0008 + ((t.reputacao ?? 50) - 50) * 0.00035 + ((t.elenco ?? 50) - (adversario?.forca ?? 50)) * 0.008 + (adversario?.casa ? 0.035 : -0.035), 0.11, 0.52);
    const empate = Math.min(base.empate, 0.95 - vitoria);
    const r = rng();
    if (r < vitoria) vitorias++;
    else if (r < vitoria + empate) empates++;
    else derrotas++;
  }
  const pontos = vitorias * 3 + empates;
  const classificacao = tabelaClassificacaoTecnico({ ...t, simulacaoExpressa: true }, { jogos: 38, pontos, vitorias, empates, derrotas }, rng);
  const posicao = classificacao.find(x => x.meuClube)?.posicao || 18;
  const campeao = posicao === 1;
  const objetivo = objetivoTecnico(t);
  // O ídolo começa protegido pelo carinho da torcida, mas uma campanha ruim
  // provoca frustração maior que a de um treinador sem história no clube.
  const vinculoAtual = (t.vinculosJogador || []).find(v => v.clube === t.clube);
  const idoloEmCasa = !!vinculoAtual?.idolatria;
  const cumpriuObjetivo = posicao <= objetivo.posicao;
  const promessaDescumprida = !!(t.promessaContrato && t.promessaContrato.clube === t.clube && posicao > t.promessaContrato.posicaoMaxima);
  const temporada = { ano: t.ano, clube: t.clube, liga: CLUBES_CONVITES_TECNICO.find(x => x.nome === t.clube)?.liga || t.liga, idoloEmCasa, objetivo: objetivo.nome, cumpriuObjetivo, promessaDescumprida, estilo: t.estilo, decisoes: t.decisoes, vitorias, empates, derrotas, pontos, posicao, campeao };
  const novaConfianca = limitar((t.diretoria ?? 60) + (cumpriuObjetivo ? 8 : -14) + (posicao <= 4 ? 5 : posicao >= 15 ? -8 : 0)
    + (idoloEmCasa && !cumpriuObjetivo ? -4 : 0) - (promessaDescumprida ? 12 : 0), 0, 100);
  const variacaoTorcida = (campeao ? 18 : posicao <= 4 ? 10 : cumpriuObjetivo ? 5 : posicao >= 17 ? -23 : -12)
    + (idoloEmCasa && !cumpriuObjetivo ? -9 : idoloEmCasa && cumpriuObjetivo ? 4 : 0) - (promessaDescumprida ? 7 : 0);
  const novaTorcida = limitar((t.torcida ?? 55) + variacaoTorcida, 0, 100);
  const situacaoCargo = riscoDemissaoTecnico({ ...t, diretoria: novaConfianca, torcida: novaTorcida });
  const demitido = novaConfianca < 20 || (novaConfianca < 40 && novaTorcida < 35) || situacaoCargo.pressao >= 82;
  temporada.demitido = demitido;
  const propostas = gerarPropostasTecnico({ ...t, clube: demitido ? null : t.clube, reputacao: limitar((t.reputacao ?? 50) + (campeao ? 9 : cumpriuObjetivo ? 4 : -3), 10, 99) }, rng);
  return { ...c, idade: c.idade + 1, ano: c.ano + 1, tecnico: {
    ...t, ano: t.ano + 1, fase: 'resultado', temporadas: [...t.temporadas, temporada],
    vitorias: (t.vitorias ?? 0) + vitorias, empates: (t.empates ?? 0) + empates, derrotas: (t.derrotas ?? 0) + derrotas,
    titulos: (t.titulos ?? 0) + (campeao ? 1 : 0), demitido, propostas, promessaContrato: null, objetivoAtual: objetivo.nome,
    reputacao: limitar((t.reputacao ?? 50) + (campeao ? 9 : posicao <= 4 ? 5 : posicao >= 15 ? -5 : 1), 10, 99),
    diretoria: novaConfianca, torcida: novaTorcida
  }};
}
function finalizarTemporadaTecnico(c, andamento, rng = sorteio) {
  const t = c.tecnico;
  const { vitorias, empates, derrotas, pontos } = andamento;
  const classificacao = andamento.classificacao || tabelaClassificacaoTecnico(t, andamento);
  const posicao = classificacao.find(x => x.meuClube)?.posicao || 18;
  const campeao = posicao === 1;
  const objetivo = objetivoTecnico(t);
  const idoloEmCasa = !!(t.vinculosJogador || []).find(v => v.clube === t.clube && v.idolatria);
  const cumpriuObjetivo = posicao <= objetivo.posicao;
  const promessaDescumprida = !!(t.promessaContrato?.clube === t.clube && posicao > t.promessaContrato.posicaoMaxima);
  const novaConfianca = limitar(andamento.diretoria + (cumpriuObjetivo ? 8 : -14) + (posicao <= 4 ? 5 : posicao >= 15 ? -8 : 0)
    + (idoloEmCasa && !cumpriuObjetivo ? -4 : 0) - (promessaDescumprida ? 12 : 0), 0, 100);
  const novaTorcida = limitar(andamento.torcida + (campeao ? 18 : posicao <= 4 ? 10 : cumpriuObjetivo ? 5 : posicao >= 17 ? -23 : -12)
    + (idoloEmCasa && !cumpriuObjetivo ? -9 : idoloEmCasa && cumpriuObjetivo ? 4 : 0) - (promessaDescumprida ? 7 : 0), 0, 100);
  const demitido = novaConfianca < 20 || (novaConfianca < 40 && novaTorcida < 35) ||
    riscoDemissaoTecnico({ ...t, diretoria: novaConfianca, torcida: novaTorcida }).pressao >= 82;
  const temporada = { ano: t.ano, clube: t.clube, objetivo: objetivo.nome, cumpriuObjetivo,
    promessaDescumprida, idoloEmCasa, estilo: t.estilo, decisoes: t.decisoes,
    vitorias, empates, derrotas, pontos, posicao, campeao, classificacao, confrontos: andamento.confrontos || [], avaliacoes: andamento.avaliacoes };
  temporada.demitido = demitido;
  const proximo = { ...t, ano: t.ano + 1, fase: 'resultado', andamento: null,
    temporadas: [...t.temporadas, temporada], reuniaoPendente: false, vitorias: t.vitorias + vitorias,
    empates: t.empates + empates, derrotas: t.derrotas + derrotas,
    titulos: t.titulos + (campeao ? 1 : 0), demitido, promessaContrato: null,
    objetivoAtual: objetivo.nome, diretoria: novaConfianca, torcida: novaTorcida,
    reputacao: limitar(t.reputacao + (campeao ? 9 : posicao <= 4 ? 5 : posicao >= 15 ? -5 : 1), 10, 99) };
  proximo.propostas = gerarPropostasTecnico({ ...proximo, clube: demitido ? null : t.clube }, rng);
  return { ...c, idade: c.idade + 1, ano: c.ano + 1, tecnico: proximo };
}
export function proximaTemporadaTecnico(c) {
  if (!c?.tecnico || c.tecnico.fase !== 'resultado') throw new Error('Nenhum resultado pendente.');
  const t = c.tecnico;
  if (t.demitido || t.desempregado) throw new Error('Aceite uma proposta antes de começar a próxima temporada.');
  if (carreiraTecnicoEncerrada(t)) throw new Error('Carreira de treinador encerrada após 30 temporadas.');
  const historicoCartas = [...(t.historicoCartas || []), ...(t.cartas || [])].slice(-32);
  const vencidos = (t.efeitosPendentes || []).filter(e => e.aplicarEm <= t.ano);
  const pendentes = (t.efeitosPendentes || []).filter(e => e.aplicarEm > t.ano);
  const soma = (atributo) => vencidos.reduce((acc, e) => acc + (e.heranca?.[atributo] || 0), 0);
  const proximo = { ...t, historicoCartas, decisoes: [], andamento: null, reuniaoPendente: false, fase: 'pretemporada', ultimaNegociacao: null,
    efeitosPendentes: pendentes, efeitosRecebidos: vencidos,
    elenco: limitar(t.elenco + soma('elenco'), 10, 95),
    moral: limitar(t.moral + 2 + soma('moral'), 10, 95),
    diretoria: limitar(t.diretoria + soma('diretoria'), 0, 100),
    torcida: limitar((t.torcida ?? 55) + Math.round(soma('torcida') * 0.5), 0, 100) };
  return { ...c, tecnico: { ...proximo, cartas: sortearCartasTecnico(proximo) } };
}

/** Escolha interna imparcial para eventos não exibidos no fluxo expresso. */
export function escolherOpcaoAutomaticaTecnico(opcoes, rng = sorteio) {
  if (!Array.isArray(opcoes) || opcoes.length === 0) throw new Error('Evento sem alternativas.');
  const valor = rng();
  const indice = Math.min(opcoes.length - 1, Math.max(0, Math.floor(valor * opcoes.length)));
  return opcoes[indice].id;
}

/** Fluxo expresso: uma escolha visível por temporada, sem alterar saves antigos. */
export function jogarTemporadaExpressaTecnico(c, opcaoId, rng = sorteio) {
  if (!c?.tecnico || c.tecnico.fase !== 'pretemporada') throw new Error('Temporada indisponível.');
  if (carreiraTecnicoEncerrada(c.tecnico)) throw new Error('Carreira de treinador encerrada.');
  if (c.tecnico.temporadas.length === 0 && !c.tecnico.clubeInicialEscolhido && c.tecnico.opcoesInicio?.length) throw new Error('Escolha o clube inicial.');
  let atual = c;
  // Respeita a escolha visível inclusive nos saves antigos que já possuem
  // uma ou mais decisões tomadas nesta temporada.
  if ((atual.tecnico.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) {
    atual = tomarDecisaoTecnico(atual, opcaoId, rng);
  }
  // Saves da interface anterior podem ter decisões parcialmente concluídas.
  while ((atual.tecnico.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) {
    const carta = cartaAtualTecnico(atual.tecnico);
    if (!carta?.opcoes?.length) throw new Error('Não foi possível preparar a temporada.');
    // As decisões ocultas não devem favorecer sempre a primeira alternativa.
    atual = tomarDecisaoTecnico(atual, escolherOpcaoAutomaticaTecnico(carta.opcoes, rng), rng);
  }
  // Se a temporada antiga já começou, conclui suas etapas preservando o andamento.
  if (atual.tecnico.andamento?.jogos) {
    while (atual.tecnico.fase === 'pretemporada') {
      if (atual.tecnico.reuniaoPendente) atual = reuniaoEmergenciaTecnico(atual, 'responsabilidade', rng);
      atual = simularEtapaTecnico(atual, rng);
    }
    return atual;
  }
  return simularTemporadaTecnico(atual, rng);
}
