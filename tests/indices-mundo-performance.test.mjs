import test from 'node:test';
import assert from 'node:assert/strict';
import {registrarMundoVivo} from '../src/simulacao/mundoVivo.js';
import {gerarMundoJogadores} from '../src/comum/lib.js';
import {avaliarClubeNoMundo} from '../src/simulacao/forcaEquipe.js';
import {CLUBES} from '../src/dados/data.js';
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

test('força anual usa apenas titulares ativos do clube e conserva cálculo original',()=>{
  const santos=CLUBES.find(c=>c.nome==='Santos');
  assert.ok(santos);
  const base={codigo:'elencos-por-clube',nome:'Atleta',posicao:'ATA',
    mundo:{elencosCompletos:true,jogadores:[
      {id:1,clubeNome:'Santos',posicao:'ATA',ovr:91,aposentado:false},
      {id:2,clubeNome:'Santos',posicao:'ZAG',ovr:78,aposentado:false},
      {id:3,clubeNome:'Flamengo',posicao:'ATA',ovr:94,aposentado:false},
      {id:4,clubeNome:'Santos',posicao:'GOL',ovr:98,aposentado:true}
    ]}};
  const ano={ano:2033,clube:'Santos',ligaId:'brasileirao'};
  registrarMundoVivo(base,ano);
  const perfil=base.universo.clubes.Santos,historico=perfil.historico[0];
  const resultadoSemIndice=avaliarClubeNoMundo({...base,universo:{clubes:{Santos:perfil}}},santos);
  assert.equal(historico.forca,resultadoSemIndice.forca);
  assert.equal(historico.forcaAntes,avaliarClubeNoMundo({mundo:base.mundo},santos).forca);
});

test('elencos mundiais conservam IDs e resultados para a mesma seed',()=>{
  const a=gerarMundoJogadores(geradorTecnico('perf-base-real-2032'));
  const b=gerarMundoJogadores(geradorTecnico('perf-base-real-2032'));
  assert.deepEqual(a,b);
  assert.equal(new Set(a.jogadores.map(j=>String(j.id))).size,a.jogadores.length);
});
