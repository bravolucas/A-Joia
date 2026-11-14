import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import {test,expect} from '@playwright/test';
import {criarJogador} from '../src/jogador/rapido.js';
for(const width of [390,1366]){
 test(`desafios: tentativa, recarga e saves independentes em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/A-Joia/');
  await expect(page.getByRole('button',{name:/^Desafios históricos/})).toBeVisible();
  const c=criarJogador({nome:'Carreira preservada',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,codigo:'DESAFIOS'});
  await instalarSave(page,((c)=>({v:1,etapa:'painel',c}))(c),"ajoia_rapido_v1");
  await page.getByRole('button',{name:/^Desafios históricos/}).click();
  const originais=await page.evaluate(()=>({carreira:localStorage.getItem('ajoia_rapido_v1'),museu:localStorage.getItem('ajoia_museu_v1')}));
  await page.getByRole('button',{name:'Iniciar A força dos meninos'}).click();
  await expect(page.getByRole('button',{name:'Começar temporada',exact:true})).toBeVisible();
  await page.reload();await page.getByRole('button',{name:/^Desafios históricos/}).click();
  await page.getByRole('button',{name:'Continuar desafio'}).click();
  await expect(page.getByRole('button',{name:'Começar temporada',exact:true})).toBeVisible();
  const museuAntes=await page.evaluate(()=>localStorage.getItem('ajoia_museu_v1'));
  await page.getByRole('button',{name:'Começar temporada'}).click();
  const decisao=page.getByRole('dialog',{name:'Decisão de pré-temporada'});
  if(await decisao.count())await decisao.locator('.ct-decisions button:not(:disabled)').first().click();
  const resultado=page.getByRole('region',{name:'Resultado do desafio'});await expect(resultado).toBeVisible();
  const salvo=await lerSave(page,'ajoia_desafios_v1');
  expect(salvo.ativo.contabilizado).toBe(true);expect(salvo.ativo.c.tecnico.temporadas.length).toBe(1);expect(salvo.tentativas['santos-2002']).toBe(1);
  expect(await page.evaluate(()=>localStorage.getItem('ajoia_rapido_v1'))).toBe(originais.carreira);
  expect(await page.evaluate(()=>localStorage.getItem('ajoia_museu_v1'))).toBe(museuAntes);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/desafios-${width}.png`,fullPage:true});
  await resultado.getByRole('button',{name:'Ver desafios'}).click();
  await expect(page.getByRole('button',{name:'Iniciar A zebra inglesa'})).toBeEnabled();
  await page.reload();await page.getByRole('button',{name:/^Desafios históricos/}).click();
  await page.getByRole('button',{name:'Ver último resultado'}).click();
  await expect(page.getByRole('region',{name:'Resultado do desafio'})).toBeVisible();
 });
}

for(const width of [390,1366]){
 test(`desafio rápido: cancelar e confirmar encerramento em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.getByRole('button',{name:/^Desafios históricos/}).click();await page.getByRole('button',{name:'Iniciar A zebra inglesa'}).click();
  const ler=()=>lerSave(page,'ajoia_desafios_v1'),antes=await ler();
  await page.getByRole('button',{name:'← Voltar aos desafios',exact:true}).click();await page.getByRole('button',{name:'Encerrar tentativa',exact:true}).click();
  await page.getByRole('button',{name:'Cancelar encerramento',exact:true}).click();expect(await ler()).toEqual(antes);
  await page.reload();await page.getByRole('button',{name:/^Desafios históricos/}).click();await page.getByRole('button',{name:'Continuar desafio',exact:true}).click();
  await expect(page.getByRole('button',{name:'Começar temporada',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'← Voltar aos desafios',exact:true}).click();await page.getByRole('button',{name:'Encerrar tentativa',exact:true}).click();
  await page.getByRole('button',{name:'Confirmar encerramento',exact:true}).click();const fim=await ler();expect(fim.ativo).toBe(null);expect(fim.concluidos).toEqual(antes.concluidos);
 });
}
