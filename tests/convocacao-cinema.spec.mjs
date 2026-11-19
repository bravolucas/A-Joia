import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {test,expect} from '@playwright/test';
let servidor;
test.beforeAll(async()=>{
 try{if((await fetch('http://127.0.0.1:4178/A-Joia/')).ok)return;}catch{}
 servidor=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','4178','--strictPort'],{cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,GITHUB_PAGES:'true'},stdio:'ignore',detached:true});
 for(let i=0;i<90;i++){try{if((await fetch('http://127.0.0.1:4178/A-Joia/')).ok)return;}catch{}await new Promise(r=>setTimeout(r,150));}
 throw Error('Prévia da convocação não iniciou');
});
test.afterAll(()=>{if(servidor)try{process.kill(-servidor.pid,'SIGTERM');}catch{}});
for(const nac of ['BRA','ENG','ARG'])for(const convocado of [true,false])for(const width of [320,1280]){
 test('Convocação '+nac+' '+(convocado?'dentro':'fora')+' em '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:width===320?620:800});
  await page.emulateMedia({reducedMotion:'reduce'});
  const erros=[];page.on('pageerror',e=>erros.push(e.message));
  await page.goto('http://127.0.0.1:4178/A-Joia/tests/fixtures/convocacao-cinema.html?nac='+nac+'&convocado='+convocado);
  const cena=page.locator('[data-cena-convocacao]');
  await expect(cena).toBeVisible();
  await expect(cena).toHaveAttribute('data-etapa','5');
  await expect(cena).toHaveAttribute('data-convocado',String(convocado));
  await expect(cena).toContainText(convocado?'CONVOCADO!':'FORA DA LISTA');
  const nomes=cena.locator('.cc-lista ol');
  if(convocado)await expect(nomes).toContainText('A Joia');
  else await expect(nomes).not.toContainText('A Joia');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(erros).toEqual([]);
 });
}
test('suspense não revela o nome antes do final e o pulo mantém resultado',async({page})=>{
 await page.goto('http://127.0.0.1:4178/A-Joia/tests/fixtures/convocacao-cinema.html?nac=FRA&convocado=true');
 const cena=page.locator('[data-cena-convocacao]');
 await expect(cena).toHaveAttribute('data-convocado','pendente');
 await expect(cena).not.toContainText('CONVOCADO!');
 await expect(cena.locator('.cc-lista ol')).not.toContainText('A Joia');
 await page.getByRole('button',{name:'Pular cerimônia'}).click();
 await expect(cena).toHaveAttribute('data-convocado','true');
 await expect(cena).toContainText('A Joia');
});
