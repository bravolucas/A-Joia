import {test,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
let servidor;
test.beforeAll(async()=>{
 try{if((await fetch('http://127.0.0.1:4178/A-Joia/')).ok)return;}catch{}
 servidor=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4178','--strictPort'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,GITHUB_PAGES:'true'},stdio:'ignore',detached:true});
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4178/A-Joia/')).ok)return;}catch{}await new Promise(r=>setTimeout(r,150));}
 throw Error('Prévia de convocação não iniciou');
});
test.afterAll(()=>{if(servidor)try{process.kill(-servidor.pid,'SIGTERM');}catch{}});
for(const nac of ['BRA','ARG','ENG','FRA'])for(const venceu of [true,false])for(const width of [320,1280]){
 test(nac+' '+(venceu?'convocado':'fora')+' em '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:width===320?568:780});
  await page.emulateMedia({reducedMotion:'reduce'});
  const erros=[];page.on('pageerror',x=>erros.push(x.message));
  await page.goto('http://127.0.0.1:4178/A-Joia/tests/fixtures/convocacao-sprites.html?nac='+nac+'&venceu='+venceu);
  const c=page.locator('[data-convocacao-cinema]');
  await expect(c).toBeVisible();await expect(c).toHaveAttribute('data-fase','5');
  await expect(c).toHaveAttribute('data-resultado',venceu?'convocado':'fora');
  await expect(c).toContainText(venceu?'CONVOCADO!':'FORA DA LISTA');
  const imagem=c.locator('.cs-fotograma');
  await expect(imagem).toHaveCSS('background-image',/convocacao-(sequencia|frustracao)/);
  await expect(c.locator('.cs-selecao img')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(erros).toEqual([]);
 });
}
test('nome não aparece antes da revelação e pular mantém resultado já decidido',async({page})=>{
 await page.goto('http://127.0.0.1:4178/A-Joia/tests/fixtures/convocacao-sprites.html?nac=POR&venceu=false');
 const c=page.locator('[data-convocacao-cinema]');
 await expect(c).toHaveAttribute('data-resultado','aguardando');
 await expect(c).not.toContainText('FORA DA LISTA');
 await page.getByRole('button',{name:'Pular cerimônia'}).click();
 await expect(c).toHaveAttribute('data-resultado','fora');
 await expect(c).toContainText('O técnico escolheu outros nomes');
});
