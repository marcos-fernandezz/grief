"use client";
import { useState, useEffect } from "react";
import { updateProduct } from "@/actions/products";
import { X, Save, Box, Plus, Trash2 } from "lucide-react";

export default function EditProductModal({ product, isOpen, onClose }: { product: any, isOpen: boolean, onClose: () => void }) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: "",
        description: "",
        category: "",
        sizes: [] as { id?: string, size: string, stock: string }[]
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                price: product.price?.toString() || "",
                description: product.description || "",
                category: product.category || "",
                sizes: product.sizes?.map((s: any) => ({
                    id: s.id,
                    size: s.size,
                    stock: s.stock.toString()
                })) || []
            });
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const sanitizeNumber = (val: string) => {
        const onlyNums = val.replace(/\D/g, '');
        return onlyNums.replace(/^0+/, '') || "0";
    };

    // 🟢 FUNCIÓN PARA AÑADIR NUEVO TALLE
    const addSizeField = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { size: "", stock: "0" }] // Sin ID porque es nuevo
        });
    };

    // 🟢 FUNCIÓN PARA QUITAR UN TALLE ANTES DE GUARDAR
    const removeSizeField = (index: number) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateProduct(product.id, {
            ...formData,
            price: Number(formData.price),
            sizes: formData.sizes.filter(s => s.size.trim() !== "").map(s => ({
                size: s.size.toUpperCase(),
                stock: Number(s.stock)
            }))
        });
        if (res.success) onClose();
        else alert("Error: " + res.error);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-neutral-950 border-l border-white/10 h-full w-full max-w-xl p-10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
                <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                    <h2 className="text-xl font-black uppercase italic">Editar Producto //</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={20} /></button>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* PRECIO (Chau ceros a la izquierda) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Precio (ARS)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: sanitizeNumber(e.target.value) })}
                            className="bg-transparent border border-white/10 p-3 text-xs focus:border-white outline-none font-mono"
                        />
                    </div>

                    {/* SECCIÓN DE STOCK DINÁMICO */}
                    <div className="bg-white/5 p-5 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Box size={14} className="text-neutral-500" />
                                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Inventario //</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addSizeField}
                                className="text-[10px] bg-white text-black px-3 py-1 font-bold uppercase hover:bg-neutral-200 transition-colors flex items-center gap-1"
                            >
                                <Plus size={12} /> Añadir Talle
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {formData.sizes.map((s, index) => (
                                <div key={index} className="flex items-center gap-3 bg-neutral-900 p-2 border border-white/5">
                                    <input
                                        placeholder="TALLE (EJ: XL)"
                                        value={s.size}
                                        onChange={(e) => {
                                            const newSizes = [...formData.sizes];
                                            newSizes[index].size = e.target.value;
                                            setFormData({ ...formData, sizes: newSizes });
                                        }}
                                        className="bg-transparent border-b border-white/10 w-full text-xs font-bold uppercase outline-none focus:border-white p-1"
                                    />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={s.stock}
                                        onChange={(e) => {
                                            const newSizes = [...formData.sizes];
                                            newSizes[index].stock = sanitizeNumber(e.target.value);
                                            setFormData({ ...formData, sizes: newSizes });
                                        }}
                                        className="bg-transparent border-b border-white/10 w-24 text-right text-xs font-mono outline-none focus:border-white p-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSizeField(index)}
                                        className="text-neutral-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DESCRIPCIÓN Y BOTÓN GUARDAR */}
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-transparent border border-white/10 p-3 text-xs focus:border-white outline-none h-24 resize-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-50"
                    >
                        {loading ? "Sincronizando..." : "Confirmar Cambios //"}
                    </button>
                </form>
            </div>
        </div>
    );
}