import test from 'node:test';
import assert from 'node:assert/strict';
import { CLUBES } from '../src/dados/data.js';
import { calendarioLigaTecnico } from '../src/treinador/tecnico.js';
import { simularClassificacoesMundoTecnico, atualizarLigasMundoTecnico } from '../src/treinador/classificacoesMundoTecnico.js';

function rngSeed(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

for (const [liga, equipe] of [['brasileirao', 'Flamengo'], ['serieB', 'Fortaleza']]) {
  test(`${liga}: calendário do treinador usa 20 clubes, 38 rodadas, 380 jogos e turno/returno`, () => {
    const participantes = CLUBES.filter(c => c.liga === liga);
    const rodadas = calendarioLigaTecnico({ clube: equipe, liga });
    assert.equal(participantes.length, 20);
    assert.equal(rodadas?.length, 38);
    assert.ok(rodadas.every(r => r.length === 10));
    const jogos = rodadas.flat();
    assert.equal(jogos.length, 380);
    const confrontos = new Map();
    for (const jogo of jogos) {
      assert.notEqual(jogo.casa, jogo.fora);
      assert.ok(participantes.some(c => c.nome === jogo.casa));
      assert.ok(participantes.some(c => c.nome === jogo.fora));
      const chave = [jogo.casa, jogo.fora].sort().join(' / ');
      const partidas = confrontos.get(chave) || [];
      partidas.push(jogo);
      confrontos.set(chave, partidas);
    }
    assert.equal(confrontos.size, 190);
    for (const [chave, partidas] of confrontos) {
      assert.equal(partidas.length, 2, chave);
      assert.equal(partidas[0].casa, partidas[1].fora, chave);
      assert.equal(partidas[0].fora, partidas[1].casa, chave);
    }
  });
}

test('duas temporadas seguidas mantêm 20 por divisão e trocam exatamente quatro clubes', () => {
  let clubes = CLUBES.filter(c => ['brasileirao', 'serieB'].includes(c.liga));
  assert.equal(clubes.length, 40);
  for (let temporada = 1; temporada <= 2; temporada++) {
    const classificacoesMundo = simularClassificacoesMundoTecnico({
      clubes, rng: rngSeed(2400 + temporada),
    });
    const antesA = new Set(clubes.filter(c => c.liga === 'brasileirao').map(c => c.nome));
    const antesB = new Set(clubes.filter(c => c.liga === 'serieB').map(c => c.nome));
    const progressao = atualizarLigasMundoTecnico({
      clubes, classificacoesMundo,
      divisoes: [{ cima: 'brasileirao', baixo: 'serieB', vagas: 4 }],
      rng: rngSeed(3200 + temporada),
    });
    assert.equal(progressao.playoffsSerieB?.confrontos.length, 2);
    assert.equal(progressao.movimentos.filter(m => m.tipo === 'acesso').length, 4);
    assert.equal(progressao.movimentos.filter(m => m.tipo === 'rebaixamento').length, 4);
    const acessos = progressao.movimentos.filter(m => m.tipo === 'acesso').map(m => m.clube);
    assert.deepEqual(acessos.slice(0, 2), classificacoesMundo.serieB.classificacao.slice(0, 2).map(c => c.nome));
    assert.ok(acessos.every(nome => antesB.has(nome)));
    assert.ok(progressao.movimentos.filter(m => m.tipo === 'rebaixamento').every(m => antesA.has(m.clube)));
    clubes = clubes.map(c => ({ ...c, liga: progressao.ligasMundo[c.nome] }));
    assert.equal(clubes.filter(c => c.liga === 'brasileirao').length, 20);
    assert.equal(clubes.filter(c => c.liga === 'serieB').length, 20);
    assert.equal(new Set(clubes.map(c => c.nome)).size, 40);
  }
});


test('modo treinador por etapas preserva acesso decidido nos playoffs e a liga do ano seguinte', async () => {
  const {
    iniciarCarreiraTecnico, simularEtapaTecnico, QUANTIDADE_DECISOES_TECNICO,
  } = await import('../src/treinador/tecnico.js');
  const atleta = {
    nome: 'Auditoria Série B', idade: 40, ano: 2026, clubeNome: 'Fortaleza',
    aposentado: true, temporadas: [], totais: {}, legado: { pontos: 500 },
  };
  let carreira = iniciarCarreiraTecnico(atleta);
  carreira = { ...carreira, tecnico: {
    ...carreira.tecnico, clube: 'Fortaleza', liga: 'serieB', elenco: 64,
    diretoria: 95, torcida: 95,
    decisoes: Array(QUANTIDADE_DECISOES_TECNICO).fill({ carta: 'auditoria', opcao: 'neutra' }),
  } };
  for (let etapa = 0; etapa < 4; etapa++) {
    carreira = simularEtapaTecnico(carreira, rngSeed(700 + etapa));
  }
  const temporada = carreira.tecnico.temporadas.at(-1);
  assert.ok(temporada);
  assert.equal(temporada.classificacao.length, 20);
  assert.equal(temporada.classificacao.find(x => x.nome === 'Fortaleza')?.jogos, 38);
  assert.equal(temporada.playoffsSerieB?.confrontos.length, 2);
  const promovido = temporada.playoffsSerieB.promovidos.includes('Fortaleza');
  assert.equal(Boolean(temporada.acesso), promovido);
  assert.equal(carreira.tecnico.liga, promovido ? 'brasileirao' : 'serieB');
  assert.equal(carreira.tecnico.ligasMundo.Fortaleza, carreira.tecnico.liga);
});
