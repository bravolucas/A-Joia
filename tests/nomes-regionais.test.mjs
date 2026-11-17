import test from 'node:test';
import assert from 'node:assert/strict';
import {gerarNomeRegional, origemNomes, NACIONALIDADES_OCEANIA_NEWGEN, sortearNacionalidadeMundo} from '../src/simulacao/nomesRegionais.js';
import { NACIONALIDADES, NACS_MUNDO } from '../src/dados/data.js';

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

test('todas as 83 nacionalidades cadastradas possuem referência regional, sem fallback internacional', () => {
  const codigos = NACIONALIDADES.map(n => n.id);
  assert.equal(codigos.length, 83);
  assert.equal(new Set(codigos).size, 83);
  for (const codigo of codigos) {
    assert.notEqual(origemNomes(codigo), 'INT', `fallback genérico não permitido: ${codigo}`);
    const nome = gerarNomeRegional(codigo, () => 0);
    assert.ok(nome.includes(' '), `nome completo para ${codigo}`);
    assert.notEqual(nome, 'Alex Martin', `fallback não deve ocorrer para ${codigo}`);
    assert.equal(nome, gerarNomeRegional(codigo, () => 0), 'geração permanece determinística');
  }
});

test('Islândia, Coreia do Norte e sete seleções do Pacífico geram nomes de suas referências', () => {
  const esperados = {
    ISL: 'Aron Gunnarsson',
    CDN: 'Kwang-song Han',
    FIJ: 'Setareki Hughes',
    SOL: 'Joses Nawo',
    TAH: 'Teaonui Tehau',
    VAN: 'Brian Kaltack',
    PNG: 'Raymond Gunemba',
    NCL: 'Georges Gope-Fenepej',
    SAM: 'Andrew Setefano',
  };
  for (const [codigo, nome] of Object.entries(esperados)) {
    assert.equal(origemNomes(codigo), codigo);
    assert.equal(gerarNomeRegional(codigo, () => 0), nome, codigo);
    assert.equal(gerarNomeRegional(codigo, () => 0.999), gerarNomeRegional(codigo, () => 0.999));
  }
  assert.equal(origemNomes('XXX'), 'INT', 'código desconhecido continua com fallback neutro');
});

test('sorteio global de novos jogadores alcança 83 nacionalidades sem inflar a Oceania',()=>{
  const total=new Set([...NACS_MUNDO,...NACIONALIDADES_OCEANIA_NEWGEN]);
  assert.equal(total.size,83);
  assert.equal(NACS_MUNDO.length,76);
  assert.equal(NACIONALIDADES_OCEANIA_NEWGEN.length,7);
  assert.deepEqual([...total].sort(),NACIONALIDADES.map(p=>p.id).sort());
  assert.equal(sortearNacionalidadeMundo(()=>0),'BRA');
  assert.equal(sortearNacionalidadeMundo(()=>0.995),'FIJ');
  assert.equal(sortearNacionalidadeMundo(()=>0.999999),'SAM');
  assert.equal(sortearNacionalidadeMundo(()=>1),'SAM');
  assert.notEqual(sortearNacionalidadeMundo(()=>0.5),'INT');
  const observadas=new Set();
  let oceania=0;
  for(let i=0;i<10000;i++){
    const codigo=sortearNacionalidadeMundo(()=>i/10000);
    observadas.add(codigo);
    if(NACIONALIDADES_OCEANIA_NEWGEN.includes(codigo))oceania++;
    assert.notEqual(origemNomes(codigo),'INT');
  }
  assert.equal(observadas.size,83);
  assert.equal(oceania,50,'política provisória: 0,5% de origens raras no sorteio global');
});
