import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {CLUBES} from '../src/dados/data.js';
import {acervoClubeHistoricoDe,ACERVO_CLUBES_HISTORICOS} from '../src/dados/acervoClubesHistoricos.js';

test('Séries A, B, C e D do cadastro principal somam 83 clubes com ficha inicial',()=>{
 const esperadas={brasileirao:20,serieB:20,serieC:20,serieD:23};
 for(const [liga,esperado] of Object.entries(esperadas)){
  const clubes=CLUBES.filter(c=>c.liga===liga);
  assert.equal(clubes.length,esperado,liga+' mudou de tamanho');
  for(const c of clubes){
   const ficha=acervoClubeHistoricoDe(c.nome);
   assert.ok(ficha,liga+' sem ficha histórica para '+c.nome);
   assert.ok(ficha.atletas.length,liga+' ficha vazia para '+c.nome);
  }
 }
 assert.equal(Object.values(esperadas).reduce((s,x)=>s+x,0),83);
 assert.ok(Object.keys(ACERVO_CLUBES_HISTORICOS).length>=141);
});

test('auditoria oferece percentuais por liga para distinguir cobertura e pendências',()=>{
 const out=execFileSync(process.execPath,['scripts/auditar-acervo-historico.mjs','--json'],{
  encoding:'utf8',timeout:45000,maxBuffer:2*1024*1024,
 });
 const r=JSON.parse(out);
 assert.equal(r.versao,'2026-11-24');
 assert.ok(r.catalogoPrincipal.total>=407);
 assert.equal(r.catalogoPrincipal.comFicha+r.catalogoPrincipal.pendentes,r.catalogoPrincipal.total);
 assert.equal(r.catalogoPrincipal.pendentes,0,'cada clube do catálogo principal tem ficha');
 assert.ok(r.pendentes.clubes>0,'o inventário ampliado ainda inclui clubes extras em apuração');
 for(const [liga,esperado] of Object.entries({brasileirao:20,serieB:20,serieC:20,serieD:23})){
  const g=r.ligas.find(x=>x.id===liga);
  assert.equal(g.total,esperado,liga);
  assert.equal(g.comFicha,esperado,liga);
  assert.equal(g.pendentes,0,liga);
  assert.equal(g.percentual,100,liga);
 }
 assert.ok(r.recordesAuditados.clubes>20);
});
