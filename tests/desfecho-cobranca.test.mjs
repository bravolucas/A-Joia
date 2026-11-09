import test from 'node:test';
import assert from 'node:assert/strict';
import {desfechoCobranca} from '../src/comum/desfechoCobranca.js';
test('gol prevalece sobre rótulo legado conflitante; defesa não vira gol',()=>{
 assert.equal(desfechoCobranca({gol:true,tipo:'Trave'}),'gol');
 assert.equal(desfechoCobranca({resultado:'gol',ok:false}),'gol');
 assert.equal(desfechoCobranca({resultado:'defesa',ok:true}),'defesa');
 assert.equal(desfechoCobranca({gol:false,tipo:'Defesa'}),'defesa');
 assert.equal(desfechoCobranca({resultado:'fora',ok:true}),'fora');
 assert.equal(desfechoCobranca(null),null);
});
