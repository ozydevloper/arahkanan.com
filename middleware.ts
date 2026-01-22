import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await auth();

  if (pathname.startsWith("/kelola")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      if (session.user?.role !== "SUDO") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  if (pathname.startsWith("/profile") && !session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
