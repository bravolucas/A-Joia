import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE4} from '../src/dados/acervoClubesHistoricosLote4.js';
import {acervoClubeHistoricoDe,REFERENCIAS_RECORDES_CLUBES} from '../src/dados/acervoClubesHistoricos.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

test('o quarto lote tem 13 clubes estrangeiros e fontes específicas para cada atleta',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE4).length,13);
 for(const c of Object.values(ACERVO_CLUBES_LOTE4)){
  assert.strictEqual(acervoClubeHistoricoDe(c.clube),c);
  assert.ok(c.atletas.length>0);
  for(const a of c.atletas){
   assert.ok(a.nome);
   assert.match(a.fonte,/^https:\/\//);
   for(const k of ['jogos','gols'])assert.ok(a[k]===null||Number.isInteger(a[k])&&a[k]>0);
  }
  for(const r of c.recordes){
   assert.ok(c.atletas.some(a=>a.nome===r.atleta));
   assert.ok(r.criterio);
   assert.equal(r.comparavel,false);
  }
  for(const marco of c.marcos||[]){
   assert.ok(marco.titulo&&marco.descricao&&marco.fonte.startsWith('https://'));
  }
 }
});
test('o recorte de ligas e temporadas não fabrica recordes de carreira',()=>{
 for(const nome of ['PSG','Monaco','Lyon','Athletic Bilbao','Marseille','PSV','Ajax']){
  assert.equal(acervoClubeHistoricoDe(nome).recordes.length,0,nome);
 }
 const city=acervoClubeHistoricoDe('Manchester City');
 assert.equal(city.atletas[0].gols,260);
 assert.equal(city.atletas[0].jogos,390);
 const sevilha=acervoClubeHistoricoDe('Sevilla');
 assert.equal(sevilha.recordes[0].id,'jogosCarreira');
 assert.equal(sevilha.recordes[0].valor,705);
 assert.equal(REFERENCIAS_RECORDES_CLUBES.find(r=>r.nome==='Sevilla').valor,705);
 const h=consultarRecordesFutebol({},'clube','Manchester City').recordes.find(r=>r.id==='golsCarreira');
 assert.equal(h.real.valor,260);
 assert.equal(h.simulado,null);
 assert.match(h.status,/critério distinto/);
});
