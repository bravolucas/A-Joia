import test from 'node:test';
import assert from 'node:assert/strict';
import {celebracoesTemporada} from '../src/jogador/celebracoesTemporada.js';
test('ordena títulos, movimento de divisão e pódio sem duplicar título nem alterar a temporada',()=>{
 const c={titulos:[{tipo:'copa',nome:'Copa do Brasil'},{tipo:'copa',nome:'Copa do Brasil'},{tipo:'bolaOuro',nome:'Bola de Ouro'}],acesso:{para:'Série A'},bola:{pos:1}};const antes=structuredClone(c),fila=celebracoesTemporada(c);assert.deepEqual(fila.map(x=>x.tipo),['titulo','acesso','bolaOuro']);assert.deepEqual(c,antes);
});
test('pódio independe da lista de candidatos; apenas colocações de 1 a 3',()=>{
 for(const pos of [1,2,3])assert.equal(celebracoesTemporada({bola:{pos}})[0].posicao,pos);
 for(const pos of [0,4,10,null,undefined,-1])assert.deepEqual(celebracoesTemporada({bola:{pos}}),[]);
 assert.equal(celebracoesTemporada({rebaixado:{para:'Série B'}})[0].tipo,'rebaixamento');assert.deepEqual(celebracoesTemporada({}),[]);
});
