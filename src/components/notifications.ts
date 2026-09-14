import type { ViewerState } from "../types";

export class Notifications {
  private root: HTMLDivElement;
  private toasts = new Map<string, HTMLDivElement>();

  constructor() {
    this.root = document.createElement("div");
    this.root.className = "comimi-notifications";
  }

  getElement(): HTMLDivElement {
    return this.root;
  }

  update(state: ViewerState): void {
    const liveIds = new Set(state.notifications.map((n) => n.id));

    for (const [id, toast] of this.toasts) {
      if (!liveIds.has(id)) {
        toast.remove();
        this.toasts.delete(id);
      }
    }

    for (const notification of state.notifications) {
      const existing = this.toasts.get(notification.id);
      if (existing) {
        existing.dataset.tone = notification.tone ?? "info";
        const text = existing.querySelector(".comimi-toast-text");
        if (text) text.textContent = notification.message;
        continue;
      }

      const toast = document.createElement("div");
      toast.className = "comimi-toast";
      toast.dataset.tone = notification.tone ?? "info";

      const text = document.createElement("span");
      text.className = "comimi-toast-text";
      text.textContent = notification.message;

      toast.append(text);
      this.root.append(toast);
      this.toasts.set(notification.id, toast);
    }
  }
}
