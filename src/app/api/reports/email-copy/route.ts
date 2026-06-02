/* src/app/api/reports/email-copy/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendReportAccessEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email } = body;

    if (!token || !email) {
      return NextResponse.json({ error: "Missing token or email parameters" }, { status: 400 });
    }

    // Verify the report exists and is completed
    const report = await prisma.report.findUnique({
      where: { token }
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.status !== "COMPLETED") {
      return NextResponse.json({ error: "Report calculation is not completed yet" }, { status: 400 });
    }

    // Resend the email link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const reportLink = `${appUrl}/report/${token}`;
    
    await sendReportAccessEmail(email, reportLink, token);

    return NextResponse.json({
      status: "success",
      message: `Cosmic Blueprint reference sent to ${email}`
    });
  } catch (err: any) {
    console.error("Email copy trigger failed:", err);
    return NextResponse.json({ error: "Failed to send email backup copy", details: err.message }, { status: 500 });
  }
}
