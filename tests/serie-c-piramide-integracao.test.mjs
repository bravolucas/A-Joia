import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import {
  simularClassificacoesMundoTecnico,
  atualizarLigasMundoTecnico,
} from '../src/treinador/classificacoesMundoTecnico.js';

const brasileiras = CLUBES.filter(c => ['brasileirao', 'serieB', 'serieC', 'serieD'].includes(c.liga));
const seed = inicial => {
  let numero = inicial;
  return () => ((numero = numero * 16807 % 2147483647) - 1) / 2147483646;
};
const contar = (mapa, liga) => brasileiras.filter(c => mapa[c.nome] === liga).length;

function executarNoveTemporadas() {
  let ligasMundo = {};
  const temporadas = [];
  for (let ano = 2026; ano <= 2034; ano++) {
    const classificacoesMundo = simularClassificacoesMundoTecnico({
      clubes: brasileiras, ligasMundo, ano, rng: seed(ano + 137),
    });
    const c = classificacoesMundo.serieC?.edicaoSerieC;
    const antes = Object.fromEntries(brasileiras.map(clube => [
      clube.nome, ligasMundo[clube.nome] || clube.liga,
    ]));
    assert.ok(c, `Série C não simulada em ${ano}`);
    assert.equal(c.ano, ano);
    assert.equal(c.regulamento.participantes, ano === 2026 ? 20 : ano === 2027 ? 24 : 28);
    assert.equal(c.quadrangulares.length, 2);
    assert.ok(c.quadrangulares.every(grupo => grupo.classificacao.every(t => t.jogos === 6)));
    assert.equal(c.promovidos.length, 4);
    assert.equal(new Set(c.promovidos).size, 4);
    assert.equal(c.rebaixados.length, ano <= 2027 ? 2 : 6);
    assert.equal(c.final.jogos.length, 2);
    assert.ok(c.promovidos.includes(c.campeao));
    assert.equal(classificacoesMundo.serieD, undefined,
      'não simular a Série D com banco incompleto de clubes');

    const progresso = atualizarLigasMundoTecnico({
      clubes: brasileiras, ligasMundo, classificacoesMundo, ano,
      divisoes: [{ cima: 'brasileirao', baixo: 'serieB', vagas: 4 }],
      rng: seed(ano + 913),
    });
    assert.equal(progresso.progressoBrasilInferior?.validado, true);
    for (const nome of c.promovidos) {
      assert.equal(antes[nome], 'serieC');
      assert.equal(progresso.ligasMundo[nome], 'serieB');
    }
    for (const nome of c.rebaixados) {
      assert.equal(antes[nome], 'serieC');
      assert.equal(progresso.ligasMundo[nome], 'serieD');
    }
    assert.equal(progresso.movimentos.filter(m => m.de === 'serieB' && m.para === 'serieC').length, 4);
    assert.equal(progresso.movimentos.filter(m => m.de === 'serieC' && m.para === 'serieB').length, 4);
    assert.equal(progresso.movimentos.filter(m => m.de === 'serieD' && m.para === 'serieC').length, 6);
    assert.equal(progresso.movimentos.filter(m => m.de === 'serieC' && m.para === 'serieD').length, ano <= 2027 ? 2 : 6);
    assert.equal(contar(progresso.ligasMundo, 'brasileirao'), 20);
    assert.equal(contar(progresso.ligasMundo, 'serieB'), 20);
    assert.equal(contar(progresso.ligasMundo, 'serieC'), ano === 2026 ? 24 : 28);

    temporadas.push({
      ano, clubesSerieC: contar(progresso.ligasMundo, 'serieC'),
      campeaoSerieC: c.campeao, subiramSerieC: c.promovidos,
      rebaixadosSerieC: c.rebaixados,
    });
    ligasMundo = progresso.ligasMundo;
  }
  return temporadas;
}

test('pirâmide A-B-C-D preserva vagas e ampliação por nove temporadas', () => {
  const a = executarNoveTemporadas();
  assert.deepEqual(a.map(t => t.clubesSerieC), [24, 28, 28, 28, 28, 28, 28, 28, 28]);
  assert.deepEqual(a, executarNoveTemporadas(), 'mesma semente deve gerar os mesmos acessos');
});
