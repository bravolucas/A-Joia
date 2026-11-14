import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import {test,expect} from '@playwright/test';
import {criarJogador,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
for(const legado of [false,true])test(`Fortaleza preserva referência 64 e usa elenco 70 ao abrir e reabrir treinador ${legado?'legado':'novo'}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});
 let c=aposentar(criarJogador({nome:'Teste Fortaleza',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'FORCA64-UI'}));c.idade=45;c=iniciarCarreiraTecnico(c);
 Object.assign(c.tecnico,{clube:'Fortaleza',liga:'serieB',pais:'Brasil',elenco:legado?76:64,clubeInicialEscolhido:true,fase:'pretemporada',ajusteTurno:null});if(legado)delete c.ajustesCadastro;
 c.mundo.jogadores=c.mundo.jogadores.map(p=>p.clubeNome==='Fortaleza'?{...p,ovr:70}:p);
 await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,((c)=>({v:1,etapa:'tecnico',c}))(c),"ajoia_rapido_v1");await page.reload();
 for(let i=0;i<2;i++){await page.getByRole('button',{name:/Continuar · Teste Fortaleza/}).click();await expect(page.getByText(/Força 70 ·/)).toBeVisible();const s=await lerSave(page);expect(s.c.tecnico.elenco).toBe(64);expect(s.c.tecnico.gestao.forcaReferencia).toBe(64);expect(s.c.tecnico.gestao.elenco.every(p=>p.qualidade===70)).toBe(true);await expect(page.locator('.ct-current-club')).toContainText('Fortaleza');await page.reload();}
});
