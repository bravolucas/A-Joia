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

test('61 identidades verificadas correspondem a entradas reais e usam códigos de seleção válidos', () => {
  assert.equal(totalMetadadosAtletasReais, 61);
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
    ['Antoine Griezmann', 'Atlético de Madrid'], ['Phil Foden', 'Manchester City'],
    ['Kenan Yildiz', 'Juventus'], ['Dušan Vlahović', 'Juventus'],
    ['Virgil van Dijk', 'Liverpool'], ['Trent Alexander-Arnold', 'Real Madrid'],
    ['Alisson', 'Liverpool'], ['Manuel Neuer', 'Bayern de Munique'],
    ['Rúben Dias', 'Manchester City'], ['Pedri', 'Barcelona'], ['Gavi', 'Barcelona'],
    ['Gabriel Martinelli', 'Arsenal'], ['Gabriel Magalhães', 'Arsenal'],
    ['Enzo Fernández', 'Chelsea'], ['Cole Palmer', 'Chelsea'], ['Florian Wirtz', 'Liverpool'],
    ['Ousmane Dembélé', 'PSG'], ['Rodrygo', 'Real Madrid'],
    ['Gianluigi Donnarumma', 'Manchester City'], ['Rúben Neves', 'Al-Hilal'],
    ['Bernardo Silva', 'Manchester City'],
    ['Aurélien Tchouaméni', 'Real Madrid'], ['Arda Güler', 'Real Madrid'],
    ['Éder Militão', 'Real Madrid'], ['Dean Huijsen', 'Real Madrid'],
    ['Brahim Díaz', 'Real Madrid'], ['Frenkie de Jong', 'Barcelona'],
    ['Jules Koundé', 'Barcelona'], ['Alejandro Balde', 'Barcelona'],
    ['Dani Olmo', 'Barcelona'], ['Ferran Torres', 'Barcelona'],
    ['Omar Marmoush', 'Manchester City'], ['Alexander Isak', 'Liverpool'],
    ['Dominik Szoboszlai', 'Liverpool'], ['Alexis Mac Allister', 'Liverpool'],
    ['Cody Gakpo', 'Liverpool'], ['Nuno Mendes', 'PSG'],
    ['Vitinha', 'PSG'], ['João Neves', 'PSG'],
    ['Joshua Kimmich', 'Bayern de Munique'],
    ['Michael Olise', 'Bayern de Munique'],
    ['Luis Díaz', 'Bayern de Munique'], ['Alphonso Davies', 'Bayern de Munique'],
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
  assert.equal(idadeAtletaReal('2000-02-29', 2026), 26, 'dia bissexto válido');
  assert.equal(idadeAtletaReal('2001-02-29', 2026), null, 'dia bissexto inválido');
  assert.equal(idadeAtletaReal('2026-02-30', 2026), null);
  assert.equal(idadeAtletaReal('1988-99-01', 2026), null);
  assert.equal(idadeAtletaReal(undefined, 2026), null);
});

