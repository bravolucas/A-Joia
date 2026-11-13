import {test,expect} from '@playwright/test';
import {criarJogador,jogarTemporada,fecharTemporada,aplicarMomento,resolverCopaAuto} from '../src/jogador/rapido.js';
import {LIGAS} from '../src/dados/data.js';
test.setTimeout(90000);
const url='http://127.0.0.1:4173/A-Joia/';
let pronto;
function fixture(){
 if(pronto)return structuredClone(pronto);
 let c=criarJogador({nome:'Mundo Persistente',nac:'BRA',posicao:'ATA',origem:'base',personalidade:'equilibrado',codigo:'MUNDO-UI'});
 c.clubeNome='Corinthians';c.flags.baseEscolhida=true;
 let r=jogarTemporada(c);while(r.card.pendente)r.card=aplicarMomento(r.card,true);r.card=resolverCopaAuto(r.c,r.card);
 const f=fecharTemporada(r.c,r.card);f.c.desafioAno=f.c.ano;
 pronto={v:1,etapa:'evento',c:f.c,auto:false};return structuredClone(pronto);
}
for(const width of [360,1366])test(`mundo vivo: IndexedDB, arquivo de clubes, jogadores e partidas em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 const erros=[];page.on('pageerror',e=>erros.push(e.message));await page.goto(url);await expect(page.getByRole('button',{name:/Modo Carreira completo/})).toBeVisible();
 const s=fixture();
 await page.evaluate(async save=>{
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ajoia-carreiras',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  await new Promise((resolve,reject)=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(save,'ajoia_rapido_v1');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  db.close();localStorage.setItem('ajoia_rapido_v1',JSON.stringify({arquivoMundo:1}));
 },s);
 await page.reload();await page.getByRole('button',{name:/Continuar · Mundo Persistente/}).click();
 await page.getByRole('button',{name:'Ver história do Corinthians',exact:true}).click();
 const d=page.getByRole('dialog',{name:'História do futebol'});await expect(d.getByRole('region',{name:'Evolução do Corinthians'})).toContainText(String(s.c.ano-1));
 await d.getByRole('button',{name:'Jogadores',exact:true}).click();await d.getByLabel('Buscar jogador',{exact:true}).fill('Mundo Persistente');await d.locator('.mv-atletas button').click();await expect(d.getByRole('article',{name:'Ficha de Mundo Persistente'})).toContainText(String(s.c.ano-1));
 await d.getByRole('button',{name:'Competições',exact:true}).click();await d.getByLabel('Competição do histórico').selectOption(LIGAS.brasileirao.nome);await expect(d.getByRole('region',{name:'Edições da competição'})).toBeVisible();await expect(d.locator('.mv-jogos li').first()).toBeVisible();await d.getByLabel('Filtrar partidas por clube').selectOption('Corinthians');await expect(d.locator('.mv-jogos li')).toHaveCount(38);
 expect(await d.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);await page.screenshot({path:`test-results/mundo-vivo-${width}.png`,animations:'disabled'});
 await d.getByRole('button',{name:'Voltar ao jogo',exact:true}).click();
 await expect.poll(()=>page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('ajoia-carreiras',1);r.onsuccess=()=>resolve(r.result);});const dado=await new Promise(resolve=>{const tx=db.transaction('saves','readonly'),r=tx.objectStore('saves').get('ajoia_rapido_v1');r.onsuccess=()=>resolve(r.result);});db.close();return dado?.c?.universo?.anos?.length;})).toBe(1);
 await page.reload();await expect(page.getByRole('button',{name:/Continuar · Mundo Persistente/})).toBeVisible();expect(erros).toEqual([]);
});
