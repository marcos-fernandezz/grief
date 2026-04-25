import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "../../../../lib/db"; // Mantenemos tu ruta original exacta

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      phone?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
    phone?: string | null;
  }
}

// 1. Definimos TODA la configuración en un solo lugar
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt", // Obligatorio para que funcione CredentialsProvider
  },
  pages: {
    signIn: '/login', // Tu página personalizada de GRIEF®
  },
  providers: [
    // --- REDES SOCIALES ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: { prompt: "select_account" },
      },
      httpOptions: { timeout: 10000 },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID as string,
      clientSecret: process.env.APPLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),

    // --- LOGIN MANUAL (EMAIL/TELÉFONO + CONTRASEÑA) ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email o Teléfono", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validar que el usuario haya escrito algo
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Por favor, completá todos los campos.");
        }

        // 2. Buscar en la base de datos por email O por teléfono
        const user = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { phone: credentials.identifier }
            ]
          }
        });

        // 3. Si no existe, o si se registró con Google y no tiene contraseña manual
        if (!user || !user.password) {
          throw new Error("No encontramos una cuenta con esos datos. ¿Usaste Google o Apple?");
        }

        // 4. Comparar la contraseña encriptada usando bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta.");
        }

        // 5. Todo en orden, le devolvemos el usuario a NextAuth
        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER";
        token.id = user.id; // Guardamos el ID por si lo necesitás en el futuro
        token.phone = (user as any).phone;
        token.email = (user as any).email;
      }
      const identifier = token.email || token.phone || "Usuario sin identificador";
      console.log("🎟️ RADAR JWT - Email:", token.email, "Rol en Token:", token.role);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).phone = token.phone;
      }
      const identifier = session.user?.email || session.user?.phone;
      console.log("🔥 SESIÓN INICIADA PARA:", identifier, "ROL:", token.role);
      return session;
    }
  }
};

// 2. Pasamos authOptions al handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };