import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORICO_LIBERTADORES,ULTIMO_ANO_LIBERTADORES_HISTORICO,TOTAIS_LIBERTADORES_HISTORICOS,totalLibertadoresHistoricas} from '../src/dados/libertadoresHistorica.js';
import {galeriaCompeticao} from '../src/historia/competicoesHistoricas.js';
import {acervoInicial,galeriaClube} from '../src/historia/historiaFutebol.js';

const taca=(clube)=>galeriaClube({},clube).tacas.find(t=>t.nome==='Libertadores');
test('histórico real possui 66 edições, de 1960 a 2025, sem 2026 nem buracos',()=>{
 assert.equal(ULTIMO_ANO_LIBERTADORES_HISTORICO,2025);
 assert.equal(HISTORICO_LIBERTADORES.length,66);
 assert.deepEqual(HISTORICO_LIBERTADORES.map(e=>e.ano),Array.from({length:66},(_,i)=>2025-i));
 assert.ok(HISTORICO_LIBERTADORES.every(e=>e.campeoes.length===1&&e.campeoes[0].quantidade===1));
 assert.equal(HISTORICO_LIBERTADORES[0].campeoes[0].clube,'Flamengo');
 assert.equal(HISTORICO_LIBERTADORES.at(-1).campeoes[0].clube,'Peñarol');
 assert.equal(HISTORICO_LIBERTADORES.find(e=>e.ano===2016).campeoes[0].clube,'Atlético Nacional');
 assert.equal(HISTORICO_LIBERTADORES.find(e=>e.ano===2008).campeoes[0].clube,'LDU de Quito');
 assert.equal(HISTORICO_LIBERTADORES.find(e=>e.ano===1991).campeoes[0].clube,'Colo-Colo');
});

test('ranking da Libertadores é mundial e soma exatamente 66 conquistas de 27 clubes',()=>{
 const g=galeriaCompeticao({},'Libertadores');
 assert.equal(g.edicoes.length,0,'histórico real não deve se tornar evento de carreira');
 assert.equal(g.historicas.length,66);
 assert.equal(g.ultima.ano,2025);
 assert.equal(g.ultima.clube,'Flamengo');
 assert.equal(g.ultima.historica,true);
 assert.equal(g.ranking.length,27);
 assert.equal(g.ranking.reduce((sum,c)=>sum+c.inicial,0),66);
 assert.deepEqual(g.ranking.slice(0,3).map(r=>[r.clube,r.total]),[
   ['Independiente',7],['Boca Juniors',6],['Peñarol',5],
 ]);
 for(const [clube,contagem] of Object.entries({
  'Nacional de Montevidéu':3,Olimpia:3,'Estudiantes de La Plata':4,
  'River Plate':4,'Atlético Nacional':2,'Colo-Colo':1,'LDU de Quito':1,
  'Vélez Sarsfield':1,'Once Caldas':1,Flamengo:4,Palmeiras:3,
 })){
   assert.equal(totalLibertadoresHistoricas(clube),contagem);
   assert.equal(g.ranking.find(r=>r.clube===clube)?.inicial,contagem);
 }
 assert.equal(TOTAIS_LIBERTADORES_HISTORICOS['Independiente'],7);
 assert.ok(!g.ranking.some(r=>r.clube==='Talleres'),'não criar título para clube sul-americano sem conquistas');
});

test('vitrine do clube mostra Libertadores reais inclusive clube estrangeiro não jogável',()=>{
 for(const [clube,esperado] of [
  ['Independiente',7],['Boca Juniors',6],['Peñarol',5],
  ['Flamengo',4],['Nacional de Montevidéu',3],['LDU de Quito',1],
  ['Vélez Sarsfield',1],['Once Caldas',1],
 ]){
  assert.equal(taca(clube)?.inicial,esperado,clube);
 }
 assert.equal(taca('Talleres')?.inicial,0);
 assert.ok(!acervoInicial('Athletico-PR').tacas.some(t=>t.nome==='Libertadores'&&t.inicial>0),
  'títulos da Sul-Americana não podem virar Libertadores');
});

test('save intacto: títulos da carreira somam uma vez, sem misturar edição histórica e simulada',()=>{
 const c={lista:[{ano:2030,clube:'Boca Juniors',nome:'Copa Libertadores',tipo:'continental'}],
  temporadas:[{ano:2030,clube:'Boca Juniors',torneios:[{nome:'Libertadores',campeao:'Boca Juniors',tipo:'continental'}]}]};
 const antes=structuredClone(c);
 const g=galeriaCompeticao(c,'Copa Libertadores');
 assert.equal(g.edicoes.length,1);
 assert.equal(g.edicoes[0].ano,2030);
 assert.equal(g.ultima.ano,2030);
 assert.equal(g.historicas.length,66);
 assert.equal(g.ranking.find(r=>r.clube==='Boca Juniors').total,7);
 assert.equal(g.ranking.find(r=>r.clube==='Boca Juniors').simulacao,1);
 assert.equal(g.ranking.reduce((sum,r)=>sum+r.simulacao,0),1);
 assert.deepEqual(c,antes);
 const clube=galeriaClube(c,'Boca Juniors');
 assert.equal(clube.tacas.find(t=>t.nome==='Libertadores').total,7);
});

test('a edição de 2026 não tem campeão oficial fabricado; edições de estaduais continuam separadas',()=>{
 const lib=galeriaCompeticao({},'Libertadores');
 assert.ok(!lib.historicas.some(e=>e.ano>=2026));
 const paulista=galeriaCompeticao({},'Campeonato Paulista');
 assert.ok(paulista.historicas.length>0);
 assert.equal(paulista.historicas[0].ano,2024);
 assert.ok(!galeriaCompeticao({},'Champions League').historicas.length);
});
