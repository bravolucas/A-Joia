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
