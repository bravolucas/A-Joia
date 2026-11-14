import {instalarSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { criarJogador } from '../src/jogador/rapido.js';
import { museuVazio, extrairConquistasMuseu, mesclarMuseu, CHAVE_MUSEU } from '../src/museu/museu.js';
const base = 'http://127.0.0.1:4173/A-Joia/';
function cenario() {
 const c=criarJogador({nome:'Lucas do Museu',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'MUSEU-TESTE'});
 return {...c,museuId:'museu-browser',lista:[{nome:'Brasileirão',tipo:'liga',clube:'Santos',ano:2026},{nome:'Copa do Brasil',tipo:'copa',clube:'Santos',ano:2026}],torcida:{Santos:90},temporadas:[{clube:'Santos',ano:2026,jogos:38,gols:25}],totais:{jogos:100,gols:100,assist:20}};
}
async function preparar(page) {
 await page.goto(base);
 await instalarSave(page,((c)=>({v:1,etapa:'evento',c}))(cenario()),"ajoia_rapido_v1");
 await page.reload();
 await page.getByRole('button',{name:/Meu museu/}).click();
 await expect(page.getByRole('heading',{name:'Seu museu.'})).toBeVisible();
 await page.getByRole('button',{name:'Coleção permanente →',exact:true}).click();
}
for(const width of [390,1366])test(`museu: coleção, detalhes e permanência em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 const erros=[];page.on('pageerror',e=>erros.push(e.message));
 await preparar(page);
 const taca=page.getByRole('button',{name:'Brasileirão, desbloqueado',exact:true});
 await expect(taca).toBeVisible();await taca.click();
 const dialogo=page.getByRole('dialog',{name:'Brasileirão',exact:true});
 await expect(dialogo.getByText('Lucas do Museu',{exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await expect(dialogo).toHaveCount(0);
 await expect(taca).toBeFocused();
 await page.getByRole('tab',{name:/Camisas/}).click();
 await expect(page.getByRole('button',{name:'Santos, desbloqueado',exact:true})).toBeVisible();
 await page.getByRole('searchbox',{name:'Buscar na coleção'}).fill('Santos');
 await expect(page.locator('.mu-card')).toHaveCount(1);
 await page.getByRole('searchbox').clear();
 await page.getByRole('tab',{name:/Feitos/}).click();
 await expect(page.getByRole('button',{name:'Faro de gol, desbloqueado',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`/tmp/ajoia-museu-${width}.png`,fullPage:true});
 const antes=await page.evaluate(k=>localStorage.getItem(k),CHAVE_MUSEU);
 await page.getByRole('button',{name:'← Voltar ao museu',exact:true}).click();
 await page.getByRole('button',{name:'← Voltar ao menu',exact:true}).click();
 await page.getByRole('button',{name:/Nova carreira/}).click();
 await expect(page.getByRole('button',{name:'Voltar ao menu',exact:true})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),CHAVE_MUSEU)).toBe(antes);
 await page.getByRole('button',{name:'Voltar ao menu',exact:true}).click();
 await page.getByRole('button',{name:/Meu museu/}).click();
 await page.getByRole('button',{name:'Coleção permanente →',exact:true}).click();
 await expect(page.getByRole('button',{name:'Brasileirão, desbloqueado',exact:true})).toBeVisible();
 expect(erros).toEqual([]);
});

test('exportar e importar a coleção preserva conquistas sem duplicar contagens',async({page})=>{
 await preparar(page);
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Exportar coleção',exact:true}).click()]);
 const backup=JSON.parse(await readFile(await download.path(),'utf8'));
 expect(backup.tacas['taca-brasileirao']).toBeTruthy();
 await page.locator('input[type=file]').setInputFiles({name:'museu.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await expect(page.getByRole('status')).toHaveText(/Coleção importada/);
 const segundo=mesclarMuseu(museuVazio(),extrairConquistasMuseu({...cenario(),museuId:'outra',lista:[{nome:'Champions League',tipo:'continental',ano:2027,clube:'Barcelona'}]}));
 await page.locator('input[type=file]').setInputFiles({name:'outro.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(segundo))});
 await expect(page.getByRole('button',{name:'Champions League, desbloqueado',exact:true})).toBeVisible();
 const m=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CHAVE_MUSEU);
 expect(Object.keys(m.tacas['taca-brasileirao'].fontes)).toHaveLength(1);
 expect(Object.keys(m.tacas)).toHaveLength(3);
 await page.locator('input[type=file]').setInputFiles({name:'invalido.json',mimeType:'application/json',buffer:Buffer.from('{"versao":99}')});
 await expect(page.getByRole('status')).toHaveText(/não é uma coleção válida/);
 expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),CHAVE_MUSEU)).toEqual(m);
});

test('coleção vazia mostra objetivos e permite navegar pelas abas com teclado',async({page})=>{
 await page.goto(base);await page.getByRole('button',{name:/Meu museu/}).click();
 await page.getByRole('button',{name:'Coleção permanente →',exact:true}).click();
 await expect(page.getByText('Uma coleção começa com uma história.')).toBeVisible();
 await page.getByRole('tab',{name:/Taças/}).focus();await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:/Camisas/})).toBeFocused();
 await expect(page.getByRole('tab',{name:/Camisas/})).toHaveAttribute('aria-selected','true');
 await page.getByRole('searchbox').fill('Santos');
 await page.getByRole('button',{name:'Santos, bloqueado',exact:true}).click();
 await expect(page.getByRole('dialog').getByText(/vira camisa de ídolo/)).toBeVisible();
});
