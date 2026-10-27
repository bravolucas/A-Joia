import test from 'node:test';
import assert from 'node:assert/strict';
import { competicaoTemporadaTecnico, titulosConquistadosTecnico, LIMITE_TEMPORADAS_TECNICO, escolherOpcaoAutomaticaTecnico } from '../tecnico.js';
import { competicaoDoTitulo, svgDaTaca } from '../tacas.js';

// Auditoria isolada do modo treinador: nomes devem coincidir com os slugs
// documentados em arte/competicoes/LEIA-ME.md, evitando fallback silencioso.
const ligas = {
  brasileirao: 'Brasileirão', serieB: 'Brasileirão Série B',
  argentina: 'Liga Profesional', portugal: 'Liga Portugal',
  portugal2: 'Liga Portugal 2', espanha: 'La Liga',
  espanha2: 'LaLiga 2', inglaterra: 'Premier League',
  inglaterra2: 'Championship', italia: 'Serie A',
  italia2: 'Serie B (Itália)', alemanha: 'Bundesliga',
  alemanha2: '2. Bundesliga', franca: 'Ligue 1', franca2: 'Ligue 2'
};
test('treinador: identificacao de ligas e tacas por competicao', () => {
  for (const [liga, nome] of Object.entries(ligas)) {
    assert.equal(competicaoTemporadaTecnico({liga}), nome, liga);
    assert.ok(svgDaTaca('liga', nome).startsWith('<svg'), nome);
  }
});
test('treinador: vitrine usa o clube e o ano de cada conquista sem misturar vice', () => {
  const temporadas = [
    {ano:2041, clube:'Corinthians', liga:'brasileirao', campeao:true},
    {ano:2042, clube:'Corinthians', liga:'brasileirao', campeao:false},
    {ano:2043, clube:'Milan', liga:'italia', campeao:true}
  ];
  assert.deepEqual(titulosConquistadosTecnico({temporadas}), [
    {ano:2041,clube:'Corinthians',nome:'Brasileirão',tipo:'liga'},
    {ano:2043,clube:'Milan',nome:'Serie A',tipo:'liga'}
  ]);
  assert.equal(LIMITE_TEMPORADAS_TECNICO,30);
});
test('treinador: nomes de titulos mantem classificacao de liga', () => {
  for (const nome of Object.values(ligas)) {
    const tipo = competicaoDoTitulo(nome).tipo;
    assert.ok(['liga','segunda'].includes(tipo), nome + ': ' + tipo);
  }
});

test('treinador: escolhas ocultas nao privilegiam a primeira alternativa', () => {
  const opcoes = [{id:'a'}, {id:'b'}, {id:'c'}];
  assert.equal(escolherOpcaoAutomaticaTecnico(opcoes, () => 0), 'a');
  assert.equal(escolherOpcaoAutomaticaTecnico(opcoes, () => 0.5), 'b');
  assert.equal(escolherOpcaoAutomaticaTecnico(opcoes, () => 0.999), 'c');
  assert.equal(escolherOpcaoAutomaticaTecnico(opcoes, () => 1), 'c');
  assert.throws(() => escolherOpcaoAutomaticaTecnico([], () => 0), /sem alternativas/);
});

test('treinador: competicao historica permanece vinculada a liga registrada', () => {
  const titulo = { ano: 2048, clube: 'Clube Antigo', liga: 'italia', campeao: true };
  assert.equal(competicaoTemporadaTecnico(titulo), 'Serie A');
  assert.equal(titulosConquistadosTecnico({temporadas:[titulo]})[0].nome, 'Serie A');
  assert.equal(competicaoTemporadaTecnico({...titulo, competicao:'Copa Especial'}), 'Copa Especial');
});
