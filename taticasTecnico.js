import { bonusAuxiliarTecnico } from './comissaoTecnico.js';
// As formações redistribuem o peso dos setores, sem somar força gratuitamente.
export const FORMACOES_TECNICO = [
 {id:'4-3-3',nome:'4-3-3',descricao:'Valoriza o ataque e dá menos peso ao meio-campo.',pesos:{GOL:1,DEF:4,MEI:3,ATA:3}},
 {id:'4-4-2',nome:'4-4-2',descricao:'Distribui o peso entre defesa e meio-campo.',pesos:{GOL:1,DEF:4,MEI:4,ATA:2}},
 {id:'3-5-2',nome:'3-5-2',descricao:'Valoriza o meio-campo e dá menos peso à defesa.',pesos:{GOL:1,DEF:3,MEI:5,ATA:2}},
];
export function perfilTaticoTecnico(t={}){
 const formacao=FORMACOES_TECNICO.find(f=>f.id===t.formacao)||FORMACOES_TECNICO[1];
 const estilo=['ofensivo','defensivo'].includes(t.estilo)?t.estilo:'equilibrado';
 const elenco=t.gestao&&t.gestao.clube===t.clube?t.gestao.elenco:[];
 let ajuste=0;
 if(elenco?.length){
  const qualidade=pesos=>Object.entries(pesos).reduce((total,[setor,vagas])=>{
   const titulares=elenco.filter(j=>j.setor===setor).sort((a,b)=>b.qualidade-a.qualidade).slice(0,vagas);
   // Vagas sem jogador contam como zero: vender não melhora um setor incompleto.
   return total+titulares.reduce((n,j)=>n+j.qualidade,0);
  },0)/11;
  ajuste=Math.max(-3,Math.min(3,qualidade(formacao.pesos)-qualidade(FORMACOES_TECNICO[1].pesos)));
 }
 return {estilo,formacao:formacao.id,ajuste:ajuste+bonusAuxiliarTecnico(t)};
}

/** Vantagem contextual em probabilidade; compartilhada por liga e copas. */
export function riscoEstiloTecnico(estilo,diferenca){
 const contexto=Math.max(-1,Math.min(1,diferenca/20));
 return estilo==='ofensivo'?.025*contexto:estilo==='defensivo'?-.02*contexto:0;
}