test('61 jogadores reais preservam idade e seleção em duas seeds independentes', () => {
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
    ['Kenan Yildiz', 'Juventus', 21, 'TUR'],
    ['Dušan Vlahović', 'Juventus', 26, 'SER'],
    ['Virgil van Dijk', 'Liverpool', 34, 'HOL'],
    ['Trent Alexander-Arnold', 'Real Madrid', 27, 'ENG'],
    ['Alisson', 'Liverpool', 33, 'BRA'],
    ['Manuel Neuer', 'Bayern de Munique', 40, 'ALE'],
    ['Pedri', 'Barcelona', 23, 'ESP'],
    ['Gavi', 'Barcelona', 21, 'ESP'],
    ['Ousmane Dembélé', 'PSG', 29, 'FRA'],
    ['Gianluigi Donnarumma', 'Manchester City', 27, 'ITA'],
    ['Antoine Griezmann', 'Atlético de Madrid', 35, 'FRA'],
    ['Phil Foden', 'Manchester City', 26, 'ENG'],
    ['Rúben Dias', 'Manchester City', 29, 'POR'],
    ['Gabriel Martinelli', 'Arsenal', 25, 'BRA'],
    ['Gabriel Magalhães', 'Arsenal', 28, 'BRA'],
    ['Enzo Fernández', 'Chelsea', 25, 'ARG'],
    ['Cole Palmer', 'Chelsea', 24, 'ENG'],
    ['Florian Wirtz', 'Liverpool', 23, 'ALE'],
    ['Rodrygo', 'Real Madrid', 25, 'BRA'],
    ['Rúben Neves', 'Al-Hilal', 29, 'POR'],
    ['Bernardo Silva', 'Manchester City', 31, 'POR'],
    ['Arda Güler', 'Real Madrid', 21, 'TUR'],
    ['Dean Huijsen', 'Real Madrid', 21, 'ESP'],
    ['Brahim Díaz', 'Real Madrid', 26, 'MAR'],
    ['Ferran Torres', 'Barcelona', 26, 'ESP'],
    ['Omar Marmoush', 'Manchester City', 27, 'EGI'],
    ['Alexander Isak', 'Liverpool', 26, 'SUE'],
    ['João Neves', 'PSG', 21, 'POR'],
    ['Michael Olise', 'Bayern de Munique', 24, 'FRA'],
    ['Alphonso Davies', 'Bayern de Munique', 25, 'CAN'],
    ['Neymar Jr', 'Santos', 34, 'BRA'],
    ['Harry Kane', 'Bayern de Munique', 32, 'ENG'],
    ['Kevin De Bruyne', 'Napoli', 35, 'BEL'],
    ['Thibaut Courtois', 'Real Madrid', 34, 'BEL'],
    ['Federico Valverde', 'Real Madrid', 27, 'URU'],
    ['Raphinha', 'Barcelona', 29, 'BRA'],
    ['Jamal Musiala', 'Bayern de Munique', 23, 'ALE'],
    ['Bruno Fernandes', 'Manchester United', 31, 'POR'],
    ['Lewandowski', 'Barcelona', 37, 'POL'],
    ['Bukayo Saka', 'Arsenal', 24, 'ENG'],
    ['Aurélien Tchouaméni', 'Real Madrid', 26, 'FRA'],
    ['Éder Militão', 'Real Madrid', 28, 'BRA'],
    ['Frenkie de Jong', 'Barcelona', 29, 'HOL'],
    ['Jules Koundé', 'Barcelona', 27, 'FRA'],
    ['Alejandro Balde', 'Barcelona', 22, 'ESP'],
    ['Dani Olmo', 'Barcelona', 28, 'ESP'],
    ['Dominik Szoboszlai', 'Liverpool', 25, 'HUN'],
    ['Alexis Mac Allister', 'Liverpool', 27, 'ARG'],
    ['Cody Gakpo', 'Liverpool', 27, 'HOL'],
    ['Nuno Mendes', 'PSG', 24, 'POR'],
    ['Vitinha', 'PSG', 26, 'POR'],
    ['Joshua Kimmich', 'Bayern de Munique', 31, 'ALE'],
    ['Luis Díaz', 'Bayern de Munique', 29, 'COL'],
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
  assert.equal(metadadosAtletaReal('Alisson', 'Liverpool')?.nac, 'BRA');
  assert.equal(metadadosAtletaReal('Marquinhos', 'Cruzeiro'), null);
  assert.equal(metadadosAtletaReal('Brahim Díaz', 'Real Madrid')?.nac, 'MAR');
  assert.equal(metadadosAtletaReal('Dean Huijsen', 'Real Madrid')?.nac, 'ESP');
  assert.equal(idadeAtletaReal(metadadosAtletaReal('Virgil van Dijk', 'Liverpool')?.nascimento, 2026), 34);
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
