/* Worker apenas de migração do cache legado do A JOIA.
 * NÃO navega abas, não recarrega o jogo nem interfere em uma partida.
 * A atualização da página só ocorre a pedido do jogador, pelo botão da UI.
 */
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const base = new URL(self.registration.scope).pathname;
  const nomes = await caches.keys();
  const identificador = base.replace(/^\/+|\/+$/g, '');
  await Promise.all(
    nomes.filter(nome => nome.startsWith('ajoia-') ||
      (nome.startsWith('workbox-') && identificador && nome.includes(identificador)))
      .map(nome => caches.delete(nome))
  );
  // Deixar de controlar novas navegações, sem chamar clients.navigate().
  await self.registration.unregister();
})()));
