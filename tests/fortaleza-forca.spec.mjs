import {test,expect} from '@playwright/test';
import {criarJogador,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
for(const legado of [false,true])test(`Fortaleza mostra força 64 ao abrir e reabrir treinador ${legado?'legado':'novo'}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});
 let c=aposentar(criarJogador({nome:'Teste Fortaleza',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'FORCA64-UI'}));c.idade=45;c=iniciarCarreiraTecnico(c);
 Object.assign(c.tecnico,{clube:'Fortaleza',liga:'serieB',pais:'Brasil',elenco:legado?76:64,clubeInicialEscolhido:true,fase:'pretemporada',ajusteTurno:null});if(legado)delete c.ajustesCadastro;
 await page.goto('http://127.0.0.1:4173/A-Joia/');await page.evaluate(c=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify({v:1,etapa:'tecnico',c})),c);await page.reload();
 for(let i=0;i<2;i++){await page.getByRole('button',{name:/Continuar · Teste Fortaleza/}).click();await expect(page.getByText(/Força 64 ·/)).toBeVisible();await expect(page.locator('.ct-current-club')).toContainText('Fortaleza');await page.reload();}
});
