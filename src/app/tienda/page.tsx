import { db } from "../../lib/db";
import Link from "next/link";
import NextImage from 'next/image';
import { ProductWithSizes } from "@/types/product";

export default async function TiendaPage() {
  let products: ProductWithSizes[] = [];
  try {
    products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        sizes: true
      }
    });
  } catch (error) {
    console.error("Error conectando a la DB:", error);
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black tracking-tighter uppercase">Drop 01</h1>
          <p className="text-gray-500 tracking-widest uppercase text-xs mt-2">
            Equipamiento para el proceso
          </p>
        </header>

        {products.length === 0 ? (
          <div className="py-20 text-center border border-white/10">
            <p className="text-sm uppercase tracking-widest text-gray-400">
              No se hallaron productos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product: ProductWithSizes) => {
              const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
              const isSoldOut = totalStock === 0;
              // Normalizamos las imágenes: nos aseguramos de que sea un Array utilizable
              const images = Array.isArray(product.images)
                ? product.images
                : typeof product.images === 'string'
                  ? JSON.parse(product.images)
                  : [];

              return (
                <Link
                  key={product.id}
                  href={`/tienda/${product.slug}`}
                  className="group block"
                >
                  {/* Contenedor de Imagen con Efecto Hover */}
                  <div className="aspect-[3/4] bg-neutral-900 overflow-hidden relative border border-white/5">
                    {images.length > 0 ? (
                      <>
                        {/* Imagen Principal */}
                        <NextImage
                          src={images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className={`object-cover transition-all duration-700 ${images.length > 1 ? "group-hover:opacity-0" : "group-hover:scale-105"
                            }`}
                        />

                        {/* Segunda Imagen (Aparece en Hover) */}
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
                      <span className="absolute top-4 right-4 bg-white text-black text-[9px] font-black px-2 py-1 uppercase z-20">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Info del Producto */}
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