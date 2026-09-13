export const inputsStyles = `
.comimi-selectbox {
  position: relative;
  display: inline-block;
  width: 100%;
}

.comimi-selectbox-bg {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: var(--comimi-surface-2);
  transition: inset 0.36s var(--comimi-spring);
}

@media (hover: hover) {
  .comimi-selectbox:hover .comimi-selectbox-bg {
    inset: -3px;
  }
}

.comimi-selectbox-select {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  color: transparent;
  font: inherit;
  cursor: pointer;
  opacity: 0;
}

.comimi-selectbox-select:disabled {
  cursor: not-allowed;
}

.comimi-selectbox-select option {
  color: var(--comimi-fg);
  background-color: var(--comimi-panel);
}

.comimi-selectbox-label {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 32px 8px 12px;
  color: var(--comimi-fg);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
  cursor: pointer;
  pointer-events: none;
}

.comimi-selectbox-arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  z-index: 1;
  width: 16px;
  height: 16px;
  color: var(--comimi-faint);
  transform: translateY(-50%) rotate(90deg);
  pointer-events: none;
}

@media (hover: hover) {
  .comimi-selectbox:hover .comimi-selectbox-arrow {
    animation: comimi-selectbox-arrow 0.5s ease-in-out 0s both;
  }
}

@keyframes comimi-selectbox-arrow {
  from, to {
    transform: translateY(-50%) rotate(90deg);
  }
  40% {
    transform: translateY(calc(-50% + 3px)) rotate(90deg);
  }
  70% {
    transform: translateY(calc(-50% - 1.5px)) rotate(90deg);
  }
}

.comimi-checkbox {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 8px;
  align-items: center;
  width: 100%;
  padding: 2px;
  cursor: pointer;
}

.comimi-checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.comimi-checkbox-box {
  --comimi-checkbox-size: 20px;
  --comimi-checkbox-radius: 7px;
  position: relative;
  display: block;
  width: var(--comimi-checkbox-size);
  height: var(--comimi-checkbox-size);
  transition: transform 0.36s var(--comimi-spring);
}

@media (hover: hover) {
  .comimi-checkbox:hover .comimi-checkbox-box {
    transform: scale(1.1);
  }
}

.comimi-checkbox-stroke {
  box-sizing: border-box;
  position: absolute;
  inset: 0;
  border: 3px solid var(--comimi-line);
  border-radius: var(--comimi-checkbox-radius);
}

.comimi-checkbox-input:focus-visible + .comimi-checkbox-box .comimi-checkbox-stroke {
  outline: 2px solid var(--comimi-faint);
  outline-offset: 2px;
}

.comimi-checkbox-bg {
  position: absolute;
  inset: 0;
  border-radius: var(--comimi-checkbox-radius);
  background: var(--comimi-muted);
  transform: scale(0);
  transition: transform 0.14s ease-in-out 0s;
}

.comimi-checkbox-input:checked + .comimi-checkbox-box .comimi-checkbox-bg {
  transform: scale(1);
}

.comimi-checkbox-check {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9px;
  overflow: visible;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0s linear 0.4s;
}

.comimi-checkbox-input:checked + .comimi-checkbox-box .comimi-checkbox-check {
  opacity: 1;
  transition: opacity 0s linear 0.05s;
}

.comimi-checkbox-check-path {
  fill: var(--comimi-white);
}

.comimi-checkbox-check-line {
  fill: none;
  stroke: #fff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3px;
  stroke-dasharray: 0 var(--comimi-check-length);
  transition: stroke-dasharray 0.35s ease-in-out 0.05s;
}

.comimi-checkbox-input:checked + .comimi-checkbox-box .comimi-checkbox-check-line {
  stroke-dasharray: var(--comimi-check-length) var(--comimi-check-length);
}

.comimi-checkbox-label {
  color: var(--comimi-fg);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.45;
}

.comimi-rolling-switch {
  --comimi-rolling-cell: 32px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, var(--comimi-rolling-cell));
  width: calc(var(--comimi-rolling-cell) * 2);
  height: var(--comimi-rolling-cell);
  border-radius: 10px;
  background: var(--comimi-surface-2);
  color: var(--comimi-muted);
}

.comimi-rolling-switch-indicator {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--comimi-rolling-cell);
  border-radius: 10px;
  background: var(--comimi-muted);
}

.comimi-rolling-switch[data-position="second"] .comimi-rolling-switch-indicator {
  transform: translateX(100%);
}

.comimi-rolling-switch[data-animation="first"] .comimi-rolling-switch-indicator {
  transform-origin: left bottom;
  animation: comimi-roll-to-first 0.4s ease-out both;
}

.comimi-rolling-switch[data-animation="second"] .comimi-rolling-switch-indicator {
  transform-origin: right bottom;
  animation: comimi-roll-to-second 0.4s ease-out both;
}

.comimi-rolling-switch-button {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: var(--comimi-rolling-cell);
  height: var(--comimi-rolling-cell);
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: color 0.15s ease-out;
}

.comimi-rolling-switch-button[aria-pressed="true"] {
  color: var(--comimi-white);
}

.comimi-rolling-switch-button > svg {
  width: 16px;
  height: 16px;
}

.comimi-rolling-switch:has(.comimi-rolling-switch-button:focus-visible) {
  outline: 2px solid var(--comimi-faint);
  outline-offset: 2px;
}

@keyframes comimi-roll-to-second {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(90deg);
  }
  50.1% {
    transform: translateX(100%);
  }
  75% {
    transform: translateX(100%) rotate(8deg);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes comimi-roll-to-first {
  0% {
    transform: translateX(100%) rotate(0deg);
  }
  50% {
    transform: translateX(100%) rotate(-90deg);
  }
  50.1% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(0) rotate(-8deg);
  }
  100% {
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .comimi-checkbox-bg,
  .comimi-checkbox-check-line {
    transition: none;
  }
  .comimi-rolling-switch-indicator {
    animation-duration: 0.01ms;
  }
}

.comimi-range-slider {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 8px;
  align-items: center;
  width: 100%;
}

.comimi-range-slider[data-disabled="true"] {
  opacity: 0.6;
}

.comimi-range-slider-wrap {
  position: relative;
  display: grid;
  align-items: center;
  min-width: 0;
  height: 18px;
}

.comimi-range-slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  border-radius: 999px;
  background: var(--comimi-surface-2);
  overflow: hidden;
  transform: translateY(-50%);
  transition: height 0.36s var(--comimi-spring);
}

@media (hover: hover) {
  .comimi-range-slider-wrap:hover .comimi-range-slider-track {
    height: 10px;
  }
}

.comimi-range-slider-fill {
  display: block;
  height: 100%;
  background: var(--comimi-muted);
  border-radius: inherit;
}

.comimi-range-slider-input {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 18px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.comimi-range-slider-input::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
  border: 0;
}

.comimi-range-slider-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  margin-top: -6px;
  border: 0;
  border-radius: 50%;
  background: var(--comimi-muted);
  box-shadow: none;
  transition:
    transform 0.36s var(--comimi-spring),
    background-color 0.2s ease-in-out;
}

.comimi-range-slider-input:hover:not(:disabled)::-webkit-slider-thumb {
  transform: scale(1.15);
}

.comimi-range-slider-input::-moz-range-track {
  height: 6px;
  background: transparent;
  border: 0;
}

.comimi-range-slider-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: var(--comimi-muted);
  box-shadow: none;
  transition:
    transform 0.36s var(--comimi-spring),
    background-color 0.2s ease-in-out;
}

.comimi-range-slider-input:hover:not(:disabled)::-moz-range-thumb {
  transform: scale(1.15);
}

.comimi-range-slider-input:focus-visible {
  outline: none;
}

.comimi-range-slider-input:focus-visible::-webkit-slider-thumb {
  box-shadow: none;
}

.comimi-range-slider-input:focus-visible::-moz-range-thumb {
  box-shadow: none;
}

.comimi-range-slider-value {
  width: 36px;
  color: var(--comimi-muted);
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  text-align: right;
  white-space: nowrap;
}
`;
