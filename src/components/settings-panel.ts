import { I18n } from "../i18n/i18n";
import type {
  ColorTheme,
  HideableControl,
  ReadingDirection,
  ViewerState
} from "../types";
import type { RendererCallbacks } from "../renderer/renderer-callbacks";
import { Checkbox, RangeSlider, RollingIconSwitch, Selectbox } from "./inputs";
import { bindScrollFade } from "./scroll-fade";

export class SettingsPanel {
  private root: HTMLDivElement;
  private panel: HTMLDivElement;
  private closeButton: HTMLButtonElement;
  private body: HTMLDivElement;
  private inner: HTMLDivElement;

  private titleEl: HTMLDivElement;
  private localeLabel: HTMLDivElement;
  private coverLabel: HTMLDivElement;
  private directionLabel: HTMLDivElement;
  private intervalLabel: HTMLDivElement;

  private localeSelect: Selectbox;
  private themeSwitch: RollingIconSwitch<ColorTheme>;
  private coverCheckbox: Checkbox;
  private directionSelect: Selectbox;
  private intervalSlider: RangeSlider;

  private staticValues: Partial<Record<HideableControl, HTMLDivElement>> = {};

  constructor(
    private callbacks: RendererCallbacks,
    private i18n: I18n,
    private hidden: ReadonlySet<HideableControl> = new Set()
  ) {
    this.root = document.createElement("div");
    this.root.className = "comimi-settings-layer";
    this.root.dataset.open = "false";

    const backdrop = document.createElement("div");
    backdrop.className = "comimi-settings-backdrop";
    backdrop.addEventListener("click", (event) => {
      event.stopPropagation();
      this.callbacks.setPanel("none");
    });

    this.panel = document.createElement("div");
    this.panel.className = "comimi-settings-panel";
    this.panel.setAttribute("role", "dialog");
    this.panel.addEventListener("click", (event) => event.stopPropagation());

    this.closeButton = document.createElement("button");
    this.closeButton.type = "button";
    this.closeButton.className = "comimi-settings-close";
    this.closeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.callbacks.setPanel("none");
    });

    this.body = document.createElement("div");
    this.body.className = "comimi-settings-panel-body";

    this.inner = document.createElement("div");
    this.inner.className = "comimi-settings-panel-inner";

    this.titleEl = document.createElement("div");
    this.titleEl.className = "comimi-settings-panel-title";

    this.localeSelect = new Selectbox((locale) =>
      this.callbacks.updateSettings({ locale: String(locale) })
    );
    this.themeSwitch = new RollingIconSwitch<ColorTheme>(
      [
        { value: "light", label: "", icon: "light" },
        { value: "dark", label: "", icon: "dark" }
      ],
      (theme) => this.callbacks.updateSettings({ theme })
    );
    this.coverCheckbox = new Checkbox((hasCover) =>
      this.callbacks.updateSettings({ hasCover })
    );
    this.directionSelect = new Selectbox((direction) =>
      this.callbacks.updateSettings({
        readingDirection: direction as ReadingDirection
      })
    );
    this.intervalSlider = new RangeSlider((seconds) =>
      this.callbacks.updateSettings({
        autoPageTurnIntervalMs: Math.max(1, seconds) * 1000
      })
    );

    this.intervalSlider.setRange(3, 30, 1);

    this.localeLabel = this.createLabel();
    this.coverLabel = this.createLabel();
    this.directionLabel = this.createLabel();
    this.intervalLabel = this.createLabel();

    this.inner.append(
      this.buildHeader(),
      this.buildSection(
        "locale",
        this.localeLabel,
        this.localeSelect.getElement()
      ),
      this.buildSection(
        "cover",
        this.coverLabel,
        this.coverCheckbox.getElement(),
        true
      ),
      this.buildSection(
        "direction",
        this.directionLabel,
        this.directionSelect.getElement()
      ),
      this.buildSection(
        "interval",
        this.intervalLabel,
        this.intervalSlider.getElement()
      )
    );

    const grabber = document.createElement("span");
    grabber.className = "comimi-settings-grabber";
    this.bindSheetDrag(grabber, backdrop);

    this.body.append(this.inner);
    this.panel.append(grabber, this.body);
    this.root.append(backdrop, this.panel, this.closeButton);

    bindScrollFade(this.body);
  }

  update(state: ViewerState): void {
    this.titleEl.textContent = this.i18n.t("settings.title");
    this.localeLabel.textContent = "Language";
    this.coverLabel.textContent = this.i18n.t("settings.cover");
    this.coverCheckbox.setLabel(this.i18n.t("settings.cover"));
    this.directionLabel.textContent = this.i18n.t("settings.direction");
    this.intervalLabel.textContent = this.i18n.t("settings.interval");
    this.closeButton.textContent = this.i18n.t("settings.close");

    const localeOptions = [
      { label: "日本語", value: "ja" },
      { label: "English", value: "en" },
      { label: "简体中文", value: "zh-CN" },
      { label: "한국어", value: "ko" },
      { label: "ภาษาไทย", value: "th" },
      { label: "Indonesia", value: "id" }
    ];
    const directionOptions = [
      { label: this.i18n.t("settings.direction.rtl"), value: "rtl" },
      { label: this.i18n.t("settings.direction.ltr"), value: "ltr" }
    ];
    const themeOptions = [
      { label: this.i18n.t("settings.theme.light"), value: "light" },
      { label: this.i18n.t("settings.theme.dark"), value: "dark" }
    ];
    const intervalUnit = this.i18n.t("settings.interval.unit");
    const intervalSeconds = Math.round(
      state.settings.autoPageTurnIntervalMs / 1000
    );

    this.localeSelect.setOptions(localeOptions);
    this.themeSwitch.setLabels([themeOptions[0].label, themeOptions[1].label]);
    this.directionSelect.setOptions(directionOptions);
    this.intervalSlider.setUnit(intervalUnit);

    this.localeSelect.setValue(state.settings.locale);
    this.themeSwitch.setValue(state.settings.theme);
    this.coverCheckbox.setChecked(state.settings.hasCover);
    this.directionSelect.setValue(state.settings.readingDirection);
    this.intervalSlider.setValue(intervalSeconds);

    this.setStaticValue(
      "locale",
      this.labelFor(localeOptions, state.settings.locale)
    );
    this.setStaticValue(
      "theme",
      this.labelFor(themeOptions, state.settings.theme)
    );
    this.setStaticValue("cover", state.settings.hasCover ? "ON" : "OFF");
    this.setStaticValue(
      "direction",
      this.labelFor(directionOptions, state.settings.readingDirection)
    );
    this.setStaticValue("interval", `${intervalSeconds}${intervalUnit}`);

    this.root.dataset.open = String(state.panel === "settings");

    this.scheduleHeightUpdate();
  }

  getElement(): HTMLElement {
    return this.root;
  }

  // 見出し行: 左にタイトル、右にテーマ切替（hidden 指定時は現在値の静的表示）。
  private buildHeader(): HTMLDivElement {
    const header = document.createElement("div");
    header.className = "comimi-settings-header";
    header.append(this.titleEl);
    if (this.hidden.has("theme")) {
      const value = document.createElement("div");
      value.className = "comimi-settings-static-value";
      this.staticValues.theme = value;
      header.append(value);
    } else {
      header.append(this.themeSwitch.getElement());
    }
    return header;
  }

  private createLabel(): HTMLDivElement {
    const label = document.createElement("div");
    label.className = "comimi-settings-label";
    return label;
  }

  /**
   * 非表示指定された項目は編集UIの代わりに値を静的表示する。
   * 値の確認はできるが操作はできない。
   * `selfLabeled` な操作（チェックボックス等）は自身がラベルを持つので見出しを出さない。
   */
  private buildSection(
    key: HideableControl,
    label: HTMLDivElement,
    control: HTMLElement,
    selfLabeled = false
  ): HTMLDivElement {
    if (this.hidden.has(key)) {
      const value = document.createElement("div");
      value.className = "comimi-settings-static-value";
      this.staticValues[key] = value;
      return this.section(label, value);
    }
    return this.section(selfLabeled ? null : label, control);
  }

  private setStaticValue(key: HideableControl, text: string): void {
    const value = this.staticValues[key];
    if (value) value.textContent = text;
  }

  private labelFor(
    options: { label: string; value: string }[],
    value: string
  ): string {
    return options.find((opt) => opt.value === value)?.label ?? value;
  }

  private section(
    label: HTMLDivElement | null,
    control: HTMLElement
  ): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = "comimi-settings-section";
    if (label) wrap.append(label);
    wrap.append(control);
    return wrap;
  }

  // モバイルのシートはハンドルを下へドラッグすると閉じる。
  private bindSheetDrag(grabber: HTMLElement, backdrop: HTMLElement): void {
    const CLOSE_DISTANCE_PX = 72;
    const CLOSE_VELOCITY_PX_PER_MS = 0.5;
    let pointerId: number | undefined;
    let startY = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;

    const applyOffset = (offset: number) => {
      const transform = `translateY(${offset}px)`;
      this.panel.style.transform = transform;
      this.closeButton.style.transform = transform;
      const height = Math.max(this.panel.offsetHeight, 1);
      backdrop.style.opacity = String(Math.max(0, 1 - offset / height));
    };
    const reset = () => {
      this.panel.style.transform = "";
      this.closeButton.style.transform = "";
      backdrop.style.opacity = "";
      delete this.panel.dataset.dragging;
      delete this.closeButton.dataset.dragging;
      delete backdrop.dataset.dragging;
    };

    grabber.addEventListener("pointerdown", (event) => {
      if (pointerId !== undefined || event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      pointerId = event.pointerId;
      startY = lastY = event.clientY;
      lastTime = event.timeStamp;
      velocity = 0;
      this.panel.dataset.dragging = "true";
      this.closeButton.dataset.dragging = "true";
      backdrop.dataset.dragging = "true";
      grabber.setPointerCapture(event.pointerId);
    });
    grabber.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const elapsed = event.timeStamp - lastTime;
      if (elapsed > 0) {
        velocity = (event.clientY - lastY) / elapsed;
      }
      lastY = event.clientY;
      lastTime = event.timeStamp;
      applyOffset(Math.max(0, event.clientY - startY));
    });
    const finish = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = undefined;
      const offset = Math.max(0, event.clientY - startY);
      reset();
      if (offset > CLOSE_DISTANCE_PX || velocity > CLOSE_VELOCITY_PX_PER_MS) {
        this.callbacks.setPanel("none");
      }
    };
    grabber.addEventListener("pointerup", finish);
    grabber.addEventListener("pointercancel", finish);
    grabber.addEventListener("click", (event) => event.stopPropagation());
  }

  private scheduleHeightUpdate(): void {
    const apply = () => {
      this.root.style.setProperty(
        "--comimi-settings-height",
        `${this.body.offsetHeight}px`
      );
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => requestAnimationFrame(apply));
    } else {
      setTimeout(apply, 0);
    }
  }
}
