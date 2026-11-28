import test from 'node:test';import assert from 'node:assert/strict';
import {montarSave,normalizarSave,normalizarCarreira} from '../src/completo/save.js';
const carreira={clube:{nome:'Santos',liga:'brasileirao',cor:'#fff'},aparencia:{tom:'bronze'}};
test('modo completo preserva aparência na serialização e recuperação',()=>{
 const salvo=montarSave({nome:'Teste',carreira,temporadas:[]});
 const recarregado=normalizarSave(JSON.parse(JSON.stringify(salvo)));
 assert.deepEqual(recarregado.carreira.aparencia,{versao:1,modelo:'a',tom:'bronze'});
});
test('modo completo migra saves antigos e não aceita tom desconhecido',()=>{
 assert.equal(normalizarCarreira({clube:carreira.clube}).aparencia.tom,'original');
 assert.equal(normalizarCarreira({...carreira,aparencia:{tom:'invalido'}}).aparencia.tom,'original');
});
test('carreira encerrada preserva a escolha no legado',()=>{
 const s=normalizarSave({fim:{c:carreira},temporadas:[]});
 assert.equal(s.fim.c.aparencia.tom,'bronze');
});
