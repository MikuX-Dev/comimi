export const splashScreenStyles = `
.comimi-splash {
  position: absolute;
  inset: 0;
  z-index: 10;
  background-color: var(--comimi-line);
  overflow: hidden;
  animation: comimi-splash-clip 1s cubic-bezier(0.82, 0.01, 0.48, 1.02) 0.4s both;
  pointer-events: none;
}

.comimi-splash-logo-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 260px;
  aspect-ratio: 290 / 99;
}

.comimi-splash-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.72);
}

.comimi-splash-logo-wrap-custom {
  width: 120px;
  aspect-ratio: 1 / 1;
}

.comimi-splash-logo-wrap-custom .comimi-splash-text {
  transform: translate(-50%, calc(100% + 16px));
}

.comimi-splash-custom-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  aspect-ratio: 1 / 1;
}

.comimi-splash-custom-logo > * {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.comimi-splash-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 120%);
  color: var(--comimi-white);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
  white-space: nowrap;
}

.comimi-splash-text span {
  display: inline-block;
  animation: comimi-splash-dot 0.8s ease-in-out 0s infinite both;
}

.comimi-splash-text span:nth-child(1) {
  animation-delay: 0s;
}

.comimi-splash-text span:nth-child(2) {
  animation-delay: 0.15s;
}

.comimi-splash-text span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes comimi-splash-clip {
  from {
    clip-path: circle(75%);
  }
  to {
    clip-path: circle(0%);
  }
}

@keyframes comimi-splash-dot {
  from, 50%, to {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
}
`;
