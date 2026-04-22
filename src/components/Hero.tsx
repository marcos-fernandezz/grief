"use client";

import { useState, useEffect } from "react";

// Ya no necesitamos recibir props
export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Ahora escuchamos a la ventana (window), igual que hace el Menú
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    // Reemplazá el enlace de url() por la ruta de tu foto cuando la tengas (ej: bg-[url('/hero-grief.jpg')])
    <section className="relative h-screen w-full flex flex-col justify-center bg-black text-white px-6 md:px-16 overflow-hidden">
      {/* Contenido alineado a la izquierda (Estilo Editorial) */}
      {/* Ajuste: En celu el espaciado es un poco menor (space-y-4, mt-12) y en PC vuelve a tu original (md:space-y-6, md:mt-16) */}
      <div className="z-10 flex flex-col items-start space-y-4 md:space-y-6 max-w-3xl animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both mt-12 md:mt-16">

        {/* Ajuste: En celu usamos text-4xl y tracking-tight para que "resultado" no se corte. En PC vuelve a tu text-7xl y tracking-[0.1em] original */}
        <h1 className="text-4xl md:text-7xl font-black tracking-tight md:tracking-[0.1em] uppercase leading-none">
          No es el <br />
          resultado.
        </h1>

        {/* Ajuste: En celu text-base para que sea legible sin ocupar todo. En PC vuelve a tu text-2xl original */}
        <p className="text-base md:text-2xl font-light tracking-wider md:tracking-widest uppercase text-neutral-200">
          Es el proceso.
        </p>

        {/* Botón limpio y cuadrado tipo DFYNE */}
        {/* Ajuste: En celu un padding ligeramente menor (px-6 py-3) y texto más chico. En PC vuelve a tu px-8 py-4 original */}
        <button className="mt-4 px-6 py-3 md:px-8 md:py-4 bg-white text-black text-[10px] md:text-xs font-black tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors">
          Explorar Tienda
        </button>
      </div>

      {/* La flecha titilante */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div
          className={`text-white transition-transform duration-500 
            ${isScrolled ? 'opacity-100 scale-110' : 'animate-flicker scale-100'}`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="square" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

    </section>
  );
}