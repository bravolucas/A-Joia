import test from 'node:test';
import assert from 'node:assert/strict';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

const registro=(dados,id)=>dados.recordes.find(r=>r.id===id);
const fixture=()=>({
 nome:'Atleta Teste',nac:'BRA',
 universo:{desde:2027,atletas:{
  '15':{id:'15',nome:'Rival A',historico:[
   [2027,'Santos',30,18,7,null,null,[],null,0,[['Brasileirão',25,14,6,0,0],['Copa do Brasil',5,4,1,0,0]]],
   [2028,'Santos',32,20,9,null,null,[],null,0,[['Brasileirão',28,19,8,0,0]]],
   [2029,'Milan',31,25,10,null,null,[],null,0,[['Serie A',31,25,10,0,0]]]
  ]},
  '16':{id:'16',nome:'Rival B',historico:[
   [2028,'Santos',29,17,2,null,null,[],null,0,[['Brasileirão',29,17,2,0,0]]]
  ]}
 },edicoes:[{ano:2028,nome:'Brasileirão',tipo:'liga',jogos:{
  nomes:['Santos','Palmeiras'],partidas:[[0,1,5,0,1,null,0],[1,0,6,1,2,null,0]]
 }}]},
 temporadas:[]
});

test('clube: soma de temporadas pertence ao clube anterior a transferencia, sem vazamento',()=>{
 const c=fixture(),original=JSON.stringify(c),d=consultarRecordesFutebol(c,'clube','Santos');
 assert.equal(registro(d,'golsCarreira').simulado.valor,38);
 assert.equal(registro(d,'golsCarreira').simulado.atleta,'Rival A');
 assert.equal(registro(d,'golsTemporada').simulado.valor,20);
 assert.equal(registro(d,'maiorVitoria').simulado.valor,5);
 assert.equal(registro(d,'maiorDerrota').simulado.valor,5);
 assert.equal(JSON.stringify(c),original);
});
test('competicao: usa apenas estatisticas do torneio, nunca total de clube',()=>{
 const c=fixture(),d=consultarRecordesFutebol(c,'competicao','Brasileirão');
 assert.equal(registro(d,'golsCarreira').simulado.valor,33);
 assert.equal(registro(d,'golsTemporada').simulado.valor,19);
 assert.equal(registro(d,'golsPartida').simulado.valor,7);
 assert.equal(registro(d,'goleadaPartida').simulado.valor,5);
 const copa=consultarRecordesFutebol(c,'competicao','Copa do Brasil');
 assert.equal(registro(copa,'golsCarreira').simulado.valor,4);
});
test('selecao: jogos, gols e assistencias apenas das partidas internacionais do usuario',()=>{
 const c=fixture();
 c.temporadas=[{ano:2028,clube:'Santos',jogos:38,gols:45,
  selecao:{tipo:'copaMundo',nome:'Copa do Mundo',convocado:true,jogos:7,gols:6,assist:3},
  amistososSelecao:{tipo:'amistosos',jogos:3,gols:1,assist:1}},
  {ano:2030,clube:'Santos',selecao:{tipo:'continentalSelecao',nome:'Copa América',convocado:true,jogos:5,gols:4,assist:2}}];
 const brasil=consultarRecordesFutebol(c,'selecao','Brasil');
 assert.equal(registro(brasil,'golsCarreira').simulado.valor,11);
 assert.equal(registro(brasil,'golsCarreira').real.valor,80);
 const copa=consultarRecordesFutebol(c,'competicao','Copa do Mundo');
 assert.equal(registro(copa,'golsCarreira').simulado.valor,6);
 assert.equal(registro(copa,'golsCarreira').real.valor,22);
 assert.equal(registro(copa,'jogosCarreira').real.valor,34);
});
test('dados historicos preservam a fonte e nao sao alterados pelas temporadas do save',()=>{
 const b=consultarRecordesFutebol({},'clube','Barcelona');
 assert.equal(registro(b,'golsCarreira').real.valor,672);
 assert.ok(registro(b,'golsCarreira').real.fonte.startsWith('https://'));
 const c=fixture();c.tecnico={universo:c.universo};delete c.universo;
 assert.equal(registro(consultarRecordesFutebol(c,'clube','Santos'),'golsCarreira').simulado.valor,38);
 assert.equal(consultarRecordesFutebol({},'clube','Clube Sem Fonte').recordes.length,0);
});
