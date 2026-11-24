import {test,expect} from '@playwright/test';
import {instalarSave,lerSave} from './helpers/save-browser.mjs';
import {criarJogador,jogarTemporada} from '../src/jogador/rapido.js';
import {iniciarCopaCompartilhada} from '../src/jogador/copaSelecaoCompartilhada.js';

const BASE='http://127.0.0.1:4173/A-Joia/';
test.setTimeout(120000);
function campanha(){
 const c=criarJogador({nome:'Copa 48 UI',nac:'BRA',posicao:'ATA',personalidade:'ascensao',origem:'base',pe:'destro',numero:9,ritmo:'normal',codigo:'UI-COPA48'});
 c.ano=2030;c.idade=25;c.desafioAno=2030;c.flags.baseEscolhida=true;
 for(const a of Object.keys(c.attrs)){c.attrs[a]=96;c.potencial[a]=99;}
 const r=jogarTemporada(c);
 if(!r.card.copa?.convocado)throw new Error('Fixture não convocada');
 const card=iniciarCopaCompartilhada(r.c,r.card);
 if(!card.copaCompartilhada)throw new Error('Copa compartilhada ausente');
 return {c:r.c,card};
}
async function retomar(page){
 await page.goto(BASE);
 await page.getByRole('button',{name:/Continuar · Copa 48 UI/}).click();
 const camisa=page.getByRole('dialog',{name:/Sua camisa/});
 if(await camisa.isVisible().catch(()=>false))await camisa.getByRole('button',{name:/Escolher camisa /}).first().click();
}
test('Copa 48 mostra sorteio de doze grupos, cartas táticas e salva resultado sem repetir jogo',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 const {c,card}=campanha();
 await page.goto(BASE);
 await instalarSave(page,{v:1,etapa:'copa',auto:false,c,card},'ajoia_rapido_v1');
 await page.reload();
 await retomar(page);
 const modal=page.locator('.cce-modal');
 await expect(modal).toBeVisible();
 await expect(modal.getByText('Sorteio da fase de grupos')).toBeVisible();
 await expect(modal.locator('.sct-grupo')).toHaveCount(12);
 await modal.getByRole('button',{name:'Continuar',exact:true}).click();
 await expect(modal.locator('.cce-opcoes button')).toHaveCount(3);
 await modal.locator('.cce-opcoes button').first().click();
 await expect(modal.locator('.cce-resultado')).toBeVisible();
 const primeiro=await lerSave(page,'ajoia_rapido_v1');
 expect(primeiro.card.copaCompartilhada.jogosUsuario).toHaveLength(1);
 const placar=primeiro.card.copaCompartilhada.jogosUsuario[0];
 await page.reload();
 await retomar(page);
 const reaberto=await lerSave(page,'ajoia_rapido_v1');
 expect(reaberto.card.copaCompartilhada.jogosUsuario[0]).toEqual(placar);
 await expect(page.locator('.cce-modal .cce-resultado')).toBeVisible();
 await page.locator('.cce-modal .cce-rodape button').click();
 const segundo=await lerSave(page,'ajoia_rapido_v1');
 expect(segundo.card.copaCompartilhada.jogosUsuario).toHaveLength(1);
 expect(segundo.card.copaCompartilhada.rodada).toBe(1);
 expect(segundo.card.copaCompartilhada.resultado).toBeNull();
 await expect(page.locator('.cce-modal .cce-opcoes button')).toHaveCount(3);
});
