"use client";

import { useState, useEffect, useTransition } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart, Search, ChevronDown, X, User, Menu as MenuIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CartCounter from "./CartCounter";
import { useCartStore } from "@/store/cartStore";

export default function Menu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  // 1. FEAT: RESET AL NAVEGAR
  // Apenas el pathname cambia (ej: de /tienda a /tienda/remera), cerramos todo
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    // Limpiamos el texto para que el useEffect de búsqueda no encuentre discrepancias
    setSearchTerm("");
  }, [pathname]);

  // 2. Lógica de Scroll (Intacta)
  useEffect(() => {
    const handleScroll = () => {
      const screenHeight = window.innerHeight;
      if (window.scrollY > screenHeight - 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. FEAT: BUSCADOR CON "GUARDIA" DE SEGURIDAD
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";

    // 🚩 SI EL BUSCADOR ESTÁ CERRADO, NO HACEMOS NADA.
    // Esto evita que al navegar a un producto nos mande de vuelta a la búsqueda.
    if (!isSearchOpen) return;

    if (searchTerm === currentQ) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      startTransition(() => {
        if (searchTerm.trim() !== "") {
          params.set("q", searchTerm);
          router.push(`/tienda?${params.toString()}`);
        } else if (pathname === "/tienda") {
          // Si borra el texto estando en la tienda, limpiamos filtros
          router.push("/tienda");
        }
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // Agregamos isSearchOpen a las dependencias para que el "Guardia" reaccione
  }, [searchTerm, router, searchParams, pathname, isSearchOpen]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const navStyle = isHome && !isScrolled
    ? "fixed w-full z-40 bg-transparent text-white py-4 md:py-6"
    : "fixed w-full z-40 bg-white border-b border-neutral-100 text-black py-4";

  return (
    <>
      <nav className={`transition-all duration-300 ${navStyle}`}>
        <div className="flex justify-between md:grid md:grid-cols-3 items-center w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative h-12 md:h-auto">

          {/* MOBILE: HAMBURGUESA */}
          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2">
              <MenuIcon className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* DESKTOP: NAV */}
          <div className="hidden md:flex justify-start gap-8 text-[11px] uppercase tracking-[0.15em] font-semibold items-center h-full">
            <div className="group h-full py-2 cursor-pointer">
              <span className="flex items-center gap-1 hover:text-neutral-400 transition-colors">
                Tienda <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </span>
              <div className="absolute top-full left-0 w-full bg-white text-black opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t border-b border-neutral-100 shadow-xl z-50">
                <div className="max-w-7xl mx-auto px-8 py-12">
                  <div className="grid grid-cols-4 gap-8">
                    <div className="flex flex-col gap-5">
                      <h3 className="text-xs font-black tracking-widest mb-2">EXPLORAR</h3>
                      <Link href="/tienda/nuevos" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Nuevos Ingresos</Link>
                      <Link href="/tienda/best-sellers" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Más Vendidos</Link>
                      <Link href="/tienda" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Ver Todo</Link>
                    </div>
                    <div className="flex flex-col gap-5">
                      <h3 className="text-xs font-black tracking-widest mb-2">CATEGORÍAS</h3>
                      <Link href="/tienda?categoria=remeras" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Remeras & Tops</Link>
                      <Link href="/tienda?categoria=buzos" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Buzos & Hoodies</Link>
                      <Link href="/tienda?categoria=pantalones" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Pantalones</Link>
                      <Link href="/tienda?categoria=accesorios" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Accesorios</Link>
                    </div>
                    <div className="flex flex-col gap-5">
                      <h3 className="text-xs font-black tracking-widest mb-2">COLECCIONES</h3>
                      <Link href="/tienda?coleccion=drop-01" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Drop 01 - Origen</Link>
                      <Link href="/tienda?coleccion=esenciales" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Básicos Esenciales</Link>
                      <Link href="/tienda?coleccion=impact" className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors">Impact Series</Link>
                    </div>
                    <div className="h-full bg-neutral-100 flex items-end p-6 bg-[url('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center">
                      <h3 className="text-white text-lg font-black tracking-widest uppercase drop-shadow-md">Nuevo Drop</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link href="/manifiesto" className="hover:text-neutral-400 transition-colors py-2">Manifiesto</Link>
          </div>

          {/* CENTRO: LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex justify-center">
            <Link href="/" className="font-black text-2xl md:text-3xl tracking-[0.2em] uppercase">
              GRIEF®
            </Link>
          </div>

          {/* DERECHA: ACCIONES */}
          <div className="flex justify-end items-center gap-3 md:gap-5 text-[10px] uppercase tracking-widest font-bold">
            <button onClick={() => setIsSearchOpen(true)} className="hover:scale-110 transition-transform hover:text-neutral-400 p-2 md:p-0">
              <Search className="w-5 h-5 md:w-5 md:h-5" strokeWidth={1.5} />
            </button>

            <div className="hidden md:block">
              {status === "authenticated" ? (
                <div className="relative group py-2">
                  <button className="flex items-center hover:scale-110 transition-transform hover:text-neutral-400">
                    <User className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-40 bg-white text-black opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-neutral-100 shadow-xl flex flex-col text-left">
                    {session?.user && (session.user as any).role === "ADMIN" && (
                      <Link href="/admin" className="px-5 py-4 text-[10px] hover:bg-neutral-50 transition-colors border-b border-neutral-100">PANEL ADMIN</Link>
                    )}
                    <button onClick={() => { clearCart(); signOut({ callbackUrl: '/login' }); }} className="px-5 py-4 text-[10px] text-left hover:bg-neutral-50 text-red-500 transition-colors">
                      CERRAR SESIÓN
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hover:scale-110 transition-transform hover:text-neutral-400">
                  <User className="w-5 h-5" strokeWidth={1.5} />
                </Link>
              )}
            </div>

            <div className={`hidden md:block h-4 w-[1px] ${isHome && !isScrolled ? 'bg-white/30' : 'bg-neutral-200'}`}></div>

            <Link href="/cart" className="relative group flex items-center p-2 -mr-2 md:p-0 md:mr-0">
              <ShoppingCart className="w-5 h-5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <CartCounter />
            </Link>
          </div>
        </div>
      </nav>

      {/* DRAWER MÓVIL (Con el fix de cierre) */}
      <div className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className={`fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white text-black p-6 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-10">
            <span className="font-black text-2xl tracking-[0.2em] uppercase">GRIEF®</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2">
              <X className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex flex-col gap-6 text-sm font-bold tracking-widest uppercase">
            <Link href="/tienda">Tienda</Link>
            <Link href="/tienda?categoria=remeras">Remeras & Tops</Link>
            <Link href="/tienda?categoria=buzos">Buzos & Hoodies</Link>
            <Link href="/manifiesto">Manifiesto</Link>
            <div className="h-[1px] w-full bg-neutral-100 my-4"></div>
            {status === "authenticated" ? (
              <button onClick={() => { clearCart(); signOut({ callbackUrl: '/login' }); }} className="text-left text-red-500">Cerrar Sesión</button>
            ) : (
              <Link href="/login">Ingresar</Link>
            )}
          </div>
        </div>
        <div className="absolute inset-0 z-[-1]" onClick={() => setIsMobileMenuOpen(false)}></div>
      </div>

      {/* OVERLAY DEL BUSCADOR */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full h-20 md:h-24 bg-white text-black flex items-center justify-center z-50 animate-in slide-in-from-top-full duration-300 border-b border-neutral-100 shadow-sm">
          <div className="max-w-4xl w-full px-8 flex items-center gap-4">
            <Search className={`w-6 h-6 text-neutral-400 ${isPending ? "animate-pulse" : ""}`} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="BUSCAR..."
              className="w-full text-base md:text-xl font-light tracking-widest outline-none uppercase bg-transparent"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setIsSearchOpen(false)} className="p-2">
              <X className="w-5 h-5 md:w-6 md:h-6 text-neutral-400" strokeWidth={1.5} />
            </button>
          </div>
        </div >
      )}
    </>
  );
}