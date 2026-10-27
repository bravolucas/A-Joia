import assert from 'node:assert/strict';
import test from 'node:test';
import { simularCopaNacionalTecnico, simularCopaContinentalTecnico } from '../competicoesTecnico.js';
import { gerarPropostasTecnico, salarioTecnico } from '../tecnico.js';
import { competicaoDoTitulo, desenhoDaTaca } from '../tacas.js';

function rngSeed(seed) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const clubes = [
  ...Array.from({ length: 20 }, (_, i) => ({ nome: `Brasil ${i}`, pais: 'Brasil', liga: 'brasileirao', elenco: 55 + i })),
  ...Array.from({ length: 20 }, (_, i) => ({ nome: `Argentina ${i}`, pais: 'Argentina', liga: 'argentina', elenco: 58 + i }))
];

test('copa nacional simula chave completa e registra placares do treinador', () => {
  const copa = simularCopaNacionalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', forcaUsuario: 62,
    nome: 'Copa do Brasil', rng: rngSeed(13)
  });
  assert.equal(copa.participantes, 16);
  assert.equal(copa.fases.length, 4);
  assert.deepEqual(copa.fases.map(f => f.jogos.length), [8, 4, 2, 1]);
  assert.ok(copa.campeao);
  assert.ok(copa.jogosUsuario.length >= 1 && copa.jogosUsuario.length <= 4);
  assert.ok(copa.jogosUsuario.every(j => Number.isFinite(j.golsCasa) && Number.isFinite(j.golsFora)));
});

test('continental simula grupos, classificação e mata-mata até a final', () => {
  const copa = simularCopaContinentalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', forcaUsuario: 62,
    nome: 'Copa Libertadores', rng: rngSeed(29)
  });
  assert.equal(copa.grupos.length, 4);
  assert.ok(copa.grupos.every(g => g.jogos.length === 12 && g.classificacao.length === 4));
  assert.ok(copa.grupos.every(g => g.classificacao[0].pontos >= g.classificacao[1].pontos));
  assert.deepEqual(copa.fases.map(f => f.jogos.length), [4, 2, 1]);
  assert.ok(copa.campeao);
  assert.ok(copa.jogosUsuario.length >= 6);
});

test('OVR e estatísticas históricas não alteram salário ou propostas do treinador', () => {
  const base = { clube: 'Santos', reputacao: 70, temporadas: Array(3).fill({ clube: 'Santos' }), vinculosJogador: [] };
  const iniciante = { ...base, titulos: 0, vitorias: 0, empates: 0, derrotas: 0 };
  const experiente = { ...base, titulos: 9, vitorias: 500, empates: 80, derrotas: 30 };
  assert.equal(salarioTecnico(iniciante), salarioTecnico(experiente));
  assert.deepEqual(gerarPropostasTecnico(iniciante, rngSeed(43)), gerarPropostasTecnico(experiente, rngSeed(43)));
});

test('taças de ligas adicionadas usam o visual de copa', () => {
  assert.equal(competicaoDoTitulo('KNVB Beker').tipo, 'copa');
  assert.equal(competicaoDoTitulo('Türkiye Kupası').tipo, 'copa');
  assert.equal(competicaoDoTitulo('AFC Champions League Elite').tipo, 'continental');
});

test('Copa do Brasil tem taça própria dourada com cores brasileiras', () => {
  assert.equal(competicaoDoTitulo('Copa do Brasil').tipo, 'copa');
  const desenho = desenhoDaTaca('copa', 'Copa do Brasil');
  assert.equal(desenho.metal, 'ouro');
  assert.equal(desenho.tampa, true);
  assert.equal(desenho.gema, 'rubi');
  assert.deepEqual(desenho.faixas, ['#009C3B', '#FFDF00']);
});
