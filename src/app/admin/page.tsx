import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. CONSULTAS REALES A LA BASE DE DATOS
  // Buscamos todos los productos para calcular el inventario
  const products = await db.product.findMany();
  
  const totalProducts = products.length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  
  // Calculamos el valor total del inventario (Precio * Stock de cada producto)
  const totalInventoryValue = products.reduce(
    (acc, product) => acc + (Number(product.price) * product.stock), 
    0
  );

  // 2. PREPARACIÓN PARA LAS VENTAS (Órdenes)
  // Usamos un try/catch por si la tabla Order todavía no existe en tu schema.prisma
  let totalSales = 0;
  let totalOrdersCount = 0;
  let recentOrders: any[] = [];

  try {
    // Si ya tenés el modelo Order, esto traerá las ventas reales
    const orders = await (db as any).order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5 // Solo los últimos 5 pedidos
    });
    totalOrdersCount = orders.length;
    totalSales = orders.reduce((acc: number, order: any) => acc + Number(order.total), 0);
    recentOrders = orders;
  } catch (error) {
    // Si la tabla Order no existe, mostramos 0 sin romper la página
    console.log("Aviso: Tabla de órdenes no encontrada o vacía.");
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12 pt-24 px-6 max-w-7xl mx-auto">
      
      <header className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Centro de Datos GRIEF®</h1>
          <p className="text-neutral-500 text-sm mt-1 uppercase tracking-widest">Panel de Control Administrativo</p>
        </div>
      </header>

      {/* KPI CARDS (Métricas Reales) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col gap-2 hover:border-white/30 transition-colors">
          <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-2">
            Valor del Inventario
          </span>
          <span className="text-4xl font-black tracking-tighter">
            ${totalInventoryValue.toLocaleString('es-AR')}
          </span>
          <span className="text-neutral-600 text-[10px] uppercase tracking-widest">Capital inmovilizado</span>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col gap-2 hover:border-white/30 transition-colors">
          <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-2">
            Productos Activos
          </span>
          <span className="text-4xl font-black tracking-tighter">
            {totalProducts}
          </span>
          <span className="text-neutral-600 text-[10px] uppercase tracking-widest">En catálogo</span>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col gap-2 hover:border-white/30 transition-colors">
          <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-2">
            Agotados (Sold Out)
          </span>
          <span className="text-4xl font-black tracking-tighter">
            {outOfStockCount}
          </span>
          <span className={`${outOfStockCount > 0 ? "text-red-500" : "text-neutral-600"} text-[10px] uppercase tracking-widest`}>
            {outOfStockCount > 0 ? "Requiere reposición" : "Stock saludable"}
          </span>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col gap-2 hover:border-white/30 transition-colors">
          <span className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-2">
            Ventas Totales
          </span>
          <span className="text-4xl font-black tracking-tighter text-white">
            ${totalSales.toLocaleString('es-AR')}
          </span>
          <span className="text-green-500 text-[10px] uppercase tracking-widest">
            {totalOrdersCount} Pedidos confirmados
          </span>
        </div>

      </div>

      {/* TABLA DE ÚLTIMOS PEDIDOS */}
      <div className="mt-8">
        <h2 className="text-[10px] font-bold uppercase text-neutral-500 mb-4 tracking-[0.2em]">Registro de Operaciones</h2>
        <div className="bg-neutral-950 border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-neutral-400 text-[10px] uppercase tracking-widest border-b border-white/10">
              <tr>
                <th className="p-4 font-medium">ID Pedido</th>
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-white">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="p-4 text-neutral-500">{new Date(order.createdAt).toLocaleDateString('es-AR')}</td>
                    <td className="p-4 text-neutral-300">{order.customerName || "Cliente"}</td>
                    <td className="p-4">
                      <span className="bg-white/10 text-white px-2 py-1 text-[9px] uppercase font-bold tracking-widest">
                        {order.status || "PAGADO"}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">${Number(order.total).toLocaleString('es-AR')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-600 text-[10px] uppercase tracking-widest">
                    Aún no hay transacciones registradas en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}