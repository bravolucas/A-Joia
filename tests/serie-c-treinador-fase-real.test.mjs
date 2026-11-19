import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import { simularSerieC } from '../src/simulacao/serieC.js';
import { simularClassificacoesMundoTecnico } from '../src/treinador/classificacoesMundoTecnico.js';

const clubesC = CLUBES.filter(c => c.liga === 'serieC');
const reservas = CLUBES.filter(c => c.liga === 'serieD');
const rng = seed => () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;

for (const [ano, adicionais] of [[2026, 0], [2027, 4], [2028, 8]]) {
  test(`Série C ${ano}: treinador conclui fase real e participa dos quadrangulares`, () => {
    const clubes = [
      ...clubesC,
      ...reservas.slice(0, adicionais).map(c => ({ ...c, liga: 'serieC' })),
    ];
    const sorteada = simularSerieC({ clubes, ano, rng: rng(ano + 90) });
    const faseJogada = sorteada.primeiraFase.grupos[0];
    const clube = faseJogada.classificacao[0].nome;
    const mundo = simularClassificacoesMundoTecnico({
      clubes, ano, ligaTreinador: 'serieC', clubeTreinador: clube,
      forcaTreinador: clubes.find(c => c.nome === clube).forca,
      classificacaoTreinador: faseJogada.classificacao,
      jogosTreinador: faseJogada.jogos, rng: rng(ano + 91),
    });
    assert.equal(mundo.serieC.origem, 'serie-c-treinador');
    const campeonato = mundo.serieC.edicaoSerieC;
    assert.ok(campeonato);
    assert.deepEqual(campeonato.primeiraFase.grupos[0].classificacao, faseJogada.classificacao);
    assert.deepEqual(campeonato.primeiraFase.grupos[0].jogos, faseJogada.jogos);
    assert.equal(campeonato.promovidos.length, 4);
    assert.equal(new Set(campeonato.promovidos).size, 4);
    assert.equal(campeonato.rebaixados.length, ano <= 2027 ? 2 : 6);
    assert.ok(campeonato.quadrangulares.every(g => g.classificacao.every(x => x.jogos === 6)));
    assert.equal(campeonato.final.jogos.length, 2);
    assert.ok(campeonato.promovidos.includes(campeonato.campeao));
  });
}

test('temporada incompleta do treinador não é sobrescrita por resultados independentes', () => {
  const classificacao = clubesC.map((c, i) => ({
    nome: c.nome, posicao: i + 1, jogos: 10, pontos: 15,
    vitorias: 4, empates: 3, derrotas: 3,
    golsPro: 12, golsContra: 12, saldoGols: 0,
  }));
  const mundo = simularClassificacoesMundoTecnico({
    clubes: clubesC, ano: 2026, clubeTreinador: clubesC[0].nome,
    ligaTreinador: 'serieC', classificacaoTreinador: classificacao,
    rng: () => { throw new Error('Não pode simular outra primeira fase'); },
  });
  assert.equal(mundo.serieC.origem, 'serie-c-pendente');
  assert.equal(mundo.serieC.edicaoSerieC, undefined);
  assert.deepEqual(mundo.serieC.classificacao, classificacao);
});

test('save incompleto não recebe rodada fictícia de ida e volta para Série C', () => {
  const mundo = simularClassificacoesMundoTecnico({
    clubes: clubesC, ano: 2028, rng: () => {
      throw new Error('Não deve sortear 38 partidas para Série C incompleta');
    },
  });
  assert.equal(mundo.serieC.origem, 'serie-c-pendente');
  assert.equal(mundo.serieC.participantesAtuais, 20);
  assert.equal(mundo.serieC.participantesEsperados, 28);
  assert.deepEqual(mundo.serieC.classificacao, []);
});
