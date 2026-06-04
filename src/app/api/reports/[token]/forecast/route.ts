import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateForecast } from "@/lib/forecastEngine";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const url = new URL(request.url);
  const dateParam = url.searchParams.get("date");
  const targetDate = dateParam ? new Date(dateParam) : new Date();

  const report = await prisma.report.findUnique({
    where: { token },
    include: { payment: true },
  });
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Extract birth data (assume stored as JSON string)
  const birth = JSON.parse(report.birthData);
  const forecast = generateForecast(
    birth.month,
    birth.day,
    birth.year,
    targetDate
  );
  return NextResponse.json(forecast);
}
