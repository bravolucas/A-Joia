import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE18} from '../src/dados/acervoClubesHistoricosLote18.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';
test('lote 18 inclui quatro fichas de clubes existentes no catálogo',()=>{
 const nomes=['Alanyaspor','Kasımpaşa','Antalyaspor','Al-Shabab'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE18).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(x=>x.nome===nome),'nome ausente no jogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha&&ficha.atletas.length>0,'ficha/atletas não encontrados: '+nome);
  assert.ok(ficha.marcos.length>0);
  assert.deepEqual(ficha.recordes,[]);
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.ok(a.fonte.startsWith('https://'));}
 }
});
