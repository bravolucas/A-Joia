/**
 * Chave fixa da Copa do Mundo FIFA 2026.
 * Ordem dos 16 jogos definida pelo regulamento (M73–M88).
 * Os oito terceiros são alocados aos únicos slots elegíveis; a escolha
 * determinística preserva a chave. A tabela específica do Anexo C (495
 * combinações) permanece como referência para futura correspondência exata.
 */
export const CONFRONTOS_FIFA_2026 = Object.freeze([
 ['1E','3ABCDF'], ['1I','3CDFGH'], ['2A','2B'], ['1F','2C'],
 ['2K','2L'], ['1H','2J'], ['1D','3BEFIJ'], ['1G','3AEHIJ'],
 ['1C','2F'], ['2E','2I'], ['1A','3CEFHI'], ['1L','3EHIJK'],
 ['1J','2H'], ['2D','2G'], ['1B','3EFGIJ'], ['1K','3DEIJL']
]);
const letra=x=>String(x||'').replace(/^Grupo\s*/i,'').trim().toUpperCase().slice(-1);
function distribuirTerceiros(slots,grupos){
 const usados=new Set();
 const buscar=(i)=>{
  if(i===slots.length)return [];
  const slot=slots[i],elegiveis=grupos.filter(g=>slot.permitidos.includes(g)&&!usados.has(g));
  for(const g of elegiveis){
   usados.add(g);const restante=buscar(i+1);
   if(restante)return [g,...restante];
   usados.delete(g);
  }
  return null;
 };
 return buscar(0);
}
export function montarChaveFifa48(grupos,melhoresTerceiros){
 if(grupos?.length!==12||melhoresTerceiros?.length!==8)throw new Error('Mundial FIFA: esperados 12 grupos e 8 terceiros.');
 const porGrupo=new Map(grupos.map(g=>[letra(g.grupo),g.classificacao]));
 if(porGrupo.size!==12||[...porGrupo.values()].some(c=>c?.length!==4))throw new Error('Mundial FIFA: classificação de grupos incompleta.');
 const grupoDoTerceiro=new Map();
 for(const [letraGrupo,lista] of porGrupo)grupoDoTerceiro.set(lista[2].nome,letraGrupo);
 const terceiros=melhoresTerceiros.map(t=>typeof t==='string'?t:t.nome);
 const gruposTerceiros=terceiros.map(n=>grupoDoTerceiro.get(n)).filter(Boolean);
 if(gruposTerceiros.length!==8||new Set(gruposTerceiros).size!==8)throw new Error('Mundial FIFA: terceiros inconsistentes.');
 const slots=CONFRONTOS_FIFA_2026.map(([a,b],i)=>b.startsWith('3')?{i,permitidos:b.slice(1)}:null).filter(Boolean);
 const distribuicao=distribuirTerceiros(slots,[...gruposTerceiros].sort());
 if(!distribuicao)throw new Error('Mundial FIFA: combinação sem cruzamentos válidos.');
 const mapaTerceiros=new Map(slots.map((s,i)=>[s.i,distribuicao[i]]));
 const participante=(codigo,indice)=>{
  const pos=Number(codigo[0]),grupo=pos===3?mapaTerceiros.get(indice):codigo.slice(1);
  const registro=porGrupo.get(grupo)?.[pos-1];
  if(!registro)throw new Error('Mundial FIFA: slot sem seleção classificada.');
  return registro.nome;
 };
 const pares=CONFRONTOS_FIFA_2026.map(([a,b],i)=>[participante(a,i),participante(b,i)]);
 if(new Set(pares.flat()).size!==32)throw new Error('Mundial FIFA: chave duplicada.');
 return pares;
}
