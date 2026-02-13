import NodeCache from "node-cache";

class CacheManager {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300,
      checkperiod: 60,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  delete(key: string): number {
    return this.cache.del(key);
  }

  clearByPattern(pattern: string): number {
    const keys = this.cache.keys();
    const regex = new RegExp(pattern.replace("*", ".*"));
    const matchingKeys = keys.filter((key) => regex.test(key));

    if (matchingKeys.length > 0) {
      return this.cache.del(matchingKeys);
    }
    return 0;
  }

  flushAll(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

export const cacheManager = new CacheManager();