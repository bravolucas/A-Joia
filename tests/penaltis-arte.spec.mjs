import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
import {criarCampanhaCopa,decisaoCopa,escolherCopa} from '../src/treinador/copasEscolha.js';
import {escolhasCopa} from '../src/treinador/estrategiasCopas.js';
import {criarAgenda} from '../src/competicoes/calendarioCopas.js';
function base(cp){const c=iniciarCarreiraTecnico(aposentar({...criarJogador({nome:'Copa Teste',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:10,ritmo:'expresso',codigo:'COPA-ESCOLHA'}),idade:40}));c.tecnico={...c.tecnico,clube:cp.usuario,ano:cp.ano+1,fase:'resultado',clubeInicialEscolhido:true,propostasCoerentesVersao:3,elenco:cp.forcaUsuario,temporadas:[{ano:cp.ano,clube:cp.usuario,liga:'brasileirao',posicao:2,pontos:72,vitorias:22,empates:6,derrotas:10,titulosConquistados:[],torneios:[cp]}],copasEmJogo:{ano:cp.ano,clube:cp.usuario,campeonatos:[cp],indice:0}};return c;}
async function abrir(page,c){await page.goto('http://127.0.0.1:4173/A-Joia/');await page.evaluate(c=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify({v:1,etapa:'tecnico',c})),c);await page.reload();await page.getByRole('button',{name:/Continuar · Copa Teste/}).click();}

function disputa(venceu){
 for(let i=0;i<150;i++){
 const cp=criarCampanhaCopa({nome:'Copa do Brasil',tipo:'copa',usuario:'Santos',forcaUsuario:75,clubes:[{nome:'Santos',forca:75},{nome:'Flamengo',forca:75}],ano:2030,formato:'mata',seed:'ARTE-PENAL-'+i});
 const d=decisaoCopa(cp),draw=escolherCopa(cp,d.chave,'controlar');if(!draw.resultado.penaltisPendentes)continue;
 const dp=decisaoCopa(draw),op=escolhasCopa(draw,dp).opcoes[0];if(escolherCopa(draw,dp.chave,op.id).resultado.venceu===venceu)return draw;
 }throw Error('Sem fixture de disputa');
}
for(const modo of ['jogador','treinador'])for(const width of [320,1366])for(const venceu of [true,false])test(`arte de pênaltis ${modo} ${width}px ${venceu?'gol':'defesa'}`,async({page})=>{
 await page.setViewportSize({width,height:width===320?568:768});const reduzir=modo==='treinador'&&width===1366&&!venceu;if(reduzir)await page.emulateMedia({reducedMotion:'reduce'});const erros=[];page.on('pageerror',e=>erros.push(e.message));const cp=disputa(venceu);
 if(modo==='treinador')await abrir(page,base(cp));
 else{const c=criarJogador({nome:'Copa Teste',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'PENAL-ARTE'});c.clubeNome='Santos';const card={...jogarTemporada(c).card,calendarioCopas:criarAgenda([cp],{ano:cp.ano,clube:'Santos'}),titulos:[]};await page.goto('http://127.0.0.1:4173/A-Joia/');await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),{v:1,etapa:'copasClubes',c,card});await page.reload();await page.getByRole('button',{name:/Continuar · Copa Teste/}).click();}
 const d=page.getByRole('dialog',{name:'Copa em jogo · Copa do Brasil'});await expect(d.locator('[data-penalti-cena="preparacao"]')).toBeVisible();await expect(d.locator('.cce-opcoes button')).toHaveCount(3);
 // Mede os dois limites no mesmo quadro, sem misturar posições da animação de entrada.
 const limites=await d.evaluate(el=>({fim:el.querySelector('.cce-opcoes button:last-child').getBoundingClientRect().bottom,corpo:el.querySelector('.cce-corpo').getBoundingClientRect().bottom}));expect(limites.fim).toBeLessThanOrEqual(limites.corpo+1);
 await expect(d.locator('.cce-penalti-quadro image').first()).toHaveAttribute('clip-path',/url\(#/);const href=await d.locator('.cce-penalti-quadro image').first().getAttribute('href');expect(await page.evaluate(src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im.naturalWidth);im.onerror=reject;im.src=src;}),href)).toBe(1536);
 await page.screenshot({path:`test-results/penaltis-escolha-${modo}-${width}.png`});await d.locator('.cce-opcoes button').first().click();if(!reduzir){await expect(d.locator('.cce-cinematica [data-penalti-cena="cobranca"]')).toBeVisible();await expect(d.locator('.cce-cinematica .cce-revelacao')).toContainText('%');}else await expect(d.locator('.cce-cinematica')).toHaveCount(0);await expect(d.getByRole('status')).toBeVisible();await expect(d.locator(`[data-penalti-cena="${venceu?'gol':'defesa'}"]`)).toBeVisible();await expect(d.locator('.cce-rodape button')).toBeInViewport();await expect(d.locator('.cce-resultado h3')).toBeInViewport();const titulo=await d.locator('.cce-resultado h3').boundingBox(),painel=await d.locator('.cce-corpo').boundingBox();expect(titulo.y+titulo.height).toBeLessThanOrEqual(painel.y+painel.height+1);await page.screenshot({path:`test-results/penaltis-resultado-${modo}-${width}-${venceu}.png`});await page.reload();await page.getByRole('button',{name:/Continuar · Copa Teste/}).click();await expect(d.locator(`[data-penalti-cena="${venceu?'gol':'defesa'}"]`)).toBeVisible();expect(erros).toEqual([]);
});
