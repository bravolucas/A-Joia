import test from 'node:test';
import assert from 'node:assert/strict';
import { simularTemporadaMundo } from '../src/comum/lib.js';

const clubes = [{ nome: 'Clube Teste', liga: 'brasileirao', forca: 76 }];

function criarJogador(idade, posicao = 'ATA') {
  return {
    id: 1, nome: 'Atleta IA', nac: 'BRA', posicao,
    idade, ovr: 80, potencial: 83, picoIdade: 29,
    clubeNome: 'Clube Teste', clubeOrigem: 'Clube Teste',
    liga: 'brasileirao', aposentado: false,
    carreira: { gols: 0, assist: 0, jogos: 0, temporadas: 0 },
  };
}

function simular(idade, posicao = 'ATA') {
  const original = { jogadores: [criarJogador(idade, posicao)], temporada: 0 };
  const snapshot = structuredClone(original);
  const proximo = simularTemporadaMundo(original, () => 0.99, {
    clubes, clubeControlado: 'Clube Teste', registrarPremio: false,
  });
  assert.deepEqual(original, snapshot, 'simulação não pode modificar o save de origem');
  const atleta = proximo.jogadores.find(j => j.id === 1);
  assert.ok(atleta, 'identidade do veterano deve ser preservada');
  return atleta;
}

test('jogadores de linha com até 32 anos mantêm disponibilidade integral', () => {
  assert.equal(simular(27).jogos, simular(32).jogos);
});

test('veteranos de linha disputam menos partidas que adultos com o mesmo OVR', () => {
  const adulto = simular(29);
  const veterano = simular(39);
  assert.ok(veterano.jogos > 0 && veterano.jogos < adulto.jogos,
    `adulto ${adulto.jogos}, veterano ${veterano.jogos}`);
  assert.equal(veterano.idade, 40);
  assert.equal(veterano.aposentado, false);
});

test('goleiros veteranos preservam mais partidas que atletas de linha da mesma idade', () => {
  const goleiro = simular(39, 'GOL');
  const linha = simular(39, 'ATA');
  assert.ok(goleiro.jogos > linha.jogos,
    `goleiro ${goleiro.jogos}, linha ${linha.jogos}`);
  assert.ok(goleiro.jogos <= 46);
});

test('temporada reduzida mantém totais acumulados e histórico individual', () => {
  const p = simular(38);
  assert.equal(p.carreira.jogos, p.jogos);
  assert.equal(p.carreira.temporadas, 1);
  assert.equal(p.temporadaEstatisticas, 1);
  assert.ok(Array.isArray(p.historicoTemporadas) && p.historicoTemporadas.length > 0);
});
