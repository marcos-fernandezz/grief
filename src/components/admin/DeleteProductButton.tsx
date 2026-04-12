"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteProduct } from "@/actions/products";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteProduct(id);

        if (result.success) {
            setIsOpen(false);
        } else {
            alert("Error: " + result.error);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-sm"
                title="Eliminar Producto"
            >
                <Trash2 size={16} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={() => !isDeleting && setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-neutral-950 border border-white/10 p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3 text-red-500">
                                <AlertTriangle size={20} />
                                <h3 className="text-lg font-black uppercase italic italic">Atención //</h3>
                            </div>
                            {!isDeleting && (
                                <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <p className="text-neutral-400 text-[10px] uppercase tracking-[0.2em] leading-relaxed mb-10">
                            Estás por eliminar permanentemente el producto <span className="text-white">"{name}"</span>.
                            Esta acción borrará las imágenes en Supabase y el registro en la DB.
                        </p>

                        <div className="flex gap-4">
                            <button
                                disabled={isDeleting}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 border border-white/10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors disabled:opacity-20"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? "Eliminando..." : "Confirmar Borrado"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}