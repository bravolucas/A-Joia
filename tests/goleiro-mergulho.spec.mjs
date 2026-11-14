import {instalarSave,lerSave} from './helpers/save-browser.mjs';
// Full-world fixtures include thousands of players and IndexedDB hydration.
test.setTimeout(90000);
import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada} from '../src/jogador/rapido.js';
for(const [lado,amostra] of [['esquerda',0],['direita',.25]])test(`goleiro decide a leitura ${lado}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 const c=criarJogador({nome:'Goleiro Teste',nac:'BRA',posicao:'GOL',personalidade:'ascensao',origem:'base',pe:'destro',numero:1,ritmo:'normal',codigo:'MERGULHO'});const {card}=jogarTemporada(c);card.pendente={tipo:'copa',nome:'Copa do Brasil',mini:'defesa',titulo:'A decisão está nos seus pés',texto:'Final',ordem:1,total:1};card.filaMomentos=[card.pendente];
 await page.goto('http://127.0.0.1:4173/A-Joia/');await instalarSave(page,((s)=>(s))({v:1,etapa:'momento',c,card}),"ajoia_rapido_v1");await page.reload();await page.getByRole('button',{name:/Continuar · Goleiro Teste/}).click();
 await expect(page.locator('.dj-escolhas button')).toHaveCount(3);await page.evaluate(()=>Math.random=()=>0);await page.locator('.dj-escolhas button').nth(lado==='esquerda'?0:1).click();await expect(page.locator('.dj-resultado')).toContainText('ATAQUE NEUTRALIZADO');const salvo=await lerSave(page,"ajoia_rapido_v1").then(salvo=>(salvo.card.pendente));expect(salvo.mini).toBe('decisaoDefensiva');expect(salvo.decisaoJogo.acertou).toBe(true);
});
