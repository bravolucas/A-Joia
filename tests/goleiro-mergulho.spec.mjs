import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada} from '../src/jogador/rapido.js';
for(const [lado,amostra] of [['esquerda',0],['direita',.25]])test(`goleiro mostra defesa após escolher ${lado}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 const c=criarJogador({nome:'Goleiro Teste',nac:'BRA',posicao:'GOL',personalidade:'ascensao',origem:'base',pe:'destro',numero:1,ritmo:'normal',codigo:'MERGULHO'});const {card}=jogarTemporada(c);card.pendente={tipo:'copa',nome:'Copa do Brasil',mini:'defesa',titulo:'A decisão está nos seus pés',texto:'Final',ordem:1,total:1};card.filaMomentos=[card.pendente];
 await page.goto('http://127.0.0.1:4173/A-Joia/');await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),{v:1,etapa:'momento',c,card});await page.reload();await page.getByRole('button',{name:/Continuar · Goleiro Teste/}).click();
 await expect(page.locator('[data-penalti-cena="preparacao"]')).toBeVisible();await page.evaluate(v=>{const seq=[.99,v,.99,0];let i=0;Math.random=()=>seq[Math.min(i++,3)];},amostra);await page.getByRole('button',{name:`Alto ${lado}`,exact:true}).click();
 await expect(page.locator('.penalti-jogavel')).toHaveAttribute('data-resultado-cobranca','defesa');await expect(page.locator('[data-desfecho="defesa"]')).toBeVisible();await expect(page.locator('.vf-atleta')).toHaveCount(0);await page.screenshot({path:`/tmp/goleiro-mergulho-${lado}.png`,fullPage:true});
});
