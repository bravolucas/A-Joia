/* Migração silenciosa dos service workers antigos.
 * Nunca recarregue a página por iniciativa da migração: o jogador pode
 * estar em uma partida, uma decisão ou editando sua carreira.
 * A atualização completa ocorre apenas ao clicar em "Atualizar jogo".
 */
(() => {
  const script = document.currentScript;
  const base = new URL('.', script?.src || location.href).pathname;
  const propria = url => {
    try {
      const u = new URL(url, location.href);
      return u.origin === location.origin && u.pathname === base + 'sw.js';
    } catch { return false; }
  };
  const cacheProprio = nome => nome.startsWith('ajoia-') ||
    (nome.startsWith('workbox-') && nome.includes(base));

  async function limparLegado() {
    if ('serviceWorker' in navigator) {
      const registros = await navigator.serviceWorker.getRegistrations();
      const nossos = registros.filter(r =>
        new URL(r.scope).pathname === base &&
        [r.active, r.waiting, r.installing].some(w => w && propria(w.scriptURL))
      );
      await Promise.all(nossos.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const nomes = (await caches.keys()).filter(cacheProprio);
      await Promise.all(nomes.map(nome => caches.delete(nome)));
    }
  }

  // Migra caches sem URL de rastreamento, redirect ou navegação automática.
  const migracao = limparLegado().catch(erro => {
    console.warn('A JOIA: migração silenciosa de cache não concluída.', erro);
  });
  let atualizando = false;
  window.atualizarAJoia = async () => {
    if (atualizando) return;
    atualizando = true;
    try {
      await migracao;
      await limparLegado();
    } catch (erro) {
      console.warn('A JOIA: limpeza manual de cache não concluída.', erro);
    }
    // Recarregar é uma ação explícita do jogador, nunca efeito de timer,
    // instalação do worker, atualização de aba ou restauração de sessão.
    const destino = new URL(location.href);
    destino.searchParams.set('ajoia_atualizada', 'manual-' + Date.now());
    location.replace(destino.href);
  };
})();
