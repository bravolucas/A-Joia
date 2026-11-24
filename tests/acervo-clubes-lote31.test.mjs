import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE31} from '../src/dados/acervoClubesHistoricosLote31.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 31 inclui Angers, Brest e Paris FC como clubes do catálogo',()=>{
 const nomes=['Angers','Brest','Paris FC'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE31).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'fora do catálogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha.marcos.length>=2);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  assert.deepEqual(ficha.recordes,[]);
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);}
 }
});
test('Angers registra apenas finais, não títulos da Copa da França',()=>{
 const f=acervoClubeHistoricoDe('Angers');
 assert.deepEqual(f.marcos.filter(x=>x.titulo==='Vice-campeão da Copa da França').map(x=>x.ano),[1957,2017]);
 assert.equal(f.marcos.filter(x=>x.titulo==='Campeão da Copa da França').length,0);
 assert.ok(f.atletas.some(a=>a.nome==='Raymond Kopa'));
});
test('Brest de 1981, e Paris FC de 2025, mantêm identidades e períodos corretos',()=>{
 const b=acervoClubeHistoricoDe('Brest'),p=acervoClubeHistoricoDe('Paris FC');
 assert.ok(b.marcos.some(x=>x.ano===1981&&/segunda divisão/.test(x.titulo)));
 assert.ok(p.marcos.some(x=>x.ano===1972&&/PSG/.test(x.titulo)));
 assert.ok(p.marcos.some(x=>x.ano===2025&&/primeira divisão/.test(x.titulo)));
 assert.ok(!p.marcos.some(x=>x.titulo==='Campeão francês'));
});
