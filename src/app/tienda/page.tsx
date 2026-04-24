import { db } from "../../lib/db";
import Link from "next/link";
import NextImage from 'next/image';

// 1. Definimos el mapeador fuera del componente para que sea fácil de mantener
// La llave (pantalones) es lo que viene en la URL, el valor (BOTTOMS) es lo que está en Supabase
const CATEGORY_MAP: Record<string, string> = {
  "pantalones": "BOTTOMS",
  "remeras": "TOPS",
  "buzos": "HOODIES",
  "accesorios": "ACCESSORIES",
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; coleccion?: string }>;
}) {

  const params = await searchParams;

  // 👇 TRADUCCIÓN LÓGICA 👇
  // Si existe categoria, intentamos buscar su equivalente en el mapa. 
  // Usamos .toLowerCase() para que no importe si la URL viene con mayúsculas.
  const rawCategory = params.categoria;
  const dbCategory = rawCategory
    ? (CATEGORY_MAP[rawCategory.toLowerCase()] || rawCategory)
    : undefined;

  let products: any[] = [];

  try {
    const whereClause: any = {};

    if (params.q) {
      whereClause.name = {
        contains: params.q,
        mode: "insensitive",
      };
    }

    // 2. Usamos dbCategory (la traducida) para la consulta a Prisma
    if (dbCategory) {
      whereClause.category = {
        equals: dbCategory,
        mode: "insensitive",
      };
    }

    if (params.coleccion) {
      whereClause.collection = {
        equals: params.coleccion,
        mode: "insensitive",
      };
    }

    products = await db.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        sizes: true
      }
    });
  } catch (error) {
    console.error("Error conectando a la DB:", error);
  }

  // 3. Para el título usamos el nombre "lindo" (params.categoria)
  const pageTitle = params.q
    ? `Resultados para "${params.q}"`
    : params.categoria
      ? params.categoria
      : params.coleccion
        ? `Colección: ${params.coleccion}`
        : "Todos los productos";

  return (
    <main className="min-h-screen bg-white text-black pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            {pageTitle}
          </h1>
          <p className="text-gray-500 tracking-widest uppercase text-xs mt-2">
            {products.length} {products.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}
          </p>
        </header>

        {products.length === 0 ? (
          <div className="py-20 text-center border border-black/10">
            <p className="text-sm uppercase tracking-widest text-gray-400">
              No se hallaron productos que coincidan con tu búsqueda.
            </p>
            <Link href="/tienda" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-colors">
              Ver todo el catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product: any) => {
              const totalStock = product.sizes.reduce((acc: number, s: any) => acc + s.stock, 0);
              const isSoldOut = totalStock === 0;

              const images = Array.isArray(product.images)
                ? product.images
                : typeof product.images === 'string'
                  ? JSON.parse(product.images)
                  : [];

              return (
                <Link key={product.id} href={`/tienda/${product.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-neutral-900 overflow-hidden relative border border-black/5">
                    {images.length > 0 ? (
                      <>
                        <NextImage
                          src={images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={`object-cover transition-all duration-700 ${images.length > 1 ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
                        />
                        {images.length > 1 && (
                          <NextImage
                            src={images[1]}
                            alt={`${product.name} alt`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105"
                          />
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-neutral-800" />
                    )}
                    {isSoldOut && (
                      <span className="absolute top-4 right-4 bg-black text-white text-[9px] font-black px-2 py-1 uppercase z-20">
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold uppercase tracking-tight text-sm">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {product.category}
                      </p>
                    </div>
                    <p className="font-mono text-sm">
                      ${Number(product.price).toLocaleString('es-AR')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}