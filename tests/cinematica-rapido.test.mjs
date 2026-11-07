import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const componentes = readFileSync(new URL('../src/comum/components.jsx', import.meta.url), 'utf8');
const rapido = readFileSync(new URL('../src/jogador/ModoRapido.jsx', import.meta.url), 'utf8');

test('anúncio do novo clube preserva opção de pular e conclusão', () => {
  assert.match(componentes, /function AnuncioClube\(/);
  assert.match(componentes, /onClick=\{onConcluir\}/);
  assert.match(componentes, /<ApresentacaoNovoClube|export function ApresentacaoNovoClube/);
});

test('pênalti mantém seleção das zonas e cálculo original', () => {
  assert.match(rapido, /function TelaPenalti\(/);
  assert.match(rapido, /onZona=\{chutar\}/);
  assert.match(rapido, /const fin = c\.attrs\.finalizacao/);
  assert.match(rapido, /rp-pen-acao/);
});

// As três direções da falta são exercitadas no navegador em
// arena-minigames.spec.mjs, incluindo foco, escolha e callback real.

test('animações da bola respeitam movimento reduzido', () => {
  assert.match(componentes, /prefers-reduced-motion:reduce/);
  assert.match(componentes, /pen-bola-reduzida/);
  assert.match(rapido, /prefers-reduced-motion:reduce/);
});
