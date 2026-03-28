'use server';

import { db } from "../lib/db";
import { payment } from "../lib/mercadopago";
import { CartItem } from "../store/cartStore";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

// Definimos la respuesta para que TypeScript no se queje
type CheckoutResponse =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function processOrder(
  cartItems: CartItem[],
  customerData: any,
  paymentFormData: any
): Promise<CheckoutResponse> {
  try {
    return await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Validar Stock
      let total = 0;
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
          include: { sizes: true }
        });
        const sizeInfo = product?.sizes.find(s => s.size === item.size);
        if (!product || !sizeInfo || sizeInfo.stock < item.quantity) {
          throw new Error(`Sin stock: ${item.name} (Talle ${item.size})`);
        }
        total += Number(product.price) * item.quantity;
      }
      const session = await getServerSession();
      if (!session || !session.user) {
        throw new Error("Debes iniciar sesión para finalizar la compra.");
      }
      // 2. Crear Orden PENDING
      const order = await tx.order.create({
        data: {
          total,
          status: "PENDING",
          customerEmail: customerData.email,
          userId: session.user.id,
          items: {
            create: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 3. PROCESAR PAGO (Aquí se usa la lib de Mercado Pago)
      const mpResponse = await payment.create({
        body: {
          transaction_amount: total,
          token: paymentFormData.token,
          installments: paymentFormData.installments,
          payment_method_id: paymentFormData.payment_method_id,
          payer: { email: customerData.email }
        }
      });

      if (mpResponse.status === "approved") {
        // 4. Si es exitoso, bajamos stock y marcamos como PAID
        for (const item of cartItems) {
          await tx.productSize.update({
            where: {
              productId_size: {
                productId: item.id,
                size: item.size
              }
            },
            data: { stock: { decrement: item.quantity } }
          });
        }
        await tx.order.update({ where: { id: order.id }, data: { status: "PAID" } });
        return {
          success: true as const, // 🟢 Esto satisface el tipo literal 'true'
          orderId: order.id
        };
      } else {
        throw new Error("El pago fue rechazado por la entidad bancaria.");
      }
    });
  } catch (error: any) {
    return { success: false, error: error.message || "Fallo en el servidor" };
  }
}