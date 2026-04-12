"use server";
import { db } from "@/lib/db"; // Asegurate que la ruta a tu cliente de prisma sea correcta

export async function getHomeProducts() {
    try {
        const products = await db.product.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: { sizes: true }
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}