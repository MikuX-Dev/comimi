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
  description: string;
  options: string[];
  steps?: string[];
  notice?: string;
}

const GITHUB_URL = "https://github.com/yui540/comimi";
const USAGE_URL = "https://github.com/yui540/comimi/blob/main/docs/USAGE.md";

export const PAGES: PreviewPage[] = [
  {
    key: "index",
    href: "./",
    label: "基本",
    title: "基本のビューワー",
    description:
      "画像ページと HTML ページを混在させた標準構成です。URL に ?p=20 のようにページ番号を付けると、そのページから開始します。末尾にはリンクだけのページとアウトロの HTML ページを置いています。",
    options: ["initialPageQueryParam", "resolvePageSrc", "HtmlPage"],
    notice: "resolvePageSrc は 200ms の擬似遅延を入れて、復号や認証付き fetch を挟む想定を再現しています。"
  },
  {
    key: "mascot",
    href: "./mascot.html",
    label: "マスコット",
    title: "マスコットの差し替え",
    description:
      "mascot オプションに render 関数を渡し、スプラッシュ・メニュー・コントロールドックのうさぎを自作の SVG（ねこ）に置き換えた例です。",
    options: ["mascot"],
    notice: "src / html / render の3形式に対応し、エリアごとに別のマスコットを指定することもできます。"
  },
  {
    key: "hidden-settings",
    href: "./hidden-settings.html",
    label: "UI項目を非表示",
    title: "UI 項目を非表示にする",
    description:
      "hiddenSettings で自動再生ボタンを非表示にし、設定パネルの言語とテーマを読み取り専用（値は見えるが変更できない）にした例です。",
    options: ["hiddenSettings"],
    notice: "オーバーレイを開いてコントロールドックと設定パネルを確認してください。"
  },
  {
    key: "force-settings",
    href: "./force-settings.html",
    label: "設定の強制適用",
    title: "保存値より初期値を優先する",
    description:
      "forceSettings に readingDirection を指定し、保存された読み方向を無視して常に左→右で起動する例です。背景色は forceSettings に含めていないため、保存値がそのまま優先されます。",
    options: ["forceSettings"],
    steps: [
      "設定パネルを開き、読み方向を「右」に、背景色を「黒」に変える",
      "ページをリロードする",
      "読み方向は「左」に戻り（強制）、背景色は黒のまま（保存値が維持）になる"
    ]
  },
  {
    key: "fullscreen",
    href: "./fullscreen.html",
    label: "全画面",
    title: "全画面に固定する",
    description:
      "layoutMode を browserFullscreen にし、lockLayoutMode でレイアウト切替を封じた例です。表示モードの切替 UI とショートカット（N / W / F）が無効になります。",
    options: ["layoutMode", "lockLayoutMode"]
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
    renderContent(page),
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
  logoLink.append(renderLogo("dark"));

  const concept = document.createElement("img");
  concept.className = "pv-concept";
  concept.src = conceptSrc;
  concept.alt = "comimiは、オープンソースな漫画ビューワーです。";

  const kicker = document.createElement("p");
  kicker.className = "pv-kicker";
  kicker.textContent = "Preview";

  hero.append(logoLink, concept, kicker);
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

function renderContent(page: PreviewPage): HTMLElement {
  const content = document.createElement("section");
  content.className = "pv-content";

  const card = document.createElement("article");
  card.className = "pv-card";

  const head = document.createElement("div");
  head.className = "pv-card-head";

  const title = document.createElement("h1");
  title.className = "pv-card-title";
  title.textContent = page.title;

  const badges = document.createElement("div");
  badges.className = "pv-badges";
  for (const option of page.options) {
    const badge = document.createElement("span");
    badge.className = "pv-badge";
    badge.textContent = option;
    badges.append(badge);
  }

  head.append(title, badges);

  const description = document.createElement("p");
  description.className = "pv-card-text";
  description.textContent = page.description;

  card.append(head, description);

  if (page.steps) {
    const stepsHeading = document.createElement("div");
    stepsHeading.className = "pv-steps-heading";
    stepsHeading.textContent = "確認手順";
    const steps = document.createElement("ol");
    steps.className = "pv-steps";
    for (const step of page.steps) {
      const item = document.createElement("li");
      item.textContent = step;
      steps.append(item);
    }
    card.append(stepsHeading, steps);
  }

  if (page.notice) {
    card.append(renderNotice(page.notice));
  }

  const actions = document.createElement("div");
  actions.className = "pv-actions";

  const command = document.createElement("div");
  command.className = "pv-command";
  command.textContent = "$ npm i @yui540/comimi";

  const buttons = document.createElement("div");
  buttons.className = "pv-buttons";
  buttons.append(
    renderButton("View on GitHub", GITHUB_URL, "primary"),
    renderButton("使い方を読む", USAGE_URL, "secondary")
  );

  actions.append(command, buttons);
  content.append(card, actions);
  return content;
}

function renderNotice(text: string): HTMLElement {
  const notice = document.createElement("p");
  notice.className = "pv-notice";

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 20 20");
  icon.setAttribute("class", "pv-notice-icon");
  icon.setAttribute("aria-hidden", "true");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "10");
  circle.setAttribute("cy", "10");
  circle.setAttribute("r", "8");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "currentColor");
  circle.setAttribute("stroke-width", "1.8");
  const bar = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bar.setAttribute("d", "M10 9v5");
  bar.setAttribute("stroke", "currentColor");
  bar.setAttribute("stroke-width", "1.8");
  bar.setAttribute("stroke-linecap", "round");
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute("cx", "10");
  dot.setAttribute("cy", "6.3");
  dot.setAttribute("r", "1");
  dot.setAttribute("fill", "currentColor");
  icon.append(circle, bar, dot);

  const body = document.createElement("span");
  body.textContent = text;

  notice.append(icon, body);
  return notice;
}

function renderButton(
  label: string,
  href: string,
  variant: "primary" | "secondary"
): HTMLAnchorElement {
  const button = document.createElement("a");
  button.className = "pv-button";
  button.dataset.variant = variant;
  button.href = href;
  button.target = "_blank";
  button.rel = "noopener noreferrer";

  const bg = document.createElement("span");
  bg.className = "pv-button-bg";
  const inner = document.createElement("span");
  inner.className = "pv-button-inner";
  inner.textContent = label;

  button.append(bg, inner);
  return button;
}

function renderFooter(): HTMLElement {
  const footer = document.createElement("footer");
  footer.className = "pv-footer";

  const logo = document.createElement("div");
  logo.className = "pv-footer-logo";
  logo.append(renderLogo("light"));

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
