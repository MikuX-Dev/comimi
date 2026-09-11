import { createMangaViewer, type MangaPage } from "../../../src";
import { loadSampleImagePages } from "./shell/sample-pages";
import { mountPreviewShell } from "./shell/shell";

const imagePages: MangaPage[] = loadSampleImagePages();

const container = mountPreviewShell("fullscreen");

createMangaViewer(container, {
  manga: {
    id: "sample-comic-fullscreen",
    title: "全画面に固定",
    author: "yui540",
    pages: imagePages
  },
  locale: "ja",
  settings: {
    layoutMode: "browserFullscreen",
    hasCover: true,
    readingDirection: "rtl"
  },
  lockLayoutMode: true
});
