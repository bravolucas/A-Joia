import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE10} from '../src/dados/acervoClubesHistoricosLote10.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 10 inclui 16 clubes reais no catálogo e 157 fichas totais',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE10).length,16);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,157);
 const nomes=new Set(CLUBES.map(c=>c.nome));
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE10)){
  assert.ok(nomes.has(nome),'Clube não encontrado: '+nome);
  assert.strictEqual(acervoClubeHistoricoDe(nome),c);
  assert.equal(INVENTARIO_CLUBES_HISTORICOS.find(x=>x.nome===nome)?.cobertura,'parcial_documentado');
  assert.ok(c.atletas.length>0,nome+' sem atleta histórico');
  for(const atleta of c.atletas){
   assert.ok(atleta.nome&&atleta.descricao&&atleta.fonte?.startsWith('https://'));
   for(const campo of ['jogos','gols'])
    assert.ok(atleta[campo]===null||(Number.isInteger(atleta[campo])&&atleta[campo]>0));
  }
  for(const marco of c.marcos){
   assert.ok(marco.titulo&&marco.descricao&&marco.fonte?.startsWith('https://'));
   assert.ok(Number.isInteger(marco.ano)&&marco.ano>=1900&&marco.ano<=2026);
  }
  for(const tecnico of c.tecnicos){
   assert.ok(tecnico.nome&&tecnico.periodo&&tecnico.descricao&&tecnico.fonte?.startsWith('https://'));
  }
  for(const recorde of c.recordes){
   assert.ok(c.atletas.some(x=>x.nome===recorde.atleta));
   assert.equal(recorde.comparavel,false);
   assert.ok(recorde.criterio&&recorde.fonte.startsWith('https://'));
  }
 }
});

test('recordes oficiais de Shearer, Haynes e Davies preservam escopos e valores',()=>{
 const newcastle=acervoClubeHistoricoDe('Newcastle');
 const shearer=newcastle.atletas.find(x=>x.nome==='Alan Shearer');
 assert.equal(shearer.jogos,405);
 assert.equal(shearer.gols,206);
 const fulham=acervoClubeHistoricoDe('Fulham');
 assert.equal(fulham.atletas.find(x=>x.nome==='Johnny Haynes').jogos,658);
 assert.equal(fulham.atletas.find(x=>x.nome==='Gordon Davies').gols,178);
 const rec=(clube,id)=>consultarRecordesFutebol({},'clube',clube).recordes.find(x=>x.id===id)?.real;
 assert.equal(rec('Newcastle','golsCarreira')?.valor,206);
 assert.equal(rec('Fulham','jogosCarreira')?.valor,658);
 assert.equal(rec('Fulham','golsCarreira')?.valor,178);
 assert.equal(rec('Newcastle','golsCarreira')?.comparavel,false);
});

test('não confunde 60 gols de Dixie Dean em 1927/28 com recorde absoluto do Everton',()=>{
 assert.equal(acervoClubeHistoricoDe('Everton').atletas[0].gols,null);
 assert.equal(acervoClubeHistoricoDe('Everton').recordes.length,0);
 assert.equal(acervoClubeHistoricoDe('Brighton').atletas[0].gols,null);
 assert.equal(acervoClubeHistoricoDe('Crystal Palace').recordes.length,0);
 assert.equal(acervoClubeHistoricoDe('Wolves').atletas[0].jogos,null);
});

test('Al-Hilal: goleador da final de 2021 não se confunde com MVP da competição',()=>{
 const time=acervoClubeHistoricoDe('Al-Hilal');
 assert.equal(time.atletas.length,2);
 assert.match(time.atletas.find(x=>x.nome==='Salem Al-Dawsari').descricao,/melhor jogador/);
 assert.match(time.atletas.find(x=>x.nome==='Nasser Al-Dawsari').descricao,/16 segundos/);
 assert.match(time.marcos[0].descricao,/Nasser/);
 assert.doesNotMatch(time.marcos[0].descricao,/Salem/);
 assert.ok(acervoClubeHistoricoDe('Al-Ittihad').marcos.some(x=>x.ano===2004));
 assert.ok(acervoClubeHistoricoDe('Al-Ahli').marcos.some(x=>x.ano===2025));
});

test('a nova cobertura acrescenta técnicos responsáveis por títulos com fonte',()=>{
 for(const [clube,treinador] of [
  ['Aston Villa','Tony Barton'],['Leeds United','Don Revie'],
  ['Nottingham Forest','Brian Clough'],['West Ham','Ron Greenwood'],
  ['Leicester City','Claudio Ranieri'],['Brighton','Roberto De Zerbi'],
  ['Sunderland','Bob Stokoe'],['Al-Ahli','Matthias Jaissle'],
 ]){
  assert.ok(acervoClubeHistoricoDe(clube).tecnicos.some(t=>t.nome===treinador),clube);
 }
});
