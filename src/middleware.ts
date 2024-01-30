import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirectPrefix } from "./config";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("roleId")?.value;

  if (
    token === undefined &&
    role === undefined &&
    (req.nextUrl.pathname.startsWith("/user") ||
      req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/doctor"))
  ) {
    const redirectUrl = new URL(
      `${redirectPrefix}/auth/login`,
      req.nextUrl.origin
    );
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (
    token !== undefined &&
    role === "1" &&
    (req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/doctor") ||
      req.nextUrl.pathname.startsWith("/auth"))
  ) {
    const redirectUrl = new URL(redirectPrefix, req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (
    token !== undefined &&
    role === "2" &&
    (req.nextUrl.pathname.startsWith("/admin") ||
      req.nextUrl.pathname.startsWith("/user") ||
      req.nextUrl.pathname.startsWith("/consultations") ||
      req.nextUrl.pathname.startsWith("/products") ||
      req.nextUrl.pathname.startsWith("/auth") ||
      req.nextUrl.pathname === "/")
  ) {
    const redirectUrl = new URL(`${redirectPrefix}/doctor`, req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (
    token !== undefined &&
    role === "3" &&
    (req.nextUrl.pathname.startsWith("/user") ||
      req.nextUrl.pathname.startsWith("/doctor") ||
      req.nextUrl.pathname.startsWith("/consultations") ||
      req.nextUrl.pathname.startsWith("/products") ||
      req.nextUrl.pathname.startsWith("/auth") ||
      req.nextUrl.pathname.startsWith("/admin/super") ||
      req.nextUrl.pathname === "/")
  ) {
    const redirectUrl = new URL(
      `${redirectPrefix}/admin/pharmacy`,
      req.nextUrl.origin
    );
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (
    token !== undefined &&
    role === "4" &&
    (req.nextUrl.pathname.startsWith("/user") ||
      req.nextUrl.pathname.startsWith("/doctor") ||
      req.nextUrl.pathname.startsWith("/consultations") ||
      req.nextUrl.pathname.startsWith("/products") ||
      req.nextUrl.pathname.startsWith("/auth") ||
      req.nextUrl.pathname.startsWith("/admin/pharmacy") ||
      req.nextUrl.pathname === "/")
  ) {
    const redirectUrl = new URL(
      `${redirectPrefix}/admin/super`,
      req.nextUrl.origin
    );
    return NextResponse.redirect(redirectUrl.toString());
  }
}
