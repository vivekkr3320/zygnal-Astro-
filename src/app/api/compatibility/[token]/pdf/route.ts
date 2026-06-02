import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateCompatibilityPdf } from "@/lib/pdf/generateCompatibilityPdf";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const report = await prisma.report.findUnique({
      where: { token },
      include: { payment: true },
    });
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    // Generate PDF buffer
    const pdfBuffer = await generateCompatibilityPdf(report);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="zygnal-astro-${token}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
