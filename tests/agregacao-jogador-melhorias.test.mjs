import test from 'node:test';
import assert from 'node:assert/strict';
import {TOTAL_CARREIRAS_MELHORIAS,validarResultadosMelhorias} from '../scripts/agregar-jogador-melhorias.mjs';

const relatorios=()=>Array.from({length:4},(_,p)=>({
  tipo:'jogador-melhorias-v1',total:24,parte:p+1,partes:4,
  resultados:Array.from({length:6},(_,n)=>{
    const indice=p+4*n;
    return {indice,codigo:'MELHORIAS'+indice,pico:80,
      classicos:indice===0?1:0,fieis:indice===23?1:0};
  }),
}));

test('agregação de quatro partes executa exatamente as 24 carreiras e preserva mediana global',()=>{
 const x=validarResultadosMelhorias(relatorios());
 assert.equal(x.total,TOTAL_CARREIRAS_MELHORIAS);
 assert.equal(x.partes,4);
 assert.equal(x.mediana,80);
 assert.equal(x.classicos,1);assert.equal(x.fieis,1);
 assert.deepEqual(x.codigos,Array.from({length:24},(_,i)=>'MELHORIAS'+i));
});

test('ausência, duplicação e índice fora da partição provocam falha explícita',()=>{
 const base=relatorios();
 assert.throws(()=>validarResultadosMelhorias(base.slice(1)),/relatórios/);
 assert.throws(()=>validarResultadosMelhorias([...base.slice(0,3),base[2]]),/repetido/);
 const ruim=structuredClone(base);ruim[0].resultados[0].indice=1; // atribuído à partição 2, não à primeira
 assert.throws(()=>validarResultadosMelhorias(ruim),/índice/);
 const faltando=structuredClone(base);faltando[0].resultados.pop();
 assert.throws(()=>validarResultadosMelhorias(faltando),/todas as carreiras/);
});

test('a mediana só é avaliada no conjunto inteiro, nunca nas partes isoladas',()=>{
 const rs=relatorios();
 // Seis picos altos dentro de uma só partição não elevam a mediana das 24.
 for(const j of rs[0].resultados)j.pico=99;
 assert.equal(validarResultadosMelhorias(rs).mediana,80);
 // Treze picos altos entre diversas partições reprovam pela regra original.
 for(let i=0;i<13;i++){
   const r=rs.find(p=>p.parte===i%4+1);
   r.resultados.find(j=>j.indice===i).pico=99;
 }
 assert.throws(()=>validarResultadosMelhorias(rs),/Mediana/);
});

test('exige presença global de clássicos e temporadas de fidelidade',()=>{
 const rs=relatorios();rs[0].resultados[0].classicos=0;
 assert.throws(()=>validarResultadosMelhorias(rs),/clássicos\/fidelidade/);
 const outro=relatorios();outro[3].resultados.find(j=>j.indice===23).fieis=0;
 assert.throws(()=>validarResultadosMelhorias(outro),/clássicos\/fidelidade/);
});

test('o modo local de uma parte única conserva os mesmos 24 índices',()=>{
 const rs=relatorios();
 const completo={tipo:'jogador-melhorias-v1',total:24,parte:1,partes:1,
   resultados:rs.flatMap(r=>r.resultados)};
 const x=validarResultadosMelhorias([completo]);
 assert.equal(x.total,24);assert.equal(x.mediana,80);
});
