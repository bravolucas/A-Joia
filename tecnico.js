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
  ] }
];
export function tomarDecisaoTecnico(c, opcaoId) {
  if (!c?.tecnico || c.tecnico.fase !== 'pretemporada') throw new Error('Decisão indisponível.');
  const t = c.tecnico;
  const indice = t.decisoes?.length || 0;
  const carta = DECISOES_TECNICO[indice];
  if (!carta) throw new Error('Todas as decisões já foram tomadas.');
  const op = carta.opcoes.find(x => x.id === opcaoId);
  if (!op) throw new Error('Opção inválida.');
  return { ...c, tecnico: {
    ...t, elenco: limitar((t.elenco ?? 50) + (op.elenco || 0), 10, 95),
    moral: limitar((t.moral ?? 50) + (op.moral || 0), 10, 95),
    diretoria: limitar((t.diretoria ?? 60) + (op.diretoria || 0), 0, 100),
    decisoes: [...(t.decisoes || []), { carta: carta.id, opcao: op.id, nome: op.nome }]
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
    derrotas: 0, titulos: 0, elenco: 50, moral: 50, diretoria: 60, decisoes: [], fase: 'pretemporada'
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
  if ((t.decisoes?.length || 0) < DECISOES_TECNICO.length) throw new Error('Tome as decisões da temporada antes de simular.');
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
  return { ...c, tecnico: { ...c.tecnico, fase: 'pretemporada', decisoes: [], moral: limitar(c.tecnico.moral + 2, 10, 95) } };
}
