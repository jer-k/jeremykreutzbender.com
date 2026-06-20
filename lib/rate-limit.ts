import { createClient, type RedisClientType } from "@redis/client";

type CheckRateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

type RateLimitStore = {
  increment: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
  ttl: (key: string) => Promise<number>;
};

let redisClientPromise: Promise<RedisClientType> | undefined;

function getRedisUrl() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL must be configured for rate limiting.");
  }

  return redisUrl;
}

function getRedisClient() {
  if (!redisClientPromise) {
    const client = createClient({ url: getRedisUrl() });

    client.on("error", () => {
      // The Redis client manages reconnects; this listener prevents unhandled errors.
    });

    redisClientPromise = client.connect().catch((error) => {
      redisClientPromise = undefined;
      throw error;
    });
  }

  return redisClientPromise;
}

const redisRateLimitStore: RateLimitStore = {
  async increment(key) {
    const client = await getRedisClient();
    return client.incr(key);
  },
  async expire(key, seconds) {
    const client = await getRedisClient();
    return client.expire(key, seconds);
  },
  async ttl(key) {
    const client = await getRedisClient();
    return client.ttl(key);
  },
};

export async function checkRateLimitWithStore(
  { key, limit, windowMs, now = Date.now() }: CheckRateLimitOptions,
  store: RateLimitStore,
): Promise<RateLimitResult> {
  const windowSeconds = Math.ceil(windowMs / 1000);
  const count = await store.increment(key);
  let ttl = windowSeconds;

  if (count === 1) {
    await store.expire(key, windowSeconds);
  } else {
    ttl = await store.ttl(key);

    if (ttl < 0) {
      await store.expire(key, windowSeconds);
      ttl = windowSeconds;
    }
  }

  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(limit - count, 0),
    resetAt: now + ttl * 1000,
    retryAfter: ttl,
  };
}

export async function checkRateLimit(
  options: CheckRateLimitOptions,
): Promise<RateLimitResult> {
  return checkRateLimitWithStore(options, redisRateLimitStore);
}
