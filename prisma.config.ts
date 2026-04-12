import "dotenv/config";
import { defineConfig, env } from "@prisma/config"; // <- ¡Faltaba el @!

export default defineConfig({
  schema: "./src/prisma/schema.prisma", // Ruta exacta desde la raíz
  migrations: {
    path: "./src/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});