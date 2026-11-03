import { test, expect } from '@playwright/test';
import { criarJogador, aposentar } from '../rapido.js';
import { iniciarCarreiraTecnico, calcularOvrTecnico, CLUBES_CONVITES_TECNICO } from '../tecnico.js';

function carreira() {
  const jogador = aposentar({ ...criarJogador({ nome: 'Treinador de teste', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'equilibrado', codigo: 'COACH-REMODELACAO' }), idade: 40 });
  const c = iniciarCarreiraTecnico(jogador);
  c.tecnico = { ...c.tecnico, clube: 'Confiança', pais: 'Brasil', liga: 'serieB', reputacao: 99, diretoria: 95, torcida: 85,
    opcoesInicio: [{ clube: 'Confiança', afinidade: 85, idolatria: true }, { clube: 'Santos', afinidade: 70 }], clubeInicialEscolhido: false };
  return c;
}
function comResultado() {
  const c = carreira();
  c.tecnico = { ...c.tecnico, clubeInicialEscolhido: true, fase: 'resultado', ano: c.tecnico.ano + 1,
    temporadas: [{ ano: c.tecnico.ano, clube: 'Confiança', liga: 'serieB', posicao: 8, pontos: 50, vitorias: 14, empates: 8, derrotas: 16, objetivo: 'Evitar rebaixamento', cumpriuObjetivo: true, titulosConquistados: [] }],
    propostas: [{ ...CLUBES_CONVITES_TECNICO.find(x => x.nome === 'Flamengo'), objetivo: 'Disputar o título' }] };
  c.idade++;
  return c;
}
async function abrir(page, c) {
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(c => localStorage.setItem('ajoia_rapido_v1', JSON.stringify({ v: 1, etapa: 'tecnico', c })), c);
  await page.reload();
  await page.getByRole('button', { name: /Continuar · Treinador de teste/ }).click();
  await expect(page.getByRole('heading', { name: 'Treinador de teste' })).toBeVisible();
}
async function salvo(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c);
}
async function fecharEventos(page) {
  for (let i = 0; i < 8; i++) {
    const dialog = page.getByRole('dialog');
    if (!(await dialog.count())) break;
    await dialog.getByRole('button', { name: 'Fechar janela' }).click();
  }
}

for (const width of [390, 1366]) {
  test(`treinador: ficha, decisão, temporada e save em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    const c = carreira();
    await abrir(page, c);
    await expect(page.locator('.ct-rating strong')).toHaveText(String(calcularOvrTecnico(c.tecnico)));
    const ficha = await page.locator('.ct-identity').boundingBox();
    const linha = await page.locator('.ct-timeline').boundingBox();
    if (width > 900) expect(linha.x).toBeGreaterThan(ficha.x + ficha.width);
    else expect(linha.y).toBeGreaterThan(ficha.y);
    await page.getByRole('button', { name: /Começar no Confiança/ }).click();
    const decisao = page.getByRole('dialog', { name: 'Decisão de carreira' });
    await expect(decisao).toBeVisible();
    await decisao.locator('.ct-decisions button').first().click();
    await expect.poll(async () => (await salvo(page)).tecnico.temporadas.length).toBe(1);
    const resultado = await salvo(page);
    expect(resultado.tecnico.decisoes[0].carta).not.toBe('simulacao_expressa');
    expect(resultado.tecnico.temporadas[0].vitorias + resultado.tecnico.temporadas[0].empates + resultado.tecnico.temporadas[0].derrotas).toBe(38);
    await fecharEventos(page);
    await page.getByRole('button', { name: /Temporada .*Confiança/ }).click();
    await expect(page.getByText('Ver classificação', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `/tmp/ajoia-treinador-${width}.png`, fullPage: true });
    await page.reload();
    await page.getByRole('button', { name: /Continuar · Treinador de teste/ }).click();
    expect((await salvo(page)).tecnico.temporadas).toEqual(resultado.tecnico.temporadas);
    expect(erros).toEqual([]);
  });
}

test('trocar de clube simula a próxima temporada uma única vez', async ({ page }) => {
  await abrir(page, comResultado());
  await page.getByRole('button', { name: /Assinar com Flamengo/ }).click();
  await expect.poll(async () => (await salvo(page)).tecnico.clube).toBe('Flamengo');

  await expect.poll(async () => (await salvo(page)).tecnico.temporadas.length).toBe(2);
  expect((await salvo(page)).tecnico.temporadas[1].clube).toBe('Flamengo');
});

test('ficar no clube mantém o contrato e avança uma temporada por vez', async ({ page }) => {
  await abrir(page, comResultado());
  await page.getByRole('button', { name: /Ficar no Confiança/ }).click();

  await expect.poll(async () => (await salvo(page)).tecnico.temporadas.length).toBe(2);
  expect((await salvo(page)).tecnico.temporadas[1].clube).toBe('Confiança');
});

test('vitrine abre, prende o foco e fecha por Escape', async ({ page }) => {
  await abrir(page, carreira());
  const botao = page.getByRole('button', { name: 'Ver conquistas como treinador' });
  await botao.click();
  const janela = page.getByRole('dialog', { name: 'Conquistas como treinador' });
  await expect(janela.getByRole('heading', { name: 'Vitrine vazia' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(janela.getByRole('button', { name: 'Fechar janela' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(janela).toHaveCount(0);
  await expect(botao).toBeFocused();
});

test('encerramento e desemprego não oferecem continuação inválida', async ({ page }) => {
  const c = comResultado();
  c.tecnico.temporadas = Array.from({ length: 30 }, (_, i) => ({ ...c.tecnico.temporadas[0], ano: 2026 + i }));
  await abrir(page, c);
  await expect(page.getByRole('heading', { name: 'Uma carreira para a história' })).toBeVisible();
  await expect(page.locator('.ct-offer')).toHaveCount(0);
  const desempregado = comResultado();
  desempregado.tecnico = { ...desempregado.tecnico, demitido: true, desempregado: true, propostas: [] };
  await abrir(page, desempregado);
  await expect(page.getByRole('button', { name: 'Aguardar propostas' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Ficar no/ })).toHaveCount(0);
});
