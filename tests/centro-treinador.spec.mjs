import {test,expect} from '@playwright/test';
import {instalarSave,lerSave} from './helpers/save-browser.mjs';
import {criarJogador,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
import {criarGestaoTecnico} from '../src/treinador/mercadoTecnico.js';
test.setTimeout(90000);
function carreira(){
 const c=iniciarCarreiraTecnico(aposentar({...criarJogador({nome:'Central moderna',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'equilibrado',codigo:'CENTRAL-MODERNA'}),idade:40}));
 const t=c.tecnico,ano=t.ano;
 Object.assign(t,{clube:'Santos',pais:'Brasil',liga:'brasileirao',clubeInicialEscolhido:true,propostasCoerentesVersao:3,fase:'pretemporada',opcoesInicio:[],propostas:[],diretoria:80,torcida:75,moral:70,temporadas:[{ano:ano-1,clube:'Santos',liga:'brasileirao',posicao:8,pontos:50,vitorias:1,empates:1,derrotas:0,titulosConquistados:[],confrontos:[{nome:'Flamengo',casa:true,golsPro:2,golsContra:1,resultado:'V'},{nome:'Palmeiras',casa:false,golsPro:1,golsContra:1,resultado:'E'}],torneios:[{nome:'Copa do Brasil',tipo:'copaNacional',ano:ano-1,faseUsuario:'Semifinal',jogosUsuario:[{casa:'Santos',fora:'Cruzeiro',golsCasa:1,golsFora:2}]}]}]});
 t.temporadas[0].confrontos[0].escalacao={versao:1,clube:'Santos',formacao:'4-3-3',
  titulares:Array.from({length:11},(_,i)=>({vaga:i===0?'GOL':i===10?'ATA':'MC',
    jogador:{id:'historico-'+i,nome:'Titular histórico '+i,posicao:i===0?'GOL':'MC',ovr:70+i}})),
  banco:[{id:'reserva-historico',nome:'Reserva histórico',posicao:'GOL',ovr:64}],vagasAbertas:0};
 t.gestao=criarGestaoTecnico(t,()=>.4,c);
 t.universo={versao:1,anos:[ano-2,ano-1],competicoes:{},atletas:{a:{id:'a',nome:'Pedro Arquivado',posicao:'ATA',nac:'BRA',historico:[[ano-1,'Santos',30,12,7,null,null,[]],[ano-2,'Santos',25,8,4,null,null,[]]]},g:{id:'g',nome:'Carlos Goleiro',posicao:'GOL',nac:'BRA',historico:[[ano-1,'Santos',35,0,1,140,12,[]]]}}};
 return c;
}
async function abrir(page,c){await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,{v:1,etapa:'tecnico',c});await page.reload();await page.getByRole('button',{name:/Continuar · Central moderna/}).click();await expect(page.getByRole('heading',{name:'Central moderna',exact:true})).toBeVisible();}
for(const width of [320,390,768,1366])test(`central moderna: consultas, imagens e navegação sem alterar save em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});const erros=[];page.on('pageerror',e=>erros.push(e.message));const c=carreira();await abrir(page,c);const antes=await lerSave(page),nav=page.getByRole('navigation',{name:'Áreas do treinador'});
 await expect(page.locator('.ctm-hero-image')).toBeVisible();await expect.poll(()=>page.locator('.ctm-hero-image').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 await page.screenshot({path:`/tmp/central-geral-${width}.png`,fullPage:true});
 for(const nome of ['Elenco','Calendário','Competições','Estatísticas','Carreira','Clube','Visão geral']){
  await nav.getByRole('button',{name:nome,exact:true}).click();await expect(nav.getByRole('button',{name:nome,exact:true})).toHaveAttribute('aria-current','page');
  await expect(page.locator('.ctm-page-heading h1')).toBeInViewport();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(nome==='Elenco'){await expect(page.getByRole('button',{name:'Contratos e mercado'})).toBeVisible();await page.getByLabel('Buscar no elenco').fill('NOME-INEXISTENTE');await expect(page.getByText('Nenhum jogador encontrado.')).toBeVisible();await page.getByLabel('Buscar no elenco').fill('Consulta do elenco');await page.locator('.ct-footer').scrollIntoViewIfNeeded();}
  if(nome==='Calendário'){await expect(page.getByRole('table')).toContainText('Flamengo');await expect(page.getByRole('table')).toContainText('Palmeiras');const historico=page.locator('.ctm-match-lineup');await expect(historico).toHaveCount(1);await historico.locator('summary').click();await expect(historico).toContainText('Titular histórico 10');await expect(historico).toContainText('Reserva histórico');}
  if(nome==='Competições'){await page.getByRole('button',{name:/Copa do Brasil.*Semifinal/}).click();const modal=page.getByRole('dialog',{name:'Campanha · Copa do Brasil'});await expect(modal).toContainText('Cruzeiro');await modal.getByRole('button',{name:'Fechar janela'}).click();}
  if(nome==='Estatísticas'){await expect(page.getByRole('table')).toContainText('Pedro Arquivado');await expect(page.getByRole('table')).toContainText('140');await page.getByLabel('Temporada das estatísticas').selectOption(String(c.tecnico.ano-2));await expect(page.getByRole('table')).not.toContainText('Carlos Goleiro');await page.screenshot({path:`/tmp/central-estatisticas-${width}.png`,fullPage:true});}
 }
 expect(await lerSave(page)).toEqual(antes);expect(erros).toEqual([]);
 await nav.getByRole('button',{name:'Elenco',exact:true}).click();await page.getByRole('button',{name:'Contratos e mercado'}).click();await expect(page.getByRole('dialog',{name:/Elenco e contratos/})).toBeVisible();
});
test('seleção diferencia atletas da nacionalidade de convocação e números do clube',async({page})=>{
 const c=carreira();Object.assign(c.tecnico,{tipoEquipe:'selecao',clube:'Brasil',nac:'BRA',gestao:null});await abrir(page,c);const nav=page.getByRole('navigation',{name:'Áreas do treinador'});await nav.getByRole('button',{name:'Jogadores',exact:true}).click();await expect(page.getByRole('heading',{name:'Jogadores de Brasil'})).toBeVisible();await expect(page.getByRole('button',{name:'Contratos e mercado'})).toHaveCount(0);await nav.getByRole('button',{name:'Estatísticas',exact:true}).click();await expect(page.getByText('Estatísticas nos clubes dos atletas da nacionalidade da seleção.')).toBeVisible();await expect(page.getByRole('columnheader',{name:'Clube na temporada'})).toBeVisible();await expect(page.getByRole('table')).toContainText('Santos');
});
