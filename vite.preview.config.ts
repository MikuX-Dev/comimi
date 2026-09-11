import { defineConfig } from "vite";

// examples/preview を静的サイトとしてビルドする設定（Cloudflare Pages 等での公開用）。
// `npm run build:preview` でリポジトリ直下の dist-preview/ に出力する。
export default defineConfig({
  root: "examples/preview",
  build: {
    outDir: "../../dist-preview",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "examples/preview/index.html",
        fullscreen: "examples/preview/fullscreen.html",
        mascot: "examples/preview/mascot.html",
        "hidden-settings": "examples/preview/hidden-settings.html",
        "force-settings": "examples/preview/force-settings.html"
      }
    }
  }
});
