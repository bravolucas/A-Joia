import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador,jogarTemporada,aplicarMomento} from '../src/jogador/rapido.js';
import {escolherCopaJogador,chaveCopaJogador,concluirEventoJogador} from '../src/jogador/copasJogador.js';
import {decisaoCopa} from '../src/treinador/copasEscolha.js';
import {porCompeticaoTemporada} from '../src/jogador/FechamentoTemporadaDados.js';

function temporadaComCopas(posicao='ATA',codigo='LANCES'){
 const c=criarJogador({nome:'Lances',nac:'BRA',posicao,origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo});c.clubeNome='Flamengo';c.flags.baseEscolhida=true;
 for(const a of Object.keys(c.attrs))c.attrs[a]=85;
 let {card}=jogarTemporada(c,{copasInterativas:true});const resultados=[];
 for(let i=0;card.calendarioCopas&&i<300;i++){
  const p=card.calendarioCopas;
  if(p.pausa){card=p.pausa.tipo==='momento'?concluirEventoJogador(aplicarMomento(card,true)):escolherCopaJogador(card,chaveCopaJogador(card),'continuar');continue;}
  const cp=p.campeonatos[p.indice],d=decisaoCopa(cp);
  card=escolherCopaJogador(card,chaveCopaJogador(card),d?d.penaltis?'canto':'pressionar':'continuar');
  const r=card.calendarioCopas?.campeonatos?.[p.indice]?.resultado;if(r?.lancesJogador)resultados.push({r,usuario:cp.usuario});
 }
 return {card,resultados};
}

test('cada partida de copa do jogador registra lances coerentes com o placar e com a temporada',()=>{
 const {card,resultados}=temporadaComCopas();
 assert.ok(resultados.length>0,'partidas de copa disputadas');
 for(const {r,usuario} of resultados){
  const l=r.lancesJogador,doTime=r.jogo.casa===usuario?r.jogo.golsCasa:r.jogo.golsFora;
  if(!l.jogou){assert.equal(l.eventos.length,0);continue;}
  assert.ok(l.gols+l.assist<=doTime,'lances não passam dos gols do time');
  assert.equal(l.eventos.filter(e=>e.tipo==='gol').length,l.gols);
  assert.ok(l.eventos.every(e=>e.minuto>=1&&e.minuto<=90));
 }
 const total=Object.values(card.copaLances||{}).reduce((s,x)=>({gols:s.gols+x.gols,assist:s.assist+x.assist}),{gols:0,assist:0});
 assert.ok(total.gols<=card.gols&&total.assist<=card.assist,'copas são parte dos números da temporada');
 const por=porCompeticaoTemporada(card);
 assert.equal(por.reduce((n,x)=>n+x.gols,0),card.gols);assert.equal(por.reduce((n,x)=>n+x.assist,0),card.assist);
 assert.equal(por[0].nome,card.ligaNome);
});

test('goleiro não marca gols nas copas e os lances são estáveis',()=>{
 const a=temporadaComCopas('GOL','LANCES-GOL'),b=temporadaComCopas('GOL','LANCES-GOL');
 assert.ok(a.resultados.every(({r})=>!r.lancesJogador.gols));
 assert.deepEqual(a.card.copaLances,b.card.copaLances);
});
