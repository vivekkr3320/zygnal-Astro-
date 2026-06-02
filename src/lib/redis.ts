/* src/lib/redis.ts */
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Helper client connection specifically for BullMQ
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required configuration by BullMQ
  enableReadyCheck: false,
});
