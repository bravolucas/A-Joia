import test from 'node:test';
import assert from 'node:assert/strict';
import {vencedoresPremios,chavePremio} from '../src/historia/historicoPremios.js';

test('histórico de premiações encontra atletas pelo id mesmo sem id redundante no registro',()=>{
 const jogo={
  universo:{atletas:{
   'at-42':{nome:'Jogador A',conquistas:[[2027,'premio','Bola de Ouro','Fortaleza','bolaOuro']]}
  }},
  mundo:{jogadores:[
   {id:'at-42',nome:'Jogador A',premiacoesIndividuais:[[1,2027,'bolaOuro','Fortaleza']]},
   {id:'at-98',nome:'Jogadora B',premiacoesIndividuais:[[1,2028,'bolaOuro','Corinthians']]}
  ]}
 };
 const lista=vencedoresPremios(jogo);
 assert.equal(lista.length,2);
 assert.deepEqual(lista.map(x=>x.jogadorId),['at-98','at-42']);
 assert.equal(lista[1].jogadorNome,'Jogador A');
 assert.equal(lista[1].clube,'Fortaleza');
});

test('não inventa premiações e respeita variações de grafia',()=>{
 assert.deepEqual(vencedoresPremios({}),[]);
 assert.equal(chavePremio('Bola de Ouro'),chavePremio('bola-de-ouro'));
 assert.equal(chavePremio('Troféu Yashin'),chavePremio('Trofeu Yashin'));
});
