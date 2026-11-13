import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import { test, expect } from '@playwright/test';
import { criarJogador, desafiosDaTemporada, jogarTemporada, gerarColetiva } from '../src/jogador/rapido.js';

for (const width of [320, 390, 1366]) test(`desafio e resultado no mesmo painel, com retomada em ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: width === 320 ? 568 : 640 });
  const c = criarJogador({ nome: 'Desafio Visual', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'DESAFIO-PAINEL' });
  c.flags.baseEscolhida = true; c.clubeNome = 'Santos'; c.ano = 2027;
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await instalarSave(page,((c)=>({ v: 1, etapa: 'evento', c }))(c),"ajoia_rapido_v1");
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Visual/ }).click();
  const desafio = page.getByRole('region', { name: 'Desafio da temporada 2027' });
  await page.screenshot({path:`/tmp/escolhas-novas-${width}.png`,fullPage:true});
  await desafio.getByRole('button', { name: `Escolher ${desafiosDaTemporada(c)[0].nome}`, exact: true }).click();
  await expect(desafio.getByRole('status')).toBeVisible();
  const acao = desafio.locator('.dt-footer button');
  await expect(acao).toBeVisible();
  const limites = await acao.boundingBox();
  expect(limites.y).toBeGreaterThanOrEqual(0);
  expect(limites.y + limites.height).toBeLessThanOrEqual(page.viewportSize().height);

  await expect(page.getByRole('dialog')).toHaveCount(0);
  const salvo = await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo));
  expect(salvo.c.desafios).toHaveLength(1);
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Visual/ }).click();
  await expect(desafio.getByRole('status')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar para o treino' }).click();
  await expect(page.getByText('Treino da pré-temporada', { exact: true })).toBeVisible();
  const depois = await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo));
  expect(depois.c.desafios).toEqual(salvo.c.desafios);
  expect(depois.c.attrs).toEqual(salvo.c.attrs);
});

async function abrirAnimacao(page) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const agora = new Date('2026-11-04T23:00:00Z');
  await page.clock.install({ time: agora });
  await page.clock.pauseAt(new Date(agora.getTime() + 5000)); // folga: sob carga, +100 ms já podia ter passado
  const c = criarJogador({ nome: 'Desafio Animado', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'normal', codigo: 'DESAFIO-ANIMADO' });
  c.flags.baseEscolhida = true; c.clubeNome = 'Santos'; c.ano = 2027;
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await instalarSave(page,((c)=>({ v: 1, etapa: 'evento', c }))(c),"ajoia_rapido_v1");
  await page.reload(); await page.getByRole('button', { name: /Continuar · Desafio Animado/ }).click();
  await page.getByRole('button', { name: `Escolher ${desafiosDaTemporada(c)[0].nome}`, exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Revelando resultado…');
  return lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo));
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
  const depois = await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo));
  expect(depois.c.attrs).toEqual(salvo.c.attrs);
  expect(depois.c.desafios).toEqual(salvo.c.desafios);
});

test('revelar imediatamente mantém o mesmo resultado e aguarda continuar', async ({ page }) => {
  const salvo = await abrirAnimacao(page);
  await page.getByRole('button', { name: 'Pular animação', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Resultado confirmado');
  await expect(page.getByRole('button', { name: 'Continuar para o treino' })).toBeVisible();
  await expect(page.getByTestId('desafio-ovr-atual')).toHaveText(String(salvo.desafioResultado.ovrDepois));
  const depois = await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo));
  expect(depois.c.desafios).toEqual(salvo.c.desafios);
  expect(depois.c.attrs).toEqual(salvo.c.attrs);
});

for (const width of [320, 1366]) test(`entrevista mantém consequência e continuar visíveis em ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:568});
  const c = criarJogador({nome:'Entrevista Visual',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'ENTREVISTA'});
  const {card}=jogarTemporada(c), coletiva=gerarColetiva(c,card);
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await instalarSave(page,((s)=>(s))({v:1,etapa:'coletiva',c,card,ultimo:card,coletiva}),"ajoia_rapido_v1");
  await page.reload();await page.getByRole('button',{name:/Continuar · Entrevista Visual/}).click();
  await page.locator('.fluxo-coletiva .rp-opcao').last().click();
  const botao=page.locator('.fluxo-coletiva').getByRole('button',{name:'Continuar',exact:true});
  await expect(botao).toBeVisible();const box=await botao.boundingBox();expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(568);
});
