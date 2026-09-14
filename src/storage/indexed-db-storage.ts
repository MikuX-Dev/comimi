import type { ViewerSettings } from "../types";

type StoreName =
  | "settings"
  | "readingProgress"
  | "layout"
  | "mangaSettings"
  | "favorites";

export interface StorageOptions {
  enabled?: boolean;
  databaseName?: string;
}

export class IndexedDbStorage {
  private enabled: boolean;
  private databaseName: string;
  private dbPromise?: Promise<IDBDatabase>;

  constructor(options: StorageOptions = {}) {
    this.enabled = options.enabled !== false && typeof indexedDB !== "undefined";
    this.databaseName = options.databaseName ?? "manga-viewer";
  }

  async getSettings(): Promise<Partial<ViewerSettings> | undefined> {
    const record = await this.get<{ value: Partial<ViewerSettings> }>(
      "settings",
      "global"
    );
    return record?.value;
  }

  async saveSettings(settings: Partial<ViewerSettings>): Promise<void> {
    await this.put("settings", {
      id: "global",
      value: settings,
      updatedAt: Date.now()
    });
  }

  /** 作品ごとに保持する設定（pageTurnMode / hasCover / readingDirection 等）。 */
  async getMangaSettings(
    mangaId: string
  ): Promise<Partial<ViewerSettings> | undefined> {
    const record = await this.get<{ value: Partial<ViewerSettings> }>(
      "mangaSettings",
      mangaId
    );
    return record?.value;
  }

  async saveMangaSettings(
    mangaId: string,
    settings: Partial<ViewerSettings>
  ): Promise<void> {
    const existing = await this.getMangaSettings(mangaId);
    await this.put("mangaSettings", {
      mangaId,
      value: { ...existing, ...settings },
      updatedAt: Date.now()
    });
  }

  async getProgress(mangaId: string): Promise<number | undefined> {
    const record = await this.get<{ pageIndex: number }>(
      "readingProgress",
      mangaId
    );
    return record?.pageIndex;
  }

  async saveProgress(mangaId: string, pageIndex: number): Promise<void> {
    await this.put("readingProgress", {
      mangaId,
      pageIndex,
      updatedAt: Date.now()
    });
  }

  /** 作品ごとの「ここすき！」ページ id 一覧。 */
  async getFavorites(mangaId: string): Promise<string[] | undefined> {
    const record = await this.get<{ pageIds: string[] }>("favorites", mangaId);
    return record?.pageIds;
  }

  async saveFavorites(mangaId: string, pageIds: string[]): Promise<void> {
    await this.put("favorites", {
      mangaId,
      pageIds,
      updatedAt: Date.now()
    });
  }

  async saveLayout(layout: Record<string, unknown>): Promise<void> {
    await this.put("layout", {
      id: "global",
      value: layout,
      updatedAt: Date.now()
    });
  }

  async getLayout<T extends Record<string, unknown>>(): Promise<T | undefined> {
    const record = await this.get<{ value: T }>("layout", "global");
    return record?.value;
  }

  private async get<T>(storeName: StoreName, key: IDBValidKey): Promise<T | undefined> {
    if (!this.enabled) {
      return undefined;
    }

    const store = await this.store(storeName, "readonly");

    return requestToPromise<T | undefined>(store.get(key));
  }

  private async put(storeName: StoreName, value: unknown): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const store = await this.store(storeName, "readwrite");
    await requestToPromise(store.put(value));
  }

  private async delete(storeName: StoreName, key: IDBValidKey): Promise<void> {
    if (!this.enabled) {
      return;
    }

    const store = await this.store(storeName, "readwrite");
    await requestToPromise(store.delete(key));
  }

  private async store(
    storeName: StoreName,
    mode: IDBTransactionMode
  ): Promise<IDBObjectStore> {
    const db = await this.open();
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  private open(): Promise<IDBDatabase> {
    if (!this.enabled) {
      return Promise.reject(new Error("IndexedDB is not available"));
    }

    this.dbPromise ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, 3);

      request.onupgradeneeded = () => {
        const db = request.result;
        createStore(db, "settings", "id");
        createStore(db, "readingProgress", "mangaId");
        createStore(db, "layout", "id");
        createStore(db, "mangaSettings", "mangaId");
        createStore(db, "favorites", "mangaId");
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }
}

function createStore(
  db: IDBDatabase,
  storeName: StoreName,
  keyPath: string
): void {
  if (!db.objectStoreNames.contains(storeName)) {
    db.createObjectStore(storeName, { keyPath });
  }
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
