import { I18n } from "../i18n/i18n";
import type { MascotOption, ViewerState } from "../types";
import type { RendererCallbacks } from "../renderer/renderer-callbacks";
import { icon } from "./icons";
import { Checkbox } from "./inputs";
import { renderRabbitMascot } from "./rabbit-mascot";
import { bindScrollFade } from "./scroll-fade";

type MenuView = "menu" | "shortcut" | "pageList" | "share";

const MENU_PANELS: ReadonlySet<ViewerState["panel"]> = new Set([
  "menu",
  "pages",
  "shortcuts",
  "share"
]);

/** メニューパネル（トップメニューとその配下ビュー）が開いている panel かどうか。 */
export function isMenuPanel(panel: ViewerState["panel"]): boolean {
  return MENU_PANELS.has(panel);
}

const MENU_VIEWS: Partial<Record<ViewerState["panel"], MenuView>> = {
  pages: "pageList",
  shortcuts: "shortcut",
  share: "share"
};

export class MenuPanel {
  private root: HTMLDivElement;
  private titleEl: HTMLSpanElement;
  private authorEl: HTMLSpanElement;
  private bottomEl: HTMLDivElement;
  private viewMenu: HTMLDivElement;
  private viewShortcut: HTMLDivElement;
  private viewPageList: HTMLDivElement;
  private viewShare: HTMLDivElement;
  private shareUrlInput: HTMLInputElement;
  private sharePageCheckbox?: Checkbox;
  private pageListInner: HTMLDivElement;
  private pageListCacheKey?: string;
  private currentState?: ViewerState;
  private currentView: MenuView = "menu";
  private i18nTexts: Array<{ key: string; apply: (text: string) => void }> =
    [];

  constructor(
    private callbacks: RendererCallbacks,
    private i18n: I18n,
    private options: {
      lockLayoutMode?: boolean;
      mascot?: MascotOption;
      pageQueryParam?: string;
    } = {}
  ) {
    this.root = document.createElement("div");
    this.root.className = "comimi-menu-panel";
    this.root.setAttribute("role", "dialog");
    this.root.dataset.open = "false";
    this.root.dataset.view = "menu";
    this.root.dataset.overlay = "false";

    const background = document.createElement("div");
    background.className = "comimi-menu-bg";

    const top = this.buildTop();
    [this.titleEl, this.authorEl] = this.findTitleNodes(top);

    this.bottomEl = document.createElement("div");
    this.bottomEl.className = "comimi-menu-bottom";
    this.bottomEl.style.height = "0px";

    const border = document.createElement("div");
    border.className = "comimi-menu-border";

    this.viewMenu = this.buildMenuView();
    this.viewShortcut = this.buildShortcutView();
    [this.viewPageList, this.pageListInner] = this.buildPageListView();
    [this.viewShare, this.shareUrlInput] = this.buildShareView();

    this.bottomEl.append(
      border,
      this.viewMenu,
      this.viewShortcut,
      this.viewPageList,
      this.viewShare
    );
    const mascot = renderRabbitMascot(this.options.mascot);
    const children: Node[] = [background];
    if (mascot) children.push(mascot);
    children.push(top, this.bottomEl);
    this.root.append(...children);
  }

  getElement(): HTMLElement {
    return this.root;
  }

  private bindI18nText(el: HTMLElement, key: string): void {
    this.bindI18n(key, (text) => {
      el.textContent = text;
    });
  }

  private bindI18n(key: string, apply: (text: string) => void): void {
    apply(this.i18n.t(key));
    this.i18nTexts.push({ key, apply });
  }

  private refreshI18nTexts(): void {
    for (const { key, apply } of this.i18nTexts) {
      apply(this.i18n.t(key));
    }
  }

  update(state: ViewerState): void {
    const isOpen = isMenuPanel(state.panel);
    const view: MenuView = MENU_VIEWS[state.panel] ?? "menu";

    this.root.dataset.open = String(isOpen);
    this.root.dataset.view = view;
    this.root.dataset.overlay = String(state.overlayVisible);

    this.titleEl.textContent = state.manga.title;
    if (state.manga.author) {
      this.authorEl.textContent = `@${state.manga.author}`;
      this.authorEl.style.display = "";
    } else {
      this.authorEl.textContent = "";
      this.authorEl.style.display = "none";
    }

    this.refreshI18nTexts();
    this.refreshPageList(state);
    this.refreshShareUrl(state);
    this.applyHeight(isOpen, view);

    this.currentState = state;
    this.currentView = view;
  }

  private applyHeight(isOpen: boolean, view: MenuView): void {
    if (!isOpen) {
      this.bottomEl.style.height = "0px";
      return;
    }

    const target = {
      menu: this.viewMenu,
      shortcut: this.viewShortcut,
      pageList: this.viewPageList,
      share: this.viewShare
    }[view];
    const height = target.offsetHeight;
    this.bottomEl.style.height = `${height}px`;
  }

