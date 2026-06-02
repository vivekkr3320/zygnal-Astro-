/* src/app/api/payments/checkout/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

const checkoutSchema = z.object({
  email: z.string().email(),
  birthData: z.object({
    month: z.number(),
    day: z.number(),
    year: z.number(),
    hour: z.number(),
    minute: z.number(),
    ampm: z.string(),
    confidence: z.string(),
    location: z.string(),
    timezone: z.string(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate request body
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid parameters", details: validation.error.format() }, { status: 400 });
    }

    const { email, birthData } = validation.data;
    
    // Generate idempotency key or retrieve from headers
    const idempotencyKey = request.headers.get("idempotency-key") || crypto.randomUUID();

    // 2. Transaction Safety: Create pending payment record
    const payment = await prisma.$transaction(async (tx) => {
      // Check if this idempotency key already exists to prevent duplicate orders
      const existing = await tx.payment.findUnique({
        where: { idempotencyKey }
      });
      if (existing) {
        return existing;
      }

      // Generate a temporary mock paymentId or set as pending receipt
      const tempId = `order_${crypto.randomBytes(8).toString("hex")}`;
      
      return await tx.payment.create({
        data: {
          paymentId: tempId,
          idempotencyKey,
          amount: 9900, // ₹99 in paise
          status: "PENDING",
          email,
        }
      });
    });

    // 3. Initiate Razorpay Order (with mock fallback for development)
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    let razorpayOrder;

    if (keyId && keySecret) {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      razorpayOrder = await razorpay.orders.create({
        amount: 9900,
        currency: "INR",
        receipt: payment.id,
      });

      // Update the payment record with real Razorpay Order ID
      await prisma.payment.update({
        where: { id: payment.id },
        data: { paymentId: razorpayOrder.id }
      });
    } else {
      // Mock mode fallback for local test
      console.log("[PAYMENT] Razorpay credentials missing. Fallback to mock order.");
      razorpayOrder = {
        id: payment.paymentId,
        amount: 9900,
        currency: "INR",
        receipt: payment.id,
        mock: true,
      };
    }

    // 4. Create an associated pending report in the database with secure token
    const reportToken = `ZXA${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
    await prisma.report.create({
      data: {
        token: reportToken,
        paymentId: payment.id,
        birthData: JSON.stringify(birthData),
        status: "QUEUED",
      }
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      paymentRecordId: payment.id,
      token: reportToken,
      mock: !keyId,
    });
  } catch (err) {
    console.error("Payment checkout endpoint failed:", err);
    return NextResponse.json({ error: "Transactional checkout failed" }, { status: 500 });
  }
}
