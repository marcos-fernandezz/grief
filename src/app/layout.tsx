import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "../components/Menu";
import { Providers } from "../components/Providers"; // Importamos el wrapper
import { Suspense } from 'react';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GRIEF | No es el resultado.",
  description: "Diseñamos prendas para acompañar procesos reales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-white text-black`}>
        <Providers> {/* Envolvemos toda la app */}
          <Suspense>
            <Menu />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}