  private refreshPageList(state: ViewerState): void {
    const key = `${state.settings.locale}:${state.manga.id}:${state.manga.pages.length}`;
    if (this.pageListCacheKey === key) {
      return;
    }
    this.pageListCacheKey = key;

    this.pageListInner.replaceChildren();
    state.manga.pages.forEach((page, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "comimi-page-list-item";
      item.addEventListener("click", (event) => {
        event.stopPropagation();
        this.callbacks.goToPage(index);
        this.callbacks.setPanel("none");
      });

      const thumb = document.createElement("span");
      thumb.className = "comimi-page-list-thumb";
      if (page.type === "image") {
        const image = document.createElement("img");
        image.alt =
          page.alt ??
          page.label ??
          this.i18n.t("seek.previewAlt", { page: index + 1 });
        image.draggable = false;
        image.src = page.thumbnailSrc ?? page.src;
        thumb.append(image);
      } else if (page.type === "html") {
        const placeholder = document.createElement("span");
        placeholder.className = "comimi-page-list-thumb-html";
        placeholder.textContent = this.i18n.t("pageList.htmlContent");
        thumb.append(placeholder);
      }

      const text = document.createElement("span");
      text.className = "comimi-page-list-text";
      text.textContent = page.label ?? String(index + 1);

      item.append(thumb, text);
      this.pageListInner.append(item);
    });
  }

