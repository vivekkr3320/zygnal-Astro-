/* src/lib/queue/reportWorker.ts */
import { Worker, Job } from "bullmq";
import { redisConnection } from "../redis";
import { prisma } from "../db";
import { sendReportAccessEmail } from "../email";
import { calculateNatalParameters, generateAstrologyReport } from "../astrologyEngine";
import * as Sentry from "@sentry/nextjs";

// Core procedural generator logic shared between BullMQ and In-Memory Fallbacks
export async function processReportGeneration(reportId: string) {
  console.log(`[Worker] Started processing report: ${reportId}`);

  // 1. Fetch report details
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { payment: true }
  });

  if (!report) {
    throw new Error(`Report not found in database: ${reportId}`);
  }

  // Prevent duplicate processing
  if (report.status === "COMPLETED" || report.status === "PROCESSING") {
    console.log(`[Worker] Skipping report ${reportId} - status is already ${report.status}`);
    return;
  }

  // Update status to PROCESSING
  await prisma.report.update({
    where: { id: reportId },
    data: { status: "PROCESSING" }
  });

  try {
    const birthData = typeof report.birthData === "string" ? JSON.parse(report.birthData) : report.birthData;
    const day = Number(birthData.day || 1);
    const month = Number(birthData.month || 0) + 1; // 1-based index (0-11 in form)
    const year = Number(birthData.year || 1996);
    const hourVal = Number(birthData.hour || 12);
    const minuteVal = Number(birthData.minute || 0);
    const ampmVal = birthData.ampm || "PM";

    // Convert AM/PM to 24-hour scale for math
    let hour24 = hourVal;
    if (ampmVal === "PM" && hourVal !== 12) hour24 += 12;
    if (ampmVal === "AM" && hourVal === 12) hour24 = 0;

    // 2. Perform authentic Astrology calculations using the new engine
    const { positions } = calculateNatalParameters(month, day, hour24, minuteVal);
    const narrative = generateAstrologyReport(month, day, hour24, minuteVal);

    // 3. Build printable PDF reference link
    const pdfUrl = `/report/${report.token}?print=true`;

    // 4. Update the report record to COMPLETED in the database
    await prisma.report.update({
      where: { id: reportId },
      data: {
        calculations: JSON.stringify(positions),
        narrative: JSON.stringify(narrative),
        status: "COMPLETED",
        pdfUrl
      }
    });

    // 5. Send confirmation access recovery email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const reportLink = `${appUrl}/report/${report.token}`;
    await sendReportAccessEmail(report.payment.email, reportLink, report.token);
    
    console.log(`[Worker] Successfully completed processing report: ${reportId}`);
  } catch (err) {
    console.error(`[Worker] Error generating report: ${reportId}`, err);
    Sentry.captureException(err, {
      extra: { reportId }
    });
    // Set status to FAILED in the database for analytics
    await prisma.report.update({
      where: { id: reportId },
      data: { status: "FAILED" }
    });
    throw err;
  }
}

// BullMQ Background Worker setup
export const startReportWorker = () => {
  try {
    const worker = new Worker(
      "report-generation",
      async (job: Job) => {
        const { reportId } = job.data;
        await processReportGeneration(reportId);
      },
      { connection: redisConnection as any }
    );

    worker.on("failed", (job, err) => {
      console.error(`[Worker] Job ${job?.id} failed with error:`, err);
    });

    return worker;
  } catch (err) {
    console.warn("[Worker] Worker connection to Redis failed. Active strictly on memory fallback.", err);
    return null;
  }
};
