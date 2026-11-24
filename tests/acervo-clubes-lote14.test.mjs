import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE14} from '../src/dados/acervoClubesHistoricosLote14.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 14 fecha a liga Inglaterra, com 20 de 20 fichas documentadas',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE14).length,4);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,191);
 const clubes=CLUBES.filter(c=>c.liga==='inglaterra');
 assert.equal(clubes.length,20);
 for(const c of clubes){
  const h=acervoClubeHistoricoDe(c.nome);
  assert.ok(h,c.nome+' ainda sem ficha histórica');
  assert.ok(h.atletas.length>0,c.nome+' sem atletas históricos');
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(x=>x.nome===c.nome)?.cobertura,'parcial_documentado');
 }
});

test('fontes, técnicos e marcos dos quatro ingleses não criam gols fictícios',()=>{
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE14)){
  assert.strictEqual(acervoClubeHistoricoDe(nome),c);
  assert.ok(c.atletas.length>0);
  for(const a of c.atletas){
   assert.ok(a.nome&&a.posicao&&a.descricao&&a.fonte.startsWith('https://'));
   assert.equal(a.jogos,null);
   assert.equal(a.gols,null);
  }
  assert.equal(c.recordes.length,0);
  for(const t of c.tecnicos)assert.ok(t.nome&&t.periodo&&t.descricao&&t.fonte.startsWith('https://'));
  for(const m of c.marcos)assert.ok(m.ano>=1980&&m.ano<=2026&&m.titulo&&m.descricao&&m.fonte.startsWith('https://'));
 }
 const h=acervoClubeHistoricoDe('Hull City');
 assert.equal(h.marcos[0].ano,2008);
 assert.equal(h.atletas[0].nome,'Dean Windass');
 assert.equal(h.tecnicos[0].nome,'Phil Brown');
 const i=acervoClubeHistoricoDe('Ipswich Town');
 assert.equal(i.marcos[0].ano,1981);
 assert.equal(i.tecnicos[0].nome,'Bobby Robson');
 assert.equal(acervoClubeHistoricoDe('Brentford').marcos[0].ano,2021);
 assert.equal(acervoClubeHistoricoDe('Bournemouth').marcos[0].ano,2015);
});

test('sete grupos de primeira camada documental completos não ocultam outras pendências',()=>{
 for(const [liga,total] of Object.entries({
  brasileirao:20,serieB:20,serieC:20,serieD:23,
  argentina:20,sulamericano:13,espanha:20,inglaterra:20,
 })){
  const clubes=CLUBES.filter(x=>x.liga===liga);
  assert.equal(clubes.length,total);
  assert.ok(clubes.every(x=>acervoClubeHistoricoDe(x.nome)?.atletas?.length>0),liga);
 }
 assert.ok(CLUBES.some(x=>!acervoClubeHistoricoDe(x.nome)),'as outras ligas ainda requerem apuração');
});
