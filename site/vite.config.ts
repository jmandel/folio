import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Relative base: the built site works at any path (joshuamandel.com/folio/, a local preview, a file share).
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { fs: { allow: [resolve(__dirname, "..")] } },
  build: { outDir: "dist", emptyOutDir: true, chunkSizeWarningLimit: 1500 },
});
