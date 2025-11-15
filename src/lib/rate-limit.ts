import { NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval?: number; // Max requests per interval
}

// In-memory store for rate limiting
// In production, consider using Redis or a similar service
const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Rate limiting middleware for Next.js API routes
 * @param options - Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(options: RateLimitOptions) {
  const { interval, uniqueTokenPerInterval = 50 } = options;

  return async (req: NextRequest): Promise<NextResponse | null> => {
    // Get identifier (IP address or user ID)
    const identifier = getIdentifier(req);

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
      const now = Date.now();
      for (const [key, value] of rateLimitMap.entries()) {
        if (value.resetTime < now) {
          rateLimitMap.delete(key);
        }
      }
    }

    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (record) {
      // Check if the time window has passed
      if (now > record.resetTime) {
        // Reset the counter
        record.count = 1;
        record.resetTime = now + interval;
        rateLimitMap.set(identifier, record);
        return null; // Allow the request
      }

      // Check if limit exceeded
      if (record.count >= uniqueTokenPerInterval) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return NextResponse.json(
          {
            error: "Too many requests",
            message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
            retryAfter,
          },
          {
            status: 429,
            headers: {
              "Retry-After": retryAfter.toString(),
              "X-RateLimit-Limit": uniqueTokenPerInterval.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": new Date(record.resetTime).toISOString(),
            },
          }
        );
      }

      // Increment counter
      record.count++;
      rateLimitMap.set(identifier, record);
    } else {
      // Create new record
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + interval,
      });
    }

    return null; // Allow the request
  };
}

/**
 * Get identifier for rate limiting (IP address or user ID)
 */
function getIdentifier(req: NextRequest): string {
  // Try to get IP from headers (Vercel, Cloudflare, etc.)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  return ip;
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const rateLimiters = {
  // General API rate limiter: 100 requests per 15 minutes
  general: rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 100,
  }),

  // Strict rate limiter: 10 requests per minute (for sensitive operations)
  strict: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10,
  }),

  // Moderate rate limiter: 50 requests per 5 minutes
  moderate: rateLimit({
    interval: 5 * 60 * 1000, // 5 minutes
    uniqueTokenPerInterval: 50,
  }),
};

