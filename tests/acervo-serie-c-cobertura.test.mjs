import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE8} from '../src/dados/acervoClubesHistoricosLote8.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

test('todos os 20 clubes da Série C no catálogo possuem ficha inicial documentada',()=>{
 const serieC=CLUBES.filter(x=>x.liga==='serieC');
 assert.equal(serieC.length,20);
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE8).length,17);
 assert.ok(Object.keys(ACERVO_CLUBES_HISTORICOS).length>=118);
 for(const clube of serieC){
  const acervo=acervoClubeHistoricoDe(clube.nome);
  assert.ok(acervo,clube.nome+' ainda sem acervo');
  assert.ok(acervo.atletas.length>0,clube.nome+' sem atleta historico');
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(x=>x.nome===clube.nome)?.cobertura,'parcial_documentado');
 }
});

test('fontes dos 17 novos clubes e estatísticas delimitadas ao recorte efetivo',()=>{
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE8)){
  assert.strictEqual(acervoClubeHistoricoDe(nome),c);
  assert.ok(c.atletas.length>0);
  for(const j of c.atletas){
   assert.ok(j.nome&&j.posicao&&j.descricao&&j.fonte.startsWith('https://'),nome+' '+j.nome);
   for(const campo of ['jogos','gols'])
    assert.ok(j[campo]===null||(Number.isInteger(j[campo])&&j[campo]>0));
  }
  for(const m of c.marcos){
   assert.ok(m.titulo&&m.descricao&&m.fonte.startsWith('https://'));
   assert.ok(m.ano===null||(Number.isInteger(m.ano)&&m.ano>1900));
  }
  for(const t of c.tecnicos){
   assert.ok(t.nome&&t.periodo&&t.descricao&&t.fonte.startsWith('https://'));
  }
  for(const r of c.recordes){
   assert.equal(r.comparavel,false);
   assert.ok(r.criterio&&r.fonte.startsWith('https://'));
   assert.ok(c.atletas.some(a=>a.nome===r.atleta));
  }
 }
});

test('Série C preserva marcos históricos sem contagens inventadas',()=>{
 const get=nome=>acervoClubeHistoricoDe(nome);
 assert.equal(get('Ituano').atletas[0].gols,147);
 assert.equal(consultarRecordesFutebol({},'clube','Ituano').recordes.find(x=>x.id==='golsCarreira')?.real?.valor,147);
 assert.equal(get('Amazonas FC').atletas[0].gols,29);
 assert.ok(get('Amazonas FC').atletas[0].descricao.includes('2025'));
 assert.equal(get('Brusque').atletas[0].gols,null,'10 gols foram apenas na Série D 2019');
 assert.equal(get('Floresta').recordes.length,0);
 assert.equal(get('Caxias').tecnicos[0].nome,'Tite');
 assert.equal(get('Botafogo-PB').tecnicos[0].nome,'Marcelo Vilar');
 assert.equal(get('Maringá').tecnicos[0].nome,'Jorge Castilho');
 assert.equal(get('Maranhão').tecnicos[0].nome,'Marcinho Guerreiro');
 assert.ok(get('Santa Cruz').marcos.some(m=>m.ano===2013));
 assert.ok(get('Volta Redonda').marcos.some(m=>m.ano===2024));
 assert.ok(get('Barra-SC').marcos.some(m=>m.ano===2025));
});
