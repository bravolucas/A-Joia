import test from 'node:test';
import assert from 'node:assert/strict';
import { ordenarTabelaBrasileira } from '../src/simulacao/desempateBrasileiro.js';
import { simularLigaMundo } from '../src/treinador/classificacoesMundoTecnico.js';
import { CLUBES } from '../src/dados/data.js';

const linha = (nome, extras = {}) => ({
  nome, pontos: 60, vitorias: 17, saldoGols: 10, golsPro: 45,
  golsContra: 35, ...extras,
});

test('art. 12: gols pró desempatam depois de vitórias e saldo, antes de confronto direto', () => {
  const entrada = [
    linha('A', { golsPro: 45, golsContra: 35 }),
    linha('B', { golsPro: 48, golsContra: 38 }),
  ];
  assert.deepEqual(ordenarTabelaBrasileira(entrada).map(x => x.nome), ['B', 'A']);
});

test('art. 12: confronto direto dos dois jogos decide entre exatamente duas equipes empatadas', () => {
  const entrada = [linha('A'), linha('B')];
  const jogos = [
    { casa: 'B', fora: 'A', golsCasa: 0, golsFora: 1 },
    { casa: 'A', fora: 'B', golsCasa: 2, golsFora: 1 },
  ];
  assert.deepEqual(ordenarTabelaBrasileira(entrada, jogos).map(x => x.nome), ['A', 'B']);
  assert.deepEqual(ordenarTabelaBrasileira(entrada.reverse(), jogos).map(x => x.nome), ['A', 'B']);
});

test('art. 12 §2º: empate entre três clubes ignora confronto direto', () => {
  const entrada = [linha('A', {cartoesVermelhos: 2}), linha('B', {cartoesVermelhos: 1}),
    linha('C', {cartoesVermelhos: 0})];
  const jogos = [
    {casa:'A',fora:'B',golsCasa:4,golsFora:0},
    {casa:'B',fora:'A',golsCasa:0,golsFora:1},
  ];
  assert.deepEqual(ordenarTabelaBrasileira(entrada, jogos).map(x => x.nome), ['C', 'B', 'A']);
});

test('art. 12: cartões vermelhos e amarelos registrados desempatarão nesta ordem', () => {
  const entrada = [
    linha('A', {cartoesVermelhos: 1, cartoesAmarelos: 10}),
    linha('B', {cartoesVermelhos: 1, cartoesAmarelos: 9}),
  ];
  assert.deepEqual(ordenarTabelaBrasileira(entrada).map(x => x.nome), ['B', 'A']);
});

test('Série B simulada mantém gols marcados e classificados ordenados por critérios verificados', () => {
  const clubes = CLUBES.filter(c => c.liga === 'serieB');
  let seed = 91;
  const rng = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
  const resultado = simularLigaMundo(clubes, rng, 'serieB');
  assert.equal(resultado.classificacao.length, 20);
  assert.equal(resultado.jogos.length, 380);
  assert.deepEqual(
    ordenarTabelaBrasileira(resultado.classificacao, resultado.jogos).map(c => c.nome),
    resultado.classificacao.map(c => c.nome),
  );
});
