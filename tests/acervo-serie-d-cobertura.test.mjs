import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE9} from '../src/dados/acervoClubesHistoricosLote9.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('todos os 23 clubes do catalogo da Serie D possuem ficha historica inicial',()=>{
 const divisao=CLUBES.filter(c=>c.liga==='serieD');
 assert.equal(divisao.length,23);
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE9).length,23);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,141);
 const jogo=new Set(divisao.map(x=>x.nome));
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE9)){
  assert.ok(jogo.has(nome),'Clube nao pertence ao catalogo da Serie D: '+nome);
  assert.strictEqual(acervoClubeHistoricoDe(nome),c);
  assert.ok(c.atletas.length>0);
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(x=>x.nome===nome)?.cobertura,'parcial_documentado');
 }
});

test('fontes e recortes da Serie D nao introduzem recordes globais ficticios',()=>{
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE9)){
  for(const j of c.atletas){
   assert.ok(j.nome&&j.descricao&&j.fonte.startsWith('https://'),nome+' sem fonte');
   for(const campo of ['jogos','gols']){
    assert.ok(j[campo]===null||(Number.isInteger(j[campo])&&j[campo]>0));
   }
  }
  for(const m of c.marcos){
   assert.ok(m.titulo&&m.fonte.startsWith('https://'));
   assert.ok(Number.isInteger(m.ano)&&m.ano>=1950&&m.ano<=2026);
  }
  for(const tec of c.tecnicos){
   assert.ok(tec.nome&&tec.periodo&&tec.fonte.startsWith('https://'));
  }
  assert.equal(c.recordes.length,0,'Sem fonte total comparável, não deve haver recorde absoluto: '+nome);
 }
});

test('marcos reais: ABC, Uberlandia, Sampaio, Ferroviario e Portuguesa-RJ',()=>{
 const buscar=nome=>acervoClubeHistoricoDe(nome);
 assert.ok(buscar('ABC').marcos.some(m=>m.ano===2010));
 assert.equal(buscar('ABC').tecnicos[0].nome,'Leandro Campos');
 assert.ok(buscar('Uberlândia').marcos.some(m=>m.ano===2026));
 assert.equal(buscar('Uberlândia').tecnicos[0].nome,'Danilo');
 assert.deepEqual(buscar('Sampaio Corrêa').marcos.map(m=>m.ano),[1972,1997,2012]);
 assert.deepEqual(buscar('Ferroviário').marcos.map(m=>m.ano),[2018,2023]);
 assert.deepEqual(buscar('Portuguesa-RJ').marcos.map(m=>m.ano),[2023,2025]);
 assert.equal(buscar('Altos').atletas[0].jogos,218);
 assert.equal(buscar('Altos').atletas[0].gols,84);
 assert.ok(buscar('Retrô').marcos.some(m=>m.ano===2024));
 assert.ok(buscar('Brasiliense').marcos.some(m=>m.ano===2004));
});

test('partidas historicas nao transformam gols de uma unica competicao em recorde geral',()=>{
 const buscar=nome=>acervoClubeHistoricoDe(nome);
 for(const clube of ['Gama','Uberlândia','América-RN','Manaus','Porto Velho','Aparecidense']){
  assert.ok(buscar(clube).atletas.every(a=>a.gols===null),clube+' confundiu recortes');
 }
 assert.equal(buscar('Gama').tecnicos[0].nome,'Vágner Benazzi');
 assert.equal(buscar('Tombense').tecnicos[0].nome,'Eugênio Souza');
 assert.equal(buscar('São José-RS').tecnicos[0].nome,'Rafael Jaques');
});
