/* Navegação interna do Arquivo Vivo: identidade pelo ID, nunca pelo nome. */
export const EVENTO_ENTIDADE = 'ajoia:navegar-entidade';
const TIPOS = new Set(['jogador','clube','competicao','premio','treinador','confrontos']);
export function normalizarEntidade(valor) {
  if (!valor || !TIPOS.has(valor.tipo)) return null;
  const nome = String(valor.nome ?? '').trim();
  const id = valor.id == null ? '' : String(valor.id).trim();
  if (!nome && !id && valor.tipo !== 'confrontos') return null;
  if (valor.tipo === 'jogador' && !id) return null; // IDs distinguem homônimos.
  return {tipo:valor.tipo,nome,id};
}
export function paginaEntidade(valor, contexto={}) {
  const destino = normalizarEntidade(valor);
  if (!destino) return null;
  const base={aba:'clubes',clube:contexto.clube||'',competicao:contexto.competicao||'Champions League',jogadorId:'',premio:'',nome:''};
  switch(destino.tipo){
    case 'jogador':return {...base,aba:'atletas',jogadorId:destino.id,nome:destino.nome};
    case 'clube':return {...base,aba:'clubes',clube:destino.nome};
    case 'competicao':return {...base,aba:'competicoes',competicao:destino.nome};
    case 'premio':return {...base,aba:'premios',premio:destino.nome};
    case 'treinador':return {...base,aba:'treinadores',nome:destino.nome,jogadorId:destino.id};
    case 'confrontos':return {...base,aba:'confrontos',jogadorId:destino.id};
    default:return null;
  }
}
export function empilharPagina(pilha,pagina) {
  if(!pagina)return pilha;
  const atual=pilha.at(-1);
  if(atual&&JSON.stringify(atual)===JSON.stringify(pagina))return pilha;
  return [...pilha.slice(-39),pagina];
}
export function abrirEntidade(valor) {
  const destino=normalizarEntidade(valor);
  if(!destino||typeof window==='undefined')return false;
  window.dispatchEvent(new CustomEvent(EVENTO_ENTIDADE,{detail:destino}));
  return true;
}
