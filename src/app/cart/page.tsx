'use client';

import { useCartStore } from '../../store/cartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CheckoutFlow from '@/components/CheckoutFlow'; // El que creamos antes
import { ArrowRight, Trash2, ChevronLeft } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [mounted, setMounted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return <main className="min-h-screen bg-black" />;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white pt-40 px-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Tu bolsa está vacía</h1>
        <Link href="/tienda" className="mt-8 border border-white/20 px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {!showCheckout ? (
          /* --- VISTA 1: RESUMEN Y EDICIÓN DEL CARRITO --- */
          <div className="animate-in fade-in duration-700">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-16 italic">Tu Carrito //</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Listado */}
              <div className="lg:col-span-2 space-y-10">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 border-b border-white/10 pb-10">
                    <div className="w-24 md:w-32 aspect-[3/4] bg-neutral-900 flex-shrink-0">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale" />
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-sm md:text-base font-black uppercase tracking-widest">{item.name}</h2>
                          <p className="text-[10px] text-neutral-500 uppercase mt-1 tracking-widest font-bold">Concept Piece</p>
                        </div>
                        <span className="font-mono text-sm">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-white/20 h-10">
                          <button onClick={() => updateQuantity(item.id, 'decrease')} className="px-4 h-full hover:bg-white hover:text-black transition-colors">-</button>
                          <span className="w-8 text-center font-mono text-[10px]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 'increase')} className="px-4 h-full hover:bg-white hover:text-black transition-colors">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-neutral-500 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de costos antes de ir al Checkout */}
              <div className="h-fit sticky top-32 bg-neutral-900/30 p-8 border border-white/5">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-8 pb-2 border-b border-white/10">Resumen de Orden</h3>
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-xs uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="font-mono">${total.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-500">
                    <span>Envío</span>
                    <span>Calculado en el siguiente paso</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-black uppercase italic mb-10 pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-white text-black py-6 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:invert transition-all"
                >
                  Iniciar proceso de pago
                  <ArrowRight size={14} />
                </button>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-6 text-center leading-relaxed">
                  Impuestos incluidos. Envío calculado al ingresar tu ubicación.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* --- VISTA 2: FORMULARIO DE CHECKOUT PASO A PASO --- */
          <div className="animate-in slide-in-from-right-5 duration-700">
            <button
              onClick={() => setShowCheckout(false)}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors mb-12 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Volver a mi bolsa
            </button>

            {/* Renderizamos el CheckoutFlow pasándole el total */}
            <CheckoutFlow />
          </div>
        )}

      </div>
    </main>
  );
}