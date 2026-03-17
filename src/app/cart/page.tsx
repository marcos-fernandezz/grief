'use client';

import { useCartStore } from '../../store/cartStore';
import { processOrder } from '../../actions/checkout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';



export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isPending, setIsPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: ''
  });

  useEffect(() => {
    // Inicializamos solo cuando el componente se monta en el cliente
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    
    if (publicKey) {
      initMercadoPago(publicKey);
      setMounted(true);
    } else {
      console.error("Falta la PUBLIC_KEY de Mercado Pago en las variables de entorno");
    }
  }, []);
  
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePaymentSubmit = async ({ formData }: any) => {
    setIsPending(true);
    
    // Enviamos los datos al Server Action
    const result = await processOrder(items, customerInfo, formData);
    
    // Estrechamiento de tipos para evitar errores de TypeScript
    if (result.success && 'orderId' in result) {
      clearCart(); // Solo borramos si el pago fue exitoso
      alert(`Orden pagada con éxito: ${result.orderId}`);
    } else if (!result.success && 'error' in result) {
      alert(`Error en el pago: ${result.error}`);
      setIsPending(false);
    }
  };

  // Mientras no esté montado, mostramos una pantalla negra para evitar el flash de "carrito vacío"
  if (!mounted) return <main className="min-h-screen bg-black" />;

  // Si después de montar realmente no hay nada, mostramos el mensaje de vacío
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white pt-40 px-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Tu bolsa está vacía</h1>
        <Link href="/tienda" className="mt-8 border-b border-white pb-1 text-xs font-bold tracking-widest uppercase hover:text-gray-400 transition-colors">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-16">Tu Carrito</h1>

        {/* Listado de productos */}
        <div className="space-y-12 mb-20">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 border-b border-white/10 pb-8 last:border-0">
              <div className="w-full md:w-32 aspect-[3/4] bg-neutral-900 flex-shrink-0 overflow-hidden rounded-sm">
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                )}
              </div>
              <div className="flex-grow w-full">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter leading-tight">{item.name}</h2>
                <p className="font-mono text-lg mt-2 text-gray-300">${item.price.toLocaleString('es-AR')}</p>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
                <div className="flex items-center border border-white/20 h-10 md:h-12">
                  <button onClick={() => updateQuantity(item.id, 'decrease')} className="px-4 h-full hover:bg-white hover:text-black transition-colors">-</button>
                  <span className="w-10 text-center font-mono text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 'increase')} className="px-4 h-full hover:bg-white hover:text-black transition-colors">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-red-500 transition-colors">[ Quitar ]</button>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Pago Estilo Adidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
          <div className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Información</h2>
            <input 
              type="email" 
              placeholder="CORREO ELECTRÓNICO *" 
              className="w-full bg-transparent border-b border-white/20 py-4 outline-none focus:border-white transition-colors uppercase text-xs font-bold tracking-widest"
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
            <div className="flex justify-between w-full text-4xl font-black uppercase tracking-tighter pt-8">
              <span>Total</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-sm min-h-[400px]">
            {customerInfo.email.includes('@') ? (
              <Payment
                initialization={{
                  amount: total,
                  payer: { email: customerInfo.email },
                }}
                customization={{
                  paymentMethods: {
                    minInstallments: 1, 
                    maxInstallments: 12,
                    prepaidCard: 'all',
                    creditCard: 'all',
                    debitCard: 'all',
                    types: { excluded: ['ticket'] },
                  } as any,
                  visual: { theme: 'flat' } as any,
                }}
                onSubmit={handlePaymentSubmit}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-black text-[10px] font-bold uppercase tracking-widest text-center px-10">
                Ingresá tu email para habilitar el pago
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}