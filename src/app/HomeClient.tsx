"use client";

import Hero from "@/components/Hero";

export default function HomeClient({ children }: { children: React.ReactNode }) {
    return (
        // Sacamos el h-screen y el overflow atrapado. Dejamos que el body scrollee.
        <main className="w-full bg-white relative overflow-x-hidden">

            {/* SECCIÓN 1: EL HERO */}
            {/* Le sacamos el containerRef porque ahora usaremos el scroll nativo de la ventana */}
            <div className="relative">
                <Hero />
            </div>

            {/* SECCIÓN 2: LA TIENDA */}
            <div className="min-h-screen w-full bg-white pt-20 pb-24 px-6 z-10 relative">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </div>

        </main>
    );
}