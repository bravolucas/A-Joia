import test from 'node:test';
import assert from 'node:assert/strict';
import {montarChaveFifa48,CONFRONTOS_FIFA_2026} from '../src/competicoes/chaveMundial48.js';
const grupos=Array.from('ABCDEFGHIJKL',l=>({
 grupo:'Grupo '+l,
 classificacao:[1,2,3,4].map(i=>({nome:i+l,pontos:5-i,golsPro:5-i,golsContra:i}))
}));
const gruposDosTerceiros=Array.from('ABCDEFGHIJKL');
function combina(start,selecionados,resultado){
 if(selecionados.length===8){resultado.push(selecionados);return;}
 for(let i=start;i<=12-(8-selecionados.length);i++)combina(i+1,[...selecionados,gruposDosTerceiros[i]],resultado);
}
test('FIFA 2026 mantém os dezesseis confrontos oficiais predefinidos',()=>{
 const chave=montarChaveFifa48(grupos,grupos.slice(0,8).map(g=>g.classificacao[2].nome));
 assert.equal(chave.length,16);
 assert.deepEqual(chave[2],['2A','2B']);
 assert.deepEqual(chave[3],['1F','2C']);
 assert.deepEqual(chave[4],['2K','2L']);
 assert.deepEqual(chave[5],['1H','2J']);
 assert.deepEqual(chave[8],['1C','2F']);
 assert.deepEqual(chave[9],['2E','2I']);
 assert.deepEqual(chave[12],['1J','2H']);
 assert.deepEqual(chave[13],['2D','2G']);
 assert.equal(new Set(chave.flat()).size,32);
});
test('as 495 combinações de melhores terceiros produzem chave elegível sem duplicações',()=>{
 const todas=[];combina(0,[],todas);assert.equal(todas.length,495);
 for(const combinacao of todas){
  const selecionados=combinacao.map(l=>'3'+l);
  const chave=montarChaveFifa48(grupos,selecionados);
  assert.equal(new Set(chave.flat()).size,32,combinacao.join(''));
  for(let i=0;i<chave.length;i++){
   const [a,b]=chave[i];
   assert.notEqual(a.slice(-1),b.slice(-1),'não repetir grupo na fase de 32');
   const slot=CONFRONTOS_FIFA_2026[i][1];
   if(slot.startsWith('3'))assert.ok(slot.slice(1).includes(b.slice(-1)),slot+' vs '+b);
  }
 }
});
