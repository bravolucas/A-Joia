import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import { calendarioLigaTecnico } from '../src/treinador/tecnico.js';
import { calendarioSerieCClubes } from '../src/simulacao/serieC.js';

const baseC = CLUBES.filter(clube => clube.liga === 'serieC');
const reservasD = CLUBES.filter(clube => clube.liga === 'serieD');

for (const cenario of [
  { ano: 2026, participantes: baseC, rodadas: 19, mandos: [9, 10], jogos: 190 },
  { ano: 2027, participantes: [...baseC, ...reservasD.slice(0, 4)], rodadas: 23, mandos: [11, 12], jogos: 276 },
  { ano: 2028, participantes: [...baseC, ...reservasD.slice(0, 8)], rodadas: 26, mandos: [13], jogos: 182 },
]) {
  test(`treinador Série C ${cenario.ano}: calendário tem mandos equilibrados`, () => {
    const nomes = cenario.participantes.map(clube => clube.nome);
    const calendario = calendarioLigaTecnico({
      clube: 'Guarani', liga: 'serieC', ano: cenario.ano,
      participantesLiga: { liga: 'serieC', nomes },
    });
    assert.equal(calendario.length, cenario.rodadas);
    assert.equal(calendario.flat().length, cenario.jogos);
    const mandos = new Map();
    for (const partida of calendario.flat()) {
      if (!mandos.has(partida.casa)) mandos.set(partida.casa, { casa: 0, fora: 0 });
      if (!mandos.has(partida.fora)) mandos.set(partida.fora, { casa: 0, fora: 0 });
      mandos.get(partida.casa).casa++;
      mandos.get(partida.fora).fora++;
    }
    for (const [nome, dados] of mandos) {
      assert.ok(cenario.mandos.includes(dados.casa),
        `${nome} em ${cenario.ano}: ${dados.casa} partidas como mandante`);
      assert.ok(cenario.mandos.includes(dados.fora),
        `${nome} em ${cenario.ano}: ${dados.fora} partidas como visitante`);
      assert.equal(dados.casa + dados.fora, cenario.rodadas);
    }
    const clubeUsuario = mandos.get('Guarani');
    assert.ok(clubeUsuario);
    assert.ok(cenario.mandos.includes(clubeUsuario.casa));
    if (cenario.ano === 2026) {
      const original = calendarioSerieCClubes(nomes, false)
        .map(rodada => rodada.map(({ casa, fora }) => ({ casa, fora })));
      // Clubes congelados na carreira devem usar a mesma tabela de mandos
      // do motor da competição, não uma rotação paralela.
      assert.deepEqual(calendario, original);
    }
  });
}
