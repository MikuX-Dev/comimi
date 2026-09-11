import { createMangaViewer, type MangaPage } from "../../../src";
import { loadSampleImagePages } from "./shell/sample-pages";
import { mountPreviewShell } from "./shell/shell";

const imagePages: MangaPage[] = loadSampleImagePages();

const container = mountPreviewShell("hidden-settings");

createMangaViewer(container, {
  manga: {
    id: "sample-comic-hidden-settings",
    title: "UI項目を非表示",
    author: "yui540",
    pages: imagePages
  },
  locale: "ja",
  settings: {
    layoutMode: "inline",
    hasCover: true,
    readingDirection: "rtl"
  },
  hiddenSettings: ["autoplay", "locale", "theme"]
});
