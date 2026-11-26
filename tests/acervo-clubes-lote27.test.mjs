import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE27} from '../src/dados/acervoClubesHistoricosLote27.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 27 tem Lens e Rennes documentados e corretamente indexados',()=>{
 const nomes=['Lens','Rennes'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE27).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'Nome do clube não existe no catálogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha&&ficha.marcos.length>=3);
  assert.ok(ficha.tecnicos.length>0);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  assert.deepEqual(ficha.recordes,[]);
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const a of ficha.atletas){assert.equal(a.gols,null);assert.equal(a.jogos,null);}
 }
});
test('Copas da França do Rennes mantêm as três edições distintas',()=>{
 const f=acervoClubeHistoricoDe('Rennes');
 assert.deepEqual(f.marcos.map(m=>m.ano).sort(),[1965,1971,2019]);
});
test('RC Lens preserva títulos francês e da Copa da Liga como troféus distintos',()=>{
 const f=acervoClubeHistoricoDe('Lens');
 assert.ok(f.marcos.some(m=>m.ano===1998&&/Campeão francês/.test(m.titulo)));
 assert.ok(f.marcos.some(m=>m.ano===1999&&/Copa da Liga/.test(m.titulo)));
 assert.ok(f.atletas.some(a=>a.nome==='Yoann Lachor'));
});
