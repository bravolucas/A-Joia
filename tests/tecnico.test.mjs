import test from 'node:test';
import assert from 'node:assert/strict';
import { iniciarCarreiraTecnico, definirEstiloTecnico, simularTemporadaTecnico, proximaTemporadaTecnico } from '../tecnico.js';

const atleta = { nome: 'Teste', idade: 40, ano: 2045, clubeNome: 'Clube A', aposentado: true, legado: { pontos: 700 }, temporadas: [{ ano: 2044 }], totais: { gols: 300 } };
test('somente aposentados podem iniciar carreira técnica', () => {
  assert.throws(() => iniciarCarreiraTecnico({ ...atleta, aposentado: false }));
});
test('mantém histórico do atleta e evita reinicialização', () => {
  const c = iniciarCarreiraTecnico(atleta);
  assert.equal(c.temporadas, atleta.temporadas);
  assert.equal(c.totais, atleta.totais);
  assert.equal(iniciarCarreiraTecnico(c), c);
});
test('tática, temporada, resultado e avanço são persistentes', () => {
  const c = definirEstiloTecnico(iniciarCarreiraTecnico(atleta), 'defensivo');
  const r = simularTemporadaTecnico(c, () => 0.2);
  assert.equal(r.tecnico.temporadas.length, 1);
  assert.equal(r.tecnico.temporadas[0].vitorias, 38);
  assert.equal(r.tecnico.fase, 'resultado');
  assert.throws(() => simularTemporadaTecnico(r));
  const n = proximaTemporadaTecnico(r);
  assert.equal(n.tecnico.fase, 'pretemporada');
  assert.equal(n.tecnico.temporadas.length, 1);
  assert.equal(n.idade, 41);
});
