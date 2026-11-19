import {grupoSelecao} from './elencoSelecao.js';

/**
 * Monta somente o roteiro da transmissão. A escolha e o resultado da Copa
 * já foram resolvidos e persistidos por jogarCopa; não há RNG aqui.
 */
export function roteiroConvocacao(elenco,jogador,convocado){
 const protagonistas=(elenco?.jogadores||[]).filter(p=>p&&typeof p.nome==='string'&&p.nome.trim()&&p.nome!==jogador?.nome);
 const grupo=grupoSelecao(jogador?.posicao||'ATA');
 const usados=new Set();
 const selecionar=(predicado)=>{
  const p=protagonistas.find(c=>!usados.has(c.id??c.nome)&&predicado(c));
  if(p)usados.add(p.id??p.nome);
  return p||null;
 };
 const iniciais=['GOL','DEF','MEI','ATA'].map(f=>selecionar(p=>grupoSelecao(p.posicao)===f)||selecionar(()=>true)).filter(Boolean);
 const ultimo=convocado
 ?{id:'usuario',nome:jogador?.nome||'Você',posicao:jogador?.posicao||'ATA',voce:true}
 :selecionar(p=>grupoSelecao(p.posicao)===grupo)||selecionar(()=>true);
 return {iniciais,ultimo,anunciados:ultimo?[...iniciais,ultimo]:iniciais,convocado:!!convocado};
}
