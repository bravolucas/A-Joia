/* Migração do cache legado. Não registra outro service worker nem toca nos saves. */
(() => {
  const script = document.currentScript;
  const base = new URL('.', script?.src || location.href).pathname;
  const revisao = 'copas-v2-20261109';
  const propria = url => { try { const u=new URL(url,location.href);return u.origin===location.origin&&u.pathname===base+'sw.js'; } catch { return false; } };
  const cacheProprio = nome => nome.startsWith('ajoia-') || (nome.startsWith('workbox-') && nome.includes(base));
  async function atualizar(manual=false) {
    let mudou=false;
    if ('serviceWorker' in navigator) {
      const regs=await navigator.serviceWorker.getRegistrations();
      const nossas=regs.filter(r=>new URL(r.scope).pathname===base&&[r.active,r.waiting,r.installing].some(w=>w&&propria(w.scriptURL)));
      mudou=nossas.length>0||!!(navigator.serviceWorker.controller&&propria(navigator.serviceWorker.controller.scriptURL));
      await Promise.all(nossas.map(r=>r.unregister()));
    }
    if ('caches' in window) {
      const nomes=(await caches.keys()).filter(cacheProprio);mudou=nomes.length>0||mudou;
      await Promise.all(nomes.map(n=>caches.delete(n)));
    }
    if (!manual&&!mudou) return;
    const chave='ajoia-migracao-'+revisao;
    if(!manual) {
      if(new URL(location.href).searchParams.get('ajoia_atualizada')===revisao)return;
      try { if(sessionStorage.getItem(chave))return;sessionStorage.setItem(chave,'1'); } catch { /* URL protege contra repetição. */ }
    }
    const destino=new URL(location.href);destino.searchParams.set('ajoia_atualizada',manual?revisao+'-'+Date.now():revisao);
    location.replace(destino.href);
  }
  window.atualizarAJoia=()=>atualizar(true);
  atualizar().catch(()=>{});
})();
