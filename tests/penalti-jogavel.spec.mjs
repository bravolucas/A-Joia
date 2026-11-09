import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada} from '../src/jogador/rapido.js';
async function abrir(page,mini){
 const c=criarJogador({nome:'Penalti Real',nac:'BRA',posicao:mini==='defesa'?'GOL':'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,codigo:'PENALTI-CORRETO'});c.attrs.finalizacao=70;c.attrs.defesa=70;
 const {card}=jogarTemporada(c);card.pendente={tipo:'copa',nome:'Copa do Brasil',mini,titulo:'Cobrança decisiva',ordem:1,total:1};card.filaMomentos=[];
 await page.goto('http://127.0.0.1:4173/A-Joia/');await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),{v:1,etapa:'momento',c,card});await page.reload();await page.getByRole('button',{name:/Continuar · Penalti Real/}).click();
}
for(const width of [320,1366])for(const mini of ['penalti','defesa'])for(const resultado of ['gol','defesa','fora'])test(`cobrança jogável ${mini} ${resultado} ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width===320?568:768});await page.emulateMedia({reducedMotion:'no-preference'});await page.clock.install();await abrir(page,mini);await page.clock.pauseAt(new Date(Date.now()+1000));
 const tela=page.locator('.penalti-jogavel');await expect(tela).toHaveAttribute('data-resultado-cobranca','preparacao');await expect(tela.getByRole('button')).toHaveCount(6);if(mini==='penalti'&&resultado==='gol')await page.screenshot({path:`test-results/penalti-preparacao-${width}.png`});await expect(tela.locator('[data-penalti-cena="preparacao"]')).toBeVisible();
 const seq=mini==='penalti'?resultado==='gol'?[.9,.9,.99,.99]:resultado==='defesa'?[0,.9,.99,0]:[.9,.9,0]:resultado==='gol'?[.99,.99,.99,.99]:resultado==='defesa'?[.99,0,.99,0]:[.99,0,0];
 await page.evaluate(seq=>{let n=0;Math.random=()=>seq[Math.min(n++,seq.length-1)];},seq);
 await tela.getByRole('button',{name:'Alto esquerda',exact:true}).click();await expect(tela).toHaveAttribute('data-resultado-cobranca',resultado);await expect(tela.locator('[data-desfecho]')).toHaveAttribute('data-desfecho',resultado);
 await expect(tela.getByRole('button')).toHaveCount(0);await expect(page.locator('.rp-goleiro')).toHaveCount(0);await page.clock.runFor(1500);const texto=mini==='penalti'?{gol:'GOOOL!',defesa:'DEFENDEU!',fora:'PRA FORA!'}[resultado]:{gol:'GOL DELES…',defesa:'QUE DEFESA!',fora:'PRA FORA! É CAMPEÃO!'}[resultado];await expect(page.getByText(texto,{exact:true})).toBeVisible();
 const continuar=page.locator('.mini-continuar');await expect(continuar).toBeInViewport();await tela.locator('.cce-penalti-desfecho').evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));await expect(tela.locator('.cce-penalti-desfecho')).toHaveCSS('opacity','1');await expect(tela.locator('.cce-penalti-inicio')).toHaveCSS('opacity','0');await page.screenshot({path:`test-results/penalti-jogavel-${mini}-${resultado}-${width}.png`});await continuar.click();await expect(page.locator('.penalti-jogavel')).toHaveCount(0);
});
