/**
 * Dev-only file cache. Reads/writes JSON to .cache/ so we don't hammer the
 * Strava API during development. Cache entries expire after `maxAgeMs`.
 *
 * This uses Node.js `fs` — only call from API routes (server-side), never
 * from React components.
 */

import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

interface CacheEntry<T> {
  cachedAt: number; // Unix timestamp ms
  data: T;
}

export function readCache<T>(key: string, maxAgeMs: number): T | null {
  ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const entry = JSON.parse(raw) as CacheEntry<T>;

  if (Date.now() - entry.cachedAt > maxAgeMs) return null; // expired

  return entry.data;
}

export function writeCache<T>(key: string, data: T): void {
  ensureCacheDir();
  const filePath = path.join(CACHE_DIR, `${key}.json`);
  const entry: CacheEntry<T> = { cachedAt: Date.now(), data };
  fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
}
