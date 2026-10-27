import { test, expect } from '@playwright/test';

for (const viewport of [{ name: 'desktop', width: 1366, height: 768 }, { name: 'celular', width: 390, height: 844 }]) {
  test(`entrada e Modo Rápido no ${viewport.name}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/A-Joia/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'A JOIA' })).toBeVisible();
    await expect(page.getByRole('radiogroup')).toBeVisible();
    await expect(page.getByRole('button', { name: /Começar carreira/ })).toBeVisible();
    await page.getByRole('button', { name: /Começar carreira/ }).click();
    await expect(page.locator('body')).not.toBeEmpty();
    await page.waitForTimeout(600);
    expect(errors, 'Erros de JavaScript no navegador').toEqual([]);
    await page.screenshot({ path: `test-results/entrada-${viewport.name}.png`, fullPage: true });
    await context.close();
  });
}

import { criarJogador, aposentar, CHAVE_SAVE_RAPIDO, VERSAO_RAPIDO } from '../rapido.js';
import { iniciarCarreiraTecnico } from '../tecnico.js';

// Testa a interface real com um save preparado: não depende de jogar 20 anos manualmente.
for (const viewport of [{ name: 'desktop', width: 1366, height: 768 }, { name: 'celular', width: 390, height: 844 }]) {
  test(`treinador expresso salva e retoma temporada no ${viewport.name}`, async ({ browser }) => {
    const jogador = criarJogador({ nome: 'Teste E2E', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 9, codigo: 'E2E-TREINADOR' });
    const carreira = iniciarCarreiraTecnico(aposentar(jogador));
    const save = JSON.stringify({ v: VERSAO_RAPIDO, etapa: 'tecnico', c: carreira });
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });
    await context.addInitScript(({ key, value }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, value);
    }, { key: CHAVE_SAVE_RAPIDO, value: save });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/A-Joia/');
    await page.getByRole('button', { name: /Continuar · Teste E2E/ }).click();
    await expect(page.getByText('A JOIA · Modo Treinador')).toBeVisible();

    const primeiroClube = page.getByRole('button', { name: /Afinidade/ }).first();
    if (await primeiroClube.isVisible()) await primeiroClube.click();
    await expect(page.getByText('1 decisão → 1 ano')).toBeVisible();
    await page.locator('section').filter({ hasText: '1 decisão → 1 ano' }).locator('button').first().click();
    await expect(page.getByText('Histórico ano após ano')).toBeVisible();
    await expect(page.getByText('Fim da temporada')).toBeVisible();
    const registro = await page.evaluate(key => {
      const salvo = JSON.parse(localStorage.getItem(key));
      return salvo.c.tecnico.temporadas.length;
    }, CHAVE_SAVE_RAPIDO);
    expect(registro).toBe(1);

    await page.reload();
    await page.getByRole('button', { name: /Continuar · Teste E2E/ }).click();
    await expect(page.getByText('A JOIA · Modo Treinador')).toBeVisible();
    await expect(page.getByText('Histórico ano após ano')).toBeVisible();
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).c.tecnico.temporadas.length, CHAVE_SAVE_RAPIDO)).toBe(1);
    expect(errors, 'Erros de JavaScript no navegador').toEqual([]);
    await context.close();
  });
}
