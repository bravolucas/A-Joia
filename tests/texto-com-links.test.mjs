import test from 'node:test';
import assert from 'node:assert/strict';
import {criarJogador} from '../src/jogador/rapido.js';
import {segmentarTexto} from '../src/historia/textoComLinks.js';
import {pessoasDoRecorde} from '../src/historia/noticiasRecordes.js';

const c=criarJogador({nome:'Links Livres',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'TEXTO-LINKS'});
const links=(t,o)=>segmentarTexto(t,c,o).filter(p=>typeof p!=='string');

test('clubes, competições e prêmios no meio da frase viram destinos do Arquivo',()=>{
 const p=links('O Santos venceu o Brasileirão e a Copa do Brasil; Bola de Ouro em disputa.');
 assert.deepEqual(p.map(x=>[x.tipo,x.nome]),[['clube','Santos'],['competicao','Brasileirão'],['competicao','Copa do Brasil'],['premio','Bola de Ouro']]);
});

test('o nome mais longo vence e o texto é preservado por inteiro',()=>{
 const t='Ano de Copa do Mundo e Copa do Brasil no Real Madrid.';
 const partes=segmentarTexto(t,c);
 assert.equal(partes.map(x=>typeof x==='string'?x:x.texto).join(''),t);
 assert.ok(links(t).some(x=>x.nome==='Copa do Mundo'));
 assert.ok(!links(t).some(x=>x.tipo==='selecao'&&x.nome==='Brasil'));
});

test('palavras comuns que também são clubes não viram link adivinhado',()=>{
 assert.deepEqual(links('Confiança no clube e vitória no clássico.'),[]);
});

test('jogador só vira link com ID único; homônimos ficam em texto',()=>{
 const qtd=new Map();for(const p of c.mundo.jogadores)qtd.set(p.nome,(qtd.get(p.nome)||0)+1);
 const unico=c.mundo.jogadores.find(p=>qtd.get(p.nome)===1&&p.nome.includes(' '));
 const repetido=c.mundo.jogadores.find(p=>qtd.get(p.nome)>1&&p.nome.includes(' '));
 assert.deepEqual(links(`${unico.nome} marcou.`).map(x=>x.id),[String(unico.id)]);
 assert.deepEqual(links(`${repetido.nome} marcou.`).filter(x=>x.tipo==='jogador'),[]);
 // com o ID vindo do dado, o homônimo também vira link
 assert.deepEqual(links(`${repetido.nome} marcou.`,{pessoas:[{nome:repetido.nome,id:repetido.id}]}).map(x=>x.id),[String(repetido.id)]);
});

test('o próprio jogador aponta para a página "voce"',()=>{
 assert.deepEqual(links('Links Livres chega ao Santos').map(x=>[x.tipo,x.id??null]),[['jogador','voce'],['clube',null]]);
});

test('recordes carregam quem foi citado com o ID',()=>{
 assert.deepEqual(pessoasDoRecorde({atleta:'A B',atletaId:7,anteriorAtleta:'C D',anteriorAtletaId:null}),[{nome:'A B',id:7}]);
 assert.deepEqual(pessoasDoRecorde(null),[]);
});
