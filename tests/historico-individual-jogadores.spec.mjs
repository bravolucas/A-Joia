import {test, expect} from '@playwright/test';
import {instalarSave} from './helpers/save-browser.mjs';
import {criarJogador} from '../src/jogador/rapido.js';
import {iniciarCarreiraTecnico} from '../src/treinador/tecnico.js';
import {prepararGestaoTecnico} from '../src/treinador/mercadoTecnico.js';

const url='http://127.0.0.1:4173/A-Joia/';
test.setTimeout(90000);

for (const width of [390, 1366]) test(`histórico individual no elenco: temporadas, prêmios e transferências em ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  let c=criarJogador({nome:'Histórico Vivo',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'equilibrado',codigo:'HISTORICO-UI'});
  c.aposentado=true;c.idade=42;c.ano=2030;c=iniciarCarreiraTecnico(c);
  c.tecnico={...c.tecnico,clube:'Avaí',liga:'serieB',elenco:65,clubeInicialEscolhido:true};
  c=prepararGestaoTecnico(c);
  const atleta=c.tecnico.gestao.elenco[0],id=atleta.mundoId??atleta.id;
  const dados={
    historicoTemporadas:[[1,2029,'Avaí','serieB',21,64,68,31,7,3,7.45]],
    premiacoesIndividuais:[[1,2029,'bola-de-ouro','Avaí']],
    movimentos:[{tipo:'transferencia',ano:2029,temporada:1,de:'Figueirense',para:'Avaí',valor:null}],
  };
  c.mundo.jogadores=c.mundo.jogadores.map(j=>String(j.id)===String(id)?{...j,...dados}:j);
  c.tecnico.gestao.elenco=c.tecnico.gestao.elenco.map(j=>String(j.mundoId??j.id)===String(id)?{...j,...dados}:j);
  const erros=[];page.on('pageerror',e=>erros.push(e.message));
  await page.goto(url);
  await instalarSave(page,{v:1,etapa:'tecnico',c});
  await page.reload();
  await page.getByRole('button',{name:/Continuar · Histórico Vivo/}).click();
  await page.getByRole('button',{name:'Elenco e contratos →',exact:true}).click();
  const painel=page.getByRole('dialog',{name:'Elenco e contratos',exact:true});
  const linha=painel.locator(`tr[data-atleta="${id}"]`);
  await expect(linha).toHaveCount(1);
  await linha.getByRole('button',{name:`Ver histórico de ${atleta.nome}`,exact:true}).click();
  const historico=page.getByRole('dialog',{name:`Histórico de ${atleta.nome}`,exact:true});
  await expect(historico).toBeVisible();
  await expect(historico.getByRole('region',{name:`Temporadas de ${atleta.nome}`})).toContainText('2029');
  await expect(historico.getByRole('region',{name:`Temporadas de ${atleta.nome}`})).toContainText('7.45');
  await expect(historico).toContainText('Bola de Ouro');
  await expect(historico).toContainText('Figueirense');
  await expect(historico).toContainText('Transferência');
  await page.keyboard.press('Escape');
  await expect(historico).toHaveCount(0);
  await expect(painel).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(erros).toEqual([]);
});
