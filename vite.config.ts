import { defineConfig } from "vite";
import { version } from "./package.json";

export default defineConfig({
  define: {
    __COMIMI_VERSION__: JSON.stringify(version)
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MangaViewer",
      formats: ["es", "iife"],
      fileName: (format) =>
        format === "iife" ? "manga-viewer.global.js" : "index.js"
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});
