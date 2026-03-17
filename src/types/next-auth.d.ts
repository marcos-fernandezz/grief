import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extendemos la sesión para que incluya 'role' y el ID del usuario
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  /**
   * Extendemos el usuario que viene de la DB (el que usa el Adapter)
   */
  interface User {
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
}