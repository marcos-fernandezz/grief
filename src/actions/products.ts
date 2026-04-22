'use server';

import { createClient } from '@supabase/supabase-js';
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createProduct(formData: FormData) {
  const images = formData.getAll('images') as File[];
  const imageUrls: string[] = [];

  // 1. Validación de talles para evitar que JSON.parse rompa la ejecución
  const rawSizes = formData.get("sizes") as string;
  let sizesData: any[] = [];

  try {
    sizesData = rawSizes ? JSON.parse(rawSizes) : [];
  } catch (e) {
    return { success: false, error: "El formato de talles es inválido." };
  }

  try {
    // 2. Proceso de subida a Supabase
    for (const image of images) {
      if (image.size === 0) continue; // Saltamos archivos vacíos

      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, buffer, {
          contentType: image.type,
          upsert: false
        });

      if (error) throw new Error(`Error en storage: ${error.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrl);
    }

    // 3. Creación Atómica en la DB
    // Prisma asegura que si la creación de talles falla, el producto no se cree
    await db.product.create({
      data: {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        category: formData.get("category") as string,
        images: imageUrls,
        sizes: {
          create: sizesData.map((s: { size: string; stock: number }) => ({
            size: s.size,
            stock: Number(s.stock)
          }))
        }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/tienda"); // También refrescamos la tienda

    return { success: true };

  } catch (error: any) {
    console.error("🔥 Error crítico:", error);
    return { success: false, error: error.message || "Fallo en la carga del producto" };
  }
}

export async function deleteProduct(id: string) {
  try {
    // 1. Buscamos el producto para obtener las URLs de las imágenes
    const product = await db.product.findUnique({
      where: { id },
      select: { images: true }
    });

    if (!product) return { success: false, error: "Producto no encontrado" };

    // 2. Limpieza de Storage (Opcional pero recomendado)
    // Extraemos el nombre del archivo de la URL pública de Supabase
    for (const url of product.images) {
      const fileName = url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('product-images')
          .remove([fileName]);
      }
    }

    // 3. Borrado en la DB
    // Primero borramos las tallas asociadas (ProductSize)
    await db.productSize.deleteMany({
      where: { productId: id }
    });

    // Luego borramos el producto
    await db.product.delete({
      where: { id }
    });

    // 4. Revalidamos rutas para que los cambios se vean al toque
    revalidatePath("/admin/products");
    revalidatePath("/"); // Tu tienda real con el Hero
    revalidatePath("/tienda");

    return { success: true };

  } catch (error: any) {
    console.error("🔥 Error al borrar producto:", error);
    return { success: false, error: error.message || "No se pudo eliminar el producto" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    // Usamos una transacción con un timeout extendido para evitar el P2028
    await db.$transaction(async (tx: any) => { // 🟢 FIX: tx explícito como any
      // 1. Actualización de datos básicos
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          price: data.price,
          description: data.description,
          category: data.category,
        }
      });

      // 2. Borrado y recreación de talles (Sincronización total)
      await tx.productSize.deleteMany({
        where: { productId: id }
      });

      if (data.sizes.length > 0) {
        await tx.productSize.createMany({
          data: data.sizes.map((s: any) => ({
            productId: id,
            size: s.size,
            stock: s.stock
          }))
        });
      }
    }, {
      maxWait: 5000, // Tiempo máximo de espera para obtener conexión
      timeout: 10000 // Tiempo máximo que puede durar la transacción
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("🔥 Error en Prisma:", error);
    return { success: false, error: "Error de conexión o datos inválidos" };
  }
}