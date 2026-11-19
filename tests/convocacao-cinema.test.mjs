import {test} from 'node:test';
import assert from 'node:assert/strict';
import {roteiroConvocacao} from '../src/jogador/convocacaoCinema.js';
const eu={nome:'A Joia',posicao:'ATA',nac:'FRA'};
const jogadores=[
 {id:'a',nome:'Jean Martin',posicao:'GOL'},
 {id:'b',nome:'Louis Laurent',posicao:'ZAG'},
 {id:'c',nome:'Michel Bernard',posicao:'MEI'},
 {id:'d',nome:'Pierre Petit',posicao:'ATA'},
 {id:'e',nome:'Theo Moreau',posicao:'ATA'}
];
test('só revela o protagonista no fim da lista se o motor já o convocou',()=>{
 const r=roteiroConvocacao({jogadores},eu,true);
 assert.equal(r.anunciados.at(-1).nome,eu.nome);
 assert.equal(r.anunciados.at(-1).voce,true);
 assert.ok(r.iniciais.every(x=>x.nome!==eu.nome));
 assert.equal(new Set(r.anunciados.map(x=>x.id)).size,5);
});
test('resultado negativo não inventa nome do protagonista na lista',()=>{
 const antes=structuredClone(jogadores);
 const r=roteiroConvocacao({jogadores},eu,false);
 assert.ok(r.anunciados.every(x=>x.nome!==eu.nome));
 assert.equal(r.anunciados.at(-1).nome,'Theo Moreau');
 assert.deepEqual(jogadores,antes);
});
test('lista da convocação respeita nomes nacionais salvos sem valores fixos do Brasil',()=>{
 const r=roteiroConvocacao({jogadores},eu,true);
 assert.equal(r.anunciados[0].nome,'Jean Martin');
 assert.equal(r.anunciados.at(-1).nome,'A Joia');
});
test('saves antigos sem elenco não recebem nomes aleatórios nem alteram decisões',()=>{
 const a=roteiroConvocacao(undefined,eu,false);
 assert.deepEqual(a.anunciados,[]);
 assert.equal(a.ultimo,null);
 const b=roteiroConvocacao(undefined,eu,true);
 assert.deepEqual(b.anunciados.map(x=>x.nome),['A Joia']);
});
