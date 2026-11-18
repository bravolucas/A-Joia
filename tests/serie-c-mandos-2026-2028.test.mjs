import test from 'node:test';
import assert from 'node:assert/strict';
import { simularSerieC } from '../src/simulacao/serieC.js';

function rngSeed(numero) {
  return () => ((numero = numero * 16807 % 2147483647) - 1) / 2147483646;
}

for (const [ano, quantidade, mandosCasa, mandosFora, totalJogos] of [
  [2026, 20, [9, 10], [9, 10], 190],
  [2027, 24, [11, 12], [11, 12], 276],
  [2028, 28, [13], [13], 364],
]) {
  test(`Série C ${ano}: mandos de campo equilibrados na primeira fase`, () => {
    const clubes = Array.from({ length: quantidade }, (_, i) => ({
      nome: `Equipe-${i+1}`, forca: 50 + i,
    }));
    const resultado = simularSerieC({ clubes, ano, rng: rngSeed(ano) });
    const jogos = resultado.primeiraFase.grupos.flatMap(g => g.jogos);
    assert.equal(jogos.length, totalJogos);
    const mandos = Object.fromEntries(clubes.map(c => [c.nome, { casa: 0, fora: 0 }]));
    for (const jogo of jogos) {
      mandos[jogo.casa].casa++;
      mandos[jogo.fora].fora++;
    }
    for (const clube of clubes) {
      const { casa, fora } = mandos[clube.nome];
      assert.ok(mandosCasa.includes(casa), `${clube.nome}: ${casa} jogos em casa`);
      assert.ok(mandosFora.includes(fora), `${clube.nome}: ${fora} jogos fora`);
      assert.equal(casa + fora, resultado.regulamento.rodadas);
    }
    const pares = new Map();
    for (const jogo of jogos) {
      const chave = [jogo.casa, jogo.fora].sort().join('|');
      pares.set(chave, [...(pares.get(chave) || []), jogo]);
    }
    assert.equal(pares.size, quantidade * (quantidade - 1) / 2 / (ano >= 2028 ? 2 : 1));
    for (const jogosDoPar of pares.values()) {
      assert.equal(jogosDoPar.length, ano >= 2028 ? 2 : 1);
      if (ano >= 2028) {
        assert.equal(jogosDoPar[0].casa, jogosDoPar[1].fora);
        assert.equal(jogosDoPar[0].fora, jogosDoPar[1].casa);
      }
    }
  });
}
