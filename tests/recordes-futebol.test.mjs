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

test('modo completo: usa temporadas externas e separa Copa do Mundo de continental sem duplicar',()=>{
 const c={nome:'Lucas',nacionalidade:'BRA',selecao:{historico:[
  {ano:2030,idade:22,comp:'copa',nomeComp:'Copa do Mundo',jogos:7,gols:4,assist:1},
  {ano:2030,idade:22,comp:'continental',nomeComp:'Copa América',jogos:4,gols:3,assist:1}
 ]}};
 const temporadas=[{ano:2030,clube:'Santos',jogos:31,gols:29,assist:9,
  selecaoTemporada:{jogos:11,gols:7,assist:2,nomeComp:'Copa do Mundo · Copa América'}}];
 assert.equal(registro(consultarRecordesFutebol(c,'clube','Santos',temporadas),'golsCarreira').simulado.valor,29);
 assert.equal(registro(consultarRecordesFutebol(c,'selecao','Brasil',temporadas),'golsCarreira').simulado.valor,7);
 assert.equal(registro(consultarRecordesFutebol(c,'competicao','Copa do Mundo',temporadas),'golsCarreira').simulado.valor,4);
});

test('recordes de atuacao por partida respeitam clube, torneio, participacao e nao reescrevem o save',()=>{
 const c=fixture(),jogos=[
  {id:'2030|liga|1',ano:2030,clube:'Santos',competicao:'Brasileirão',
    adversario:'Palmeiras',participou:true,gols:3,assistencias:2,defesas:0},
  {id:'2031|copa|2',ano:2031,clube:'Milan',competicao:'Champions League',
    adversario:'Inter',participou:true,gols:4,assistencias:0,defesas:0},
  {id:'2030|liga|3',ano:2030,clube:'Santos',competicao:'Brasileirão',
    adversario:'Flamengo',participou:false,gols:9,assistencias:6,defesas:0}
 ];
 c.universo.partidasAtletas={voce:jogos};const original=JSON.stringify(c);
 assert.equal(registro(consultarRecordesFutebol(c,'clube','Santos'),'golsAtletaPartida').simulado.valor,3);
 assert.equal(registro(consultarRecordesFutebol(c,'competicao','Champions League'),'golsAtletaPartida').simulado.valor,4);
 assert.equal(registro(consultarRecordesFutebol(c,'competicao','Brasileirão'),'assistAtletaPartida').simulado.valor,2);
 assert.equal(JSON.stringify(c),original);
});

test('separacao por edicao impede somar campanhas e identifica as sequencias reais',()=>{
 const c={universo:{edicoes:[
  {ano:2030,nome:'Brasileirão',tipo:'liga',jogos:{nomes:['Santos','Palmeiras','Corinthians'],
   partidas:[[0,1,2,0,1],[2,0,0,1,2],[0,1,1,1,3],[0,2,3,0,5],[0,1,0,2,6]]}},
  {ano:2031,nome:'Brasileirão',tipo:'liga',jogos:{nomes:['Santos','Palmeiras'],
   partidas:[[0,1,1,0,1],[1,0,1,2,2]]}}
 ]}};
 const dados=consultarRecordesFutebol(c,'competicao','Brasileirão');
 assert.equal(registro(dados,'invencibilidade').simulado.valor,3);
 assert.equal(registro(dados,'vitoriasSeguidas').simulado.valor,2);
 assert.equal(registro(dados,'golsEquipeEdicao').simulado.valor,7);
 assert.equal(registro(dados,'vitoriasEquipeEdicao').simulado.valor,3);
 assert.equal(registro(dados,'golsEquipePartida').simulado.valor,3);
 const clube=consultarRecordesFutebol(c,'clube','Santos');
 assert.equal(registro(clube,'invencibilidade').simulado.valor,3);
 assert.equal(registro(clube,'vitoriasSeguidas').simulado.valor,2);
});
test('sem rodadas comprovadas nao inventa sequencias',()=>{
 const c={universo:{edicoes:[{ano:2030,nome:'Copa do Brasil',tipo:'copa',jogos:{
  nomes:['Santos','Palmeiras'],partidas:[[0,1,3,0,'oitavas'],[1,0,0,2,'quartas']]
 }}]}};
 assert.equal(registro(consultarRecordesFutebol(c,'clube','Santos'),'invencibilidade'),undefined);
 assert.equal(registro(consultarRecordesFutebol(c,'competicao','Copa do Brasil'),'golsEquipePartida').simulado.valor,3);
});
