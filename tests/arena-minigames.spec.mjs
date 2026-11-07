import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada} from '../src/jogador/rapido.js';

async function abrir(page,mini){
  const c=criarJogador({nome:'Arena Visual',nac:'BRA',posicao:['defesa','reflexo'].includes(mini)?'GOL':'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,ritmo:'normal',codigo:`ARENA-${mini}`});
  const {card}=jogarTemporada(c);
  card.pendente={tipo:'copa',nome:'Copa do Brasil',mini,titulo:'A decisão está nos seus pés',texto:'Final',ordem:1,total:1};card.filaMomentos=[];
  await page.goto('http://127.0.0.1:4173/A-Joia/');
  await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),{v:1,etapa:'momento',c,card});
  await page.reload();await page.getByRole('button',{name:/Continuar · Arena Visual/}).click();
}

for(const [width,height] of [[320,568],[1366,768]])for(const mini of ['penalti','defesa','falta','passe','cruzamento','interceptacao','cabeceio','reflexo']){
  test(`${mini}: campo, alvos e continuar cabem em ${width}×${height}`,async({page})=>{
    await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
    await abrir(page,mini);
    const quadro=page.locator('.arena-quadro');const palco=quadro.locator('.vf-cena,.lc-gramado');
    const antes=await palco.boundingBox();expect(antes.height).toBeGreaterThan(130);
    const gol=quadro.locator('.arena-gol');
    if(await gol.count()){
      const trave=await gol.boundingBox(),grama=await quadro.locator('.arena-gramado').boundingBox();
      expect(trave.y+trave.height).toBeGreaterThan(grama.y);
      expect(trave.y+trave.height).toBeLessThanOrEqual(grama.y+grama.height+1);
    }
    const coordenadas=quadro.locator('.arena-coordenadas');
    if(await coordenadas.count()){
      const limites=await coordenadas.boundingBox(),suporte=await quadro.locator('.vf-superficie').boundingBox();
      expect(limites.width).toBeLessThanOrEqual(suporte.width+1);
      expect(limites.height).toBeLessThanOrEqual(suporte.height+1);
    }
    if(['penalti','defesa'].includes(mini))await page.getByRole('button',{name:'Alto esquerda',exact:true}).click();
    else if(mini==='falta')await page.getByRole('button',{name:'Canto esq.',exact:true}).click();
    else if(mini==='passe')await page.getByRole('button',{name:'Passar para companheiro 1',exact:true}).click();
    else if(mini==='cabeceio')await page.getByRole('button',{name:'Cabecear agora',exact:true}).click();
    else await quadro.locator('.lc-opcoes button').first().click();
    const seguir=quadro.getByRole('button',{name:/^Continuar/});await expect(seguir).toBeVisible();
    const bounds=await seguir.boundingBox();expect(bounds.y).toBeGreaterThanOrEqual(0);expect(bounds.y+bounds.height).toBeLessThanOrEqual(height);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.screenshot({path:`/tmp/arena-${mini}-${width}.png`,fullPage:true});
  });
}

test('a falta tem curva animada, termina no alvo e permite antecipar o avanço',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'no-preference'});
  await page.clock.install({time:new Date('2026-11-06T12:00:00Z')});await page.clock.pauseAt(new Date('2026-11-06T12:00:00.100Z'));
  await abrir(page,'falta');await page.getByRole('button',{name:'Canto esq.',exact:true}).focus();await expect(page.locator('.arena-mira')).toBeVisible();await expect(page.locator('.mini-continuar')).toHaveCount(0);await page.evaluate(()=>{Math.random=()=>0;});
  await page.getByRole('button',{name:'Canto esq.',exact:true}).click();
  const bola=page.locator('.arena-voo-bola .arena-bola');
  await page.clock.runFor(360);expect(Number(await bola.getAttribute('data-x'))).toBeLessThan(116);
  const meio=Number(await bola.getAttribute('data-progresso'));expect(meio).toBeGreaterThan(.3);expect(meio).toBeLessThan(.7);
  await page.clock.runFor(450);await expect(bola).toHaveAttribute('data-progresso','1');
  await expect(page.getByText('GOLAÇO DE FALTA!',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  await expect(page.locator('.arena-quadro')).toHaveCount(0);
});

for(const nome of ['Por cima','Canto dir.'])test(`falta: ${nome} aceita teclado e conclui a cobrança`,async({page})=>{
  await page.setViewportSize({width:390,height:640});await page.emulateMedia({reducedMotion:'reduce'});
  await abrir(page,'falta');await page.getByRole('button',{name:nome,exact:true}).focus();
  await expect(page.locator('.arena-mira')).toBeVisible();await page.keyboard.press('Enter');
  await expect(page.locator('.vf-replay-legenda')).toContainText(nome);
  await expect(page.locator('.arena-voo-bola .arena-bola')).toHaveAttribute('data-progresso','1');
  await page.getByRole('button',{name:'Continuar →',exact:true}).click();
  await expect(page.locator('.arena-quadro')).toHaveCount(0);
});
