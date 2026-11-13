import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import {test,expect} from '@playwright/test';
import {criarJogador,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
import {simularAnoSelecaoTecnico} from '../src/treinador/selecoesTecnico.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';
function carreira(){let c=iniciarCarreiraTecnico(aposentar({...criarJogador({nome:'Mundial do treinador',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'MUNDIAL-UI'}),idade:40}));c.tecnico={...c.tecnico,ano:2030,clube:'Brasil',selecao:'BRA',tipoEquipe:'selecao',liga:'selecao:CONMEBOL',elenco:90,reputacao:85,clubeInicialEscolhido:true,decisoes:[],classificacaoSelecao:{nac:'BRA',copa:2030,classificado:true}};const r=simularAnoSelecaoTecnico(c.tecnico,85,95,geradorTecnico('copa'),{interativo:true,copasInterativas:true});c.tecnico={...c.tecnico,...r};return c;}
for(const width of [320,1366])test(`Copa do Mundo do treinador tem decisões e retoma o resultado em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:844});await page.emulateMedia({reducedMotion:'reduce'});const erros=[];page.on('pageerror',e=>erros.push(e.message));
 await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,((c)=>({v:1,etapa:'tecnico',c}))(carreira()),"ajoia_rapido_v1");await page.reload();await page.getByRole('button',{name:/Continuar · Mundial do treinador/}).click();
 const d=page.getByRole('dialog',{name:'Copa em jogo · Copa do Mundo',exact:true});await expect(d).toBeVisible();await expect(d).toContainText('jogo 1/3');await expect(d.locator('.cce-confronto')).toContainText('Brasil');
 await d.locator('.cce-opcoes button').first().click();await expect(d.getByRole('status')).toBeVisible();const antes=await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c.tecnico.copasEmJogo.campeonatos[0].jogosUsuario));expect(antes).toHaveLength(1);
 await page.reload();await page.getByRole('button',{name:/Continuar · Mundial do treinador/}).click();await expect(d.getByRole('status')).toBeVisible();expect(await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c.tecnico.copasEmJogo.campeonatos[0].jogosUsuario))).toEqual(antes);
 await d.getByRole('button',{name:/Continuar/}).click();await expect(d).toContainText('jogo 2/3');expect(await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.c.tecnico.temporadas.at(-1).clube))).toBe('Brasil');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(erros).toEqual([]);
 await page.screenshot({path:`/tmp/mundial-treinador-${width}.png`,animations:'disabled'});
});
