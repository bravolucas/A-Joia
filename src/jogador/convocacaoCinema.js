import {grupoSelecao} from './elencoSelecao.js';

/**
 * Roteiro visual da coletiva da Copa. Usa somente atletas do elenco já salvo.
 * A decisão de convocar ou não foi tomada antes pelo motor da temporada.
 * Esta função não sorteia atletas nem modifica o elenco do jogo.
 */
export function roteiroConvocacao(elenco,jogador,convocado){
 const candidatos=(Array.isArray(elenco?.jogadores)?elenco.jogadores:[])
  .filter(p=>p&&typeof p.nome==='string'&&p.nome.trim()&&p.nome!==jogador?.nome);
 const usados=new Set();
 const escolher=predicado=>{
  const p=candidatos.find(x=>!usados.has(x.id??x.nome)&&predicado(x));
  if(p)usados.add(p.id??p.nome);
  return p||null;
 };
 const anteriores=['GOL','DEF','MEI','ATA'].map(g=>escolher(p=>grupoSelecao(p.posicao)===g)||escolher(()=>true)).filter(Boolean);
 const mesmoGrupo=grupoSelecao(jogador?.posicao);
 const ultimo=convocado
  ?{id:'usuario',nome:String(jogador?.nome||'Você'),posicao:jogador?.posicao||'ATA',voce:true}
  :escolher(p=>grupoSelecao(p.posicao)===mesmoGrupo)||escolher(()=>true);
 return {anteriores,ultimo:ultimo||null,anunciados:ultimo?[...anteriores,ultimo]:anteriores,convocado:!!convocado};
}
