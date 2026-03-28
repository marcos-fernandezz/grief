import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Search, Edit2, AlertCircle } from "lucide-react";
import NewProductModal from "./NewProductModal";


export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentCategory = params.category || "ALL";

  // 1. CONSULTA A LA BASE DE DATOS CON FILTROS
  const products = await db.product.findMany({
    where: {
      ...(currentCategory !== "ALL" ? { category: currentCategory } : {}),
    },
    include: { sizes: true },
    orderBy: { createdAt: "desc" },
  });

  const productsWithStock = products.map(p => ({
    ...p,
    totalStock: p.sizes.reduce((acc, s) => acc + s.stock, 0)
  }));

  // 2. CÁLCULO DE MÉTRICAS RÁPIDAS
  const totalProducts = productsWithStock.length;
  const outOfStock = productsWithStock.filter((p) => p.totalStock === 0).length;
  const lowStock = productsWithStock.filter((p) => p.totalStock > 0 && p.totalStock <= 5).length;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12 pt-10 px-6 max-w-7xl mx-auto">
      
      {/* HEADER Y BOTÓN NUEVO */}
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Inventario</h1>
          <p className="text-neutral-500 text-[10px] mt-1 uppercase tracking-widest">
            Gestión de catálogo y métricas de producto
          </p>
        </div>
        
        <NewProductModal />
      </header>

      {/* MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-950 border border-white/10 p-5 flex flex-col gap-1">
          <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Total Catálogo</span>
          <span className="text-2xl font-bold">{totalProducts}</span>
        </div>
        <div className="bg-neutral-950 border border-white/10 p-5 flex flex-col gap-1">
          <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Poco Stock (1-5)</span>
          <span className="text-2xl font-bold text-yellow-500">{lowStock}</span>
        </div>
        <div className="bg-neutral-950 border border-white/10 p-5 flex flex-col gap-1">
          <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Agotados</span>
          <span className="text-2xl font-bold text-red-500">{outOfStock}</span>
        </div>
      </div>

      {/* BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="flex justify-between items-center bg-neutral-950 border border-white/10 p-4">
        <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold">
          <Link 
            href="/admin/products" 
            className={`${currentCategory === "ALL" ? "text-white" : "text-neutral-600 hover:text-white"}`}
          >
            Todos
          </Link>
          <Link 
            href="/admin/products?category=TOPS" 
            className={`${currentCategory === "TOPS" ? "text-white" : "text-neutral-600 hover:text-white"}`}
          >
            Tops
          </Link>
          <Link 
            href="/admin/products?category=BOTTOMS" 
            className={`${currentCategory === "BOTTOMS" ? "text-white" : "text-neutral-600 hover:text-white"}`}
          >
            Bottoms
          </Link>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="BUSCAR PRODUCTO..." 
            className="bg-transparent border border-white/10 text-white text-[10px] uppercase tracking-widest py-2 pl-9 pr-4 focus:outline-none focus:border-white/30 w-64"
          />
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-neutral-950 border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-neutral-500 text-[10px] uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="p-4 font-medium">Producto</th>
              <th className="p-4 font-medium">Categoría</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Ventas</th>
              <th className="p-4 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {productsWithStock.length > 0 ? (
              productsWithStock.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-900 border border-white/10 flex items-center justify-center">
                        {/* Aquí iría la imagen <Image /> */}
                        <span className="text-[8px] text-neutral-600">FOTO</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white uppercase tracking-tighter">{product.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[10px] uppercase tracking-widest text-neutral-400">
                    {product.category}
                  </td>
                  <td className="p-4 font-mono text-white">
                    ${Number(product.price).toLocaleString('es-AR')}
                  </td>
                  <td className="p-4">
                    {product.totalStock === 0 ? (
                      <span className="flex items-center gap-1 text-red-500 text-[10px] uppercase tracking-widest font-bold bg-red-500/10 px-2 py-1 w-max">
                        <AlertCircle size={12} /> Agotado
                      </span>
                    ) : product.totalStock <= 5 ? (
                      <span className="text-yellow-500 font-mono bg-yellow-500/10 px-2 py-1">{product.totalStock} un.</span>
                    ) : (
                      <span className="text-neutral-300 font-mono">{product.totalStock} un.</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-white font-mono">0</span>
                      <span className="text-[8px] text-neutral-600 uppercase tracking-widest">Unidades</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center justify-center p-2 text-neutral-500 hover:text-white hover:bg-white/10 transition-colors rounded-sm"
                      title="Editar Producto"
                    >
                      <Edit2 size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-neutral-600 text-[10px] uppercase tracking-widest">
                  No hay productos en tu inventario. Haz clic en "Nuevo Producto" para empezar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}