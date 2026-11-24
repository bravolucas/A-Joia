import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE26} from '../src/dados/acervoClubesHistoricosLote26.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 26: documentos históricos de Kocaelispor e Gençlerbirliği, sem recordes arbitrários',()=>{
 const nomes=['Kocaelispor','Gençlerbirliği'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE26).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'clube fora do catálogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.equal(ficha?.clube,nome);
  assert.ok(ficha.marcos.length>=5);
  assert.ok(ficha.atletas.length>=1);
  assert.ok(ficha.tecnicos.length>=1);
  assert.deepEqual(ficha.recordes,[]);
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const j of ficha.atletas){assert.equal(j.jogos,null);assert.equal(j.gols,null);assert.match(j.fonte,/^https:\/\//);}
 }
 assert.ok(acervoClubeHistoricoDe('Kocaelispor').marcos.some(m=>m.ano===1997));
 assert.ok(acervoClubeHistoricoDe('Gençlerbirliği').marcos.some(m=>m.ano===1941));
});

test('novo lote aprofunda sem apagar os registros antigos do lote 17',()=>{
 const k=acervoClubeHistoricoDe('Kocaelispor');
 const g=acervoClubeHistoricoDe('Gençlerbirliği');
 assert.ok(k.atletas.some(a=>a.nome==='Zdravko Lazarov'));
 assert.ok(k.atletas.some(a=>a.nome==='Cihan Haspolatlı'));
 assert.ok(k.atletas.some(a=>a.nome==='Faruk Yiğit'));
 assert.ok(k.tecnicos.some(t=>t.nome==='Hikmet Karaman'));
 assert.ok(k.tecnicos.some(t=>t.nome==='Güvenç Kurtar'));
 assert.ok(g.atletas.some(a=>a.nome==='Filip Daems'));
 assert.ok(g.atletas.some(a=>a.nome==='Hasan Polat'));
 assert.equal(k.marcos.filter(m=>m.ano===1997&&/Copa da Turquia/.test(m.titulo)).length,1);
 assert.equal(k.marcos.filter(m=>m.ano===2002&&/Copa da Turquia/.test(m.titulo)).length,1);
});
