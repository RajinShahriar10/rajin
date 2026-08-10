const buckets = new Map<string, number[]>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function sweep() {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
    const alive = timestamps.filter((t) => now - t < WINDOW_MS);
    if (alive.length === 0) buckets.delete(key);
    else buckets.set(key, alive);
  }
}

/**
 * In-memory sliding-window rate limiter for the contact form. Fine for a
 * single-instance deployment; swap for a Redis-backed limiter if the app is
 * ever scaled horizontally. Each `check` removes stale entries, so the map
 * stays bounded by the number of distinct clients seen within the window.
 */
export function checkRateLimit(key: string): { allowed: boolean } {
  sweep();

  const now = Date.now();
  const timestamps = buckets.get(key) ?? [];
  const within = timestamps.filter((t) => now - t < WINDOW_MS);

  if (within.length >= MAX_REQUESTS) {
    buckets.set(key, within);
    return { allowed: false };
  }

  within.push(now);
  buckets.set(key, within);
  return { allowed: true };
}
