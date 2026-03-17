import Link from "next/link";


export default function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-black text-white px-4 overflow-hidden pt-20">
      
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-neutral-900/90 z-0" />

      {/* Contenido */}
      <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-tight">
          No es el resultado. <br />
          <span className="text-gray-400">Es el proceso.</span>
        </h1>

        <p className="text-sm md:text-lg font-medium tracking-widest uppercase text-gray-300 max-w-lg">
          GRIEF no es resignación. Es transformación.
        </p>

        <div className="flex gap-4">
          <Link 
            href="/tienda" 
            className="px-8 py-3 border border-white bg-white text-black font-bold tracking-widest uppercase text-xs hover:bg-transparent hover:text-white transition-all duration-300"
          >
            Conocé GRIEF
          </Link>
          
          <Link 
            href="/manifiesto" 
            className="px-8 py-3 border border-white/30 text-white font-bold tracking-widest uppercase text-xs hover:bg-white hover:text-black transition-all duration-300"
          >
            El Manifiesto
          </Link>
        </div>
      </div>
    </section>
  );
}