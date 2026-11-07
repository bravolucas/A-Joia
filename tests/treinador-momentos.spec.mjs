import { test, expect } from '@playwright/test';
import { criarJogador, aposentar } from '../src/jogador/rapido.js';
import { iniciarCarreiraTecnico, CLUBES_CONVITES_TECNICO } from '../src/treinador/tecnico.js';

function carreira(ritmo = 'normal') {
  const jogador = aposentar({ ...criarJogador({ nome: 'Treinador momentos', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'COACH-MOMENTOS' }), idade: 40 });
  const c = iniciarCarreiraTecnico(jogador);
  c.ritmo = ritmo;
  c.tecnico = { ...c.tecnico, clube: 'Confiança', pais: 'Brasil', liga: 'serieB', reputacao: 70, diretoria: 80, torcida: 70, clubeInicialEscolhido: true, opcoesInicio: [] };
  return c;
}
function comResultado(extra = {}) {
  const c = carreira();
  const temporada = { ano: c.tecnico.ano, clube: 'Confiança', liga: 'serieB', posicao: 3, pontos: 66, vitorias: 19, empates: 9, derrotas: 10, objetivo: 'Evitar rebaixamento', cumpriuObjetivo: true, titulosConquistados: [], torneios: [] };
  c.tecnico = { ...c.tecnico, propostasCoerentesVersao: 2, fase: 'resultado', ano: c.tecnico.ano + 1, temporadas: [temporada],
    propostas: [{ ...CLUBES_CONVITES_TECNICO.find(x => x.nome === 'Santos'), objetivo: 'Terminar na metade de cima', motivo: 'Interesse pela boa campanha', coerencia: 50 }], ...extra };
  c.idade++;
  return c;
}
async function abrir(page, c) {
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(c => localStorage.setItem('ajoia_rapido_v1', JSON.stringify({ v: 1, etapa: 'tecnico', c })), c);
  await page.reload();
  await page.getByRole('button', { name: /Continuar · Treinador momentos/ }).click();
}
const salvo = page => page.evaluate(() => JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c);
const semRolagemLateral = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

for (const width of [390, 1366]) {
  test(`parada no meio da temporada mostra a tabela e continua em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const erros = []; page.on('pageerror', e => erros.push(e.message));
    await abrir(page, carreira('normal'));
    await page.getByRole('button', { name: 'Começar temporada', exact: true }).click();
    await page.getByRole('dialog', { name: 'Decisão de pré-temporada' }).locator('.ct-decisions button:enabled').first().click();
    await expect(page.getByRole('heading', { name: /Parada na rodada|Reunião de emergência/ })).toBeVisible();
    await expect(page.getByLabel('Classificação parcial')).toContainText('Confiança');
    expect((await salvo(page)).tecnico.fase).toBe('parada');
    expect(await semRolagemLateral(page)).toBe(true);
    await page.screenshot({ path: `test-results/treinador-parada-${width}.png`, fullPage: true });
    await page.locator('.ct-actions .ct-decisions button:enabled').first().click();
    await expect.poll(async () => (await salvo(page)).tecnico.fase).not.toBe('parada');
    const fim = await salvo(page);
    expect(fim.tecnico.temporadas[0].paradas).toHaveLength(1);
    expect(fim.tecnico.temporadas[0].vitorias + fim.tecnico.temporadas[0].empates + fim.tecnico.temporadas[0].derrotas).toBe(fim.tecnico.temporadas[0].jogos);
    expect(erros).toEqual([]);
  });

  test(`final decidida pela escolha do treinador em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const c = comResultado();
    const ano = c.tecnico.temporadas[0].ano;
    c.tecnico.temporadas[0].torneios = [{ nome: 'Copa do Brasil', tipo: 'copa', participantes: 32, campeao: null, faseUsuario: 'Final', finalPendente: true,
      fases: [{ fase: 'Final', rodada: 5, jogos: [{ casa: 'Confiança', fora: 'Flamengo', golsCasa: 0, golsFora: 2, vencedor: 'Flamengo', fase: 'Final', rodada: 5 }] }], jogosUsuario: [] }];
    c.tecnico.finaisPendentes = [{ nome: 'Copa do Brasil', tipo: 'copa', lado: 'Confiança', adversario: 'Flamengo', ano, forcaUsuario: 70, forcaAdv: 86, dado: 0.05 }];
    await abrir(page, c);
    const final = page.getByRole('dialog', { name: 'Final · Copa do Brasil' });
    await expect(final).toBeVisible();
    await expect(final.getByRole('button')).toHaveCount(4); // três planos e o fechar
    await page.screenshot({ path: `test-results/treinador-final-${width}.png`, fullPage: false });
    await final.getByRole('button', { name: /Fechar e contra-atacar/ }).click();
    const resultado = page.getByRole('dialog', { name: 'Resultado da final' });
    await expect(resultado).toBeVisible();
    const agora = resultado.getByRole('button', { name: 'Ver agora' }); if (await agora.count()) await agora.click();
    await expect(resultado.getByRole('heading', { name: 'CAMPEÃO!' })).toBeVisible();
    await resultado.getByRole('button', { name: /^Continuar/ }).click();
    await expect(page.getByRole('dialog', { name: 'Título conquistado' })).toContainText('Copa do Brasil');
    const fim = await salvo(page);
    expect(fim.tecnico.finaisPendentes).toHaveLength(0);
    expect(fim.tecnico.titulos).toBe(1);
    expect(fim.tecnico.temporadas[0].titulosConquistados).toEqual(['Copa do Brasil']);
    expect(fim.tecnico.temporadas[0].torneios[0].campeao).toBe('Confiança');
    expect(await semRolagemLateral(page)).toBe(true);
  });
}

