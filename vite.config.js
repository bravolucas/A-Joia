import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base: precisa ser o nome do repositório pro GitHub Pages achar os arquivos
const base = process.env.GITHUB_PAGES === "true" ? "/A-Joia/" : "/";
export default defineConfig({
  base,
  plugins: [
    react(),
    // instalar como app no celular/computador e abrir mesmo sem internet
    VitePWA({
      selfDestroying: true,
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "A JOIA — simulador de carreira no futebol",
        short_name: "A JOIA",
        description: "Da peneira à Bola de Ouro. Cada escolha lapida a sua carreira.",
        lang: "pt-BR",
        theme_color: "#0E1512",
        background_color: "#0E1512",
        display: "standalone",
        orientation: "portrait",
        start_url: base,
        scope: base,
        icons: [
          { src: "icone-192.png", sizes: "192x192", type: "image/png" },
          { src: "icone-512.png", sizes: "512x512", type: "image/png" },
          { src: "icone-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // o jogo em si fica salvo para abrir offline; escudos, bandeiras e fotos entram no cache conforme aparecem
        globPatterns: ["**/*.{js,css,html,mp3}", "icone-*.png"],
        globIgnores: ["**/AJoiaGame-*.js"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          { urlPattern: ({ request }) => request.destination === "image", handler: "CacheFirst", options: { cacheName: "ajoia-imagens", expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 60 } } },
          { urlPattern: /AJoiaGame-.*\.js$/, handler: "StaleWhileRevalidate", options: { cacheName: "ajoia-modo-carreira" } },
        ],
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  server: { port: 5173, open: true },
});
