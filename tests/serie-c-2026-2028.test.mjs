import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import { regulamentoSerieC, simularSerieC } from '../src/simulacao/serieC.js';
import { simularClassificacoesMundoTecnico, atualizarLigasMundoTecnico } from '../src/treinador/classificacoesMundoTecnico.js';

const participantes = CLUBES.filter(c => c.liga === 'serieC');
const seed = inicio => {
  let estado = inicio;
  return () => ((estado = (estado * 16807) % 2147483647) - 1) / 2147483646;
};

test('edição 2026 tem os vinte clubes reais, 19 rodadas e 190 partidas', () => {
  const nomes = ['Anápolis', 'Amazonas FC', 'Barra-SC', 'Botafogo-PB', 'Brusque', 'Caxias',
    'Confiança', 'Ferroviária', 'Figueirense', 'Floresta', 'Guarani', 'Inter de Limeira',
    'Itabaiana', 'Ituano', 'Maranhão', 'Maringá', 'Paysandu', 'Santa Cruz',
    'Volta Redonda', 'Ypiranga-RS'];
  assert.deepEqual(participantes.map(c => c.nome).sort(), nomes.sort());
  const t = simularSerieC({ clubes: participantes, ano: 2026, rng: seed(71) });
  assert.equal(t.primeiraFase.grupos[0].rodadas, 19);
  assert.equal(t.primeiraFase.grupos[0].jogos.length, 190);
  assert.ok(t.classificacao.every(c => c.jogos === 19));
  assert.equal(t.quadrangulares.length, 2);
  assert.deepEqual(t.quadrangulares[0].classificacao.map(c => c.nome).sort(),
    [0, 3, 4, 7].map(i => t.classificacao[i].nome).sort());
  assert.deepEqual(t.quadrangulares[1].classificacao.map(c => c.nome).sort(),
    [1, 2, 5, 6].map(i => t.classificacao[i].nome).sort());
  assert.ok(t.quadrangulares.every(g => g.jogos.length === 12 &&
    g.classificacao.every(c => c.jogos === 6)));
  assert.equal(new Set(t.promovidos).size, 4);
  assert.equal(new Set(t.rebaixados).size, 2);
  assert.equal(t.final.jogos.length, 2);
  assert.ok(t.quadrangulares.some(g => g.classificacao[0].nome === t.campeao));
});

test('2027 tem 24 participantes, 23 rodadas e dois rebaixados', () => {
  const clubes = [...participantes, ...CLUBES.filter(c => c.liga === 'serieD').slice(0, 4)];
  const t = simularSerieC({ clubes, ano: 2027, rng: seed(73) });
  assert.deepEqual(regulamentoSerieC(2027), {
    ano: 2027, participantes: 24, formato: 'grupo-unico', rodadas: 23, descenso: 2, acesso: 4,
  });
  assert.equal(t.primeiraFase.grupos[0].jogos.length, 276);
  assert.equal(t.promovidos.length, 4);
  assert.equal(t.rebaixados.length, 2);
});

test('2028 tem dois grupos de 14, 26 rodadas, quatro acessos e seis rebaixamentos', () => {
  const clubes = [...participantes, ...CLUBES.filter(c => c.liga === 'serieD').slice(0, 8)];
  const t = simularSerieC({ clubes, ano: 2028, rng: seed(97) });
  assert.equal(t.primeiraFase.grupos.length, 2);
  assert.ok(t.primeiraFase.grupos.every(g => g.classificacao.length === 14 &&
    g.rodadas === 26 && g.jogos.length === 182 && g.classificacao.every(c => c.jogos === 26)));
  assert.equal(t.promovidos.length, 4);
  assert.equal(t.rebaixados.length, 6);
});

test('mesma semente reproduz calendário, acessos, final e rebaixamentos', () => {
  const a = simularSerieC({ clubes: participantes, ano: 2026, rng: seed(119) });
  const b = simularSerieC({ clubes: participantes, ano: 2026, rng: seed(119) });
  assert.deepEqual(a, b);
  assert.throws(() => simularSerieC({ clubes: participantes.slice(1), ano: 2026 }), /20 clubes distintos/);
});

test('universo 2026-2029 preserva 20 na A e B, expande C 20 → 24 → 28 e inclui 4 acessos da C à B', () => {
  const clubes = CLUBES.filter(c => ['brasileirao', 'serieB', 'serieC', 'serieD'].includes(c.liga))
    .map(c => ({ ...c, elenco: c.forca }));
  const contagem = (mapa, liga) => clubes.filter(c => (mapa[c.nome] || c.liga) === liga).length;
  assert.deepEqual(['brasileirao', 'serieB', 'serieC', 'serieD'].map(l => contagem({}, l)), [20, 20, 20, 20]);
  let mapa = {};
  for (const [ano, esperadoC] of [[2026, 24], [2027, 28], [2028, 28], [2029, 28]]) {
    const tabelas = simularClassificacoesMundoTecnico({
      clubes, ligasMundo: mapa, ano, rng: seed(ano + 400),
    });
    assert.equal(tabelas.serieC.origem, 'serie-c-cbf');
    assert.equal(tabelas.serieC.edicaoSerieC.ano, ano);
    const progresso = atualizarLigasMundoTecnico({
      clubes, ligasMundo: mapa, classificacoesMundo: tabelas,
      divisoes: [{ cima: 'brasileirao', baixo: 'serieB', vagas: 4 }],
      ano, rng: seed(ano + 900),
    });
    assert.equal(progresso.movimentos.filter(m =>
      m.tipo === 'acesso' && m.de === 'serieC' && m.para === 'serieB').length, 4);
    assert.equal(progresso.movimentos.filter(m =>
      m.tipo === 'rebaixamento' && m.de === 'serieB' && m.para === 'serieC').length, 4);
    mapa = progresso.ligasMundo;
    assert.equal(contagem(mapa, 'brasileirao'), 20);
    assert.equal(contagem(mapa, 'serieB'), 20);
    assert.equal(contagem(mapa, 'serieC'), esperadoC);
    assert.equal(contagem(mapa, 'serieD'), 80 - 40 - esperadoC);
  }
});