test('convite da seleção leva o treinador à Copa do Mundo e volta ao clube', async ({ page }) => {
  const c = comResultado({ conviteSelecao: { ano: 2030, nac: 'BRA', selecao: 'Brasil', forca: 88, status: 'pendente' } });
  await abrir(page, c);
  const convite = page.getByRole('dialog', { name: 'Convite da seleção' });
  await expect(convite).toContainText('Brasil');
  await convite.getByRole('button', { name: /Aceitar e disputar a Copa/ }).click();
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(500);
    const final = page.getByRole('dialog', { name: /^Final · / });
    if (await final.count()) { await final.locator('.ct-decisions button').first().click(); continue; }
    const r = page.getByRole('dialog', { name: 'Resultado da final' });
    if (await r.count()) { const agora = r.getByRole('button', { name: 'Ver agora' }); if (await agora.count()) await agora.click(); await r.getByRole('button', { name: /^Continuar/ }).click(); continue; }
    if (await page.getByRole('dialog', { name: 'Copa do Mundo' }).count()) break;
    const titulo = page.getByRole('dialog', { name: 'Título conquistado' });
    if (await titulo.count()) await titulo.locator('.ct-champion-continue').click();
  }
  await expect(page.getByRole('dialog', { name: 'Copa do Mundo' })).toContainText('CAMPANHA COM BRASIL');
  const fim = await salvo(page);
  expect(fim.tecnico.conviteSelecao.status).toBe('aceito');
  expect(fim.tecnico.temporadas[0].torneios.some(x => x.tipo === 'copaMundo' && x.selecao === 'Brasil')).toBe(true);
  expect(fim.tecnico.clube).toBe('Confiança');
});

test('ano sem clube: comentarista rende reputação e saldo', async ({ page }) => {
  const c = comResultado({ demitido: true, propostas: [], carteiraTecnico: { saldo: 100, pagamentos: [], compras: [] } });
  await abrir(page, c);
  await page.getByRole('button', { name: /Comentarista de TV/ }).click();
  await expect.poll(async () => (await salvo(page)).tecnico.anoSabatico?.length).toBe(1);
  const fim = await salvo(page);
  expect(fim.tecnico.reputacao).toBe(73);
  expect(fim.tecnico.carteiraTecnico.saldo).toBe(580);
  expect(fim.tecnico.ano).toBe(c.tecnico.ano + 1);
});

test('metas da carreira aparecem com progresso', async ({ page }) => {
  await abrir(page, comResultado());
  const metas = page.locator('details.mt-goals');
  await expect(metas).toContainText('Metas da carreira');
  await metas.locator('summary').click();
  await expect(metas).toContainText('Missão salvar');
  await expect(metas).toContainText('Cem vitórias');
});
