import {test,expect} from '@playwright/test';
import {criarJogador} from '../src/jogador/rapido.js';
const url=process.env.AJOIA_TEST_URL||'http://127.0.0.1:4173/A-Joia/';
for(const width of [320,390,1366])test(`diamante: identidade, seleção e entrada acessíveis em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});const erros=[];page.on('pageerror',e=>erros.push(e.message));await page.goto(url);
 await expect(page.locator('html')).toHaveAttribute('data-visual','diamante');await expect(page.getByRole('heading',{name:'A JOIA',exact:true})).toBeVisible();
 await page.getByRole('radio',{name:/Expresso/}).click();await expect(page.getByRole('radio',{name:/Expresso/})).toHaveAttribute('aria-checked','true');await expect(page.getByRole('radio',{name:/Normal/})).toHaveAttribute('aria-checked','false');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/diamante-inicio-${width}.png`,fullPage:true});await page.getByRole('button',{name:'Começar carreira'}).click();await expect(page.locator('.cc')).toBeVisible();expect(erros).toEqual([]);
});
test('luz acompanha o mouse e não captura os cliques do cartão',async({page})=>{
 await page.goto(url);const cartao=page.getByRole('radio',{name:/Intenso/});await cartao.hover();await expect(cartao).toHaveAttribute('data-luz','ativa');expect(await cartao.evaluate(e=>e.style.getPropertyValue('--luz-x'))).toMatch(/px$/);await cartao.click();await expect(cartao).toHaveAttribute('aria-checked','true');await page.mouse.move(0,0);await expect(cartao).not.toHaveAttribute('data-luz','ativa');
});
test('toque seleciona sem ativar luz que segue o mouse',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();await page.goto(url);const c=page.getByRole('radio',{name:/Expresso/});await c.tap();await expect(c).toHaveAttribute('aria-checked','true');await expect(c).not.toHaveAttribute('data-luz','ativa');await context.close();
});
test('movimento reduzido mantém títulos, botões e efeitos estáticos',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await expect(page.getByRole('heading',{name:'A JOIA',exact:true})).toBeVisible();await expect(page.locator('.joia-revelacao')).toHaveCSS('opacity','1');
 const animacoes=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&a.effect?.getComputedTiming().iterations===Infinity).length);expect(animacoes).toBe(0);await page.getByRole('radio',{name:/Intenso/}).hover();await expect(page.getByRole('radio',{name:/Intenso/})).not.toHaveAttribute('data-luz','ativa');
 await page.getByRole('button',{name:'Começar carreira'}).click();await expect(page.locator('.cc')).toBeVisible();
});
test('revelação da carreira preserva save e campos durante atualização visual',async({page})=>{
 const c=criarJogador({nome:'Diamante da Bola',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'DIAMANTE-V1'});c.flags.baseEscolhida=true;c.desafioAno=c.ano;
 await page.goto(url);await page.evaluate(c=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify({v:1,etapa:'evento',c,auto:false})),c);await page.reload();await page.getByRole('button',{name:/Continuar · Diamante/}).click();await expect(page.getByRole('main')).toBeVisible();await expect.poll(()=>page.getByRole('main').evaluate(e=>getComputedStyle(e).opacity)).toBe('1');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c.codigo)).toBe('DIAMANTE-V1');await page.reload();await page.getByRole('button',{name:/Continuar · Diamante/}).click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')).c.nome)).toBe('Diamante da Bola');
});
test('movimento reduzido preserva o marcador essencial do treino e permite concluir',async({page})=>{
 const {normalizarSave}=await import('../src/completo/save.js');const {CLUBES}=await import('../src/dados/data.js');const {gerarMundoJogadores}=await import('../src/comum/lib.js');
 const s=normalizarSave({versao:1,nome:'Treino de Diamante',posicao:'ATA',nacionalidade:'BRA',personalidade:'ascensao',pernaDominante:'destro',temporadas:[],mundo:gerarMundoJogadores(),aba:'carreira',carreira:{posicao:'ATA',clube:CLUBES.find(c=>c.nome==='Santos'),attrs:{velocidade:75,finalizacao:75,passe:75,drible:75,defesa:65,fisico:75,fintas:3,pernaRuim:3},idade:24,picoOvr:75,contrato:{salario:1000,multa:5000,anos:3,restantes:2}}});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.evaluate(s=>localStorage.setItem('ajoia_save_auto',JSON.stringify(s)),s);await page.reload();await page.getByRole('button',{name:/Modo Carreira completo/}).click();await page.getByRole('button',{name:/Continuar carreira/}).click();await page.getByRole('button',{name:/Corpo/,exact:false}).first().click();await page.getByRole('button',{name:/Treino tático —/}).click();const marcador=page.locator('.joia-timing-marker');await expect(marcador).toBeVisible();await expect(marcador).toHaveCSS('animation-duration','0.9s');await expect(marcador).toHaveCSS('animation-iteration-count','infinite');const x=(await marcador.boundingBox()).x;await expect.poll(async()=>Math.abs((await marcador.boundingBox()).x-x)).toBeGreaterThan(10);await page.getByRole('button',{name:'Sincronizar',exact:true}).click();await expect(marcador).toHaveCount(0);
});
