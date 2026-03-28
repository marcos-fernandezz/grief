import dotenv from 'dotenv';
import path from 'path';

// Cargamos el .env usando una ruta absoluta garantizada
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

// Diagnóstico de seguridad (esto saldrá en tu terminal al ejecutar el comando)
if (!databaseUrl) {
  console.error("❌ ERROR: DIRECT_URL no fue encontrada en el entorno.");
} else {
  console.log("✅ DIRECT_URL cargada correctamente.");
}

export default {
  schema: "./src/prisma/schema.prisma",
  datasource: {
    url: databaseUrl, // Aseguramos que se pase la referencia a la constante
  },
};