import test from 'node:test';
import assert from 'node:assert/strict';
import {desfechoCobranca,ladoGoleiroCobranca} from '../src/comum/desfechoCobranca.js';
test('gol prevalece sobre rótulo legado conflitante; defesa não vira gol',()=>{
 assert.equal(desfechoCobranca({gol:true,tipo:'Trave'}),'gol');
 assert.equal(desfechoCobranca({resultado:'gol',ok:false}),'gol');
 assert.equal(desfechoCobranca({resultado:'defesa',ok:true}),'defesa');
 assert.equal(desfechoCobranca({gol:false,tipo:'Defesa'}),'defesa');
 assert.equal(desfechoCobranca({resultado:'fora',ok:true}),'fora');
 assert.equal(desfechoCobranca(null),null);
});

test('pose lateral acompanha defesa e evita mostrar goleiro alcançando bola em um gol',()=>{assert.equal(ladoGoleiroCobranca({zona:'esquerdo',tipo:'Defesa',gol:false}),'esquerda');assert.equal(ladoGoleiroCobranca({zona:'direito',tipo:'Defesa',gol:false}),'direita');assert.equal(ladoGoleiroCobranca({zona:'esquerdo',gol:true}),'direita');assert.equal(ladoGoleiroCobranca({zona:'direito',gol:true}),'esquerda');assert.equal(ladoGoleiroCobranca({ladoGoleiro:'esquerda',gol:true}),'esquerda');});
