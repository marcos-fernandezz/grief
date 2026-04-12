"use client"; // 🟢 VITAL: Para usar el estado del modal

import { useState } from "react";
import { Edit2 } from "lucide-react";
import EditProductModal from "@/components/admin/EditProductModal"; // El que diseñamos antes

export default function EditProductButton({ product }: { product: any }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* 1. El gatillo (El lapicito) */}
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center p-2 text-neutral-500 hover:text-white hover:bg-white/10 transition-colors rounded-sm"
                title="Editar Producto"
            >
                <Edit2 size={16} />
            </button>

            {/* 2. El Modal que se renderiza "en el aire" (Portal) */}
            {isOpen && (
                <EditProductModal
                    product={product}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}