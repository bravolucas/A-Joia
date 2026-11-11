import test from 'node:test';
import assert from 'node:assert/strict';
import {CLUBES} from '../src/dados/data.js';
import {clubeDe,criarJogador,carregarRapido} from '../src/jogador/rapido.js';
import {CLUBES_CONVITES_TECNICO} from '../src/treinador/tecnico.js';
import {estadoInicialClubes} from '../src/comum/lib.js';
import {normalizarCarreira} from '../src/completo/save.js';
import {corrigirEquilibrioClubes} from '../src/dados/equilibrioClubes.js';
test('Fortaleza tem força 64 nos catálogos de jogador, treinador e mundo completo',()=>{
 const f=CLUBES.find(c=>c.nome==='Fortaleza');assert.equal(f.forca,64);assert.equal(f.liga,'serieB');assert.equal(clubeDe('Fortaleza').forca,64);assert.equal(CLUBES_CONVITES_TECNICO.find(c=>c.nome==='Fortaleza').elenco,64);assert.equal(estadoInicialClubes().Fortaleza.forca,64);
});
test('save completo antigo migra uma vez, preservando evolução, investimentos e histórico',()=>{
 const c={clube:{nome:'Fortaleza',forca:80,liga:'brasileirao'},estadoClubes:{Fortaleza:{forca:80,liga:'brasileirao',palmares:{liga:2}},Santos:{forca:72}},investimentosClube:{Fortaleza:5},temporadas:[{ano:2030,clubeObj:{nome:'Fortaleza',forca:76}}]},antes=structuredClone(c),r=normalizarCarreira(c);
 assert.equal(r.clube.forca,68);assert.equal(r.estadoClubes.Fortaleza.forca,68);assert.equal(r.estadoClubes.Fortaleza.liga,'brasileirao');assert.deepEqual(r.estadoClubes.Fortaleza.palmares,{liga:2});assert.equal(r.investimentosClube.Fortaleza,5);assert.equal(r.temporadas[0].clubeObj.forca,76);assert.equal(normalizarCarreira(r).clube.forca,68);assert.deepEqual(c,antes);
});
test('carreira nova não recebe desconto ao carregar e treinador legado mantém ganhos',()=>{
 const c=criarJogador({nome:'Teste',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'equilibrado',codigo:'FORTALEZA64'});c.tecnico={clube:'Fortaleza',elenco:64,temporadas:[]};assert.equal(corrigirEquilibrioClubes(c).tecnico.elenco,64);
 delete c.ajustesCadastro;c.tecnico.elenco=81;c.tecnico.opcoesInicio=[{clube:'Fortaleza',elenco:76}];c.tecnico.propostas=[{nome:'Fortaleza',elenco:76},{nome:'Santos',elenco:72}];const antigo=globalThis.localStorage;globalThis.localStorage={getItem:()=>JSON.stringify({v:1,c})};try{const r=carregarRapido();assert.equal(r.c.tecnico.elenco,69);assert.equal(r.c.tecnico.opcoesInicio[0].elenco,64);assert.equal(r.c.tecnico.propostas[0].elenco,64);assert.equal(r.c.tecnico.propostas[1].elenco,72);assert.equal(corrigirEquilibrioClubes(r.c).tecnico.elenco,69);}finally{globalThis.localStorage=antigo;}
});
