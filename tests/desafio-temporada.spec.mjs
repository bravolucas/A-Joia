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

async function abrirAnimacao(page) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const agora = new Date('2026-11-04T23:00:00Z');
  await page.clock.install({ time: agora });
  await page.clock.pauseAt(new Date(agora.getTime() + 100));
  const c = criarJogador({ nome: 'Desafio Animado', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'DESAFIO-ANIMADO' });
  c.flags.baseEscolhida = true; c.clubeNome = 'Santos'; c.ano = 2027;
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(c => localStorage.setItem('ajoia_rapido_v1', JSON.stringify({ v: 1, etapa: 'evento', c })), c);
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Animado/ }).click();
  await page.getByRole('button', { name: `Escolher ${desafiosDaTemporada(c)[0].nome}`, exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Revelando resultado…');
  return page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')));
}

test('animação revela o resultado salvo e não reinicia após recarga', async ({ page }) => {
  const salvo = await abrirAnimacao(page);
  await expect(page.getByTestId('desafio-ovr-atual')).toHaveText(String(salvo.desafioResultado.ovrAntes));
  const indicador = page.locator('.dt-indicador');
  const inicio = await indicador.getAttribute('style');
  await page.clock.runFor(600);
  expect(await indicador.getAttribute('style')).not.toEqual(inicio);
  await page.clock.runFor(1500);
  await expect(page.getByRole('status')).toHaveText('Resultado confirmado');
  await expect(page.getByTestId('desafio-ovr-atual')).toHaveText(String(salvo.desafioResultado.ovrDepois));
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Animado/ }).click();
  await expect(page.getByRole('status')).toHaveText('Resultado confirmado');
  const depois = await page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')));
  expect(depois.c.attrs).toEqual(salvo.c.attrs);
  expect(depois.c.desafios).toEqual(salvo.c.desafios);
});

test('revelar imediatamente mantém o mesmo resultado e aguarda continuar', async ({ page }) => {
  const salvo = await abrirAnimacao(page);
  await page.getByRole('button', { name: 'Revelar resultado', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Resultado confirmado');
  await expect(page.getByRole('button', { name: 'Continuar para o treino' })).toBeVisible();
  await expect(page.getByTestId('desafio-ovr-atual')).toHaveText(String(salvo.desafioResultado.ovrDepois));
  const depois = await page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')));
  expect(depois.c.desafios).toEqual(salvo.c.desafios);
  expect(depois.c.attrs).toEqual(salvo.c.attrs);
});
