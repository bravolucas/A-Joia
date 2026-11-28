import {instalarSave,lerSave} from './helpers/save-browser.mjs';
import { test, expect } from '@playwright/test';
import { criarJogador, aposentar } from '../src/jogador/rapido.js';
import { iniciarCarreiraTecnico } from '../src/treinador/tecnico.js';
test.setTimeout(120000);
test.beforeEach(async({page})=>{await page.addInitScript(()=>localStorage.setItem('a-joia:pular-sorteios','1'));});

function carreira(){
 const jogador=aposentar({...criarJogador({nome:'Treinador do calendário',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'equilibrado',codigo:'CALENDARIO-TECNICO'}),idade:40});
 const c=iniciarCarreiraTecnico(jogador);
 c.tecnico={...c.tecnico,propostasCoerentesVersao:3,clube:'Flamengo',pais:'Brasil',liga:'brasileirao',reputacao:90,diretoria:95,torcida:85,clubeInicialEscolhido:true};
 return c;
}
const salvo=page=>lerSave(page,'ajoia_rapido_v1').then(s=>s.c);
async function esperar(page){await page.locator('.ct-simulating').waitFor({state:'detached',timeout:20000});}

for(const width of [390,1366])test(`calendário da temporada: jogar, pular, ir para um dia e fim em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto('http://127.0.0.1:4173/A-Joia/');
 await instalarSave(page,{v:1,etapa:'tecnico',c:carreira()},'ajoia_rapido_v1');
 await page.reload();
 await page.getByRole('button',{name:/Continuar · Treinador do calendário/}).click();
 await page.getByRole('button',{name:'Começar temporada',exact:true}).click();
 const cal=page.getByRole('region',{name:'Calendário da temporada'});
 await expect(cal).toBeVisible();await esperar(page);
 expect((await salvo(page)).tecnico.fase).toBe('calendario');
 const largura=await page.evaluate(()=>document.documentElement.scrollWidth);expect(largura).toBeLessThanOrEqual(width);
 await page.screenshot({path:`/tmp/calendario-tecnico-${width}.png`,fullPage:true});

 // Pular a próxima partida joga um único compromisso.
 await cal.getByRole('button',{name:/Pular próxima partida|Avançar a rodada/}).click();await esperar(page);
 expect((await salvo(page)).tecnico.calendarioRecentes.length).toBe(1);

 // Ir para um dia mais à frente: simula sem paradas e volta no dia escolhido.
 const dias=cal.getByRole('button',{name:/^Simular até /});
 await dias.nth(4).click();await esperar(page);
 const meio=await salvo(page);expect(meio.tecnico.fase).toBe('calendario');expect(meio.tecnico.calendarioRecentes.length).toBeGreaterThan(2);

 // Jogar com estratégia na liga (ou abrir a copa, quando ela vem antes).
 for(let i=0;i<6;i++){
  const estrategia=cal.getByRole('button',{name:/Buscar a vitória/});
  if(await estrategia.count()){await estrategia.click();await esperar(page);break;}
  await cal.getByRole('button',{name:/Jogar e escolher a estratégia|Ver resultado e continuar/}).click();
  const copa=page.getByRole('dialog',{name:/Copa em jogo ·/});await expect(copa).toBeVisible();
  const seguir=copa.getByRole('button',{name:/Continuar campanha|Concluir campanha|Ir para jogo de volta/});
  if(!(await seguir.count()))await copa.locator('.cce-opcoes button').first().click();
  await copa.getByRole('button',{name:/Continuar campanha|Concluir campanha|Ir para jogo de volta/}).click();
  await expect(copa).toHaveCount(0);
 }
 await page.screenshot({path:`/tmp/calendario-tecnico-meio-${width}.png`,fullPage:true});

 await cal.getByRole('button',{name:/Simular até o fim da temporada/}).click();await esperar(page);
 await expect.poll(async()=>(await salvo(page)).tecnico.temporadas.length).toBe(1);
 const fim=await salvo(page);expect(fim.tecnico.fase).toBe('resultado');expect(fim.tecnico.temporadas[0].jogos).toBe(38);
});

for(const width of [390,1366])test(`calendário do jogador: liga rodada a rodada entre as copas em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 const erros=[];page.on('pageerror',e=>erros.push(e.message));
 const c=criarJogador({nome:'Atleta do calendário',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,codigo:'CAL-ATLETA-UI'});c.clubeNome='Flamengo';c.flags.baseEscolhida=true;c.desafioAno=c.ano;
 await page.goto('http://127.0.0.1:4173/A-Joia/');
 await instalarSave(page,{v:1,etapa:'evento',c,auto:false},'ajoia_rapido_v1');await page.reload();
 await page.getByRole('button',{name:/Continuar · Atleta do calendário/}).click();await page.locator('.tp-carta').first().click();
 const cal=page.getByRole('region',{name:'Calendário da temporada'});
 for(let i=0;i<40;i++){
  await page.waitForTimeout(500);const d=page.getByRole('dialog');
  if(await d.count()){const seguir=d.getByRole('button',{name:/Continuar campanha|Concluir campanha|Ir para jogo de volta|Continuar temporada/});if(await seguir.count())await seguir.click();else if(await d.locator('.cce-opcoes button').count())await d.locator('.cce-opcoes button').first().click();else await d.getByRole('button',{name:'Fechar janela'}).click();continue;}
  if(await cal.getByRole('button',{name:/Buscar a vitória/}).count())break;
  await cal.getByRole('button',{name:/Pular próxima partida/}).click();
 }
 await expect(cal.getByRole('button',{name:/Buscar a vitória/})).toBeVisible();
 const antes=(await lerSave(page,'ajoia_rapido_v1')).card;
 await cal.getByRole('button',{name:/Buscar a vitória/}).click();
 await expect.poll(async()=>(await lerSave(page,'ajoia_rapido_v1')).card.ligaPropria.indice).toBe(antes.ligaPropria.indice+1);
 const depois=(await lerSave(page,'ajoia_rapido_v1')).card;expect(depois.calendarioRecentes[0].estrategia).toBe('atacar');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`/tmp/calendario-jogador-${width}.png`,fullPage:true});
 expect(erros).toEqual([]);
});
