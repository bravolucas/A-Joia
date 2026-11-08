import {CLUBES} from '../dados/data.js';
import {participantesEstadual} from '../competicoes/estaduaisRapidos.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa} from '../treinador/copasEscolha.js';
export function prepararEstadualJogador(c,card){
 if(card.estadualEmJogo||card.estadual?.disputado)return card;
 if((c.temporadas||[]).some(t=>t.ano===card.ano))return card;
 const clube=CLUBES.find(x=>x.nome===card.clube),regional=participantesEstadual(clube);if(!regional)return card;
 const forca=Math.round(card.estadual?.forcaUsuario??(clube.forca+(Number(card.ovr??clube.forca)-clube.forca)*Math.min(1,(card.jogos||0)/48)*.2));
 const campanha=criarCampanhaCopa({nome:regional.nome,tipo:'estadual',usuario:card.clube,forcaUsuario:forca,clubes:regional.clubes,ano:card.ano,formato:'estadual',estado:regional.estado,seed:`${c.codigo}|${card.ano}|${regional.nome}|jogador`,interativoEstadual:true});
 return {...card,titulos:(card.titulos||[]).filter(t=>t.tipo!=='estadual'),estadual:{nome:regional.nome,estado:regional.estado,formato:regional.formato,fase:'Em disputa',campeao:null,vice:null,jogos:[],forcaUsuario:forca},estadualEmJogo:campanha};
}
export function chaveEstadualJogador(card){const c=card.estadualEmJogo;return c?(decisaoCopa(c)?.chave||`${c.seed}|${c.fase}|resultado|${c.etapa}`):null;}
export function escolherEstadualJogador(card,chave,opcao){
 const cp=card.estadualEmJogo;if(!cp||chaveEstadualJogador(card)!==chave)return card;
 const nova=opcao==='continuar'?continuarCopa(cp):escolherCopa(cp,chave,opcao);if(nova===cp)return card;
 if(nova.fase==='fim'&&!nova.resultado&&cp.fase!=='fim')return {...card,estadualEmJogo:nova};
 if(nova.fase!=='fim'||nova.resultado)return {...card,estadualEmJogo:nova};
 const titulos=(card.titulos||[]).filter(t=>t.tipo!=='estadual');if(nova.campeao===card.clube)titulos.push({tipo:'estadual',nome:nova.nome});
 return {...card,titulos,estadualEmJogo:null,estadual:{...card.estadual,disputado:true,fase:nova.faseUsuario,campeao:nova.campeao,vice:nova.vice,jogos:nova.jogosUsuario,classificacao:nova.classificacao,fases:nova.fases}};
}
