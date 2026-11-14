// Fixtures and assertions follow the same persistence boundary as the game:
// old JSON saves remain supported; large worlds are held in IndexedDB.
export async function instalarSave(page,valor,chave='ajoia_rapido_v1'){
 await page.evaluate(async({valor,chave})=>{
  const texto=JSON.stringify(valor);
  if(texto.length<1800000&&!valor.c?.universo&&!valor.c?.tecnico?.universo){localStorage.setItem(chave,texto);return;}
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ajoia-carreiras',1);r.onupgradeneeded=()=>r.result.createObjectStore('saves');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  await new Promise((resolve,reject)=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(valor,chave);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  db.close();localStorage.setItem(chave,JSON.stringify({arquivoMundo:1}));
 },{valor,chave});
}
export async function aguardarSave(page){
 // Allow React to publish a queued transition even when the game clock is mocked.
 await page.waitForTimeout(30);
 await page.locator('.mv-salvando').waitFor({state:'hidden'});
}
export async function lerSave(page,chave='ajoia_rapido_v1'){
 await aguardarSave(page);
 return page.evaluate(async chave=>{
  // Hash large archives inside the browser: equality assertions still detect
  // any change without transporting thousands of records through the test protocol.
  const resumir=async save=>{
   const digest=async valor=>{const bytes=new TextEncoder().encode(JSON.stringify(valor)),hash=await crypto.subtle.digest('SHA-256',bytes);return {arquivoSHA256:[...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')};};
   for(const c of [save?.c,save?.carreira,save])if(c){
    if(c.mundo)c.mundo=await digest(c.mundo);
    if(c.universo)c.universo=await digest(c.universo);
    if(c.tecnico?.universo)c.tecnico.universo=await digest(c.tecnico.universo);
    if(c.historiaFutebol?.atletas)c.historiaFutebol.atletas=await digest(c.historiaFutebol.atletas);
   }
   return save;
  };
  const r=JSON.parse(localStorage.getItem(chave)||'null');if(!r?.arquivoMundo)return resumir(r);
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('ajoia-carreiras',1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  const save=await new Promise((resolve,reject)=>{const tx=db.transaction('saves','readonly'),r=tx.objectStore('saves').get(chave);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  db.close();return resumir(save);
 },chave);
}
