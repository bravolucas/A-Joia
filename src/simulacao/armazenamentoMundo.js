import {serializarCarreira,lerCarreira} from './arquivoSave.js';
const BANCO='ajoia-carreiras',LOJA='saves';
let banco=null;
const cache=new Map(),pendentes=new Map();
export async function prepararArmazenamento(){
 if(!globalThis.indexedDB){
  if(typeof localStorage!=='undefined'&&Object.keys(localStorage).some(k=>localStorage.getItem(k)==='{"arquivoMundo":1}'))throw new Error('O armazenamento desta carreira está indisponível. Reabra o jogo em uma janela normal do navegador.');
  return;
 }
 try{
  banco=await new Promise((resolve,reject)=>{const r=indexedDB.open(BANCO,1);r.onupgradeneeded=()=>r.result.createObjectStore(LOJA);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Armazenamento ocupado.'));});
  await new Promise((resolve,reject)=>{const tx=banco.transaction(LOJA,'readonly'),r=tx.objectStore(LOJA).openCursor();r.onsuccess=()=>{const cursor=r.result;if(cursor){cache.set(cursor.key,cursor.value);cursor.continue();}};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
 }catch{banco=null;}
 if(typeof localStorage!=='undefined'){
  for(const chave of ['ajoia_rapido_v1',...['auto','1','2','3','4','5'].map(s=>`ajoia_save_${s}`)]){
   try{if(JSON.parse(localStorage.getItem(chave))?.arquivoMundo&&!cache.has(chave))throw new Error('ARQUIVO_INDISPONIVEL');}catch(e){if(e.message==='ARQUIVO_INDISPONIVEL')throw new Error('Não foi possível abrir os saves deste navegador. Recarregue a página para tentar novamente. Seus saves foram preservados.');}
  }
 }
}
export function lerPersistente(chave,storage=globalThis.localStorage){
 const txt=storage?.getItem(chave);if(!txt)return null;
 const cabecalho=lerCarreira(txt);
 if(!cabecalho?.arquivoMundo)return cabecalho;
 const salvo=cache.get(chave);if(!salvo)throw new Error('Não foi possível abrir o arquivo desta carreira. Recarregue o jogo para tentar novamente.');
 return structuredClone(salvo);
}
function comunicar(chave,erro){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('ajoia-salvamento',{detail:{chave,erro:erro||null}}));}
export function gravarPersistente(chave,valor){
 const temArquivo=valor?.c?.universo||valor?.c?.tecnico?.universo||valor?.carreira?.universo||valor?.carreira?.tecnico?.universo;
 if(!banco||!temArquivo){localStorage.setItem(chave,serializarCarreira(valor));return {ok:true};}
 // Structured clone is part of the IndexedDB write. No JSON/compression of decades of history on the UI thread.
 const snapshot=structuredClone(valor),anterior=cache.get(chave);
 cache.set(chave,snapshot);
 const tarefa=()=>new Promise((resolve,reject)=>{
  let tx;
  try{tx=banco.transaction(LOJA,'readwrite');tx.objectStore(LOJA).put(snapshot,chave);}
  catch(erro){cache.set(chave,anterior);comunicar(chave,erro.message);reject(erro);return;}
  tx.oncomplete=()=>{
   try{localStorage.setItem(chave,JSON.stringify({arquivoMundo:1}));comunicar(chave);resolve(true);}catch(e){cache.set(chave,anterior);comunicar(chave,e.message);reject(e);}
  };
  tx.onerror=()=>{cache.set(chave,anterior);const erro=tx.error||new Error('Não foi possível salvar a carreira.');comunicar(chave,erro.message);reject(erro);};
  tx.onabort=tx.onerror;
 });
 const promessa=(pendentes.get(chave)||Promise.resolve()).catch(()=>{}).then(tarefa);
 pendentes.set(chave,promessa);promessa.finally(()=>{if(pendentes.get(chave)===promessa)pendentes.delete(chave);}).catch(()=>{});
 return {ok:true,pendente:promessa};
}
export function apagarPersistente(chave){
 localStorage.removeItem(chave);cache.delete(chave);
 const remover=()=>{localStorage.removeItem(chave);if(banco){const tx=banco.transaction(LOJA,'readwrite');tx.objectStore(LOJA).delete(chave);}};
 const pendente=pendentes.get(chave);if(pendente)pendente.finally(remover).catch(()=>{});else remover();
}
export async function aguardarSalvamentos(){await Promise.all([...pendentes.values()]);}
