export const settingsPanelStyles = `
.comimi-settings-backdrop,
.comimi-settings-close,
.comimi-settings-grabber {
  display: none;
}

.comimi-settings-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

/* デスクトップ: ドック右端の歯車ボタンの上に出るポップオーバー。
   ドック（bottom 24px / padding 20px / ボタン 24px）から位置を固定値で決める。 */
.comimi-settings-panel {
  position: absolute;
  right: 32px;
  bottom: 76px;
  width: 250px;
  height: 0;
  border-radius: 20px;
  overflow: hidden;
  background: var(--comimi-glass-strong);
  box-shadow: var(--comimi-shadow);
  backdrop-filter: blur(5px);
  opacity: 0;
  pointer-events: auto;
  transition:
    height 0.38s cubic-bezier(0.12, 1.06, 0.56, 1.02),
    opacity 0.38s cubic-bezier(0.12, 1.06, 0.56, 1.02);
}

.comimi-settings-layer[data-open="true"] .comimi-settings-panel {
  opacity: 1;
  height: var(--comimi-settings-height, 460px);
}

.comimi-settings-panel-body {
  position: relative;
  width: 100%;
  max-height: calc(var(--view-height, 100vh) - 62px - 56px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.comimi-settings-panel-inner {
  box-sizing: border-box;
  position: relative;
  padding: 0 20px;
}

.comimi-settings-header {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 12px;
  align-items: center;
}

.comimi-settings-panel-title {
  color: var(--comimi-fg);
  font-size: 14px;
  font-weight: 700;
}

.comimi-settings-section {
  display: grid;
  row-gap: 8px;
  margin-top: 18px;
}

.comimi-settings-label {
  color: var(--comimi-fg);
  font-size: 12px;
  font-weight: 400;
}

.comimi-settings-static-value {
  color: var(--comimi-soft);
  font-size: 13px;
  font-weight: 500;
}

/* モバイルでは iOS のアクションシート風に画面下から出す */
@media (max-width: 767px) {
  .comimi-settings-backdrop {
    display: block;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
  }

  .comimi-settings-layer[data-open="true"] .comimi-settings-backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  .comimi-settings-panel {
    position: absolute;
    right: 8px;
    bottom: calc(8px + 56px + env(safe-area-inset-bottom, 0px));
    left: 8px;
    width: auto;
    height: auto;
    border-radius: 16px;
    opacity: 0;
    transform: translateY(calc(100% + 80px));
    transition:
      transform 0.42s cubic-bezier(0.32, 0.72, 0, 1),
      opacity 0.2s linear;
  }

  .comimi-settings-layer[data-open="true"] .comimi-settings-panel {
    height: auto;
    opacity: 1;
    transform: translateY(0);
  }

  .comimi-settings-grabber {
    display: block;
    width: 36px;
    height: 5px;
    margin: 8px auto 4px;
    border-radius: 999px;
    background: var(--comimi-handle);
  }

  .comimi-settings-panel-body {
    max-height: calc(var(--view-height, 100vh) - 140px - env(safe-area-inset-bottom, 0px));
  }

  .comimi-settings-panel-inner {
    padding: 0 20px;
  }

  .comimi-settings-close {
    display: block;
    position: absolute;
    right: 8px;
    bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    left: 8px;
    box-sizing: border-box;
    height: 48px;
    padding: 0;
    border: 0;
    border-radius: 16px;
    background: var(--comimi-glass-strong);
    box-shadow: var(--comimi-shadow);
    backdrop-filter: blur(5px);
    color: var(--comimi-fg);
    font: inherit;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    opacity: 0;
    transform: translateY(calc(100% + 16px));
    pointer-events: none;
    transition:
      transform 0.42s cubic-bezier(0.32, 0.72, 0, 1),
      opacity 0.2s linear;
  }

  .comimi-settings-layer[data-open="true"] .comimi-settings-close {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

`;
