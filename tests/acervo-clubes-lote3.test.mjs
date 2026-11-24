import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE3} from '../src/dados/acervoClubesHistoricosLote3.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

test('lote 3 documenta 23 clubes com fontes por atleta e marcos históricos',()=>{
 const clubes=Object.values(ACERVO_CLUBES_LOTE3);
 assert.equal(clubes.length,23);
 for(const clube of clubes){
  assert.ok(clube.clube&&clube.atletas.length);
  assert.ok(acervoClubeHistoricoDe(clube.clube)===clube);
  for(const atleta of clube.atletas){
   assert.ok(atleta.nome&&atleta.fonte.startsWith('https://'));
   for(const campo of ['gols','jogos'])assert.ok(atleta[campo]===null||
    Number.isInteger(atleta[campo])&&atleta[campo]>0,clube.clube+' '+atleta.nome+' '+campo);
  }
  for(const marco of clube.marcos||[]){
   assert.ok(marco.titulo&&marco.descricao&&marco.fonte.startsWith('https://'));
   assert.ok(marco.ano===null||marco.ano>1800);
  }
  for(const r of clube.recordes){
   assert.ok(clube.atletas.some(a=>a.nome===r.atleta));
   assert.equal(r.nome,clube.clube);
   assert.equal(r.comparavel,false);
   assert.ok(r.criterio&&r.fonte.startsWith('https://'));
  }
 }
});
test('pesquisa preserva escopo e não apresenta números setoriais como recordes globais',()=>{
 const bahia=acervoClubeHistoricoDe('Bahia');
 assert.equal(bahia.atletas.find(x=>x.nome==='Douglas Franklin').jogos,456);
 assert.equal(bahia.atletas.find(x=>x.nome==='Carlito').gols,233);
 assert.ok(!acervoClubeHistoricoDe('Ceará').recordes.length);
 assert.ok(!acervoClubeHistoricoDe('Figueirense').recordes.length);
 assert.equal(acervoClubeHistoricoDe('Figueirense').atletas[0].gols,null);
 assert.equal(acervoClubeHistoricoDe('Mirassol').marcos.length,3);
 assert.match(acervoClubeHistoricoDe('Coritiba').marcos[0].titulo,/933 minutos/);
 assert.match(acervoClubeHistoricoDe('Coritiba').marcos[0].descricao,/invencibilidade/);
 assert.ok(!acervoClubeHistoricoDe('Sport Recife').recordes.length);
 const camp=consultarRecordesFutebol({},'clube','Avaí').recordes.find(x=>x.id==='golsCarreira');
 assert.equal(camp.real.valor,219);
 assert.equal(camp.simulado,null);
 assert.match(camp.status,/critério distinto/);
 const uruguai=consultarRecordesFutebol({},'clube','Nacional de Montevidéu').recordes.find(x=>x.id==='golsCarreira');
 assert.equal(uruguai.real.valor,330);
});
