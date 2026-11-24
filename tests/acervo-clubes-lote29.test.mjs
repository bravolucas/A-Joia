import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE29} from '../src/dados/acervoClubesHistoricosLote29.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {CLUBES} from '../src/dados/data.js';
test('lote 29 integra Lille e Toulouse sem inventar gols completos',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE29).sort(),['Lille','Toulouse']);
 for(const nome of ['Lille','Toulouse']){
  assert.ok(CLUBES.some(c=>c.nome===nome),'clube ausente: '+nome);
  const f=acervoClubeHistoricoDe(nome);
  assert.ok(f?.marcos?.length);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  assert.deepEqual(f.recordes,[]);
  for(const a of f.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.match(a.fonte,/^https:\/\//);}
  for(const m of f.marcos)assert.match(m.fonte,/^https:\/\//);
 }
});
test('Lille soma quatro ligas e seis Copas da França, cada título em ano específico',()=>{
 const m=acervoClubeHistoricoDe('Lille').marcos;
 assert.deepEqual(m.filter(x=>x.titulo==='Campeão da primeira divisão francesa').map(x=>x.ano),[1946,1954,2011,2021]);
 assert.deepEqual(m.filter(x=>x.titulo==='Campeão da Copa da França').map(x=>x.ano),[1946,1947,1948,1953,1955,2011]);
});
test('Toulouse atual não herda indevidamente a Copa de 1957',()=>{
 const f=acervoClubeHistoricoDe('Toulouse');
 assert.ok(f.marcos.some(x=>x.ano===2023&&/Copa da França/.test(x.titulo)));
 assert.ok(!f.marcos.some(x=>x.ano===1957));
});
