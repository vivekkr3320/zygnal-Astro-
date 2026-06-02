/* src/app/api/payments/mock-capture/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { queueReportGeneration } from "@/lib/queue/reportQueue";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentRecordId, orderId, token } = body;

    if (!paymentRecordId) {
      return NextResponse.json({ error: "Missing paymentRecordId parameter" }, { status: 400 });
    }

    // Process idempotent mock transaction capture
    const result = await prisma.$transaction(async (tx) => {
      // Find the payment record
      const payment = await tx.payment.findUnique({
        where: { id: paymentRecordId },
        include: { report: true }
      });

      if (!payment) {
        throw new Error(`Payment record not found for ID: ${paymentRecordId}`);
      }

      // Idempotency check: don't process twice
      if (payment.status === "SUCCESS") {
        return { status: "ALREADY_PROCESSED", report: payment.report };
      }

      // Update status to SUCCESS
      const updatedPayment = await tx.payment.update({
        where: { id: paymentRecordId },
        data: { status: "SUCCESS" },
        include: { report: true }
      });

      return { status: "PROCESSED", report: updatedPayment.report };
    });

    // Queue generation
    if (result.status === "PROCESSED" && result.report) {
      await queueReportGeneration(result.report.id);
      console.log(`[Mock Capture] Processed success capture and queued generator for: ${result.report.id}`);
    }

    return NextResponse.json({
      status: "success",
      message: "Mock payment verified and queued successfully.",
      result: result.status,
      token
    });
  } catch (err: any) {
    console.error("Mock capture transaction failed:", err);
    return NextResponse.json({ error: "Mock verification processing failed", details: err.message }, { status: 500 });
  }
}
