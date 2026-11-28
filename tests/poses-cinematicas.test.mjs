import test from 'node:test';
import assert from 'node:assert/strict';
import {escolherPose,posePremiacao,POSES_CINEMATICAS} from '../src/comum/posesCinematicas.js';
test('premiações usam poses formais, distintas das esportivas',()=>{
 assert.deepEqual([1,2,3,4].map(posePremiacao),['premio-1','premio-2','premio-3',null]);
 for(const p of ['premio-1','premio-2','premio-3']) assert.ok(POSES_CINEMATICAS[p].every(id=>/^(gala-|bola-ouro-)/.test(id)));
 assert.equal(escolherPose('premio-1',{vitoria:'esportivo.webp'}),null);
});
test('seleção determinística e tolerante a arquivos ausentes',()=>{
 const files={vitoria:'a.webp','vitoria-ajoelhado':'b.webp'};
 assert.equal(escolherPose('comemoracao',files,'atleta'),escolherPose('comemoracao',files,'atleta'));
 assert.equal(escolherPose('comemoracao',{vitoria:'a.webp'}),'a.webp');
 assert.equal(escolherPose('desconhecida',files),null);
});

import {IDS_BIBLIOTECA,POSES_MODELO_B} from '../src/comum/posesCinematicas.js';
test('todos os 31 recursos são catalogados, sem misturar os modelos de gala',()=>{
 assert.equal(IDS_BIBLIOTECA.length,31);
 const ids=[...Object.values(POSES_CINEMATICAS),...Object.values(POSES_MODELO_B)].flat();
 assert.deepEqual([...new Set(ids)].sort(),[...IDS_BIBLIOTECA].sort());
 assert.ok(!POSES_CINEMATICAS['premio-1'].some(id=>POSES_MODELO_B['premio-1'].includes(id)));
});
