/**
 * Copa de seleções no modo rápido: usa EXATAMENTE o motor das outras copas.
 * A convocação continua sendo um evento da carreira; depois dela a campanha
 * passa ao motor persistente de potes, grupos, chaveamento e decisões táticas.
 */
import {NACIONALIDADES} from '../dados/data.js';
import {classificadosCopaDoMundo,participantesContinentalSelecoes} from '../competicoes/copaDoMundo.js';
import {CONFEDERACAO_POR_NACAO} from '../dados/data.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa,continuarCopa,resumoCampanhaCopa} from '../treinador/copasEscolha.js';
import {lancesJogadorCopa} from './copasJogador.js';

const selecionar=(c,card)=>{
 const ehMundo=card.copa.tipo==='copaMundo',nac=c.nac;
 if(ehMundo&&card.ano>=2026)return classificadosCopaDoMundo(card.ano,{
  semente:`${c.codigo||c.nome}|rapido-copa`,garantidas:[nac],
 }).classificadas;
 if(ehMundo)return NACIONALIDADES.slice(0,32).map(n=>({nome:n.label,nac:n.id,elenco:n.forcaSelecao}));
 return participantesContinentalSelecoes(CONFEDERACAO_POR_NACAO[nac]);
};
/** Não reabre ou redesenha uma Copa já iniciada, nem reinterpreta saves antigos. */
export function iniciarCopaCompartilhada(c,card){
 if(!card?.copa?.convocado||card.copa.fim||card.copaCompartilhada||card.copa.jogos?.length||card.copa.etapa!=='grupos')return card;
 const k=card.copa,usuario=k.label;
 const participantes=selecionar(c,card).map(n=>({nome:n.nome||n.label,nac:n.nac||n.id,forca:Number(n.elenco??n.forcaSelecao??n.forca??65)}));
 const jaTem=participantes.some(p=>p.nac===c.nac);
 if(!jaTem)participantes[participantes.length-1]={nome:usuario,nac:c.nac,forca:k.fs};
 const campanha=criarCampanhaCopa({
  nome:k.nome,tipo:k.tipo,usuario,
  forcaUsuario:Math.max(35,Math.min(100,k.fs+(k.titular?Math.max(-2,Math.min(3,(k.ovr-k.fs)*.25)):0))),
  clubes:participantes,ano:card.ano,
  formato:k.tipo==='copaMundo'?(card.ano>=2026?'copa48':'selecao32'):'selecaoGrupos',
  seed:`${c.codigo||c.nome}|${card.ano}|${k.tipo}|jogador`,
 });
 campanha.selecao=usuario;
 return {...card,copaCompartilhada:campanha};
}
/** Retoma a própria campanha, sem refazer sorteio, e publica resultados uma única vez. */
export function escolherCopaCompartilhada(card,chave,opcao){
 const antiga=card?.copaCompartilhada;
 if(!antiga||!card.copa||card.copa.fim)return card;
 const d=decisaoCopa(antiga);
 const esperada=d?.chave||`${antiga.seed}|resultado|${antiga.etapa}`;
 if(chave!==esperada)return card;
 let nova=opcao==='continuar'?continuarCopa(antiga):escolherCopa(antiga,chave,opcao);
 if(nova===antiga)return card;
 let atualizado={...card,copaCompartilhada:nova};
 // A partida do jogador também precisa ficar no histórico: o resultado não é
 // contabilizado de novo ao clicar em Continuar ou ao recarregar o save.
 if(opcao!=='continuar'&&nova.resultado&&!nova.resultado.penaltisPendentes&&!antiga.resultado){
  const lances=lancesJogadorCopa(card,nova,chave);
  if(lances){nova={...nova,resultado:{...nova.resultado,lancesJogador:lances}};
   const anterior=card.copaEstatisticas||{jogos:0,gols:0,assist:0};
   atualizado={...atualizado,copaCompartilhada:nova,copaEstatisticas:{jogos:anterior.jogos+(lances.jogou?1:0),gols:anterior.gols+(lances.gols||0),assist:anterior.assist+(lances.assist||0)}};
  }
 }
 if(nova.fase!=='fim'||nova.resultado)return atualizado;
 const ganhou=nova.campeao===nova.usuario;
 const jogos=nova.jogosUsuario||[];
 const selecionado=card.selecao||{};
 const k={...card.copa,fim:true,etapa:'fim',campeao:ganhou,convocado:true,
  jogos:jogos.map(j=>({fase:j.fase,adv:{label:j.casa===nova.usuario?j.fora:j.casa},gp:j.casa===nova.usuario?j.golsCasa:j.golsFora,gc:j.casa===nova.usuario?j.golsFora:j.golsCasa})),
 };
 const resumo=resumoCampanhaCopa(nova),est=card.copaEstatisticas||{jogos:0,gols:0,assist:0};
 k.gols=est.gols;k.assist=est.assist;
 atualizado={...atualizado,copa:k,
  selecao:{...selecionado,convocado:true,campeao:ganhou,resultado:nova.faseUsuario,
   jogos:jogos.length,partidas:jogos,elenco:k.elenco||selecionado.elenco,
   gols:est.gols,assist:est.assist},
  torneios:[...(card.torneios||[]).filter(x=>x.nome!==nova.nome),resumo],
  titulos:ganhou&&!card.titulos.some(t=>t.tipo===k.tipo&&t.nome===k.nome)?
   [...card.titulos,{tipo:k.tipo,nome:k.nome}]:card.titulos,
  destaques:ganhou?[...card.destaques,`🏆 Campeão da ${k.nome} com ${k.label}`]:card.destaques,
 };
 return atualizado;
}
export function chaveCopaCompartilhada(card){
 const c=card?.copaCompartilhada;
 if(!c)return null;
 return decisaoCopa(c)?.chave||`${c.seed}|resultado|${c.etapa}`;
}
