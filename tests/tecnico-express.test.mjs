import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, iniciarNoClubeIdolo, jogarTemporadaExpressaTecnico, proximaTemporadaTecnico, carreiraTecnicoEncerrada, LIMITE_TEMPORADAS_TECNICO } from '../tecnico.js';
import { desenhoDaTaca } from '../tacas.js';

const atleta = { nome: 'Teste expresso', idade: 39, ano: 2040, clubeNome: 'Santos', aposentado: true, legado: { pontos: 600 }, temporadas: [{ ano: 2039, clube: 'Santos' }], totais: { gols: 150 } };
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
