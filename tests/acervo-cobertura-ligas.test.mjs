import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe,INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('as ligas turca e saudita têm fichas iniciais documentadas em todos os clubes do catálogo',()=>{
 for(const liga of ['turquia','arabia']){
  const times=CLUBES.filter(c=>c.liga===liga);
  assert.ok(times.length>=16);
  for(const t of times){
   const ficha=acervoClubeHistoricoDe(t.nome);
   assert.ok(ficha,'Ficha ausente: '+liga+' / '+t.nome);
   assert.ok(ficha.atletas?.length||ficha.marcos?.length||ficha.recordes?.length,'Ficha sem fatos: '+t.nome);
   assert.equal(coberturaHistoricaDe('clube',t.nome)?.cobertura,'parcial_documentado');
  }
 }
});
test('fichas iniciais registram atletas e marcos como cobertura parcial',()=>{
 const nome='Al-Khaleej',ficha=acervoClubeHistoricoDe(nome),status=coberturaHistoricaDe('clube',nome);
 assert.ok(ficha.marcos.length);
 assert.ok(ficha.atletas.length);
 assert.equal(status.cobertura,'parcial_documentado');
 assert.equal(status.atletasDocumentados,ficha.atletas.length);
 assert.ok(status.marcosDocumentados>0);
});
test('inventário de cobertura corresponde ao acervo e não a uma contagem congelada',()=>{
 const fichas=Object.values(ACERVO_CLUBES_HISTORICOS);
 assert.ok(fichas.length>=247);
 const nomes=new Set(fichas.map(f=>f.clube));
 assert.equal(nomes.size,fichas.length,'não duplicar registros de clubes');
 for(const reg of INVENTARIO_CLUBES_HISTORICOS){
  if(reg.cobertura==='parcial_documentado')assert.ok(reg.atletasDocumentados||reg.marcosDocumentados||reg.recordesDocumentados);
 }
});

test('todos os clubes jogáveis têm ao menos um atleta com fonte histórica',()=>{
 assert.ok(CLUBES.length>=407);
 for(const {nome} of CLUBES){
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha?.atletas.some(atleta=>atleta.nome&&atleta.fonte?.startsWith('https://')),nome);
 }
});
