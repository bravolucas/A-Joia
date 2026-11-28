import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,fecharTemporada,aplicarMomento} from '../src/jogador/rapido.js';
import {proximoCompromissoJogador,avancarCalendarioJogador,concluirEventoJogador,etapaAgendaJogador} from '../src/jogador/copasJogador.js';

function temporada(clube='Flamengo'){
 const c=criarJogador({nome:'Calendário do atleta',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,ritmo:'normal',codigo:'CAL-ATLETA-'+clube});
 c.clubeNome=clube;c.flags.baseEscolhida=true;
 return jogarTemporada(c,{copasInterativas:true});
}
// Desafios e seleção têm tela própria: no teste, resolvidos direto.
function resolverPausas(card){
 for(let i=0;i<20;i++){
  const p=proximoCompromissoJogador(card);
  if(p?.tipo==='momento')card=concluirEventoJogador(aplicarMomento(card,true));
  else if(p?.tipo==='selecao')card=concluirEventoJogador({...card,copa:{...card.copa,fim:true}});
  else return card;
 }
 return card;
}

test('liga do atleta entra no calendário rodada a rodada, sem resultado antecipado',()=>{
 const {card}=temporada();
 assert.ok(card.ligaPropria,'liga no calendário');
 assert.equal(card.ligaPropria.indice,0);
 assert.equal(card.ligaPropria.rodadas.length,38);
 const d=card.ligaPropria.rodadas.map(r=>r.data);assert.ok(d.every((x,i)=>!i||x>d[i-1]));
 assert.equal(card.classificacoesMundo.brasileirao,undefined,'sem tabela final pronta no início');
 assert.equal(card.titulos.some(t=>t.tipo==='liga'),false);
 assert.ok(card.calendarioCopas.vistos.includes('metade'));
});

test('pular e jogar disputam uma partida; a estratégia vai para o registro',()=>{
 let {card}=temporada();
 for(let i=0;i<8;i++){
  card=resolverPausas(card);
  const antes=(card.calendarioRecentes||[]).length,prox=proximoCompromissoJogador(card);
  card=avancarCalendarioJogador(card,prox.tipo==='liga'?{modo:'jogar',estrategia:'atacar'}:{modo:'pular'});
  assert.equal(card.calendarioRecentes.length,antes+1);
  if(prox.tipo==='liga'){assert.equal(card.calendarioRecentes[0].estrategia,'atacar');assert.equal(card.calendarioRecentes[0].rodada,prox.rodada);}
  card=JSON.parse(JSON.stringify(card));
 }
});

test('simular até uma data respeita a ordem do calendário e o mundo anda junto',()=>{
 let {card}=temporada();
 const alvo=card.ligaPropria.rodadas[12].data;
 for(let i=0;i<20&&proximoCompromissoJogador(card).data<alvo;i++)card=avancarCalendarioJogador(resolverPausas(card),{modo:'ate',data:alvo});
 const prox=proximoCompromissoJogador(card);
 assert.ok(prox.data>=alvo);
 assert.equal(card.ligaPropria.indice,12);
 const minhaLiga=card.calendarioLigasExternas.ligas.brasileirao;
 assert.ok(minhaLiga.classificacao.find(t=>t.nome==='Flamengo').jogos>=11);
 assert.ok(Object.values(card.calendarioLigasExternas.ligas).filter(l=>l.classificacao?.[0]?.jogos>0).length>5);
 assert.equal(etapaAgendaJogador(card)==='calendario',prox.tipo==='liga');
});

test('fim da liga define posição e título pela tabela jogada, e a temporada fecha',()=>{
 let {c,card}=temporada();
 for(let i=0;i<40&&card.calendarioCopas;i++)card=avancarCalendarioJogador(resolverPausas(card),{modo:'ate',data:Infinity});
 assert.equal(card.calendarioCopas,null);
 assert.ok(card.ligaPropria.concluida);
 const tabela=card.classificacoesMundo.brasileirao.classificacao;
 assert.equal(card.posLiga,tabela.findIndex(t=>t.nome==='Flamengo')+1);
 assert.equal(tabela.find(t=>t.nome==='Flamengo').jogos,38);
 assert.equal(card.titulos.some(t=>t.tipo==='liga'),card.posLiga===1);
 const f=fecharTemporada(c,card);
 assert.equal(f.c.temporadas.at(-1).posLiga,card.posLiga);
});
