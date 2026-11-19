import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import { resolverPlayoffsSerieB, resolverOuReusarPlayoffsSerieB } from '../src/simulacao/playoffsSerieB.js';
import { atualizarLigasMundoTecnico, simularLigaMundo } from '../src/treinador/classificacoesMundoTecnico.js';

const tabelaB = Array.from({ length: 20 }, (_, i) => ({ nome: `Série B ${i + 1}`, posicao: i + 1 }));
const tabelaA = Array.from({ length: 20 }, (_, i) => ({ nome: `Série A ${i + 1}`, posicao: i + 1 }));
const forcas = Object.fromEntries(tabelaB.map(x => [x.nome, 55]));

test('Séries A e B brasileiras iniciam com 20 clubes cada e participantes corretos em 2026', () => {
  const a = CLUBES.filter(clube => clube.liga === 'brasileirao');
  const b = CLUBES.filter(clube => clube.liga === 'serieB');
  assert.equal(a.length, 20);
  assert.equal(b.length, 20);
  assert.equal(new Set(a.map(clube => clube.nome)).size, 20);
  assert.equal(new Set(b.map(clube => clube.nome)).size, 20);
  for (const nome of ['Athletic Club', 'Atlético-GO', 'Cuiabá', 'São Bernardo', 'Fortaleza']) {
    assert.ok(b.some(clube => clube.nome === nome), `Ausente na Série B: ${nome}`);
  }
  for (const nome of ['Guarani', 'Amazonas FC', 'Paysandu', 'Confiança']) {
    assert.equal(b.some(clube => clube.nome === nome), false, `Clube não disputou a Série B 2026: ${nome}`);
  }
});

test('pontos corridos produzem 38 rodadas e 380 partidas com 20 participantes', () => {
  const clubes = CLUBES.filter(clube => clube.liga === 'serieB');
  let seed = 501;
  const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const resultado = simularLigaMundo(clubes, rng);
  assert.equal(resultado.classificacao.length, 20);
  assert.equal(resultado.jogos.length, 380);
  assert.ok(resultado.classificacao.every(linha => linha.jogos === 38));
  assert.equal(new Set(resultado.jogos.map(jogo => jogo.rodada)).size, 38);
});

test('1º e 2º sobem direto e playoff cruza 3º x 6º e 4º x 5º, com volta em casa', () => {
  const resultado = resolverPlayoffsSerieB(tabelaB, forcas, () => 0.5);
  assert.deepEqual(resultado.acessoDireto, ['Série B 1', 'Série B 2']);
  assert.deepEqual(resultado.confrontos.map(c => c.confronto), ['3º x 6º', '4º x 5º']);
  assert.deepEqual(resultado.promovidos.slice(0, 2), resultado.acessoDireto);
  assert.equal(new Set(resultado.promovidos).size, 4);
  for (const chave of resultado.confrontos) {
    assert.equal(chave.jogos.length, 2);
    assert.equal(chave.jogos[0].casa, chave.adversario);
    assert.equal(chave.jogos[1].casa, chave.melhorCampanha);
    assert.equal(chave.mandanteVolta, chave.melhorCampanha);
  }
});

test('empate no agregado favorece melhor campanha, sem pênaltis', () => {
  const resultado = resolverPlayoffsSerieB(tabelaB, forcas, () => 0.00001);
  for (const chave of resultado.confrontos) {
    assert.equal(chave.agregado[chave.melhorCampanha], chave.agregado[chave.adversario]);
    assert.equal(chave.criterio, 'melhor-campanha');
    assert.equal(chave.classificado, chave.melhorCampanha);
    assert.equal(chave.jogos.some(jogo => jogo.penaltis), false);
  }
  assert.deepEqual(resultado.promovidos, ['Série B 1', 'Série B 2', 'Série B 3', 'Série B 4']);
});

test('6º colocado pode subir após vencer o playoff: 3º não sobe automaticamente', () => {
  const niveis = { ...forcas, 'Série B 3': 35, 'Série B 6': 95 };
  const resultado = resolverPlayoffsSerieB(tabelaB, niveis, () => 0.5);
  assert.equal(resultado.confrontos[0].classificado, 'Série B 6');
  assert.equal(resultado.promovidos.includes('Série B 3'), false);
  assert.equal(resultado.promovidos.includes('Série B 6'), true);
});

