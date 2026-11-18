import test from 'node:test';
import assert from 'node:assert/strict';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
import {aplicarProrrogacao,aplicarProrrogacaoAgregado} from '../src/competicoes/prorrogacaoMata.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa,simularCampanhaCopa} from '../src/treinador/copasEscolha.js';

test('empate no jogo único gera 30 minutos, preserva placar dos 90 minutos e soma gols',()=>{
 const empate={casa:'A',fora:'B',golsCasa:2,golsFora:2};
 const r=aplicarProrrogacao(empate,87,74,geradorTecnico('extra-90'));
 assert.deepEqual(r.prorrogacao.placar90,{golsCasa:2,golsFora:2});
 assert.equal(r.golsCasa,2+r.prorrogacao.golsCasa);
 assert.equal(r.golsFora,2+r.prorrogacao.golsFora);
 assert.deepEqual(empate,{casa:'A',fora:'B',golsCasa:2,golsFora:2},'não altera placar original');
 assert.equal(aplicarProrrogacao({...empate,golsCasa:3},80,70,()=>0.5).prorrogacao,undefined);
});
test('prorrogação no segundo jogo respeita o agregado e não inventa terceira partida',()=>{
 const ida={casa:'A',fora:'B',golsCasa:1,golsFora:0};
 const volta={casa:'B',fora:'A',golsCasa:1,golsFora:0};
 const r=aplicarProrrogacaoAgregado(ida,volta,85,81,geradorTecnico('extra-volta'));
 assert.equal(r.prorrogacao.placar90.golsCasa,1);
 assert.equal(r.prorrogacao.placar90.golsFora,0);
 assert.equal(ida.golsCasa+r.golsFora,1+r.prorrogacao.golsFora);
 assert.equal(ida.golsFora+r.golsCasa,1+r.prorrogacao.golsCasa);
});
test('mata-mata registra vitória após prorrogação ou mantém escolha interativa de pênaltis',()=>{
 const pool=[{nome:'A',forca:78},{nome:'B',forca:77}];
 let encontrouProrrogacao=false,encontrouPenaltis=false;
 for(let i=0;i<250;i++){
  const c=criarCampanhaCopa({nome:'Copa do Mundo',tipo:'copaMundo',usuario:'A',forcaUsuario:78,clubes:pool,formato:'mata',ano:2030,seed:'et-'+i});
  const d=decisaoCopa(c),j=escolherCopa(c,d.chave,'controlar');
  if(j.resultado.jogo.prorrogacao)encontrouProrrogacao=true;
  if(j.resultado.penaltisPendentes)encontrouPenaltis=true;
  if(encontrouProrrogacao&&encontrouPenaltis)break;
 }
 assert.ok(encontrouProrrogacao,'término dos 90 minutos empatado deve gerar tempo extra');
 assert.ok(encontrouPenaltis,'pênaltis continuam possíveis após 120 minutos');
});
