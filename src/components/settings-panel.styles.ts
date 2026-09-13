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

.comimi-settings-sheet {
  position: absolute;
  inset: 0;
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
  visibility: hidden;
  pointer-events: none;
  transition:
    height 0.38s cubic-bezier(0.12, 1.06, 0.56, 1.02),
    opacity 0.38s cubic-bezier(0.12, 1.06, 0.56, 1.02),
    visibility 0s linear 0.38s;
}

.comimi-settings-layer[data-open="true"] .comimi-settings-panel {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  height: var(--comimi-settings-height, 460px);
  transition:
    height 0.38s cubic-bezier(0.12, 1.06, 0.56, 1.02),
    opacity 0.38s cubic-bezier(0.12, 1.06, 0.56, 1.02),
    visibility 0s linear 0s;
}

/* 右上の表示モード切替（top 20px + 58px）に 8px 残して重ならない高さまで。 */
.comimi-settings-panel-body {
  position: relative;
  width: 100%;
  max-height: calc(var(--view-height, 100vh) - 162px);
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

/* モバイルでは iOS のアクションシート風に画面下から出す。
   シート本体と閉じるボタンは 1 つのグループとして開閉・ドラッグする。 */
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

  .comimi-settings-sheet {
    inset: auto 8px calc(8px + env(safe-area-inset-bottom, 0px)) 8px;
    display: grid;
    row-gap: 8px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(96px);
    transition:
      transform 0.36s cubic-bezier(0.32, 0.72, 0, 1),
      opacity 0.2s linear,
      visibility 0s linear 0.36s;
  }

  .comimi-settings-layer[data-open="true"] .comimi-settings-sheet {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
    transition:
      transform 0.36s cubic-bezier(0.32, 0.72, 0, 1),
      opacity 0.2s linear,
      visibility 0s linear 0s;
  }

  .comimi-settings-sheet[data-dragging="true"],
  .comimi-settings-backdrop[data-dragging="true"] {
    transition: none;
  }

  .comimi-settings-panel,
  .comimi-settings-layer[data-open="true"] .comimi-settings-panel {
    position: relative;
    right: auto;
    bottom: auto;
    width: auto;
    height: auto;
    border-radius: 16px;
    opacity: 1;
    visibility: inherit;
    pointer-events: auto;
    transition: none;
  }

  .comimi-settings-grabber {
    display: block;
    position: relative;
    height: 22px;
    cursor: grab;
    touch-action: none;
  }

  .comimi-settings-grabber::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 50%;
    width: 36px;
    height: 5px;
    border-radius: 999px;
    background: var(--comimi-handle);
    transform: translateX(-50%);
  }

  .comimi-settings-sheet[data-dragging="true"] .comimi-settings-grabber {
    cursor: grabbing;
  }

  .comimi-settings-panel-body {
    max-height: calc(var(--view-height, 100vh) - 96px - env(safe-area-inset-bottom, 0px));
  }

  .comimi-settings-close {
    display: block;
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
  }
}
`;
