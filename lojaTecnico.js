export const ITENS_LOJA_TECNICO = [
  { id: 'preparacao', nome: 'Preparação especial', descricao: 'Força do time +3 apenas nesta temporada, até o limite 99.', preco: 300, forca: 3 },
  { id: 'analise', nome: 'Análise dos adversários', descricao: 'Força do time +2 apenas nesta temporada, até o limite 99.', preco: 200, forca: 2 },
  { id: 'licenca', nome: 'Curso de treinador', descricao: 'OVR do técnico +1 permanente. Até +5 por carreira.', preco: 600, ovr: 1 }
];
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
export function comprarItemLojaTecnico(c, id, ovrAtual, forcaAtual) {
  const t = c?.tecnico, item = ITENS_LOJA_TECNICO.find(x => x.id === id);
  if (!t || !item || t.fase !== 'pretemporada' || t.desempregado || t.demitido || !t.clube || (t.temporadas||[]).length>=30 || (!t.clubeInicialEscolhido&&t.opcoesInicio?.length) || t.andamento?.rodadas || t.andamento?.jogos) throw new Error('Compre antes de iniciar a temporada.');
  const carteira = carteiraTecnico(t);
  if (carteira.compras.some(x => x.id === id && x.ano === t.ano)) return c;
  if (item.forca && forcaAtual>=99) throw new Error('Força máxima atingida.');
  if (item.ovr && (!Number.isFinite(ovrAtual)||ovrAtual>=99)) throw new Error('OVR máximo atingido.');
  if (item.ovr && (t.formacaoLoja || 0) >= 5) throw new Error('Limite de +5 OVR em cursos atingido.');
  if (carteira.saldo < item.preco) throw new Error('Saldo pessoal insuficiente.');
  return { ...c, tecnico: { ...t, formacaoLoja: (t.formacaoLoja || 0) + (item.ovr || 0), carteiraTecnico: { ...carteira, saldo: carteira.saldo - item.preco, compras: [...carteira.compras, { id, ano: t.ano, clube: t.clube, forca: item.forca || 0, preco: item.preco }] } } };
}
