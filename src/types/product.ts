import { Product as PrismaProduct, ProductSize } from "@prisma/client";

// Esta interfaz garantiza que el producto siempre incluya su array de talles
export interface ProductWithSizes extends PrismaProduct {
  sizes: ProductSize[];
}