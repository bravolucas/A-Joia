import {test,expect} from '@playwright/test';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {gerarMundoJogadores,simularTemporadaMundo} from '../src/comum/lib.js';
import {CLUBES} from '../src/dados/data.js';
import {geradorTecnico} from '../src/treinador/momentosTecnico.js';

// Exercita o módulo de armazenamento REAL em Chromium, sem mexer em saves
// pessoais: o Playwright cria contextos isolados e usa uma chave de auditoria.
const URL='http://127.0.0.1:4173/A-Joia/';
const CHAVE='ajoia_auditoria_50_anos';
const SHA=valor=>createHash('sha256').update(JSON.stringify(valor)).digest('hex');
const clubes=CLUBES.filter(c=>c?.nome&&Number.isFinite(c.forca));
let mundo, bundle;
test.setTimeout(240000);

test.beforeAll(async()=>{
  mundo=gerarMundoJogadores(geradorTecnico('catalogo|2026'));
  for(let ano=0;ano<50;ano++)
    mundo=simularTemporadaMundo(mundo,geradorTecnico('catalogo|2026|'+ano),{clubes,ano:2030+ano});
  const compilado=await build({
    entryPoints:[resolve('src/simulacao/armazenamentoMundo.js')],
    bundle:true,write:false,platform:'browser',format:'iife',
    globalName:'__ajoiaArmazenamentoAuditoria',logLevel:'silent',
  });
  bundle=compilado.outputFiles[0].text;
});

async function preparar(page) {
  await page.addScriptTag({content:bundle});
  await page.evaluate(async()=>window.__ajoiaArmazenamentoAuditoria.prepararArmazenamento());
}
async function conferirArquivo(page) {
  return page.evaluate(async chave=>{
    const api=window.__ajoiaArmazenamentoAuditoria;
    const t0=performance.now();
    const salvo=api.lerPersistente(chave);
    const txt=JSON.stringify(salvo.c.mundo);
    const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(txt));
    const digest=[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
    const ids=salvo.c.mundo.jogadores.map(p=>String(p.id));
    return {
      digest,bytes:new TextEncoder().encode(txt).byteLength,
      atletas:ids.length,idsUnicos:new Set(ids).size,
      aposentados:salvo.c.mundo.jogadores.filter(p=>p.aposentado).length,
      temporada:salvo.c.mundo.temporada,
      leituraMs:Math.round(performance.now()-t0),
      marcador:localStorage.getItem(chave),
    };
  },CHAVE);
}

test('save mundial de 50 anos persiste em IndexedDB, recarrega e resiste à falha de cota',async({page},testInfo)=>{
  const assinatura=SHA(mundo),quantidade=mundo.jogadores.length;
  const bytes=Buffer.byteLength(JSON.stringify(mundo),'utf8');
  expect(bytes).toBeGreaterThan(10_000_000);
  expect(quantidade).toBeGreaterThan(10_000);
  const medidas={seed:'2026',clubes:clubes.length,temporadas:50,bytes,atletas:quantidade};

  await page.setViewportSize({width:390,height:844});
  await page.goto(URL);
  await preparar(page);
  const tempo=await page.evaluate(async({chave,mundo})=>{
    const api=window.__ajoiaArmazenamentoAuditoria;
    const inicio=performance.now();
    const resultado=api.gravarPersistente(chave,{v:1,c:{nome:'Auditoria 50 anos',mundo}});
    if(!resultado.ok||!resultado.pendente)throw new Error('Salvamento real no IndexedDB não iniciado.');
    await resultado.pendente;
    await api.aguardarSalvamentos();
    return Math.round(performance.now()-inicio);
  },{chave:CHAVE,mundo});
  medidas.gravacaoMobileMs=tempo;
  let primeiro=await conferirArquivo(page);
  expect(primeiro.digest).toBe(assinatura);
  expect(primeiro.bytes).toBe(bytes);
  expect(primeiro.idsUnicos).toBe(primeiro.atletas);
  expect(primeiro.marcador).toBe('{"arquivoMundo":1}');

  // Nova instância do módulo após reload: o cache em memória deve ser refeito
  // a partir da transação que realmente persistiu no navegador.
  await page.reload();
  await preparar(page);
  const recarregado=await conferirArquivo(page);
  expect(recarregado.digest).toBe(assinatura);
  expect(recarregado.aposentados).toBe(primeiro.aposentados);
  medidas.recargaMobileMs=recarregado.leituraMs;

  // Uma exceção de quota na transação nunca pode produzir save falso.
  const falha=await page.evaluate(async chave=>{
    const api=window.__ajoiaArmazenamentoAuditoria;
    const anterior=api.lerPersistente(chave).c.mundo.temporada;
    const put=IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put=function(...args){
      if(args[1]===chave)throw new DOMException('Cota simulada','QuotaExceededError');
      return put.apply(this,args);
    };
    try{
      const alterado=api.lerPersistente(chave);
      alterado.c.mundo.temporada=999;
      const resultado=api.gravarPersistente(chave,alterado);
      try{
        await resultado.pendente;
        return {rejeitado:false};
      }catch(erro){
        return {rejeitado:true,tipo:erro.name,antes:anterior,depois:api.lerPersistente(chave).c.mundo.temporada};
      }
    }finally{IDBObjectStore.prototype.put=put;}
  },CHAVE);
  expect(falha).toEqual({rejeitado:true,tipo:'QuotaExceededError',antes:primeiro.temporada,depois:primeiro.temporada});

  await page.reload();
  await preparar(page);
  await page.setViewportSize({width:1366,height:900});
  const desktop=await conferirArquivo(page);
  expect(desktop.digest).toBe(assinatura);
  expect(desktop.atletas).toBe(quantidade);
  medidas.recargaDesktopMs=desktop.leituraMs;
  medidas.falhaQuotaRejeitada=true;
  await testInfo.attach('medicoes-indexeddb-50-anos.json',{body:Buffer.from(JSON.stringify(medidas,null,2)),contentType:'application/json'});
});
