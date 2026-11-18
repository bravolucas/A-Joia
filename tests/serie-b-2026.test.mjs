import assert from 'node:assert/strict';
import test from 'node:test';
import { CLUBES } from '../src/dados/data.js';
import { resolverPlayoffSerieB } from '../src/competicoes/playoffSerieB.js';
import { simularClassificacoesMundoTecnico, atualizarLigasMundoTecnico } from '../src/treinador/classificacoesMundoTecnico.js';

function rngSeed(seed) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const serieA = CLUBES.filter(c => c.liga === 'brasileirao');
const serieB = CLUBES.filter(c => c.liga === 'serieB');
const esperadosB = [
  'América-MG','Athletic','Atlético-GO','Avaí','Botafogo-SP',
  'Ceará','CRB','Criciúma','Cuiabá','Fortaleza','Goiás','Juventude',
  'Londrina','Náutico','Novorizontino','Operário-PR','Ponte Preta',
  'São Bernardo','Sport Recife','Vila Nova',
];

test('Séries A e B iniciam 2026 com 20 clubes distintos e B conforme CBF', () => {
  assert.equal(serieA.length, 20);
  assert.equal(serieB.length, 20);
  assert.equal(new Set(serieA.map(c => c.nome)).size, 20);
  assert.equal(new Set(serieB.map(c => c.nome)).size, 20);
  assert.deepEqual(serieB.map(c => c.nome).sort(), esperadosB.sort());
  assert.equal(new Set([...serieA, ...serieB].map(c => c.nome)).size, 40);
});

test('20 clubes produzem 38 rodadas e 380 jogos com 38 partidas por clube', () => {
  const classificacoes = simularClassificacoesMundoTecnico({ clubes: [...serieA, ...serieB], rng: rngSeed(2026) });
  for (const id of ['brasileirao', 'serieB']) {
    const { classificacao, jogos } = classificacoes[id];
    assert.equal(classificacao.length, 20);
    assert.equal(jogos.length, 380);
    assert.ok(classificacao.every(l => l.jogos === 38));
    assert.deepEqual([...new Set(jogos.map(j => j.rodada))].sort((a,b)=>a-b),
      Array.from({length:38},(_,i)=>i+1));
  }
});

test('playoff respeita pareamentos e vantagem do 3º e 4º no mando e desempate', () => {
  const classificacao = Array.from({ length: 20 }, (_, i) => ({ nome: `B${i+1}`, posicao: i+1 }));
  const p = resolverPlayoffSerieB({
    classificacao,
    simularJogo: (casa, fora) => {
      if (casa === 'B6' && fora === 'B3') return { golsCasa: 1, golsFora: 0 };
      if (casa === 'B3' && fora === 'B6') return { golsCasa: 1, golsFora: 0 };
      if (casa === 'B5' && fora === 'B4') return { golsCasa: 0, golsFora: 1 };
      if (casa === 'B4' && fora === 'B5') return { golsCasa: 0, golsFora: 0 };
      return { golsCasa: 0, golsFora: 0 };
    },
  });
  assert.deepEqual(p.acessoDireto, ['B1','B2']);
  assert.equal(p.confrontos.length, 2);
  assert.deepEqual(p.confrontos.map(c=>[c.superior,c.inferior]), [['B3','B6'],['B4','B5']]);
  assert.deepEqual(p.confrontos.map(c=>c.jogos.map(j=>j.casa)), [['B6','B3'],['B5','B4']]);
  assert.equal(p.confrontos[0].vencedor, 'B3');
  assert.equal(p.confrontos[0].criterio, 'melhor campanha');
  assert.deepEqual(p.promovidos, ['B1','B2','B3','B4']);
});

test('5º e 6º também podem conquistar as duas vagas do playoff', () => {
  const classificacao = Array.from({ length: 20 }, (_, i) => ({ nome: `B${i+1}` }));
  const p = resolverPlayoffSerieB({
    classificacao,
    simularJogo: (casa, fora) => casa === 'B6' || casa === 'B5'
      ? { golsCasa: 3, golsFora: 0 } : { golsCasa: 1, golsFora: 0 },
  });
  assert.deepEqual(p.promovidos, ['B1','B2','B6','B5']);
  assert.equal(p.jogos.length, 4);
  assert.ok(p.jogos.every(j => j.fase === 'Playoff de acesso'));
});

test('acessos efetivos preservam 20 clubes em cada série e não promovem perdedores', () => {
  const clubes = [...serieA, ...serieB];
  const classificacoesMundo = simularClassificacoesMundoTecnico({ clubes, rng: rngSeed(2042) });
  const serieBFinal = classificacoesMundo.serieB;
  assert.equal(serieBFinal.playoffAcesso.promovidos.length, 4);
  const progresso = atualizarLigasMundoTecnico({
    clubes, classificacoesMundo, divisoes: [{cima:'brasileirao',baixo:'serieB',vagas:4}],
  });
  const subiram = progresso.movimentos.filter(m => m.tipo === 'acesso').map(m => m.clube);
  const cairam = progresso.movimentos.filter(m => m.tipo === 'rebaixamento').map(m => m.clube);
  assert.deepEqual(subiram, serieBFinal.playoffAcesso.promovidos);
  assert.equal(cairam.length, 4);
  assert.equal(Object.values(progresso.ligasMundo).filter(liga => liga === 'brasileirao').length, 20);
  assert.equal(Object.values(progresso.ligasMundo).filter(liga => liga === 'serieB').length, 20);
  for (const linha of serieBFinal.classificacao.slice(2,6)) {
    if (!subiram.includes(linha.nome)) assert.equal(progresso.ligasMundo[linha.nome], 'serieB');
  }
});
