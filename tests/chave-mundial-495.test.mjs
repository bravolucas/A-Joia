import test from 'node:test';
import assert from 'node:assert/strict';
import {montarChaveFifa48,CONFRONTOS_FIFA_2026} from '../src/competicoes/chaveMundial48.js';
const letras='ABCDEFGHIJKL'.split('');
const grupos=letras.map(grupo=>({grupo,classificacao:Array.from({length:4},(_,i)=>({nome:`${grupo}-${i+1}`}))}));
const combinacoes=[];
function montar(inicio,grupo){
 if(grupo.length===8){combinacoes.push([...grupo]);return;}
 for(let i=inicio;i<=12-(8-grupo.length);i++){grupo.push(letras[i]);montar(i+1,grupo);grupo.pop();}
}
montar(0,[]);
test('495 combinações de terceiros do Mundial FIFA 2026 geram 16 jogos sem seleções repetidas',()=>{
 assert.equal(CONFRONTOS_FIFA_2026.length,16);
 assert.equal(combinacoes.length,495);
 for(const comb of combinacoes){
  const chave=montarChaveFifa48(grupos,comb.map(l=>`${l}-3`));
  assert.equal(chave.length,16,comb.join(''));
  assert.equal(new Set(chave.flat()).size,32,comb.join(''));
  for(const [a,b] of chave)assert.notEqual(a[0],b[0],`Repetição de grupo em ${comb.join('')}`);
 }
});
