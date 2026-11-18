import test from 'node:test';
import assert from 'node:assert/strict';
import {simularCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {SELECOES_TECNICO} from '../src/treinador/selecoesTecnico.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {simularPlacarRealista,mediasGols} from '../src/competicoes/motorPlacares.js';
import {temIdaVolta} from '../src/competicoes/regrasIdaVolta.js';
import {jogosDaCampanha} from '../src/competicoes/jogosCampanha.js';

test('Copa do Mundo 2026: 48 equipes, 12 grupos e 104 partidas com terceiro lugar',()=>{
 const equipes=SELECOES_TECNICO.slice(0,48).map(s=>({...s,forca:s.elenco}));
 assert.equal(equipes.length,48);
 const eu=equipes[0];
 const c=simularCampanhaCopa({nome:'Copa do Mundo',tipo:'copaMundo',usuario:eu.nome,
   forcaUsuario:eu.forca,clubes:equipes,formato:'selecao48',ano:2026,seed:'auditoria-48-2026'});
 assert.equal(c.participantes,48);
 assert.equal(c.fase,'fim');
 assert.equal(c.grupos.length,12);
 assert(c.grupos.every(g=>g.classificacao.length===4));
 assert.equal(c.grupos.reduce((n,g)=>n+g.jogos.length,0),72);
 assert.equal(c.melhoresTerceiros.length,8);
 assert.equal(c.fases.filter(f=>f.fase==='16 avos de final').flatMap(f=>f.jogos).length,16);
 assert.equal(c.fases.find(f=>f.fase==='Oitavas de final')?.jogos.length,8);
 assert.equal(c.fases.find(f=>f.fase==='Quartas de final')?.jogos.length,4);
 assert.equal(c.fases.find(f=>f.fase==='Semifinal')?.jogos.length,2);
 assert.equal(c.fases.find(f=>f.fase==='Final')?.jogos.length,1);
 assert.equal(c.fases.find(f=>f.fase==='Disputa de terceiro lugar')?.jogos.length,1);
 assert.equal(jogosDaCampanha(c).length,104);
 assert(c.campeao);
 assert(c.terceiroLugar);
});
test('ida e volta respeitam regulamento e final única',()=>{
 assert.equal(temIdaVolta({nome:'Copa do Brasil',ano:2026,tamanho:64}),false);
 for(const tamanho of [32,16,8,4])assert.equal(temIdaVolta({nome:'Copa do Brasil',ano:2026,tamanho}),true);
 assert.equal(temIdaVolta({nome:'Copa do Brasil',ano:2026,tamanho:2}),false);
 assert.equal(temIdaVolta({nome:'Copa Libertadores',tamanho:16}),true);
 assert.equal(temIdaVolta({nome:'Copa Libertadores',tamanho:2}),false);
 assert.equal(temIdaVolta({nome:'Champions League',tamanho:4}),true);
 assert.equal(temIdaVolta({nome:'Copa do Mundo',tamanho:32}),false);
});
test('placares dependem da diferença de força, sem teto 3–1',()=>{
 const rng=geradorTecnico('auditoria-placares-90-30');
 const resultados=Array.from({length:1000},()=>simularPlacarRealista(90,30,rng));
 assert(resultados.some(r=>r.golsCasa>=6));
 assert(resultados.some(r=>r.golsCasa>=8));
 assert(resultados.filter(r=>r.golsCasa>r.golsFora).length>850);
 const iguais=Array.from({length:1000},()=>simularPlacarRealista(75,75,rng));
 assert(iguais.some(r=>r.golsCasa===r.golsFora));
 assert(iguais.some(r=>r.golsCasa<r.golsFora));
 assert(mediasGols(90,30).casa>mediasGols(75,75).casa);
});
