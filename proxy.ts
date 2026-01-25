import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await auth();

  if (
    (session || !session) &&
    pathname.startsWith("/kelola") &&
    session?.user?.role !== "SUDO"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/api/query")) {
    const signature = await req.headers.get("nothing-to-see");
    if (!signature) return NextResponse.json({ data: "Bad request, huu" });
    NextResponse.next();
  }

  return NextResponse.next();
}
