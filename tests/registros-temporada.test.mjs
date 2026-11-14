import test from 'node:test';
import assert from 'node:assert/strict';
import {registrarRodadaTemporada,estatisticasReaisTemporada} from '../src/completo/registrosTemporada.js';
import {dividirPorCompeticao} from '../src/comum/lib.js';
import {CLUBES} from '../src/dados/data.js';

test('arquivo conserva todas as rodadas sem duplicar ao retomar a partida',()=>{
  const card={};
  const primeira={rodada:1,casa:'A',fora:'B',golsCasa:2,golsFora:1};
  registrarRodadaTemporada(card,[primeira,{rodada:1,casa:'C',fora:'D',golsCasa:0,golsFora:0}]);
  const retomado=JSON.parse(JSON.stringify(card));
  registrarRodadaTemporada(retomado,[primeira]);
  registrarRodadaTemporada(retomado,[{rodada:2,casa:'B',fora:'A',golsCasa:1,golsFora:3}]);
  assert.equal(retomado.jogosLiga.length,3);
  assert.deepEqual(retomado.jogosLiga[0],primeira);
  assert.equal(card.jogosLiga.length,2);
});

test('registros legados sem placar estruturado não criam resultados fictícios',()=>{
  const card={};
  registrarRodadaTemporada(card,[{texto:'A 2 x 1 B'},{casa:'A',fora:'B',golsCasa:2}]);
  assert.deepEqual(card.jogosLiga,[]);
});

test('totais reais somam liga e copas sem contar ausências nem seleção',()=>{
  const card={statsCompeticoes:{copaNacional:{jogos:2,gols:3,assist:1,defesas:4,cleanSheets:1},selecao:{jogos:3,gols:9},copaDoMundo:{jogos:7,gols:8}}};
  const stats=estatisticasReaisTemporada(card,[{golsMinha:1,assistMinha:2,defesas:5,cleanSheets:1},{suspenso:true},{descansou:true},{naoEscalado:true}]);
  assert.deepEqual([stats.jogos,stats.gols,stats.assist,stats.defesas,stats.cleanSheets],[3,4,3,9,2]);
  assert.equal(stats.porCompeticaoReal.liga.jogos,1);
  assert.equal(stats.porCompeticaoReal.selecao,undefined);
  const linhas=dividirPorCompeticao({clube:CLUBES.find(c=>c.liga==='brasileirao'),idade:24},{...card,...stats,nota:7});
  assert.equal(linhas.find(l=>l.id==='liga').gols,1);
  assert.equal(linhas.find(l=>l.id==='copaNacional').gols,3);
  assert.equal(linhas.reduce((n,l)=>n+l.jogos,0),stats.jogos);
});

test('temporada sem participações conserva zeros e não redistribui projeções',()=>{
  const stats=estatisticasReaisTemporada({gols:40},[{suspenso:true},{naoEscalado:true}]);
  assert.equal(stats.jogos,0);
  assert.equal(stats.gols,0);
  assert.equal(stats.defesas,0);
});
