import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton"; 
import Carrusel from "@/components/Carrusel"; // 👈 Cambiamos el componente por el que creamos recién

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params; 

  const product = await db.product.findUnique({
<<<<<<< HEAD
    where: { slug },
    include: { sizes: true }
=======
    where: { slug }
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
  });

  if (!product) {
    notFound(); 
  }

  // Normalizamos las imágenes: nos aseguramos de que sea un Array utilizable
  const imagesArray = Array.isArray(product.images) 
    ? product.images 
    : typeof product.images === 'string' 
      ? JSON.parse(product.images) 
      : [];

  // Tomamos la primera imagen para el carrito
  const mainImage = imagesArray.length > 0 ? imagesArray[0] : "/placeholder.png";

<<<<<<< HEAD
  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);

=======
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
  return (
    <main className="min-h-screen bg-black text-white pt-40 pb-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        
        {/* LADO IZQUIERDO: CARRUSEL REUTILIZABLE */}
        <div className="w-full">
          <Carrusel images={imagesArray} alt={product.name} />
        </div>

        {/* LADO DERECHO: INFO Y COMPRA */}
        <div className="flex flex-col space-y-10 sticky top-40">
          <header>
            <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase">
              {product.category}
            </span>
            <h1 className="text-6xl font-black tracking-tighter uppercase mt-4 leading-[0.9]">
              {product.name}
            </h1>
            <p className="text-3xl font-light mt-6 text-neutral-200">
              ${Number(product.price).toLocaleString('es-AR')}
            </p>
          </header>

          <div className="h-[1px] bg-neutral-900 w-full" />

          <p className="text-neutral-400 text-sm leading-relaxed max-w-lg">
            {product.description || "Diseño minimalista de GRIEF® pensado para el máximo rendimiento."}
          </p>

          <div className="pt-6">
<<<<<<< HEAD
            {totalStock > 0 ? (
=======
            {product.stock > 0 ? (
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
<<<<<<< HEAD
                  image_url: mainImage,
                  sizes: product.sizes
=======
                  image_url: mainImage
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
                }} 
              />
            ) : (
              <button disabled className="w-full py-5 bg-neutral-900 text-neutral-600 font-bold uppercase tracking-[0.2em] text-[10px] cursor-not-allowed border border-white/5">
                Agotado / Sold Out
              </button>
            )}
          </div>

          {/* DETALLES EXTRA (Opcional para dar más cuerpo a la página) */}
          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-neutral-900">
            <div>
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Envío</h4>
              <p className="text-[10px] text-neutral-400 uppercase">A todo el país desde Villa Regina.</p>
            </div>
            <div>
              <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Stock</h4>
<<<<<<< HEAD
              <p className="text-[10px] text-neutral-400 uppercase">{totalStock} unidades disponibles.</p>
=======
              <p className="text-[10px] text-neutral-400 uppercase">{product.stock} unidades disponibles.</p>
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}