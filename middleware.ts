import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./src/app/lib/session";

const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const session = req.cookies.get("session")?.value;

  try {
    const payload = await decrypt(session);
    console.log(payload);
    // todo: check user exists
  } catch (error) {
    console.log(error);
    if (pathname.startsWith("/api")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }   
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};