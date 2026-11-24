import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE13} from '../src/dados/acervoClubesHistoricosLote13.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 13 tem 9 clubes presentes no catálogo, elevando o acervo a 187',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE13).length,9);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,187);
 const catalogo=new Set(CLUBES.map(c=>c.nome));
 for(const [nome,clube] of Object.entries(ACERVO_CLUBES_LOTE13)){
  assert.ok(catalogo.has(nome),'Clube fora do catálogo: '+nome);
  assert.strictEqual(acervoClubeHistoricoDe(nome),clube);
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(x=>x.nome===nome)?.cobertura,'parcial_documentado');
  assert.ok(clube.atletas.length>0,'Falta atleta documentado: '+nome);
  for(const atleta of clube.atletas){
   assert.ok(atleta.nome&&atleta.posicao&&atleta.descricao&&atleta.fonte.startsWith('https://'));
   for(const chave of ['jogos','gols'])assert.ok(atleta[chave]===null||(Number.isInteger(atleta[chave])&&atleta[chave]>0));
  }
  for(const marco of clube.marcos){
   assert.ok(marco.ano>=1900&&marco.ano<=2026&&marco.titulo&&marco.fonte.startsWith('https://'));
  }
  for(const tecnico of clube.tecnicos)assert.ok(tecnico.nome&&tecnico.periodo&&tecnico.fonte.startsWith('https://'));
  assert.equal(clube.recordes.length,0,'Gols de competição ou partida não são recordes de carreira');
 }
});

test('as ligas Argentina, Espanha e o grupo Sul-Americano têm 100% de fichas iniciais',()=>{
 for(const [liga,total] of Object.entries({argentina:20,espanha:20,sulamericano:13})){
  const clubes=CLUBES.filter(c=>c.liga===liga);
  assert.equal(clubes.length,total,'Quantidade em '+liga);
  for(const c of clubes){
   const ficha=acervoClubeHistoricoDe(c.nome);
   assert.ok(ficha,'Falta ficha em '+liga+': '+c.nome);
   assert.ok(ficha.atletas.length>0,'Ficha vazia: '+c.nome);
  }
 }
});

test('Defensa y Justicia registra final 2020 jogada em 2021, sem inverter temporadas',()=>{
 const d=acervoClubeHistoricoDe('Defensa y Justicia');
 assert.equal(d.marcos.length,1);
 assert.equal(d.marcos[0].ano,2020);
 assert.match(d.marcos[0].descricao,/23 de janeiro de 2021/);
 assert.equal(d.atletas[0].nome,'Braian Romero');
 assert.match(d.atletas[0].descricao,/10 gols naquela edição/);
 assert.equal(d.atletas[0].gols,null,'total de 10 gols é somente da Sudamericana 2020');
 assert.equal(d.tecnicos[0].nome,'Hernán Crespo');
});

test('resultados históricos espanhóis mantêm seus respectivos torneios e temporadas',()=>{
 const c=nome=>acervoClubeHistoricoDe(nome);
 const esperado={
  'Racing Santander':2008,Levante:2012,'Málaga':2013,
  'Osasuna':2023,'Rayo Vallecano':2001,
  'Getafe':2008,'Alavés':2001,'Elche':1969,
 };
 for(const [nome,ano] of Object.entries(esperado)){
  assert.equal(c(nome).marcos[0].ano,ano,nome);
  assert.equal(c(nome).recordes.length,0,nome);
 }
 assert.equal(c('Málaga').tecnicos[0].nome,'Manuel Pellegrini');
 assert.equal(c('Levante').tecnicos[0].nome,'Juan Ignacio Martínez');
 assert.equal(c('Osasuna').tecnicos[0].nome,'Jagoba Arrasate');
 assert.equal(c('Elche').tecnicos[0].nome,'Roque Gastón Máspoli');
 assert.equal(c('Alavés').atletas[0].gols,null,'dois gols em final não são total de carreira');
});
