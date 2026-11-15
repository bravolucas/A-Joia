import {test,expect} from '@playwright/test';
import {criarJogador} from '../src/jogador/rapido.js';
import {lerCarreira} from '../src/simulacao/arquivoSave.js';
const url='http://127.0.0.1:4173/A-Joia/';
test.setTimeout(90000);
function fixture(){const c=criarJogador({nome:'Resposta rápida',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'RESPOSTA-SAVE'});c.flags.baseEscolhida=true;return {v:1,etapa:'evento',c,auto:false};}
async function abrirLegado(page,s){await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),s);await page.reload();await page.getByRole('button',{name:/Continuar · Resposta rápida/}).click();await expect(page.getByRole('button',{name:'Não arriscar este ano'})).toBeVisible();}
async function resumoBanco(page){return page.evaluate(async()=>{
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ajoia-carreiras',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const s=await new Promise((resolve,reject)=>{const r=db.transaction('saves').objectStore('saves').get('ajoia_rapido_v1');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});db.close();return s?{ano:s.c.ano,desafioAno:s.c.desafioAno??null,etapa:s.etapa,jogadores:s.c.mundo.jogadores.length,primeiro:s.c.mundo.jogadores[0].id,universo:s.c.universo??null}:null;
});}
for(const width of [390,1366])test(`mundo sem ano arquivado migra o save legado para IndexedDB e conserva os atletas em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:850});const s=fixture();expect(s.c.universo).toBeUndefined();await abrirLegado(page,s);
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('ajoia_rapido_v1'))).toBe('{"arquivoMundo":1}');await page.locator('.mv-salvando').waitFor({state:'hidden'});
 await page.getByRole('button',{name:'Não arriscar este ano'}).click();await expect(page.locator('.tp-carta')).toHaveCount(3);await page.locator('.mv-salvando').waitFor({state:'hidden'});
 const salvo=await resumoBanco(page);expect(salvo).toEqual({ano:s.c.ano,desafioAno:s.c.ano,etapa:'evento',jogadores:s.c.mundo.jogadores.length,primeiro:s.c.mundo.jogadores[0].id,universo:null});
 await page.reload();await page.getByRole('button',{name:/Continuar · Resposta rápida/}).click();await expect(page.locator('.tp-carta')).toHaveCount(3);expect(await resumoBanco(page)).toEqual(salvo);
});
test('falha de gravação não avança a tela, conserva o save anterior e permite tentar novamente',async({page})=>{
 const s=fixture();await abrirLegado(page,s);await expect.poll(()=>page.evaluate(()=>localStorage.getItem('ajoia_rapido_v1'))).toBe('{"arquivoMundo":1}');await page.locator('.mv-salvando').waitFor({state:'hidden'});const antes=await resumoBanco(page);
 await page.evaluate(()=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(...args){if(args[1]==='ajoia_rapido_v1'){IDBObjectStore.prototype.put=put;throw new Error('Falha simulada no teste');}return put.apply(this,args);};});
 await page.getByRole('button',{name:'Não arriscar este ano'}).click();await expect(page.getByRole('alert')).toContainText('Falha simulada');await expect(page.getByRole('button',{name:'Não arriscar este ano'})).toBeVisible();await expect(page.locator('.tp-carta')).toHaveCount(0);expect(await resumoBanco(page)).toEqual(antes);
 await page.getByRole('button',{name:'Não arriscar este ano'}).click();await expect(page.locator('.tp-carta')).toHaveCount(3);await page.locator('.mv-salvando').waitFor({state:'hidden'});expect((await resumoBanco(page)).desafioAno).toBe(s.c.ano);await expect(page.getByRole('alert')).toHaveCount(0);
});
test('sem IndexedDB, o save JSON compactado continua disponível e recarrega a decisão',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'indexedDB',{value:undefined,configurable:true}));const s=fixture();await abrirLegado(page,s);await page.locator('.mv-salvando').waitFor({state:'hidden'});await page.getByRole('button',{name:'Não arriscar este ano'}).click();await expect(page.locator('.tp-carta')).toHaveCount(3);
 const texto=await page.evaluate(()=>localStorage.getItem('ajoia_rapido_v1')),salvo=lerCarreira(texto);expect(salvo.c.desafioAno).toBe(s.c.ano);expect(salvo.c.mundo.jogadores).toHaveLength(s.c.mundo.jogadores.length);expect(salvo.arquivoMundo).toBeUndefined();await page.reload();await page.getByRole('button',{name:/Continuar · Resposta rápida/}).click();await expect(page.locator('.tp-carta')).toHaveCount(3);
});
