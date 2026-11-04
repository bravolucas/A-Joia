import { test, expect } from '@playwright/test';
import { criarJogador, desafiosDaTemporada } from '../rapido.js';

for (const width of [390, 1366]) test(`desafio e resultado no mesmo painel, com retomada em ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 640 });
  const c = criarJogador({ nome: 'Desafio Visual', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'DESAFIO-PAINEL' });
  c.flags.baseEscolhida = true; c.clubeNome = 'Santos'; c.ano = 2027;
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(c => localStorage.setItem('ajoia_rapido_v1', JSON.stringify({ v: 1, etapa: 'evento', c })), c);
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Visual/ }).click();
  const desafio = page.getByRole('region', { name: 'Desafio da temporada 2027' });
  await desafio.getByRole('button', { name: `Escolher ${desafiosDaTemporada(c)[0].nome}`, exact: true }).click();
  await expect(desafio.getByRole('status')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const salvo = await page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')));
  expect(salvo.c.desafios).toHaveLength(1);
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Visual/ }).click();
  await expect(desafio.getByRole('status')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar para o treino' }).click();
  await expect(page.getByText('Treino da pré-temporada', { exact: true })).toBeVisible();
  const depois = await page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')));
  expect(depois.c.desafios).toEqual(salvo.c.desafios);
  expect(depois.c.attrs).toEqual(salvo.c.attrs);
});
