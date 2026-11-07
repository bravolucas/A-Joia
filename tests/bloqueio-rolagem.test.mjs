import test from 'node:test';
import assert from 'node:assert/strict';
import { bloquearRolagem } from '../src/comum/bloqueioRolagem.js';

for (const ordem of [[0, 1], [1, 0]]) {
  test(`janelas sobrepostas liberam a página na ordem ${ordem}`, () => {
    const pagina = { style: { overflow: 'auto' } };
    const liberar = [bloquearRolagem(pagina), bloquearRolagem(pagina)];
    liberar[ordem[0]]();
    assert.equal(pagina.style.overflow, 'hidden');
    liberar[ordem[1]]();
    assert.equal(pagina.style.overflow, 'auto');
    liberar[ordem[0]]();
    assert.equal(pagina.style.overflow, 'auto');
    const novamente = bloquearRolagem(pagina);
    novamente();
    assert.equal(pagina.style.overflow, 'auto');
  });
}
