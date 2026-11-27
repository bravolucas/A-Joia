// Garante o padrão FM no Modo Rápido: todo nome de clube, competição ou atleta
// do mundo que aparece na tela é um link para o Arquivo Vivo — e o link abre a
// página certa. Se alguém renderizar um nome como texto puro, este teste falha.
import {test,expect} from '@playwright/test';
import {instalarSave,aguardarSave} from './helpers/save-browser.mjs';
import {criarJogador,jogarTemporada,fecharTemporada,opcoesPretemporada,escolherPretemporada} from '../src/jogador/rapido.js';
import {CLUBES} from '../src/dados/data.js';
import {CLUBES_AMBIGUOS} from '../src/historia/textoComLinks.js';
test.setTimeout(150000);
const base='http://127.0.0.1:4173/A-Joia/';

function carreira(temporadas=4){
 let c=criarJogador({nome:'Arquivo Navegável',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'ascensao',pe:'destro',numero:9,codigo:'LINKS-FM-RAPIDO'});
 c.flags.baseEscolhida=true;c.clubeNome='Santos';let ultimo=null;
 for(let i=0;i<temporadas;i++){c.desafioAno=c.ano;c=escolherPretemporada(c,opcoesPretemporada(c)[0].id);const t=jogarTemporada(c);t.card.pendente=null;t.card.filaMomentos=[];const f=fecharTemporada(t.c,t.card);c=f.c;ultimo=f.card;}
 c.desafioAno=c.ano;return {c,ultimo};
}
function nomesProcurados(c){
 // jogadores: só nomes únicos do mundo (homônimos não têm como virar link pelo texto)
 const qtd=new Map();for(const p of c.mundo.jogadores)qtd.set(p.nome,(qtd.get(p.nome)||0)+1);
 const clubes=CLUBES.map(x=>x.nome).filter(n=>!CLUBES_AMBIGUOS.has(n));
 const jogadores=[...qtd].filter(([n,q])=>q===1&&n.includes(' ')&&!clubes.includes(n)&&n!==c.rival?.nome).map(([n])=>n);
 const competicoes=['Brasileirão','Copa do Brasil','Libertadores','Copa Sul-Americana','Champions League','Bola de Ouro','Copa do Mundo','Campeonato Paulista','Premier League','La Liga','Serie A','Bundesliga','Ligue 1'];
 return {clubes,jogadores,competicoes};
}
async function semLink(page,raiz,nomes){
 return page.evaluate(({raiz,nomes})=>{
  const root=document.querySelector(raiz);if(!root)return ['raiz não encontrada: '+raiz];
  const out=new Set();const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(w.nextNode()){const n=w.currentNode,t=n.textContent,el=n.parentElement;if(!t.trim()||!el)continue;
   // seletores (abas/toggles com aria-pressed) escolhem o que mostrar na própria tela, não navegam
   if(el.closest('.ajoia-entity-link,.hf-abrir,a,[aria-hidden=true],[aria-pressed],script,style,svg,option,select,title'))continue;
   const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')continue;
   for(const [tipo,lista] of Object.entries(nomes))for(const nome of lista){
    const i=t.indexOf(nome);if(i<0)continue;
    const antes=t[i-1]||' ',depois=t[i+nome.length]||' ';if(/[\p{L}\p{N}]/u.test(antes)||/[\p{L}\p{N}]/u.test(depois))continue;
    out.add(`${tipo}: "${nome}" em "${t.trim().slice(0,80)}"`);}
  }
  return [...out];
 },{raiz,nomes});
}
async function abrir(page,estado){
 await page.goto(base);await instalarSave(page,{v:1,auto:false,...estado},'ajoia_rapido_v1');await page.reload();
 await page.getByRole('button',{name:/Continuar · Arquivo Navegável/}).click();await aguardarSave(page);
}

test('Modo Rápido: tela principal, ficha, OVR e resumo sem nomes em texto puro',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 const erros=[];page.on('pageerror',e=>erros.push(e.message));
 const {c,ultimo}=carreira();const nomes=nomesProcurados(c);
 await abrir(page,{etapa:'evento',c,ultimo});
 await expect(page.getByRole('region',{name:'Treinos da pré-temporada'})).toBeVisible();
 expect(await semLink(page,'.rp',nomes)).toEqual([]);
 for(const [abrirGaveta,rotulo] of [[()=>page.getByRole('button',{name:'Abrir ficha do jogador'}).click(),'Ficha'],
   [()=>page.getByRole('button',{name:/Ver o que compõe seu OVR/}).click(),'OVR'],
   [()=>page.getByRole('button',{name:/Resumo da temporada .* detalhes/}).click(),'Resumo']]){
  await abrirGaveta();const gaveta=page.locator('dialog.jr-gaveta[open]');await expect(gaveta).toBeVisible();
  expect(await semLink(page,'dialog.jr-gaveta[open]',nomes),rotulo).toEqual([]);
  await gaveta.getByRole('button',{name:'Fechar'}).click();await expect(gaveta).toHaveCount(0);
 }
 expect(erros).toEqual([]);
});

test('Modo Rápido: links abrem a página certa no Arquivo Vivo e voltam ao jogo',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 const {c,ultimo}=carreira(2);
 await abrir(page,{etapa:'evento',c,ultimo});
 await page.getByRole('button',{name:/Resumo da temporada .* detalhes/}).click();
 const gaveta=page.locator('dialog.jr-gaveta[open]');await expect(gaveta).toBeVisible();
 const links=gaveta.locator('.ajoia-entity-link');const total=await links.count();expect(total).toBeGreaterThan(3);
 for(let i=0;i<Math.min(total,6);i++){
  const link=gaveta.locator('.ajoia-entity-link').nth(i);const nome=(await link.innerText()).trim();
  await link.click();const arquivo=page.getByRole('dialog',{name:'História do futebol'});await expect(arquivo).toBeVisible();
  await expect(arquivo.locator('.hf-nav-location')).not.toHaveText('');
  await arquivo.getByRole('button',{name:'Fechar história'}).click();await expect(arquivo).toHaveCount(0);
  expect(nome.length).toBeGreaterThan(1);
 }
});

test('Modo Rápido: fechamento da temporada sem nomes em texto puro',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 const {c}=carreira(2);const t=jogarTemporada(c);t.card.pendente=null;t.card.filaMomentos=[];const f=fecharTemporada(t.c,t.card);
 const nomes=nomesProcurados(f.c);
 await abrir(page,{etapa:'fechamento',...f});
 const dialog=page.getByRole('dialog').first();await expect(dialog).toBeVisible();
 for(let i=0;i<8;i++){const prox=page.getByRole('button',{name:/Próximo resultado|Ver resumo da temporada/});if(!await prox.count())break;await prox.first().click();}
 expect(await semLink(page,'dialog[open]',nomes)).toEqual([]);
});
