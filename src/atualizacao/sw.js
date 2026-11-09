/* Substitui o worker antigo e entrega HTML novo sem apagar carreiras locais. */
const REVISAO='copas-v2-20261109';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const base=new URL(self.registration.scope).pathname;
 const clientes=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 const nomes=await caches.keys();
 await Promise.all(nomes.filter(n=>n.startsWith('ajoia-')||(n.startsWith('workbox-')&&n.includes(base))).map(n=>caches.delete(n)));
 await self.registration.unregister();
 await Promise.all(clientes.map(async cliente=>{
  const url=new URL(cliente.url);if(url.origin!==self.location.origin||!url.pathname.startsWith(base))return;
  if(url.searchParams.get('ajoia_atualizada')===REVISAO)return;
  url.searchParams.set('ajoia_atualizada',REVISAO);
  try {await cliente.navigate(url.href);}catch{/* Próxima navegação usa o site atualizado. */}
 }));
})()));
