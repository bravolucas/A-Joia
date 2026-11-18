import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import { calendarioLigaTecnico } from '../src/treinador/tecnico.js';
import { reconciliarClubeLegadoTecnico, LIGA_FORA_PIRAMIDE } from '../src/treinador/compatibilidadeDivisoes.js';
import { simularClassificacoesMundoTecnico, atualizarLigasMundoTecnico } from '../src/treinador/classificacoesMundoTecnico.js';

const clubes = CLUBES.filter(c => ['brasileirao','serieB'].includes(c.liga))
  .map(c => ({ ...c, elenco: c.forca }));
function rngSeed(seed) {
  return () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
}
function nomesCalendario(t) {
  const rodadas = calendarioLigaTecnico(t);
  assert.equal(rodadas.length, 38);
  return [...new Set(rodadas.flatMap(rodada =>
    rodada.flatMap(jogo => [jogo.casa, jogo.fora])))];
}
for (const antigo of ['Guarani', 'Amazonas FC', 'Paysandu', 'Confiança']) {
  test(`save anterior: ${antigo} segue na carreira, sem criar 21 clubes`, () => {
    let t = { clube: antigo, liga: 'serieB', elenco: 55,
      ligasMundo: { [antigo]: 'serieB' } };
    let afastado;
    for (let ano = 0; ano < 3; ano++) {
      const participantes = nomesCalendario(t);
      assert.equal(participantes.length, 20);
      assert.ok(participantes.includes(antigo));
      const antes = structuredClone(t.ligasMundo);
      const ajustado = reconciliarClubeLegadoTecnico({
        clubes, ligasMundo: t.ligasMundo, clubeTreinador: antigo,
        ligaTreinador: t.liga, elencoTreinador: 55,
        nomesCalendario: participantes,
      });
      assert.deepEqual(t.ligasMundo, antes, 'não modificar o save original');
      assert.equal(ajustado.clubes.length, 40);
      assert.equal(ajustado.clubes.filter(c => c.nome === antigo).length, 1);
      if (ano === 0) {
        afastado = ajustado.afastado;
        assert.ok(afastado);
        assert.equal(ajustado.ligasMundo[afastado], LIGA_FORA_PIRAMIDE);
      }
      const classificacoesMundo = simularClassificacoesMundoTecnico({
        clubes: ajustado.clubes, ligasMundo: ajustado.ligasMundo,
        ligaTreinador: t.liga, clubeTreinador: antigo,
        forcaTreinador: 55, rng: rngSeed(2026 + ano),
      });
      assert.equal(classificacoesMundo.brasileirao.classificacao.length, 20);
      assert.equal(classificacoesMundo.serieB.classificacao.length, 20);
      const progresso = atualizarLigasMundoTecnico({
        clubes: ajustado.clubes, ligasMundo: ajustado.ligasMundo,
        classificacoesMundo, clubeTreinador: antigo,
        ligaTreinador: t.liga,
        divisoes: [{ cima: 'brasileirao', baixo: 'serieB', vagas: 4 }],
        rng: rngSeed(1026 + ano),
      });
      assert.equal(Object.values(progresso.ligasMundo).filter(l => l === 'brasileirao').length, 20);
      assert.equal(Object.values(progresso.ligasMundo).filter(l => l === 'serieB').length, 20);
      assert.equal(progresso.ligasMundo[afastado], LIGA_FORA_PIRAMIDE);
      assert.ok(progresso.ligasMundo[antigo] === 'serieB' || progresso.ligasMundo[antigo] === 'brasileirao');
      t = { ...t, liga: progresso.ligasMundo[antigo], ligasMundo: progresso.ligasMundo };
    }
    assert.equal(nomesCalendario(t).length, 20);
  });
}
