import {test,expect} from '@playwright/test';
import {instalarSave,lerSave} from './helpers/save-browser.mjs';
import {criarJogador,iniciarNegociacao} from '../src/jogador/rapido.js';

function carreira(){
 const c=criarJogador({nome:'Contratos FM',nac:'BRA',posicao:'ATA',
  origem:'base',personalidade:'ascensao',pe:'destro',numero:9,
  codigo:'LINK-CONTRATOS-FM'});
 c.clubeNome='Flamengo';
 c.flags.baseEscolhida=true;
 return {c,neg:iniciarNegociacao(c,{clube:'Santos'})};
}
for(const width of [390,1366]){
 test(`histórico do clube e da liga não assina nem altera a negociação em ${width}px`,async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:840});
  await page.emulateMedia({reducedMotion:'reduce'});
  const erros=[];page.on('pageerror',e=>erros.push(e.message));
  const {c,neg}=carreira();
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await instalarSave(page,{v:1,etapa:'negociacao',c,neg},'ajoia_rapido_v1');
  await page.reload();
  await page.getByRole('button',{name:/Continuar · Contratos FM/}).click();
  await expect(page.getByRole('button',{name:'Assinar contrato'})).toBeVisible();
  const clube=page.getByRole('heading',{name:'Santos'}).locator('.ajoia-entity-link');
  await expect(clube).toBeVisible();await clube.click();
  const historico=page.getByRole('dialog',{name:'História do futebol'});
  await expect(historico).toBeVisible();
  await expect(historico.locator('.hf-galeria')).toContainText('Santos');
  await historico.getByRole('button',{name:'Fechar história'}).click();
  await expect(historico).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Assinar contrato'})).toBeVisible();
  const salvo=await lerSave(page,'ajoia_rapido_v1');
  expect(salvo.etapa).toBe('negociacao');
  expect(salvo.neg).toEqual(neg);
  expect(erros).toEqual([]);
 });
}
