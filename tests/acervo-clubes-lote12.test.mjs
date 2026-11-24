import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE12} from '../src/dados/acervoClubesHistoricosLote12.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 12 inclui 10 clubes presentes no jogo e soma 178 fichas',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE12).length,10);
 assert.ok(Object.keys(ACERVO_CLUBES_HISTORICOS).length>=178);
 const nomes=new Set(CLUBES.map(c=>c.nome));
 for(const [nome,ficha] of Object.entries(ACERVO_CLUBES_LOTE12)){
  assert.ok(nomes.has(nome),'Clube fora do catálogo: '+nome);
  assert.strictEqual(acervoClubeHistoricoDe(nome),ficha);
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(c=>c.nome===nome)?.cobertura,'parcial_documentado');
  assert.ok(ficha.atletas.length,'Falta ao menos um atleta em '+nome);
  for(const a of ficha.atletas){
   assert.ok(a.nome&&a.descricao&&a.fonte.startsWith('https://'));
   for(const m of ['jogos','gols']) assert.ok(a[m]===null||(Number.isInteger(a[m])&&a[m]>0));
  }
  for(const h of ficha.marcos){
   assert.ok(h.titulo&&h.descricao&&h.fonte.startsWith('https://'));
   assert.ok(Number.isInteger(h.ano)&&h.ano>1900&&h.ano<=2026);
  }
  for(const t of ficha.tecnicos){
   assert.ok(t.nome&&t.descricao&&t.fonte.startsWith('https://'));
  }
  assert.equal(ficha.recordes.length,0,'marcos de torneio não autorizam recordes globais: '+nome);
 }
});

test('cobertura inicial completa dos 20 argentinos e 13 sul-americanos do jogo',()=>{
 const grupos={argentina:20,sulamericano:13};
 for(const [liga,total] of Object.entries(grupos)){
  const clubes=CLUBES.filter(c=>c.liga===liga);
  assert.equal(clubes.length,total,'quantidade no catálogo da liga '+liga);
  for(const c of clubes){
   const ficha=acervoClubeHistoricoDe(c.nome);
   assert.ok(ficha,'Sem ficha histórica: '+c.nome);
   assert.ok(ficha.atletas.length>0,'Ficha histórica vazia: '+c.nome);
  }
 }
});

test('históricos específicos são rastreáveis e não se transformam em gols de carreira',()=>{
 const get=nome=>acervoClubeHistoricoDe(nome);
 assert.deepEqual(get('Barcelona de Guayaquil').marcos.map(x=>x.ano),[1990,1998]);
 assert.equal(get('Barcelona de Guayaquil').atletas.find(x=>x.nome==='Washington Muñoz').gols,101);
 assert.match(get('Barcelona de Guayaquil').atletas.find(x=>x.nome==='Washington Muñoz').descricao,/Guayas/);
 assert.equal(get('Barcelona de Guayaquil').recordes.length,0,'escopos mistos não são recordes absolutos comparáveis');
 assert.equal(get('Platense').marcos[0].ano,2025);
 assert.ok(get('Platense').atletas.some(x=>x.nome==='Guido Mainero'));
 assert.equal(get('Huracán').marcos[0].ano,1973);
 assert.equal(get('Godoy Cruz').marcos[0].ano,2006);
 assert.equal(get('Cerro Porteño').marcos[0].ano,2021);
 assert.equal(get('Banfield').marcos[0].ano,2009);
 assert.equal(get('Gimnasia La Plata').marcos[0].ano,1993);
 assert.equal(get('Tigre').marcos[0].ano,2019);
 assert.equal(get('Belgrano').marcos[0].ano,2022);
 assert.equal(get('Talleres').marcos[0].ano,1977);
});

test('fontes documentam os técnicos, sem misturar equipes ou seleções',()=>{
 const get=nome=>acervoClubeHistoricoDe(nome);
 for(const [clube,nome] of [
  ['Huracán','César Luis Menotti'],['Belgrano','Guillermo Farré'],
  ['Godoy Cruz','Juan Manuel Llop'],['Banfield','Julio César Falcioni'],
  ['Gimnasia La Plata','Roberto Perfumo'],['Tigre','Néstor Gorosito'],
  ['Platense','Favio Orsi e Sergio Gómez'],['Cerro Porteño','Francisco Arce'],
 ]){
  assert.ok(get(clube).tecnicos.some(x=>x.nome===nome),clube+' sem técnico '+nome);
 }
});
