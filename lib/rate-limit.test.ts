import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, checkRateLimitWithStore } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails when REDIS_URL is not configured", async () => {
    await expect(
      checkRateLimit({
        key: "contact:test",
        limit: 1,
        windowMs: 60_000,
        now: 61_001,
      }),
    ).rejects.toThrow("REDIS_URL must be configured for rate limiting.");
  });

  it("allows requests until the Redis count exceeds the limit", async () => {
    const store = {
      increment: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
      ttl: vi.fn(),
    };

    const result = await checkRateLimitWithStore(
      {
        key: "contact:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        now: 1_000,
      },
      store,
    );

    expect(result).toEqual({
      allowed: true,
      limit: 2,
      remaining: 1,
      resetAt: 61_000,
      retryAfter: 60,
    });
    expect(store.increment).toHaveBeenCalledWith("contact:203.0.113.10");
    expect(store.expire).toHaveBeenCalledWith("contact:203.0.113.10", 60);
    expect(store.ttl).not.toHaveBeenCalled();
  });

  it("blocks requests after the Redis count exceeds the limit", async () => {
    const store = {
      increment: vi.fn().mockResolvedValue(3),
      expire: vi.fn(),
      ttl: vi.fn().mockResolvedValue(42),
    };

    const result = await checkRateLimitWithStore(
      {
        key: "contact:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        now: 1_000,
      },
      store,
    );

    expect(result).toEqual({
      allowed: false,
      limit: 2,
      remaining: 0,
      resetAt: 43_000,
      retryAfter: 42,
    });
    expect(store.increment).toHaveBeenCalledWith("contact:203.0.113.10");
    expect(store.ttl).toHaveBeenCalledWith("contact:203.0.113.10");
    expect(store.expire).not.toHaveBeenCalled();
  });

  it("sets a new expiration when Redis returns no TTL", async () => {
    const store = {
      increment: vi.fn().mockResolvedValue(2),
      expire: vi.fn().mockResolvedValue(1),
      ttl: vi.fn().mockResolvedValue(-1),
    };

    const result = await checkRateLimitWithStore(
      {
        key: "contact:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        now: 1_000,
      },
      store,
    );

    expect(result.allowed).toBe(true);
    expect(result.retryAfter).toBe(60);
    expect(store.increment).toHaveBeenCalledWith("contact:203.0.113.10");
    expect(store.ttl).toHaveBeenCalledWith("contact:203.0.113.10");
    expect(store.expire).toHaveBeenCalledWith("contact:203.0.113.10", 60);
  });
});
