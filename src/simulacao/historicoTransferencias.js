/**
 * Linha do tempo de transferências. Valores gravados no mercado são em R$ mil.
 * Nunca estimamos uma taxa a partir do valor de mercado do jogador.
 */
const ANOTACOES = new Set(['transferencia','compra','venda','emprestimo','fim-contrato','dispensa','rescisao']);
const nomeClube = nome => typeof nome === 'string' && nome.trim() ? nome.trim() : null;
const numeroAno = ano => Number.isInteger(Number(ano)) && Number(ano) > 1900 ? Number(ano) : null;
const valorRegistrado = valor => valor !== null && valor !== undefined && valor !== '' && Number.isFinite(Number(valor)) && Number(valor) >= 0 ? Number(valor) : null;

export function normalizarTransferencia(m) {
 if (!m || typeof m !== 'object' || !ANOTACOES.has(m.tipo)) return null;
 return {
  ano:numeroAno(m.ano),tipo:m.tipo,
  de:nomeClube(m.de ?? m.origemClube ?? m.clubeOrigem),
  para:nomeClube(m.para ?? m.destino ?? m.clubeDestino),
  valor:valorRegistrado(m.valor),fonte:'movimento'
 };
}

/** Mudança entre temporadas: histórico de clubes é comprovado, taxa e modalidade não. */
export function historicoTransferenciasAtleta(atleta = {}, temporadas = []) {
 const salvas=(Array.isArray(atleta.movimentos)?atleta.movimentos:[]).map(normalizarTransferencia).filter(Boolean);
 const ordenadas=[...temporadas].filter(t=>t&&nomeClube(t.clube)&&numeroAno(t.ano))
  .sort((a,b)=>Number(a.ano)-Number(b.ano));
 for(let i=1;i<ordenadas.length;i++){
  const anterior=ordenadas[i-1],atual=ordenadas[i];
  if(anterior.clube===atual.clube)continue;
  const ano=numeroAno(atual.ano),de=nomeClube(anterior.clube),para=nomeClube(atual.clube);
  if(salvas.some(m=>m.ano===ano&&m.de===de&&m.para===para))continue;
  salvas.push({ano,tipo:'mudanca-clube',de,para,valor:null,fonte:'temporadas'});
 }
 const vistos=new Set();
 return salvas.filter(m=>{
   const chave=[m.ano,m.de,m.para,m.tipo].join('|');
   if(vistos.has(chave))return false;vistos.add(chave);return true;
 }).sort((a,b)=>(b.ano??0)-(a.ano??0)||a.tipo.localeCompare(b.tipo,'pt-BR'));
}
export const tipoTransferencia = tipo => ({
 transferencia:'Transferência',compra:'Transferência',venda:'Transferência',
 emprestimo:'Empréstimo','fim-contrato':'Fim de contrato',dispensa:'Dispensa',
 rescisao:'Rescisão','mudanca-clube':'Mudança de clube'
})[tipo] || 'Movimentação';
export const valorTransferencia = valor => valor===null||valor===undefined
 ? 'Não informado' : valor===0 ? 'Sem custos' : `R$ ${Math.round(valor).toLocaleString('pt-BR')} mil`;
