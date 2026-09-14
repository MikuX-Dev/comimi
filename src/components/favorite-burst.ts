const SVG_NS = "http://www.w3.org/2000/svg";

export const HEART_FILL_PATH =
  "M16.2857 3.2998C14.5714 3.2998 13.0476 4.05958 12 5.29422C10.9524 4.05958 9.33333 3.2998 7.61905 3.2998C4.57143 3.2998 2 5.86405 2 8.90316C2 9.0931 2 9.28304 2 9.47299C2.38095 14.1266 7.33333 18.0205 10.2857 19.8249C10.7619 20.1099 11.3333 20.2998 12 20.2998C12.5714 20.2998 13.1429 20.1099 13.7143 19.8249C16.6667 17.9255 21.619 14.1266 22 9.47299C22 9.28304 22 9.0931 22 8.90316C22 5.86405 19.4286 3.2998 16.2857 3.2998Z";

const HEART_STROKE_PATH =
  "M16.3 4.6001C14.6 4.6001 13.1 5.28796 12 6.56541C10.9 5.28796 9.4 4.6001 7.7 4.6001C4.6 4.6001 2 7.15501 2 10.2013C2 10.3978 2 10.5943 2 10.7909C2.4 15.4094 7.4 19.2417 10.3 21.1088C10.8 21.4036 11.4 21.6001 12 21.6001C12.6 21.6001 13.2 21.4036 13.7 21.1088C16.6 19.2417 21.6 15.4094 22 10.8891C22 10.6926 22 10.4961 22 10.2995C22 7.15501 19.4 4.6001 16.3 4.6001ZM20 10.5943C19.7 14.525 14.7 18.0625 12.6 19.34C12.2 19.5365 11.8 19.5365 11.4 19.34C9.3 17.9643 4.4 14.4267 4 10.4961C4 10.4961 4 10.2995 4 10.2013C4 8.23593 5.7 6.56541 7.7 6.56541C9.2 6.56541 10.5 7.44981 11.1 8.72726C11.2 9.12033 11.6 9.31686 12 9.31686C12.4 9.31686 12.8 9.12033 12.9 8.72726C13.5 7.44981 14.8 6.56541 16.3 6.56541C18.3 6.56541 20 8.23593 20 10.2013C20 10.2995 20 10.4961 20 10.5943Z";

const ADD_DURATION_MS = 2000;
const REMOVE_DURATION_MS = 500;

export function heartSvg(
  d: string,
  className: string,
  viewBox = "0 0 24 25"
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("class", className);
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", d);
  svg.append(path);
  return svg;
}

/**
 * 「ここすき！」登録時のハート演出。指定座標（ルート基準 px）に出し、
 * 再生が終わったら自身を取り除く。
 */
export function renderFavoriteBurst(
  x: number,
  y: number,
  mode: "add" | "remove"
): HTMLDivElement {
  const root = document.createElement("div");
  root.className = "comimi-favorite-burst";
  root.dataset.mode = mode;
  root.style.left = `${x}px`;
  root.style.top = `${y}px`;

  root.append(heartSvg(HEART_STROKE_PATH, "comimi-favorite-burst-stroke"));

  if (mode === "add") {
    for (let index = 1; index <= 5; index += 1) {
      const deco = document.createElement("div");
      deco.className = `comimi-favorite-burst-deco comimi-favorite-burst-deco-${index}`;
      deco.append(heartSvg(HEART_FILL_PATH, "comimi-favorite-burst-deco-heart"));
      root.append(deco);
    }
    root.append(heartSvg(HEART_FILL_PATH, "comimi-favorite-burst-ring"));
  }

  root.append(heartSvg(HEART_FILL_PATH, "comimi-favorite-burst-fill"));

  window.setTimeout(
    () => root.remove(),
    mode === "add" ? ADD_DURATION_MS : REMOVE_DURATION_MS
  );
  return root;
}
