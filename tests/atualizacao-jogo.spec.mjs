import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {criarJogador} from '../src/jogador/rapido.js';
import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:4173/A-Joia/';
const chaves={ajoia_rapido_v1:JSON.stringify({v:1,etapa:'evento',c:criarJogador({nome:'Save preservado',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,codigo:'CACHE-PRESERVAR'})}),ajoia_slots_v1:'slots-preservados',preferencia_outro_app:'preservar'};
async function guardar(page){await page.evaluate(async itens=>{for(const [k,v]of Object.entries(itens))localStorage.setItem(k,v);await (await caches.open('ajoia-imagens')).put('/A-Joia/antigo',new Response('cache antigo'));await (await caches.open('cache-outro-aplicativo')).put('/outro',new Response('não apagar'));},chaves);}
async function conferir(page){for(const [k,v]of Object.entries(chaves))expect(await page.evaluate(k=>localStorage.getItem(k),k)).toBe(v);const cachesAtuais=await page.evaluate(()=>caches.keys());expect(cachesAtuais).not.toContain('ajoia-imagens');expect(cachesAtuais).toContain('cache-outro-aplicativo');expect(await page.evaluate(async()=>{const rs=await navigator.serviceWorker.getRegistrations();return rs.filter(r=>new URL(r.scope).pathname==='/A-Joia/').length;})).toBe(0);}
test('atualizar manualmente remove cache próprio e mantém saves e outros aplicativos',async({page})=>{
 await page.goto(base);await expect(page.getByText(/Copas v2/)).toBeVisible();await guardar(page);await page.getByRole('button',{name:'Atualizar jogo · manter saves'}).click();await expect(page).toHaveURL(/ajoia_atualizada=copas-v2/);await expect(page.getByText(/Copas v2/)).toBeVisible();await conferir(page);const url=page.url();await page.reload();await expect(page.getByText(/Copas v2/)).toBeVisible();expect(page.url()).toBe(url);
});
test('HTML novo migra cache legado automaticamente uma só vez',async({page})=>{
 await page.goto(base);await guardar(page);await page.reload();await expect(page).toHaveURL(/ajoia_atualizada=copas-v2/);await expect(page.getByText(/Copas v2/)).toBeVisible();await conferir(page);const url=page.url();await page.reload();await expect(page.getByText(/Copas v2/)).toBeVisible();expect(page.url()).toBe(url);
});

test('worker novo recupera uma página realmente presa no HTML antigo sem apagar saves',async({page})=>{
 const url='http://127.0.0.1:4174/A-Joia/';
 const servidor=spawn('python3',[fileURLToPath(new URL('./fixtures/servidor-migracao.py',import.meta.url))],{stdio:'ignore'});
 try {
 for(let i=0;i<50;i++){try{await page.request.get('http://127.0.0.1:4174/__estado',{timeout:500});break;}catch{await new Promise(r=>setTimeout(r,100));}}

 await page.goto('http://127.0.0.1:4174/__instalar');await page.evaluate(async()=>{const r=await navigator.serviceWorker.register('/A-Joia/sw.js',{scope:'/A-Joia/',updateViaCache:'none'});await new Promise(resolve=>{const w=r.installing||r.waiting||r.active;if(w.state==='activated')resolve();else w.addEventListener('statechange',()=>{if(w.state==='activated')resolve();});});});await page.goto(url);await expect(page.getByText('Versão antiga em cache')).toBeVisible();await guardar(page);
 await page.request.post('http://127.0.0.1:4174/__novo');await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration('/A-Joia/');await r.update();});await expect(page).toHaveURL(/ajoia_atualizada=copas-v2/);await expect(page.getByText(/Copas v2/)).toBeVisible({timeout:15000});await expect(page.locator('.cce-arena')).toHaveCount(0);await conferir(page);
 } finally {servidor.kill('SIGTERM');}
});
