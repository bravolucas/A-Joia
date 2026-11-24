import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE25} from '../src/dados/acervoClubesHistoricosLote25.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';
test('lote 25 preserva identidade Fatih Karagümrük e Al-Orobah sem estatísticas supostas',()=>{
 const nomes=['Fatih Karagümrük','Al-Orobah'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE25).sort(),nomes.sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'Clube ausente no elenco do jogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.equal(ficha.clube,nome);
  assert.ok(ficha.marcos.length>=4);
  assert.equal(ficha.recordes.length,0);
  for(const m of ficha.marcos){assert.ok(Number.isInteger(m.ano));assert.match(m.fonte,/^https:\/\//);}
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.match(a.fonte,/^https:\/\//);}
 }
 assert.ok(acervoClubeHistoricoDe('Fatih Karagümrük').marcos.some(m=>m.ano===2020));
 assert.ok(acervoClubeHistoricoDe('Al-Orobah').marcos.some(m=>m.ano===2013));
});
