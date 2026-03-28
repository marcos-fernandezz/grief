"use client";

import { useState, useEffect } from "react";
import { Plus, X, Box } from "lucide-react";

interface SizeStock {
  size: string;
  stock: number;
}

interface Props {
  onChange: (sizes: SizeStock[]) => void;
}

export default function SizeManager({ onChange }: Props) {
  const [sizes, setSizes] = useState<SizeStock[]>([{ size: "", stock: 0 }]);

  // Cada vez que 'sizes' cambia, notificamos al formulario padre
  useEffect(() => {
    onChange(sizes);
  }, [sizes, onChange]);

  const addRow = () => {
    setSizes([...sizes, { size: "", stock: 0 }]);
  };

  const removeRow = (index: number) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = (index: number, field: keyof SizeStock, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = { 
      ...newSizes[index], 
      [field]: field === "size" ? (value as string).toUpperCase() : Number(value) 
    };
    setSizes(newSizes);
  };

  return (
    <div className="flex flex-col gap-4 bg-neutral-900/30 p-5 border border-white/5 rounded-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Box size={14} className="text-neutral-500" />
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
            Inventario por Talle
          </label>
        </div>
        <button 
          type="button" 
          onClick={addRow}
          className="text-white hover:bg-white hover:text-black p-1 transition-all rounded-full border border-white/10"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="grid gap-3">
        {sizes.map((s, i) => (
          <div key={i} className="flex gap-3 items-center group animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex-1 relative">
              <input 
                placeholder="S, M, 42..." 
                className="w-full bg-black border border-white/10 p-3 text-[11px] uppercase text-white focus:outline-none focus:border-white/40 transition-colors font-medium"
                value={s.size}
                onChange={(e) => handleUpdate(i, "size", e.target.value)}
                required
              />
            </div>
            
            <div className="w-24 relative">
              <input 
                type="number" 
                placeholder="0" 
                min="0"
                className="w-full bg-black border border-white/10 p-3 text-[11px] text-white focus:outline-none focus:border-white/40 transition-colors font-mono"
                value={s.stock}
                onChange={(e) => handleUpdate(i, "stock", e.target.value)}
                required
              />
            </div>

            <button 
              type="button" 
              onClick={() => removeRow(i)}
              className={`p-2 transition-colors ${sizes.length === 1 ? 'opacity-0 cursor-default' : 'text-neutral-600 hover:text-red-500'}`}
              disabled={sizes.length === 1}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2">
        * Definí al menos un talle (ej: "Único" si no tiene variaciones).
      </p>
    </div>
  );
}