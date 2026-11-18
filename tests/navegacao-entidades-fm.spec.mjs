import {test,expect} from '@playwright/test';
import {instalarSave} from './helpers/save-browser.mjs';
import {criarJogador,aposentar} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';

function carreiraFixture(){
 const jogador=aposentar({...criarJogador({
  nome:'Navegador FM',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',
  origem:'base',pe:'destro',numero:10,ritmo:'equilibrado',
  codigo:'NAVEGACAO-FM-TESTE'
 }),idade:40});
 const c=iniciarCarreiraTecnico(jogador);
 c.lista=[...(c.lista||[]),{ano:c.ano,nome:'Bola de Ouro',clube:'Individual',tipo:'bolaOuro'}];
 c.tecnico={...c.tecnico,clube:'Santos',pais:'Brasil',liga:'brasileirao',
  fase:'resultado',clubeInicialEscolhido:true,
  temporadas:[{ano:c.tecnico.ano,clube:'Santos',liga:'brasileirao',
   posicao:7,pontos:52,vitorias:14,empates:10,derrotas:14,
   titulosConquistados:[]}]};
 return c;
}

test('navegar entre clube, competição e jogador sem perder o retorno à carreira',async({page})=>{
 test.setTimeout(90000);
 const erros=[];
 page.on('pageerror',e=>erros.push(e.message));
 await page.goto('http://127.0.0.1:4173/A-Joia/',{waitUntil:'domcontentloaded'});
 await instalarSave(page,{v:1,etapa:'tecnico',c:carreiraFixture()});
 await page.reload();
 await page.getByRole('button',{name:/Continuar · Navegador FM/}).click();
 const linkClube=page.locator('.ctm-sidebar-club .ajoia-entity-link');
 await expect(linkClube).toHaveText('Santos');
 await linkClube.click();
 const historia=page.getByRole('dialog',{name:'História do futebol'});
 await expect(historia).toBeVisible();
 await expect(historia.locator('.hf-galeria .hf-identidade h2')).toContainText('Santos');
 await historia.getByRole('button',{name:'Competições',exact:true}).click();
 await expect(historia.locator('.hf-competicoes')).toBeVisible();
 await historia.getByRole('button',{name:'← Voltar'}).click();
 await expect(historia.locator('.hf-galeria .hf-identidade h2')).toContainText('Santos');
 await historia.getByRole('button',{name:'Seleções',exact:true}).click();
 await expect(historia.locator('.hf-selecoes')).toBeVisible();
 await historia.getByRole('combobox',{name:'Selecionar seleção'}).selectOption('Brasil');
 await expect(historia.locator('.hf-selecoes')).toContainText('Copa do Mundo');
 await expect(historia.locator('.hf-selecoes')).toContainText('1958');
 await historia.locator('.hf-selecoes .hf-taca .ajoia-entity-link').filter({hasText:'Copa do Mundo'}).first().click();
 await expect(historia.locator('.hf-competicoes')).toContainText('Espanha');
 await expect(historia.locator('.hf-competicoes')).toContainText('2026');
 await historia.getByRole('button',{name:'← Voltar'}).click();
 await expect(historia.locator('.hf-selecoes')).toContainText('Brasil');
 await historia.getByRole('button',{name:'Treinadores',exact:true}).click();
 await expect(historia.getByRole('heading',{name:'Passagens pelos clubes'})).toBeVisible();
 await expect(historia.locator('.fm27-coach-profile .fm27-data')).toContainText('Santos');
 await historia.getByRole('button',{name:'Prêmios',exact:true}).click();
 await expect(historia.locator('.hf-premios')).toContainText('Navegador FM');
 await historia.locator('.hf-premios .ajoia-entity-link').filter({hasText:'Navegador FM'}).first().click();
 await expect(historia.locator('.fm27-player-sheet')).toContainText('Navegador FM');
 await historia.getByRole('button',{name:'Jogadores',exact:true}).click();
 await expect(historia.locator('.fm27-player-sheet')).toContainText('Navegador FM');
 await expect(historia.getByRole('button',{name:'Carreira',exact:true})).toBeVisible();
 await historia.getByRole('button',{name:'Carreira',exact:true}).click();
 await expect(historia.locator('.fm27-player-body')).toContainText('Carreira por temporada');
 await historia.getByRole('button',{name:'Fechar história'}).click();
 await expect(historia).toHaveCount(0);
 await expect(page.locator('.ctm-sidebar-club')).toBeVisible();
 expect(erros).toEqual([]);
});
