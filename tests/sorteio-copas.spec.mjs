import {instalarSave} from './helpers/save-browser.mjs';
import {test,expect} from '@playwright/test';
import {criarJogador,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
import {criarCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {clubesParaCopas} from '../src/competicoes/regrasCopasRapidas.js';
import {ampliarParticipantesInternacionais} from '../src/competicoes/clubesInternacionais.js';
test.setTimeout(90000);

function base(cp){const c=iniciarCarreiraTecnico(aposentar({...criarJogador({nome:'Sorteio Teste',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:10,ritmo:'expresso',codigo:'SORTEIO'}),idade:40}));c.tecnico={...c.tecnico,clube:cp.usuario,ano:cp.ano+1,fase:'resultado',clubeInicialEscolhido:true,propostasCoerentesVersao:3,elenco:cp.forcaUsuario,temporadas:[{ano:cp.ano,clube:cp.usuario,liga:'brasileirao',posicao:2,pontos:72,vitorias:22,empates:6,derrotas:10,titulosConquistados:[],torneios:[cp]}],copasEmJogo:{ano:cp.ano,clube:cp.usuario,campeonatos:[cp],indice:0}};return c;}
async function abrir(page,c){await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,{v:1,etapa:'tecnico',c},'ajoia_rapido_v1');await page.reload();await page.getByRole('button',{name:/Continuar · Sorteio Teste/}).click();}
const sul=ampliarParticipantesInternacionais(clubesParaCopas().filter(c=>['brasileirao','argentina','sulamericano'].includes(c.liga)),'libertadores',2030,clubesParaCopas());

for(const [width,height] of [[360,740],[1366,768]])test(`sorteio da Libertadores anima potes e grupos, pode ser pulado e não volta a aparecer (${width}px)`,async({page})=>{
 await page.setViewportSize({width,height});
 const cp=criarCampanhaCopa({nome:'Libertadores',usuario:'Flamengo',forcaUsuario:86,clubes:sul,ano:2030,formato:'grupos',seed:'spec-sorteio'});
 await abrir(page,base(cp));
 const dialog=page.getByRole('dialog',{name:'Copa em jogo · Libertadores'});
 const sorteio=dialog.getByRole('region',{name:'Sorteio da fase de grupos'});
 await expect(sorteio).toBeVisible();
 await expect(sorteio.locator('.sct-grupo')).toHaveCount(8);
 await expect(sorteio.locator('.sct-meu')).toContainText('Flamengo');
 await expect(dialog.locator('.cce-opcoes')).toHaveCount(0);
 await sorteio.getByRole('button',{name:'Pular sorteio'}).click();
 await expect(sorteio.locator('.sct-vazio')).toHaveCount(0);
 const largura=await page.evaluate(()=>document.documentElement.scrollWidth);expect(largura).toBeLessThanOrEqual(width);
 await page.screenshot({path:`test-results/sorteio-grupos-${width}.png`});
 await sorteio.getByRole('button',{name:'Continuar'}).click();
 await expect(dialog.locator('.cce-opcoes button')).toHaveCount(3);
 await page.reload();await page.getByRole('button',{name:/Continuar · Sorteio Teste/}).click();
 await expect(page.getByRole('dialog',{name:'Copa em jogo · Libertadores'}).locator('.cce-opcoes button')).toHaveCount(3);
});

test('sorteio da fase de liga mostra os oito adversários por pote',async({page})=>{
 const pool=ampliarParticipantesInternacionais(clubesParaCopas().filter(c=>['inglaterra','espanha','italia','alemanha','franca','portugal','holanda','turquia'].includes(c.liga)),'champions',2030,clubesParaCopas());
 const cp=criarCampanhaCopa({nome:'Champions League',usuario:'Real Madrid',forcaUsuario:91,clubes:pool,ano:2030,formato:'liga',seed:'spec-liga'});
 await abrir(page,base(cp));
 const sorteio=page.getByRole('region',{name:'Sorteio da fase de liga'});
 await expect(sorteio.locator('.sct-adversarios li')).toHaveCount(8,{timeout:15000});
 await expect(sorteio.getByRole('button',{name:'Continuar'})).toBeEnabled();
 for(const pote of [1,2,3,4])await expect(sorteio.locator('.sct-adversarios small',{hasText:`Pote ${pote}`})).toHaveCount(2);
});
