import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE15} from '../src/dados/acervoClubesHistoricosLote15.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';

test('lote 15 contém quatro clubes turcos com atletas e fatos documentados',()=>{
 const nomes=['Galatasaray','Fenerbahçe','Beşiktaş','Trabzonspor'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE15).sort(),nomes.sort());
 for(const nome of nomes){
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha, 'ficha integrada: '+nome);
  assert.ok(ficha.atletas.length>0, 'atleta documentado: '+nome);
  assert.ok(ficha.marcos.length>0,'marco documentado: '+nome);
  for(const atleta of ficha.atletas){
   assert.ok(atleta.fonte.startsWith('https://'));
   assert.equal(atleta.jogos,null);
   assert.equal(atleta.gols,null);
  }
  assert.deepEqual(ficha.recordes,[]);
 }
});
