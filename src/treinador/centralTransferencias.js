import {CLUBES} from '../dados/data.js';

const normalizar=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');
/** Ligas de origem/destino conforme o mundo atual (acessos e rebaixamentos). */
export const ligaDoClube=(nome,ligasMundo)=>ligasMundo?.[nome]||CLUBES.find(c=>c.nome===nome)?.liga||null;

/** Lista filtrável da central; função pura para os testes. */
export function filtrarCentral(lista,{temporada='todas',liga='todas',tipo='todos',busca='',clube=null,ligasMundo}={}){
 const termo=normalizar(busca);
 return lista.filter(t=>{
  if(temporada!=='todas'&&String(t.ano??t.temporada)!==String(temporada))return false;
  if(tipo!=='todos'&&(tipo==='emprestimo'?!['emprestimo','retornoEmprestimo'].includes(t.tipo):t.tipo!==tipo))return false;
  if(liga!=='todas'&&ligaDoClube(t.de,ligasMundo)!==liga&&ligaDoClube(t.para,ligasMundo)!==liga)return false;
  if(clube&&t.de!==clube&&t.para!==clube)return false;
  if(termo&&![t.nome,t.de,t.para].some(v=>normalizar(v).includes(termo)))return false;
  return true;
 }).sort((a,b)=>(b.temporada??0)-(a.temporada??0)||(b.valor??-1)-(a.valor??-1));
}

