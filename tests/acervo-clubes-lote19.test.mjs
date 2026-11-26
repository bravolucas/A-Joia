import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE19} from '../src/dados/acervoClubesHistoricosLote19.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 19 cadastra Eyupspor e Kayserispor sem estatísticas presumidas',()=>{
 for(const nome of ['Eyüpspor','Kayserispor']){
  assert.ok(CLUBES.some(c=>c.nome===nome),'identidade do catálogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha&&ficha.atletas.length>0);
  assert.ok(ficha.marcos.length>0);
  assert.deepEqual(ficha.recordes,[]);
  for(const atleta of ficha.atletas){
   assert.ok(atleta.fonte.startsWith('https://'));
   assert.equal(atleta.jogos,null);
   assert.equal(atleta.gols,null);
  }
 }
});
