import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import { test, expect } from '@playwright/test';
import { criarJogador, aposentar } from '../src/jogador/rapido.js';
import { iniciarCarreiraTecnico, aceitarPropostaTecnico, proximaTemporadaTecnico } from '../src/treinador/tecnico.js';
import { SELECOES_TECNICO } from '../src/treinador/selecoesTecnico.js';
function base(){
 const jogador=aposentar({...criarJogador({nome:'Teste seleção',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'expresso',codigo:'SELECAO'}),idade:40});
 const c=iniciarCarreiraTecnico(jogador);c.tecnico={...c.tecnico,ano:2031,fase:'resultado',propostasCoerentesVersao:3,clubeInicialEscolhido:true,clube:'Bahia',liga:'brasileirao',reputacao:85,temporadas:[{ano:2030,clube:'Bahia',posicao:5,pontos:60,vitorias:18,empates:6,derrotas:14,titulosConquistados:[],torneios:[]}],propostas:[SELECOES_TECNICO.find(n=>n.nac==='POR')]};return c;
}
async function abrir(page,c){await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,((c)=>({v:1,etapa:'tecnico',c}))(c),"ajoia_rapido_v1");await page.reload();await page.getByRole('button',{name:/Continuar · Teste seleção/}).click();}
for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
 test(`oferta de seleção usa os cartões de mercado e assume vínculo exclusivo ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);const erros=[];page.on('pageerror',e=>erros.push(e.message));await abrir(page,base());
 const oferta=page.getByRole('button',{name:/Comandar seleção Portugal/});await expect(oferta).toBeVisible();await expect(oferta).toContainText('vínculo exclusivo');await oferta.click();
 await expect.poll(()=>lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c.tecnico.selecao))).toBe('POR');
 const salvo=await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c.tecnico));expect(salvo.clube).toBe('Portugal');expect(salvo.tipoEquipe).toBe('selecao');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();expect(erros).toEqual([]);
 });
 test(`título mundial antigo exibe Portugal e não Bahia ${viewport.width}`,async({page})=>{
 await page.setViewportSize(viewport);const c=base();c.tecnico.temporadas[0]={...c.tecnico.temporadas[0],titulosConquistados:['Copa do Mundo'],torneios:[{nome:'Copa do Mundo',tipo:'copaMundo',selecao:'Portugal',campeao:'Portugal',faseUsuario:'Campeão',jogosUsuario:[]}]};await abrir(page,c);
 const dialog=page.getByRole('dialog',{name:'Título conquistado'});await expect(dialog).toBeVisible();await expect(dialog.locator('.ct-event-club')).toHaveText('Portugal');
 const b=await dialog.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(viewport.width+1);await page.screenshot({path:`test-results/selecao-titulo-${viewport.width}.png`});
 });
}
test('preparação da seleção apresenta decisões de convocação, sem compras e vendas',async({page})=>{
 let c=base();c=aceitarPropostaTecnico(c,'Portugal');c=proximaTemporadaTecnico(c);await abrir(page,c);await page.getByRole('button',{name:'Começar temporada'}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog).not.toContainText('Vender por');await expect(dialog).not.toContainText('Contratar do rival');
});
