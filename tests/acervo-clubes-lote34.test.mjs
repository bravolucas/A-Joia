import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE34} from '../src/dados/acervoClubesHistoricosLote34.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

test('lote 34 inclui Saint-Étienne e Bordeaux como clubes do catálogo de Ligue 2',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE34).sort(),['Bordeaux','Saint-Étienne'].sort());
 for(const nome of Object.keys(ACERVO_CLUBES_LOTE34)){
  assert.ok(CLUBES.some(c=>c.nome===nome&&c.liga==='franca2'),nome+' fora da Ligue 2 do jogo');
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha.marcos.length>=10);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const a of ficha.atletas)assert.match(a.fonte,/^https:\/\//);
 }
});
test('Saint-Étienne: dez campeonatos, seis Copas da França e final europeia não vitoriosa',()=>{
 const marcos=acervoClubeHistoricoDe('Saint-Étienne').marcos;
 assert.equal(marcos.filter(x=>x.titulo==='Campeão francês').length,10);
 assert.equal(marcos.filter(x=>x.titulo==='Campeão da Copa da França').length,6);
 assert.equal(marcos.filter(x=>x.titulo==='Campeão da Ligue 2').length,3);
 assert.ok(marcos.some(x=>x.ano===1976&&x.titulo==='Vice-campeão europeu'));
 assert.deepEqual(acervoClubeHistoricoDe('Saint-Étienne').recordes,[]);
});
test('Bordeaux: títulos documentados e dois recordes Giresse sem comparação indevida com saves',()=>{
 const ficha=acervoClubeHistoricoDe('Bordeaux');
 assert.equal(ficha.marcos.filter(x=>x.titulo==='Campeão francês').length,6);
 assert.equal(ficha.marcos.filter(x=>x.titulo==='Campeão da Copa da França').length,4);
 assert.equal(ficha.marcos.filter(x=>x.titulo==='Campeão da Copa da Liga Francesa').length,3);
 assert.deepEqual(ficha.recordes.map(x=>[x.id,x.valor]).sort(),[['golsCarreira',158],['jogosCarreira',519]].sort());
 const save={nome:'Atleta fictício',temporadas:[{ano:2040,clube:'Bordeaux',jogos:50,gols:200,assist:0}]};
 const registros=consultarRecordesFutebol(save,'clube','Bordeaux').recordes;
 for(const [id,valor] of [['golsCarreira',158],['jogosCarreira',519]]){
  const rec=registros.find(x=>x.id===id);
  assert.equal(rec?.real?.valor,valor);
  assert.equal(rec.real?.comparavel,false);
  assert.match(rec.status,/critério distinto/);
 }
 const gols=registros.find(x=>x.id==='golsCarreira');
 assert.ok(gols.simulado?.valor>=200);
 assert.ok(!/Superado no save/.test(gols.status));
});
