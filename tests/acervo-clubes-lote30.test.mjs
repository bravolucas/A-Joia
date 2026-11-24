import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE30} from '../src/dados/acervoClubesHistoricosLote30.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {CLUBES} from '../src/dados/data.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 30 registra Auxerre e Le Havre presentes no catálogo',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE30).sort(),['Auxerre','Le Havre']);
 for(const nome of ['Auxerre','Le Havre']){
  assert.ok(CLUBES.some(c=>c.nome===nome),'clube ausente no jogo: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha.marcos.length>=3);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  assert.deepEqual(ficha.recordes,[]);
  for(const m of ficha.marcos)assert.match(m.fonte,/^https:\/\//);
  for(const a of ficha.atletas){assert.equal(a.jogos,null);assert.equal(a.gols,null);}
 }
});
test('Auxerre guarda quatro Copas da França, em suas edições específicas',()=>{
 const m=acervoClubeHistoricoDe('Auxerre').marcos;
 assert.deepEqual(m.filter(x=>x.titulo==='Campeão da Copa da França').map(x=>x.ano),[1994,1996,2003,2005]);
 assert.ok(m.some(x=>x.ano===1996&&x.titulo==='Campeão francês'));
 assert.ok(acervoClubeHistoricoDe('Auxerre').tecnicos.some(t=>t.nome==='Guy Roux'));
});
test('Le Havre distingue título da Copa de 1959 e título da D2',()=>{
 const m=acervoClubeHistoricoDe('Le Havre').marcos;
 assert.ok(m.some(x=>x.ano===1959&&x.titulo==='Campeão da Copa da França'));
 assert.ok(m.some(x=>x.ano===1959&&x.titulo==='Campeão da segunda divisão francesa'));
});
