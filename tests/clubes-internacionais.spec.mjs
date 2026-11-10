import {test,expect} from '@playwright/test';
import {criarJogador} from '../src/jogador/rapido.js';
import {CLUBES} from '../src/dados/data.js';
import {clubeInternacional} from '../src/competicoes/clubesInternacionais.js';
import {criarCampanhaCopa} from '../src/treinador/copasEscolha.js';
import {criarAgenda} from '../src/competicoes/calendarioCopas.js';
const url='http://127.0.0.1:4173/A-Joia/';
for(const [nome,usuario,adversario] of [['Libertadores','Flamengo','Bolívar'],['Champions League','Real Madrid','Panathinaikos']])test(`adversário extra ${adversario} joga, guarda força e retoma na ${nome}`,async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});const erros=[];page.on('pageerror',e=>erros.push(e.message));const c=criarJogador({nome:'Novo Continente',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',codigo:'EXTRAS-UI'});c.clubeNome=usuario;c.ano=2030;c.flags.baseEscolhida=true;c.desafioAno=c.ano;
 const rival=clubeInternacional(adversario),eu=CLUBES.find(x=>x.nome===usuario),cp=criarCampanhaCopa({nome,usuario,forcaUsuario:eu.forca,clubes:[eu,rival],ano:c.ano,formato:'mata',seed:'EXTRAS-UI'});const card={ano:c.ano,clube:usuario,ovr:90,titulos:[],destaques:[],calendarioCopas:criarAgenda([cp],{ano:c.ano,clube:usuario})};
 await page.goto(url);await page.evaluate(s=>localStorage.setItem('ajoia_rapido_v1',JSON.stringify(s)),{v:1,etapa:'copasClubes',c,card,auto:false});await page.reload();await page.getByRole('button',{name:/Continuar · Novo Continente/}).click();const d=page.getByRole('dialog',{name:`Copa em jogo · ${nome}`});await expect(d.locator('.cce-confronto')).toContainText(adversario);await expect(d.locator('.cce-confronto')).toContainText(`Força ${rival.forca}`);const escudo=d.locator('.cce-confronto > div').last().locator('img');await expect(escudo).toBeVisible();await expect.poll(()=>escudo.evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
 await page.reload();await page.getByRole('button',{name:/Continuar · Novo Continente/}).click();await expect(d.locator('.cce-confronto')).toContainText(adversario);await d.locator('.cce-opcoes button').first().click();await expect(d.getByRole('status')).toBeVisible();const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('ajoia_rapido_v1')));expect(salvo.card.calendarioCopas.campeonatos[0].forcas[adversario]).toBe(rival.forca);expect(erros).toEqual([]);await page.screenshot({path:`test-results/clubes-extras-${adversario}.png`,fullPage:true});
});
