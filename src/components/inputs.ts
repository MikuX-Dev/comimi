import { icon, type IconName } from "./icons";

export interface SelectOption {
  label: string;
  value: string | number;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const CHECK_STROKE_LENGTH = 11.4;
let checkboxMaskSeq = 0;

export class Checkbox {
  private root: HTMLLabelElement;
  private input: HTMLInputElement;
  private label: HTMLSpanElement;

  constructor(onChange: (checked: boolean) => void) {
    this.root = document.createElement("label");
    this.root.className = "comimi-checkbox";
    this.root.addEventListener("click", (event) => event.stopPropagation());

    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.className = "comimi-checkbox-input";
    this.input.addEventListener("change", () => onChange(this.input.checked));

    const box = document.createElement("span");
    box.className = "comimi-checkbox-box";
    box.setAttribute("aria-hidden", "true");

    const stroke = document.createElement("span");
    stroke.className = "comimi-checkbox-stroke";
    const bg = document.createElement("span");
    bg.className = "comimi-checkbox-bg";
    box.append(stroke, bg, buildCheckIcon());

    this.label = document.createElement("span");
    this.label.className = "comimi-checkbox-label";

    this.root.append(this.input, box, this.label);
  }

  setLabel(text: string): void {
    this.label.textContent = text;
  }

  setChecked(checked: boolean): void {
    this.input.checked = checked;
  }

  isChecked(): boolean {
    return this.input.checked;
  }

  getElement(): HTMLLabelElement {
    return this.root;
  }
}

// チェックマークはマスクした線を stroke-dasharray で描き進める（comugi UI と同じ）。
function buildCheckIcon(): SVGSVGElement {
  checkboxMaskSeq += 1;
  const maskId = `comimi-checkbox-mask-${checkboxMaskSeq}`;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 11.04 8.31");
  svg.setAttribute("class", "comimi-checkbox-check");

  const mask = document.createElementNS(SVG_NS, "mask");
  mask.setAttribute("id", maskId);
  const line = document.createElementNS(SVG_NS, "polyline");
  line.setAttribute("class", "comimi-checkbox-check-line");
  line.setAttribute("points", "1.5 4.09 4.26 6.81 9.53 1.5");
  line.style.setProperty("--comimi-check-length", String(CHECK_STROKE_LENGTH));
  mask.append(line);

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("class", "comimi-checkbox-check-path");
  path.setAttribute("mask", `url(#${maskId})`);
  path.setAttribute(
    "d",
    "m.52,3.08c.59-.59,1.54-.59,2.12,0l1.6,1.6L8.48.44c.59-.59,1.54-.59,2.12,0s.59,1.54,0,2.12l-5.3,5.3c-.28.28-.66.44-1.06.44s-.78-.16-1.06-.44L.52,5.2c-.59-.59-.59-1.54,0-2.12Z"
  );

  svg.append(mask, path);
  return svg;
}

export interface RollingSwitchOption<T extends string> {
  value: T;
  label: string;
  icon: IconName;
}

// 2 択のアイコンスイッチ。インジケーターが転がって反対側へ移る（comugi UI の RollingIconSwitch）。
export class RollingIconSwitch<T extends string> {
  private root: HTMLDivElement;
  private indicator: HTMLSpanElement;
  private buttons: Array<{ value: T; button: HTMLButtonElement }> = [];
  private value?: T;

  constructor(
    options: readonly [RollingSwitchOption<T>, RollingSwitchOption<T>],
    onChange: (value: T) => void
  ) {
    this.root = document.createElement("div");
    this.root.className = "comimi-rolling-switch";
    this.root.setAttribute("role", "group");
    this.root.dataset.position = "first";

    this.indicator = document.createElement("span");
    this.indicator.className = "comimi-rolling-switch-indicator";
    this.indicator.addEventListener("animationend", () => {
      delete this.root.dataset.animation;
    });
    this.root.append(this.indicator);

    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "comimi-rolling-switch-button";
      button.setAttribute("aria-label", option.label);
      button.setAttribute("aria-pressed", "false");
      button.append(icon(option.icon));
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (option.value === this.value) {
          return;
        }
        this.root.dataset.animation = index === 0 ? "first" : "second";
        onChange(option.value);
      });
      this.root.append(button);
      this.buttons.push({ value: option.value, button });
    });
  }

  setLabels(labels: readonly [string, string]): void {
    this.buttons.forEach(({ button }, index) => {
      button.setAttribute("aria-label", labels[index]);
    });
  }

  setValue(value: T): void {
    this.value = value;
    this.root.dataset.position =
      value === this.buttons[0]?.value ? "first" : "second";
    for (const entry of this.buttons) {
      entry.button.setAttribute("aria-pressed", String(entry.value === value));
    }
  }

  getElement(): HTMLDivElement {
    return this.root;
  }
}

