import { EVENTOS_CONTEXTO_TECNICO } from './eventosTecnico.js';
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
export function objetivoTecnico(t) {
  if ((t.reputacao || 0) >= 78 && (t.elenco || 0) >= 60) return OBJETIVOS_TECNICO[0];
  if ((t.reputacao || 0) >= 58) return OBJETIVOS_TECNICO[1];
  if ((t.reputacao || 0) >= 40) return OBJETIVOS_TECNICO[2];
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
  return { ...c, tecnico: { ...c.tecnico, clube, torcida: limitar(55 + Math.round(opcao.afinidade * 0.35), 0, 100),
    diretoria: limitar(60 + Math.round(opcao.afinidade * 0.15), 0, 100), clubeInicialEscolhido: true } };
}
export const CLUBES_CONVITES_TECNICO = [
  { nome: 'Clube do Interior', pais: 'Brasil', exigencia: 30, elenco: 42, salario: 8, rival: 'Tradicional Nacional' },
  { nome: 'Projeto Emergente', pais: 'Brasil', exigencia: 40, elenco: 52, salario: 14 },
  { nome: 'Tradicional Nacional', pais: 'Brasil', exigencia: 56, elenco: 64, salario: 28, rival: 'Clube do Interior' },
  { nome: 'Potência Continental', pais: 'Argentina', exigencia: 70, elenco: 78, salario: 55 },
  { nome: 'Gigante Mundial', pais: 'Espanha', exigencia: 88, elenco: 90, salario: 110 },
  { nome: 'Projeto Português', pais: 'Portugal', exigencia: 52, elenco: 58, salario: 23 },
  { nome: 'Clube Italiano', pais: 'Itália', exigencia: 75, elenco: 77, salario: 65 },
  { nome: 'Equipe Inglesa', pais: 'Inglaterra', exigencia: 82, elenco: 84, salario: 90 },
  { nome: 'Projeto Japonês', pais: 'Japão', exigencia: 45, elenco: 53, salario: 25 },
  { nome: 'Clube Mexicano', pais: 'México', exigencia: 48, elenco: 57, salario: 27 },
  { nome: 'Equipe Alemã', pais: 'Alemanha', exigencia: 73, elenco: 79, salario: 70 }
];
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
  const elegiveis = CLUBES_CONVITES_TECNICO.filter(x => x.nome !== t.clube && ovr >= x.exigencia)
    .map(x => {
      const mesmoPais = !!clubeAtual && x.pais === clubeAtual.pais;
      const retorno = clubesPassados.has(x.nome);
      const vinculo = vinculosJogador.get(x.nome);
      const bonusIdolo = vinculo?.idolatria ? 0.32 : (vinculo?.temporadas || 0) >= 3 ? 0.17 : 0;
      const rival = x.nome === clubeAtual?.rival || clubeAtual?.nome === x.rival;
      const chance = limitar(0.38 + (ovr - x.exigencia) / 160 + (mesmoPais ? 0.15 : -0.06)
        + (retorno ? 0.12 : 0) + bonusIdolo - (rival ? 0.30 : 0) + ((t.temporadas || []).length >= 4 ? 0.08 : 0), 0.06, 0.90);
      return { ...x, chance, rival, retorno, objetivo: objetivoTecnico({ ...t, elenco: x.elenco }).nome };
    });
  // Sorteio por clube: mesmo um treinador consagrado pode terminar sem convites.
  const selecionados = elegiveis.filter(x => rng() < x.chance);
  for (let i = selecionados.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [selecionados[i], selecionados[j]] = [selecionados[j], selecionados[i]];
  }
  return selecionados.slice(0, 3);
}
export function aceitarPropostaTecnico(c, clube) {
  const t = c.tecnico;
  if (!t || (t.fase !== 'resultado' && !t.desempregado)) throw new Error('Propostas só podem ser aceitas entre temporadas.');
  const proposta = (t.propostas || []).find(x => x.nome === clube);
  if (!proposta) throw new Error('Proposta indisponível.');
  return { ...c, tecnico: { ...t, clube: proposta.nome, pais: proposta.pais, elenco: proposta.elenco,
    moral: 50, diretoria: proposta.rival ? 48 : 65, torcida: proposta.rival ? 35 : 55,
    demitido: false, desempregado: false, propostas: [], salario: proposta.salario } };
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
  const reputacao = limitar(Math.round(25 + legado / 22), 25, 85);
  const vinculosJogador = vinculosComoJogador(c);
  const opcoesInicio = opcoesInicioTecnico(c);
  const clubeInicial = opcoesInicio[0]?.clube || c.clubeNome || 'Clube inicial';
  const afinidadeInicial = opcoesInicio[0]?.afinidade || 0;
  return { ...c, tecnico: {
    idadeInicio: c.idade, ano: c.ano, clube: clubeInicial, vinculosJogador, opcoesInicio, clubeInicialEscolhido: false,
    reputacao, pais: 'Brasil', salario: 12, desempregado: false, anosDesempregado: 0, estilo: 'equilibrado', temporadas: [], vitorias: 0, empates: 0,
    derrotas: 0, titulos: 0, elenco: 50, moral: 50, diretoria: limitar(60 + Math.round(afinidadeInicial * 0.15), 0, 100), torcida: limitar(55 + Math.round(afinidadeInicial * 0.35), 0, 100), decisoes: [], demitido: false, propostas: [], historicoCartas: [], cartas: sortearCartasTecnico({ reputacao, temporadas: [], diretoria: 60, moral: 50 }), fase: 'pretemporada'
  }};
}
export function definirEstiloTecnico(c, estilo) {
  if (!ESTILOS_TECNICO.some(x => x.id === estilo)) throw new Error('Estilo inválido.');
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  return { ...c, tecnico: { ...c.tecnico, estilo } };
}
export function simularTemporadaTecnico(c, rng = sorteio) {
  if (!c?.tecnico) throw new Error('Carreira técnica não iniciada.');
  if (c.tecnico.fase !== 'pretemporada') throw new Error('Conclua a temporada anterior antes de simular.');
  const t = c.tecnico;
  if ((t.decisoes?.length || 0) < QUANTIDADE_DECISOES_TECNICO) throw new Error('Tome as decisões da temporada antes de simular.');
  const bonus = t.estilo === 'equilibrado' ? 0.04 : 0;
  const pVitoria = limitar(0.20 + t.reputacao / 600 + (t.elenco - 50) / 500 + (t.moral - 50) / 700 + bonus, 0.20, 0.67);
  const pEmpate = t.estilo === 'defensivo' ? 0.29 : t.estilo === 'ofensivo' ? 0.17 : 0.23;
  let vitorias = 0, empates = 0, derrotas = 0;
  for (let i = 0; i < 38; i++) {
    const r = rng();
    if (r < pVitoria) vitorias++;
    else if (r < pVitoria + pEmpate) empates++;
    else derrotas++;
  }
  const pontos = vitorias * 3 + empates;
  const posicao = pontos >= 84 ? 1 : pontos >= 73 ? 2 : pontos >= 65 ? 4 : pontos >= 57 ? 7 : pontos >= 48 ? 11 : pontos >= 40 ? 15 : 18;
  const campeao = posicao === 1;
  const objetivo = objetivoTecnico(t);
  const cumpriuObjetivo = posicao <= objetivo.posicao;
  const temporada = { ano: t.ano, clube: t.clube, objetivo: objetivo.nome, cumpriuObjetivo, estilo: t.estilo, decisoes: t.decisoes, vitorias, empates, derrotas, pontos, posicao, campeao };
  const novaConfianca = limitar(t.diretoria + (cumpriuObjetivo ? 8 : -14) + (posicao <= 4 ? 5 : posicao >= 15 ? -8 : 0), 0, 100);
  const variacaoTorcida = campeao ? 18 : posicao <= 4 ? 10 : cumpriuObjetivo ? 5 : posicao >= 17 ? -23 : -12;
  const novaTorcida = limitar((t.torcida ?? 55) + variacaoTorcida, 0, 100);
  const situacaoCargo = riscoDemissaoTecnico({ ...t, diretoria: novaConfianca, torcida: novaTorcida });
  const demitido = novaConfianca < 20 || (novaConfianca < 40 && novaTorcida < 35) || situacaoCargo.pressao >= 82;
  const propostas = gerarPropostasTecnico({ ...t, clube: demitido ? null : t.clube, reputacao: limitar(t.reputacao + (campeao ? 9 : cumpriuObjetivo ? 4 : -3), 10, 99) }, rng);
  return { ...c, idade: c.idade + 1, ano: c.ano + 1, tecnico: {
    ...t, ano: t.ano + 1, fase: 'resultado', temporadas: [...t.temporadas, temporada],
    vitorias: t.vitorias + vitorias, empates: t.empates + empates, derrotas: t.derrotas + derrotas,
    titulos: t.titulos + (campeao ? 1 : 0), demitido, propostas, objetivoAtual: objetivo.nome,
    reputacao: limitar(t.reputacao + (campeao ? 9 : posicao <= 4 ? 5 : posicao >= 15 ? -5 : 1), 10, 99),
    diretoria: novaConfianca, torcida: novaTorcida
  }};
}
export function proximaTemporadaTecnico(c) {
  if (!c?.tecnico || c.tecnico.fase !== 'resultado') throw new Error('Nenhum resultado pendente.');
  const t = c.tecnico;
  if (t.demitido || t.desempregado) throw new Error('Aceite uma proposta antes de começar a próxima temporada.');
  const historicoCartas = [...(t.historicoCartas || []), ...(t.cartas || [])].slice(-32);
  const vencidos = (t.efeitosPendentes || []).filter(e => e.aplicarEm <= t.ano);
  const pendentes = (t.efeitosPendentes || []).filter(e => e.aplicarEm > t.ano);
  const soma = (atributo) => vencidos.reduce((acc, e) => acc + (e.heranca?.[atributo] || 0), 0);
  const proximo = { ...t, historicoCartas, decisoes: [], fase: 'pretemporada',
    efeitosPendentes: pendentes, efeitosRecebidos: vencidos,
    elenco: limitar(t.elenco + soma('elenco'), 10, 95),
    moral: limitar(t.moral + 2 + soma('moral'), 10, 95),
    diretoria: limitar(t.diretoria + soma('diretoria'), 0, 100),
    torcida: limitar((t.torcida ?? 55) + Math.round(soma('torcida') * 0.5), 0, 100) };
  return { ...c, tecnico: { ...proximo, cartas: sortearCartasTecnico(proximo) } };
}
