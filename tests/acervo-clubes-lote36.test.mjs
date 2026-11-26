import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE36} from '../src/dados/acervoClubesHistoricosLote36.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 36 adiciona Caen e Bastia ao catalogo da Ligue 2',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE36).sort(),['Bastia','Caen']);
 for(const nome of ['Caen','Bastia']){
  assert.ok(CLUBES.some(c=>c.nome===nome&&c.liga==='franca2'),'fora da Ligue 2 do jogo: '+nome);
  const f=acervoClubeHistoricoDe(nome);
  assert.ok(f?.marcos?.length>=6);
  assert.ok(f?.atletas?.length>=2);
  assert.ok(f?.tecnicos?.length>=1);
  assert.deepEqual(f.recordes,[],'nao transformar dados de epoca em recordes absolutos');
  assert.equal(coberturaHistoricaDe('clube',nome)?.cobertura,'parcial_documentado');
  for(const a of f.atletas){
   assert.equal(a.jogos,null);
   assert.equal(a.gols,null);
   assert.match(a.fonte,/^https:\/\//);
  }
  for(const marco of f.marcos) assert.match(marco.fonte,/^https:\/\//);
 }
});

test('Caen: dois titulos de Ligue 2 e vice da Copa da Liga em 2005',()=>{
 const ficha=acervoClubeHistoricoDe('Caen');
 assert.deepEqual(ficha.marcos.filter(m=>m.titulo==='Campeão da segunda divisão francesa').map(m=>m.ano),[1996,2010]);
 assert.ok(ficha.marcos.some(m=>m.ano===2005&&m.titulo==='Vice-campeão da Copa da Liga Francesa'));
 assert.ok(!ficha.marcos.some(m=>m.ano===2005&&m.titulo==='Campeão da Copa da Liga Francesa'));
 assert.ok(ficha.atletas.some(a=>a.nome==='Xavier Gravelaine'&&/110 jogos e 45 gols/.test(a.descricao)));
});

test('Bastia: vice da UEFA em 1978, Copa da França 1981 e Intertoto 1997',()=>{
 const ficha=acervoClubeHistoricoDe('Bastia');
 assert.ok(ficha.marcos.some(m=>m.ano===1978&&m.titulo==='Vice-campeão da Copa UEFA'));
 assert.ok(!ficha.marcos.some(m=>m.ano===1978&&/^Campeão da Copa UEFA$/.test(m.titulo)));
 assert.ok(ficha.marcos.some(m=>m.ano===1981&&m.titulo==='Campeão da Copa da França'));
 assert.ok(ficha.marcos.some(m=>m.ano===1997&&m.titulo==='Campeão da Copa Intertoto'));
 assert.deepEqual(ficha.marcos.filter(m=>m.titulo==='Campeão da segunda divisão francesa'||m.titulo==='Campeão da Ligue 2').map(m=>m.ano),[1968,2012]);
});
