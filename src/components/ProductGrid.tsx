import { db } from "@/lib/db";
import Link from "next/link";
const categoryMap: Record<string, string> = {
    "remeras": "tops",
    "buzos": "tops", // 👇 Ambos apuntan a la misma categoría general
    "pantalones": "bottoms",
    "accesorios": "accessories"
};
export default async function ProductGrid({ searchParams }: { searchParams?: any }) {
    const params = await searchParams;

    // 1. Atrapamos los dos datos de la URL
    const categorySpanish = params?.categoria;
    const searchQuery = params?.q; // 👈 Acá atrapamos lo que el usuario escribe en la lupa

    const categoryInEnglish = categorySpanish ? categoryMap[categorySpanish] || categorySpanish : undefined;

    // 2. Actualizamos la consulta de Prisma
    const products = await db.product.findMany({
        where: {
            // Filtro 1: Por Categoría (Menú)
            category: categoryInEnglish ? {
                equals: categoryInEnglish,
                mode: 'insensitive',
            } : undefined,

            // Filtro 2: Por Palabra (Lupa)
            name: searchQuery ? {
                contains: searchQuery, // "contains" busca coincidencias parciales
                mode: 'insensitive',
            } : undefined,
        },
        // Opcional: para que los más nuevos salgan primero
        orderBy: {
            createdAt: 'desc'
        }
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 w-full">
                    {products.map((product) => (
                        <Link key={product.id} href={`/tienda/${product.slug}`} className="group flex flex-col w-full">
                            <div className="aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden relative w-full">
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
                                <p className="text-[10px] text-black font-medium">$ {Number(product.price).toLocaleString('es-AR')}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                {/* Agregamos una animación de entrada para que aparezcan suavemente */}
                /</div>
        </section>
    )
}