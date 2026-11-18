import test from 'node:test';
import assert from 'node:assert/strict';
import {opcoesClubeInicial,clubesJogaveis,comSemente} from '../src/jogador/rapido.js';

const nacionalidades=[
 'BRA','ENG','ESP','ITA','ALE','FRA','POR','EUA','MEX','CAN','ARG',
 'URU','COL','CHI','PAR','EQU','PER','BOL','HOL','TUR','BEL','SUI',
 'AUT','DIN','MAR','SNE','CSC','ALG','TUN','CMR','JAP','COR','ARS','QAT',
 'IND','CHN','AUS','NGA','EGI','SUE','NOR','POL','IRL','ESC'
];

test('todos os países oferecem três clubes distintos para iniciar a carreira',()=>{
 const jogaveis=new Set(clubesJogaveis().map(c=>c.nome));
 for(const nac of nacionalidades)for(const origem of ['base','varzea','prodigio']){
  const opcoes=comSemente('criacao-regressao',nac+'|'+origem,()=>opcoesClubeInicial(nac,origem));
  assert.equal(opcoes.length,3, nac+' / '+origem);
  assert.equal(new Set(opcoes.map(c=>c.nome)).size,3,nac+' / '+origem);
  assert.ok(opcoes.every(c=>jogaveis.has(c.nome)),nac+' / '+origem);
 }
});

test('repetição extrema do sorteio completa as três opções sem duplicar clubes',()=>{
 const original=Math.random;
 try {
  Math.random=()=>0;
  for(const [nac,origem] of [['EUA','base'],['BRA','varzea'],['POR','base'],['XXX','prodigio']]){
   const opcoes=opcoesClubeInicial(nac,origem);
   assert.equal(opcoes.length,3,nac);
   assert.equal(new Set(opcoes.map(c=>c.nome)).size,3,nac);
  }
 }finally{Math.random=original;}
});
