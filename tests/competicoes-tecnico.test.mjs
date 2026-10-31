import assert from 'node:assert/strict';
import test from 'node:test';
import { simularCopaNacionalTecnico, simularCopaContinentalTecnico, classificarVagasContinentalTecnico, classificarVagasPorRegraTecnico } from '../competicoesTecnico.js';
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
function classificacoesPorLiga(lista = clubes) {
  const ligas = [...new Set(lista.map(c => c.liga))];
  return Object.fromEntries(ligas.map(liga => {
    const times = lista.filter(c => c.liga === liga).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return [liga, { classificacao: times.map((clube, indice) => ({
      nome: clube.nome, posicao: indice + 1, jogos: 38, pontos: (times.length - indice) * 3,
      vitorias: times.length - indice, golsPro: (times.length - indice) * 2, golsContra: indice,
    })) }];
  }));
}

test('copa nacional simula chave completa e registra placares do treinador', () => {
  const copa = simularCopaNacionalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', forcaUsuario: 62,
    nome: 'Copa do Brasil', rng: rngSeed(13)
  });
  assert.equal(copa.participantes, 20);
  assert.equal(copa.fases.length, 5);
  assert.deepEqual(copa.fases.map(f => f.jogos.length), [16, 8, 4, 2, 1]);
  assert.match(copa.fases[0].fase, /Fase preliminar/);
  assert.deepEqual(copa.fases.slice(1).map(f => f.fase), ['Oitavas de final', 'Quartas de final', 'Semifinal', 'Final']);
  const participantesNaChave = new Set(copa.fases[0].jogos.flatMap(j => [j.casa, j.fora, j.bye].filter(Boolean)));
  assert.deepEqual([...participantesNaChave].sort(), clubes.filter(c => c.pais === 'Brasil').map(c => c.nome).sort());
  assert.ok(copa.campeao);
  assert.ok(copa.jogosUsuario.length >= 1 && copa.jogosUsuario.length <= 5);
  assert.ok(copa.jogosUsuario.filter(j => !j.bye).every(j => Number.isFinite(j.golsCasa) && Number.isFinite(j.golsFora)));
});

test('copa nacional não inclui à força clube ausente do cadastro', () => {
  const copa = simularCopaNacionalTecnico({
    clubes, nomeUsuario: 'Clube não cadastrado', pais: 'Brasil', forcaUsuario: 95,
    nome: 'Copa do Brasil', rng: rngSeed(71)
  });
  assert.equal(copa.participantes, 0);
  assert.equal(copa.campeao, null);
  assert.equal(copa.faseUsuario, 'Não classificado');
});

test('continental simula grupos, classificação e mata-mata até a final', () => {
  const participantesQualificados = classificarVagasContinentalTecnico({
    clubes, classificacoesMundo: classificacoesPorLiga(), pais: 'Brasil'
  });
  assert.equal(participantesQualificados.length, 16);
  assert.ok(participantesQualificados.some(c => c.nome === 'Brasil 0'));
  const copa = simularCopaContinentalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', forcaUsuario: 62,
    nome: 'Copa Libertadores', participantesQualificados, rng: rngSeed(29)
  });
  assert.equal(copa.grupos.length, 4);
  assert.ok(copa.grupos.every(g => g.jogos.length === 12 && g.classificacao.length === 4));
  assert.ok(copa.grupos.every(g => g.classificacao[0].pontos >= g.classificacao[1].pontos));
  assert.deepEqual(copa.fases.map(f => f.jogos.length), [4, 2, 1]);
  assert.ok(copa.campeao);
  assert.ok(copa.jogosUsuario.length >= 6);
});

test('formato continental aceita quantidade configurável de grupos e vagas no mata-mata', () => {
  const participantes = classificarVagasContinentalTecnico({
    clubes, classificacoesMundo: classificacoesPorLiga(), pais: 'Brasil'
  }).slice(0, 12);
  const copa = simularCopaContinentalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', nome: 'Competição teste', participantesQualificados: participantes,
    formato: { totalParticipantes: 12, grupos: 3, classificadosPorGrupo: 1, turnos: 2 }, rng: rngSeed(31)
  });
  assert.equal(copa.grupos.length, 3);
  assert.ok(copa.grupos.every(g => g.classificacao.length === 4 && g.jogos.length === 12));
  assert.deepEqual(copa.fases.map(f => f.jogos.length), [2, 1]);
  assert.equal(copa.participantes, 12);
});

test('formato continental também suporta mata-mata direto', () => {
  const participantes = classificarVagasContinentalTecnico({
    clubes, classificacoesMundo: classificacoesPorLiga(), pais: 'Brasil'
  });
  const copa = simularCopaContinentalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', nome: 'Chave teste', participantesQualificados: participantes,
    formato: { totalParticipantes: 16, grupos: 0 }, rng: rngSeed(32)
  });
  assert.equal(copa.grupos.length, 0);
  assert.deepEqual(copa.fases.map(f => f.jogos.length), [8, 4, 2, 1]);
});

