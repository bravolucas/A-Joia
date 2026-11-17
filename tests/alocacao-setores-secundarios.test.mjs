import test from 'node:test';
import assert from 'node:assert/strict';
import {alocarSetoresTecnico,qualidadeTaticaApta} from '../src/treinador/alocacaoSetoresTecnico.js';
import {perfilTaticoTecnico} from '../src/treinador/taticasTecnico.js';

const PESOS={'GOL':1,'DEF':4,'MEI':4,'ATA':2};
const atletas=()=>{
 const grupo=(setor,n)=>Array.from({length:n},(_,i)=>({
   id:setor+i,nome:setor+' '+i,setor,qualidade:80-i,
 }));
 const elenco=[...grupo('GOL',1),...grupo('DEF',3),...grupo('MEI',5),...grupo('ATA',2)];
 elenco.find(j=>j.id==='MEI0').posicoesSecundarias=[{posicao:'ZAG',apto:true}];
 return elenco;
};

test('treinador distribui 11 titulares únicos e cobre defesa com MEI secundário apto',()=>{
 const elenco=atletas(),anterior=structuredClone(elenco);
 const t=alocarSetoresTecnico(elenco,PESOS);
 assert.equal(t.length,11);
 assert.ok(t.every(Boolean));
 assert.equal(new Set(t.map(x=>x.jogador.id)).size,11);
 assert.equal(t.filter(x=>x.setor==='DEF').length,4);
 assert.equal(t.filter(x=>x.setor==='DEF'&&x.secundaria).length,1);
 assert.equal(t.find(x=>x.setor==='DEF'&&x.secundaria).jogador.id,'MEI0');
 assert.deepEqual(elenco,anterior);
});

test('sem aptidão comprovada setor incompleto vale zero; não duplica atleta',()=>{
 const elenco=atletas().map(j=>j.id==='MEI0'?{...j,posicoesSecundarias:['ZAG']}:j);
 const t=alocarSetoresTecnico(elenco,PESOS);
 assert.equal(t.filter(Boolean).length,10);
 assert.equal(t.filter(x=>!x).length,1);
 assert.equal(new Set(t.filter(Boolean).map(x=>x.jogador.id)).size,10);
 const qualidade=qualidadeTaticaApta(elenco,PESOS);
 assert.ok(qualidade<qualidadeTaticaApta(atletas(),PESOS));
});

test('jogador suspenso ou lesionado não entra no onze, nem mesmo em posição secundária',()=>{
 const elenco=atletas();
 elenco.find(j=>j.id==='MEI0').suspenso=true;
 elenco.find(j=>j.id==='DEF0').lesao={jogosRestantes:2};
 const t=alocarSetoresTecnico(elenco,PESOS);
 const ids=t.filter(Boolean).map(x=>x.jogador.id);
 assert.ok(!ids.includes('MEI0'));
 assert.ok(!ids.includes('DEF0'));
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(t.some(x=>!x));
 const p=perfilTaticoTecnico({clube:'Santos',formacao:'4-4-2',
   gestao:{clube:'Santos',elenco}});
 assert.equal(Number.isFinite(p.ajuste),true);
});

test('tática conserva pesos tradicionais quando não há posições secundárias',()=>{
 const elenco=['GOL','DEF','MEI','ATA'].flatMap(setor=>
   Array.from({length:6},(_,i)=>({id:setor+i,setor,qualidade:setor==='ATA'?90:50})));
 const original=structuredClone(elenco);
 const qualidadeAntiga=pesos=>Object.entries(pesos).reduce((total,[setor,vagas])=>
   total+elenco.filter(j=>j.setor===setor)
     .sort((a,b)=>b.qualidade-a.qualidade).slice(0,vagas)
     .reduce((n,j)=>n+j.qualidade,0),0)/11;
 for(const p of [PESOS,{'GOL':1,'DEF':4,'MEI':3,'ATA':3},{'GOL':1,'DEF':3,'MEI':5,'ATA':2}])
   assert.equal(qualidadeTaticaApta(elenco,p),qualidadeAntiga(p));
 assert.deepEqual(elenco,original);
});

test('em formação com pesos dinâmicos não soma força ou usa jogadores duas vezes',()=>{
 const elenco=atletas();
 for(const pesos of [
   {'GOL':1,'DEF':4,'MEI':3,'ATA':3},
   {'GOL':1,'DEF':4,'MEI':4,'ATA':2},
   {'GOL':1,'DEF':3,'MEI':5,'ATA':2},
 ]) {
   const t=alocarSetoresTecnico(elenco,pesos);
   const ids=t.filter(Boolean).map(x=>x.jogador.id);
   assert.equal(ids.length,new Set(ids).size);
   assert.ok(qualidadeTaticaApta(elenco,pesos)<=Math.max(...elenco.map(j=>j.qualidade)));
   assert.ok(qualidadeTaticaApta(elenco,pesos)>=0);
 }
});
