import {normalizarPosicao} from '../simulacao/profundidadeElenco.js';
import {setorJogador} from '../simulacao/forcaEquipe.js';

const SETORES=new Set(['GOL','DEF','MEI','ATA']);
const disponivel=j=>j&&!j.aposentado&&!j.indisponivel&&!j.suspenso&&!(typeof j.lesao==='object'&&j.lesao?.jogosRestantes>0);
const setorPrimario=j=>{
 if(SETORES.has(j.setor))return j.setor;
 const pos=normalizarPosicao(j.posicao);
 return pos?setorJogador({posicao:pos}):null;
};
const setoresSecundarios=j=>{
 if(!Array.isArray(j.posicoesSecundarias))return [];
 return [...new Set(j.posicoesSecundarias.flatMap(entrada=>{
   if(!entrada||typeof entrada!=='object'||!(entrada.apto===true||entrada.apta===true))return [];
   const pos=normalizarPosicao(entrada.posicao??entrada.id);
   return pos?[setorJogador({posicao:pos})]:[];
 }))];
};
const qualidade=j=>Number.isFinite(j.qualidade)?j.qualidade:(Number.isFinite(j.ovr)?j.ovr:0);

/**
 * Distribui pessoas únicas entre vagas por SETOR, não por posição específica.
 * Usado apenas no cálculo de pesos táticos do treinador. Não cria partidas,
 * jogadores, contratos ou bônus de OVR.
 */
export function alocarSetoresTecnico(elenco=[],pesos={}) {
 const atletas=elenco.filter(disponivel);
 const vagas=Object.entries(pesos).flatMap(([setor,quantidade])=>
   SETORES.has(setor)?Array.from({length:Math.max(0,Math.floor(quantidade)||0)},()=>setor):[]
 );
 const setores=atletas.map(j=>setorPrimario(j)),extras=atletas.map(setoresSecundarios);
 const possibilidades=vagas.map((setor,slot)=>{
   const candidatos=atletas.flatMap((j,i)=>{
     const primario=setores[i]===setor;
     if(!primario&&!extras[i].includes(setor))return [];
     return [{i,primario,qualidade:qualidade(j)}];
   }).sort((a,b)=>Number(b.primario)-Number(a.primario)||b.qualidade-a.qualidade||a.i-b.i);
   return {slot,setor,candidatos};
 });
 const ocupacao=new Map();
 const atribuir=(vaga,visitados)=>{
   for(const candidato of vaga.candidatos){
     if(visitados.has(candidato.i))continue;
     visitados.add(candidato.i);
     const antigo=ocupacao.get(candidato.i);
     if(antigo===undefined||atribuir(possibilidades[antigo],visitados)){
       ocupacao.set(candidato.i,vaga.slot);
       return true;
     }
   }
   return false;
 };
 for(const vaga of [...possibilidades].sort((a,b)=>
   a.candidatos.length-b.candidatos.length||a.slot-b.slot
 ))atribuir(vaga,new Set());
 const titulares=Array(vagas.length).fill(null);
 for(const [indice,slot] of ocupacao){
   titulares[slot]={
     jogador:atletas[indice],setor:vagas[slot],
     secundaria:setores[indice]!==vagas[slot],
   };
 }
 return titulares;
}
export function qualidadeTaticaApta(elenco,pesos) {
 const vagas=Object.values(pesos).reduce((sum,n)=>sum+Math.max(0,Math.floor(n)||0),0);
 if(!vagas)return 0;
 return alocarSetoresTecnico(elenco,pesos).reduce((sum,slot)=>sum+(slot?qualidade(slot.jogador):0),0)/vagas;
}
