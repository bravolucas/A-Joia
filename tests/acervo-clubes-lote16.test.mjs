import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE16} from '../src/dados/acervoClubesHistoricosLote16.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';

test('lote 16 integrado ao catálogo com fontes e sem números inventados',()=>{
 const clubes=['Başakşehir','Samsunspor','Göztepe'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE16).sort(),[...clubes].sort());
 for(const nome of clubes){
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha, 'clube ausente: '+nome);
  assert.ok(ficha.atletas.length>0,'sem atleta: '+nome);
  assert.ok(ficha.marcos.length>0,'sem marcos: '+nome);
  assert.deepEqual(ficha.recordes,[]);
  for(const pessoa of [...ficha.atletas,...ficha.tecnicos||[]]){
   assert.ok(pessoa.fonte.startsWith('https://'),'sem fonte: '+nome);
   if('jogos' in pessoa) assert.equal(pessoa.jogos,null);
   if('gols' in pessoa) assert.equal(pessoa.gols,null);
  }
  for(const marco of ficha.marcos) assert.ok(marco.fonte.startsWith('https://'));
 }
});
