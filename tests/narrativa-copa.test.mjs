import test from 'node:test';
import assert from 'node:assert/strict';
import {rotaEstrategiaCopa,resultadoVisualCopa} from '../src/treinador/narrativaCopa.js';
test('veredito acompanha placar real, inclusive visitante e empate com gols',()=>{
 const j={casa:'A',fora:'B',golsCasa:2,golsFora:1};
 assert.equal(resultadoVisualCopa({jogo:j,venceu:false},'A').titulo,'VITÓRIA');
 assert.equal(resultadoVisualCopa({jogo:j,venceu:true},'B').titulo,'DERROTA');
 const empate=resultadoVisualCopa({jogo:{...j,golsCasa:1,golsFora:1},penaltisPendentes:true},'A');assert.equal(empate.titulo,'EMPATE');assert.match(empate.descricao,/pênaltis/);assert.equal(resultadoVisualCopa(null,'A'),null);
});
test('as três estratégias usam rotas diferentes e todos os passes ficam no campo',()=>{
 const rotas=['inverter','entrelinhas','apoio-curto'].map(rotaEstrategiaCopa);assert.equal(new Set(rotas.map(r=>r.path)).size,3);
 for(const r of rotas)for(const p of r.path.matchAll(/[ML](\d+) (\d+)/g)){assert.ok(+p[1]>=25&&+p[1]<=335);assert.ok(+p[2]>=25&&+p[2]<=165);}
});
