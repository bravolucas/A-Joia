import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE32} from '../src/dados/acervoClubesHistoricosLote32.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 32 documenta Lorient, Troyes e Reims com suas identidades atuais',()=>{
 const nomes=['Lorient','Troyes','Reims'];
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE32).sort(),[...nomes].sort());
 for(const nome of nomes){
  assert.ok(CLUBES.some(c=>c.nome===nome),'Clube não existe no catálogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha?.marcos?.length>0);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  assert.deepEqual(ficha.recordes,[]);
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);}
 }
});
test('Lorient diferencia Copa da França e vice da Copa da Liga de 2002',()=>{
 const m=acervoClubeHistoricoDe('Lorient').marcos;
 assert.ok(m.some(x=>x.ano===2002&&x.titulo==='Campeão da Copa da França'));
 assert.ok(m.some(x=>x.ano===2002&&x.titulo==='Vice-campeão da Copa da Liga'));
});
test('Troyes registra Intertoto 2001 e Ligue 2 2015 e 2021',()=>{
 const m=acervoClubeHistoricoDe('Troyes').marcos;
 assert.ok(m.some(x=>x.ano===2001&&/Intertoto/.test(x.titulo)));
 assert.deepEqual(m.filter(x=>x.titulo==='Campeão da Ligue 2').map(x=>x.ano),[2015,2021]);
});
test('Reims registra títulos distintos e duas finais europeias sem títulos fictícios',()=>{
 const m=acervoClubeHistoricoDe('Reims').marcos;
 assert.equal(m.filter(x=>x.titulo==='Campeão francês').length,6);
 assert.equal(m.filter(x=>x.titulo==='Campeão da Copa da França').length,2);
 assert.deepEqual(m.filter(x=>x.titulo==='Vice-campeão da Copa dos Campeões da Europa').map(x=>x.ano),[1956,1959]);
});
