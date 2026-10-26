import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const componentes = readFileSync(new URL('../components.jsx', import.meta.url), 'utf8');
const rapido = readFileSync(new URL('../ModoRapido.jsx', import.meta.url), 'utf8');

test('anúncio do novo clube preserva opção de pular e conclusão', () => {
  assert.match(componentes, /function AnuncioClube\(/);
  assert.match(componentes, /onClick=\{onConcluir\}/);
  assert.match(componentes, /<ApresentacaoNovoClube|export function ApresentacaoNovoClube/);
  assert.match(componentes, /aria-hidden="true"[\s\S]{0,500}viewBox="0 0 220 300"/);
});

test('pênalti mantém seleção das zonas e cálculo original', () => {
  assert.match(rapido, /function TelaPenalti\(/);
  assert.match(rapido, /onZona=\{chutar\}/);
  assert.match(rapido, /const fin = c\.attrs\.finalizacao/);
  assert.match(rapido, /rp-pen-acao/);
});

test('falta mantém três direções e callback', () => {
  assert.match(componentes, /export function FreeKickMini\(/);
  for (const zona of ['cantoEsquerdo', 'porCima', 'cantoDireito']) {
    assert.ok(componentes.includes('onPick("' + zona + '")'), 'direção ausente: ' + zona);
  }
  assert.match(rapido, /calcularSucessoFalta\(/);
  assert.match(componentes, /penBolaGiro/);
});

test('animações da bola respeitam movimento reduzido', () => {
  assert.match(componentes, /prefers-reduced-motion:reduce/);
  assert.match(componentes, /pen-bola-reduzida/);
  assert.match(rapido, /prefers-reduced-motion:reduce/);
});
