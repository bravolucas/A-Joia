import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE23} from '../src/dados/acervoClubesHistoricosLote23.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 23 agrega Al-Fayha e Al-Wehda com história verificável e sem estatísticas presumidas',()=>{
 const nomes=['Al-Fayha','Al-Wehda'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE23).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'nome ausente no jogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha&&ficha.marcos.length>=3);
  assert.ok(ficha.atletas.length>=2);
  assert.deepEqual(ficha.recordes,[]);
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.match(a.fonte,/^https:\/\//);}
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
 }
 assert.ok(acervoClubeHistoricoDe('Al-Fayha').marcos.some(m=>m.ano===2022&&/Copa do Rei/.test(m.titulo)));
 assert.ok(acervoClubeHistoricoDe('Al-Wehda').marcos.some(m=>m.ano===1957));
});
