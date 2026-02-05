type RateRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateRecord>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  store.set(key, record);
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}
