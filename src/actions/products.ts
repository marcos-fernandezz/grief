'use server';

import { createClient } from '@supabase/supabase-js';
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.PROJECT_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createProduct(formData: FormData) {
  const images = formData.getAll('images') as File[];
  const imageUrls: string[] = [];
  
  // 1. Validación de talles para evitar que JSON.parse rompa la ejecución
  const rawSizes = formData.get("sizes") as string;
  let sizesData = [];
  
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