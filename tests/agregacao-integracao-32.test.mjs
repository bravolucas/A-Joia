import test from 'node:test';
import assert from 'node:assert/strict';
import {TOTAL_INTEGRACAO,validarIntegracao32} from '../scripts/agregar-integracao-32.mjs';

const relatorios=()=>Array.from({length:4},(_,p)=>({
 tipo:'integracao-jogador-tecnico-v1',total:32,parte:p+1,partes:4,
 indices:Array.from({length:8},(_,i)=>p+i*4),
 temporadas:150,jogosTecnico:100,
}));

test('32 carreiras distintas e todos os limites originais são exigidos globalmente',()=>{
 const x=validarIntegracao32(relatorios());
 assert.equal(x.total,TOTAL_INTEGRACAO);
 assert.equal(x.partes,4);
 assert.equal(x.temporadas,600);
 assert.equal(x.jogosTecnico,400);
 assert.deepEqual(x.indices,Array.from({length:32},(_,i)=>i));
});

test('partição ausente, repetida, mal atribuída ou com índice duplicado falha',()=>{
 const base=relatorios();
 assert.throws(()=>validarIntegracao32(base.slice(0,3)),/relatórios/);
 assert.throws(()=>validarIntegracao32([base[0],base[0],base[2],base[3]]),/Partição/);
 const fora=relatorios();fora[0].indices[0]=1;
 assert.throws(()=>validarIntegracao32(fora),/Índice/);
 const repetido=relatorios();repetido[0].indices[0]=repetido[0].indices[1];
 assert.throws(()=>validarIntegracao32(repetido),/Índice/);
 const falha=relatorios();falha[0].indices.pop();
 assert.throws(()=>validarIntegracao32(falha),/índices/);
});

test('rejeita totais de temporadas e partidas abaixo dos critérios originais',()=>{
 const a=relatorios();a.forEach(r=>r.temporadas=75);
 assert.throws(()=>validarIntegracao32(a),/Temporadas/);
 const b=relatorios();b.forEach(r=>r.jogosTecnico=79);
 assert.throws(()=>validarIntegracao32(b),/Partidas/);
 const c=relatorios();c[0].temporadas=NaN;
 assert.throws(()=>validarIntegracao32(c),/Métricas/);
});

test('modo local com uma partição de 32 mantém os mesmos critérios',()=>{
 const r={tipo:'integracao-jogador-tecnico-v1',total:32,partes:1,parte:1,
  indices:Array.from({length:32},(_,i)=>i),temporadas:700,jogosTecnico:1216};
 const x=validarIntegracao32([r]);
 assert.equal(x.total,32);assert.equal(x.partes,1);
 assert.equal(x.temporadas,700);assert.equal(x.jogosTecnico,1216);
});
