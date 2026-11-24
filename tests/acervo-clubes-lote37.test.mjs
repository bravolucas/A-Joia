import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE37} from '../src/dados/acervoClubesHistoricosLote37.js';
import {acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {coberturaHistoricaDe} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 37 inclui Ajaccio e Clermont Foot, ambos do catálogo da Ligue 2',()=>{
 assert.deepEqual(Object.keys(ACERVO_CLUBES_LOTE37).sort(),['Ajaccio','Clermont Foot']);
 for(const nome of ['Ajaccio','Clermont Foot']){
  assert.ok(CLUBES.some(c=>c.nome===nome&&c.liga==='franca2'),'clube não cadastrado: '+nome);
  const f=acervoClubeHistoricoDe(nome);
  assert.ok(f.marcos.length>=4&&f.atletas.length>=2);
  assert.deepEqual(f.recordes,[]);
  assert.equal(coberturaHistoricaDe('clube',nome).cobertura,'parcial_documentado');
  for(const atleta of f.atletas){
   assert.equal(atleta.jogos,null);
   assert.equal(atleta.gols,null);
   assert.ok(atleta.fonte.startsWith('https://'));
  }
  for(const marco of f.marcos)assert.ok(marco.fonte.startsWith('https://'));
 }
});
test('Ajaccio tem dois títulos de D2 e um título de National registrados em anos próprios',()=>{
 const f=acervoClubeHistoricoDe('Ajaccio');
 assert.deepEqual(f.marcos.filter(m=>m.titulo==='Campeão da segunda divisão francesa').map(m=>m.ano),[1967,2002]);
 assert.ok(f.marcos.some(m=>m.ano===1998&&m.titulo==='Campeão do National'));
 assert.ok(f.atletas.some(a=>a.nome==='Aurélio Moyano'));
 assert.ok(f.atletas.some(a=>a.nome==='Cyril Granon'));
});
test('Clermont de 2021 foi vice da Ligue 2, sem título fictício de campeonato francês',()=>{
 const f=acervoClubeHistoricoDe('Clermont Foot');
 assert.ok(f.marcos.some(m=>m.ano===2021&&m.titulo==='Primeiro acesso à primeira divisão francesa'));
 assert.ok(f.marcos.some(m=>m.ano===2023&&/Oitavo lugar/.test(m.titulo)));
 assert.ok(!f.marcos.some(m=>/Campeão/.test(m.titulo)&&m.ano===2021));
 assert.ok(f.atletas.some(a=>a.nome==='Mohamed Bayo'&&/22 gols/.test(a.descricao)));
 assert.ok(f.tecnicos.some(t=>t.nome==='Pascal Gastien'));
 assert.ok(f.tecnicos.some(t=>t.nome==='Corinne Diacre'));
});
