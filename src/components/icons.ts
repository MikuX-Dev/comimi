export type IconName =
  | "arrow"
  | "check"
  | "close"
  | "default"
  | "fullscreen"
  | "menu"
  | "one"
  | "pause"
  | "play"
  | "settings"
  | "two"
  | "wide";

export function icon(name: IconName, className?: string): Element {
  switch (name) {
    case "arrow":
      return svg("0 0 20 20", [
        path("M7.28685 6.64194L10.7742 10.0838L7.3011 13.3098C7.06547 13.5391 6.9336 13.8467 6.9336 14.1669C6.9336 14.4871 7.06547 14.7945 7.3011 15.0239C7.41902 15.1378 7.55971 15.2282 7.7149 15.29C7.87009 15.3517 8.03669 15.3835 8.20498 15.3835C8.37328 15.3835 8.53987 15.3517 8.69506 15.29C8.85025 15.2282 8.99095 15.1378 9.10887 15.0239L13.4787 10.9746C13.7134 10.7475 13.845 10.4422 13.845 10.1243C13.845 9.80629 13.7134 9.50107 13.4787 9.27399L9.10886 4.96826C8.86878 4.74159 8.54377 4.61426 8.20498 4.61426C7.86619 4.61426 7.54118 4.74159 7.3011 4.96826C7.18102 5.08007 7.08568 5.2134 7.02057 5.36056C6.95546 5.50772 6.92188 5.6657 6.92188 5.82528C6.92188 5.98487 6.95546 6.14293 7.02057 6.29009C7.08568 6.43725 7.18102 6.57058 7.3011 6.68239L7.28685 6.64194Z")
      ], className);
    case "check":
      return svg("0 0 20 20", [
        path("M16.2071 5.29289C16.5976 5.68342 16.5976 6.31658 16.2071 6.70711L8.70711 14.2071C8.31658 14.5976 7.68342 14.5976 7.29289 14.2071L3.79289 10.7071C3.40237 10.3166 3.40237 9.68342 3.79289 9.29289C4.18342 8.90237 4.81658 8.90237 5.20711 9.29289L8 12.0858L14.7929 5.29289C15.1834 4.90237 15.8166 4.90237 16.2071 5.29289Z")
      ], className);
    case "default":
      return svg("0 0 20 20", [rect("1", "4", "18", "12", "3")], className);
    case "wide":
      return svg("0 0 20 20", [
        rect("1", "2.5", "18", "15", "3"),
        path("M5.5719 6.31811C5.88754 6.00907 6.39381 6.01422 6.70294 6.3298C7.01206 6.64539 7.00674 7.15165 6.69124 7.46084L5.06993 9.04896L14.7642 9.16988L13.1761 7.54857C12.867 7.23293 12.8722 6.72667 13.1878 6.41754C13.5034 6.10841 14.0096 6.11374 14.3188 6.42923L17.2579 9.42977C17.5671 9.7454 17.5619 10.2516 17.2462 10.5608L14.2457 13.4999C13.93 13.809 13.4238 13.8038 13.1146 13.4882C12.8055 13.1726 12.8109 12.6664 13.1263 12.3572L14.7477 10.7691L5.0534 10.6481L6.64152 12.2695C6.95055 12.5851 6.94541 13.0914 6.62982 13.4005C6.31424 13.7096 5.80797 13.7043 5.49879 13.3888L2.55967 10.3883C2.2505 10.0726 2.25573 9.5664 2.57136 9.25723L5.5719 6.31811Z")
      ], className);
    case "fullscreen":
      return svg("0 0 20 20", [
        rect("1", "1", "18", "18", "3"),
        path("M8.69922 3.7002C9.14096 3.7003 9.49902 4.05824 9.49902 4.5C9.49902 4.94176 9.14096 5.2997 8.69922 5.2998H6.42969L14.6992 13.5693V11.2998C14.6993 10.8581 15.0573 10.5 15.499 10.5C15.9408 10.5 16.2987 10.8581 16.2988 11.2998V15.5C16.2988 15.9418 15.9409 16.2998 15.499 16.2998H11.2988C10.8571 16.2997 10.499 15.9418 10.499 15.5C10.499 15.0582 10.8571 14.7003 11.2988 14.7002H13.5684L5.29883 6.43066V8.7002C5.29872 9.14193 4.94079 9.5 4.49902 9.5C4.05726 9.5 3.69932 9.14193 3.69922 8.7002V4.5C3.69922 4.05817 4.0572 3.7002 4.49902 3.7002H8.69922Z")
      ], className);
    case "one":
      return svg("0 0 20 20", [
        rect("1", "2", "18", "16", "3"),
        filledRect("6", "4", "8", "12", "1.5")
      ], className);
    case "two":
      return svg("0 0 20 20", [
        rect("1", "2", "18", "16", "3"),
        path("M3 5.5C3 4.67157 3.67157 4 4.5 4H9.5V16H4.5C3.67157 16 3 15.3284 3 14.5V5.5Z"),
        path("M10.5 4H15.5C16.3284 4 17 4.67157 17 5.5V14.5C17 15.3284 16.3284 16 15.5 16H10.5V4Z")
      ], className);
    case "play":
      return svg("0 0 20 20", [path("M17.0385 7.78428L6.49809 1.19667C4.68077 0.190227 2.5 1.37966 2.5 3.48403V16.5678C2.5 18.5806 4.68077 19.8616 6.49809 18.7636L17.0385 12.176C18.7649 11.1696 18.7649 8.79072 17.0385 7.78428Z")], className);
    case "pause":
      return svg("0 0 20 20", [
        path("M6.14289 18.3332H4.68573C3.47144 18.3332 2.5 17.3332 2.5 16.0832V3.9165C2.5 2.6665 3.47144 1.6665 4.68573 1.6665H6.14289C7.35718 1.6665 8.32862 2.6665 8.32862 3.9165V15.9998C8.40957 17.3332 7.43814 18.3332 6.14289 18.3332Z"),
        path("M15.3138 18.3332H13.8555C12.6402 18.3332 11.668 17.3332 11.668 16.0832V3.9165C11.668 2.6665 12.6402 1.6665 13.8555 1.6665H15.3138C16.5291 1.6665 17.5013 2.6665 17.5013 3.9165V15.9998C17.5013 17.3332 16.5291 18.3332 15.3138 18.3332Z")
      ], className);
    case "settings":
      return svg("0 0 24 24", [path("M10.0144 1.34782C11.2164 0.658798 12.6836 0.658798 13.8856 1.34782C13.8947 1.35299 13.9036 1.35831 13.9125 1.36376L20.1001 5.17383C21.3211 5.88071 22 7.15791 22 8.54376V15.56C22 16.9 21.3552 18.2127 20.1836 18.8369L14.0125 22.6368C14.0036 22.6423 13.9947 22.6476 13.9856 22.6527C12.7836 23.3418 11.3164 23.3418 10.1144 22.6527C10.1053 22.6476 10.0964 22.6423 10.0875 22.6368L3.89984 18.8267C2.67884 18.1198 2 16.8426 2 15.4568V8.54376C2 7.15919 2.6776 5.88306 3.8965 5.17578L9.98139 1.36758C9.99225 1.36078 10.0032 1.35419 10.0144 1.34782ZM11.0006 3.14323L4.91861 6.94964C4.90775 6.95644 4.89675 6.96302 4.88564 6.96939C4.31578 7.29605 4 7.87148 4 8.54376V15.4568C4 16.1291 4.31578 16.7045 4.88564 17.0312C4.89466 17.0364 4.9036 17.0417 4.91246 17.0471L11.0978 20.8558C11.6895 21.1893 12.4105 21.1893 13.0022 20.8558L19.1875 17.0471C19.2088 17.034 19.2306 17.0217 19.2528 17.0103C19.6582 16.8011 20 16.2698 20 15.56V8.54376C20 7.87148 19.6842 7.29605 19.1144 6.96939C19.1053 6.96422 19.0964 6.95891 19.0875 6.95346L12.9022 3.14482C12.3115 2.8118 11.5918 2.81127 11.0006 3.14323ZM12 9.8851C10.8402 9.8851 9.89999 10.8552 9.89999 12.0519C9.89999 13.2486 10.8402 14.2187 12 14.2187C13.1598 14.2187 14.1 13.2486 14.1 12.0519C14.1 10.8552 13.1598 9.8851 12 9.8851ZM7.89999 12.0519C7.89999 9.7155 9.73563 7.8215 12 7.8215C14.2644 7.8215 16.1 9.7155 16.1 12.0519C16.1 14.3883 14.2644 16.2823 12 16.2823C9.73563 16.2823 7.89999 14.3883 7.89999 12.0519Z")], className);
    case "menu":
      return menuIcon(className);
    case "close":
      return closeIcon(className);
  }
}

