import {instalarSave,lerSave} from './helpers/save-browser.mjs';
import { test, expect } from '@playwright/test';
import { criarJogador, aposentar } from '../src/jogador/rapido.js';
import { iniciarCarreiraTecnico, CLUBES_CONVITES_TECNICO } from '../src/treinador/tecnico.js';
// O sorteio animado das copas tem teste próprio (sorteio-copas.spec); aqui as decisões vêm direto.
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('a-joia:pular-sorteios','1'));});

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
  c.tecnico = { ...c.tecnico, propostasCoerentesVersao: 3, fase: 'resultado', ano: c.tecnico.ano + 1, temporadas: [temporada],
    propostas: [{ ...CLUBES_CONVITES_TECNICO.find(x => x.nome === 'Santos'), objetivo: 'Terminar na metade de cima', motivo: 'Interesse pela boa campanha', coerencia: 50 }], ...extra };
  c.idade++;
  return c;
}
async function abrir(page, c) {
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await instalarSave(page,((c)=>({ v: 1, etapa: 'tecnico', c }))(c),"ajoia_rapido_v1");
  await page.reload();
  await page.getByRole('button', { name: /Continuar · Treinador momentos/ }).click();
}
const salvo = page => lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c));
const semRolagemLateral = page => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

for (const width of [390, 1366]) {
  test(`calendário intercala estadual e liga por data e mantém o progresso ao recarregar em ${width}px`, async ({ page }) => {
    test.setTimeout(90000);await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
    const erros=[];page.on('pageerror',e=>erros.push(e.message));await abrir(page,carreira('normal'));
    await page.getByRole('button',{name:'Preparar equipe (opcional)',exact:true}).click();await page.getByRole('dialog',{name:'Decisão de pré-temporada'}).locator('.ct-decisions button:enabled').first().click();
    const hub=page.getByRole('region',{name:'Calendário da temporada'});await expect(hub).toBeVisible();
    let data=-99;const vistos=new Set();
    for(let i=0;i<16;i++){
      await page.locator('.ct-simulating').waitFor({state:'detached',timeout:15000});
      const c=await salvo(page),t=c.tecnico,p=t.temporadaPausada,agenda=t.copasEmJogo;
      const liga=p.datas[p.indice],copa=agenda?.dataAtual??Infinity,proxima=Math.min(liga,copa);
      expect(proxima).toBeGreaterThanOrEqual(data);data=proxima;vistos.add(liga<=copa?'liga':agenda.campeonatos[agenda.indice]?.tipo||'marco');
      await hub.getByRole('button',{name:/Pular próxima partida|Avançar a rodada/}).click();
    }
    expect(vistos.has('liga')).toBe(true);expect(vistos.has('estadual')).toBe(true);
    const antes=await salvo(page);await page.reload();await page.getByRole('button',{name:/Continuar · Treinador momentos/}).click();await expect(hub).toBeVisible();
    const depois=await salvo(page);expect(depois.tecnico.temporadaPausada.confrontos).toEqual(antes.tecnico.temporadaPausada.confrontos);expect(depois.tecnico.calendarioRecentes).toEqual(antes.tecnico.calendarioRecentes);
    expect(await semRolagemLateral(page)).toBe(true);expect(erros).toEqual([]);
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
    await expect(final.locator('.ct-decisions button')).toHaveCount(3); // três planos de jogo; nomes de clubes e da copa também são navegáveis
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

test('convite legado passa a vínculo exclusivo sem acrescentar Copa à temporada do clube', async ({ page }) => {
  const c = comResultado({ conviteSelecao: { ano: 2030, nac: 'BRA', selecao: 'Brasil', forca: 88, status: 'pendente' } });
  await abrir(page, c);
  const convite = page.getByRole('dialog', { name: 'Convite da seleção' });
  await expect(convite).toContainText('O vínculo é exclusivo');
  await convite.getByRole('button', { name: 'Assumir a seleção' }).click();
  await expect.poll(async () => (await salvo(page)).tecnico.selecao).toBe('BRA');
  const fim = await salvo(page);
  expect(fim.tecnico.clube).toBe('Brasil');
  expect(fim.tecnico.tipoEquipe).toBe('selecao');
  expect(fim.tecnico.temporadas[0].clube).toBe('Confiança');
  expect(fim.tecnico.temporadas[0].torneios).toEqual([]);
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
  const metas = page.locator('details.mt-goals:not(.mt-legacy)');
  await expect(metas).toContainText('Metas da carreira');
  await metas.locator('summary').click();
  await expect(metas).toContainText('Missão salvar');
  await expect(metas).toContainText('Cem vitórias');
});

test('legado completo junta jogador e treinador', async ({ page }) => {
  const c = comResultado();
  const a = c.tecnico.temporadas[0];
  a.classico = { rodada: 30, rival: 'Paulo Viana', clube: 'Sport', escolha: 'atacar', resultado: 'V', golsPro: 2, golsContra: 1 };
  a.torneios = [{ nome: 'Copa do Brasil', tipo: 'copa', participantes: 32, campeao: 'Flamengo', faseUsuario: 'Eliminado: quartas de final', fases: [],
    jogosUsuario: [{ casa: 'Confiança', fora: 'Remo', golsCasa: 2, golsFora: 0, vencedor: 'Confiança', fase: 'Oitavas de final' }, { casa: 'Flamengo', fora: 'Confiança', golsCasa: 3, golsFora: 1, vencedor: 'Flamengo', fase: 'Quartas de final' }] }];
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(c => { localStorage.setItem('ajoia_rapido_v1', JSON.stringify({ v: 1, etapa: 'tecnico', c })); }, c);
  await page.reload();
  await page.getByRole('button', { name: /Continuar · Treinador momentos/ }).click();
  const legado = page.locator('details.mt-legacy');
  await expect(legado).toContainText('Legado completo');
  await legado.locator('summary').click();
  await expect(legado).toContainText('Treinador');
  await expect(legado).toContainText('Jogador');
  expect(await semRolagemLateral(page)).toBe(true);
});
