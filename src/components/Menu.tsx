"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import CartCounter from "./CartCounter";
import { useCartStore } from "@/store/cartStore";

export default function Menu() {
  const { data: session, status } = useSession();
  const pathname = usePathname()
  const clearCart = useCartStore((state) => state.clearCart);
  if (pathname.startsWith("/admin")) {
    return null; 
  }
  
  return (
    <nav className="fixed w-full z-50 bg-white border-b border-neutral-100 px-8 py-5 text-black">
      <div className="grid grid-cols-3 items-center max-w-7xl mx-auto">
        
        {/* IZQUIERDA: LOGO */}
        <div className="flex justify-start">
          <Link href="/" className="font-black text-2xl tracking-tighter uppercase">GRIEF®</Link>
        </div>

        {/* CENTRO: NAVEGACIÓN */}
        <div className="flex justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          <Link href="/tienda" className="hover:text-neutral-500 transition-colors">Tienda</Link>
          <Link href="/manifiesto" className="hover:text-neutral-500 transition-colors">Manifiesto</Link>
          <Link href="/proceso" className="hover:text-neutral-500 transition-colors">Proceso</Link>
        </div>

        {/* DERECHA: ACCIONES */}
        <div className="flex justify-end items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
          
          <Link href="/cart" className="relative group flex items-center">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <CartCounter />
          </Link>

          <div className="h-4 w-[1px] bg-neutral-200"></div>

          <div className="flex items-center gap-4">
            {status === "authenticated" ? (
              <>
                {/* ⚠️ ESTA ES LA LÍNEA CLAVE: Solo si el rol es exactamente ADMIN */}
                {session?.user && (session.user as any).role === "ADMIN" && (
                  <Link href="/admin" className="text-neutral-400 hover:text-black">
                    PANEL
                  </Link>
                )}
                
                <button 
                
                  onClick={() =>{
                    clearCart();
                    signOut({ callbackUrl: '/login' })} 
                  }
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  SALIR
                </button>
              </>
            ) : (
              <Link href="/login">INGRESAR</Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}