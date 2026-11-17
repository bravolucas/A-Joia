import test from 'node:test';
import assert from 'node:assert/strict';
import { JOGADORES_REAIS_BASE, NACIONALIDADES, ANO_INICIO } from '../src/dados/data.js';
import { gerarMundoJogadores } from '../src/comum/lib.js';
import {
  metadadosAtletaReal, idadeAtletaReal, totalMetadadosAtletasReais,
} from '../src/dados/metadadosAtletasReais.js';
import { geradorTecnico } from '../src/treinador/momentosTecnico.js';

const atleta = (mundo, nome, clube) => mundo.jogadores.find(
  j => j.nome === nome && j.clubeNome === clube && !j.aposentado,
);

test('18 identidades verificadas correspondem a entradas reais e usam códigos de seleção válidos', () => {
  assert.equal(totalMetadadosAtletasReais, 18);
  const conhecidos = [
    ['Lionel Messi', 'Inter Miami'], ['Cristiano Ronaldo', 'Al-Nassr'],
    ['Neymar Jr', 'Santos'], ['Kylian Mbappé', 'Real Madrid'],
    ['Erling Haaland', 'Manchester City'], ['Mohamed Salah', 'Liverpool'],
    ['Harry Kane', 'Bayern de Munique'], ['Jude Bellingham', 'Real Madrid'],
    ['Lamine Yamal', 'Barcelona'], ['Luka Modrić', 'Milan'],
    ['Kevin De Bruyne', 'Napoli'], ['Thibaut Courtois', 'Real Madrid'],
    ['Federico Valverde', 'Real Madrid'], ['Raphinha', 'Barcelona'],
    ['Jamal Musiala', 'Bayern de Munique'], ['Bruno Fernandes', 'Manchester United'],
    ['Lewandowski', 'Barcelona'], ['Bukayo Saka', 'Arsenal'],
  ];
  for (const [nome, clube] of conhecidos) {
    const cadastro = JOGADORES_REAIS_BASE.filter(x => x.nome === nome && x.time === clube);
    assert.equal(cadastro.length, 1, `cadastro da identidade ${nome} / ${clube}`);
    const dados = metadadosAtletaReal(nome, clube);
    assert.ok(dados, `dados reais ausentes: ${nome}`);
    assert.ok(NACIONALIDADES.some(n => n.id === dados.nac), `nacionalidade inválida: ${nome}`);
    assert.ok(idadeAtletaReal(dados.nascimento, ANO_INICIO) >= 16);
  }
});

test('idade é calculada pela data exata, respeitando aniversários depois de julho', () => {
  assert.equal(idadeAtletaReal('1985-02-05', 2026), 41);
  assert.equal(idadeAtletaReal('2007-07-13', 2026), 18);
  assert.equal(idadeAtletaReal('2000-07-01', 2026), 26);
  assert.equal(idadeAtletaReal('2000-07-02', 2026), 25);
  assert.equal(idadeAtletaReal('2000-06-30', 2026), 26);
  assert.equal(idadeAtletaReal('2026-02-30', 2026), null);
  assert.equal(idadeAtletaReal('1988-99-01', 2026), null);
  assert.equal(idadeAtletaReal(undefined, 2026), null);
});

test('duas novas carreiras preservam idade e seleção de jogadores reais independentemente da seed', () => {
  const a = gerarMundoJogadores(geradorTecnico('metadados-reais-a'));
  const b = gerarMundoJogadores(geradorTecnico('metadados-reais-b'));
  for (const [nome, clube, idade, nac] of [
    ['Cristiano Ronaldo', 'Al-Nassr', 41, 'POR'],
    ['Lionel Messi', 'Inter Miami', 39, 'ARG'],
    ['Lamine Yamal', 'Barcelona', 18, 'ESP'],
    ['Kylian Mbappé', 'Real Madrid', 27, 'FRA'],
    ['Erling Haaland', 'Manchester City', 25, 'NOR'],
    ['Mohamed Salah', 'Liverpool', 34, 'EGI'],
    ['Jude Bellingham', 'Real Madrid', 23, 'ENG'],
    ['Luka Modrić', 'Milan', 40, 'CRO'],
  ]) {
    for (const mundo of [a,b]) {
      const encontrado = atleta(mundo, nome, clube);
      assert.ok(encontrado, `jogador não encontrado no elenco de origem: ${nome}`);
      assert.equal(encontrado.idade, idade, `idade incorreta: ${nome}`);
      assert.equal(encontrado.nac, nac, `seleção incorreta: ${nome}`);
    }
  }
});

test('homônimos e registros incompletos não herdam metadados de outro clube', () => {
  assert.equal(metadadosAtletaReal('Alisson', 'Fluminense'), null);
  assert.equal(metadadosAtletaReal('Lionel Messi', 'Real Madrid'), null);
  assert.equal(metadadosAtletaReal('Bruno Fernandes', 'Santos'), null);
  assert.equal(metadadosAtletaReal('Jogador Inexistente', 'Arsenal'), null);
});

test('geração permanece determinística para a mesma seed e não modifica o catálogo real', () => {
  const cadastrado = JOGADORES_REAIS_BASE.find(j => j.nome === 'Harry Kane' && j.time === 'Bayern de Munique');
  const original = structuredClone(cadastrado);
  const a = gerarMundoJogadores(geradorTecnico('mesma-seed'));
  const b = gerarMundoJogadores(geradorTecnico('mesma-seed'));
  assert.deepEqual(
    a.jogadores.map(j => [j.id, j.nome, j.nac, j.idade, j.clubeNome]),
    b.jogadores.map(j => [j.id, j.nome, j.nac, j.idade, j.clubeNome]),
  );
  assert.deepEqual(cadastrado, original);
});
