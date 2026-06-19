import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  checkRateLimit,
  checkRateLimitWithRedisCommand,
} from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails when redis_url is not configured", async () => {
    await expect(
      checkRateLimit({
        key: "contact:test",
        limit: 1,
        windowMs: 60_000,
        now: 61_001,
      }),
    ).rejects.toThrow("redis_url must be configured for rate limiting.");
  });

  it("allows requests until the Redis count exceeds the limit", async () => {
    const commands: Array<Array<number | string>> = [];
    const runRedisCommand = vi.fn(async (command: Array<number | string>) => {
      commands.push(command);

      if (command[0] === "INCR") {
        return 1;
      }

      if (command[0] === "EXPIRE") {
        return 1;
      }

      throw new Error(`Unexpected command: ${command[0]}`);
    });

    const result = await checkRateLimitWithRedisCommand(
      {
        key: "contact:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        now: 1_000,
      },
      runRedisCommand,
    );

    expect(result).toEqual({
      allowed: true,
      limit: 2,
      remaining: 1,
      resetAt: 61_000,
      retryAfter: 60,
    });
    expect(commands).toEqual([
      ["INCR", "contact:203.0.113.10"],
      ["EXPIRE", "contact:203.0.113.10", 60],
    ]);
  });

  it("blocks requests after the Redis count exceeds the limit", async () => {
    const runRedisCommand = vi.fn(async (command: Array<number | string>) => {
      if (command[0] === "INCR") {
        return 3;
      }

      if (command[0] === "TTL") {
        return 42;
      }

      throw new Error(`Unexpected command: ${command[0]}`);
    });

    const result = await checkRateLimitWithRedisCommand(
      {
        key: "contact:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        now: 1_000,
      },
      runRedisCommand,
    );

    expect(result).toEqual({
      allowed: false,
      limit: 2,
      remaining: 0,
      resetAt: 43_000,
      retryAfter: 42,
    });
  });

  it("sets a new expiration when Redis returns no TTL", async () => {
    const commands: Array<Array<number | string>> = [];
    const runRedisCommand = vi.fn(async (command: Array<number | string>) => {
      commands.push(command);

      if (command[0] === "INCR") {
        return 2;
      }

      if (command[0] === "TTL") {
        return -1;
      }

      if (command[0] === "EXPIRE") {
        return 1;
      }

      throw new Error(`Unexpected command: ${command[0]}`);
    });

    const result = await checkRateLimitWithRedisCommand(
      {
        key: "contact:203.0.113.10",
        limit: 2,
        windowMs: 60_000,
        now: 1_000,
      },
      runRedisCommand,
    );

    expect(result.allowed).toBe(true);
    expect(result.retryAfter).toBe(60);
    expect(commands).toEqual([
      ["INCR", "contact:203.0.113.10"],
      ["TTL", "contact:203.0.113.10"],
      ["EXPIRE", "contact:203.0.113.10", 60],
    ]);
  });
});
