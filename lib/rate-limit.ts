import net from "node:net";
import tls from "node:tls";

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

type RedisCommand = (command: Array<number | string>) => Promise<number>;

type RedisConnection = net.Socket | tls.TLSSocket;

const COMMAND_TIMEOUT_MS = 5_000;

function getRedisUrl() {
  return process.env.redis_url;
}

function encodeRedisCommand(command: Array<number | string>) {
  const parts = command.map((part) => String(part));

  return `*${parts.length}\r\n${parts
    .map((part) => `$${Buffer.byteLength(part)}\r\n${part}\r\n`)
    .join("")}`;
}

function parseRedisResponse(response: string) {
  const prefix = response[0];
  const value = response.slice(1).split("\r\n")[0];

  if (prefix === ":") {
    return parseInt(value);
  }

  if (prefix === "+") {
    return value;
  }

  if (prefix === "-") {
    throw new Error(value);
  }

  throw new Error(`Unexpected Redis response: ${response}`);
}

function createConnection(redisUrl: URL) {
  const port = redisUrl.port
    ? parseInt(redisUrl.port)
    : redisUrl.protocol === "rediss:"
      ? 6380
      : 6379;
  const connectionOptions = {
    host: redisUrl.hostname,
    port,
  };

  if (redisUrl.protocol === "rediss:") {
    return tls.connect({
      ...connectionOptions,
      servername: redisUrl.hostname,
    });
  }

  return net.connect(connectionOptions);
}

function waitForConnection(connection: RedisConnection) {
  if (!connection.connecting) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    connection.once("connect", resolve);
    connection.once("secureConnect", resolve);
    connection.once("error", reject);
  });
}

async function writeRedisCommand(
  connection: RedisConnection,
  command: Array<number | string>,
) {
  return new Promise<string>((resolve, reject) => {
    let response = "";
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Redis command timed out."));
    }, COMMAND_TIMEOUT_MS);

    function cleanup() {
      clearTimeout(timeout);
      connection.off("data", onData);
      connection.off("error", onError);
    }

    function onData(chunk: Buffer) {
      response += chunk.toString("utf8");

      if (response.includes("\r\n")) {
        cleanup();
        resolve(response);
      }
    }

    function onError(error: Error) {
      cleanup();
      reject(error);
    }

    connection.on("data", onData);
    connection.once("error", onError);
    connection.write(encodeRedisCommand(command));
  });
}

async function redisCommand(command: Array<number | string>): Promise<number> {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    throw new Error("redis_url must be configured for rate limiting.");
  }

  const parsedRedisUrl = new URL(redisUrl);
  const connection = createConnection(parsedRedisUrl);

  try {
    await waitForConnection(connection);

    if (parsedRedisUrl.password) {
      const authCommand = parsedRedisUrl.username
        ? [
            "AUTH",
            decodeURIComponent(parsedRedisUrl.username),
            decodeURIComponent(parsedRedisUrl.password),
          ]
        : ["AUTH", decodeURIComponent(parsedRedisUrl.password)];

      parseRedisResponse(await writeRedisCommand(connection, authCommand));
    }

    const response = parseRedisResponse(
      await writeRedisCommand(connection, command),
    );

    if (typeof response !== "number") {
      throw new Error(`Unexpected Redis response: ${response}`);
    }

    return response;
  } finally {
    connection.end();
  }
}

export async function checkRateLimitWithRedisCommand(
  { key, limit, windowMs, now = Date.now() }: CheckRateLimitOptions,
  runRedisCommand: RedisCommand,
): Promise<RateLimitResult> {
  const windowSeconds = Math.ceil(windowMs / 1000);
  const count = await runRedisCommand(["INCR", key]);
  let ttl = windowSeconds;

  if (count === 1) {
    await runRedisCommand(["EXPIRE", key, windowSeconds]);
  } else {
    ttl = await runRedisCommand(["TTL", key]);

    if (ttl < 0) {
      await runRedisCommand(["EXPIRE", key, windowSeconds]);
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
  return checkRateLimitWithRedisCommand(options, redisCommand);
}
