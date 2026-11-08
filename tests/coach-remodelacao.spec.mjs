import { test, expect } from '@playwright/test';
import {criarGestaoTecnico,resumoGestaoTecnico} from '../src/treinador/mercadoTecnico.js';
import { criarJogador, aposentar } from '../src/jogador/rapido.js';
import { iniciarCarreiraTecnico, jogarTemporadaExpressaTecnico, calcularOvrTecnico, CLUBES_CONVITES_TECNICO } from '../src/treinador/tecnico.js';

function carreira() {
  const jogador = aposentar({ ...criarJogador({ nome: 'Treinador de teste', nac: 'BRA', posicao: 'ATA', personalidade: 'equilibrado', origem: 'base', pe: 'destro', numero: 10, ritmo: 'equilibrado', codigo: 'COACH-REMODELACAO' }), idade: 40 });
  const c = iniciarCarreiraTecnico(jogador);
  c.tecnico = { ...c.tecnico, propostasCoerentesVersao:3, clube: 'Confiança', pais: 'Brasil', liga: 'serieB', reputacao: 99, diretoria: 95, torcida: 85,
    opcoesInicio: [{ clube: 'Confiança', afinidade: 85, idolatria: true }, { clube: 'Santos', afinidade: 70 }], clubeInicialEscolhido: false };
  return c;
}
function comResultado() {
  const c = carreira();
  c.tecnico = { ...c.tecnico, clubeInicialEscolhido: true, propostasCoerentesVersao:3, fase: 'resultado', ano: c.tecnico.ano + 1,
    temporadas: [{ ano: c.tecnico.ano, clube: 'Confiança', liga: 'serieB', posicao: 8, pontos: 50, vitorias: 14, empates: 8, derrotas: 16, objetivo: 'Evitar rebaixamento', cumpriuObjetivo: true, titulosConquistados: [] }],
    propostas: [{ ...CLUBES_CONVITES_TECNICO.find(x => x.nome === 'Flamengo'), objetivo: 'Disputar o título',motivo:'Projeto compatível no seu país',coerencia:50 }] };
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

// Paradas da temporada e finais decididas na tela (ritmo normal/intenso).
async function concluirMomentos(page) {
  for (let i = 0; i < 80; i++) {
    await page.locator('.ct-simulating').waitFor({state:'detached',timeout:10000});
    await page.waitForTimeout(80);
    const copa=page.getByRole('dialog',{name:/Copa em jogo ·/});
    if(await copa.count()){const seguir=copa.getByRole('button',{name:/Continuar campanha|Concluir campanha/});if(await seguir.count())await seguir.click();else await copa.locator('.cce-opcoes button').first().click();continue;}
    const final = page.getByRole('dialog', { name: /^Final · / });
    if (await final.count()) { await final.locator('.ct-decisions button').first().click(); continue; }
    const resultado = page.getByRole('dialog', { name: 'Resultado da final' });
    if (await resultado.count()) { const agora = resultado.getByRole('button', { name: 'Ver agora' }); if (await agora.count()) await agora.click(); await resultado.getByRole('button', { name: /Continuar/ }).click(); continue; }
    const parada = page.getByRole('heading', { name: /Parada na rodada|Reunião de emergência|Clássico contra/ });
    if (await parada.count()) { await page.locator('.ct-actions .ct-decisions button:enabled').first().click(); await page.locator('.ct-simulating').waitFor({ state: 'detached', timeout: 10000 }); continue; }
    if (i >= 2) return;
  }
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
    await page.getByRole('button', { name: 'Começar temporada' }).click();
    const decisao = page.getByRole('dialog', { name: 'Decisão de pré-temporada' });
    await expect(decisao).toBeVisible();
    await decisao.locator('.ct-decisions button:not(:disabled)').first().click();
    await concluirMomentos(page);
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

  await expect(page.getByRole('button', { name: 'Começar temporada', exact: true })).toBeVisible();
  expect((await salvo(page)).tecnico.temporadas.length).toBe(1);
  await page.getByRole('button', { name: 'Começar temporada' }).click();
  const decisao = page.getByRole('dialog', { name: 'Decisão de pré-temporada' });
  if (await decisao.count()) await decisao.locator('.ct-decisions button:not(:disabled)').first().click();
  await concluirMomentos(page);
  await expect.poll(async () => (await salvo(page)).tecnico.temporadas.length).toBe(2);
  expect((await salvo(page)).tecnico.temporadas[1].clube).toBe('Flamengo');
});

