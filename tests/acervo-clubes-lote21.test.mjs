import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE21} from '../src/dados/acervoClubesHistoricosLote21.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';
test('lote 21 valida Al-Ettifaq e Gaziantep FK sem confundir Gaziantepspor',()=>{
 for(const nome of ['Al-Ettifaq','Gaziantep']){
  assert.ok(CLUBES.some(c=>c.nome===nome),'identidade do jogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha);
  assert.ok(ficha.atletas.length>0);
  assert.ok(ficha.marcos.length>0);
  assert.equal(ficha.recordes.length,0);
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.ok(a.fonte.startsWith('https://'));}
  for(const marco of ficha.marcos)assert.ok(marco.fonte.startsWith('https://'));
 }
 assert.notEqual(ACERVO_CLUBES_LOTE21.Gaziantep.clube,'Gaziantepspor');
});
