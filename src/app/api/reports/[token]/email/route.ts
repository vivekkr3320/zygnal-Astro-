import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { ReportEmailTemplate } from "@/components/email/ReportEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Retrieve report to get email destination
    const report = await prisma.report.findUnique({
      where: { token },
      include: { payment: true }
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const email = report.payment?.email;
    
    if (!email) {
      return NextResponse.json({ error: "No email associated with this report" }, { status: 400 });
    }

    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/report/${token}`;

    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Mock] Simulating sending report email to ${email}`);
      return NextResponse.json({ status: "success", mock: true });
    }

    const { data, error } = await resend.emails.send({
      from: 'Zygnal Astro <reports@zygnal.com>', // Replace with actual verified domain
      to: [email],
      subject: 'Your Celestial Blueprint is Ready',
      react: ReportEmailTemplate({ 
        explorerName: "Cosmic Soul", // Can extract name from birthData if added
        reportUrl 
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
  } catch (err: any) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
