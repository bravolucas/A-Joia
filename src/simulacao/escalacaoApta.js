import {normalizarPosicao} from './profundidadeElenco.js';

/** Só conta aptidão secundária explícita; uma string isolada não prova cobertura. */
export function podeAtuarNaVaga(jogador,posicao) {
 const vaga=normalizarPosicao(posicao);
 if(!vaga||!jogador)return false;
 if(normalizarPosicao(jogador.posicao)===vaga)return true;
 return Array.isArray(jogador.posicoesSecundarias)&&jogador.posicoesSecundarias.some(entrada=>
   entrada&&typeof entrada==='object'&&(entrada.apto===true||entrada.apta===true)
   &&normalizarPosicao(entrada.posicao??entrada.id)===vaga
 );
}

/**
 * Escala até 11 vagas por emparelhamento de atletas, sem dupla utilização.
 * Prioriza posição principal, titularidade e OVR; caso alguma vaga fique sem
 * candidato apto, pode improvisar apenas um jogador ainda não utilizado.
 * A busca por caminho alternativo resolve conflitos entre duas vagas que
 * disputam o mesmo atleta polivalente.
 */
export function escalarVagasAptas(jogadores=[],vagas=[],{improvisar=false}={}) {
 const atletas=jogadores.filter(Boolean);
 const porVaga=vagas.map((v,i)=>({
   posicao:normalizarPosicao(v),
   indice:i,
   candidatos:[],
 }));
 for(const vaga of porVaga)for(let i=0;i<atletas.length;i++){
   const jogador=atletas[i];
   if(!podeAtuarNaVaga(jogador,vaga.posicao))continue;
   const principal=normalizarPosicao(jogador.posicao)===vaga.posicao;
   const pontuacao=(Number(jogador.ovr)||0)+(jogador.voce?((jogador.titularidade??100)-70)*0.25:0);
   vaga.candidatos.push({i,principal,pontuacao});
 }
 for(const vaga of porVaga)vaga.candidatos.sort((a,b)=>
   Number(b.principal)-Number(a.principal)||b.pontuacao-a.pontuacao||a.i-b.i
 );
 const alocado=new Map();
 const tentar=(vaga,visitados)=>{
   for(const c of vaga.candidatos){
     if(visitados.has(c.i))continue;
     visitados.add(c.i);
     const anterior=alocado.get(c.i);
     if(anterior===undefined||tentar(porVaga[anterior],visitados)){
       alocado.set(c.i,vaga.indice);
       return true;
     }
   }
   return false;
 };
 // Vagas raras primeiro: protege posições sem alternativas antes de laterais
 // e meias versáteis, mas mantém a ordem de apresentação dos onze.
 for(const vaga of [...porVaga].sort((a,b)=>
   a.candidatos.length-b.candidatos.length||a.indice-b.indice
 ))tentar(vaga,new Set());
 const resultado=Array(vagas.length).fill(null);
 const usados=new Set();
 for(const [indice,slot] of alocado){
   const jogador=atletas[indice],vaga=porVaga[slot].posicao;
   usados.add(indice);
   resultado[slot]={...jogador,vaga,...(
     normalizarPosicao(jogador.posicao)!==vaga?{secundaria:true}:{}
   )};
 }
 if(improvisar){
   const restantes=atletas.map((j,i)=>({j,i})).filter(x=>!usados.has(x.i))
     .sort((a,b)=>(Number(b.j.ovr)||0)-(Number(a.j.ovr)||0)||a.i-b.i);
   for(let slot=0;slot<resultado.length&&restantes.length;slot++){
     if(resultado[slot])continue;
     const {j,i}=restantes.shift();usados.add(i);
     resultado[slot]={...j,vaga:porVaga[slot].posicao,improvisado:true};
   }
 }
 return resultado;
}
