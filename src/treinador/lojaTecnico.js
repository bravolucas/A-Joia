import {carreiraTecnicoEncerrada} from './longevidadeTecnico.js';
/**
 * Loja do treinador: investimentos pagos do salário (saldo pessoal), nunca do clube.
 * Preço em meses de salário, com piso. Efeitos moderados: bônus de força valem só
 * na temporada e no clube da compra; formação soma até +5 OVR na carreira.
 */
export const CATEGORIAS_LOJA_TECNICO = [
  { id: 'formacao', nome: 'Formação', descricao: 'Cursos e mentoria que ficam com você para sempre.' },
  { id: 'preparacao', nome: 'Preparação da temporada', descricao: 'Ferramentas para o elenco render mais nesta temporada.' },
  { id: 'relacoes', nome: 'Relações no clube', descricao: 'Ambiente, diretoria, torcida e imprensa.' },
];
export const ITENS_LOJA_TECNICO = [
  { id: 'licenca', categoria: 'formacao', nome: 'Curso de treinador', descricao: 'OVR do técnico +1 permanente. Um curso por temporada; formação soma até +5 por carreira.', meses: 6, minimo: 30, ovr: 1 },
  { id: 'mentoria', categoria: 'formacao', nome: 'Mentoria com um técnico veterano', descricao: 'OVR do técnico +1 permanente, além dos cursos. Uma única vez na carreira.', meses: 9, minimo: 45, ovr: 1, unicaNaCarreira: true },
  { id: 'preparacao', categoria: 'preparacao', nome: 'Preparação especial', descricao: 'Força do time +3 apenas nesta temporada, até o limite 99.', meses: 3, minimo: 15, forca: 3 },
  { id: 'analise', categoria: 'preparacao', nome: 'Análise dos adversários', descricao: 'Força do time +2 apenas nesta temporada, até o limite 99.', meses: 2, minimo: 10, forca: 2 },
  { id: 'vestiario', categoria: 'relacoes', nome: 'Confraternização do elenco', descricao: 'Moral do grupo +8 para começar a temporada unido.', meses: 0.5, minimo: 3, moral: 8 },
  { id: 'diretoria', categoria: 'relacoes', nome: 'Planejamento com a diretoria', descricao: 'Confiança da diretoria +6.', meses: 1, minimo: 5, diretoria: 6 },
  { id: 'torcida', categoria: 'relacoes', nome: 'Ação com a torcida', descricao: 'Apoio da torcida +6 com um evento aberto no centro de treinamento.', meses: 1, minimo: 5, torcida: 6 },
  { id: 'imprensa', categoria: 'relacoes', nome: 'Assessoria de imprensa', descricao: 'Reputação +2 com uma temporada de boa comunicação.', meses: 1.5, minimo: 8, reputacao: 2 },
];
/** Preço em € mil: meses de salário do contrato atual, com piso. */
export const precoItemLojaTecnico = (item, salario) => Math.max(item.minimo ?? 0, Math.round((item.meses ?? 0) * (Number(salario) || 0)));
export const carteiraTecnico = t => t.carteiraTecnico || { saldo: 0, pagamentos: [], compras: [] };
export function creditarSalarioTecnico(t, ano, mensal, meses = 12) {
  const carteira = carteiraTecnico(t), chave = `${ano}|${t.clube}`;
  if (!t.clube || carteira.pagamentos.some(p => p.chave === chave)) return carteira;
  const valor = Math.max(0, Math.round(mensal * meses));
  return { ...carteira, saldo: carteira.saldo + valor, pagamentos: [...carteira.pagamentos, { chave, ano, clube: t.clube, valor, meses }] };
}
export function bonusForcaLoja(t) {
  return carteiraTecnico(t).compras.filter(x => x.ano === t.ano && x.clube === t.clube).reduce((n,x) => n + (x.forca || 0), 0);
}
export function comprarItemLojaTecnico(c, id, ovrAtual, forcaAtual, salario) {
  const t = c?.tecnico, item = ITENS_LOJA_TECNICO.find(x => x.id === id);
  if (!t || !item || t.fase !== 'pretemporada' || t.desempregado || t.demitido || !t.clube || carreiraTecnicoEncerrada(t) || (!t.clubeInicialEscolhido&&t.opcoesInicio?.length) || t.andamento?.rodadas || t.andamento?.jogos) throw new Error('Compre antes de iniciar a temporada.');
  const carteira = carteiraTecnico(t), preco = precoItemLojaTecnico(item, salario ?? t.salario);
  if (carteira.compras.some(x => x.id === id && x.ano === t.ano)) return c;
  if (item.unicaNaCarreira && carteira.compras.some(x => x.id === id)) throw new Error('Esta melhoria só pode ser feita uma vez na carreira.');
  if (item.forca && forcaAtual>=99) throw new Error('Força máxima atingida.');
  if (item.ovr && (!Number.isFinite(ovrAtual)||ovrAtual>=99)) throw new Error('OVR máximo atingido.');
  if (item.ovr && (t.formacaoLoja || 0) >= 5) throw new Error('Limite de +5 OVR em cursos atingido.');
  if (carteira.saldo < preco) throw new Error('Saldo pessoal insuficiente.');
  const ajuste = (campo, min, max) => item[campo] ? { [campo]: Math.max(min, Math.min(max, (t[campo] ?? 50) + item[campo])) } : {};
  return { ...c, tecnico: { ...t, ...ajuste('moral', 0, 100), ...ajuste('diretoria', 0, 100), ...ajuste('torcida', 0, 100), ...ajuste('reputacao', 10, 99),
    formacaoLoja: (t.formacaoLoja || 0) + (item.ovr || 0), carteiraTecnico: { ...carteira, saldo: carteira.saldo - preco, compras: [...carteira.compras, { id, ano: t.ano, clube: t.clube, forca: item.forca || 0, preco }] } } };
}
