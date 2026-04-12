"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { processOrder } from '@/actions/checkout';

export default function CheckoutFlow() {
    const [step, setStep] = useState(1);
    const [isSdkReady, setIsSdkReady] = useState(false);

    const items = useCartStore((state) => state.items);
    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [shippingCost, setShippingCost] = useState(0);
    const [userData, setUserData] = useState({
        email: "",
        zipCode: "",
        address: "",
    });

    // Validaciones de pasos
    const isStep1Complete = userData.email.includes('@') && userData.zipCode.length >= 4 && userData.address.trim().length > 5;
    const isStep2Complete = shippingCost > 0;

    // 🟢 Inicialización corregida
    useEffect(() => {
        const mpKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
        if (mpKey) {
            initMercadoPago(mpKey, { locale: 'es-AR' }); // Forzamos localización Argentina
            setIsSdkReady(true);
        }
    }, []);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handlePaymentSubmit = async (formData: any) => {
        try {
            // El Brick de React pasa el objeto directo, no hace falta desestructurar { formData }
            const result = await processOrder(items, userData, formData);
            if (result.success) {
                window.location.href = `/gracias?orderId=${result.orderId}`;
            } else {
                alert("Error en el pago: " + (result.error || "Intente nuevamente"));
            }
        } catch (error) {
            console.error("Fallo crítico en el pago", error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-6 py-20">
            {/* IZQUIERDA: EL FLUJO */}
            <div className="flex flex-col gap-10">
                <div className="flex gap-4 border-b border-white/10 pb-4">
                    <span className={`text-[10px] uppercase tracking-widest ${step === 1 ? 'text-white' : 'text-neutral-500'}`}>01. Envío</span>
                    <span className="text-neutral-700">/</span>
                    <span className={`text-[10px] uppercase tracking-widest ${step === 2 ? 'text-white' : 'text-neutral-500'}`}>02. Logística</span>
                    <span className="text-neutral-700">/</span>
                    <span className={`text-[10px] uppercase tracking-widest ${step === 3 ? 'text-white' : 'text-neutral-500'}`}>03. Pago</span>
                </div>

                {step === 1 && (
                    <section className="animate-in fade-in slide-in-from-right-5 duration-500">
                        <h3 className="text-xl font-black uppercase mb-6 italic italic">¿A dónde enviamos? //</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="email"
                                placeholder="EMAIL *"
                                className="bg-transparent border border-white/20 p-4 text-xs focus:border-white outline-none uppercase font-bold tracking-widest"
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                value={userData.email}
                            />
                            <input
                                type="text"
                                placeholder="DIRECCIÓN COMPLETA *"
                                className="bg-transparent border border-white/20 p-4 text-xs focus:border-white outline-none uppercase font-bold tracking-widest"
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                value={userData.address}
                            />
                            <input
                                type="text"
                                placeholder="CÓDIGO POSTAL *"
                                className="bg-transparent border border-white/20 p-4 text-xs focus:border-white outline-none font-mono"
                                onChange={(e) => setUserData({ ...userData, zipCode: e.target.value })}
                                value={userData.zipCode}
                            />
                            <button
                                onClick={nextStep}
                                disabled={!isStep1Complete}
                                className="bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-20 transition-all"
                            >
                                Continuar a Logística
                            </button>
                        </div>
                    </section>
                )}

                {step === 2 && (
                    <section className="animate-in fade-in slide-in-from-right-5 duration-500">
                        <h3 className="text-xl font-black uppercase mb-6 italic italic">Logística //</h3>
                        <div className="flex flex-col gap-4">
                            <label className="border border-white/10 p-6 flex justify-between items-center cursor-pointer hover:bg-neutral-900 transition-all">
                                <div className="flex gap-4 items-center">
                                    <input type="radio" name="shipping" className="accent-white" onChange={() => setShippingCost(4500)} />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Andreani Domicilio</span>
                                        <span className="text-[9px] text-neutral-500 uppercase">3 a 5 días hábiles</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono">$4.500</span>
                            </label>
                            <div className="flex gap-4 mt-4">
                                <button onClick={prevStep} className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white">Volver</button>
                                <button
                                    onClick={nextStep}
                                    disabled={!isStep2Complete}
                                    className="flex-1 bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-20"
                                >
                                    Seleccionar Pago
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {step === 3 && (
                    <section className="animate-in fade-in slide-in-from-right-5 duration-500">
                        <h3 className="text-xl font-black uppercase mb-6 italic text-white">Método de Pago //</h3>

                        {/* 🟢 DEBUG LOGS: Esto se dispara cada vez que el Step 3 intenta cargar */}
                        {(() => {
                            console.log("%c--- VALIDANDO DATOS PARA MP ---", "color: #00ff00; font-weight: bold;");
                            console.table({
                                isSdkReady,
                                email: userData.email,
                                totalSinEnvio: cartTotal,
                                envio: shippingCost,
                                totalFinal: cartTotal + shippingCost,
                                publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY?.substring(0, 15) + "..."
                            });
                            return null;
                        })()}

                        {isSdkReady && userData.email && (cartTotal + shippingCost) > 0 ? (
                            <div className="bg-white p-4 rounded-sm min-h-[450px]">
                                <Payment
                                    key={`mp-brick-v5-${Math.round(cartTotal + shippingCost)}`}
                                    initialization={{
                                        // 🟢 SOLO MANDAMOS EL AMOUNT (Sin preferenceId)
                                        amount: Math.round(cartTotal + shippingCost),
                                        payer: {
                                            email: userData.email.trim().toLowerCase(),
                                        },
                                    }}
                                    customization={{
                                        paymentMethods: {
                                            // 🟢 USAMOS EL FORMATO QUE ME PASASTE (CUIDADO CON EL CAMELCASE)
                                            ticket: "all",
                                            creditCard: "all",
                                            debitCard: "all",

                                        },
                                        visual: {
                                            hideStatusDetails: false,
                                            hidePaymentButton: false,
                                        }
                                    } as any}
                                    onSubmit={handlePaymentSubmit} // Tu función que ya tiene el processOrder
                                    onError={(error) => {
                                        console.error("--- ERROR BRICK ---");
                                        console.dir(error);
                                    }}
                                    onReady={() => console.log("Brick de GRIEF® listo.")}
                                />
                            </div>
                        ) : (
                            <div className="p-10 border border-dashed border-white/20 text-center uppercase text-[10px] tracking-widest text-neutral-500">
                                {!isSdkReady ? "Cargando Pasarela..." : "Faltan datos de envío o email..."}
                            </div>
                        )}
                    </section>
                )}
            </div>

            {/* DERECHA: RESUMEN */}
            <div className="lg:sticky lg:top-32 h-fit bg-neutral-900/50 p-8 border border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-2 text-neutral-400">Resumen // GRIEF®</h4>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                        <span>Subtotal</span>
                        <span className="font-mono text-white">${cartTotal.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                        <span>Envío</span>
                        <span className="font-mono text-white">${shippingCost.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-black uppercase mt-6 pt-6 border-t border-white/10 italic">
                        <span>Total</span>
                        <span>${(cartTotal + shippingCost).toLocaleString('es-AR')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}