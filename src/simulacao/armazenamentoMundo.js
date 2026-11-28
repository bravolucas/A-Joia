import {clonarEstado} from './clonarEstado.js';
import {serializarCarreira,lerCarreira} from './arquivoSave.js';
const BANCO='ajoia-carreiras',LOJA='saves';
let banco=null;
// "cache" contém a última intenção de gravação; "confirmados" rastreia o
// último snapshot aceito pelo IndexedDB para recuperar falhas de fila.
const cache=new Map(),confirmados=new Map(),pendentes=new Map();
/* Arquivo histórico (universo) em registro próprio: ele só muda no fechamento de
   cada temporada, mas passa de 50 MB numa carreira longa. Gravá-lo junto do resto
   a cada clique custava uma serialização enorme por ação. No registro principal
   fica só uma referência {arquivoSeparado: chave}. Saves antigos, com o arquivo
   embutido, continuam válidos. */
const SEPARADOR='::';
// chave do registro separado → universo confirmado no banco (comparação por referência)
const arquivosGravados=new Map();
const CAMINHOS=[['c'],['carreira'],['ativo','c'],[]];
function portadores(raiz){
 const out=[];
 for(const caminho of CAMINHOS){
  let alvo=raiz;for(const k of caminho)alvo=alvo?.[k];
  if(!alvo||typeof alvo!=='object')continue;
  out.push({caminho,campo:'universo',dono:alvo});
  if(alvo.tecnico&&typeof alvo.tecnico==='object')out.push({caminho:[...caminho,'tecnico'],campo:'universo',dono:alvo.tecnico});
 }
 return out;
}
const ehMarcador=v=>v&&typeof v==='object'&&typeof v.arquivoSeparado==='string'&&Object.keys(v).length===1;
const chaveArquivo=(chave,caminho)=>chave+SEPARADOR+[...caminho,'universo'].join('.');
/** Junta os registros separados de volta no save (no lugar). Devolve false se faltar algum. */
function hidratar(valor,arquivos){
 for(const {dono,campo} of portadores(valor)){
  const v=dono[campo];if(!ehMarcador(v))continue;
  const universo=arquivos.get(v.arquivoSeparado);if(!universo)return false;
  dono[campo]=universo;
 }
 return true;
}
/** Registro a gravar: o mesmo snapshot com cada universo trocado por marcador.
    Só copia os objetos do caminho até o universo; o resto é compartilhado. */
function separarArquivos(chave,snapshot){
 const arquivos=new Map(),porObjeto=new Map();
 const copia=Array.isArray(snapshot)?[...snapshot]:{...snapshot};
 for(const caminho of CAMINHOS){
  for(const sub of [[],['tecnico']]){
   const completo=[...caminho,...sub];
   let original=snapshot;for(const k of completo)original=original?.[k];
   const universo=original?.universo;
   if(!universo||typeof universo!=='object'||ehMarcador(universo)||!universo.versao)continue;
   const k=porObjeto.get(universo)||chaveArquivo(chave,completo);
   porObjeto.set(universo,k);arquivos.set(k,universo);
   // copia rasa do caminho até o dono do universo
   let pai=copia;
   for(const passo of completo){pai[passo]=Array.isArray(pai[passo])?[...pai[passo]]:{...pai[passo]};pai=pai[passo];}
   pai.universo={arquivoSeparado:k};
  }
 }
 return {registro:arquivos.size?copia:snapshot,arquivos};
}
export async function prepararArmazenamento(){
 if(!globalThis.indexedDB){
  if(typeof localStorage!=='undefined'&&Object.keys(localStorage).some(k=>localStorage.getItem(k)==='{"arquivoMundo":1}'))throw new Error('O armazenamento desta carreira está indisponível. Reabra o jogo em uma janela normal do navegador.');
  return;
 }
 try{
  banco=await new Promise((resolve,reject)=>{const r=indexedDB.open(BANCO,1);r.onupgradeneeded=()=>r.result.createObjectStore(LOJA);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Armazenamento ocupado.'));});
  const separados=new Map(),principais=new Map();
  await new Promise((resolve,reject)=>{const tx=banco.transaction(LOJA,'readonly'),r=tx.objectStore(LOJA).openCursor();r.onsuccess=()=>{const cursor=r.result;if(cursor){(String(cursor.key).includes(SEPARADOR)?separados:principais).set(cursor.key,cursor.value);cursor.continue();}};tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  for(const [chave,valor] of principais){
   // Registro principal sem o arquivo correspondente: tratado como save ilegível
   // (a verificação abaixo avisa o jogador sem apagar nada).
   if(!hidratar(valor,separados))continue;
   cache.set(chave,valor);confirmados.set(chave,valor);
  }
  for(const [k,universo] of separados)arquivosGravados.set(k,universo);
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
  const {registro,arquivos}=separarArquivos(chave,snapshot);
  const novos=[...arquivos].filter(([k,u])=>arquivosGravados.get(k)!==u);
  try{
   tx=banco.transaction(LOJA,'readwrite');const loja=tx.objectStore(LOJA);
   // Mesmo transação: o principal nunca aponta para um arquivo que não foi gravado.
   for(const [k,u] of novos)loja.put(u,k);
   loja.put(registro,chave);
  }
  catch(erro){
   // Desfaz o que já entrou na transação (o arquivo separado): principal e arquivo
   // são gravados juntos ou nenhum dos dois.
   try{tx?.abort();}catch{}
   restaurarCacheSeUltima(chave,snapshot);comunicar(chave,erro.message);reject(erro);return;
  }
  tx.oncomplete=()=>{
   for(const [k,u] of novos)arquivosGravados.set(k,u);
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
 const remover=()=>{localStorage.removeItem(chave);cache.delete(chave);confirmados.delete(chave);
  for(const k of [...arquivosGravados.keys()])if(k.startsWith(chave+SEPARADOR))arquivosGravados.delete(k);
  if(banco){const tx=banco.transaction(LOJA,'readwrite'),loja=tx.objectStore(LOJA);loja.delete(chave);loja.delete(IDBKeyRange.bound(chave+SEPARADOR,chave+SEPARADOR+'\uffff'));}};
 const pendente=pendentes.get(chave);if(pendente)pendente.finally(remover).catch(()=>{});else remover();
}
export async function aguardarSalvamentos(){await Promise.all([...pendentes.values()]);}

/* Exposto só para testes: a transformação gravada/lida, sem IndexedDB. */
export const _arquivoSeparado={separarArquivos,hidratar,ehMarcador};
