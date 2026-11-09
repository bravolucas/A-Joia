import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// base: precisa ser o nome do repositório pro GitHub Pages achar os arquivos
const base = process.env.GITHUB_PAGES === "true" ? "/A-Joia/" : "/";
export default defineConfig({
  base,
  plugins: [
    react(),
    // Mantém o manifesto instalável e migra o worker legado, sem recriar cache de versões antigas.
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src/atualizacao",
      filename: "sw.js",
      injectRegister: false,
      injectManifest: { injectionPoint: undefined, rollupFormat: "iife" },
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

    }),
  ],
  server: { port: 5173, open: true },
});
