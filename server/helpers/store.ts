export default class Store<T> {
  private readonly store: Map<string, T>
  private keysCache: string[]

  constructor() {
    this.store = new Map<string, T>()
    this.keysCache = []
  }

  private clearCacheKeys(): void {
    this.keysCache = []
  }

  public save(key: string, data: T): void {
    this.store.set(key, data)
    this.clearCacheKeys()
  }

  public get(key: string): T | undefined {
    return this.store.get(key)
  }

  public remove(key: string): void {
    this.store.delete(key)
    this.clearCacheKeys()
  }

  public clear(): void {
    this.store.clear()
    this.clearCacheKeys()
  }

  public has(key: string): boolean {
    return this.store.has(key)
  }

  public get keys(): string[] {
    if (this.keysCache.length) {
      return this.keysCache
    }

    const keys: string[] = []
    for (const key of this.store.keys()) {
      keys.push(key)
    }
    this.keysCache = keys
    return keys
  }
}
