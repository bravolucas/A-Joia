import test from 'node:test';
import assert from 'node:assert/strict';
import {ACERVO_CLUBES_LOTE5} from '../src/dados/acervoClubesHistoricosLote5.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {consultarRecordesFutebol} from '../src/historia/recordesFutebol.js';

test('lote 5: onze clubes, fontes específicas e 69 clubes na base até o quinto lote',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE5).length,11);
 assert.ok(Object.keys(ACERVO_CLUBES_HISTORICOS).length>=69);
 for(const c of Object.values(ACERVO_CLUBES_LOTE5)){
  assert.strictEqual(acervoClubeHistoricoDe(c.clube),c);
  assert.ok(c.atletas.length>0);
  for(const a of c.atletas){
   assert.ok(a.nome&&a.posicao&&a.fonte.startsWith('https://'));
   for(const campo of ['jogos','gols'])
    assert.ok(a[campo]===null||Number.isInteger(a[campo])&&a[campo]>0);
  }
  for(const r of c.recordes){
   assert.equal(r.comparavel,false);
   assert.ok(r.criterio&&r.fonte.startsWith('https://'));
   assert.ok(c.atletas.some(a=>a.nome===r.atleta));
  }
  for(const m of c.marcos||[]){
   assert.ok(m.descricao&&m.fonte.startsWith('https://'));
   assert.ok(m.ano===null||Number.isInteger(m.ano)&&m.ano>1800);
  }
 }
});

test('Roma, Betis e Real Sociedad mostram referências institucionais exatas',()=>{
 const roma=acervoClubeHistoricoDe('Roma');
 assert.equal(roma.atletas[0].jogos,786);
 assert.equal(roma.atletas[0].gols,307);
 const real=(nome,id)=>consultarRecordesFutebol({},'clube',nome).recordes.find(x=>x.id===id)?.real;
 assert.equal(real('Roma','golsCarreira')?.valor,307);
 assert.equal(real('Roma','jogosCarreira')?.valor,786);
 assert.equal(real('Real Betis','jogosCarreira')?.valor,528);
 assert.equal(real('Real Sociedad','jogosCarreira')?.valor,599);
 assert.equal(real('Ajax','jogosCarreira')?.valor,603);
 for(const clube of ['Roma','Real Betis','Real Sociedad','Ajax']){
  const fonte=real(clube,'jogosCarreira');
  assert.equal(fonte.comparavel,false);
 }
});

test('números de copa, série A ou recorte da liga não viram recordes inventados',()=>{
 for(const clube of ['Napoli','Lazio','Celtic','Porto','Valencia','Villarreal','Espanyol','Rangers']){
  assert.equal(acervoClubeHistoricoDe(clube).recordes.length,0,clube);
 }
 assert.ok(acervoClubeHistoricoDe('Napoli').marcos.some(m=>m.ano===1989));
 assert.ok(acervoClubeHistoricoDe('Lazio').marcos.some(m=>m.ano===2020));
 assert.equal(acervoClubeHistoricoDe('Valencia').atletas[0].jogos,246);
 assert.equal(acervoClubeHistoricoDe('Valencia').atletas[0].gols,149);
 assert.equal(acervoClubeHistoricoDe('Celtic').atletas[0].gols,242);
 assert.equal(acervoClubeHistoricoDe('Monaco').atletas.find(a=>a.nome==='Radamel Falcao').jogos,140);
 assert.equal(acervoClubeHistoricoDe('Monaco').atletas.find(a=>a.nome==='Radamel Falcao').gols,83);
});
