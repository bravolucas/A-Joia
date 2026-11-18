import test from 'node:test';
import assert from 'node:assert/strict';
import {ordenarGrupoMundial48} from '../src/competicoes/desempateMundial48.js';
import {tabelaGrupoCopa} from '../src/jogador/gruposCopa.js';
const jogos=[
 {casa:'A',fora:'B',golsCasa:1,golsFora:0},
 {casa:'A',fora:'C',golsCasa:0,golsFora:5},
 {casa:'A',fora:'D',golsCasa:1,golsFora:0},
 {casa:'B',fora:'C',golsCasa:8,golsFora:0},
 {casa:'B',fora:'D',golsCasa:8,golsFora:0},
 {casa:'C',fora:'D',golsCasa:0,golsFora:1}
];
test('FIFA 2026: confronto direto prevalece sobre saldo geral em empate',()=>{
 const linhas=[
 {nome:'A',pontos:6,golsPro:2,golsContra:5,vitorias:2},
 {nome:'B',pontos:6,golsPro:16,golsContra:1,vitorias:2},
 {nome:'C',pontos:3,golsPro:5,golsContra:9,vitorias:1},
 {nome:'D',pontos:3,golsPro:1,golsContra:9,vitorias:1}
 ];
 assert.deepEqual(ordenarGrupoMundial48(linhas,jogos).slice(0,2).map(x=>x.nome),['A','B']);
});
test('Modo Rápido usa os mesmos critérios nas 12 chaves do Mundial',()=>{
 const user=jogos.filter(j=>j.casa==='A'||j.fora==='A').map(j=>({fase:0,adv:{id:j.casa==='A'?j.fora:j.casa,label:j.casa==='A'?j.fora:j.casa},gp:j.casa==='A'?j.golsCasa:j.golsFora,gc:j.casa==='A'?j.golsFora:j.golsCasa}));
 const outros=jogos.filter(j=>j.casa!=='A'&&j.fora!=='A').map(j=>({mandante:{id:j.casa,label:j.casa},visitante:{id:j.fora,label:j.fora},gp:j.golsCasa,gc:j.golsFora}));
 const k={tipo:'copaMundo',ano:2030,nac:'A',label:'A',grupo:['B','C','D'].map(id=>({id,label:id})),jogos:user,jogosGrupoOutros:outros};
 const t=tabelaGrupoCopa(k);
 assert.deepEqual(t.slice(0,2).map(x=>x.id),['A','B']);
 assert.ok(t.find(x=>x.id==='B').sg>t.find(x=>x.id==='A').sg);
});
