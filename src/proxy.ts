import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Leemos el token desencriptando la cookie directamente
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 🚨 RADAR DE SEGURIDAD EXTREMA
  console.log("=== RADAR PROXY ===");
  console.log("Intentando acceder a:", path);
  console.log("Email del Token:", token?.email || "Ninguno");
  console.log("Rol del Token:", token?.role || "Sin Rol");
  console.log("===================");

  // 2. Bloqueo Quirúrgico para el Admin de GRIEF®
  if (path.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      console.log("❌ ACCESO DENEGADO: Usuario sin permisos. Redirigiendo a /tienda");
      return NextResponse.redirect(new URL("/tienda", req.url));
    }
    console.log("✅ ACCESO PERMITIDO: Hola, Admin.");
  }

  // 3. Dejamos pasar el resto de las peticiones
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};