  private buildTop(): HTMLButtonElement {
    const top = document.createElement("button");
    top.type = "button";
    top.className = "comimi-menu-top";
    top.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = isMenuPanel(this.currentState?.panel ?? "none");
      this.callbacks.setPanel(isOpen ? "none" : "menu");
    });

    const buttonFrame = document.createElement("span");
    buttonFrame.className = "comimi-menu-button";

    const buttonInner = document.createElement("span");
    buttonInner.className = "comimi-menu-button-inner";
    buttonInner.append(icon("menu"), icon("close"));

    buttonFrame.append(buttonInner);

    const titleWrap = document.createElement("span");
    titleWrap.className = "comimi-menu-title-wrap";

    const title = document.createElement("span");
    title.className = "comimi-menu-title";

    const author = document.createElement("span");
    author.className = "comimi-menu-author";

    titleWrap.append(title, author);
    top.append(buttonFrame, titleWrap);
    return top;
  }

  private findTitleNodes(
    top: HTMLButtonElement
  ): [HTMLSpanElement, HTMLSpanElement] {
    const title = top.querySelector<HTMLSpanElement>(".comimi-menu-title");
    const author = top.querySelector<HTMLSpanElement>(".comimi-menu-author");
    if (!title || !author) {
      throw new Error("MenuPanel title nodes missing");
    }
    return [title, author];
  }

  private buildMenuView(): HTMLDivElement {
    const view = document.createElement("div");
    view.className = "comimi-menu-view comimi-menu-view-menu";

    const list = document.createElement("div");
    list.className = "comimi-menu-list";
    list.append(
      this.renderMenuLink("menu.openPages", () =>
        this.callbacks.setPanel("pages")
      ),
      this.renderMenuLink("menu.openShortcuts", () =>
        this.callbacks.setPanel("shortcuts")
      ),
      this.renderMenuLink("menu.openShare", () =>
        this.callbacks.setPanel("share")
      )
    );

    view.append(list);
    return view;
  }

  private renderMenuLink(
    labelKey: string,
    onClick: () => void
  ): HTMLButtonElement {
    const link = document.createElement("button");
    link.type = "button";
    link.className = "comimi-menu-link";
    link.addEventListener("click", (event) => {
      event.stopPropagation();
      onClick();
    });

    const text = document.createElement("span");
    text.className = "comimi-menu-link-text";
    this.bindI18nText(text, labelKey);

    const arrow = document.createElement("span");
    arrow.className = "comimi-menu-link-arrow";
    arrow.append(icon("arrow"));

    link.append(text, arrow);
    return link;
  }

  private buildShortcutView(): HTMLDivElement {
    const view = document.createElement("div");
    view.className = "comimi-menu-view comimi-menu-view-shortcut";

    const inner = document.createElement("div");
    inner.className = "comimi-shortcut-inner";

    const grid = document.createElement("div");
    grid.className = "comimi-shortcut-grid";
    inner.append(grid);

    bindScrollFade(inner);

    grid.append(
      this.shortcutSection("shortcut.section.page", [
        [["←", "Space"], "shortcut.moveLeft"],
        [["→", "Space + Shift"], "shortcut.moveRight"],
        [["A"], "shortcut.autoPageTurnLabel"]
      ])
    );

    if (!this.options.lockLayoutMode) {
      grid.append(
        this.shortcutSection(
          "shortcut.section.viewMode",
          [
            [["N", "Esc"], "layout.inline"],
            [["W"], "layout.wide"],
            [["F"], "layout.browserFullscreen"]
          ],
          true
        )
      );
    }

    grid.append(
      this.shortcutSection(
        "shortcut.section.general",
        [
          [["O"], "shortcut.overlayToggle"],
          [["M"], "overlay.menu"],
          [["P"], "shortcut.pageModeToggle"],
          [["S"], "overlay.settings"]
        ],
        true
      )
    );

    view.append(inner, this.renderBackButton());
    return view;
  }

  private buildPageListView(): [HTMLDivElement, HTMLDivElement] {
    const view = document.createElement("div");
    view.className = "comimi-menu-view comimi-menu-view-page-list";

    const inner = document.createElement("div");
    inner.className = "comimi-page-list-inner";

    const grid = document.createElement("div");
    grid.className = "comimi-page-list-grid";
    inner.append(grid);

    bindScrollFade(inner);

    view.append(inner, this.renderBackButton());
    return [view, grid];
  }

  private buildShareView(): [HTMLDivElement, HTMLInputElement] {
    const view = document.createElement("div");
    view.className = "comimi-menu-view comimi-menu-view-share";

    const inner = document.createElement("div");
    inner.className = "comimi-share-inner";

    const field = document.createElement("div");
    field.className = "comimi-share-field";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "comimi-share-url";
    input.readOnly = true;
    input.spellcheck = false;
    this.bindI18n("share.url", (text) => input.setAttribute("aria-label", text));
    input.addEventListener("focus", () => input.select());
    input.addEventListener("click", (event) => {
      event.stopPropagation();
      input.select();
    });

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "comimi-share-copy";
    const copyBg = document.createElement("span");
    copyBg.className = "comimi-share-copy-bg";
    const copyText = document.createElement("span");
    copyText.className = "comimi-share-copy-text";
    this.bindI18nText(copyText, "share.copy");
    copy.append(copyBg, copyText);
    copy.addEventListener("click", (event) => {
      event.stopPropagation();
      void this.copyShareUrl();
    });

    field.append(input, copy);
    inner.append(field);

    if (this.options.pageQueryParam) {
      const checkbox = new Checkbox(() => {
        if (this.currentState) {
          this.refreshShareUrl(this.currentState);
        }
      });
      this.bindI18n("share.includePage", (text) => checkbox.setLabel(text));
      this.sharePageCheckbox = checkbox;
      inner.append(checkbox.getElement());
    }

    view.append(inner, this.renderBackButton());
    return [view, input];
  }

  private buildShareUrl(state: ViewerState): string {
    if (typeof window === "undefined") {
      return "";
    }
    const url = new URL(window.location.href);
    const key = this.options.pageQueryParam;
    if (key) {
      url.searchParams.delete(key);
      if (this.sharePageCheckbox?.isChecked()) {
        url.searchParams.set(key, String(state.currentPageIndex + 1));
      }
    }
    return url.toString();
  }

  private refreshShareUrl(state: ViewerState): void {
    const next = this.buildShareUrl(state);
    if (this.shareUrlInput.value !== next) {
      this.shareUrlInput.value = next;
    }
  }

  private async copyShareUrl(): Promise<void> {
    const text = this.shareUrlInput.value;
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      this.shareUrlInput.select();
      copied = document.execCommand("copy");
    }
    if (copied) {
      this.callbacks.notify(this.i18n.t("share.copied"), "success");
    }
  }

  private shortcutSection(
    titleKey: string,
    items: Array<[string[], string]>,
    column = false
  ): HTMLDivElement {
    const section = document.createElement("div");
    section.className = "comimi-shortcut-section";

    const heading = document.createElement("div");
    heading.className = "comimi-shortcut-heading";
    this.bindI18nText(heading, titleKey);

    const list = document.createElement("div");
    list.className = column ? "comimi-shortcut-column" : "comimi-shortcut-list";

    for (const [keys, labelKey] of items) {
      list.append(this.shortcutItem(keys, labelKey));
    }

    section.append(heading, list);
    return section;
  }

  private shortcutItem(keys: string[], labelKey: string): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "comimi-shortcut-item";

    const badge = document.createElement("span");
    badge.className = "comimi-shortcut-badge";
    keys.forEach((key, index) => {
      if (index > 0) {
        const or = document.createElement("span");
        or.className = "comimi-shortcut-or";
        badge.append(or);
      }
      const keyEl = document.createElement("span");
      keyEl.className = "comimi-shortcut-key";
      keyEl.textContent = key;
      badge.append(keyEl);
    });

    const labelEl = document.createElement("span");
    labelEl.className = "comimi-shortcut-label";
    this.bindI18nText(labelEl, labelKey);

    wrapper.append(badge, labelEl);
    return wrapper;
  }

  private renderBackButton(): HTMLButtonElement {
    const back = document.createElement("button");
    back.type = "button";
    back.className = "comimi-back-button";
    back.addEventListener("click", (event) => {
      event.stopPropagation();
      this.callbacks.setPanel("menu");
    });

    const inner = document.createElement("span");
    inner.className = "comimi-back-inner";

    const bg = document.createElement("span");
    bg.className = "comimi-back-bg";

    const text = document.createElement("span");
    text.className = "comimi-back-text";
    this.bindI18nText(text, "menu.back");

    const arrow = document.createElement("span");
    arrow.className = "comimi-back-arrow";
    arrow.append(icon("arrow"));

    inner.append(bg, text, arrow);
    back.append(inner);
    return back;
  }
}
