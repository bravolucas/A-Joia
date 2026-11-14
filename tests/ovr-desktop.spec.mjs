import {instalarSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada,aplicarMomento} from '../src/jogador/rapido.js';
const base='http://127.0.0.1:4173/A-Joia/';
function jogador(){const c=criarJogador({nome:'Lucas Layout',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'LAYOUT-OVR'});c.clubeNome='Ponte Preta';c.primeiroClube='Ponte Preta';c.flags.baseEscolhida=true;c.desafioAno=c.ano;for(const a of Object.keys(c.attrs))c.attrs[a]=54;return c;}
async function abrir(page,c,extra={}){await page.goto(base);await instalarSave(page,((s)=>(s))({v:1,etapa:'evento',c,auto:false,...extra}),"ajoia_rapido_v1");await page.reload();await page.getByRole('button',{name:/Continuar · Lucas Layout/}).click();}
async function conferirOvr(page){
 const ovr=page.locator('header [aria-label^="Overall "]');await expect(ovr).toHaveCSS('display','flex');
 const medidas=await ovr.evaluate(el=>{const r=el.getBoundingClientRect();return{caixa:{x:r.x,y:r.y,w:r.width,h:r.height},textos:[...el.querySelectorAll(':scope>span')].slice(0,2).map(s=>{const b=s.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height}})};});
 const b=medidas.caixa;for(const s of medidas.textos){expect(s.x).toBeGreaterThanOrEqual(b.x);expect(s.x+s.w).toBeLessThanOrEqual(b.x+b.w);expect(s.y).toBeGreaterThanOrEqual(b.y);expect(s.y+s.h).toBeLessThanOrEqual(b.y+b.h);expect(Math.abs((s.x+s.w/2)-(b.x+b.w/2))).toBeLessThan(1.1);}
 expect(medidas.textos[1].y).toBeGreaterThanOrEqual(medidas.textos[0].y+medidas.textos[0].h);
}
for(const width of[390,999,1000,1366,1920])test(`OVR centralizado e trajetória sem compressão em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:768});await page.emulateMedia({reducedMotion:'reduce'});await abrir(page,jogador());await conferirOvr(page);
 const historico=page.locator('.rp-historico').first(),caixa=await historico.boundingBox(),conteudo=await historico.locator(':scope>.cp-card').boundingBox();expect(conteudo.width/caixa.width).toBeGreaterThan(.85);await expect(historico).not.toHaveCSS('display','grid');
 await expect(page.getByRole('heading',{name:'Prepare sua temporada',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(width===1366||width===390)await page.screenshot({path:`/tmp/ovr-corrigido-${width}.png`,fullPage:true});
});
test('a Copa mantém duas colunas no computador com seu próprio cabeçalho',async({page})=>{
 await page.setViewportSize({width:1366,height:768});await page.emulateMedia({reducedMotion:'reduce'});const c=jogador();c.ano=2030;c.idade=20;for(const a of Object.keys(c.attrs))c.attrs[a]=90;const r=jogarTemporada(c);let card=r.card;while(card.pendente)card=aplicarMomento(card,true);await abrir(page,r.c,{etapa:'copa',card});await expect(page.getByRole('button',{name:'Voltar ao menu'})).toBeVisible();await expect(page.locator('.cp-torneio')).toHaveCSS('display','grid');const colunas=await page.locator('.cp-torneio').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' '));expect(colunas).toHaveLength(2);expect(parseFloat(colunas[0])).toBeGreaterThan(400);
});
