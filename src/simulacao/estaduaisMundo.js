import {CLUBES,ESTADUAIS} from '../dados/data.js';
import {participantesEstadual} from '../competicoes/estaduaisRapidos.js';
import {clubesDoMundo} from './mundoVivo.js';
import {simularCampanhaCopa,resumoCampanhaCopa} from '../treinador/copasEscolha.js';
/** Cada estadual tem seu próprio calendário. A competição já jogada nunca é sorteada outra vez. */
export function simularEstaduaisMundo(c,card){
 const conhecidos=new Set([...(card.torneios||[]),...(card.torneiosMundo||[])].map(t=>t.nome));
 if(card.estadual){const clube=CLUBES.find(cl=>cl.nome===(typeof card.clube==='string'?card.clube:card.clube?.nome));conhecidos.add(card.estadual.nome||ESTADUAIS[clube?.estado]);}
 const torneios=[];
 for(const [estado,nome] of Object.entries(ESTADUAIS)){
  if(conhecidos.has(nome))continue;
  const regional=participantesEstadual({estado});if(!regional||regional.clubes.length<2)continue;
  const clubes=clubesDoMundo(c,regional.clubes),eu=clubes[0];
  const campanha=simularCampanhaCopa({nome,tipo:'estadual',usuario:eu.nome,forcaUsuario:eu.forca,clubes,ano:card.ano,formato:'estadual',estado,seed:`${c.codigoMundo||c.codigo||c.nome||'mundo'}|${card.ano}|estadual|${estado}`});
  if(campanha.fase!=='fim'||!campanha.campeao)throw new Error(`Calendário estadual incompleto: ${nome}`);
  torneios.push({...resumoCampanhaCopa(campanha),estado,origem:'calendario-mundo'});
 }
 return torneios;
}
