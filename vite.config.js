import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: precisa ser o nome do repositório pro GitHub Pages achar os arquivos
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === "true" ? "/A-Joia/" : "/",
  server: { port: 5173, open: true },
});
