import test from 'node:test';
import assert from 'node:assert/strict';
import {agruparConquistasTecnico} from '../src/treinador/conquistasTecnico.js';
import {titulosConquistadosTecnico} from '../src/treinador/tecnico.js';
test('agrupa a competição e preserva todas as conquistas, anos e clubes',()=>{
 const titulos=[{nome:'Brasileirão',ano:2030,clube:'Santos',tipo:'liga'},{nome:'Brasileirão',ano:2032,clube:'Flamengo',tipo:'liga'},{nome:'Copa do Brasil',ano:2030,clube:'Santos',tipo:'copa'},{nome:'Brasileirao',ano:2031,clube:'Santos',tipo:'liga'}];
 const antes=structuredClone(titulos),g=agruparConquistasTecnico(titulos);
 assert.deepEqual(titulos,antes);assert.equal(g.length,2);assert.equal(g[0].quantidade,3);
 assert.deepEqual(g[0].conquistas.map(c=>c.ano),[2032,2031,2030]);assert.equal(g.reduce((n,g)=>n+g.quantidade,0),4);
 assert.deepEqual(g[0].conquistas.map(c=>c.clube),['Flamengo','Santos','Santos']);
});
test('aliases da mesma competição são unidos sem juntar copas ou divisões distintas',()=>{
 const g=agruparConquistasTecnico([{nome:'Copa Libertadores'},{nome:'Libertadores'},{nome:'Copa Sul-Americana'},{nome:'Serie B (Itália)'},{nome:'Brasileirão Série B'},{nome:'Campeão do Brasileirão 2030'},{nome:'Campeonato Brasileiro Série A'}]);
 assert.equal(g.length,5);assert.equal(g.find(g=>g.nome==='Copa Libertadores').quantidade,2);
 assert.equal(g.find(g=>g.nome==='Brasileirão').quantidade,2);
 assert.equal(g.find(g=>g.nome==='Serie B (Itália)').quantidade,1);
});
test('save antigo com campeão e save atual com lista conservam totais',()=>{
 const t={temporadas:[{ano:2030,clube:'Santos',liga:'brasileirao',campeao:true},{ano:2031,clube:'Santos',liga:'brasileirao',campeao:true,titulosConquistados:['Brasileirão','Copa do Brasil']}]};
 const antes=structuredClone(t),titulos=titulosConquistadosTecnico(t),g=agruparConquistasTecnico(titulos);
 assert.equal(titulos.length,3);assert.equal(g.find(g=>g.nome==='Brasileirão').quantidade,2);assert.deepEqual(t,antes);assert.deepEqual(agruparConquistasTecnico([]),[]);
});
