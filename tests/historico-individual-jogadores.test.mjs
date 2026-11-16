import test from 'node:test';
import assert from 'node:assert/strict';
import { registrarHistoricoTemporada, lerHistoricoTemporadas, LIMITE_HISTORICO_TEMPORADAS } from '../src/simulacao/historicoJogadorMundo.js';
import { completarCarenciasMundo, simularTemporadaMundo } from '../src/comum/lib.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';

const clubes = [
  { nome: 'Equipe A', liga: 'brasileirao', forca: 70 },
  { nome: 'Equipe B', liga: 'brasileirao', forca: 68 },
];

test('registra estatísticas e evolução sem alterar o atleta e converte para leitura', () => {
  const jogador = { id: 1, ovr: 76, jogos: 34, gols: 11, assist: 5, nota: 7.42 };
  const antes = structuredClone(jogador);
  const historico = registrarHistoricoTemporada(jogador, {
    temporada: 1, ano: 2027, clube: 'Equipe A',
    liga: 'brasileirao', idadeInicial: 21, ovrInicial: 72,
  });
  assert.deepEqual(jogador, antes);
  const [registro] = lerHistoricoTemporadas({ historicoTemporadas: historico });
  assert.deepEqual(registro, {
    temporada: 1, ano: 2027, clube: 'Equipe A', liga: 'brasileirao',
    idadeInicial: 21, ovrInicial: 72, ovrFinal: 76, jogos: 34,
    gols: 11, assistencias: 5, nota: 7.42,
  });
});

test('reprocessar temporada substitui registro e mantém limite de armazenamento', () => {
  const jogador = { ovr: 80, jogos: 30, gols: 10, assist: 3, nota: 7 };
  for (let temporada = 1; temporada <= 45; temporada++) {
    jogador.historicoTemporadas = registrarHistoricoTemporada(jogador, {
      temporada, clube: 'Equipe A', idadeInicial: 20, ovrInicial: 75,
    });
  }
  assert.equal(jogador.historicoTemporadas.length, LIMITE_HISTORICO_TEMPORADAS);
  assert.equal(jogador.historicoTemporadas[0][0], 16);
  jogador.gols = 13;
  jogador.historicoTemporadas = registrarHistoricoTemporada(jogador, {
    temporada: 45, clube: 'Equipe A', idadeInicial: 21, ovrInicial: 80,
  });
  assert.equal(jogador.historicoTemporadas.length, LIMITE_HISTORICO_TEMPORADAS);
  assert.equal(lerHistoricoTemporadas(jogador).at(-1).gols, 13);
  assert.deepEqual(lerHistoricoTemporadas({}), []);
});

test('motor anual gera histórico vinculado ao próprio atleta e não modifica o save de origem', () => {
  const jogadores = completarCarenciasMundo([], clubes, geradorTecnico('jogadores-historicos'));
  const mundo = { jogadores, temporada: 0, cadastroElencos: true };
  const antes = structuredClone(mundo);
  const resultado = simularTemporadaMundo(mundo, geradorTecnico('historico-ano-1'), {
    clubes, ano: 2027,
  });
  assert.deepEqual(mundo, antes);
  assert.equal(resultado.temporada, 1);
  for (const antigo of jogadores) {
    const atualizado = resultado.jogadores.find(j => j.id === antigo.id);
    assert.ok(atualizado, String(antigo.id));
    const historico = lerHistoricoTemporadas(atualizado);
    assert.equal(historico.length, 1);
    assert.equal(historico[0].temporada, 1);
    assert.equal(historico[0].ano, 2027);
    assert.equal(historico[0].clube, antigo.clubeNome);
    assert.equal(historico[0].idadeInicial, antigo.idade);
    assert.equal(historico[0].ovrInicial, antigo.ovr);
    assert.equal(historico[0].jogos, atualizado.jogos);
    assert.equal(historico[0].gols, atualizado.gols);
  }
});

test('histórias seguem o ID individual mesmo após cinco ciclos de mercado e envelhecimento', () => {
  let mundo = { jogadores: completarCarenciasMundo([], clubes, geradorTecnico('vida-propria')), temporada: 0 };
  const primeiroId = mundo.jogadores[0].id;
  for (let ano = 0; ano < 5; ano++) {
    mundo = simularTemporadaMundo(mundo, geradorTecnico('vida-ano-' + ano), {
      clubes, ano: 2027 + ano,
    });
  }
  const jogador = mundo.jogadores.find(j => j.id === primeiroId);
  assert.ok(jogador);
  const historico = lerHistoricoTemporadas(jogador);
  assert.deepEqual(historico.map(r => r.temporada), [1, 2, 3, 4, 5]);
  assert.equal(new Set(historico.map(r => r.temporada)).size, 5);
  assert.equal(historico.reduce((total, r) => total + r.jogos, 0), jogador.carreira.jogos);
});
