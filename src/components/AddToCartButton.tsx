"use client";

import { useState } from "react";
import { useCartStore } from "../store/cartStore";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  sizes?: { size: string; stock: number }[];
}

export default function AddToCartButton({ product }: { product: ProductProps }) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Por favor selecciona un talle");
      return;
    }
    addItem({ ...product, quantity: 1, size: selectedSize || "ÚNICO" });
  };

  return (
    <div className="flex flex-col gap-4">
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex gap-2">
          {product.sizes.filter(s => s.stock > 0).map((s) => (
            <button
              key={s.size}
              onClick={(e) => {
                e.preventDefault();
                setSelectedSize(s.size);
              }}
              className={`px-4 py-2 border text-xs font-bold transition-all ${selectedSize === s.size
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white border-white/20 hover:border-white"
                }`}
            >
              {s.size}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={handleAddToCart}
        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-transparent hover:text-white border border-white transition-all"
      >
        {selectedSize || !product.sizes?.length ? "Añadir al carrito" : "Selecciona un talle"}
      </button>
    </div>
  );
}