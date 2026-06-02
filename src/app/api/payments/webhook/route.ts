/* src/app/api/payments/webhook/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { queueReportGeneration } from "@/lib/queue/reportQueue";
import crypto from "crypto";

// Validate webhook signature from Razorpay
const verifySignature = (body: string, signature: string, secret: string) => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  const digest = hmac.digest("hex");
  return digest === signature;
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Signature Verification Check
    if (webhookSecret && signature) {
      const isValid = verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    
    // We listen for order.paid or payment.captured
    if (event === "order.paid" || event === "payment.captured") {
      const orderId = payload.payload.payment.entity.order_id || payload.payload.order.entity.id;
      
      if (!orderId) {
        return NextResponse.json({ error: "Order details missing" }, { status: 400 });
      }

      // 2. Transaction Safety Lock: Update status and queue report generation
      const result = await prisma.$transaction(async (tx) => {
        // Query current payment state
        const payment = await tx.payment.findUnique({
          where: { paymentId: orderId },
          include: { report: true }
        });

        if (!payment) {
          throw new Error(`Payment record not found for Order ID: ${orderId}`);
        }

        // Idempotency: Prevent duplicate webhook captures processing twice
        if (payment.status === "SUCCESS") {
          return { status: "ALREADY_PROCESSED", report: payment.report };
        }

        // Update payment status to SUCCESS
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCESS" },
          include: { report: true }
        });

        return { status: "PROCESSED", report: updatedPayment.report };
      });

      // 3. Queue Background generation on new successes
      if (result.status === "PROCESSED" && result.report) {
        await queueReportGeneration(result.report.id);
        console.log(`[Webhook] Success queued report worker for: ${result.report.id}`);
      }

      return NextResponse.json({ status: "success", result: result.status });
    }

    return NextResponse.json({ status: "ignored_event" });
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message);
    return NextResponse.json({ error: "Webhook handler failed", details: err.message }, { status: 500 });
  }
}
