"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-neutral-950 border-b border-white/10 px-8 py-5 text-white">
      <div className="grid grid-cols-3 items-center max-w-7xl mx-auto">
        
        {/* IZQUIERDA: LOGO ADMIN */}
        <div className="flex justify-start">
          <Link href="/admin" className="font-black text-2xl tracking-tighter uppercase flex items-center gap-2 hover:opacity-80 transition-opacity">
            GRIEF® <span className="text-neutral-500 font-normal text-[10px] tracking-[0.2em] mt-1">| ADMIN</span>
          </Link>
        </div>

        {/* CENTRO: NAVEGACIÓN (Dashboard y Productos) */}
        <div className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          <Link 
            href="/admin" 
            className={`transition-colors ${pathname === "/admin" ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-neutral-500 hover:text-white"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className={`transition-colors ${pathname.startsWith("/admin/products") ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-neutral-500 hover:text-white"}`}
          >
            Productos
          </Link>
        </div>

        {/* DERECHA: ACCIONES RÁPIDAS */}
        <div className="flex justify-end items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
          
          {/* Botón rápido para volver a ver la tienda como cliente */}
          <Link href="/tienda" className="text-neutral-500 hover:text-white transition-colors">
            Ver Tienda
          </Link>

          <div className="h-4 w-[1px] bg-white/20"></div>

          {/* Botón de salir con la limpieza de cookies que configuramos antes */}
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })} 
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            SALIR
          </button>
        </div>

      </div>
    </nav>
  );
}