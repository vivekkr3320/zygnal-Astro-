// src/app/api/normalize-birth/route.ts
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';

export async function POST(request: Request) {
  try {
    const {
      hour,
      minute,
      ampm,
      confidence,
      location,
      timezone,
    } = await request.json();

    if (
      hour === undefined ||
      minute === undefined ||
      ampm === undefined ||
      !timezone
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert to 24h format
    let hour24 = Number(hour);
    const ampmUpper = String(ampm).toUpperCase();
    if (ampmUpper === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampmUpper === 'AM' && hour24 === 12) hour24 = 0;

    // Build DateTime in provided timezone (date part we assume today for demo)
    const dt = DateTime.fromObject(
      {
        hour: hour24,
        minute: Number(minute),
        second: 0,
        millisecond: 0,
      },
      { zone: timezone }
    );

    if (!dt.isValid) {
      return NextResponse.json({ error: 'Invalid datetime' }, { status: 400 });
    }

    const iso = dt.toISO(); // ISO 8601 in provided timezone

    // Return normalized data (you can add location processing later)
    return NextResponse.json({
      iso,
      confidence,
      location,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
