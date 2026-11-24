import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE28} from '../src/dados/acervoClubesHistoricosLote28.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';
import {CLUBES} from '../src/dados/data.js';

test('lote 28 documenta três clubes franceses existentes no jogo',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE28).sort(),['Nantes','Nice','Strasbourg'].sort());
 for(const nome of Object.keys(ACERVO_CLUBES_LOTE28)){
  assert.ok(CLUBES.some(c=>c.nome===nome&&c.liga==='franca'),'clube da Ligue 1: '+nome);
  const ficha=acervoClubeHistoricoDe(nome);
  assert.ok(ficha&&ficha.marcos.length>0);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  assert.deepEqual(ficha.recordes,[]);
  for(const marco of ficha.marcos)assert.match(marco.fonte,/^https:\/\//);
  for(const atleta of ficha.atletas){assert.equal(atleta.jogos,null);assert.equal(atleta.gols,null);}
 }
});
test('títulos do Nantes, Nice e Strasbourg preservam competição e edição',()=>{
 const n=acervoClubeHistoricoDe('Nantes').marcos;
 assert.equal(n.filter(m=>m.titulo==='Campeão da primeira divisão francesa').length,8);
 assert.equal(n.filter(m=>m.titulo==='Campeão da Copa da França').length,4);
 const nice=acervoClubeHistoricoDe('Nice').marcos;
 assert.equal(nice.filter(m=>m.titulo==='Campeão da primeira divisão francesa').length,4);
 assert.equal(nice.filter(m=>m.titulo==='Campeão da Copa da França').length,3);
 const s=acervoClubeHistoricoDe('Strasbourg').marcos;
 assert.ok(s.some(m=>m.ano===1979&&m.titulo==='Campeão da primeira divisão francesa'));
 assert.equal(s.filter(m=>m.titulo==='Campeão da Copa da Liga Francesa').length,3);
});
