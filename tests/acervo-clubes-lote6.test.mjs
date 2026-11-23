import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {ACERVO_CLUBES_LOTE6} from '../src/dados/acervoClubesHistoricosLote6.js';
import {ACERVO_CLUBES_HISTORICOS,acervoClubeHistoricoDe} from '../src/dados/acervoClubesHistoricos.js';
import {INVENTARIO_CLUBES_HISTORICOS} from '../src/dados/coberturaAcervoHistorico.js';

test('lote 6: 25 clubes reais novos, todos com nomes cadastrados no A JOIA',()=>{
 assert.equal(Object.keys(ACERVO_CLUBES_LOTE6).length,25);
 assert.equal(Object.keys(ACERVO_CLUBES_HISTORICOS).length,94);
 const nomeJogo=new Set(CLUBES.map(cl=>cl.nome));
 for(const [nome,c] of Object.entries(ACERVO_CLUBES_LOTE6)){
  assert.ok(nomeJogo.has(nome),'nome não encontrado no catálogo: '+nome);
  assert.strictEqual(acervoClubeHistoricoDe(nome),c);
  assert.ok(c.atletas.length>0,nome+' sem ficha de atleta');
  assert.ok(c.atualizadoEm);
  for(const a of c.atletas){
   assert.ok(a.nome&&a.posicao&&a.descricao&&a.fonte.startsWith('https://'));
   for(const campo of ['jogos','gols'])
    assert.ok(a[campo]===null||(Number.isInteger(a[campo])&&a[campo]>0),
      nome+' / '+a.nome+' / '+campo);
  }
  for(const m of c.marcos){
   assert.ok(m.titulo&&m.descricao&&m.fonte.startsWith('https://'));
   assert.ok(m.ano===null||(Number.isInteger(m.ano)&&m.ano>1850));
  }
  for(const t of c.tecnicos){
   assert.ok(t.nome&&t.periodo&&t.descricao&&t.fonte.startsWith('https://'));
  }
  for(const r of c.recordes){
   assert.ok(c.atletas.some(a=>a.nome===r.atleta));
   assert.equal(r.comparavel,false);
  }
  const cobertura=INVENTARIO_CLUBES_HISTORICOS.find(e=>e.nome===nome);
  assert.equal(cobertura?.cobertura,'parcial_documentado');
 }
});

test('lote 6: preserva títulos e contexto sem inventar gols oficiais',()=>{
 const get=nome=>ACERVO_CLUBES_LOTE6[nome];
 assert.equal(get('Juventude').atletas.find(a=>a.nome==='Laurinho')?.jogos,572);
 assert.equal(get('Juventude').tecnicos[0].nome,'Valmir Louruz');
 assert.equal(get('LDU de Quito').tecnicos[0].nome,'Edgardo Bauza');
 assert.equal(get('Vélez Sarsfield').tecnicos[0].nome,'Carlos Bianchi');
 assert.ok(get('Peñarol').marcos.some(m=>m.ano===1982));
 assert.ok(get('Colo-Colo').marcos.some(m=>m.ano===1991));
 assert.ok(get('Independiente del Valle').marcos.some(m=>m.ano===2019));
 assert.ok(get('Bragantino').marcos.some(m=>m.ano===1990));
 assert.ok(get('Operário-PR').marcos.some(m=>m.ano===2017));
 assert.ok(get('Vitória').marcos.some(m=>m.ano===1997));
 assert.equal(get('Atlético-GO').atletas[0].gols,null,'37 gols do goleiro não viram recorde absoluto do time');
 assert.equal(get('Universidad Católica').atletas[0].gols,null,'falta escopo de gols');
 assert.equal(get('Universidad de Chile').atletas[0].gols,null,'mais de 200 não é valor inteiro documentado');
 assert.equal(get('Peñarol').recordes.length,0,'37 da Libertadores não é necessariamente recorde global de clube');
 assert.equal(get('Lanús').recordes.length,0);
 assert.equal(get('Rosario Central').atletas[0].gols,null);
});
