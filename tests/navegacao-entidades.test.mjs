import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizarEntidade,paginaEntidade,empilharPagina,abrirEntidade,idJogadorPorNome} from '../src/historia/navegacaoEntidades.js';
test('links exigem identificador inequívoco de jogador, aceitando clubes por nome',()=>{
 assert.equal(normalizarEntidade({tipo:'jogador',nome:'João'}),null);
 assert.deepEqual(normalizarEntidade({tipo:'jogador',id:42,nome:'João'}),{tipo:'jogador',id:'42',nome:'João'});
 assert.equal(normalizarEntidade({tipo:'desconhecido',nome:'x'}),null);
 assert.deepEqual(paginaEntidade({tipo:'premio',nome:'Bola de Ouro'}).aba,'premios');
 assert.deepEqual(paginaEntidade({tipo:'competicao',nome:'Libertadores'}).competicao,'Libertadores');
 assert.deepEqual(paginaEntidade({tipo:'jogador',id:'77',nome:'Pedro'}).jogadorId,'77');
 assert.deepEqual(paginaEntidade({tipo:'clube',nome:'Boca Juniors'}).clube,'Boca Juniors');
});
test('navegação preserva retorno, evita duplicata e limita profundidade',()=>{
 const inicio=paginaEntidade({tipo:'clube',nome:'Fortaleza'});
 const jogador=paginaEntidade({tipo:'jogador',id:'33',nome:'João'});
 const pilha=empilharPagina(empilharPagina([inicio],jogador),jogador);
 assert.equal(pilha.length,2);
 assert.equal(pilha.at(-2).clube,'Fortaleza');
 let longa=[inicio];for(let i=0;i<70;i++)longa=empilharPagina(longa,{aba:'competicoes',competicao:String(i)});
 assert.equal(longa.length,40);
 assert.equal(abrirEntidade({tipo:'clube',nome:'Fortaleza'}),false); // SSR/Node
});

test('o nome de jogador só vira perfil quando não houver homônimos',()=>{
 const unico={nome:'Caio',mundo:{jogadores:[{id:20,nome:'Rodrigo'},{id:33,nome:'Caio'}]}};
 assert.equal(idJogadorPorNome(unico,'Rodrigo'),'20');
 assert.equal(idJogadorPorNome(unico,'Caio'),null);
 assert.equal(idJogadorPorNome({mundo:{jogadores:[{id:11,nome:'Alex'},{id:22,nome:'Alex'}]}},'Alex'),null);
 assert.equal(idJogadorPorNome({nome:'Caio',mundo:{jogadores:[]}},'Caio'),'voce');
});
