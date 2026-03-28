import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../../../../lib/db";

// 1. Definimos TODA la configuración en un solo lugar
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  secret: process.env.NEXTAUTH_SECRET, // 👈 AGREGADO: La llave maestra para el proxy
  debug: true, // 👈 AGREGADO: El radar para detectar errores de guardado en la DB
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt", // Obligatorio para que el proxy funcione
  },
  pages: {
    signIn: '/login', // Tu página personalizada de GRIEF®
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER"; 
      }
      // 🕵️ MICROFONO 1: Vemos qué rol le asigna el JWT
      console.log("🎟️ TOKEN CREADO PARA:", token.email, "ROL:", token.role);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      // 🕵️ MICROFONO 2: Vemos qué rol le llega a tu Menú
      console.log("🔥 SESIÓN INICIADA PARA:", session.user?.email, "ROL:", token.role);
      return session;
    }
  }
};

// 2. Pasamos authOptions al handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };