/* src/middleware.ts */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

if (upstashUrl && upstashToken) {
  try {
    const redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
    // Rate limit checkout and normalization calls: 15 requests per minute
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, "60 s"),
      analytics: true,
    });
  } catch (err) {
    console.error("Failed to initialize Upstash Redis Rate Limiter client:", err);
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect transactional checkout and birth normalization paths
  if (ratelimit && (path.startsWith("/api/payments") || path.startsWith("/api/normalize-birth"))) {
    const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(ip);
      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: "Too many celestial alignment inquiries. Please retry in a moment." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }
    } catch (err) {
      console.warn("Upstash Redis connection timeout. Middleware bypassing rate limit check.", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/payments/:path*", "/api/normalize-birth"],
};
