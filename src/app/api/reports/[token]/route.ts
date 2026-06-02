/* src/app/api/reports/[token]/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = resolvedParams.token;

    if (!token) {
      return NextResponse.json({ error: "Missing report token" }, { status: 400 });
    }

    // Secure indexed token query
    const report = await prisma.report.findUnique({
      where: { token },
      include: {
        payment: {
          select: {
            status: true,
            email: true,
          }
        }
      }
    });

    if (!report) {
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
    }

    // Set Cache-Control headers for completed reports to optimize loading speeds
    const headers: Record<string, string> = {};
    if (report.status === "COMPLETED") {
      headers["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=3600";
    } else {
      headers["Cache-Control"] = "no-store";
    }

    return NextResponse.json({
      status: report.status,
      birthData: report.birthData ? JSON.parse(report.birthData) : null,
      calculations: report.calculations ? JSON.parse(report.calculations) : null,
      narrative: report.narrative ? JSON.parse(report.narrative) : null,
      pdfUrl: report.pdfUrl,
      paymentStatus: report.payment.status,
      createdAt: report.createdAt,
    }, { headers });

  } catch (err) {
    console.error("Report lookup error:", err);
    return NextResponse.json({ error: "Failed to retrieve report data" }, { status: 500 });
  }
}
