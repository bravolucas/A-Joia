import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE11} from '../src/dados/acervoClubesHistoricosLote11.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 11 agrega 11 clubes realmente presentes no catálogo e 168 fichas',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE11).length,11);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,168);
 const nomes=new Set(CLUBES.map(x=>x.nome));
 for(const [nome,clube] of Object.entries(ACERVO_CLUBES_LOTE11)){
  assert.ok(nomes.has(nome),'Clube fora do cadastro principal: '+nome);
  assert.strictEqual(acervoClubeHistoricoDe(nome),clube);
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(x=>x.nome===nome)?.cobertura,'parcial_documentado');
  assert.ok(clube.atletas.length>0,nome+' sem atleta');
  for(const j of clube.atletas){
   assert.ok(j.nome&&j.descricao&&j.fonte.startsWith('https://'));
   assert.equal(j.jogos,null,'números por edição não viram total de carreira');
   assert.equal(j.gols,null,'gols por partida ou temporada não viram total de carreira');
  }
  for(const m of clube.marcos){
   assert.ok(m.ano>=1900&&m.ano<=2026);
   assert.ok(m.titulo&&m.descricao&&m.fonte.startsWith('https://'));
  }
  for(const t of clube.tecnicos)assert.ok(t.nome&&t.periodo&&t.descricao&&t.fonte.startsWith('https://'));
  assert.equal(clube.recordes.length,0,'não há recorde de carreira apurado no lote 11');
 }
});

test('Alemanha, Itália e Espanha têm títulos datados sem inventar outros',()=>{
 const c=nome=>acervoClubeHistoricoDe(nome);
 for(const nome of ['Atalanta','Leverkusen','Eintracht Frankfurt','Stuttgart','Deportivo La Coruña']){
  assert.ok(c(nome).marcos.some(m=>m.ano===({'Atalanta':2024,'Leverkusen':2024,'Eintracht Frankfurt':2022,'Stuttgart':2007,'Deportivo La Coruña':2004})[nome]));
 }
 assert.deepEqual(c('Borussia Mönchengladbach').marcos.map(m=>m.ano),[1975,1979]);
 assert.equal(c('Parma').marcos[0].ano,1999);
 assert.equal(c('Werder Bremen').marcos[0].ano,1992);
 assert.equal(c('Schalke 04').marcos[0].ano,1997);
 assert.equal(c('Fiorentina').marcos[0].ano,2024);
 assert.equal(c('Celta Vigo').marcos[0].ano,2017);
});

test('hat-tricks e gols de uma edição não entram no quadro de recordes absolutos',()=>{
 const atl=acervoClubeHistoricoDe('Atalanta').atletas[0];
 assert.match(atl.descricao,/três gols/);
 assert.equal(atl.gols,null);
 const glad=acervoClubeHistoricoDe('Borussia Mönchengladbach').atletas[0];
 assert.match(glad.descricao,/três gols/);
 assert.equal(glad.gols,null);
 const stuttgart=acervoClubeHistoricoDe('Stuttgart').atletas[0];
 assert.match(stuttgart.descricao,/14 gols em 25 jogos somente na Bundesliga/);
 assert.equal(stuttgart.gols,null);
});

test('técnicos de campanhas históricas têm ficha e fonte específica',()=>{
 for(const [nome,treinador] of [
  ['Atalanta','Gian Piero Gasperini'],
  ['Leverkusen','Xabi Alonso'],
  ['Deportivo La Coruña','Javier Irureta'],
  ['Fiorentina','Vincenzo Italiano'],
  ['Celta Vigo','Eduardo Berizzo'],
 ]){
  assert.ok(acervoClubeHistoricoDe(nome).tecnicos.some(t=>t.nome===treinador),nome);
 }
});
