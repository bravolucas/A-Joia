import {clonarEstado} from './clonarEstado.js';
import {serializarCarreira,lerCarreira} from './arquivoSave.js';
const BANCO='ajoia-carreiras',LOJA='saves';
let banco=null;
// "cache" contém a última intenção de gravação; "confirmados" rastreia o
// último snapshot aceito pelo IndexedDB para recuperar falhas de fila.
const cache=new Map(),confirmados=new Map(),pendentes=new Map();
export async function prepararArmazenamento(){
 if(!globalThis.indexedDB){
  if(typeof localStorage!=='undefined'&&Object.keys(localStorage).some(k=>localStorage.getItem(k)==='{"arquivoMundo":1}'))throw new Error('O armazenamento desta carreira está indisponível. Reabra o jogo em uma janela normal do navegador.');
  return;
 }
 try{
  banco=await new Promise((resolve,reject)=>{const r=indexedDB.open(BANCO,1);r.onupgradeneeded=()=>r.result.createObjectStore(LOJA);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Armazenamento ocupado.'));});
  await new Promise((resolve,reject)=>{const tx=banco.transaction(LOJA,'readonly'),r=tx.objectStore(LOJA).openCursor();r.onsuccess=()=>{const cursor=r.result;if(cursor){cache.set(cursor.key,cursor.value);confirmados.set(cursor.key,cursor.value);cursor.continue();}};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
 }catch{banco=null;}
 if(typeof localStorage!=='undefined'){
  for(const chave of ['ajoia_rapido_v1','ajoia_desafios_v1',...['auto','1','2','3','4','5'].map(s=>`ajoia_save_${s}`)]){
   try{if(JSON.parse(localStorage.getItem(chave))?.arquivoMundo&&!cache.has(chave))throw new Error('ARQUIVO_INDISPONIVEL');}catch(e){if(e.message==='ARQUIVO_INDISPONIVEL')throw new Error('Não foi possível abrir os saves deste navegador. Recarregue a página para tentar novamente. Seus saves foram preservados.');}
  }
 }
}
function resolverPersistente(chave,storage){
 const txt=storage?.getItem(chave);if(!txt)return {valor:null,arquivo:false};
 const cabecalho=lerCarreira(txt);
 if(!cabecalho?.arquivoMundo)return {valor:cabecalho,arquivo:false};
 const salvo=cache.get(chave);if(!salvo)throw new Error('Não foi possível abrir o arquivo desta carreira. Recarregue o jogo para tentar novamente.');
 return {valor:salvo,arquivo:true};
}
export function lerPersistente(chave,storage=globalThis.localStorage){
 const {valor,arquivo}=resolverPersistente(chave,storage);
 // O arquivo histórico (universo) é imutável — cada fechamento cria objetos novos —
 // e fica compartilhado; o resto é copiado. Numa carreira longa ele passa de 50 MB:
 // duplicá-lo a cada leitura derrubava a aba no celular (recarga em loop).
 return arquivo?clonarEstado(valor):valor;
}
/** Consulta SOMENTE LEITURA do snapshot do IndexedDB.
 * Evita clonar milhares de atletas para extrair as conquistas do museu.
 * Nunca passar esse objeto para código que altere o save ou dados internos.
 */
export function consultarPersistente(chave,storage=globalThis.localStorage){
 return resolverPersistente(chave,storage).valor;
}
function restaurarCacheSeUltima(chave,snapshot){
 if(cache.get(chave)!==snapshot)return;
 if(confirmados.has(chave))cache.set(chave,confirmados.get(chave));
 else cache.delete(chave);
}
function comunicar(chave,erro){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('ajoia-salvamento',{detail:{chave,erro:erro||null}}));}
export function gravarPersistente(chave,valor,storage=globalThis.localStorage){
 const temArquivo=[valor?.ativo?.c,valor?.c,valor?.carreira,valor].some(c=>c?.universo||c?.tecnico?.universo||c?.mundo?.jogadores);
 if(!banco||storage!==globalThis.localStorage||!temArquivo){storage.setItem(chave,serializarCarreira(valor));return {ok:true};}
 // O banco clona ao gravar. A cópia isola o estado mutável; o arquivo histórico
 // (universo) é imutável e fica compartilhado, em vez de mais uma cópia de dezenas
 // de MB a cada clique (ver selecoesAtletas: o arquivo nunca é alterado no lugar).
 const snapshot=clonarEstado(valor);
 cache.set(chave,snapshot);
 const tarefa=()=>new Promise((resolve,reject)=>{
  let tx;
  try{tx=banco.transaction(LOJA,'readwrite');tx.objectStore(LOJA).put(snapshot,chave);}
  catch(erro){restaurarCacheSeUltima(chave,snapshot);comunicar(chave,erro.message);reject(erro);return;}
  tx.oncomplete=()=>{
   try{localStorage.setItem(chave,JSON.stringify({arquivoMundo:1}));confirmados.set(chave,snapshot);comunicar(chave);resolve(true);}catch(e){restaurarCacheSeUltima(chave,snapshot);comunicar(chave,e.message);reject(e);}
  };
  tx.onerror=()=>{restaurarCacheSeUltima(chave,snapshot);const erro=tx.error||new Error('Não foi possível salvar a carreira.');comunicar(chave,erro.message);reject(erro);};
  tx.onabort=tx.onerror;
 });
 const promessa=(pendentes.get(chave)||Promise.resolve()).catch(()=>{}).then(tarefa);
 pendentes.set(chave,promessa);promessa.finally(()=>{if(pendentes.get(chave)===promessa)pendentes.delete(chave);}).catch(()=>{});
 return {ok:true,pendente:promessa};
}
export function apagarPersistente(chave){
 localStorage.removeItem(chave);cache.delete(chave);confirmados.delete(chave);
 const remover=()=>{localStorage.removeItem(chave);cache.delete(chave);confirmados.delete(chave);if(banco){const tx=banco.transaction(LOJA,'readwrite');tx.objectStore(LOJA).delete(chave);}};
 const pendente=pendentes.get(chave);if(pendente)pendente.finally(remover).catch(()=>{});else remover();
}
export async function aguardarSalvamentos(){await Promise.all([...pendentes.values()]);}
