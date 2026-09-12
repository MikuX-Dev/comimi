export const comimiLogoStyles = `
.comimi-logo {
  --comimi-logo-ink: var(--comimi-white);
  --comimi-logo-body: var(--comimi-line);
  position: relative;
  width: 360px;
  aspect-ratio: 360 / 99;
}

.comimi-logo-symbol {
  position: absolute;
  top: 0;
  left: 0;
  width: 113px;
  display: block;
  overflow: visible;
}

.comimi-logo-typo-wrap {
  position: absolute;
  right: 7px;
  bottom: 11px;
  width: 229.5px;
}

.comimi-logo-typo {
  display: block;
  width: 100%;
  overflow: visible;
}

.comimi-logo-letter {
  fill: var(--comimi-logo-ink);
}

.comimi-logo-body {
  fill: var(--comimi-logo-body);
}

.comimi-logo-stroke {
  fill: none;
  stroke: var(--comimi-logo-ink);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 10px;
}

.comimi-logo-mimi {
  transform-origin: 56px 43px;
}

.comimi-logo-mimi-left {
  animation: comimi-logo-mimi-left 0.4s ease-in-out 0.3s 2 forwards;
}

.comimi-logo-mimi-right {
  animation: comimi-logo-mimi-right 0.4s ease-in-out 0.3s 2 forwards;
}

.comimi-logo-eyes {
  transform: translateX(-7px);
}

.comimi-logo-eye {
  fill: var(--comimi-logo-ink);
  transform-origin: center;
  transform-box: fill-box;
  animation: comimi-logo-eye 0.4s ease-in-out 0.2s forwards;
}

.comimi-logo-heart {
  --size: 14px;
  position: absolute;
  top: -20px;
  width: var(--size);
  height: var(--size);
}

.comimi-logo-heart::before,
.comimi-logo-heart::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150%;
  border-radius: 999px;
  background-color: var(--comimi-logo-ink);
  transform-origin: center bottom;
}

.comimi-logo-heart::before {
  transform: translateX(-32%) rotate(45deg);
}

.comimi-logo-heart::after {
  transform: translateX(32%) rotate(-45deg);
}

.comimi-logo-heart-1 {
  right: -2px;
}

.comimi-logo-heart-2 {
  right: 76px;
}

@keyframes comimi-logo-mimi-left {
  from, to {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

@keyframes comimi-logo-mimi-right {
  from, to {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-20deg);
  }
}

@keyframes comimi-logo-eye {
  from, to {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.2);
  }
}
`;
