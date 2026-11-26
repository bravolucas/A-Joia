import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE22} from '../src/dados/acervoClubesHistoricosLote22.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 22: fichas dos clubes turco e sauditas sem fontes ou recordes inventados',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE22).length,3);
 for(const nome of ['Rizespor','Al-Qadsiah','Al-Khaleej']){
  assert.ok(CLUBES.some(c=>c.nome===nome),'clube faltando no jogo '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.equal(ficha.clube,nome);
  assert.ok(ficha.marcos.length>0);
  assert.deepEqual(ficha.recordes,[]);
  for(const marco of ficha.marcos)assert.ok(marco.fonte.startsWith('https://'));
  for(const atleta of ficha.atletas){assert.equal(atleta.gols,null);assert.equal(atleta.jogos,null);assert.ok(atleta.fonte.startsWith('https://'));}
 }
});
