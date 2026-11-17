import test from 'node:test';
import assert from 'node:assert/strict';
import { LIMITE_TEMPORADAS_TECNICO, IDADE_MAXIMA_TECNICO, anosCarreiraTecnico, carreiraTecnicoEncerrada } from '../src/treinador/longevidadeTecnico.js';

test('30 anos de treinador contam calendário, inclusive desemprego, sem mexer no save', () => {
  const t = { anoInicio: 2040, ano: 2069, idadeInicio: 40, idade: 69,
    temporadas: Array.from({length: 25}, (_, i) => ({ ano: 2040 + i, clube: 'Santos' })),
    anoSabatico: [{ano:2066,escolha:'esperar'}] };
  const save = structuredClone(t);
  assert.equal(LIMITE_TEMPORADAS_TECNICO, 30);
  assert.equal(anosCarreiraTecnico(t), 29);
  assert.equal(carreiraTecnicoEncerrada(t), false);
  assert.equal(anosCarreiraTecnico({...t, ano: 2070, idade: 70}), 30);
  assert.equal(carreiraTecnicoEncerrada({...t, ano: 2070, idade: 70}), true);
  assert.deepEqual(t, save, 'contagem não pode modificar o histórico');
});

test('saves antigos sem ano de início continuam contando temporadas registradas', () => {
  const t = { idade: 70, temporadas: Array.from({length: 30}, (_, i) => ({ano:2030+i})) };
  assert.equal(anosCarreiraTecnico(t), 30);
  assert.equal(carreiraTecnicoEncerrada(t), true);
  assert.equal(carreiraTecnicoEncerrada({...t, temporadas:t.temporadas.slice(0,29)}), false);
});

test('30º ano permite encerrar finais e copas antes de bloquear nova temporada', () => {
  const t = { idade: 70, idadeInicio: 40, anoInicio: 2030, ano: 2060, temporadas: [] };
  assert.equal(carreiraTecnicoEncerrada(t), true);
  assert.equal(carreiraTecnicoEncerrada({...t, finaisPendentes:[{nome:'Libertadores'}]}), false);
  assert.equal(carreiraTecnicoEncerrada({...t, copasEmJogo:{nome:'Copa do Brasil'}}), false);
  assert.equal(carreiraTecnicoEncerrada({...t, aposentado:true, copasEmJogo:{nome:'Copa do Brasil'}}), true);
});

test('85 anos permanece teto de segurança mesmo com menos de 30 temporadas', () => {
  const t = { idade: IDADE_MAXIMA_TECNICO, idadeInicio: 75, anoInicio:2040, ano:2050, temporadas:[{ano:2040}] };
  assert.equal(carreiraTecnicoEncerrada(t), true);
});
