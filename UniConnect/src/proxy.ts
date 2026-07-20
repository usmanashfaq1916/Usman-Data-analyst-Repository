import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/", "/universities", "/merit-calculator", "/admission-alerts",
  "/login", "/register", "/scholarships", "/blog", "/faqs", "/compare",
];

const HMIS_ROLES = ["SUPER_ADMIN", "ADMIN", "CHAIRMAN", "DIRECTOR", "PRINCIPAL", "HOD", "TEACHER", "HR", "STUDENT", "PARENT"];

const ROLE_ROUTE_MAP: Record<string, string[]> = {
  "/hmis/super-admin": ["SUPER_ADMIN"],
  "/hmis/chairman": ["SUPER_ADMIN", "CHAIRMAN"],
  "/hmis/director": ["SUPER_ADMIN", "ADMIN", "DIRECTOR"],
  "/hmis/principal": ["SUPER_ADMIN", "ADMIN", "DIRECTOR", "PRINCIPAL"],
  "/hmis/hod": ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD"],
  "/hmis/teacher": ["SUPER_ADMIN", "ADMIN", "PRINCIPAL", "HOD", "TEACHER"],
  "/hmis/hr": ["SUPER_ADMIN", "ADMIN", "HR"],
  "/hmis/student": ["SUPER_ADMIN", "STUDENT"],
  "/hmis/parent": ["SUPER_ADMIN", "PARENT"],
};

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60 * 1000;

export default auth(function middleware(req: NextRequest & { auth: any }) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role as string;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => {
    if (route.endsWith("/")) return pathname === route;
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  const isAuthApiRoute = pathname.startsWith("/api/auth/");
  const isApiRoute = pathname.startsWith("/api/");
  const isHmisRoute = pathname.startsWith("/hmis");
  const isStaticAsset = /^\/(_next|favicon\.ico|sitemap\.xml|robots\.txt)/.test(pathname);

  if (isStaticAsset || isAuthApiRoute) return NextResponse.next();
  if (isPublicRoute) return NextResponse.next();

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isHmisRoute && !HMIS_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTE_MAP)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/admin") && !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isApiRoute) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const origin = req.headers.get("origin");
      const host = req.headers.get("host");
      if (origin && host && !origin.includes(host) && !origin.includes("localhost") && !origin.includes("vercel.app") && !origin.includes("uniconnect")) {
        return new NextResponse(JSON.stringify({ error: "CSRF validation failed" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (entry) {
      if (now > entry.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
      } else if (entry.count >= RATE_LIMIT) {
        return new NextResponse(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { "Content-Type": "application/json", "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)) },
        });
      } else {
        entry.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    }

    if (rateLimitMap.size > 10000) {
      const cutoff = now - RATE_WINDOW_MS;
      for (const [key, val] of rateLimitMap) {
        if (val.resetTime < cutoff) rateLimitMap.delete(key);
      }
    }

    if (!isLoggedIn) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
