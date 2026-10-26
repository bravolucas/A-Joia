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
  return { ...c, tecnico: {
    ...t, elenco: limitar((t.elenco ?? 50) + (op.elenco || 0), 10, 95),
    moral: limitar((t.moral ?? 50) + (op.moral || 0) + (riscoAtivado ? op.riscoMoral || 0 : 0), 10, 95),
    diretoria: limitar((t.diretoria ?? 60) + (op.diretoria || 0) + (riscoAtivado ? op.riscoDiretoria || 0 : 0), 0, 100),
    decisoes: [...(t.decisoes || []), { carta: carta.id, opcao: op.id, nome: op.nome, resultado, riscoAtivado }]
  }};
}
export function iniciarCarreiraTecnico(c) {
  if (!c?.aposentado) throw new Error('O jogador precisa se aposentar primeiro.');
  if (c.tecnico) return c;
  const legado = c.legado?.pontos || 0;
  const reputacao = limitar(Math.round(25 + legado / 22), 25, 85);
  return { ...c, tecnico: {
    idadeInicio: c.idade, ano: c.ano, clube: c.clubeNome || 'Clube inicial',
    reputacao, estilo: 'equilibrado', temporadas: [], vitorias: 0, empates: 0,
    derrotas: 0, titulos: 0, elenco: 50, moral: 50, diretoria: 60, decisoes: [], historicoCartas: [], cartas: sortearCartasTecnico({ reputacao, temporadas: [], diretoria: 60, moral: 50 }), fase: 'pretemporada'
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
  const temporada = { ano: t.ano, clube: t.clube, estilo: t.estilo, decisoes: t.decisoes, vitorias, empates, derrotas, pontos, posicao, campeao };
  return { ...c, idade: c.idade + 1, ano: c.ano + 1, tecnico: {
    ...t, ano: t.ano + 1, fase: 'resultado', temporadas: [...t.temporadas, temporada],
    vitorias: t.vitorias + vitorias, empates: t.empates + empates, derrotas: t.derrotas + derrotas,
    titulos: t.titulos + (campeao ? 1 : 0),
    reputacao: limitar(t.reputacao + (campeao ? 9 : posicao <= 4 ? 5 : posicao >= 15 ? -5 : 1), 10, 99),
    diretoria: limitar(t.diretoria + (posicao <= 4 ? 7 : posicao >= 15 ? -12 : 1), 0, 100)
  }};
}
export function proximaTemporadaTecnico(c) {
  if (!c?.tecnico || c.tecnico.fase !== 'resultado') throw new Error('Nenhum resultado pendente.');
  const t = c.tecnico;
  const historicoCartas = [...(t.historicoCartas || []), ...(t.cartas || [])].slice(-32);
  const proximo = { ...t, historicoCartas, decisoes: [], fase: 'pretemporada', moral: limitar(t.moral + 2, 10, 95) };
  return { ...c, tecnico: { ...proximo, cartas: sortearCartasTecnico(proximo) } };
}
