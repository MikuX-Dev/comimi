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

const DB_VERSION = 3;
// onblocked が発火しない環境があるため、open はこの時間で打ち切る。
const OPEN_TIMEOUT_MS = 3000;

/**
 * IndexedDB による永続化。付加機能なので、DB が開けない・壊れている場合でも
 * 公開メソッドは reject せず undefined を返し、ビューワーの描画を止めない。
 */
export class IndexedDbStorage {
  private enabled: boolean;
  private databaseName: string;
  private dbPromise?: Promise<IDBDatabase>;
  private warned = false;

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
    try {
      const store = await this.store(storeName, "readonly");
      return await requestToPromise<T | undefined>(store.get(key));
    } catch (error) {
      this.warn(error);
      return undefined;
    }
  }

  private async put(storeName: StoreName, value: unknown): Promise<void> {
    if (!this.enabled) {
      return;
    }
    try {
      const store = await this.store(storeName, "readwrite");
      await requestToPromise(store.put(value));
    } catch (error) {
      this.warn(error);
    }
  }

  private async delete(storeName: StoreName, key: IDBValidKey): Promise<void> {
    if (!this.enabled) {
      return;
    }
    try {
      const store = await this.store(storeName, "readwrite");
      await requestToPromise(store.delete(key));
    } catch (error) {
      this.warn(error);
    }
  }

  private warn(error: unknown): void {
    if (this.warned) {
      return;
    }
    this.warned = true;
    console.warn(
      "[comimi] IndexedDB is unavailable; settings and progress will not be persisted.",
      error
    );
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

    this.dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, DB_VERSION);
      const timer = window.setTimeout(() => {
        reject(
          new Error(
            "IndexedDB open timed out (blocked by another tab holding an older version?)"
          )
        );
      }, OPEN_TIMEOUT_MS);

      request.onupgradeneeded = () => {
        const db = request.result;
        createStore(db, "settings", "id");
        createStore(db, "readingProgress", "mangaId");
        createStore(db, "layout", "id");
        createStore(db, "mangaSettings", "mangaId");
        createStore(db, "favorites", "mangaId");
      };

      // 旧バージョンを掴んだ別タブがいると upgrade が始まらない。待たずに諦める。
      request.onblocked = () => {
        window.clearTimeout(timer);
        reject(new Error("IndexedDB upgrade blocked by another connection"));
      };
      request.onerror = () => {
        window.clearTimeout(timer);
        reject(request.error);
      };
      request.onsuccess = () => {
        window.clearTimeout(timer);
        const db = request.result;
        // 別タブが新しいバージョンへ更新しようとしたら接続を閉じて道を譲る。
        db.onversionchange = () => {
          db.close();
          this.dbPromise = undefined;
        };
        resolve(db);
      };
    }).catch((error: unknown) => {
      // 失敗した接続をキャッシュしない（次の呼び出しで再試行できるようにする）。
      this.dbPromise = undefined;
      throw error;
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
