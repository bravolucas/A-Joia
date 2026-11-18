import {alocacaoOficialTerceirosFifa26} from './annexoCFifa2026.js';
/**
 * Chave fixa da Copa do Mundo FIFA 2026.
 * Ordem dos 16 jogos definida pelo regulamento (M73–M88).
 * Os oito terceiros são alocados pela tabela oficial do Anexo C: todas as
 * 495 combinações têm confrontos predefinidos, sem novo sorteio.
 */
export const CONFRONTOS_FIFA_2026 = Object.freeze([
 ['1E','3ABCDF'], ['1I','3CDFGH'], ['2A','2B'], ['1F','2C'],
 ['2K','2L'], ['1H','2J'], ['1D','3BEFIJ'], ['1G','3AEHIJ'],
 ['1C','2F'], ['2E','2I'], ['1A','3CEFHI'], ['1L','3EHIJK'],
 ['1J','2H'], ['2D','2G'], ['1B','3EFGIJ'], ['1K','3DEIJL']
]);
const letra=x=>String(x||'').replace(/^Grupo\s*/i,'').trim().toUpperCase().slice(-1);
export function montarChaveFifa48(grupos,melhoresTerceiros){
 if(grupos?.length!==12||melhoresTerceiros?.length!==8)throw new Error('Mundial FIFA: esperados 12 grupos e 8 terceiros.');
 const porGrupo=new Map(grupos.map(g=>[letra(g.grupo),g.classificacao]));
 if(porGrupo.size!==12||[...porGrupo.values()].some(c=>c?.length!==4))throw new Error('Mundial FIFA: classificação de grupos incompleta.');
 const grupoDoTerceiro=new Map();
 for(const [letraGrupo,lista] of porGrupo)grupoDoTerceiro.set(lista[2].nome,letraGrupo);
 const terceiros=melhoresTerceiros.map(t=>typeof t==='string'?t:t.nome);
 const gruposTerceiros=terceiros.map(n=>grupoDoTerceiro.get(n)).filter(Boolean);
 if(gruposTerceiros.length!==8||new Set(gruposTerceiros).size!==8)throw new Error('Mundial FIFA: terceiros inconsistentes.');
 const alocacao=alocacaoOficialTerceirosFifa26(gruposTerceiros);
 const participante=(codigo,indice)=>{
  const pos=Number(codigo[0]);
  const slot=CONFRONTOS_FIFA_2026[indice],vencedorGrupo=slot[0].slice(1);
  const grupo=pos===3?alocacao[vencedorGrupo]:codigo.slice(1);
  if(pos===3&&!slot[1].slice(1).includes(grupo))throw new Error('Mundial FIFA: alocação não permitida no regulamento.');
  const registro=porGrupo.get(grupo)?.[pos-1];
  if(!registro)throw new Error('Mundial FIFA: slot sem seleção classificada.');
  return registro.nome;
 };
 const pares=CONFRONTOS_FIFA_2026.map(([a,b],i)=>[participante(a,i),participante(b,i)]);
 if(new Set(pares.flat()).size!==32)throw new Error('Mundial FIFA: chave duplicada.');
 return pares;
}
