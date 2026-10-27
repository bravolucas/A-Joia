import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, jogarTemporadaExpressaTecnico, proximaTemporadaTecnico, carreiraTecnicoEncerrada, LIMITE_TEMPORADAS_TECNICO } from '../tecnico.js';
import { desenhoDaTaca } from '../tacas.js';

const atleta = { nome: 'Teste expresso', idade: 39, ano: 2040, clubeNome: 'Santos', aposentado: true, legado: { pontos: 600 }, temporadas: [{ ano: 2037, clube: 'Santos' }, { ano: 2038, clube: 'Santos' }, { ano: 2039, clube: 'Santos' }], totais: { gols: 150 } };
const sorteio = () => 0.5;

test('simulação expressa preserva a carreira do jogador e não exige decisões', () => {
  let c = iniciarCarreiraTecnico(atleta);
  assert.ok(c.tecnico.opcoesInicio.length > 0);
  c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
  const original = c.temporadas;
  const ano = c.tecnico.ano;
  c = jogarTemporadaExpressaTecnico(c, null, sorteio);
  assert.equal(c.temporadas, original);
  assert.equal(c.tecnico.fase, 'resultado');
  assert.equal(c.tecnico.temporadas.length, 1);
  assert.equal(c.tecnico.temporadas[0].ano, ano);
  assert.equal(c.tecnico.ano, ano + 1);
  assert.equal(c.tecnico.temporadas[0].decisoes.length, 4);
  assert.ok(c.tecnico.temporadas[0].decisoes.every(d => d.opcao === 'neutra'));
  assert.equal(c.tecnico.temporadas[0].classificacao.find(x => x.meuClube).posicao, c.tecnico.temporadas[0].posicao);
});

test('limite de 30 temporadas impede simulação adicional', () => {
  const c = iniciarCarreiraTecnico(atleta);
  const cheio = { ...c, tecnico: { ...c.tecnico, temporadas: Array.from({ length: LIMITE_TEMPORADAS_TECNICO }, (_, i) => ({ ano: 2040 + i })) } };
  assert.equal(carreiraTecnicoEncerrada(cheio.tecnico), true);
  assert.throws(() => jogarTemporadaExpressaTecnico(cheio, null, sorteio), /encerrada/);
  assert.throws(() => proximaTemporadaTecnico({ ...cheio, tecnico: { ...cheio.tecnico, fase: 'resultado' } }), /30 temporadas/);
});

test('nomes de taças do treinador usam desenhos específicos', () => {
  assert.deepEqual(desenhoDaTaca('continental', 'Copa Libertadores'), desenhoDaTaca('continental', 'Libertadores'));
  assert.deepEqual(desenhoDaTaca('continental', 'UEFA Champions League'), desenhoDaTaca('continental', 'Champions League'));
  assert.deepEqual(desenhoDaTaca('liga', 'Campeonato Brasileiro Série A'), desenhoDaTaca('liga', 'Brasileirão'));
  assert.deepEqual(desenhoDaTaca('segunda', 'Campeonato Brasileiro Série B'), desenhoDaTaca('segunda', 'Brasileirão Série B'));
});

test('30 temporadas expressas acumulam histórico e encerram a carreira', () => {
  let c = iniciarCarreiraTecnico(atleta);
  c = iniciarNoClubeIdolo(c, c.tecnico.opcoesInicio[0].clube);
  const anoInicial = c.tecnico.ano;
  for (let i = 0; i < LIMITE_TEMPORADAS_TECNICO; i++) {
    c = jogarTemporadaExpressaTecnico(c, null, () => 0.48);
    assert.equal(c.tecnico.temporadas.length, i + 1);
    assert.equal(c.tecnico.temporadas[i].ano, anoInicial + i);
    assert.equal(c.tecnico.temporadas[i].vitorias + c.tecnico.temporadas[i].empates + c.tecnico.temporadas[i].derrotas, 38);
    assert.equal(c.tecnico.temporadas[i].classificacao.find(x => x.meuClube).posicao, c.tecnico.temporadas[i].posicao);
    if (i < LIMITE_TEMPORADAS_TECNICO - 1) {
      // A demissão é desativada neste teste para isolar o limite de temporadas.
      c = proximaTemporadaTecnico({ ...c, tecnico: { ...c.tecnico, demitido: false, desempregado: false } });
    }
  }
  assert.equal(c.tecnico.ano, anoInicial + LIMITE_TEMPORADAS_TECNICO);
  assert.equal(c.tecnico.temporadas.length, 30);
  assert.equal(carreiraTecnicoEncerrada(c.tecnico), true);
  assert.throws(() => jogarTemporadaExpressaTecnico({ ...c, tecnico: { ...c.tecnico, fase: 'pretemporada' } }, null, sorteio), /encerrada/);
});

test('a vitrine de treinador reúne títulos reais do histórico sem alterar o legado de jogador', async () => {
  const { titulosConquistadosTecnico } = await import('../tecnico.js');
  const c = iniciarCarreiraTecnico(atleta);
  const tecnico = { ...c.tecnico, temporadas: [
    { ano: 2040, clube: 'Santos', liga: 'brasileirao', campeao: true, titulosConquistados: ['Brasileirão', 'Copa do Brasil'] },
    { ano: 2041, clube: 'Santos', liga: 'brasileirao', campeao: false, titulosConquistados: [] },
    { ano: 2042, clube: 'Santos', liga: 'brasileirao', campeao: true }
  ] };
  const titulos = titulosConquistadosTecnico(tecnico);
  assert.deepEqual(titulos.map(t => t.nome), ['Brasileirão', 'Copa do Brasil', 'Brasileirão']);
  assert.deepEqual(titulos.map(t => t.ano), [2040, 2040, 2042]);
  assert.equal(c.temporadas.length, atleta.temporadas.length);
});
