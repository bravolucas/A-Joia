import test from 'node:test';
import assert from 'node:assert/strict';
import {CENARIOS_COPA,TODAS_ESTRATEGIAS,NOVOS_PENALTIS,escolhasCopa} from '../src/treinador/estrategiasCopas.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa,chancesCopa,chancePenaltis} from '../src/treinador/copasEscolha.js';
const campanha=()=>criarCampanhaCopa({nome:'Copa do Brasil',usuario:'A',forcaUsuario:76,clubes:[{nome:'A',forca:76},{nome:'B',forca:82}],ano:2030,formato:'mata',seed:'VARIACOES'});
test('oito cenários e 24 estratégias rotacionam sem mudar ao reabrir',()=>{
 const c=campanha(),d=decisaoCopa(c),vistos=new Set();
 for(let etapa=0;etapa<8;etapa++){const cp={...c,etapa};const x=escolhasCopa(cp,d);assert.deepEqual(x,escolhasCopa(structuredClone(cp),d));assert.equal(x.opcoes.length,3);vistos.add(x.titulo);}
 assert.equal(vistos.size,CENARIOS_COPA.length);assert.equal(new Set(TODAS_ESTRATEGIAS.map(x=>x.id)).size,24);
});
test('chances normalizadas, força relevante e planos com probabilidades distintas',()=>{
 for(const final of [true,false])for(const plano of TODAS_ESTRATEGIAS){
  for(const [a,b] of [[10,99],[80,80],[99,10]]){const p=chancesCopa(a,b,plano.id,final);assert.ok(Object.values(p).every(x=>x>0&&x<1));assert.ok(Math.abs(p.vitoria+p.empate+p.derrota-1)<1e-10);}
  assert.ok(chancesCopa(90,60,plano.id,final).vitoria>chancesCopa(60,90,plano.id,final).vitoria);
 }
 assert.equal(new Set(TODAS_ESTRATEGIAS.slice(0,3).map(p=>chancesCopa(76,82,p.id).vitoria)).size,3);
});
test('cada carta oferecida persiste a mesma probabilidade usada no sorteio e não altera origem',()=>{
 const c=campanha(),antes=structuredClone(c),d=decisaoCopa(c);
 for(const op of escolhasCopa(c,d).opcoes){const novo=escolherCopa(c,d.chave,op.id);assert.deepEqual(novo.resultado.revelacao,{nome:op.nome,probabilidades:chancesCopa(d.forcaUsuario,d.forcaAdv,op.id,d.final)});assert.deepEqual(novo,escolherCopa(c,d.chave,op.id));}
 assert.deepEqual(c,antes);assert.throws(()=>escolherCopa(c,d.chave,'inexistente'));
});
test('pênaltis têm três opções variadas e chance persistida ao retomar',()=>{
 let c;for(let i=0;i<100;i++){const cp={...campanha(),seed:'PENAL-'+i};const d=decisaoCopa(cp);const r=escolherCopa(cp,d.chave,'controlar');if(r.resultado.penaltisPendentes){c=r;break;}}
 assert.ok(c);const d=decisaoCopa(c),opcoes=escolhasCopa(c,d).opcoes;assert.equal(new Set(opcoes.map(x=>x.id)).size,3);
 for(const op of opcoes){const r=escolherCopa(c,d.chave,op.id);assert.equal(r.resultado.revelacao.probabilidades.classificacao,chancePenaltis(d.forcaUsuario,d.forcaAdv,op.id,d.final));assert.equal(r.resultado.penaltisPendentes,false);}
 assert.equal(NOVOS_PENALTIS.length,6);
});
