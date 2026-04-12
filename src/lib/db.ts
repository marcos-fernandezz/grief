import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

// 🟢 CREAMOS EL POOL DENTRO DEL SINGLETON TAMBIÉN
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

const pool = globalForPrisma.pool ?? new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10, // 👈 Limitamos a 10 conexiones para no saturar la DB
  idleTimeoutMillis: 30000,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool

const adapter = new PrismaPg(pool)

export const db = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})
console.log("Instanciando DB Client...");
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db