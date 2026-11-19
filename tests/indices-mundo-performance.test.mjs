import test from 'node:test';
import assert from 'node:assert/strict';
import {registrarMundoVivo} from '../src/simulacao/mundoVivo.js';
import {gerarMundoJogadores} from '../src/comum/lib.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

test('índice anual mantém ordem das classificações, títulos e primeiro movimento',()=>{
  const c={codigo:'indice-regressao',nome:'Jogador Índice',posicao:'ATA',mundo:{jogadores:[]},
    historiaFutebol:{titulos:[
      {ano:2032,nome:'Título A',clube:'Santos'},
      {ano:2031,nome:'Ignorado',clube:'Santos'},
      {ano:2032,nome:'Título B',clube:'Santos'},
      {ano:2032,nome:'Título C',clube:'Flamengo'},
    ]}};
  const ano={ano:2032,clube:'Santos',ligaId:'brasileirao',posLiga:9,
    classificacoesMundo:{
      brasileirao:{classificacao:[{nome:'Flamengo',posicao:1,pontos:80},{nome:'Santos',posicao:2,pontos:72}]},
      serieB:{classificacao:[{nome:'Santos',posicao:1,pontos:100}]},
    },
    movimentosMundo:[{clube:'Santos',tipo:'acesso'},{clube:'Santos',tipo:'rebaixamento'}],
    cairam:['Santos'],subiram:['Flamengo']};
  registrarMundoVivo(c,ano);
  const santos=c.universo.clubes.Santos.historico[0];
  assert.equal(santos.liga,'brasileirao');
  assert.equal(santos.posicao,2);
  assert.equal(santos.pontos,72);
  assert.deepEqual(santos.titulos,['Título A','Título B']);
  assert.equal(santos.movimento,'acesso');
  assert.equal(c.universo.clubes.Flamengo.historico[0].movimento,'acesso');
  assert.deepEqual(c.universo.clubes.Flamengo.historico[0].titulos,['Título C']);
  const anterior=JSON.stringify(c);
  registrarMundoVivo(c,ano);
  assert.equal(JSON.stringify(c),anterior,'registrar o mesmo ano não reprocessa o arquivo');
});

test('elencos mundiais conservam IDs e resultados para a mesma seed',()=>{
  const a=gerarMundoJogadores(geradorTecnico('perf-base-real-2032'));
  const b=gerarMundoJogadores(geradorTecnico('perf-base-real-2032'));
  assert.deepEqual(a,b);
  assert.equal(new Set(a.jogadores.map(j=>String(j.id))).size,a.jogadores.length);
});
