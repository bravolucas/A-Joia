import { test, expect } from '@playwright/test';
import {criarGestaoTecnico,resumoGestaoTecnico} from '../mercadoTecnico.js';
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
    await page.getByRole('button', { name: 'Tomar decisão e simular' }).click();
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

  await expect(page.getByRole('button', { name: 'Elenco e mercado', exact: true })).toBeVisible();
  expect((await salvo(page)).tecnico.temporadas.length).toBe(1);
  await page.getByRole('button', { name: /Tomar decisão e simular|Simular temporada/ }).click();
  const decisao = page.getByRole('dialog', { name: 'Decisão de carreira' });
  if (await decisao.count()) await decisao.locator('.ct-decisions button').first().click();
  await expect.poll(async () => (await salvo(page)).tecnico.temporadas.length).toBe(2);
  expect((await salvo(page)).tecnico.temporadas[1].clube).toBe('Flamengo');
});

test('ficar no clube mantém o contrato e avança uma temporada por vez', async ({ page }) => {
  await abrir(page, comResultado());
  await page.getByRole('button', { name: /Ficar no Confiança/ }).click();

  await expect(page.getByRole('button', { name: 'Elenco e mercado', exact: true })).toBeVisible();
  expect((await salvo(page)).tecnico.temporadas.length).toBe(1);
  await page.getByRole('button', { name: /Tomar decisão e simular|Simular temporada/ }).click();
  const decisao = page.getByRole('dialog', { name: 'Decisão de carreira' });
  if (await decisao.count()) await decisao.locator('.ct-decisions button').first().click();
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

for (const width of [390, 1366]) {
 test(`gestão: compra, venda e persistência em ${width}px`, async ({ page }) => {
  await page.setViewportSize({width,height:900});
  await abrir(page, carreira());
  await page.getByRole('button', {name:/Começar no Confiança/}).click();
  const abrirGestao=()=>page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  await abrirGestao();
  const janela=page.getByRole('dialog',{name:'Elenco e mercado'});
  await janela.getByRole('button',{name:'Mercado',exact:true}).click();
  const antes=await salvo(page);
  await expect(janela.locator('.gm-cards article')).toHaveCount(3);
  if(width>1000)expect((await janela.boundingBox()).width).toBeGreaterThan(900);
  for(const card of await janela.locator('.gm-cards article').all())expect((await card.boundingBox()).width).toBeGreaterThan(200);
  await page.screenshot({path:`/tmp/mercado-home-${width}.png`,fullPage:false});
  await janela.getByRole('button',{name:/Contratar /}).and(page.locator(':enabled')).first().click();
  expect((await salvo(page)).tecnico.gestao).toEqual(antes.tecnico.gestao);
  await expect(janela.getByRole('group',{name:'Contratar jogador'})).toContainText('Como fica o seu time');
  const confirmarBox=await janela.getByRole('button',{name:'Confirmar contratação',exact:true}).boundingBox();
  const areaBox=await janela.locator('.gm-content').boundingBox();
  expect(confirmarBox.y+confirmarBox.height).toBeLessThanOrEqual(areaBox.y+areaBox.height+1);
  await page.screenshot({path:`/tmp/mercado-proposta-${width}.png`,fullPage:false});
  await janela.getByRole('button',{name:'Cancelar contratação',exact:true}).click();
  expect((await salvo(page)).tecnico.gestao).toEqual(antes.tecnico.gestao);
  await expect(janela.getByRole('button',{name:/Contratar /}).first()).toBeFocused();
  await janela.getByRole('button',{name:/Contratar /}).first().click();
  await janela.getByRole('button',{name:'Confirmar contratação',exact:true}).click();
  await expect(janela.getByRole('status')).toHaveText('Contratação concluída.');
  const comprado=await salvo(page);
  expect(comprado.tecnico.gestao.elenco.length).toBe(25);
  expect(comprado.tecnico.gestao.saldo).toBeLessThan(antes.tecnico.gestao.saldo);
  const alvo=comprado.tecnico.gestao.elenco.at(-1);
  await janela.getByRole('button',{name:'Ver no elenco →',exact:true}).click();
  await janela.getByRole('button',{name:`Vender ${alvo.nome}`,exact:true}).last().click();
  await janela.getByRole('button',{name:'Cancelar venda'}).click();
  expect((await salvo(page)).tecnico.gestao.elenco.length).toBe(25);
  await janela.getByRole('button',{name:`Vender ${alvo.nome}`,exact:true}).last().click();
  await janela.getByRole('button',{name:'Confirmar venda',exact:true}).click();
  await expect(janela.getByRole('status')).toHaveText('Venda concluída.');
  const vendido=await salvo(page);
  expect(vendido.tecnico.gestao.elenco.length).toBe(24);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/gestao-${width}.png`,fullPage:true});
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await abrirGestao();
  expect((await salvo(page)).tecnico.gestao).toEqual(vendido.tecnico.gestao);
 });
}

for (const width of [390,1366]) {
 test(`renovação: proposta, cancelamento e recarga em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await abrir(page,carreira());
  await page.getByRole('button',{name:/Começar no Confiança/}).click();
  await page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  const janela=page.getByRole('dialog',{name:'Elenco e mercado'});
  const antes=await salvo(page),g=antes.tecnico.gestao;
  const alvo=g.elenco.find(j=>j.contrato===1);
  expect(alvo).toBeTruthy();
  await janela.getByRole('button',{name:/Elenco \(/}).click();
  const setores={GOL:'Goleiros',DEF:'Defesa',MEI:'Meio-campo',ATA:'Ataque'};
  await janela.getByRole('button',{name:`Filtrar ${setores[alvo.setor]}`,exact:true}).click();
  const jogador=janela.locator('article').filter({has:page.getByRole('button',{name:`Renovar contrato de ${alvo.nome}`,exact:true})}).first();
  await expect(jogador.getByText('Contrato vencendo')).toBeVisible();
  await jogador.getByRole('button',{name:/Renovar contrato/}).click();
  const proposta=janela.getByRole('group',{name:'Confirmar renovação'});
  await expect(proposta).toContainText('Luvas:');
  await proposta.getByRole('button',{name:'Cancelar renovação'}).click();
  expect((await salvo(page)).tecnico.gestao).toEqual(g);
  await jogador.getByRole('button',{name:/Renovar contrato/}).click();
  await proposta.getByRole('button',{name:'Confirmar renovação',exact:true}).click();
  await expect(janela.getByRole('status')).toHaveText('Contrato renovado.');
  const renovado=await salvo(page),j=renovado.tecnico.gestao.elenco.find(j=>j.id===alvo.id);
  expect(j.contrato).toBe(3);expect(j.salario).toBe(Math.ceil(alvo.salario*1.1));
  expect(renovado.tecnico.gestao.saldo).toBe(g.saldo-j.salario*2);
  expect(renovado.tecnico.elenco).toBe(antes.tecnico.elenco);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.reload();
  await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  expect((await salvo(page)).tecnico.gestao).toEqual(renovado.tecnico.gestao);
  await page.screenshot({path:`/tmp/renovacao-${width}.png`,fullPage:true});
 });
}

for(const width of [390,1366]){
 test(`tática: escolhas persistem e entram na temporada em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await abrir(page,carreira());
  await page.getByRole('button',{name:/Começar no Confiança/}).click();
  await page.getByLabel('Formação',{exact:true}).selectOption('3-5-2');
  await page.getByLabel('Estilo',{exact:true}).selectOption('defensivo');
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await expect(page.getByLabel('Formação',{exact:true})).toHaveValue('3-5-2');
  await expect(page.getByLabel('Estilo',{exact:true})).toHaveValue('defensivo');
  await page.screenshot({path:`/tmp/taticas-${width}.png`,fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:/Tomar decisão e simular|Simular temporada/}).click();
  const decisao=page.getByRole('dialog',{name:'Decisão de carreira'});
  if(await decisao.count())await decisao.locator('.ct-decisions button').first().click();
  await expect.poll(async()=>(await salvo(page)).tecnico.temporadas.length).toBe(1);
  const temporada=(await salvo(page)).tecnico.temporadas[0];
  expect(temporada.formacao).toBe('3-5-2');expect(temporada.estilo).toBe('defensivo');
  expect(temporada.confrontos.filter(j=>!j.folga).every(j=>j.formacao==='3-5-2'&&j.estilo==='defensivo')).toBe(true);
  const copa=temporada.torneios.find(t=>t.tipo==='copa');
  expect(copa).toBeTruthy();
  const jogos=copa.jogosUsuario.filter(j=>!j.bye);
  expect(jogos.length).toBeGreaterThan(0);
  expect(jogos.every(j=>j.planoTatico?.formacao==='3-5-2'&&j.planoTatico?.estilo==='defensivo')).toBe(true);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  expect((await salvo(page)).tecnico.temporadas[0].torneios).toEqual(temporada.torneios);
 });
}

for(const width of [390,1366]){
 test(`intervenção: pausa, recarga e conclusão única em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await abrir(page,carreira());
  await page.getByRole('button',{name:/Começar no Confiança/}).click();
  const acompanhar=page.getByRole('checkbox',{name:'Acompanhar jogo importante'});
  await expect(acompanhar).not.toBeChecked();await acompanhar.check();
  await page.getByRole('button',{name:/Tomar decisão e simular|Simular temporada/}).click();
  const decisao=page.getByRole('dialog',{name:'Decisão de carreira'});
  if(await decisao.count())await decisao.locator('.ct-decisions button').first().click();
  await expect(page.getByRole('heading',{name:'Jogo importante',exact:true})).toBeVisible();
  const pausado=await salvo(page),p=pausado.tecnico.intervencaoPendente;
  expect(pausado.tecnico.temporadas.length).toBe(0);expect(p.jogos).toBeGreaterThan(0);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await expect(page.getByRole('heading',{name:'Jogo importante',exact:true})).toBeVisible();
  expect((await salvo(page)).tecnico.temporadaPausada).toEqual(pausado.tecnico.temporadaPausada);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/intervencao-${width}.png`,fullPage:true});
  await page.getByRole('button',{name:/Buscar a vitória/}).click();
  await expect.poll(async()=>(await salvo(page)).tecnico.temporadas.length).toBe(1);
  const fim=await salvo(page),temporada=fim.tecnico.temporadas[0];
  expect(fim.tecnico.ano).toBe(pausado.tecnico.ano+1);expect(fim.idade).toBe(pausado.idade+1);
  expect(temporada.confrontos.slice(0,pausado.tecnico.temporadaPausada.indice)).toEqual(pausado.tecnico.temporadaPausada.confrontos);
  expect(temporada.confrontos.filter(j=>j.intervencao).length).toBe(1);
  expect(temporada.confrontos.find(j=>j.intervencao).estilo).toBe('ofensivo');
  expect(temporada.jogos).toBe(38);expect(fim.tecnico.intervencaoPendente).toBe(null);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  expect((await salvo(page)).tecnico.temporadas).toEqual(fim.tecnico.temporadas);
 });
}

for(const width of [390,1366]){
 test(`comissão: custos, cancelamento e save em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await abrir(page,carreira());
  await page.getByRole('button',{name:/Começar no Confiança/}).click();
  await page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  const janela=page.getByRole('dialog',{name:'Elenco e mercado'});
  await janela.getByRole('button',{name:'Comissão técnica',exact:true}).click();
  const antes=await salvo(page),g=antes.tecnico.gestao;
  await janela.getByRole('button',{name:'Contratar Auxiliar técnico',exact:true}).click();
  const confirmar=janela.getByRole('group',{name:'Confirmar comissão'});
  await expect(confirmar).toContainText('Pagamento agora:');
  await confirmar.getByRole('button',{name:'Cancelar contratação'}).click();
  expect((await salvo(page)).tecnico.gestao).toEqual(g);
  await janela.getByRole('button',{name:'Contratar Auxiliar técnico',exact:true}).click();
  await confirmar.getByRole('button',{name:'Confirmar contratação'}).click();
  await expect(janela.getByRole('status')).toHaveText('Comissão contratada.');
  const depois=await salvo(page),contrato=depois.tecnico.gestao.comissao[0];
  expect(depois.tecnico.gestao.saldo).toBe(g.saldo-contrato.custo);
  expect(contrato.custo).toBe(contrato.salario*12);
  await expect(janela.getByRole('button',{name:'Contratar Auxiliar técnico',exact:true})).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.reload();await page.getByRole('button',{name:/Continuar · Treinador de teste/}).click();
  await page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  await janela.getByRole('button',{name:'Comissão técnica',exact:true}).click();
  expect((await salvo(page)).tecnico.gestao).toEqual(depois.tecnico.gestao);
  await expect(janela.getByRole('button',{name:'Contratar Auxiliar técnico',exact:true})).toBeDisabled();
  await page.screenshot({path:`/tmp/comissao-${width}.png`,fullPage:true});
 });
}

for(const width of [390,1366]){
 test(`idolatria: aviso, cancelamento e vínculo persistente em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=comResultado();
  c.tecnico.vinculosJogador=[{clube:'Santos',idolatria:true,afinidade:95,temporadas:5}];
  c.tecnico.propostas=[{...CLUBES_CONVITES_TECNICO.find(p=>p.nome==='Palmeiras')}];
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
 test(`mercado guiado: explica falta de dinheiro e protege setor em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=carreira();c.tecnico.clubeInicialEscolhido=true;
  c.tecnico.gestao=criarGestaoTecnico(c.tecnico);c.tecnico.gestao.saldo=0;
  await abrir(page,c);await page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  const janela=page.getByRole('dialog',{name:'Elenco e mercado'});
  await janela.getByRole('button',{name:/Contratar /}).first().click();
  await expect(janela.getByText('Orçamento insuficiente para esta contratação.')).toBeVisible();
  await expect(janela.getByRole('button',{name:'Confirmar contratação',exact:true})).toBeDisabled();
  expect((await salvo(page)).tecnico.gestao.saldo).toBe(0);
  await janela.getByRole('button',{name:'Cancelar contratação',exact:true}).click();
  await janela.getByRole('button',{name:/Elenco \(/}).click();
  await expect(janela.locator('.gm-cards article')).toHaveCount(3);
  await janela.getByRole('button',{name:/Vender /}).first().click();
  const antes=await salvo(page);
  await expect(janela.getByRole('group',{name:'Confirmar venda'})).toContainText('Salários livres depois');
  expect((await salvo(page)).tecnico.gestao).toEqual(antes.tecnico.gestao);
  await janela.getByRole('button',{name:'Confirmar venda',exact:true}).click();
  await expect(janela.getByRole('status')).toHaveText('Venda concluída.');
  const vendido=await salvo(page);expect(vendido.tecnico.gestao.saldo).toBeGreaterThan(0);
  await janela.getByRole('button',{name:/Vender /}).first().click();
  await expect(janela.getByText('A venda deixaria o setor sem jogadores suficientes.')).toBeVisible();
  await expect(janela.getByRole('button',{name:'Confirmar venda',exact:true})).toBeDisabled();
  expect((await salvo(page)).tecnico.gestao).toEqual(vendido.tecnico.gestao);
 });
 test(`mercado guiado: explica limite salarial em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});const c=carreira();c.tecnico.clubeInicialEscolhido=true;
  c.tecnico.gestao=criarGestaoTecnico(c.tecnico);c.tecnico.gestao.tetoSalarial=resumoGestaoTecnico(c.tecnico.gestao).folha;
  await abrir(page,c);await page.getByRole('button',{name:'Elenco e mercado',exact:true}).click();
  const janela=page.getByRole('dialog',{name:'Elenco e mercado'});
  await janela.getByRole('button',{name:/Contratar /}).first().click();
  await expect(janela.getByText('A contratação ultrapassa o teto salarial.')).toBeVisible();
  await expect(janela.getByRole('button',{name:'Confirmar contratação',exact:true})).toBeDisabled();
  expect((await salvo(page)).tecnico.gestao).toEqual(c.tecnico.gestao);
 });
}
