import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const registrarSW=await readFile(new URL('../public/registerSW.js',import.meta.url),'utf8');
const worker=await readFile(new URL('../src/atualizacao/sw.js',import.meta.url),'utf8');
const origem='https://exemplo.test/A-Joia/';
const pausa=()=>new Promise(resolve=>setImmediate(resolve));

function ambienteRegistro({legado=true}={}){
 const recarregamentos=[],saves=new Map([['ajoia_rapido_v1','carreira-preservada']]);
 const nomes=new Set(['ajoia-imagens','workbox-precache-A-Joia/','cache-outra-aplicacao']);
 let ativo=legado;
 const registro={
  scope:origem,
  active:{scriptURL:origem+'sw.js'},
  unregister:async()=>{ativo=false;return true;}
 };
 const location={
  origin:'https://exemplo.test',
  href:origem,
  replace(url){recarregamentos.push(url);this.href=url;}
 };
 const caches={
  keys:async()=>[...nomes],
  delete:async nome=>nomes.delete(nome)
 };
 const navigator={
  serviceWorker:{getRegistrations:async()=>ativo?[registro]:[]}
 };
 const window={caches,location};
 const contexto={
  document:{currentScript:{src:origem+'registerSW.js?v=refresh-fix-20261122'}},
  location,window,navigator,caches,console,URL,Date
 };
 return {contexto,window,location,recarregamentos,nomes,saves,registro};
}

test('atualização automática limpa caches legados sem recarregar a tela',async()=>{
 const a=ambienteRegistro();
 runInNewContext(registrarSW,a.contexto);
 await pausa();
 assert.deepEqual(a.recarregamentos,[]);
 assert.equal(a.nomes.has('ajoia-imagens'),false);
 assert.equal(a.nomes.has('workbox-precache-A-Joia/'),false);
 assert.equal(a.nomes.has('cache-outra-aplicacao'),true);
 assert.equal(a.saves.get('ajoia_rapido_v1'),'carreira-preservada');
 assert.deepEqual(await a.contexto.navigator.serviceWorker.getRegistrations(),[]);
});
test('reabrir o jogo não cria um loop de redirects entre versões',async()=>{
 const a=ambienteRegistro();
 for(let i=0;i<8;i++){
  runInNewContext(registrarSW,a.contexto);
  await pausa();
 }
 assert.equal(a.recarregamentos.length,0);
 assert.equal(new URL(a.location.href).searchParams.has('ajoia_atualizada'),false);
});
test('botão atualizar executa limpeza e exatamente uma navegação sob cliques simultâneos',async()=>{
 const a=ambienteRegistro();
 runInNewContext(registrarSW,a.contexto);
 await Promise.all([a.window.atualizarAJoia(),a.window.atualizarAJoia()]);
 assert.equal(a.recarregamentos.length,1);
 assert.match(a.recarregamentos[0],/ajoia_atualizada=manual-/);
 assert.equal(a.saves.get('ajoia_rapido_v1'),'carreira-preservada');
 assert.equal(a.nomes.has('cache-outra-aplicacao'),true);
});
test('migração funciona sem suporte a service worker ou cache',async()=>{
 const a=ambienteRegistro({legado:false});
 delete a.contexto.navigator.serviceWorker;
 delete a.contexto.window.caches;
 runInNewContext(registrarSW,a.contexto);
 await pausa();
 assert.deepEqual(a.recarregamentos,[]);
 await a.window.atualizarAJoia();
 assert.equal(a.recarregamentos.length,1);
});
test('ativar worker legado não pode navegar abas abertas',async()=>{
 const handlers={},apagados=[],nomes=['ajoia-imagens','workbox-A-Joia/','cache-alheio'];
 let naoRegistrado=false,navegacoes=0,promessaAtivacao;
 const self={
  registration:{scope:origem,unregister:async()=>{naoRegistrado=true;return true;}},
  addEventListener:(evento,fn)=>{handlers[evento]=fn;},
  skipWaiting:async()=>{},
  clients:{matchAll:async()=>[{navigate:async()=>{navegacoes++;}}]}
 };
 const caches={keys:async()=>nomes,delete:async nome=>{apagados.push(nome);return true;}};
 runInNewContext(worker,{self,caches,URL});
 assert.equal(typeof handlers.activate,'function');
 handlers.activate({waitUntil:promise=>{promessaAtivacao=promise;}});
 await promessaAtivacao;
 assert.equal(naoRegistrado,true);
 assert.equal(navegacoes,0);
 assert.deepEqual(apagados.sort(),['ajoia-imagens','workbox-A-Joia/'].sort());
});