test('ficar no clube mantém o contrato e avança uma temporada por vez', async ({ page }) => {
  await abrir(page, comResultado());
  await page.getByRole('button', { name: /Ficar no Confiança/ }).click();

  await expect(page.getByRole('button', { name: 'Começar temporada', exact: true })).toBeVisible();
  expect((await salvo(page)).tecnico.temporadas.length).toBe(1);
  await page.getByRole('button', { name: 'Começar temporada' }).click();
  const decisao = page.getByRole('dialog', { name: 'Decisão de pré-temporada' });
  if (await decisao.count()) await decisao.locator('.ct-decisions button:not(:disabled)').first().click();
  await concluirMomentos(page);
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
  await expect(page.getByRole('button', { name: /Esperar o telefone tocar/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Ficar no/ })).toHaveCount(0);
});

for(const width of [390,1366]){
 test(`idolatria: aviso, cancelamento e vínculo persistente em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=comResultado();
  c.tecnico.vinculosJogador=[{clube:'Santos',idolatria:true,afinidade:95,temporadas:5}];
  c.tecnico.propostas=[{...CLUBES_CONVITES_TECNICO.find(p=>p.nome==='Palmeiras'),motivo:'Projeto compatível no seu país',coerencia:50}];
  await abrir(page,c);const antes=await salvo(page);
  await page.getByRole('button',{name:/Assinar com Palmeiras/}).click();
  const aviso=page.getByRole('dialog',{name:'Decisão de legado'});
  await expect(aviso).toContainText('Santos');
  await aviso.getByRole('button',{name:'Manter meu legado'}).click();
  expect((await salvo(page)).tecnico).toEqual(antes.tecnico);
  await page.getByRole('button',{name:/Assinar com Palmeiras/}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/idolatria-${width}.png`,fullPage:true});
  await aviso.getByRole('button',{name:'Confirmar transferência'}).click();
  await expect.poll(async()=>(await salvo(page)).tecnico.clube).toBe('Palmeiras');
  const novo=await salvo(page);expect(novo.tecnico.rupturasIdolo.map(r=>r.clube)).toEqual(['Santos']);
  expect(novo.temporadas).toEqual(antes.temporadas);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await expect(page.getByText(/Legado: vínculo de ídolo rompido com Santos/)).toBeVisible();
  expect((await salvo(page)).tecnico.rupturasIdolo).toEqual(novo.tecnico.rupturasIdolo);
 });
}

