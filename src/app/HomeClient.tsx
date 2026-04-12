"use client";
import { useRef, useEffect, ReactNode } from "react";
import Hero from "@/components/Hero";

export default function HomeClient({ children }: { children: ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isScrolling = false;

        const handleWheel = (e: WheelEvent) => {
            // Si estamos en medio de una transición, bloqueamos otros eventos
            if (isScrolling) return;

            const scrollTop = container.scrollTop;
            const vh = window.innerHeight;

            // CASO 1: Bajando del Hero a la Tienda
            // Si el scroll está cerca del tope y el usuario mueve la rueda hacia abajo (deltaY > 0)
            if (e.deltaY > 0 && scrollTop < 10) {
                e.preventDefault();
                isScrolling = true;
                container.scrollTo({
                    top: vh,
                    behavior: "smooth",
                });
                setTimeout(() => { isScrolling = false; }, 1000);
            }

            // CASO 2: Subiendo de la Tienda al Hero
            // Si el scroll está en la tienda y el usuario mueve la rueda hacia arriba (deltaY < 0)
            else if (e.deltaY < 0 && scrollTop >= vh - 10) {
                e.preventDefault();
                isScrolling = true;
                container.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
                setTimeout(() => { isScrolling = false; }, 1000);
            }
        };

        // Es CRUCIAL que el listener esté en el container y no en window
        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <main
            ref={containerRef}
            className="h-screen w-full overflow-y-scroll scroll-smooth bg-black outline-none"
        >
            <Hero containerRef={containerRef} />

            {/* El ProductGrid se renderiza aquí abajo */}
            <div className="min-h-screen w-full bg-white">
                {children}
            </div>
        </main>
    );
}