import { I18n } from "../i18n/i18n";
import type { MascotOption } from "../types";
import { renderComimiLogo } from "./comimi-logo";
import { buildMascotNode } from "./mascot";

export function renderSplashScreen(
  i18n: I18n,
  mascot?: MascotOption
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "comimi-splash";

  const logoWrap = document.createElement("div");
  logoWrap.className = "comimi-splash-logo-wrap";
  if (mascot) {
    logoWrap.classList.add("comimi-splash-logo-wrap-custom");
  }

  const logo = buildSplashLogo(mascot);
  if (logo) logoWrap.append(logo);

  const text = document.createElement("div");
  text.className = "comimi-splash-text";
  text.append(document.createTextNode(i18n.t("splash.loading")));
  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement("span");
    dot.textContent = ".";
    text.append(dot);
  }

  logoWrap.append(text);
  wrap.append(logoWrap);
  return wrap;
}

function buildSplashLogo(option?: MascotOption): HTMLElement | null {
  if (option === false) {
    return null;
  }

  const node = buildMascotNode(option);
  if (node) {
    const customLogo = document.createElement("div");
    customLogo.className = "comimi-splash-custom-logo";
    customLogo.append(node);
    return customLogo;
  }

  const logo = renderComimiLogo();
  logo.classList.add("comimi-splash-logo");
  return logo;
}
