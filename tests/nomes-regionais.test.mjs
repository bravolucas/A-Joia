import test from 'node:test';
import assert from 'node:assert/strict';
import {gerarNomeRegional, origemNomes} from '../src/simulacao/nomesRegionais.js';

test('ingleses, japoneses e nigerianos usam dicionários apropriados',()=>{
  assert.equal(gerarNomeRegional('ENG',()=>0),'Jack Walker');
  assert.equal(gerarNomeRegional('JAP',()=>0),'Haruto Tanaka');
  assert.equal(gerarNomeRegional('NIG',()=>0),'Chinedu Okafor');
});
test('países sem dicionário próprio usam grupo cultural em vez do Brasil',()=>{
  assert.equal(origemNomes('CHI'),'ESP');
  assert.equal(origemNomes('AUT'),'ALE');
  assert.equal(origemNomes('QAT'),'MAR');
  assert.notEqual(origemNomes('CHI'),'BRA');
});
test('geração determinística para saves reprodutíveis',()=>{
  const a=gerarNomeRegional('ARG',()=>0.3);
  const b=gerarNomeRegional('ARG',()=>0.3);
  assert.equal(a,b);
});
test('nacionalidades desconhecidas não recebem nomes brasileiros por padrão',()=>{
  assert.equal(origemNomes('XXX'),'INT');
  assert.equal(gerarNomeRegional('XXX',()=>0),'Alex Martin');
});
