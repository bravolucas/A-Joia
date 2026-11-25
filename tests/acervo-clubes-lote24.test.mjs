import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE24} from '../src/dados/acervoClubesHistoricosLote24.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 24 acrescenta quatro clubes sauditas com fontes e sem recordes inventados',()=>{
 const nomes=['Al-Riyadh','Al-Raed','Damac','Al-Kholood'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE24).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'Clube ausente no catálogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.equal(ficha?.clube,nome);
  assert.ok(ficha.marcos.length>=3);
  assert.equal(ficha.recordes.length,0);
  for(const m of ficha.marcos){assert.ok(Number.isInteger(m.ano));assert.match(m.fonte,/^https:\/\//);}
  for(const a of ACERVO_CLUBES_LOTE24[nome].atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.equal(a.periodo,null);assert.match(a.fonte,/^https:\/\//);}
 }
 assert.ok(acervoClubeHistoricoDe('Al-Riyadh').marcos.some(m=>m.ano===1994));
 assert.ok(acervoClubeHistoricoDe('Al-Kholood').marcos.some(m=>m.ano===2024));
});
