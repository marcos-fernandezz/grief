// src/middleware.ts (Antes proxy.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) { // Cambié el nombre de la función también
  const path = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET
  });

  // El Radar ahora sí va a aparecer en Vercel Logs
  console.log("=== RADAR PROXY ===");
  console.log("Accediendo a:", path);
  console.log("Rol:", token?.role);
  console.log("===================");

  if (path.startsWith("/admin")) {
    // Si no hay token o el rol no es ADMIN, rebote inmediato
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/tienda", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};