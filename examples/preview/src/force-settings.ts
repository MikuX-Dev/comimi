import { createMangaViewer, type MangaPage } from "../../../src";
import { loadSampleImagePages } from "./shell/sample-pages";
import { mountPreviewShell } from "./shell/shell";

const imagePages: MangaPage[] = loadSampleImagePages();

const container = mountPreviewShell("force-settings");

createMangaViewer(container, {
  manga: {
    id: "sample-comic-force-settings",
    title: "設定の強制適用",
    author: "yui540",
    pages: imagePages
  },
  locale: "ja",
  settings: {
    layoutMode: "inline",
    hasCover: true,
    readingDirection: "ltr", // 強制したい値
    backgroundColor: "white" // シード（保存値があればそちらが勝つ）
  },
  // readingDirection だけ保存値より初期値を優先する。
  forceSettings: ["readingDirection"]
});
