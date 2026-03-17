"use client";

import { useCartStore } from "../store/cartStore";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
}

export default function AddToCartButton({ product }: { product: ProductProps }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
  };

  return (
    <button
      onClick={handleAddToCart}
      // Clases adaptadas para la vista de producto
      className="w-full md:w-80 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-transparent hover:text-white border border-white transition-all"
    >
      Añadir al carrito
    </button>
  );
}