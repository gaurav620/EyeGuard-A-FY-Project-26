import { Redis } from "@upstash/redis";
import { ensureServerEnv } from "./server/env";

ensureServerEnv();
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TELEMETRY_BUFFER_KEY = "telemetry:buffer";
const STATS_KEY = "eyeguard:stats";

export async function bufferTelemetry(data: Record<string, unknown>) {
  await redis.rpush(TELEMETRY_BUFFER_KEY, JSON.stringify(data));
}

export async function flushTelemetryBuffer(): Promise<Record<string, unknown>[]> {
  const length = await redis.llen(TELEMETRY_BUFFER_KEY);
  if (length === 0) return [];

  const items = await redis.lrange(TELEMETRY_BUFFER_KEY, 0, length - 1);
  await redis.ltrim(TELEMETRY_BUFFER_KEY, length, -1);

  return items.map((item) =>
    typeof item === "string" ? JSON.parse(item) : (item as Record<string, unknown>)
  );
}

export async function incrementStat(field: string, amount = 1) {
  await redis.hincrby(STATS_KEY, field, amount);
}

export async function getLeaderboard(limit = 10) {
  const rows = (await redis.zrange("eyeguard:leaderboard", 0, limit - 1, {
    rev: true,
    withScores: true,
  })) as Array<{ member: string; score: number }>;
  return rows.map((row) => ({ key: String(row.member), score: Number(row.score) }));
}

export async function incrementLeaderboard(member: string, points: number) {
  await redis.zincrby("eyeguard:leaderboard", points, member);
}

export async function getStats(): Promise<Record<string, number>> {
  const stats = await redis.hgetall(STATS_KEY);
  const result: Record<string, number> = {};
  if (stats) {
    for (const [key, value] of Object.entries(stats)) {
      result[key] = Number(value);
    }
  }
  return result;
}
