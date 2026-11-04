import {test,expect} from '@playwright/test';
import {criarJogador} from '../rapido.js';
for(const width of [390,1366]){
 test(`desafios: tentativa, recarga e saves independentes em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/A-Joia/');
  await expect(page.getByRole('button',{name:/^Desafios históricos/})).toBeVisible();
  const c=criarJogador({nome:'Carreira preservada',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,codigo:'DESAFIOS'});
  await page.evaluate(c=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify({v:1,etapa:'painel',c})),c);
  await page.getByRole('button',{name:/^Desafios históricos/}).click();
  const originais=await page.evaluate(()=>({carreira:localStorage.getItem('ajoia_rapido_v1'),museu:localStorage.getItem('ajoia_museu_v1')}));
  await page.getByRole('button',{name:'Iniciar A força dos meninos'}).click();
  await page.getByLabel('Estilo',{exact:true}).selectOption('defensivo');
  await page.reload();await page.getByRole('button',{name:/^Desafios históricos/}).click();
  await page.getByRole('button',{name:'Continuar desafio'}).click();
  await expect(page.getByLabel('Estilo',{exact:true})).toHaveValue('defensivo');
  const museuAntes=await page.evaluate(()=>localStorage.getItem('ajoia_museu_v1'));
  await page.getByRole('button',{name:/Tomar decisão e simular|Simular temporada/}).click();
  const decisao=page.getByRole('dialog',{name:'Decisão de carreira'});
  if(await decisao.count())await decisao.locator('.ct-decisions button').first().click();
  const resultado=page.getByRole('region',{name:'Resultado do desafio'});await expect(resultado).toBeVisible();
  const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_desafios_v1')));
  expect(salvo.ativo.contabilizado).toBe(true);expect(salvo.ativo.c.tecnico.temporadas.length).toBe(1);expect(salvo.tentativas['santos-2002']).toBe(1);
  expect(await page.evaluate(()=>localStorage.getItem('ajoia_rapido_v1'))).toBe(originais.carreira);
  expect(await page.evaluate(()=>localStorage.getItem('ajoia_museu_v1'))).toBe(museuAntes);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/desafios-${width}.png`,fullPage:true});
  await resultado.getByRole('button',{name:'Ver desafios'}).click();
  await expect(page.getByRole('button',{name:'Iniciar A zebra inglesa'})).toBeEnabled();
  await page.reload();await page.getByRole('button',{name:/^Desafios históricos/}).click();
  await page.getByRole('button',{name:'Ver último resultado'}).click();
  await expect(page.getByRole('region',{name:'Resultado do desafio'})).toBeVisible();
 });
}

for(const width of [390,1366]){
 test(`desafio com intervenção: cancelar encerramento e retomar em ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.getByRole('button',{name:/^Desafios históricos/}).click();
  await page.getByRole('button',{name:'Iniciar A zebra inglesa'}).click();
  await page.getByRole('checkbox',{name:'Acompanhar jogo importante'}).check();
  await page.getByRole('button',{name:/Tomar decisão e simular|Simular temporada/}).click();
  const decisao=page.getByRole('dialog',{name:'Decisão de carreira'});
  if(await decisao.count())await decisao.locator('.ct-decisions button').first().click();
  await expect(page.getByRole('heading',{name:'Jogo importante',exact:true})).toBeVisible();
  const ler=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_desafios_v1')));
  const pausado=await ler();expect(pausado.ativo.c.tecnico.fase).toBe('intervencao');
  await page.getByRole('button',{name:'← Voltar aos desafios',exact:true}).click();
  await page.getByRole('button',{name:'Encerrar tentativa',exact:true}).click();
  await page.getByRole('group',{name:'Encerrar tentativa'}).getByRole('button',{name:'Cancelar encerramento'}).click();
  expect(await ler()).toEqual(pausado);
  await page.reload();await page.getByRole('button',{name:/^Desafios históricos/}).click();
  await page.getByRole('button',{name:'Continuar desafio'}).click();
  await expect(page.getByRole('heading',{name:'Jogo importante',exact:true})).toBeVisible();
  expect((await ler()).ativo.c.tecnico.temporadaPausada).toEqual(pausado.ativo.c.tecnico.temporadaPausada);
  await page.getByRole('button',{name:/Proteger a equipe/}).click();
  await expect(page.getByRole('region',{name:'Resultado do desafio'})).toBeVisible();
  const fim=await ler(),jogos=fim.ativo.c.tecnico.temporadas[0].confrontos;
  expect(fim.tentativas['leicester-2016']).toBe(1);expect(fim.ativo.contabilizado).toBe(true);
  expect(jogos.slice(0,pausado.ativo.c.tecnico.temporadaPausada.indice)).toEqual(pausado.ativo.c.tecnico.temporadaPausada.confrontos);
  expect(jogos.filter(j=>j.intervencao).length).toBe(1);expect(jogos.find(j=>j.intervencao).estilo).toBe('defensivo');
  await page.getByRole('button',{name:'Ver desafios',exact:true}).click();
  await page.getByRole('button',{name:'Iniciar Rubro-negro no topo'}).click();
  await page.getByRole('button',{name:'← Voltar aos desafios',exact:true}).click();
  await page.getByRole('button',{name:'Encerrar tentativa',exact:true}).click();
  await page.getByRole('button',{name:'Confirmar encerramento',exact:true}).click();
  const encerrado=await ler();expect(encerrado.ativo).toBe(null);expect(encerrado.concluidos).toEqual(fim.concluidos);
  expect(encerrado.tentativas['flamengo-2019']).toBe(1);
  await expect(page.getByRole('button',{name:'Iniciar A força dos meninos'})).toBeEnabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
