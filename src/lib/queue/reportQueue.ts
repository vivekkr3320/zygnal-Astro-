/* src/lib/queue/reportQueue.ts */
import { Queue } from "bullmq";
import { redisConnection } from "../redis";
import { startReportWorker, processReportGeneration } from "./reportWorker";

let reportQueue: Queue | null = null;
let isRedisAvailable = false;

try {
  // Setup standard queue if Redis is configured and online
  reportQueue = new Queue("report-generation", {
    connection: redisConnection as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  });
  
  // Quick error handling to prevent uncaught crashes
  redisConnection.on("error", (err) => {
    if (!isRedisAvailable) {
      console.warn("[Queue] Redis is offline. Gracefully falling back to in-memory report processing.");
    }
    isRedisAvailable = false;
  });

  redisConnection.on("connect", () => {
    isRedisAvailable = true;
    console.log("[Queue] Redis connected successfully for background jobs.");
  });

  isRedisAvailable = true;
} catch (err) {
  console.warn("[Queue] BullMQ failed to initialize. Falling back to in-memory processing.", err);
  reportQueue = null;
  isRedisAvailable = false;
}

// Lazily start worker if on server and Redis is active
if (typeof window === "undefined") {
  if (isRedisAvailable) {
    try {
      startReportWorker();
      console.log("[Queue] Background Report Worker started successfully via BullMQ.");
    } catch (err) {
      console.warn("[Queue] Could not start BullMQ worker. In-memory fallback will be active.", err);
    }
  } else {
    console.log("[Queue] Running in local/mock mode. In-memory background processing active.");
  }
}

export async function queueReportGeneration(reportId: string) {
  try {
    if (isRedisAvailable && reportQueue) {
      await reportQueue.add("generate-report", { reportId });
      console.log(`[Queue] Successfully enqueued report job via Redis: ${reportId}`);
    } else {
      // In-memory fallback: process report in background immediately
      console.log(`[Queue] Redis offline. Triggering in-memory generator for: ${reportId}`);
      
      // We run asynchronously to prevent blocking the HTTP response
      setTimeout(async () => {
        try {
          await processReportGeneration(reportId);
          console.log(`[Queue] Completed in-memory generation for: ${reportId}`);
        } catch (err) {
          console.error(`[Queue] Failed in-memory generation for: ${reportId}`, err);
        }
      }, 1500); // 1.5s delay to simulate authentic celestial calculations
    }
  } catch (error) {
    console.warn("[Queue] Queue add failed, falling back to instant in-memory processing.", error);
    // instant backup execution
    try {
      await processReportGeneration(reportId);
    } catch (err) {
      console.error("[Queue] Final backup generation failed:", err);
      throw err;
    }
  }
}