test('formato continental gera calendário para grupos com número ímpar de clubes', () => {
  const participantes = classificarVagasContinentalTecnico({
    clubes, classificacoesMundo: classificacoesPorLiga(), pais: 'Brasil'
  }).slice(0, 15);
  const copa = simularCopaContinentalTecnico({
    clubes, nomeUsuario: 'Brasil 0', pais: 'Brasil', nome: 'Grupos ímpares', participantesQualificados: participantes,
    formato: { totalParticipantes: 15, grupos: 5, classificadosPorGrupo: 1, turnos: 1 }, rng: rngSeed(33)
  });
  assert.equal(copa.grupos.length, 5);
  assert.ok(copa.grupos.every(g => g.classificacao.length === 3 && g.jogos.length === 3));
});

test('vaga continental segue a classificação e não força a entrada do treinador pela força do elenco', () => {
  const clubesComForcaAlta = clubes.map(c => c.nome === 'Brasil 19' ? { ...c, elenco: 99 } : c);
  const qualificados = classificarVagasContinentalTecnico({
    clubes: clubesComForcaAlta, classificacoesMundo: classificacoesPorLiga(clubesComForcaAlta), pais: 'Brasil'
  });
  assert.equal(qualificados.length, 16);
  assert.ok(!qualificados.some(c => c.nome === 'Brasil 19'));
  assert.equal(simularCopaContinentalTecnico({
    clubes: clubesComForcaAlta, nomeUsuario: 'Brasil 19', pais: 'Brasil', forcaUsuario: 99,
    nome: 'Copa Libertadores', participantesQualificados: qualificados, rng: rngSeed(61)
  }), null);
});

test('vagas configuradas seguem as posições indicadas por liga e aceitam participantes extras', () => {
  const classificacoesMundo = classificacoesPorLiga();
  const vagas = classificarVagasPorRegraTecnico({
    clubes,
    classificacoesMundo,
    vagasPorLiga: { brasileirao: [1, 3], argentina: [2] },
    participantesExtras: ['Brasil 1'],
  });
  assert.deepEqual(vagas.map(c => c.nome), ['Brasil 0', 'Brasil 10', 'Argentina 1', 'Brasil 1']);
});

test('vagas configuradas removem duplicatas, limitam participantes e não usam a força do elenco', () => {
  const clubesComForcaAlterada = clubes.map(c => c.nome === 'Brasil 19' ? { ...c, elenco: 99 } : c);
  const vagas = classificarVagasContinentalTecnico({
    clubes: clubesComForcaAlterada,
    classificacoesMundo: classificacoesPorLiga(),
    pais: 'Brasil',
    regra: { vagasPorLiga: { brasileirao: [1, 2], argentina: [1] }, participantesExtras: ['Brasil 0'], limite: 3 }
  });
  assert.deepEqual(vagas.map(c => c.nome), ['Brasil 0', 'Brasil 1', 'Argentina 0']);
});

test('não cria vagas continentais sem tabelas anteriores ou sem clubes de vários países', () => {
  assert.deepEqual(classificarVagasContinentalTecnico({ clubes, pais: 'Brasil' }), []);
  const apenasBrasil = clubes.filter(c => c.pais === 'Brasil');
  assert.deepEqual(classificarVagasContinentalTecnico({
    clubes: apenasBrasil, classificacoesMundo: classificacoesPorLiga(apenasBrasil), pais: 'Brasil'
  }), []);
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

test('continental rejeita participantes duplicados ou inválidos antes de simular', () => {
  const base = { clubes, nomeUsuario: 'Brasil 0', nome: 'Teste', formato: { totalParticipantes: 2, grupos: 0 },
    rng: () => assert.fail('não deve simular uma lista inválida') };
  for (const participantesQualificados of [
    [clubes[0], clubes[0]], [clubes[0], null], [clubes[0], {}], [clubes[0], { nome: ' ' }]
  ]) {
    assert.equal(simularCopaContinentalTecnico({ ...base, participantesQualificados }), null);
  }
});

test('continental rejeita vagas impossíveis e mata-mata com apenas um classificado', () => {
  for (const formato of [
    { totalParticipantes: 4, grupos: 1, classificadosPorGrupo: 1 },
    { totalParticipantes: 4, grupos: 2, classificadosPorGrupo: 3 },
    { totalParticipantes: 4, grupos: 3, classificadosPorGrupo: 1 }
  ]) {
    assert.equal(simularCopaContinentalTecnico({ clubes, nomeUsuario: 'Brasil 0', nome: 'Teste',
      participantesQualificados: clubes.slice(0, 4), formato,
      rng: () => assert.fail('não deve simular um formato inválido') }), null);
  }
});
