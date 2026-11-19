import {test} from 'node:test';
import assert from 'node:assert/strict';
import {roteiroConvocacao} from '../src/jogador/convocacaoCinema.js';

const jogador={nome:'A Joia',posicao:'ATA'};
const jogadores=[
 {id:'g1',nome:'Enzo Ribeiro',posicao:'GOL'},
 {id:'d1',nome:'Caio Rocha',posicao:'ZAG'},
 {id:'m1',nome:'Tiago Costa',posicao:'MEI'},
 {id:'a1',nome:'Igor Santos',posicao:'ATA'},
 {id:'a2',nome:'Rafael Souza',posicao:'ATA'}
];
test('convocação aprovada revela protagonista apenas na última posição da sequência',()=>{
 const r=roteiroConvocacao({jogadores},jogador,true);
 assert.equal(r.anteriores.length,4);
 assert.ok(r.anteriores.every(p=>p.nome!==jogador.nome));
 assert.equal(r.ultimo.nome,jogador.nome);
 assert.equal(r.anunciados.at(-1).voce,true);
 assert.equal(new Set(r.anunciados.map(p=>p.id)).size,r.anunciados.length);
});
test('não convocado não aparece na lista nem ganha ingresso na Copa',()=>{
 const antes=structuredClone(jogadores);
 const r=roteiroConvocacao({jogadores},jogador,false);
 assert.equal(r.anunciados.length,5);
 assert.ok(r.anunciados.every(p=>p.nome!==jogador.nome));
 assert.equal(r.ultimo.nome,'Rafael Souza');
 assert.deepEqual(jogadores,antes);
});
test('roteiro depende de elenco salvo, inclusive nomes de outras nacionalidades',()=>{
 const ingleses=[{id:1,nome:'George Ward',posicao:'GOL'},{id:2,nome:'Oliver Smith',posicao:'ZAG'},{id:3,nome:'James Taylor',posicao:'MC'},{id:4,nome:'Ethan Brown',posicao:'ATA'},{id:5,nome:'Harry White',posicao:'ATA'}];
 const r=roteiroConvocacao({jogadores:ingleses},{nome:'My Star',posicao:'ATA'},false);
 assert.equal(r.anunciados[0].nome,'George Ward');
 assert.equal(r.anunciados[4].nome,'Harry White');
});
test('save antigo sem elenco não inventa identidade de um atleta adversário',()=>{
 const r=roteiroConvocacao(null,jogador,false);
 assert.deepEqual(r.anunciados,[]);
 assert.equal(r.ultimo,null);
 const convocado=roteiroConvocacao(null,jogador,true);
 assert.equal(convocado.anunciados.length,1);
 assert.equal(convocado.ultimo.nome,'A Joia');
});
