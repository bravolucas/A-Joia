import assert from 'node:assert/strict';
import test from 'node:test';
import { atualizarLigasMundoTecnico, simularClassificacoesMundoTecnico } from '../classificacoesMundoTecnico.js';

function rngSeed(seed) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const clubes = [
  ...Array.from({ length: 4 }, (_, i) => ({ nome: `Liga A ${i}`, liga: 'liga-a', elenco: 58 + i })),
  ...Array.from({ length: 3 }, (_, i) => ({ nome: `Liga B ${i}`, liga: 'liga-b', elenco: 62 + i })),
];

test('simula todas as partidas de ida e volta e mantém estatísticas consistentes', () => {
  const tabelas = simularClassificacoesMundoTecnico({ clubes, rng: rngSeed(18) });

  assert.deepEqual(Object.keys(tabelas).sort(), ['liga-a', 'liga-b']);
  for (const [liga, quantidade] of [['liga-a', 4], ['liga-b', 3]]) {
    const classificacao = tabelas[liga].classificacao;
    assert.equal(classificacao.length, quantidade);
    assert.deepEqual(classificacao.map(linha => linha.posicao), Array.from({ length: quantidade }, (_, i) => i + 1));
    assert.ok(classificacao.every(linha => linha.jogos === 2 * (quantidade - 1)));
    assert.ok(classificacao.every(linha => linha.vitorias + linha.empates + linha.derrotas === linha.jogos));
    assert.equal(classificacao.reduce((soma, linha) => soma + linha.pontos, 0),
      classificacao.reduce((soma, linha) => soma + linha.vitorias * 3 + linha.empates, 0));
    assert.equal(classificacao.reduce((soma, linha) => soma + linha.golsPro, 0),
      classificacao.reduce((soma, linha) => soma + linha.golsContra, 0));
  }
});

test('usa a tabela disputada pelo treinador e move o clube para a divisão atual', () => {
  const tabelaTreinador = [
    { nome: 'Meu Clube', jogos: 2, pontos: 6, vitorias: 2, empates: 0, derrotas: 0, golsPro: 4, golsContra: 1 },
    { nome: 'Rival Atual', jogos: 2, pontos: 0, vitorias: 0, empates: 0, derrotas: 2, golsPro: 1, golsContra: 4 },
  ];
  const tabelas = simularClassificacoesMundoTecnico({
    clubes: [
      { nome: 'Meu Clube', liga: 'liga-a', elenco: 90 },
      { nome: 'Rival Atual', liga: 'liga-b', elenco: 60 },
      { nome: 'Rival B', liga: 'liga-b', elenco: 61 },
    ],
    ligaTreinador: 'liga-b',
    clubeTreinador: 'Meu Clube',
    forcaTreinador: 55,
    classificacaoTreinador: tabelaTreinador,
    rng: rngSeed(21),
  });

  assert.equal(tabelas['liga-b'].origem, 'temporada-treinador');
  assert.deepEqual(tabelas['liga-b'].classificacao.map(linha => linha.nome), ['Meu Clube', 'Rival Atual']);
  assert.equal(tabelas['liga-a'], undefined);
});

test('simulações com a mesma semente produzem as mesmas tabelas', () => {
  const a = simularClassificacoesMundoTecnico({ clubes, rng: rngSeed(55) });
  const b = simularClassificacoesMundoTecnico({ clubes, rng: rngSeed(55) });
  assert.deepEqual(a, b);
});

test('acesso e rebaixamento movimentam clubes nas duas direções e preservam as demais divisões', () => {
  const clubes = [
    { nome: 'Topo 1', liga: 'principal' },
    { nome: 'Topo 2', liga: 'principal' },
    { nome: 'Base 1', liga: 'segunda' },
    { nome: 'Base 2', liga: 'segunda' },
    { nome: 'Fora', liga: 'outra' },
  ];
  const classificacoesMundo = {
    principal: { classificacao: [{ nome: 'Topo 1', posicao: 1 }, { nome: 'Topo 2', posicao: 2 }] },
    segunda: { classificacao: [{ nome: 'Base 1', posicao: 1 }, { nome: 'Base 2', posicao: 2 }] },
  };
  const progressao = atualizarLigasMundoTecnico({
    clubes,
    classificacoesMundo,
    ligasMundo: { 'Clube legado': 'outra' },
    divisoes: [{ cima: 'principal', baixo: 'segunda', vagas: 1 }],
  });

  assert.equal(progressao.ligasMundo['Topo 2'], 'segunda');
  assert.equal(progressao.ligasMundo['Base 1'], 'principal');
  assert.equal(progressao.ligasMundo['Topo 1'], 'principal');
  assert.equal(progressao.ligasMundo.Fora, 'outra');
  assert.equal(progressao.ligasMundo['Clube legado'], 'outra');
  assert.deepEqual(progressao.movimentos.map(x => x.tipo).sort(), ['acesso', 'rebaixamento']);
});
