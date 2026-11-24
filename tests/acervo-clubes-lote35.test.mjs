import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE35} from '../src/dados/acervoClubesHistoricosLote35.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 35: Metz e Guingamp são clubes reais do catálogo e têm fontes por fato',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE35).sort(),['Guingamp','Metz']);
 for(const nome of ['Metz','Guingamp']){
  assert.ok(CLUBES.some(c=>c.nome===nome&&c.liga==='franca2'),nome+' não está na Ligue 2 do jogo');
  const ficha=acervoClubeHistoricoDe(nome);
  assert.equal(ficha.clube,nome);
  assert.ok(ficha.atletas.length&&ficha.marcos.length&&ficha.tecnicos.length);
  assert.deepEqual(ficha.recordes,[]);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);assert.match(a.fonte,/^https:\/\//);}
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const t of ficha.tecnicos)assert.match(t.fonte,/^https:\/\//);
 }
});
test('Metz distingue quatro títulos D2, duas Copas da França, duas Copas da Liga e vice 1998',()=>{
 const marcos=acervoClubeHistoricoDe('Metz').marcos;
 assert.deepEqual(marcos.filter(m=>m.titulo==='Campeão da segunda divisão francesa').map(m=>m.ano),[1935,2007,2014,2019]);
 assert.deepEqual(marcos.filter(m=>m.titulo==='Campeão da Copa da França').map(m=>m.ano),[1984,1988]);
 assert.deepEqual(marcos.filter(m=>m.titulo==='Campeão da Copa da Liga Francesa').map(m=>m.ano),[1986,1996]);
 assert.ok(marcos.some(m=>m.ano===1998&&m.titulo==='Vice-campeão francês'));
 assert.ok(!marcos.some(m=>m.ano===1998&&m.titulo==='Campeão francês'));
});
test('Guingamp é bicampeão da Copa da França e vice da Copa da Liga 2019',()=>{
 const marcos=acervoClubeHistoricoDe('Guingamp').marcos;
 assert.deepEqual(marcos.filter(m=>m.titulo==='Campeão da Copa da França').map(m=>m.ano),[2009,2014]);
 assert.ok(marcos.some(m=>m.ano===2019&&m.titulo==='Vice-campeão da Copa da Liga Francesa'));
 assert.ok(!marcos.some(m=>m.titulo==='Campeão da Copa da Liga Francesa'));
});
