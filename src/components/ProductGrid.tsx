import { db } from "@/lib/db";
import Link from "next/link";

export default async function ProductGrid() {
    const products = await db.product.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
    });

    // Si no hay productos, no renderizamos nada (así no se ve el recuadro vacío)
    if (products.length === 0) return null;

    return (
        <section className="h-screen w-full bg-white text-black pt-32 px-6 md:px-12 flex flex-col items-center">
            <div className="max-w-7xl w-full h-full flex flex-col">

                <div className="flex justify-between items-end mb-16 border-b-2 border-black pb-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                        Colección // 01
                    </h2>
                </div>

                {/* Agregamos una animación de entrada para que aparezcan suavemente */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                    {products.map((product) => (
                        <Link key={product.id} href={`/tienda/${product.slug}`} className="group flex flex-col">
                            <div className="aspect-[3/4] bg-neutral-100 mb-6 overflow-hidden relative">
                                {product.images[0] && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[11px] font-black uppercase tracking-wider">{product.name}</h3>
                                <p className="text-[10px] text-black font-medium">$ {product.price.toLocaleString('es-AR')}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}