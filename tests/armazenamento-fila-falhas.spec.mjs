import {test,expect} from '@playwright/test';
import {build} from 'esbuild';
import {resolve} from 'node:path';

// Não depende de saves reais de usuários: cada página Playwright tem seu
// próprio IndexedDB. O módulo testado é o armazenamento usado pelo jogo.
const URL='http://127.0.0.1:4173/A-Joia/';
const CHAVE='ajoia_teste_fila_independente';
const mundo=temporada=>({v:1,c:{nome:'Teste de fila',mundo:{
  temporada,jogadores:[{id:'1',nome:'Jogador preservado',aposentado:false}],
}}});
let bundle;
test.setTimeout(90000);

test.beforeAll(async()=>{
  const compilado=await build({
    entryPoints:[resolve('src/simulacao/armazenamentoMundo.js')],
    bundle:true,write:false,platform:'browser',format:'iife',
    globalName:'__armazenamentoFila',logLevel:'silent',
  });
  bundle=compilado.outputFiles[0].text;
});

test('quando a primeira gravação falha e a próxima vence, o cache reflete o disco',async({page})=>{
  await page.goto(URL);
  await page.addScriptTag({content:bundle});
  const resultado=await page.evaluate(async({chave,base,primeiro,segundo})=>{
    const api=window.__armazenamentoFila;
    await api.prepararArmazenamento();
    await api.gravarPersistente(chave,base).pendente;
    const original=IDBObjectStore.prototype.put;
    let falharPrimeira=true;
    IDBObjectStore.prototype.put=function(...args){
      if(args[1]===chave&&falharPrimeira){
        falharPrimeira=false;
        throw new DOMException('Falha controlada','QuotaExceededError');
      }
      return original.apply(this,args);
    };
    let resultados;
    try{
      const a=api.gravarPersistente(chave,primeiro);
      const b=api.gravarPersistente(chave,segundo);
      resultados=await Promise.allSettled([a.pendente,b.pendente]);
    }finally{IDBObjectStore.prototype.put=original;}
    const db=await new Promise((res,rej)=>{
      const request=indexedDB.open('ajoia-carreiras',1);
      request.onsuccess=()=>res(request.result);
      request.onerror=()=>rej(request.error);
    });
    const persisted=await new Promise((res,rej)=>{
      const tx=db.transaction('saves','readonly');
      const q=tx.objectStore('saves').get(chave);
      q.onsuccess=()=>res(q.result);
      q.onerror=()=>rej(q.error);
    });
    db.close();
    return {
      primeiras:[resultados[0].status,resultados[1].status],
      cache:api.lerPersistente(chave).c.mundo.temporada,
      disco:persisted.c.mundo.temporada,
      nomePersistido:persisted.c.mundo.jogadores[0].nome,
      marcador:localStorage.getItem(chave),
    };
  },{chave:CHAVE,base:mundo(0),primeiro:mundo(1),segundo:mundo(2)});
  expect(resultado.primeiras).toEqual(['rejected','fulfilled']);
  expect(resultado.disco).toBe(2);
  expect(resultado.cache).toBe(2);
  expect(resultado.nomePersistido).toBe('Jogador preservado');
  expect(resultado.marcador).toBe('{"arquivoMundo":1}');

  await page.reload();
  await page.addScriptTag({content:bundle});
  await page.evaluate(()=>window.__armazenamentoFila.prepararArmazenamento());
  const recarga=await page.evaluate(chave=>window.__armazenamentoFila.lerPersistente(chave).c.mundo.temporada,CHAVE);
  expect(recarga).toBe(2);
});
