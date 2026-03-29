import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definimos una interfaz limpia para el carrito
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
<<<<<<< HEAD
  size: string;
=======
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
}

interface CartStore {
  items: CartItem[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, action: 'increase' | 'decrease') => void;
  clearCart: () => void;
  getTotalItems: () => number; // Agregamos esto para el Navbar
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
<<<<<<< HEAD

=======
      
>>>>>>> 78a04bec80c4e282bb1a7fd31948a6f5ef1db3a2
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (id) => set({
        items: get().items.filter((i) => i.id !== id)
      }),

      updateQuantity: (id, action) => {
        set({
          items: get().items.map((i) => {
            if (i.id === id) {
              const newQty = action === 'increase' ? i.quantity + 1 : i.quantity - 1;
              return { ...i, quantity: Math.max(1, newQty) };
            }
            return i;
          }),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'grief-cart-storage', // Mismo nombre para mantener lo guardado
    }
  )
);