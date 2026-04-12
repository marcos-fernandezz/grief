"use client";

import { useState, useEffect, RefObject } from "react";

interface HeroProps {
  // Asegurate de que la interfaz acepte null para coincidir con useRef
  containerRef: RefObject<HTMLDivElement | null>;
}

export default function Hero({ containerRef }: HeroProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Mantenemos la lógica de scroll que detecta el movimiento del contenedor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Si scrolleó más de 50px, seteamos a true
      if (container.scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  return (
    <section className="relative h-screen w-full snap-start flex flex-col items-center justify-center bg-black text-white px-4 overflow-hidden pt-20">

      <div className="absolute inset-0 bg-neutral-900/90 z-0" />

      {/* Contenido (Animación de entrada rápida a 500ms) */}
      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-4xl animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-tight">
          No es el resultado. <br />
          <span className="text-gray-400">Es el proceso.</span>
        </h1>
        {/* ... (Tus párrafos y botones) */}
      </div>

      {/* 👇 LA FLECHA TITILANTE 👇 */}
      <div className="absolute bottom-10 z-10 flex flex-col items-center">
        <div
          className={`text-white transition-transform duration-500 
            ${isScrolled
              ? 'opacity-100 scale-110' // Estado: Usuario deslizó (Fija blanca y grande)
              : 'animate-flicker scale-100' // Estado: Usuario quieto (Titileo lento y gris)
            }`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="square" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

    </section>
  );
}