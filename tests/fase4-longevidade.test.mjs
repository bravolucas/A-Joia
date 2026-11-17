import test from 'node:test';
import assert from 'node:assert/strict';
import { simularTemporadaMundo } from '../src/comum/lib.js';

const clubes = [{ nome: 'Clube Teste', liga: 'brasileirao', forca: 75 }];
const jogador = idade => ({
  id: 1, nome: 'Veterano', nac: 'BRA', posicao: 'ATA',
  idade, ovr: 76, potencial: 80, picoIdade: 28,
  clubeNome: 'Clube Teste', clubeOrigem: 'Clube Teste', liga: 'brasileirao',
  carreira: { gols: 0, assist: 0, jogos: 0, temporadas: 0 },
  aposentado: false,
});
const simular = (idade, rng = () => 0.99) => simularTemporadaMundo(
  { jogadores: [jogador(idade)], temporada: 0 },
  rng, { clubes, clubeControlado: 'Clube Teste', registrarPremio: false },
);

test('veterano de 37 anos não se aposenta obrigatoriamente', () => {
  const proximo = simular(36);
  assert.equal(proximo.jogadores.find(j => j.id === 1).aposentado, false);
});

test('aposentadoria forçada ocorre até os 41 anos', () => {
  const proximo = simular(40);
  assert.equal(proximo.jogadores.find(j => j.id === 1).aposentado, true);
});

test('aposentadoria mantém identidade e promove substituto com ID distinto', () => {
  const proximo = simular(40);
  const ids = proximo.jogadores.map(j => String(j.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(proximo.jogadores.some(j => j.id === 1 && j.aposentado));
  assert.ok(proximo.jogadores.some(j => j.id !== 1 && !j.aposentado));
});

test('agente livre de 39 anos continua elegível; aos 41 se aposenta', () => {
  const livre = jogador(38);
  livre.clubeNome = null;
  const mundo = { jogadores: [livre], temporada: 0 };
  const primeiro = simularTemporadaMundo(mundo, () => 0.99, {
    clubes: [], clubeControlado: 'Clube Teste', registrarPremio: false,
  });
  assert.equal(primeiro.jogadores.find(j => j.id === 1).idade, 39);
  assert.equal(primeiro.jogadores.find(j => j.id === 1).aposentado, false);
  const segundo = simularTemporadaMundo({
    jogadores: [{ ...livre, idade: 40 }], temporada: 0,
  }, () => 0.99, {
    clubes: [], clubeControlado: 'Clube Teste', registrarPremio: false,
  });
  assert.equal(segundo.jogadores.find(j => j.id === 1).aposentado, true);
});
