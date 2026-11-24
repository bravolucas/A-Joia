import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE33} from '../src/dados/acervoClubesHistoricosLote33.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 33 documenta Le Mans e mantém identidade MUC 72/Le Mans FC',()=>{
 const times=CLUBES.filter(c=>c.liga==='franca');
 assert.equal(times.length,18);
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE33),['Le Mans']);
 assert.ok(times.some(c=>c.nome==='Le Mans'));
 const f=acervoClubeHistoricoDe('Le Mans');
 assert.equal(f.clube,'Le Mans');
 assert.ok(f.atletas.length>=3&&f.marcos.length>=8);
 assert.ok(f.marcos.some(m=>m.ano===1985&&/MUC 72/.test(m.descricao)));
 assert.ok(f.marcos.some(m=>m.ano===2010&&/Mudança/.test(m.titulo)));
 assert.ok(f.marcos.some(m=>m.ano===2013&&/Liquidação/.test(m.titulo)));
 assert.ok(f.marcos.some(m=>m.ano===2026&&/Ligue 1/.test(m.titulo)));
 assert.ok(!f.marcos.some(m=>m.ano===2008&&/Campeão/.test(m.titulo)));
 assert.deepEqual(f.recordes,[]);
 for(const a of f.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.match(a.fonte,/^https:\/\//);}
 for(const m of f.marcos)assert.match(m.fonte,/^https:\/\//);
 assert.equal(coberturaHistoricaDe('clube','Le Mans').cobertura,'parcial_documentado');
});

test('todos os 18 clubes cadastrados na Ligue 1 têm ficha histórica inicial',()=>{
 for(const c of CLUBES.filter(c=>c.liga==='franca')){
  const f=acervoClubeHistoricoDe(c.nome);
  assert.ok(f,'ficha ausente: '+c.nome);
  assert.ok(f.atletas?.length||f.marcos?.length||f.recordes?.length,'ficha sem fatos: '+c.nome);
  assert.equal(coberturaHistoricaDe('clube',c.nome)?.cobertura,'parcial_documentado');
 }
});
