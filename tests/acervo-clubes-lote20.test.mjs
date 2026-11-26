import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE20} from '../src/dados/acervoClubesHistoricosLote20.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';
test('lote 20 registra clubes sauditas sem fabricar recordes',()=>{
 for(const nome of ['Al-Fateh','Al-Taawoun']){
  assert.ok(CLUBES.some(c=>c.nome===nome));
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha);
  assert.ok(ficha.marcos.length>0);
  assert.deepEqual(ficha.recordes,[]);
  for(const m of ficha.marcos)assert.ok(m.fonte.startsWith('https://'));
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.ok(a.fonte.startsWith('https://'));}
 }
});
