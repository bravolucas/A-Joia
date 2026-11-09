import {test,expect} from '@playwright/test';
import { criarJogador,jogarTemporada } from '../src/jogador/rapido.js';
const base='http://127.0.0.1:4173/A-Joia/';
async function abrir(page,mini){
 const c=criarJogador({nome:'Visual Teste',nac:'BRA',posicao:mini==='defesa'?'GOL':'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'VISUAL-TESTE'});
 const {card}=jogarTemporada(c);
 card.pendente={tipo:'copa',nome:'Copa do Brasil',mini,titulo:'A decisão está nos seus pés',texto:'Final de campeonato · lance decisivo',ordem:1,total:1};card.filaMomentos=[card.pendente];
 await page.goto(base);
 await page.evaluate(estado=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(estado)),{v:1,etapa:'momento',c,card});
 await page.reload();await page.getByRole('button',{name:/Continuar · Visual Teste/}).click();
 await expect(page.getByText('A decisão está nos seus pés',{exact:true})).toBeVisible();
}
for(const width of [390,1366])for(const mini of ['penalti','defesa','falta','passe'])test(`${mini}: imagem, controles e resultado em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:640});const erros=[];const recursos=[];
 page.on('pageerror',e=>erros.push(e.message));page.on('response',r=>{if(r.url().includes('/assets/')&&r.status()>=400)recursos.push(r.url())});
 await abrir(page,mini);
 await expect(page.locator('.vf-matchbar')).toBeVisible();
 await expect(page.locator('.vf-confronto .vf-match-club strong')).toHaveCount(2);
 await expect(page.locator('.vf-adversario strong')).not.toBeEmpty();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(['penalti','defesa'].includes(mini))await expect(page.locator('.dj-campo')).toBeVisible();else{const imagens=page.locator('.vf-cena image');expect(await imagens.count()).toBeGreaterThan(0);}
 await page.screenshot({path:`/tmp/ajoia-visual-${mini}-${width}.png`,fullPage:true});
 if(mini==='penalti'||mini==='defesa'){
  const alvo=page.locator('.dj-escolhas button').first();await alvo.focus();await page.keyboard.press('Enter');
  await expect(page.locator('.dj-resultado')).toBeVisible();
 }else if(mini==='falta'){
  const b=page.getByRole('button',{name:'Canto esq.',exact:true});expect((await b.boundingBox()).height).toBeGreaterThanOrEqual(44);await b.click();
  await expect(page.getByText(/GOLAÇO DE FALTA!|NA BARREIRA!|NA TRAVE!|DEFENDEU!|PRA FORA!/)).toBeVisible();
 }else{
  const b=page.getByRole('button',{name:/Passar para companheiro/}).first();expect((await b.boundingBox()).width).toBeGreaterThanOrEqual(44);await page.getByRole('button',{name:'Passar para companheiro 1',exact:true}).click();
  await expect(page.getByText(/ASSISTÊNCIA! GOL!|INTERCEPTADO!/)).toBeVisible();
 }
 const continuar=['penalti','defesa'].includes(mini)?page.locator('.dj-continuar'):page.getByRole('button',{name:'Continuar →',exact:true});await expect(continuar).toBeVisible();const box=await continuar.boundingBox();expect(box.y+box.height).toBeLessThanOrEqual(page.viewportSize().height);
 expect(erros).toEqual([]);expect(recursos).toEqual([]);
});

test('fontes locais carregam e o escudo de Kasımpaşa não usa um substituto',async({page})=>{
 await abrir(page,'penalti');
 expect(await page.evaluate(async()=>{await document.fonts.load('700 16px Inter');return document.fonts.check('700 16px Inter')})).toBe(true);
 // O contrato da busca de escudos é exercitado na aplicação em vez de copiar sua implementação.
 await page.getByRole('button',{name:'Voltar ao menu',exact:true}).click();
 await page.getByRole('button',{name:/Meu museu/}).click();await page.getByRole('tab',{name:/Camisas/}).click();
 await page.getByRole('searchbox').fill('Kasımpaşa');await page.getByRole('button',{name:'Kasımpaşa, bloqueado',exact:true}).click();
 const escudo=page.getByRole('dialog').locator('.vf-escudo-camisa');await expect(escudo).toHaveAttribute('href',/kas-mpasa/);
});

test('animação de título carrega e reage à preferência de movimento reduzido',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 const c=criarJogador({nome:'Visual Efeito',nac:'BRA',posicao:'ATA',personalidade:'equilibrado',origem:'base',pe:'destro',numero:10,ritmo:'normal',codigo:'EFEITO'});
 c.aposentado=true;c.idade=40;
 const {iniciarCarreiraTecnico}=await import('../src/treinador/tecnico.js');const carreira=iniciarCarreiraTecnico(c);
 carreira.tecnico={...carreira.tecnico,fase:'resultado',clubeInicialEscolhido:true,temporadas:[{ano:2026,clube:'Santos',liga:'brasileirao',posicao:1,pontos:80,vitorias:24,empates:8,derrotas:6,titulosConquistados:['Brasileirão'],campeao:true}],propostas:[]};
 const erros=[];page.on('pageerror',e=>erros.push(e.message));
 await page.goto(base);await page.evaluate(c=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify({v:1,etapa:'tecnico',c})),carreira);
 await page.reload();await page.getByRole('button',{name:/Continuar · Visual Efeito/}).click();
 const janela=page.getByRole('dialog',{name:'Título conquistado'});
 await expect(janela.locator('.ct-champion-cup > div svg')).toBeVisible();
 const centro=async()=>{const palco=await janela.locator('.ct-champion-cup').boundingBox(),taca=await janela.locator('.ct-champion-cup > img, .ct-champion-cup > .vf-cup-stage').boundingBox();return Math.abs(palco.x+palco.width/2-taca.x-taca.width/2);};
 await expect.poll(centro).toBeLessThan(2);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(janela.locator('.ct-champion-cup > div svg')).toHaveCount(0);
 await expect.poll(centro).toBeLessThan(2);
 await expect(janela.getByRole('heading',{name:'CAMPEÃO!'})).toBeVisible();
 expect(erros).toEqual([]);
});
