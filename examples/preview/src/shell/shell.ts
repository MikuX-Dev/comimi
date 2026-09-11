import "./preview.css";
import { renderLogo } from "./logo";
import conceptSrc from "../../assets/concept.svg";
import githubSrc from "../../assets/github.svg";
import yuiSrc from "../../assets/yui.svg";

export type PreviewKey =
  | "index"
  | "mascot"
  | "hidden-settings"
  | "force-settings"
  | "fullscreen";

interface PreviewPage {
  key: PreviewKey;
  href: string;
  label: string;
  title: string;
}

const GITHUB_URL = "https://github.com/yui540/comimi";

export const PAGES: PreviewPage[] = [
  {
    key: "index",
    href: "./",
    label: "基本",
    title: "基本のビューワー"
  },
  {
    key: "mascot",
    href: "./mascot.html",
    label: "マスコット",
    title: "マスコットの差し替え"
  },
  {
    key: "hidden-settings",
    href: "./hidden-settings.html",
    label: "UI項目を非表示",
    title: "UI 項目を非表示にする"
  },
  {
    key: "force-settings",
    href: "./force-settings.html",
    label: "設定の強制適用",
    title: "保存値より初期値を優先する"
  },
  {
    key: "fullscreen",
    href: "./fullscreen.html",
    label: "全画面",
    title: "全画面に固定する"
  }
];

export function mountPreviewShell(key: PreviewKey): HTMLElement {
  const page = PAGES.find((entry) => entry.key === key);
  if (!page) {
    throw new Error(`Unknown preview page: ${key}`);
  }

  const app = document.querySelector<HTMLElement>("#app");
  if (!app) {
    throw new Error("Preview app root not found");
  }

  document.title = `${page.title} | comimi preview`;

  const viewerHost = document.createElement("div");
  viewerHost.className = "pv-viewer";

  app.className = "pv-page";
  app.dataset.page = page.key;
  app.replaceChildren(
    renderHeader(),
    renderHero(),
    renderNav(page.key),
    renderViewerSection(viewerHost),
    renderFooter()
  );

  if (page.key === "fullscreen") {
    app.append(renderBackPill());
  }

  return viewerHost;
}

function renderHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "pv-header";

  const yui = document.createElement("a");
  yui.className = "pv-yui";
  yui.href = "https://yui540.com";
  yui.setAttribute("aria-label", "yui540.com");
  const yuiImg = document.createElement("img");
  yuiImg.src = yuiSrc;
  yuiImg.alt = "";
  yui.append(yuiImg);

  const github = document.createElement("a");
  github.className = "pv-github";
  github.href = GITHUB_URL;
  github.target = "_blank";
  github.rel = "noopener noreferrer";
  github.setAttribute("aria-label", "GitHub");
  const githubImg = document.createElement("img");
  githubImg.src = githubSrc;
  githubImg.alt = "";
  github.append(githubImg);

  header.append(yui, github);
  return header;
}

function renderHero(): HTMLElement {
  const hero = document.createElement("div");
  hero.className = "pv-hero";

  const logoLink = document.createElement("a");
  logoLink.className = "pv-hero-logo";
  logoLink.href = "./";
  logoLink.append(renderLogo("dark", { animated: true, conceptSrc }));

  const kicker = document.createElement("p");
  kicker.className = "pv-kicker";
  kicker.textContent = "Preview";

  hero.append(logoLink, kicker);
  return hero;
}

function renderNav(current: PreviewKey): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "pv-tabs";
  nav.setAttribute("aria-label", "プレビュー一覧");

  const scroller = document.createElement("div");
  scroller.className = "pv-tabs-scroller";

  const list = document.createElement("div");
  list.className = "pv-tabs-list";

  for (const page of PAGES) {
    const tab = document.createElement("a");
    tab.className = "pv-tab";
    tab.href = page.href;
    tab.textContent = page.label;
    if (page.key === current) {
      tab.dataset.selected = "true";
      tab.setAttribute("aria-current", "page");
    }
    list.append(tab);
  }

  scroller.append(list);
  nav.append(scroller);

  const updateFade = () => {
    scroller.dataset.canPrev = String(scroller.scrollLeft > 1);
    scroller.dataset.canNext = String(
      scroller.scrollLeft < scroller.scrollWidth - scroller.clientWidth - 1
    );
  };
  scroller.addEventListener("scroll", updateFade, { passive: true });
  window.addEventListener("resize", updateFade);
  requestAnimationFrame(() => {
    const selected = list.querySelector<HTMLElement>('[data-selected="true"]');
    if (selected) {
      scroller.scrollTo({
        left:
          selected.offsetLeft - (scroller.clientWidth - selected.offsetWidth) / 2
      });
    }
    updateFade();
  });

  return nav;
}

function renderViewerSection(viewerHost: HTMLElement): HTMLElement {
  const section = document.createElement("section");
  section.className = "pv-stage";
  section.append(viewerHost);
  return section;
}

function renderFooter(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "pv-footer";

  // 本家の LoopLogo と同じく 1.6 秒ごとに作り直して耳の揺れと瞬きを繰り返す。
  const logo = document.createElement("div");
  logo.className = "pv-footer-logo";
  const mountLogo = () => logo.replaceChildren(renderLogo("light"));
  mountLogo();
  window.setInterval(mountLogo, 1600);

  const copyright = document.createElement("div");
  copyright.className = "pv-copyright";
  copyright.textContent = `© ${new Date().getFullYear()} yui540.`;

  footer.append(logo, copyright);
  return footer;
}

function renderBackPill(): HTMLElement {
  const back = document.createElement("a");
  back.className = "pv-back";
  back.href = "./";
  back.textContent = "← プレビュー一覧へ";
  return back;
}
