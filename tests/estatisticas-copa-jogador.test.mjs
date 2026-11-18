import test from 'node:test';
import assert from 'node:assert/strict';
import {anotarEstatisticasCopaJogador} from '../src/jogador/estatisticasCopaJogador.js';

test('copa do jogador preserva estatísticas por jogo de ida e volta no histórico',()=>{
 const ida={casa:'A',fora:'B',golsCasa:3,golsFora:0,etapa:'Ida'};
 const volta={casa:'B',fora:'A',golsCasa:1,golsFora:2,etapa:'Volta'};
 const agregado={casa:'A',fora:'B',golsCasa:5,golsFora:1,partidas:[ida,volta],agregado:true};
 const copia=structuredClone(agregado);
 const camp={seed:'estatisticas-jogador-test',usuario:'A',etapa:4,resultado:{jogo:agregado},
  jogosUsuario:[copia],fases:[{fase:'Semifinal',jogos:[structuredClone(copia)]}]};
 anotarEstatisticasCopaJogador(camp,{posicaoJogador:'ATA',ovr:88});
 assert.equal(camp.resultado.jogo.partidas.length,2);
 for(const jogo of camp.resultado.jogo.partidas){
  const stat=jogo.estatisticasJogador;
  assert.ok(stat&&Number.isInteger(stat.gols)&&Number.isInteger(stat.assist));
  const golsTime=jogo.casa==='A'?jogo.golsCasa:jogo.golsFora;
  assert.ok(stat.gols+stat.assist<=golsTime);
 }
 const total=camp.resultado.jogo.estatisticasJogador;
 assert.equal(total.gols,camp.resultado.jogo.partidas.reduce((n,p)=>n+p.estatisticasJogador.gols,0));
 assert.deepEqual(camp.jogosUsuario[0].estatisticasJogador,total);
 assert.deepEqual(camp.fases[0].jogos[0].estatisticasJogador,total);
 assert.equal(camp.fases[0].jogos[0].partidas.length,2);
 const original=JSON.stringify(camp);
 anotarEstatisticasCopaJogador(camp,{posicaoJogador:'ATA',ovr:88});
 assert.equal(JSON.stringify(camp),original,'releitura do save não pode ressorteiar estatísticas');
});

test('disputa de pênaltis pendente não registra desempenho antes do desfecho',()=>{
 const c={seed:'penaltis',usuario:'A',etapa:2,resultado:{penaltisPendentes:true,jogo:{casa:'A',fora:'B',golsCasa:1,golsFora:1}}};
 anotarEstatisticasCopaJogador(c,{posicaoJogador:'MEI'});
 assert.equal(c.resultado.jogo.estatisticasJogador,undefined);
});