function svg(viewBox: string, children: SVGElement[], className?: string): SVGSVGElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  element.setAttribute("viewBox", viewBox);
  element.setAttribute("fill", "none");
  element.classList.add("comimi-icon");
  if (className) element.classList.add(className);
  element.append(...children);
  return element;
}

function path(d: string): SVGPathElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
  element.setAttribute("d", d);
  element.classList.add("comimi-icon-fill");
  return element;
}

function rect(x: string, y: string, width: string, height: string, rx: string): SVGRectElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  element.setAttribute("x", x);
  element.setAttribute("y", y);
  element.setAttribute("width", width);
  element.setAttribute("height", height);
  element.setAttribute("rx", rx);
  element.classList.add("comimi-icon-stroke");
  return element;
}

function filledRect(x: string, y: string, width: string, height: string, rx: string): SVGRectElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  element.setAttribute("x", x);
  element.setAttribute("y", y);
  element.setAttribute("width", width);
  element.setAttribute("height", height);
  element.setAttribute("rx", rx);
  element.classList.add("comimi-icon-fill");
  return element;
}

function menuIcon(className?: string): HTMLElement {
  const wrapper = document.createElement("span");
  wrapper.className = `comimi-menu-svg ${className ?? ""}`.trim();
  for (let index = 0; index < 3; index += 1) wrapper.append(document.createElement("span"));
  return wrapper;
}

function closeIcon(className?: string): HTMLElement {
  const wrapper = document.createElement("span");
  wrapper.className = `comimi-close-svg ${className ?? ""}`.trim();
  wrapper.append(document.createElement("span"), document.createElement("span"));
  return wrapper;
}