test('mudança de divisão do treinador usa os vencedores reais do playoff', () => {
  const clubes = [
    ...tabelaA.map(x => ({ nome: x.nome, liga: 'brasileirao', elenco: 70 })),
    ...tabelaB.map(x => ({ nome: x.nome, liga: 'serieB', elenco: x.nome === 'Série B 6' ? 95 : x.nome === 'Série B 3' ? 35 : 55 })),
  ];
  const classificacoesMundo = {
    brasileirao: { classificacao: tabelaA },
    serieB: { classificacao: tabelaB },
  };
  const resultado = atualizarLigasMundoTecnico({
    clubes, classificacoesMundo,
    divisoes: [{ baixo: 'serieB', cima: 'brasileirao', vagas: 4 }],
    rng: () => 0.5,
  });
  assert.deepEqual(resultado.playoffsSerieB.promovidos, classificacoesMundo.serieB.playoffs.promovidos);
  assert.equal(resultado.movimentos.length, 8);
  assert.equal(resultado.ligasMundo['Série B 6'], 'brasileirao');
  assert.equal(resultado.ligasMundo['Série B 3'], 'serieB');
  assert.deepEqual(resultado.playoffsSerieB.promovidos.slice(0, 2), ['Série B 1', 'Série B 2']);
  assert.equal(Object.values(resultado.ligasMundo).filter(liga => liga === 'brasileirao').length, 20);
});


test('retomar a temporada não sorteia novos playoffs e preserva o histórico', () => {
  const resultado = resolverPlayoffsSerieB(tabelaB, forcas, () => 0.5);
  const repetido = resolverOuReusarPlayoffsSerieB(tabelaB, forcas, () => {
    throw new Error('Não pode sortear novamente uma temporada encerrada');
  }, resultado);
  assert.equal(repetido, resultado);
  assert.deepEqual(repetido.promovidos, resultado.promovidos);
});

test('playoffs persistidos de tabela antiga não são aplicados a novos participantes', () => {
  const anterior = resolverPlayoffsSerieB(tabelaB, forcas, () => 0.5);
  const novaTabela = tabelaB.map((linha, i) => i === 2 ? { nome: 'Novo terceiro', posicao: 3 } : linha);
  const refeito = resolverOuReusarPlayoffsSerieB(novaTabela, forcas, () => 0.5, anterior);
  assert.notEqual(refeito, anterior);
  assert.equal(refeito.confrontos[0].melhorCampanha, 'Novo terceiro');
});


test('modo treinador preserva exatamente os mesmos promovidos ao reabrir o ano', () => {
  const clubes = [
    ...tabelaA.map(x => ({ nome: x.nome, liga: 'brasileirao', elenco: 70 })),
    ...tabelaB.map(x => ({ nome: x.nome, liga: 'serieB', elenco: 60 })),
  ];
  const classificacoesMundo = {
    brasileirao: { classificacao: tabelaA },
    serieB: { classificacao: tabelaB },
  };
  const divisoes = [{ baixo: 'serieB', cima: 'brasileirao', vagas: 4 }];
  const antes = atualizarLigasMundoTecnico({ clubes, classificacoesMundo, divisoes, rng: () => 0.5 });
  const depois = atualizarLigasMundoTecnico({ clubes, classificacoesMundo, divisoes, rng: () => {
    throw new Error('Playoff da mesma temporada não pode ser sorteado novamente');
  } });
  assert.equal(antes.playoffsSerieB, depois.playoffsSerieB);
  assert.deepEqual(antes.movimentos, depois.movimentos);
  assert.deepEqual(antes.ligasMundo, depois.ligasMundo);
});


test('art. 13: playoff considera pontos dos dois jogos antes do saldo e da campanha', () => {
  for (let seed = 1; seed <= 25; seed++) {
    let estado = seed;
    const rng = () => ((estado = estado * 16807 % 2147483647) - 1) / 2147483646;
    const resultado = resolverPlayoffsSerieB(tabelaB, forcas, rng);
    for (const chave of resultado.confrontos) {
      const [ida, volta] = chave.jogos;
      const pontos = (pro, contra) => pro > contra ? 3 : pro === contra ? 1 : 0;
      const melhor = chave.melhorCampanha, pior = chave.adversario;
      const pontosMelhor = pontos(ida.golsFora, ida.golsCasa) + pontos(volta.golsCasa, volta.golsFora);
      const pontosPior = pontos(ida.golsCasa, ida.golsFora) + pontos(volta.golsFora, volta.golsCasa);
      assert.equal(chave.pontosPlayoff[melhor], pontosMelhor);
      assert.equal(chave.pontosPlayoff[pior], pontosPior);
      const esperado = pontosMelhor !== pontosPior ? 'pontos-playoff'
        : chave.agregado[melhor] !== chave.agregado[pior] ? 'saldo-agregado'
        : 'melhor-campanha';
      assert.equal(chave.criterio, esperado);
      assert.equal(chave.classificado, pontosMelhor !== pontosPior
        ? (pontosMelhor > pontosPior ? melhor : pior)
        : chave.agregado[melhor] >= chave.agregado[pior] ? melhor : pior);
    }
  }
});