export class Selectbox {
  private root: HTMLDivElement;
  private select: HTMLSelectElement;
  private label: HTMLSpanElement;
  private options: SelectOption[] = [];

  constructor(onChange: (value: string | number) => void) {
    this.root = document.createElement("div");
    this.root.className = "comimi-selectbox";

    const bg = document.createElement("span");
    bg.className = "comimi-selectbox-bg";

    this.select = document.createElement("select");
    this.select.className = "comimi-selectbox-select";
    this.select.addEventListener("change", () => {
      const next = this.options.find(
        (opt) => String(opt.value) === this.select.value
      );
      if (next) onChange(next.value);
    });

    this.label = document.createElement("span");
    this.label.className = "comimi-selectbox-label";

    const arrowIcon = icon("arrow");
    arrowIcon.classList.add("comimi-selectbox-arrow");

    this.root.append(bg, this.select, this.label, arrowIcon);
  }

  setOptions(options: SelectOption[]): void {
    const currentValue = this.select.value;
    this.options = options;
    this.select.replaceChildren();
    for (const option of options) {
      const opt = document.createElement("option");
      opt.value = String(option.value);
      opt.textContent = option.label;
      this.select.append(opt);
    }
    if (currentValue) {
      this.setValue(currentValue);
    }
  }

  setValue(value: string | number): void {
    this.select.value = String(value);
    const matched = this.options.find(
      (opt) => String(opt.value) === String(value)
    );
    this.label.textContent = matched?.label ?? "";
  }

  getElement(): HTMLDivElement {
    return this.root;
  }
}

export class RangeSlider {
  private root: HTMLDivElement;
  private input: HTMLInputElement;
  private fill: HTMLDivElement;
  private valueLabel: HTMLSpanElement;
  private unit = "";
  private min = 0;
  private max = 100;

  constructor(onChange: (value: number) => void) {
    this.root = document.createElement("div");
    this.root.className = "comimi-range-slider";

    const rangeWrap = document.createElement("div");
    rangeWrap.className = "comimi-range-slider-wrap";

    const track = document.createElement("div");
    track.className = "comimi-range-slider-track";
    this.fill = document.createElement("div");
    this.fill.className = "comimi-range-slider-fill";
    this.fill.style.width = "0%";
    track.append(this.fill);

    this.input = document.createElement("input");
    this.input.className = "comimi-range-slider-input";
    this.input.type = "range";
    this.input.addEventListener("input", () =>
      onChange(Number(this.input.value))
    );

    rangeWrap.append(track, this.input);

    this.valueLabel = document.createElement("span");
    this.valueLabel.className = "comimi-range-slider-value";

    this.root.append(rangeWrap, this.valueLabel);
  }

  setRange(min: number, max: number, step = 1): void {
    this.min = min;
    this.max = max;
    this.input.min = String(min);
    this.input.max = String(max);
    this.input.step = String(step);
  }

  setUnit(unit: string): void {
    this.unit = unit;
    this.refreshLabel();
  }

  setValue(value: number): void {
    this.input.value = String(value);
    const progress =
      this.max === this.min
        ? 0
        : ((value - this.min) / (this.max - this.min)) * 100;
    this.fill.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    this.refreshLabel();
  }

  private refreshLabel(): void {
    this.valueLabel.textContent = `${this.input.value}${this.unit}`;
  }

  getElement(): HTMLDivElement {
    return this.root;
  }
}
