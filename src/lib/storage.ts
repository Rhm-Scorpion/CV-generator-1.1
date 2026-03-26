class Storage {
  private _mem: Record<string, string> = {};
  public _available: boolean;

  constructor() {
    this._available = this._test();
  }

  private _test(): boolean {
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
      return true;
    } catch {
      return false;
    }
  }

  get(key: string): string | null {
    if (this._available) {
      try {
        return localStorage.getItem(key);
      } catch {
        /* fall through */
      }
    }
    return this._mem[key] ?? null;
  }

  set(key: string, value: string): void {
    if (this._available) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch {
        /* fall through */
      }
    }
    this._mem[key] = value;
  }

  remove(key: string): void {
    if (this._available) {
      try {
        localStorage.removeItem(key);
        return;
      } catch {
        /* fall through */
      }
    }
    delete this._mem[key];
  }
}

export const storage = new Storage();
