import test from 'node:test';
import assert from 'node:assert/strict';
import {perfilPesoMundo} from '../src/simulacao/perfilPesoMundo.js';

const tamanho = valor => Buffer.byteLength(JSON.stringify(valor),'utf8');

test('perfil soma bytes UTF-8 exatos sem alterar mundo, IDs nem históricos',()=>{
  const mundo={temporada:50,jogadores:[
    {id:'1',nome:'João "Águia"',aposentado:false,historicoTemporadas:[[1,2030,'São Paulo']],movimentos:[]},
    {id:'2',nome:'Müller',aposentado:true,titulosConquistados:[[2,2031,'copa','Liga','Köln']],carreira:{gols:8}},
  ],historicoCompeticoes:{BRA:[2030,2031]},configuracao:'á'};
  const antes=structuredClone(mundo);
  const p=perfilPesoMundo(mundo);
  assert.equal(p.totalBytes,tamanho(mundo));
  assert.equal(p.jogadores.totalBytes,tamanho(mundo.jogadores));
  assert.equal(p.jogadores.ativos.quantidade,1);
  assert.equal(p.jogadores.aposentados.quantidade,1);
  assert.equal(p.jogadores.ativos.bytes+p.jogadores.aposentados.bytes+p.jogadores.estruturaBytes,p.jogadores.totalBytes);
  assert.equal(Object.values(p.jogadores.campos).reduce((a,b)=>a+b,0),
    mundo.jogadores.reduce((a,b)=>a+tamanho(b),0));
  assert.equal(p.jogadores.totalBytes+p.outrosCamposMundo.totalBytes,p.totalBytes);
  assert.deepEqual(mundo,antes);
});

test('suporta mundo sem atletas, sem histórico e valida entrada',()=>{
  const p=perfilPesoMundo({jogadores:[],temporada:0});
  assert.equal(p.jogadores.totalBytes,2);
  assert.equal(p.jogadores.estruturaBytes,2);
  assert.equal(p.jogadores.aposentados.quantidade,0);
  assert.throws(()=>perfilPesoMundo({jogadores:null}),TypeError);
});
