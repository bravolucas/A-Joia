import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe,REFERENCIAS_RECORDES_CLUBES} from '../src/dados/acervoClubesHistoricos.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';
import {idolosDoClube} from '../src/historia/idolos.js';

test('lote 1: fontes, escopos, valores válidos e sem métricas duplicadas por clube',()=>{
 const clubes=Object.values(ACERVO_CLUBES_HISTORICOS);
 assert.equal(clubes.length,14);
 assert.ok(REFERENCIAS_RECORDES_CLUBES.length>=20);
 const chaves=new Set();
 for(const c of clubes){
  assert.ok(c.clube&&c.atualizadoEm);
  assert.ok(c.atletas.length>0);
  for(const a of c.atletas){
   assert.ok(a.nome&&a.fonte?.startsWith('https://'));
   for(const k of ['jogos','gols']) assert.ok(a[k]===null||(Number.isInteger(a[k])&&a[k]>0));
  }
  for(const r of c.recordes){
   const chave=r.nome+'|'+r.id;
   assert.ok(!chaves.has(chave),'Recorde duplicado: '+chave);
   chaves.add(chave);
   assert.equal(r.tipo,'clube');
   assert.equal(r.comparavel,false,'Não equiparar contagens históricas sem uniformizar amistosos');
   assert.ok(Number.isInteger(r.valor)&&r.valor>0&&r.fonte?.startsWith('https://'));
   assert.ok(c.atletas.some(a=>a.nome===r.atleta));
  }
 }
 assert.equal(acervoClubeHistoricoDe('Clube inventado'),null);
});
test('históricos conhecidos são mantidos e o sistema não mistura marcos reais com save',()=>{
 const consultar=(nome,id)=>consultarRecordesFutebol({},'clube',nome).recordes.find(x=>x.id===id);
 assert.equal(consultar('Palmeiras','golsCarreira').real.valor,324);
 assert.equal(consultar('São Paulo','jogosCarreira').real.valor,1237);
 assert.equal(consultar('Santos','golsCarreira').real.valor,1091);
 assert.equal(consultar('Vasco da Gama','golsCarreira').real.valor,708);
 assert.equal(consultar('Barcelona','golsCarreira').real.valor,672);
 assert.equal(consultar('Cruzeiro','jogosCarreira').real.valor,976);
 assert.match(consultar('Santos','golsCarreira').status,/critério distinto/);
 assert.equal(consultar('Santos','golsCarreira').simulado,null);
 assert.deepEqual(idolosDoClube({},'Santos'),[]);
});
test('marca do save muito alta não declara recorde real quebrado com critérios distintos',()=>{
 const s={nome:'Teste',temporadas:[{ano:2030,clube:'Santos',jogos:50,gols:1200,assist:2}]};
 const r=consultarRecordesFutebol(s,'clube','Santos').recordes.find(x=>x.id==='golsCarreira');
 assert.equal(r.real.valor,1091);
 assert.ok(r.simulado?.valor>=1200);
 assert.match(r.status,/critério distinto/);
});
