import test from 'node:test';
import assert from 'node:assert/strict';
import {simularCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {temIdaVolta} from '../src/competicoes/regrasIdaVolta.js';
import {simularPlacarRealista} from '../src/competicoes/motorPlacares.js';
import {probabilidadesPlacar} from '../src/competicoes/motorPlacar.js';
import {eventosIndividuaisPartida} from '../src/jogador/estatisticasPartida.js';

const selecoes=Array.from({length:48},(_,i)=>({nome:'Seleção '+String(i+1).padStart(2,'0'),forca:Math.max(34,96-i)}));
test('Copa do Mundo de 48 seleções: 12 grupos, 8 terceiros e 104 partidas reais',()=>{
 const camp=simularCampanhaCopa({nome:'Copa do Mundo',tipo:'copaMundo',usuario:selecoes[0].nome,
  forcaUsuario:selecoes[0].forca,clubes:selecoes,ano:2030,formato:'selecao48',seed:'auditoria-104'});
 assert.equal(camp.fase,'fim');
 assert.equal(camp.participantes,48);
 assert.equal(camp.grupos.length,12);
 assert.ok(camp.grupos.every(g=>g.classificacao.length===4&&g.jogos.length===6));
 assert.equal(camp.melhoresTerceiros.length,8);
 const classificados=new Set([...camp.grupos.flatMap(g=>g.classificacao.slice(0,2).map(x=>x.nome)),...camp.melhoresTerceiros]);
 assert.equal(classificados.size,32);
 assert.equal(camp.fases.filter(f=>/terceiro lugar/i.test(f.fase)).length,1);
 assert.deepEqual(camp.fases.map(f=>f.jogos.length).sort((a,b)=>a-b),[1,1,2,4,8,16]);
 const numJogos=camp.grupos.reduce((n,g)=>n+g.jogos.length,0)+camp.fases.reduce((n,f)=>n+f.jogos.length,0);
 assert.equal(numJogos,104);
 assert.ok(classificados.has(camp.campeao));
});
test('Copa do Brasil e Libertadores aplicam ida e volta apenas nas fases previstas',()=>{
 for(const tamanho of [32,16,8,4])assert.equal(temIdaVolta({nome:'Copa do Brasil',ano:2026,tamanho}),true);
 for(const tamanho of [128,64,2])assert.equal(temIdaVolta({nome:'Copa do Brasil',ano:2026,tamanho}),false);
 assert.equal(temIdaVolta({nome:'Copa Libertadores',ano:2026,tamanho:16}),true);
 assert.equal(temIdaVolta({nome:'Copa Libertadores',ano:2026,tamanho:2}),false);
 assert.equal(temIdaVolta({nome:'Copa do Mundo',ano:2030,tamanho:32}),false);
});
test('motor de resultados permite grandes goleadas, sem torná-las obrigatórias',()=>{
 let seed=31;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 let fortes=0,goleadas=0,derrotas=0;
 for(let i=0;i<7000;i++){
  const p=simularPlacarRealista(90,30,rng);
  fortes+=p.golsCasa;
  if(p.golsCasa>=5)goleadas++;
  if(p.golsCasa<p.golsFora)derrotas++;
 }
 assert.ok(fortes/7000>3.2);
 assert.ok(goleadas/7000>.25);
 assert.ok(goleadas/7000<.85);
 assert.ok(derrotas/7000<.07);
 const p=probabilidadesPlacar(90,30);
 assert.ok(p.vitoria>.9);
 assert.ok(Math.abs(p.vitoria+p.empate+p.derrota-1)<1e-8);
});
test('estatísticas individuais contam apenas gols anulados do atleta',()=>{
 const itens=eventosIndividuaisPartida({golsMinha:1,assistMinha:2,amarelo:true,defesas:0,eventos:[
  {tipo:'var',meu:true,golAnulado:true},{tipo:'var',meu:false,golAnulado:true}
 ]});
 assert.equal(itens.find(x=>x.id==='gol').valor,1);
 assert.equal(itens.find(x=>x.id==='assist').valor,2);
 assert.equal(itens.find(x=>x.id==='amarelo').valor,1);
 assert.equal(itens.find(x=>x.id==='anulado').valor,1);
 assert.equal(eventosIndividuaisPartida({suspenso:true})[0].rotulo,'Suspenso');
});
