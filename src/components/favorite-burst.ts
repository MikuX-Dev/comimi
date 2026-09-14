const SVG_NS = "http://www.w3.org/2000/svg";

export const HEART_FILL_PATH =
  "M16.2857 3.2998C14.5714 3.2998 13.0476 4.05958 12 5.29422C10.9524 4.05958 9.33333 3.2998 7.61905 3.2998C4.57143 3.2998 2 5.86405 2 8.90316C2 9.0931 2 9.28304 2 9.47299C2.38095 14.1266 7.33333 18.0205 10.2857 19.8249C10.7619 20.1099 11.3333 20.2998 12 20.2998C12.5714 20.2998 13.1429 20.1099 13.7143 19.8249C16.6667 17.9255 21.619 14.1266 22 9.47299C22 9.28304 22 9.0931 22 8.90316C22 5.86405 19.4286 3.2998 16.2857 3.2998Z";

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