for(const width of [390,1366]){
 test(`vitrine agrupada: contadores, histórico e save em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=comResultado();
  const grupos=[['Brasileirão','Copa do Brasil','Copa Libertadores'],['Brasileirão','Copa do Brasil','Copa Libertadores'],['Brasileirão','Copa do Brasil'],['Brasileirão']];
  c.tecnico={...c.tecnico,fase:'pretemporada',ano:2034,temporadas:grupos.map((titulos,i)=>({ano:2030+i,clube:i<2?'Santos':'Flamengo',liga:'brasileirao',posicao:1,pontos:80,vitorias:24,empates:8,derrotas:6,titulosConquistados:titulos}))};
  await abrir(page,c);const salvoAntes=await salvo(page);
  const vitrine=page.getByRole('region',{name:'Vitrine de conquistas'});
  await expect(vitrine.locator('.vc-compact button')).toHaveCount(3);
  await expect(vitrine.locator('.vc-shelf-header')).toContainText('9 títulos');
  await expect(vitrine.locator('.vc-shelf-header')).toContainText('3 competições');
  const brasileirao=vitrine.getByRole('button',{name:/^Brasileirão, 4 títulos/});
  await expect(brasileirao).toContainText('×4');
  await vitrine.screenshot({path:`/tmp/vitrine-ficha-${width}.png`});
  await brasileirao.click();
  const janela=page.getByRole('dialog',{name:'Conquistas como treinador'});
  const historico=janela.getByRole('region',{name:'Histórico de Brasileirão'});
  await expect(historico.locator('li')).toHaveCount(4);
  await expect(historico.locator('li').first()).toContainText('2033');
  await expect(historico.locator('.vc-clubs')).toContainText('Santos×2');
  await expect(historico.locator('.vc-clubs')).toContainText('Flamengo×2');
  await janela.getByRole('button',{name:'← Todas as conquistas'}).click();
  await expect(janela.locator('.vc-grid>button')).toHaveCount(3);
  await expect(janela.getByRole('button',{name:/^Brasileirão, 4 títulos/})).toBeFocused();
  await page.screenshot({path:`/tmp/vitrine-conquistas-${width}.png`,fullPage:false});
  const cards=await janela.locator('.vc-grid>button').evaluateAll(els=>els.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));
  expect(Math.max(...cards.map(c=>c.y))-Math.min(...cards.map(c=>c.y))).toBeLessThan(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await janela.getByRole('button',{name:/^Copa Libertadores, 2 títulos/}).click();
  await expect(janela.getByRole('region',{name:'Histórico de Copa Libertadores'}).locator('li')).toHaveCount(2);
  await page.keyboard.press('Escape');await expect(brasileirao).toBeFocused();
  expect((await salvo(page)).tecnico.temporadas).toEqual(salvoAntes.tecnico.temporadas);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await expect(page.getByRole('region',{name:'Vitrine de conquistas'}).getByRole('button',{name:/^Brasileirão, 4 títulos/})).toContainText('×4');
 });
}

for(const width of [390,1366]){
 test(`treinador rápido: uma escolha, recarga e simulação única em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=carreira();c.ritmo='intenso';c.tecnico.clubeInicialEscolhido=true;
  c.tecnico.planoRapido={ano:c.tecnico.ano,clube:c.tecnico.clube,cartas:['craque-jovem','esquema'],respostas:[]};
  await abrir(page,c);
  await expect(page.getByRole('button',{name:'Elenco e mercado',exact:true})).toHaveCount(0);
  await expect(page.getByRole('checkbox',{name:'Acompanhar jogo importante'})).toHaveCount(0);
  await expect(page.getByRole('combobox')).toHaveCount(0);
  const inicio=page.getByRole('button',{name:'Começar temporada',exact:true});
  if(width===390){const box=await inicio.boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(900);}
  await page.screenshot({path:`/tmp/treinador-rapido-painel-${width}.png`,fullPage:false});
  await inicio.click();
  const janela=page.getByRole('dialog',{name:'Decisão de pré-temporada'});
  await expect(janela).toContainText('ESCOLHA 1 DE 1');
  await expect(janela).toContainText('potencial');
  await page.screenshot({path:`/tmp/pretemporada-rapida-${width}.png`,fullPage:false});
  await janela.getByRole('button',{name:/Aposta jovem/}).click();
  await concluirMomentos(page);
  await expect.poll(async()=>(await salvo(page)).tecnico.temporadas.length).toBe(1);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  const fim=await salvo(page);expect(fim.tecnico.planoRapido.respostas.length).toBe(1);
  expect(fim.tecnico.ano).toBe(c.tecnico.ano+1);expect(fim.tecnico.elenco).toBe(c.tecnico.elenco+2);
  expect(fim.tecnico.temporadas[0].decisoes.filter(d=>d.carta!=='simulacao_expressa').length).toBe(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}

for(const width of [390,1366]){
 test(`treinador rápido: opção gratuita quando não há verba em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=carreira();c.tecnico.clubeInicialEscolhido=true;c.tecnico.verbaRapida=0;
  c.tecnico.planoRapido={ano:c.tecnico.ano,clube:c.tecnico.clube,cartas:['craque-jovem'],respostas:[]};
  await abrir(page,c);await page.getByRole('button',{name:'Começar temporada',exact:true}).click();
  const janela=page.getByRole('dialog',{name:'Decisão de pré-temporada'});
  await expect(janela.getByRole('button',{name:/Aposta jovem/})).toBeDisabled();
  await expect(janela).toContainText('Sem verba');await janela.getByRole('button',{name:/Manter o grupo/}).click();
  await concluirMomentos(page);
  await expect.poll(async()=>(await salvo(page)).tecnico.temporadas.length).toBe(1);
  expect((await salvo(page)).tecnico.verbaRapida).toBe(0);
 });
 test(`treinador rápido: retoma intervenção de save antigo em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});let c=carreira();c.tecnico.clubeInicialEscolhido=true;c.tecnico.acompanharJogo=true;
  c=jogarTemporadaExpressaTecnico(c,null,()=>.4);const pausa=structuredClone(c.tecnico.temporadaPausada);
  await abrir(page,c);await expect(page.getByRole('heading',{name:'Jogo importante',exact:true})).toBeVisible();
  await page.getByRole('button',{name:/Proteger a equipe/}).click();
  await expect.poll(async()=>(await salvo(page)).tecnico.temporadas.length).toBe(1);
  const fim=await salvo(page);expect(fim.tecnico.temporadas[0].confrontos.slice(0,pausa.indice)).toEqual(pausa.confrontos);
 });
}
