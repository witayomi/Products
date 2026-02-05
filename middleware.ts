import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/auth", "/share"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("creatorx_session");
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
