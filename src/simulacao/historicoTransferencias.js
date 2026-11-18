/**
 * Linha do tempo de transferências. Valores preservados em milhares da moeda de cada modo.
 * Nunca estimamos uma taxa a partir do valor de mercado do jogador.
 */
const ANOTACOES = new Set(['transferencia','compra','venda','contratacao','emprestimo','retornoEmprestimo','livre','fim-contrato','dispensa','rescisao']);
const nomeClube = nome => typeof nome === 'string' && nome.trim() ? nome.trim() : null;
const numeroAno = ano => Number.isInteger(Number(ano)) && Number(ano) > 1900 ? Number(ano) : null;
const valorRegistrado = valor => valor !== null && valor !== undefined && valor !== '' && Number.isFinite(Number(valor)) && Number(valor) >= 0 ? Number(valor) : null;

export function normalizarTransferencia(m, moedaPadrao = 'BRL') {
 if (!m || typeof m !== 'object' || !ANOTACOES.has(m.tipo)) return null;
 return {
  ano:numeroAno(m.ano),tipo:m.tipo,
  de:nomeClube(m.de ?? m.origemClube ?? m.clubeOrigem),
  para:nomeClube(m.para ?? m.destino ?? m.clubeDestino),
  valor:valorRegistrado(m.valor),moeda:m.moeda==='EUR'||m.moeda==='BRL'?m.moeda:moedaPadrao,fonte:'movimento'
 };
}

/** Mudança entre temporadas: histórico de clubes é comprovado, taxa e modalidade não. */
export function historicoTransferenciasAtleta(atleta = {}, temporadas = []) {
 const moedaPadrao=atleta.voce?'EUR':'BRL';
 const salvas=(Array.isArray(atleta.movimentos)?atleta.movimentos:[]).map(m=>normalizarTransferencia(m,moedaPadrao)).filter(Boolean);
 const registradas=Array.isArray(atleta.historicoTemporadas)?atleta.historicoTemporadas.filter(Array.isArray).map(r=>({ano:r[1],clube:r[2]})):[];
 const ordenadas=[...registradas,...temporadas].filter(t=>t&&nomeClube(t.clube)&&numeroAno(t.ano))
  .sort((a,b)=>Number(a.ano)-Number(b.ano));
 for(let i=1;i<ordenadas.length;i++){
  const anterior=ordenadas[i-1],atual=ordenadas[i];
  if(anterior.clube===atual.clube)continue;
  const ano=numeroAno(atual.ano),de=nomeClube(anterior.clube),para=nomeClube(atual.clube);
  if(salvas.some(m=>m.ano===ano&&m.de===de&&m.para===para))continue;
  salvas.push({ano,tipo:'mudanca-clube',de,para,valor:null,moeda:moedaPadrao,fonte:'temporadas'});
 }
 const vistos=new Set();
 return salvas.filter(m=>{
   const chave=[m.ano,m.de,m.para,m.tipo].join('|');
   if(vistos.has(chave))return false;vistos.add(chave);return true;
 }).sort((a,b)=>(b.ano??0)-(a.ano??0)||a.tipo.localeCompare(b.tipo,'pt-BR'));
}
export const tipoTransferencia = tipo => ({
 transferencia:'Transferência',compra:'Transferência',venda:'Transferência',
 contratacao:'Transferência',emprestimo:'Empréstimo',retornoEmprestimo:'Retorno de empréstimo',livre:'Chegada sem custos','fim-contrato':'Fim de contrato',dispensa:'Dispensa',
 rescisao:'Rescisão','mudanca-clube':'Mudança de clube'
})[tipo] || 'Movimentação';
export function valorTransferencia(valor,moeda='BRL') {
 if(valor===null||valor===undefined||!Number.isFinite(Number(valor)))return 'Não informado';
 const n=Number(valor),simbolo=moeda==='EUR'?'€':'R'+String.fromCharCode(36);
 if(n===0)return 'Sem custos';
 if(n>=1000)return simbolo+' '+(n/1000).toLocaleString('pt-BR',{maximumFractionDigits:1})+' mi';
 if(n>=1)return simbolo+' '+Math.round(n).toLocaleString('pt-BR')+' mil';
 return simbolo+' '+Math.round(n*1000).toLocaleString('pt-BR');
}
