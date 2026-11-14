import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada,fecharTemporada} from '../src/jogador/rapido.js';
function fixture(){const c=criarJogador({nome:'Teste resultado',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,ritmo:'expresso',codigo:'RESULTADO'});c.flags.baseEscolhida=true;const r=jogarTemporada(c);r.card.pendente=null;r.card.filaMomentos=[];const f=fecharTemporada(r.c,r.card);f.card.titulos=[];f.card.bola={pos:20};f.card.acesso=null;f.card.rebaixado=null;return {etapa:'fechamento',...f};}
async function abrir(page,s){await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,((s)=>({v:1,...s}))(s),"ajoia_rapido_v1");await page.reload();await page.getByRole('button',{name:/Continuar · Teste resultado/}).click();}
for(const [width,height] of [[320,568],[390,844],[1366,768]])test(`resultado isolado, sequência salva e resumo posterior ${width}`,async({page})=>{
 await page.setViewportSize({width,height});const s=fixture();s.card.titulos=[{tipo:'segunda',nome:'Brasileirão Série B'}];s.card.acesso={para:'Brasileirão'};s.card.bola={pos:3};await abrir(page,s);
 const dialog=page.getByRole('dialog');await expect(dialog).toContainText('CAMPEÃO!');await expect(dialog.getByRole('region',{name:'Resumo da temporada'})).toHaveCount(0);const before=await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c));
 const b=await dialog.getByRole('button',{name:'Próximo resultado'}).boundingBox();expect(b.y+b.height).toBeLessThanOrEqual(height);await page.screenshot({path:`test-results/resultado-exclusivo-${width}.png`});await dialog.getByRole('button',{name:'Próximo resultado'}).click();await expect(dialog.getByRole('heading',{name:'ACESSO!',exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:/Continuar · Teste resultado/}).click();await expect(dialog.getByRole('heading',{name:'ACESSO!',exact:true})).toBeVisible();await dialog.getByRole('button',{name:'Próximo resultado'}).click();await expect(dialog).toContainText('3º MELHOR DO MUNDO');await expect(dialog).not.toContainText('MELHOR DO MUNDO!');await dialog.getByRole('button',{name:'Ver resumo da temporada'}).click();await expect(page.getByRole('dialog',{name:/Fim da temporada/}).getByRole('region',{name:'Resumo da temporada'})).toBeVisible();
 expect(await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c))).toEqual(before);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
for(const pos of [1,2,3,4])test(`Bola de Ouro tem apresentação exclusiva para posição ${pos}`,async({page})=>{const s=fixture();s.card.bola={pos};await abrir(page,s);if(pos<=3){const d=page.getByRole('dialog',{name:/Resultado da temporada.*Bola de Ouro/});await expect(d).toBeVisible();await expect(d).toContainText(pos===1?'MELHOR DO MUNDO!':`${pos}º MELHOR DO MUNDO`);await expect(d.getByRole('region',{name:'Resumo da temporada'})).toHaveCount(0);}else await expect(page.getByRole('dialog',{name:/Fim da temporada/})).toBeVisible();});
test('rebaixamento tem resultado próprio sem comemoração de taça',async({page})=>{const s=fixture();s.card.rebaixado={para:'Série B'};await abrir(page,s);const d=page.getByRole('dialog',{name:/Resultado da temporada/});await expect(d.getByRole('heading',{name:'REBAIXADO',exact:true})).toBeVisible();await expect(d.locator('.ft-papel')).toHaveCount(0);await d.getByRole('button',{name:'Ver resumo da temporada'}).click();await expect(page.getByRole('dialog',{name:/Fim da temporada/})).toBeVisible();});

test('save antigo da Bola de Ouro abre o novo popup; Escape leva ao resumo e movimento reduzido é respeitado',async({page})=>{const s=fixture();s.etapa='bolaOuro';s.card.bola={pos:2};await page.emulateMedia({reducedMotion:'reduce'});await abrir(page,s);const d=page.getByRole('dialog',{name:/Resultado da temporada.*Bola de Ouro/});await expect(d).toContainText('2º MELHOR DO MUNDO');await expect(d.locator('.ft-taca')).toHaveCount(0);await expect(d.locator('.cb-palco')).toHaveCSS('animation-name','none');await page.keyboard.press('Escape');await expect(page.getByRole('dialog',{name:/Fim da temporada/})).toBeVisible();expect(await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.etapa))).toBe('fechamento');});

test('falha de gravação mantém o resultado atual e permite tentar novamente sem perder a retomada',async({page})=>{
 const s=fixture();s.card.titulos=[{tipo:'segunda',nome:'Brasileirão Série B'}];s.card.acesso={para:'Brasileirão'};s.card.bola={pos:3};await abrir(page,s);
 const dialog=page.getByRole('dialog');await expect(dialog).toContainText('CAMPEÃO!');
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await expect(page.locator('.mv-salvando')).toHaveCount(0);
 await page.evaluate(()=>{const original=IDBDatabase.prototype.transaction;let falhar=true;IDBDatabase.prototype.transaction=function(...args){if(args[1]==='readwrite'&&falhar){falhar=false;throw new Error('Falha de gravação simulada');}return original.apply(this,args);};});
 await dialog.getByRole('button',{name:'Próximo resultado'}).click();await expect(page.getByRole('alert')).toContainText('Falha de gravação simulada');await expect(dialog).toContainText('CAMPEÃO!');
 await dialog.getByRole('button',{name:'Próximo resultado'}).click();await expect(dialog.getByRole('heading',{name:'ACESSO!',exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:/Continuar · Teste resultado/}).click();await expect(dialog.getByRole('heading',{name:'ACESSO!',exact:true})).toBeVisible();
});

test('falha ao continuar a carreira não prende o resumo e a nova tentativa avança uma vez',async({page})=>{
 await abrir(page,fixture());const dialog=page.getByRole('dialog');await expect(dialog.getByRole('region',{name:'Resumo da temporada'})).toBeVisible();
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await expect(page.locator('.mv-salvando')).toHaveCount(0);
 await page.evaluate(()=>{const original=IDBDatabase.prototype.transaction;let falhar=true;IDBDatabase.prototype.transaction=function(...args){if(args[1]==='readwrite'&&falhar){falhar=false;throw new Error('Falha ao continuar simulada');}return original.apply(this,args);};});
 await dialog.getByRole('button',{name:/Continuar carreira/}).click();await expect(page.getByRole('alert')).toContainText('Falha ao continuar simulada');await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:/Continuar carreira/}).click();await expect(dialog).toHaveCount(0);const salvo=await lerSave(page);expect(salvo.c.temporadas).toHaveLength(1);
});
