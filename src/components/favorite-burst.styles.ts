export const favoriteBurstStyles = `
.comimi-favorite-burst {
  --comimi-burst-size: 34px;
  position: absolute;
  z-index: 6;
  width: var(--comimi-burst-size);
  height: var(--comimi-burst-size);
  transform: translate(-50%, -50%) scale(1.4);
  pointer-events: none;
}

.comimi-favorite-burst svg {
  display: block;
  overflow: visible;
}

.comimi-favorite-burst-deco {
  position: absolute;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
  opacity: 0;
  animation: comimi-favorite-fly 0.8s cubic-bezier(0.64, 0.08, 1, 0.97) both;
}

.comimi-favorite-burst-deco-heart {
  width: 100%;
  fill: var(--comimi-love);
  animation: comimi-favorite-move 0.8s cubic-bezier(0, 0.31, 0.18, 0.99) both;
}

.comimi-favorite-burst-deco-1 {
  animation-delay: 0.9s;
}
.comimi-favorite-burst-deco-1 .comimi-favorite-burst-deco-heart {
  --x: -100%;
  --y: 60%;
  --r: -10deg;
  animation-delay: 0.9s;
}

.comimi-favorite-burst-deco-2 {
  animation-delay: 0.4s;
}
.comimi-favorite-burst-deco-2 .comimi-favorite-burst-deco-heart {
  --x: -150%;
  --y: 60%;
  --r: -20deg;
  animation-delay: 0.4s;
}

.comimi-favorite-burst-deco-3 {
  animation-delay: 0.75s;
}
.comimi-favorite-burst-deco-3 .comimi-favorite-burst-deco-heart {
  --x: 80%;
  --y: 60%;
  --r: 10deg;
  animation-delay: 0.75s;
}

.comimi-favorite-burst-deco-4 {
  animation-delay: 0.5s;
}
.comimi-favorite-burst-deco-4 .comimi-favorite-burst-deco-heart {
  --x: 120%;
  --y: 60%;
  --r: 20deg;
  animation-delay: 0.5s;
}

.comimi-favorite-burst-deco-5 {
  animation-delay: 1.1s;
}
.comimi-favorite-burst-deco-5 .comimi-favorite-burst-deco-heart {
  --x: -10%;
  --y: 20%;
  --r: -4deg;
  animation-delay: 1.1s;
}

.comimi-favorite-burst-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  fill: none;
  stroke: var(--comimi-love);
  stroke-width: 0.1px;
  transform-box: fill-box;
  transform-origin: center;
  animation: comimi-favorite-ring 1s cubic-bezier(0.71, 0, 0.23, 0.99) 0.2s both;
}

.comimi-favorite-burst-fill {
  position: absolute;
  top: 5.3%;
  left: 0;
  width: 100%;
  height: 100%;
  fill: var(--comimi-love);
  transform-box: fill-box;
  transform-origin: center;
}

.comimi-favorite-burst[data-mode="add"] .comimi-favorite-burst-fill {
  animation: comimi-favorite-popup 0.7s ease-in-out 0.15s both;
}

.comimi-favorite-burst[data-mode="remove"] .comimi-favorite-burst-fill {
  animation: comimi-favorite-popout 0.3s ease-in-out 0s both;
}

@keyframes comimi-favorite-fly {
  from, to {
    opacity: 0;
  }
  30%, 70% {
    opacity: 0.6;
  }
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-200%);
  }
}

@keyframes comimi-favorite-move {
  to {
    transform: translate(var(--x), var(--y)) rotate(var(--r));
  }
}

@keyframes comimi-favorite-ring {
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  from {
    transform: translateY(4%) scale(1);
  }
  to {
    transform: translateY(4%) scale(1.8);
  }
}

@keyframes comimi-favorite-popup {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.6);
  }
  60% {
    transform: scale(1.04);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.04);
  }
}

@keyframes comimi-favorite-popout {
  0% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(0);
  }
}
`;
